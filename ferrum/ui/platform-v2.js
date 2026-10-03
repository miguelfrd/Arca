/* Adapter to the existing v45 application. No database migration. */
import { d as db, g as go, t as toast, c as confirmDlg, e as esc, l as getActive, s as setActive } from '../assets/index-D-amyAZ-.js';
import { w as workoutVolume, a as workoutSets, f as formatDuration } from '../assets/stats-CJKsKY2L.js';
export { db, go, toast, confirmDlg, esc, getActive, setActive, workoutVolume, workoutSets, formatDuration };
export const refreshRoute = () => window.dispatchEvent(new Event('hashchange'));
