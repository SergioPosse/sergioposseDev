var app=function(){"use strict";function e(){}const t=e=>e;function n(e){return e()}function o(){return Object.create(null)}function i(e){e.forEach(n)}function r(e){return"function"==typeof e}function s(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function a(e){return null==e?"":e}const l="undefined"!=typeof window;let c=l?()=>window.performance.now():()=>Date.now(),u=l?e=>requestAnimationFrame(e):e;const d=new Set;function f(e){d.forEach(t=>{t.c(e)||(d.delete(t),t.f())}),0!==d.size&&u(f)}function h(e,t){e.appendChild(t)}function p(e,t,n){e.insertBefore(t,n||null)}function m(e){e.parentNode.removeChild(e)}function g(e){return document.createElement(e)}function v(e){return document.createTextNode(e)}function b(){return v(" ")}function y(e,t,n,o){return e.addEventListener(t,n,o),()=>e.removeEventListener(t,n,o)}function w(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function k(e,t,n,o){e.style.setProperty(t,n,o?"important":"")}const x=new Set;let S,E=0;function $(e,t,n,o,i,r,s,a=0){const l=16.666/o;let c="{\n";for(let e=0;e<=1;e+=l){const o=t+(n-t)*r(e);c+=100*e+`%{${s(o,1-o)}}\n`}const u=c+`100% {${s(n,1-n)}}\n}`,d=`__svelte_${function(e){let t=5381,n=e.length;for(;n--;)t=(t<<5)-t^e.charCodeAt(n);return t>>>0}(u)}_${a}`,f=e.ownerDocument;x.add(f);const h=f.__svelte_stylesheet||(f.__svelte_stylesheet=f.head.appendChild(g("style")).sheet),p=f.__svelte_rules||(f.__svelte_rules={});p[d]||(p[d]=!0,h.insertRule(`@keyframes ${d} ${u}`,h.cssRules.length));const m=e.style.animation||"";return e.style.animation=`${m?m+", ":""}${d} ${o}ms linear ${i}ms 1 both`,E+=1,d}function L(e,t){const n=(e.style.animation||"").split(", "),o=n.filter(t?e=>e.indexOf(t)<0:e=>-1===e.indexOf("__svelte")),i=n.length-o.length;i&&(e.style.animation=o.join(", "),E-=i,E||u(()=>{E||(x.forEach(e=>{const t=e.__svelte_stylesheet;let n=t.cssRules.length;for(;n--;)t.deleteRule(n);e.__svelte_rules={}}),x.clear())}))}function M(e){S=e}function T(){if(!S)throw new Error("Function called outside component initialization");return S}function _(e){T().$$.on_mount.push(e)}const A=[],j=[],P=[],D=[],H=Promise.resolve();let z=!1;function C(e){P.push(e)}function I(e){D.push(e)}let O=!1;const q=new Set;function N(){if(!O){O=!0;do{for(let e=0;e<A.length;e+=1){const t=A[e];M(t),B(t.$$)}for(M(null),A.length=0;j.length;)j.pop()();for(let e=0;e<P.length;e+=1){const t=P[e];q.has(t)||(q.add(t),t())}P.length=0}while(A.length);for(;D.length;)D.pop()();z=!1,O=!1,q.clear()}}function B(e){if(null!==e.fragment){e.update(),i(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(C)}}let W;function F(e,t,n){e.dispatchEvent(function(e,t){const n=document.createEvent("CustomEvent");return n.initCustomEvent(e,!1,!1,t),n}(`${t?"intro":"outro"}${n}`))}const R=new Set;let X;function G(){X={r:0,c:[],p:X}}function U(){X.r||i(X.c),X=X.p}function V(e,t){e&&e.i&&(R.delete(e),e.i(t))}function Y(e,t,n,o){if(e&&e.o){if(R.has(e))return;R.add(e),X.c.push(()=>{R.delete(e),o&&(n&&e.d(1),o())}),e.o(t)}}const Q={duration:0};function J(n,o,s,a){let l=o(n,s),h=a?0:1,p=null,m=null,g=null;function v(){g&&L(n,g)}function b(e,t){const n=e.b-h;return t*=Math.abs(n),{a:h,b:e.b,d:n,duration:t,start:e.start,end:e.start+t,group:e.group}}function y(o){const{delay:r=0,duration:s=300,easing:a=t,tick:y=e,css:w}=l||Q,k={start:c()+r,b:o};o||(k.group=X,X.r+=1),p?m=k:(w&&(v(),g=$(n,h,o,s,r,a,w)),o&&y(0,1),p=b(k,s),C(()=>F(n,o,"start")),function(e){let t;0===d.size&&u(f),new Promise(n=>{d.add(t={c:e,f:n})})}(e=>{if(m&&e>m.start&&(p=b(m,s),m=null,F(n,p.b,"start"),w&&(v(),g=$(n,h,p.b,p.duration,0,a,l.css))),p)if(e>=p.end)y(h=p.b,1-h),F(n,p.b,"end"),m||(p.b?v():--p.group.r||i(p.group.c)),p=null;else if(e>=p.start){const t=e-p.start;h=p.a+p.d*a(t/p.duration),y(h,1-h)}return!(!p&&!m)}))}return{run(e){r(l)?(W||(W=Promise.resolve(),W.then(()=>{W=null})),W).then(()=>{l=l(),y(e)}):y(e)},end(){v(),p=m=null}}}function K(e,t,n){const o=e.$$.props[t];void 0!==o&&(e.$$.bound[o]=n,n(e.$$.ctx[o]))}function Z(e){e&&e.c()}function ee(e,t,o){const{fragment:s,on_mount:a,on_destroy:l,after_update:c}=e.$$;s&&s.m(t,o),C(()=>{const t=a.map(n).filter(r);l?l.push(...t):i(t),e.$$.on_mount=[]}),c.forEach(C)}function te(e,t){const n=e.$$;null!==n.fragment&&(i(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function ne(e,t){-1===e.$$.dirty[0]&&(A.push(e),z||(z=!0,H.then(N)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function oe(t,n,r,s,a,l,c=[-1]){const u=S;M(t);const d=n.props||{},f=t.$$={fragment:null,ctx:null,props:l,update:e,not_equal:a,bound:o(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:o(),dirty:c,skip_bound:!1};let h=!1;if(f.ctx=r?r(t,d,(e,n,...o)=>{const i=o.length?o[0]:n;return f.ctx&&a(f.ctx[e],f.ctx[e]=i)&&(!f.skip_bound&&f.bound[e]&&f.bound[e](i),h&&ne(t,e)),n}):[],f.update(),h=!0,i(f.before_update),f.fragment=!!s&&s(f.ctx),n.target){if(n.hydrate){const e=function(e){return Array.from(e.childNodes)}(n.target);f.fragment&&f.fragment.l(e),e.forEach(m)}else f.fragment&&f.fragment.c();n.intro&&V(t.$$.fragment),ee(t,n.target,n.anchor),N()}M(u)}class ie{$destroy(){te(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function re(e,{delay:n=0,duration:o=400,easing:i=t}){const r=+getComputedStyle(e).opacity;return{delay:n,duration:o,easing:i,css:e=>"opacity: "+e*r}}function se(t){let n,o,r,s,a,l,c,u,d,f,v,k,x,S;return{c(){n=g("about"),o=g("div"),r=g("section"),r.innerHTML='<h2>Who i am?</h2> \n\t\t\t\t<p class="svelte-170dfw7">Hello friend! My name is Sergio Posse, im a simple guy interested by every kind of programming but experienced in web development. In my free time i play the guitar and write music, i like experimental or underground bands that blows your mind! Check my \n\t\t\t\t\t<a style="z-index:120;color:#F2E6FC;" target="_blank" href="https://soundcloud.com/kumikobox" class="svelte-170dfw7">Soundcloud</a> if you feel curious.</p>',s=b(),a=g("section"),a.innerHTML='<h2>Formation</h2> \n\t\t\t\t\t<img alt="graduatedImage" class="img-fluid svelte-170dfw7" src="/images/graduated.png"/> \n\t\t\t\t\t<strong class="svelte-170dfw7">High School:</strong><p class="svelte-170dfw7">IPEM 259 Ambrosio Olmos - INDUSTRIAL (graduated as metalworking speciality)</p> \n\t\t\t\t\t\t<strong class="svelte-170dfw7">Tertiary Studies:</strong><p class="svelte-170dfw7">ITec Instituto Tecnológico Río Cuarto (graduated as Superior techichian in soft development)</p>',l=b(),c=g("div"),u=g("section"),u.innerHTML='<h2>Working Experience</h2> \n\t\t\t\t<img alt="programmerImage" class="img-fluid svelte-170dfw7" src="/images/work.png"/> \n\n\t\t\t\t<p class="svelte-170dfw7">Practices when i was studying, like scrum simulations, QA Testing and frontend/backend basics</p> \n\t\t\t\t\t<p class="svelte-170dfw7">Amateur projects for friends and family</p>',d=b(),f=g("section"),f.innerHTML='<h2>Main skills</h2> \n\t\t\t\t<p class="svelte-170dfw7">Global vision - Selflearning - Modeling (UML) - Control versioning (Git) - Operative Systems &amp; Virtual Machines config - Hardware - UX Design (Figma)</p>',w(r,"class","card-simple svelte-170dfw7"),w(a,"class","card-over svelte-170dfw7"),w(o,"class","row svelte-170dfw7"),w(u,"class","card-over svelte-170dfw7"),w(f,"class","card-simple svelte-170dfw7"),w(c,"class","row svelte-170dfw7"),w(n,"class","about svelte-170dfw7")},m(e,i){p(e,n,i),h(n,o),h(o,r),t[3](r),h(o,s),h(o,a),h(n,l),h(n,c),h(c,u),h(c,d),h(c,f),t[7](f),k=!0,x||(S=[y(r,"mousedown",t[4]),y(r,"touchmove",t[5]),y(r,"mousemove",t[6]),y(f,"mousemove",t[8])],x=!0)},p:e,i(e){k||(C(()=>{v||(v=J(n,re,{},!0)),v.run(1)}),k=!0)},o(e){v||(v=J(n,re,{},!1)),v.run(0),k=!1},d(e){e&&m(n),t[3](null),t[7](null),e&&v&&v.end(),x=!1,i(S)}}}function ae(e,t,n){let{skillsEl:o}=t,{whoEl:i}=t;const r=(e,t)=>{let n=e.target.getBoundingClientRect(),r=e.clientX-n.left,s=e.clientY-n.top;"skills"===t&&(o.style.setProperty("--x",r+"px"),o.style.setProperty("--y",s+"px")),"who"===t&&(i.style.setProperty("--x",r+"px"),i.style.setProperty("--y",s+"px"))};return e.$$set=e=>{"skillsEl"in e&&n(0,o=e.skillsEl),"whoEl"in e&&n(1,i=e.whoEl)},[o,i,r,function(e){j[e?"unshift":"push"](()=>{i=e,n(1,i)})},e=>r(e,"who"),e=>r(e,"who"),e=>r(e,"who"),function(e){j[e?"unshift":"push"](()=>{o=e,n(0,o)})},e=>r(e,"skills")]}class le extends ie{constructor(e){super(),oe(this,e,ae,se,s,{skillsEl:0,whoEl:1})}}function ce(t){let n,o,i,r,s,a,l,c;return{c(){n=g("div"),o=g("h4"),o.textContent="Sergio David Posse",i=b(),r=g("span"),r.textContent="Leave a message in this site",s=b(),a=g("span"),a.textContent="View my formal resume",w(o,"class","menu-modal-item svelte-12h5cq5"),k(o,"color","white"),k(o,"background-color","black"),w(r,"class","menu-modal-item svelte-12h5cq5"),k(r,"background-color","rgb(158, 226, 242,0)"),k(r,"color","rgb(224, 255, 255,0.7)"),w(a,"class","menu-modal-item svelte-12h5cq5"),w(a,"style","background-color:rgb(224, 100, 100,0);color:rgb(224, 255, 255,0.7););"),w(n,"class","menu-modal svelte-12h5cq5")},m(e,u){p(e,n,u),h(n,o),h(n,i),h(n,r),h(n,s),h(n,a),t[6](n),l||(c=y(a,"click",t[4]),l=!0)},p:e,d(e){e&&m(n),t[6](null),l=!1,c()}}}function ue(t){let n,o,r,s,l,c,u,d,f,k,x,S,E,$,L=!t[0]&&ce(t);return{c(){n=g("nav"),L&&L.c(),o=b(),r=g("img"),l=b(),c=g("div"),u=v("About"),f=b(),k=g("div"),x=v("Portfolio"),r.src!==(s="/images/menu.png")&&w(r,"src","/images/menu.png"),w(r,"alt","menu"),w(r,"class","svelte-12h5cq5"),w(c,"class",d=a(t[2]?"about over-option-nav":"about")+" svelte-12h5cq5"),w(k,"class",S=a(t[2]?"portfolio":"portfolio over-option-nav")+" svelte-12h5cq5"),w(n,"class","svelte-12h5cq5")},m(e,i){p(e,n,i),L&&L.m(n,null),h(n,o),h(n,r),h(n,l),h(n,c),h(c,u),h(n,f),h(n,k),h(k,x),E||($=[y(r,"click",t[3]),y(c,"click",t[7]),y(k,"click",t[8])],E=!0)},p(e,[t]){e[0]?L&&(L.d(1),L=null):L?L.p(e,t):(L=ce(e),L.c(),L.m(n,o)),4&t&&d!==(d=a(e[2]?"about over-option-nav":"about")+" svelte-12h5cq5")&&w(c,"class",d),4&t&&S!==(S=a(e[2]?"portfolio":"portfolio over-option-nav")+" svelte-12h5cq5")&&w(k,"class",S)},i:e,o:e,d(e){e&&m(n),L&&L.d(),E=!1,i($)}}}function de(e,t,n){let{hideMenu:o}=t,{modalMenu:i}=t,{showAbout:r=!0}=t;const s=e=>{n(2,r="about"===e)};return e.$$set=e=>{"hideMenu"in e&&n(0,o=e.hideMenu),"modalMenu"in e&&n(1,i=e.modalMenu),"showAbout"in e&&n(2,r=e.showAbout)},[o,i,r,()=>{n(0,o=!1)},()=>{window.open("/cv-sergiodavidposse.pdf")},s,function(e){j[e?"unshift":"push"](()=>{i=e,n(1,i)})},()=>{s("about")},()=>{s("portfolio")}]}class fe extends ie{constructor(e){super(),oe(this,e,de,ue,s,{hideMenu:0,modalMenu:1,showAbout:2})}}function he(t){let n,o,i;return{c(){n=g("footer"),n.innerHTML='<div class="copyright svelte-16dsjzy"><h4>Copyright Sergio Posse 2020</h4></div>',w(n,"class","svelte-16dsjzy")},m(e,t){p(e,n,t),i=!0},p:e,i(e){i||(C(()=>{o||(o=J(n,re,{},!0)),o.run(1)}),i=!0)},o(e){o||(o=J(n,re,{},!1)),o.run(0),i=!1},d(e){e&&m(n),e&&o&&o.end()}}}class pe extends ie{constructor(e){super(),oe(this,e,null,he,s,{})}}function me(t){let n,o,r,s,l,c,u,d,f,v,x,S,E,$,L,M,T,_,A,j,P;return{c(){n=g("canvas"),o=b(),r=g("social"),s=g("input"),l=b(),c=g("img"),d=b(),f=g("img"),x=b(),S=g("input"),$=b(),L=g("img"),T=b(),_=g("img"),w(n,"class","svelte-1yb6ocu"),k(s,"position","absolute"),k(s,"left","-9999px"),w(s,"id","justCopy"),s.value="SergioDavidPosse@gmail.com",c.src!==(u="/images/whatsapp.png")&&w(c,"src","/images/whatsapp.png"),w(c,"alt","whatsapp"),w(c,"class","svelte-1yb6ocu"),k(f,"filter","invert()"),f.src!==(v="/images/github.png")&&w(f,"src","/images/github.png"),w(f,"alt","github"),w(f,"class","svelte-1yb6ocu"),w(S,"id","in"),w(S,"class",E=a(t[2]?"gmail-modal visible":"gmail-modal invisible")+" svelte-1yb6ocu"),S.value="SergioDavidPosse@gmail.com",w(L,"alt","gmail"),L.src!==(M="/images/gmail-circle.png")&&w(L,"src","/images/gmail-circle.png"),w(L,"class","svelte-1yb6ocu"),_.src!==(A="/images/instagram.png")&&w(_,"src","/images/instagram.png"),w(_,"alt","instagram"),w(_,"class","svelte-1yb6ocu"),w(r,"class","svelte-1yb6ocu")},m(e,i){p(e,n,i),t[6](n),p(e,o,i),p(e,r,i),h(r,s),h(r,l),h(r,c),h(r,d),h(r,f),h(r,x),h(r,S),t[9](S),h(r,$),h(r,L),h(r,T),h(r,_),t[11](r),j||(P=[y(c,"click",t[7]),y(f,"click",t[8]),y(L,"click",t[5]),y(L,"mouseover",t[4]),y(L,"mouseout",t[4]),y(_,"click",t[10])],j=!0)},p(e,[t]){4&t&&E!==(E=a(e[2]?"gmail-modal visible":"gmail-modal invisible")+" svelte-1yb6ocu")&&w(S,"class",E)},i:e,o:e,d(e){e&&m(n),t[6](null),e&&m(o),e&&m(r),t[9](null),t[11](null),j=!1,i(P)}}}function ge(e,t,n){let o,i=!1,{canvasSocialSide:r}=t,{socialSide:s}=t;return e.$$set=e=>{"canvasSocialSide"in e&&n(0,r=e.canvasSocialSide),"socialSide"in e&&n(1,s=e.socialSide)},[r,s,i,o,()=>{n(2,i=!i)},()=>{document.getElementById("justCopy").value="SergioDavidPosse@gmail.com";let e=document.getElementById("justCopy");e.select(),e.setSelectionRange(0,99999),document.execCommand("copy"),alert("Copied: "+e.value)},function(e){j[e?"unshift":"push"](()=>{r=e,n(0,r)})},()=>{window.open("https://wa.me/5493584849720")},()=>{window.open("https://github.com/SergioPosse")},function(e){j[e?"unshift":"push"](()=>{o=e,n(3,o)})},()=>{window.open("https://instagram.com/ssergio.posse")},function(e){j[e?"unshift":"push"](()=>{s=e,n(1,s)})}]}class ve extends ie{constructor(e){super(),oe(this,e,ge,me,s,{canvasSocialSide:0,socialSide:1})}}function be(e){let t,n,o,r,s,l,c,u,d,f,v,k;return{c(){t=g("div"),n=g("div"),o=g("div"),r=b(),s=g("div"),u=b(),d=g("div"),w(o,"class","prev svelte-1x6q6ks"),w(s,"id","first1"),w(s,"class",l=a(e[4]?"first animationtesteo":"first")+" svelte-1x6q6ks"),w(d,"class","next svelte-1x6q6ks"),w(n,"class","carousel-content svelte-1x6q6ks"),w(t,"class","carousel svelte-1x6q6ks")},m(i,a){p(i,t,a),h(t,n),h(n,o),e[9](o),h(n,r),h(n,s),e[12](s),h(n,u),h(n,d),e[13](d),e[14](t),f=!0,v||(k=[y(o,"click",e[6]),y(s,"touchstart",e[10]),y(s,"touchmove",e[11]),y(d,"click",e[5])],v=!0)},p(e,[t]){(!f||16&t&&l!==(l=a(e[4]?"first animationtesteo":"first")+" svelte-1x6q6ks"))&&w(s,"class",l)},i(e){f||(C(()=>{c||(c=J(s,re,{},!0)),c.run(1)}),f=!0)},o(e){c||(c=J(s,re,{},!1)),c.run(0),f=!1},d(n){n&&m(t),e[9](null),e[12](null),n&&c&&c.end(),e[13](null),e[14](null),v=!1,i(k)}}}function ye(e,t,n){let o,i,r,s,a={0:{url:"/images/a.jpg",title:"Proyecto 01",description:"Proyecto 1 realizado con varias tecnologias javascript, css, HTML. La base de datos seleccionada es MongoDB"},1:{url:"/images/b.jpg",title:"Proyecto 02",description:"Proyecto 2 realizado con varias tecnologias javascript, css, HTML. La base de datos seleccionada es MongoDB"},2:{url:"/images/c.jpg",title:"Proyecto 03",description:"Proyecto 3 realizado con varias tecnologias javascript, css, HTML. La base de datos seleccionada es MongoDB"},3:{url:"/images/d.jpg",title:"Proyecto 04",description:"Proyecto 4 realizado con varias tecnologias javascript, css, HTML. La base de datos seleccionada es MongoDB"},4:{url:"/images/e.jpg",title:"Proyecto 05",description:"Proyecto 5 realizado con varias tecnologias javascript, css, HTML. La base de datos seleccionada es MongoDB"},5:{url:"/images/f.jpg",title:"Proyecto 06",description:"Proyecto 6 realizado con varias tecnologias javascript, css, HTML. La base de datos seleccionada es MongoDB"},6:{url:"/images/g.jpg",title:"Proyecto 07",description:"Proyecto 7 realizado con varias tecnologias javascript, css, HTML. La base de datos seleccionada es MongoDB"},7:{url:"/images/h.jpg",title:"Proyecto 08",description:"Proyecto 8 realizado con varias tecnologias javascript, css, HTML. La base de datos seleccionada es MongoDB"}},l=0,c=!1;const u=async()=>{for(let e=0;e<Object.keys(a).length;e++)if(a[l]===a[e]){if(console.log("selected work: "+a[l]),console.log("selected i : "+a[e]),a[l+1]){l++,console.log("sel: "+l);break}l=0;break}setTimeout(()=>{n(4,c=!1),f()},400),n(4,c=!0)},d=async()=>{for(let e=0;e<Object.keys(a).length;e++)if(a[l]===a[e]){if(console.log("selected work: "+a[l]),console.log("selected i : "+a[e]),a[l-1]){l--,console.log("sel: "+l);break}l=Object.keys(a).length-1;break}setTimeout(()=>{n(4,c=!1),f()},400),n(4,c=!0)},f=()=>{let e,t,o;e=a[l],o=l-1<0?a[Object.keys(a).length-1]:a[l-1],t=l+1>Object.keys(a).length-1?a[0]:a[l+1],n(1,i.innerHTML=e.title,i),i.style.setProperty("background-image","url("+e.url+")"),n(2,r.innerHTML=o.title,r),r.style.setProperty("background-image","url("+o.url+")"),n(3,s.innerHTML="<p>"+t.title+"</p>",s),s.style.setProperty("background-image","url("+t.url+")")};let h;_(()=>{console.log(a[0]),console.log(Object.keys(a).length),f()});const p=e=>{console.dir(e),h=e.touches[0].clientX},m=e=>{if(!h)return;let t=e.touches[0].clientX;h-t>0?d():u(),h=null};return[o,i,r,s,c,u,d,p,m,function(e){j[e?"unshift":"push"](()=>{r=e,n(2,r)})},e=>p(e),e=>{m(e)},function(e){j[e?"unshift":"push"](()=>{i=e,n(1,i)})},function(e){j[e?"unshift":"push"](()=>{s=e,n(3,s)})},function(e){j[e?"unshift":"push"](()=>{o=e,n(0,o)})}]}class we extends ie{constructor(e){super(),oe(this,e,ye,be,s,{})}}function ke(e,t,n){return e(n={path:t,exports:{},require:function(e,t){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==t&&n.path)}},n.exports),n.exports}var xe=ke((function(e){(e.exports={}).forEach=function(e,t){for(var n=0;n<e.length;n++){var o=t(e[n]);if(o)return o}}})),Se=ke((function(e){var t=e.exports={};t.isIE=function(e){return(-1!==(t=navigator.userAgent.toLowerCase()).indexOf("msie")||-1!==t.indexOf("trident")||-1!==t.indexOf(" edge/"))&&(!e||e===function(){var e=3,t=document.createElement("div"),n=t.getElementsByTagName("i");do{t.innerHTML="\x3c!--[if gt IE "+ ++e+"]><i></i><![endif]--\x3e"}while(n[0]);return e>4?e:undefined}());var t},t.isLegacyOpera=function(){return!!window.opera}})),Ee=ke((function(e){(e.exports={}).getOption=function(e,t,n){var o=e[t];if(null==o&&void 0!==n)return n;return o}})),$e=function(e){var t=(e=e||{}).reporter,n=Ee.getOption(e,"async",!0),o=Ee.getOption(e,"auto",!0);o&&!n&&(t&&t.warn("Invalid options combination. auto=true and async=false is invalid. Setting async=true."),n=!0);var i,r=Le(),s=!1;function a(){for(s=!0;r.size();){var e=r;r=Le(),e.process()}s=!1}function l(){var e;e=a,i=setTimeout(e,0)}return{add:function(e,t){!s&&o&&n&&0===r.size()&&l(),r.add(e,t)},force:function(e){s||(void 0===e&&(e=n),i&&(clearTimeout(i),i=null),e?l():a())}}};function Le(){var e={},t=0,n=0,o=0;return{add:function(i,r){r||(r=i,i=0),i>n?n=i:i<o&&(o=i),e[i]||(e[i]=[]),e[i].push(r),t++},process:function(){for(var t=o;t<=n;t++)for(var i=e[t],r=0;r<i.length;r++){(0,i[r])()}},size:function(){return t}}}function Me(e){return e._erd}var Te={initState:function(e){return e._erd={},Me(e)},getState:Me,cleanState:function(e){delete e._erd}},_e=xe.forEach,Ae=function(e){var t=(e=e||{}).reporter,n=e.batchProcessor,o=e.stateHandler.getState,i=(e.stateHandler.hasState,e.idHandler);if(!n)throw new Error("Missing required dependency: batchProcessor");if(!t)throw new Error("Missing required dependency: reporter.");var r=function(){var e=500,t=500,n=document.createElement("div");n.style.cssText=l(["position: absolute","width: 1000px","height: 1000px","visibility: hidden","margin: 0","padding: 0"]);var o=document.createElement("div");o.style.cssText=l(["position: absolute","width: 500px","height: 500px","overflow: scroll","visibility: none","top: -1500px","left: -1500px","visibility: hidden","margin: 0","padding: 0"]),o.appendChild(n),document.body.insertBefore(o,document.body.firstChild);var i=e-o.clientWidth,r=t-o.clientHeight;return document.body.removeChild(o),{width:i,height:r}}(),s="erd_scroll_detection_container";function a(e){!function(e,t,n){function o(n,o){o=o||function(t){e.head.appendChild(t)};var i=e.createElement("style");return i.innerHTML=n,i.id=t,o(i),i}if(!e.getElementById(t)){var i=n+"_animation",r=n+"_animation_active",s="/* Created by the element-resize-detector library. */\n";s+="."+n+" > div::-webkit-scrollbar { "+l(["display: none"])+" }\n\n",s+="."+r+" { "+l(["-webkit-animation-duration: 0.1s","animation-duration: 0.1s","-webkit-animation-name: "+i,"animation-name: "+i])+" }\n",s+="@-webkit-keyframes "+i+" { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }\n",o(s+="@keyframes "+i+" { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }")}}(e,"erd_scroll_detection_scrollbar_style",s)}function l(t){var n=e.important?" !important; ":"; ";return(t.join(n)+n).trim()}function c(e,n,o){if(e.addEventListener)e.addEventListener(n,o);else{if(!e.attachEvent)return t.error("[scroll] Don't know how to add event listeners.");e.attachEvent("on"+n,o)}}function u(e,n,o){if(e.removeEventListener)e.removeEventListener(n,o);else{if(!e.detachEvent)return t.error("[scroll] Don't know how to remove event listeners.");e.detachEvent("on"+n,o)}}function d(e){return o(e).container.childNodes[0].childNodes[0].childNodes[0]}function f(e){return o(e).container.childNodes[0].childNodes[0].childNodes[1]}return a(window.document),{makeDetectable:function(e,a,u){function h(){if(e.debug){var n=Array.prototype.slice.call(arguments);if(n.unshift(i.get(a),"Scroll: "),t.log.apply)t.log.apply(null,n);else for(var o=0;o<n.length;o++)t.log(n[o])}}function p(e){var t=o(e).container.childNodes[0],n=window.getComputedStyle(t);return!n.width||-1===n.width.indexOf("px")}function m(){var e=window.getComputedStyle(a),t={};return t.position=e.position,t.width=a.offsetWidth,t.height=a.offsetHeight,t.top=e.top,t.right=e.right,t.bottom=e.bottom,t.left=e.left,t.widthCSS=e.width,t.heightCSS=e.height,t}function g(){if(h("storeStyle invoked."),o(a)){var e=m();o(a).style=e}else h("Aborting because element has been uninstalled")}function v(e,t,n){o(e).lastWidth=t,o(e).lastHeight=n}function b(){return 2*r.width+1}function y(){return 2*r.height+1}function w(e){return e+10+b()}function k(e){return e+10+y()}function x(e,t,n){var o=d(e),i=f(e),r=w(t),s=k(n),a=function(e){return 2*e+b()}(t),l=function(e){return 2*e+y()}(n);o.scrollLeft=r,o.scrollTop=s,i.scrollLeft=a,i.scrollTop=l}function S(){var e=o(a).container;if(!e){(e=document.createElement("div")).className=s,e.style.cssText=l(["visibility: hidden","display: inline","width: 0px","height: 0px","z-index: -1","overflow: hidden","margin: 0","padding: 0"]),o(a).container=e,function(e){e.className+=" "+s+"_animation_active"}(e),a.appendChild(e);var t=function(){o(a).onRendered&&o(a).onRendered()};c(e,"animationstart",t),o(a).onAnimationStart=t}return e}function E(){if(h("Injecting elements"),o(a)){!function(){var n=o(a).style;if("static"===n.position){a.style.setProperty("position","relative",e.important?"important":"");var i=function(e,t,n,o){var i=n[o];"auto"!==i&&"0"!==function(e){return e.replace(/[^-\d\.]/g,"")}(i)&&(e.warn("An element that is positioned static has style."+o+"="+i+" which is ignored due to the static positioning. The element will need to be positioned relative, so the style."+o+" will be set to 0. Element: ",t),t.style[o]=0)};i(t,a,n,"top"),i(t,a,n,"right"),i(t,a,n,"bottom"),i(t,a,n,"left")}}();var n=o(a).container;n||(n=S());var i,u,d,f,p=r.width,m=r.height,g=l(["position: absolute","flex: none","overflow: hidden","z-index: -1","visibility: hidden","width: 100%","height: 100%","left: 0px","top: 0px"]),v=l(["position: absolute","flex: none","overflow: hidden","z-index: -1","visibility: hidden"].concat(["left: "+(i=(i=-(1+p))?i+"px":"0"),"top: "+(u=(u=-(1+m))?u+"px":"0"),"right: "+(f=(f=-p)?f+"px":"0"),"bottom: "+(d=(d=-m)?d+"px":"0")])),b=l(["position: absolute","flex: none","overflow: scroll","z-index: -1","visibility: hidden","width: 100%","height: 100%"]),y=l(["position: absolute","flex: none","overflow: scroll","z-index: -1","visibility: hidden","width: 100%","height: 100%"]),w=l(["position: absolute","left: 0","top: 0"]),k=l(["position: absolute","width: 200%","height: 200%"]),x=document.createElement("div"),E=document.createElement("div"),$=document.createElement("div"),L=document.createElement("div"),M=document.createElement("div"),T=document.createElement("div");x.dir="ltr",x.style.cssText=g,x.className=s,E.className=s,E.style.cssText=v,$.style.cssText=b,L.style.cssText=w,M.style.cssText=y,T.style.cssText=k,$.appendChild(L),M.appendChild(T),E.appendChild($),E.appendChild(M),x.appendChild(E),n.appendChild(x),c($,"scroll",_),c(M,"scroll",A),o(a).onExpandScroll=_,o(a).onShrinkScroll=A}else h("Aborting because element has been uninstalled");function _(){o(a).onExpand&&o(a).onExpand()}function A(){o(a).onShrink&&o(a).onShrink()}}function $(){function r(t,n,o){var i=function(e){return d(e).childNodes[0]}(t),r=w(n),s=k(o);i.style.setProperty("width",r+"px",e.important?"important":""),i.style.setProperty("height",s+"px",e.important?"important":"")}function s(s){var c=a.offsetWidth,u=a.offsetHeight,d=c!==o(a).lastWidth||u!==o(a).lastHeight;h("Storing current size",c,u),v(a,c,u),n.add(0,(function(){if(d)if(o(a))if(l()){if(e.debug){var n=a.offsetWidth,s=a.offsetHeight;n===c&&s===u||t.warn(i.get(a),"Scroll: Size changed before updating detector elements.")}r(a,c,u)}else h("Aborting because element container has not been initialized");else h("Aborting because element has been uninstalled")})),n.add(1,(function(){o(a)?l()?x(a,c,u):h("Aborting because element container has not been initialized"):h("Aborting because element has been uninstalled")})),d&&s&&n.add(2,(function(){o(a)?l()?s():h("Aborting because element container has not been initialized"):h("Aborting because element has been uninstalled")}))}function l(){return!!o(a).container}function c(){h("notifyListenersIfNeeded invoked");var e=o(a);return void 0===o(a).lastNotifiedWidth&&e.lastWidth===e.startSize.width&&e.lastHeight===e.startSize.height?h("Not notifying: Size is the same as the start size, and there has been no notification yet."):e.lastWidth===e.lastNotifiedWidth&&e.lastHeight===e.lastNotifiedHeight?h("Not notifying: Size already notified"):(h("Current size not notified, notifying..."),e.lastNotifiedWidth=e.lastWidth,e.lastNotifiedHeight=e.lastHeight,void _e(o(a).listeners,(function(e){e(a)})))}function u(){h("Scroll detected."),p(a)?h("Scroll event fired while unrendered. Ignoring..."):s(c)}if(h("registerListenersAndPositionElements invoked."),o(a)){o(a).onRendered=function(){if(h("startanimation triggered."),p(a))h("Ignoring since element is still unrendered...");else{h("Element rendered.");var e=d(a),t=f(a);0!==e.scrollLeft&&0!==e.scrollTop&&0!==t.scrollLeft&&0!==t.scrollTop||(h("Scrollbars out of sync. Updating detector elements..."),s(c))}},o(a).onExpand=u,o(a).onShrink=u;var m=o(a).style;r(a,m.width,m.height)}else h("Aborting because element has been uninstalled")}function L(){if(h("finalizeDomMutation invoked."),o(a)){var e=o(a).style;v(a,e.width,e.height),x(a,e.width,e.height)}else h("Aborting because element has been uninstalled")}function M(){u(a)}function T(){var e;h("Installing..."),o(a).listeners=[],e=m(),o(a).startSize={width:e.width,height:e.height},h("Element start size",o(a).startSize),n.add(0,g),n.add(1,E),n.add(2,$),n.add(3,L),n.add(4,M)}u||(u=a,a=e,e=null),e=e||{},h("Making detectable..."),!function(e){return!function(e){return e===e.ownerDocument.body||e.ownerDocument.body.contains(e)}(e)||null===window.getComputedStyle(e)}(a)?T():(h("Element is detached"),S(),h("Waiting until element is attached..."),o(a).onRendered=function(){h("Element is now attached"),T()})},addListener:function(e,t){if(!o(e).listeners.push)throw new Error("Cannot add listener to an element that is not detectable.");o(e).listeners.push(t)},uninstall:function(e){var t=o(e);t&&(t.onExpandScroll&&u(d(e),"scroll",t.onExpandScroll),t.onShrinkScroll&&u(f(e),"scroll",t.onShrinkScroll),t.onAnimationStart&&u(t.container,"animationstart",t.onAnimationStart),t.container&&e.removeChild(t.container))},initDocument:a}},je=xe.forEach;function Pe(e){return Array.isArray(e)||void 0!==e.length}function De(e){if(Array.isArray(e))return e;var t=[];return je(e,(function(e){t.push(e)})),t}function He(e){return e&&1===e.nodeType}function ze(e,t,n){var o=e[t];return null==o&&void 0!==n?n:o}var Ce=function(e){var t,n;if((e=e||{}).idHandler)t={get:function(t){return e.idHandler.get(t,!0)},set:e.idHandler.set};else{var o=function(e){var t=e.idGenerator,n=e.stateHandler.getState;return{get:function(e){var t=n(e);return t&&void 0!==t.id?t.id:null},set:function(e){var o=n(e);if(!o)throw new Error("setId required the element to have a resize detection state.");var i=t.generate();return o.id=i,i}}}({idGenerator:(n=1,{generate:function(){return n++}}),stateHandler:Te});t=o}var i=e.reporter;i||(i=function(e){function t(){}var n={log:t,warn:t,error:t};if(!e&&window.console){var o=function(e,t){e[t]=function(){var e=console[t];if(e.apply)e.apply(console,arguments);else for(var n=0;n<arguments.length;n++)e(arguments[n])}};o(n,"log"),o(n,"warn"),o(n,"error")}return n}(!1===i));var r=ze(e,"batchProcessor",$e({reporter:i})),s={};s.callOnAdd=!!ze(e,"callOnAdd",!0),s.debug=!!ze(e,"debug",!1);var a,l=function(e){var t={};function n(n){var o=e.get(n);return void 0===o?[]:t[o]||[]}return{get:n,add:function(n,o){var i=e.get(n);t[i]||(t[i]=[]),t[i].push(o)},removeListener:function(e,t){for(var o=n(e),i=0,r=o.length;i<r;++i)if(o[i]===t){o.splice(i,1);break}},removeAllListeners:function(e){var t=n(e);t&&(t.length=0)}}}(t),c=function(e){var t=e.stateHandler.getState;return{isDetectable:function(e){var n=t(e);return n&&!!n.isDetectable},markAsDetectable:function(e){t(e).isDetectable=!0},isBusy:function(e){return!!t(e).busy},markBusy:function(e,n){t(e).busy=!!n}}}({stateHandler:Te}),u=ze(e,"strategy","object"),d=ze(e,"important",!1),f={reporter:i,batchProcessor:r,stateHandler:Te,idHandler:t,important:d};if("scroll"===u&&(Se.isLegacyOpera()?(i.warn("Scroll strategy is not supported on legacy Opera. Changing to object strategy."),u="object"):Se.isIE(9)&&(i.warn("Scroll strategy is not supported on IE9. Changing to object strategy."),u="object")),"scroll"===u)a=Ae(f);else{if("object"!==u)throw new Error("Invalid strategy name: "+u);a=function(e){var t=(e=e||{}).reporter,n=e.batchProcessor,o=e.stateHandler.getState;if(!t)throw new Error("Missing required dependency: reporter.");function i(t){var n=e.important?" !important; ":"; ";return(t.join(n)+n).trim()}function r(e){return o(e).object}return{makeDetectable:function(e,r,s){s||(s=r,r=e,e=null),(e=e||{}).debug,Se.isIE(8)?s(r):function(r,s){var a=i(["display: block","position: absolute","top: 0","left: 0","width: 100%","height: 100%","border: none","padding: 0","margin: 0","opacity: 0","z-index: -1000","pointer-events: none"]),l=!1,c=window.getComputedStyle(r),u=r.offsetWidth,d=r.offsetHeight;function f(){function n(){if("static"===c.position){r.style.setProperty("position","relative",e.important?"important":"");var n=function(t,n,o,i){var r=o[i];"auto"!==r&&"0"!==function(e){return e.replace(/[^-\d\.]/g,"")}(r)&&(t.warn("An element that is positioned static has style."+i+"="+r+" which is ignored due to the static positioning. The element will need to be positioned relative, so the style."+i+" will be set to 0. Element: ",n),n.style.setProperty(i,"0",e.important?"important":""))};n(t,r,c,"top"),n(t,r,c,"right"),n(t,r,c,"bottom"),n(t,r,c,"left")}}""!==c.position&&(n(),l=!0);var i=document.createElement("object");i.style.cssText=a,i.tabIndex=-1,i.type="text/html",i.setAttribute("aria-hidden","true"),i.onload=function(){l||n(),function e(t,n){if(!t.contentDocument){var i=o(t);return i.checkForObjectDocumentTimeoutId&&window.clearTimeout(i.checkForObjectDocumentTimeoutId),void(i.checkForObjectDocumentTimeoutId=setTimeout((function(){i.checkForObjectDocumentTimeoutId=0,e(t,n)}),100))}n(t.contentDocument)}(this,(function(e){s(r)}))},Se.isIE()||(i.data="about:blank"),o(r)&&(r.appendChild(i),o(r).object=i,Se.isIE()&&(i.data="about:blank"))}o(r).startSize={width:u,height:d},n?n.add(f):f()}(r,s)},addListener:function(e,t){function n(){t(e)}if(Se.isIE(8))o(e).object={proxy:n},e.attachEvent("onresize",n);else{var i=r(e);if(!i)throw new Error("Element is not detectable by this strategy.");i.contentDocument.defaultView.addEventListener("resize",n)}},uninstall:function(e){if(o(e)){var t=r(e);t&&(Se.isIE(8)?e.detachEvent("onresize",t.proxy):e.removeChild(t),o(e).checkForObjectDocumentTimeoutId&&window.clearTimeout(o(e).checkForObjectDocumentTimeoutId),delete o(e).object)}}}}(f)}var h={};return{listenTo:function(e,n,o){function r(e){var t=l.get(e);je(t,(function(t){t(e)}))}function u(e,t,n){l.add(t,n),e&&n(t)}if(o||(o=n,n=e,e={}),!n)throw new Error("At least one element required.");if(!o)throw new Error("Listener required.");if(He(n))n=[n];else{if(!Pe(n))return i.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");n=De(n)}var f=0,p=ze(e,"callOnAdd",s.callOnAdd),m=ze(e,"onReady",(function(){})),g=ze(e,"debug",s.debug);je(n,(function(e){Te.getState(e)||(Te.initState(e),t.set(e));var s=t.get(e);if(g&&i.log("Attaching listener to element",s,e),!c.isDetectable(e))return g&&i.log(s,"Not detectable."),c.isBusy(e)?(g&&i.log(s,"System busy making it detectable"),u(p,e,o),h[s]=h[s]||[],void h[s].push((function(){++f===n.length&&m()}))):(g&&i.log(s,"Making detectable..."),c.markBusy(e,!0),a.makeDetectable({debug:g,important:d},e,(function(e){if(g&&i.log(s,"onElementDetectable"),Te.getState(e)){c.markAsDetectable(e),c.markBusy(e,!1),a.addListener(e,r),u(p,e,o);var t=Te.getState(e);if(t&&t.startSize){var l=e.offsetWidth,d=e.offsetHeight;t.startSize.width===l&&t.startSize.height===d||r(e)}h[s]&&je(h[s],(function(e){e()}))}else g&&i.log(s,"Element uninstalled before being detectable.");delete h[s],++f===n.length&&m()})));g&&i.log(s,"Already detecable, adding listener."),u(p,e,o),f++})),f===n.length&&m()},removeListener:l.removeListener,removeAllListeners:l.removeAllListeners,uninstall:function(e){if(!e)return i.error("At least one element is required.");if(He(e))e=[e];else{if(!Pe(e))return i.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");e=De(e)}je(e,(function(e){l.removeAllListeners(e),a.uninstall(e),Te.cleanState(e)}))},initDocument:function(e){a.initDocument&&a.initDocument(e)}}}({strategy:"scroll"});function Ie(e,t){Ce.listenTo(e,t);var n=t;return{update:function(t){Ce.removeListener(e,n),Ce.listenTo(e,t),n=t},destroy:function(){Ce.removeListener(e,n)}}}function Oe(e){let t,n,o,i;function r(t){e[15].call(null,t)}function s(t){e[16].call(null,t)}let a={};return void 0!==e[6]&&(a.skillsEl=e[6]),void 0!==e[7]&&(a.whoEl=e[7]),t=new le({props:a}),j.push(()=>K(t,"skillsEl",r)),j.push(()=>K(t,"whoEl",s)),{c(){Z(t.$$.fragment)},m(e,n){ee(t,e,n),i=!0},p(e,i){const r={};!n&&64&i&&(n=!0,r.skillsEl=e[6],I(()=>n=!1)),!o&&128&i&&(o=!0,r.whoEl=e[7],I(()=>o=!1)),t.$set(r)},i(e){i||(V(t.$$.fragment,e),i=!0)},o(e){Y(t.$$.fragment,e),i=!1},d(e){te(t,e)}}}function qe(e){let t,n;return t=new we({}),{c(){Z(t.$$.fragment)},m(e,o){ee(t,e,o),n=!0},i(e){n||(V(t.$$.fragment,e),n=!0)},o(e){Y(t.$$.fragment,e),n=!1},d(e){te(t,e)}}}function Ne(t){let n,o,i,s,a,l,c,u,d,f,v,y,k,x,S,E,$,L;function M(e){t[9].call(null,e)}function T(e){t[10].call(null,e)}function _(e){t[11].call(null,e)}function A(e){t[12].call(null,e)}let P={};function D(e){t[13].call(null,e)}function H(e){t[14].call(null,e)}void 0!==t[1]&&(P.showAbout=t[1]),void 0!==t[2]&&(P.showPortfolio=t[2]),void 0!==t[3]&&(P.modalMenu=t[3]),void 0!==t[0]&&(P.hideMenu=t[0]),o=new fe({props:P}),j.push(()=>K(o,"showAbout",M)),j.push(()=>K(o,"showPortfolio",T)),j.push(()=>K(o,"modalMenu",_)),j.push(()=>K(o,"hideMenu",A));let z={};void 0!==t[5]&&(z.canvasSocialSide=t[5]),void 0!==t[4]&&(z.socialSide=t[4]),u=new ve({props:z}),j.push(()=>K(u,"canvasSocialSide",D)),j.push(()=>K(u,"socialSide",H));let C=t[1]&&Oe(t),O=!t[1]&&qe();return x=new pe({}),{c(){n=g("main"),Z(o.$$.fragment),c=b(),Z(u.$$.fragment),v=b(),C&&C.c(),y=b(),O&&O.c(),k=b(),Z(x.$$.fragment),w(n,"class","svelte-1bug634")},m(i,s){var a;p(i,n,s),ee(o,n,null),h(n,c),ee(u,n,null),h(n,v),C&&C.m(n,null),h(n,y),O&&O.m(n,null),h(n,k),ee(x,n,null),E=!0,$||(a=S=Ie.call(null,n,t[8]),L=a&&r(a.destroy)?a.destroy:e,$=!0)},p(e,[t]){const r={};!i&&2&t&&(i=!0,r.showAbout=e[1],I(()=>i=!1)),!s&&4&t&&(s=!0,r.showPortfolio=e[2],I(()=>s=!1)),!a&&8&t&&(a=!0,r.modalMenu=e[3],I(()=>a=!1)),!l&&1&t&&(l=!0,r.hideMenu=e[0],I(()=>l=!1)),o.$set(r);const c={};!d&&32&t&&(d=!0,c.canvasSocialSide=e[5],I(()=>d=!1)),!f&&16&t&&(f=!0,c.socialSide=e[4],I(()=>f=!1)),u.$set(c),e[1]?C?(C.p(e,t),2&t&&V(C,1)):(C=Oe(e),C.c(),V(C,1),C.m(n,y)):C&&(G(),Y(C,1,1,()=>{C=null}),U()),e[1]?O&&(G(),Y(O,1,1,()=>{O=null}),U()):O?2&t&&V(O,1):(O=qe(),O.c(),V(O,1),O.m(n,k))},i(e){E||(V(o.$$.fragment,e),V(u.$$.fragment,e),V(C),V(O),V(x.$$.fragment,e),E=!0)},o(e){Y(o.$$.fragment,e),Y(u.$$.fragment,e),Y(C),Y(O),Y(x.$$.fragment,e),E=!1},d(e){e&&m(n),te(o),te(u),C&&C.d(),O&&O.d(),te(x),$=!1,L()}}}function Be(e,t,n){let o,i,r,s,a,l,c,u,d;_(()=>{window.addEventListener("mousemove",m),n(0,i=!0)});var f,h;f="showingFooter",h=()=>{o>640&&(openf=!openf)},T().$$.context.set(f,h);const p=(e,t)=>{let n=parseInt(t.clientX),o=parseInt(t.clientY),i=parseInt(e.offsetTop),r=parseInt(e.offsetTop+e.offsetHeight),s=parseInt(e.offsetLeft),a=parseInt(e.offsetLeft+e.offsetWidth);return o>r||n>a||o<i||n<s},m=async e=>{!1===i&&(p(a,e)?n(0,i=!0):n(0,i=!1)),p(c,e)?l.classList.remove("social-over"):l.classList.add("social-over")};return[i,r,s,a,l,c,u,d,()=>{o=window.innerWidth},function(e){r=e,n(1,r)},function(e){s=e,n(2,s)},function(e){a=e,n(3,a)},function(e){i=e,n(0,i)},function(e){c=e,n(5,c)},function(e){l=e,n(4,l)},function(e){u=e,n(6,u)},function(e){d=e,n(7,d)}]}return new class extends ie{constructor(e){super(),oe(this,e,Be,Ne,s,{})}}({target:document.body,props:{}})}();
//# sourceMappingURL=bundle.js.map
