/* Puente entre la capa v2 y la app (v53+).
 * Usa el API estable que el bundle expone en window.__ferrum con nombres
 * fijos. Ya no depende de los hashes de assets ni de los alias minificados
 * del build, así que sobrevive a futuras compilaciones. */

function F() {
  const f = window.__ferrum;
  if (!f) throw new Error('Ferrum: API no disponible (window.__ferrum)');
  return f;
}

// Los instaladores social/nube leen, escriben y definen propiedades sobre
// la misma instancia. Un proxy con solo get perdía las escrituras de hooks.
export const db = F().db;

export const renderTrainHome = (...args) => F().renderTrainHome(...args);
export const go = (...args) => F().go(...args);
export const toast = (...args) => F().toast(...args);
export const confirmDlg = (...args) => F().confirmDlg(...args);
export const esc = (...args) => F().esc(...args);
export const getActive = (...args) => F().getActive(...args);
export const setActive = (...args) => F().setActive(...args);
export const workoutVolume = (...args) => F().workoutVolume(...args);
export const workoutSets = (...args) => F().workoutSets(...args);
export const formatDuration = (...args) => F().formatDuration(...args);
export const refreshRoute = () => window.dispatchEvent(new Event('hashchange'));
