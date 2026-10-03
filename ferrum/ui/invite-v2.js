import { socialStore } from './social-store-v2.js';
import { previewInvitation, api } from './social-v2.js';

const STASH_KEY = 'ferrum-pending-invite';
export const validInvite = value => /^[a-f0-9]{64}$/.test(value || '');
export function stashPendingInvite(invite) {
  try { if (validInvite(invite)) sessionStorage.setItem(STASH_KEY, invite); } catch {}
}
export function takePendingInvite() {
  try { const value = sessionStorage.getItem(STASH_KEY); return validInvite(value) ? value : null; }
  catch { return null; }
}
export function clearPendingInvite() {
  try { sessionStorage.removeItem(STASH_KEY); sessionStorage.removeItem('ferrum-verified-invite'); } catch {}
}

// Invitations open enrollment on an empty phone; they never unlock somebody else's data.
export async function hasPersonalData() {
  if (localStorage.getItem('mg-pin-hash') || localStorage.getItem('arca-unlocked') ||
      localStorage.getItem('mg-active-workout')) return true;
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ferrum-db');
    request.onerror = () => reject(request.error);
    request.onsuccess = async () => {
      const db = request.result;
      try {
        const stores = [...db.objectStoreNames];
        const results = await Promise.all(stores.map(name => new Promise((done, fail) => {
          const tx = db.transaction(name, 'readonly');
          const read = tx.objectStore(name).getAll();
          tx.oncomplete = () => done(name === 'exercises' ? read.result.some(row => row.isCustom) :
            name === 'kv' ? read.result.some(row => !/^flag:seeded-v\d+$|^exercises-json-version$/.test(row.key)) : read.result.length > 0);
          tx.onerror = () => fail(tx.error); tx.onabort = () => fail(tx.error);
        })));
        resolve(results.some(Boolean));
      } catch (error) { reject(error); } finally { db.close(); }
    };
  });
}

export async function invitationAllowsEntry() {
  const [path, query] = (location.hash || '').slice(1).split('?');
  const invite = path === '/friends' ? new URLSearchParams(query).get('invite') : null;
  if (validInvite(invite)) stashPendingInvite(invite);
  try {
    const identity = await socialStore.get('identity');
    // Only accounts enrolled through a verified invitation use account entry.
    // An explicitly configured personal PIN always takes precedence.
    if (identity?.registered && identity.entryMode === 'invited' && !localStorage.getItem('mg-pin-hash')) return !await socialStore.get('cloud-restore-pending');
    if (!identity?.registered && identity?.entryMode === 'invited' && identity.enrollmentInvite === invite) {
      // Recover enrollment if the Worker committed it but its HTTP response was lost.
      try {
        const state = await api('/state');
        await socialStore.setAll({ identity: { ...identity, registered: true }, state,
          onboarding: { step: 'people', selected: [], removeAutomaticRequests: true } });
        return true;
      } catch {}
    }
    if (identity?.registered || await socialStore.get('state') || !validInvite(invite) || await hasPersonalData()) return false;
    await previewInvitation(invite); // Invalid, expired and offline invitations fail closed.
    sessionStorage.setItem('ferrum-verified-invite', invite);
    return true;
  } catch { return false; }
}
