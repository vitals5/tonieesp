var Ut=Object.defineProperty;var Rt=Object.getOwnPropertyDescriptor;var n=(o,e,t,i)=>{for(var a=i>1?void 0:i?Rt(e,t):e,r=o.length-1,l;r>=0;r--)(l=o[r])&&(a=(i?l(e,t,a):l(a))||a);return i&&a&&Ut(e,t,a),a};var P=globalThis,V=P.ShadowRoot&&(P.ShadyCSS===void 0||P.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,rt=Symbol(),vt=new WeakMap,W=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==rt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(V&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=vt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&vt.set(t,e))}return e}toString(){return this.cssText}},ft=o=>new W(typeof o=="string"?o:o+"",void 0,rt),b=(o,...e)=>{let t=o.length===1?o[0]:e.reduce((i,a,r)=>i+(l=>{if(l._$cssResult$===!0)return l.cssText;if(typeof l=="number")return l;throw Error("Value passed to 'css' function must be a 'css' function result: "+l+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+o[r+1],o[0]);return new W(t,o,rt)},xt=(o,e)=>{if(V)o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),a=P.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=t.cssText,o.appendChild(i)}},ot=V?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return ft(t)})(o):o;var{is:Ft,defineProperty:It,getOwnPropertyDescriptor:Ht,getOwnPropertyNames:Dt,getOwnPropertySymbols:jt,getPrototypeOf:Bt}=Object,tt=globalThis,_t=tt.trustedTypes,Wt=_t?_t.emptyScript:"",qt=tt.reactiveElementPolyfillSupport,q=(o,e)=>o,J={toAttribute(o,e){switch(e){case Boolean:o=o?Wt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},et=(o,e)=>!Ft(o,e),yt={attribute:!0,type:String,converter:J,reflect:!1,useDefault:!1,hasChanged:et};Symbol.metadata??=Symbol("metadata"),tt.litPropertyMetadata??=new WeakMap;var L=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=yt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(e,i,t);a!==void 0&&It(this.prototype,e,a)}}static getPropertyDescriptor(e,t,i){let{get:a,set:r}=Ht(this.prototype,e)??{get(){return this[t]},set(l){this[t]=l}};return{get:a,set(l){let g=a?.call(this);r?.call(this,l),this.requestUpdate(e,g,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??yt}static _$Ei(){if(this.hasOwnProperty(q("elementProperties")))return;let e=Bt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(q("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(q("properties"))){let t=this.properties,i=[...Dt(t),...jt(t)];for(let a of i)this.createProperty(a,t[a])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,a]of t)this.elementProperties.set(i,a)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let a=this._$Eu(t,i);a!==void 0&&this._$Eh.set(a,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let a of i)t.unshift(ot(a))}else e!==void 0&&t.push(ot(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return xt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),a=this.constructor._$Eu(e,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:J).toAttribute(t,i.type);this._$Em=e,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(e,t){let i=this.constructor,a=i._$Eh.get(e);if(a!==void 0&&this._$Em!==a){let r=i.getPropertyOptions(a),l=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:J;this._$Em=a;let g=l.fromAttribute(t,r.type);this[a]=g??this._$Ej?.get(a)??g,this._$Em=null}}requestUpdate(e,t,i,a=!1,r){if(e!==void 0){let l=this.constructor;if(a===!1&&(r=this[e]),i??=l.getPropertyOptions(e),!((i.hasChanged??et)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(l._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:a,wrapped:r},l){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,l??t??this[e]),r!==!0||l!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),a===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:l}=r,g=this[a];l!==!0||this._$AL.has(a)||g===void 0||this.C(a,void 0,r,g)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};L.elementStyles=[],L.shadowRootOptions={mode:"open"},L[q("elementProperties")]=new Map,L[q("finalized")]=new Map,qt?.({ReactiveElement:L}),(tt.reactiveElementVersions??=[]).push("2.1.2");var gt=globalThis,$t=o=>o,it=gt.trustedTypes,kt=it?it.createPolicy("lit-html",{createHTML:o=>o}):void 0,Lt="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,Ot="?"+z,Jt=`<${Ot}>`,R=document,G=()=>R.createComment(""),Z=o=>o===null||typeof o!="object"&&typeof o!="function",ut=Array.isArray,Kt=o=>ut(o)||typeof o?.[Symbol.iterator]=="function",nt=`[ 	
\f\r]`,K=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,wt=/-->/g,At=/>/g,M=RegExp(`>|${nt}(?:([^\\s"'>=/]+)(${nt}*=${nt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ct=/'/g,St=/"/g,zt=/^(?:script|style|textarea|title)$/i,bt=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),c=bt(1),ae=bt(2),se=bt(3),F=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Et=new WeakMap,U=R.createTreeWalker(R,129);function Nt(o,e){if(!ut(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return kt!==void 0?kt.createHTML(e):e}var Gt=(o,e)=>{let t=o.length-1,i=[],a,r=e===2?"<svg>":e===3?"<math>":"",l=K;for(let g=0;g<t;g++){let h=o[g],x,$,v=-1,E=0;for(;E<h.length&&(l.lastIndex=E,$=l.exec(h),$!==null);)E=l.lastIndex,l===K?$[1]==="!--"?l=wt:$[1]!==void 0?l=At:$[2]!==void 0?(zt.test($[2])&&(a=RegExp("</"+$[2],"g")),l=M):$[3]!==void 0&&(l=M):l===M?$[0]===">"?(l=a??K,v=-1):$[1]===void 0?v=-2:(v=l.lastIndex-$[2].length,x=$[1],l=$[3]===void 0?M:$[3]==='"'?St:Ct):l===St||l===Ct?l=M:l===wt||l===At?l=K:(l=M,a=void 0);let O=l===M&&o[g+1].startsWith("/>")?" ":"";r+=l===K?h+Jt:v>=0?(i.push(x),h.slice(0,v)+Lt+h.slice(v)+z+O):h+z+(v===-2?g:O)}return[Nt(o,r+(o[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},Q=class o{constructor({strings:e,_$litType$:t},i){let a;this.parts=[];let r=0,l=0,g=e.length-1,h=this.parts,[x,$]=Gt(e,t);if(this.el=o.createElement(x,i),U.currentNode=this.el.content,t===2||t===3){let v=this.el.content.firstChild;v.replaceWith(...v.childNodes)}for(;(a=U.nextNode())!==null&&h.length<g;){if(a.nodeType===1){if(a.hasAttributes())for(let v of a.getAttributeNames())if(v.endsWith(Lt)){let E=$[l++],O=a.getAttribute(v).split(z),Y=/([.?@])?(.*)/.exec(E);h.push({type:1,index:r,name:Y[2],strings:O,ctor:Y[1]==="."?ct:Y[1]==="?"?dt:Y[1]==="@"?pt:B}),a.removeAttribute(v)}else v.startsWith(z)&&(h.push({type:6,index:r}),a.removeAttribute(v));if(zt.test(a.tagName)){let v=a.textContent.split(z),E=v.length-1;if(E>0){a.textContent=it?it.emptyScript:"";for(let O=0;O<E;O++)a.append(v[O],G()),U.nextNode(),h.push({type:2,index:++r});a.append(v[E],G())}}}else if(a.nodeType===8)if(a.data===Ot)h.push({type:2,index:r});else{let v=-1;for(;(v=a.data.indexOf(z,v+1))!==-1;)h.push({type:7,index:r}),v+=z.length-1}r++}}static createElement(e,t){let i=R.createElement("template");return i.innerHTML=e,i}};function j(o,e,t=o,i){if(e===F)return e;let a=i!==void 0?t._$Co?.[i]:t._$Cl,r=Z(e)?void 0:e._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(o),a._$AT(o,t,i)),i!==void 0?(t._$Co??=[])[i]=a:t._$Cl=a),a!==void 0&&(e=j(o,a._$AS(o,e.values),a,i)),e}var lt=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,a=(e?.creationScope??R).importNode(t,!0);U.currentNode=a;let r=U.nextNode(),l=0,g=0,h=i[0];for(;h!==void 0;){if(l===h.index){let x;h.type===2?x=new X(r,r.nextSibling,this,e):h.type===1?x=new h.ctor(r,h.name,h.strings,this,e):h.type===6&&(x=new ht(r,this,e)),this._$AV.push(x),h=i[++g]}l!==h?.index&&(r=U.nextNode(),l++)}return U.currentNode=R,a}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},X=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,a){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=j(this,e,t),Z(e)?e===_||e==null||e===""?(this._$AH!==_&&this._$AR(),this._$AH=_):e!==this._$AH&&e!==F&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Kt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==_&&Z(this._$AH)?this._$AA.nextSibling.data=e:this.T(R.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,a=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=Q.createElement(Nt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{let r=new lt(a,this),l=r.u(this.options);r.p(t),this.T(l),this._$AH=r}}_$AC(e){let t=Et.get(e.strings);return t===void 0&&Et.set(e.strings,t=new Q(e)),t}k(e){ut(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,a=0;for(let r of e)a===t.length?t.push(i=new o(this.O(G()),this.O(G()),this,this.options)):i=t[a],i._$AI(r),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=$t(e).nextSibling;$t(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},B=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,a,r){this.type=1,this._$AH=_,this._$AN=void 0,this.element=e,this.name=t,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=_}_$AI(e,t=this,i,a){let r=this.strings,l=!1;if(r===void 0)e=j(this,e,t,0),l=!Z(e)||e!==this._$AH&&e!==F,l&&(this._$AH=e);else{let g=e,h,x;for(e=r[0],h=0;h<r.length-1;h++)x=j(this,g[i+h],t,h),x===F&&(x=this._$AH[h]),l||=!Z(x)||x!==this._$AH[h],x===_?e=_:e!==_&&(e+=(x??"")+r[h+1]),this._$AH[h]=x}l&&!a&&this.j(e)}j(e){e===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ct=class extends B{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===_?void 0:e}},dt=class extends B{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==_)}},pt=class extends B{constructor(e,t,i,a,r){super(e,t,i,a,r),this.type=5}_$AI(e,t=this){if((e=j(this,e,t,0)??_)===F)return;let i=this._$AH,a=e===_&&i!==_||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==_&&(i===_||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ht=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){j(this,e)}};var Zt=gt.litHtmlPolyfillSupport;Zt?.(Q,X),(gt.litHtmlVersions??=[]).push("3.3.3");var Tt=(o,e,t)=>{let i=t?.renderBefore??e,a=i._$litPart$;if(a===void 0){let r=t?.renderBefore??null;i._$litPart$=a=new X(e.insertBefore(G(),r),r,void 0,t??{})}return a._$AI(o),a};var mt=globalThis,u=class extends L{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Tt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}};u._$litElement$=!0,u.finalized=!0,mt.litElementHydrateSupport?.({LitElement:u});var Qt=mt.litElementPolyfillSupport;Qt?.({LitElement:u});(mt.litElementVersions??=[]).push("4.2.2");var f=o=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(o,e)}):customElements.define(o,e)};var Xt={attribute:!0,type:String,converter:J,reflect:!1,hasChanged:et},Yt=(o=Xt,e,t)=>{let{kind:i,metadata:a}=t,r=globalThis.litPropertyMetadata.get(a);if(r===void 0&&globalThis.litPropertyMetadata.set(a,r=new Map),i==="setter"&&((o=Object.create(o)).wrapped=!0),r.set(t.name,o),i==="accessor"){let{name:l}=t;return{set(g){let h=e.get.call(this);e.set.call(this,g),this.requestUpdate(l,h,o,!0,g)},init(g){return g!==void 0&&this.C(l,void 0,o,g),g}}}if(i==="setter"){let{name:l}=t;return function(g){let h=this[l];e.call(this,g),this.requestUpdate(l,h,o,!0,g)}}throw Error("Unsupported decorator location: "+i)};function p(o){return(e,t)=>typeof t=="object"?Yt(o,e,t):((i,a,r)=>{let l=a.hasOwnProperty(r);return a.constructor.createProperty(r,i),l?Object.getOwnPropertyDescriptor(a,r):void 0})(o,e,t)}function d(o){return p({...o,state:!0,attribute:!1})}var st=class{constructor(e){this.hass=e}updateHass(e){this.hass=e}async getBoxes(){return this.hass.callWS({type:"tonieesp/boxes/list"})}async updateBoxSettings(e,t){return this.hass.callWS({type:"tonieesp/boxes/update",box_id:e,settings:t})}async getTags(e,t){return this.hass.callWS({type:"tonieesp/tags/list",search:e||void 0,media_type:t||void 0})}async getTag(e){return this.hass.callWS({type:"tonieesp/tags/get",uid:e})}async saveTag(e){return this.hass.callWS({type:"tonieesp/tags/save",tag:e})}async deleteTag(e){return this.hass.callWS({type:"tonieesp/tags/delete",uid:e})}async importTags(e,t=!1){return this.hass.callWS({type:"tonieesp/tags/import",tags:e,overwrite:t})}async exportTags(){return this.hass.callWS({type:"tonieesp/tags/export"})}async startLearning(e,t=60){return this.hass.callWS({type:"tonieesp/tags/learn_start",device_id:e||void 0,timeout:t})}async stopLearning(){return this.hass.callWS({type:"tonieesp/tags/learn_stop"})}async searchMedia(e,t){return this.hass.callWS({type:"tonieesp/media/search",query:e,media_types:t})}async controlPlayback(e,t,i){return this.hass.callWS({type:"tonieesp/playback/control",box_id:e,action:t,data:i})}async getDiagnostics(){return this.hass.callWS({type:"tonieesp/diagnostics"})}async subscribeEvents(e){return this.hass?.connection?.subscribeMessage?this.hass.connection.subscribeMessage(e,{type:"tonieesp/events/subscribe"}):()=>{}}};var Mt={de:{"nav.dashboard":"Dashboard","nav.tags":"NFC-Figuren","nav.browser":"Mediathek","nav.settings":"Einstellungen","nav.logs":"Diagnose & Logs","dashboard.title":"TonieESP \xDCbersicht","dashboard.subtitle":"Zentrale Verwaltung und Live-Status aller Tonieboxen","dashboard.boxes_online":"{count} Box(en) online","dashboard.total_boxes":"Tonieboxen gesamt","dashboard.online":"Online","dashboard.active_playbacks":"Aktive Wiedergaben","dashboard.tags_in_library":"NFC-Figuren in Bibliothek","dashboard.no_boxes":"Keine Tonieboxen eingerichtet","dashboard.add_box_hint":"Richte deine Toniebox in Home Assistant unter Einstellungen > Ger\xE4te & Dienste ein.","dashboard.current_tag":"Aktuelle Figur:","dashboard.no_tag":"Keine Figur aufgesetzt","dashboard.unknown_tag_alert":"Unbekannte Figur erkannt!","dashboard.setup_tag_btn":"Jetzt konfigurieren","dashboard.volume":"Lautst\xE4rke","dashboard.battery":"Batterie","dashboard.charging":"Wird geladen","control.play":"Abspielen","control.pause":"Pausieren","control.stop":"Stoppen","control.prev":"Zur\xFCck","control.next":"Weiter","control.details":"Details & Einstellungen","tags.title":"Globale NFC-Figuren-Bibliothek","tags.search_placeholder":"NFC-Figuren durchsuchen (Name, UID, Titel)...","tags.filter_all":"Alle Typen","tags.filter_playlist":"Playlists","tags.filter_album":"Alben","tags.filter_audiobook":"H\xF6rb\xFCcher","tags.filter_track":"Titel","tags.filter_radio":"Radio","tags.filter_podcast":"Podcasts","tags.add_new":"+ Figur hinzuf\xFCgen","tags.scan_learn":"\u26A1 Scan-Lernmodus","tags.play_on":"\u25B6 Play","tags.edit":"Bearbeiten","tags.delete":"L\xF6schen","tags.confirm_delete":"Soll die Figur '{name}' ({uid}) wirklich gel\xF6scht werden?","tags.empty":"Keine Figuren gefunden","tags.empty_hint":"Lege eine Figur auf deine Toniebox oder klicke auf '+ Figur hinzuf\xFCgen'.","tags.no_media":"Kein Medium zugewiesen","tags.resume_badge":"\u23F1 Resume","tags.shuffle_badge":"\u{1F500} Shuffle","tags.overrides_badge":"\u26A1 {count} Override(s)","editor.title_new":"Neue NFC-Figur anlegen","editor.title_edit":"NFC-Figur bearbeiten","editor.tab_global":"Globale Einstellungen","editor.tab_overrides":"Ger\xE4tespezifische Overrides","editor.uid":"NFC UID (16 Hex-Zeichen)","editor.uid_hint":"Z.B. E004015023AABBCC","editor.name":"Name der Figur","editor.desc":"Beschreibung (optional)","editor.image":"Cover-Bild URL (optional)","editor.media_provider":"Medien-Provider","editor.media_type":"Medientyp","editor.media_id":"Medien-ID / URI","editor.media_title":"Titel / Playlist-Name","editor.media_artist":"K\xFCnstler / Interpret (optional)","editor.browse_ma":"\u{1F50D} In Mediathek suchen...","editor.settings":"Wiedergabeeinstellungen","editor.resume":"Wiedergabefortschritt merken (Resume)","editor.shuffle":"Zufallswiedergabe (Shuffle)","editor.repeat":"Wiederholen","editor.repeat_off":"Aus","editor.repeat_one":"Aktuellen Titel wiederholen","editor.repeat_all":"Ganze Playlist wiederholen","editor.vol_limit":"Lautst\xE4rkebegrenzung (optional)","editor.overrides_hint":"Definiere abweichende Playlists oder Einstellungen f\xFCr einzelne Tonieboxen.","editor.select_box":"Toniebox ausw\xE4hlen:","editor.add_override":"+ Override hinzuf\xFCgen","editor.delete_override":"Override entfernen","editor.save":"Speichern","editor.cancel":"Abbrechen","box.detail_title":"Toniebox: {name}","box.section_playback":"Wiedergabe & Verhalten","box.pause_removal":"Automatische Pause beim Herunternehmen der Figur","box.resume_replace":"Automatisches Fortsetzen beim Wiederaufsetzen","box.max_volume":"Maximale Lautst\xE4rke (0 bis 1.0)","box.seek_step":"Spul-Schrittweite f\xFCr Neigegesten (Sekunden)","box.section_gestures":"Gesten-Steuerung (ESPHome)","box.gestures_enabled":"Gestensteuerung aktivieren","box.left_tap":"Linkes Ohr / Linker Klopfer","box.right_tap":"Rechtes Ohr / Rechter Klopfer","box.left_tilt":"Nach links kippen","box.right_tilt":"Nach rechts kippen","box.save_success":"Einstellungen erfolgreich gespeichert!","box.back":"\u2190 Zur\xFCck zur \xDCbersicht","action.previous_track":"Vorheriger Titel","action.next_track":"N\xE4chster Titel","action.seek_backward":"Zur\xFCckspulen","action.seek_forward":"Vorspulen","action.play_pause":"Play / Pause umschalten","action.volume_up":"Lauter","action.volume_down":"Leiser","action.none":"Keine Aktion (Deaktiviert)","learn.title":"Scan-Lernmodus aktiv","learn.instructions":"Stelle jetzt eine NFC-Figur auf eine beliebige Toniebox. Die UID wird direkt erfasst.","learn.waiting":"Warte auf NFC-Scan...","learn.captured":"Figur erkannt: {uid}!","learn.cancel":"Abbrechen","learn.close":"Schlie\xDFen","learn.use_btn":"Figur einrichten \u2192","browser.title":"Music Assistant Mediathek durchsuchen","browser.subtitle":"Finde Playlists, Alben, H\xF6rb\xFCcher und Sender f\xFCr deine Tonie-Figuren","browser.search_placeholder":"Suchbegriff (z.B. Benjamin Bl\xFCmchen, Die drei ???)...","browser.search_btn":"Suchen","browser.searching":"Suche l\xE4uft...","browser.no_results":"Keine Medien gefunden. Probiere einen anderen Suchbegriff.","browser.select_btn":"\xDCbernehmen","settings.title":"TonieESP Einstellungen & Sicherung","settings.subtitle":"Verwalte globale Daten und erstelle Sicherungskopien deiner Figuren-Bibliothek","settings.export":"NFC-Bibliothek exportieren (JSON)","settings.export_desc":"Lade alle Figuren und Zuordnungen als Sicherung herunter.","settings.export_btn":"Herunterladen","settings.import":"NFC-Bibliothek importieren (JSON)","settings.import_desc":"Stelle eine zuvor gesicherte Figuren-Bibliothek wieder her.","settings.import_btn":"JSON hochladen","settings.overwrite":"Vorhandene UIDs \xFCberschreiben","settings.diagnostics":"System-Diagnose","settings.diagnostics_desc":"\xDCbersicht \xFCber erkannte ESPHome-Boxen, Entit\xE4ten und Music Assistant Status.","logs.title":"Ereignis-Protokoll & Diagnose","logs.clear_btn":"Logs leeren","logs.empty":"Noch keine Ereignisse protokolliert.","common.online":"Online","common.offline":"Offline","common.save_success":"Erfolgreich gespeichert!","common.error":"Fehler aufgetreten: {error}","common.loading":"Wird geladen...","common.cancel":"Abbrechen","common.save":"Speichern","common.delete":"L\xF6schen","common.close":"Schlie\xDFen","common.language":"Sprache"},en:{"nav.dashboard":"Dashboard","nav.tags":"NFC Tags","nav.browser":"Media Library","nav.settings":"Settings","nav.logs":"Diagnostics & Logs","dashboard.title":"TonieESP Overview","dashboard.subtitle":"Central management and live status for all Tonieboxes","dashboard.boxes_online":"{count} box(es) online","dashboard.total_boxes":"Total Tonieboxes","dashboard.online":"Online","dashboard.active_playbacks":"Active Playbacks","dashboard.tags_in_library":"NFC Tags in Library","dashboard.no_boxes":"No Tonieboxes configured yet","dashboard.add_box_hint":"Add your Toniebox in Home Assistant under Settings > Devices & Services.","dashboard.current_tag":"Current Tag:","dashboard.no_tag":"No figure placed","dashboard.unknown_tag_alert":"Unknown figure scanned!","dashboard.setup_tag_btn":"Configure now","dashboard.volume":"Volume","dashboard.battery":"Battery","dashboard.charging":"Charging","control.play":"Play","control.pause":"Pause","control.stop":"Stop","control.prev":"Previous","control.next":"Next","control.details":"Details & Settings","tags.title":"Global NFC Tag Library","tags.search_placeholder":"Search NFC tags (name, UID, title)...","tags.filter_all":"All types","tags.filter_playlist":"Playlists","tags.filter_album":"Albums","tags.filter_audiobook":"Audiobooks","tags.filter_track":"Tracks","tags.filter_radio":"Radio","tags.filter_podcast":"Podcasts","tags.add_new":"+ Add Tag","tags.scan_learn":"\u26A1 Scan Learning","tags.play_on":"\u25B6 Play","tags.edit":"Edit","tags.delete":"Delete","tags.confirm_delete":"Do you really want to delete '{name}' ({uid})?","tags.empty":"No tags found","tags.empty_hint":"Place a figure onto your Toniebox or click '+ Add Tag'.","tags.no_media":"No media assigned","tags.resume_badge":"\u23F1 Resume","tags.shuffle_badge":"\u{1F500} Shuffle","tags.overrides_badge":"\u26A1 {count} Override(s)","editor.title_new":"Add New NFC Tag","editor.title_edit":"Edit NFC Tag","editor.tab_global":"Global Settings","editor.tab_overrides":"Device Overrides","editor.uid":"NFC UID (16 Hex characters)","editor.uid_hint":"E.g. E004015023AABBCC","editor.name":"Tag Name","editor.desc":"Description (optional)","editor.image":"Cover Image URL (optional)","editor.media_provider":"Media Provider","editor.media_type":"Media Type","editor.media_id":"Media ID / URI","editor.media_title":"Title / Playlist Name","editor.media_artist":"Artist / Author (optional)","editor.browse_ma":"\u{1F50D} Search in Media Library...","editor.settings":"Playback Settings","editor.resume":"Remember playback progress (Resume)","editor.shuffle":"Shuffle playback","editor.repeat":"Repeat","editor.repeat_off":"Off","editor.repeat_one":"Repeat Track","editor.repeat_all":"Repeat All","editor.vol_limit":"Volume limit (optional)","editor.overrides_hint":"Define different playlists or settings for specific Tonieboxes.","editor.select_box":"Select Toniebox:","editor.add_override":"+ Add Override","editor.delete_override":"Remove Override","editor.save":"Save Tag","editor.cancel":"Cancel","box.detail_title":"Toniebox: {name}","box.section_playback":"Playback & Behavior","box.pause_removal":"Pause automatically when tag is removed","box.resume_replace":"Resume automatically when tag is replaced","box.max_volume":"Maximum Volume Limit (0 to 1.0)","box.seek_step":"Seek step for tilt gestures (seconds)","box.section_gestures":"Gesture Controls (ESPHome)","box.gestures_enabled":"Enable gesture controls","box.left_tap":"Left ear / Left tap","box.right_tap":"Right ear / Right tap","box.left_tilt":"Tilt left","box.right_tilt":"Tilt right","box.save_success":"Settings saved successfully!","box.back":"\u2190 Back to Overview","action.previous_track":"Previous Track","action.next_track":"Next Track","action.seek_backward":"Seek Backward","action.seek_forward":"Seek Forward","action.play_pause":"Toggle Play / Pause","action.volume_up":"Volume Up","action.volume_down":"Volume Down","action.none":"No Action (Disabled)","learn.title":"Scan Learning Mode Active","learn.instructions":"Place a figure onto any of your Tonieboxes now. The UID will be captured directly.","learn.waiting":"Waiting for NFC scan...","learn.captured":"Captured figure: {uid}!","learn.cancel":"Cancel","learn.close":"Close","learn.use_btn":"Set Up Tag \u2192","browser.title":"Search Music Assistant Library","browser.subtitle":"Find playlists, albums, audiobooks and radio stations for your figures","browser.search_placeholder":"Search query (e.g. Bedtime Stories, Peter Pan)...","browser.search_btn":"Search","browser.searching":"Searching...","browser.no_results":"No media found. Try a different search query.","browser.select_btn":"Select","settings.title":"TonieESP Settings & Backup","settings.subtitle":"Manage global data and create backup copies of your tag library","settings.export":"Export Tag Library (JSON)","settings.export_desc":"Download all tags and configurations as a backup file.","settings.export_btn":"Download Backup","settings.import":"Import Tag Library (JSON)","settings.import_desc":"Restore a previously backed up tag library.","settings.import_btn":"Upload JSON","settings.overwrite":"Overwrite existing UIDs","settings.diagnostics":"System Diagnostics","settings.diagnostics_desc":"Overview of discovered ESPHome boxes, entities, and Music Assistant status.","logs.title":"Event Log & Diagnostics","logs.clear_btn":"Clear Logs","logs.empty":"No events recorded yet.","common.online":"Online","common.offline":"Offline","common.save_success":"Saved successfully!","common.error":"An error occurred: {error}","common.loading":"Loading...","common.cancel":"Cancel","common.save":"Save","common.delete":"Delete","common.close":"Close","common.language":"Language"}};function s(o,e="de",t){let i=e&&e.toLowerCase().startsWith("en")?"en":"de",a=Mt[i]?.[o]||Mt.de?.[o]||o;if(t)for(let[r,l]of Object.entries(t))a=a.replace(new RegExp(`\\{${r}\\}`,"g"),String(l));return a}var C=class extends u{constructor(){super(...arguments);this.online=!1;this.batteryLevel=null;this.charging=!1;this.type="";this.text=""}render(){return this.type==="online"?c`
        <span class="${this.online?"badge-online":"badge-offline"}">
          <span class="dot"></span>
          ${this.online?"Online":"Offline"}
        </span>
      `:this.type==="battery"&&this.batteryLevel!==null?c`
        <span class="badge-battery">
          ${this.charging?"\u26A1":"\u{1F50B}"} ${this.batteryLevel}%
        </span>
      `:this.type==="media_type"?c`<span class="badge-type">${this.text}</span>`:c`<span>${this.text}</span>`}};C.styles=b`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 500;
      border-radius: 12px;
      padding: 3px 8px;
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color, #222);
    }

    .badge-online {
      background: rgba(76, 175, 80, 0.15);
      color: #2e7d32;
    }

    .badge-offline {
      background: rgba(244, 67, 54, 0.15);
      color: #c62828;
    }

    .badge-battery {
      background: rgba(33, 150, 243, 0.15);
      color: #1565c0;
    }

    .badge-type {
      background: rgba(156, 39, 176, 0.15);
      color: #7b1fa2;
      text-transform: capitalize;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
  `,n([p({type:Boolean})],C.prototype,"online",2),n([p({type:Number})],C.prototype,"batteryLevel",2),n([p({type:Boolean})],C.prototype,"charging",2),n([p({type:String})],C.prototype,"type",2),n([p({type:String})],C.prototype,"text",2),C=n([f("tonieesp-status-badge")],C);var I=class extends u{constructor(){super(...arguments);this.lang="de"}_onControl(t,i){this.dispatchEvent(new CustomEvent("box-control",{detail:{boxId:this.box.id,action:t,data:i},bubbles:!0,composed:!0}))}_onSetupUnknown(){this.dispatchEvent(new CustomEvent("setup-unknown-tag",{detail:{uid:this.box.unknown_tag,boxId:this.box.id},bubbles:!0,composed:!0}))}_onOpenDetails(){this.dispatchEvent(new CustomEvent("open-box-details",{detail:{box:this.box},bubbles:!0,composed:!0}))}_onVolumeChange(t){let i=t.target,a=parseFloat(i.value);this._onControl("volume",{volume:a})}render(){if(!this.box)return c``;let t=this.box.playback||{},i=t.state==="playing";return c`
      <div class="card">
        <!-- Header -->
        <div class="header">
          <div class="title-group">
            <span class="icon-box">📻</span>
            <span class="box-name">${this.box.name}</span>
          </div>
          <div class="badges">
            <tonieesp-status-badge
              type="online"
              .online=${this.box.online}
            ></tonieesp-status-badge>
            ${this.box.battery?.level!==null?c`
                  <tonieesp-status-badge
                    type="battery"
                    .batteryLevel=${this.box.battery.level}
                    .charging=${this.box.battery.charging}
                  ></tonieesp-status-badge>
                `:""}
          </div>
        </div>

        <!-- Tag Notification / Current Tag -->
        ${this.box.unknown_tag?c`
              <div class="unknown-banner">
                <span class="unknown-text"
                  >⚡ ${s("dashboard.unknown_tag_alert",this.lang)} ${this.box.unknown_tag}</span
                >
                <button class="btn-setup" @click=${this._onSetupUnknown}>
                  ${s("dashboard.setup_tag_btn",this.lang)}
                </button>
              </div>
            `:c`
              <div class="tag-container">
                ${this.box.current_tag_info?.image?c`<img
                      class="tag-cover"
                      src="${this.box.current_tag_info.image}"
                      alt="Tag"
                    />`:c`<div class="tag-cover">🧸</div>`}
                <div class="tag-details">
                  <div class="tag-label">${s("dashboard.current_tag",this.lang)}</div>
                  <div class="tag-name">
                    ${this.box.current_tag_info?.name||(this.box.current_tag?`UID: ${this.box.current_tag}`:s("dashboard.no_tag",this.lang))}
                  </div>
                  ${this.box.current_tag_info?.media_title?c`<div class="tag-media">
                        ${this.box.current_tag_info.media_title}
                      </div>`:""}
                </div>
              </div>
            `}

        <!-- Playback Controls -->
        <div class="player-section">
          <div class="playback-info">
            <span class="playback-title">${t.title||(this.lang.startsWith("en")?"No playback":"Keine Wiedergabe")}</span>
            <span class="playback-status">${t.state||(this.lang.startsWith("en")?"Ready":"Bereit")}</span>
          </div>

          <div class="controls-row">
            <div class="playback-buttons">
              <button
                class="btn-ctrl"
                title=${s("control.prev",this.lang)}
                @click=${()=>this._onControl("previous")}
              >
                ⏮
              </button>
              <button
                class="btn-ctrl btn-play"
                title=${i?s("control.pause",this.lang):s("control.play",this.lang)}
                @click=${()=>this._onControl(i?"pause":"play")}
              >
                ${i?"\u23F8":"\u25B6"}
              </button>
              <button
                class="btn-ctrl"
                title=${s("control.next",this.lang)}
                @click=${()=>this._onControl("next")}
              >
                ⏭
              </button>
            </div>

            <div class="volume-slider">
              <span>🔈</span>
              <input
                type="range"
                min="0"
                max="${this.box.settings.max_volume||1}"
                step="0.05"
                .value=${String(t.volume_level||.4)}
                @change=${this._onVolumeChange}
                title=${s("dashboard.volume",this.lang)}
              />
              <span>🔊</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="card-footer">
          <button class="btn-link" @click=${this._onOpenDetails}>
            ${s("control.details",this.lang)} →
          </button>
        </div>
      </div>
    `}};I.styles=b`
    :host {
      display: block;
    }

    .card {
      background: var(--card-background-color, #ffffff);
      border-radius: 12px;
      padding: 16px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.08));
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
      display: flex;
      flex-direction: column;
      gap: 14px;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .title-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .icon-box {
      font-size: 22px;
    }

    .box-name {
      font-size: 16px;
      font-weight: 700;
      color: var(--primary-text-color, #222);
    }

    .badges {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Current Tag Section */
    .tag-container {
      background: var(--secondary-background-color, #f8f9fa);
      border-radius: 8px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .tag-cover {
      width: 44px;
      height: 44px;
      border-radius: 6px;
      object-fit: cover;
      background: rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .tag-details {
      flex: 1;
      min-width: 0;
    }

    .tag-label {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: var(--secondary-text-color, #777);
    }

    .tag-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color, #111);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .tag-media {
      font-size: 12px;
      color: var(--secondary-text-color, #555);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Unknown Tag Alert */
    .unknown-banner {
      background: rgba(255, 152, 0, 0.12);
      border: 1px solid rgba(255, 152, 0, 0.3);
      color: #e65100;
      border-radius: 8px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .unknown-text {
      font-size: 12px;
      font-weight: 600;
    }

    .btn-setup {
      background: #f57c00;
      color: #fff;
      border: none;
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }

    /* Player Controls */
    .player-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 4px;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }

    .playback-info {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 13px;
    }

    .playback-title {
      font-weight: 600;
      color: var(--primary-text-color, #111);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 70%;
    }

    .playback-status {
      font-size: 11px;
      font-weight: 500;
      color: var(--secondary-text-color, #888);
      text-transform: uppercase;
    }

    .controls-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .playback-buttons {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn-ctrl {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color, #222);
      border: none;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .btn-ctrl:hover {
      background: rgba(0, 0, 0, 0.12);
    }

    .btn-play {
      background: var(--primary-color, #03a9f4);
      color: #fff;
      width: 38px;
      height: 38px;
      font-size: 16px;
    }

    .btn-play:hover {
      opacity: 0.9;
    }

    .volume-slider {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .volume-slider input[type="range"] {
      width: 100%;
      accent-color: var(--primary-color, #03a9f4);
    }

    .card-footer {
      display: flex;
      justify-content: flex-end;
      padding-top: 4px;
    }

    .btn-link {
      background: transparent;
      border: none;
      color: var(--primary-color, #03a9f4);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      padding: 4px 6px;
    }

    .btn-link:hover {
      text-decoration: underline;
    }
  `,n([p({type:Object})],I.prototype,"box",2),n([p({type:String})],I.prototype,"lang",2),I=n([f("tonieesp-box-card")],I);var N=class extends u{constructor(){super(...arguments);this.boxes=[];this.tags=[];this.lang="de"}render(){let t=this.boxes.filter(a=>a.online).length,i=this.boxes.filter(a=>a.playback?.state==="playing").length;return c`
      <div class="header-section">
        <h1 class="title">${s("dashboard.title",this.lang)}</h1>
        <p class="subtitle">
          ${s("dashboard.subtitle",this.lang)}
        </p>

        <div class="stats-row">
          <div class="stat-card">
            <span class="stat-value">${this.boxes.length}</span>
            <span class="stat-label">${s("dashboard.total_boxes",this.lang)}</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${t}</span>
            <span class="stat-label">${s("dashboard.online",this.lang)}</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${i}</span>
            <span class="stat-label">${s("dashboard.active_playbacks",this.lang)}</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${this.tags.length}</span>
            <span class="stat-label">${s("dashboard.tags_in_library",this.lang)}</span>
          </div>
        </div>
      </div>

      ${this.boxes.length===0?c`
            <div class="empty-state">
              <div class="empty-icon">📻</div>
              <h3>${s("dashboard.no_boxes",this.lang)}</h3>
              <p>
                ${s("dashboard.add_box_hint",this.lang)}
              </p>
            </div>
          `:c`
            <div class="boxes-grid">
              ${this.boxes.map(a=>c`<tonieesp-box-card
                    .box=${a}
                    .lang=${this.lang}
                  ></tonieesp-box-card>`)}
            </div>
          `}
    `}};N.styles=b`
    :host {
      display: block;
    }

    .header-section {
      margin-bottom: 20px;
    }

    .title {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary-text-color, #111);
      margin: 0;
    }

    .subtitle {
      font-size: 14px;
      color: var(--secondary-text-color, #666);
      margin: 4px 0 0 0;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin: 16px 0 24px 0;
    }

    .stat-card {
      background: var(--card-background-color, #ffffff);
      border-radius: 10px;
      padding: 12px 16px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 22px;
      font-weight: 700;
      color: var(--primary-color, #03a9f4);
    }

    .stat-label {
      font-size: 12px;
      color: var(--secondary-text-color, #777);
      margin-top: 2px;
    }

    .boxes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 18px;
    }

    .empty-state {
      background: var(--card-background-color, #ffffff);
      border-radius: 12px;
      padding: 40px 20px;
      text-align: center;
      border: 1px dashed var(--divider-color, #ccc);
      color: var(--secondary-text-color, #666);
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }
  `,n([p({type:Array})],N.prototype,"boxes",2),n([p({type:Array})],N.prototype,"tags",2),n([p({type:String})],N.prototype,"lang",2),N=n([f("tonieesp-dashboard-view")],N);var T=class extends u{constructor(){super(...arguments);this.boxes=[];this.lang="de"}_onPlayOnBox(){let t=this.shadowRoot?.querySelector("select"),i=t?t.value:this.boxes[0]?.id;i&&this.dispatchEvent(new CustomEvent("play-tag-on-box",{detail:{tag:this.tag,boxId:i},bubbles:!0,composed:!0}))}_onEdit(){this.dispatchEvent(new CustomEvent("edit-tag",{detail:{tag:this.tag},bubbles:!0,composed:!0}))}_onDelete(){this.dispatchEvent(new CustomEvent("delete-tag",{detail:{tag:this.tag},bubbles:!0,composed:!0}))}render(){if(!this.tag)return c``;let t=Object.keys(this.tag.overrides||{}).length;return c`
      <div class="card">
        <div class="top-row">
          ${this.tag.image?c`<img class="cover" src="${this.tag.image}" alt="Cover" />`:c`<div class="cover">🧸</div>`}
          <div class="info">
            <div class="name">${this.tag.name}</div>
            <span class="uid-pill">${this.tag.uid}</span>
            <div class="media-info">
              🎵 ${this.tag.media.title||this.tag.media.media_id||s("tags.no_media",this.lang)}
            </div>
          </div>
        </div>

        <div class="badges-row">
          <span class="badge">${this.tag.media.media_type||"playlist"}</span>
          ${this.tag.settings.resume?c`<span class="badge">${s("tags.resume_badge",this.lang)}</span>`:""}
          ${this.tag.settings.shuffle?c`<span class="badge">${s("tags.shuffle_badge",this.lang)}</span>`:""}
          ${t>0?c`<span class="badge badge-override">${s("tags.overrides_badge",this.lang,{count:t})}</span>`:""}
        </div>

        <div class="actions-row">
          <div class="play-select-group">
            <select>
              ${this.boxes.map(i=>c`<option value="${i.id}">${i.name}</option>`)}
            </select>
            <button class="btn-play-action" @click=${this._onPlayOnBox}>${s("tags.play_on",this.lang)}</button>
          </div>

          <div>
            <button class="btn-icon" title=${s("tags.edit",this.lang)} @click=${this._onEdit}>✏️</button>
            <button class="btn-icon btn-delete" title=${s("tags.delete",this.lang)} @click=${this._onDelete}>🗑️</button>
          </div>
        </div>
      </div>
    `}};T.styles=b`
    :host {
      display: block;
    }

    .card {
      background: var(--card-background-color, #ffffff);
      border-radius: 12px;
      padding: 14px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.06));
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .card:hover {
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
    }

    .top-row {
      display: flex;
      gap: 12px;
    }

    .cover {
      width: 64px;
      height: 64px;
      border-radius: 8px;
      object-fit: cover;
      background: var(--secondary-background-color, #eee);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      flex-shrink: 0;
    }

    .info {
      flex: 1;
      min-width: 0;
    }

    .name {
      font-size: 15px;
      font-weight: 700;
      color: var(--primary-text-color, #111);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .uid-pill {
      font-family: monospace;
      font-size: 11px;
      background: var(--secondary-background-color, #f0f0f0);
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--secondary-text-color, #555);
      display: inline-block;
      margin-top: 3px;
    }

    .media-info {
      margin-top: 4px;
      font-size: 12px;
      color: var(--secondary-text-color, #666);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .badges-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .badge {
      font-size: 11px;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 6px;
      background: var(--secondary-background-color, #f4f4f4);
      color: var(--primary-text-color, #444);
    }

    .badge-override {
      background: rgba(255, 152, 0, 0.15);
      color: #e65100;
    }

    .actions-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding-top: 6px;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }

    .play-select-group {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 1;
    }

    select {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color, #222);
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 6px;
      padding: 5px 8px;
      font-size: 12px;
      flex: 1;
      max-width: 140px;
    }

    .btn-play-action {
      background: var(--primary-color, #03a9f4);
      color: white;
      border: none;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-icon {
      background: transparent;
      border: none;
      font-size: 16px;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      color: var(--secondary-text-color, #555);
    }

    .btn-icon:hover {
      background: rgba(0, 0, 0, 0.06);
      color: var(--primary-text-color, #111);
    }

    .btn-delete:hover {
      color: #d32f2f;
      background: rgba(244, 67, 54, 0.1);
    }
  `,n([p({type:Object})],T.prototype,"tag",2),n([p({type:Array})],T.prototype,"boxes",2),n([p({type:String})],T.prototype,"lang",2),T=n([f("tonieesp-tag-card")],T);var S=class extends u{constructor(){super(...arguments);this.tags=[];this.boxes=[];this.lang="de";this._searchQuery="";this._selectedType=""}_filteredTags(){let t=this._searchQuery.toLowerCase().trim();return this.tags.filter(i=>{if(this._selectedType&&i.media.media_type!==this._selectedType)return!1;if(t){let a=(i.name||"").toLowerCase(),r=(i.description||"").toLowerCase(),l=(i.uid||"").toLowerCase(),g=(i.media.title||"").toLowerCase();if(!a.includes(t)&&!r.includes(t)&&!l.includes(t)&&!g.includes(t))return!1}return!0})}render(){let t=this._filteredTags(),i=[{id:"",label:s("tags.filter_all",this.lang)},{id:"playlist",label:s("tags.filter_playlist",this.lang)},{id:"album",label:s("tags.filter_album",this.lang)},{id:"audiobook",label:s("tags.filter_audiobook",this.lang)},{id:"track",label:s("tags.filter_track",this.lang)},{id:"radio",label:s("tags.filter_radio",this.lang)},{id:"podcast",label:s("tags.filter_podcast",this.lang)}];return c`
      <div class="top-toolbar">
        <input
          class="search-input"
          type="search"
          placeholder=${s("tags.search_placeholder",this.lang)}
          .value=${this._searchQuery}
          @input=${a=>this._searchQuery=a.target.value}
        />
        <div class="toolbar-actions">
          <button
            class="btn btn-secondary"
            @click=${()=>this.dispatchEvent(new CustomEvent("start-scan-learning",{bubbles:!0,composed:!0}))}
          >
            ${s("tags.scan_learn",this.lang)}
          </button>
          <button
            class="btn btn-primary"
            @click=${()=>this.dispatchEvent(new CustomEvent("add-new-tag",{bubbles:!0,composed:!0}))}
          >
            ${s("tags.add_new",this.lang)}
          </button>
        </div>
      </div>

      <div class="filters-row">
        ${i.map(a=>c`
            <div
              class="filter-chip ${this._selectedType===a.id?"active":""}"
              @click=${()=>this._selectedType=a.id}
            >
              ${a.label}
            </div>
          `)}
      </div>

      ${t.length===0?c`
            <div class="empty-state">
              <div class="empty-icon">🧸</div>
              <h3>${s("tags.empty",this.lang)}</h3>
              <p>
                ${s("tags.empty_hint",this.lang)}
              </p>
            </div>
          `:c`
            <div class="tags-grid">
              ${t.map(a=>c`<tonieesp-tag-card
                    .tag=${a}
                    .boxes=${this.boxes}
                    .lang=${this.lang}
                  ></tonieesp-tag-card>`)}
            </div>
          `}
    `}};S.styles=b`
    :host {
      display: block;
    }

    .top-toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
    }

    .search-input {
      flex: 1;
      min-width: 240px;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #ffffff);
      color: var(--primary-text-color, #111);
      font-size: 14px;
    }

    .toolbar-actions {
      display: flex;
      gap: 8px;
    }

    .btn {
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .btn-primary {
      background: var(--primary-color, #03a9f4);
      color: #fff;
    }

    .btn-secondary {
      background: var(--secondary-background-color, #eee);
      color: var(--primary-text-color, #222);
    }

    .filters-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 20px;
    }

    .filter-chip {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--secondary-text-color, #555);
      border: 1px solid transparent;
      transition: all 0.15s ease;
    }

    .filter-chip:hover {
      background: rgba(0, 0, 0, 0.08);
    }

    .filter-chip.active {
      background: var(--primary-color, #03a9f4);
      color: #fff;
    }

    .tags-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .empty-state {
      background: var(--card-background-color, #ffffff);
      border-radius: 12px;
      padding: 40px 20px;
      text-align: center;
      border: 1px dashed var(--divider-color, #ccc);
      color: var(--secondary-text-color, #666);
    }

    .empty-icon {
      font-size: 40px;
      margin-bottom: 8px;
    }
  `,n([p({type:Array})],S.prototype,"tags",2),n([p({type:Array})],S.prototype,"boxes",2),n([p({type:String})],S.prototype,"lang",2),n([d()],S.prototype,"_searchQuery",2),n([d()],S.prototype,"_selectedType",2),S=n([f("tonieesp-tag-library-view")],S);var m=class extends u{constructor(){super(...arguments);this.boxes=[];this.initialUid="";this.lang="de";this._uid="";this._name="";this._description="";this._image="";this._mediaProvider="music_assistant";this._mediaType="playlist";this._mediaId="";this._mediaTitle="";this._mediaArtist="";this._resume=!0;this._shuffle=!1;this._repeat="off";this._volumeLimit=null;this._overrides={};this._activeTab="global";this._selectedOverrideBoxId=""}connectedCallback(){super.connectedCallback(),this.tag?(this._uid=this.tag.uid,this._name=this.tag.name,this._description=this.tag.description||"",this._image=this.tag.image||"",this._mediaProvider=this.tag.media.provider||"music_assistant",this._mediaType=this.tag.media.media_type||"playlist",this._mediaId=this.tag.media.media_id||"",this._mediaTitle=this.tag.media.title||"",this._mediaArtist=this.tag.media.artist||"",this._resume=this.tag.settings.resume!==!1,this._shuffle=!!this.tag.settings.shuffle,this._repeat=this.tag.settings.repeat||"off",this._volumeLimit=this.tag.settings.volume_limit||null,this._overrides=JSON.parse(JSON.stringify(this.tag.overrides||{}))):this.initialUid&&(this._uid=this.initialUid,this._name=`Tonie ${this.initialUid.slice(-4)}`),this.boxes.length>0&&(this._selectedOverrideBoxId=this.boxes[0].id)}setMediaSelection(t){this._mediaId=t.media_id,this._mediaType=t.media_type,this._mediaTitle=t.title,this._mediaArtist=t.artist||"",t.image&&!this._image&&(this._image=t.image),(!this._name||this._name.startsWith("Tonie "))&&(this._name=t.title)}_onSave(){if(!this._uid.trim()){alert(this.lang.startsWith("en")?"Please provide a valid NFC UID.":"Bitte gib eine g\xFCltige NFC UID an.");return}let t={uid:this._uid.trim().toUpperCase(),name:this._name.trim()||`Tonie ${this._uid.slice(-4)}`,description:this._description.trim(),image:this._image.trim(),media:{provider:this._mediaProvider,media_type:this._mediaType,media_id:this._mediaId.trim(),title:this._mediaTitle.trim(),artist:this._mediaArtist.trim()},settings:{resume:this._resume,shuffle:this._shuffle,repeat:this._repeat,volume_limit:this._volumeLimit},overrides:this._overrides};this.dispatchEvent(new CustomEvent("save-tag-record",{detail:{tag:t},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("cancel-tag-edit",{bubbles:!0,composed:!0}))}_addOverride(){this._selectedOverrideBoxId&&(this._overrides={...this._overrides,[this._selectedOverrideBoxId]:{media:{provider:"music_assistant",media_type:"playlist",media_id:"",title:""}}})}_removeOverride(t){let i={...this._overrides};delete i[t],this._overrides=i}render(){return c`
      <div class="editor-card">
        <div class="title-row">
          <h2 class="title">
            ${this.tag?s("editor.title_edit",this.lang):s("editor.title_new",this.lang)}
          </h2>
        </div>

        <div class="tabs-row">
          <button
            class="tab-btn ${this._activeTab==="global"?"active":""}"
            @click=${()=>this._activeTab="global"}
          >
            ${s("editor.tab_global",this.lang)}
          </button>
          <button
            class="tab-btn ${this._activeTab==="overrides"?"active":""}"
            @click=${()=>this._activeTab="overrides"}
          >
            ${s("editor.tab_overrides",this.lang)} (${Object.keys(this._overrides).length})
          </button>
        </div>

        ${this._activeTab==="global"?c`
              <div class="form-grid">
                <!-- UID -->
                <div class="form-group full-width">
                  <label>${s("editor.uid",this.lang)}</label>
                  <div class="uid-group">
                    <input
                      type="text"
                      placeholder=${s("editor.uid_hint",this.lang)}
                      .value=${this._uid}
                      @input=${t=>this._uid=t.target.value}
                    />
                    <button
                      class="btn-scan"
                      @click=${()=>this.dispatchEvent(new CustomEvent("start-scan-learning",{bubbles:!0,composed:!0}))}
                    >
                      ${s("tags.scan_learn",this.lang)}
                    </button>
                  </div>
                </div>

                <!-- Name & Description -->
                <div class="form-group">
                  <label>${s("editor.name",this.lang)}</label>
                  <input
                    type="text"
                    placeholder="z.B. Die drei ???"
                    .value=${this._name}
                    @input=${t=>this._name=t.target.value}
                  />
                </div>

                <div class="form-group">
                  <label>${s("editor.image",this.lang)}</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    .value=${this._image}
                    @input=${t=>this._image=t.target.value}
                  />
                </div>

                <div class="form-group full-width">
                  <label>${s("editor.desc",this.lang)}</label>
                  <textarea
                    rows="2"
                    placeholder="Notizen..."
                    .value=${this._description}
                    @input=${t=>this._description=t.target.value}
                  ></textarea>
                </div>

                <!-- Media Selection -->
                <div class="form-group">
                  <label>${s("editor.media_type",this.lang)}</label>
                  <select
                    .value=${this._mediaType}
                    @change=${t=>this._mediaType=t.target.value}
                  >
                    <option value="playlist">${s("tags.filter_playlist",this.lang)}</option>
                    <option value="album">${s("tags.filter_album",this.lang)}</option>
                    <option value="audiobook">${s("tags.filter_audiobook",this.lang)}</option>
                    <option value="track">${s("tags.filter_track",this.lang)}</option>
                    <option value="radio">${s("tags.filter_radio",this.lang)}</option>
                    <option value="podcast">${s("tags.filter_podcast",this.lang)}</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>${s("editor.media_title",this.lang)}</label>
                  <input
                    type="text"
                    placeholder="Titel..."
                    .value=${this._mediaTitle}
                    @input=${t=>this._mediaTitle=t.target.value}
                  />
                </div>

                <div class="form-group full-width">
                  <label>${s("editor.media_id",this.lang)}</label>
                  <div class="media-search-group">
                    <input
                      type="text"
                      placeholder="spotify://playlist/..."
                      .value=${this._mediaId}
                      @input=${t=>this._mediaId=t.target.value}
                    />
                    <button
                      class="btn-search"
                      @click=${()=>this.dispatchEvent(new CustomEvent("open-media-browser",{bubbles:!0,composed:!0}))}
                    >
                      ${s("editor.browse_ma",this.lang)}
                    </button>
                  </div>
                </div>

                <!-- Playback Settings -->
                <div class="form-group">
                  <label>${s("editor.settings",this.lang)}</label>
                  <div class="checkbox-row">
                    <input
                      type="checkbox"
                      id="cb-resume"
                      .checked=${this._resume}
                      @change=${t=>this._resume=t.target.checked}
                    />
                    <label for="cb-resume"
                      >${s("editor.resume",this.lang)}</label
                    >
                  </div>
                  <div class="checkbox-row">
                    <input
                      type="checkbox"
                      id="cb-shuffle"
                      .checked=${this._shuffle}
                      @change=${t=>this._shuffle=t.target.checked}
                    />
                    <label for="cb-shuffle">${s("editor.shuffle",this.lang)}</label>
                  </div>
                </div>

                <div class="form-group">
                  <label>${s("editor.repeat",this.lang)}</label>
                  <select
                    .value=${this._repeat}
                    @change=${t=>this._repeat=t.target.value}
                  >
                    <option value="off">${s("editor.repeat_off",this.lang)}</option>
                    <option value="one">${s("editor.repeat_one",this.lang)}</option>
                    <option value="all">${s("editor.repeat_all",this.lang)}</option>
                  </select>
                </div>
              </div>
            `:c`
              <!-- Overrides Tab -->
              <div class="overrides-header">
                ${s("editor.overrides_hint",this.lang)}
              </div>

              <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                <select
                  style="flex: 1;"
                  .value=${this._selectedOverrideBoxId}
                  @change=${t=>this._selectedOverrideBoxId=t.target.value}
                >
                  ${this.boxes.map(t=>c`<option value="${t.id}">${t.name}</option>`)}
                </select>
                <button
                  class="btn btn-save"
                  style="white-space: nowrap;"
                  @click=${this._addOverride}
                >
                  ${s("editor.add_override",this.lang)}
                </button>
              </div>

              ${Object.keys(this._overrides).length===0?c`<div style="text-align: center; color: #888; padding: 20px;">
                    ${this.lang.startsWith("en")?"No overrides configured. This figure behaves the same on all boxes.":"Keine Overrides konfiguriert. Diese Figur verh\xE4lt sich auf allen Boxen gleich."}
                  </div>`:Object.entries(this._overrides).map(([t,i])=>{let a=this.boxes.find(r=>r.id===t);return c`
                      <div class="override-item">
                        <div class="override-top">
                          <span>📻 ${a?a.name:t}</span>
                          <button
                            style="background: transparent; border: none; color: #d32f2f; cursor: pointer;"
                            @click=${()=>this._removeOverride(t)}
                          >
                            ${s("editor.delete_override",this.lang)} ✕
                          </button>
                        </div>
                        <div class="form-group">
                          <label>${s("editor.media_id",this.lang)}</label>
                          <input
                            type="text"
                            placeholder="playlist-id"
                            .value=${i.media?.media_id||""}
                            @input=${r=>{let l=r.target.value;this._overrides[t]={...this._overrides[t],media:{...this._overrides[t].media||{},media_id:l}}}}
                          />
                        </div>
                      </div>
                    `})}
            `}

        <div class="footer-actions">
          <button class="btn btn-cancel" @click=${this._onCancel}>
            ${s("common.cancel",this.lang)}
          </button>
          <button class="btn btn-save" @click=${this._onSave}>
            ${s("common.save",this.lang)}
          </button>
        </div>
      </div>
    `}};m.styles=b`
    :host {
      display: block;
    }

    .editor-card {
      background: var(--card-background-color, #ffffff);
      border-radius: 12px;
      padding: 24px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 12px rgba(0, 0, 0, 0.08));
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      max-width: 800px;
      margin: 0 auto;
    }

    .title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .title {
      font-size: 20px;
      font-weight: 700;
      color: var(--primary-text-color, #111);
      margin: 0;
    }

    .tabs-row {
      display: flex;
      gap: 12px;
      border-bottom: 1px solid var(--divider-color, #eee);
      margin-bottom: 20px;
    }

    .tab-btn {
      background: transparent;
      border: none;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color, #666);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.15s ease;
    }

    .tab-btn.active {
      color: var(--primary-color, #03a9f4);
      border-bottom-color: var(--primary-color, #03a9f4);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .full-width {
      grid-column: span 2;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    label {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color, #333);
    }

    input[type="text"],
    input[type="number"],
    select,
    textarea {
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #ffffff);
      color: var(--primary-text-color, #111);
      font-size: 14px;
    }

    .uid-group {
      display: flex;
      gap: 8px;
    }

    .uid-group input {
      flex: 1;
      font-family: monospace;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 1px;
    }

    .btn-scan {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color, #222);
      border: 1px solid var(--divider-color, #ccc);
      padding: 0 14px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .media-search-group {
      display: flex;
      gap: 8px;
    }

    .media-search-group input {
      flex: 1;
    }

    .btn-search {
      background: var(--primary-color, #03a9f4);
      color: white;
      border: none;
      padding: 0 14px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }

    .checkbox-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
    }

    .checkbox-row input {
      width: 18px;
      height: 18px;
      accent-color: var(--primary-color, #03a9f4);
    }

    .preview-box {
      margin-top: 10px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      background: var(--secondary-background-color, #f9f9f9);
      border-radius: 8px;
    }

    .preview-thumb {
      width: 50px;
      height: 50px;
      border-radius: 6px;
      object-fit: cover;
      background: #ddd;
    }

    /* Overrides section */
    .overrides-header {
      background: var(--secondary-background-color, #f8f9fa);
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 16px;
      font-size: 13px;
      color: var(--secondary-text-color, #555);
    }

    .override-item {
      border: 1px solid var(--divider-color, #eee);
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 12px;
      background: var(--card-background-color, #fff);
    }

    .override-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      font-weight: 600;
    }

    .footer-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--divider-color, #eee);
    }

    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
    }

    .btn-save {
      background: var(--primary-color, #03a9f4);
      color: white;
    }

    .btn-cancel {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color, #222);
    }
  `,n([p({type:Object})],m.prototype,"tag",2),n([p({type:Array})],m.prototype,"boxes",2),n([p({type:String})],m.prototype,"initialUid",2),n([p({type:String})],m.prototype,"lang",2),n([d()],m.prototype,"_uid",2),n([d()],m.prototype,"_name",2),n([d()],m.prototype,"_description",2),n([d()],m.prototype,"_image",2),n([d()],m.prototype,"_mediaProvider",2),n([d()],m.prototype,"_mediaType",2),n([d()],m.prototype,"_mediaId",2),n([d()],m.prototype,"_mediaTitle",2),n([d()],m.prototype,"_mediaArtist",2),n([d()],m.prototype,"_resume",2),n([d()],m.prototype,"_shuffle",2),n([d()],m.prototype,"_repeat",2),n([d()],m.prototype,"_volumeLimit",2),n([d()],m.prototype,"_overrides",2),n([d()],m.prototype,"_activeTab",2),n([d()],m.prototype,"_selectedOverrideBoxId",2),m=n([f("tonieesp-tag-editor-view")],m);var H=class extends u{constructor(){super(...arguments);this.lang="de"}_onSelect(t){t.stopPropagation(),this.dispatchEvent(new CustomEvent("media-selected",{detail:this.item,bubbles:!0,composed:!0}))}render(){return this.item?c`
      <div class="card" @click=${this._onSelect}>
        ${this.item.image?c`<img class="thumbnail" src="${this.item.image}" alt="Cover" />`:c`<div class="thumbnail">🎵</div>`}
        <div class="info">
          <div class="title">${this.item.title}</div>
          <div class="subtitle">
            <span class="type-badge">${this.item.media_type}</span>
            ${this.item.artist?` \u2022 ${this.item.artist}`:""}
          </div>
        </div>
        <button class="btn-select" @click=${this._onSelect}>${s("browser.select_btn",this.lang)}</button>
      </div>
    `:c``}};H.styles=b`
    :host {
      display: block;
    }

    .card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      border-radius: 8px;
      background: var(--card-background-color, #ffffff);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      transition: background 0.15s ease, box-shadow 0.15s ease;
      cursor: pointer;
    }

    .card:hover {
      background: var(--secondary-background-color, #f9f9f9);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .thumbnail {
      width: 50px;
      height: 50px;
      border-radius: 6px;
      object-fit: cover;
      background: var(--secondary-background-color, #eee);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }

    .info {
      flex: 1;
      min-width: 0;
    }

    .title {
      font-weight: 600;
      font-size: 14px;
      color: var(--primary-text-color, #111);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .subtitle {
      font-size: 12px;
      color: var(--secondary-text-color, #666);
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .type-badge {
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(33, 150, 243, 0.1);
      color: #1976d2;
      text-transform: capitalize;
    }

    .btn-select {
      background: var(--primary-color, #03a9f4);
      color: #fff;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 13px;
      cursor: pointer;
      flex-shrink: 0;
    }

    .btn-select:hover {
      opacity: 0.9;
    }
  `,n([p({type:Object})],H.prototype,"item",2),n([p({type:String})],H.prototype,"lang",2),H=n([f("tonieesp-media-item-card")],H);var w=class extends u{constructor(){super(...arguments);this.lang="de";this._query="";this._loading=!1;this._results=[];this._searched=!1;this._selectedType=""}async _onSearch(t){if(t&&t.preventDefault(),!(!this._query.trim()||!this.api)){this._loading=!0,this._searched=!0;try{let i=this._selectedType?[this._selectedType]:void 0,a=await this.api.searchMedia(this._query.trim(),i);this._results=a||[]}catch(i){console.error("Error searching media:",i),this._results=[]}finally{this._loading=!1}}}render(){return c`
      <div class="container">
        <div class="header-row">
          <h2 class="title">${s("browser.title",this.lang)}</h2>
          <p class="subtitle">
            ${s("browser.subtitle",this.lang)}
          </p>

          <form class="search-row" @submit=${this._onSearch}>
            <input
              class="search-input"
              type="search"
              placeholder=${s("browser.search_placeholder",this.lang)}
              .value=${this._query}
              @input=${t=>this._query=t.target.value}
            />
            <button
              class="btn-search"
              type="submit"
              ?disabled=${this._loading||!this._query.trim()}
            >
              ${this._loading?s("browser.searching",this.lang):s("browser.search_btn",this.lang)}
            </button>
          </form>
        </div>

        <div class="results-grid">
          ${this._results.map(t=>c`<tonieesp-media-item-card .item=${t} .lang=${this.lang}></tonieesp-media-item-card>`)}
          ${this._searched&&!this._loading&&this._results.length===0?c`<div class="empty-state">
                ${s("browser.no_results",this.lang)}
              </div>`:""}
        </div>
      </div>
    `}};w.styles=b`
    :host {
      display: block;
    }

    .container {
      background: var(--card-background-color, #ffffff);
      border-radius: 12px;
      padding: 20px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }

    .header-row {
      margin-bottom: 16px;
    }

    .title {
      font-size: 20px;
      font-weight: 700;
      color: var(--primary-text-color, #111);
      margin: 0;
    }

    .subtitle {
      font-size: 13px;
      color: var(--secondary-text-color, #666);
      margin: 4px 0 0 0;
    }

    .search-row {
      display: flex;
      gap: 8px;
      margin-top: 14px;
    }

    .search-input {
      flex: 1;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #111);
      font-size: 14px;
    }

    .btn-search {
      background: var(--primary-color, #03a9f4);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-search:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .results-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 20px;
    }

    .empty-state {
      text-align: center;
      padding: 30px;
      color: var(--secondary-text-color, #777);
    }
  `,n([p({type:Object})],w.prototype,"api",2),n([p({type:String})],w.prototype,"lang",2),n([d()],w.prototype,"_query",2),n([d()],w.prototype,"_loading",2),n([d()],w.prototype,"_results",2),n([d()],w.prototype,"_searched",2),n([d()],w.prototype,"_selectedType",2),w=n([f("tonieesp-media-browser-view")],w);var k=class extends u{constructor(){super(...arguments);this.lang="de";this._pauseOnRemoval=!0;this._resumeOnReplace=!0;this._maxVolume=.8;this._seekStep=10;this._gesturesEnabled=!0;this._leftTapAction="previous_track";this._rightTapAction="next_track";this._leftTiltAction="seek_backward";this._rightTiltAction="seek_forward"}connectedCallback(){if(super.connectedCallback(),this.box?.settings){let t=this.box.settings;this._pauseOnRemoval=t.pause_on_removal!==!1,this._resumeOnReplace=t.resume_on_replace!==!1,this._maxVolume=t.max_volume||.8,this._seekStep=t.seek_step||10,this._gesturesEnabled=t.gestures_enabled!==!1,this._leftTapAction=t.left_tap_action||"previous_track",this._rightTapAction=t.right_tap_action||"next_track",this._leftTiltAction=t.left_tilt_action||"seek_backward",this._rightTiltAction=t.right_tilt_action||"seek_forward"}}_onSave(){let t={pause_on_removal:this._pauseOnRemoval,resume_on_replace:this._resumeOnReplace,max_volume:this._maxVolume,seek_step:this._seekStep,gestures_enabled:this._gesturesEnabled,left_tap_action:this._leftTapAction,right_tap_action:this._rightTapAction,left_tilt_action:this._leftTiltAction,right_tilt_action:this._rightTiltAction};this.dispatchEvent(new CustomEvent("save-box-settings",{detail:{boxId:this.box.id,settings:t},bubbles:!0,composed:!0}))}_onBack(){this.dispatchEvent(new CustomEvent("back-to-dashboard",{bubbles:!0,composed:!0}))}render(){return this.box?c`
      <div class="container">
        <div class="header-row">
          <h2 class="title">📻 ${s("box.detail_title",this.lang,{name:this.box.name})}</h2>
          <button class="btn btn-back" @click=${this._onBack}>
            ${s("box.back",this.lang)}
          </button>
        </div>

        <!-- Automation & Playback Behavior -->
        <div class="section" style="border: none; padding-top: 0;">
          <h3 class="section-title">${s("box.section_playback",this.lang)}</h3>
          <div class="checkbox-setting">
            <input
              type="checkbox"
              id="pause_rem"
              .checked=${this._pauseOnRemoval}
              @change=${t=>this._pauseOnRemoval=t.target.checked}
            />
            <label for="pause_rem"
              >${s("box.pause_removal",this.lang)}</label
            >
          </div>
          <div class="checkbox-setting">
            <input
              type="checkbox"
              id="resume_rep"
              .checked=${this._resumeOnReplace}
              @change=${t=>this._resumeOnReplace=t.target.checked}
            />
            <label for="resume_rep"
              >${s("box.resume_replace",this.lang)}</label
            >
          </div>

          <div class="setting-group" style="margin-top: 12px;">
            <label>${s("box.max_volume",this.lang)} (${Math.round(this._maxVolume*100)}%)</label>
            <div class="slider-row">
              <span>0%</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                .value=${String(this._maxVolume)}
                @input=${t=>this._maxVolume=parseFloat(t.target.value)}
              />
              <span>100%</span>
            </div>
          </div>
        </div>

        <!-- Gestures -->
        <div class="section">
          <h3 class="section-title">${s("box.section_gestures",this.lang)}</h3>
          <div class="checkbox-setting" style="margin-bottom: 12px;">
            <input
              type="checkbox"
              id="gest_en"
              .checked=${this._gesturesEnabled}
              @change=${t=>this._gesturesEnabled=t.target.checked}
            />
            <label for="gest_en">${s("box.gestures_enabled",this.lang)}</label>
          </div>

          <div class="grid-2">
            <div class="setting-group">
              <label>${s("box.left_tap",this.lang)}</label>
              <select
                .value=${this._leftTapAction}
                @change=${t=>this._leftTapAction=t.target.value}
              >
                <option value="previous_track">${s("action.previous_track",this.lang)}</option>
                <option value="next_track">${s("action.next_track",this.lang)}</option>
                <option value="play_pause">${s("action.play_pause",this.lang)}</option>
                <option value="volume_down">${s("action.volume_down",this.lang)}</option>
                <option value="none">${s("action.none",this.lang)}</option>
              </select>
            </div>

            <div class="setting-group">
              <label>${s("box.right_tap",this.lang)}</label>
              <select
                .value=${this._rightTapAction}
                @change=${t=>this._rightTapAction=t.target.value}
              >
                <option value="next_track">${s("action.next_track",this.lang)}</option>
                <option value="previous_track">${s("action.previous_track",this.lang)}</option>
                <option value="play_pause">${s("action.play_pause",this.lang)}</option>
                <option value="volume_up">${s("action.volume_up",this.lang)}</option>
                <option value="none">${s("action.none",this.lang)}</option>
              </select>
            </div>

            <div class="setting-group">
              <label>${s("box.left_tilt",this.lang)}</label>
              <select
                .value=${this._leftTiltAction}
                @change=${t=>this._leftTiltAction=t.target.value}
              >
                <option value="seek_backward">${s("action.seek_backward",this.lang)}</option>
                <option value="seek_forward">${s("action.seek_forward",this.lang)}</option>
                <option value="none">${s("action.none",this.lang)}</option>
              </select>
            </div>

            <div class="setting-group">
              <label>${s("box.right_tilt",this.lang)}</label>
              <select
                .value=${this._rightTiltAction}
                @change=${t=>this._rightTiltAction=t.target.value}
              >
                <option value="seek_forward">${s("action.seek_forward",this.lang)}</option>
                <option value="seek_backward">${s("action.seek_backward",this.lang)}</option>
                <option value="none">${s("action.none",this.lang)}</option>
              </select>
            </div>

            <div class="setting-group">
              <label>${s("box.seek_step",this.lang)}</label>
              <input
                type="number"
                min="5"
                max="60"
                step="5"
                .value=${String(this._seekStep)}
                @change=${t=>this._seekStep=parseInt(t.target.value,10)}
              />
            </div>
          </div>
        </div>

        <!-- Entity Mapping Table -->
        <div class="section">
          <h3 class="section-title">Home Assistant Entities</h3>
          <table class="entities-table">
            <thead>
              <tr>
                <th>Function</th>
                <th>Entity ID</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ESPHome Speaker</td>
                <td><code>${this.box.entities.speaker||"\u2014"}</code></td>
              </tr>
              <tr>
                <td>Music Assistant Player</td>
                <td><code>${this.box.entities.ma_player||"\u2014"}</code></td>
              </tr>
              <tr>
                <td>NFC Tag UID Sensor</td>
                <td><code>${this.box.entities.nfc_sensor||"\u2014"}</code></td>
              </tr>
              <tr>
                <td>Battery</td>
                <td><code>${this.box.entities.battery||"\u2014"}</code></td>
              </tr>
              <tr>
                <td>Charging</td>
                <td><code>${this.box.entities.charging||"\u2014"}</code></td>
              </tr>
              <tr>
                <td>LED Light</td>
                <td><code>${this.box.entities.led||"\u2014"}</code></td>
              </tr>
              <tr>
                <td>Status LED Switch</td>
                <td><code>${this.box.entities.status_led||"\u2014"}</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="actions-row">
          <button class="btn btn-back" @click=${this._onBack}>
            ${s("common.cancel",this.lang)}
          </button>
          <button class="btn btn-save" @click=${this._onSave}>
            ${s("common.save",this.lang)}
          </button>
        </div>
      </div>
    `:c``}};k.styles=b`
    :host {
      display: block;
    }

    .container {
      background: var(--card-background-color, #ffffff);
      border-radius: 12px;
      padding: 24px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      max-width: 800px;
      margin: 0 auto;
    }

    .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .title {
      font-size: 22px;
      font-weight: 700;
      color: var(--primary-text-color, #111);
      margin: 0;
    }

    .section {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--divider-color, #eee);
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color, #222);
      margin-bottom: 14px;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .setting-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .checkbox-setting {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
    }

    .checkbox-setting input {
      width: 18px;
      height: 18px;
      accent-color: var(--primary-color, #03a9f4);
    }

    label {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color, #333);
    }

    select,
    input[type="number"] {
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #111);
      font-size: 14px;
    }

    .slider-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .slider-row input[type="range"] {
      flex: 1;
      accent-color: var(--primary-color, #03a9f4);
    }

    .entities-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-top: 8px;
    }

    .entities-table th,
    .entities-table td {
      text-align: left;
      padding: 8px 10px;
      border-bottom: 1px solid var(--divider-color, #eee);
    }

    .entities-table th {
      color: var(--secondary-text-color, #666);
      font-weight: 600;
    }

    .entities-table code {
      font-family: monospace;
      background: var(--secondary-background-color, #f0f0f0);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .actions-row {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--divider-color, #eee);
    }

    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
    }

    .btn-save {
      background: var(--primary-color, #03a9f4);
      color: white;
    }

    .btn-back {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color, #222);
    }
  `,n([p({type:Object})],k.prototype,"box",2),n([p({type:String})],k.prototype,"lang",2),n([d()],k.prototype,"_pauseOnRemoval",2),n([d()],k.prototype,"_resumeOnReplace",2),n([d()],k.prototype,"_maxVolume",2),n([d()],k.prototype,"_seekStep",2),n([d()],k.prototype,"_gesturesEnabled",2),n([d()],k.prototype,"_leftTapAction",2),n([d()],k.prototype,"_rightTapAction",2),n([d()],k.prototype,"_leftTiltAction",2),n([d()],k.prototype,"_rightTiltAction",2),k=n([f("tonieesp-box-detail-view")],k);var A=class extends u{constructor(){super(...arguments);this.lang="de";this._diagnostics=null;this._overwrite=!1;this._message="";this._isError=!1}async connectedCallback(){super.connectedCallback(),await this._loadDiagnostics()}async _loadDiagnostics(){if(this.api)try{this._diagnostics=await this.api.getDiagnostics()}catch(t){console.error("Error loading diagnostics:",t)}}async _exportTags(){if(this.api)try{let t=await this.api.exportTags(),i=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),a=URL.createObjectURL(i),r=document.createElement("a");r.href=a,r.download=`tonieesp-tags-${new Date().toISOString().slice(0,10)}.json`,r.click(),URL.revokeObjectURL(a),this._showMessage(s("common.save_success",this.lang),!1)}catch(t){this._showMessage(s("common.error",this.lang,{error:t?.message||t}),!0)}}_triggerFileInput(){let t=this.shadowRoot?.querySelector("#file-input");t&&t.click()}async _onFileSelected(t){let i=t.target;if(!i.files||i.files.length===0)return;let a=i.files[0],r=new FileReader;r.onload=async()=>{try{let l=JSON.parse(r.result);if(!Array.isArray(l))throw new Error("Invalid format. Expected a JSON array.");let g=await this.api.importTags(l,this._overwrite);this._showMessage(this.lang.startsWith("en")?`Successfully imported: ${g.count} tags added / updated.`:`Erfolgreich importiert: ${g.count} Figuren hinzugef\xFCgt / aktualisiert.`,!1),this.dispatchEvent(new CustomEvent("tags-imported",{bubbles:!0,composed:!0}))}catch(l){this._showMessage(s("common.error",this.lang,{error:l?.message||l}),!0)}},r.readAsText(a),i.value=""}_showMessage(t,i){this._message=t,this._isError=i,setTimeout(()=>{this._message=""},5e3)}render(){return c`
      <div class="container">
        <h2 class="title">${s("settings.title",this.lang)}</h2>
        <p class="subtitle">
          ${s("settings.subtitle",this.lang)}
        </p>

        ${this._message?c`
              <div
                class="alert ${this._isError?"alert-error":"alert-success"}"
              >
                ${this._message}
              </div>
            `:""}

        <!-- Export -->
        <div class="card-block">
          <h3 class="block-title">${s("settings.export",this.lang)}</h3>
          <p class="block-desc">
            ${s("settings.export_desc",this.lang)}
          </p>
          <button class="btn btn-secondary" @click=${this._exportTags}>
            📥 ${s("settings.export_btn",this.lang)}
          </button>
        </div>

        <!-- Import -->
        <div class="card-block">
          <h3 class="block-title">${s("settings.import",this.lang)}</h3>
          <p class="block-desc">
            ${s("settings.import_desc",this.lang)}
          </p>
          <div class="checkbox-row">
            <input
              type="checkbox"
              id="cb-overwrite"
              .checked=${this._overwrite}
              @change=${t=>this._overwrite=t.target.checked}
            />
            <label for="cb-overwrite"
              >${s("settings.overwrite",this.lang)}</label
            >
          </div>
          <input
            type="file"
            id="file-input"
            accept=".json"
            @change=${this._onFileSelected}
          />
          <button class="btn btn-primary" @click=${this._triggerFileInput}>
            📤 ${s("settings.import_btn",this.lang)}
          </button>
        </div>

        <!-- Diagnostics -->
        ${this._diagnostics?c`
              <div class="card-block">
                <h3 class="block-title">${s("settings.diagnostics",this.lang)}</h3>
                <p class="block-desc">
                  Tonieboxes: <strong>${this._diagnostics.box_count}</strong> |
                  Tags: <strong>${this._diagnostics.tag_count}</strong> |
                  Music Assistant:
                  <strong
                    style="color: ${this._diagnostics.music_assistant_available?"#2e7d32":"#c62828"};"
                  >
                    ${this._diagnostics.music_assistant_available?this.lang.startsWith("en")?"Connected":"Verbunden":this.lang.startsWith("en")?"Unavailable":"Nicht verf\xFCgbar"}
                  </strong>
                </p>
              </div>
            `:""}
      </div>
    `}};A.styles=b`
    :host {
      display: block;
    }

    .container {
      background: var(--card-background-color, #ffffff);
      border-radius: 12px;
      padding: 24px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      max-width: 800px;
      margin: 0 auto;
    }

    .title {
      font-size: 22px;
      font-weight: 700;
      color: var(--primary-text-color, #111);
      margin: 0 0 4px 0;
    }

    .subtitle {
      font-size: 14px;
      color: var(--secondary-text-color, #666);
      margin-bottom: 24px;
    }

    .card-block {
      border: 1px solid var(--divider-color, #eee);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
    }

    .block-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color, #222);
      margin: 0 0 6px 0;
    }

    .block-desc {
      font-size: 13px;
      color: var(--secondary-text-color, #555);
      margin: 0 0 14px 0;
    }

    .btn {
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .btn-primary {
      background: var(--primary-color, #03a9f4);
      color: white;
    }

    .btn-secondary {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color, #222);
    }

    .checkbox-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 10px 0;
      font-size: 13px;
    }

    .alert {
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 20px;
    }

    .alert-success {
      background: rgba(76, 175, 80, 0.15);
      color: #2e7d32;
    }

    .alert-error {
      background: rgba(244, 67, 54, 0.15);
      color: #c62828;
    }

    input[type="file"] {
      display: none;
    }
  `,n([p({type:Object})],A.prototype,"api",2),n([p({type:String})],A.prototype,"lang",2),n([d()],A.prototype,"_diagnostics",2),n([d()],A.prototype,"_overwrite",2),n([d()],A.prototype,"_message",2),n([d()],A.prototype,"_isError",2),A=n([f("tonieesp-settings-view")],A);var D=class extends u{constructor(){super(...arguments);this.logs=[];this.lang="de"}render(){return c`
      <div class="container">
        <div class="header-row">
          <h2 class="title">${s("logs.title",this.lang)}</h2>
          <button
            class="btn-clear"
            @click=${()=>this.dispatchEvent(new CustomEvent("clear-logs",{bubbles:!0,composed:!0}))}
          >
            ${s("logs.clear_btn",this.lang)}
          </button>
        </div>

        <div class="log-list">
          ${this.logs.length===0?c`<div class="empty-state">
                ${s("logs.empty",this.lang)}
              </div>`:this.logs.map(t=>{let i="";return t.type.includes("tag")&&(i="log-type-tag"),(t.type.includes("gesture")||t.type.includes("tap")||t.type.includes("tilt"))&&(i="log-type-gesture"),c`
                  <div class="log-item">
                    <span class="log-time">${t.timestamp}</span>
                    <span class="log-type ${i}">${t.type}</span>
                    <span class="log-summary">${t.summary}</span>
                  </div>
                `})}
        </div>
      </div>
    `}};D.styles=b`
    :host {
      display: block;
    }

    .container {
      background: var(--card-background-color, #ffffff);
      border-radius: 12px;
      padding: 20px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }

    .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .title {
      font-size: 20px;
      font-weight: 700;
      color: var(--primary-text-color, #111);
      margin: 0;
    }

    .btn-clear {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color, #222);
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .log-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 550px;
      overflow-y: auto;
    }

    .log-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 12px;
      background: var(--secondary-background-color, #f9f9f9);
      border-radius: 6px;
      font-family: monospace;
      font-size: 13px;
    }

    .log-time {
      color: var(--secondary-text-color, #888);
      white-space: nowrap;
      font-size: 11px;
      margin-top: 2px;
    }

    .log-type {
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(3, 169, 244, 0.15);
      color: #0288d1;
      font-size: 11px;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .log-type-tag {
      background: rgba(76, 175, 80, 0.15);
      color: #2e7d32;
    }

    .log-type-gesture {
      background: rgba(156, 39, 176, 0.15);
      color: #7b1fa2;
    }

    .log-summary {
      flex: 1;
      color: var(--primary-text-color, #222);
      word-break: break-all;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: var(--secondary-text-color, #888);
    }
  `,n([p({type:Array})],D.prototype,"logs",2),n([p({type:String})],D.prototype,"lang",2),D=n([f("tonieesp-logs-view")],D);var y=class extends u{constructor(){super(...arguments);this.narrow=!1;this._lang="de";this._activeView="dashboard";this._boxes=[];this._tags=[];this._logs=[];this._initialUid="";this._isLearning=!1;this._learnedUid=null}connectedCallback(){super.connectedCallback();try{let t=localStorage.getItem("tonieesp_lang");if(t==="en"||t==="de")this._lang=t;else if(this.hass?.locale?.language||this.hass?.language){let i=(this.hass.locale?.language||this.hass.language||"").toLowerCase();this._lang=i.startsWith("en")?"en":"de"}}catch{this._lang="de"}}_setLanguage(t){this._lang=t;try{localStorage.setItem("tonieesp_lang",t)}catch{}this.requestUpdate()}updated(t){if(t.has("hass")&&this.hass){if(!localStorage.getItem("tonieesp_lang")){let i=(this.hass.locale?.language||this.hass.language||"").toLowerCase();this._lang=i.startsWith("en")?"en":"de"}this._api?this._api.updateHass(this.hass):(this._api=new st(this.hass),this._initData(),this._subscribeToEvents())}}disconnectedCallback(){super.disconnectedCallback(),this._unsubEvents&&(this._unsubEvents(),this._unsubEvents=void 0)}async _initData(){if(this._api)try{let[t,i]=await Promise.all([this._api.getBoxes(),this._api.getTags()]);this._boxes=t||[],this._tags=i||[],this._addLog("init",`TonieESP geladen: ${this._boxes.length} Boxen, ${this._tags.length} Tags`)}catch(t){console.error("Error loading TonieESP initial data:",t)}}async _subscribeToEvents(){if(this._api)try{this._unsubEvents=await this._api.subscribeEvents(t=>{this._handleIncomingEvent(t)})}catch(t){console.error("Error subscribing to TonieESP events:",t)}}_handleIncomingEvent(t){let{event_type:i,data:a}=t;if(i==="box_box_updated"||i==="box_box_added"){let r=a;this._boxes=this._boxes.map(l=>l.id===r.id?r:l),this._boxes.find(l=>l.id===r.id)||(this._boxes=[...this._boxes,r]),this._addLog("box",`Toniebox '${r.name}' aktualisiert (Online: ${r.online})`)}else i==="box_box_removed"?(this._boxes=this._boxes.filter(r=>r.id!==a.id),this._addLog("box",`Toniebox '${a.name}' entfernt`)):i==="tag_create"||i==="tag_update"||i==="tag_delete"?(this._api?.getTags().then(r=>this._tags=r),this._addLog("tag",`NFC-Bibliothek aktualisiert (${i})`)):i==="tag_learned"?(this._learnedUid=a.uid,this._addLog("learn",`Figur erfasst im Lernmodus: ${a.uid}`)):this._addLog("event",`${i}: ${JSON.stringify(a)}`)}_addLog(t,i,a){let r={id:Math.random().toString(36).substring(2,9),timestamp:new Date().toLocaleTimeString(),type:t,summary:i,details:a};this._logs=[r,...this._logs.slice(0,99)]}async _handleBoxControl(t){let{boxId:i,action:a,data:r}=t.detail;if(this._api)try{await this._api.controlPlayback(i,a,r),this._addLog("playback",`Action '${a}' sent to box`)}catch(l){alert(s("common.error",this._lang,{error:l?.message||l}))}}async _handlePlayTagOnBox(t){let{tag:i,boxId:a}=t.detail;if(this._api)try{await this._api.controlPlayback(a,"play_tag",{uid:i.uid}),this._addLog("playback",`Tag ${i.name} (${i.uid}) started on box`)}catch(r){alert(s("common.error",this._lang,{error:r?.message||r}))}}_handleSetupUnknownTag(t){let{uid:i}=t.detail;this._editingTag=void 0,this._initialUid=i,this._activeView="editor"}_handleOpenBoxDetails(t){this._selectedBox=t.detail.box,this._activeView="detail"}async _handleSaveBoxSettings(t){let{boxId:i,settings:a}=t.detail;if(this._api)try{let r=await this._api.updateBoxSettings(i,a);this._boxes=this._boxes.map(l=>l.id===r.id?r:l),alert(s("box.save_success",this._lang)),this._activeView="dashboard"}catch(r){alert(s("common.error",this._lang,{error:r?.message||r}))}}_handleAddNewTag(){this._editingTag=void 0,this._initialUid="",this._activeView="editor"}_handleEditTag(t){this._editingTag=t.detail.tag,this._initialUid="",this._activeView="editor"}async _handleDeleteTag(t){let{tag:i}=t.detail;if(confirm(s("tags.confirm_delete",this._lang,{name:i.name,uid:i.uid}))&&this._api)try{await this._api.deleteTag(i.uid),this._tags=this._tags.filter(a=>a.uid!==i.uid),this._addLog("tag",`Tag '${i.name}' deleted`)}catch(a){alert(s("common.error",this._lang,{error:a?.message||a}))}}async _handleSaveTagRecord(t){let{tag:i}=t.detail;if(this._api)try{let a=await this._api.saveTag(i),r=this._tags.findIndex(l=>l.uid===a.uid);r>=0?this._tags[r]=a:this._tags=[a,...this._tags],this._tags=[...this._tags],this._activeView="tags",this._addLog("tag",`Tag '${a.name}' saved`)}catch(a){alert(s("common.error",this._lang,{error:a?.message||a}))}}async _handleStartScanLearning(){this._isLearning=!0,this._learnedUid=null,this._api&&await this._api.startLearning()}async _handleStopScanLearning(){this._isLearning=!1,this._learnedUid=null,this._api&&await this._api.stopLearning()}_handleUseLearnedTag(){if(!this._learnedUid)return;let t=this._learnedUid;this._handleStopScanLearning(),this._editingTag=void 0,this._initialUid=t,this._activeView="editor"}_handleMediaSelectedFromBrowser(t){let i=t.detail;this._activeView="editor";let a=this.shadowRoot?.querySelector("tonieesp-tag-editor-view");a&&a.setMediaSelection&&a.setMediaSelection(i)}render(){return c`
      <!-- Top Navigation Bar -->
      <header class="top-bar">
        <div class="brand" @click=${()=>this._activeView="dashboard"}>
          <span class="logo">📻</span>
          <span class="brand-title">TonieESP</span>
          <span class="brand-badge">PRO</span>
        </div>

        <nav class="nav-tabs">
          <button
            class="nav-btn ${this._activeView==="dashboard"?"active":""}"
            @click=${()=>this._activeView="dashboard"}
          >
            📊 ${s("nav.dashboard",this._lang)}
          </button>
          <button
            class="nav-btn ${this._activeView==="tags"||this._activeView==="editor"?"active":""}"
            @click=${()=>this._activeView="tags"}
          >
            🧸 ${s("nav.tags",this._lang)} (${this._tags.length})
          </button>
          <button
            class="nav-btn ${this._activeView==="browser"?"active":""}"
            @click=${()=>this._activeView="browser"}
          >
            🎵 ${s("nav.browser",this._lang)}
          </button>
          <button
            class="nav-btn ${this._activeView==="settings"?"active":""}"
            @click=${()=>this._activeView="settings"}
          >
            ⚙️ ${s("nav.settings",this._lang)}
          </button>
          <button
            class="nav-btn ${this._activeView==="logs"?"active":""}"
            @click=${()=>this._activeView="logs"}
          >
            📋 ${s("nav.logs",this._lang)}
          </button>
        </nav>

        <div class="lang-switch">
          <button
            class="lang-btn ${this._lang==="de"?"active":""}"
            @click=${()=>this._setLanguage("de")}
            title="Deutsch"
          >
            DE
          </button>
          <button
            class="lang-btn ${this._lang==="en"?"active":""}"
            @click=${()=>this._setLanguage("en")}
            title="English"
          >
            EN
          </button>
        </div>
      </header>

      <!-- Main View Area -->
      <main
        class="content-area"
        @box-control=${this._handleBoxControl}
        @play-tag-on-box=${this._handlePlayTagOnBox}
        @setup-unknown-tag=${this._handleSetupUnknownTag}
        @open-box-details=${this._handleOpenBoxDetails}
        @save-box-settings=${this._handleSaveBoxSettings}
        @back-to-dashboard=${()=>this._activeView="dashboard"}
        @add-new-tag=${this._handleAddNewTag}
        @edit-tag=${this._handleEditTag}
        @delete-tag=${this._handleDeleteTag}
        @save-tag-record=${this._handleSaveTagRecord}
        @cancel-tag-edit=${()=>this._activeView="tags"}
        @open-media-browser=${()=>this._activeView="browser"}
        @media-selected=${this._handleMediaSelectedFromBrowser}
        @start-scan-learning=${this._handleStartScanLearning}
        @tags-imported=${()=>this._api?.getTags().then(t=>this._tags=t)}
        @clear-logs=${()=>this._logs=[]}
      >
        ${this._activeView==="dashboard"?c`<tonieesp-dashboard-view
              .boxes=${this._boxes}
              .tags=${this._tags}
              .lang=${this._lang}
            ></tonieesp-dashboard-view>`:""}
        ${this._activeView==="tags"?c`<tonieesp-tag-library-view
              .tags=${this._tags}
              .boxes=${this._boxes}
              .lang=${this._lang}
            ></tonieesp-tag-library-view>`:""}
        ${this._activeView==="editor"?c`<tonieesp-tag-editor-view
              .tag=${this._editingTag}
              .boxes=${this._boxes}
              .initialUid=${this._initialUid}
              .lang=${this._lang}
            ></tonieesp-tag-editor-view>`:""}
        ${this._activeView==="detail"&&this._selectedBox?c`<tonieesp-box-detail-view
              .box=${this._selectedBox}
              .lang=${this._lang}
            ></tonieesp-box-detail-view>`:""}
        ${this._activeView==="browser"?c`<tonieesp-media-browser-view
              .api=${this._api}
              .lang=${this._lang}
            ></tonieesp-media-browser-view>`:""}
        ${this._activeView==="settings"?c`<tonieesp-settings-view
              .api=${this._api}
              .lang=${this._lang}
            ></tonieesp-settings-view>`:""}
        ${this._activeView==="logs"?c`<tonieesp-logs-view
              .logs=${this._logs}
              .lang=${this._lang}
            ></tonieesp-logs-view>`:""}
      </main>

      <!-- Scan Learning Modal Dialog -->
      ${this._isLearning?c`
            <div class="modal-backdrop">
              <div class="modal-content">
                <div class="pulse-icon">📡</div>
                <h3 class="modal-title">${s("learn.title",this._lang)}</h3>
                <p class="modal-text">
                  ${s("learn.instructions",this._lang)}
                </p>

                ${this._learnedUid?c`
                      <div class="captured-uid">UID: ${this._learnedUid}</div>
                      <div>
                        <button
                          class="btn-modal btn-modal-cancel"
                          @click=${this._handleStopScanLearning}
                        >
                          ${s("learn.close",this._lang)}
                        </button>
                        <button
                          class="btn-modal btn-modal-use"
                          @click=${this._handleUseLearnedTag}
                        >
                          ${s("learn.use_btn",this._lang)}
                        </button>
                      </div>
                    `:c`
                      <button
                        class="btn-modal btn-modal-cancel"
                        @click=${this._handleStopScanLearning}
                      >
                        ${s("learn.cancel",this._lang)}
                      </button>
                    `}
              </div>
            </div>
          `:""}
    `}};y.styles=b`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--primary-background-color, #fafafa);
      color: var(--primary-text-color, #212121);
      font-family: var(
        --ha-font-family,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Helvetica,
        Arial,
        sans-serif
      );
      box-sizing: border-box;
      overflow-y: auto;
    }

    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 24px;
      background: var(--card-background-color, #ffffff);
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }

    .logo {
      font-size: 26px;
    }

    .brand-title {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.3px;
      color: var(--primary-text-color, #111);
    }

    .brand-badge {
      font-size: 10px;
      font-weight: 700;
      background: var(--primary-color, #03a9f4);
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .nav-tabs {
      display: flex;
      gap: 4px;
    }

    .nav-btn {
      background: transparent;
      border: none;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color, #666);
      cursor: pointer;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .nav-btn:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      color: var(--primary-text-color, #111);
    }

    .nav-btn.active {
      background: var(--primary-color, #03a9f4);
      color: #fff;
    }

    .lang-switch {
      display: inline-flex;
      background: var(--secondary-background-color, #f0f0f0);
      border-radius: 6px;
      padding: 2px;
      gap: 2px;
    }

    .lang-btn {
      background: transparent;
      border: none;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      color: var(--secondary-text-color, #666);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .lang-btn:hover {
      color: var(--primary-text-color, #111);
    }

    .lang-btn.active {
      background: var(--card-background-color, #ffffff);
      color: var(--primary-color, #03a9f4);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    .content-area {
      flex: 1;
      padding: 24px;
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
    }

    /* Learning Modal */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: var(--card-background-color, #ffffff);
      border-radius: 14px;
      padding: 28px;
      max-width: 440px;
      width: 90%;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .pulse-icon {
      font-size: 50px;
      margin-bottom: 14px;
      display: inline-block;
      animation: pulse 1.6s infinite ease-in-out;
    }

    @keyframes pulse {
      0% {
        transform: scale(0.95);
        opacity: 0.8;
      }
      50% {
        transform: scale(1.1);
        opacity: 1;
      }
      100% {
        transform: scale(0.95);
        opacity: 0.8;
      }
    }

    .modal-title {
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 8px 0;
    }

    .modal-text {
      font-size: 14px;
      color: var(--secondary-text-color, #555);
      margin: 0 0 20px 0;
      line-height: 1.4;
    }

    .captured-uid {
      font-family: monospace;
      font-size: 16px;
      font-weight: 700;
      background: rgba(76, 175, 80, 0.15);
      color: #2e7d32;
      padding: 6px 14px;
      border-radius: 6px;
      display: inline-block;
      margin-bottom: 16px;
    }

    .btn-modal {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
    }

    .btn-modal-cancel {
      background: var(--secondary-background-color, #eee);
      color: var(--primary-text-color, #222);
    }

    .btn-modal-use {
      background: var(--primary-color, #03a9f4);
      color: white;
      margin-left: 8px;
    }

    @media (max-width: 768px) {
      .top-bar {
        flex-direction: column;
        gap: 10px;
        padding: 12px 14px;
      }
      .nav-tabs {
        overflow-x: auto;
        width: 100%;
        padding-bottom: 4px;
      }
      .content-area {
        padding: 14px;
      }
    }
  `,n([p({attribute:!1})],y.prototype,"hass",2),n([p({type:Boolean})],y.prototype,"narrow",2),n([p({type:Object})],y.prototype,"panel",2),n([d()],y.prototype,"_lang",2),n([d()],y.prototype,"_activeView",2),n([d()],y.prototype,"_boxes",2),n([d()],y.prototype,"_tags",2),n([d()],y.prototype,"_logs",2),n([d()],y.prototype,"_editingTag",2),n([d()],y.prototype,"_initialUid",2),n([d()],y.prototype,"_selectedBox",2),n([d()],y.prototype,"_isLearning",2),n([d()],y.prototype,"_learnedUid",2),y=n([f("tonieesp-panel")],y);export{y as TonieESPPanel};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
