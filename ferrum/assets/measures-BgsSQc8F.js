import{d as c,p as C,t as r,e as L,c as E}from"./index-BL9MLBT4.js";import{i as B}from"./index-BL9MLBT4.js";import{l as $}from"./charts-D8nMVL7S.js";import{c as x}from"./photo-B4nAdfpw.js";import{t as P}from"./types-CEDv8i23.js";let y=[];function f(){for(const s of y)URL.revokeObjectURL(s);y=[]}const u=[{key:"weightKg",label:"Peso",unit:"kg"},{key:"bodyFatPct",label:"% Grasa",unit:"%"},{key:"neckCm",label:"Cuello",unit:"cm"},{key:"shouldersCm",label:"Hombros",unit:"cm"},{key:"chestCm",label:"Pecho",unit:"cm"},{key:"bicepsCm",label:"Bíceps",unit:"cm"},{key:"forearmsCm",label:"Antebrazo",unit:"cm"},{key:"abdomenCm",label:"Abdomen",unit:"cm"},{key:"hipsCm",label:"Cadera",unit:"cm"},{key:"thighsCm",label:"Muslo",unit:"cm"},{key:"calvesCm",label:"Gemelo",unit:"cm"}];async function h(s){f();const p=(await c.all("measurements")).sort((e,t)=>e.date.localeCompare(t.date)),d=(await c.all("progressPhotos")).sort((e,t)=>t.date.localeCompare(e.date)),k=p[p.length-1],m=P();let w=`
    <div class="screen-head"><h1>Medidas</h1></div><div class="sec-title">Registrar medición · ${new Date().toLocaleDateString("es-ES",{day:"numeric",month:"long"})}</div>
    <div class="card"><div class="row" style="flex-wrap:wrap">
      ${u.map(e=>`
        <div style="flex:1 1 30%;min-width:100px">
          <label class="f">${e.label} (${e.unit})</label>
          <input type="text" inputmode="decimal" data-m="${e.key}" value="${k?.[e.key]??""}" placeholder="–" />
        </div>`).join("")}
    </div>
    <button class="btn" id="m-save" style="margin-top:12px">Guardar medición de hoy</button>
    <div class="small muted" style="margin-top:6px">Puedes dejar campos vacíos; se guardan solo los que rellenes.</div></div>

    <div class="sec-title">Evolución</div>
    <label class="f">Métrica</label>
    <select id="m-metric">${u.map((e,t)=>`<option value="${e.key}" ${t===0?"selected":""}>${e.label} (${e.unit})</option>`).join("")}</select>
    <div class="card" id="m-chart" style="margin-top:8px"></div>

    <div class="sec-title">Fotos de progreso · ${d.length}</div>
    <div class="card">
      <div class="row">
        <button class="btn secondary" id="m-photo">＋ Añadir foto de hoy</button>
      </div>
      <div class="small muted" style="margin:6px 0">Una por día (se comprimen al guardar). Privadas: solo viven en tu móvil.</div>
      <div class="photo-grid" id="m-photos"></div>
    </div>`;s.innerHTML=w;const b=e=>{const t=u.find(a=>a.key===e),o=p.filter(a=>a[e]!==null&&a[e]!==void 0).map(a=>({x:new Date(a.date+"T12:00:00").getTime(),y:Number(a[e]),label:new Date(a.date+"T12:00:00").toLocaleDateString("es-ES",{day:"numeric",month:"short"})}));document.getElementById("m-chart").innerHTML=$(o,{unit:` ${t.unit}`})};b("weightKg"),document.getElementById("m-metric")?.addEventListener("change",e=>b(e.target.value)),document.getElementById("m-save")?.addEventListener("click",async()=>{const e={id:m,date:m,weightKg:null,bodyFatPct:null,neckCm:null,shouldersCm:null,chestCm:null,bicepsCm:null,forearmsCm:null,abdomenCm:null,hipsCm:null,thighsCm:null,calvesCm:null};let t=!1;if(s.querySelectorAll("[data-m]").forEach(a=>{const l=a.dataset.m,i=C(a.value);i!==null&&(e[l]=i,t=!0)}),!t){r("Rellena al menos un campo");return}const o=await c.get("measurements",m);if(o)for(const a of u)e[a.key]===null&&(e[a.key]=o[a.key]);await c.put("measurements",e),r("Medición guardada"),h(s)});const v=document.getElementById("m-photos");v.innerHTML=d.map(e=>`
    <figure data-photo="${e.date}">
      <img alt="Progreso ${L(e.date)}" />
      <figcaption>${new Date(e.date+"T12:00:00").toLocaleDateString("es-ES",{day:"numeric",month:"short",year:"2-digit"})}</figcaption>
    </figure>`).join("")||'<div class="empty">Sin fotos todavía.</div>',d.forEach(e=>{const t=URL.createObjectURL(e.blob);y.push(t);const o=v.querySelector(`[data-photo="${e.date}"] img`);o&&(o.src=t)}),v.querySelectorAll("[data-photo]").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.photo,o=d.find(n=>n.date===t);if(!o)return;const a=URL.createObjectURL(o.blob),l=document.createElement("div");l.className="timer-overlay photo-viewer",l.innerHTML=`
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px">
          <img src="${a}" style="max-width:92vw;max-height:80dvh;border-radius:8px" />
          <div class="row">
            <button class="btn secondary small" data-ov="close">Cerrar</button>
            <button class="btn danger small" data-ov="del">Eliminar</button>
          </div>
        </div>`;const i=()=>{document.body.removeChild(l),URL.revokeObjectURL(a)};l.querySelector('[data-ov="close"]')?.addEventListener("click",n=>{n.stopPropagation(),i()}),l.querySelector('[data-ov="del"]')?.addEventListener("click",async n=>{n.stopPropagation(),await E(`¿Eliminar la foto del ${t}?`)&&(await c.del("progressPhotos",t),i(),h(s))}),l.addEventListener("click",n=>{n.target===l&&i()}),document.body.appendChild(l)})}),document.getElementById("m-photo")?.addEventListener("click",async()=>{const e=document.createElement("input");e.type="file",e.accept="image/*",e.onchange=async()=>{const t=e.files?.[0];if(t)try{r("Comprimiendo foto…");const o=await x(t),a=Math.round(o.size/1024);await c.put("progressPhotos",{date:m,blob:o}),r(`Foto guardada (${a} KB)`),h(s)}catch(o){console.error(o),r("No se pudo guardar la foto")}},e.click()});const g=new MutationObserver(()=>{document.contains(s)||(document.querySelectorAll(".photo-viewer").forEach(e=>e.remove()),f(),g.disconnect())});g.observe(document.body,{childList:!0,subtree:!0})}export{B as downloadBlob,h as renderMeasures};
