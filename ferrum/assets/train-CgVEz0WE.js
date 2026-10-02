const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./social-BpVr9vDk.js","./index-ghZyYm5z.js","./index-Cul74FXV.css","./stats-CJKsKY2L.js","./types-CEDv8i23.js","./friends-B5cY_VJd.js","./backup-BQk9JEUJ.js"])))=>i.map(i=>d[i]);
import{d as b,s as w,I,e as h,t as T,_ as P,g as M,c as C,l as W,b as X,a as ae,p as A}from"./index-ghZyYm5z.js";import{d as ne,w as z,a as J,f as H,b as L}from"./stats-CJKsKY2L.js";import{c as ie}from"./photo-B4nAdfpw.js";import{D as Z,u as V,S as oe}from"./types-CEDv8i23.js";const ce=[25,20,15,10,5,2.5,1.25];function le(e,t=20,o=ce){const r=Math.max(0,(e-t)/2),d=[...o].sort((s,c)=>c-s),u=[];let i=r;for(const s of d){if(s<=0)continue;const c=Math.floor(i/s+1e-9);c>0&&(u.push({kg:s,count:c}),i=Math.round((i-c*s)*1e3)/1e3)}const n=u.reduce((s,c)=>s+c.kg*c.count,0),a=Math.round((t+n*2)*100)/100;return{perSideKg:Math.round(r*100)/100,platesPerSide:u,barKg:t,achievedKg:a,exact:Math.abs(a-e)<.001}}let q=new Map,x;async function R(){const e=await b.all("exercises");q=new Map(e.map(t=>[t.id,t])),x=await X()}function O(e){return e?q.get(e)?.nameEs??e.replace(/^desconocido:/,""):"Ejercicio"}async function re(e){await R();const t=W(),o=await b.all("routines"),r=await b.all("folders"),d=new Map(r.map(c=>[c.id,c.name])),u=new Date().getDay(),i=o.filter(c=>c.dayOfWeek===u);let n='<div class="screen-head"><h1>Entrenamiento</h1></div>';if(t&&(n+=`<div class="card" style="border-color:var(--blue)">
      <h3>Sesión en curso</h3>
      <div class="muted small">${h(t.title)} · ${t.exercises.length} ejercicios</div>
      <div class="row" style="margin-top:10px">
        <button class="btn" data-act="continue">Continuar</button>
        <button class="btn danger" data-act="discard">Descartar</button>
      </div></div>`),n+='<button class="btn" data-act="free">＋ Sesión libre</button>',n+='<div id="cal-home"></div>',i.length){n+=`<div class="sec-title">Hoy (${Z[u]})</div>`;for(const c of i)n+=G(c,d.get(c.folderId??"")??"")}if(o.length){n+='<div class="sec-title">Rutinas</div>';for(const c of o.filter(l=>l.dayOfWeek!==u))n+=G(c,d.get(c.folderId??"")??"")}else i.length||(n+='<div class="empty">Sin rutinas todavía.<br>Crea una en la pestaña Rutinas o empieza una sesión libre.</div>');n+='<div class="sec-title">Amigos</div><div id="train-feed"></div>',e.innerHTML=n;const a=e.querySelector("#cal-home");a&&de(a);const s=e.querySelector("#train-feed");if(s){const{getSocialConfig:c}=await P(async()=>{const{getSocialConfig:p}=await import("./social-BpVr9vDk.js");return{getSocialConfig:p}},__vite__mapDeps([0,1,2,3,4]),import.meta.url),l=c();l?(async()=>{try{const{renderFeedList:p}=await P(async()=>{const{renderFeedList:y}=await import("./friends-B5cY_VJd.js");return{renderFeedList:y}},__vite__mapDeps([5,1,2,3,4,0]),import.meta.url);await p(s,l,{limit:15})}catch{s.innerHTML='<div class="empty small">Sin conexión: no se pudo cargar.</div>'}})():(s.innerHTML=`<div class="card"><p class="small muted" style="margin-top:0">Los entrenos de tu círculo aparecen aquí.</p>
        <button class="btn secondary small" id="train-feed-setup" type="button">Configurar Amigos</button></div>`,s.querySelector("#train-feed-setup")?.addEventListener("click",()=>M("/friends")))}e.querySelectorAll("[data-act]").forEach(c=>c.addEventListener("click",async()=>{const l=c.dataset.act;if(l==="free")ue();else if(l==="continue")M("/train/active");else if(l==="discard")await C("¿Descartar la sesión en curso? Se perderá lo registrado.")&&(w(null),re(e));else if(l.startsWith("routine:")){const p=o.find(y=>y.id===l.slice(8));p&&ve(p)}}))}let $=0,S=0,E=null;async function de(e){const t=new Date;$||($=t.getFullYear(),S=t.getMonth());const o=await b.all("workouts"),r=new Map;for(const s of o){const c=new Date(s.startTime),l=c.getFullYear()+"-"+c.getMonth()+"-"+c.getDate(),p=r.get(l);p?p.push(s):r.set(l,[s])}const d=s=>$+"-"+S+"-"+s,u=new Map;async function i(s){for(const[,l]of u)URL.revokeObjectURL(l);u.clear();const c=r.get(d(s))??[];for(const l of c)try{const p=await b.get("workoutPhotos",l.id);p?.blob&&u.set(l.id,URL.createObjectURL(p.blob))}catch{}}const n=s=>{const c=(s.sets??[]).filter(l=>l.done&&l.setType!=="warmup");return c.length?c.map(l=>{const p=l.weightKg!=null&&l.weightKg>0?L(l.weightKg)+"×":"",y=l.reps??l.durationSeconds??l.distanceKm??"–";return p+y}).join(" · "):"—"},a=()=>{const s=new Date($,S,1).toLocaleDateString("es-ES",{month:"long",year:"numeric"}),c=(new Date($,S,1).getDay()+6)%7,l=new Date($,S+1,0).getDate();let p="";for(let v=0;v<c;v++)p+="<span></span>";let y=0;for(let v=1;v<=l;v++){const g=r.has(d(v));g&&y++,p+=`<button class="mcal-day${g?" has":""}${E===v?" sel":""}" data-day="${v}"${g?"":" disabled"}>${v}</button>`}let m="";if(E!=null&&r.has(d(E))){const v=[...r.get(d(E))].sort((f,k)=>f.startTime-k.startTime);m=`<div class="sec-title">${E+" de "+new Date($,S,1).toLocaleDateString("es-ES",{month:"long"})}</div>`+v.map(f=>{const k=new Date(f.startTime).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}),D=f.endTime?H(f.endTime-f.startTime):"—",se=(f.exercises??[]).map(K=>`<div class="mcal-ex"><span>${h(O(K.exerciseId))}</span><span class="num muted">${h(n(K))}</span></div>`).join(""),Y=u.get(f.id),j=[];return f.fatigue!=null&&j.push(`Cansancio <b class="num">${f.fatigue}</b>/5`),f.satisfaction!=null&&j.push(`Satisfacción <b class="num">${f.satisfaction}</b>/5`),`<div class="card" style="padding:9px 12px;margin-bottom:8px">
          ${Y?`<img class="mcal-photo" src="${Y}" alt="Foto del entreno">`:""}
          <div style="display:flex;justify-content:space-between;gap:8px">
            <strong>${h(f.title)}</strong><span class="muted small num">${k}</span>
          </div>
          <div class="muted small num" style="margin-bottom:6px">${D} · ${L(z(f))} kg · ${J(f)} series</div>
          ${j.length?`<div class="mcal-feel">${j.map(K=>`<span class="chip-feel">${K}</span>`).join("")}</div>`:""}
          ${se}
          <div style="margin-top:8px;text-align:right"><button class="linklike small" data-delw="${f.id}" style="color:var(--danger,#e5484d)">Eliminar entreno</button></div></div>`}).join("")}e.innerHTML=`<div class="sec-title">Calendario</div>
      <div class="card" style="padding:10px 12px">
        <div class="mcal-head">
          <button class="linklike" data-cal="prev" aria-label="Mes anterior">‹</button>
          <strong style="text-transform:capitalize">${h(s)}</strong>
          <button class="linklike" data-cal="next" aria-label="Mes siguiente">›</button>
        </div>
        <div class="mcal-grid">
          ${["L","M","X","J","V","S","D"].map(v=>`<span class="mcal-dow">${v}</span>`).join("")}
          ${p}
        </div>
        <div class="muted small" style="margin-top:8px"><span class="num">${y}</span> día${y===1?"":"s"} este mes</div>
      </div>
      ${m}`,e.querySelectorAll("[data-cal]").forEach(v=>v.addEventListener("click",()=>{const g=v.dataset.cal==="prev"?-1:1,f=new Date($,S+g,1);$=f.getFullYear(),S=f.getMonth(),E=null,a()})),e.querySelectorAll("[data-day]").forEach(v=>v.addEventListener("click",()=>{const g=Number(v.dataset.day),f=E!==g;E=f?g:null,f?i(g).then(a):a()})),e.querySelectorAll("[data-delw]").forEach(v=>v.addEventListener("click",()=>{const g=v.dataset.delw,f=o.find(k=>k.id===g);(async()=>{if(!await C(`¿Eliminar el entreno «${f?.title??""}»? Esta acción no se puede deshacer.`))return;await b.del("workouts",g),await b.del("workoutPhotos",g).catch(()=>{});const k=o.findIndex(D=>D.id===g);k>=0&&o.splice(k,1),u.delete(g),T("Entreno eliminado"),a()})()}))};a()}function G(e,t){return`<div class="card" style="padding:9px 12px">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <div><strong>${h(e.name)}</strong>
        <div class="muted small">${(e.exercises??[]).length} ejercicios${t?" · "+h(t):""}${e.dayOfWeek!==null?" · "+Z[e.dayOfWeek]:""}</div>
      </div>
      <button class="btn small" data-act="routine:${e.id}">Empezar</button>
    </div></div>`}function ue(){(async()=>await ee()&&(await pe(),M("/train/active")))()}async function ee(){const e=W();if(!e)return!0;const t=e.exercises.reduce((o,r)=>o+r.sets.filter(d=>d.done).length,0);return!t&&!e.exercises.length?!0:C(`Ya tienes «${e.title}» en curso con ${t} series registradas. ¿Descartarla y empezar de nuevo?`)}async function pe(){await R();const e={id:V(),title:"Sesión libre",startTime:Date.now(),endTime:null,description:"",exercises:[]};return w(e),e}async function me(e){return await R(),{id:V(),title:e.name,startTime:Date.now(),endTime:null,description:"",exercises:(e.exercises??[]).map(o=>({exerciseId:o.exerciseId,notes:o.notes||"",restSeconds:o.restSeconds??x.defaultRestSeconds,targetRepsMax:o.targetRepsMax??o.targetRepsMin??null,sets:Array.from({length:Math.min(Math.max(0,Math.floor(o.targetSets??0)),100)},(r,d)=>({setIndex:d,setType:"normal",weightKg:o.targetWeightKg,reps:o.targetRepsMax??o.targetRepsMin,distanceKm:null,durationSeconds:o.targetDurationSeconds,rpe:null,supersetId:null,done:!1}))}))}}async function ve(e){if(!await ee())return;const t=await me(e);w(t),M("/train/active")}let N=null,B=0;async function Ie(e){await R();const t=await b.workoutsDesc(60),o=W();if(!o){M("/train");return}const r=new Map;for(const n of t)if(n.id!==o.id)for(const a of n.exercises??[]){if(r.has(a.exerciseId))continue;const s=(a.sets??[]).filter(l=>l.done&&l.setType!=="warmup");if(!s.length)continue;const c=s.reduce((l,p)=>(p.weightKg??0)*(p.reps??0)>(l.weightKg??0)*(l.reps??0)?p:l);r.set(a.exerciseId,fe(c))}he(e,o,r);const u=setInterval(()=>{const n=document.getElementById("sess-clock");n&&(n.textContent=H(Date.now()-o.startTime))},1e3),i=new MutationObserver(()=>{document.contains(e)||(clearInterval(u),i.disconnect())});i.observe(document.body,{childList:!0,subtree:!0})}function fe(e){const t=[];return e.weightKg&&t.push(L(e.weightKg)),e.reps&&t.push(`×${e.reps}`),e.durationSeconds&&t.push(`${e.durationSeconds}s`),e.distanceKm&&t.push(`${e.distanceKm}km`),t.join(" ")||"—"}function ge(e){switch(e?.type){case"bodyweight_reps":return[{key:"reps",label:"REPS"}];case"weighted_bodyweight":return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}];case"assisted_bodyweight":return[{key:"weightKg",label:"AYUDA"},{key:"reps",label:"REPS"}];case"duration":return[{key:"durationSeconds",label:"SEG"}];case"distance_duration":return[{key:"distanceKm",label:"KM"},{key:"durationSeconds",label:"SEG"}];case"weight_distance":return[{key:"weightKg",label:"KG"},{key:"distanceKm",label:"KM"}];default:return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}]}}function he(e,t,o){const r=new Set,d=()=>{w(t);const u=r.size;let i=`
    <div class="card w-head">
      <div class="w-head-row">
        <div class="w-head-main">
          <input type="text" id="w-title" class="w-title" value="${h(t.title)}" aria-label="Título de la sesión" />
          <div class="muted small" style="margin-top:4px"><span id="sess-clock" class="num">${H(Date.now()-t.startTime)}</span> · Volumen: <span class="num">${L(z(t))} kg</span></div>
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
    </div>`;t.exercises.forEach((n,a)=>{const s=q.get(n.exerciseId),c=ge(s),l=n.sets.find(m=>m.supersetId)?.supersetId,p=[s?.equipment,s?.primaryMuscle].filter(Boolean).join(" · "),y=r.has(a);i+=`<div class="card ex-card" data-ex="${a}">
        <div class="ex-top">
          ${s?.img?`<img class="ex-thumb ex-thumb--lg" src="./${s.img}" alt="" loading="lazy" />`:`<span class="ex-thumb ex-thumb--lg ex-thumb--ph" aria-hidden="true">${I.train}</span>`}
          <div class="ex-meta"><strong>${h(O(n.exerciseId))}</strong>
          <div class="muted small">${h(p)}${l?' · <span style="color:var(--blue)">superset</span>':""}</div></div>
          <button class="icon-btn ghost" data-menu="${a}" title="Opciones" aria-label="Opciones del ejercicio">⋮</button>
        </div>
        <div class="ex-actions">
          <button class="action-seg action-icon${y?" on":""}" data-select="${a}" title="Seleccionar" aria-label="Seleccionar ejercicio">${I.select}</button>
          <button class="action-seg action-icon" data-plate="${a}" title="Calculadora de discos" aria-label="Calculadora de discos">◎</button>
          <button class="action-seg action-icon" data-note="${a}" title="Editar nota" aria-label="Editar nota del ejercicio">${I.pencil}</button>
        </div>
        ${n.notes?`<div class="small muted ex-note">✎ ${h(n.notes)}</div>`:""}
        <table class="set-table roomy">
          <thead><tr><th>SERIE</th>${c.map(m=>`<th>${m.label}</th>`).join("")}${x.rpeEnabled?"<th>RPE</th>":""}<th>HECHA</th></tr></thead>
          <tbody>
          ${n.sets.map((m,v)=>`
            <tr class="${m.done?"set-done":""}">
              <td class="set-serie">
                <button class="set-num" data-stype="${a}:${v}" title="Tipo de serie">${m.setIndex+1}</button>
                <span class="set-type-pill ${m.setType}">${h(oe[m.setType])}</span>
                <div class="set-prev">Anterior: ${h(o.get(n.exerciseId)??"—")}</div>
              </td>
              ${c.map(g=>`<td><input type="text" inputmode="decimal" data-inp="${a}:${v}:${g.key}" value="${m[g.key]??""}" placeholder="–" ${m.done?"disabled":""}/></td>`).join("")}
              ${x.rpeEnabled?`<td><input type="text" inputmode="numeric" min="1" max="10" data-inp="${a}:${v}:rpe" value="${m.rpe??""}" placeholder="–" style="max-width:56px"/></td>`:""}
              <td><button class="check-btn ${m.done?"done":""}" data-check="${a}:${v}" aria-label="Marcar serie hecha">✓</button></td>
            </tr>`).join("")}
          </tbody>
        </table>
        <button class="rest-row" data-rest="${a}"><span><span class="inl-ic">${I.clock}</span>Descanso: ${n.restSeconds} s</span><span class="chev" aria-hidden="true">›</span></button>
        <button class="btn add-set" data-add-set="${a}">+ Añadir serie</button>
      </div>`}),i+=`
    <div class="w-foot">
      <button class="btn secondary w-foot-btn" id="w-add-ex">＋ Añadir ejercicio</button>
      <button class="btn w-foot-btn" id="w-finish">Terminar</button>
    </div>`,e.innerHTML=i,ye(e,t,o,d,r)};d()}function ye(e,t,o,r,d){document.getElementById("w-title")?.addEventListener("change",i=>{t.title=i.target.value.trim()||"Sesión libre",w(t)}),document.getElementById("w-add-ex")?.addEventListener("click",()=>ke(i=>{(async()=>{const n=await ae(i);t.exercises.push({exerciseId:i,notes:"",sets:[Q(0)],restSeconds:n??x.defaultRestSeconds}),r()})()},{duplicateName:i=>t.exercises.some(n=>n.exerciseId===i)?O(i):null})),document.getElementById("w-finish")?.addEventListener("click",()=>Se(t)),document.getElementById("w-sel-group")?.addEventListener("click",()=>{for(const n of[...d])t.exercises[n]||d.delete(n);if(d.size<2){T("Selecciona al menos 2 ejercicios");return}const i=V();d.forEach(n=>t.exercises[n].sets.forEach(a=>{a.supersetId=i})),d.clear(),T("Superset creado"),r()}),document.getElementById("w-sel-clear")?.addEventListener("click",()=>{d.clear(),r()}),e.querySelectorAll("[data-select]").forEach(i=>{i.addEventListener("click",()=>{const n=+i.dataset.select;d.has(n)?d.delete(n):d.add(n),r()})}),e.querySelectorAll("[data-menu]").forEach(i=>{i.addEventListener("click",n=>{n.stopPropagation();const a=+i.dataset.menu;be(i,a,t,r,d)})}),e.querySelectorAll("[data-inp]").forEach(i=>{i.addEventListener("change",()=>{const[n,a,s]=i.dataset.inp.split(":"),c=i.value;t.exercises[+n].sets[+a][s]=A(c),w(t)})});const u=["warmup","normal","failure","dropset"];e.querySelectorAll("[data-stype]").forEach(i=>{i.addEventListener("click",()=>{const[n,a]=i.dataset.stype.split(":").map(Number),s=t.exercises[n].sets[a];s.setType=u[(u.indexOf(s.setType)+1)%u.length],r()})}),e.querySelectorAll("[data-check]").forEach(i=>{i.addEventListener("click",()=>{const[n,a]=i.dataset.check.split(":").map(Number),s=t.exercises[n],c=s.sets[a];c.done=!c.done,w(t),c.done&&s.restSeconds>0&&$e(s.restSeconds),r()})}),e.querySelectorAll("[data-add-set]").forEach(i=>{i.addEventListener("click",()=>{const n=+i.dataset.addSet,a=t.exercises[n],s=a.sets[a.sets.length-1],c=Q(a.sets.length);s&&(c.weightKg=s.weightKg,c.reps=s.reps,c.durationSeconds=s.durationSeconds,c.distanceKm=s.distanceKm),a.sets.push(c),r()})}),e.querySelectorAll("[data-note]").forEach(i=>{i.addEventListener("click",()=>{const n=+i.dataset.note,a=t.exercises[n].notes,s=window.prompt("Nota del ejercicio:",a);s!==null&&(t.exercises[n].notes=s,r())})}),e.querySelectorAll("[data-rest]").forEach(i=>{i.addEventListener("click",()=>{const n=+i.dataset.rest,a=window.prompt("Descanso (segundos):",String(t.exercises[n].restSeconds)),s=a!==null?parseInt(a,10):NaN;!Number.isNaN(s)&&s>=0&&(t.exercises[n].restSeconds=s,r())})}),e.querySelectorAll("[data-plate]").forEach(i=>{i.addEventListener("click",()=>te(+i.dataset.plate))})}function be(e,t,o,r,d){_();const u=document.createElement("div");u.className="ex-menu",u.id="ex-menu-pop";const i=[{label:"Ver ejercicio",fn:()=>M(`/exercises?detail=${o.exercises[t].exerciseId}`)},{label:"Nota",fn:()=>{const a=window.prompt("Nota del ejercicio:",o.exercises[t].notes);a!==null&&(o.exercises[t].notes=a,r())}},{label:"Calculadora de discos",fn:()=>te()},...o.exercises[t].sets.some(a=>a.supersetId)?[{label:"Disolver superset",fn:()=>{const a=o.exercises[t].sets.find(s=>s.supersetId)?.supersetId;for(const s of o.exercises)for(const c of s.sets)c.supersetId===a&&(c.supersetId=null);T("Superset disuelto"),r()}}]:[],{label:"Quitar ejercicio",fn:()=>{(async()=>await C("¿Quitar este ejercicio de la sesión?")&&(o.exercises.splice(t,1),d?.clear(),r()))()}}];u.innerHTML=i.map((a,s)=>`<button data-mi="${s}">${h(a.label)}</button>`).join(""),document.body.appendChild(u);const n=e.getBoundingClientRect();u.style.top=`${n.bottom+window.scrollY+6}px`,u.style.left=`${Math.max(8,n.right+window.scrollX-210)}px`,u.querySelectorAll("[data-mi]").forEach(a=>a.addEventListener("click",()=>{const s=i[+a.dataset.mi].fn;_(),s()})),setTimeout(()=>{document.addEventListener("click",_,{once:!0}),document.addEventListener("keydown",a=>{a.key==="Escape"&&_()},{once:!0})},0)}function _(){document.getElementById("ex-menu-pop")?.remove()}function Q(e){return{setIndex:e,setType:"normal",weightKg:null,reps:null,distanceKm:null,durationSeconds:null,rpe:null,supersetId:null,done:!1}}function ke(e,t={}){const o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`<div class="modal">
    <h3>Añadir ejercicio</h3>
    <input type="text" id="pk-q" placeholder="Buscar…" autocomplete="off" />
    <select id="pk-muscle" style="margin-top:8px" aria-label="Filtrar por músculo"></select>
    <div id="pk-list" style="margin-top:8px"></div>
    <button class="btn secondary" id="pk-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(o);const r=o.querySelector("#pk-q"),d=o.querySelector("#pk-list"),u=o.querySelector("#pk-muscle");let i="";const n=()=>{const s=[...new Set([...q.values()].map(c=>c.primaryMuscle))].sort();u.innerHTML='<option value="">Todos los músculos</option>'+s.map(c=>`<option value="${h(c)}" ${c===i?"selected":""}>${h(c)}</option>`).join("")};u.addEventListener("change",()=>{i=u.value,a()});const a=()=>{const s=r.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),c=[...q.values()].filter(l=>(!i||l.primaryMuscle===i)&&(!s||l.nameEs.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").includes(s))).sort((l,p)=>l.nameEs.localeCompare(p.nameEs,"es")).slice(0,60);d.innerHTML=c.length?c.map(l=>`<button class="ex-item" data-pick="${l.id}">
          ${l.img?`<img class="ex-thumb" src="./${l.img}" alt="" loading="lazy" />`:""}
          <span><span class="nm">${h(l.nameEs)}</span><br><span class="meta">${h(l.primaryMuscle)} · ${h(l.equipment)}</span></span>
          <span class="tag">${h(l.type==="duration"?"Tiempo":l.type==="bodyweight_reps"?"Corporal":"Peso")}</span>
        </button>`).join(""):'<div class="empty">Sin resultados.</div>',d.querySelectorAll("[data-pick]").forEach(l=>l.addEventListener("click",()=>{const p=l.dataset.pick,y=t.duplicateName?.(p);if(y){(async()=>await C(`«${y}» ya está añadido. ¿Añadirlo de todas formas?`)&&(o.isConnected&&document.body.removeChild(o),e(p)))();return}document.body.removeChild(o),e(p)}))};r.addEventListener("input",a),o.querySelector("#pk-close")?.addEventListener("click",()=>document.body.removeChild(o)),o.addEventListener("click",s=>{s.target===o&&document.body.removeChild(o)}),R().then(()=>{n(),a()}),setTimeout(()=>r.focus(),50)}function te(e){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`<div class="modal">
    <h3>Calculadora de discos</h3>
    <div class="row">
      <div><label class="f">Carga objetivo (kg)</label><input type="text" id="pl-target" inputmode="decimal" /></div>
      <div><label class="f">Barra (kg)</label><input type="text" id="pl-bar" value="${x.barKg}" inputmode="decimal" /></div>
    </div>
    <label class="f">Discos disponibles (kg, separados por comas)</label>
    <input type="text" id="pl-avail" value="${x.platesKg.join(", ")}" />
    <div id="pl-out" style="margin-top:10px"></div>
    <button class="btn secondary" id="pl-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(t);const o=t.querySelector("#pl-target"),r=t.querySelector("#pl-bar"),d=t.querySelector("#pl-avail"),u=t.querySelector("#pl-out"),i=()=>{const n=A(o.value);if(!n||n<=0){u.innerHTML="";return}const a=d.value.trim(),s=A(a),c=s!==null?[s]:a.split(",").map(p=>A(p)).filter(p=>p!==null&&p>0),l=le(n,A(r.value)||20,c.length?c:void 0);u.innerHTML=`<div class="card">
      <div class="small muted">Por lado: <strong class="num">${L(l.perSideKg)} kg</strong></div>
      <div style="margin-top:6px">${l.platesPerSide.map(p=>`<div class="num">• ${p.count} × ${L(p.kg)} kg</div>`).join("")||'<span class="muted">Solo la barra</span>'}</div>
      <div class="small" style="margin-top:6px">Total: <strong class="num">${L(l.achievedKg)} kg</strong>${l.exact?"":' <span class="muted">(aprox.)</span>'}</div>
    </div>`};[o,r,d].forEach(n=>n.addEventListener("input",i)),t.querySelector("#pl-close")?.addEventListener("click",()=>document.body.removeChild(t)),t.addEventListener("click",n=>{n.target===t&&document.body.removeChild(t)}),setTimeout(()=>o.focus(),50)}function xe(){if(x?.soundEnabled){try{const e=new AudioContext;[0,.25,.5].forEach((t,o)=>{const r=e.createOscillator(),d=e.createGain();r.connect(d),d.connect(e.destination),r.frequency.value=o===2?880:660,r.start(e.currentTime+t),r.stop(e.currentTime+t+.18)}),setTimeout(()=>e.close(),1200)}catch{}try{navigator.vibrate?.(400)}catch{}}}function $e(e){x||X().then(d=>{x=d}),F(),B=Date.now()+e*1e3;const t=document.createElement("div");t.className="timer-overlay",t.id="rest-timer",t.innerHTML=`<div class="timer-card">
    <div class="muted small">DESCANSO</div>
    <div class="t num" id="rest-t">--</div>
    <div class="row">
      <button class="btn secondary small" id="rest-plus">+15s</button>
      <button class="btn small" id="rest-done">Listo</button>
    </div></div>`,document.body.appendChild(t);const o=t.querySelector("#rest-t"),r=()=>{const d=Math.max(0,Math.ceil((B-Date.now())/1e3));o.textContent=`${Math.floor(d/60)}:${String(d%60).padStart(2,"0")}`,d<=0&&(xe(),F(),T("¡Descanso terminado!"))};N=setInterval(r,250),r(),t.querySelector("#rest-plus")?.addEventListener("click",()=>{B+=15e3,r()}),t.querySelector("#rest-done")?.addEventListener("click",F)}function F(){N&&clearInterval(N),N=null,document.getElementById("rest-timer")?.remove()}let U=!1;async function Se(e){if(U)return;U=!0,document.getElementById("w-finish")?.setAttribute("disabled","");const t=window.prompt("Descripción de la sesión (opcional):",e.description)??e.description;e.description=t,e.endTime=Date.now();const o=await b.workoutsDesc(200),r=ne(e,o.filter(m=>m.id!==e.id));await b.put("workouts",e),w(null),await Ee(e);const d=z(e),u=J(e),i=document.createElement("div");i.className="modal-overlay",i.innerHTML=`<div class="modal">
    <h3>¡Sesión completada!</h3>
    <div class="kpis">
      <div class="kpi"><div class="kpi-val num">${H(e.endTime-e.startTime)}</div><div class="kpi-lab">Duración</div></div>
      <div class="kpi"><div class="kpi-val num">${L(d)}</div><div class="kpi-lab">Volumen kg</div></div>
      <div class="kpi"><div class="kpi-val num">${u}</div><div class="kpi-lab">Series</div></div>
      <div class="kpi"><div class="kpi-val num">${e.exercises.length}</div><div class="kpi-lab">Ejercicios</div></div>
    </div>
    ${r.length?'<div class="sec-title">Récords personales</div>'+r.map(m=>`<div class="pr"><span class="medal">★</span><span><strong>${h(O(m.exerciseId))}</strong> — ${h(m.kind)}: <span class="num">${h(m.value)}</span></span></div>`).join(""):'<div class="muted small">Sin nuevos récords esta vez. ¡A por la próxima!</div>'}
    <div class="sec-title" style="margin-top:14px">Foto y sensaciones <span class="muted small">(opcional)</span></div>
    <div class="fin-photo" id="fin-photo">
      <button class="btn small" id="fin-photo-btn" type="button"><span class="inl-ic">${I.camera}</span>Subir foto</button>
      <input type="file" id="fin-photo-input" accept="image/*" hidden>
    </div>
    <div class="fin-seg">
      <div class="fin-seg-head"><span>Cansancio</span></div>
      <div class="seg" id="fin-fatigue-seg" role="radiogroup" aria-label="Cansancio de 1 a 5">
        ${[1,2,3,4,5].map(m=>`<button type="button" data-v="${m}" role="radio" aria-label="${m}">${m}</button>`).join("")}
      </div>
      <div class="fin-seg-scale"><span>Nada</span><span>Reventado</span></div>
    </div>
    <div class="fin-seg">
      <div class="fin-seg-head"><span>Satisfacción</span></div>
      <div class="seg" id="fin-satisfaction-seg" role="radiogroup" aria-label="Satisfacción de 1 a 5">
        ${[1,2,3,4,5].map(m=>`<button type="button" data-v="${m}" role="radio" aria-label="${m}">${m}</button>`).join("")}
      </div>
      <div class="fin-seg-scale"><span>Fatal</span><span>Brutal</span></div>
    </div>
    <button class="btn" id="fin-ok" style="margin-top:12px">Hecho</button>
  </div>`,document.body.appendChild(i);let n=null,a=null;const s=i.querySelector("#fin-photo"),c=i.querySelector("#fin-photo-input");i.querySelector("#fin-photo-btn")?.addEventListener("click",()=>c.click()),c.addEventListener("change",async()=>{const m=c.files?.[0];if(c.value="",!!m)try{n=await ie(m),a&&URL.revokeObjectURL(a),a=URL.createObjectURL(n),s.innerHTML=`<img class="fin-photo-prev" src="${a}" alt="Foto del entreno"><div><button class="linklike small" id="fin-photo-del" type="button">Quitar foto</button></div>`,s.querySelector("#fin-photo-del")?.addEventListener("click",()=>{n=null,a&&(URL.revokeObjectURL(a),a=null),s.innerHTML=`<button class="btn small" id="fin-photo-btn2" type="button"><span class="inl-ic">${I.camera}</span>Subir foto</button>`,s.querySelector("#fin-photo-btn2")?.addEventListener("click",()=>c.click())})}catch{T("No se pudo procesar la foto")}});const l=m=>{const v=i.querySelector(m);let g=null;return v.querySelectorAll("button").forEach(f=>{f.addEventListener("click",()=>{g=Number(f.dataset.v),v.querySelectorAll("button").forEach(k=>k.classList.toggle("on",k===f))})}),()=>g},p=l("#fin-fatigue-seg"),y=l("#fin-satisfaction-seg");i.querySelector("#fin-ok")?.addEventListener("click",async()=>{try{const m=p(),v=y();if(m!==null&&(e.fatigue=m),v!==null&&(e.satisfaction=v),await b.put("workouts",e),n){const g={workoutId:e.id,blob:n,createdAt:Date.now()};await b.put("workoutPhotos",g)}try{const{getSocialConfig:g,shareWorkout:f}=await P(async()=>{const{getSocialConfig:k,shareWorkout:D}=await import("./social-BpVr9vDk.js");return{getSocialConfig:k,shareWorkout:D}},__vite__mapDeps([0,1,2,3,4]),import.meta.url);f(g(),e,n)}catch{}try{const{autoBackup:g}=await P(async()=>{const{autoBackup:f}=await import("./backup-BQk9JEUJ.js");return{autoBackup:f}},__vite__mapDeps([6,1,2,0,3,4]),import.meta.url);g()}catch{}}catch{}a&&URL.revokeObjectURL(a),i.remove(),U=!1,M("/train")})}async function Ee(e){try{const o=(await b.all("programState")).find(d=>d.active);if(!o)return;let r=!1;for(const d of e.exercises){const u=d.sets.filter(s=>s.done&&s.setType!=="warmup"&&s.weightKg&&s.reps);if(u.length<2)continue;const i=d.targetRepsMax??8,n=u.every(s=>(s.reps??0)>=i),a=o.loads[d.exerciseId]??Math.max(...u.map(s=>s.weightKg??0));n?(o.loads[d.exerciseId]=Math.round((a+2.5)*10)/10,r=!0):d.exerciseId in o.loads||(o.loads[d.exerciseId]=a)}r&&(o.currentDayIndex+=1,await b.put("programState",o),T("Progresión del programa actualizada"))}catch{}}export{I as ICONS,Se as finishWorkout,ke as openExercisePicker,Ie as renderActiveWorkout,re as renderTrainHome,pe as startFreeWorkout,$e as startRestTimer,F as stopRestTimer,me as workoutFromRoutine};
