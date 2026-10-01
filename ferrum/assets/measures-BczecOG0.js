import{d as p,p as C,t as v,e as L,i as x}from"./index-DPm309OK.js";import{k as T}from"./index-DPm309OK.js";import{l as $}from"./charts-JCuRxAy6.js";import{t as S}from"./types-E-ayykTU.js";const k=1600,P=.8;async function M(n){const s=await I(n),i=Math.max(s.width,s.height),g=i>k?k/i:1,c=Math.max(1,Math.round(s.width*g)),y=Math.max(1,Math.round(s.height*g)),r=document.createElement("canvas");r.width=c,r.height=y;const m=r.getContext("2d");if(!m)throw new Error("Sin contexto 2d");m.drawImage(s,0,0,c,y),typeof s.close=="function"&&s.close();const h=await new Promise(e=>r.toBlob(e,"image/jpeg",P));if(!h)throw new Error("No se pudo comprimir la foto");return h}async function I(n){try{return await createImageBitmap(n,{imageOrientation:"fromImage"})}catch{return await createImageBitmap(n)}}let w=[];function E(){for(const n of w)URL.revokeObjectURL(n);w=[]}const b=[{key:"weightKg",label:"Peso",unit:"kg"},{key:"bodyFatPct",label:"% Grasa",unit:"%"},{key:"neckCm",label:"Cuello",unit:"cm"},{key:"shouldersCm",label:"Hombros",unit:"cm"},{key:"chestCm",label:"Pecho",unit:"cm"},{key:"bicepsCm",label:"Bíceps",unit:"cm"},{key:"forearmsCm",label:"Antebrazo",unit:"cm"},{key:"abdomenCm",label:"Abdomen",unit:"cm"},{key:"hipsCm",label:"Cadera",unit:"cm"},{key:"thighsCm",label:"Muslo",unit:"cm"},{key:"calvesCm",label:"Gemelo",unit:"cm"}];async function f(n){E();const s=(await p.all("measurements")).sort((e,t)=>e.date.localeCompare(t.date)),i=(await p.all("progressPhotos")).sort((e,t)=>t.date.localeCompare(e.date)),g=s[s.length-1],c=S();let y=`
    <div class="sec-title">Registrar medición · ${new Date().toLocaleDateString("es-ES",{day:"numeric",month:"long"})}</div>
    <div class="card"><div class="row" style="flex-wrap:wrap">
      ${b.map(e=>`
        <div style="flex:1 1 30%;min-width:100px">
          <label class="f">${e.label} (${e.unit})</label>
          <input type="text" inputmode="decimal" data-m="${e.key}" value="${g?.[e.key]??""}" placeholder="–" />
        </div>`).join("")}
    </div>
    <button class="btn" id="m-save" style="margin-top:12px">Guardar medición de hoy</button>
    <div class="small muted" style="margin-top:6px">Puedes dejar campos vacíos; se guardan solo los que rellenes.</div></div>

    <div class="sec-title">Evolución</div>
    <label class="f">Métrica</label>
    <select id="m-metric">${b.map((e,t)=>`<option value="${e.key}" ${t===0?"selected":""}>${e.label} (${e.unit})</option>`).join("")}</select>
    <div class="card" id="m-chart" style="margin-top:8px"></div>

    <div class="sec-title">Fotos de progreso · ${i.length}</div>
    <div class="card">
      <div class="row">
        <button class="btn secondary" id="m-photo">＋ Añadir foto de hoy</button>
      </div>
      <div class="small muted" style="margin:6px 0">Una por día (se comprimen al guardar). Privadas: solo viven en tu móvil.</div>
      <div class="photo-grid" id="m-photos"></div>
    </div>`;n.innerHTML=y;const r=e=>{const t=b.find(a=>a.key===e),o=s.filter(a=>a[e]!==null&&a[e]!==void 0).map(a=>({x:new Date(a.date+"T12:00:00").getTime(),y:Number(a[e]),label:new Date(a.date+"T12:00:00").toLocaleDateString("es-ES",{day:"numeric",month:"short"})}));document.getElementById("m-chart").innerHTML=$(o,{unit:` ${t.unit}`})};r("weightKg"),document.getElementById("m-metric")?.addEventListener("change",e=>r(e.target.value)),document.getElementById("m-save")?.addEventListener("click",async()=>{const e={id:c,date:c,weightKg:null,bodyFatPct:null,neckCm:null,shouldersCm:null,chestCm:null,bicepsCm:null,forearmsCm:null,abdomenCm:null,hipsCm:null,thighsCm:null,calvesCm:null};let t=!1;if(n.querySelectorAll("[data-m]").forEach(a=>{const l=a.dataset.m,u=C(a.value);u!==null&&(e[l]=u,t=!0)}),!t){v("Rellena al menos un campo");return}const o=await p.get("measurements",c);if(o)for(const a of b)e[a.key]===null&&(e[a.key]=o[a.key]);await p.put("measurements",e),v("Medición guardada"),f(n)});const m=document.getElementById("m-photos");m.innerHTML=i.map(e=>`
    <figure data-photo="${e.date}">
      <img alt="Progreso ${L(e.date)}" />
      <figcaption>${new Date(e.date+"T12:00:00").toLocaleDateString("es-ES",{day:"numeric",month:"short",year:"2-digit"})}</figcaption>
    </figure>`).join("")||'<div class="empty">Sin fotos todavía.</div>',i.forEach(e=>{const t=URL.createObjectURL(e.blob);w.push(t);const o=m.querySelector(`[data-photo="${e.date}"] img`);o&&(o.src=t)}),m.querySelectorAll("[data-photo]").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.photo,o=i.find(d=>d.date===t);if(!o)return;const a=URL.createObjectURL(o.blob),l=document.createElement("div");l.className="timer-overlay photo-viewer",l.innerHTML=`
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px">
          <img src="${a}" style="max-width:92vw;max-height:80dvh;border-radius:8px" />
          <div class="row">
            <button class="btn secondary small" data-ov="close">Cerrar</button>
            <button class="btn danger small" data-ov="del">Eliminar</button>
          </div>
        </div>`;const u=()=>{document.body.removeChild(l),URL.revokeObjectURL(a)};l.querySelector('[data-ov="close"]')?.addEventListener("click",d=>{d.stopPropagation(),u()}),l.querySelector('[data-ov="del"]')?.addEventListener("click",async d=>{d.stopPropagation(),await x(`¿Eliminar la foto del ${t}?`)&&(await p.del("progressPhotos",t),u(),f(n))}),l.addEventListener("click",d=>{d.target===l&&u()}),document.body.appendChild(l)})}),document.getElementById("m-photo")?.addEventListener("click",async()=>{const e=document.createElement("input");e.type="file",e.accept="image/*",e.onchange=async()=>{const t=e.files?.[0];if(t)try{v("Comprimiendo foto…");const o=await M(t),a=Math.round(o.size/1024);await p.put("progressPhotos",{date:c,blob:o}),v(`Foto guardada (${a} KB)`),f(n)}catch(o){console.error(o),v("No se pudo guardar la foto")}},e.click()});const h=new MutationObserver(()=>{document.contains(n)||(document.querySelectorAll(".photo-viewer").forEach(e=>e.remove()),E(),h.disconnect())});h.observe(document.body,{childList:!0,subtree:!0})}export{T as downloadBlob,f as renderMeasures};
