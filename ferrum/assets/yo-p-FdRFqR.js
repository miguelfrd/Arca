import{I as c}from"./index-CueAfup2.js";const o=[{path:"/stats",label:"Stats",icon:"stats",acc:"#2f7df6"},{path:"/exercises",label:"Ejercicios",icon:"exercises",acc:"#0f766e"},{path:"/measures",label:"Medidas",icon:"measures",acc:"#a855f7"},{path:"/more",label:"Más",icon:"more",acc:"#6b7280"}],n='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>';function i(s){s.innerHTML=`
    <div class="screen-head"><h1>Corpus</h1></div>
    <div class="yo-grid">
      ${o.map((a,e)=>`
        <a class="yo-btn" style="--acc:${a.acc};animation-delay:${e*55}ms" href="#${a.path}">
          <span class="yo-ic">${c[a.icon]}</span>
          <span class="yo-label">${a.label}</span>
          <span class="yo-chev">${n}</span>
        </a>`).join("")}
    </div>`}export{i as renderYo};
