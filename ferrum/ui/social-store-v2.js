/* Social credentials/outbox have their own database; existing backups stay intact. */
let opening;
function database() {
  return opening ||= new Promise((resolve, reject) => {
    const request = indexedDB.open('ferrum-social', 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('meta', { keyPath: 'key' });
      request.result.createObjectStore('outbox', { keyPath: 'localId' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => { opening = null; reject(request.error); };
  });
}
async function transact(name, mode, operation) {
  const connection = await database();
  return new Promise((resolve, reject) => {
    const tx = connection.transaction(name, mode);
    let result;
    const request = operation(tx.objectStore(name));
    if (request) request.onsuccess = () => { result = request.result; };
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('No se pudo guardar.'));
  });
}
export const socialStore = {
  async commitCloud({ version, dirtyRevision, restore = false, markDirty = false }) {
    const connection = await database();
    return new Promise((resolve, reject) => {
      const tx = connection.transaction('meta', 'readwrite'), object = tx.objectStore('meta');
      object.put({ key: 'cloud-version', value: version });
      object.delete('cloud-pending-snapshot');
      if (markDirty) object.put({ key: 'cloud-dirty', value: { revision: crypto.randomUUID(), at: Date.now() } });
      else {
        const read = object.get('cloud-dirty');
        read.onsuccess = () => { if (dirtyRevision && read.result?.value?.revision === dirtyRevision) object.delete('cloud-dirty'); };
      }
      if (restore) { object.delete('cloud-restore-journal'); object.delete('cloud-restore-pending'); }
      tx.oncomplete = resolve;
      tx.onerror = tx.onabort = () => reject(tx.error || Error('No se pudo confirmar la copia.'));
    });
  },
  async setAll(values) {
    const connection = await database();
    return new Promise((resolve, reject) => {
      const tx = connection.transaction('meta', 'readwrite'), object = tx.objectStore('meta');
      for (const [key,value] of Object.entries(values)) object.put({ key, value });
      tx.oncomplete = resolve; tx.onerror = tx.onabort = () => reject(tx.error);
    });
  },
  async get(key) { return (await transact('meta', 'readonly', store => store.get(key)))?.value; },
  set: (key, value) => transact('meta', 'readwrite', store => store.put({ key, value })),
  remove: key => transact('meta', 'readwrite', store => store.delete(key)),
  async removeMatchingRevision(key, revision) {
    const connection = await database();
    return new Promise((resolve, reject) => {
      const tx = connection.transaction('meta', 'readwrite'), object = tx.objectStore('meta');
      const request = object.get(key);
      request.onsuccess = () => { if (request.result?.value?.revision === revision) object.delete(key); };
      tx.oncomplete = resolve; tx.onerror = tx.onabort = () => reject(tx.error);
    });
  },
  putJob: value => transact('outbox', 'readwrite', store => store.put(value)),
  jobs: () => transact('outbox', 'readonly', store => store.getAll()),
  async deferJob(localId, revision, error) {
    const connection = await database();
    return new Promise((resolve, reject) => {
      const tx = connection.transaction('outbox', 'readwrite'), store = tx.objectStore('outbox');
      const request = store.get(localId);
      request.onsuccess = () => {
        if (request.result?.revision === revision) store.put({ ...request.result,
          retryAt: Date.now() + 15 * 60000, error });
      };
      tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error);
    });
  },
  async removeJob(localId, revision) {
    const connection = await database();
    return new Promise((resolve, reject) => {
      const tx = connection.transaction('outbox', 'readwrite'), store = tx.objectStore('outbox');
      const request = store.get(localId);
      request.onsuccess = () => { if (request.result?.revision === revision) store.delete(localId); };
      tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error);
    });
  }
};
