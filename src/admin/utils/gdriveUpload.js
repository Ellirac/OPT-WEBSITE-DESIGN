/**
 * src/admin/utils/gdriveUpload.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Frontend helper that talks to the local gdrive-server proxy.
 * Replaces Firebase Storage — all files go to Google Drive for FREE.
 *
 * Usage (drop-in replacement for uploadToStorage):
 *
 *   import { uploadToDrive, deleteFromDrive } from '../utils/gdriveUpload';
 *
 *   // Upload a File object
 *   const { url, fileId } = await uploadToDrive(file, 'activities/images', pct => setProgress(pct));
 *   // Save `url` to Firestore, save `fileId` alongside so you can delete later
 *
 *   // Delete when removing from CMS
 *   await deleteFromDrive(fileId);
 * ─────────────────────────────────────────────────────────────────────────────
 */

const PROXY = process.env.REACT_APP_GDRIVE_PROXY
  || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://opt-cms-gdrive-proxy.onrender.com');

// ─── uploadToDrive ────────────────────────────────────────────────────────────
/**
 * Upload a File to Google Drive via the local proxy server.
 *
 * @param {File}     file        - Raw File object from <input type="file">
 * @param {string}   folder      - Logical folder path, e.g. 'activities/images'
 * @param {Function} onProgress  - Optional (0–100) progress callback
 * @returns {Promise<{ url: string, fileId: string, name: string }>}
 */
export async function uploadToDrive(file, folder = 'uploads', onProgress = null) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file',   file);
    formData.append('folder', folder);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (onProgress && e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.error) return reject(new Error(data.error));
          resolve(data); // { url, fileId, name, size }
        } catch {
          reject(new Error('Invalid response from upload server'));
        }
      } else if (xhr.status === 401) {
        reject(new Error('DRIVE_AUTH_REQUIRED'));
      } else {
        reject(new Error(`Upload failed (HTTP ${xhr.status})`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error — is the Drive proxy running?')));
    xhr.open('POST', `${PROXY}/upload`);
    xhr.send(formData);
  });
}

// ─── deleteFromDrive ──────────────────────────────────────────────────────────
/**
 * Delete a file from Google Drive by its fileId.
 * Always safe to call — ignores "not found" errors.
 *
 * @param {string} fileId - The Drive file ID returned from uploadToDrive
 */
export async function deleteFromDrive(fileId) {
  if (!fileId) return;
  try {
    await fetch(`${PROXY}/file/${fileId}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('[Drive] Delete failed (non-fatal):', err.message);
  }
}

// ─── checkDriveAuth ───────────────────────────────────────────────────────────
/**
 * Returns true if the proxy server is running AND Drive is authenticated.
 */
export async function checkDriveAuth() {
  try {
    const res  = await fetch(`${PROXY}/auth/status`, { signal: AbortSignal.timeout(2000) });
    const data = await res.json();
    return data.authenticated === true;
  } catch {
    return false;
  }
}

// ─── openDriveAuthWindow ──────────────────────────────────────────────────────
/**
 * Ask the proxy for the Google OAuth URL, then open it in a new tab.
 * The user signs in, the proxy saves the token, and they return to the CMS.
 */
export async function openDriveAuthWindow() {
  try {
    const res  = await fetch(`${PROXY}/auth/login`);
    const data = await res.json();
    window.open(data.url, '_blank', 'width=500,height=600');
  } catch (err) {
    alert('Could not reach the Drive proxy server.\nMake sure it is running:\n  cd gdrive-server && node server.js');
  }
}

// ─── getDriveImageUrl ─────────────────────────────────────────────────────────
/**
 * Convert a Drive file ID to a direct-serve image URL.
 * Useful for thumbnails / <img src={...}>.
 */
export function getDriveImageUrl(fileId) {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

// ─── getDriveVideoEmbedUrl ────────────────────────────────────────────────────
/**
 * Convert a Drive file ID to an embeddable video iframe URL.
 */
export function getDriveVideoEmbedUrl(fileId) {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}