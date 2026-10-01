import{d as h,s as w,e as f,t as P,g as D,l as H,c as U,b as B,I as X,a as Z,p as N}from"./index-DyWizPII.js";import{d as ee,w as K,a as O,f as M,b as S}from"./stats-Cz7THz2Z.js";import{c as te}from"./photo-B4nAdfpw.js";import{D as Y,u as G,S as se}from"./types-CEDv8i23.js";const ae=[25,20,15,10,5,2.5,1.25];function ne(e,t=20,c=ae){const r=Math.max(0,(e-t)/2),d=[...c].sort((n,s)=>s-n),i=[];let o=r;for(const n of d){if(n<=0)continue;const s=Math.floor(o/n+1e-9);s>0&&(i.push({kg:n,count:s}),o=Math.round((o-s*n)*1e3)/1e3)}const l=i.reduce((n,s)=>n+s.kg*s.count,0),a=Math.round((t+l*2)*100)/100;return{perSideKg:Math.round(r*100)/100,platesPerSide:i,barKg:t,achievedKg:a,exact:Math.abs(a-e)<.001}}let T=new Map,b;async function I(){const e=await h.all("exercises");T=new Map(e.map(t=>[t.id,t])),b=await B()}function F(e){return T.get(e)?.nameEs??e.replace(/^desconocido:/,"")}async function ie(e){await I();const t=H(),c=await h.all("routines"),r=await h.all("folders"),d=new Map(r.map(s=>[s.id,s.name])),i=await h.workoutsDesc(8),o=new Date().getDay(),l=c.filter(s=>s.dayOfWeek===o);let a='<div class="screen-head"><h1>Entrenamiento</h1></div>';if(t&&(a+=`<div class="card" style="border-color:var(--blue)">
      <h3>Sesión en curso</h3>
      <div class="muted small">${f(t.title)} · ${t.exercises.length} ejercicios</div>
      <div class="row" style="margin-top:10px">
        <button class="btn" data-act="continue">Continuar</button>
        <button class="btn danger" data-act="discard">Descartar</button>
      </div></div>`),a+='<button class="btn" data-act="free">＋ Sesión libre</button>',a+='<div id="cal-home"></div>',l.length){a+=`<div class="sec-title">Hoy (${Y[o]})</div>`;for(const s of l)a+=_(s,d.get(s.folderId??"")??"")}if(c.length){a+='<div class="sec-title">Rutinas</div>';for(const s of c.filter(u=>u.dayOfWeek!==o))a+=_(s,d.get(s.folderId??"")??"")}else l.length||(a+='<div class="empty">Sin rutinas todavía.<br>Crea una en la pestaña Rutinas o empieza una sesión libre.</div>');a+='<div class="sec-title">Historial</div>',i.length||(a+='<div class="empty">Aún no hay entrenamientos registrados.</div>');for(const s of i){const u=new Date(s.startTime);a+=`<div class="card" style="padding:9px 12px">
      <div style="display:flex;justify-content:space-between;gap:8px">
        <strong>${f(s.title)}</strong>
        <span class="muted small num">${u.toLocaleDateString("es-ES",{day:"numeric",month:"short"})}</span>
      </div>
      <div class="muted small num">${S(K(s))} kg · ${O(s)} series · ${s.endTime?M(s.endTime-s.startTime):"—"}</div>
    </div>`}e.innerHTML=a;const n=e.querySelector("#cal-home");n&&oe(n),e.querySelectorAll("[data-act]").forEach(s=>s.addEventListener("click",async()=>{const u=s.dataset.act;if(u==="free")le();else if(u==="continue")D("/train/active");else if(u==="discard")await U("¿Descartar la sesión en curso? Se perderá lo registrado.")&&(w(null),ie(e));else if(u.startsWith("routine:")){const m=c.find(k=>k.id===u.slice(8));m&&de(m)}}))}let x=0,$=0,E=null;async function oe(e){const t=new Date;x||(x=t.getFullYear(),$=t.getMonth());const c=await h.all("workouts"),r=new Map;for(const n of c){const s=new Date(n.startTime),u=s.getFullYear()+"-"+s.getMonth()+"-"+s.getDate(),m=r.get(u);m?m.push(n):r.set(u,[n])}const d=n=>x+"-"+$+"-"+n,i=new Map;async function o(n){for(const[,u]of i)URL.revokeObjectURL(u);i.clear();const s=r.get(d(n))??[];for(const u of s)try{const m=await h.get("workoutPhotos",u.id);m?.blob&&i.set(u.id,URL.createObjectURL(m.blob))}catch{}}const l=n=>{const s=(n.sets??[]).filter(u=>u.done&&u.setType!=="warmup");return s.length?s.map(u=>{const m=u.weightKg!=null&&u.weightKg>0?S(u.weightKg)+"×":"",k=u.reps??u.durationSeconds??u.distanceKm??"–";return m+k}).join(" · "):"—"},a=()=>{const n=new Date(x,$,1).toLocaleDateString("es-ES",{month:"long",year:"numeric"}),s=(new Date(x,$,1).getDay()+6)%7,u=new Date(x,$+1,0).getDate();let m="";for(let p=0;p<s;p++)m+="<span></span>";let k=0;for(let p=1;p<=u;p++){const y=r.has(d(p));y&&k++,m+=`<button class="mcal-day${y?" has":""}${E===p?" sel":""}" data-day="${p}"${y?"":" disabled"}>${p}</button>`}let g="";if(E!=null&&r.has(d(E))){const p=[...r.get(d(E))].sort((v,L)=>v.startTime-L.startTime);g=`<div class="sec-title">${E+" de "+new Date(x,$,1).toLocaleDateString("es-ES",{month:"long"})}</div>`+p.map(v=>{const L=new Date(v.startTime).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}),Q=v.endTime?M(v.endTime-v.startTime):"—",J=(v.exercises??[]).map(R=>`<div class="mcal-ex"><span>${f(F(R.exerciseId))}</span><span class="num muted">${f(l(R))}</span></div>`).join(""),W=i.get(v.id),q=[];return v.fatigue!=null&&q.push(`Cansancio <b class="num">${v.fatigue}</b>/5`),v.satisfaction!=null&&q.push(`Satisfacción <b class="num">${v.satisfaction}</b>/5`),`<div class="card" style="padding:9px 12px;margin-bottom:8px">
          ${W?`<img class="mcal-photo" src="${W}" alt="Foto del entreno">`:""}
          <div style="display:flex;justify-content:space-between;gap:8px">
            <strong>${f(v.title)}</strong><span class="muted small num">${L}</span>
          </div>
          <div class="muted small num" style="margin-bottom:6px">${Q} · ${S(K(v))} kg · ${O(v)} series</div>
          ${q.length?`<div class="mcal-feel">${q.map(R=>`<span class="chip-feel">${R}</span>`).join("")}</div>`:""}
          ${J}</div>`}).join("")}e.innerHTML=`<div class="sec-title">Calendario</div>
      <div class="card" style="padding:10px 12px">
        <div class="mcal-head">
          <button class="linklike" data-cal="prev" aria-label="Mes anterior">‹</button>
          <strong style="text-transform:capitalize">${f(n)}</strong>
          <button class="linklike" data-cal="next" aria-label="Mes siguiente">›</button>
        </div>
        <div class="mcal-grid">
          ${["L","M","X","J","V","S","D"].map(p=>`<span class="mcal-dow">${p}</span>`).join("")}
          ${m}
        </div>
        <div class="muted small" style="margin-top:8px"><span class="num">${k}</span> día${k===1?"":"s"} este mes</div>
      </div>
      ${g}`,e.querySelectorAll("[data-cal]").forEach(p=>p.addEventListener("click",()=>{const y=p.dataset.cal==="prev"?-1:1,v=new Date(x,$+y,1);x=v.getFullYear(),$=v.getMonth(),E=null,a()})),e.querySelectorAll("[data-day]").forEach(p=>p.addEventListener("click",()=>{const y=Number(p.dataset.day),v=E!==y;E=v?y:null,v?o(y).then(a):a()}))};a()}function _(e,t){return`<div class="card" style="padding:9px 12px">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <div><strong>${f(e.name)}</strong>
        <div class="muted small">${e.exercises.length} ejercicios${t?" · "+f(t):""}${e.dayOfWeek!==null?" · "+Y[e.dayOfWeek]:""}</div>
      </div>
      <button class="btn small" data-act="routine:${e.id}">Empezar</button>
    </div></div>`}function le(){(async()=>await V()&&(await ce(),D("/train/active")))()}async function V(){const e=H();if(!e)return!0;const t=e.exercises.reduce((c,r)=>c+r.sets.filter(d=>d.done).length,0);return!t&&!e.exercises.length?!0:U(`Ya tienes «${e.title}» en curso con ${t} series registradas. ¿Descartarla y empezar de nuevo?`)}async function ce(){await I();const e={id:G(),title:"Sesión libre",startTime:Date.now(),endTime:null,description:"",exercises:[]};return w(e),e}async function re(e){return await I(),{id:G(),title:e.name,startTime:Date.now(),endTime:null,description:"",exercises:e.exercises.map(c=>({exerciseId:c.exerciseId,notes:c.notes||"",restSeconds:c.restSeconds??b.defaultRestSeconds,targetRepsMax:c.targetRepsMax??c.targetRepsMin??null,sets:Array.from({length:c.targetSets},(r,d)=>({setIndex:d,setType:"normal",weightKg:c.targetWeightKg,reps:c.targetRepsMax??c.targetRepsMin,distanceKm:null,durationSeconds:c.targetDurationSeconds,rpe:null,supersetId:null,done:!1}))}))}}async function de(e){if(!await V())return;const t=await re(e);w(t),D("/train/active")}let A=null,C=0;async function we(e){await I();const t=await h.workoutsDesc(60),c=H();if(!c){D("/train");return}const r=new Map;for(const l of t)if(l.id!==c.id)for(const a of l.exercises??[]){if(r.has(a.exerciseId))continue;const n=(a.sets??[]).filter(u=>u.done&&u.setType!=="warmup");if(!n.length)continue;const s=n.reduce((u,m)=>(m.weightKg??0)*(m.reps??0)>(u.weightKg??0)*(u.reps??0)?m:u);r.set(a.exerciseId,ue(s))}me(e,c,r);const i=setInterval(()=>{const l=document.getElementById("sess-clock");l&&(l.textContent=M(Date.now()-c.startTime))},1e3),o=new MutationObserver(()=>{document.contains(e)||(clearInterval(i),o.disconnect())});o.observe(document.body,{childList:!0,subtree:!0})}function ue(e){const t=[];return e.weightKg&&t.push(S(e.weightKg)),e.reps&&t.push(`×${e.reps}`),e.durationSeconds&&t.push(`${e.durationSeconds}s`),e.distanceKm&&t.push(`${e.distanceKm}km`),t.join(" ")||"—"}function pe(e){switch(e?.type){case"bodyweight_reps":return[{key:"reps",label:"REPS"}];case"weighted_bodyweight":return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}];case"assisted_bodyweight":return[{key:"weightKg",label:"AYUDA"},{key:"reps",label:"REPS"}];case"duration":return[{key:"durationSeconds",label:"SEG"}];case"distance_duration":return[{key:"distanceKm",label:"KM"},{key:"durationSeconds",label:"SEG"}];case"weight_distance":return[{key:"weightKg",label:"KG"},{key:"distanceKm",label:"KM"}];default:return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}]}}function me(e,t,c){const r=()=>{w(t);let d=`
    <div class="card">
      <div style="display:flex;gap:8px;align-items:center">
        <input type="text" id="w-title" value="${f(t.title)}" aria-label="Título de la sesión" style="font-weight:700" />
      </div>
      <div class="row" style="margin-top:8px;align-items:center">
        <div class="muted small">⏱ <span id="sess-clock" class="num">${M(Date.now()-t.startTime)}</span></div>
        <div class="muted small num">Volumen: ${S(K(t))} kg</div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn secondary" id="w-add-ex">＋ Añadir ejercicio</button>
        <button class="btn" id="w-finish">Terminar</button>
      </div>
    </div>`;t.exercises.forEach((i,o)=>{const l=T.get(i.exerciseId),a=pe(l),n=i.sets.find(s=>s.supersetId)?.supersetId;d+=`<div class="card" data-ex="${o}">
        <div style="display:flex;align-items:center;gap:8px">
          ${l?.img?`<img class="ex-thumb" src="./${l.img}" alt="" loading="lazy" />`:`<span class="ex-thumb ex-thumb--ph" aria-hidden="true">${X.train}</span>`}
          <div style="flex:1;min-width:0"><strong>${f(F(i.exerciseId))}</strong>
          <div class="muted small">${f(l?.primaryMuscle??"")}${n?' · <span style="color:var(--blue)">superset</span>':""}</div></div>
          <button class="icon-btn small" data-plate="${o}" title="Calculadora de discos">◉</button>
          <button class="icon-btn small" data-note="${o}" title="Nota">✎</button>
          <button class="icon-btn small" data-del-ex="${o}" title="Quitar">✕</button>
        </div>
        ${i.notes?`<div class="small muted" style="margin-top:6px">✎ ${f(i.notes)}</div>`:""}
        <table class="set-table" style="margin-top:8px">
          <thead><tr><th></th><th>SERIE</th><th class="prev">ANT</th>${a.map(s=>`<th>${s.label}</th>`).join("")}${b.rpeEnabled?"<th>RPE</th>":""}<th>✓</th></tr></thead>
          <tbody>
          ${i.sets.map((s,u)=>`
            <tr class="${s.done?"set-done":""}">
              <td><button class="set-type ${s.setType}" data-stype="${o}:${u}" title="Tipo de serie">${se[s.setType]}</button></td>
              <td><span class="set-num">${s.setIndex+1}</span></td>
              <td class="prev">${f(c.get(i.exerciseId)??"—")}</td>
              ${a.map(m=>`<td><input type="text" inputmode="decimal" data-inp="${o}:${u}:${m.key}" value="${s[m.key]??""}" placeholder="–" ${s.done?"disabled":""}/></td>`).join("")}
              ${b.rpeEnabled?`<td><input type="text" inputmode="numeric" min="1" max="10" data-inp="${o}:${u}:rpe" value="${s.rpe??""}" placeholder="–" style="width:44px"/></td>`:""}
              <td><button class="check-btn ${s.done?"done":""}" data-check="${o}:${u}">✓</button></td>
            </tr>`).join("")}
          </tbody>
        </table>
        <div class="row" style="margin-top:8px">
          <button class="btn secondary small" data-add-set="${o}">＋ Serie</button>
          <button class="btn secondary small" data-rest="${o}">Descanso: ${i.restSeconds}s</button>
        </div>
      </div>`}),e.innerHTML=d,ve(e,t,c,r)};r()}function ve(e,t,c,r){document.getElementById("w-title")?.addEventListener("change",i=>{t.title=i.target.value.trim()||"Sesión libre",w(t)}),document.getElementById("w-add-ex")?.addEventListener("click",()=>fe(i=>{(async()=>{const o=await Z(i);t.exercises.push({exerciseId:i,notes:"",sets:[z(0)],restSeconds:o??b.defaultRestSeconds}),r()})()})),document.getElementById("w-finish")?.addEventListener("click",()=>be(t)),e.querySelectorAll("[data-inp]").forEach(i=>{i.addEventListener("change",()=>{const[o,l,a]=i.dataset.inp.split(":"),n=i.value;t.exercises[+o].sets[+l][a]=N(n),w(t)})});const d=["warmup","normal","failure","dropset"];e.querySelectorAll("[data-stype]").forEach(i=>{i.addEventListener("click",()=>{const[o,l]=i.dataset.stype.split(":").map(Number),a=t.exercises[o].sets[l];a.setType=d[(d.indexOf(a.setType)+1)%d.length],r()})}),e.querySelectorAll("[data-check]").forEach(i=>{i.addEventListener("click",()=>{const[o,l]=i.dataset.check.split(":").map(Number),a=t.exercises[o],n=a.sets[l];n.done=!n.done,w(t),n.done&&a.restSeconds>0&&he(a.restSeconds),r()})}),e.querySelectorAll("[data-add-set]").forEach(i=>{i.addEventListener("click",()=>{const o=+i.dataset.addSet,l=t.exercises[o],a=l.sets[l.sets.length-1],n=z(l.sets.length);a&&(n.weightKg=a.weightKg,n.reps=a.reps,n.durationSeconds=a.durationSeconds,n.distanceKm=a.distanceKm),l.sets.push(n),r()})}),e.querySelectorAll("[data-del-ex]").forEach(i=>{i.addEventListener("click",async()=>{const o=+i.dataset.delEx;await U("¿Quitar este ejercicio de la sesión?")&&(t.exercises.splice(o,1),r())})}),e.querySelectorAll("[data-note]").forEach(i=>{i.addEventListener("click",()=>{const o=+i.dataset.note,l=t.exercises[o].notes,a=window.prompt("Nota del ejercicio:",l);a!==null&&(t.exercises[o].notes=a,r())})}),e.querySelectorAll("[data-rest]").forEach(i=>{i.addEventListener("click",()=>{const o=+i.dataset.rest,l=window.prompt("Descanso (segundos):",String(t.exercises[o].restSeconds)),a=l!==null?parseInt(l,10):NaN;!Number.isNaN(a)&&a>=0&&(t.exercises[o].restSeconds=a,r())})}),e.querySelectorAll("[data-plate]").forEach(i=>{i.addEventListener("click",()=>ge(+i.dataset.plate))})}function z(e){return{setIndex:e,setType:"normal",weightKg:null,reps:null,distanceKm:null,durationSeconds:null,rpe:null,supersetId:null,done:!1}}function fe(e){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`<div class="modal">
    <h3>Añadir ejercicio</h3>
    <input type="text" id="pk-q" placeholder="Buscar…" autocomplete="off" />
    <div class="chips" id="pk-muscles"></div>
    <div id="pk-list" style="margin-top:8px"></div>
    <button class="btn secondary" id="pk-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(t);const c=t.querySelector("#pk-q"),r=t.querySelector("#pk-list"),d=t.querySelector("#pk-muscles");let i="";const o=()=>{const a=[...new Set([...T.values()].map(n=>n.primaryMuscle))].sort();d.innerHTML=a.map(n=>`<button class="chip" data-m="${f(n)}">${f(n)}</button>`).join(""),d.querySelectorAll("[data-m]").forEach(n=>n.addEventListener("click",()=>{i=i===n.dataset.m?"":n.dataset.m,d.querySelectorAll(".chip").forEach(s=>s.classList.toggle("on",s.dataset.m===i)),l()}))},l=()=>{const a=c.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),n=[...T.values()].filter(s=>(!i||s.primaryMuscle===i)&&(!a||s.nameEs.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").includes(a))).sort((s,u)=>s.nameEs.localeCompare(u.nameEs,"es")).slice(0,60);r.innerHTML=n.length?n.map(s=>`<button class="ex-item" data-pick="${s.id}">
          ${s.img?`<img class="ex-thumb" src="./${s.img}" alt="" loading="lazy" />`:""}
          <span><span class="nm">${f(s.nameEs)}</span><br><span class="meta">${f(s.primaryMuscle)} · ${f(s.equipment)}</span></span>
          <span class="tag">${f(s.type==="duration"?"Tiempo":s.type==="bodyweight_reps"?"Corporal":"Peso")}</span>
        </button>`).join(""):'<div class="empty">Sin resultados.</div>',r.querySelectorAll("[data-pick]").forEach(s=>s.addEventListener("click",()=>{document.body.removeChild(t),e(s.dataset.pick)}))};c.addEventListener("input",l),t.querySelector("#pk-close")?.addEventListener("click",()=>document.body.removeChild(t)),t.addEventListener("click",a=>{a.target===t&&document.body.removeChild(t)}),I().then(()=>{o(),l()}),setTimeout(()=>c.focus(),50)}function ge(e){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`<div class="modal">
    <h3>Calculadora de discos</h3>
    <div class="row">
      <div><label class="f">Carga objetivo (kg)</label><input type="text" id="pl-target" inputmode="decimal" /></div>
      <div><label class="f">Barra (kg)</label><input type="text" id="pl-bar" value="${b.barKg}" inputmode="decimal" /></div>
    </div>
    <label class="f">Discos disponibles (kg, separados por comas)</label>
    <input type="text" id="pl-avail" value="${b.platesKg.join(", ")}" />
    <div id="pl-out" style="margin-top:10px"></div>
    <button class="btn secondary" id="pl-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(t);const c=t.querySelector("#pl-target"),r=t.querySelector("#pl-bar"),d=t.querySelector("#pl-avail"),i=t.querySelector("#pl-out"),o=()=>{const l=N(c.value);if(!l||l<=0){i.innerHTML="";return}const a=d.value.split(",").map(s=>Number(s.trim().replace(",","."))).filter(s=>s>0),n=ne(l,N(r.value)||20,a.length?a:void 0);i.innerHTML=`<div class="card">
      <div class="small muted">Por lado: <strong class="num">${S(n.perSideKg)} kg</strong></div>
      <div style="margin-top:6px">${n.platesPerSide.map(s=>`<div class="num">• ${s.count} × ${S(s.kg)} kg</div>`).join("")||'<span class="muted">Solo la barra</span>'}</div>
      <div class="small" style="margin-top:6px">Total: <strong class="num">${S(n.achievedKg)} kg</strong>${n.exact?"":' <span class="muted">(aprox.)</span>'}</div>
    </div>`};[c,r,d].forEach(l=>l.addEventListener("input",o)),t.querySelector("#pl-close")?.addEventListener("click",()=>document.body.removeChild(t)),t.addEventListener("click",l=>{l.target===t&&document.body.removeChild(t)}),setTimeout(()=>c.focus(),50)}function ye(){if(b?.soundEnabled){try{const e=new AudioContext;[0,.25,.5].forEach((t,c)=>{const r=e.createOscillator(),d=e.createGain();r.connect(d),d.connect(e.destination),r.frequency.value=c===2?880:660,r.start(e.currentTime+t),r.stop(e.currentTime+t+.18)}),setTimeout(()=>e.close(),1200)}catch{}try{navigator.vibrate?.(400)}catch{}}}function he(e){b||B().then(d=>{b=d}),j(),C=Date.now()+e*1e3;const t=document.createElement("div");t.className="timer-overlay",t.id="rest-timer",t.innerHTML=`<div class="timer-card">
    <div class="muted small">DESCANSO</div>
    <div class="t num" id="rest-t">--</div>
    <div class="row">
      <button class="btn secondary small" id="rest-plus">+15s</button>
      <button class="btn small" id="rest-done">Listo</button>
    </div></div>`,document.body.appendChild(t);const c=t.querySelector("#rest-t"),r=()=>{const d=Math.max(0,Math.ceil((C-Date.now())/1e3));c.textContent=`${Math.floor(d/60)}:${String(d%60).padStart(2,"0")}`,d<=0&&(ye(),j(),P("¡Descanso terminado!"))};A=setInterval(r,250),r(),t.querySelector("#rest-plus")?.addEventListener("click",()=>{C+=15e3,r()}),t.querySelector("#rest-done")?.addEventListener("click",j)}function j(){A&&clearInterval(A),A=null,document.getElementById("rest-timer")?.remove()}async function be(e){const t=window.prompt("Descripción de la sesión (opcional):",e.description)??e.description;e.description=t,e.endTime=Date.now();const c=await h.workoutsDesc(200),r=ee(e,c.filter(g=>g.id!==e.id));await h.put("workouts",e),w(null),await ke(e);const d=K(e),i=O(e),o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`<div class="modal">
    <h3>¡Sesión completada!</h3>
    <div class="kpis">
      <div class="kpi"><div class="kpi-val num">${M(e.endTime-e.startTime)}</div><div class="kpi-lab">Duración</div></div>
      <div class="kpi"><div class="kpi-val num">${S(d)}</div><div class="kpi-lab">Volumen kg</div></div>
      <div class="kpi"><div class="kpi-val num">${i}</div><div class="kpi-lab">Series</div></div>
      <div class="kpi"><div class="kpi-val num">${e.exercises.length}</div><div class="kpi-lab">Ejercicios</div></div>
    </div>
    ${r.length?'<div class="sec-title">Récords personales</div>'+r.map(g=>`<div class="pr"><span class="medal">★</span><span><strong>${f(F(g.exerciseId))}</strong> — ${f(g.kind)}: <span class="num">${f(g.value)}</span></span></div>`).join(""):'<div class="muted small">Sin nuevos récords esta vez. ¡A por la próxima!</div>'}
    <div class="sec-title" style="margin-top:14px">Foto y sensaciones <span class="muted small">(opcional)</span></div>
    <div class="fin-photo" id="fin-photo">
      <button class="btn small" id="fin-photo-btn" type="button">📷 Subir foto</button>
      <input type="file" id="fin-photo-input" accept="image/*" hidden>
    </div>
    <div class="fin-slider">
      <div class="fin-slider-head"><span>Cansancio</span><span class="num" id="fin-fatigue-val">—</span></div>
      <input type="range" id="fin-fatigue" min="0" max="5" step="1" value="0" aria-label="Cansancio de 0 a 5">
      <div class="fin-slider-scale"><span>0</span><span>5</span></div>
    </div>
    <div class="fin-slider">
      <div class="fin-slider-head"><span>Satisfacción</span><span class="num" id="fin-satisfaction-val">—</span></div>
      <input type="range" id="fin-satisfaction" min="0" max="5" step="1" value="0" aria-label="Satisfacción de 0 a 5">
      <div class="fin-slider-scale"><span>0</span><span>5</span></div>
    </div>
    <button class="btn" id="fin-ok" style="margin-top:12px">Hecho</button>
  </div>`,document.body.appendChild(o);let l=null,a=null;const n=o.querySelector("#fin-photo"),s=o.querySelector("#fin-photo-input");o.querySelector("#fin-photo-btn")?.addEventListener("click",()=>s.click()),s.addEventListener("change",async()=>{const g=s.files?.[0];if(s.value="",!!g)try{l=await te(g),a&&URL.revokeObjectURL(a),a=URL.createObjectURL(l),n.innerHTML=`<img class="fin-photo-prev" src="${a}" alt="Foto del entreno"><div><button class="linklike small" id="fin-photo-del" type="button">Quitar foto</button></div>`,n.querySelector("#fin-photo-del")?.addEventListener("click",()=>{l=null,a&&(URL.revokeObjectURL(a),a=null),n.innerHTML='<button class="btn small" id="fin-photo-btn2" type="button">📷 Subir foto</button>',n.querySelector("#fin-photo-btn2")?.addEventListener("click",()=>s.click())})}catch{P("No se pudo procesar la foto")}});const u=(g,p)=>{const y=o.querySelector(g),v=o.querySelector(p);let L=!1;return y.addEventListener("input",()=>{L=!0,v.textContent=y.value}),()=>L?Number(y.value):null},m=u("#fin-fatigue","#fin-fatigue-val"),k=u("#fin-satisfaction","#fin-satisfaction-val");o.querySelector("#fin-ok")?.addEventListener("click",async()=>{try{const g=m(),p=k();if(g!==null&&(e.fatigue=g),p!==null&&(e.satisfaction=p),await h.put("workouts",e),l){const y={workoutId:e.id,blob:l,createdAt:Date.now()};await h.put("workoutPhotos",y)}}catch{}a&&URL.revokeObjectURL(a),document.body.removeChild(o),D("/train")})}async function ke(e){try{const c=(await h.all("programState")).find(d=>d.active);if(!c)return;let r=!1;for(const d of e.exercises){const i=d.sets.filter(n=>n.done&&n.setType!=="warmup"&&n.weightKg&&n.reps);if(i.length<2)continue;const o=d.targetRepsMax??8,l=i.every(n=>(n.reps??0)>=o),a=c.loads[d.exerciseId]??Math.max(...i.map(n=>n.weightKg??0));l?(c.loads[d.exerciseId]=Math.round((a+2.5)*10)/10,r=!0):d.exerciseId in c.loads||(c.loads[d.exerciseId]=a)}r&&(c.currentDayIndex+=1,await h.put("programState",c),P("Progresión del programa actualizada"))}catch{}}export{X as ICONS,be as finishWorkout,fe as openExercisePicker,we as renderActiveWorkout,ie as renderTrainHome,ce as startFreeWorkout,he as startRestTimer,j as stopRestTimer,re as workoutFromRoutine};
