# Revisión integral de Ferrum · 3 de octubre de 2026

Base local: commit `00a07a1`, rama `main`, CACHE original `ferrum-v53`.
Resultado: correcciones en la capa legible, CACHE `ferrum-v54`, pruebas aisladas aprobadas. No se ha modificado `assets/` ni Worker, D1 o R2. La revisión no certifica todas las pantallas en producción: hay limitaciones de red y navegador descritas abajo.

## Integración y ficheros revisados

Se leyeron los 14 JavaScript y los dos CSS de `ui/`, `index.html`, `sw.js`, la configuración pública y los chunks relacionados con las rutas. El enlazado de 29 módulos locales de UI y assets valida existencia de imports y compatibilidad de exports estáticos. Se retiró el único import relativo roto de UI: un antiguo chunk de entrenamiento en `home-v2.js`.

`window.__ferrum` expone exactamente las entradas consumidas por `platform-v2.js`: `db`, `go`, `toast`, `confirmDlg`, `esc`, `getActive`, `setActive`, `workoutVolume`, `workoutSets`. `formatDuration` y `refreshRoute` se implementan en la capa legible. Los métodos de DB utilizados (`all`, `get`, `put`, `bulkPut`, `del`, `clear`, `workoutsDesc`) existen en el bundle. La UI ya no importa ningún fichero de assets: mantiene nombres estables.

| Fichero de UI | Revisión y resultado |
| --- | --- |
| platform-v2.js | El proxy ignoraba escrituras de métodos y marcadores propios. Corregido: los hooks se instalan en la DB real usada por el bundle; los marcadores locales se leen. |
| app-v2.js | Coordinación de rutas, onboarding, badge y observador. Evitada invalidación de tickets/fotos de Inicio cuando el observador ya ha iniciado el feed. |
| home-v2.js | Rutinas, historial, fotos y eliminación. Sustituido import inexistente por `refreshRoute`; captura de fallos y bloqueo de doble clic al borrar. |
| social-v2.js | Identidad, autorización, solicitudes, cola, feed y fotos. Con el proxy corregido las escrituras del bundle alcanzan la cola. La selección no acepta solicitudes entrantes automáticamente. |
| social-store-v2.js | Transacciones separadas de credenciales/cola; eliminación y aplazamiento condicionados por revisión. Sin cambios. |
| friends-v2.js | Alta, selección, solicitudes individuales, búsqueda, feed, invitación y perfil. Valida el código recibido antes de construir el enlace; informa de uso único y caducidad cuando la API la entrega. Actualizado texto de recuperación. |
| invite-v2.js | Formato, conservación durante el PIN, comprobación anónima y bloqueo con datos personales. Una invitación no desbloquea una cuenta existente ni genera amistad al abrirla. Sin cambios. |
| feed-v2.js | Escape de contenido, fotos, detalles y métricas. Corregidas fecha inválida que lanzaba RangeError, métricas no finitas, series ausentes y valoraciones interpoladas sin validación numérica. |
| cloud-v2.js | AES-GCM con IV aleatorio, blobs cifrados, prueba de recuperación, revisiones, reintentos, conflictos y restauraciones. Corregida clasificación de fallo de `/capabilities`: ya no afirma que falta actualizar el servidor si falla la red. |
| data-status-v2.js | Estado en Yo, código, historial y conflictos. Evitado cancelar la suscripción al llamar otra vez con una tarjeta ya montada. |
| account-security-v2.js | Dispositivos, revocación, renombrado, rotación y reconexión. Etiqueta alternativa para dispositivos sin nombre. |
| account-recovery-v2.js | Entrada desde PIN, formulario, errores y recuperación en móvil vacío. Sin cambios. |
| motion-v2.js | Limpieza de animaciones, pulsaciones y observadores. Sin cambios; queda pendiente comprobación visual/táctil real. |
| ferrum-ui-v1.js y ambos CSS | Presentación, observadores, etiquetas, ocultación del onboarding, formularios y estilos. Sin cambios. |

## Verificación ejecutada

Ejecutar desde la raíz:

```sh
node --experimental-vm-modules ferrum/tests/integration-v54.cjs
git diff --check
```

La prueba no usa paquetes adicionales. Enlaza los módulos reales en VM, desactiva el arranque del bundle únicamente en memoria y simula DOM, API y almacenamiento. No modifica el build en disco ni llama al backend real. Comprueba:

- Las 29 dependencias estáticas y los exports del puente.
- Plantillas de `/train`, `/routines`, `/friends`, `/yo`, `/exercises`, `/stats` (global, ejercicio y sensaciones), `/measures` y `/more`, con datos de muestra y sin los textos `undefined` o `Algo falló`. `/train/active` se invoca sin sesión y redirige; no se certifica su pantalla activa completa.
- Lectura de marcadores del proxy y transmisión de sus escrituras a la DB del bundle.
- Feed con fechas inválidas, series ausentes y valoraciones con HTML; no lanza ni interpola ese HTML.
- Onboarding con selección de dos personas, una solicitud entrante: envía solo la solicitud nueva y requiere aceptación explícita de la entrante. Rechazo de preview caducado (HTTP 410 simulado).
- Una escritura de sesión desde la DB del bundle genera trabajo en la cola social.
- Una escritura de rutina desde esa DB marca pendiente la copia privada.
- Un fallo de red consultando capacidades produce estado offline; una cuenta con recuperación configurada y sin clave local exige el código.

Las plantillas en DOM mínimo no prueban navegación visual, eventos de todos los controles, IndexedDB real, carga/descarga de fotos, service worker, cifrado completo de una copia ni recuperación entre dos móviles. No se afirma que todas las subpantallas funcionen en producción.

Se intentó Playwright con el Chromium instalado: el proceso no arranca por una restricción de sockets (`Operation not permitted`, salida SIGTRAP). Las descargas de producción con curl fallaron al conectar con el proxy de salida; la consulta web también falló. Por ello **v53 en vivo y la igualdad del bundle local con el desplegado no pudieron verificarse**. El CACHE original v53 sí se verificó en el checkout.

## Pendiente que requiere TypeScript privado

Responsable: mantenedor del repositorio TypeScript privado. No se han editado los chunks. No hay fuentes ni sourcemaps que permitan dar un nombre de fichero TS con certeza; se proporcionan los ficheros compilados y las funciones exactas para localizarlo.

1. **Material de autenticación incrustado.** `assets/index-CaX35N1u.js`: constante minificada `C` (hash del PIN inicial), constante `O` (prefijo fijo usado en su hash), funciones `V`, `ne`, `Se`, `et`, y gate `_e`. El PIN tiene cuatro cifras y el verificador está publicado en el cliente; no proporciona un secreto resistente a enumeración offline. `xe`/`H` usan una marca editable de localStorage para mantener el desbloqueo. Migrar el diseño de bloqueo/autenticación y retirar el verificador inicial público desde el fuente. No se reproducen el hash, el PIN ni el prefijo.

2. **Promesas de subpantallas sin esperar.** `assets/routines-D_hnj1j8.js`, export `renderRoutines` (función minificada `E`): rama `id=new` o `id=<rutina>` llama a `_` (editor asíncrono) sin `await` ni devolver su promesa. `assets/exercises-CCB_5JFc.js`, export `renderExercises` (`R`): ramas `id` y `detail` llaman a `z` (editor) y `D` (detalle) del mismo modo. El coordinador del bundle `w` considera terminada la ruta antes del render y su `try/catch` no captura los errores de esas subpantallas. Una lectura fallida deja una promesa rechazada y puede dejar el panel vacío. Reproducido aisladamente inyectando fallo de `db.all('folders')` para `/routines?id=new`, y de `db.get` para `/exercises?detail=<id>`: ambos padres resuelven y aparecen dos rechazos no gestionados. El fuente debe esperar/devolver esas tres promesas; añadir pruebas con fallos de IndexedDB y navegación rápida.

## Seguridad, servidor y validación pendiente

Se escanearon todos los ficheros versionados del repo buscando patrones de tokens, claves privadas, literales de credenciales y hashes hexadecimales largos. El hallazgo confirmado es el hash de PIN anterior; no se encontraron otros valores incrustados que coincidiesen con esos patrones. La URL de `social-config.json` es configuración pública. La búsqueda por patrones no es una garantía de ausencia de secretos ni una auditoría del historial completo de Git. Las credenciales de dispositivo y recuperación del código se generan en ejecución y se guardan en IndexedDB; no son secretos estáticos del repo.

Responsable de validación: Miguel/QA con dos cuentas y dos móviles o perfiles de navegador, y conectividad a producción:

- Comprobar `/train` con sesión activa, rutinas de hoy y otras; empezar libre/de rutina, editar series, finalizar, subir/ver foto, borrar y descartar.
- Comprobar `/routines?id=new` y edición existente, carpetas, duplicación y borrado; `/exercises?id=new`, edición y detalle; estadísticas de músculos/global/ejercicio/sensaciones; medidas/fotos y ajustes/importación/exportación. Confirmar ausencia de errores de ruta y texto `undefined` con datos reales.
- Solicitud A→B, aceptación explícita de B, rechazar/cancelar/eliminar una a una; confirmar que ninguna otra relación se acepta. Verificar que el feed y cada foto solo están autorizados entre amigos aceptados y con sharing activo.
- Abrir invitación válida, usada, caducada y en móvil con datos; dos altas simultáneas con el mismo código. El consumo único, TTL y autorización se aplican en el servidor: la UI no puede certificar su atomicidad. Responsable de esa comprobación: propietario del backend, **sin cambios de Worker/D1/R2 dentro de esta revisión**.
- Listar/renombrar/revocar dispositivos; comprobar el rechazo del dispositivo revocado y los 90 días anunciados por UI. Validar recuperación en móvil vacío y reanudación tras fallo de descarga.
- Guardado cifrado real, fotos, conflicto de dos móviles, pérdida de respuesta, versiones anteriores, rotación y recuperación con el código nuevo; confirmar rechazo del antiguo y acceso a versiones históricas con la nueva clave. Comprobar estado de Yo y actualizaciones de su suscripción en navegador real.
- Verificar publicación de CACHE v54 y renovación del service worker tras el push. La verificación de producción permanece pendiente mientras no haya red en este entorno.

## Restricciones de entrega

El `.git` del workspace está montado en solo lectura: `git add` y `git commit` fallan al crear `index.lock`. Se prepara el commit en español en una copia temporal escribible, `/tmp/ferrum-v54-publish`, en rama `main`, con origen remoto `miguelfrd/arca`. Los ficheros modificados permanecen también en el workspace original. La publicación requiere que el push pueda alcanzar GitHub; este informe no da por hecho el éxito del push ni del despliegue.
