const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./backup-DttOTt0F.js","./index-CjhXngCy.js","./index-i90h2Rv9.css","./types-CEDv8i23.js"])))=>i.map(i=>d[i]);
import{d as b,s as L,I as M,e as h,t as T,_ as se,g as D,c as j,l as z,b as X,a as ae,p as I}from"./index-CjhXngCy.js";import{d as ne,w as H,a as W,f as q,b as S}from"./stats-CJKsKY2L.js";import{c as ie}from"./photo-B4nAdfpw.js";import{D as J,u as Y,S as oe}from"./types-CEDv8i23.js";const ce=[25,20,15,10,5,2.5,1.25];function le(e,t=20,c=ce){const l=Math.max(0,(e-t)/2),r=[...c].sort((s,i)=>i-s),p=[];let o=l;for(const s of r){if(s<=0)continue;const i=Math.floor(o/s+1e-9);i>0&&(p.push({kg:s,count:i}),o=Math.round((o-i*s)*1e3)/1e3)}const a=p.reduce((s,i)=>s+i.kg*i.count,0),n=Math.round((t+a*2)*100)/100;return{perSideKg:Math.round(l*100)/100,platesPerSide:p,barKg:t,achievedKg:n,exact:Math.abs(n-e)<.001}}let A=new Map,x;async function R(){const e=await b.all("exercises");A=new Map(e.map(t=>[t.id,t])),x=await X()}function B(e){return e?A.get(e)?.nameEs??e.replace(/^desconocido:/,""):"Ejercicio"}async function re(e){await R();const t=z(),c=await b.all("routines"),l=await b.all("folders"),r=new Map(l.map(i=>[i.id,i.name])),p=new Date().getDay(),o=c.filter(i=>i.dayOfWeek===p);let a='<div class="screen-head"><h1>Entrenamiento</h1></div>';if(t&&(a+=`<div class="card" style="border-color:var(--blue)">
      <h3>Sesión en curso</h3>
      <div class="muted small">${h(t.title)} · ${t.exercises.length} ejercicios</div>
      <div class="row" style="margin-top:10px">
        <button class="btn" data-act="continue">Continuar</button>
        <button class="btn danger" data-act="discard">Descartar</button>
      </div></div>`),a+='<button class="btn" data-act="free">＋ Sesión libre</button>',a+='<div id="cal-home"></div>',o.length){a+=`<div class="sec-title">Hoy (${J[p]})</div>`;for(const i of o)a+=V(i,r.get(i.folderId??"")??"")}if(c.length){a+='<div class="sec-title">Rutinas</div>';for(const i of c.filter(d=>d.dayOfWeek!==p))a+=V(i,r.get(i.folderId??"")??"")}else o.length||(a+='<div class="empty">Sin rutinas todavía.<br>Crea una en la pestaña Rutinas o empieza una sesión libre.</div>');a+='<div class="sec-title">Historial</div>';const n=await b.workoutsDesc(8);n.length||(a+='<div class="empty">Aún no hay entrenamientos registrados.</div>');for(const i of n){const d=new Date(i.startTime);a+=`<div class="card" style="padding:9px 12px">
      <div style="display:flex;justify-content:space-between;gap:8px">
        <strong>${h(i.title)}</strong>
        <span class="muted small num">${d.toLocaleDateString("es-ES",d.getFullYear()===new Date().getFullYear()?{day:"numeric",month:"short"}:{day:"numeric",month:"short",year:"numeric"})}</span>
      </div>
      <div class="muted small num">${S(H(i))} kg · ${W(i)} series · ${i.endTime?q(i.endTime-i.startTime):"—"}</div>
    </div>`}e.innerHTML=a;const s=e.querySelector("#cal-home");s&&de(s),e.querySelectorAll("[data-act]").forEach(i=>i.addEventListener("click",async()=>{const d=i.dataset.act;if(d==="free")ue();else if(d==="continue")D("/train/active");else if(d==="discard")await j("¿Descartar la sesión en curso? Se perderá lo registrado.")&&(L(null),re(e));else if(d.startsWith("routine:")){const u=c.find(y=>y.id===d.slice(8));u&&ve(u)}}))}let $=0,E=0,w=null;async function de(e){const t=new Date;$||($=t.getFullYear(),E=t.getMonth());const c=await b.all("workouts"),l=new Map;for(const s of c){const i=new Date(s.startTime),d=i.getFullYear()+"-"+i.getMonth()+"-"+i.getDate(),u=l.get(d);u?u.push(s):l.set(d,[s])}const r=s=>$+"-"+E+"-"+s,p=new Map;async function o(s){for(const[,d]of p)URL.revokeObjectURL(d);p.clear();const i=l.get(r(s))??[];for(const d of i)try{const u=await b.get("workoutPhotos",d.id);u?.blob&&p.set(d.id,URL.createObjectURL(u.blob))}catch{}}const a=s=>{const i=(s.sets??[]).filter(d=>d.done&&d.setType!=="warmup");return i.length?i.map(d=>{const u=d.weightKg!=null&&d.weightKg>0?S(d.weightKg)+"×":"",y=d.reps??d.durationSeconds??d.distanceKm??"–";return u+y}).join(" · "):"—"},n=()=>{const s=new Date($,E,1).toLocaleDateString("es-ES",{month:"long",year:"numeric"}),i=(new Date($,E,1).getDay()+6)%7,d=new Date($,E+1,0).getDate();let u="";for(let v=0;v<i;v++)u+="<span></span>";let y=0;for(let v=1;v<=d;v++){const g=l.has(r(v));g&&y++,u+=`<button class="mcal-day${g?" has":""}${w===v?" sel":""}" data-day="${v}"${g?"":" disabled"}>${v}</button>`}let m="";if(w!=null&&l.has(r(w))){const v=[...l.get(r(w))].sort((f,k)=>f.startTime-k.startTime);m=`<div class="sec-title">${w+" de "+new Date($,E,1).toLocaleDateString("es-ES",{month:"long"})}</div>`+v.map(f=>{const k=new Date(f.startTime).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}),_=f.endTime?q(f.endTime-f.startTime):"—",te=(f.exercises??[]).map(K=>`<div class="mcal-ex"><span>${h(B(K.exerciseId))}</span><span class="num muted">${h(a(K))}</span></div>`).join(""),G=p.get(f.id),C=[];return f.fatigue!=null&&C.push(`Cansancio <b class="num">${f.fatigue}</b>/5`),f.satisfaction!=null&&C.push(`Satisfacción <b class="num">${f.satisfaction}</b>/5`),`<div class="card" style="padding:9px 12px;margin-bottom:8px">
          ${G?`<img class="mcal-photo" src="${G}" alt="Foto del entreno">`:""}
          <div style="display:flex;justify-content:space-between;gap:8px">
            <strong>${h(f.title)}</strong><span class="muted small num">${k}</span>
          </div>
          <div class="muted small num" style="margin-bottom:6px">${_} · ${S(H(f))} kg · ${W(f)} series</div>
          ${C.length?`<div class="mcal-feel">${C.map(K=>`<span class="chip-feel">${K}</span>`).join("")}</div>`:""}
          ${te}
          <div style="margin-top:8px;text-align:right"><button class="linklike small" data-delw="${f.id}" style="color:var(--danger,#e5484d)">Eliminar entreno</button></div></div>`}).join("")}e.innerHTML=`<div class="sec-title">Calendario</div>
      <div class="card" style="padding:10px 12px">
        <div class="mcal-head">
          <button class="linklike" data-cal="prev" aria-label="Mes anterior">‹</button>
          <strong style="text-transform:capitalize">${h(s)}</strong>
          <button class="linklike" data-cal="next" aria-label="Mes siguiente">›</button>
        </div>
        <div class="mcal-grid">
          ${["L","M","X","J","V","S","D"].map(v=>`<span class="mcal-dow">${v}</span>`).join("")}
          ${u}
        </div>
        <div class="muted small" style="margin-top:8px"><span class="num">${y}</span> día${y===1?"":"s"} este mes</div>
      </div>
      ${m}`,e.querySelectorAll("[data-cal]").forEach(v=>v.addEventListener("click",()=>{const g=v.dataset.cal==="prev"?-1:1,f=new Date($,E+g,1);$=f.getFullYear(),E=f.getMonth(),w=null,n()})),e.querySelectorAll("[data-day]").forEach(v=>v.addEventListener("click",()=>{const g=Number(v.dataset.day),f=w!==g;w=f?g:null,f?o(g).then(n):n()})),e.querySelectorAll("[data-delw]").forEach(v=>v.addEventListener("click",()=>{const g=v.dataset.delw,f=c.find(k=>k.id===g);(async()=>{if(!await j(`¿Eliminar el entreno «${f?.title??""}»? Esta acción no se puede deshacer.`))return;await b.del("workouts",g),await b.del("workoutPhotos",g).catch(()=>{});const k=c.findIndex(_=>_.id===g);k>=0&&c.splice(k,1),p.delete(g),T("Entreno eliminado"),n()})()}))};n()}function V(e,t){return`<div class="card" style="padding:9px 12px">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <div><strong>${h(e.name)}</strong>
        <div class="muted small">${(e.exercises??[]).length} ejercicios${t?" · "+h(t):""}${e.dayOfWeek!==null?" · "+J[e.dayOfWeek]:""}</div>
      </div>
      <button class="btn small" data-act="routine:${e.id}">Empezar</button>
    </div></div>`}function ue(){(async()=>await Z()&&(await pe(),D("/train/active")))()}async function Z(){const e=z();if(!e)return!0;const t=e.exercises.reduce((c,l)=>c+l.sets.filter(r=>r.done).length,0);return!t&&!e.exercises.length?!0:j(`Ya tienes «${e.title}» en curso con ${t} series registradas. ¿Descartarla y empezar de nuevo?`)}async function pe(){await R();const e={id:Y(),title:"Sesión libre",startTime:Date.now(),endTime:null,description:"",exercises:[]};return L(e),e}async function me(e){return await R(),{id:Y(),title:e.name,startTime:Date.now(),endTime:null,description:"",exercises:(e.exercises??[]).map(c=>({exerciseId:c.exerciseId,notes:c.notes||"",restSeconds:c.restSeconds??x.defaultRestSeconds,targetRepsMax:c.targetRepsMax??c.targetRepsMin??null,sets:Array.from({length:Math.min(Math.max(0,Math.floor(c.targetSets??0)),100)},(l,r)=>({setIndex:r,setType:"normal",weightKg:c.targetWeightKg,reps:c.targetRepsMax??c.targetRepsMin,distanceKm:null,durationSeconds:c.targetDurationSeconds,rpe:null,supersetId:null,done:!1}))}))}}async function ve(e){if(!await Z())return;const t=await me(e);L(t),D("/train/active")}let P=null,F=0;async function De(e){await R();const t=await b.workoutsDesc(60),c=z();if(!c){D("/train");return}const l=new Map;for(const a of t)if(a.id!==c.id)for(const n of a.exercises??[]){if(l.has(n.exerciseId))continue;const s=(n.sets??[]).filter(d=>d.done&&d.setType!=="warmup");if(!s.length)continue;const i=s.reduce((d,u)=>(u.weightKg??0)*(u.reps??0)>(d.weightKg??0)*(d.reps??0)?u:d);l.set(n.exerciseId,fe(i))}he(e,c,l);const p=setInterval(()=>{const a=document.getElementById("sess-clock");a&&(a.textContent=q(Date.now()-c.startTime))},1e3),o=new MutationObserver(()=>{document.contains(e)||(clearInterval(p),o.disconnect())});o.observe(document.body,{childList:!0,subtree:!0})}function fe(e){const t=[];return e.weightKg&&t.push(S(e.weightKg)),e.reps&&t.push(`×${e.reps}`),e.durationSeconds&&t.push(`${e.durationSeconds}s`),e.distanceKm&&t.push(`${e.distanceKm}km`),t.join(" ")||"—"}function ge(e){switch(e?.type){case"bodyweight_reps":return[{key:"reps",label:"REPS"}];case"weighted_bodyweight":return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}];case"assisted_bodyweight":return[{key:"weightKg",label:"AYUDA"},{key:"reps",label:"REPS"}];case"duration":return[{key:"durationSeconds",label:"SEG"}];case"distance_duration":return[{key:"distanceKm",label:"KM"},{key:"durationSeconds",label:"SEG"}];case"weight_distance":return[{key:"weightKg",label:"KG"},{key:"distanceKm",label:"KM"}];default:return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}]}}function he(e,t,c){const l=new Set,r=()=>{L(t);const p=l.size;let o=`
    <div class="card w-head">
      <div class="w-head-row">
        <div class="w-head-main">
          <input type="text" id="w-title" class="w-title" value="${h(t.title)}" aria-label="Título de la sesión" />
          <div class="muted small" style="margin-top:4px"><span id="sess-clock" class="num">${q(Date.now()-t.startTime)}</span> · Volumen: <span class="num">${S(H(t))} kg</span></div>
        </div>
        ${p>0?`
        <div class="w-sel">
          <div class="small muted" id="w-sel-count">${p===1?"1 ejercicio seleccionado":`${p} ejercicios seleccionados`}</div>
          <div class="w-sel-btns">
            <button class="btn small" id="w-sel-group">Agrupar</button>
            <button class="linklike" id="w-sel-clear">Limpiar</button>
          </div>
        </div>`:""}
      </div>
    </div>`;t.exercises.forEach((a,n)=>{const s=A.get(a.exerciseId),i=ge(s),d=a.sets.find(m=>m.supersetId)?.supersetId,u=[s?.equipment,s?.primaryMuscle].filter(Boolean).join(" · "),y=l.has(n);o+=`<div class="card ex-card" data-ex="${n}">
        <div class="ex-top">
          ${s?.img?`<img class="ex-thumb ex-thumb--lg" src="./${s.img}" alt="" loading="lazy" />`:`<span class="ex-thumb ex-thumb--lg ex-thumb--ph" aria-hidden="true">${M.train}</span>`}
          <div class="ex-meta"><strong>${h(B(a.exerciseId))}</strong>
          <div class="muted small">${h(u)}${d?' · <span style="color:var(--blue)">superset</span>':""}</div></div>
          <button class="icon-btn ghost" data-menu="${n}" title="Opciones" aria-label="Opciones del ejercicio">⋮</button>
        </div>
        <div class="ex-actions">
          <button class="action-seg action-icon${y?" on":""}" data-select="${n}" title="Seleccionar" aria-label="Seleccionar ejercicio">${M.select}</button>
          <button class="action-seg action-icon" data-plate="${n}" title="Calculadora de discos" aria-label="Calculadora de discos">◎</button>
          <button class="action-seg action-icon" data-note="${n}" title="Editar nota" aria-label="Editar nota del ejercicio">${M.pencil}</button>
        </div>
        ${a.notes?`<div class="small muted ex-note">✎ ${h(a.notes)}</div>`:""}
        <table class="set-table roomy">
          <thead><tr><th>SERIE</th>${i.map(m=>`<th>${m.label}</th>`).join("")}${x.rpeEnabled?"<th>RPE</th>":""}<th>HECHA</th></tr></thead>
          <tbody>
          ${a.sets.map((m,v)=>`
            <tr class="${m.done?"set-done":""}">
              <td class="set-serie">
                <button class="set-num" data-stype="${n}:${v}" title="Tipo de serie">${m.setIndex+1}</button>
                <span class="set-type-pill ${m.setType}">${h(oe[m.setType])}</span>
                <div class="set-prev">Anterior: ${h(c.get(a.exerciseId)??"—")}</div>
              </td>
              ${i.map(g=>`<td><input type="text" inputmode="decimal" data-inp="${n}:${v}:${g.key}" value="${m[g.key]??""}" placeholder="–" ${m.done?"disabled":""}/></td>`).join("")}
              ${x.rpeEnabled?`<td><input type="text" inputmode="numeric" min="1" max="10" data-inp="${n}:${v}:rpe" value="${m.rpe??""}" placeholder="–" style="max-width:56px"/></td>`:""}
              <td><button class="check-btn ${m.done?"done":""}" data-check="${n}:${v}" aria-label="Marcar serie hecha">✓</button></td>
            </tr>`).join("")}
          </tbody>
        </table>
        <button class="rest-row" data-rest="${n}"><span><span class="inl-ic">${M.clock}</span>Descanso: ${a.restSeconds} s</span><span class="chev" aria-hidden="true">›</span></button>
        <button class="btn add-set" data-add-set="${n}">+ Añadir serie</button>
      </div>`}),o+=`
    <div class="w-foot">
      <button class="btn secondary w-foot-btn" id="w-add-ex">＋ Añadir ejercicio</button>
      <button class="btn w-foot-btn" id="w-finish">Terminar</button>
    </div>`,e.innerHTML=o,ye(e,t,c,r,l)};r()}function ye(e,t,c,l,r){document.getElementById("w-title")?.addEventListener("change",o=>{t.title=o.target.value.trim()||"Sesión libre",L(t)}),document.getElementById("w-add-ex")?.addEventListener("click",()=>ke(o=>{(async()=>{const a=await ae(o);t.exercises.push({exerciseId:o,notes:"",sets:[Q(0)],restSeconds:a??x.defaultRestSeconds}),l()})()},{duplicateName:o=>t.exercises.some(a=>a.exerciseId===o)?B(o):null})),document.getElementById("w-finish")?.addEventListener("click",()=>Se(t)),document.getElementById("w-sel-group")?.addEventListener("click",()=>{for(const a of[...r])t.exercises[a]||r.delete(a);if(r.size<2){T("Selecciona al menos 2 ejercicios");return}const o=Y();r.forEach(a=>t.exercises[a].sets.forEach(n=>{n.supersetId=o})),r.clear(),T("Superset creado"),l()}),document.getElementById("w-sel-clear")?.addEventListener("click",()=>{r.clear(),l()}),e.querySelectorAll("[data-select]").forEach(o=>{o.addEventListener("click",()=>{const a=+o.dataset.select;r.has(a)?r.delete(a):r.add(a),l()})}),e.querySelectorAll("[data-menu]").forEach(o=>{o.addEventListener("click",a=>{a.stopPropagation();const n=+o.dataset.menu;be(o,n,t,l,r)})}),e.querySelectorAll("[data-inp]").forEach(o=>{o.addEventListener("change",()=>{const[a,n,s]=o.dataset.inp.split(":"),i=o.value;t.exercises[+a].sets[+n][s]=I(i),L(t)})});const p=["warmup","normal","failure","dropset"];e.querySelectorAll("[data-stype]").forEach(o=>{o.addEventListener("click",()=>{const[a,n]=o.dataset.stype.split(":").map(Number),s=t.exercises[a].sets[n];s.setType=p[(p.indexOf(s.setType)+1)%p.length],l()})}),e.querySelectorAll("[data-check]").forEach(o=>{o.addEventListener("click",()=>{const[a,n]=o.dataset.check.split(":").map(Number),s=t.exercises[a],i=s.sets[n];i.done=!i.done,L(t),i.done&&s.restSeconds>0&&$e(s.restSeconds),l()})}),e.querySelectorAll("[data-add-set]").forEach(o=>{o.addEventListener("click",()=>{const a=+o.dataset.addSet,n=t.exercises[a],s=n.sets[n.sets.length-1],i=Q(n.sets.length);s&&(i.weightKg=s.weightKg,i.reps=s.reps,i.durationSeconds=s.durationSeconds,i.distanceKm=s.distanceKm),n.sets.push(i),l()})}),e.querySelectorAll("[data-note]").forEach(o=>{o.addEventListener("click",()=>{const a=+o.dataset.note,n=t.exercises[a].notes,s=window.prompt("Nota del ejercicio:",n);s!==null&&(t.exercises[a].notes=s,l())})}),e.querySelectorAll("[data-rest]").forEach(o=>{o.addEventListener("click",()=>{const a=+o.dataset.rest,n=window.prompt("Descanso (segundos):",String(t.exercises[a].restSeconds)),s=n!==null?parseInt(n,10):NaN;!Number.isNaN(s)&&s>=0&&(t.exercises[a].restSeconds=s,l())})}),e.querySelectorAll("[data-plate]").forEach(o=>{o.addEventListener("click",()=>ee(+o.dataset.plate))})}function be(e,t,c,l,r){N();const p=document.createElement("div");p.className="ex-menu",p.id="ex-menu-pop";const o=[{label:"Ver ejercicio",fn:()=>D(`/exercises?detail=${c.exercises[t].exerciseId}`)},{label:"Nota",fn:()=>{const n=window.prompt("Nota del ejercicio:",c.exercises[t].notes);n!==null&&(c.exercises[t].notes=n,l())}},{label:"Calculadora de discos",fn:()=>ee()},...c.exercises[t].sets.some(n=>n.supersetId)?[{label:"Disolver superset",fn:()=>{const n=c.exercises[t].sets.find(s=>s.supersetId)?.supersetId;for(const s of c.exercises)for(const i of s.sets)i.supersetId===n&&(i.supersetId=null);T("Superset disuelto"),l()}}]:[],{label:"Quitar ejercicio",fn:()=>{(async()=>await j("¿Quitar este ejercicio de la sesión?")&&(c.exercises.splice(t,1),r?.clear(),l()))()}}];p.innerHTML=o.map((n,s)=>`<button data-mi="${s}">${h(n.label)}</button>`).join(""),document.body.appendChild(p);const a=e.getBoundingClientRect();p.style.top=`${a.bottom+window.scrollY+6}px`,p.style.left=`${Math.max(8,a.right+window.scrollX-210)}px`,p.querySelectorAll("[data-mi]").forEach(n=>n.addEventListener("click",()=>{const s=o[+n.dataset.mi].fn;N(),s()})),setTimeout(()=>{document.addEventListener("click",N,{once:!0}),document.addEventListener("keydown",n=>{n.key==="Escape"&&N()},{once:!0})},0)}function N(){document.getElementById("ex-menu-pop")?.remove()}function Q(e){return{setIndex:e,setType:"normal",weightKg:null,reps:null,distanceKm:null,durationSeconds:null,rpe:null,supersetId:null,done:!1}}function ke(e,t={}){const c=document.createElement("div");c.className="modal-overlay",c.innerHTML=`<div class="modal">
    <h3>Añadir ejercicio</h3>
    <input type="text" id="pk-q" placeholder="Buscar…" autocomplete="off" />
    <select id="pk-muscle" style="margin-top:8px" aria-label="Filtrar por músculo"></select>
    <div id="pk-list" style="margin-top:8px"></div>
    <button class="btn secondary" id="pk-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(c);const l=c.querySelector("#pk-q"),r=c.querySelector("#pk-list"),p=c.querySelector("#pk-muscle");let o="";const a=()=>{const i=[...new Set([...A.values()].map(d=>d.primaryMuscle))].sort();p.innerHTML='<option value="">Todos los músculos</option>'+i.map(d=>`<option value="${h(d)}" ${d===o?"selected":""}>${h(d)}</option>`).join("")};p.addEventListener("change",()=>{o=p.value,s()});const n=i=>(i.nameEs+" "+(i.searchTerms??"")).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),s=()=>{const i=l.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),d=[...A.values()].filter(u=>(!o||u.primaryMuscle===o)&&(!i||n(u).includes(i))).sort((u,y)=>u.nameEs.localeCompare(y.nameEs,"es")).slice(0,60);r.innerHTML=d.length?d.map(u=>`<button class="ex-item" data-pick="${u.id}">
          ${u.img?`<img class="ex-thumb" src="./${u.img}" alt="" loading="lazy" />`:""}
          <span><span class="nm">${h(u.nameEs)}</span><br><span class="meta">${h(u.primaryMuscle)} · ${h(u.equipment)}</span></span>
          <span class="tag">${h(u.type==="duration"?"Tiempo":u.type==="bodyweight_reps"?"Corporal":"Peso")}</span>
        </button>`).join(""):'<div class="empty">Sin resultados.</div>',r.querySelectorAll("[data-pick]").forEach(u=>u.addEventListener("click",()=>{const y=u.dataset.pick,m=t.duplicateName?.(y);if(m){(async()=>await j(`«${m}» ya está añadido. ¿Añadirlo de todas formas?`)&&(c.isConnected&&document.body.removeChild(c),e(y)))();return}document.body.removeChild(c),e(y)}))};l.addEventListener("input",s),c.querySelector("#pk-close")?.addEventListener("click",()=>document.body.removeChild(c)),c.addEventListener("click",i=>{i.target===c&&document.body.removeChild(c)}),R().then(()=>{a(),s()}),setTimeout(()=>l.focus(),50)}function ee(e){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`<div class="modal">
    <h3>Calculadora de discos</h3>
    <div class="row">
      <div><label class="f">Carga objetivo (kg)</label><input type="text" id="pl-target" inputmode="decimal" /></div>
      <div><label class="f">Barra (kg)</label><input type="text" id="pl-bar" value="${x.barKg}" inputmode="decimal" /></div>
    </div>
    <label class="f">Discos disponibles (kg, separados por comas)</label>
    <input type="text" id="pl-avail" value="${x.platesKg.join(", ")}" />
    <div id="pl-out" style="margin-top:10px"></div>
    <button class="btn secondary" id="pl-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(t);const c=t.querySelector("#pl-target"),l=t.querySelector("#pl-bar"),r=t.querySelector("#pl-avail"),p=t.querySelector("#pl-out"),o=()=>{const a=I(c.value);if(!a||a<=0){p.innerHTML="";return}const n=r.value.trim(),s=I(n),i=s!==null?[s]:n.split(",").map(u=>I(u)).filter(u=>u!==null&&u>0),d=le(a,I(l.value)||20,i.length?i:void 0);p.innerHTML=`<div class="card">
      <div class="small muted">Por lado: <strong class="num">${S(d.perSideKg)} kg</strong></div>
      <div style="margin-top:6px">${d.platesPerSide.map(u=>`<div class="num">• ${u.count} × ${S(u.kg)} kg</div>`).join("")||'<span class="muted">Solo la barra</span>'}</div>
      <div class="small" style="margin-top:6px">Total: <strong class="num">${S(d.achievedKg)} kg</strong>${d.exact?"":' <span class="muted">(aprox.)</span>'}</div>
    </div>`};[c,l,r].forEach(a=>a.addEventListener("input",o)),t.querySelector("#pl-close")?.addEventListener("click",()=>document.body.removeChild(t)),t.addEventListener("click",a=>{a.target===t&&document.body.removeChild(t)}),setTimeout(()=>c.focus(),50)}function xe(){if(x?.soundEnabled){try{const e=new AudioContext;[0,.25,.5].forEach((t,c)=>{const l=e.createOscillator(),r=e.createGain();l.connect(r),r.connect(e.destination),l.frequency.value=c===2?880:660,l.start(e.currentTime+t),l.stop(e.currentTime+t+.18)}),setTimeout(()=>e.close(),1200)}catch{}try{navigator.vibrate?.(400)}catch{}}}function $e(e){x||X().then(r=>{x=r}),O(),F=Date.now()+e*1e3;const t=document.createElement("div");t.className="timer-overlay",t.id="rest-timer",t.innerHTML=`<div class="timer-card">
    <div class="muted small">DESCANSO</div>
    <div class="t num" id="rest-t">--</div>
    <div class="row">
      <button class="btn secondary small" id="rest-plus">+15s</button>
      <button class="btn small" id="rest-done">Listo</button>
    </div></div>`,document.body.appendChild(t);const c=t.querySelector("#rest-t"),l=()=>{const r=Math.max(0,Math.ceil((F-Date.now())/1e3));c.textContent=`${Math.floor(r/60)}:${String(r%60).padStart(2,"0")}`,r<=0&&(xe(),O(),T("¡Descanso terminado!"))};P=setInterval(l,250),l(),t.querySelector("#rest-plus")?.addEventListener("click",()=>{F+=15e3,l()}),t.querySelector("#rest-done")?.addEventListener("click",O)}function O(){P&&clearInterval(P),P=null,document.getElementById("rest-timer")?.remove()}let U=!1;async function Se(e){if(U)return;U=!0,document.getElementById("w-finish")?.setAttribute("disabled","");const t=window.prompt("Descripción de la sesión (opcional):",e.description)??e.description;e.description=t,e.endTime=Date.now();const c=await b.workoutsDesc(200),l=ne(e,c.filter(m=>m.id!==e.id));await b.put("workouts",e),L(null),await Ee(e);const r=H(e),p=W(e),o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`<div class="modal">
    <h3>¡Sesión completada!</h3>
    <div class="kpis">
      <div class="kpi"><div class="kpi-val num">${q(e.endTime-e.startTime)}</div><div class="kpi-lab">Duración</div></div>
      <div class="kpi"><div class="kpi-val num">${S(r)}</div><div class="kpi-lab">Volumen kg</div></div>
      <div class="kpi"><div class="kpi-val num">${p}</div><div class="kpi-lab">Series</div></div>
      <div class="kpi"><div class="kpi-val num">${e.exercises.length}</div><div class="kpi-lab">Ejercicios</div></div>
    </div>
    ${l.length?'<div class="sec-title">Récords personales</div>'+l.map(m=>`<div class="pr"><span class="medal">★</span><span><strong>${h(B(m.exerciseId))}</strong> — ${h(m.kind)}: <span class="num">${h(m.value)}</span></span></div>`).join(""):'<div class="muted small">Sin nuevos récords esta vez. ¡A por la próxima!</div>'}
    <div class="sec-title" style="margin-top:14px">Foto y sensaciones <span class="muted small">(opcional)</span></div>
    <div class="fin-photo" id="fin-photo">
      <button class="btn small" id="fin-photo-btn" type="button"><span class="inl-ic">${M.camera}</span>Subir foto</button>
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
  </div>`,document.body.appendChild(o);let a=null,n=null;const s=o.querySelector("#fin-photo"),i=o.querySelector("#fin-photo-input");o.querySelector("#fin-photo-btn")?.addEventListener("click",()=>i.click()),i.addEventListener("change",async()=>{const m=i.files?.[0];if(i.value="",!!m)try{a=await ie(m),n&&URL.revokeObjectURL(n),n=URL.createObjectURL(a),s.innerHTML=`<img class="fin-photo-prev" src="${n}" alt="Foto del entreno"><div><button class="linklike small" id="fin-photo-del" type="button">Quitar foto</button></div>`,s.querySelector("#fin-photo-del")?.addEventListener("click",()=>{a=null,n&&(URL.revokeObjectURL(n),n=null),s.innerHTML=`<button class="btn small" id="fin-photo-btn2" type="button"><span class="inl-ic">${M.camera}</span>Subir foto</button>`,s.querySelector("#fin-photo-btn2")?.addEventListener("click",()=>i.click())})}catch{T("No se pudo procesar la foto")}});const d=m=>{const v=o.querySelector(m);let g=null;return v.querySelectorAll("button").forEach(f=>{f.addEventListener("click",()=>{g=Number(f.dataset.v),v.querySelectorAll("button").forEach(k=>k.classList.toggle("on",k===f))})}),()=>g},u=d("#fin-fatigue-seg"),y=d("#fin-satisfaction-seg");o.querySelector("#fin-ok")?.addEventListener("click",async()=>{try{const m=u(),v=y();if(m!==null&&(e.fatigue=m),v!==null&&(e.satisfaction=v),await b.put("workouts",e),a){const g={workoutId:e.id,blob:a,createdAt:Date.now()};await b.put("workoutPhotos",g)}try{const{autoBackup:g}=await se(async()=>{const{autoBackup:f}=await import("./backup-DttOTt0F.js");return{autoBackup:f}},__vite__mapDeps([0,1,2,3]),import.meta.url);g()}catch{}}catch{}n&&URL.revokeObjectURL(n),o.remove(),U=!1,D("/train")})}async function Ee(e){try{const c=(await b.all("programState")).find(r=>r.active);if(!c)return;let l=!1;for(const r of e.exercises){const p=r.sets.filter(s=>s.done&&s.setType!=="warmup"&&s.weightKg&&s.reps);if(p.length<2)continue;const o=r.targetRepsMax??8,a=p.every(s=>(s.reps??0)>=o),n=c.loads[r.exerciseId]??Math.max(...p.map(s=>s.weightKg??0));a?(c.loads[r.exerciseId]=Math.round((n+2.5)*10)/10,l=!0):r.exerciseId in c.loads||(c.loads[r.exerciseId]=n)}l&&(c.currentDayIndex+=1,await b.put("programState",c),T("Progresión del programa actualizada"))}catch{}}export{M as ICONS,Se as finishWorkout,ke as openExercisePicker,De as renderActiveWorkout,re as renderTrainHome,pe as startFreeWorkout,$e as startRestTimer,O as stopRestTimer,me as workoutFromRoutine};
