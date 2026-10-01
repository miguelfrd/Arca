import{d as f,s as S,e as v,g as w,l as C,c as R,b as _,t as j,a as G,p as q}from"./index-2SzqQeXa.js";import{I as xe}from"./index-2SzqQeXa.js";import{d as V,w as D,a as N,f as M,b as x}from"./stats-B952wIuI.js";import{D as F,u as H,S as Q}from"./types-CEDv8i23.js";const U=[25,20,15,10,5,2.5,1.25];function J(t,e=20,c=U){const o=Math.max(0,(t-e)/2),r=[...c].sort((a,s)=>s-a),d=[];let l=o;for(const a of r){if(a<=0)continue;const s=Math.floor(l/a+1e-9);s>0&&(d.push({kg:a,count:s}),l=Math.round((l-s*a)*1e3)/1e3)}const n=d.reduce((a,s)=>a+s.kg*s.count,0),i=Math.round((e+n*2)*100)/100;return{perSideKg:Math.round(o*100)/100,platesPerSide:d,barKg:e,achievedKg:i,exact:Math.abs(i-t)<.001}}let E=new Map,h;async function L(){const t=await f.all("exercises");E=new Map(t.map(e=>[e.id,e])),h=await _()}function P(t){return E.get(t)?.nameEs??t.replace(/^desconocido:/,"")}async function X(t){await L();const e=C(),c=await f.all("routines"),o=await f.all("folders"),r=new Map(o.map(s=>[s.id,s.name])),d=await f.workoutsDesc(8),l=new Date().getDay(),n=c.filter(s=>s.dayOfWeek===l);let i='<div class="screen-head"><h1>Entrenamiento</h1></div>';if(e&&(i+=`<div class="card" style="border-color:var(--blue)">
      <h3>Sesión en curso</h3>
      <div class="muted small">${v(e.title)} · ${e.exercises.length} ejercicios</div>
      <div class="row" style="margin-top:10px">
        <button class="btn" data-act="continue">Continuar</button>
        <button class="btn danger" data-act="discard">Descartar</button>
      </div></div>`),i+='<button class="btn" data-act="free">＋ Sesión libre</button>',i+='<div id="cal-home"></div>',n.length){i+=`<div class="sec-title">Hoy (${F[l]})</div>`;for(const s of n)i+=z(s,r.get(s.folderId??"")??"")}if(c.length){i+='<div class="sec-title">Rutinas</div>';for(const s of c.filter(u=>u.dayOfWeek!==l))i+=z(s,r.get(s.folderId??"")??"")}else n.length||(i+='<div class="empty">Sin rutinas todavía.<br>Crea una en la pestaña Rutinas o empieza una sesión libre.</div>');i+='<div class="sec-title">Historial</div>',d.length||(i+='<div class="empty">Aún no hay entrenamientos registrados.</div>');for(const s of d){const u=new Date(s.startTime);i+=`<div class="card" style="padding:9px 12px">
      <div style="display:flex;justify-content:space-between;gap:8px">
        <strong>${v(s.title)}</strong>
        <span class="muted small num">${u.toLocaleDateString("es-ES",{day:"numeric",month:"short"})}</span>
      </div>
      <div class="muted small num">${x(D(s))} kg · ${N(s)} series · ${s.endTime?M(s.endTime-s.startTime):"—"}</div>
    </div>`}t.innerHTML=i;const a=t.querySelector("#cal-home");a&&Z(a),t.querySelectorAll("[data-act]").forEach(s=>s.addEventListener("click",async()=>{const u=s.dataset.act;if(u==="free")ee();else if(u==="continue")w("/train/active");else if(u==="discard")await R("¿Descartar la sesión en curso? Se perderá lo registrado.")&&(S(null),X(t));else if(u.startsWith("routine:")){const m=c.find(p=>p.id===u.slice(8));m&&ae(m)}}))}let b=0,k=0,$=null;async function Z(t){const e=new Date;b||(b=e.getFullYear(),k=e.getMonth());const c=await f.all("workouts"),o=new Map;for(const n of c){const i=new Date(n.startTime),a=i.getFullYear()+"-"+i.getMonth()+"-"+i.getDate(),s=o.get(a);s?s.push(n):o.set(a,[n])}const r=n=>b+"-"+k+"-"+n,d=n=>{const i=(n.sets??[]).filter(a=>a.done&&a.setType!=="warmup");return i.length?i.map(a=>{const s=a.weightKg!=null&&a.weightKg>0?x(a.weightKg)+"×":"",u=a.reps??a.durationSeconds??a.distanceKm??"–";return s+u}).join(" · "):"—"},l=()=>{const n=new Date(b,k,1).toLocaleDateString("es-ES",{month:"long",year:"numeric"}),i=(new Date(b,k,1).getDay()+6)%7,a=new Date(b,k+1,0).getDate();let s="";for(let p=0;p<i;p++)s+="<span></span>";let u=0;for(let p=1;p<=a;p++){const g=o.has(r(p));g&&u++,s+=`<button class="mcal-day${g?" has":""}${$===p?" sel":""}" data-day="${p}"${g?"":" disabled"}>${p}</button>`}let m="";if($!=null&&o.has(r($))){const p=[...o.get(r($))].sort((y,I)=>y.startTime-I.startTime);m=`<div class="sec-title">${$+" de "+new Date(b,k,1).toLocaleDateString("es-ES",{month:"long"})}</div>`+p.map(y=>{const I=new Date(y.startTime).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}),Y=(y.exercises??[]).map(B=>`<div class="mcal-ex"><span>${v(P(B.exerciseId))}</span><span class="num muted">${v(d(B))}</span></div>`).join("");return`<div class="card" style="padding:9px 12px;margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;gap:8px">
            <strong>${v(y.title)}</strong><span class="muted small num">${I}</span>
          </div>
          <div class="muted small num" style="margin-bottom:6px">${x(D(y))} kg · ${N(y)} series</div>
          ${Y}</div>`}).join("")}t.innerHTML=`<div class="sec-title">Calendario</div>
      <div class="card" style="padding:10px 12px">
        <div class="mcal-head">
          <button class="linklike" data-cal="prev" aria-label="Mes anterior">‹</button>
          <strong style="text-transform:capitalize">${v(n)}</strong>
          <button class="linklike" data-cal="next" aria-label="Mes siguiente">›</button>
        </div>
        <div class="mcal-grid">
          ${["L","M","X","J","V","S","D"].map(p=>`<span class="mcal-dow">${p}</span>`).join("")}
          ${s}
        </div>
        <div class="muted small" style="margin-top:8px"><span class="num">${u}</span> día${u===1?"":"s"} este mes</div>
      </div>
      ${m}`,t.querySelectorAll("[data-cal]").forEach(p=>p.addEventListener("click",()=>{const g=p.dataset.cal==="prev"?-1:1,y=new Date(b,k+g,1);b=y.getFullYear(),k=y.getMonth(),$=null,l()})),t.querySelectorAll("[data-day]").forEach(p=>p.addEventListener("click",()=>{const g=Number(p.dataset.day);$=$===g?null:g,l()}))};l()}function z(t,e){return`<div class="card" style="padding:9px 12px">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <div><strong>${v(t.name)}</strong>
        <div class="muted small">${t.exercises.length} ejercicios${e?" · "+v(e):""}${t.dayOfWeek!==null?" · "+F[t.dayOfWeek]:""}</div>
      </div>
      <button class="btn small" data-act="routine:${t.id}">Empezar</button>
    </div></div>`}function ee(){(async()=>await O()&&(await te(),w("/train/active")))()}async function O(){const t=C();if(!t)return!0;const e=t.exercises.reduce((c,o)=>c+o.sets.filter(r=>r.done).length,0);return!e&&!t.exercises.length?!0:R(`Ya tienes «${t.title}» en curso con ${e} series registradas. ¿Descartarla y empezar de nuevo?`)}async function te(){await L();const t={id:H(),title:"Sesión libre",startTime:Date.now(),endTime:null,description:"",exercises:[]};return S(t),t}async function se(t){return await L(),{id:H(),title:t.name,startTime:Date.now(),endTime:null,description:"",exercises:t.exercises.map(c=>({exerciseId:c.exerciseId,notes:c.notes||"",restSeconds:c.restSeconds??h.defaultRestSeconds,targetRepsMax:c.targetRepsMax??c.targetRepsMin??null,sets:Array.from({length:c.targetSets},(o,r)=>({setIndex:r,setType:"normal",weightKg:c.targetWeightKg,reps:c.targetRepsMax??c.targetRepsMin,distanceKm:null,durationSeconds:c.targetDurationSeconds,rpe:null,supersetId:null,done:!1}))}))}}async function ae(t){if(!await O())return;const e=await se(t);S(e),w("/train/active")}let T=null,A=0;async function fe(t){await L();const e=await f.workoutsDesc(60),c=C();if(!c){w("/train");return}const o=new Map;for(const n of e)if(n.id!==c.id)for(const i of n.exercises??[]){if(o.has(i.exerciseId))continue;const a=(i.sets??[]).filter(u=>u.done&&u.setType!=="warmup");if(!a.length)continue;const s=a.reduce((u,m)=>(m.weightKg??0)*(m.reps??0)>(u.weightKg??0)*(u.reps??0)?m:u);o.set(i.exerciseId,ne(s))}le(t,c,o);const d=setInterval(()=>{const n=document.getElementById("sess-clock");n&&(n.textContent=M(Date.now()-c.startTime))},1e3),l=new MutationObserver(()=>{document.contains(t)||(clearInterval(d),l.disconnect())});l.observe(document.body,{childList:!0,subtree:!0})}function ne(t){const e=[];return t.weightKg&&e.push(x(t.weightKg)),t.reps&&e.push(`×${t.reps}`),t.durationSeconds&&e.push(`${t.durationSeconds}s`),t.distanceKm&&e.push(`${t.distanceKm}km`),e.join(" ")||"—"}function ie(t){switch(t?.type){case"bodyweight_reps":return[{key:"reps",label:"REPS"}];case"weighted_bodyweight":return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}];case"assisted_bodyweight":return[{key:"weightKg",label:"AYUDA"},{key:"reps",label:"REPS"}];case"duration":return[{key:"durationSeconds",label:"SEG"}];case"distance_duration":return[{key:"distanceKm",label:"KM"},{key:"durationSeconds",label:"SEG"}];case"weight_distance":return[{key:"weightKg",label:"KG"},{key:"distanceKm",label:"KM"}];default:return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}]}}function le(t,e,c){const o=new Set,r=()=>{S(e);let d=`
    <div class="card">
      <div style="display:flex;gap:8px;align-items:center">
        <input type="text" id="w-title" value="${v(e.title)}" aria-label="Título de la sesión" style="font-weight:700" />
      </div>
      <div class="row" style="margin-top:8px;align-items:center">
        <div class="muted small">⏱ <span id="sess-clock" class="num">${M(Date.now()-e.startTime)}</span></div>
        <div class="muted small num">Volumen: ${x(D(e))} kg</div>
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
    </div>`;e.exercises.forEach((n,i)=>{const a=E.get(n.exerciseId),s=ie(a),u=n.sets.find(m=>m.supersetId)?.supersetId;d+=`<div class="card" data-ex="${i}">
        <div style="display:flex;align-items:center;gap:8px">
          <button class="icon-btn small ss-toggle" data-ei="${i}" title="Seleccionar para superset" style="${o.has(i)?"border-color:var(--blue);color:var(--blue)":""}">⛓</button>
          <div style="flex:1;min-width:0"><strong>${v(P(n.exerciseId))}</strong>
          <div class="muted small">${v(a?.primaryMuscle??"")}${u?' · <span style="color:var(--blue)">superset</span>':""}</div></div>
          <button class="icon-btn small" data-plate="${i}" title="Calculadora de discos">◉</button>
          <button class="icon-btn small" data-note="${i}" title="Nota">✎</button>
          <button class="icon-btn small" data-del-ex="${i}" title="Quitar">✕</button>
        </div>
        ${n.notes?`<div class="small muted" style="margin-top:6px">✎ ${v(n.notes)}</div>`:""}
        <table class="set-table" style="margin-top:8px">
          <thead><tr><th></th><th>SERIE</th><th class="prev">ANT</th>${s.map(m=>`<th>${m.label}</th>`).join("")}${h.rpeEnabled?"<th>RPE</th>":""}<th>✓</th></tr></thead>
          <tbody>
          ${n.sets.map((m,p)=>`
            <tr class="${m.done?"set-done":""}">
              <td><button class="set-type ${m.setType}" data-stype="${i}:${p}" title="Tipo de serie">${Q[m.setType]}</button></td>
              <td><span class="set-num">${m.setIndex+1}</span></td>
              <td class="prev">${v(c.get(n.exerciseId)??"—")}</td>
              ${s.map(g=>`<td><input type="text" inputmode="decimal" data-inp="${i}:${p}:${g.key}" value="${m[g.key]??""}" placeholder="–" ${m.done?"disabled":""}/></td>`).join("")}
              ${h.rpeEnabled?`<td><input type="text" inputmode="numeric" min="1" max="10" data-inp="${i}:${p}:rpe" value="${m.rpe??""}" placeholder="–" style="width:44px"/></td>`:""}
              <td><button class="check-btn ${m.done?"done":""}" data-check="${i}:${p}">✓</button></td>
            </tr>`).join("")}
          </tbody>
        </table>
        <div class="row" style="margin-top:8px">
          <button class="btn secondary small" data-add-set="${i}">＋ Serie</button>
          <button class="btn secondary small" data-rest="${i}">Descanso: ${n.restSeconds}s</button>
        </div>
      </div>`}),t.innerHTML=d,oe(t,e,c,r,o);const l=document.getElementById("ss-bar");o.size>0&&(l.style.display="flex",document.getElementById("ss-count").textContent=`${o.size} seleccionados`)};r()}function oe(t,e,c,o,r){document.getElementById("w-title")?.addEventListener("change",l=>{e.title=l.target.value.trim()||"Sesión libre",S(e)}),document.getElementById("w-add-ex")?.addEventListener("click",()=>ce(l=>{(async()=>{const n=await G(l);e.exercises.push({exerciseId:l,notes:"",sets:[W(0)],restSeconds:n??h.defaultRestSeconds}),o()})()})),document.getElementById("w-finish")?.addEventListener("click",()=>pe(e)),t.querySelectorAll("[data-inp]").forEach(l=>{l.addEventListener("change",()=>{const[n,i,a]=l.dataset.inp.split(":"),s=l.value;e.exercises[+n].sets[+i][a]=q(s),S(e)})});const d=["warmup","normal","failure","dropset"];t.querySelectorAll("[data-stype]").forEach(l=>{l.addEventListener("click",()=>{const[n,i]=l.dataset.stype.split(":").map(Number),a=e.exercises[n].sets[i];a.setType=d[(d.indexOf(a.setType)+1)%d.length],o()})}),t.querySelectorAll("[data-check]").forEach(l=>{l.addEventListener("click",()=>{const[n,i]=l.dataset.check.split(":").map(Number),a=e.exercises[n],s=a.sets[i];s.done=!s.done,S(e),s.done&&a.restSeconds>0&&ue(a.restSeconds),o()})}),t.querySelectorAll("[data-add-set]").forEach(l=>{l.addEventListener("click",()=>{const n=+l.dataset.addSet,i=e.exercises[n],a=i.sets[i.sets.length-1],s=W(i.sets.length);a&&(s.weightKg=a.weightKg,s.reps=a.reps,s.durationSeconds=a.durationSeconds,s.distanceKm=a.distanceKm),i.sets.push(s),o()})}),t.querySelectorAll("[data-del-ex]").forEach(l=>{l.addEventListener("click",async()=>{const n=+l.dataset.delEx;await R("¿Quitar este ejercicio de la sesión?")&&(e.exercises.splice(n,1),o())})}),t.querySelectorAll("[data-note]").forEach(l=>{l.addEventListener("click",()=>{const n=+l.dataset.note,i=e.exercises[n].notes,a=window.prompt("Nota del ejercicio:",i);a!==null&&(e.exercises[n].notes=a,o())})}),t.querySelectorAll("[data-rest]").forEach(l=>{l.addEventListener("click",()=>{const n=+l.dataset.rest,i=window.prompt("Descanso (segundos):",String(e.exercises[n].restSeconds)),a=i!==null?parseInt(i,10):NaN;!Number.isNaN(a)&&a>=0&&(e.exercises[n].restSeconds=a,o())})}),t.querySelectorAll("[data-plate]").forEach(l=>{l.addEventListener("click",()=>re(+l.dataset.plate))}),t.querySelectorAll(".ss-toggle").forEach(l=>{l.addEventListener("click",()=>{const n=+l.dataset.ei;r.has(n)?r.delete(n):r.add(n),o()})}),document.getElementById("ss-group")?.addEventListener("click",()=>{const l=H();r.forEach(n=>e.exercises[n].sets.forEach(i=>{i.supersetId=l})),r.clear(),j("Superset creado"),o()}),document.getElementById("ss-clear")?.addEventListener("click",()=>{r.forEach(l=>e.exercises[l].sets.forEach(n=>{n.supersetId=null})),r.clear(),o()})}function W(t){return{setIndex:t,setType:"normal",weightKg:null,reps:null,distanceKm:null,durationSeconds:null,rpe:null,supersetId:null,done:!1}}function ce(t){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`<div class="modal">
    <h3>Añadir ejercicio</h3>
    <input type="text" id="pk-q" placeholder="Buscar…" autocomplete="off" />
    <div class="chips" id="pk-muscles"></div>
    <div id="pk-list" style="margin-top:8px"></div>
    <button class="btn secondary" id="pk-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(e);const c=e.querySelector("#pk-q"),o=e.querySelector("#pk-list"),r=e.querySelector("#pk-muscles");let d="";const l=()=>{const i=[...new Set([...E.values()].map(a=>a.primaryMuscle))].sort();r.innerHTML=i.map(a=>`<button class="chip" data-m="${v(a)}">${v(a)}</button>`).join(""),r.querySelectorAll("[data-m]").forEach(a=>a.addEventListener("click",()=>{d=d===a.dataset.m?"":a.dataset.m,r.querySelectorAll(".chip").forEach(s=>s.classList.toggle("on",s.dataset.m===d)),n()}))},n=()=>{const i=c.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),a=[...E.values()].filter(s=>(!d||s.primaryMuscle===d)&&(!i||s.nameEs.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").includes(i))).sort((s,u)=>s.nameEs.localeCompare(u.nameEs,"es")).slice(0,60);o.innerHTML=a.length?a.map(s=>`<button class="ex-item" data-pick="${s.id}">
          ${s.img?`<img class="ex-thumb" src="./${s.img}" alt="" loading="lazy" />`:""}
          <span><span class="nm">${v(s.nameEs)}</span><br><span class="meta">${v(s.primaryMuscle)} · ${v(s.equipment)}</span></span>
          <span class="tag">${v(s.type==="duration"?"Tiempo":s.type==="bodyweight_reps"?"Corporal":"Peso")}</span>
        </button>`).join(""):'<div class="empty">Sin resultados.</div>',o.querySelectorAll("[data-pick]").forEach(s=>s.addEventListener("click",()=>{document.body.removeChild(e),t(s.dataset.pick)}))};c.addEventListener("input",n),e.querySelector("#pk-close")?.addEventListener("click",()=>document.body.removeChild(e)),e.addEventListener("click",i=>{i.target===e&&document.body.removeChild(e)}),L().then(()=>{l(),n()}),setTimeout(()=>c.focus(),50)}function re(t){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`<div class="modal">
    <h3>Calculadora de discos</h3>
    <div class="row">
      <div><label class="f">Carga objetivo (kg)</label><input type="text" id="pl-target" inputmode="decimal" /></div>
      <div><label class="f">Barra (kg)</label><input type="text" id="pl-bar" value="${h.barKg}" inputmode="decimal" /></div>
    </div>
    <label class="f">Discos disponibles (kg, separados por comas)</label>
    <input type="text" id="pl-avail" value="${h.platesKg.join(", ")}" />
    <div id="pl-out" style="margin-top:10px"></div>
    <button class="btn secondary" id="pl-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(e);const c=e.querySelector("#pl-target"),o=e.querySelector("#pl-bar"),r=e.querySelector("#pl-avail"),d=e.querySelector("#pl-out"),l=()=>{const n=q(c.value);if(!n||n<=0){d.innerHTML="";return}const i=r.value.split(",").map(s=>Number(s.trim().replace(",","."))).filter(s=>s>0),a=J(n,q(o.value)||20,i.length?i:void 0);d.innerHTML=`<div class="card">
      <div class="small muted">Por lado: <strong class="num">${x(a.perSideKg)} kg</strong></div>
      <div style="margin-top:6px">${a.platesPerSide.map(s=>`<div class="num">• ${s.count} × ${x(s.kg)} kg</div>`).join("")||'<span class="muted">Solo la barra</span>'}</div>
      <div class="small" style="margin-top:6px">Total: <strong class="num">${x(a.achievedKg)} kg</strong>${a.exact?"":' <span class="muted">(aprox.)</span>'}</div>
    </div>`};[c,o,r].forEach(n=>n.addEventListener("input",l)),e.querySelector("#pl-close")?.addEventListener("click",()=>document.body.removeChild(e)),e.addEventListener("click",n=>{n.target===e&&document.body.removeChild(e)}),setTimeout(()=>c.focus(),50)}function de(){if(h?.soundEnabled){try{const t=new AudioContext;[0,.25,.5].forEach((e,c)=>{const o=t.createOscillator(),r=t.createGain();o.connect(r),r.connect(t.destination),o.frequency.value=c===2?880:660,o.start(t.currentTime+e),o.stop(t.currentTime+e+.18)}),setTimeout(()=>t.close(),1200)}catch{}try{navigator.vibrate?.(400)}catch{}}}function ue(t){h||_().then(r=>{h=r}),K(),A=Date.now()+t*1e3;const e=document.createElement("div");e.className="timer-overlay",e.id="rest-timer",e.innerHTML=`<div class="timer-card">
    <div class="muted small">DESCANSO</div>
    <div class="t num" id="rest-t">--</div>
    <div class="row">
      <button class="btn secondary small" id="rest-plus">+15s</button>
      <button class="btn small" id="rest-done">Listo</button>
    </div></div>`,document.body.appendChild(e);const c=e.querySelector("#rest-t"),o=()=>{const r=Math.max(0,Math.ceil((A-Date.now())/1e3));c.textContent=`${Math.floor(r/60)}:${String(r%60).padStart(2,"0")}`,r<=0&&(de(),K(),j("¡Descanso terminado!"))};T=setInterval(o,250),o(),e.querySelector("#rest-plus")?.addEventListener("click",()=>{A+=15e3,o()}),e.querySelector("#rest-done")?.addEventListener("click",K)}function K(){T&&clearInterval(T),T=null,document.getElementById("rest-timer")?.remove()}async function pe(t){const e=window.prompt("Descripción de la sesión (opcional):",t.description)??t.description;t.description=e,t.endTime=Date.now();const c=await f.workoutsDesc(200),o=V(t,c.filter(n=>n.id!==t.id));await f.put("workouts",t),S(null),await me(t);const r=D(t),d=N(t),l=document.createElement("div");l.className="modal-overlay",l.innerHTML=`<div class="modal">
    <h3>¡Sesión completada!</h3>
    <div class="kpis">
      <div class="kpi"><div class="kpi-val num">${M(t.endTime-t.startTime)}</div><div class="kpi-lab">Duración</div></div>
      <div class="kpi"><div class="kpi-val num">${x(r)}</div><div class="kpi-lab">Volumen kg</div></div>
      <div class="kpi"><div class="kpi-val num">${d}</div><div class="kpi-lab">Series</div></div>
      <div class="kpi"><div class="kpi-val num">${t.exercises.length}</div><div class="kpi-lab">Ejercicios</div></div>
    </div>
    ${o.length?'<div class="sec-title">Récords personales</div>'+o.map(n=>`<div class="pr"><span class="medal">★</span><span><strong>${v(P(n.exerciseId))}</strong> — ${v(n.kind)}: <span class="num">${v(n.value)}</span></span></div>`).join(""):'<div class="muted small">Sin nuevos récords esta vez. ¡A por la próxima!</div>'}
    <button class="btn" id="fin-ok" style="margin-top:12px">Hecho</button>
  </div>`,document.body.appendChild(l),l.querySelector("#fin-ok")?.addEventListener("click",()=>{document.body.removeChild(l),w("/train")})}async function me(t){try{const c=(await f.all("programState")).find(r=>r.active);if(!c)return;let o=!1;for(const r of t.exercises){const d=r.sets.filter(a=>a.done&&a.setType!=="warmup"&&a.weightKg&&a.reps);if(d.length<2)continue;const l=r.targetRepsMax??8,n=d.every(a=>(a.reps??0)>=l),i=c.loads[r.exerciseId]??Math.max(...d.map(a=>a.weightKg??0));n?(c.loads[r.exerciseId]=Math.round((i+2.5)*10)/10,o=!0):r.exerciseId in c.loads||(c.loads[r.exerciseId]=i)}o&&(c.currentDayIndex+=1,await f.put("programState",c),j("Progresión del programa actualizada"))}catch{}}export{xe as ICONS,pe as finishWorkout,ce as openExercisePicker,fe as renderActiveWorkout,X as renderTrainHome,te as startFreeWorkout,ue as startRestTimer,K as stopRestTimer,se as workoutFromRoutine};
