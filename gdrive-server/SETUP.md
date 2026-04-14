# ☁️ OPT CMS — Google Drive Storage Setup Guide

All photos and videos uploaded through the CMS will go straight to your **Google Drive** (15 GB free — no card, no payment ever).

---

## Step 1 — Get Google OAuth Credentials (one-time, free)

1. Go to https://console.cloud.google.com/
2. Create a new project (or use an existing one) — name it e.g. `OPT CMS`
3. In the left menu → **APIs & Services** → **Library**
4. Search for **Google Drive API** → click it → click **Enable**
5. Go to **APIs & Services** → **Credentials**
6. Click **+ Create Credentials** → **OAuth 2.0 Client ID**
7. Application type: **Desktop app** → name it anything → click **Create**
8. Copy the **Client ID** and **Client Secret**

---

## Step 2 — Configure the proxy server

```bash
cd gdrive-server
cp .env.example .env
```

Open `.env` and paste your credentials:

```
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

---

## Step 3 — Install and start the proxy

```bash
cd gdrive-server
npm install
node server.js
```

You should see:
```
🚀 OPT CMS Drive Proxy running at http://localhost:3001
```

**Keep this terminal open** while using the CMS admin.

---

## Step 4 — Connect Google Drive in the CMS

1. Open your CMS admin panel in the browser (http://localhost:3000/admin)
2. Go to any section that uploads photos (e.g. Activities, About)
3. Click **+ Add Content** or the upload area
4. You'll see a **"Connect Google Drive"** button — click it
5. A Google sign-in window opens → sign in with your Google account
6. Grant permission → the window closes automatically
7. You're connected! All uploads now go to Drive.

---

## How it works

```
CMS Admin (React)
      ↓  file selected
gdrive-server (Node.js on localhost:3001)
      ↓  uploads via Google Drive API
Your Google Drive  →  OPT-CMS/activities/images/
      ↓  returns public URL
Firestore  ←  saves URL (not the file itself)
      ↓
Website shows image from Drive URL
```

---

## File organization in your Drive

All CMS uploads are organized automatically:

```
My Drive/
└── OPT-CMS/
    ├── activities/
    │   ├── images/    ← photos from Activities
    │   └── videos/    ← video files from Activities
    └── uploads/       ← images from other CMS sections
```

---

## Running in production

When you deploy the website, also deploy the gdrive-server to any free Node.js host:

- **Railway** (free tier) — https://railway.app
- **Render** (free tier) — https://render.com
- **Fly.io** (free tier) — https://fly.io

Set the environment variables (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) in the host dashboard, and update `REACT_APP_GDRIVE_PROXY` in your React `.env` to point to the deployed URL.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Could not reach the Drive proxy server" | Make sure `node server.js` is running in the `gdrive-server/` folder |
| "Drive not authenticated" | Click "Sign in with Google" in the CMS upload area |
| Upload stuck at 0% | Check the terminal running server.js for error messages |
| Images not showing after upload | Google Drive public URLs can take a few seconds — refresh the page |
