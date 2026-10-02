import{d as G,e as P}from"./index-BQ4-jTc0.js";import{w as ne,a as ie,b as I,e as oe,c as le,g as ce,h as de}from"./stats-CJKsKY2L.js";import{c as re,l as H,a as me}from"./charts-D8nMVL7S.js";import{m as pe,M as ue}from"./muscle-load-BL7lTJEv.js";import{t as T}from"./types-CEDv8i23.js";const L="#2b5cab",k="#1a3c74";function O(t){return t.replace(/[MLC][^MLCZ]*/g,e=>{const s=e[0],o=e.slice(1).trim().split(/[\s,]+/).filter(n=>n.length).map(Number).map((n,l)=>l%2===0?200-n:n);return s+o.join(" ")}).replace(/\s+/g," ").trim()}const N="M91,52 C90,58 89,62 89,66 C80,68 66,72 54,80 C46,82 39,87 34,95 C29,105 28,119 30,133 C31,142 32,149 34,156 C30,176 26,198 24,218 C23,226 22,232 22,238 C22,244 25,247 30,246 C34,245 35,241 35,235 C36,228 37,222 38,216 C40,198 42,180 44,164 C45,156 48,148 52,140 C56,130 61,120 65,110 C63,124 62,138 63,152 C65,166 69,178 73,190 C71,202 69,210 69,220 C65,244 62,272 61,306 C60,328 59,354 57,380 C56,385 54,389 51,392 C48,394 48,398 52,400 C57,402 63,402 68,400 C71,399 71,396 69,393 C68,389 67,386 67,382 C69,362 71,336 75,310 C78,288 82,264 87,242 L100,238 L113,242 C118,264 122,288 125,310 C129,336 131,362 133,382 C133,386 132,389 131,393 C129,396 129,399 132,400 C137,402 143,402 148,400 C152,398 152,394 149,392 C146,389 144,385 143,380 C141,354 140,328 139,306 C138,272 135,244 131,220 C131,210 129,202 127,190 C131,178 135,166 137,152 C138,138 137,124 135,110 C139,120 144,130 148,140 C152,148 155,156 156,164 C158,180 160,198 162,216 C163,222 164,228 165,235 C165,241 166,245 170,246 C175,247 178,244 178,238 C178,232 177,226 176,218 C174,198 170,176 166,156 C168,149 169,142 170,133 C172,119 171,105 166,95 C161,87 154,82 146,80 C134,72 120,68 111,66 C111,62 110,58 109,52 Z",q="M100,8 C110,8 117,18 117,32 C117,46 110,54 100,54 C90,54 83,46 83,32 C83,18 90,8 100,8 Z";function y(t,e){return`<path id="mz-${t}" class="mz" d="${e}" fill="${L}" stroke="${k}" stroke-width="1.2"/>`}function h(t,e){return y(t,`${e} ${O(e)}`)}function f(t){return`<path d="${t}" fill="none" stroke="${k}" stroke-width="1.4" opacity="0.5" stroke-linecap="round"/>`}const Y="M54,76 C45,79 38,88 35,102 C33,114 37,123 43,125 C50,123 55,115 56,104 C56,92 56,82 54,76 Z",X="M42,118 C36,128 33,142 35,154 C37,162 43,163 47,157 C50,147 50,132 47,120 Z",Q="M35,178 C31,194 28,212 29,224 C30,231 36,231 38,224 C40,210 40,194 38,180 Z",S="M62,332 C59,347 58,364 60,375 C62,381 67,381 69,374 C71,361 70,347 68,334 Z",ve="M94,90 C84,88 73,91 67,98 C63,104 65,112 71,117 C78,122 86,124 92,122 C94,112 94,100 94,90 Z",ge="M72,252 C67,270 65,290 67,308 C69,316 75,316 78,309 C80,292 80,272 78,254 Z",fe="M70,256 C67,270 66,288 68,302 C70,309 75,309 77,302 C79,288 79,270 77,256 Z",Ce="M78,136 C87,134 113,134 122,136 C123,156 122,178 119,196 C116,205 108,209 100,209 C92,209 84,205 81,196 C78,178 77,156 78,136 Z",J="M92,66 C98,64 102,64 108,66 L138,80 C140,84 138,87 134,88 L120,92 C113,94 106,94 100,94 C94,94 87,94 80,92 L66,88 C62,87 60,84 62,80 Z",he="M78,88 C87,86 113,86 122,88 C123,110 122,132 120,150 C112,156 88,156 80,150 C78,132 77,110 78,88 Z",be="M70,102 C65,114 63,130 65,146 C67,160 73,170 80,174 C82,160 80,142 78,126 C76,116 74,108 70,102 Z",$e="M74,214 C71,224 72,236 77,243 C81,247 86,245 87,239 C88,230 87,221 85,214 Z",Me="M70,256 C66,274 65,294 68,310 C70,317 76,317 78,310 C80,294 79,274 77,256 Z";function ye(){return`<svg viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mapa muscular frontal">
  <path d="${N}" fill="${L}" stroke="${k}" stroke-width="1.5"/>
  <path d="${q}" fill="${L}" stroke="${k}" stroke-width="1.5"/>
  ${y("gemelo",`${S} ${O(S)}`)}
  ${h("cuadriceps",ge)}
  ${h("aductor",fe)}
  ${y("core",Ce)}
  ${h("biceps",X)}
  ${h("antebrazo",Q)}
  ${h("pecho",ve)}
  ${h("hombro",Y)}
  ${y("trapecio",J)}
  ${f("M100,140 C100,160 100,180 100,204")}
  ${f("M84,156 C92,158 108,158 116,156")}
  ${f("M83,172 C91,174 109,174 117,172")}
  ${f("M84,188 C92,190 108,190 116,188")}
  ${f("M100,92 C100,102 100,110 100,118")}
  ${f("M70,92 C78,98 86,101 93,101")}
  ${f("M130,92 C122,98 114,101 107,101")}
  ${f("M72,262 C70,280 70,296 72,308")}
  ${f("M128,262 C130,280 130,296 128,308")}
</svg>`}function ke(){return`<svg viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mapa muscular dorsal">
  <path d="${N}" fill="${L}" stroke="${k}" stroke-width="1.5"/>
  <path d="${q}" fill="${L}" stroke="${k}" stroke-width="1.5"/>
  ${y("gemelo",`${S} ${O(S)}`)}
  ${h("isquio",Me)}
  ${h("gluteo",$e)}
  ${h("dorsal",be)}
  ${y("espalda",he)}
  ${h("triceps",X)}
  ${h("antebrazo",Q)}
  ${h("hombro",Y)}
  ${y("trapecio",J)}
  ${f("M100,92 C100,116 100,140 100,160")}
  ${f("M80,72 C89,77 111,77 120,72")}
  ${f("M68,120 C66,134 66,148 70,160")}
  ${f("M132,120 C134,134 134,148 130,160")}
  ${f("M78,230 C84,236 90,239 94,239")}
  ${f("M122,230 C116,236 110,239 106,239")}
</svg>`}let R=new Map;async function Ee(){R=new Map((await G.all("exercises")).map(t=>[t.id,t]))}const we=t=>t?R.get(t)?.nameEs??t.replace(/^desconocido:/,""):"Ejercicio",Le={musculos:"Músculos",global:"General",exercise:"Por ejercicio",felicidad:"Felicidad"},ee=t=>Object.entries(Le).map(([e,s])=>`<option value="${e}" ${e===t?"selected":""}>${s}</option>`).join("");async function xe(t,e){await Ee();const s=await G.workoutsDesc(400),d=e.get("tab")??"musculos",o=c=>{const r=new URLSearchParams(e);r.set("tab",c),xe(t,r)};if(d==="musculos"){t.innerHTML='<div id="st-body"></div>';const c=document.getElementById("st-body");c.innerHTML=Ie(),He(s,o);return}let n=`<div class="screen-head"><h1>Estadísticas</h1></div>
    <label class="f">Vista</label>
    <select id="st-tab">${ee(d)}</select>
    <div id="st-body" style="margin-top:12px"></div>`;t.innerHTML=n;const l=document.getElementById("st-body"),u=()=>{l.innerHTML=Se(s)},i=c=>{l.innerHTML=Be(c,s),Te(c,s)},p=()=>{l.innerHTML=se(s),ae(s)};document.getElementById("st-tab")?.addEventListener("change",c=>{const r=c.target.value;if(r==="musculos"){o(r);return}r==="global"?u():r==="felicidad"?p():i(e.get("ex")??V(s)??"")}),d==="exercise"?i(e.get("ex")??V(s)??""):d==="global"?u():p()}function V(t){for(const e of t){const s=e.exercises.find(d=>d.sets.some(o=>o.done));if(s)return s.exerciseId}return null}function Se(t){if(!t.length)return'<div class="empty">Sin datos todavía.<br>Registra tu primera sesión en Entrenar.</div>';const e=new Set(t.map(p=>T(new Date(p.startTime)))),s=new Date,d=`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`,o=t.filter(p=>{const c=new Date(p.startTime);return`${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,"0")}`===d}),n=o.reduce((p,c)=>p+ne(c),0),l=o.reduce((p,c)=>p+ie(c),0);let u=0;const i=new Date;for(e.has(T(i))||i.setDate(i.getDate()-1);e.has(T(i));)u++,i.setDate(i.getDate()-1);return`
    <div class="kpis">
      <div class="kpi"><div class="kpi-val num">${o.length}</div><div class="kpi-lab">Sesiones (mes)</div></div>
      <div class="kpi"><div class="kpi-val num">${I(n)}</div><div class="kpi-lab">Volumen kg</div></div>
      <div class="kpi"><div class="kpi-val num">${l}</div><div class="kpi-lab">Series (mes)</div></div>
      <div class="kpi"><div class="kpi-val num">${u}</div><div class="kpi-lab">Racha días</div></div>
    </div>
    <div class="sec-title">Consistencia · últimas 16 semanas</div>
    <div class="card">${re(e,16)}
      <div class="small muted" style="margin-top:8px">${e.size} ${e.size===1?"día":"días"} con entreno en total</div></div>`}let b="peso",$="3M";const De={"1M":30,"3M":91,"6M":182,"1A":365,todo:0},D={"1M":"1M","3M":"3M","6M":"6M","1A":"1A",todo:"Todo"},Z={peso:"Peso máx",volumen:"Volumen",veces:"Veces"};function z(t){const e=new Date(t),s=(e.getDay()+6)%7;return e.setHours(0,0,0,0),e.setDate(e.getDate()-s),e.getTime()}const A=t=>new Date(t).toLocaleDateString("es-ES",{day:"numeric",month:"short"});function Be(t,e){const s=[...new Set(e.flatMap(i=>(i.exercises??[]).map(p=>p.exerciseId)))];t&&!s.includes(t)&&(t=s[0]??"");const d=s.map(i=>`<option value="${i}" ${i===t?"selected":""}>${P(we(i))}</option>`).join("");if(!t)return'<div class="empty">Sin datos todavía.</div>';const o=oe(t,e),n=le(t,e),l=Object.keys(Z).map(i=>`<option value="${i}" ${i===b?"selected":""}>${Z[i]}</option>`).join(""),u=Object.keys(D).map(i=>`<option value="${i}" ${i===$?"selected":""}>${D[i]}</option>`).join("");return`
    <label class="f">Ejercicio</label>
    <select id="st-ex">${d}</select>
    <div class="kpis" style="margin-top:10px">
      <div class="kpi"><div class="kpi-val num">${I(o.maxWeightKg)}</div><div class="kpi-lab">Peso máx</div></div>
      <div class="kpi"><div class="kpi-val num">${I(o.best1RM)}</div><div class="kpi-lab">1RM est.</div></div>
      <div class="kpi"><div class="kpi-val num">${o.maxReps}</div><div class="kpi-lab">Reps máx</div></div>
      <div class="kpi"><div class="kpi-val num">${n.length}</div><div class="kpi-lab">Sesiones</div></div>
    </div>
    <div class="sec-title">Evolución</div>
    <div class="sel-row">
      <div><label class="f">Métrica</label><select id="st-metric">${l}</select></div>
      <div><label class="f">Periodo</label><select id="st-period">${u}</select></div>
    </div>
    <div class="card" style="margin-top:10px"><div id="st-chart"></div></div>`}function _(t,e){const s=document.getElementById("st-chart");if(!s)return;const d=Date.now(),o=De[$],n=o===0?0:d-o*864e5;if(b==="veces"){const m=new Map;for(const v of ce(t,e)){if(v<n)continue;const a=z(v);m.set(a,(m.get(a)??0)+1)}const g=[...m.entries()].sort((v,a)=>v[0]-a[0]).map(([v,a])=>({x:v,y:a,label:A(v)}));s.innerHTML=`<div class="small muted" style="margin-bottom:6px">Sesiones por semana · ${D[$]}</div>`+me(g,{color:"#0ea5e9"});return}const l=$==="6M"||$==="1A"||$==="todo";let u=de(t,e).filter(m=>m.date>=n);const i=!l&&u.length<=40;let p,c;if(i)c="por sesión",p=u.map(m=>({x:m.date,y:b==="peso"?Math.round(m.maxWeightKg*10)/10:Math.round(m.volumeKg),label:A(m.date)}));else{c="por semana";const m=new Map;for(const g of u){const v=z(g.date);m.has(v)||m.set(v,[]),m.get(v).push(b==="peso"?g.maxWeightKg:g.volumeKg)}p=[...m.entries()].sort((g,v)=>g[0]-v[0]).map(([g,v])=>({x:g,y:b==="peso"?Math.round(Math.max(...v)*10)/10:Math.round(v.reduce((a,C)=>a+C,0)),label:A(g)}))}const r=b==="peso"?"Peso máximo":"Volumen";s.innerHTML=`<div class="small muted" style="margin-bottom:6px">${r} ${c} (kg) · ${D[$]}</div>`+H(p,{unit:" kg",color:b==="peso"?"#2f7df6":"#7c3aed"})}function Te(t,e){document.getElementById("st-ex")?.addEventListener("change",s=>{const d=s.target.value;location.hash=`#/stats?tab=exercise&ex=${encodeURIComponent(d)}`}),document.getElementById("st-metric")?.addEventListener("change",s=>{b=s.target.value,_(t,e)}),document.getElementById("st-period")?.addEventListener("change",s=>{$=s.target.value,_(t,e)}),_(t,e)}let j="1M",B="front";const te={"7D":7,"1M":30,"3M":91,"6M":182};function F(t){const e=[[43,92,171],[135,88,142],[255,91,85]],s=Math.min(1,Math.max(0,t))*(e.length-1),d=Math.min(e.length-2,Math.floor(s)),o=s-d,n=e[d].map((l,u)=>Math.round(l+(e[d+1][u]-l)*o));return`rgb(${n[0]},${n[1]},${n[2]})`}const U='<svg class="flt-chev" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4.5 7.5 9 12l4.5-4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',Ae='<svg class="flt-ico" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="4.5" width="14" height="12.5" rx="2.5" stroke="currentColor" stroke-width="1.6"/><path d="M3 8.5h14M7 3v3M13 3v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',_e='<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8.2" stroke="currentColor" stroke-width="1.6"/><path d="M10 9.2v4.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="6.6" r="1.15" fill="currentColor"/></svg>',Pe='<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M7.5 4.5 12 9l-4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';function Ie(){const t=Object.keys(te).map(e=>`<option value="${e}" ${e===j?"selected":""}>${e==="7D"?"Semana":e==="1M"?"Mes":e}</option>`).join("");return`
    <div class="am-head">
      <h1>Actividad muscular</h1>
      <p class="am-sub">Tu entrenamiento, por grupos musculares</p>
    </div>
    <div class="card am-card">
      <label class="flt">
        <span class="flt-top">Visualización</span>
        <span class="flt-main">
          <select id="st-tab" class="flt-select" aria-label="Visualización">${ee("musculos")}</select>
          ${U}
        </span>
      </label>
      <label class="flt">
        <span class="flt-top">Periodo</span>
        <span class="flt-main">
          ${Ae}
          <select id="st-mperiod" class="flt-select" aria-label="Periodo">${t}</select>
          ${U}
        </span>
      </label>
    </div>
    <div class="card am-card">
      <div class="am-rowhead">
        <h2>Mapa muscular</h2>
        <button type="button" class="am-info" id="st-mapinfo" aria-label="Acerca del mapa muscular" aria-expanded="false">${_e}</button>
      </div>
      <div class="segctl" role="group" aria-label="Vista del mapa">
        <button type="button" class="segctl-btn${B==="front"?" on":""}" data-mview="front">Frontal</button>
        <button type="button" class="segctl-btn${B==="back"?" on":""}" data-mview="back">Posterior</button>
      </div>
      <div class="bodymap am-bodymap" id="st-bodymap"></div>
      <div class="am-zoneinfo" id="st-zoneinfo" hidden></div>
      <p class="am-caption">Distribución del entrenamiento · toca un grupo para ver sus datos</p>
      <div class="am-pop" id="st-mappop" hidden>
        El color indica tu reparto de series efectivas por grupo muscular en el periodo,
        ponderadas por el estímulo real de cada ejercicio. Los tonos cálidos marcan los
        grupos más trabajados.
      </div>
    </div>
    <div class="card am-card">
      <h2 class="am-h2">Reparto por grupo muscular</h2>
      <div id="st-musclelist"></div>
      <button type="button" class="am-more" id="st-allgroups" aria-expanded="false">
        <span>Ver todos los grupos</span>${Pe}
      </button>
    </div>`}let E=!1;function x(t){const e=document.getElementById("st-bodymap"),s=document.getElementById("st-musclelist"),d=document.getElementById("st-allgroups");if(!e||!s)return;const o=Date.now()-te[j]*864e5,n=pe(t,R,o);if(d&&(d.style.display=n.length>3?"":"none"),!n.length){e.innerHTML="",s.innerHTML='<div class="chart-empty">Sin datos en este periodo</div>';return}e.innerHTML=B==="front"?ye():ke();const l=Math.max(...n.map(r=>r.sets)),u=new Map(n.map(r=>[r.zone,r])),i=document.getElementById("st-zoneinfo");let p=null;e.querySelectorAll(".mz").forEach(r=>{const m=r.id.replace(/^mz-/,""),g=u.get(m),v=g?Math.pow(g.sets/l,.65):0;r.style.fill=F(v),r.style.cursor="pointer",r.addEventListener("click",()=>{if(!i)return;if(p===m){p=null,i.hidden=!0;return}p=m;const a=g?.label??ue.find(C=>C.id===m)?.label??m;i.innerHTML=g?`<strong>${P(a)}</strong> · <span class="num">${g.sets.toFixed(1)}</span> series efectivas · <span class="num">${g.pct.toFixed(0)} %</span> del periodo`:`<strong>${P(a)}</strong> · sin trabajo en este periodo`,i.hidden=!1})});const c=E?n:n.slice(0,3);s.innerHTML='<div class="am-bars">'+c.map(r=>{const m=Math.pow(r.sets/l,.65);return`<div class="am-bar">
      <div class="am-bar-top"><span>${r.label}</span><span class="num">${r.pct.toFixed(0)} %</span></div>
      <div class="am-track"><span class="am-fill" style="width:${Math.max(2,r.pct).toFixed(1)}%;background:${F(m)}"></span></div>
    </div>`}).join("")+"</div>"}function K(t){const e=document.getElementById("st-mappop"),s=document.getElementById("st-mapinfo");e&&!e.hidden&&!t.target.closest(".am-card")&&(e.hidden=!0,s?.setAttribute("aria-expanded","false"))}function He(t,e){document.getElementById("st-tab")?.addEventListener("change",n=>{const l=n.target.value;l!=="musculos"&&e(l)}),document.getElementById("st-mperiod")?.addEventListener("change",n=>{j=n.target.value,x(t)}),document.querySelectorAll(".segctl-btn").forEach(n=>{n.addEventListener("click",()=>{B=n.dataset.mview,document.querySelectorAll(".segctl-btn").forEach(l=>l.classList.toggle("on",l===n)),x(t)})});const s=document.getElementById("st-mapinfo"),d=document.getElementById("st-mappop");s?.addEventListener("click",n=>{n.stopPropagation();const l=d?.hidden??!0;d&&(d.hidden=!l),s.setAttribute("aria-expanded",String(l))}),document.removeEventListener("click",K),document.addEventListener("click",K);const o=document.getElementById("st-allgroups");o?.addEventListener("click",()=>{E=!E,o.setAttribute("aria-expanded",String(E)),o.querySelector("span").textContent=E?"Ver menos grupos":"Ver todos los grupos",x(t)}),x(t)}let w="3M";const W={"1M":"1M","3M":"3M","6M":"6M",Todo:"Todo"};function Oe(t){const e=new Date(t);return e.setHours(0,0,0,0),e.getTime()-(e.getDay()+6)%7*864e5}function se(t){const e=Date.now(),s=864e5,d=w==="1M"?e-30*s:w==="3M"?e-91*s:w==="6M"?e-182*s:0,o=t.filter(a=>a.startTime>=d&&(a.fatigue!=null||a.satisfaction!=null)),l=`<label class="f">Periodo</label><select id="st-fperiod">${Object.keys(W).map(a=>`<option value="${a}" ${a===w?"selected":""}>${W[a]}</option>`).join("")}</select>`;if(!o.length)return l+'<div class="empty">Sin datos todavía.<br>Valora tus sesiones al terminarlas (foto y valoración opcionales).</div>';const u=a=>a.reduce((C,M)=>C+M,0)/a.length,i=o.map(a=>a.satisfaction).filter(a=>a!=null),p=o.map(a=>a.fatigue).filter(a=>a!=null),c=new Map;for(const a of o){const C=Oe(a.startTime);let M=c.get(C);M||(M={sat:[],fat:[]},c.set(C,M)),a.satisfaction!=null&&M.sat.push(a.satisfaction),a.fatigue!=null&&M.fat.push(a.fatigue)}const r=[...c.keys()].sort((a,C)=>a-C),m=a=>new Date(a).toLocaleDateString("es-ES",{day:"numeric",month:"short"}),g=r.filter(a=>c.get(a).sat.length).map((a,C)=>({x:C,y:u(c.get(a).sat),label:m(a)})),v=r.filter(a=>c.get(a).fat.length).map((a,C)=>({x:C,y:u(c.get(a).fat),label:m(a)}));return l+`<div class="kpis" style="margin-top:14px">
      <div class="kpi"><div class="kpi-val num">${i.length?u(i).toFixed(1):"—"}</div><div class="kpi-lab">Satisfacción media</div></div>
      <div class="kpi"><div class="kpi-val num">${p.length?u(p).toFixed(1):"—"}</div><div class="kpi-lab">Cansancio medio</div></div>
      <div class="kpi"><div class="kpi-val num">${o.length}</div><div class="kpi-lab">Sesiones valoradas</div></div>
    </div>
    <div class="sec-title">Satisfacción media por semana</div>
    ${H(g,{color:"#0f766e",unit:"/5"})}
    <div class="sec-title">Cansancio medio por semana</div>
    ${H(v,{color:"#ea580c",unit:"/5"})}
    <div class="muted small" style="margin-top:8px">Escala 1–5 · se guarda al terminar cada sesión</div>`}function ae(t){document.getElementById("st-fperiod")?.addEventListener("change",e=>{w=e.target.value;const s=document.getElementById("st-body");s.innerHTML=se(t),ae(t)})}export{xe as renderStats};
