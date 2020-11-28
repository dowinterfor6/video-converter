var app=function(){"use strict";function e(){}const t=e=>e;function n(e){return e()}function r(){return Object.create(null)}function o(e){e.forEach(n)}function a(e){return"function"==typeof e}function i(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}const s="undefined"!=typeof window;let c=s?()=>window.performance.now():()=>Date.now(),l=s?e=>requestAnimationFrame(e):e;const f=new Set;function u(e){f.forEach((t=>{t.c(e)||(f.delete(t),t.f())})),0!==f.size&&l(u)}function p(e,t){e.appendChild(t)}function d(e,t,n){e.insertBefore(t,n||null)}function m(e){e.parentNode.removeChild(e)}function g(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function h(e){return document.createElement(e)}function v(e){return document.createElementNS("http://www.w3.org/2000/svg",e)}function w(e){return document.createTextNode(e)}function b(){return w(" ")}function y(e,t,n,r){return e.addEventListener(t,n,r),()=>e.removeEventListener(t,n,r)}function _(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function x(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function $(e,t,n,r){e.style.setProperty(t,n,r?"important":"")}function F(e,t,n){e.classList[n?"add":"remove"](t)}const E=new Set;let k,j=0;function L(e,t,n,r,o,a,i,s=0){const c=16.666/r;let l="{\n";for(let e=0;e<=1;e+=c){const r=t+(n-t)*a(e);l+=100*e+`%{${i(r,1-r)}}\n`}const f=l+`100% {${i(n,1-n)}}\n}`,u=`__svelte_${function(e){let t=5381,n=e.length;for(;n--;)t=(t<<5)-t^e.charCodeAt(n);return t>>>0}(f)}_${s}`,p=e.ownerDocument;E.add(p);const d=p.__svelte_stylesheet||(p.__svelte_stylesheet=p.head.appendChild(h("style")).sheet),m=p.__svelte_rules||(p.__svelte_rules={});m[u]||(m[u]=!0,d.insertRule(`@keyframes ${u} ${f}`,d.cssRules.length));const g=e.style.animation||"";return e.style.animation=`${g?`${g}, `:""}${u} ${r}ms linear ${o}ms 1 both`,j+=1,u}function C(e,t){const n=(e.style.animation||"").split(", "),r=n.filter(t?e=>e.indexOf(t)<0:e=>-1===e.indexOf("__svelte")),o=n.length-r.length;o&&(e.style.animation=r.join(", "),j-=o,j||l((()=>{j||(E.forEach((e=>{const t=e.__svelte_stylesheet;let n=t.cssRules.length;for(;n--;)t.deleteRule(n);e.__svelte_rules={}})),E.clear())})))}function P(e){k=e}const q=[],S=[],O=[],z=[],A=Promise.resolve();let T=!1;function N(e){O.push(e)}function B(e){z.push(e)}let R=!1;const M=new Set;function U(){if(!R){R=!0;do{for(let e=0;e<q.length;e+=1){const t=q[e];P(t),D(t.$$)}for(P(null),q.length=0;S.length;)S.pop()();for(let e=0;e<O.length;e+=1){const t=O[e];M.has(t)||(M.add(t),t())}O.length=0}while(q.length);for(;z.length;)z.pop()();T=!1,R=!1,M.clear()}}function D(e){if(null!==e.fragment){e.update(),o(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(N)}}let G;function W(e,t,n){e.dispatchEvent(function(e,t){const n=document.createEvent("CustomEvent");return n.initCustomEvent(e,!1,!1,t),n}(`${t?"intro":"outro"}${n}`))}const V=new Set;let H;function I(){H={r:0,c:[],p:H}}function Y(){H.r||o(H.c),H=H.p}function X(e,t){e&&e.i&&(V.delete(e),e.i(t))}function Z(e,t,n,r){if(e&&e.o){if(V.has(e))return;V.add(e),H.c.push((()=>{V.delete(e),r&&(n&&e.d(1),r())})),e.o(t)}}const J={duration:0};function K(n,r,i,s){let p=r(n,i),d=s?0:1,m=null,g=null,h=null;function v(){h&&C(n,h)}function w(e,t){const n=e.b-d;return t*=Math.abs(n),{a:d,b:e.b,d:n,duration:t,start:e.start,end:e.start+t,group:e.group}}function b(r){const{delay:a=0,duration:i=300,easing:s=t,tick:b=e,css:y}=p||J,_={start:c()+a,b:r};r||(_.group=H,H.r+=1),m||g?g=_:(y&&(v(),h=L(n,d,r,i,a,s,y)),r&&b(0,1),m=w(_,i),N((()=>W(n,r,"start"))),function(e){let t;0===f.size&&l(u),new Promise((n=>{f.add(t={c:e,f:n})}))}((e=>{if(g&&e>g.start&&(m=w(g,i),g=null,W(n,m.b,"start"),y&&(v(),h=L(n,d,m.b,m.duration,0,s,p.css))),m)if(e>=m.end)b(d=m.b,1-d),W(n,m.b,"end"),g||(m.b?v():--m.group.r||o(m.group.c)),m=null;else if(e>=m.start){const t=e-m.start;d=m.a+m.d*s(t/m.duration),b(d,1-d)}return!(!m&&!g)})))}return{run(e){a(p)?(G||(G=Promise.resolve(),G.then((()=>{G=null}))),G).then((()=>{p=p(),b(e)})):b(e)},end(){v(),m=g=null}}}function Q(e,t,n){const r=e.$$.props[t];void 0!==r&&(e.$$.bound[r]=n,n(e.$$.ctx[r]))}function ee(e){e&&e.c()}function te(e,t,r){const{fragment:i,on_mount:s,on_destroy:c,after_update:l}=e.$$;i&&i.m(t,r),N((()=>{const t=s.map(n).filter(a);c?c.push(...t):o(t),e.$$.on_mount=[]})),l.forEach(N)}function ne(e,t){const n=e.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function re(e,t){-1===e.$$.dirty[0]&&(q.push(e),T||(T=!0,A.then(U)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function oe(t,n,a,i,s,c,l=[-1]){const f=k;P(t);const u=n.props||{},p=t.$$={fragment:null,ctx:null,props:c,update:e,not_equal:s,bound:r(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(f?f.$$.context:[]),callbacks:r(),dirty:l,skip_bound:!1};let d=!1;if(p.ctx=a?a(t,u,((e,n,...r)=>{const o=r.length?r[0]:n;return p.ctx&&s(p.ctx[e],p.ctx[e]=o)&&(!p.skip_bound&&p.bound[e]&&p.bound[e](o),d&&re(t,e)),n})):[],p.update(),d=!0,o(p.before_update),p.fragment=!!i&&i(p.ctx),n.target){if(n.hydrate){const e=function(e){return Array.from(e.childNodes)}(n.target);p.fragment&&p.fragment.l(e),e.forEach(m)}else p.fragment&&p.fragment.c();n.intro&&X(t.$$.fragment),te(t,n.target,n.anchor),U()}P(f)}class ae{$destroy(){ne(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const ie=["3dotstr","4xm","aa","aac","ac3","acm","act","adf","adp","ads","adx","aea","afc","aiff","aix","alaw","alias_pix","alp","amr","amrnb","amrwb","anm","apc","ape","apm","apng","aptx","aptx_hd","aqtitle","argo_asf","asf","asf_o","ass","ast","au","av1","avi","avr","avs","avs2","bethsoftvid","bfi","bfstm","bin","bink","bit","bmp_pipe","bmv","boa","brender_pix","brstm","c93","caf","cavsvideo","cdg","cdx1","cine","codec2","codec2raw","concat","data","daud","dcstr","dds_pipe","defg","dfa","dhav","dirac","dnxhd","dpx_pipe","dsf","dsicin","dss","dts","dtshd","dv","dvbsub","dvbtxt","dxa","ea","ea_cdata","eac3","epaf","exr_pipe","f32be","f32le","f64be","f64le","ffmetadata","film_cpk","filmstrip","fits","flac","flic","flv","frm","fsb","fwse","g722","g723_1","g726","g7261e","g729","gdv","genh","gif","gif_pipe","gsm","gxf","h261","h263","h264","hca","hcom","hevc","hls","hnm","ico","idcin","idf","iff","ifv","ilbc","image2","image2pipe","ingenient","ipmovie","ircam","iss","iv8","ivf","ivr","j2k_pipe","jacosub","jpeg_pipe","jpegls_pipe","jv","kux","kvag","lavfi","live_flv","lmlm4","loas","lrc","lvf","lxv","m4v","mkv","webm","mgsts","microdvd","mjpeg","mjpeg_2000","mlp","mlv","mm","mmf","mov","mp4","m4a","3gp","3g2","mj2","mp3","mpc","mpc8","mpeg","mpegts","mpegtsraw","mpegvideo","mpjpeg","mp12","mpsub","msf","msnwctcp","mtaf","mtv","mulaw","musx","mv","mvi","mxf","mxg","nc","nistsphere","nsp","nsv","nut","nuv","ogg","oma","paf","pam_pipe","pbm_pipe","pcx_pipe","pbm_pipe","pgmyuv_pipe","pictor_pipe","pjs","pmp","png_pipe","pp_bnk","ppm_pipe","psd_pipe","psxstr","pva","pvf","qcp","qdraw_pipe","r2d","rawvideo","realtext","redspark","rl2","rm","roq","rpl","rsd","rso","rtp","rtsp","s16be","s16le","s24be","s24le","s32be","s32le","s337m","s8","sami","sap","sbc","sbg","scc","sdp","sdr2","sds","sdx","ser","sgi_pipe","shn","siff","sln","smjpeg","smk","smush","sol","sox","spdif","srt","stl","subviewer","subviewer1","sunrast_pipe","sup","svag","svg_pipe","swf","tak","tedcaptions","thp","tiertexseq","tiff_pipe","tmv","truehd","tta","tty","txd","ty","u16be","u16le","u24be","u24le","u32be","u32le","u8","v210","v210x","vag","vc1","vc1test","vidc","vividas","vivo","vmd","vobsub","voc","vpk","vplayer","vqf","w64","wav","wc3movie","webm_dash_manifest","webp_pipe","webvtt","wsaud","wsd","wsvqa","wtv","wv","wve","xa","xbin","xmv","xpm_pipe","xvag","xwd_pipe","xwma","yop","yuv4mpegpipe"],se=["3g2","3gp","a64","ac3","adts","adx","aiff","alaw","amr","apng","aptx","aptx_hd","asf","asf_stream","ass","ast","au","avi","avm2","avs2","bit","caf","cavsvideo","codec2","codec2raw","crc","dash","data","daud","dirac","dnxhd","dts","dv","dvd","eac3","f32be","f32le","f4v","f64be","f64le","ffmetadata","fifo","fifo_test","film_cpk","filmstrip","fits","flac","flv","framecrc","framehash","framemd5","g722","g723_1","g726","g726le","gif","gsm","gxf","h261","h263","h264","hash","hds","hevc","hls","ico","ilbc","image2","image2pipe","ipod","ircam","ismv","ivf","jacosub","kvag","latm","lrc","m4v","mkv","md5","microdvd","mjpeg","mkvtimestampe_v2","mlp","mmf","mov","mp2","mp3","mp4","mpeg","mpeg1video","mpeg2video","mpegts","mpjpeg","mulaw","mxf","mxf_d10","mxf_opatom","null","nut","oga","ogg","ogv","oma","opus","psp","rawvideo","rm","roq","rso","rtp","rtp_mpegts","rtsp","s16be","s16le","s24be","s24le","s32be","s32le","s8","sap","sbc","scc","segment","singlejpeg","smjpeg","smoothstreaming","sox","spdif","spx","srt","stream_segment","ssegment","streamhash","sup","svcd","swf","tee","truehd","tta","u16be","u16le","u24be","u24le","u32be","u32le","u8","uncodedframecrc","vc1","vc1test","vcd","vidc","vob","voc","w64","wav","webm","webm_chunk","webm_dash_manifest","webp","webvtt","wtv","wv","yuv4mpegpipe"];function ce(e,t,n){const r=e.slice();return r[20]=t[n],r}function le(e,t,n){const r=e.slice();return r[20]=t[n],r}function fe(t){let n;return{c(){n=h("span"),n.textContent="Choose a video or drag it here"},m(e,t){d(e,n,t)},p:e,d(e){e&&m(n)}}}function ue(e){let t,n;return{c(){t=h("span"),n=w(e[2]),_(t,"class","error-message svelte-1pbzo3a")},m(e,r){d(e,t,r),p(t,n)},p(e,t){4&t&&x(n,e[2])},d(e){e&&m(t)}}}function pe(e){let t,n;return{c(){t=h("span"),n=w(e[4])},m(e,r){d(e,t,r),p(t,n)},p(e,t){16&t&&x(n,e[4])},d(e){e&&m(t)}}}function de(t){let n,r,o,a,i,s=t[20]+"";return{c(){n=h("option"),r=w("."),o=w(s),a=b(),n.__value=i=t[20],n.value=n.__value},m(e,t){d(e,n,t),p(n,r),p(n,o),p(n,a)},p:e,d(e){e&&m(n)}}}function me(t){let n,r,o,a,i,s=t[20]+"";return{c(){n=h("option"),r=w("."),o=w(s),a=b(),n.__value=i=t[20],n.value=n.__value},m(e,t){d(e,n,t),p(n,r),p(n,o),p(n,a)},p:e,d(e){e&&m(n)}}}function ge(t){let n,r,a,i,s,c,l,f,u,v,w,x,$,E,k,j,L;function C(e,t){return e[4]?pe:e[2]?ue:fe}let P=C(t),q=P(t),S=t[5],O=[];for(let e=0;e<S.length;e+=1)O[e]=de(le(t,S,e));let z=t[6],A=[];for(let e=0;e<z.length;e+=1)A[e]=me(ce(t,z,e));return{c(){n=h("section"),r=h("div"),a=h("div"),i=h("input"),c=b(),l=h("label"),q.c(),u=b(),v=h("div"),w=h("input"),$=b(),E=h("select");for(let e=0;e<O.length;e+=1)O[e].c();k=h("option"),k.textContent="Other formats";for(let e=0;e<A.length;e+=1)A[e].c();_(i,"id","file-input"),_(i,"type","file"),_(i,"accept",s=ie.map(he).join(", ")),_(i,"class","svelte-1pbzo3a"),_(l,"for","file-input"),_(l,"class","svelte-1pbzo3a"),_(a,"class","file-upload-wrapper svelte-1pbzo3a"),F(a,"highlight",t[1]),_(r,"class","file-upload-container svelte-1pbzo3a"),_(r,"onanimationend",f=ve),F(r,"animate__shakeX",t[2]),_(w,"class","searchable-dropdown svelte-1pbzo3a"),_(w,"type","text"),w.value=x=`.${t[0]}`,k.disabled=!0,k.__value="Other formats",k.value=k.__value,_(E,"class","svelte-1pbzo3a"),_(v,"class","dropdown-container svelte-1pbzo3a"),_(n,"class","input-container svelte-1pbzo3a")},m(e,o){d(e,n,o),p(n,r),p(r,a),p(a,i),p(a,c),p(a,l),q.m(l,null),p(n,u),p(n,v),p(v,w),p(v,$),p(v,E);for(let e=0;e<O.length;e+=1)O[e].m(E,null);p(E,k);for(let e=0;e<A.length;e+=1)A[e].m(E,null);t[14](E),j||(L=[y(i,"change",t[11]),y(a,"dragenter",t[7]),y(a,"dragleave",t[9]),y(a,"dragover",t[8]),y(a,"drop",t[10]),y(w,"change",t[12]),y(E,"change",t[15])],j=!0)},p(e,[t]){if(P===(P=C(e))&&q?q.p(e,t):(q.d(1),q=P(e),q&&(q.c(),q.m(l,null))),2&t&&F(a,"highlight",e[1]),4&t&&F(r,"animate__shakeX",e[2]),1&t&&x!==(x=`.${e[0]}`)&&w.value!==x&&(w.value=x),32&t){let n;for(S=e[5],n=0;n<S.length;n+=1){const r=le(e,S,n);O[n]?O[n].p(r,t):(O[n]=de(r),O[n].c(),O[n].m(E,k))}for(;n<O.length;n+=1)O[n].d(1);O.length=S.length}if(64&t){let n;for(z=e[6],n=0;n<z.length;n+=1){const r=ce(e,z,n);A[n]?A[n].p(r,t):(A[n]=me(r),A[n].c(),A[n].m(E,null))}for(;n<A.length;n+=1)A[n].d(1);A.length=z.length}},i:e,o:e,d(e){e&&m(n),q.d(),g(O,e),g(A,e),t[14](null),j=!1,o(L)}}}const he=e=>`.${e}`,ve=e=>e.currentTarget.classList.remove("animate__shakeX");function we(e,t,n){let r,{video:o}=t,{fileFormat:a}=t,i=!1,s="";const c=["mp4","mov","flv","avi","webm","mkv","gif","mp3"],l=se.filter((e=>!c.includes(e))),f=e=>{n(1,i=!0),e.preventDefault(),e.stopPropagation()},u=e=>{n(1,i=!1),e.preventDefault(),e.stopPropagation()},p=e=>{e&&("video"!==e.type.split("/")[0]?n(2,s="Error: Invalid file type"):e.size/1024/1024/1024>=2?n(2,s="Error: File exceeded 2gb size limit"):(n(2,s=""),n(13,o=e)))};let d;return e.$$set=e=>{"video"in e&&n(13,o=e.video),"fileFormat"in e&&n(0,a=e.fileFormat)},e.$$.update=()=>{8192&e.$$.dirty&&n(4,d=o?.name)},[a,i,s,r,d,c,l,e=>{f(e)},e=>{f(e)},e=>{u(e)},e=>{u(e);const t=e.dataTransfer.files?.item(0);p(t)},e=>{const t=e.currentTarget.files?.item(0);p(t)},()=>{r.focus()},o,function(e){S[e?"unshift":"push"]((()=>{r=e,n(3,r),n(6,l),n(5,c)}))},e=>n(0,a=e.currentTarget.value)]}class be extends ae{constructor(e){super(),oe(this,e,we,ge,i,{video:13,fileFormat:0})}}"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self;function ye(e,t,n){return e(n={path:t,exports:{},require:function(e,t){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==t&&n.path)}},n.exports),n.exports}ye((function(e){var t=function(e){var t,n=Object.prototype,r=n.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",i=o.asyncIterator||"@@asyncIterator",s=o.toStringTag||"@@toStringTag";function c(e,t,n){return Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{c({},"")}catch(e){c=function(e,t,n){return e[t]=n}}function l(e,t,n,r){var o=t&&t.prototype instanceof h?t:h,a=Object.create(o.prototype),i=new L(r||[]);return a._invoke=function(e,t,n){var r=u;return function(o,a){if(r===d)throw new Error("Generator is already running");if(r===m){if("throw"===o)throw a;return P()}for(n.method=o,n.arg=a;;){var i=n.delegate;if(i){var s=E(i,n);if(s){if(s===g)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(r===u)throw r=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r=d;var c=f(e,t,n);if("normal"===c.type){if(r=n.done?m:p,c.arg===g)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(r=m,n.method="throw",n.arg=c.arg)}}}(e,n,i),a}function f(e,t,n){try{return{type:"normal",arg:e.call(t,n)}}catch(e){return{type:"throw",arg:e}}}e.wrap=l;var u="suspendedStart",p="suspendedYield",d="executing",m="completed",g={};function h(){}function v(){}function w(){}var b={};b[a]=function(){return this};var y=Object.getPrototypeOf,_=y&&y(y(C([])));_&&_!==n&&r.call(_,a)&&(b=_);var x=w.prototype=h.prototype=Object.create(b);function $(e){["next","throw","return"].forEach((function(t){c(e,t,(function(e){return this._invoke(t,e)}))}))}function F(e,t){function n(o,a,i,s){var c=f(e[o],e,a);if("throw"!==c.type){var l=c.arg,u=l.value;return u&&"object"==typeof u&&r.call(u,"__await")?t.resolve(u.__await).then((function(e){n("next",e,i,s)}),(function(e){n("throw",e,i,s)})):t.resolve(u).then((function(e){l.value=e,i(l)}),(function(e){return n("throw",e,i,s)}))}s(c.arg)}var o;this._invoke=function(e,r){function a(){return new t((function(t,o){n(e,r,t,o)}))}return o=o?o.then(a,a):a()}}function E(e,n){var r=e.iterator[n.method];if(r===t){if(n.delegate=null,"throw"===n.method){if(e.iterator.return&&(n.method="return",n.arg=t,E(e,n),"throw"===n.method))return g;n.method="throw",n.arg=new TypeError("The iterator does not provide a 'throw' method")}return g}var o=f(r,e.iterator,n.arg);if("throw"===o.type)return n.method="throw",n.arg=o.arg,n.delegate=null,g;var a=o.arg;return a?a.done?(n[e.resultName]=a.value,n.next=e.nextLoc,"return"!==n.method&&(n.method="next",n.arg=t),n.delegate=null,g):a:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,g)}function k(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function j(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function L(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(k,this),this.reset(!0)}function C(e){if(e){var n=e[a];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function n(){for(;++o<e.length;)if(r.call(e,o))return n.value=e[o],n.done=!1,n;return n.value=t,n.done=!0,n};return i.next=i}}return{next:P}}function P(){return{value:t,done:!0}}return v.prototype=x.constructor=w,w.constructor=v,v.displayName=c(w,s,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===v||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,w):(e.__proto__=w,c(e,s,"GeneratorFunction")),e.prototype=Object.create(x),e},e.awrap=function(e){return{__await:e}},$(F.prototype),F.prototype[i]=function(){return this},e.AsyncIterator=F,e.async=function(t,n,r,o,a){void 0===a&&(a=Promise);var i=new F(l(t,n,r,o),a);return e.isGeneratorFunction(n)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},$(x),c(x,s,"Generator"),x[a]=function(){return this},x.toString=function(){return"[object Generator]"},e.keys=function(e){var t=[];for(var n in e)t.push(n);return t.reverse(),function n(){for(;t.length;){var r=t.pop();if(r in e)return n.value=r,n.done=!1,n}return n.done=!0,n}},e.values=C,L.prototype={constructor:L,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(j),!e)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=t)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var n=this;function o(r,o){return s.type="throw",s.arg=e,n.next=r,o&&(n.method="next",n.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],s=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var c=r.call(i,"catchLoc"),l=r.call(i,"finallyLoc");if(c&&l){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===e||"continue"===e)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=e,i.arg=t,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),g},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.finallyLoc===e)return this.complete(n.completion,n.afterLoc),j(n),g}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.tryLoc===e){var r=n.completion;if("throw"===r.type){var o=r.arg;j(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,n,r){return this.delegate={iterator:C(e),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=t),g}},e}(e.exports);try{regeneratorRuntime=t}catch(e){Function("r","regeneratorRuntime = r")(t)}}));let _e=!1,xe=()=>{};var $e={logging:_e,setLogging:e=>{_e=e},setCustomLogger:e=>{xe=e},log:(e,t)=>{xe({type:e,message:t}),_e&&console.log(`[${e}] ${t}`)}};let Fe=0;const Ee=e=>{const[t,n,r]=e.split(":");return 60*parseFloat(t)*60+60*parseFloat(n)+parseFloat(r)};var ke=ye((function(e,t){e.exports=function(){function e(){var e=arguments.length;if(0===e)throw new Error("resolveUrl requires at least one argument; got none.");var t=document.createElement("base");if(t.href=arguments[0],1===e)return t.href;var n=document.getElementsByTagName("head")[0];n.insertBefore(t,n.firstChild);for(var r,o=document.createElement("a"),a=1;a<e;a++)o.href=arguments[a],r=o.href,t.href=r;return n.removeChild(t),r}return e}()})),je={_from:"@ffmpeg/ffmpeg",_id:"@ffmpeg/ffmpeg@0.9.6",_inBundle:!1,_integrity:"sha512-ov5FAV3dHRJ/+ZxQH9V5GvY/iczwq5vrKWeu4tpytxZewTSAhZ1aKD/sFBzd79nQNF+CTktxUp3LWuGECXBNeA==",_location:"/@ffmpeg/ffmpeg",_phantomChildren:{},_requested:{type:"tag",registry:!0,raw:"@ffmpeg/ffmpeg",name:"@ffmpeg/ffmpeg",escapedName:"@ffmpeg%2fffmpeg",scope:"@ffmpeg",rawSpec:"",saveSpec:null,fetchSpec:"latest"},_requiredBy:["#USER","/"],_resolved:"https://registry.npmjs.org/@ffmpeg/ffmpeg/-/ffmpeg-0.9.6.tgz",_shasum:"b44fa1ab34dd860785bb7c317dbfbe8b9ded7036",_spec:"@ffmpeg/ffmpeg",_where:"/home/dowinterfor6/linux_documents/video-converter",author:{name:"Jerome Wu",email:"jeromewus@gmail.com"},browser:{"./src/node/index.js":"./src/browser/index.js"},bugs:{url:"https://github.com/ffmpegwasm/ffmpeg.wasm/issues"},bundleDependencies:!1,dependencies:{"is-url":"^1.2.4","node-fetch":"^2.6.1","regenerator-runtime":"^0.13.7","resolve-url":"^0.2.1"},deprecated:!1,description:"FFmpeg WebAssembly version",devDependencies:{"@babel/core":"^7.12.3","@babel/preset-env":"^7.12.1","@ffmpeg/core":"^0.8.5","@types/emscripten":"^1.39.4","babel-loader":"^8.1.0",chai:"^4.2.0",cors:"^2.8.5",eslint:"^7.12.1","eslint-config-airbnb-base":"^14.1.0","eslint-plugin-import":"^2.22.1",express:"^4.17.1",mocha:"^8.2.1","mocha-headless-chrome":"^2.0.3","npm-run-all":"^4.1.5","wait-on":"^5.2.0",webpack:"^5.3.2","webpack-cli":"^4.1.0","webpack-dev-middleware":"^4.0.0"},directories:{example:"examples"},engines:{node:">=12.16.1"},homepage:"https://github.com/ffmpegwasm/ffmpeg.wasm#readme",keywords:["ffmpeg","WebAssembly","video"],license:"MIT",main:"src/index.js",name:"@ffmpeg/ffmpeg",repository:{type:"git",url:"git+https://github.com/ffmpegwasm/ffmpeg.wasm.git"},scripts:{build:"rimraf dist && webpack --config scripts/webpack.config.prod.js",lint:"eslint src",prepublishOnly:"npm run build",start:"node scripts/server.js",test:"npm-run-all -p -r start test:all","test:all":"npm-run-all wait test:browser:ffmpeg test:node:all","test:browser":"mocha-headless-chrome -a allow-file-access-from-files -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000","test:browser:ffmpeg":"npm run test:browser -- -f ./tests/ffmpeg.test.html","test:node":"node --experimental-wasm-threads --experimental-wasm-bulk-memory node_modules/.bin/_mocha --exit --bail --require ./scripts/test-helper.js","test:node:all":"npm run test:node -- ./tests/*.test.js",wait:"rimraf dist && wait-on http://localhost:3000/dist/ffmpeg.dev.js"},types:"src/index.d.ts",version:"0.9.6"};const{devDependencies:Le}=je;var Ce={corePath:"undefined"!=typeof process&&"development"===process.env.FFMPEG_ENV?ke("/node_modules/@ffmpeg/core/dist/ffmpeg-core.js"):`https://unpkg.com/@ffmpeg/core@${Le["@ffmpeg/core"].substring(1)}/dist/ffmpeg-core.js`};const{log:Pe}=$e,qe=async(e,t)=>{Pe("info",`fetch ${e}`);const n=await(await fetch(e)).arrayBuffer();Pe("info",`${e} file size = ${n.byteLength} bytes`);const r=new Blob([n],{type:t}),o=URL.createObjectURL(r);return Pe("info",`${e} blob URL = ${o}`),o};var Se={defaultOptions:Ce,getCreateFFmpegCore:async({corePath:e})=>{if("string"!=typeof e)throw Error("corePath should be a string!");const t=ke(e),n=await qe(t,"application/javascript"),r=await qe(t.replace("ffmpeg-core.js","ffmpeg-core.wasm"),"application/wasm"),o=await qe(t.replace("ffmpeg-core.js","ffmpeg-core.worker.js"),"application/javascript");return"undefined"==typeof createFFmpegCore?new Promise((e=>{const t=document.createElement("script"),a=()=>{t.removeEventListener("load",a),Pe("info","ffmpeg-core.js script loaded"),e({createFFmpegCore:createFFmpegCore,corePath:n,wasmPath:r,workerPath:o})};t.src=n,t.type="text/javascript",t.addEventListener("load",a),document.getElementsByTagName("head")[0].appendChild(t)})):(Pe("info","ffmpeg-core.js script is loaded already"),Promise.resolve({createFFmpegCore:createFFmpegCore,corePath:n,wasmPath:r,workerPath:o}))},fetchFile:async e=>{let t=e;if(void 0===e)return new Uint8Array;if("string"==typeof e)if(/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(e))t=atob(e.split(",")[1]).split("").map((e=>e.charCodeAt(0)));else{const n=await fetch(ke(e));t=await n.arrayBuffer()}else(e instanceof File||e instanceof Blob)&&(t=await(n=e,new Promise(((e,t)=>{const r=new FileReader;r.onload=()=>{e(r.result)},r.onerror=({target:{error:{code:e}}})=>{t(Error(`File could not be read! Code=${e}`))},r.readAsArrayBuffer(n)}))));var n;return new Uint8Array(t)}};const{defaultArgs:Oe,baseOptions:ze}={defaultArgs:["./ffmpeg","-nostdin","-y"],baseOptions:{log:!1,logger:()=>{},progress:()=>{},corePath:""}},{setLogging:Ae,setCustomLogger:Te,log:Ne}=$e,{defaultOptions:Be,getCreateFFmpegCore:Re}=Se,{version:Me}=je,Ue=Error("ffmpeg.wasm is not ready, make sure you have completed load().");const{fetchFile:De}=Se;var Ge={createFFmpeg:(e={})=>{const{log:t,logger:n,progress:r,...o}={...ze,...Be,...e};let a=null,i=null,s=null,c=!1,l=r;const f=({type:e,message:t})=>{Ne(e,t),((e,t)=>{if("string"==typeof e)if(e.startsWith("  Duration")){const t=e.split(", ")[0].split(": ")[1],n=Ee(t);(0===Fe||Fe>n)&&(Fe=n)}else if(e.startsWith("frame")){const n=e.split("time=")[1].split(" ")[0];t({ratio:Ee(n)/Fe})}else e.startsWith("video:")&&(t({ratio:1}),Fe=0)})(t,l),(e=>{"FFMPEG_END"===e&&null!==s&&(s(),s=null,c=!1)})(t)};return Ae(t),Te(n),Ne("info",`use ffmpeg.wasm v${Me}`),{setProgress:e=>{l=e},setLogger:e=>{Te(e)},setLogging:Ae,load:async()=>{if(Ne("info","load ffmpeg-core"),null!==a)throw Error("ffmpeg.wasm was loaded, you should not load it again, use ffmpeg.isLoaded() to check next time.");{Ne("info","loading ffmpeg-core");const{createFFmpegCore:e,corePath:t,workerPath:n,wasmPath:r}=await Re(o);a=await e({mainScriptUrlOrBlob:t,printErr:e=>f({type:"fferr",message:e}),print:e=>f({type:"ffout",message:e}),locateFile:(e,t)=>{if("undefined"!=typeof window){if(void 0!==r&&e.endsWith("ffmpeg-core.wasm"))return r;if(void 0!==n&&e.endsWith("ffmpeg-core.worker.js"))return n}return t+e}}),i=a.cwrap("proxy_main","number",["number","number"]),Ne("info","ffmpeg-core loaded")}},isLoaded:()=>null!==a,run:(...e)=>{if(Ne("info",`run ffmpeg command: ${e.join(" ")}`),null===a)throw Ue;if(c)throw Error("ffmpeg.wasm can only run one command at a time");return c=!0,new Promise((t=>{const n=[...Oe,...e].filter((e=>0!==e.length));s=t,i(...((e,t)=>{const n=e._malloc(t.length*Uint32Array.BYTES_PER_ELEMENT);return t.forEach(((t,r)=>{const o=e._malloc(t.length+1);e.writeAsciiToMemory(t,o),e.setValue(n+Uint32Array.BYTES_PER_ELEMENT*r,o,"i32")})),[t.length,n]})(a,n))}))},FS:(e,...t)=>{if(Ne("info",`run FS.${e} ${t.map((e=>"string"==typeof e?e:`<${e.length} bytes binary file>`)).join(" ")}`),null===a)throw Ue;{let n=null;try{n=a.FS[e](...t)}catch(n){throw"readdir"===e?Error(`ffmpeg.FS('readdir', '${t[0]}') error. Check if the path exists, ex: ffmpeg.FS('readdir', '/')`):"readFile"===e?Error(`ffmpeg.FS('readFile', '${t[0]}') error. Check if the path exists`):Error("Oops, something went wrong in FS operation.")}return n}}}},fetchFile:De};function We(e){return e<.5?4*e*e*e:.5*Math.pow(2*e-2,3)+1}function Ve(e,{delay:n=0,duration:r=400,easing:o=t}){const a=+getComputedStyle(e).opacity;return{delay:n,duration:r,easing:o,css:e=>"opacity: "+e*a}}function He(e,{delay:t=0,speed:n,duration:r,easing:o=We}){const a=e.getTotalLength();return void 0===r?r=void 0===n?800:a/n:"function"==typeof r&&(r=r(a)),{delay:t,duration:r,easing:o,css:(e,t)=>`stroke-dasharray: ${e*a} ${t*a}`}}function Ie(e){let t,n,r,o,a;return{c(){t=h("div"),n=h("div"),_(n,"class","progress-bar svelte-10dqltm"),_(n,"style",r=`width: ${e[0]}%`),_(t,"class","progress-bar-container svelte-10dqltm")},m(e,r){d(e,t,r),p(t,n),a=!0},p(e,[t]){(!a||1&t&&r!==(r=`width: ${e[0]}%`))&&_(n,"style",r)},i(e){a||(N((()=>{o||(o=K(t,Ve,{duration:1e3},!0)),o.run(1)})),a=!0)},o(e){o||(o=K(t,Ve,{duration:1e3},!1)),o.run(0),a=!1},d(e){e&&m(t),e&&o&&o.end()}}}function Ye(e,t,n){let{progress:r}=t;return e.$$set=e=>{"progress"in e&&n(0,r=e.progress)},[r]}class Xe extends ae{constructor(e){super(),oe(this,e,Ye,Ie,i,{progress:0})}}function Ze(t){let n,r,o,a,i,s,c,l,f,u,g,w,x,F,E,k,j,L,C,P,q;return{c(){n=h("div"),r=h("div"),o=v("svg"),a=v("g"),i=v("g"),s=v("path"),l=v("g"),f=v("g"),u=v("path"),w=v("g"),x=v("g"),F=v("path"),k=b(),j=h("span"),j.textContent="Convert",_(s,"d","M472.897,124.269c-0.01-0.01-0.02-0.02-0.03-0.031l-0.017,0.017l-68.267-68.267c-6.78-6.548-17.584-6.36-24.132,0.42\n                c-6.388,6.614-6.388,17.099,0,23.713l39.151,39.151h-95.334c-65.948,0.075-119.391,53.518-119.467,119.467\n                c-0.056,47.105-38.228,85.277-85.333,85.333h-102.4C7.641,324.072,0,331.713,0,341.139s7.641,17.067,17.067,17.067h102.4\n                c65.948-0.075,119.391-53.518,119.467-119.467c0.056-47.105,38.228-85.277,85.333-85.333h95.334l-39.134,39.134\n                c-6.78,6.548-6.968,17.353-0.419,24.132c6.548,6.78,17.353,6.968,24.132,0.419c0.142-0.137,0.282-0.277,0.419-0.419l68.267-68.267\n                C479.54,141.748,479.553,130.942,472.897,124.269z"),_(s,"class","svelte-ncd8cq"),_(u,"d","M472.897,329.069c-0.01-0.01-0.02-0.02-0.03-0.03l-0.017,0.017l-68.267-68.267c-6.78-6.548-17.584-6.36-24.132,0.42\n                c-6.388,6.614-6.388,17.099,0,23.712l39.151,39.151h-95.334c-20.996,0.015-41.258-7.721-56.9-21.726\n                c-7.081-6.222-17.864-5.525-24.086,1.555c-6.14,6.988-5.553,17.605,1.319,23.874c21.898,19.614,50.269,30.451,79.667,30.43h95.334\n                l-39.134,39.134c-6.78,6.548-6.968,17.352-0.42,24.132c6.548,6.78,17.352,6.968,24.132,0.42c0.142-0.138,0.282-0.277,0.42-0.42\n                l68.267-68.267C479.54,346.548,479.553,335.742,472.897,329.069z"),_(u,"class","svelte-ncd8cq"),_(F,"d","M199.134,149.702c-21.898-19.614-50.269-30.451-79.667-30.43h-102.4C7.641,119.272,0,126.913,0,136.339\n                c0,9.426,7.641,17.067,17.067,17.067h102.4c20.996-0.015,41.258,7.721,56.9,21.726c7.081,6.222,17.864,5.525,24.086-1.555\n                C206.593,166.588,206.006,155.971,199.134,149.702z"),_(F,"class","svelte-ncd8cq"),_(o,"version","1.1"),_(o,"id","Capa_1"),_(o,"xmlns","http://www.w3.org/2000/svg"),_(o,"xmlns:xlink","http://www.w3.org/1999/xlink"),_(o,"x","0px"),_(o,"y","0px"),_(o,"width","30px"),_(o,"height","30px"),$(o,"enable-background","new 0 0 75.716 75.716"),_(o,"xml:space","preserve"),_(o,"viewBox","150 70 350 350"),_(o,"class","svelte-ncd8cq"),_(r,"class","svelte-ncd8cq"),_(j,"class","svelte-ncd8cq"),_(n,"class","convert-container svelte-ncd8cq")},m(e,c){d(e,n,c),p(n,r),p(r,o),p(o,a),p(a,i),p(i,s),p(o,l),p(l,f),p(f,u),p(o,w),p(w,x),p(x,F),p(n,k),p(n,j),C=!0,P||(q=y(n,"click",t[5]),P=!0)},p:e,i(e){C||(N((()=>{c||(c=K(s,He,{duration:2e3},!0)),c.run(1)})),N((()=>{g||(g=K(u,He,{duration:2e3},!0)),g.run(1)})),N((()=>{E||(E=K(F,He,{duration:2e3},!0)),E.run(1)})),N((()=>{L||(L=K(n,Ve,{duration:300},!0)),L.run(1)})),C=!0)},o(e){c||(c=K(s,He,{duration:2e3},!1)),c.run(0),g||(g=K(u,He,{duration:2e3},!1)),g.run(0),E||(E=K(F,He,{duration:2e3},!1)),E.run(0),L||(L=K(n,Ve,{duration:300},!1)),L.run(0),C=!1},d(e){e&&m(n),e&&c&&c.end(),e&&g&&g.end(),e&&E&&E.end(),e&&L&&L.end(),P=!1,q()}}}function Je(e){let t,n,r;function o(t){e[6].call(null,t)}let a={};return void 0!==e[2]&&(a.progress=e[2]),t=new Xe({props:a}),S.push((()=>Q(t,"progress",o))),{c(){ee(t.$$.fragment)},m(e,n){te(t,e,n),r=!0},p(e,r){const o={};!n&&4&r&&(n=!0,o.progress=e[2],B((()=>n=!1))),t.$set(o)},i(e){r||(X(t.$$.fragment,e),r=!0)},o(e){Z(t.$$.fragment,e),r=!1},d(e){ne(t,e)}}}function Ke(e){let t,n,r,o,a,i,s,c,l,f,u,g,w,y,x,F;return{c(){t=h("a"),n=h("div"),r=v("svg"),o=v("g"),a=v("g"),i=v("path"),c=v("g"),l=v("g"),f=v("path"),g=b(),w=h("span"),w.textContent="Download",_(i,"d","M382.56,233.376C379.968,227.648,374.272,224,368,224h-64V16c0-8.832-7.168-16-16-16h-64c-8.832,0-16,7.168-16,16v208h-64\n                c-6.272,0-11.968,3.68-14.56,9.376c-2.624,5.728-1.6,12.416,2.528,17.152l112,128c3.04,3.488,7.424,5.472,12.032,5.472\n                c4.608,0,8.992-2.016,12.032-5.472l112-128C384.192,245.824,385.152,239.104,382.56,233.376z"),_(i,"class","svelte-ncd8cq"),_(f,"d","M432,352v96H80v-96H16v128c0,17.696,14.336,32,32,32h416c17.696,0,32-14.304,32-32V352H432z"),_(f,"class","svelte-ncd8cq"),_(r,"version","1.1"),_(r,"id","Capa_1"),_(r,"xmlns","http://www.w3.org/2000/svg"),_(r,"xmlns:xlink","http://www.w3.org/1999/xlink"),_(r,"x","0px"),_(r,"y","0px"),_(r,"viewBox","0 10 500 500"),$(r,"enable-background","new 0 0 512 512"),_(r,"xml:space","preserve"),_(r,"width","30px"),_(r,"height","30px"),_(r,"class","svelte-ncd8cq"),_(n,"class","svelte-ncd8cq"),_(w,"class","svelte-ncd8cq"),_(t,"href",e[3]),_(t,"download",y=`download.${e[1]}`),_(t,"class","download-container svelte-ncd8cq")},m(e,s){d(e,t,s),p(t,n),p(n,r),p(r,o),p(o,a),p(a,i),p(r,c),p(c,l),p(l,f),p(t,g),p(t,w),F=!0},p(e,n){(!F||8&n)&&_(t,"href",e[3]),(!F||2&n&&y!==(y=`download.${e[1]}`))&&_(t,"download",y)},i(e){F||(N((()=>{s||(s=K(i,He,{duration:2e3},!0)),s.run(1)})),N((()=>{u||(u=K(f,He,{duration:2e3},!0)),u.run(1)})),N((()=>{x||(x=K(t,Ve,{duration:300},!0)),x.run(1)})),F=!0)},o(e){s||(s=K(i,He,{duration:2e3},!1)),s.run(0),u||(u=K(f,He,{duration:2e3},!1)),u.run(0),x||(x=K(t,Ve,{duration:300},!1)),x.run(0),F=!1},d(e){e&&m(t),e&&s&&s.end(),e&&u&&u.end(),e&&x&&x.end()}}}function Qe(e){let t,n,r,o,a=e[0].name&&Ze(e),i=e[4]&&Je(e),s=e[3]&&Ke(e);return{c(){t=h("section"),a&&a.c(),n=b(),i&&i.c(),r=b(),s&&s.c(),_(t,"class","interactables-container svelte-ncd8cq")},m(e,c){d(e,t,c),a&&a.m(t,null),p(t,n),i&&i.m(t,null),p(t,r),s&&s.m(t,null),o=!0},p(e,[o]){e[0].name?a?(a.p(e,o),1&o&&X(a,1)):(a=Ze(e),a.c(),X(a,1),a.m(t,n)):a&&(I(),Z(a,1,1,(()=>{a=null})),Y()),e[4]?i?(i.p(e,o),16&o&&X(i,1)):(i=Je(e),i.c(),X(i,1),i.m(t,r)):i&&(I(),Z(i,1,1,(()=>{i=null})),Y()),e[3]?s?(s.p(e,o),8&o&&X(s,1)):(s=Ke(e),s.c(),X(s,1),s.m(t,null)):s&&(I(),Z(s,1,1,(()=>{s=null})),Y())},i(e){o||(X(a),X(i),X(s),o=!0)},o(e){Z(a),Z(i),Z(s),o=!1},d(e){e&&m(t),a&&a.d(),i&&i.d(),s&&s.d()}}}function et(e,t,n){let r,o,{video:a}=t,{fileFormat:i}=t,s=0;const c=Ge.createFFmpeg({log:!0,progress:({ratio:e})=>{e>=0&&n(2,s=(100*e).toFixed(2))}});return e.$$set=e=>{"video"in e&&n(0,a=e.video),"fileFormat"in e&&n(1,i=e.fileFormat)},[a,i,s,r,o,async()=>{const{name:e}=a;n(4,o=!0),c.isLoaded()||await c.load(),c.FS("writeFile",e,await Ge.fetchFile(a)),await c.run("-i",e,"-f",`${i}`,`out.${i}`);const t=c.FS("readFile",`out.${i}`),s=URL.createObjectURL(new Blob([t.buffer]),{type:`video/${i}`});n(3,r=s),n(4,o=!1)},function(e){s=e,n(2,s)}]}class tt extends ae{constructor(e){super(),oe(this,e,et,Qe,i,{video:0,fileFormat:1})}}function nt(e){let t,n,r,o,a,i,s,c,l,f,u;function g(t){e[2].call(null,t)}function v(t){e[3].call(null,t)}let w={};function y(t){e[4].call(null,t)}function x(t){e[5].call(null,t)}void 0!==e[0]&&(w.video=e[0]),void 0!==e[1]&&(w.fileFormat=e[1]),o=new be({props:w}),S.push((()=>Q(o,"video",g))),S.push((()=>Q(o,"fileFormat",v)));let $={};return void 0!==e[0]&&($.video=e[0]),void 0!==e[1]&&($.fileFormat=e[1]),c=new tt({props:$}),S.push((()=>Q(c,"video",y))),S.push((()=>Q(c,"fileFormat",x))),{c(){t=h("main"),n=h("h1"),n.textContent="Video Converter",r=b(),ee(o.$$.fragment),s=b(),ee(c.$$.fragment),_(n,"class","svelte-1ozf4hk"),_(t,"class","svelte-1ozf4hk")},m(e,a){d(e,t,a),p(t,n),p(t,r),te(o,t,null),p(t,s),te(c,t,null),u=!0},p(e,[t]){const n={};!a&&1&t&&(a=!0,n.video=e[0],B((()=>a=!1))),!i&&2&t&&(i=!0,n.fileFormat=e[1],B((()=>i=!1))),o.$set(n);const r={};!l&&1&t&&(l=!0,r.video=e[0],B((()=>l=!1))),!f&&2&t&&(f=!0,r.fileFormat=e[1],B((()=>f=!1))),c.$set(r)},i(e){u||(X(o.$$.fragment,e),X(c.$$.fragment,e),u=!0)},o(e){Z(o.$$.fragment,e),Z(c.$$.fragment,e),u=!1},d(e){e&&m(t),ne(o),ne(c)}}}function rt(e,t,n){let r={},o="mp4";return[r,o,function(e){r=e,n(0,r)},function(e){o=e,n(1,o)},function(e){r=e,n(0,r)},function(e){o=e,n(1,o)}]}return new class extends ae{constructor(e){super(),oe(this,e,rt,nt,i,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
