import{I as a}from"./index-C6Ynw8wj.js";const e=[{path:"/stats",label:"Estadísticas",caption:"Evolución, récords y actividad",icon:"stats"},{path:"/exercises",label:"Ejercicios",caption:"Tu biblioteca de movimientos",icon:"train"},{path:"/measures",label:"Medidas",caption:"Medidas y fotos de progreso",icon:"ruler"},{path:"/more",label:"Ajustes",caption:"Personaliza tu experiencia",icon:"gear"}];function c(i){i.innerHTML=`
    <div class="screen-head"><h1>Corpus</h1></div>
    <div class="group yo-list">
      ${e.map(s=>`
        <a class="list-row" href="#${s.path}">
          <span class="list-ic">${a[s.icon]}</span>
          <span class="list-t"><span class="nm">${s.label}</span><span class="mt">${s.caption}</span></span>
          <span class="chev">${a.chevR}</span>
        </a>`).join("")}
    </div>`}export{c as renderYo};
