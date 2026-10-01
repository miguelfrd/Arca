function v(a){return a>=1e3?`${Math.round(a/100)/10}k`:`${Math.round(a)}`}function M(a,c={}){const l=c.height??160,s=320,t={l:34,r:8,t:10,b:22},d=c.color??"#14b8a6";if(a.length===0)return'<div class="chart-empty">Sin datos todavía</div>';const n=a.map(e=>e.y);let o=Math.min(...n),i=Math.max(...n);o===i&&(o-=1,i+=1);const u=s-t.l-t.r,$=l-t.t-t.b,x=e=>t.l+(a.length===1?u/2:e/(a.length-1)*u),h=e=>t.t+$-(e-o)/(i-o)*$,y=a.map((e,r)=>`${r===0?"M":"L"}${x(r).toFixed(1)},${h(e.y).toFixed(1)}`).join(" "),b=`${y} L${x(a.length-1).toFixed(1)},${(t.t+$).toFixed(1)} L${t.l},${(t.t+$).toFixed(1)} Z`,f=4;let m="";for(let e=0;e<=f;e++){const r=o+(i-o)*e/f,g=h(r);m+=`<line x1="${t.l}" y1="${g.toFixed(1)}" x2="${s-t.r}" y2="${g.toFixed(1)}" class="grid"/><text x="${t.l-4}" y="${(g+3).toFixed(1)}" class="tick" text-anchor="end">${v(r)}</text>`}const D=a.map((e,r)=>`<circle cx="${x(r).toFixed(1)}" cy="${h(e.y).toFixed(1)}" r="2.6" class="dot"><title>${e.label}: ${e.y.toFixed(1)}${c.unit??""}</title></circle>`).join(""),F=a[0].label,p=a[a.length-1].label;return`<svg viewBox="0 0 ${s} ${l}" class="chart" role="img" preserveAspectRatio="xMidYMid meet">
    ${m}
    <path d="${b}" class="area" style="fill:${d}22"/>
    <path d="${y}" class="line" style="stroke:${d}" fill="none"/>
    ${D}
    <text x="${t.l}" y="${l-6}" class="tick">${F}</text>
    <text x="${s-t.r}" y="${l-6}" class="tick" text-anchor="end">${p}</text>
  </svg>`}function k(a,c={}){if(a.length===0)return'<div class="chart-empty">Sin datos todavía</div>';const l=Math.max(...a.map(t=>t.value),1),s=c.color??"#14b8a6";return'<div class="bars">'+a.map(t=>`
    <div class="bar-row">
      <span class="bar-label">${t.label}</span>
      <span class="bar-track"><span class="bar-fill" style="width:${Math.max(2,t.value/l*100).toFixed(1)}%;background:${s}"></span></span>
      <span class="bar-val">${v(t.value)}${t.unit??""}</span>
    </div>`).join("")+"</div>"}function S(a,c=16){const l=new Date;l.setHours(0,0,0,0);const s=new Date(l);s.setDate(s.getDate()-(c*7-1));const t=(s.getDay()+6)%7;s.setDate(s.getDate()-t);let d='<div class="cal-grid">';const n=new Date(s),o=c*7;for(let i=0;i<o;i++){const u=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`,x=n>l?"fut":a.has(u)?"on":"off",h=n.toLocaleDateString("es-ES",{day:"numeric",month:"short"});d+=`<span class="cal-day ${x}" title="${h}"></span>`,n.setDate(n.getDate()+1)}return d+"</div>"}export{k as b,S as c,M as l};
