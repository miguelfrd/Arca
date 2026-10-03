import{I as c}from"./index-D-amyAZ-.js";const o=[{path:"/stats",label:"Stats",icon:"stats",acc:"#2f7df6"},{path:"/exercises",label:"Ejercicios",icon:"exercises",acc:"#0f766e"},{path:"/measures",label:"Medidas",icon:"measures",acc:"#a855f7"},{path:"/more",label:"Ajustes",icon:"more",acc:"#6b7280"}],n='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>';function i(a){a.innerHTML=`
    <div class="screen-head"><h1>Corpus</h1></div>
    <div class="yo-grid">
      ${o.map((s,e)=>`
        <a class="yo-btn" style="--acc:${s.acc};animation-delay:${e*55}ms" href="#${s.path}">
          <span class="yo-ic">${c[s.icon]}</span>
          <span class="yo-label">${s.label}</span>
          <span class="yo-chev">${n}</span>
        </a>`).join("")}
    </div>`}export{i as renderYo};
