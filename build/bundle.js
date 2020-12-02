var app=function(){"use strict";function e(){}const t=e=>e;function n(e){return e()}function r(){return Object.create(null)}function o(e){e.forEach(n)}function s(e){return"function"==typeof e}function a(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}const i="undefined"!=typeof window;let c=i?()=>window.performance.now():()=>Date.now(),l=i?e=>requestAnimationFrame(e):e;const u=new Set;function f(e){u.forEach((t=>{t.c(e)||(u.delete(t),t.f())})),0!==u.size&&l(f)}function p(e,t){e.appendChild(t)}function d(e,t,n){e.insertBefore(t,n||null)}function m(e){e.parentNode.removeChild(e)}function g(e){return document.createElement(e)}function h(e){return document.createElementNS("http://www.w3.org/2000/svg",e)}function v(e){return document.createTextNode(e)}function w(){return v(" ")}function b(e,t,n,r){return e.addEventListener(t,n,r),()=>e.removeEventListener(t,n,r)}function y(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function x(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function _(e,t,n,r){e.style.setProperty(t,n,r?"important":"")}function $(e,t,n){e.classList[n?"add":"remove"](t)}const j=new Set;let E,k=0;function F(e,t,n,r,o,s,a,i=0){const c=16.666/r;let l="{\n";for(let e=0;e<=1;e+=c){const r=t+(n-t)*s(e);l+=100*e+`%{${a(r,1-r)}}\n`}const u=l+`100% {${a(n,1-n)}}\n}`,f=`__svelte_${function(e){let t=5381,n=e.length;for(;n--;)t=(t<<5)-t^e.charCodeAt(n);return t>>>0}(u)}_${i}`,p=e.ownerDocument;j.add(p);const d=p.__svelte_stylesheet||(p.__svelte_stylesheet=p.head.appendChild(g("style")).sheet),m=p.__svelte_rules||(p.__svelte_rules={});m[f]||(m[f]=!0,d.insertRule(`@keyframes ${f} ${u}`,d.cssRules.length));const h=e.style.animation||"";return e.style.animation=`${h?`${h}, `:""}${f} ${r}ms linear ${o}ms 1 both`,k+=1,f}function L(e,t){const n=(e.style.animation||"").split(", "),r=n.filter(t?e=>e.indexOf(t)<0:e=>-1===e.indexOf("__svelte")),o=n.length-r.length;o&&(e.style.animation=r.join(", "),k-=o,k||l((()=>{k||(j.forEach((e=>{const t=e.__svelte_stylesheet;let n=t.cssRules.length;for(;n--;)t.deleteRule(n);e.__svelte_rules={}})),j.clear())})))}function C(e){E=e}const P=[],S=[],T=[],O=[],A=Promise.resolve();let N=!1;function q(e){T.push(e)}let B=!1;const z=new Set;function M(){if(!B){B=!0;do{for(let e=0;e<P.length;e+=1){const t=P[e];C(t),R(t.$$)}for(C(null),P.length=0;S.length;)S.pop()();for(let e=0;e<T.length;e+=1){const t=T[e];z.has(t)||(z.add(t),t())}T.length=0}while(P.length);for(;O.length;)O.pop()();N=!1,B=!1,z.clear()}}function R(e){if(null!==e.fragment){e.update(),o(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(q)}}let D;function G(e,t,n){e.dispatchEvent(function(e,t){const n=document.createEvent("CustomEvent");return n.initCustomEvent(e,!1,!1,t),n}(`${t?"intro":"outro"}${n}`))}const U=new Set;let W;function H(){W={r:0,c:[],p:W}}function V(){W.r||o(W.c),W=W.p}function X(e,t){e&&e.i&&(U.delete(e),e.i(t))}function I(e,t,n,r){if(e&&e.o){if(U.has(e))return;U.add(e),W.c.push((()=>{U.delete(e),r&&(n&&e.d(1),r())})),e.o(t)}}const Y={duration:0};function Z(n,r,a,i){let p=r(n,a),d=i?0:1,m=null,g=null,h=null;function v(){h&&L(n,h)}function w(e,t){const n=e.b-d;return t*=Math.abs(n),{a:d,b:e.b,d:n,duration:t,start:e.start,end:e.start+t,group:e.group}}function b(r){const{delay:s=0,duration:a=300,easing:i=t,tick:b=e,css:y}=p||Y,x={start:c()+s,b:r};r||(x.group=W,W.r+=1),m||g?g=x:(y&&(v(),h=F(n,d,r,a,s,i,y)),r&&b(0,1),m=w(x,a),q((()=>G(n,r,"start"))),function(e){let t;0===u.size&&l(f),new Promise((n=>{u.add(t={c:e,f:n})}))}((e=>{if(g&&e>g.start&&(m=w(g,a),g=null,G(n,m.b,"start"),y&&(v(),h=F(n,d,m.b,m.duration,0,i,p.css))),m)if(e>=m.end)b(d=m.b,1-d),G(n,m.b,"end"),g||(m.b?v():--m.group.r||o(m.group.c)),m=null;else if(e>=m.start){const t=e-m.start;d=m.a+m.d*i(t/m.duration),b(d,1-d)}return!(!m&&!g)})))}return{run(e){s(p)?(D||(D=Promise.resolve(),D.then((()=>{D=null}))),D).then((()=>{p=p(),b(e)})):b(e)},end(){v(),m=g=null}}}function J(e){e&&e.c()}function K(e,t,r){const{fragment:a,on_mount:i,on_destroy:c,after_update:l}=e.$$;a&&a.m(t,r),q((()=>{const t=i.map(n).filter(s);c?c.push(...t):o(t),e.$$.on_mount=[]})),l.forEach(q)}function Q(e,t){const n=e.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function ee(e,t){-1===e.$$.dirty[0]&&(P.push(e),N||(N=!0,A.then(M)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function te(t,n,s,a,i,c,l=[-1]){const u=E;C(t);const f=n.props||{},p=t.$$={fragment:null,ctx:null,props:c,update:e,not_equal:i,bound:r(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:r(),dirty:l,skip_bound:!1};let d=!1;if(p.ctx=s?s(t,f,((e,n,...r)=>{const o=r.length?r[0]:n;return p.ctx&&i(p.ctx[e],p.ctx[e]=o)&&(!p.skip_bound&&p.bound[e]&&p.bound[e](o),d&&ee(t,e)),n})):[],p.update(),d=!0,o(p.before_update),p.fragment=!!a&&a(p.ctx),n.target){if(n.hydrate){const e=function(e){return Array.from(e.childNodes)}(n.target);p.fragment&&p.fragment.l(e),e.forEach(m)}else p.fragment&&p.fragment.c();n.intro&&X(t.$$.fragment),K(t,n.target,n.anchor),M()}C(u)}class ne{$destroy(){Q(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const re=["3dotstr","4xm","aa","aac","ac3","acm","act","adf","adp","ads","adx","aea","afc","aiff","aix","alaw","alias_pix","alp","amr","amrnb","amrwb","anm","apc","ape","apm","apng","aptx","aptx_hd","aqtitle","argo_asf","asf","asf_o","ass","ast","au","av1","avi","avr","avs","avs2","bethsoftvid","bfi","bfstm","bin","bink","bit","bmp_pipe","bmv","boa","brender_pix","brstm","c93","caf","cavsvideo","cdg","cdx1","cine","codec2","codec2raw","concat","data","daud","dcstr","dds_pipe","defg","dfa","dhav","dirac","dnxhd","dpx_pipe","dsf","dsicin","dss","dts","dtshd","dv","dvbsub","dvbtxt","dxa","ea","ea_cdata","eac3","epaf","exr_pipe","f32be","f32le","f64be","f64le","ffmetadata","film_cpk","filmstrip","fits","flac","flic","flv","frm","fsb","fwse","g722","g723_1","g726","g7261e","g729","gdv","genh","gif","gif_pipe","gsm","gxf","h261","h263","h264","hca","hcom","hevc","hls","hnm","ico","idcin","idf","iff","ifv","ilbc","image2","image2pipe","ingenient","ipmovie","ircam","iss","iv8","ivf","ivr","j2k_pipe","jacosub","jpeg_pipe","jpegls_pipe","jv","kux","kvag","lavfi","live_flv","lmlm4","loas","lrc","lvf","lxv","m4v","mkv","webm","mgsts","microdvd","mjpeg","mjpeg_2000","mlp","mlv","mm","mmf","mov","mp4","m4a","3gp","3g2","mj2","mp3","mpc","mpc8","mpeg","mpegts","mpegtsraw","mpegvideo","mpjpeg","mp12","mpsub","msf","msnwctcp","mtaf","mtv","mulaw","musx","mv","mvi","mxf","mxg","nc","nistsphere","nsp","nsv","nut","nuv","ogg","oma","paf","pam_pipe","pbm_pipe","pcx_pipe","pbm_pipe","pgmyuv_pipe","pictor_pipe","pjs","pmp","png_pipe","pp_bnk","ppm_pipe","psd_pipe","psxstr","pva","pvf","qcp","qdraw_pipe","r2d","rawvideo","realtext","redspark","rl2","rm","roq","rpl","rsd","rso","rtp","rtsp","s16be","s16le","s24be","s24le","s32be","s32le","s337m","s8","sami","sap","sbc","sbg","scc","sdp","sdr2","sds","sdx","ser","sgi_pipe","shn","siff","sln","smjpeg","smk","smush","sol","sox","spdif","srt","stl","subviewer","subviewer1","sunrast_pipe","sup","svag","svg_pipe","swf","tak","tedcaptions","thp","tiertexseq","tiff_pipe","tmv","truehd","tta","tty","txd","ty","u16be","u16le","u24be","u24le","u32be","u32le","u8","v210","v210x","vag","vc1","vc1test","vidc","vividas","vivo","vmd","vobsub","voc","vpk","vplayer","vqf","w64","wav","wc3movie","webm_dash_manifest","webp_pipe","webvtt","wsaud","wsd","wsvqa","wtv","wv","wve","xa","xbin","xmv","xpm_pipe","xvag","xwd_pipe","xwma","yop","yuv4mpegpipe"].map((e=>`.${e}`)),oe=["3g2","3gp","a64","ac3","adts","adx","aiff","alaw","amr","apng","aptx","aptx_hd","asf","asf_stream","ass","ast","au","avi","avm2","avs2","bit","caf","cavsvideo","codec2","codec2raw","crc","dash","data","daud","dirac","dnxhd","dts","dv","dvd","eac3","f32be","f32le","f4v","f64be","f64le","ffmetadata","fifo","fifo_test","film_cpk","filmstrip","fits","flac","flv","framecrc","framehash","framemd5","g722","g723_1","g726","g726le","gif","gsm","gxf","h261","h263","h264","hash","hds","hevc","hls","ico","ilbc","image2","image2pipe","ipod","ircam","ismv","ivf","jacosub","kvag","latm","lrc","m4v","mkv","md5","microdvd","mjpeg","mkvtimestampe_v2","mlp","mmf","mov","mp2","mp3","mp4","mpeg","mpeg1video","mpeg2video","mpegts","mpjpeg","mulaw","mxf","mxf_d10","mxf_opatom","null","nut","oga","ogg","ogv","oma","opus","psp","rawvideo","rm","roq","rso","rtp","rtp_mpegts","rtsp","s16be","s16le","s24be","s24le","s32be","s32le","s8","sap","sbc","scc","segment","singlejpeg","smjpeg","smoothstreaming","sox","spdif","spx","srt","stream_segment","ssegment","streamhash","sup","svcd","swf","tee","truehd","tta","u16be","u16le","u24be","u24le","u32be","u32le","u8","uncodedframecrc","vc1","vc1test","vcd","vidc","vob","voc","w64","wav","webm","webm_chunk","webm_dash_manifest","webp","webvtt","wtv","wv","yuv4mpegpipe"].map((e=>`.${e}`)),se=[];function ae(t,n=e){let r;const o=[];function s(e){if(a(t,e)&&(t=e,r)){const e=!se.length;for(let e=0;e<o.length;e+=1){const n=o[e];n[1](),se.push(n,t)}if(e){for(let e=0;e<se.length;e+=2)se[e][0](se[e+1]);se.length=0}}}return{set:s,update:function(e){s(e(t))},subscribe:function(a,i=e){const c=[a,i];return o.push(c),1===o.length&&(r=n(s)||e),a(t),()=>{const e=o.indexOf(c);-1!==e&&o.splice(e,1),0===o.length&&(r(),r=null)}}}}const ie=ae({}),ce=ae(".mp4"),le=ae(""),ue=ae("");function fe(e,t,n){const r=e.slice();return r[0]=t[n],r}function pe(t){let n;return{c(){n=g("span"),n.innerHTML="Drop your file here or <b>browse</b>",y(n,"class","svelte-fo5jrn")},m(e,t){d(e,n,t)},p:e,d(e){e&&m(n)}}}function de(e){let t,n;return{c(){t=g("span"),n=v(e[2]),y(t,"class","error-message svelte-fo5jrn")},m(e,r){d(e,t,r),p(t,n)},p(e,t){4&t&&x(n,e[2])},d(e){e&&m(t)}}}function me(e){let t,n;return{c(){t=g("span"),n=v(e[1]),y(t,"class","svelte-fo5jrn")},m(e,r){d(e,t,r),p(t,n)},p(e,t){2&t&&x(n,e[1])},d(e){e&&m(t)}}}function ge(e){let t,n;return{c(){t=g("span"),n=v(e[3]),y(t,"class","error-message svelte-fo5jrn")},m(e,r){d(e,t,r),p(t,n)},p(e,t){8&t&&x(n,e[3])},d(e){e&&m(t)}}}function he(e){let t,n,r=e[0]+"";return{c(){t=g("li"),n=v(r),y(t,"class","disabled svelte-fo5jrn")},m(e,r){d(e,t,r),p(t,n)},p(e,t){64&t&&r!==(r=e[0]+"")&&x(n,r)},d(e){e&&m(t)}}}function ve(e){let t,n,r,o,s,a=e[0]+"";return{c(){t=g("li"),n=v(a),y(t,"data-format",r=e[0]),y(t,"class","svelte-fo5jrn")},m(r,a){d(r,t,a),p(t,n),o||(s=b(t,"mousedown",e[15]),o=!0)},p(e,o){64&o&&a!==(a=e[0]+"")&&x(n,a),64&o&&r!==(r=e[0])&&y(t,"data-format",r)},d(e){e&&m(t),o=!1,s()}}}function we(e){let t,n;function r(e,n){return(null==t||64&n)&&(t=!!e[0].includes(".")),t?ve:he}let o=r(e,-1),s=o(e);return{c(){s.c(),n=v("")},m(e,t){s.m(e,t),d(e,n,t)},p(e,t){o===(o=r(e,t))&&s?s.p(e,t):(s.d(1),s=o(e),s&&(s.c(),s.m(n.parentNode,n)))},d(e){s.d(e),e&&m(n)}}}function be(t){let n,r,s,a,i,c,l,u,f,h,v,x,_,j,E,k,F,L,C,P,S;function T(e,t){return e[1]?me:e[2]?de:pe}let O=T(t),A=O(t),N=t[3]&&ge(t),q=t[6],B=[];for(let e=0;e<q.length;e+=1)B[e]=we(fe(t,q,e));return{c(){n=g("section"),r=g("div"),s=g("div"),a=g("input"),c=w(),l=g("label"),A.c(),u=w(),f=g("span"),f.textContent="File size limit: 2 GB",v=w(),x=g("div"),N&&N.c(),_=w(),j=g("form"),E=g("input"),k=w(),F=g("div"),F.innerHTML='<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 -60 512 512" width="20px" height="30px" xml:space="preserve"><g><g><path d="M505.752,123.582c-8.331-8.331-21.839-8.331-30.17,0L256,343.163L36.418,123.582c-8.331-8.331-21.839-8.331-30.17,0\n                s-8.331,21.839,0,30.17l234.667,234.667c8.331,8.331,21.839,8.331,30.17,0l234.667-234.667\n                C514.083,145.42,514.083,131.913,505.752,123.582z"></path></g></g></svg>',L=w(),C=g("ul");for(let e=0;e<B.length;e+=1)B[e].c();y(a,"id","file-input"),y(a,"type","file"),y(a,"accept",i=re.join(", ")),y(a,"class","svelte-fo5jrn"),y(f,"class","file-size-limit svelte-fo5jrn"),y(l,"for","file-input"),y(l,"class","svelte-fo5jrn"),y(s,"class","file-upload-wrapper svelte-fo5jrn"),y(s,"onanimationend",h=ye),$(s,"animate__shakeX",t[2]),$(s,"highlight",t[4]),y(r,"class","file-upload-container svelte-fo5jrn"),y(E,"type","text"),E.value=t[0],y(E,"class","svelte-fo5jrn"),y(F,"class","svelte-fo5jrn"),$(F,"flipped",t[5]),y(j,"class","searchable-dropdown svelte-fo5jrn"),y(C,"class","svelte-fo5jrn"),$(C,"open",t[5]),y(x,"class","dropdown-container svelte-fo5jrn"),$(x,"animate__shakeX",t[3]),y(n,"class","input-container svelte-fo5jrn")},m(e,o){d(e,n,o),p(n,r),p(r,s),p(s,a),p(s,c),p(s,l),A.m(l,null),p(l,u),p(l,f),p(n,v),p(n,x),N&&N.m(x,null),p(x,_),p(x,j),p(j,E),p(j,k),p(j,F),p(x,L),p(x,C);for(let e=0;e<B.length;e+=1)B[e].m(C,null);P||(S=[b(a,"change",t[11]),b(s,"dragenter",t[7]),b(s,"dragleave",t[9]),b(s,"dragover",t[8]),b(s,"drop",t[10]),b(E,"input",t[12]),b(E,"focus",t[13]),b(E,"blur",t[14]),b(F,"click",t[17]),b(j,"submit",t[14])],P=!0)},p(e,[t]){if(O===(O=T(e))&&A?A.p(e,t):(A.d(1),A=O(e),A&&(A.c(),A.m(l,u))),4&t&&$(s,"animate__shakeX",e[2]),16&t&&$(s,"highlight",e[4]),e[3]?N?N.p(e,t):(N=ge(e),N.c(),N.m(x,_)):N&&(N.d(1),N=null),1&t&&E.value!==e[0]&&(E.value=e[0]),32&t&&$(F,"flipped",e[5]),32832&t){let n;for(q=e[6],n=0;n<q.length;n+=1){const r=fe(e,q,n);B[n]?B[n].p(r,t):(B[n]=we(r),B[n].c(),B[n].m(C,null))}for(;n<B.length;n+=1)B[n].d(1);B.length=q.length}32&t&&$(C,"open",e[5]),8&t&&$(x,"animate__shakeX",e[3])},i:e,o:e,d(e){e&&m(n),A.d(),N&&N.d(),function(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}(B,e),P=!1,o(S)}}}const ye=e=>e.currentTarget.classList.remove("animate__shakeX");function xe(e,t,n){let r,o,s,a;ce.subscribe((e=>n(0,a=e))),le.subscribe((e=>{n(2,o=e)})),ue.subscribe((e=>{n(3,s=e)})),ie.subscribe((e=>{n(1,r=e.name)}));let i,c=!1,l=a;const u=[".mp4",".mov",".flv",".avi",".webm",".mkv",".gif",".mp3"],f=oe.filter((e=>!u.includes(e))),p=e=>{n(4,c=!0),e.preventDefault(),e.stopPropagation()},d=e=>{n(4,c=!1),e.preventDefault(),e.stopPropagation()},m=e=>{if(!e)return;const t=e.name.split(".");"video"===e.type.split("/")[0]&&re.includes(`.${t[t.length-1]}`)?e.size/1024/1024/1024>=2?(le.set("Error: File exceeded 2GB size limit"),ie.set({})):(le.set(""),ie.set(e)):(le.set("Error: Invalid file type"),ie.set({}))};let g;return e.$$.update=()=>{65536&e.$$.dirty&&n(6,g=["Common",...u,"Other",...f].filter((e=>e.includes(l))))},[a,r,o,s,c,i,g,e=>{p(e)},e=>{p(e)},e=>{d(e)},e=>{d(e);const t=e.dataTransfer.files?.item(0);m(t)},e=>{const t=e.currentTarget.files?.item(0);m(t)},e=>{n(16,l=e.currentTarget.value),ue.set("")},()=>{n(5,i=!0)},e=>{e.preventDefault(),[...f,...u].includes(l)?(n(5,i=!1),ce.set(l)):(n(5,i=!0),ue.set("Not a valid file format"))},e=>{ue.set(""),n(16,l=e.currentTarget.dataset.format),ce.set(e.currentTarget.dataset.format),n(5,i=!1)},l,()=>n(5,i=!i)]}class _e extends ne{constructor(e){super(),te(this,e,xe,be,a,{})}}"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self;function $e(e,t,n){return e(n={path:t,exports:{},require:function(e,t){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==t&&n.path)}},n.exports),n.exports}$e((function(e){var t=function(e){var t,n=Object.prototype,r=n.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},s=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",i=o.toStringTag||"@@toStringTag";function c(e,t,n){return Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{c({},"")}catch(e){c=function(e,t,n){return e[t]=n}}function l(e,t,n,r){var o=t&&t.prototype instanceof h?t:h,s=Object.create(o.prototype),a=new L(r||[]);return s._invoke=function(e,t,n){var r=f;return function(o,s){if(r===d)throw new Error("Generator is already running");if(r===m){if("throw"===o)throw s;return P()}for(n.method=o,n.arg=s;;){var a=n.delegate;if(a){var i=E(a,n);if(i){if(i===g)continue;return i}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(r===f)throw r=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r=d;var c=u(e,t,n);if("normal"===c.type){if(r=n.done?m:p,c.arg===g)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(r=m,n.method="throw",n.arg=c.arg)}}}(e,n,a),s}function u(e,t,n){try{return{type:"normal",arg:e.call(t,n)}}catch(e){return{type:"throw",arg:e}}}e.wrap=l;var f="suspendedStart",p="suspendedYield",d="executing",m="completed",g={};function h(){}function v(){}function w(){}var b={};b[s]=function(){return this};var y=Object.getPrototypeOf,x=y&&y(y(C([])));x&&x!==n&&r.call(x,s)&&(b=x);var _=w.prototype=h.prototype=Object.create(b);function $(e){["next","throw","return"].forEach((function(t){c(e,t,(function(e){return this._invoke(t,e)}))}))}function j(e,t){function n(o,s,a,i){var c=u(e[o],e,s);if("throw"!==c.type){var l=c.arg,f=l.value;return f&&"object"==typeof f&&r.call(f,"__await")?t.resolve(f.__await).then((function(e){n("next",e,a,i)}),(function(e){n("throw",e,a,i)})):t.resolve(f).then((function(e){l.value=e,a(l)}),(function(e){return n("throw",e,a,i)}))}i(c.arg)}var o;this._invoke=function(e,r){function s(){return new t((function(t,o){n(e,r,t,o)}))}return o=o?o.then(s,s):s()}}function E(e,n){var r=e.iterator[n.method];if(r===t){if(n.delegate=null,"throw"===n.method){if(e.iterator.return&&(n.method="return",n.arg=t,E(e,n),"throw"===n.method))return g;n.method="throw",n.arg=new TypeError("The iterator does not provide a 'throw' method")}return g}var o=u(r,e.iterator,n.arg);if("throw"===o.type)return n.method="throw",n.arg=o.arg,n.delegate=null,g;var s=o.arg;return s?s.done?(n[e.resultName]=s.value,n.next=e.nextLoc,"return"!==n.method&&(n.method="next",n.arg=t),n.delegate=null,g):s:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,g)}function k(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function F(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function L(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(k,this),this.reset(!0)}function C(e){if(e){var n=e[s];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function n(){for(;++o<e.length;)if(r.call(e,o))return n.value=e[o],n.done=!1,n;return n.value=t,n.done=!0,n};return a.next=a}}return{next:P}}function P(){return{value:t,done:!0}}return v.prototype=_.constructor=w,w.constructor=v,v.displayName=c(w,i,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===v||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,w):(e.__proto__=w,c(e,i,"GeneratorFunction")),e.prototype=Object.create(_),e},e.awrap=function(e){return{__await:e}},$(j.prototype),j.prototype[a]=function(){return this},e.AsyncIterator=j,e.async=function(t,n,r,o,s){void 0===s&&(s=Promise);var a=new j(l(t,n,r,o),s);return e.isGeneratorFunction(n)?a:a.next().then((function(e){return e.done?e.value:a.next()}))},$(_),c(_,i,"Generator"),_[s]=function(){return this},_.toString=function(){return"[object Generator]"},e.keys=function(e){var t=[];for(var n in e)t.push(n);return t.reverse(),function n(){for(;t.length;){var r=t.pop();if(r in e)return n.value=r,n.done=!1,n}return n.done=!0,n}},e.values=C,L.prototype={constructor:L,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(F),!e)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=t)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var n=this;function o(r,o){return i.type="throw",i.arg=e,n.next=r,o&&(n.method="next",n.arg=t),!!o}for(var s=this.tryEntries.length-1;s>=0;--s){var a=this.tryEntries[s],i=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var c=r.call(a,"catchLoc"),l=r.call(a,"finallyLoc");if(c&&l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var s=o;break}}s&&("break"===e||"continue"===e)&&s.tryLoc<=t&&t<=s.finallyLoc&&(s=null);var a=s?s.completion:{};return a.type=e,a.arg=t,s?(this.method="next",this.next=s.finallyLoc,g):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),g},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.finallyLoc===e)return this.complete(n.completion,n.afterLoc),F(n),g}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.tryLoc===e){var r=n.completion;if("throw"===r.type){var o=r.arg;F(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,n,r){return this.delegate={iterator:C(e),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=t),g}},e}(e.exports);try{regeneratorRuntime=t}catch(e){Function("r","regeneratorRuntime = r")(t)}}));let je=!1,Ee=()=>{};var ke={logging:je,setLogging:e=>{je=e},setCustomLogger:e=>{Ee=e},log:(e,t)=>{Ee({type:e,message:t}),je&&console.log(`[${e}] ${t}`)}};let Fe=0;const Le=e=>{const[t,n,r]=e.split(":");return 60*parseFloat(t)*60+60*parseFloat(n)+parseFloat(r)};var Ce=$e((function(e,t){e.exports=function(){function e(){var e=arguments.length;if(0===e)throw new Error("resolveUrl requires at least one argument; got none.");var t=document.createElement("base");if(t.href=arguments[0],1===e)return t.href;var n=document.getElementsByTagName("head")[0];n.insertBefore(t,n.firstChild);for(var r,o=document.createElement("a"),s=1;s<e;s++)o.href=arguments[s],r=o.href,t.href=r;return n.removeChild(t),r}return e}()})),Pe={_from:"@ffmpeg/ffmpeg",_id:"@ffmpeg/ffmpeg@0.9.6",_inBundle:!1,_integrity:"sha512-ov5FAV3dHRJ/+ZxQH9V5GvY/iczwq5vrKWeu4tpytxZewTSAhZ1aKD/sFBzd79nQNF+CTktxUp3LWuGECXBNeA==",_location:"/@ffmpeg/ffmpeg",_phantomChildren:{},_requested:{type:"tag",registry:!0,raw:"@ffmpeg/ffmpeg",name:"@ffmpeg/ffmpeg",escapedName:"@ffmpeg%2fffmpeg",scope:"@ffmpeg",rawSpec:"",saveSpec:null,fetchSpec:"latest"},_requiredBy:["#USER","/"],_resolved:"https://registry.npmjs.org/@ffmpeg/ffmpeg/-/ffmpeg-0.9.6.tgz",_shasum:"b44fa1ab34dd860785bb7c317dbfbe8b9ded7036",_spec:"@ffmpeg/ffmpeg",_where:"/home/dowinterfor6/linux_documents/video-converter",author:{name:"Jerome Wu",email:"jeromewus@gmail.com"},browser:{"./src/node/index.js":"./src/browser/index.js"},bugs:{url:"https://github.com/ffmpegwasm/ffmpeg.wasm/issues"},bundleDependencies:!1,dependencies:{"is-url":"^1.2.4","node-fetch":"^2.6.1","regenerator-runtime":"^0.13.7","resolve-url":"^0.2.1"},deprecated:!1,description:"FFmpeg WebAssembly version",devDependencies:{"@babel/core":"^7.12.3","@babel/preset-env":"^7.12.1","@ffmpeg/core":"^0.8.5","@types/emscripten":"^1.39.4","babel-loader":"^8.1.0",chai:"^4.2.0",cors:"^2.8.5",eslint:"^7.12.1","eslint-config-airbnb-base":"^14.1.0","eslint-plugin-import":"^2.22.1",express:"^4.17.1",mocha:"^8.2.1","mocha-headless-chrome":"^2.0.3","npm-run-all":"^4.1.5","wait-on":"^5.2.0",webpack:"^5.3.2","webpack-cli":"^4.1.0","webpack-dev-middleware":"^4.0.0"},directories:{example:"examples"},engines:{node:">=12.16.1"},homepage:"https://github.com/ffmpegwasm/ffmpeg.wasm#readme",keywords:["ffmpeg","WebAssembly","video"],license:"MIT",main:"src/index.js",name:"@ffmpeg/ffmpeg",repository:{type:"git",url:"git+https://github.com/ffmpegwasm/ffmpeg.wasm.git"},scripts:{build:"rimraf dist && webpack --config scripts/webpack.config.prod.js",lint:"eslint src",prepublishOnly:"npm run build",start:"node scripts/server.js",test:"npm-run-all -p -r start test:all","test:all":"npm-run-all wait test:browser:ffmpeg test:node:all","test:browser":"mocha-headless-chrome -a allow-file-access-from-files -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000","test:browser:ffmpeg":"npm run test:browser -- -f ./tests/ffmpeg.test.html","test:node":"node --experimental-wasm-threads --experimental-wasm-bulk-memory node_modules/.bin/_mocha --exit --bail --require ./scripts/test-helper.js","test:node:all":"npm run test:node -- ./tests/*.test.js",wait:"rimraf dist && wait-on http://localhost:3000/dist/ffmpeg.dev.js"},types:"src/index.d.ts",version:"0.9.6"};const{devDependencies:Se}=Pe;var Te={corePath:"undefined"!=typeof process&&"development"===process.env.FFMPEG_ENV?Ce("/node_modules/@ffmpeg/core/dist/ffmpeg-core.js"):`https://unpkg.com/@ffmpeg/core@${Se["@ffmpeg/core"].substring(1)}/dist/ffmpeg-core.js`};const{log:Oe}=ke,Ae=async(e,t)=>{Oe("info",`fetch ${e}`);const n=await(await fetch(e)).arrayBuffer();Oe("info",`${e} file size = ${n.byteLength} bytes`);const r=new Blob([n],{type:t}),o=URL.createObjectURL(r);return Oe("info",`${e} blob URL = ${o}`),o};var Ne={defaultOptions:Te,getCreateFFmpegCore:async({corePath:e})=>{if("string"!=typeof e)throw Error("corePath should be a string!");const t=Ce(e),n=await Ae(t,"application/javascript"),r=await Ae(t.replace("ffmpeg-core.js","ffmpeg-core.wasm"),"application/wasm"),o=await Ae(t.replace("ffmpeg-core.js","ffmpeg-core.worker.js"),"application/javascript");return"undefined"==typeof createFFmpegCore?new Promise((e=>{const t=document.createElement("script"),s=()=>{t.removeEventListener("load",s),Oe("info","ffmpeg-core.js script loaded"),e({createFFmpegCore:createFFmpegCore,corePath:n,wasmPath:r,workerPath:o})};t.src=n,t.type="text/javascript",t.addEventListener("load",s),document.getElementsByTagName("head")[0].appendChild(t)})):(Oe("info","ffmpeg-core.js script is loaded already"),Promise.resolve({createFFmpegCore:createFFmpegCore,corePath:n,wasmPath:r,workerPath:o}))},fetchFile:async e=>{let t=e;if(void 0===e)return new Uint8Array;if("string"==typeof e)if(/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(e))t=atob(e.split(",")[1]).split("").map((e=>e.charCodeAt(0)));else{const n=await fetch(Ce(e));t=await n.arrayBuffer()}else(e instanceof File||e instanceof Blob)&&(t=await(n=e,new Promise(((e,t)=>{const r=new FileReader;r.onload=()=>{e(r.result)},r.onerror=({target:{error:{code:e}}})=>{t(Error(`File could not be read! Code=${e}`))},r.readAsArrayBuffer(n)}))));var n;return new Uint8Array(t)}};const{defaultArgs:qe,baseOptions:Be}={defaultArgs:["./ffmpeg","-nostdin","-y"],baseOptions:{log:!1,logger:()=>{},progress:()=>{},corePath:""}},{setLogging:ze,setCustomLogger:Me,log:Re}=ke,{defaultOptions:De,getCreateFFmpegCore:Ge}=Ne,{version:Ue}=Pe,We=Error("ffmpeg.wasm is not ready, make sure you have completed load().");const{fetchFile:He}=Ne;var Ve={createFFmpeg:(e={})=>{const{log:t,logger:n,progress:r,...o}={...Be,...De,...e};let s=null,a=null,i=null,c=!1,l=r;const u=({type:e,message:t})=>{Re(e,t),((e,t)=>{if("string"==typeof e)if(e.startsWith("  Duration")){const t=e.split(", ")[0].split(": ")[1],n=Le(t);(0===Fe||Fe>n)&&(Fe=n)}else if(e.startsWith("frame")){const n=e.split("time=")[1].split(" ")[0];t({ratio:Le(n)/Fe})}else e.startsWith("video:")&&(t({ratio:1}),Fe=0)})(t,l),(e=>{"FFMPEG_END"===e&&null!==i&&(i(),i=null,c=!1)})(t)};return ze(t),Me(n),Re("info",`use ffmpeg.wasm v${Ue}`),{setProgress:e=>{l=e},setLogger:e=>{Me(e)},setLogging:ze,load:async()=>{if(Re("info","load ffmpeg-core"),null!==s)throw Error("ffmpeg.wasm was loaded, you should not load it again, use ffmpeg.isLoaded() to check next time.");{Re("info","loading ffmpeg-core");const{createFFmpegCore:e,corePath:t,workerPath:n,wasmPath:r}=await Ge(o);s=await e({mainScriptUrlOrBlob:t,printErr:e=>u({type:"fferr",message:e}),print:e=>u({type:"ffout",message:e}),locateFile:(e,t)=>{if("undefined"!=typeof window){if(void 0!==r&&e.endsWith("ffmpeg-core.wasm"))return r;if(void 0!==n&&e.endsWith("ffmpeg-core.worker.js"))return n}return t+e}}),a=s.cwrap("proxy_main","number",["number","number"]),Re("info","ffmpeg-core loaded")}},isLoaded:()=>null!==s,run:(...e)=>{if(Re("info",`run ffmpeg command: ${e.join(" ")}`),null===s)throw We;if(c)throw Error("ffmpeg.wasm can only run one command at a time");return c=!0,new Promise((t=>{const n=[...qe,...e].filter((e=>0!==e.length));i=t,a(...((e,t)=>{const n=e._malloc(t.length*Uint32Array.BYTES_PER_ELEMENT);return t.forEach(((t,r)=>{const o=e._malloc(t.length+1);e.writeAsciiToMemory(t,o),e.setValue(n+Uint32Array.BYTES_PER_ELEMENT*r,o,"i32")})),[t.length,n]})(s,n))}))},FS:(e,...t)=>{if(Re("info",`run FS.${e} ${t.map((e=>"string"==typeof e?e:`<${e.length} bytes binary file>`)).join(" ")}`),null===s)throw We;{let n=null;try{n=s.FS[e](...t)}catch(n){throw"readdir"===e?Error(`ffmpeg.FS('readdir', '${t[0]}') error. Check if the path exists, ex: ffmpeg.FS('readdir', '/')`):"readFile"===e?Error(`ffmpeg.FS('readFile', '${t[0]}') error. Check if the path exists`):Error("Oops, something went wrong in FS operation.")}return n}}}},fetchFile:He};function Xe(e){return e<.5?4*e*e*e:.5*Math.pow(2*e-2,3)+1}function Ie(e,{delay:n=0,duration:r=400,easing:o=t}){const s=+getComputedStyle(e).opacity;return{delay:n,duration:r,easing:o,css:e=>"opacity: "+e*s}}function Ye(e,{delay:t=0,speed:n,duration:r,easing:o=Xe}){const s=e.getTotalLength();return void 0===r?r=void 0===n?800:s/n:"function"==typeof r&&(r=r(s)),{delay:t,duration:r,easing:o,css:(e,t)=>`stroke-dasharray: ${e*s} ${t*s}`}}function Ze(e){let t,n,r,o,s,a,i,c;return{c(){t=g("div"),n=g("span"),n.innerHTML='<div class="spinner svelte-q9r9cy"></div>\n    Converting...',r=w(),o=g("div"),s=g("div"),y(n,"class","svelte-q9r9cy"),y(s,"class","progress-bar svelte-q9r9cy"),y(s,"style",a=`width: ${e[0]}%`),y(o,"class","progress-bar-wrapper svelte-q9r9cy"),y(t,"class","progress-bar-container svelte-q9r9cy")},m(e,a){d(e,t,a),p(t,n),p(t,r),p(t,o),p(o,s),c=!0},p(e,[t]){(!c||1&t&&a!==(a=`width: ${e[0]}%`))&&y(s,"style",a)},i(e){c||(q((()=>{i||(i=Z(t,Ie,{duration:200,delay:400},!0)),i.run(1)})),c=!0)},o(e){i||(i=Z(t,Ie,{duration:200,delay:400},!1)),i.run(0),c=!1},d(e){e&&m(t),e&&i&&i.end()}}}function Je(e,t,n){let{progress:r}=t;return e.$$set=e=>{"progress"in e&&n(0,r=e.progress)},[r]}class Ke extends ne{constructor(e){super(),te(this,e,Je,Ze,a,{progress:0})}}function Qe(t){let n,r,o,s,a,i,c,l,u,f,v,x,$,j,E,k,F,L,C,P,S;return{c(){n=g("div"),r=g("div"),o=h("svg"),s=h("g"),a=h("g"),i=h("path"),l=h("g"),u=h("g"),f=h("path"),x=h("g"),$=h("g"),j=h("path"),k=w(),F=g("span"),F.textContent="Convert",y(i,"d","M472.897,124.269c-0.01-0.01-0.02-0.02-0.03-0.031l-0.017,0.017l-68.267-68.267c-6.78-6.548-17.584-6.36-24.132,0.42\n                c-6.388,6.614-6.388,17.099,0,23.713l39.151,39.151h-95.334c-65.948,0.075-119.391,53.518-119.467,119.467\n                c-0.056,47.105-38.228,85.277-85.333,85.333h-102.4C7.641,324.072,0,331.713,0,341.139s7.641,17.067,17.067,17.067h102.4\n                c65.948-0.075,119.391-53.518,119.467-119.467c0.056-47.105,38.228-85.277,85.333-85.333h95.334l-39.134,39.134\n                c-6.78,6.548-6.968,17.353-0.419,24.132c6.548,6.78,17.353,6.968,24.132,0.419c0.142-0.137,0.282-0.277,0.419-0.419l68.267-68.267\n                C479.54,141.748,479.553,130.942,472.897,124.269z"),y(i,"class","svelte-16vnudd"),y(f,"d","M472.897,329.069c-0.01-0.01-0.02-0.02-0.03-0.03l-0.017,0.017l-68.267-68.267c-6.78-6.548-17.584-6.36-24.132,0.42\n                c-6.388,6.614-6.388,17.099,0,23.712l39.151,39.151h-95.334c-20.996,0.015-41.258-7.721-56.9-21.726\n                c-7.081-6.222-17.864-5.525-24.086,1.555c-6.14,6.988-5.553,17.605,1.319,23.874c21.898,19.614,50.269,30.451,79.667,30.43h95.334\n                l-39.134,39.134c-6.78,6.548-6.968,17.352-0.42,24.132c6.548,6.78,17.352,6.968,24.132,0.42c0.142-0.138,0.282-0.277,0.42-0.42\n                l68.267-68.267C479.54,346.548,479.553,335.742,472.897,329.069z"),y(f,"class","svelte-16vnudd"),y(j,"d","M199.134,149.702c-21.898-19.614-50.269-30.451-79.667-30.43h-102.4C7.641,119.272,0,126.913,0,136.339\n                c0,9.426,7.641,17.067,17.067,17.067h102.4c20.996-0.015,41.258,7.721,56.9,21.726c7.081,6.222,17.864,5.525,24.086-1.555\n                C206.593,166.588,206.006,155.971,199.134,149.702z"),y(j,"class","svelte-16vnudd"),y(o,"version","1.1"),y(o,"id","Capa_1"),y(o,"xmlns","http://www.w3.org/2000/svg"),y(o,"xmlns:xlink","http://www.w3.org/1999/xlink"),y(o,"x","0px"),y(o,"y","0px"),y(o,"width","30px"),y(o,"height","30px"),_(o,"enable-background","new 0 0 75.716 75.716"),y(o,"xml:space","preserve"),y(o,"viewBox","150 70 350 350"),y(o,"class","svelte-16vnudd"),y(r,"class","svelte-16vnudd"),y(F,"class","svelte-16vnudd"),y(n,"class","convert-container svelte-16vnudd")},m(e,c){d(e,n,c),p(n,r),p(r,o),p(o,s),p(s,a),p(a,i),p(o,l),p(l,u),p(u,f),p(o,x),p(x,$),p($,j),p(n,k),p(n,F),C=!0,P||(S=b(n,"click",t[7]),P=!0)},p:e,i(e){C||(q((()=>{c||(c=Z(i,Ye,{duration:1e3},!0)),c.run(1)})),q((()=>{v||(v=Z(f,Ye,{duration:1e3},!0)),v.run(1)})),q((()=>{E||(E=Z(j,Ye,{duration:1e3},!0)),E.run(1)})),q((()=>{L||(L=Z(n,Ie,{duration:200,delay:400},!0)),L.run(1)})),C=!0)},o(e){c||(c=Z(i,Ye,{duration:1e3},!1)),c.run(0),v||(v=Z(f,Ye,{duration:1e3},!1)),v.run(0),E||(E=Z(j,Ye,{duration:1e3},!1)),E.run(0),L||(L=Z(n,Ie,{duration:200,delay:400},!1)),L.run(0),C=!1},d(e){e&&m(n),e&&c&&c.end(),e&&v&&v.end(),e&&E&&E.end(),e&&L&&L.end(),P=!1,S()}}}function et(e){let t,n,r;function o(t){e[14].call(null,t)}let s={};return void 0!==e[4]&&(s.progress=e[4]),t=new Ke({props:s}),S.push((()=>function(e,t,n){const r=e.$$.props[t];void 0!==r&&(e.$$.bound[r]=n,n(e.$$.ctx[r]))}(t,"progress",o))),{c(){J(t.$$.fragment)},m(e,n){K(t,e,n),r=!0},p(e,r){const o={};var s;!n&&16&r&&(n=!0,o.progress=e[4],s=()=>n=!1,O.push(s)),t.$set(o)},i(e){r||(X(t.$$.fragment,e),r=!0)},o(e){I(t.$$.fragment,e),r=!1},d(e){Q(t,e)}}}function tt(e){let t,n,r,o,s,a,i,c,l,u,f,v,b,x,$,j;return{c(){t=g("a"),n=g("div"),r=h("svg"),o=h("g"),s=h("g"),a=h("path"),c=h("g"),l=h("g"),u=h("path"),v=w(),b=g("span"),b.textContent="Download",y(a,"d","M382.56,233.376C379.968,227.648,374.272,224,368,224h-64V16c0-8.832-7.168-16-16-16h-64c-8.832,0-16,7.168-16,16v208h-64\n                c-6.272,0-11.968,3.68-14.56,9.376c-2.624,5.728-1.6,12.416,2.528,17.152l112,128c3.04,3.488,7.424,5.472,12.032,5.472\n                c4.608,0,8.992-2.016,12.032-5.472l112-128C384.192,245.824,385.152,239.104,382.56,233.376z"),y(a,"class","svelte-16vnudd"),y(u,"d","M432,352v96H80v-96H16v128c0,17.696,14.336,32,32,32h416c17.696,0,32-14.304,32-32V352H432z"),y(u,"class","svelte-16vnudd"),y(r,"version","1.1"),y(r,"id","Capa_1"),y(r,"xmlns","http://www.w3.org/2000/svg"),y(r,"xmlns:xlink","http://www.w3.org/1999/xlink"),y(r,"x","0px"),y(r,"y","0px"),y(r,"viewBox","0 10 500 500"),_(r,"enable-background","new 0 0 512 512"),y(r,"xml:space","preserve"),y(r,"width","30px"),y(r,"height","30px"),y(r,"class","svelte-16vnudd"),y(n,"class","svelte-16vnudd"),y(b,"class","svelte-16vnudd"),y(t,"href",e[2]),y(t,"download",x=`${e[0].name?.split(".")[0]}${e[1]}`),y(t,"class","download-container svelte-16vnudd")},m(e,i){d(e,t,i),p(t,n),p(n,r),p(r,o),p(o,s),p(s,a),p(r,c),p(c,l),p(l,u),p(t,v),p(t,b),j=!0},p(e,n){(!j||4&n)&&y(t,"href",e[2]),(!j||3&n&&x!==(x=`${e[0].name?.split(".")[0]}${e[1]}`))&&y(t,"download",x)},i(e){j||(q((()=>{i||(i=Z(a,Ye,{duration:1e3},!0)),i.run(1)})),q((()=>{f||(f=Z(u,Ye,{duration:1e3},!0)),f.run(1)})),q((()=>{$||($=Z(t,Ie,{duration:200,delay:400},!0)),$.run(1)})),j=!0)},o(e){i||(i=Z(a,Ye,{duration:1e3},!1)),i.run(0),f||(f=Z(u,Ye,{duration:1e3},!1)),f.run(0),$||($=Z(t,Ie,{duration:200,delay:400},!1)),$.run(0),j=!1},d(e){e&&m(t),e&&i&&i.end(),e&&f&&f.end(),e&&$&&$.end()}}}function nt(e){let t,n,r,o,s=e[5]&&Qe(e),a=e[3]&&et(e),i=e[6]&&tt(e);return{c(){t=g("section"),s&&s.c(),n=w(),a&&a.c(),r=w(),i&&i.c(),y(t,"class","interactables-container svelte-16vnudd")},m(e,c){d(e,t,c),s&&s.m(t,null),p(t,n),a&&a.m(t,null),p(t,r),i&&i.m(t,null),o=!0},p(e,[o]){e[5]?s?(s.p(e,o),32&o&&X(s,1)):(s=Qe(e),s.c(),X(s,1),s.m(t,n)):s&&(H(),I(s,1,1,(()=>{s=null})),V()),e[3]?a?(a.p(e,o),8&o&&X(a,1)):(a=et(e),a.c(),X(a,1),a.m(t,r)):a&&(H(),I(a,1,1,(()=>{a=null})),V()),e[6]?i?(i.p(e,o),64&o&&X(i,1)):(i=tt(e),i.c(),X(i,1),i.m(t,null)):i&&(H(),I(i,1,1,(()=>{i=null})),V())},i(e){o||(X(s),X(a),X(i),o=!0)},o(e){I(s),I(a),I(i),o=!1},d(e){e&&m(t),s&&s.d(),a&&a.d(),i&&i.d()}}}function rt(e,t,n){let r,o,s,a,i,c;ce.subscribe((e=>n(1,a=e))),le.subscribe((e=>{n(8,o=e)})),ue.subscribe((e=>{n(9,s=e)})),ie.subscribe((e=>{n(0,r=e)}));let l,u,f=0;const p=Ve.createFFmpeg({log:!0,progress:({ratio:e})=>{e>=0&&n(4,f=(100*e).toFixed(2))}});let d,m,g,h;return e.$$.update=()=>{768&e.$$.dirty&&n(12,d=o||s),3075&e.$$.dirty&&n(13,m=i!==r||c!==a),12297&e.$$.dirty&&n(5,g=r.name&&!d&&!u&&m),8196&e.$$.dirty&&n(6,h=l&&!m)},[r,a,l,u,f,g,h,async()=>{const{name:e}=r;n(3,u=!0),p.isLoaded()||await p.load(),p.FS("writeFile",e,await Ve.fetchFile(r));const t=a.split(".")[1];await p.run("-i",e,"-f",`${t}`,`out.${t}`);const o=p.FS("readFile",`out.${t}`),s=URL.createObjectURL(new Blob([o.buffer]),{type:`video/${t}`});n(2,l=s),n(3,u=!1),n(10,i=r),n(11,c=a)},o,s,i,c,d,m,function(e){f=e,n(4,f)}]}class ot extends ne{constructor(e){super(),te(this,e,rt,nt,a,{})}}function st(t){let n,r,o,s,a,i,c;return s=new _e({}),i=new ot({}),{c(){n=g("main"),r=g("h1"),r.textContent="Video Converter",o=w(),J(s.$$.fragment),a=w(),J(i.$$.fragment),y(r,"class","svelte-z45t24"),y(n,"class","svelte-z45t24")},m(e,t){d(e,n,t),p(n,r),p(n,o),K(s,n,null),p(n,a),K(i,n,null),c=!0},p:e,i(e){c||(X(s.$$.fragment,e),X(i.$$.fragment,e),c=!0)},o(e){I(s.$$.fragment,e),I(i.$$.fragment,e),c=!1},d(e){e&&m(n),Q(s),Q(i)}}}return new class extends ne{constructor(e){super(),te(this,e,null,st,a,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
