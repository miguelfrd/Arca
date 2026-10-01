import{d as v,s as y,e as p,g as b,l as T,i as L,t as I,c as P,b as H}from"./index-bOvUM1Ia.js";import{I as ue}from"./index-bOvUM1Ia.js";import{d as B,w as M,b as C,c as E,f}from"./stats-LK8w3XMM.js";import{D as N,u as A,S as W}from"./types-E-ayykTU.js";const _=[25,20,15,10,5,2.5,1.25];function O(t,e=20,o=_){const r=Math.max(0,(t-e)/2),l=[...o].sort((a,c)=>c-a),d=[];let i=r;for(const a of l){if(a<=0)continue;const c=Math.floor(i/a+1e-9);c>0&&(d.push({kg:a,count:c}),i=Math.round((i-c*a)*1e3)/1e3)}const n=d.reduce((a,c)=>a+c.kg*c.count,0),s=Math.round((e+n*2)*100)/100;return{perSideKg:Math.round(r*100)/100,platesPerSide:d,barKg:e,achievedKg:s,exact:Math.abs(s-t)<.001}}let h=new Map,g;async function S(){const t=await v.all("exercises");h=new Map(t.map(e=>[e.id,e])),g=await P()}function R(t){return h.get(t)?.nameEs??t.replace(/^desconocido:/,"")}async function z(t){await S();const e=T(),o=await v.all("routines"),r=await v.all("folders"),l=new Map(r.map(a=>[a.id,a.name])),d=await v.workoutsDesc(8),i=new Date().getDay(),n=o.filter(a=>a.dayOfWeek===i);let s="";if(e&&(s+=`<div class="card" style="border-color:var(--accent)">
      <h3>Sesión en curso</h3>
      <div class="muted small">${p(e.title)} · ${e.exercises.length} ejercicios</div>
      <div class="row" style="margin-top:10px">
        <button class="btn" data-act="continue">Continuar</button>
        <button class="btn danger" data-act="discard">Descartar</button>
      </div></div>`),s+='<button class="btn" data-act="free">＋ Sesión libre</button>',n.length){s+=`<div class="sec-title">Hoy (${N[i]})</div>`;for(const a of n)s+=K(a,l.get(a.folderId??"")??"")}if(o.length){s+='<div class="sec-title">Rutinas</div>';for(const a of o.filter(c=>c.dayOfWeek!==i))s+=K(a,l.get(a.folderId??"")??"")}else n.length||(s+='<div class="empty">Sin rutinas todavía.<br>Crea una en la pestaña Rutinas o empieza una sesión libre.</div>');s+='<div class="sec-title">Historial</div>',d.length||(s+='<div class="empty">Aún no hay entrenamientos registrados.</div>');for(const a of d){const c=new Date(a.startTime);s+=`<div class="card" style="padding:9px 12px">
      <div style="display:flex;justify-content:space-between;gap:8px">
        <strong>${p(a.title)}</strong>
        <span class="muted small num">${c.toLocaleDateString("es-ES",{day:"numeric",month:"short"})}</span>
      </div>
      <div class="muted small num">${f(M(a))} kg · ${C(a)} series · ${a.endTime?E(a.endTime-a.startTime):"—"}</div>
    </div>`}t.innerHTML=s,t.querySelectorAll("[data-act]").forEach(a=>a.addEventListener("click",async()=>{const c=a.dataset.act;if(c==="free")G();else if(c==="continue")b("/train/active");else if(c==="discard")await L("¿Descartar la sesión en curso? Se perderá lo registrado.")&&(y(null),z(t));else if(c.startsWith("routine:")){const m=o.find(u=>u.id===c.slice(8));m&&V(m)}}))}function K(t,e){return`<div class="card" style="padding:9px 12px">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <div><strong>${p(t.name)}</strong>
        <div class="muted small">${t.exercises.length} ejercicios${e?" · "+p(e):""}${t.dayOfWeek!==null?" · "+N[t.dayOfWeek]:""}</div>
      </div>
      <button class="btn small" data-act="routine:${t.id}">Empezar</button>
    </div></div>`}function G(){(async()=>await j()&&(await F(),b("/train/active")))()}async function j(){const t=T();if(!t)return!0;const e=t.exercises.reduce((o,r)=>o+r.sets.filter(l=>l.done).length,0);return!e&&!t.exercises.length?!0:L(`Ya tienes «${t.title}» en curso con ${e} series registradas. ¿Descartarla y empezar de nuevo?`)}async function F(){await S();const t={id:A(),title:"Sesión libre",startTime:Date.now(),endTime:null,description:"",exercises:[]};return y(t),t}async function Y(t){return await S(),{id:A(),title:t.name,startTime:Date.now(),endTime:null,description:"",exercises:t.exercises.map(o=>({exerciseId:o.exerciseId,notes:o.notes||"",restSeconds:o.restSeconds??g.defaultRestSeconds,sets:Array.from({length:o.targetSets},(r,l)=>({setIndex:l,setType:"normal",weightKg:o.targetWeightKg,reps:o.targetRepsMax??o.targetRepsMin,distanceKm:null,durationSeconds:o.targetDurationSeconds,rpe:null,supersetId:null,done:!1}))}))}}async function V(t){if(!await j())return;const e=await Y(t);y(e),b("/train/active")}let x=null,$=0;async function re(t){await S();const e=await v.workoutsDesc(60),o=T();if(!o){b("/train");return}const r=new Map;for(const n of e)if(n.id!==o.id)for(const s of n.exercises){if(r.has(s.exerciseId))continue;const a=s.sets.filter(m=>m.done&&m.setType!=="warmup");if(!a.length)continue;const c=a.reduce((m,u)=>(u.weightKg??0)*(u.reps??0)>(m.weightKg??0)*(m.reps??0)?u:m);r.set(s.exerciseId,Q(c))}J(t,o,r);const d=setInterval(()=>{const n=document.getElementById("sess-clock");n&&(n.textContent=E(Date.now()-o.startTime))},1e3),i=new MutationObserver(()=>{document.contains(t)||(clearInterval(d),i.disconnect())});i.observe(document.body,{childList:!0,subtree:!0})}function Q(t){const e=[];return t.weightKg&&e.push(f(t.weightKg)),t.reps&&e.push(`×${t.reps}`),t.durationSeconds&&e.push(`${t.durationSeconds}s`),t.distanceKm&&e.push(`${t.distanceKm}km`),e.join(" ")||"—"}function U(t){switch(t?.type){case"bodyweight_reps":return[{key:"reps",label:"REPS"}];case"weighted_bodyweight":return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}];case"assisted_bodyweight":return[{key:"weightKg",label:"AYUDA"},{key:"reps",label:"REPS"}];case"duration":return[{key:"durationSeconds",label:"SEG"}];case"distance_duration":return[{key:"distanceKm",label:"KM"},{key:"durationSeconds",label:"SEG"}];case"weight_distance":return[{key:"weightKg",label:"KG"},{key:"distanceKm",label:"KM"}];default:return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}]}}function J(t,e,o){const r=new Set,l=()=>{y(e);let d=`
    <div class="card">
      <div style="display:flex;gap:8px;align-items:center">
        <input type="text" id="w-title" value="${p(e.title)}" aria-label="Título de la sesión" style="font-weight:700" />
      </div>
      <div class="row" style="margin-top:8px;align-items:center">
        <div class="muted small">⏱ <span id="sess-clock" class="num">${E(Date.now()-e.startTime)}</span></div>
        <div class="muted small num">Volumen: ${f(M(e))} kg</div>
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
    </div>`;e.exercises.forEach((n,s)=>{const a=h.get(n.exerciseId),c=U(a),m=n.sets.find(u=>u.supersetId)?.supersetId;d+=`<div class="card" data-ex="${s}">
        <div style="display:flex;align-items:center;gap:8px">
          <button class="icon-btn small ss-toggle" data-ei="${s}" title="Seleccionar para superset" style="${r.has(s)?"border-color:var(--accent);color:var(--accent)":""}">⛓</button>
          <div style="flex:1;min-width:0"><strong>${p(R(n.exerciseId))}</strong>
          <div class="muted small">${p(a?.primaryMuscle??"")}${m?' · <span style="color:var(--accent)">superset</span>':""}</div></div>
          <button class="icon-btn small" data-plate="${s}" title="Calculadora de discos">◉</button>
          <button class="icon-btn small" data-note="${s}" title="Nota">✎</button>
          <button class="icon-btn small" data-del-ex="${s}" title="Quitar">✕</button>
        </div>
        ${n.notes?`<div class="small muted" style="margin-top:6px">✎ ${p(n.notes)}</div>`:""}
        <table class="set-table" style="margin-top:8px">
          <thead><tr><th></th><th>SERIE</th><th class="prev">ANT</th>${c.map(u=>`<th>${u.label}</th>`).join("")}${g.rpeEnabled?"<th>RPE</th>":""}<th>✓</th></tr></thead>
          <tbody>
          ${n.sets.map((u,k)=>`
            <tr class="${u.done?"set-done":""}">
              <td><button class="set-type ${u.setType}" data-stype="${s}:${k}" title="Tipo de serie">${W[u.setType]}</button></td>
              <td class="num"><strong>${u.setIndex+1}</strong></td>
              <td class="prev">${p(o.get(n.exerciseId)??"—")}</td>
              ${c.map(D=>`<td><input type="number" inputmode="decimal" data-inp="${s}:${k}:${D.key}" value="${u[D.key]??""}" placeholder="–" ${u.done?"disabled":""}/></td>`).join("")}
              ${g.rpeEnabled?`<td><input type="number" inputmode="numeric" min="1" max="10" data-inp="${s}:${k}:rpe" value="${u.rpe??""}" placeholder="–" style="width:44px"/></td>`:""}
              <td><button class="check-btn ${u.done?"done":""}" data-check="${s}:${k}">✓</button></td>
            </tr>`).join("")}
          </tbody>
        </table>
        <div class="row" style="margin-top:8px">
          <button class="btn secondary small" data-add-set="${s}">＋ Serie</button>
          <button class="btn secondary small" data-rest="${s}">Descanso: ${n.restSeconds}s</button>
        </div>
      </div>`}),t.innerHTML=d,X(t,e,o,l,r);const i=document.getElementById("ss-bar");r.size>0&&(i.style.display="flex",document.getElementById("ss-count").textContent=`${r.size} seleccionados`)};l()}function X(t,e,o,r,l){document.getElementById("w-title")?.addEventListener("change",i=>{e.title=i.target.value.trim()||"Sesión libre",y(e)}),document.getElementById("w-add-ex")?.addEventListener("click",()=>Z(i=>{(async()=>{const n=await H(i);e.exercises.push({exerciseId:i,notes:"",sets:[q(0)],restSeconds:n??g.defaultRestSeconds}),r()})()})),document.getElementById("w-finish")?.addEventListener("click",()=>ae(e)),t.querySelectorAll("[data-inp]").forEach(i=>{i.addEventListener("change",()=>{const[n,s,a]=i.dataset.inp.split(":"),c=i.value.replace(",",".");e.exercises[+n].sets[+s][a]=c===""?null:Number(c),y(e)})});const d=["warmup","normal","failure","dropset"];t.querySelectorAll("[data-stype]").forEach(i=>{i.addEventListener("click",()=>{const[n,s]=i.dataset.stype.split(":").map(Number),a=e.exercises[n].sets[s];a.setType=d[(d.indexOf(a.setType)+1)%d.length],r()})}),t.querySelectorAll("[data-check]").forEach(i=>{i.addEventListener("click",()=>{const[n,s]=i.dataset.check.split(":").map(Number),a=e.exercises[n],c=a.sets[s];c.done=!c.done,y(e),c.done&&a.restSeconds>0&&se(a.restSeconds),r()})}),t.querySelectorAll("[data-add-set]").forEach(i=>{i.addEventListener("click",()=>{const n=+i.dataset.addSet,s=e.exercises[n],a=s.sets[s.sets.length-1],c=q(s.sets.length);a&&(c.weightKg=a.weightKg,c.reps=a.reps,c.durationSeconds=a.durationSeconds,c.distanceKm=a.distanceKm),s.sets.push(c),r()})}),t.querySelectorAll("[data-del-ex]").forEach(i=>{i.addEventListener("click",async()=>{const n=+i.dataset.delEx;await L("¿Quitar este ejercicio de la sesión?")&&(e.exercises.splice(n,1),r())})}),t.querySelectorAll("[data-note]").forEach(i=>{i.addEventListener("click",()=>{const n=+i.dataset.note,s=e.exercises[n].notes,a=window.prompt("Nota del ejercicio:",s);a!==null&&(e.exercises[n].notes=a,r())})}),t.querySelectorAll("[data-rest]").forEach(i=>{i.addEventListener("click",()=>{const n=+i.dataset.rest,s=window.prompt("Descanso (segundos):",String(e.exercises[n].restSeconds)),a=s!==null?parseInt(s,10):NaN;!Number.isNaN(a)&&a>=0&&(e.exercises[n].restSeconds=a,r())})}),t.querySelectorAll("[data-plate]").forEach(i=>{i.addEventListener("click",()=>ee(+i.dataset.plate))}),t.querySelectorAll(".ss-toggle").forEach(i=>{i.addEventListener("click",()=>{const n=+i.dataset.ei;l.has(n)?l.delete(n):l.add(n),r()})}),document.getElementById("ss-group")?.addEventListener("click",()=>{const i=A();l.forEach(n=>e.exercises[n].sets.forEach(s=>{s.supersetId=i})),l.clear(),I("Superset creado"),r()}),document.getElementById("ss-clear")?.addEventListener("click",()=>{l.forEach(i=>e.exercises[i].sets.forEach(n=>{n.supersetId=null})),l.clear(),r()})}function q(t){return{setIndex:t,setType:"normal",weightKg:null,reps:null,distanceKm:null,durationSeconds:null,rpe:null,supersetId:null,done:!1}}function Z(t){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`<div class="modal">
    <h3>Añadir ejercicio</h3>
    <input type="text" id="pk-q" placeholder="Buscar…" autocomplete="off" />
    <div class="chips" id="pk-muscles"></div>
    <div id="pk-list" style="margin-top:8px"></div>
    <button class="btn secondary" id="pk-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(e);const o=e.querySelector("#pk-q"),r=e.querySelector("#pk-list"),l=e.querySelector("#pk-muscles");let d="";const i=[...new Set([...h.values()].map(s=>s.primaryMuscle))].sort();l.innerHTML=i.map(s=>`<button class="chip" data-m="${p(s)}">${p(s)}</button>`).join(""),l.querySelectorAll("[data-m]").forEach(s=>s.addEventListener("click",()=>{d=d===s.dataset.m?"":s.dataset.m,l.querySelectorAll(".chip").forEach(a=>a.classList.toggle("on",a.dataset.m===d)),n()}));const n=()=>{const s=o.value.trim().toLowerCase(),a=[...h.values()].filter(c=>(!d||c.primaryMuscle===d)&&(!s||c.nameEs.toLowerCase().includes(s))).sort((c,m)=>c.nameEs.localeCompare(m.nameEs,"es")).slice(0,60);r.innerHTML=a.length?a.map(c=>`<button class="ex-item" data-pick="${c.id}">
          <span><span class="nm">${p(c.nameEs)}</span><br><span class="meta">${p(c.primaryMuscle)} · ${p(c.equipment)}</span></span>
          <span class="tag">${p(c.type==="duration"?"Tiempo":c.type==="bodyweight_reps"?"Corporal":"Peso")}</span>
        </button>`).join(""):'<div class="empty">Sin resultados.</div>',r.querySelectorAll("[data-pick]").forEach(c=>c.addEventListener("click",()=>{document.body.removeChild(e),t(c.dataset.pick)}))};o.addEventListener("input",n),e.querySelector("#pk-close")?.addEventListener("click",()=>document.body.removeChild(e)),e.addEventListener("click",s=>{s.target===e&&document.body.removeChild(e)}),n(),setTimeout(()=>o.focus(),50)}function ee(t){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`<div class="modal">
    <h3>Calculadora de discos</h3>
    <div class="row">
      <div><label class="f">Carga objetivo (kg)</label><input type="number" id="pl-target" inputmode="decimal" /></div>
      <div><label class="f">Barra (kg)</label><input type="number" id="pl-bar" value="${g.barKg}" inputmode="decimal" /></div>
    </div>
    <label class="f">Discos disponibles (kg, separados por comas)</label>
    <input type="text" id="pl-avail" value="${g.platesKg.join(", ")}" />
    <div id="pl-out" style="margin-top:10px"></div>
    <button class="btn secondary" id="pl-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(e);const o=e.querySelector("#pl-target"),r=e.querySelector("#pl-bar"),l=e.querySelector("#pl-avail"),d=e.querySelector("#pl-out"),i=()=>{const n=Number(o.value.replace(",","."));if(!n||n<=0){d.innerHTML="";return}const s=l.value.split(",").map(c=>Number(c.trim().replace(",","."))).filter(c=>c>0),a=O(n,Number(r.value.replace(",","."))||20,s.length?s:void 0);d.innerHTML=`<div class="card">
      <div class="small muted">Por lado: <strong class="num">${f(a.perSideKg)} kg</strong></div>
      <div style="margin-top:6px">${a.platesPerSide.map(c=>`<div class="num">• ${c.count} × ${f(c.kg)} kg</div>`).join("")||'<span class="muted">Solo la barra</span>'}</div>
      <div class="small" style="margin-top:6px">Total: <strong class="num">${f(a.achievedKg)} kg</strong>${a.exact?"":' <span class="muted">(aprox.)</span>'}</div>
    </div>`};[o,r,l].forEach(n=>n.addEventListener("input",i)),e.querySelector("#pl-close")?.addEventListener("click",()=>document.body.removeChild(e)),e.addEventListener("click",n=>{n.target===e&&document.body.removeChild(e)}),setTimeout(()=>o.focus(),50)}function te(){if(g.soundEnabled){try{const t=new AudioContext;[0,.25,.5].forEach((e,o)=>{const r=t.createOscillator(),l=t.createGain();r.connect(l),l.connect(t.destination),r.frequency.value=o===2?880:660,r.start(t.currentTime+e),r.stop(t.currentTime+e+.18)}),setTimeout(()=>t.close(),1200)}catch{}try{navigator.vibrate?.(400)}catch{}}}function se(t){w(),$=Date.now()+t*1e3;const e=document.createElement("div");e.className="timer-overlay",e.id="rest-timer",e.innerHTML=`<div class="timer-card">
    <div class="muted small">DESCANSO</div>
    <div class="t num" id="rest-t">--</div>
    <div class="row">
      <button class="btn secondary small" id="rest-plus">+15s</button>
      <button class="btn small" id="rest-done">Listo</button>
    </div></div>`,document.body.appendChild(e);const o=e.querySelector("#rest-t"),r=()=>{const l=Math.max(0,Math.ceil(($-Date.now())/1e3));o.textContent=`${Math.floor(l/60)}:${String(l%60).padStart(2,"0")}`,l<=0&&(te(),w(),I("¡Descanso terminado!"))};x=setInterval(r,250),r(),e.querySelector("#rest-plus")?.addEventListener("click",()=>{$+=15e3,r()}),e.querySelector("#rest-done")?.addEventListener("click",w)}function w(){x&&clearInterval(x),x=null,document.getElementById("rest-timer")?.remove()}async function ae(t){const e=window.prompt("Descripción de la sesión (opcional):",t.description)??t.description;t.description=e,t.endTime=Date.now();const o=await v.workoutsDesc(200),r=B(t,o.filter(n=>n.id!==t.id));await v.put("workouts",t),y(null),await ne(t);const l=M(t),d=C(t),i=document.createElement("div");i.className="modal-overlay",i.innerHTML=`<div class="modal">
    <h3>¡Sesión completada!</h3>
    <div class="kpis">
      <div class="kpi"><div class="kpi-val num">${E(t.endTime-t.startTime)}</div><div class="kpi-lab">Duración</div></div>
      <div class="kpi"><div class="kpi-val num">${f(l)}</div><div class="kpi-lab">Volumen kg</div></div>
      <div class="kpi"><div class="kpi-val num">${d}</div><div class="kpi-lab">Series</div></div>
      <div class="kpi"><div class="kpi-val num">${t.exercises.length}</div><div class="kpi-lab">Ejercicios</div></div>
    </div>
    ${r.length?'<div class="sec-title">Récords personales</div>'+r.map(n=>`<div class="pr"><span class="medal">★</span><span><strong>${p(R(n.exerciseId))}</strong> — ${p(n.kind)}: <span class="num">${p(n.value)}</span></span></div>`).join(""):'<div class="muted small">Sin nuevos récords esta vez. ¡A por la próxima!</div>'}
    <button class="btn" id="fin-ok" style="margin-top:12px">Hecho</button>
  </div>`,document.body.appendChild(i),i.querySelector("#fin-ok")?.addEventListener("click",()=>{document.body.removeChild(i),b("/train")})}async function ne(t){try{const o=(await v.all("programState")).find(l=>l.active);if(!o)return;let r=!1;for(const l of t.exercises){const d=l.sets.filter(s=>s.done&&s.setType!=="warmup"&&s.weightKg&&s.reps);if(d.length<2)continue;const i=d.every(s=>(s.reps??0)>=8),n=o.loads[l.exerciseId]??Math.max(...d.map(s=>s.weightKg??0));i?(o.loads[l.exerciseId]=Math.round((n+2.5)*10)/10,r=!0):l.exerciseId in o.loads||(o.loads[l.exerciseId]=n)}r&&(o.currentDayIndex+=1,await v.put("programState",o),I("Progresión del programa actualizada"))}catch{}}export{ue as ICONS,ae as finishWorkout,Z as openExercisePicker,re as renderActiveWorkout,z as renderTrainHome,F as startFreeWorkout,se as startRestTimer,w as stopRestTimer,Y as workoutFromRoutine};
