(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[888],{1118:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return n(7984)}])},2925:function(){},1571:function(e,t,n){"use strict";n.d(t,{F:function(){return c},f:function(){return m}});var r=n(7294),a=["light","dark"],o="(prefers-color-scheme: dark)",s="undefined"==typeof window,l=r.createContext(void 0),i={setTheme:e=>{},themes:[]},c=()=>{var e;return null!=(e=r.useContext(l))?e:i},m=e=>r.useContext(l)?e.children:r.createElement(d,{...e}),u=["light","dark"],d=({forcedTheme:e,disableTransitionOnChange:t=!1,enableSystem:n=!0,enableColorScheme:s=!0,storageKey:i="theme",themes:c=u,defaultTheme:m=n?"system":"light",attribute:d="data-theme",value:$,children:g,nonce:b})=>{let[w,p]=r.useState(()=>f(i,m)),[S,E]=r.useState(()=>f(i)),T=$?Object.values($):c,k=r.useCallback(e=>{let r=e;if(!r)return;"system"===e&&n&&(r=v());let o=$?$[r]:r,l=t?y():null,i=document.documentElement;if("class"===d?(i.classList.remove(...T),o&&i.classList.add(o)):o?i.setAttribute(d,o):i.removeAttribute(d),s){let e=a.includes(m)?m:null,t=a.includes(r)?r:e;i.style.colorScheme=t}null==l||l()},[]),C=r.useCallback(e=>{let t="function"==typeof e?e(e):e;p(t);try{localStorage.setItem(i,t)}catch(e){}},[e]),_=r.useCallback(t=>{E(v(t)),"system"===w&&n&&!e&&k("system")},[w,e]);r.useEffect(()=>{let e=window.matchMedia(o);return e.addListener(_),_(e),()=>e.removeListener(_)},[_]),r.useEffect(()=>{let e=e=>{e.key===i&&C(e.newValue||m)};return window.addEventListener("storage",e),()=>window.removeEventListener("storage",e)},[C]),r.useEffect(()=>{k(null!=e?e:w)},[e,w]);let x=r.useMemo(()=>({theme:w,setTheme:C,forcedTheme:e,resolvedTheme:"system"===w?S:w,themes:n?[...c,"system"]:c,systemTheme:n?S:void 0}),[w,C,e,S,n,c]);return r.createElement(l.Provider,{value:x},r.createElement(h,{forcedTheme:e,disableTransitionOnChange:t,enableSystem:n,enableColorScheme:s,storageKey:i,themes:c,defaultTheme:m,attribute:d,value:$,children:g,attrs:T,nonce:b}),g)},h=r.memo(({forcedTheme:e,storageKey:t,attribute:n,enableSystem:s,enableColorScheme:l,defaultTheme:i,value:c,attrs:m,nonce:u})=>{let d="system"===i,h="class"===n?`var d=document.documentElement,c=d.classList;c.remove(${m.map(e=>`'${e}'`).join(",")});`:`var d=document.documentElement,n='${n}',s='setAttribute';`,f=l?(a.includes(i)?i:null)?`if(e==='light'||e==='dark'||!e)d.style.colorScheme=e||'${i}'`:"if(e==='light'||e==='dark')d.style.colorScheme=e":"",y=(e,t=!1,r=!0)=>{let o=c?c[e]:e,s=t?e+"|| ''":`'${o}'`,i="";return l&&r&&!t&&a.includes(e)&&(i+=`d.style.colorScheme = '${e}';`),"class"===n?t||o?i+=`c.add(${s})`:i+="null":o&&(i+=`d[s](n,${s})`),i},v=e?`!function(){${h}${y(e)}}()`:s?`!function(){try{${h}var e=localStorage.getItem('${t}');if('system'===e||(!e&&${d})){var t='${o}',m=window.matchMedia(t);if(m.media!==t||m.matches){${y("dark")}}else{${y("light")}}}else if(e){${c?`var x=${JSON.stringify(c)};`:""}${y(c?"x[e]":"e",!0)}}${d?"":"else{"+y(i,!1,!1)+"}"}${f}}catch(e){}}()`:`!function(){try{${h}var e=localStorage.getItem('${t}');if(e){${c?`var x=${JSON.stringify(c)};`:""}${y(c?"x[e]":"e",!0)}}else{${y(i,!1,!1)};}${f}}catch(t){}}();`;return r.createElement("script",{nonce:u,dangerouslySetInnerHTML:{__html:v}})}),f=(e,t)=>{let n;if(!s){try{n=localStorage.getItem(e)||void 0}catch(e){}return n||t}},y=()=>{let e=document.createElement("style");return e.appendChild(document.createTextNode("*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")),document.head.appendChild(e),()=>{window.getComputedStyle(document.body),setTimeout(()=>{document.head.removeChild(e)},1)}},v=e=>(e||(e=window.matchMedia(o)),e.matches?"dark":"light")},7984:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return o}});var r=n(5893);n(2925);var a=n(1571);function o(e){let{Component:t,pageProps:n}=e;return(0,r.jsx)(a.f,{themes:["light","dark","crimson"],children:(0,r.jsx)(t,{...n})})}}},function(e){var t=function(t){return e(e.s=t)};e.O(0,[774,179],function(){return t(1118),t(9090)}),_N_E=e.O()}]);