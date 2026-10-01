import{d as y,s as w,I as T,e as f,t as D,g as M,l as B,c as F,b as V,a as te,p as O}from"./index-BW0ufMRY.js";import{d as se,w as N,a as U,f as j,b as x}from"./stats-Cz7THz2Z.js";import{c as ae}from"./photo-B4nAdfpw.js";import{D as Q,u as z,S as ne}from"./types-CEDv8i23.js";const ie=[25,20,15,10,5,2.5,1.25];function oe(t,e=20,l=ie){const r=Math.max(0,(t-e)/2),c=[...l].sort((n,s)=>s-n),u=[];let o=r;for(const n of c){if(n<=0)continue;const s=Math.floor(o/n+1e-9);s>0&&(u.push({kg:n,count:s}),o=Math.round((o-s*n)*1e3)/1e3)}const i=u.reduce((n,s)=>n+s.kg*s.count,0),a=Math.round((e+i*2)*100)/100;return{perSideKg:Math.round(r*100)/100,platesPerSide:u,barKg:e,achievedKg:a,exact:Math.abs(a-t)<.001}}let I=new Map,$;async function q(){const t=await y.all("exercises");I=new Map(t.map(e=>[e.id,e])),$=await V()}function W(t){return I.get(t)?.nameEs??t.replace(/^desconocido:/,"")}async function ce(t){await q();const e=B(),l=await y.all("routines"),r=await y.all("folders"),c=new Map(r.map(s=>[s.id,s.name])),u=await y.workoutsDesc(8),o=new Date().getDay(),i=l.filter(s=>s.dayOfWeek===o);let a='<div class="screen-head"><h1>Entrenamiento</h1></div>';if(e&&(a+=`<div class="card" style="border-color:var(--blue)">
      <h3>Sesión en curso</h3>
      <div class="muted small">${f(e.title)} · ${e.exercises.length} ejercicios</div>
      <div class="row" style="margin-top:10px">
        <button class="btn" data-act="continue">Continuar</button>
        <button class="btn danger" data-act="discard">Descartar</button>
      </div></div>`),a+='<button class="btn" data-act="free">＋ Sesión libre</button>',a+='<div id="cal-home"></div>',i.length){a+=`<div class="sec-title">Hoy (${Q[o]})</div>`;for(const s of i)a+=Y(s,c.get(s.folderId??"")??"")}if(l.length){a+='<div class="sec-title">Rutinas</div>';for(const s of l.filter(d=>d.dayOfWeek!==o))a+=Y(s,c.get(s.folderId??"")??"")}else i.length||(a+='<div class="empty">Sin rutinas todavía.<br>Crea una en la pestaña Rutinas o empieza una sesión libre.</div>');a+='<div class="sec-title">Historial</div>',u.length||(a+='<div class="empty">Aún no hay entrenamientos registrados.</div>');for(const s of u){const d=new Date(s.startTime);a+=`<div class="card" style="padding:9px 12px">
      <div style="display:flex;justify-content:space-between;gap:8px">
        <strong>${f(s.title)}</strong>
        <span class="muted small num">${d.toLocaleDateString("es-ES",{day:"numeric",month:"short"})}</span>
      </div>
      <div class="muted small num">${x(N(s))} kg · ${U(s)} series · ${s.endTime?j(s.endTime-s.startTime):"—"}</div>
    </div>`}t.innerHTML=a;const n=t.querySelector("#cal-home");n&&le(n),t.querySelectorAll("[data-act]").forEach(s=>s.addEventListener("click",async()=>{const d=s.dataset.act;if(d==="free")re();else if(d==="continue")M("/train/active");else if(d==="discard")await F("¿Descartar la sesión en curso? Se perderá lo registrado.")&&(w(null),ce(t));else if(d.startsWith("routine:")){const g=l.find(b=>b.id===d.slice(8));g&&pe(g)}}))}let k=0,S=0,E=null;async function le(t){const e=new Date;k||(k=e.getFullYear(),S=e.getMonth());const l=await y.all("workouts"),r=new Map;for(const n of l){const s=new Date(n.startTime),d=s.getFullYear()+"-"+s.getMonth()+"-"+s.getDate(),g=r.get(d);g?g.push(n):r.set(d,[n])}const c=n=>k+"-"+S+"-"+n,u=new Map;async function o(n){for(const[,d]of u)URL.revokeObjectURL(d);u.clear();const s=r.get(c(n))??[];for(const d of s)try{const g=await y.get("workoutPhotos",d.id);g?.blob&&u.set(d.id,URL.createObjectURL(g.blob))}catch{}}const i=n=>{const s=(n.sets??[]).filter(d=>d.done&&d.setType!=="warmup");return s.length?s.map(d=>{const g=d.weightKg!=null&&d.weightKg>0?x(d.weightKg)+"×":"",b=d.reps??d.durationSeconds??d.distanceKm??"–";return g+b}).join(" · "):"—"},a=()=>{const n=new Date(k,S,1).toLocaleDateString("es-ES",{month:"long",year:"numeric"}),s=(new Date(k,S,1).getDay()+6)%7,d=new Date(k,S+1,0).getDate();let g="";for(let m=0;m<s;m++)g+="<span></span>";let b=0;for(let m=1;m<=d;m++){const h=r.has(c(m));h&&b++,g+=`<button class="mcal-day${h?" has":""}${E===m?" sel":""}" data-day="${m}"${h?"":" disabled"}>${m}</button>`}let p="";if(E!=null&&r.has(c(E))){const m=[...r.get(c(E))].sort((v,L)=>v.startTime-L.startTime);p=`<div class="sec-title">${E+" de "+new Date(k,S,1).toLocaleDateString("es-ES",{month:"long"})}</div>`+m.map(v=>{const L=new Date(v.startTime).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}),Z=v.endTime?j(v.endTime-v.startTime):"—",ee=(v.exercises??[]).map(R=>`<div class="mcal-ex"><span>${f(W(R.exerciseId))}</span><span class="num muted">${f(i(R))}</span></div>`).join(""),_=u.get(v.id),A=[];return v.fatigue!=null&&A.push(`Cansancio <b class="num">${v.fatigue}</b>/5`),v.satisfaction!=null&&A.push(`Satisfacción <b class="num">${v.satisfaction}</b>/5`),`<div class="card" style="padding:9px 12px;margin-bottom:8px">
          ${_?`<img class="mcal-photo" src="${_}" alt="Foto del entreno">`:""}
          <div style="display:flex;justify-content:space-between;gap:8px">
            <strong>${f(v.title)}</strong><span class="muted small num">${L}</span>
          </div>
          <div class="muted small num" style="margin-bottom:6px">${Z} · ${x(N(v))} kg · ${U(v)} series</div>
          ${A.length?`<div class="mcal-feel">${A.map(R=>`<span class="chip-feel">${R}</span>`).join("")}</div>`:""}
          ${ee}</div>`}).join("")}t.innerHTML=`<div class="sec-title">Calendario</div>
      <div class="card" style="padding:10px 12px">
        <div class="mcal-head">
          <button class="linklike" data-cal="prev" aria-label="Mes anterior">‹</button>
          <strong style="text-transform:capitalize">${f(n)}</strong>
          <button class="linklike" data-cal="next" aria-label="Mes siguiente">›</button>
        </div>
        <div class="mcal-grid">
          ${["L","M","X","J","V","S","D"].map(m=>`<span class="mcal-dow">${m}</span>`).join("")}
          ${g}
        </div>
        <div class="muted small" style="margin-top:8px"><span class="num">${b}</span> día${b===1?"":"s"} este mes</div>
      </div>
      ${p}`,t.querySelectorAll("[data-cal]").forEach(m=>m.addEventListener("click",()=>{const h=m.dataset.cal==="prev"?-1:1,v=new Date(k,S+h,1);k=v.getFullYear(),S=v.getMonth(),E=null,a()})),t.querySelectorAll("[data-day]").forEach(m=>m.addEventListener("click",()=>{const h=Number(m.dataset.day),v=E!==h;E=v?h:null,v?o(h).then(a):a()}))};a()}function Y(t,e){return`<div class="card" style="padding:9px 12px">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <div><strong>${f(t.name)}</strong>
        <div class="muted small">${t.exercises.length} ejercicios${e?" · "+f(e):""}${t.dayOfWeek!==null?" · "+Q[t.dayOfWeek]:""}</div>
      </div>
      <button class="btn small" data-act="routine:${t.id}">Empezar</button>
    </div></div>`}function re(){(async()=>await X()&&(await de(),M("/train/active")))()}async function X(){const t=B();if(!t)return!0;const e=t.exercises.reduce((l,r)=>l+r.sets.filter(c=>c.done).length,0);return!e&&!t.exercises.length?!0:F(`Ya tienes «${t.title}» en curso con ${e} series registradas. ¿Descartarla y empezar de nuevo?`)}async function de(){await q();const t={id:z(),title:"Sesión libre",startTime:Date.now(),endTime:null,description:"",exercises:[]};return w(t),t}async function ue(t){return await q(),{id:z(),title:t.name,startTime:Date.now(),endTime:null,description:"",exercises:t.exercises.map(l=>({exerciseId:l.exerciseId,notes:l.notes||"",restSeconds:l.restSeconds??$.defaultRestSeconds,targetRepsMax:l.targetRepsMax??l.targetRepsMin??null,sets:Array.from({length:l.targetSets},(r,c)=>({setIndex:c,setType:"normal",weightKg:l.targetWeightKg,reps:l.targetRepsMax??l.targetRepsMin,distanceKm:null,durationSeconds:l.targetDurationSeconds,rpe:null,supersetId:null,done:!1}))}))}}async function pe(t){if(!await X())return;const e=await ue(t);w(e),M("/train/active")}let K=null,P=0;async function Te(t){await q();const e=await y.workoutsDesc(60),l=B();if(!l){M("/train");return}const r=new Map;for(const i of e)if(i.id!==l.id)for(const a of i.exercises??[]){if(r.has(a.exerciseId))continue;const n=(a.sets??[]).filter(d=>d.done&&d.setType!=="warmup");if(!n.length)continue;const s=n.reduce((d,g)=>(g.weightKg??0)*(g.reps??0)>(d.weightKg??0)*(d.reps??0)?g:d);r.set(a.exerciseId,me(s))}fe(t,l,r);const u=setInterval(()=>{const i=document.getElementById("sess-clock");i&&(i.textContent=j(Date.now()-l.startTime))},1e3),o=new MutationObserver(()=>{document.contains(t)||(clearInterval(u),o.disconnect())});o.observe(document.body,{childList:!0,subtree:!0})}function me(t){const e=[];return t.weightKg&&e.push(x(t.weightKg)),t.reps&&e.push(`×${t.reps}`),t.durationSeconds&&e.push(`${t.durationSeconds}s`),t.distanceKm&&e.push(`${t.distanceKm}km`),e.join(" ")||"—"}function ve(t){switch(t?.type){case"bodyweight_reps":return[{key:"reps",label:"REPS"}];case"weighted_bodyweight":return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}];case"assisted_bodyweight":return[{key:"weightKg",label:"AYUDA"},{key:"reps",label:"REPS"}];case"duration":return[{key:"durationSeconds",label:"SEG"}];case"distance_duration":return[{key:"distanceKm",label:"KM"},{key:"durationSeconds",label:"SEG"}];case"weight_distance":return[{key:"weightKg",label:"KG"},{key:"distanceKm",label:"KM"}];default:return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}]}}function fe(t,e,l){const r=new Set,c=()=>{w(e);const u=r.size;let o=`
    <div class="card w-head">
      <div class="w-head-row">
        <div class="w-head-main">
          <input type="text" id="w-title" class="w-title" value="${f(e.title)}" aria-label="Título de la sesión" />
          <div class="muted small" style="margin-top:4px"><span id="sess-clock" class="num">${j(Date.now()-e.startTime)}</span> · Volumen: <span class="num">${x(N(e))} kg</span></div>
        </div>
        ${u>0?`
        <div class="w-sel">
          <div class="small muted" id="w-sel-count">${u===1?"1 ejercicio seleccionado":`${u} ejercicios seleccionados`}</div>
          <div class="w-sel-btns">
            <button class="btn small" id="w-sel-group">Agrupar</button>
            <button class="linklike" id="w-sel-clear">Limpiar</button>
          </div>
        </div>`:""}
      </div>
    </div>`;e.exercises.forEach((i,a)=>{const n=I.get(i.exerciseId),s=ve(n),d=i.sets.find(p=>p.supersetId)?.supersetId,g=[n?.equipment,n?.primaryMuscle].filter(Boolean).join(" · "),b=r.has(a);o+=`<div class="card ex-card" data-ex="${a}">
        <div class="ex-top">
          ${n?.img?`<img class="ex-thumb ex-thumb--lg" src="./${n.img}" alt="" loading="lazy" />`:`<span class="ex-thumb ex-thumb--lg ex-thumb--ph" aria-hidden="true">${T.train}</span>`}
          <div class="ex-meta"><strong>${f(W(i.exerciseId))}</strong>
          <div class="muted small">${f(g)}${d?' · <span style="color:var(--blue)">superset</span>':""}</div></div>
          <button class="icon-btn ghost" data-menu="${a}" title="Opciones" aria-label="Opciones del ejercicio">⋮</button>
        </div>
        <div class="ex-actions">
          <button class="action-seg action-icon${b?" on":""}" data-select="${a}" title="Seleccionar" aria-label="Seleccionar ejercicio">${T.select}</button>
          <button class="action-seg action-icon" data-plate="${a}" title="Calculadora de discos" aria-label="Calculadora de discos">◎</button>
          <button class="action-seg action-icon" data-note="${a}" title="Editar nota" aria-label="Editar nota del ejercicio">${T.pencil}</button>
        </div>
        ${i.notes?`<div class="small muted ex-note">✎ ${f(i.notes)}</div>`:""}
        <table class="set-table roomy">
          <thead><tr><th>SERIE</th>${s.map(p=>`<th>${p.label}</th>`).join("")}${$.rpeEnabled?"<th>RPE</th>":""}<th>HECHA</th></tr></thead>
          <tbody>
          ${i.sets.map((p,m)=>`
            <tr class="${p.done?"set-done":""}">
              <td class="set-serie">
                <button class="set-num" data-stype="${a}:${m}" title="Tipo de serie">${p.setIndex+1}</button>
                <span class="set-type-pill ${p.setType}">${f(ne[p.setType])}</span>
                <div class="set-prev">Anterior: ${f(l.get(i.exerciseId)??"—")}</div>
              </td>
              ${s.map(h=>`<td><input type="text" inputmode="decimal" data-inp="${a}:${m}:${h.key}" value="${p[h.key]??""}" placeholder="–" ${p.done?"disabled":""}/></td>`).join("")}
              ${$.rpeEnabled?`<td><input type="text" inputmode="numeric" min="1" max="10" data-inp="${a}:${m}:rpe" value="${p.rpe??""}" placeholder="–" style="max-width:56px"/></td>`:""}
              <td><button class="check-btn ${p.done?"done":""}" data-check="${a}:${m}" aria-label="Marcar serie hecha">✓</button></td>
            </tr>`).join("")}
          </tbody>
        </table>
        <button class="rest-row" data-rest="${a}"><span><span class="inl-ic">${T.clock}</span>Descanso: ${i.restSeconds} s</span><span class="chev" aria-hidden="true">›</span></button>
        <button class="btn add-set" data-add-set="${a}">+ Añadir serie</button>
      </div>`}),o+=`
    <div class="w-foot">
      <button class="btn secondary w-foot-btn" id="w-add-ex">＋ Añadir ejercicio</button>
      <button class="btn w-foot-btn" id="w-finish">Terminar</button>
    </div>`,t.innerHTML=o,ge(t,e,l,c,r)};c()}function ge(t,e,l,r,c){document.getElementById("w-title")?.addEventListener("change",o=>{e.title=o.target.value.trim()||"Sesión libre",w(e)}),document.getElementById("w-add-ex")?.addEventListener("click",()=>ye(o=>{(async()=>{const i=await te(o);e.exercises.push({exerciseId:o,notes:"",sets:[G(0)],restSeconds:i??$.defaultRestSeconds}),r()})()})),document.getElementById("w-finish")?.addEventListener("click",()=>ke(e)),document.getElementById("w-sel-group")?.addEventListener("click",()=>{if(c.size<2){D("Selecciona al menos 2 ejercicios");return}const o=z();c.forEach(i=>e.exercises[i].sets.forEach(a=>{a.supersetId=o})),c.clear(),D("Superset creado"),r()}),document.getElementById("w-sel-clear")?.addEventListener("click",()=>{c.clear(),r()}),t.querySelectorAll("[data-select]").forEach(o=>{o.addEventListener("click",()=>{const i=+o.dataset.select;c.has(i)?c.delete(i):c.add(i),r()})}),t.querySelectorAll("[data-menu]").forEach(o=>{o.addEventListener("click",i=>{i.stopPropagation();const a=+o.dataset.menu;he(o,a,e,r)})}),t.querySelectorAll("[data-inp]").forEach(o=>{o.addEventListener("change",()=>{const[i,a,n]=o.dataset.inp.split(":"),s=o.value;e.exercises[+i].sets[+a][n]=O(s),w(e)})});const u=["warmup","normal","failure","dropset"];t.querySelectorAll("[data-stype]").forEach(o=>{o.addEventListener("click",()=>{const[i,a]=o.dataset.stype.split(":").map(Number),n=e.exercises[i].sets[a];n.setType=u[(u.indexOf(n.setType)+1)%u.length],r()})}),t.querySelectorAll("[data-check]").forEach(o=>{o.addEventListener("click",()=>{const[i,a]=o.dataset.check.split(":").map(Number),n=e.exercises[i],s=n.sets[a];s.done=!s.done,w(e),s.done&&n.restSeconds>0&&$e(n.restSeconds),r()})}),t.querySelectorAll("[data-add-set]").forEach(o=>{o.addEventListener("click",()=>{const i=+o.dataset.addSet,a=e.exercises[i],n=a.sets[a.sets.length-1],s=G(a.sets.length);n&&(s.weightKg=n.weightKg,s.reps=n.reps,s.durationSeconds=n.durationSeconds,s.distanceKm=n.distanceKm),a.sets.push(s),r()})}),t.querySelectorAll("[data-note]").forEach(o=>{o.addEventListener("click",()=>{const i=+o.dataset.note,a=e.exercises[i].notes,n=window.prompt("Nota del ejercicio:",a);n!==null&&(e.exercises[i].notes=n,r())})}),t.querySelectorAll("[data-rest]").forEach(o=>{o.addEventListener("click",()=>{const i=+o.dataset.rest,a=window.prompt("Descanso (segundos):",String(e.exercises[i].restSeconds)),n=a!==null?parseInt(a,10):NaN;!Number.isNaN(n)&&n>=0&&(e.exercises[i].restSeconds=n,r())})}),t.querySelectorAll("[data-plate]").forEach(o=>{o.addEventListener("click",()=>J(+o.dataset.plate))})}function he(t,e,l,r){C();const c=document.createElement("div");c.className="ex-menu",c.id="ex-menu-pop";const u=[{label:"Ver ejercicio",fn:()=>M(`/exercises?detail=${l.exercises[e].exerciseId}`)},{label:"Nota",fn:()=>{const i=window.prompt("Nota del ejercicio:",l.exercises[e].notes);i!==null&&(l.exercises[e].notes=i,r())}},{label:"Calculadora de discos",fn:()=>J()},{label:"Quitar ejercicio",fn:()=>{(async()=>await F("¿Quitar este ejercicio de la sesión?")&&(l.exercises.splice(e,1),r()))()}}];c.innerHTML=u.map((i,a)=>`<button data-mi="${a}">${f(i.label)}</button>`).join(""),document.body.appendChild(c);const o=t.getBoundingClientRect();c.style.top=`${o.bottom+window.scrollY+6}px`,c.style.left=`${Math.max(8,o.right+window.scrollX-210)}px`,c.querySelectorAll("[data-mi]").forEach(i=>i.addEventListener("click",()=>{const a=u[+i.dataset.mi].fn;C(),a()})),setTimeout(()=>{document.addEventListener("click",C,{once:!0}),document.addEventListener("keydown",i=>{i.key==="Escape"&&C()},{once:!0})},0)}function C(){document.getElementById("ex-menu-pop")?.remove()}function G(t){return{setIndex:t,setType:"normal",weightKg:null,reps:null,distanceKm:null,durationSeconds:null,rpe:null,supersetId:null,done:!1}}function ye(t){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`<div class="modal">
    <h3>Añadir ejercicio</h3>
    <input type="text" id="pk-q" placeholder="Buscar…" autocomplete="off" />
    <select id="pk-muscle" style="margin-top:8px" aria-label="Filtrar por músculo"></select>
    <div id="pk-list" style="margin-top:8px"></div>
    <button class="btn secondary" id="pk-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(e);const l=e.querySelector("#pk-q"),r=e.querySelector("#pk-list"),c=e.querySelector("#pk-muscle");let u="";const o=()=>{const a=[...new Set([...I.values()].map(n=>n.primaryMuscle))].sort();c.innerHTML='<option value="">Todos los músculos</option>'+a.map(n=>`<option value="${f(n)}" ${n===u?"selected":""}>${f(n)}</option>`).join("")};c.addEventListener("change",()=>{u=c.value,i()});const i=()=>{const a=l.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),n=[...I.values()].filter(s=>(!u||s.primaryMuscle===u)&&(!a||s.nameEs.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").includes(a))).sort((s,d)=>s.nameEs.localeCompare(d.nameEs,"es")).slice(0,60);r.innerHTML=n.length?n.map(s=>`<button class="ex-item" data-pick="${s.id}">
          ${s.img?`<img class="ex-thumb" src="./${s.img}" alt="" loading="lazy" />`:""}
          <span><span class="nm">${f(s.nameEs)}</span><br><span class="meta">${f(s.primaryMuscle)} · ${f(s.equipment)}</span></span>
          <span class="tag">${f(s.type==="duration"?"Tiempo":s.type==="bodyweight_reps"?"Corporal":"Peso")}</span>
        </button>`).join(""):'<div class="empty">Sin resultados.</div>',r.querySelectorAll("[data-pick]").forEach(s=>s.addEventListener("click",()=>{document.body.removeChild(e),t(s.dataset.pick)}))};l.addEventListener("input",i),e.querySelector("#pk-close")?.addEventListener("click",()=>document.body.removeChild(e)),e.addEventListener("click",a=>{a.target===e&&document.body.removeChild(e)}),q().then(()=>{o(),i()}),setTimeout(()=>l.focus(),50)}function J(t){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`<div class="modal">
    <h3>Calculadora de discos</h3>
    <div class="row">
      <div><label class="f">Carga objetivo (kg)</label><input type="text" id="pl-target" inputmode="decimal" /></div>
      <div><label class="f">Barra (kg)</label><input type="text" id="pl-bar" value="${$.barKg}" inputmode="decimal" /></div>
    </div>
    <label class="f">Discos disponibles (kg, separados por comas)</label>
    <input type="text" id="pl-avail" value="${$.platesKg.join(", ")}" />
    <div id="pl-out" style="margin-top:10px"></div>
    <button class="btn secondary" id="pl-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(e);const l=e.querySelector("#pl-target"),r=e.querySelector("#pl-bar"),c=e.querySelector("#pl-avail"),u=e.querySelector("#pl-out"),o=()=>{const i=O(l.value);if(!i||i<=0){u.innerHTML="";return}const a=c.value.split(",").map(s=>Number(s.trim().replace(",","."))).filter(s=>s>0),n=oe(i,O(r.value)||20,a.length?a:void 0);u.innerHTML=`<div class="card">
      <div class="small muted">Por lado: <strong class="num">${x(n.perSideKg)} kg</strong></div>
      <div style="margin-top:6px">${n.platesPerSide.map(s=>`<div class="num">• ${s.count} × ${x(s.kg)} kg</div>`).join("")||'<span class="muted">Solo la barra</span>'}</div>
      <div class="small" style="margin-top:6px">Total: <strong class="num">${x(n.achievedKg)} kg</strong>${n.exact?"":' <span class="muted">(aprox.)</span>'}</div>
    </div>`};[l,r,c].forEach(i=>i.addEventListener("input",o)),e.querySelector("#pl-close")?.addEventListener("click",()=>document.body.removeChild(e)),e.addEventListener("click",i=>{i.target===e&&document.body.removeChild(e)}),setTimeout(()=>l.focus(),50)}function be(){if($?.soundEnabled){try{const t=new AudioContext;[0,.25,.5].forEach((e,l)=>{const r=t.createOscillator(),c=t.createGain();r.connect(c),c.connect(t.destination),r.frequency.value=l===2?880:660,r.start(t.currentTime+e),r.stop(t.currentTime+e+.18)}),setTimeout(()=>t.close(),1200)}catch{}try{navigator.vibrate?.(400)}catch{}}}function $e(t){$||V().then(c=>{$=c}),H(),P=Date.now()+t*1e3;const e=document.createElement("div");e.className="timer-overlay",e.id="rest-timer",e.innerHTML=`<div class="timer-card">
    <div class="muted small">DESCANSO</div>
    <div class="t num" id="rest-t">--</div>
    <div class="row">
      <button class="btn secondary small" id="rest-plus">+15s</button>
      <button class="btn small" id="rest-done">Listo</button>
    </div></div>`,document.body.appendChild(e);const l=e.querySelector("#rest-t"),r=()=>{const c=Math.max(0,Math.ceil((P-Date.now())/1e3));l.textContent=`${Math.floor(c/60)}:${String(c%60).padStart(2,"0")}`,c<=0&&(be(),H(),D("¡Descanso terminado!"))};K=setInterval(r,250),r(),e.querySelector("#rest-plus")?.addEventListener("click",()=>{P+=15e3,r()}),e.querySelector("#rest-done")?.addEventListener("click",H)}function H(){K&&clearInterval(K),K=null,document.getElementById("rest-timer")?.remove()}async function ke(t){const e=window.prompt("Descripción de la sesión (opcional):",t.description)??t.description;t.description=e,t.endTime=Date.now();const l=await y.workoutsDesc(200),r=se(t,l.filter(p=>p.id!==t.id));await y.put("workouts",t),w(null),await xe(t);const c=N(t),u=U(t),o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`<div class="modal">
    <h3>¡Sesión completada!</h3>
    <div class="kpis">
      <div class="kpi"><div class="kpi-val num">${j(t.endTime-t.startTime)}</div><div class="kpi-lab">Duración</div></div>
      <div class="kpi"><div class="kpi-val num">${x(c)}</div><div class="kpi-lab">Volumen kg</div></div>
      <div class="kpi"><div class="kpi-val num">${u}</div><div class="kpi-lab">Series</div></div>
      <div class="kpi"><div class="kpi-val num">${t.exercises.length}</div><div class="kpi-lab">Ejercicios</div></div>
    </div>
    ${r.length?'<div class="sec-title">Récords personales</div>'+r.map(p=>`<div class="pr"><span class="medal">★</span><span><strong>${f(W(p.exerciseId))}</strong> — ${f(p.kind)}: <span class="num">${f(p.value)}</span></span></div>`).join(""):'<div class="muted small">Sin nuevos récords esta vez. ¡A por la próxima!</div>'}
    <div class="sec-title" style="margin-top:14px">Foto y sensaciones <span class="muted small">(opcional)</span></div>
    <div class="fin-photo" id="fin-photo">
      <button class="btn small" id="fin-photo-btn" type="button"><span class="inl-ic">${T.camera}</span>Subir foto</button>
      <input type="file" id="fin-photo-input" accept="image/*" hidden>
    </div>
    <div class="fin-seg">
      <div class="fin-seg-head"><span>Cansancio</span></div>
      <div class="seg" id="fin-fatigue-seg" role="radiogroup" aria-label="Cansancio de 1 a 5">
        ${[1,2,3,4,5].map(p=>`<button type="button" data-v="${p}" role="radio" aria-label="${p}">${p}</button>`).join("")}
      </div>
      <div class="fin-seg-scale"><span>Nada</span><span>Reventado</span></div>
    </div>
    <div class="fin-seg">
      <div class="fin-seg-head"><span>Satisfacción</span></div>
      <div class="seg" id="fin-satisfaction-seg" role="radiogroup" aria-label="Satisfacción de 1 a 5">
        ${[1,2,3,4,5].map(p=>`<button type="button" data-v="${p}" role="radio" aria-label="${p}">${p}</button>`).join("")}
      </div>
      <div class="fin-seg-scale"><span>Fatal</span><span>Brutal</span></div>
    </div>
    <button class="btn" id="fin-ok" style="margin-top:12px">Hecho</button>
  </div>`,document.body.appendChild(o);let i=null,a=null;const n=o.querySelector("#fin-photo"),s=o.querySelector("#fin-photo-input");o.querySelector("#fin-photo-btn")?.addEventListener("click",()=>s.click()),s.addEventListener("change",async()=>{const p=s.files?.[0];if(s.value="",!!p)try{i=await ae(p),a&&URL.revokeObjectURL(a),a=URL.createObjectURL(i),n.innerHTML=`<img class="fin-photo-prev" src="${a}" alt="Foto del entreno"><div><button class="linklike small" id="fin-photo-del" type="button">Quitar foto</button></div>`,n.querySelector("#fin-photo-del")?.addEventListener("click",()=>{i=null,a&&(URL.revokeObjectURL(a),a=null),n.innerHTML=`<button class="btn small" id="fin-photo-btn2" type="button"><span class="inl-ic">${T.camera}</span>Subir foto</button>`,n.querySelector("#fin-photo-btn2")?.addEventListener("click",()=>s.click())})}catch{D("No se pudo procesar la foto")}});const d=p=>{const m=o.querySelector(p);let h=null;return m.querySelectorAll("button").forEach(v=>{v.addEventListener("click",()=>{h=Number(v.dataset.v),m.querySelectorAll("button").forEach(L=>L.classList.toggle("on",L===v))})}),()=>h},g=d("#fin-fatigue-seg"),b=d("#fin-satisfaction-seg");o.querySelector("#fin-ok")?.addEventListener("click",async()=>{try{const p=g(),m=b();if(p!==null&&(t.fatigue=p),m!==null&&(t.satisfaction=m),await y.put("workouts",t),i){const h={workoutId:t.id,blob:i,createdAt:Date.now()};await y.put("workoutPhotos",h)}}catch{}a&&URL.revokeObjectURL(a),document.body.removeChild(o),M("/train")})}async function xe(t){try{const l=(await y.all("programState")).find(c=>c.active);if(!l)return;let r=!1;for(const c of t.exercises){const u=c.sets.filter(n=>n.done&&n.setType!=="warmup"&&n.weightKg&&n.reps);if(u.length<2)continue;const o=c.targetRepsMax??8,i=u.every(n=>(n.reps??0)>=o),a=l.loads[c.exerciseId]??Math.max(...u.map(n=>n.weightKg??0));i?(l.loads[c.exerciseId]=Math.round((a+2.5)*10)/10,r=!0):c.exerciseId in l.loads||(l.loads[c.exerciseId]=a)}r&&(l.currentDayIndex+=1,await y.put("programState",l),D("Progresión del programa actualizada"))}catch{}}export{T as ICONS,ke as finishWorkout,ye as openExercisePicker,Te as renderActiveWorkout,ce as renderTrainHome,de as startFreeWorkout,$e as startRestTimer,H as stopRestTimer,ue as workoutFromRoutine};
