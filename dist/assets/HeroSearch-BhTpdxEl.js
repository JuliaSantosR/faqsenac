import{c as a,r as i,j as e}from"./index-BY8KDrrF.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]],h=a("message-circle",m);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]],d=a("search",x);function b({defaultValue:r="",onSearch:o,placeholder:c="Ex: Quais documentos levar? Como calcular renda?",className:l=""}){const[s,n]=i.useState(r),u=t=>{t.preventDefault(),o(s)};return e.jsx("form",{onSubmit:u,className:`mx-auto w-full max-w-3xl ${l}`,children:e.jsxs("div",{className:"relative flex flex-col gap-2 sm:block",children:[e.jsx(d,{className:"pointer-events-none absolute top-4 left-5 h-5 w-5 text-gray-400"}),e.jsx("input",{type:"text",value:s,onChange:t=>n(t.target.value),placeholder:c,className:"w-full rounded-full border-0 bg-white py-4 pr-5 pl-12 text-base text-gray-900 shadow-lg placeholder:text-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none sm:pr-32","aria-label":"Buscar"}),e.jsx("button",{type:"submit",className:"w-full rounded-full bg-brand-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-accent-hover sm:absolute sm:top-1/2 sm:right-2 sm:w-auto sm:-translate-y-1/2",children:"Buscar"})]})})}export{b as H,h as M};
