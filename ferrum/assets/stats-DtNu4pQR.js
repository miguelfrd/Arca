import{d as y,e as M}from"./index-BM-fYH0U.js";import{w as S,f,a as D,e as E}from"./stats-Btw1cy27.js";import{b as R,c as L,l as w}from"./charts-JCuRxAy6.js";import{t as h}from"./types-E-ayykTU.js";let k=new Map;async function T(){k=new Map((await y.all("exercises")).map(e=>[e.id,e]))}const V=e=>k.get(e)?.nameEs??e.replace(/^desconocido:/,"");async function P(e,i){await T();const n=await y.workoutsDesc(400),l=i.get("tab")??"global";let c=`<div class="chips">
      <button class="chip ${l==="global"?"on":""}" data-tab="global">General</button>
      <button class="chip ${l==="exercise"?"on":""}" data-tab="exercise">Por ejercicio</button>
    </div><div id="st-body"></div>`;e.innerHTML=c;const d=document.getElementById("st-body"),r=()=>{d.innerHTML=C(n)},o=s=>{d.innerHTML=H(s,n),K()};e.querySelectorAll("[data-tab]").forEach(s=>s.addEventListener("click",()=>{const p=s.dataset.tab;e.querySelectorAll("[data-tab]").forEach(u=>u.classList.toggle("on",u===s)),p==="global"?r():o(i.get("ex")??$(n)??"")})),l==="exercise"?o(i.get("ex")??$(n)??""):r()}function $(e){for(const i of e){const n=i.exercises.find(l=>l.sets.some(c=>c.done));if(n)return n.exerciseId}return null}function C(e){if(!e.length)return'<div class="empty">Sin datos todavía.<br>Registra tu primera sesión en Entrenar.</div>';const i=e.filter(t=>t.startTime>Date.now()-30*864e5),n=new Map;for(const t of i)for(const a of t.exercises??[]){const g=k.get(a.exerciseId)?.primaryMuscle??"Otro",b=(a.sets??[]).filter(m=>m.done&&m.setType!=="warmup").reduce((m,x)=>m+(x.weightKg??0)*(x.reps??0),0);n.set(g,(n.get(g)??0)+b)}const l=[...n.entries()].sort((t,a)=>a[1]-t[1]).slice(0,10).map(([t,a])=>({label:t,value:Math.round(a),unit:" kg"})),c=new Set(e.map(t=>h(new Date(t.startTime)))),d=new Date,r=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`,o=e.filter(t=>{const a=new Date(t.startTime);return`${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,"0")}`===r}),s=o.reduce((t,a)=>t+S(a),0),p=o.reduce((t,a)=>t+(a.exercises??[]).reduce((g,b)=>g+(b.sets??[]).filter(m=>m.done).length,0),0);let u=0;const v=new Date;for(c.has(h(v))||v.setDate(v.getDate()-1);c.has(h(v));)u++,v.setDate(v.getDate()-1);return`
    <div class="kpis">
      <div class="kpi"><div class="kpi-val num">${o.length}</div><div class="kpi-lab">Sesiones (mes)</div></div>
      <div class="kpi"><div class="kpi-val num">${f(s)}</div><div class="kpi-lab">Volumen kg</div></div>
      <div class="kpi"><div class="kpi-val num">${p}</div><div class="kpi-lab">Series (mes)</div></div>
      <div class="kpi"><div class="kpi-val num">${u}</div><div class="kpi-lab">Racha días</div></div>
    </div>
    <div class="sec-title">Volumen por músculo · últimos 30 días</div>
    <div class="card">${R(l)}</div>
    <div class="sec-title">Consistencia · últimas 16 semanas</div>
    <div class="card">${L(c,16)}
      <div class="small muted" style="margin-top:8px">${c.size} días con entreno en total</div></div>`}function H(e,i){const l=[...new Set(i.flatMap(s=>s.exercises.map(p=>p.exerciseId)))].map(s=>`<option value="${s}" ${s===e?"selected":""}>${M(V(s))}</option>`).join("");if(!e)return'<div class="empty">Sin datos todavía.</div>';const c=D(e,i),d=E(e,i),r=d.map(s=>({x:s.date,y:Math.round(s.volumeKg),label:new Date(s.date).toLocaleDateString("es-ES",{day:"numeric",month:"short"})})),o=d.map(s=>({x:s.date,y:Math.round(s.best1RM*10)/10,label:new Date(s.date).toLocaleDateString("es-ES",{day:"numeric",month:"short"})}));return`
    <label class="f">Ejercicio</label>
    <select id="st-ex">${l}</select>
    <div class="kpis" style="margin-top:10px">
      <div class="kpi"><div class="kpi-val num">${f(c.maxWeightKg)}</div><div class="kpi-lab">Peso máx</div></div>
      <div class="kpi"><div class="kpi-val num">${f(c.best1RM)}</div><div class="kpi-lab">1RM est.</div></div>
      <div class="kpi"><div class="kpi-val num">${c.maxReps}</div><div class="kpi-lab">Reps máx</div></div>
      <div class="kpi"><div class="kpi-val num">${d.length}</div><div class="kpi-lab">Sesiones</div></div>
    </div>
    <div class="sec-title">Volumen por sesión (kg)</div>
    <div class="card">${w(r,{unit:" kg"})}</div>
    <div class="sec-title">Mejor 1RM estimado por sesión (kg)</div>
    <div class="card">${w(o,{unit:" kg",color:"#7c3aed"})}</div>`}function K(){document.getElementById("st-ex")?.addEventListener("change",e=>{const i=e.target.value;location.hash=`#/stats?tab=exercise&ex=${encodeURIComponent(i)}`})}export{P as renderStats};
