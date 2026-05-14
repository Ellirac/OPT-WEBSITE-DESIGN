/**
 * src/admin/utils/gdriveUpload.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Google Drive uploads via OAuth — any Google account can sign in.
 * No Node.js server needed. Works on Hostinger or any static hosting.
 *
 * HOW IT WORKS:
 *   1. User clicks "Sign in with Google" → Google popup opens
 *   2. They sign in with ANY Google account
 *   3. Files upload directly to the shared company Drive folder
 *   4. Files are visible in Google Drive (the signed-in user can see them there)
 *   5. Files also appear in the CMS (stored in Firestore)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Your shared company Drive folder ─────────────────────────────────────────
const DRIVE_FOLDER_ID = '1ebqrJ0YPqtSiBIvLND-w6KDNnoivp7VG';

// ── OAuth Client ID from your .env file ───────────────────────────────────────
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

// ── Token cache ───────────────────────────────────────────────────────────────
let _token       = null;
let _tokenExpiry = 0;
let _tokenClient = null;
let _gisLoaded   = false;

// ─── Load Google Identity Services script ────────────────────────────────────
function loadGIS() {
  if (_gisLoaded) return Promise.resolve();
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) { _gisLoaded = true; resolve(); return; }
    const script  = document.createElement('script');
    script.src    = 'https://accounts.google.com/gsi/client';
    script.async  = true;
    script.onload = () => { _gisLoaded = true; resolve(); };
    document.head.appendChild(script);
  });
}

// ─── Initialise token client (once) ──────────────────────────────────────────
async function getTokenClient() {
  await loadGIS();
  if (_tokenClient) return _tokenClient;

  if (!CLIENT_ID) {
    throw new Error(
      'REACT_APP_GOOGLE_CLIENT_ID is not set.\n' +
      'Add it to your .env file and rebuild. See SETUP-GUIDE.md.'
    );
  }

  _tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope:     'https://www.googleapis.com/auth/drive.file',
    callback:  () => {}, // replaced per-request
  });

  return _tokenClient;
}

// ─── Open sign-in popup and get access token ──────────────────────────────────
function requestToken(forceConsent = false) {
  return new Promise(async (resolve, reject) => {
    const client = await getTokenClient();

    client.callback = (response) => {
      if (response.error) {
        reject(new Error(response.error_description || response.error));
        return;
      }
      _token       = response.access_token;
      _tokenExpiry = Date.now() + (response.expires_in - 120) * 1000;
      resolve(_token);
    };

    client.requestAccessToken({ prompt: forceConsent ? 'consent' : '' });
  });
}

// ─── Get a valid token, prompting sign-in if needed ───────────────────────────
async function getAccessToken() {
  if (_token && Date.now() < _tokenExpiry) return _token;
  return requestToken();
}

// ─── Make file publicly readable so images show on the website ───────────────
async function makePublic(fileId, token) {
  await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify({ role: 'reader', type: 'anyone' }),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/** Returns true if a user is currently signed in. */
export async function checkDriveAuth() {
  return !!(_token && Date.now() < _tokenExpiry);
}

/** Opens the Google sign-in popup. */
export async function openDriveAuthWindow() {
  await requestToken(true);
}

/**
 * uploadToDrive — upload a File directly to Google Drive.
 * @param {File}     file
 * @param {string}   folder     — accepted for compatibility, not used
 * @param {Function} onProgress — optional (0–100) progress callback
 * @returns {Promise<{ url, fileId, name, size }>}
 */
export async function uploadToDrive(file, folder = 'uploads', onProgress = null) {
  const token    = await getAccessToken();
  const ext      = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '';
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

  const metadata   = JSON.stringify({ name: safeName, parents: [DRIVE_FOLDER_ID] });
  const boundary   = '-------opt_cms_boundary';
  const metaPart   = `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${metadata}`;
  const filePart   = `\r\n--${boundary}\r\nContent-Type: ${file.type}\r\n\r\n`;
  const close      = `\r\n--${boundary}--`;
  const metaBytes  = new TextEncoder().encode(metaPart);
  const fileBytes  = new TextEncoder().encode(filePart);
  const closeBytes = new TextEncoder().encode(close);
  const fileBuffer = await file.arrayBuffer();

  const body = new Uint8Array(
    metaBytes.byteLength + fileBytes.byteLength + fileBuffer.byteLength + closeBytes.byteLength
  );
  let off = 0;
  body.set(metaBytes,                  off); off += metaBytes.byteLength;
  body.set(fileBytes,                  off); off += fileBytes.byteLength;
  body.set(new Uint8Array(fileBuffer), off); off += fileBuffer.byteLength;
  body.set(closeBytes,                 off);

  const fileId = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (onProgress && e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.id) resolve(data.id);
          else reject(new Error(data.error?.message || 'Upload failed — no file ID'));
        } catch { reject(new Error('Invalid response from Drive API')); }
      } else if (xhr.status === 401) {
        _token = null; _tokenExpiry = 0;
        reject(new Error('DRIVE_AUTH_REQUIRED'));
      } else {
        reject(new Error(`Drive upload failed (HTTP ${xhr.status}): ${xhr.responseText}`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
    xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('Content-Type', `multipart/related; boundary="${boundary}"`);
    xhr.send(body);
  });

  await makePublic(fileId, token);
  const url = `https://drive.google.com/uc?export=view&id=${fileId}`;
  console.log(`[Drive] Uploaded: ${file.name} → ${url}`);
  return { url, fileId, name: file.name, size: file.size };
}

/**
 * deleteFromDrive — delete a file by its Drive fileId.
 * Works for files the currently signed-in user uploaded.
 * If uploaded by someone else, fails silently — the Firestore record
 * is still removed so it disappears from the CMS.
 */
export async function deleteFromDrive(fileId) {
  if (!fileId) return;
  try {
    const token = await getAccessToken();
    const res   = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok && res.status !== 404) {
      console.warn(`[Drive] Delete HTTP ${res.status} for ${fileId}`);
    }
  } catch (err) {
    console.warn('[Drive] Delete failed (non-fatal):', err.message);
  }
}

/** Sign out and revoke the token. */
export function signOutDrive() {
  if (_token && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(_token, () => {});
  }
  _token = null; _tokenExpiry = 0;
}

export function getDriveImageUrl(fileId) {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

export function getDriveVideoEmbedUrl(fileId) {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}