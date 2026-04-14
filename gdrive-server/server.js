/**
 * gdrive-server/server.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Lightweight Express proxy that:
 *  1. Handles Google OAuth 2.0 (no payment, no card needed)
 *  2. Accepts multipart file uploads from the CMS
 *  3. Uploads them to Google Drive and returns a public URL
 *  4. Can delete files from Drive when removed in CMS
 *
 * Run:  node server.js
 * Port: 3001 (CMS talks to http://localhost:3001)
 * ─────────────────────────────────────────────────────────────────────────────
 */

const express    = require('express');
const cors       = require('cors');
const multer     = require('multer');
const { google } = require('googleapis');
const fs         = require('fs');
const path       = require('path');
const open       = require('open');
require('dotenv').config();

const app    = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 500 * 1024 * 1024 } }); // 500 MB

// ─── CORS — allow the React CMS dev server ───────────────────────────────────
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'] }));
app.use(express.json());

// ─── OAuth2 client ───────────────────────────────────────────────────────────
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3001/oauth/callback'
);

const TOKEN_PATH = path.join(__dirname, 'tokens.json');

// Load saved tokens on startup
if (fs.existsSync(TOKEN_PATH)) {
  const saved = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oauth2Client.setCredentials(saved);
  console.log('✅ Google Drive: loaded saved tokens');
}

// Auto-refresh tokens
oauth2Client.on('tokens', (tokens) => {
  const existing = fs.existsSync(TOKEN_PATH) ? JSON.parse(fs.readFileSync(TOKEN_PATH)) : {};
  const merged   = { ...existing, ...tokens };
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(merged, null, 2));
  oauth2Client.setCredentials(merged);
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// ─── Helper: ensure CMS folder exists in Drive ───────────────────────────────
const FOLDER_CACHE = {}; // name → id
const ROOT_FOLDER_ID = '1ebqrJ0YPqtSiBIvLND-w6KDNnoivp7VG'; // OPT CMS Drive folder

async function ensureFolder(name, parentId = ROOT_FOLDER_ID) {
  if (FOLDER_CACHE[name]) return FOLDER_CACHE[name];

  const q = [
    `name='${name}'`,
    `mimeType='application/vnd.google-apps.folder'`,
    `trashed=false`,
    parentId ? `'${parentId}' in parents` : null,
  ].filter(Boolean).join(' and ');

  const res = await drive.files.list({ q, fields: 'files(id, name)', pageSize: 1 });

  if (res.data.files.length > 0) {
    FOLDER_CACHE[name] = res.data.files[0].id;
    return res.data.files[0].id;
  }

  // Create it
  const meta = { name, mimeType: 'application/vnd.google-apps.folder' };
  if (parentId) meta.parents = [parentId];
  const created = await drive.files.create({ requestBody: meta, fields: 'id' });
  FOLDER_CACHE[name] = created.data.id;
  return created.data.id;
}

// ─── Helper: make a file publicly readable ───────────────────────────────────
async function makePublic(fileId) {
  await drive.permissions.create({
    fileId,
    requestBody: { role: 'reader', type: 'anyone' },
  });
}

// ─── Helper: convert folder path string to nested Drive folder ID ─────────────
// e.g. "activities/images" → creates /OPT-CMS/activities/images
async function resolveFolderPath(folderPath) {
  const rootId = ROOT_FOLDER_ID;
  const parts  = folderPath.split('/').filter(Boolean);
  let parentId = rootId;
  for (const part of parts) {
    parentId = await ensureFolder(`${part}_${parentId}`, parentId);
  }
  return parentId;
}

// ─── GET /auth/status — check if authenticated ───────────────────────────────
app.get('/auth/status', (req, res) => {
  const creds = oauth2Client.credentials;
  const ok    = !!(creds && (creds.access_token || creds.refresh_token));
  res.json({ authenticated: ok });
});

// ─── GET /auth/login — start OAuth flow ──────────────────────────────────────
app.get('/auth/login', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt:      'consent',
    scope: [
      'https://www.googleapis.com/auth/drive.file', // only files created by this app
    ],
  });
  res.json({ url });
});

// ─── GET /oauth/callback — Google redirects here ─────────────────────────────
app.get('/oauth/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error) return res.send(`<h2>Auth error: ${error}</h2>`);

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    res.send(`
      <html><body style="font-family:sans-serif;text-align:center;padding:60px">
        <h2>✅ Google Drive connected!</h2>
        <p>You can close this tab and return to your CMS.</p>
        <script>setTimeout(()=>window.close(),2000)</script>
      </body></html>
    `);
    console.log('✅ Google Drive: OAuth complete, tokens saved');
  } catch (err) {
    console.error(err);
    res.send(`<h2>Error: ${err.message}</h2>`);
  }
});

// ─── POST /upload — receive file, upload to Drive ────────────────────────────
// Body: multipart/form-data  { file, folder }
// Returns: { url, fileId, name }
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const folderPath = req.body.folder || 'uploads';
    const folderId   = await resolveFolderPath(folderPath);

    // Unique filename
    const ext      = path.extname(req.file.originalname) || '';
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

    // Upload to Drive
    const { Readable } = require('stream');
    const stream = new Readable();
    stream.push(req.file.buffer);
    stream.push(null);

    const driveRes = await drive.files.create({
      requestBody: {
        name:    safeName,
        parents: [folderId],
      },
      media: {
        mimeType: req.file.mimetype,
        body:     stream,
      },
      fields: 'id, name, size',
    });

    const fileId = driveRes.data.id;
    await makePublic(fileId);

    // Direct image/video serving URL
    const url = `https://drive.google.com/uc?export=view&id=${fileId}`;

    console.log(`📤 Uploaded: ${req.file.originalname} → ${url}`);
    res.json({ url, fileId, name: req.file.originalname, size: driveRes.data.size });

  } catch (err) {
    console.error('[Upload Error]', err.message);
    if (err.message?.includes('invalid_grant') || err.message?.includes('Invalid Credentials')) {
      return res.status(401).json({ error: 'Drive not authenticated. Please reconnect.' });
    }
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /file/:fileId — remove from Drive ────────────────────────────────
app.delete('/file/:fileId', async (req, res) => {
  try {
    await drive.files.delete({ fileId: req.params.fileId });
    console.log(`🗑 Deleted: ${req.params.fileId}`);
    res.json({ deleted: true });
  } catch (err) {
    // Ignore "not found" — already deleted
    if (err.code === 404) return res.json({ deleted: true, note: 'already gone' });
    console.error('[Delete Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /health ─────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ ok: true, ts: Date.now() }));

// ─── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 OPT CMS Drive Proxy running at http://localhost:${PORT}`);
  console.log(`   → POST  /upload       upload a file to Google Drive`);
  console.log(`   → DELETE /file/:id    delete a file from Google Drive`);
  console.log(`   → GET   /auth/login   start Google OAuth`);
  console.log(`   → GET   /auth/status  check auth status\n`);
});
