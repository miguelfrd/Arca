import{d as y,s as g,e as p,g as b,l as L,i as I,c as R,t as M,b as B,p as T}from"./index-DPm309OK.js";import{I as pe}from"./index-DPm309OK.js";import{d as W,w as A,b as N,c as S,f}from"./stats-Btw1cy27.js";import{D as j,u as D,S as _}from"./types-E-ayykTU.js";const O=[25,20,15,10,5,2.5,1.25];function z(t,e=20,o=O){const r=Math.max(0,(t-e)/2),l=[...o].sort((s,c)=>c-s),d=[];let i=r;for(const s of l){if(s<=0)continue;const c=Math.floor(i/s+1e-9);c>0&&(d.push({kg:s,count:c}),i=Math.round((i-c*s)*1e3)/1e3)}const a=d.reduce((s,c)=>s+c.kg*c.count,0),n=Math.round((e+a*2)*100)/100;return{perSideKg:Math.round(r*100)/100,platesPerSide:d,barKg:e,achievedKg:n,exact:Math.abs(n-t)<.001}}let h=new Map,v;async function k(){const t=await y.all("exercises");h=new Map(t.map(e=>[e.id,e])),v=await R()}function P(t){return h.get(t)?.nameEs??t.replace(/^desconocido:/,"")}async function G(t){await k();const e=L(),o=await y.all("routines"),r=await y.all("folders"),l=new Map(r.map(s=>[s.id,s.name])),d=await y.workoutsDesc(8),i=new Date().getDay(),a=o.filter(s=>s.dayOfWeek===i);let n="";if(e&&(n+=`<div class="card" style="border-color:var(--accent)">
      <h3>Sesión en curso</h3>
      <div class="muted small">${p(e.title)} · ${e.exercises.length} ejercicios</div>
      <div class="row" style="margin-top:10px">
        <button class="btn" data-act="continue">Continuar</button>
        <button class="btn danger" data-act="discard">Descartar</button>
      </div></div>`),n+='<button class="btn" data-act="free">＋ Sesión libre</button>',a.length){n+=`<div class="sec-title">Hoy (${j[i]})</div>`;for(const s of a)n+=q(s,l.get(s.folderId??"")??"")}if(o.length){n+='<div class="sec-title">Rutinas</div>';for(const s of o.filter(c=>c.dayOfWeek!==i))n+=q(s,l.get(s.folderId??"")??"")}else a.length||(n+='<div class="empty">Sin rutinas todavía.<br>Crea una en la pestaña Rutinas o empieza una sesión libre.</div>');n+='<div class="sec-title">Historial</div>',d.length||(n+='<div class="empty">Aún no hay entrenamientos registrados.</div>');for(const s of d){const c=new Date(s.startTime);n+=`<div class="card" style="padding:9px 12px">
      <div style="display:flex;justify-content:space-between;gap:8px">
        <strong>${p(s.title)}</strong>
        <span class="muted small num">${c.toLocaleDateString("es-ES",{day:"numeric",month:"short"})}</span>
      </div>
      <div class="muted small num">${f(A(s))} kg · ${N(s)} series · ${s.endTime?S(s.endTime-s.startTime):"—"}</div>
    </div>`}t.innerHTML=n,t.querySelectorAll("[data-act]").forEach(s=>s.addEventListener("click",async()=>{const c=s.dataset.act;if(c==="free")F();else if(c==="continue")b("/train/active");else if(c==="discard")await I("¿Descartar la sesión en curso? Se perderá lo registrado.")&&(g(null),G(t));else if(c.startsWith("routine:")){const m=o.find(u=>u.id===c.slice(8));m&&Q(m)}}))}function q(t,e){return`<div class="card" style="padding:9px 12px">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <div><strong>${p(t.name)}</strong>
        <div class="muted small">${t.exercises.length} ejercicios${e?" · "+p(e):""}${t.dayOfWeek!==null?" · "+j[t.dayOfWeek]:""}</div>
      </div>
      <button class="btn small" data-act="routine:${t.id}">Empezar</button>
    </div></div>`}function F(){(async()=>await H()&&(await Y(),b("/train/active")))()}async function H(){const t=L();if(!t)return!0;const e=t.exercises.reduce((o,r)=>o+r.sets.filter(l=>l.done).length,0);return!e&&!t.exercises.length?!0:I(`Ya tienes «${t.title}» en curso con ${e} series registradas. ¿Descartarla y empezar de nuevo?`)}async function Y(){await k();const t={id:D(),title:"Sesión libre",startTime:Date.now(),endTime:null,description:"",exercises:[]};return g(t),t}async function V(t){return await k(),{id:D(),title:t.name,startTime:Date.now(),endTime:null,description:"",exercises:t.exercises.map(o=>({exerciseId:o.exerciseId,notes:o.notes||"",restSeconds:o.restSeconds??v.defaultRestSeconds,targetRepsMax:o.targetRepsMax??o.targetRepsMin??null,sets:Array.from({length:o.targetSets},(r,l)=>({setIndex:l,setType:"normal",weightKg:o.targetWeightKg,reps:o.targetRepsMax??o.targetRepsMin,distanceKm:null,durationSeconds:o.targetDurationSeconds,rpe:null,supersetId:null,done:!1}))}))}}async function Q(t){if(!await H())return;const e=await V(t);g(e),b("/train/active")}let E=null,$=0;async function le(t){await k();const e=await y.workoutsDesc(60),o=L();if(!o){b("/train");return}const r=new Map;for(const a of e)if(a.id!==o.id)for(const n of a.exercises??[]){if(r.has(n.exerciseId))continue;const s=(n.sets??[]).filter(m=>m.done&&m.setType!=="warmup");if(!s.length)continue;const c=s.reduce((m,u)=>(u.weightKg??0)*(u.reps??0)>(m.weightKg??0)*(m.reps??0)?u:m);r.set(n.exerciseId,U(c))}X(t,o,r);const d=setInterval(()=>{const a=document.getElementById("sess-clock");a&&(a.textContent=S(Date.now()-o.startTime))},1e3),i=new MutationObserver(()=>{document.contains(t)||(clearInterval(d),i.disconnect())});i.observe(document.body,{childList:!0,subtree:!0})}function U(t){const e=[];return t.weightKg&&e.push(f(t.weightKg)),t.reps&&e.push(`×${t.reps}`),t.durationSeconds&&e.push(`${t.durationSeconds}s`),t.distanceKm&&e.push(`${t.distanceKm}km`),e.join(" ")||"—"}function J(t){switch(t?.type){case"bodyweight_reps":return[{key:"reps",label:"REPS"}];case"weighted_bodyweight":return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}];case"assisted_bodyweight":return[{key:"weightKg",label:"AYUDA"},{key:"reps",label:"REPS"}];case"duration":return[{key:"durationSeconds",label:"SEG"}];case"distance_duration":return[{key:"distanceKm",label:"KM"},{key:"durationSeconds",label:"SEG"}];case"weight_distance":return[{key:"weightKg",label:"KG"},{key:"distanceKm",label:"KM"}];default:return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}]}}function X(t,e,o){const r=new Set,l=()=>{g(e);let d=`
    <div class="card">
      <div style="display:flex;gap:8px;align-items:center">
        <input type="text" id="w-title" value="${p(e.title)}" aria-label="Título de la sesión" style="font-weight:700" />
      </div>
      <div class="row" style="margin-top:8px;align-items:center">
        <div class="muted small">⏱ <span id="sess-clock" class="num">${S(Date.now()-e.startTime)}</span></div>
        <div class="muted small num">Volumen: ${f(A(e))} kg</div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn secondary" id="w-add-ex">＋ Añadir ejercicio</button>
        <button class="btn" id="w-finish">Terminar</button>
      </div>
    </div>
    <div id="ss-bar" style="display:none" class="superset-bar">
      <span id="ss-count"></span>
      <button class="linklike" id="ss-group">Agrupar</button>
      <button class="linklike" id="ss-clear">Limpiar</button>
    </div>`;e.exercises.forEach((a,n)=>{const s=h.get(a.exerciseId),c=J(s),m=a.sets.find(u=>u.supersetId)?.supersetId;d+=`<div class="card" data-ex="${n}">
        <div style="display:flex;align-items:center;gap:8px">
          <button class="icon-btn small ss-toggle" data-ei="${n}" title="Seleccionar para superset" style="${r.has(n)?"border-color:var(--accent);color:var(--accent)":""}">⛓</button>
          <div style="flex:1;min-width:0"><strong>${p(P(a.exerciseId))}</strong>
          <div class="muted small">${p(s?.primaryMuscle??"")}${m?' · <span style="color:var(--accent)">superset</span>':""}</div></div>
          <button class="icon-btn small" data-plate="${n}" title="Calculadora de discos">◉</button>
          <button class="icon-btn small" data-note="${n}" title="Nota">✎</button>
          <button class="icon-btn small" data-del-ex="${n}" title="Quitar">✕</button>
        </div>
        ${a.notes?`<div class="small muted" style="margin-top:6px">✎ ${p(a.notes)}</div>`:""}
        <table class="set-table" style="margin-top:8px">
          <thead><tr><th></th><th>SERIE</th><th class="prev">ANT</th>${c.map(u=>`<th>${u.label}</th>`).join("")}${v.rpeEnabled?"<th>RPE</th>":""}<th>✓</th></tr></thead>
          <tbody>
          ${a.sets.map((u,x)=>`
            <tr class="${u.done?"set-done":""}">
              <td><button class="set-type ${u.setType}" data-stype="${n}:${x}" title="Tipo de serie">${_[u.setType]}</button></td>
              <td class="num"><strong>${u.setIndex+1}</strong></td>
              <td class="prev">${p(o.get(a.exerciseId)??"—")}</td>
              ${c.map(K=>`<td><input type="text" inputmode="decimal" data-inp="${n}:${x}:${K.key}" value="${u[K.key]??""}" placeholder="–" ${u.done?"disabled":""}/></td>`).join("")}
              ${v.rpeEnabled?`<td><input type="text" inputmode="numeric" min="1" max="10" data-inp="${n}:${x}:rpe" value="${u.rpe??""}" placeholder="–" style="width:44px"/></td>`:""}
              <td><button class="check-btn ${u.done?"done":""}" data-check="${n}:${x}">✓</button></td>
            </tr>`).join("")}
          </tbody>
        </table>
        <div class="row" style="margin-top:8px">
          <button class="btn secondary small" data-add-set="${n}">＋ Serie</button>
          <button class="btn secondary small" data-rest="${n}">Descanso: ${a.restSeconds}s</button>
        </div>
      </div>`}),t.innerHTML=d,Z(t,e,o,l,r);const i=document.getElementById("ss-bar");r.size>0&&(i.style.display="flex",document.getElementById("ss-count").textContent=`${r.size} seleccionados`)};l()}function Z(t,e,o,r,l){document.getElementById("w-title")?.addEventListener("change",i=>{e.title=i.target.value.trim()||"Sesión libre",g(e)}),document.getElementById("w-add-ex")?.addEventListener("click",()=>ee(i=>{(async()=>{const a=await B(i);e.exercises.push({exerciseId:i,notes:"",sets:[C(0)],restSeconds:a??v.defaultRestSeconds}),r()})()})),document.getElementById("w-finish")?.addEventListener("click",()=>ne(e)),t.querySelectorAll("[data-inp]").forEach(i=>{i.addEventListener("change",()=>{const[a,n,s]=i.dataset.inp.split(":"),c=i.value;e.exercises[+a].sets[+n][s]=T(c),g(e)})});const d=["warmup","normal","failure","dropset"];t.querySelectorAll("[data-stype]").forEach(i=>{i.addEventListener("click",()=>{const[a,n]=i.dataset.stype.split(":").map(Number),s=e.exercises[a].sets[n];s.setType=d[(d.indexOf(s.setType)+1)%d.length],r()})}),t.querySelectorAll("[data-check]").forEach(i=>{i.addEventListener("click",()=>{const[a,n]=i.dataset.check.split(":").map(Number),s=e.exercises[a],c=s.sets[n];c.done=!c.done,g(e),c.done&&s.restSeconds>0&&ae(s.restSeconds),r()})}),t.querySelectorAll("[data-add-set]").forEach(i=>{i.addEventListener("click",()=>{const a=+i.dataset.addSet,n=e.exercises[a],s=n.sets[n.sets.length-1],c=C(n.sets.length);s&&(c.weightKg=s.weightKg,c.reps=s.reps,c.durationSeconds=s.durationSeconds,c.distanceKm=s.distanceKm),n.sets.push(c),r()})}),t.querySelectorAll("[data-del-ex]").forEach(i=>{i.addEventListener("click",async()=>{const a=+i.dataset.delEx;await I("¿Quitar este ejercicio de la sesión?")&&(e.exercises.splice(a,1),r())})}),t.querySelectorAll("[data-note]").forEach(i=>{i.addEventListener("click",()=>{const a=+i.dataset.note,n=e.exercises[a].notes,s=window.prompt("Nota del ejercicio:",n);s!==null&&(e.exercises[a].notes=s,r())})}),t.querySelectorAll("[data-rest]").forEach(i=>{i.addEventListener("click",()=>{const a=+i.dataset.rest,n=window.prompt("Descanso (segundos):",String(e.exercises[a].restSeconds)),s=n!==null?parseInt(n,10):NaN;!Number.isNaN(s)&&s>=0&&(e.exercises[a].restSeconds=s,r())})}),t.querySelectorAll("[data-plate]").forEach(i=>{i.addEventListener("click",()=>te(+i.dataset.plate))}),t.querySelectorAll(".ss-toggle").forEach(i=>{i.addEventListener("click",()=>{const a=+i.dataset.ei;l.has(a)?l.delete(a):l.add(a),r()})}),document.getElementById("ss-group")?.addEventListener("click",()=>{const i=D();l.forEach(a=>e.exercises[a].sets.forEach(n=>{n.supersetId=i})),l.clear(),M("Superset creado"),r()}),document.getElementById("ss-clear")?.addEventListener("click",()=>{l.forEach(i=>e.exercises[i].sets.forEach(a=>{a.supersetId=null})),l.clear(),r()})}function C(t){return{setIndex:t,setType:"normal",weightKg:null,reps:null,distanceKm:null,durationSeconds:null,rpe:null,supersetId:null,done:!1}}function ee(t){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`<div class="modal">
    <h3>Añadir ejercicio</h3>
    <input type="text" id="pk-q" placeholder="Buscar…" autocomplete="off" />
    <div class="chips" id="pk-muscles"></div>
    <div id="pk-list" style="margin-top:8px"></div>
    <button class="btn secondary" id="pk-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(e);const o=e.querySelector("#pk-q"),r=e.querySelector("#pk-list"),l=e.querySelector("#pk-muscles");let d="";const i=()=>{const n=[...new Set([...h.values()].map(s=>s.primaryMuscle))].sort();l.innerHTML=n.map(s=>`<button class="chip" data-m="${p(s)}">${p(s)}</button>`).join(""),l.querySelectorAll("[data-m]").forEach(s=>s.addEventListener("click",()=>{d=d===s.dataset.m?"":s.dataset.m,l.querySelectorAll(".chip").forEach(c=>c.classList.toggle("on",c.dataset.m===d)),a()}))},a=()=>{const n=o.value.trim().toLowerCase(),s=[...h.values()].filter(c=>(!d||c.primaryMuscle===d)&&(!n||c.nameEs.toLowerCase().includes(n))).sort((c,m)=>c.nameEs.localeCompare(m.nameEs,"es")).slice(0,60);r.innerHTML=s.length?s.map(c=>`<button class="ex-item" data-pick="${c.id}">
          <span><span class="nm">${p(c.nameEs)}</span><br><span class="meta">${p(c.primaryMuscle)} · ${p(c.equipment)}</span></span>
          <span class="tag">${p(c.type==="duration"?"Tiempo":c.type==="bodyweight_reps"?"Corporal":"Peso")}</span>
        </button>`).join(""):'<div class="empty">Sin resultados.</div>',r.querySelectorAll("[data-pick]").forEach(c=>c.addEventListener("click",()=>{document.body.removeChild(e),t(c.dataset.pick)}))};o.addEventListener("input",a),e.querySelector("#pk-close")?.addEventListener("click",()=>document.body.removeChild(e)),e.addEventListener("click",n=>{n.target===e&&document.body.removeChild(e)}),k().then(()=>{i(),a()}),setTimeout(()=>o.focus(),50)}function te(t){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`<div class="modal">
    <h3>Calculadora de discos</h3>
    <div class="row">
      <div><label class="f">Carga objetivo (kg)</label><input type="text" id="pl-target" inputmode="decimal" /></div>
      <div><label class="f">Barra (kg)</label><input type="text" id="pl-bar" value="${v.barKg}" inputmode="decimal" /></div>
    </div>
    <label class="f">Discos disponibles (kg, separados por comas)</label>
    <input type="text" id="pl-avail" value="${v.platesKg.join(", ")}" />
    <div id="pl-out" style="margin-top:10px"></div>
    <button class="btn secondary" id="pl-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(e);const o=e.querySelector("#pl-target"),r=e.querySelector("#pl-bar"),l=e.querySelector("#pl-avail"),d=e.querySelector("#pl-out"),i=()=>{const a=T(o.value);if(!a||a<=0){d.innerHTML="";return}const n=l.value.split(",").map(c=>Number(c.trim().replace(",","."))).filter(c=>c>0),s=z(a,T(r.value)||20,n.length?n:void 0);d.innerHTML=`<div class="card">
      <div class="small muted">Por lado: <strong class="num">${f(s.perSideKg)} kg</strong></div>
      <div style="margin-top:6px">${s.platesPerSide.map(c=>`<div class="num">• ${c.count} × ${f(c.kg)} kg</div>`).join("")||'<span class="muted">Solo la barra</span>'}</div>
      <div class="small" style="margin-top:6px">Total: <strong class="num">${f(s.achievedKg)} kg</strong>${s.exact?"":' <span class="muted">(aprox.)</span>'}</div>
    </div>`};[o,r,l].forEach(a=>a.addEventListener("input",i)),e.querySelector("#pl-close")?.addEventListener("click",()=>document.body.removeChild(e)),e.addEventListener("click",a=>{a.target===e&&document.body.removeChild(e)}),setTimeout(()=>o.focus(),50)}function se(){if(v?.soundEnabled){try{const t=new AudioContext;[0,.25,.5].forEach((e,o)=>{const r=t.createOscillator(),l=t.createGain();r.connect(l),l.connect(t.destination),r.frequency.value=o===2?880:660,r.start(t.currentTime+e),r.stop(t.currentTime+e+.18)}),setTimeout(()=>t.close(),1200)}catch{}try{navigator.vibrate?.(400)}catch{}}}function ae(t){v||R().then(l=>{v=l}),w(),$=Date.now()+t*1e3;const e=document.createElement("div");e.className="timer-overlay",e.id="rest-timer",e.innerHTML=`<div class="timer-card">
    <div class="muted small">DESCANSO</div>
    <div class="t num" id="rest-t">--</div>
    <div class="row">
      <button class="btn secondary small" id="rest-plus">+15s</button>
      <button class="btn small" id="rest-done">Listo</button>
    </div></div>`,document.body.appendChild(e);const o=e.querySelector("#rest-t"),r=()=>{const l=Math.max(0,Math.ceil(($-Date.now())/1e3));o.textContent=`${Math.floor(l/60)}:${String(l%60).padStart(2,"0")}`,l<=0&&(se(),w(),M("¡Descanso terminado!"))};E=setInterval(r,250),r(),e.querySelector("#rest-plus")?.addEventListener("click",()=>{$+=15e3,r()}),e.querySelector("#rest-done")?.addEventListener("click",w)}function w(){E&&clearInterval(E),E=null,document.getElementById("rest-timer")?.remove()}async function ne(t){const e=window.prompt("Descripción de la sesión (opcional):",t.description)??t.description;t.description=e,t.endTime=Date.now();const o=await y.workoutsDesc(200),r=W(t,o.filter(a=>a.id!==t.id));await y.put("workouts",t),g(null),await ie(t);const l=A(t),d=N(t),i=document.createElement("div");i.className="modal-overlay",i.innerHTML=`<div class="modal">
    <h3>¡Sesión completada!</h3>
    <div class="kpis">
      <div class="kpi"><div class="kpi-val num">${S(t.endTime-t.startTime)}</div><div class="kpi-lab">Duración</div></div>
      <div class="kpi"><div class="kpi-val num">${f(l)}</div><div class="kpi-lab">Volumen kg</div></div>
      <div class="kpi"><div class="kpi-val num">${d}</div><div class="kpi-lab">Series</div></div>
      <div class="kpi"><div class="kpi-val num">${t.exercises.length}</div><div class="kpi-lab">Ejercicios</div></div>
    </div>
    ${r.length?'<div class="sec-title">Récords personales</div>'+r.map(a=>`<div class="pr"><span class="medal">★</span><span><strong>${p(P(a.exerciseId))}</strong> — ${p(a.kind)}: <span class="num">${p(a.value)}</span></span></div>`).join(""):'<div class="muted small">Sin nuevos récords esta vez. ¡A por la próxima!</div>'}
    <button class="btn" id="fin-ok" style="margin-top:12px">Hecho</button>
  </div>`,document.body.appendChild(i),i.querySelector("#fin-ok")?.addEventListener("click",()=>{document.body.removeChild(i),b("/train")})}async function ie(t){try{const o=(await y.all("programState")).find(l=>l.active);if(!o)return;let r=!1;for(const l of t.exercises){const d=l.sets.filter(s=>s.done&&s.setType!=="warmup"&&s.weightKg&&s.reps);if(d.length<2)continue;const i=l.targetRepsMax??8,a=d.every(s=>(s.reps??0)>=i),n=o.loads[l.exerciseId]??Math.max(...d.map(s=>s.weightKg??0));a?(o.loads[l.exerciseId]=Math.round((n+2.5)*10)/10,r=!0):l.exerciseId in o.loads||(o.loads[l.exerciseId]=n)}r&&(o.currentDayIndex+=1,await y.put("programState",o),M("Progresión del programa actualizada"))}catch{}}export{pe as ICONS,ne as finishWorkout,ee as openExercisePicker,le as renderActiveWorkout,G as renderTrainHome,Y as startFreeWorkout,ae as startRestTimer,w as stopRestTimer,V as workoutFromRoutine};
