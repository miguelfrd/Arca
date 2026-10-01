import{d as b,s as w,e as f,t as C,g as D,l as H,c as U,b as Y,I as X,a as Z,p as P}from"./index-CueAfup2.js";import{d as ee,w as K,a as B,f as M,b as $}from"./stats-Cz7THz2Z.js";import{c as te}from"./photo-B4nAdfpw.js";import{D as G,u as O,S as se}from"./types-CEDv8i23.js";const ae=[25,20,15,10,5,2.5,1.25];function ne(e,t=20,c=ae){const l=Math.max(0,(e-t)/2),r=[...c].sort((a,s)=>s-a),u=[];let i=l;for(const a of r){if(a<=0)continue;const s=Math.floor(i/a+1e-9);s>0&&(u.push({kg:a,count:s}),i=Math.round((i-s*a)*1e3)/1e3)}const o=u.reduce((a,s)=>a+s.kg*s.count,0),n=Math.round((t+o*2)*100)/100;return{perSideKg:Math.round(l*100)/100,platesPerSide:u,barKg:t,achievedKg:n,exact:Math.abs(n-e)<.001}}let T=new Map,k;async function I(){const e=await b.all("exercises");T=new Map(e.map(t=>[t.id,t])),k=await Y()}function F(e){return T.get(e)?.nameEs??e.replace(/^desconocido:/,"")}async function ie(e){await I();const t=H(),c=await b.all("routines"),l=await b.all("folders"),r=new Map(l.map(s=>[s.id,s.name])),u=await b.workoutsDesc(8),i=new Date().getDay(),o=c.filter(s=>s.dayOfWeek===i);let n='<div class="screen-head"><h1>Entrenamiento</h1></div>';if(t&&(n+=`<div class="card" style="border-color:var(--blue)">
      <h3>Sesión en curso</h3>
      <div class="muted small">${f(t.title)} · ${t.exercises.length} ejercicios</div>
      <div class="row" style="margin-top:10px">
        <button class="btn" data-act="continue">Continuar</button>
        <button class="btn danger" data-act="discard">Descartar</button>
      </div></div>`),n+='<button class="btn" data-act="free">＋ Sesión libre</button>',n+='<div id="cal-home"></div>',o.length){n+=`<div class="sec-title">Hoy (${G[i]})</div>`;for(const s of o)n+=W(s,r.get(s.folderId??"")??"")}if(c.length){n+='<div class="sec-title">Rutinas</div>';for(const s of c.filter(d=>d.dayOfWeek!==i))n+=W(s,r.get(s.folderId??"")??"")}else o.length||(n+='<div class="empty">Sin rutinas todavía.<br>Crea una en la pestaña Rutinas o empieza una sesión libre.</div>');n+='<div class="sec-title">Historial</div>',u.length||(n+='<div class="empty">Aún no hay entrenamientos registrados.</div>');for(const s of u){const d=new Date(s.startTime);n+=`<div class="card" style="padding:9px 12px">
      <div style="display:flex;justify-content:space-between;gap:8px">
        <strong>${f(s.title)}</strong>
        <span class="muted small num">${d.toLocaleDateString("es-ES",{day:"numeric",month:"short"})}</span>
      </div>
      <div class="muted small num">${$(K(s))} kg · ${B(s)} series · ${s.endTime?M(s.endTime-s.startTime):"—"}</div>
    </div>`}e.innerHTML=n;const a=e.querySelector("#cal-home");a&&oe(a),e.querySelectorAll("[data-act]").forEach(s=>s.addEventListener("click",async()=>{const d=s.dataset.act;if(d==="free")le();else if(d==="continue")D("/train/active");else if(d==="discard")await U("¿Descartar la sesión en curso? Se perderá lo registrado.")&&(w(null),ie(e));else if(d.startsWith("routine:")){const p=c.find(h=>h.id===d.slice(8));p&&de(p)}}))}let x=0,S=0,E=null;async function oe(e){const t=new Date;x||(x=t.getFullYear(),S=t.getMonth());const c=await b.all("workouts"),l=new Map;for(const a of c){const s=new Date(a.startTime),d=s.getFullYear()+"-"+s.getMonth()+"-"+s.getDate(),p=l.get(d);p?p.push(a):l.set(d,[a])}const r=a=>x+"-"+S+"-"+a,u=new Map;async function i(a){for(const[,d]of u)URL.revokeObjectURL(d);u.clear();const s=l.get(r(a))??[];for(const d of s)try{const p=await b.get("workoutPhotos",d.id);p?.blob&&u.set(d.id,URL.createObjectURL(p.blob))}catch{}}const o=a=>{const s=(a.sets??[]).filter(d=>d.done&&d.setType!=="warmup");return s.length?s.map(d=>{const p=d.weightKg!=null&&d.weightKg>0?$(d.weightKg)+"×":"",h=d.reps??d.durationSeconds??d.distanceKm??"–";return p+h}).join(" · "):"—"},n=()=>{const a=new Date(x,S,1).toLocaleDateString("es-ES",{month:"long",year:"numeric"}),s=(new Date(x,S,1).getDay()+6)%7,d=new Date(x,S+1,0).getDate();let p="";for(let m=0;m<s;m++)p+="<span></span>";let h=0;for(let m=1;m<=d;m++){const y=l.has(r(m));y&&h++,p+=`<button class="mcal-day${y?" has":""}${E===m?" sel":""}" data-day="${m}"${y?"":" disabled"}>${m}</button>`}let g="";if(E!=null&&l.has(r(E))){const m=[...l.get(r(E))].sort((v,L)=>v.startTime-L.startTime);g=`<div class="sec-title">${E+" de "+new Date(x,S,1).toLocaleDateString("es-ES",{month:"long"})}</div>`+m.map(v=>{const L=new Date(v.startTime).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}),Q=v.endTime?M(v.endTime-v.startTime):"—",J=(v.exercises??[]).map(A=>`<div class="mcal-ex"><span>${f(F(A.exerciseId))}</span><span class="num muted">${f(o(A))}</span></div>`).join(""),z=u.get(v.id),q=[];return v.fatigue!=null&&q.push(`Cansancio <b class="num">${v.fatigue}</b>/5`),v.satisfaction!=null&&q.push(`Satisfacción <b class="num">${v.satisfaction}</b>/5`),`<div class="card" style="padding:9px 12px;margin-bottom:8px">
          ${z?`<img class="mcal-photo" src="${z}" alt="Foto del entreno">`:""}
          <div style="display:flex;justify-content:space-between;gap:8px">
            <strong>${f(v.title)}</strong><span class="muted small num">${L}</span>
          </div>
          <div class="muted small num" style="margin-bottom:6px">${Q} · ${$(K(v))} kg · ${B(v)} series</div>
          ${q.length?`<div class="mcal-feel">${q.map(A=>`<span class="chip-feel">${A}</span>`).join("")}</div>`:""}
          ${J}</div>`}).join("")}e.innerHTML=`<div class="sec-title">Calendario</div>
      <div class="card" style="padding:10px 12px">
        <div class="mcal-head">
          <button class="linklike" data-cal="prev" aria-label="Mes anterior">‹</button>
          <strong style="text-transform:capitalize">${f(a)}</strong>
          <button class="linklike" data-cal="next" aria-label="Mes siguiente">›</button>
        </div>
        <div class="mcal-grid">
          ${["L","M","X","J","V","S","D"].map(m=>`<span class="mcal-dow">${m}</span>`).join("")}
          ${p}
        </div>
        <div class="muted small" style="margin-top:8px"><span class="num">${h}</span> día${h===1?"":"s"} este mes</div>
      </div>
      ${g}`,e.querySelectorAll("[data-cal]").forEach(m=>m.addEventListener("click",()=>{const y=m.dataset.cal==="prev"?-1:1,v=new Date(x,S+y,1);x=v.getFullYear(),S=v.getMonth(),E=null,n()})),e.querySelectorAll("[data-day]").forEach(m=>m.addEventListener("click",()=>{const y=Number(m.dataset.day),v=E!==y;E=v?y:null,v?i(y).then(n):n()}))};n()}function W(e,t){return`<div class="card" style="padding:9px 12px">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <div><strong>${f(e.name)}</strong>
        <div class="muted small">${e.exercises.length} ejercicios${t?" · "+f(t):""}${e.dayOfWeek!==null?" · "+G[e.dayOfWeek]:""}</div>
      </div>
      <button class="btn small" data-act="routine:${e.id}">Empezar</button>
    </div></div>`}function le(){(async()=>await V()&&(await ce(),D("/train/active")))()}async function V(){const e=H();if(!e)return!0;const t=e.exercises.reduce((c,l)=>c+l.sets.filter(r=>r.done).length,0);return!t&&!e.exercises.length?!0:U(`Ya tienes «${e.title}» en curso con ${t} series registradas. ¿Descartarla y empezar de nuevo?`)}async function ce(){await I();const e={id:O(),title:"Sesión libre",startTime:Date.now(),endTime:null,description:"",exercises:[]};return w(e),e}async function re(e){return await I(),{id:O(),title:e.name,startTime:Date.now(),endTime:null,description:"",exercises:e.exercises.map(c=>({exerciseId:c.exerciseId,notes:c.notes||"",restSeconds:c.restSeconds??k.defaultRestSeconds,targetRepsMax:c.targetRepsMax??c.targetRepsMin??null,sets:Array.from({length:c.targetSets},(l,r)=>({setIndex:r,setType:"normal",weightKg:c.targetWeightKg,reps:c.targetRepsMax??c.targetRepsMin,distanceKm:null,durationSeconds:c.targetDurationSeconds,rpe:null,supersetId:null,done:!1}))}))}}async function de(e){if(!await V())return;const t=await re(e);w(t),D("/train/active")}let R=null,j=0;async function we(e){await I();const t=await b.workoutsDesc(60),c=H();if(!c){D("/train");return}const l=new Map;for(const o of t)if(o.id!==c.id)for(const n of o.exercises??[]){if(l.has(n.exerciseId))continue;const a=(n.sets??[]).filter(d=>d.done&&d.setType!=="warmup");if(!a.length)continue;const s=a.reduce((d,p)=>(p.weightKg??0)*(p.reps??0)>(d.weightKg??0)*(d.reps??0)?p:d);l.set(n.exerciseId,ue(s))}me(e,c,l);const u=setInterval(()=>{const o=document.getElementById("sess-clock");o&&(o.textContent=M(Date.now()-c.startTime))},1e3),i=new MutationObserver(()=>{document.contains(e)||(clearInterval(u),i.disconnect())});i.observe(document.body,{childList:!0,subtree:!0})}function ue(e){const t=[];return e.weightKg&&t.push($(e.weightKg)),e.reps&&t.push(`×${e.reps}`),e.durationSeconds&&t.push(`${e.durationSeconds}s`),e.distanceKm&&t.push(`${e.distanceKm}km`),t.join(" ")||"—"}function pe(e){switch(e?.type){case"bodyweight_reps":return[{key:"reps",label:"REPS"}];case"weighted_bodyweight":return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}];case"assisted_bodyweight":return[{key:"weightKg",label:"AYUDA"},{key:"reps",label:"REPS"}];case"duration":return[{key:"durationSeconds",label:"SEG"}];case"distance_duration":return[{key:"distanceKm",label:"KM"},{key:"durationSeconds",label:"SEG"}];case"weight_distance":return[{key:"weightKg",label:"KG"},{key:"distanceKm",label:"KM"}];default:return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}]}}function me(e,t,c){const l=new Set,r=()=>{w(t);let u=`
    <div class="card">
      <div style="display:flex;gap:8px;align-items:center">
        <input type="text" id="w-title" value="${f(t.title)}" aria-label="Título de la sesión" style="font-weight:700" />
      </div>
      <div class="row" style="margin-top:8px;align-items:center">
        <div class="muted small">⏱ <span id="sess-clock" class="num">${M(Date.now()-t.startTime)}</span></div>
        <div class="muted small num">Volumen: ${$(K(t))} kg</div>
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
    </div>`;t.exercises.forEach((o,n)=>{const a=T.get(o.exerciseId),s=pe(a),d=o.sets.find(p=>p.supersetId)?.supersetId;u+=`<div class="card" data-ex="${n}">
        <div style="display:flex;align-items:center;gap:8px">
          <button class="icon-btn small ss-toggle" data-ei="${n}" title="Seleccionar para superset" style="${l.has(n)?"border-color:var(--blue);color:var(--blue)":""}">⛓</button>
          ${a?.img?`<img class="ex-thumb" src="./${a.img}" alt="" loading="lazy" />`:`<span class="ex-thumb ex-thumb--ph" aria-hidden="true">${X.train}</span>`}
          <div style="flex:1;min-width:0"><strong>${f(F(o.exerciseId))}</strong>
          <div class="muted small">${f(a?.primaryMuscle??"")}${d?' · <span style="color:var(--blue)">superset</span>':""}</div></div>
          <button class="icon-btn small" data-plate="${n}" title="Calculadora de discos">◉</button>
          <button class="icon-btn small" data-note="${n}" title="Nota">✎</button>
          <button class="icon-btn small" data-del-ex="${n}" title="Quitar">✕</button>
        </div>
        ${o.notes?`<div class="small muted" style="margin-top:6px">✎ ${f(o.notes)}</div>`:""}
        <table class="set-table" style="margin-top:8px">
          <thead><tr><th></th><th>SERIE</th><th class="prev">ANT</th>${s.map(p=>`<th>${p.label}</th>`).join("")}${k.rpeEnabled?"<th>RPE</th>":""}<th>✓</th></tr></thead>
          <tbody>
          ${o.sets.map((p,h)=>`
            <tr class="${p.done?"set-done":""}">
              <td><button class="set-type ${p.setType}" data-stype="${n}:${h}" title="Tipo de serie">${se[p.setType]}</button></td>
              <td><span class="set-num">${p.setIndex+1}</span></td>
              <td class="prev">${f(c.get(o.exerciseId)??"—")}</td>
              ${s.map(g=>`<td><input type="text" inputmode="decimal" data-inp="${n}:${h}:${g.key}" value="${p[g.key]??""}" placeholder="–" ${p.done?"disabled":""}/></td>`).join("")}
              ${k.rpeEnabled?`<td><input type="text" inputmode="numeric" min="1" max="10" data-inp="${n}:${h}:rpe" value="${p.rpe??""}" placeholder="–" style="width:44px"/></td>`:""}
              <td><button class="check-btn ${p.done?"done":""}" data-check="${n}:${h}">✓</button></td>
            </tr>`).join("")}
          </tbody>
        </table>
        <div class="row" style="margin-top:8px">
          <button class="btn secondary small" data-add-set="${n}">＋ Serie</button>
          <button class="btn secondary small" data-rest="${n}">Descanso: ${o.restSeconds}s</button>
        </div>
      </div>`}),e.innerHTML=u,ve(e,t,c,r,l);const i=document.getElementById("ss-bar");l.size>0&&(i.style.display="flex",document.getElementById("ss-count").textContent=`${l.size} seleccionados`)};r()}function ve(e,t,c,l,r){document.getElementById("w-title")?.addEventListener("change",i=>{t.title=i.target.value.trim()||"Sesión libre",w(t)}),document.getElementById("w-add-ex")?.addEventListener("click",()=>fe(i=>{(async()=>{const o=await Z(i);t.exercises.push({exerciseId:i,notes:"",sets:[_(0)],restSeconds:o??k.defaultRestSeconds}),l()})()})),document.getElementById("w-finish")?.addEventListener("click",()=>be(t)),e.querySelectorAll("[data-inp]").forEach(i=>{i.addEventListener("change",()=>{const[o,n,a]=i.dataset.inp.split(":"),s=i.value;t.exercises[+o].sets[+n][a]=P(s),w(t)})});const u=["warmup","normal","failure","dropset"];e.querySelectorAll("[data-stype]").forEach(i=>{i.addEventListener("click",()=>{const[o,n]=i.dataset.stype.split(":").map(Number),a=t.exercises[o].sets[n];a.setType=u[(u.indexOf(a.setType)+1)%u.length],l()})}),e.querySelectorAll("[data-check]").forEach(i=>{i.addEventListener("click",()=>{const[o,n]=i.dataset.check.split(":").map(Number),a=t.exercises[o],s=a.sets[n];s.done=!s.done,w(t),s.done&&a.restSeconds>0&&he(a.restSeconds),l()})}),e.querySelectorAll("[data-add-set]").forEach(i=>{i.addEventListener("click",()=>{const o=+i.dataset.addSet,n=t.exercises[o],a=n.sets[n.sets.length-1],s=_(n.sets.length);a&&(s.weightKg=a.weightKg,s.reps=a.reps,s.durationSeconds=a.durationSeconds,s.distanceKm=a.distanceKm),n.sets.push(s),l()})}),e.querySelectorAll("[data-del-ex]").forEach(i=>{i.addEventListener("click",async()=>{const o=+i.dataset.delEx;await U("¿Quitar este ejercicio de la sesión?")&&(t.exercises.splice(o,1),l())})}),e.querySelectorAll("[data-note]").forEach(i=>{i.addEventListener("click",()=>{const o=+i.dataset.note,n=t.exercises[o].notes,a=window.prompt("Nota del ejercicio:",n);a!==null&&(t.exercises[o].notes=a,l())})}),e.querySelectorAll("[data-rest]").forEach(i=>{i.addEventListener("click",()=>{const o=+i.dataset.rest,n=window.prompt("Descanso (segundos):",String(t.exercises[o].restSeconds)),a=n!==null?parseInt(n,10):NaN;!Number.isNaN(a)&&a>=0&&(t.exercises[o].restSeconds=a,l())})}),e.querySelectorAll("[data-plate]").forEach(i=>{i.addEventListener("click",()=>ge(+i.dataset.plate))}),e.querySelectorAll(".ss-toggle").forEach(i=>{i.addEventListener("click",()=>{const o=+i.dataset.ei;r.has(o)?r.delete(o):r.add(o),l()})}),document.getElementById("ss-group")?.addEventListener("click",()=>{const i=O();r.forEach(o=>t.exercises[o].sets.forEach(n=>{n.supersetId=i})),r.clear(),C("Superset creado"),l()}),document.getElementById("ss-clear")?.addEventListener("click",()=>{r.forEach(i=>t.exercises[i].sets.forEach(o=>{o.supersetId=null})),r.clear(),l()})}function _(e){return{setIndex:e,setType:"normal",weightKg:null,reps:null,distanceKm:null,durationSeconds:null,rpe:null,supersetId:null,done:!1}}function fe(e){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`<div class="modal">
    <h3>Añadir ejercicio</h3>
    <input type="text" id="pk-q" placeholder="Buscar…" autocomplete="off" />
    <div class="chips" id="pk-muscles"></div>
    <div id="pk-list" style="margin-top:8px"></div>
    <button class="btn secondary" id="pk-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(t);const c=t.querySelector("#pk-q"),l=t.querySelector("#pk-list"),r=t.querySelector("#pk-muscles");let u="";const i=()=>{const n=[...new Set([...T.values()].map(a=>a.primaryMuscle))].sort();r.innerHTML=n.map(a=>`<button class="chip" data-m="${f(a)}">${f(a)}</button>`).join(""),r.querySelectorAll("[data-m]").forEach(a=>a.addEventListener("click",()=>{u=u===a.dataset.m?"":a.dataset.m,r.querySelectorAll(".chip").forEach(s=>s.classList.toggle("on",s.dataset.m===u)),o()}))},o=()=>{const n=c.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),a=[...T.values()].filter(s=>(!u||s.primaryMuscle===u)&&(!n||s.nameEs.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").includes(n))).sort((s,d)=>s.nameEs.localeCompare(d.nameEs,"es")).slice(0,60);l.innerHTML=a.length?a.map(s=>`<button class="ex-item" data-pick="${s.id}">
          ${s.img?`<img class="ex-thumb" src="./${s.img}" alt="" loading="lazy" />`:""}
          <span><span class="nm">${f(s.nameEs)}</span><br><span class="meta">${f(s.primaryMuscle)} · ${f(s.equipment)}</span></span>
          <span class="tag">${f(s.type==="duration"?"Tiempo":s.type==="bodyweight_reps"?"Corporal":"Peso")}</span>
        </button>`).join(""):'<div class="empty">Sin resultados.</div>',l.querySelectorAll("[data-pick]").forEach(s=>s.addEventListener("click",()=>{document.body.removeChild(t),e(s.dataset.pick)}))};c.addEventListener("input",o),t.querySelector("#pk-close")?.addEventListener("click",()=>document.body.removeChild(t)),t.addEventListener("click",n=>{n.target===t&&document.body.removeChild(t)}),I().then(()=>{i(),o()}),setTimeout(()=>c.focus(),50)}function ge(e){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`<div class="modal">
    <h3>Calculadora de discos</h3>
    <div class="row">
      <div><label class="f">Carga objetivo (kg)</label><input type="text" id="pl-target" inputmode="decimal" /></div>
      <div><label class="f">Barra (kg)</label><input type="text" id="pl-bar" value="${k.barKg}" inputmode="decimal" /></div>
    </div>
    <label class="f">Discos disponibles (kg, separados por comas)</label>
    <input type="text" id="pl-avail" value="${k.platesKg.join(", ")}" />
    <div id="pl-out" style="margin-top:10px"></div>
    <button class="btn secondary" id="pl-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(t);const c=t.querySelector("#pl-target"),l=t.querySelector("#pl-bar"),r=t.querySelector("#pl-avail"),u=t.querySelector("#pl-out"),i=()=>{const o=P(c.value);if(!o||o<=0){u.innerHTML="";return}const n=r.value.split(",").map(s=>Number(s.trim().replace(",","."))).filter(s=>s>0),a=ne(o,P(l.value)||20,n.length?n:void 0);u.innerHTML=`<div class="card">
      <div class="small muted">Por lado: <strong class="num">${$(a.perSideKg)} kg</strong></div>
      <div style="margin-top:6px">${a.platesPerSide.map(s=>`<div class="num">• ${s.count} × ${$(s.kg)} kg</div>`).join("")||'<span class="muted">Solo la barra</span>'}</div>
      <div class="small" style="margin-top:6px">Total: <strong class="num">${$(a.achievedKg)} kg</strong>${a.exact?"":' <span class="muted">(aprox.)</span>'}</div>
    </div>`};[c,l,r].forEach(o=>o.addEventListener("input",i)),t.querySelector("#pl-close")?.addEventListener("click",()=>document.body.removeChild(t)),t.addEventListener("click",o=>{o.target===t&&document.body.removeChild(t)}),setTimeout(()=>c.focus(),50)}function ye(){if(k?.soundEnabled){try{const e=new AudioContext;[0,.25,.5].forEach((t,c)=>{const l=e.createOscillator(),r=e.createGain();l.connect(r),r.connect(e.destination),l.frequency.value=c===2?880:660,l.start(e.currentTime+t),l.stop(e.currentTime+t+.18)}),setTimeout(()=>e.close(),1200)}catch{}try{navigator.vibrate?.(400)}catch{}}}function he(e){k||Y().then(r=>{k=r}),N(),j=Date.now()+e*1e3;const t=document.createElement("div");t.className="timer-overlay",t.id="rest-timer",t.innerHTML=`<div class="timer-card">
    <div class="muted small">DESCANSO</div>
    <div class="t num" id="rest-t">--</div>
    <div class="row">
      <button class="btn secondary small" id="rest-plus">+15s</button>
      <button class="btn small" id="rest-done">Listo</button>
    </div></div>`,document.body.appendChild(t);const c=t.querySelector("#rest-t"),l=()=>{const r=Math.max(0,Math.ceil((j-Date.now())/1e3));c.textContent=`${Math.floor(r/60)}:${String(r%60).padStart(2,"0")}`,r<=0&&(ye(),N(),C("¡Descanso terminado!"))};R=setInterval(l,250),l(),t.querySelector("#rest-plus")?.addEventListener("click",()=>{j+=15e3,l()}),t.querySelector("#rest-done")?.addEventListener("click",N)}function N(){R&&clearInterval(R),R=null,document.getElementById("rest-timer")?.remove()}async function be(e){const t=window.prompt("Descripción de la sesión (opcional):",e.description)??e.description;e.description=t,e.endTime=Date.now();const c=await b.workoutsDesc(200),l=ee(e,c.filter(g=>g.id!==e.id));await b.put("workouts",e),w(null),await ke(e);const r=K(e),u=B(e),i=document.createElement("div");i.className="modal-overlay",i.innerHTML=`<div class="modal">
    <h3>¡Sesión completada!</h3>
    <div class="kpis">
      <div class="kpi"><div class="kpi-val num">${M(e.endTime-e.startTime)}</div><div class="kpi-lab">Duración</div></div>
      <div class="kpi"><div class="kpi-val num">${$(r)}</div><div class="kpi-lab">Volumen kg</div></div>
      <div class="kpi"><div class="kpi-val num">${u}</div><div class="kpi-lab">Series</div></div>
      <div class="kpi"><div class="kpi-val num">${e.exercises.length}</div><div class="kpi-lab">Ejercicios</div></div>
    </div>
    ${l.length?'<div class="sec-title">Récords personales</div>'+l.map(g=>`<div class="pr"><span class="medal">★</span><span><strong>${f(F(g.exerciseId))}</strong> — ${f(g.kind)}: <span class="num">${f(g.value)}</span></span></div>`).join(""):'<div class="muted small">Sin nuevos récords esta vez. ¡A por la próxima!</div>'}
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
  </div>`,document.body.appendChild(i);let o=null,n=null;const a=i.querySelector("#fin-photo"),s=i.querySelector("#fin-photo-input");i.querySelector("#fin-photo-btn")?.addEventListener("click",()=>s.click()),s.addEventListener("change",async()=>{const g=s.files?.[0];if(s.value="",!!g)try{o=await te(g),n&&URL.revokeObjectURL(n),n=URL.createObjectURL(o),a.innerHTML=`<img class="fin-photo-prev" src="${n}" alt="Foto del entreno"><div><button class="linklike small" id="fin-photo-del" type="button">Quitar foto</button></div>`,a.querySelector("#fin-photo-del")?.addEventListener("click",()=>{o=null,n&&(URL.revokeObjectURL(n),n=null),a.innerHTML='<button class="btn small" id="fin-photo-btn2" type="button">📷 Subir foto</button>',a.querySelector("#fin-photo-btn2")?.addEventListener("click",()=>s.click())})}catch{C("No se pudo procesar la foto")}});const d=(g,m)=>{const y=i.querySelector(g),v=i.querySelector(m);let L=!1;return y.addEventListener("input",()=>{L=!0,v.textContent=y.value}),()=>L?Number(y.value):null},p=d("#fin-fatigue","#fin-fatigue-val"),h=d("#fin-satisfaction","#fin-satisfaction-val");i.querySelector("#fin-ok")?.addEventListener("click",async()=>{try{const g=p(),m=h();if(g!==null&&(e.fatigue=g),m!==null&&(e.satisfaction=m),await b.put("workouts",e),o){const y={workoutId:e.id,blob:o,createdAt:Date.now()};await b.put("workoutPhotos",y)}}catch{}n&&URL.revokeObjectURL(n),document.body.removeChild(i),D("/train")})}async function ke(e){try{const c=(await b.all("programState")).find(r=>r.active);if(!c)return;let l=!1;for(const r of e.exercises){const u=r.sets.filter(a=>a.done&&a.setType!=="warmup"&&a.weightKg&&a.reps);if(u.length<2)continue;const i=r.targetRepsMax??8,o=u.every(a=>(a.reps??0)>=i),n=c.loads[r.exerciseId]??Math.max(...u.map(a=>a.weightKg??0));o?(c.loads[r.exerciseId]=Math.round((n+2.5)*10)/10,l=!0):r.exerciseId in c.loads||(c.loads[r.exerciseId]=n)}l&&(c.currentDayIndex+=1,await b.put("programState",c),C("Progresión del programa actualizada"))}catch{}}export{X as ICONS,be as finishWorkout,fe as openExercisePicker,we as renderActiveWorkout,ie as renderTrainHome,ce as startFreeWorkout,he as startRestTimer,N as stopRestTimer,re as workoutFromRoutine};
