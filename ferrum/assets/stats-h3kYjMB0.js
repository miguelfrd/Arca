import{d as W,e as ae}from"./index-BL9MLBT4.js";import{w as ie,a as ne,b as _,e as oe,c as le,g as ce,h as de}from"./stats-CJKsKY2L.js";import{c as re,l as H,a as me}from"./charts-D8nMVL7S.js";import{m as pe}from"./muscle-load-BL7lTJEv.js";import{t as T}from"./types-CEDv8i23.js";const L="#2b5cab",k="#1a3c74";function I(t){return t.replace(/[MLC][^MLCZ]*/g,e=>{const s=e[0],o=e.slice(1).trim().split(/[\s,]+/).filter(i=>i.length).map(Number).map((i,d)=>d%2===0?200-i:i);return s+o.join(" ")}).replace(/\s+/g," ").trim()}const G="M91,52 C90,58 89,62 89,66 C80,68 66,72 54,80 C46,82 39,87 34,95 C29,105 28,119 30,133 C31,142 32,149 34,156 C30,176 26,198 24,218 C23,226 22,232 22,238 C22,244 25,247 30,246 C34,245 35,241 35,235 C36,228 37,222 38,216 C40,198 42,180 44,164 C45,156 48,148 52,140 C56,130 61,120 65,110 C63,124 62,138 63,152 C65,166 69,178 73,190 C71,202 69,210 69,220 C65,244 62,272 61,306 C60,328 59,354 57,380 C56,385 54,389 51,392 C48,394 48,398 52,400 C57,402 63,402 68,400 C71,399 71,396 69,393 C68,389 67,386 67,382 C69,362 71,336 75,310 C78,288 82,264 87,242 L100,238 L113,242 C118,264 122,288 125,310 C129,336 131,362 133,382 C133,386 132,389 131,393 C129,396 129,399 132,400 C137,402 143,402 148,400 C152,398 152,394 149,392 C146,389 144,385 143,380 C141,354 140,328 139,306 C138,272 135,244 131,220 C131,210 129,202 127,190 C131,178 135,166 137,152 C138,138 137,124 135,110 C139,120 144,130 148,140 C152,148 155,156 156,164 C158,180 160,198 162,216 C163,222 164,228 165,235 C165,241 166,245 170,246 C175,247 178,244 178,238 C178,232 177,226 176,218 C174,198 170,176 166,156 C168,149 169,142 170,133 C172,119 171,105 166,95 C161,87 154,82 146,80 C134,72 120,68 111,66 C111,62 110,58 109,52 Z",N="M100,8 C110,8 117,18 117,32 C117,46 110,54 100,54 C90,54 83,46 83,32 C83,18 90,8 100,8 Z";function y(t,e){return`<path id="mz-${t}" class="mz" d="${e}" fill="${L}" stroke="${k}" stroke-width="1.2"/>`}function h(t,e){return y(t,`${e} ${I(e)}`)}function g(t){return`<path d="${t}" fill="none" stroke="${k}" stroke-width="1.4" opacity="0.5" stroke-linecap="round"/>`}const q="M54,76 C45,79 38,88 35,102 C33,114 37,123 43,125 C50,123 55,115 56,104 C56,92 56,82 54,76 Z",Y="M42,118 C36,128 33,142 35,154 C37,162 43,163 47,157 C50,147 50,132 47,120 Z",X="M35,178 C31,194 28,212 29,224 C30,231 36,231 38,224 C40,210 40,194 38,180 Z",S="M62,332 C59,347 58,364 60,375 C62,381 67,381 69,374 C71,361 70,347 68,334 Z",ue="M94,90 C84,88 73,91 67,98 C63,104 65,112 71,117 C78,122 86,124 92,122 C94,112 94,100 94,90 Z",ve="M72,252 C67,270 65,290 67,308 C69,316 75,316 78,309 C80,292 80,272 78,254 Z",ge="M70,256 C67,270 66,288 68,302 C70,309 75,309 77,302 C79,288 79,270 77,256 Z",fe="M78,136 C87,134 113,134 122,136 C123,156 122,178 119,196 C116,205 108,209 100,209 C92,209 84,205 81,196 C78,178 77,156 78,136 Z",Q="M92,66 C98,64 102,64 108,66 L138,80 C140,84 138,87 134,88 L120,92 C113,94 106,94 100,94 C94,94 87,94 80,92 L66,88 C62,87 60,84 62,80 Z",Ce="M78,88 C87,86 113,86 122,88 C123,110 122,132 120,150 C112,156 88,156 80,150 C78,132 77,110 78,88 Z",he="M70,102 C65,114 63,130 65,146 C67,160 73,170 80,174 C82,160 80,142 78,126 C76,116 74,108 70,102 Z",be="M74,214 C71,224 72,236 77,243 C81,247 86,245 87,239 C88,230 87,221 85,214 Z",Me="M70,256 C66,274 65,294 68,310 C70,317 76,317 78,310 C80,294 79,274 77,256 Z";function $e(){return`<svg viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mapa muscular frontal">
  <path d="${G}" fill="${L}" stroke="${k}" stroke-width="1.5"/>
  <path d="${N}" fill="${L}" stroke="${k}" stroke-width="1.5"/>
  ${y("gemelo",`${S} ${I(S)}`)}
  ${h("cuadriceps",ve)}
  ${h("aductor",ge)}
  ${y("core",fe)}
  ${h("biceps",Y)}
  ${h("antebrazo",X)}
  ${h("pecho",ue)}
  ${h("hombro",q)}
  ${y("trapecio",Q)}
  ${g("M100,140 C100,160 100,180 100,204")}
  ${g("M84,156 C92,158 108,158 116,156")}
  ${g("M83,172 C91,174 109,174 117,172")}
  ${g("M84,188 C92,190 108,190 116,188")}
  ${g("M100,92 C100,102 100,110 100,118")}
  ${g("M70,92 C78,98 86,101 93,101")}
  ${g("M130,92 C122,98 114,101 107,101")}
  ${g("M72,262 C70,280 70,296 72,308")}
  ${g("M128,262 C130,280 130,296 128,308")}
</svg>`}function ye(){return`<svg viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mapa muscular dorsal">
  <path d="${G}" fill="${L}" stroke="${k}" stroke-width="1.5"/>
  <path d="${N}" fill="${L}" stroke="${k}" stroke-width="1.5"/>
  ${y("gemelo",`${S} ${I(S)}`)}
  ${h("isquio",Me)}
  ${h("gluteo",be)}
  ${h("dorsal",he)}
  ${y("espalda",Ce)}
  ${h("triceps",Y)}
  ${h("antebrazo",X)}
  ${h("hombro",q)}
  ${y("trapecio",Q)}
  ${g("M100,92 C100,116 100,140 100,160")}
  ${g("M80,72 C89,77 111,77 120,72")}
  ${g("M68,120 C66,134 66,148 70,160")}
  ${g("M132,120 C134,134 134,148 130,160")}
  ${g("M78,230 C84,236 90,239 94,239")}
  ${g("M122,230 C116,236 110,239 106,239")}
</svg>`}let O=new Map;async function ke(){O=new Map((await W.all("exercises")).map(t=>[t.id,t]))}const Ee=t=>t?O.get(t)?.nameEs??t.replace(/^desconocido:/,""):"Ejercicio",we={musculos:"Músculos",global:"General",exercise:"Por ejercicio",felicidad:"Felicidad"},J=t=>Object.entries(we).map(([e,s])=>`<option value="${e}" ${e===t?"selected":""}>${s}</option>`).join("");async function Le(t,e){await ke();const s=await W.workoutsDesc(400),r=e.get("tab")??"musculos",o=l=>{const v=new URLSearchParams(e);v.set("tab",l),Le(t,v)};if(r==="musculos"){t.innerHTML='<div id="st-body"></div>';const l=document.getElementById("st-body");l.innerHTML=_e(),He(s,o);return}let i=`<div class="screen-head"><h1>Estadísticas</h1></div>
    <label class="f">Vista</label>
    <select id="st-tab">${J(r)}</select>
    <div id="st-body" style="margin-top:12px"></div>`;t.innerHTML=i;const d=document.getElementById("st-body"),m=()=>{d.innerHTML=xe(s)},c=l=>{d.innerHTML=De(l,s),Be(l,s)},n=()=>{d.innerHTML=te(s),se(s)};document.getElementById("st-tab")?.addEventListener("change",l=>{const v=l.target.value;if(v==="musculos"){o(v);return}v==="global"?m():v==="felicidad"?n():c(e.get("ex")??j(s)??"")}),r==="exercise"?c(e.get("ex")??j(s)??""):r==="global"?m():n()}function j(t){for(const e of t){const s=e.exercises.find(r=>r.sets.some(o=>o.done));if(s)return s.exerciseId}return null}function xe(t){if(!t.length)return'<div class="empty">Sin datos todavía.<br>Registra tu primera sesión en Entrenar.</div>';const e=new Set(t.map(n=>T(new Date(n.startTime)))),s=new Date,r=`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`,o=t.filter(n=>{const l=new Date(n.startTime);return`${l.getFullYear()}-${String(l.getMonth()+1).padStart(2,"0")}`===r}),i=o.reduce((n,l)=>n+ie(l),0),d=o.reduce((n,l)=>n+ne(l),0);let m=0;const c=new Date;for(e.has(T(c))||c.setDate(c.getDate()-1);e.has(T(c));)m++,c.setDate(c.getDate()-1);return`
    <div class="kpis">
      <div class="kpi"><div class="kpi-val num">${o.length}</div><div class="kpi-lab">Sesiones (mes)</div></div>
      <div class="kpi"><div class="kpi-val num">${_(i)}</div><div class="kpi-lab">Volumen kg</div></div>
      <div class="kpi"><div class="kpi-val num">${d}</div><div class="kpi-lab">Series (mes)</div></div>
      <div class="kpi"><div class="kpi-val num">${m}</div><div class="kpi-lab">Racha días</div></div>
    </div>
    <div class="sec-title">Consistencia · últimas 16 semanas</div>
    <div class="card">${re(e,16)}
      <div class="small muted" style="margin-top:8px">${e.size} ${e.size===1?"día":"días"} con entreno en total</div></div>`}let b="peso",M="3M";const Se={"1M":30,"3M":91,"6M":182,"1A":365,todo:0},D={"1M":"1M","3M":"3M","6M":"6M","1A":"1A",todo:"Todo"},V={peso:"Peso máx",volumen:"Volumen",veces:"Veces"};function Z(t){const e=new Date(t),s=(e.getDay()+6)%7;return e.setHours(0,0,0,0),e.setDate(e.getDate()-s),e.getTime()}const A=t=>new Date(t).toLocaleDateString("es-ES",{day:"numeric",month:"short"});function De(t,e){const s=[...new Set(e.flatMap(c=>(c.exercises??[]).map(n=>n.exerciseId)))];t&&!s.includes(t)&&(t=s[0]??"");const r=s.map(c=>`<option value="${c}" ${c===t?"selected":""}>${ae(Ee(c))}</option>`).join("");if(!t)return'<div class="empty">Sin datos todavía.</div>';const o=oe(t,e),i=le(t,e),d=Object.keys(V).map(c=>`<option value="${c}" ${c===b?"selected":""}>${V[c]}</option>`).join(""),m=Object.keys(D).map(c=>`<option value="${c}" ${c===M?"selected":""}>${D[c]}</option>`).join("");return`
    <label class="f">Ejercicio</label>
    <select id="st-ex">${r}</select>
    <div class="kpis" style="margin-top:10px">
      <div class="kpi"><div class="kpi-val num">${_(o.maxWeightKg)}</div><div class="kpi-lab">Peso máx</div></div>
      <div class="kpi"><div class="kpi-val num">${_(o.best1RM)}</div><div class="kpi-lab">1RM est.</div></div>
      <div class="kpi"><div class="kpi-val num">${o.maxReps}</div><div class="kpi-lab">Reps máx</div></div>
      <div class="kpi"><div class="kpi-val num">${i.length}</div><div class="kpi-lab">Sesiones</div></div>
    </div>
    <div class="sec-title">Evolución</div>
    <div class="sel-row">
      <div><label class="f">Métrica</label><select id="st-metric">${d}</select></div>
      <div><label class="f">Periodo</label><select id="st-period">${m}</select></div>
    </div>
    <div class="card" style="margin-top:10px"><div id="st-chart"></div></div>`}function P(t,e){const s=document.getElementById("st-chart");if(!s)return;const r=Date.now(),o=Se[M],i=o===0?0:r-o*864e5;if(b==="veces"){const p=new Map;for(const u of ce(t,e)){if(u<i)continue;const a=Z(u);p.set(a,(p.get(a)??0)+1)}const f=[...p.entries()].sort((u,a)=>u[0]-a[0]).map(([u,a])=>({x:u,y:a,label:A(u)}));s.innerHTML=`<div class="small muted" style="margin-bottom:6px">Sesiones por semana · ${D[M]}</div>`+me(f,{color:"#0ea5e9"});return}const d=M==="6M"||M==="1A"||M==="todo";let m=de(t,e).filter(p=>p.date>=i);const c=!d&&m.length<=40;let n,l;if(c)l="por sesión",n=m.map(p=>({x:p.date,y:b==="peso"?Math.round(p.maxWeightKg*10)/10:Math.round(p.volumeKg),label:A(p.date)}));else{l="por semana";const p=new Map;for(const f of m){const u=Z(f.date);p.has(u)||p.set(u,[]),p.get(u).push(b==="peso"?f.maxWeightKg:f.volumeKg)}n=[...p.entries()].sort((f,u)=>f[0]-u[0]).map(([f,u])=>({x:f,y:b==="peso"?Math.round(Math.max(...u)*10)/10:Math.round(u.reduce((a,C)=>a+C,0)),label:A(f)}))}const v=b==="peso"?"Peso máximo":"Volumen";s.innerHTML=`<div class="small muted" style="margin-bottom:6px">${v} ${l} (kg) · ${D[M]}</div>`+H(n,{unit:" kg",color:b==="peso"?"#2f7df6":"#7c3aed"})}function Be(t,e){document.getElementById("st-ex")?.addEventListener("change",s=>{const r=s.target.value;location.hash=`#/stats?tab=exercise&ex=${encodeURIComponent(r)}`}),document.getElementById("st-metric")?.addEventListener("change",s=>{b=s.target.value,P(t,e)}),document.getElementById("st-period")?.addEventListener("change",s=>{M=s.target.value,P(t,e)}),P(t,e)}let R="1M",B="front";const ee={"7D":7,"1M":30,"3M":91,"6M":182};function F(t){const e=[[43,92,171],[135,88,142],[255,91,85]],s=Math.min(1,Math.max(0,t))*(e.length-1),r=Math.min(e.length-2,Math.floor(s)),o=s-r,i=e[r].map((d,m)=>Math.round(d+(e[r+1][m]-d)*o));return`rgb(${i[0]},${i[1]},${i[2]})`}const z='<svg class="flt-chev" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4.5 7.5 9 12l4.5-4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',Te='<svg class="flt-ico" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="4.5" width="14" height="12.5" rx="2.5" stroke="currentColor" stroke-width="1.6"/><path d="M3 8.5h14M7 3v3M13 3v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',Ae='<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8.2" stroke="currentColor" stroke-width="1.6"/><path d="M10 9.2v4.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="6.6" r="1.15" fill="currentColor"/></svg>',Pe='<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M7.5 4.5 12 9l-4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';function _e(){const t=Object.keys(ee).map(e=>`<option value="${e}" ${e===R?"selected":""}>${e==="7D"?"Semana":e==="1M"?"Mes":e}</option>`).join("");return`
    <div class="am-head">
      <h1>Actividad muscular</h1>
      <p class="am-sub">Tu entrenamiento, por grupos musculares</p>
    </div>
    <div class="card am-card">
      <label class="flt">
        <span class="flt-top">Visualización</span>
        <span class="flt-main">
          <select id="st-tab" class="flt-select" aria-label="Visualización">${J("musculos")}</select>
          ${z}
        </span>
      </label>
      <label class="flt">
        <span class="flt-top">Periodo</span>
        <span class="flt-main">
          ${Te}
          <select id="st-mperiod" class="flt-select" aria-label="Periodo">${t}</select>
          ${z}
        </span>
      </label>
    </div>
    <div class="card am-card">
      <div class="am-rowhead">
        <h2>Mapa muscular</h2>
        <button type="button" class="am-info" id="st-mapinfo" aria-label="Acerca del mapa muscular" aria-expanded="false">${Ae}</button>
      </div>
      <div class="segctl" role="group" aria-label="Vista del mapa">
        <button type="button" class="segctl-btn${B==="front"?" on":""}" data-mview="front">Frontal</button>
        <button type="button" class="segctl-btn${B==="back"?" on":""}" data-mview="back">Posterior</button>
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
        <span>Ver todos los grupos</span>${Pe}
      </button>
    </div>`}let E=!1;function x(t){const e=document.getElementById("st-bodymap"),s=document.getElementById("st-musclelist"),r=document.getElementById("st-allgroups");if(!e||!s)return;const o=Date.now()-ee[R]*864e5,i=pe(t,O,o);if(r&&(r.style.display=i.length>3?"":"none"),!i.length){e.innerHTML="",s.innerHTML='<div class="chart-empty">Sin datos en este periodo</div>';return}e.innerHTML=B==="front"?$e():ye();const d=Math.max(...i.map(n=>n.sets)),m=new Map(i.map(n=>[n.zone,n]));e.querySelectorAll(".mz").forEach(n=>{const l=n.id.replace(/^mz-/,""),v=m.get(l),p=v?Math.pow(v.sets/d,.65):0;n.style.fill=F(p)});const c=E?i:i.slice(0,3);s.innerHTML='<div class="am-bars">'+c.map(n=>{const l=Math.pow(n.sets/d,.65);return`<div class="am-bar">
      <div class="am-bar-top"><span>${n.label}</span><span class="num">${n.pct.toFixed(0)} %</span></div>
      <div class="am-track"><span class="am-fill" style="width:${Math.max(2,n.pct).toFixed(1)}%;background:${F(l)}"></span></div>
    </div>`}).join("")+"</div>"}function K(t){const e=document.getElementById("st-mappop"),s=document.getElementById("st-mapinfo");e&&!e.hidden&&!t.target.closest(".am-card")&&(e.hidden=!0,s?.setAttribute("aria-expanded","false"))}function He(t,e){document.getElementById("st-tab")?.addEventListener("change",i=>{const d=i.target.value;d!=="musculos"&&e(d)}),document.getElementById("st-mperiod")?.addEventListener("change",i=>{R=i.target.value,x(t)}),document.querySelectorAll(".segctl-btn").forEach(i=>{i.addEventListener("click",()=>{B=i.dataset.mview,document.querySelectorAll(".segctl-btn").forEach(d=>d.classList.toggle("on",d===i)),x(t)})});const s=document.getElementById("st-mapinfo"),r=document.getElementById("st-mappop");s?.addEventListener("click",i=>{i.stopPropagation();const d=r?.hidden??!0;r&&(r.hidden=!d),s.setAttribute("aria-expanded",String(d))}),document.removeEventListener("click",K),document.addEventListener("click",K);const o=document.getElementById("st-allgroups");o?.addEventListener("click",()=>{E=!E,o.setAttribute("aria-expanded",String(E)),o.querySelector("span").textContent=E?"Ver menos grupos":"Ver todos los grupos",x(t)}),x(t)}let w="3M";const U={"1M":"1M","3M":"3M","6M":"6M",Todo:"Todo"};function Ie(t){const e=new Date(t);return e.setHours(0,0,0,0),e.getTime()-(e.getDay()+6)%7*864e5}function te(t){const e=Date.now(),s=864e5,r=w==="1M"?e-30*s:w==="3M"?e-91*s:w==="6M"?e-182*s:0,o=t.filter(a=>a.startTime>=r&&(a.fatigue!=null||a.satisfaction!=null)),d=`<label class="f">Periodo</label><select id="st-fperiod">${Object.keys(U).map(a=>`<option value="${a}" ${a===w?"selected":""}>${U[a]}</option>`).join("")}</select>`;if(!o.length)return d+'<div class="empty">Sin datos todavía.<br>Valora tus sesiones al terminarlas (foto y valoración opcionales).</div>';const m=a=>a.reduce((C,$)=>C+$,0)/a.length,c=o.map(a=>a.satisfaction).filter(a=>a!=null),n=o.map(a=>a.fatigue).filter(a=>a!=null),l=new Map;for(const a of o){const C=Ie(a.startTime);let $=l.get(C);$||($={sat:[],fat:[]},l.set(C,$)),a.satisfaction!=null&&$.sat.push(a.satisfaction),a.fatigue!=null&&$.fat.push(a.fatigue)}const v=[...l.keys()].sort((a,C)=>a-C),p=a=>new Date(a).toLocaleDateString("es-ES",{day:"numeric",month:"short"}),f=v.filter(a=>l.get(a).sat.length).map((a,C)=>({x:C,y:m(l.get(a).sat),label:p(a)})),u=v.filter(a=>l.get(a).fat.length).map((a,C)=>({x:C,y:m(l.get(a).fat),label:p(a)}));return d+`<div class="kpis" style="margin-top:14px">
      <div class="kpi"><div class="kpi-val num">${c.length?m(c).toFixed(1):"—"}</div><div class="kpi-lab">Satisfacción media</div></div>
      <div class="kpi"><div class="kpi-val num">${n.length?m(n).toFixed(1):"—"}</div><div class="kpi-lab">Cansancio medio</div></div>
      <div class="kpi"><div class="kpi-val num">${o.length}</div><div class="kpi-lab">Sesiones valoradas</div></div>
    </div>
    <div class="sec-title">Satisfacción media por semana</div>
    ${H(f,{color:"#0f766e",unit:"/5"})}
    <div class="sec-title">Cansancio medio por semana</div>
    ${H(u,{color:"#ea580c",unit:"/5"})}
    <div class="muted small" style="margin-top:8px">Escala 1–5 · se guarda al terminar cada sesión</div>`}function se(t){document.getElementById("st-fperiod")?.addEventListener("change",e=>{w=e.target.value;const s=document.getElementById("st-body");s.innerHTML=te(t),se(t)})}export{Le as renderStats};
