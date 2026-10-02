import{d as y,s as L,I as M,e as h,t as T,g as D,l as z,c as P,b as X,a as se,p as I}from"./index-Dtjz58Wl.js";import{d as ae,w as H,a as W,f as A,b as S}from"./stats-CJKsKY2L.js";import{c as ne}from"./photo-B4nAdfpw.js";import{D as J,u as Y,S as ie}from"./types-CEDv8i23.js";const oe=[25,20,15,10,5,2.5,1.25];function le(t,e=20,l=oe){const c=Math.max(0,(t-e)/2),r=[...l].sort((a,n)=>n-a),u=[];let o=c;for(const a of r){if(a<=0)continue;const n=Math.floor(o/a+1e-9);n>0&&(u.push({kg:a,count:n}),o=Math.round((o-n*a)*1e3)/1e3)}const i=u.reduce((a,n)=>a+n.kg*n.count,0),s=Math.round((e+i*2)*100)/100;return{perSideKg:Math.round(c*100)/100,platesPerSide:u,barKg:e,achievedKg:s,exact:Math.abs(s-t)<.001}}let j=new Map,x;async function q(){const t=await y.all("exercises");j=new Map(t.map(e=>[e.id,e])),x=await X()}function _(t){return t?j.get(t)?.nameEs??t.replace(/^desconocido:/,""):"Ejercicio"}async function ce(t){await q();const e=z(),l=await y.all("routines"),c=await y.all("folders"),r=new Map(c.map(n=>[n.id,n.name])),u=await y.workoutsDesc(8),o=new Date().getDay(),i=l.filter(n=>n.dayOfWeek===o);let s='<div class="screen-head"><h1>Entrenamiento</h1></div>';if(e&&(s+=`<div class="card" style="border-color:var(--blue)">
      <h3>Sesión en curso</h3>
      <div class="muted small">${h(e.title)} · ${e.exercises.length} ejercicios</div>
      <div class="row" style="margin-top:10px">
        <button class="btn" data-act="continue">Continuar</button>
        <button class="btn danger" data-act="discard">Descartar</button>
      </div></div>`),s+='<button class="btn" data-act="free">＋ Sesión libre</button>',s+='<div id="cal-home"></div>',i.length){s+=`<div class="sec-title">Hoy (${J[o]})</div>`;for(const n of i)s+=V(n,r.get(n.folderId??"")??"")}if(l.length){s+='<div class="sec-title">Rutinas</div>';for(const n of l.filter(d=>d.dayOfWeek!==o))s+=V(n,r.get(n.folderId??"")??"")}else i.length||(s+='<div class="empty">Sin rutinas todavía.<br>Crea una en la pestaña Rutinas o empieza una sesión libre.</div>');s+='<div class="sec-title">Historial</div>',u.length||(s+='<div class="empty">Aún no hay entrenamientos registrados.</div>');for(const n of u){const d=new Date(n.startTime);s+=`<div class="card" style="padding:9px 12px">
      <div style="display:flex;justify-content:space-between;gap:8px">
        <strong>${h(n.title)}</strong>
        <span class="muted small num">${d.toLocaleDateString("es-ES",d.getFullYear()===new Date().getFullYear()?{day:"numeric",month:"short"}:{day:"numeric",month:"short",year:"numeric"})}</span>
      </div>
      <div class="muted small num">${S(H(n))} kg · ${W(n)} series · ${n.endTime?A(n.endTime-n.startTime):"—"}</div>
    </div>`}t.innerHTML=s;const a=t.querySelector("#cal-home");a&&re(a),t.querySelectorAll("[data-act]").forEach(n=>n.addEventListener("click",async()=>{const d=n.dataset.act;if(d==="free")de();else if(d==="continue")D("/train/active");else if(d==="discard")await P("¿Descartar la sesión en curso? Se perderá lo registrado.")&&(L(null),ce(t));else if(d.startsWith("routine:")){const v=l.find(b=>b.id===d.slice(8));v&&me(v)}}))}let $=0,E=0,w=null;async function re(t){const e=new Date;$||($=e.getFullYear(),E=e.getMonth());const l=await y.all("workouts"),c=new Map;for(const a of l){const n=new Date(a.startTime),d=n.getFullYear()+"-"+n.getMonth()+"-"+n.getDate(),v=c.get(d);v?v.push(a):c.set(d,[a])}const r=a=>$+"-"+E+"-"+a,u=new Map;async function o(a){for(const[,d]of u)URL.revokeObjectURL(d);u.clear();const n=c.get(r(a))??[];for(const d of n)try{const v=await y.get("workoutPhotos",d.id);v?.blob&&u.set(d.id,URL.createObjectURL(v.blob))}catch{}}const i=a=>{const n=(a.sets??[]).filter(d=>d.done&&d.setType!=="warmup");return n.length?n.map(d=>{const v=d.weightKg!=null&&d.weightKg>0?S(d.weightKg)+"×":"",b=d.reps??d.durationSeconds??d.distanceKm??"–";return v+b}).join(" · "):"—"},s=()=>{const a=new Date($,E,1).toLocaleDateString("es-ES",{month:"long",year:"numeric"}),n=(new Date($,E,1).getDay()+6)%7,d=new Date($,E+1,0).getDate();let v="";for(let m=0;m<n;m++)v+="<span></span>";let b=0;for(let m=1;m<=d;m++){const g=c.has(r(m));g&&b++,v+=`<button class="mcal-day${g?" has":""}${w===m?" sel":""}" data-day="${m}"${g?"":" disabled"}>${m}</button>`}let p="";if(w!=null&&c.has(r(w))){const m=[...c.get(r(w))].sort((f,k)=>f.startTime-k.startTime);p=`<div class="sec-title">${w+" de "+new Date($,E,1).toLocaleDateString("es-ES",{month:"long"})}</div>`+m.map(f=>{const k=new Date(f.startTime).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}),F=f.endTime?A(f.endTime-f.startTime):"—",te=(f.exercises??[]).map(C=>`<div class="mcal-ex"><span>${h(_(C.exerciseId))}</span><span class="num muted">${h(i(C))}</span></div>`).join(""),G=u.get(f.id),R=[];return f.fatigue!=null&&R.push(`Cansancio <b class="num">${f.fatigue}</b>/5`),f.satisfaction!=null&&R.push(`Satisfacción <b class="num">${f.satisfaction}</b>/5`),`<div class="card" style="padding:9px 12px;margin-bottom:8px">
          ${G?`<img class="mcal-photo" src="${G}" alt="Foto del entreno">`:""}
          <div style="display:flex;justify-content:space-between;gap:8px">
            <strong>${h(f.title)}</strong><span class="muted small num">${k}</span>
          </div>
          <div class="muted small num" style="margin-bottom:6px">${F} · ${S(H(f))} kg · ${W(f)} series</div>
          ${R.length?`<div class="mcal-feel">${R.map(C=>`<span class="chip-feel">${C}</span>`).join("")}</div>`:""}
          ${te}
          <div style="margin-top:8px;text-align:right"><button class="linklike small" data-delw="${f.id}" style="color:var(--danger,#e5484d)">Eliminar entreno</button></div></div>`}).join("")}t.innerHTML=`<div class="sec-title">Calendario</div>
      <div class="card" style="padding:10px 12px">
        <div class="mcal-head">
          <button class="linklike" data-cal="prev" aria-label="Mes anterior">‹</button>
          <strong style="text-transform:capitalize">${h(a)}</strong>
          <button class="linklike" data-cal="next" aria-label="Mes siguiente">›</button>
        </div>
        <div class="mcal-grid">
          ${["L","M","X","J","V","S","D"].map(m=>`<span class="mcal-dow">${m}</span>`).join("")}
          ${v}
        </div>
        <div class="muted small" style="margin-top:8px"><span class="num">${b}</span> día${b===1?"":"s"} este mes</div>
      </div>
      ${p}`,t.querySelectorAll("[data-cal]").forEach(m=>m.addEventListener("click",()=>{const g=m.dataset.cal==="prev"?-1:1,f=new Date($,E+g,1);$=f.getFullYear(),E=f.getMonth(),w=null,s()})),t.querySelectorAll("[data-day]").forEach(m=>m.addEventListener("click",()=>{const g=Number(m.dataset.day),f=w!==g;w=f?g:null,f?o(g).then(s):s()})),t.querySelectorAll("[data-delw]").forEach(m=>m.addEventListener("click",()=>{const g=m.dataset.delw,f=l.find(k=>k.id===g);(async()=>{if(!await P(`¿Eliminar el entreno «${f?.title??""}»? Esta acción no se puede deshacer.`))return;await y.del("workouts",g),await y.del("workoutPhotos",g).catch(()=>{});const k=l.findIndex(F=>F.id===g);k>=0&&l.splice(k,1),u.delete(g),T("Entreno eliminado"),s()})()}))};s()}function V(t,e){return`<div class="card" style="padding:9px 12px">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <div><strong>${h(t.name)}</strong>
        <div class="muted small">${(t.exercises??[]).length} ejercicios${e?" · "+h(e):""}${t.dayOfWeek!==null?" · "+J[t.dayOfWeek]:""}</div>
      </div>
      <button class="btn small" data-act="routine:${t.id}">Empezar</button>
    </div></div>`}function de(){(async()=>await Z()&&(await ue(),D("/train/active")))()}async function Z(){const t=z();if(!t)return!0;const e=t.exercises.reduce((l,c)=>l+c.sets.filter(r=>r.done).length,0);return!e&&!t.exercises.length?!0:P(`Ya tienes «${t.title}» en curso con ${e} series registradas. ¿Descartarla y empezar de nuevo?`)}async function ue(){await q();const t={id:Y(),title:"Sesión libre",startTime:Date.now(),endTime:null,description:"",exercises:[]};return L(t),t}async function pe(t){return await q(),{id:Y(),title:t.name,startTime:Date.now(),endTime:null,description:"",exercises:(t.exercises??[]).map(l=>({exerciseId:l.exerciseId,notes:l.notes||"",restSeconds:l.restSeconds??x.defaultRestSeconds,targetRepsMax:l.targetRepsMax??l.targetRepsMin??null,sets:Array.from({length:Math.min(Math.max(0,Math.floor(l.targetSets??0)),100)},(c,r)=>({setIndex:r,setType:"normal",weightKg:l.targetWeightKg,reps:l.targetRepsMax??l.targetRepsMin,distanceKm:null,durationSeconds:l.targetDurationSeconds,rpe:null,supersetId:null,done:!1}))}))}}async function me(t){if(!await Z())return;const e=await pe(t);L(e),D("/train/active")}let N=null,B=0;async function Me(t){await q();const e=await y.workoutsDesc(60),l=z();if(!l){D("/train");return}const c=new Map;for(const i of e)if(i.id!==l.id)for(const s of i.exercises??[]){if(c.has(s.exerciseId))continue;const a=(s.sets??[]).filter(d=>d.done&&d.setType!=="warmup");if(!a.length)continue;const n=a.reduce((d,v)=>(v.weightKg??0)*(v.reps??0)>(d.weightKg??0)*(d.reps??0)?v:d);c.set(s.exerciseId,ve(n))}ge(t,l,c);const u=setInterval(()=>{const i=document.getElementById("sess-clock");i&&(i.textContent=A(Date.now()-l.startTime))},1e3),o=new MutationObserver(()=>{document.contains(t)||(clearInterval(u),o.disconnect())});o.observe(document.body,{childList:!0,subtree:!0})}function ve(t){const e=[];return t.weightKg&&e.push(S(t.weightKg)),t.reps&&e.push(`×${t.reps}`),t.durationSeconds&&e.push(`${t.durationSeconds}s`),t.distanceKm&&e.push(`${t.distanceKm}km`),e.join(" ")||"—"}function fe(t){switch(t?.type){case"bodyweight_reps":return[{key:"reps",label:"REPS"}];case"weighted_bodyweight":return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}];case"assisted_bodyweight":return[{key:"weightKg",label:"AYUDA"},{key:"reps",label:"REPS"}];case"duration":return[{key:"durationSeconds",label:"SEG"}];case"distance_duration":return[{key:"distanceKm",label:"KM"},{key:"durationSeconds",label:"SEG"}];case"weight_distance":return[{key:"weightKg",label:"KG"},{key:"distanceKm",label:"KM"}];default:return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}]}}function ge(t,e,l){const c=new Set,r=()=>{L(e);const u=c.size;let o=`
    <div class="card w-head">
      <div class="w-head-row">
        <div class="w-head-main">
          <input type="text" id="w-title" class="w-title" value="${h(e.title)}" aria-label="Título de la sesión" />
          <div class="muted small" style="margin-top:4px"><span id="sess-clock" class="num">${A(Date.now()-e.startTime)}</span> · Volumen: <span class="num">${S(H(e))} kg</span></div>
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
    </div>`;e.exercises.forEach((i,s)=>{const a=j.get(i.exerciseId),n=fe(a),d=i.sets.find(p=>p.supersetId)?.supersetId,v=[a?.equipment,a?.primaryMuscle].filter(Boolean).join(" · "),b=c.has(s);o+=`<div class="card ex-card" data-ex="${s}">
        <div class="ex-top">
          ${a?.img?`<img class="ex-thumb ex-thumb--lg" src="./${a.img}" alt="" loading="lazy" />`:`<span class="ex-thumb ex-thumb--lg ex-thumb--ph" aria-hidden="true">${M.train}</span>`}
          <div class="ex-meta"><strong>${h(_(i.exerciseId))}</strong>
          <div class="muted small">${h(v)}${d?' · <span style="color:var(--blue)">superset</span>':""}</div></div>
          <button class="icon-btn ghost" data-menu="${s}" title="Opciones" aria-label="Opciones del ejercicio">⋮</button>
        </div>
        <div class="ex-actions">
          <button class="action-seg action-icon${b?" on":""}" data-select="${s}" title="Seleccionar" aria-label="Seleccionar ejercicio">${M.select}</button>
          <button class="action-seg action-icon" data-plate="${s}" title="Calculadora de discos" aria-label="Calculadora de discos">◎</button>
          <button class="action-seg action-icon" data-note="${s}" title="Editar nota" aria-label="Editar nota del ejercicio">${M.pencil}</button>
        </div>
        ${i.notes?`<div class="small muted ex-note">✎ ${h(i.notes)}</div>`:""}
        <table class="set-table roomy">
          <thead><tr><th>SERIE</th>${n.map(p=>`<th>${p.label}</th>`).join("")}${x.rpeEnabled?"<th>RPE</th>":""}<th>HECHA</th></tr></thead>
          <tbody>
          ${i.sets.map((p,m)=>`
            <tr class="${p.done?"set-done":""}">
              <td class="set-serie">
                <button class="set-num" data-stype="${s}:${m}" title="Tipo de serie">${p.setIndex+1}</button>
                <span class="set-type-pill ${p.setType}">${h(ie[p.setType])}</span>
                <div class="set-prev">Anterior: ${h(l.get(i.exerciseId)??"—")}</div>
              </td>
              ${n.map(g=>`<td><input type="text" inputmode="decimal" data-inp="${s}:${m}:${g.key}" value="${p[g.key]??""}" placeholder="–" ${p.done?"disabled":""}/></td>`).join("")}
              ${x.rpeEnabled?`<td><input type="text" inputmode="numeric" min="1" max="10" data-inp="${s}:${m}:rpe" value="${p.rpe??""}" placeholder="–" style="max-width:56px"/></td>`:""}
              <td><button class="check-btn ${p.done?"done":""}" data-check="${s}:${m}" aria-label="Marcar serie hecha">✓</button></td>
            </tr>`).join("")}
          </tbody>
        </table>
        <button class="rest-row" data-rest="${s}"><span><span class="inl-ic">${M.clock}</span>Descanso: ${i.restSeconds} s</span><span class="chev" aria-hidden="true">›</span></button>
        <button class="btn add-set" data-add-set="${s}">+ Añadir serie</button>
      </div>`}),o+=`
    <div class="w-foot">
      <button class="btn secondary w-foot-btn" id="w-add-ex">＋ Añadir ejercicio</button>
      <button class="btn w-foot-btn" id="w-finish">Terminar</button>
    </div>`,t.innerHTML=o,he(t,e,l,r,c)};r()}function he(t,e,l,c,r){document.getElementById("w-title")?.addEventListener("change",o=>{e.title=o.target.value.trim()||"Sesión libre",L(e)}),document.getElementById("w-add-ex")?.addEventListener("click",()=>be(o=>{(async()=>{const i=await se(o);e.exercises.push({exerciseId:o,notes:"",sets:[Q(0)],restSeconds:i??x.defaultRestSeconds}),c()})()})),document.getElementById("w-finish")?.addEventListener("click",()=>$e(e)),document.getElementById("w-sel-group")?.addEventListener("click",()=>{for(const i of[...r])e.exercises[i]||r.delete(i);if(r.size<2){T("Selecciona al menos 2 ejercicios");return}const o=Y();r.forEach(i=>e.exercises[i].sets.forEach(s=>{s.supersetId=o})),r.clear(),T("Superset creado"),c()}),document.getElementById("w-sel-clear")?.addEventListener("click",()=>{r.clear(),c()}),t.querySelectorAll("[data-select]").forEach(o=>{o.addEventListener("click",()=>{const i=+o.dataset.select;r.has(i)?r.delete(i):r.add(i),c()})}),t.querySelectorAll("[data-menu]").forEach(o=>{o.addEventListener("click",i=>{i.stopPropagation();const s=+o.dataset.menu;ye(o,s,e,c,r)})}),t.querySelectorAll("[data-inp]").forEach(o=>{o.addEventListener("change",()=>{const[i,s,a]=o.dataset.inp.split(":"),n=o.value;e.exercises[+i].sets[+s][a]=I(n),L(e)})});const u=["warmup","normal","failure","dropset"];t.querySelectorAll("[data-stype]").forEach(o=>{o.addEventListener("click",()=>{const[i,s]=o.dataset.stype.split(":").map(Number),a=e.exercises[i].sets[s];a.setType=u[(u.indexOf(a.setType)+1)%u.length],c()})}),t.querySelectorAll("[data-check]").forEach(o=>{o.addEventListener("click",()=>{const[i,s]=o.dataset.check.split(":").map(Number),a=e.exercises[i],n=a.sets[s];n.done=!n.done,L(e),n.done&&a.restSeconds>0&&xe(a.restSeconds),c()})}),t.querySelectorAll("[data-add-set]").forEach(o=>{o.addEventListener("click",()=>{const i=+o.dataset.addSet,s=e.exercises[i],a=s.sets[s.sets.length-1],n=Q(s.sets.length);a&&(n.weightKg=a.weightKg,n.reps=a.reps,n.durationSeconds=a.durationSeconds,n.distanceKm=a.distanceKm),s.sets.push(n),c()})}),t.querySelectorAll("[data-note]").forEach(o=>{o.addEventListener("click",()=>{const i=+o.dataset.note,s=e.exercises[i].notes,a=window.prompt("Nota del ejercicio:",s);a!==null&&(e.exercises[i].notes=a,c())})}),t.querySelectorAll("[data-rest]").forEach(o=>{o.addEventListener("click",()=>{const i=+o.dataset.rest,s=window.prompt("Descanso (segundos):",String(e.exercises[i].restSeconds)),a=s!==null?parseInt(s,10):NaN;!Number.isNaN(a)&&a>=0&&(e.exercises[i].restSeconds=a,c())})}),t.querySelectorAll("[data-plate]").forEach(o=>{o.addEventListener("click",()=>ee(+o.dataset.plate))})}function ye(t,e,l,c,r){K();const u=document.createElement("div");u.className="ex-menu",u.id="ex-menu-pop";const o=[{label:"Ver ejercicio",fn:()=>D(`/exercises?detail=${l.exercises[e].exerciseId}`)},{label:"Nota",fn:()=>{const s=window.prompt("Nota del ejercicio:",l.exercises[e].notes);s!==null&&(l.exercises[e].notes=s,c())}},{label:"Calculadora de discos",fn:()=>ee()},...l.exercises[e].sets.some(s=>s.supersetId)?[{label:"Disolver superset",fn:()=>{const s=l.exercises[e].sets.find(a=>a.supersetId)?.supersetId;for(const a of l.exercises)for(const n of a.sets)n.supersetId===s&&(n.supersetId=null);T("Superset disuelto"),c()}}]:[],{label:"Quitar ejercicio",fn:()=>{(async()=>await P("¿Quitar este ejercicio de la sesión?")&&(l.exercises.splice(e,1),r?.clear(),c()))()}}];u.innerHTML=o.map((s,a)=>`<button data-mi="${a}">${h(s.label)}</button>`).join(""),document.body.appendChild(u);const i=t.getBoundingClientRect();u.style.top=`${i.bottom+window.scrollY+6}px`,u.style.left=`${Math.max(8,i.right+window.scrollX-210)}px`,u.querySelectorAll("[data-mi]").forEach(s=>s.addEventListener("click",()=>{const a=o[+s.dataset.mi].fn;K(),a()})),setTimeout(()=>{document.addEventListener("click",K,{once:!0}),document.addEventListener("keydown",s=>{s.key==="Escape"&&K()},{once:!0})},0)}function K(){document.getElementById("ex-menu-pop")?.remove()}function Q(t){return{setIndex:t,setType:"normal",weightKg:null,reps:null,distanceKm:null,durationSeconds:null,rpe:null,supersetId:null,done:!1}}function be(t){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`<div class="modal">
    <h3>Añadir ejercicio</h3>
    <input type="text" id="pk-q" placeholder="Buscar…" autocomplete="off" />
    <select id="pk-muscle" style="margin-top:8px" aria-label="Filtrar por músculo"></select>
    <div id="pk-list" style="margin-top:8px"></div>
    <button class="btn secondary" id="pk-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(e);const l=e.querySelector("#pk-q"),c=e.querySelector("#pk-list"),r=e.querySelector("#pk-muscle");let u="";const o=()=>{const s=[...new Set([...j.values()].map(a=>a.primaryMuscle))].sort();r.innerHTML='<option value="">Todos los músculos</option>'+s.map(a=>`<option value="${h(a)}" ${a===u?"selected":""}>${h(a)}</option>`).join("")};r.addEventListener("change",()=>{u=r.value,i()});const i=()=>{const s=l.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),a=[...j.values()].filter(n=>(!u||n.primaryMuscle===u)&&(!s||n.nameEs.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").includes(s))).sort((n,d)=>n.nameEs.localeCompare(d.nameEs,"es")).slice(0,60);c.innerHTML=a.length?a.map(n=>`<button class="ex-item" data-pick="${n.id}">
          ${n.img?`<img class="ex-thumb" src="./${n.img}" alt="" loading="lazy" />`:""}
          <span><span class="nm">${h(n.nameEs)}</span><br><span class="meta">${h(n.primaryMuscle)} · ${h(n.equipment)}</span></span>
          <span class="tag">${h(n.type==="duration"?"Tiempo":n.type==="bodyweight_reps"?"Corporal":"Peso")}</span>
        </button>`).join(""):'<div class="empty">Sin resultados.</div>',c.querySelectorAll("[data-pick]").forEach(n=>n.addEventListener("click",()=>{document.body.removeChild(e),t(n.dataset.pick)}))};l.addEventListener("input",i),e.querySelector("#pk-close")?.addEventListener("click",()=>document.body.removeChild(e)),e.addEventListener("click",s=>{s.target===e&&document.body.removeChild(e)}),q().then(()=>{o(),i()}),setTimeout(()=>l.focus(),50)}function ee(t){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`<div class="modal">
    <h3>Calculadora de discos</h3>
    <div class="row">
      <div><label class="f">Carga objetivo (kg)</label><input type="text" id="pl-target" inputmode="decimal" /></div>
      <div><label class="f">Barra (kg)</label><input type="text" id="pl-bar" value="${x.barKg}" inputmode="decimal" /></div>
    </div>
    <label class="f">Discos disponibles (kg, separados por comas)</label>
    <input type="text" id="pl-avail" value="${x.platesKg.join(", ")}" />
    <div id="pl-out" style="margin-top:10px"></div>
    <button class="btn secondary" id="pl-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(e);const l=e.querySelector("#pl-target"),c=e.querySelector("#pl-bar"),r=e.querySelector("#pl-avail"),u=e.querySelector("#pl-out"),o=()=>{const i=I(l.value);if(!i||i<=0){u.innerHTML="";return}const s=r.value.trim(),a=I(s),n=a!==null?[a]:s.split(",").map(v=>I(v)).filter(v=>v!==null&&v>0),d=le(i,I(c.value)||20,n.length?n:void 0);u.innerHTML=`<div class="card">
      <div class="small muted">Por lado: <strong class="num">${S(d.perSideKg)} kg</strong></div>
      <div style="margin-top:6px">${d.platesPerSide.map(v=>`<div class="num">• ${v.count} × ${S(v.kg)} kg</div>`).join("")||'<span class="muted">Solo la barra</span>'}</div>
      <div class="small" style="margin-top:6px">Total: <strong class="num">${S(d.achievedKg)} kg</strong>${d.exact?"":' <span class="muted">(aprox.)</span>'}</div>
    </div>`};[l,c,r].forEach(i=>i.addEventListener("input",o)),e.querySelector("#pl-close")?.addEventListener("click",()=>document.body.removeChild(e)),e.addEventListener("click",i=>{i.target===e&&document.body.removeChild(e)}),setTimeout(()=>l.focus(),50)}function ke(){if(x?.soundEnabled){try{const t=new AudioContext;[0,.25,.5].forEach((e,l)=>{const c=t.createOscillator(),r=t.createGain();c.connect(r),r.connect(t.destination),c.frequency.value=l===2?880:660,c.start(t.currentTime+e),c.stop(t.currentTime+e+.18)}),setTimeout(()=>t.close(),1200)}catch{}try{navigator.vibrate?.(400)}catch{}}}function xe(t){x||X().then(r=>{x=r}),O(),B=Date.now()+t*1e3;const e=document.createElement("div");e.className="timer-overlay",e.id="rest-timer",e.innerHTML=`<div class="timer-card">
    <div class="muted small">DESCANSO</div>
    <div class="t num" id="rest-t">--</div>
    <div class="row">
      <button class="btn secondary small" id="rest-plus">+15s</button>
      <button class="btn small" id="rest-done">Listo</button>
    </div></div>`,document.body.appendChild(e);const l=e.querySelector("#rest-t"),c=()=>{const r=Math.max(0,Math.ceil((B-Date.now())/1e3));l.textContent=`${Math.floor(r/60)}:${String(r%60).padStart(2,"0")}`,r<=0&&(ke(),O(),T("¡Descanso terminado!"))};N=setInterval(c,250),c(),e.querySelector("#rest-plus")?.addEventListener("click",()=>{B+=15e3,c()}),e.querySelector("#rest-done")?.addEventListener("click",O)}function O(){N&&clearInterval(N),N=null,document.getElementById("rest-timer")?.remove()}let U=!1;async function $e(t){if(U)return;U=!0,document.getElementById("w-finish")?.setAttribute("disabled","");const e=window.prompt("Descripción de la sesión (opcional):",t.description)??t.description;t.description=e,t.endTime=Date.now();const l=await y.workoutsDesc(200),c=ae(t,l.filter(p=>p.id!==t.id));await y.put("workouts",t),L(null),await Se(t);const r=H(t),u=W(t),o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`<div class="modal">
    <h3>¡Sesión completada!</h3>
    <div class="kpis">
      <div class="kpi"><div class="kpi-val num">${A(t.endTime-t.startTime)}</div><div class="kpi-lab">Duración</div></div>
      <div class="kpi"><div class="kpi-val num">${S(r)}</div><div class="kpi-lab">Volumen kg</div></div>
      <div class="kpi"><div class="kpi-val num">${u}</div><div class="kpi-lab">Series</div></div>
      <div class="kpi"><div class="kpi-val num">${t.exercises.length}</div><div class="kpi-lab">Ejercicios</div></div>
    </div>
    ${c.length?'<div class="sec-title">Récords personales</div>'+c.map(p=>`<div class="pr"><span class="medal">★</span><span><strong>${h(_(p.exerciseId))}</strong> — ${h(p.kind)}: <span class="num">${h(p.value)}</span></span></div>`).join(""):'<div class="muted small">Sin nuevos récords esta vez. ¡A por la próxima!</div>'}
    <div class="sec-title" style="margin-top:14px">Foto y sensaciones <span class="muted small">(opcional)</span></div>
    <div class="fin-photo" id="fin-photo">
      <button class="btn small" id="fin-photo-btn" type="button"><span class="inl-ic">${M.camera}</span>Subir foto</button>
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
  </div>`,document.body.appendChild(o);let i=null,s=null;const a=o.querySelector("#fin-photo"),n=o.querySelector("#fin-photo-input");o.querySelector("#fin-photo-btn")?.addEventListener("click",()=>n.click()),n.addEventListener("change",async()=>{const p=n.files?.[0];if(n.value="",!!p)try{i=await ne(p),s&&URL.revokeObjectURL(s),s=URL.createObjectURL(i),a.innerHTML=`<img class="fin-photo-prev" src="${s}" alt="Foto del entreno"><div><button class="linklike small" id="fin-photo-del" type="button">Quitar foto</button></div>`,a.querySelector("#fin-photo-del")?.addEventListener("click",()=>{i=null,s&&(URL.revokeObjectURL(s),s=null),a.innerHTML=`<button class="btn small" id="fin-photo-btn2" type="button"><span class="inl-ic">${M.camera}</span>Subir foto</button>`,a.querySelector("#fin-photo-btn2")?.addEventListener("click",()=>n.click())})}catch{T("No se pudo procesar la foto")}});const d=p=>{const m=o.querySelector(p);let g=null;return m.querySelectorAll("button").forEach(f=>{f.addEventListener("click",()=>{g=Number(f.dataset.v),m.querySelectorAll("button").forEach(k=>k.classList.toggle("on",k===f))})}),()=>g},v=d("#fin-fatigue-seg"),b=d("#fin-satisfaction-seg");o.querySelector("#fin-ok")?.addEventListener("click",async()=>{try{const p=v(),m=b();if(p!==null&&(t.fatigue=p),m!==null&&(t.satisfaction=m),await y.put("workouts",t),i){const g={workoutId:t.id,blob:i,createdAt:Date.now()};await y.put("workoutPhotos",g)}}catch{}s&&URL.revokeObjectURL(s),o.remove(),U=!1,D("/train")})}async function Se(t){try{const l=(await y.all("programState")).find(r=>r.active);if(!l)return;let c=!1;for(const r of t.exercises){const u=r.sets.filter(a=>a.done&&a.setType!=="warmup"&&a.weightKg&&a.reps);if(u.length<2)continue;const o=r.targetRepsMax??8,i=u.every(a=>(a.reps??0)>=o),s=l.loads[r.exerciseId]??Math.max(...u.map(a=>a.weightKg??0));i?(l.loads[r.exerciseId]=Math.round((s+2.5)*10)/10,c=!0):r.exerciseId in l.loads||(l.loads[r.exerciseId]=s)}c&&(l.currentDayIndex+=1,await y.put("programState",l),T("Progresión del programa actualizada"))}catch{}}export{M as ICONS,$e as finishWorkout,be as openExercisePicker,Me as renderActiveWorkout,ce as renderTrainHome,ue as startFreeWorkout,xe as startRestTimer,O as stopRestTimer,pe as workoutFromRoutine};
