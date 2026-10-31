import{d as c,A as w,I as u,k as P,t as r,e as C,c as S}from"./index-BGuJks7g.js";import{F as T}from"./index-BGuJks7g.js";import{l as M}from"./charts-DiuJqHMd.js";import{c as R}from"./photo-B4nAdfpw.js";let y=[];function L(){for(const l of y)URL.revokeObjectURL(l);y=[]}const d=[{key:"weightKg",label:"Peso",unit:"kg"},{key:"bodyFatPct",label:"% Grasa",unit:"%"},{key:"neckCm",label:"Cuello",unit:"cm"},{key:"shouldersCm",label:"Hombros",unit:"cm"},{key:"chestCm",label:"Pecho",unit:"cm"},{key:"bicepsCm",label:"Bíceps",unit:"cm"},{key:"forearmsCm",label:"Antebrazo",unit:"cm"},{key:"abdomenCm",label:"Abdomen",unit:"cm"},{key:"hipsCm",label:"Cadera",unit:"cm"},{key:"thighsCm",label:"Muslo",unit:"cm"},{key:"calvesCm",label:"Gemelo",unit:"cm"}];async function h(l){L();const p=(await c.all("measurements")).sort((e,t)=>e.date.localeCompare(t.date)),v=(await c.all("progressPhotos")).sort((e,t)=>t.date.localeCompare(e.date)),$=p[p.length-1],m=w(),g=e=>`<label class="kv kv-in"><span>${e.label}</span><span class="kv-v"><input type="text" inputmode="decimal" class="num" data-m="${e.key}" value="${$?.[e.key]??""}" placeholder="–" aria-label="${e.label} (${e.unit})" /><i>${e.unit}</i></span></label>`;let E=`
    <div class="screen-head stats-head"><a class="nav-back" href="#/yo">${u.chevL}Yo</a><h1>Medidas</h1></div>
    <div class="card big-card">
      <div class="m-top"><span class="mt" id="m-label">Peso</span>
        <label class="m-change"><span>Cambiar</span>${u.chevD}<select id="m-metric" aria-label="Métrica">${d.map((e,t)=>`<option value="${e.key}" ${t===0?"selected":""}>${e.label} (${e.unit})</option>`).join("")}</select></label></div>
      <div class="big num" id="m-big"></div>
      <div id="m-chart"></div>
    </div>
    <div class="sec-title">Hoy</div>
    <div class="group">
      ${d.slice(0,4).map(g).join("")}
      <details class="kv-more"><summary class="kv"><span>Más medidas</span><span class="chev">${u.chevD}</span></summary>${d.slice(4).map(g).join("")}</details>
    </div>
    <button class="pill dark" id="m-save" type="button">Guardar medición de hoy</button>
    <p class="note">Solo se guardan los campos que rellenes.</p>

    <div class="sec-title">Fotos de progreso</div>
    <button class="pill soft" id="m-photo" type="button"><span class="inl-ic">${u.camera}</span>Añadir foto de hoy</button>
    <p class="note">Una por día, comprimidas. Privadas: solo viven en tu móvil.</p>
    <div class="photo-grid" id="m-photos"></div>`;l.innerHTML=E;const f=e=>{const t=d.find(a=>a.key===e),o=p.filter(a=>a[e]!==null&&a[e]!==void 0).map(a=>({x:new Date(a.date+"T12:00:00").getTime(),y:Number(a[e]),label:new Date(a.date+"T12:00:00").toLocaleDateString("es-ES",{day:"numeric",month:"short"})}));document.getElementById("m-chart").innerHTML=M(o,{unit:` ${t.unit}`,color:"var(--accent)"});const s=o[o.length-1];document.getElementById("m-label").textContent=t.label,document.getElementById("m-big").innerHTML=s?`${String(s.y).replace(".",",")} <small>${C(t.unit)}</small>`:"—"};f("weightKg"),document.getElementById("m-metric")?.addEventListener("change",e=>f(e.target.value)),document.getElementById("m-save")?.addEventListener("click",async()=>{const e={id:m,date:m,weightKg:null,bodyFatPct:null,neckCm:null,shouldersCm:null,chestCm:null,bicepsCm:null,forearmsCm:null,abdomenCm:null,hipsCm:null,thighsCm:null,calvesCm:null};let t=!1;if(l.querySelectorAll("[data-m]").forEach(s=>{const a=s.dataset.m,i=P(s.value);i!==null&&(e[a]=i,t=!0)}),!t){r("Rellena al menos un campo");return}const o=await c.get("measurements",m);if(o)for(const s of d)e[s.key]===null&&(e[s.key]=o[s.key]);await c.put("measurements",e),r("Medición guardada"),h(l)});const b=document.getElementById("m-photos");b.innerHTML=v.map(e=>`
    <figure data-photo="${e.date}">
      <img alt="Progreso ${C(e.date)}" />
      <figcaption>${new Date(e.date+"T12:00:00").toLocaleDateString("es-ES",{day:"numeric",month:"short",year:"2-digit"})}</figcaption>
    </figure>`).join("")||'<div class="empty">Sin fotos todavía.</div>',v.forEach(e=>{const t=URL.createObjectURL(e.blob);y.push(t);const o=b.querySelector(`[data-photo="${e.date}"] img`);o&&(o.src=t)}),b.querySelectorAll("[data-photo]").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.photo,o=v.find(n=>n.date===t);if(!o)return;const s=URL.createObjectURL(o.blob),a=document.createElement("div");a.className="timer-overlay photo-viewer",a.innerHTML=`
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px">
          <img src="${s}" style="max-width:92vw;max-height:80dvh;border-radius:8px" />
          <div class="row">
            <button class="btn secondary small" data-ov="close">Cerrar</button>
            <button class="btn danger small" data-ov="del">Eliminar</button>
          </div>
        </div>`;const i=()=>{document.body.removeChild(a),URL.revokeObjectURL(s)};a.querySelector('[data-ov="close"]')?.addEventListener("click",n=>{n.stopPropagation(),i()}),a.querySelector('[data-ov="del"]')?.addEventListener("click",async n=>{n.stopPropagation(),await S(`¿Eliminar la foto del ${t}?`)&&(await c.del("progressPhotos",t),i(),h(l))}),a.addEventListener("click",n=>{n.target===a&&i()}),document.body.appendChild(a)})}),document.getElementById("m-photo")?.addEventListener("click",async()=>{const e=document.createElement("input");e.type="file",e.accept="image/*",e.onchange=async()=>{const t=e.files?.[0];if(t)try{r("Comprimiendo foto…");const o=await R(t),s=Math.round(o.size/1024);await c.put("progressPhotos",{date:m,blob:o}),r(`Foto guardada (${s} KB)`),h(l)}catch(o){console.error(o),r("No se pudo guardar la foto")}},e.click()});const k=new MutationObserver(()=>{document.contains(l)||(document.querySelectorAll(".photo-viewer").forEach(e=>e.remove()),L(),k.disconnect())});k.observe(document.body,{childList:!0,subtree:!0})}export{T as downloadBlob,h as renderMeasures};
