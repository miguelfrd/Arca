import{d as U,e as se}from"./index-BW0ufMRY.js";import{w as ae,b as _,e as ie,c as ne,g as oe,h as le}from"./stats-Cz7THz2Z.js";import{c as ce,l as I,a as de}from"./charts-Cq8LCExg.js";import{m as re}from"./muscle-load-BL7lTJEv.js";import{t as B}from"./types-CEDv8i23.js";const x="#2b5cab",k="#1a3c74";function H(t){return t.replace(/[MLC][^MLCZ]*/g,e=>{const s=e[0],l=e.slice(1).trim().split(/[\s,]+/).filter(i=>i.length).map(Number).map((i,c)=>c%2===0?200-i:i);return s+l.join(" ")}).replace(/\s+/g," ").trim()}const W="M91,52 C90,58 89,62 89,66 C80,68 66,72 54,80 C46,82 39,87 34,95 C29,105 28,119 30,133 C31,142 32,149 34,156 C30,176 26,198 24,218 C23,226 22,232 22,238 C22,244 25,247 30,246 C34,245 35,241 35,235 C36,228 37,222 38,216 C40,198 42,180 44,164 C45,156 48,148 52,140 C56,130 61,120 65,110 C63,124 62,138 63,152 C65,166 69,178 73,190 C71,202 69,210 69,220 C65,244 62,272 61,306 C60,328 59,354 57,380 C56,385 54,389 51,392 C48,394 48,398 52,400 C57,402 63,402 68,400 C71,399 71,396 69,393 C68,389 67,386 67,382 C69,362 71,336 75,310 C78,288 82,264 87,242 L100,238 L113,242 C118,264 122,288 125,310 C129,336 131,362 133,382 C133,386 132,389 131,393 C129,396 129,399 132,400 C137,402 143,402 148,400 C152,398 152,394 149,392 C146,389 144,385 143,380 C141,354 140,328 139,306 C138,272 135,244 131,220 C131,210 129,202 127,190 C131,178 135,166 137,152 C138,138 137,124 135,110 C139,120 144,130 148,140 C152,148 155,156 156,164 C158,180 160,198 162,216 C163,222 164,228 165,235 C165,241 166,245 170,246 C175,247 178,244 178,238 C178,232 177,226 176,218 C174,198 170,176 166,156 C168,149 169,142 170,133 C172,119 171,105 166,95 C161,87 154,82 146,80 C134,72 120,68 111,66 C111,62 110,58 109,52 Z",G="M100,8 C110,8 117,18 117,32 C117,46 110,54 100,54 C90,54 83,46 83,32 C83,18 90,8 100,8 Z";function y(t,e){return`<path id="mz-${t}" class="mz" d="${e}" fill="${x}" stroke="${k}" stroke-width="1.2"/>`}function h(t,e){return y(t,`${e} ${H(e)}`)}function g(t){return`<path d="${t}" fill="none" stroke="${k}" stroke-width="1.4" opacity="0.5" stroke-linecap="round"/>`}const N="M54,76 C45,79 38,88 35,102 C33,114 37,123 43,125 C50,123 55,115 56,104 C56,92 56,82 54,76 Z",q="M42,118 C36,128 33,142 35,154 C37,162 43,163 47,157 C50,147 50,132 47,120 Z",Y="M35,178 C31,194 28,212 29,224 C30,231 36,231 38,224 C40,210 40,194 38,180 Z",S="M62,332 C59,347 58,364 60,375 C62,381 67,381 69,374 C71,361 70,347 68,334 Z",me="M94,90 C84,88 73,91 67,98 C63,104 65,112 71,117 C78,122 86,124 92,122 C94,112 94,100 94,90 Z",pe="M72,252 C67,270 65,290 67,308 C69,316 75,316 78,309 C80,292 80,272 78,254 Z",ue="M70,256 C67,270 66,288 68,302 C70,309 75,309 77,302 C79,288 79,270 77,256 Z",ve="M78,136 C87,134 113,134 122,136 C123,156 122,178 119,196 C116,205 108,209 100,209 C92,209 84,205 81,196 C78,178 77,156 78,136 Z",X="M92,66 C98,64 102,64 108,66 L138,80 C140,84 138,87 134,88 L120,92 C113,94 106,94 100,94 C94,94 87,94 80,92 L66,88 C62,87 60,84 62,80 Z",ge="M78,88 C87,86 113,86 122,88 C123,110 122,132 120,150 C112,156 88,156 80,150 C78,132 77,110 78,88 Z",fe="M70,102 C65,114 63,130 65,146 C67,160 73,170 80,174 C82,160 80,142 78,126 C76,116 74,108 70,102 Z",Ce="M74,214 C71,224 72,236 77,243 C81,247 86,245 87,239 C88,230 87,221 85,214 Z",he="M70,256 C66,274 65,294 68,310 C70,317 76,317 78,310 C80,294 79,274 77,256 Z";function be(){return`<svg viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mapa muscular frontal">
  <path d="${W}" fill="${x}" stroke="${k}" stroke-width="1.5"/>
  <path d="${G}" fill="${x}" stroke="${k}" stroke-width="1.5"/>
  ${y("gemelo",`${S} ${H(S)}`)}
  ${h("cuadriceps",pe)}
  ${h("aductor",ue)}
  ${y("core",ve)}
  ${h("biceps",q)}
  ${h("antebrazo",Y)}
  ${h("pecho",me)}
  ${h("hombro",N)}
  ${y("trapecio",X)}
  ${g("M100,140 C100,160 100,180 100,204")}
  ${g("M84,156 C92,158 108,158 116,156")}
  ${g("M83,172 C91,174 109,174 117,172")}
  ${g("M84,188 C92,190 108,190 116,188")}
  ${g("M100,92 C100,102 100,110 100,118")}
  ${g("M70,92 C78,98 86,101 93,101")}
  ${g("M130,92 C122,98 114,101 107,101")}
  ${g("M72,262 C70,280 70,296 72,308")}
  ${g("M128,262 C130,280 130,296 128,308")}
</svg>`}function $e(){return`<svg viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mapa muscular dorsal">
  <path d="${W}" fill="${x}" stroke="${k}" stroke-width="1.5"/>
  <path d="${G}" fill="${x}" stroke="${k}" stroke-width="1.5"/>
  ${y("gemelo",`${S} ${H(S)}`)}
  ${h("isquio",he)}
  ${h("gluteo",Ce)}
  ${h("dorsal",fe)}
  ${y("espalda",ge)}
  ${h("triceps",q)}
  ${h("antebrazo",Y)}
  ${h("hombro",N)}
  ${y("trapecio",X)}
  ${g("M100,92 C100,116 100,140 100,160")}
  ${g("M80,72 C89,77 111,77 120,72")}
  ${g("M68,120 C66,134 66,148 70,160")}
  ${g("M132,120 C134,134 134,148 130,160")}
  ${g("M78,230 C84,236 90,239 94,239")}
  ${g("M122,230 C116,236 110,239 106,239")}
</svg>`}let O=new Map;async function Me(){O=new Map((await U.all("exercises")).map(t=>[t.id,t]))}const ye=t=>O.get(t)?.nameEs??t.replace(/^desconocido:/,""),ke={musculos:"Músculos",global:"General",exercise:"Por ejercicio",felicidad:"Felicidad"},Q=t=>Object.entries(ke).map(([e,s])=>`<option value="${e}" ${e===t?"selected":""}>${s}</option>`).join("");async function Ee(t,e){await Me();const s=await U.workoutsDesc(400),o=e.get("tab")??"musculos",l=d=>{const v=new URLSearchParams(e);v.set("tab",d),Ee(t,v)};if(o==="musculos"){t.innerHTML='<div id="st-body"></div>';const d=document.getElementById("st-body");d.innerHTML=Ae(),Pe(s,l);return}let i=`<div class="screen-head"><h1>Estadísticas</h1></div>
    <label class="f">Vista</label>
    <select id="st-tab">${Q(o)}</select>
    <div id="st-body" style="margin-top:12px"></div>`;t.innerHTML=i;const c=document.getElementById("st-body"),p=()=>{c.innerHTML=we(s)},r=d=>{c.innerHTML=Le(d,s),Se(d,s)},n=()=>{c.innerHTML=ee(s),te(s)};document.getElementById("st-tab")?.addEventListener("change",d=>{const v=d.target.value;if(v==="musculos"){l(v);return}v==="global"?p():v==="felicidad"?n():r(e.get("ex")??V(s)??"")}),o==="exercise"?r(e.get("ex")??V(s)??""):o==="global"?p():n()}function V(t){for(const e of t){const s=e.exercises.find(o=>o.sets.some(l=>l.done));if(s)return s.exerciseId}return null}function we(t){if(!t.length)return'<div class="empty">Sin datos todavía.<br>Registra tu primera sesión en Entrenar.</div>';const e=new Set(t.map(n=>B(new Date(n.startTime)))),s=new Date,o=`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`,l=t.filter(n=>{const d=new Date(n.startTime);return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`===o}),i=l.reduce((n,d)=>n+ae(d),0),c=l.reduce((n,d)=>n+(d.exercises??[]).reduce((v,m)=>v+(m.sets??[]).filter(f=>f.done).length,0),0);let p=0;const r=new Date;for(e.has(B(r))||r.setDate(r.getDate()-1);e.has(B(r));)p++,r.setDate(r.getDate()-1);return`
    <div class="kpis">
      <div class="kpi"><div class="kpi-val num">${l.length}</div><div class="kpi-lab">Sesiones (mes)</div></div>
      <div class="kpi"><div class="kpi-val num">${_(i)}</div><div class="kpi-lab">Volumen kg</div></div>
      <div class="kpi"><div class="kpi-val num">${c}</div><div class="kpi-lab">Series (mes)</div></div>
      <div class="kpi"><div class="kpi-val num">${p}</div><div class="kpi-lab">Racha días</div></div>
    </div>
    <div class="sec-title">Consistencia · últimas 16 semanas</div>
    <div class="card">${ce(e,16)}
      <div class="small muted" style="margin-top:8px">${e.size} ${e.size===1?"día":"días"} con entreno en total</div></div>`}let b="peso",$="3M";const xe={"1M":31,"3M":92,"6M":183,"1A":365,todo:0},D={"1M":"1M","3M":"3M","6M":"6M","1A":"1A",todo:"Todo"},j={peso:"Peso máx",volumen:"Volumen",veces:"Veces"};function Z(t){const e=new Date(t),s=(e.getDay()+6)%7;return e.setHours(0,0,0,0),e.setDate(e.getDate()-s),e.getTime()}const A=t=>new Date(t).toLocaleDateString("es-ES",{day:"numeric",month:"short"});function Le(t,e){const o=[...new Set(e.flatMap(r=>r.exercises.map(n=>n.exerciseId)))].map(r=>`<option value="${r}" ${r===t?"selected":""}>${se(ye(r))}</option>`).join("");if(!t)return'<div class="empty">Sin datos todavía.</div>';const l=ie(t,e),i=ne(t,e),c=Object.keys(j).map(r=>`<option value="${r}" ${r===b?"selected":""}>${j[r]}</option>`).join(""),p=Object.keys(D).map(r=>`<option value="${r}" ${r===$?"selected":""}>${D[r]}</option>`).join("");return`
    <label class="f">Ejercicio</label>
    <select id="st-ex">${o}</select>
    <div class="kpis" style="margin-top:10px">
      <div class="kpi"><div class="kpi-val num">${_(l.maxWeightKg)}</div><div class="kpi-lab">Peso máx</div></div>
      <div class="kpi"><div class="kpi-val num">${_(l.best1RM)}</div><div class="kpi-lab">1RM est.</div></div>
      <div class="kpi"><div class="kpi-val num">${l.maxReps}</div><div class="kpi-lab">Reps máx</div></div>
      <div class="kpi"><div class="kpi-val num">${i.length}</div><div class="kpi-lab">Sesiones</div></div>
    </div>
    <div class="sec-title">Evolución</div>
    <div class="sel-row">
      <div><label class="f">Métrica</label><select id="st-metric">${c}</select></div>
      <div><label class="f">Periodo</label><select id="st-period">${p}</select></div>
    </div>
    <div class="card" style="margin-top:10px"><div id="st-chart"></div></div>`}function P(t,e){const s=document.getElementById("st-chart");if(!s)return;const o=Date.now(),l=xe[$],i=l===0?0:o-l*864e5;if(b==="veces"){const m=new Map;for(const u of oe(t,e)){if(u<i)continue;const a=Z(u);m.set(a,(m.get(a)??0)+1)}const f=[...m.entries()].sort((u,a)=>u[0]-a[0]).map(([u,a])=>({x:u,y:a,label:A(u)}));s.innerHTML=`<div class="small muted" style="margin-bottom:6px">Sesiones por semana · ${D[$]}</div>`+de(f,{color:"#0ea5e9"});return}const c=$==="6M"||$==="1A"||$==="todo";let p=le(t,e).filter(m=>m.date>=i);const r=!c&&p.length<=40;let n,d;if(r)d="por sesión",n=p.map(m=>({x:m.date,y:b==="peso"?Math.round(m.maxWeightKg*10)/10:Math.round(m.volumeKg),label:A(m.date)}));else{d="por semana";const m=new Map;for(const f of p){const u=Z(f.date);m.has(u)||m.set(u,[]),m.get(u).push(b==="peso"?f.maxWeightKg:f.volumeKg)}n=[...m.entries()].sort((f,u)=>f[0]-u[0]).map(([f,u])=>({x:f,y:b==="peso"?Math.round(Math.max(...u)*10)/10:Math.round(u.reduce((a,C)=>a+C,0)),label:A(f)}))}const v=b==="peso"?"Peso máximo":"Volumen";s.innerHTML=`<div class="small muted" style="margin-bottom:6px">${v} ${d} (kg) · ${D[$]}</div>`+I(n,{unit:" kg",color:b==="peso"?"#2f7df6":"#7c3aed"})}function Se(t,e){document.getElementById("st-ex")?.addEventListener("change",s=>{const o=s.target.value;location.hash=`#/stats?tab=exercise&ex=${encodeURIComponent(o)}`}),document.getElementById("st-metric")?.addEventListener("change",s=>{b=s.target.value,P(t,e)}),document.getElementById("st-period")?.addEventListener("change",s=>{$=s.target.value,P(t,e)}),P(t,e)}let R="1M",T="front";const J={"7D":7,"1M":31,"3M":92,"6M":183};function F(t){const e=[[43,92,171],[135,88,142],[255,91,85]],s=Math.min(1,Math.max(0,t))*(e.length-1),o=Math.min(e.length-2,Math.floor(s)),l=s-o,i=e[o].map((c,p)=>Math.round(c+(e[o+1][p]-c)*l));return`rgb(${i[0]},${i[1]},${i[2]})`}const z='<svg class="flt-chev" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4.5 7.5 9 12l4.5-4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',De='<svg class="flt-ico" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="4.5" width="14" height="12.5" rx="2.5" stroke="currentColor" stroke-width="1.6"/><path d="M3 8.5h14M7 3v3M13 3v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',Te='<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8.2" stroke="currentColor" stroke-width="1.6"/><path d="M10 9.2v4.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="6.6" r="1.15" fill="currentColor"/></svg>',Be='<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M7.5 4.5 12 9l-4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';function Ae(){const t=Object.keys(J).map(e=>`<option value="${e}" ${e===R?"selected":""}>${e==="7D"?"Semana":e==="1M"?"Mes":e}</option>`).join("");return`
    <div class="am-head">
      <h1>Actividad muscular</h1>
      <p class="am-sub">Tu entrenamiento, por grupos musculares</p>
    </div>
    <div class="card am-card">
      <label class="flt">
        <span class="flt-top">Visualización</span>
        <span class="flt-main">
          <select id="st-tab" class="flt-select" aria-label="Visualización">${Q("musculos")}</select>
          ${z}
        </span>
      </label>
      <label class="flt">
        <span class="flt-top">Periodo</span>
        <span class="flt-main">
          ${De}
          <select id="st-mperiod" class="flt-select" aria-label="Periodo">${t}</select>
          ${z}
        </span>
      </label>
    </div>
    <div class="card am-card">
      <div class="am-rowhead">
        <h2>Mapa muscular</h2>
        <button type="button" class="am-info" id="st-mapinfo" aria-label="Acerca del mapa muscular" aria-expanded="false">${Te}</button>
      </div>
      <div class="segctl" role="group" aria-label="Vista del mapa">
        <button type="button" class="segctl-btn${T==="front"?" on":""}" data-mview="front">Frontal</button>
        <button type="button" class="segctl-btn${T==="back"?" on":""}" data-mview="back">Posterior</button>
      </div>
      <div class="bodymap am-bodymap" id="st-bodymap"></div>
      <p class="am-caption">Distribución del entrenamiento</p>
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
        <span>Ver todos los grupos</span>${Be}
      </button>
    </div>`}let E=!1;function L(t){const e=document.getElementById("st-bodymap"),s=document.getElementById("st-musclelist"),o=document.getElementById("st-allgroups");if(!e||!s)return;const l=Date.now()-J[R]*864e5,i=re(t,O,l);if(o&&(o.style.display=i.length>3?"":"none"),!i.length){e.innerHTML="",s.innerHTML='<div class="chart-empty">Sin datos en este periodo</div>';return}e.innerHTML=T==="front"?be():$e();const c=Math.max(...i.map(n=>n.sets)),p=new Map(i.map(n=>[n.zone,n]));e.querySelectorAll(".mz").forEach(n=>{const d=n.id.replace(/^mz-/,""),v=p.get(d),m=v?Math.pow(v.sets/c,.65):0;n.style.fill=F(m)});const r=E?i:i.slice(0,3);s.innerHTML='<div class="am-bars">'+r.map(n=>{const d=Math.pow(n.sets/c,.65);return`<div class="am-bar">
      <div class="am-bar-top"><span>${n.label}</span><span class="num">${n.pct.toFixed(0)} %</span></div>
      <div class="am-track"><span class="am-fill" style="width:${Math.max(2,n.pct).toFixed(1)}%;background:${F(d)}"></span></div>
    </div>`}).join("")+"</div>"}function Pe(t,e){document.getElementById("st-tab")?.addEventListener("change",i=>{const c=i.target.value;c!=="musculos"&&e(c)}),document.getElementById("st-mperiod")?.addEventListener("change",i=>{R=i.target.value,L(t)}),document.querySelectorAll(".segctl-btn").forEach(i=>{i.addEventListener("click",()=>{T=i.dataset.mview,document.querySelectorAll(".segctl-btn").forEach(c=>c.classList.toggle("on",c===i)),L(t)})});const s=document.getElementById("st-mapinfo"),o=document.getElementById("st-mappop");s?.addEventListener("click",i=>{i.stopPropagation();const c=o?.hidden??!0;o&&(o.hidden=!c),s.setAttribute("aria-expanded",String(c))}),document.addEventListener("click",function(c){o&&!o.hidden&&!c.target.closest(".am-card")&&(o.hidden=!0,s?.setAttribute("aria-expanded","false"))});const l=document.getElementById("st-allgroups");l?.addEventListener("click",()=>{E=!E,l.setAttribute("aria-expanded",String(E)),l.querySelector("span").textContent=E?"Ver menos grupos":"Ver todos los grupos",L(t)}),L(t)}let w="3M";const K={"1M":"1M","3M":"3M","6M":"6M",Todo:"Todo"};function _e(t){const e=new Date(t);return e.setHours(0,0,0,0),e.getTime()-(e.getDay()+6)%7*864e5}function ee(t){const e=Date.now(),s=864e5,o=w==="1M"?e-30*s:w==="3M"?e-91*s:w==="6M"?e-182*s:0,l=t.filter(a=>a.startTime>=o&&(a.fatigue!=null||a.satisfaction!=null)),c=`<label class="f">Periodo</label><select id="st-fperiod">${Object.keys(K).map(a=>`<option value="${a}" ${a===w?"selected":""}>${K[a]}</option>`).join("")}</select>`;if(!l.length)return c+'<div class="empty">Sin datos todavía.<br>Valora tus sesiones al terminarlas (foto y valoración opcionales).</div>';const p=a=>a.reduce((C,M)=>C+M,0)/a.length,r=l.map(a=>a.satisfaction).filter(a=>a!=null),n=l.map(a=>a.fatigue).filter(a=>a!=null),d=new Map;for(const a of l){const C=_e(a.startTime);let M=d.get(C);M||(M={sat:[],fat:[]},d.set(C,M)),a.satisfaction!=null&&M.sat.push(a.satisfaction),a.fatigue!=null&&M.fat.push(a.fatigue)}const v=[...d.keys()].sort((a,C)=>a-C),m=a=>new Date(a).toLocaleDateString("es-ES",{day:"numeric",month:"short"}),f=v.filter(a=>d.get(a).sat.length).map((a,C)=>({x:C,y:p(d.get(a).sat),label:m(a)})),u=v.filter(a=>d.get(a).fat.length).map((a,C)=>({x:C,y:p(d.get(a).fat),label:m(a)}));return c+`<div class="kpis" style="margin-top:14px">
      <div class="kpi"><div class="kpi-val num">${r.length?p(r).toFixed(1):"—"}</div><div class="kpi-lab">Satisfacción media</div></div>
      <div class="kpi"><div class="kpi-val num">${n.length?p(n).toFixed(1):"—"}</div><div class="kpi-lab">Cansancio medio</div></div>
      <div class="kpi"><div class="kpi-val num">${l.length}</div><div class="kpi-lab">Sesiones valoradas</div></div>
    </div>
    <div class="sec-title">Satisfacción media por semana</div>
    ${I(f,{color:"#0f766e",unit:"/5"})}
    <div class="sec-title">Cansancio medio por semana</div>
    ${I(u,{color:"#ea580c",unit:"/5"})}
    <div class="muted small" style="margin-top:8px">Escala 1–5 · se guarda al terminar cada sesión</div>`}function te(t){document.getElementById("st-fperiod")?.addEventListener("change",e=>{w=e.target.value;const s=document.getElementById("st-body");s.innerHTML=ee(t),te(t)})}export{Ee as renderStats};
