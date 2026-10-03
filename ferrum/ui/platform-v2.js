/* Puente entre la capa v2 y la app (v53+).
 * Usa el API estable que el bundle expone en window.__ferrum con nombres
 * fijos. Ya no depende de los hashes de assets ni de los alias minificados
 * del build, así que sobrevive a futuras compilaciones. */

function F() {
  const f = window.__ferrum;
  if (!f) throw new Error('Ferrum: API no disponible (window.__ferrum)');
  return f;
}

// db es un objeto con métodos: el proxy reenvía propiedades y enlaza
// los métodos a la instancia real para no perder el `this`.
export const db = new Proxy(
  {},
  {
    get(_t, prop) {
      const v = F().db[prop];
      return typeof v === 'function' ? v.bind(F().db) : v;
    },
  },
);

export const go = (...args) => F().go(...args);
export const toast = (...args) => F().toast(...args);
export const confirmDlg = (...args) => F().confirmDlg(...args);
export const esc = (...args) => F().esc(...args);
export const getActive = (...args) => F().getActive(...args);
export const setActive = (...args) => F().setActive(...args);
export const workoutVolume = (...args) => F().workoutVolume(...args);
export const workoutSets = (...args) => F().workoutSets(...args);
export const formatDuration = (totalSeconds) => {
  const s = Math.max(0, Math.floor(totalSeconds || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`;
};
export const refreshRoute = () => window.dispatchEvent(new Event('hashchange'));
