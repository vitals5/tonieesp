var Me=Object.defineProperty;var Ue=Object.getOwnPropertyDescriptor;var o=(a,t,e,i)=>{for(var s=i>1?void 0:i?Ue(t,e):t,r=a.length-1,n;r>=0;r--)(n=a[r])&&(s=(i?n(t,e,s):n(s))||s);return i&&s&&Me(t,e,s),s};var Y=globalThis,P=Y.ShadowRoot&&(Y.ShadyCSS===void 0||Y.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,re=Symbol(),me=new WeakMap,D=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==re)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(P&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=me.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&me.set(e,t))}return t}toString(){return this.cssText}},ve=a=>new D(typeof a=="string"?a:a+"",void 0,re),g=(a,...t)=>{let e=a.length===1?a[0]:t.reduce((i,s,r)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+a[r+1],a[0]);return new D(e,a,re)},fe=(a,t)=>{if(P)a.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),s=Y.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,a.appendChild(i)}},ae=P?a=>a:a=>a instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return ve(e)})(a):a;var{is:Fe,defineProperty:Re,getOwnPropertyDescriptor:He,getOwnPropertyNames:Te,getOwnPropertySymbols:Ie,getPrototypeOf:je}=Object,V=globalThis,xe=V.trustedTypes,Be=xe?xe.emptyScript:"",De=V.reactiveElementPolyfillSupport,q=(a,t)=>a,W={toAttribute(a,t){switch(t){case Boolean:a=a?Be:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,t){let e=a;switch(t){case Boolean:e=a!==null;break;case Number:e=a===null?null:Number(a);break;case Object:case Array:try{e=JSON.parse(a)}catch{e=null}}return e}},ee=(a,t)=>!Fe(a,t),_e={attribute:!0,type:String,converter:W,reflect:!1,useDefault:!1,hasChanged:ee};Symbol.metadata??=Symbol("metadata"),V.litPropertyMetadata??=new WeakMap;var z=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_e){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Re(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){let{get:s,set:r}=He(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:s,set(n){let h=s?.call(this);r?.call(this,n),this.requestUpdate(t,h,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_e}static _$Ei(){if(this.hasOwnProperty(q("elementProperties")))return;let t=je(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(q("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(q("properties"))){let e=this.properties,i=[...Te(e),...Ie(e)];for(let s of i)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let s of i)e.unshift(ae(s))}else t!==void 0&&e.push(ae(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fe(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:W).toAttribute(e,i.type);this._$Em=t,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){let i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let r=i.getPropertyOptions(s),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:W;this._$Em=s;let h=n.fromAttribute(e,r.type);this[s]=h??this._$Ej?.get(s)??h,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(t!==void 0){let n=this.constructor;if(s===!1&&(r=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??ee)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),r!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,r]of i){let{wrapped:n}=r,h=this[s];n!==!0||this._$AL.has(s)||h===void 0||this.C(s,void 0,r,h)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};z.elementStyles=[],z.shadowRootOptions={mode:"open"},z[q("elementProperties")]=new Map,z[q("finalized")]=new Map,De?.({ReactiveElement:z}),(V.reactiveElementVersions??=[]).push("2.1.2");var he=globalThis,ye=a=>a,te=he.trustedTypes,$e=te?te.createPolicy("lit-html",{createHTML:a=>a}):void 0,ze="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,Le="?"+S,qe=`<${Le}>`,U=document,J=()=>U.createComment(""),G=a=>a===null||typeof a!="object"&&typeof a!="function",ue=Array.isArray,We=a=>ue(a)||typeof a?.[Symbol.iterator]=="function",oe=`[ 	
\f\r]`,K=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ke=/-->/g,we=/>/g,N=RegExp(`>|${oe}(?:([^\\s"'>=/]+)(${oe}*=${oe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ae=/'/g,Ce=/"/g,Se=/^(?:script|style|textarea|title)$/i,ge=a=>(t,...e)=>({_$litType$:a,strings:t,values:e}),l=ge(1),tt=ge(2),it=ge(3),F=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),Ee=new WeakMap,M=U.createTreeWalker(U,129);function Oe(a,t){if(!ue(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return $e!==void 0?$e.createHTML(t):t}var Ke=(a,t)=>{let e=a.length-1,i=[],s,r=t===2?"<svg>":t===3?"<math>":"",n=K;for(let h=0;h<e;h++){let p=a[h],f,y,m=-1,E=0;for(;E<p.length&&(n.lastIndex=E,y=n.exec(p),y!==null);)E=n.lastIndex,n===K?y[1]==="!--"?n=ke:y[1]!==void 0?n=we:y[2]!==void 0?(Se.test(y[2])&&(s=RegExp("</"+y[2],"g")),n=N):y[3]!==void 0&&(n=N):n===N?y[0]===">"?(n=s??K,m=-1):y[1]===void 0?m=-2:(m=n.lastIndex-y[2].length,f=y[1],n=y[3]===void 0?N:y[3]==='"'?Ce:Ae):n===Ce||n===Ae?n=N:n===ke||n===we?n=K:(n=N,s=void 0);let L=n===N&&a[h+1].startsWith("/>")?" ":"";r+=n===K?p+qe:m>=0?(i.push(f),p.slice(0,m)+ze+p.slice(m)+S+L):p+S+(m===-2?h:L)}return[Oe(a,r+(a[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},Z=class a{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0,h=t.length-1,p=this.parts,[f,y]=Ke(t,e);if(this.el=a.createElement(f,i),M.currentNode=this.el.content,e===2||e===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(s=M.nextNode())!==null&&p.length<h;){if(s.nodeType===1){if(s.hasAttributes())for(let m of s.getAttributeNames())if(m.endsWith(ze)){let E=y[n++],L=s.getAttribute(m).split(S),X=/([.?@])?(.*)/.exec(E);p.push({type:1,index:r,name:X[2],strings:L,ctor:X[1]==="."?le:X[1]==="?"?ce:X[1]==="@"?de:j}),s.removeAttribute(m)}else m.startsWith(S)&&(p.push({type:6,index:r}),s.removeAttribute(m));if(Se.test(s.tagName)){let m=s.textContent.split(S),E=m.length-1;if(E>0){s.textContent=te?te.emptyScript:"";for(let L=0;L<E;L++)s.append(m[L],J()),M.nextNode(),p.push({type:2,index:++r});s.append(m[E],J())}}}else if(s.nodeType===8)if(s.data===Le)p.push({type:2,index:r});else{let m=-1;for(;(m=s.data.indexOf(S,m+1))!==-1;)p.push({type:7,index:r}),m+=S.length-1}r++}}static createElement(t,e){let i=U.createElement("template");return i.innerHTML=t,i}};function I(a,t,e=a,i){if(t===F)return t;let s=i!==void 0?e._$Co?.[i]:e._$Cl,r=G(t)?void 0:t._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(a),s._$AT(a,e,i)),i!==void 0?(e._$Co??=[])[i]=s:e._$Cl=s),s!==void 0&&(t=I(a,s._$AS(a,t.values),s,i)),t}var ne=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??U).importNode(e,!0);M.currentNode=s;let r=M.nextNode(),n=0,h=0,p=i[0];for(;p!==void 0;){if(n===p.index){let f;p.type===2?f=new Q(r,r.nextSibling,this,t):p.type===1?f=new p.ctor(r,p.name,p.strings,this,t):p.type===6&&(f=new pe(r,this,t)),this._$AV.push(f),p=i[++h]}n!==p?.index&&(r=M.nextNode(),n++)}return M.currentNode=U,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},Q=class a{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=I(this,t,e),G(t)?t===x||t==null||t===""?(this._$AH!==x&&this._$AR(),this._$AH=x):t!==this._$AH&&t!==F&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):We(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==x&&G(this._$AH)?this._$AA.nextSibling.data=t:this.T(U.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Z.createElement(Oe(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{let r=new ne(s,this),n=r.u(this.options);r.p(e),this.T(n),this._$AH=r}}_$AC(t){let e=Ee.get(t.strings);return e===void 0&&Ee.set(t.strings,e=new Z(t)),e}k(t){ue(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let r of t)s===e.length?e.push(i=new a(this.O(J()),this.O(J()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=ye(t).nextSibling;ye(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},j=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=x,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=x}_$AI(t,e=this,i,s){let r=this.strings,n=!1;if(r===void 0)t=I(this,t,e,0),n=!G(t)||t!==this._$AH&&t!==F,n&&(this._$AH=t);else{let h=t,p,f;for(t=r[0],p=0;p<r.length-1;p++)f=I(this,h[i+p],e,p),f===F&&(f=this._$AH[p]),n||=!G(f)||f!==this._$AH[p],f===x?t=x:t!==x&&(t+=(f??"")+r[p+1]),this._$AH[p]=f}n&&!s&&this.j(t)}j(t){t===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},le=class extends j{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===x?void 0:t}},ce=class extends j{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==x)}},de=class extends j{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=I(this,t,e,0)??x)===F)return;let i=this._$AH,s=t===x&&i!==x||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==x&&(i===x||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},pe=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){I(this,t)}};var Je=he.litHtmlPolyfillSupport;Je?.(Z,Q),(he.litHtmlVersions??=[]).push("3.3.3");var Ne=(a,t,e)=>{let i=e?.renderBefore??t,s=i._$litPart$;if(s===void 0){let r=e?.renderBefore??null;i._$litPart$=s=new Q(t.insertBefore(J(),r),r,void 0,e??{})}return s._$AI(a),s};var be=globalThis,u=class extends z{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ne(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}};u._$litElement$=!0,u.finalized=!0,be.litElementHydrateSupport?.({LitElement:u});var Ge=be.litElementPolyfillSupport;Ge?.({LitElement:u});(be.litElementVersions??=[]).push("4.2.2");var v=a=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(a,t)}):customElements.define(a,t)};var Ze={attribute:!0,type:String,converter:W,reflect:!1,hasChanged:ee},Qe=(a=Ze,t,e)=>{let{kind:i,metadata:s}=e,r=globalThis.litPropertyMetadata.get(s);if(r===void 0&&globalThis.litPropertyMetadata.set(s,r=new Map),i==="setter"&&((a=Object.create(a)).wrapped=!0),r.set(e.name,a),i==="accessor"){let{name:n}=e;return{set(h){let p=t.get.call(this);t.set.call(this,h),this.requestUpdate(n,p,a,!0,h)},init(h){return h!==void 0&&this.C(n,void 0,a,h),h}}}if(i==="setter"){let{name:n}=e;return function(h){let p=this[n];t.call(this,h),this.requestUpdate(n,p,a,!0,h)}}throw Error("Unsupported decorator location: "+i)};function d(a){return(t,e)=>typeof e=="object"?Qe(a,t,e):((i,s,r)=>{let n=s.hasOwnProperty(r);return s.constructor.createProperty(r,i),n?Object.getOwnPropertyDescriptor(s,r):void 0})(a,t,e)}function c(a){return d({...a,state:!0,attribute:!1})}var se=class{constructor(t){this.hass=t}updateHass(t){this.hass=t}async getBoxes(){return this.hass.callWS({type:"tonieesp/boxes/list"})}async updateBoxSettings(t,e){return this.hass.callWS({type:"tonieesp/boxes/update",box_id:t,settings:e})}async getTags(t,e){return this.hass.callWS({type:"tonieesp/tags/list",search:t||void 0,media_type:e||void 0})}async getTag(t){return this.hass.callWS({type:"tonieesp/tags/get",uid:t})}async saveTag(t){return this.hass.callWS({type:"tonieesp/tags/save",tag:t})}async deleteTag(t){return this.hass.callWS({type:"tonieesp/tags/delete",uid:t})}async importTags(t,e=!1){return this.hass.callWS({type:"tonieesp/tags/import",tags:t,overwrite:e})}async exportTags(){return this.hass.callWS({type:"tonieesp/tags/export"})}async startLearning(t,e=60){return this.hass.callWS({type:"tonieesp/tags/learn_start",device_id:t||void 0,timeout:e})}async stopLearning(){return this.hass.callWS({type:"tonieesp/tags/learn_stop"})}async searchMedia(t,e){return this.hass.callWS({type:"tonieesp/media/search",query:t,media_types:e})}async controlPlayback(t,e,i){return this.hass.callWS({type:"tonieesp/playback/control",box_id:t,action:e,data:i})}async getDiagnostics(){return this.hass.callWS({type:"tonieesp/diagnostics"})}async subscribeEvents(t){return this.hass?.connection?.subscribeMessage?this.hass.connection.subscribeMessage(t,{type:"tonieesp/events/subscribe"}):()=>{}}};var A=class extends u{constructor(){super(...arguments);this.online=!1;this.batteryLevel=null;this.charging=!1;this.type="";this.text=""}render(){return this.type==="online"?l`
        <span class="${this.online?"badge-online":"badge-offline"}">
          <span class="dot"></span>
          ${this.online?"Online":"Offline"}
        </span>
      `:this.type==="battery"&&this.batteryLevel!==null?l`
        <span class="badge-battery">
          ${this.charging?"\u26A1":"\u{1F50B}"} ${this.batteryLevel}%
        </span>
      `:this.type==="media_type"?l`<span class="badge-type">${this.text}</span>`:l`<span>${this.text}</span>`}};A.styles=g`
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
  `,o([d({type:Boolean})],A.prototype,"online",2),o([d({type:Number})],A.prototype,"batteryLevel",2),o([d({type:Boolean})],A.prototype,"charging",2),o([d({type:String})],A.prototype,"type",2),o([d({type:String})],A.prototype,"text",2),A=o([v("tonieesp-status-badge")],A);var R=class extends u{constructor(){super(...arguments);this.lang="de"}_onControl(e,i){this.dispatchEvent(new CustomEvent("box-control",{detail:{boxId:this.box.id,action:e,data:i},bubbles:!0,composed:!0}))}_onSetupUnknown(){this.dispatchEvent(new CustomEvent("setup-unknown-tag",{detail:{uid:this.box.unknown_tag,boxId:this.box.id},bubbles:!0,composed:!0}))}_onOpenDetails(){this.dispatchEvent(new CustomEvent("open-box-details",{detail:{box:this.box},bubbles:!0,composed:!0}))}_onVolumeChange(e){let i=e.target,s=parseFloat(i.value);this._onControl("volume",{volume:s})}render(){if(!this.box)return l``;let e=this.box.playback||{},i=e.state==="playing";return l`
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
            ${this.box.battery?.level!==null?l`
                  <tonieesp-status-badge
                    type="battery"
                    .batteryLevel=${this.box.battery.level}
                    .charging=${this.box.battery.charging}
                  ></tonieesp-status-badge>
                `:""}
          </div>
        </div>

        <!-- Tag Notification / Current Tag -->
        ${this.box.unknown_tag?l`
              <div class="unknown-banner">
                <span class="unknown-text"
                  >⚡ Unbekannter Tag: ${this.box.unknown_tag}</span
                >
                <button class="btn-setup" @click=${this._onSetupUnknown}>
                  Einrichten
                </button>
              </div>
            `:l`
              <div class="tag-container">
                ${this.box.current_tag_info?.image?l`<img
                      class="tag-cover"
                      src="${this.box.current_tag_info.image}"
                      alt="Tag"
                    />`:l`<div class="tag-cover">🧸</div>`}
                <div class="tag-details">
                  <div class="tag-label">Aufgesetzte Figur</div>
                  <div class="tag-name">
                    ${this.box.current_tag_info?.name||(this.box.current_tag?`UID: ${this.box.current_tag}`:"Keine Figur")}
                  </div>
                  ${this.box.current_tag_info?.media_title?l`<div class="tag-media">
                        ${this.box.current_tag_info.media_title}
                      </div>`:""}
                </div>
              </div>
            `}

        <!-- Playback Controls -->
        <div class="player-section">
          <div class="playback-info">
            <span class="playback-title">${e.title||"Keine Wiedergabe"}</span>
            <span class="playback-status">${e.state||"Bereit"}</span>
          </div>

          <div class="controls-row">
            <div class="playback-buttons">
              <button
                class="btn-ctrl"
                title="Vorheriger Titel"
                @click=${()=>this._onControl("previous")}
              >
                ⏮
              </button>
              <button
                class="btn-ctrl btn-play"
                title="${i?"Pause":"Play"}"
                @click=${()=>this._onControl(i?"pause":"play")}
              >
                ${i?"\u23F8":"\u25B6"}
              </button>
              <button
                class="btn-ctrl"
                title="Nächster Titel"
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
                .value=${String(e.volume_level||.4)}
                @change=${this._onVolumeChange}
                title="Lautstärke"
              />
              <span>🔊</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="card-footer">
          <button class="btn-link" @click=${this._onOpenDetails}>
            Einstellungen & Gesten →
          </button>
        </div>
      </div>
    `}};R.styles=g`
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
  `,o([d({type:Object})],R.prototype,"box",2),o([d({type:String})],R.prototype,"lang",2),R=o([v("tonieesp-box-card")],R);var O=class extends u{constructor(){super(...arguments);this.boxes=[];this.tags=[];this.lang="de"}render(){let e=this.boxes.filter(s=>s.online).length,i=this.boxes.filter(s=>s.playback?.state==="playing").length;return l`
      <div class="header-section">
        <h1 class="title">TonieESP Dashboard</h1>
        <p class="subtitle">
          Zentrale Verwaltung und Live-Status aller Tonieboxen
        </p>

        <div class="stats-row">
          <div class="stat-card">
            <span class="stat-value">${this.boxes.length}</span>
            <span class="stat-label">Tonieboxen gesamt</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${e}</span>
            <span class="stat-label">Online</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${i}</span>
            <span class="stat-label">Aktive Wiedergaben</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${this.tags.length}</span>
            <span class="stat-label">NFC-Figuren in Bibliothek</span>
          </div>
        </div>
      </div>

      ${this.boxes.length===0?l`
            <div class="empty-state">
              <div class="empty-icon">📻</div>
              <h3>Keine Tonieboxen eingerichtet</h3>
              <p>
                Richte deine Toniebox in Home Assistant über Einstellungen >
                Geräte & Dienste > Integration hinzufügen ein.
              </p>
            </div>
          `:l`
            <div class="boxes-grid">
              ${this.boxes.map(s=>l`<tonieesp-box-card
                    .box=${s}
                    .lang=${this.lang}
                  ></tonieesp-box-card>`)}
            </div>
          `}
    `}};O.styles=g`
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
  `,o([d({type:Array})],O.prototype,"boxes",2),o([d({type:Array})],O.prototype,"tags",2),o([d({type:String})],O.prototype,"lang",2),O=o([v("tonieesp-dashboard-view")],O);var H=class extends u{constructor(){super(...arguments);this.boxes=[]}_onPlayOnBox(){let e=this.shadowRoot?.querySelector("select"),i=e?e.value:this.boxes[0]?.id;i&&this.dispatchEvent(new CustomEvent("play-tag-on-box",{detail:{tag:this.tag,boxId:i},bubbles:!0,composed:!0}))}_onEdit(){this.dispatchEvent(new CustomEvent("edit-tag",{detail:{tag:this.tag},bubbles:!0,composed:!0}))}_onDelete(){this.dispatchEvent(new CustomEvent("delete-tag",{detail:{tag:this.tag},bubbles:!0,composed:!0}))}render(){if(!this.tag)return l``;let e=Object.keys(this.tag.overrides||{}).length;return l`
      <div class="card">
        <div class="top-row">
          ${this.tag.image?l`<img class="cover" src="${this.tag.image}" alt="Cover" />`:l`<div class="cover">🧸</div>`}
          <div class="info">
            <div class="name">${this.tag.name}</div>
            <span class="uid-pill">${this.tag.uid}</span>
            <div class="media-info">
              🎵 ${this.tag.media.title||this.tag.media.media_id||"Kein Medium zugewiesen"}
            </div>
          </div>
        </div>

        <div class="badges-row">
          <span class="badge">${this.tag.media.media_type||"playlist"}</span>
          ${this.tag.settings.resume?l`<span class="badge">⏱ Resume</span>`:""}
          ${this.tag.settings.shuffle?l`<span class="badge">🔀 Shuffle</span>`:""}
          ${e>0?l`<span class="badge badge-override">⚡ ${e} Override(s)</span>`:""}
        </div>

        <div class="actions-row">
          <div class="play-select-group">
            <select>
              ${this.boxes.map(i=>l`<option value="${i.id}">${i.name}</option>`)}
            </select>
            <button class="btn-play-action" @click=${this._onPlayOnBox}>▶ Play</button>
          </div>

          <div>
            <button class="btn-icon" title="Bearbeiten" @click=${this._onEdit}>✏️</button>
            <button class="btn-icon btn-delete" title="Löschen" @click=${this._onDelete}>🗑️</button>
          </div>
        </div>
      </div>
    `}};H.styles=g`
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
  `,o([d({type:Object})],H.prototype,"tag",2),o([d({type:Array})],H.prototype,"boxes",2),H=o([v("tonieesp-tag-card")],H);var C=class extends u{constructor(){super(...arguments);this.tags=[];this.boxes=[];this.lang="de";this._searchQuery="";this._selectedType=""}_filteredTags(){let e=this._searchQuery.toLowerCase().trim();return this.tags.filter(i=>{if(this._selectedType&&i.media.media_type!==this._selectedType)return!1;if(e){let s=(i.name||"").toLowerCase(),r=(i.description||"").toLowerCase(),n=(i.uid||"").toLowerCase(),h=(i.media.title||"").toLowerCase();if(!s.includes(e)&&!r.includes(e)&&!n.includes(e)&&!h.includes(e))return!1}return!0})}render(){let e=this._filteredTags(),i=[{id:"",label:"Alle Typen"},{id:"playlist",label:"Playlists"},{id:"album",label:"Alben"},{id:"audiobook",label:"H\xF6rb\xFCcher"},{id:"track",label:"Titel"},{id:"radio",label:"Radio"}];return l`
      <div class="top-toolbar">
        <input
          class="search-input"
          type="search"
          placeholder="NFC-Figuren durchsuchen (Name, UID, Titel)..."
          .value=${this._searchQuery}
          @input=${s=>this._searchQuery=s.target.value}
        />
        <div class="toolbar-actions">
          <button
            class="btn btn-secondary"
            @click=${()=>this.dispatchEvent(new CustomEvent("start-scan-learning",{bubbles:!0,composed:!0}))}
          >
            ⚡ Scan-Lernmodus
          </button>
          <button
            class="btn btn-primary"
            @click=${()=>this.dispatchEvent(new CustomEvent("add-new-tag",{bubbles:!0,composed:!0}))}
          >
            + Figur hinzufügen
          </button>
        </div>
      </div>

      <div class="filters-row">
        ${i.map(s=>l`
            <div
              class="filter-chip ${this._selectedType===s.id?"active":""}"
              @click=${()=>this._selectedType=s.id}
            >
              ${s.label}
            </div>
          `)}
      </div>

      ${e.length===0?l`
            <div class="empty-state">
              <div class="empty-icon">🧸</div>
              <h3>Keine Figuren gefunden</h3>
              <p>
                Lege eine Figur auf deine Toniebox oder klicke auf "+ Figur
                hinzufügen".
              </p>
            </div>
          `:l`
            <div class="tags-grid">
              ${e.map(s=>l`<tonieesp-tag-card
                    .tag=${s}
                    .boxes=${this.boxes}
                  ></tonieesp-tag-card>`)}
            </div>
          `}
    `}};C.styles=g`
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
  `,o([d({type:Array})],C.prototype,"tags",2),o([d({type:Array})],C.prototype,"boxes",2),o([d({type:String})],C.prototype,"lang",2),o([c()],C.prototype,"_searchQuery",2),o([c()],C.prototype,"_selectedType",2),C=o([v("tonieesp-tag-library-view")],C);var b=class extends u{constructor(){super(...arguments);this.boxes=[];this.initialUid="";this.lang="de";this._uid="";this._name="";this._description="";this._image="";this._mediaProvider="music_assistant";this._mediaType="playlist";this._mediaId="";this._mediaTitle="";this._mediaArtist="";this._resume=!0;this._shuffle=!1;this._repeat="off";this._volumeLimit=null;this._overrides={};this._activeTab="global";this._selectedOverrideBoxId=""}connectedCallback(){super.connectedCallback(),this.tag?(this._uid=this.tag.uid,this._name=this.tag.name,this._description=this.tag.description||"",this._image=this.tag.image||"",this._mediaProvider=this.tag.media.provider||"music_assistant",this._mediaType=this.tag.media.media_type||"playlist",this._mediaId=this.tag.media.media_id||"",this._mediaTitle=this.tag.media.title||"",this._mediaArtist=this.tag.media.artist||"",this._resume=this.tag.settings.resume!==!1,this._shuffle=!!this.tag.settings.shuffle,this._repeat=this.tag.settings.repeat||"off",this._volumeLimit=this.tag.settings.volume_limit||null,this._overrides=JSON.parse(JSON.stringify(this.tag.overrides||{}))):this.initialUid&&(this._uid=this.initialUid,this._name=`Tonie ${this.initialUid.slice(-4)}`),this.boxes.length>0&&(this._selectedOverrideBoxId=this.boxes[0].id)}setMediaSelection(e){this._mediaId=e.media_id,this._mediaType=e.media_type,this._mediaTitle=e.title,this._mediaArtist=e.artist||"",e.image&&!this._image&&(this._image=e.image),(!this._name||this._name.startsWith("Tonie "))&&(this._name=e.title)}_onSave(){if(!this._uid.trim()){alert("Bitte gib eine g\xFCltige NFC UID an.");return}let e={uid:this._uid.trim().toUpperCase(),name:this._name.trim()||`Tonie ${this._uid.slice(-4)}`,description:this._description.trim(),image:this._image.trim(),media:{provider:this._mediaProvider,media_type:this._mediaType,media_id:this._mediaId.trim(),title:this._mediaTitle.trim(),artist:this._mediaArtist.trim()},settings:{resume:this._resume,shuffle:this._shuffle,repeat:this._repeat,volume_limit:this._volumeLimit},overrides:this._overrides};this.dispatchEvent(new CustomEvent("save-tag-record",{detail:{tag:e},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("cancel-tag-edit",{bubbles:!0,composed:!0}))}_addOverride(){this._selectedOverrideBoxId&&(this._overrides={...this._overrides,[this._selectedOverrideBoxId]:{media:{provider:"music_assistant",media_type:"playlist",media_id:"",title:""}}})}_removeOverride(e){let i={...this._overrides};delete i[e],this._overrides=i}render(){return l`
      <div class="editor-card">
        <div class="title-row">
          <h2 class="title">
            ${this.tag?"NFC-Figur bearbeiten":"Neue NFC-Figur anlegen"}
          </h2>
        </div>

        <div class="tabs-row">
          <button
            class="tab-btn ${this._activeTab==="global"?"active":""}"
            @click=${()=>this._activeTab="global"}
          >
            Globale Einstellungen
          </button>
          <button
            class="tab-btn ${this._activeTab==="overrides"?"active":""}"
            @click=${()=>this._activeTab="overrides"}
          >
            Geräte-Overrides (${Object.keys(this._overrides).length})
          </button>
        </div>

        ${this._activeTab==="global"?l`
              <div class="form-grid">
                <!-- UID -->
                <div class="form-group full-width">
                  <label>NFC Tag UID (16 Hex-Zeichen)</label>
                  <div class="uid-group">
                    <input
                      type="text"
                      placeholder="z.B. E004015023AABBCC"
                      .value=${this._uid}
                      @input=${e=>this._uid=e.target.value}
                    />
                    <button
                      class="btn-scan"
                      @click=${()=>this.dispatchEvent(new CustomEvent("start-scan-learning",{bubbles:!0,composed:!0}))}
                    >
                      ⚡ Jetzt scannen
                    </button>
                  </div>
                </div>

                <!-- Name & Description -->
                <div class="form-group">
                  <label>Name der Figur</label>
                  <input
                    type="text"
                    placeholder="z.B. Die drei ??? Folge 1"
                    .value=${this._name}
                    @input=${e=>this._name=e.target.value}
                  />
                </div>

                <div class="form-group">
                  <label>Cover-Bild URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    .value=${this._image}
                    @input=${e=>this._image=e.target.value}
                  />
                </div>

                <div class="form-group full-width">
                  <label>Beschreibung (optional)</label>
                  <textarea
                    rows="2"
                    placeholder="Zusätzliche Notizen zur Figur..."
                    .value=${this._description}
                    @input=${e=>this._description=e.target.value}
                  ></textarea>
                </div>

                <!-- Media Selection -->
                <div class="form-group">
                  <label>Medientyp</label>
                  <select
                    .value=${this._mediaType}
                    @change=${e=>this._mediaType=e.target.value}
                  >
                    <option value="playlist">Playlist</option>
                    <option value="album">Album</option>
                    <option value="audiobook">Hörbuch</option>
                    <option value="track">Einzelner Titel</option>
                    <option value="radio">Radiosender</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Titel / Playlist Name</label>
                  <input
                    type="text"
                    placeholder="Name in Music Assistant"
                    .value=${this._mediaTitle}
                    @input=${e=>this._mediaTitle=e.target.value}
                  />
                </div>

                <div class="form-group full-width">
                  <label>Music Assistant Medien-ID / URI</label>
                  <div class="media-search-group">
                    <input
                      type="text"
                      placeholder="z.B. spotify://playlist/..."
                      .value=${this._mediaId}
                      @input=${e=>this._mediaId=e.target.value}
                    />
                    <button
                      class="btn-search"
                      @click=${()=>this.dispatchEvent(new CustomEvent("open-media-browser",{bubbles:!0,composed:!0}))}
                    >
                      🔍 Mediathek durchsuchen
                    </button>
                  </div>
                </div>

                <!-- Playback Settings -->
                <div class="form-group">
                  <label>Wiedergabeeinstellungen</label>
                  <div class="checkbox-row">
                    <input
                      type="checkbox"
                      id="cb-resume"
                      .checked=${this._resume}
                      @change=${e=>this._resume=e.target.checked}
                    />
                    <label for="cb-resume"
                      >Fortschritt merken (Resume für Hörbücher)</label
                    >
                  </div>
                  <div class="checkbox-row">
                    <input
                      type="checkbox"
                      id="cb-shuffle"
                      .checked=${this._shuffle}
                      @change=${e=>this._shuffle=e.target.checked}
                    />
                    <label for="cb-shuffle">Zufallswiedergabe (Shuffle)</label>
                  </div>
                </div>

                <div class="form-group">
                  <label>Wiederholen (Repeat)</label>
                  <select
                    .value=${this._repeat}
                    @change=${e=>this._repeat=e.target.value}
                  >
                    <option value="off">Aus</option>
                    <option value="one">Titel wiederholen</option>
                    <option value="all">Playlist wiederholen</option>
                  </select>
                </div>
              </div>
            `:l`
              <!-- Overrides Tab -->
              <div class="overrides-header">
                Hier kannst du festlegen, dass diese Figur auf einer bestimmten
                Toniebox ein anderes Hörspiel oder eine andere Playlist
                abspielt.
              </div>

              <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                <select
                  style="flex: 1;"
                  .value=${this._selectedOverrideBoxId}
                  @change=${e=>this._selectedOverrideBoxId=e.target.value}
                >
                  ${this.boxes.map(e=>l`<option value="${e.id}">${e.name}</option>`)}
                </select>
                <button
                  class="btn btn-save"
                  style="white-space: nowrap;"
                  @click=${this._addOverride}
                >
                  + Override für Box anlegen
                </button>
              </div>

              ${Object.keys(this._overrides).length===0?l`<div style="text-align: center; color: #888; padding: 20px;">
                    Keine Overrides konfiguriert. Diese Figur verhält sich auf
                    allen Boxen gleich.
                  </div>`:Object.entries(this._overrides).map(([e,i])=>{let s=this.boxes.find(r=>r.id===e);return l`
                      <div class="override-item">
                        <div class="override-top">
                          <span>📻 ${s?s.name:e}</span>
                          <button
                            style="background: transparent; border: none; color: #d32f2f; cursor: pointer;"
                            @click=${()=>this._removeOverride(e)}
                          >
                            Entfernen ✕
                          </button>
                        </div>
                        <div class="form-group">
                          <label>Abweichende Medien-ID für diese Box</label>
                          <input
                            type="text"
                            placeholder="z.B. playlist-id oder name"
                            .value=${i.media?.media_id||""}
                            @input=${r=>{let n=r.target.value;this._overrides[e]={...this._overrides[e],media:{...this._overrides[e].media||{},media_id:n}}}}
                          />
                        </div>
                      </div>
                    `})}
            `}

        <div class="footer-actions">
          <button class="btn btn-cancel" @click=${this._onCancel}>
            Abbrechen
          </button>
          <button class="btn btn-save" @click=${this._onSave}>
            Figur speichern
          </button>
        </div>
      </div>
    `}};b.styles=g`
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
  `,o([d({type:Object})],b.prototype,"tag",2),o([d({type:Array})],b.prototype,"boxes",2),o([d({type:String})],b.prototype,"initialUid",2),o([d({type:String})],b.prototype,"lang",2),o([c()],b.prototype,"_uid",2),o([c()],b.prototype,"_name",2),o([c()],b.prototype,"_description",2),o([c()],b.prototype,"_image",2),o([c()],b.prototype,"_mediaProvider",2),o([c()],b.prototype,"_mediaType",2),o([c()],b.prototype,"_mediaId",2),o([c()],b.prototype,"_mediaTitle",2),o([c()],b.prototype,"_mediaArtist",2),o([c()],b.prototype,"_resume",2),o([c()],b.prototype,"_shuffle",2),o([c()],b.prototype,"_repeat",2),o([c()],b.prototype,"_volumeLimit",2),o([c()],b.prototype,"_overrides",2),o([c()],b.prototype,"_activeTab",2),o([c()],b.prototype,"_selectedOverrideBoxId",2),b=o([v("tonieesp-tag-editor-view")],b);var B=class extends u{_onSelect(t){t.stopPropagation(),this.dispatchEvent(new CustomEvent("media-selected",{detail:this.item,bubbles:!0,composed:!0}))}render(){return this.item?l`
      <div class="card" @click=${this._onSelect}>
        ${this.item.image?l`<img class="thumbnail" src="${this.item.image}" alt="Cover" />`:l`<div class="thumbnail">🎵</div>`}
        <div class="info">
          <div class="title">${this.item.title}</div>
          <div class="subtitle">
            <span class="type-badge">${this.item.media_type}</span>
            ${this.item.artist?` \u2022 ${this.item.artist}`:""}
          </div>
        </div>
        <button class="btn-select" @click=${this._onSelect}>Auswählen</button>
      </div>
    `:l``}};B.styles=g`
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
  `,o([d({type:Object})],B.prototype,"item",2),B=o([v("tonieesp-media-item-card")],B);var k=class extends u{constructor(){super(...arguments);this.lang="de";this._query="";this._loading=!1;this._results=[];this._searched=!1;this._selectedType=""}async _onSearch(e){if(e&&e.preventDefault(),!(!this._query.trim()||!this.api)){this._loading=!0,this._searched=!0;try{let i=this._selectedType?[this._selectedType]:void 0,s=await this.api.searchMedia(this._query.trim(),i);this._results=s||[]}catch(i){console.error("Error searching media:",i),this._results=[]}finally{this._loading=!1}}}render(){return l`
      <div class="container">
        <div class="header-row">
          <h2 class="title">Music Assistant Mediathek</h2>
          <p class="subtitle">
            Suche nach Playlists, Alben, Hörspielen oder Titeln und weise sie
            einer Tonie-Figur zu.
          </p>

          <form class="search-row" @submit=${this._onSearch}>
            <input
              class="search-input"
              type="search"
              placeholder="Suchbegriff eingeben (z.B. Die drei ???, Bibi Blocksberg, Playlist-Name)..."
              .value=${this._query}
              @input=${e=>this._query=e.target.value}
            />
            <button
              class="btn-search"
              type="submit"
              ?disabled=${this._loading||!this._query.trim()}
            >
              ${this._loading?"Suche...":"Suchen"}
            </button>
          </form>
        </div>

        <div class="results-grid">
          ${this._results.map(e=>l`<tonieesp-media-item-card .item=${e}></tonieesp-media-item-card>`)}
          ${this._searched&&!this._loading&&this._results.length===0?l`<div class="empty-state">
                Keine passenden Medien in Music Assistant gefunden.
              </div>`:""}
          ${this._searched?"":l`<div class="empty-state">
                Gib einen Suchbegriff ein, um Music Assistant zu durchsuchen.
              </div>`}
        </div>
      </div>
    `}};k.styles=g`
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
  `,o([d({type:Object})],k.prototype,"api",2),o([d({type:String})],k.prototype,"lang",2),o([c()],k.prototype,"_query",2),o([c()],k.prototype,"_loading",2),o([c()],k.prototype,"_results",2),o([c()],k.prototype,"_searched",2),o([c()],k.prototype,"_selectedType",2),k=o([v("tonieesp-media-browser-view")],k);var $=class extends u{constructor(){super(...arguments);this.lang="de";this._pauseOnRemoval=!0;this._resumeOnReplace=!0;this._maxVolume=.8;this._seekStep=10;this._gesturesEnabled=!0;this._leftTapAction="previous_track";this._rightTapAction="next_track";this._leftTiltAction="seek_backward";this._rightTiltAction="seek_forward"}connectedCallback(){if(super.connectedCallback(),this.box?.settings){let e=this.box.settings;this._pauseOnRemoval=e.pause_on_removal!==!1,this._resumeOnReplace=e.resume_on_replace!==!1,this._maxVolume=e.max_volume||.8,this._seekStep=e.seek_step||10,this._gesturesEnabled=e.gestures_enabled!==!1,this._leftTapAction=e.left_tap_action||"previous_track",this._rightTapAction=e.right_tap_action||"next_track",this._leftTiltAction=e.left_tilt_action||"seek_backward",this._rightTiltAction=e.right_tilt_action||"seek_forward"}}_onSave(){let e={pause_on_removal:this._pauseOnRemoval,resume_on_replace:this._resumeOnReplace,max_volume:this._maxVolume,seek_step:this._seekStep,gestures_enabled:this._gesturesEnabled,left_tap_action:this._leftTapAction,right_tap_action:this._rightTapAction,left_tilt_action:this._leftTiltAction,right_tilt_action:this._rightTiltAction};this.dispatchEvent(new CustomEvent("save-box-settings",{detail:{boxId:this.box.id,settings:e},bubbles:!0,composed:!0}))}_onBack(){this.dispatchEvent(new CustomEvent("back-to-dashboard",{bubbles:!0,composed:!0}))}render(){return this.box?l`
      <div class="container">
        <div class="header-row">
          <h2 class="title">📻 ${this.box.name} – Geräteeinstellungen</h2>
          <button class="btn btn-back" @click=${this._onBack}>
            ← Zurück
          </button>
        </div>

        <!-- Automation & Playback Behavior -->
        <div class="section" style="border: none; padding-top: 0;">
          <h3 class="section-title">Wiedergabeverhalten</h3>
          <div class="checkbox-setting">
            <input
              type="checkbox"
              id="pause_rem"
              .checked=${this._pauseOnRemoval}
              @change=${e=>this._pauseOnRemoval=e.target.checked}
            />
            <label for="pause_rem"
              >Wiedergabe beim Abnehmen der Figur pausieren</label
            >
          </div>
          <div class="checkbox-setting">
            <input
              type="checkbox"
              id="resume_rep"
              .checked=${this._resumeOnReplace}
              @change=${e=>this._resumeOnReplace=e.target.checked}
            />
            <label for="resume_rep"
              >Wiedergabe beim erneuten Aufsetzen fortsetzen</label
            >
          </div>

          <div class="setting-group" style="margin-top: 12px;">
            <label>Maximale Lautstärkebegrenzung (${Math.round(this._maxVolume*100)}%)</label>
            <div class="slider-row">
              <span>0%</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                .value=${String(this._maxVolume)}
                @input=${e=>this._maxVolume=parseFloat(e.target.value)}
              />
              <span>100%</span>
            </div>
          </div>
        </div>

        <!-- Gestures -->
        <div class="section">
          <h3 class="section-title">Gestensteuerung (Beschleunigungssensor)</h3>
          <div class="checkbox-setting" style="margin-bottom: 12px;">
            <input
              type="checkbox"
              id="gest_en"
              .checked=${this._gesturesEnabled}
              @change=${e=>this._gesturesEnabled=e.target.checked}
            />
            <label for="gest_en">Gesten aktivieren (Klopfen & Neigen)</label>
          </div>

          <div class="grid-2">
            <div class="setting-group">
              <label>Aktion: Linker Klopfer</label>
              <select
                .value=${this._leftTapAction}
                @change=${e=>this._leftTapAction=e.target.value}
              >
                <option value="previous_track">Vorheriger Titel (Standard)</option>
                <option value="next_track">Nächster Titel</option>
                <option value="play_pause">Play / Pause</option>
                <option value="volume_down">Leiser</option>
                <option value="none">Keine Aktion</option>
              </select>
            </div>

            <div class="setting-group">
              <label>Aktion: Rechter Klopfer</label>
              <select
                .value=${this._rightTapAction}
                @change=${e=>this._rightTapAction=e.target.value}
              >
                <option value="next_track">Nächster Titel (Standard)</option>
                <option value="previous_track">Vorheriger Titel</option>
                <option value="play_pause">Play / Pause</option>
                <option value="volume_up">Lauter</option>
                <option value="none">Keine Aktion</option>
              </select>
            </div>

            <div class="setting-group">
              <label>Aktion: Nach links geneigt</label>
              <select
                .value=${this._leftTiltAction}
                @change=${e=>this._leftTiltAction=e.target.value}
              >
                <option value="seek_backward">Zurückspulen (Standard)</option>
                <option value="seek_forward">Vorspulen</option>
                <option value="none">Keine Aktion</option>
              </select>
            </div>

            <div class="setting-group">
              <label>Aktion: Nach rechts geneigt</label>
              <select
                .value=${this._rightTiltAction}
                @change=${e=>this._rightTiltAction=e.target.value}
              >
                <option value="seek_forward">Vorspulen (Standard)</option>
                <option value="seek_backward">Zurückspulen</option>
                <option value="none">Keine Aktion</option>
              </select>
            </div>

            <div class="setting-group">
              <label>Spulschrittweite (Sekunden je Neigungsintervall)</label>
              <input
                type="number"
                min="5"
                max="60"
                step="5"
                .value=${String(this._seekStep)}
                @change=${e=>this._seekStep=parseInt(e.target.value,10)}
              />
            </div>
          </div>
        </div>

        <!-- Entity Mapping Table -->
        <div class="section">
          <h3 class="section-title">Zugeordnete Home-Assistant-Entitäten</h3>
          <table class="entities-table">
            <thead>
              <tr>
                <th>Funktion</th>
                <th>Entität</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ESPHome Speaker</td>
                <td><code>${this.box.entities.speaker||"Nicht gefunden"}</code></td>
              </tr>
              <tr>
                <td>Music Assistant Player</td>
                <td><code>${this.box.entities.ma_player||"Nicht gefunden"}</code></td>
              </tr>
              <tr>
                <td>NFC Tag UID Sensor</td>
                <td><code>${this.box.entities.nfc_sensor||"Nicht gefunden"}</code></td>
              </tr>
              <tr>
                <td>Batterie</td>
                <td><code>${this.box.entities.battery||"Nicht gefunden"}</code></td>
              </tr>
              <tr>
                <td>Ladezustand</td>
                <td><code>${this.box.entities.charging||"Nicht gefunden"}</code></td>
              </tr>
              <tr>
                <td>LED Beleuchtung</td>
                <td><code>${this.box.entities.led||"Nicht gefunden"}</code></td>
              </tr>
              <tr>
                <td>Status-LED Schalter</td>
                <td><code>${this.box.entities.status_led||"Nicht gefunden"}</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="actions-row">
          <button class="btn btn-back" @click=${this._onBack}>
            Abbrechen
          </button>
          <button class="btn btn-save" @click=${this._onSave}>
            Einstellungen speichern
          </button>
        </div>
      </div>
    `:l``}};$.styles=g`
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
  `,o([d({type:Object})],$.prototype,"box",2),o([d({type:String})],$.prototype,"lang",2),o([c()],$.prototype,"_pauseOnRemoval",2),o([c()],$.prototype,"_resumeOnReplace",2),o([c()],$.prototype,"_maxVolume",2),o([c()],$.prototype,"_seekStep",2),o([c()],$.prototype,"_gesturesEnabled",2),o([c()],$.prototype,"_leftTapAction",2),o([c()],$.prototype,"_rightTapAction",2),o([c()],$.prototype,"_leftTiltAction",2),o([c()],$.prototype,"_rightTiltAction",2),$=o([v("tonieesp-box-detail-view")],$);var w=class extends u{constructor(){super(...arguments);this.lang="de";this._diagnostics=null;this._overwrite=!1;this._message="";this._isError=!1}async connectedCallback(){super.connectedCallback(),await this._loadDiagnostics()}async _loadDiagnostics(){if(this.api)try{this._diagnostics=await this.api.getDiagnostics()}catch(e){console.error("Error loading diagnostics:",e)}}async _exportTags(){if(this.api)try{let e=await this.api.exportTags(),i=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),s=URL.createObjectURL(i),r=document.createElement("a");r.href=s,r.download=`tonieesp-tags-${new Date().toISOString().slice(0,10)}.json`,r.click(),URL.revokeObjectURL(s),this._showMessage("NFC-Bibliothek erfolgreich exportiert!",!1)}catch(e){this._showMessage(`Export fehlgeschlagen: ${e?.message||e}`,!0)}}_triggerFileInput(){let e=this.shadowRoot?.querySelector("#file-input");e&&e.click()}async _onFileSelected(e){let i=e.target;if(!i.files||i.files.length===0)return;let s=i.files[0],r=new FileReader;r.onload=async()=>{try{let n=JSON.parse(r.result);if(!Array.isArray(n))throw new Error("Ung\xFCltiges Dateiformat. Erwarte ein JSON-Array.");let h=await this.api.importTags(n,this._overwrite);this._showMessage(`Erfolgreich importiert: ${h.count} Figuren hinzugef\xFCgt / aktualisiert.`,!1),this.dispatchEvent(new CustomEvent("tags-imported",{bubbles:!0,composed:!0}))}catch(n){this._showMessage(`Import fehlgeschlagen: ${n?.message||n}`,!0)}},r.readAsText(s),i.value=""}_showMessage(e,i){this._message=e,this._isError=i,setTimeout(()=>{this._message=""},5e3)}render(){return l`
      <div class="container">
        <h2 class="title">Einstellungen & Datensicherung</h2>
        <p class="subtitle">
          Verwalte Backups, Importe und Systemdiagnose für TonieESP.
        </p>

        ${this._message?l`
              <div
                class="alert ${this._isError?"alert-error":"alert-success"}"
              >
                ${this._message}
              </div>
            `:""}

        <!-- Export -->
        <div class="card-block">
          <h3 class="block-title">NFC-Figuren-Bibliothek exportieren</h3>
          <p class="block-desc">
            Sichere deine gesamte Figurenbibliothek inklusive Namen, Cover-URLs,
            Playlists und gerätespezifischen Overrides als JSON-Datei.
          </p>
          <button class="btn btn-secondary" @click=${this._exportTags}>
            📥 JSON-Backup herunterladen
          </button>
        </div>

        <!-- Import -->
        <div class="card-block">
          <h3 class="block-title">NFC-Figuren-Bibliothek importieren</h3>
          <p class="block-desc">
            Stelle eine gesicherte JSON-Datei wieder her.
          </p>
          <div class="checkbox-row">
            <input
              type="checkbox"
              id="cb-overwrite"
              .checked=${this._overwrite}
              @change=${e=>this._overwrite=e.target.checked}
            />
            <label for="cb-overwrite"
              >Bestehende UIDs überschreiben (ansonsten nur neue hinzufügen)</label
            >
          </div>
          <input
            type="file"
            id="file-input"
            accept=".json"
            @change=${this._onFileSelected}
          />
          <button class="btn btn-primary" @click=${this._triggerFileInput}>
            📤 JSON hochladen & importieren
          </button>
        </div>

        <!-- Diagnostics -->
        ${this._diagnostics?l`
              <div class="card-block">
                <h3 class="block-title">System-Diagnose</h3>
                <p class="block-desc">
                  Tonieboxen: <strong>${this._diagnostics.box_count}</strong> |
                  Figuren: <strong>${this._diagnostics.tag_count}</strong> |
                  Music Assistant:
                  <strong
                    style="color: ${this._diagnostics.music_assistant_available?"#2e7d32":"#c62828"};"
                  >
                    ${this._diagnostics.music_assistant_available?"Verbunden":"Nicht verf\xFCgbar"}
                  </strong>
                </p>
              </div>
            `:""}
      </div>
    `}};w.styles=g`
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
  `,o([d({type:Object})],w.prototype,"api",2),o([d({type:String})],w.prototype,"lang",2),o([c()],w.prototype,"_diagnostics",2),o([c()],w.prototype,"_overwrite",2),o([c()],w.prototype,"_message",2),o([c()],w.prototype,"_isError",2),w=o([v("tonieesp-settings-view")],w);var T=class extends u{constructor(){super(...arguments);this.logs=[];this.lang="de"}render(){return l`
      <div class="container">
        <div class="header-row">
          <h2 class="title">Ereignisprotokoll & Live-Diagnose</h2>
          <button
            class="btn-clear"
            @click=${()=>this.dispatchEvent(new CustomEvent("clear-logs",{bubbles:!0,composed:!0}))}
          >
            Protokoll leeren
          </button>
        </div>

        <div class="log-list">
          ${this.logs.length===0?l`<div class="empty-state">
                Noch keine Ereignisse erfasst. Stelle eine Figur auf oder tippe
                auf eine Toniebox, um Gesten und Scans live zu sehen.
              </div>`:this.logs.map(e=>{let i="";return e.type.includes("tag")&&(i="log-type-tag"),(e.type.includes("gesture")||e.type.includes("tap")||e.type.includes("tilt"))&&(i="log-type-gesture"),l`
                  <div class="log-item">
                    <span class="log-time">${e.timestamp}</span>
                    <span class="log-type ${i}">${e.type}</span>
                    <span class="log-summary">${e.summary}</span>
                  </div>
                `})}
        </div>
      </div>
    `}};T.styles=g`
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
  `,o([d({type:Array})],T.prototype,"logs",2),o([d({type:String})],T.prototype,"lang",2),T=o([v("tonieesp-logs-view")],T);var _=class extends u{constructor(){super(...arguments);this.narrow=!1;this._activeView="dashboard";this._boxes=[];this._tags=[];this._logs=[];this._initialUid="";this._isLearning=!1;this._learnedUid=null}updated(e){e.has("hass")&&this.hass&&(this._api?this._api.updateHass(this.hass):(this._api=new se(this.hass),this._initData(),this._subscribeToEvents()))}disconnectedCallback(){super.disconnectedCallback(),this._unsubEvents&&(this._unsubEvents(),this._unsubEvents=void 0)}async _initData(){if(this._api)try{let[e,i]=await Promise.all([this._api.getBoxes(),this._api.getTags()]);this._boxes=e||[],this._tags=i||[],this._addLog("init",`TonieESP geladen: ${this._boxes.length} Boxen, ${this._tags.length} Tags`)}catch(e){console.error("Error loading TonieESP initial data:",e)}}async _subscribeToEvents(){if(this._api)try{this._unsubEvents=await this._api.subscribeEvents(e=>{this._handleIncomingEvent(e)})}catch(e){console.error("Error subscribing to TonieESP events:",e)}}_handleIncomingEvent(e){let{event_type:i,data:s}=e;if(i==="box_box_updated"||i==="box_box_added"){let r=s;this._boxes=this._boxes.map(n=>n.id===r.id?r:n),this._boxes.find(n=>n.id===r.id)||(this._boxes=[...this._boxes,r]),this._addLog("box",`Toniebox '${r.name}' aktualisiert (Online: ${r.online})`)}else i==="box_box_removed"?(this._boxes=this._boxes.filter(r=>r.id!==s.id),this._addLog("box",`Toniebox '${s.name}' entfernt`)):i==="tag_create"||i==="tag_update"||i==="tag_delete"?(this._api?.getTags().then(r=>this._tags=r),this._addLog("tag",`NFC-Bibliothek aktualisiert (${i})`)):i==="tag_learned"?(this._learnedUid=s.uid,this._addLog("learn",`Figur erfasst im Lernmodus: ${s.uid}`)):this._addLog("event",`${i}: ${JSON.stringify(s)}`)}_addLog(e,i,s){let r={id:Math.random().toString(36).substring(2,9),timestamp:new Date().toLocaleTimeString(),type:e,summary:i,details:s};this._logs=[r,...this._logs.slice(0,99)]}async _handleBoxControl(e){let{boxId:i,action:s,data:r}=e.detail;if(this._api)try{await this._api.controlPlayback(i,s,r),this._addLog("playback",`Aktion '${s}' an Box gesendet`)}catch(n){alert(`Wiedergabefehler: ${n?.message||n}`)}}async _handlePlayTagOnBox(e){let{tag:i,boxId:s}=e.detail;if(this._api)try{await this._api.controlPlayback(s,"play_tag",{uid:i.uid}),this._addLog("playback",`Tag ${i.name} (${i.uid}) auf Box gestartet`)}catch(r){alert(`Fehler beim Abspielen: ${r?.message||r}`)}}_handleSetupUnknownTag(e){let{uid:i}=e.detail;this._editingTag=void 0,this._initialUid=i,this._activeView="editor"}_handleOpenBoxDetails(e){this._selectedBox=e.detail.box,this._activeView="detail"}async _handleSaveBoxSettings(e){let{boxId:i,settings:s}=e.detail;if(this._api)try{let r=await this._api.updateBoxSettings(i,s);this._boxes=this._boxes.map(n=>n.id===r.id?r:n),alert("Einstellungen erfolgreich gespeichert!"),this._activeView="dashboard"}catch(r){alert(`Fehler beim Speichern: ${r?.message||r}`)}}_handleAddNewTag(){this._editingTag=void 0,this._initialUid="",this._activeView="editor"}_handleEditTag(e){this._editingTag=e.detail.tag,this._initialUid="",this._activeView="editor"}async _handleDeleteTag(e){let{tag:i}=e.detail;if(confirm(`Soll die Figur '${i.name}' (${i.uid}) wirklich gel\xF6scht werden?`)&&this._api)try{await this._api.deleteTag(i.uid),this._tags=this._tags.filter(s=>s.uid!==i.uid),this._addLog("tag",`Figur '${i.name}' gel\xF6scht`)}catch(s){alert(`Fehler beim L\xF6schen: ${s?.message||s}`)}}async _handleSaveTagRecord(e){let{tag:i}=e.detail;if(this._api)try{let s=await this._api.saveTag(i),r=this._tags.findIndex(n=>n.uid===s.uid);r>=0?this._tags[r]=s:this._tags=[s,...this._tags],this._tags=[...this._tags],this._activeView="tags",this._addLog("tag",`Figur '${s.name}' gespeichert`)}catch(s){alert(`Fehler beim Speichern der Figur: ${s?.message||s}`)}}async _handleStartScanLearning(){this._isLearning=!0,this._learnedUid=null,this._api&&await this._api.startLearning()}async _handleStopScanLearning(){this._isLearning=!1,this._learnedUid=null,this._api&&await this._api.stopLearning()}_handleUseLearnedTag(){if(!this._learnedUid)return;let e=this._learnedUid;this._handleStopScanLearning(),this._editingTag=void 0,this._initialUid=e,this._activeView="editor"}_handleMediaSelectedFromBrowser(e){let i=e.detail;this._activeView="editor";let s=this.shadowRoot?.querySelector("tonieesp-tag-editor-view");s&&s.setMediaSelection&&s.setMediaSelection(i)}render(){return l`
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
            📊 Dashboard
          </button>
          <button
            class="nav-btn ${this._activeView==="tags"||this._activeView==="editor"?"active":""}"
            @click=${()=>this._activeView="tags"}
          >
            🧸 NFC-Figuren (${this._tags.length})
          </button>
          <button
            class="nav-btn ${this._activeView==="browser"?"active":""}"
            @click=${()=>this._activeView="browser"}
          >
            🎵 Mediathek
          </button>
          <button
            class="nav-btn ${this._activeView==="settings"?"active":""}"
            @click=${()=>this._activeView="settings"}
          >
            ⚙️ Einstellungen
          </button>
          <button
            class="nav-btn ${this._activeView==="logs"?"active":""}"
            @click=${()=>this._activeView="logs"}
          >
            📋 Logs
          </button>
        </nav>
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
        @tags-imported=${()=>this._api?.getTags().then(e=>this._tags=e)}
        @clear-logs=${()=>this._logs=[]}
      >
        ${this._activeView==="dashboard"?l`<tonieesp-dashboard-view
              .boxes=${this._boxes}
              .tags=${this._tags}
            ></tonieesp-dashboard-view>`:""}
        ${this._activeView==="tags"?l`<tonieesp-tag-library-view
              .tags=${this._tags}
              .boxes=${this._boxes}
            ></tonieesp-tag-library-view>`:""}
        ${this._activeView==="editor"?l`<tonieesp-tag-editor-view
              .tag=${this._editingTag}
              .boxes=${this._boxes}
              .initialUid=${this._initialUid}
            ></tonieesp-tag-editor-view>`:""}
        ${this._activeView==="detail"&&this._selectedBox?l`<tonieesp-box-detail-view
              .box=${this._selectedBox}
            ></tonieesp-box-detail-view>`:""}
        ${this._activeView==="browser"?l`<tonieesp-media-browser-view
              .api=${this._api}
            ></tonieesp-media-browser-view>`:""}
        ${this._activeView==="settings"?l`<tonieesp-settings-view .api=${this._api}></tonieesp-settings-view>`:""}
        ${this._activeView==="logs"?l`<tonieesp-logs-view .logs=${this._logs}></tonieesp-logs-view>`:""}
      </main>

      <!-- Scan Learning Modal Dialog -->
      ${this._isLearning?l`
            <div class="modal-backdrop">
              <div class="modal-content">
                <div class="pulse-icon">📡</div>
                <h3 class="modal-title">Scan-Lernmodus aktiv</h3>
                <p class="modal-text">
                  Stelle jetzt eine NFC-Figur auf eine beliebige Toniebox. Die
                  UID wird direkt empfangen.
                </p>

                ${this._learnedUid?l`
                      <div class="captured-uid">UID: ${this._learnedUid}</div>
                      <div>
                        <button
                          class="btn-modal btn-modal-cancel"
                          @click=${this._handleStopScanLearning}
                        >
                          Schließen
                        </button>
                        <button
                          class="btn-modal btn-modal-use"
                          @click=${this._handleUseLearnedTag}
                        >
                          Figur einrichten →
                        </button>
                      </div>
                    `:l`
                      <button
                        class="btn-modal btn-modal-cancel"
                        @click=${this._handleStopScanLearning}
                      >
                        Abbrechen
                      </button>
                    `}
              </div>
            </div>
          `:""}
    `}};_.styles=g`
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
  `,o([d({attribute:!1})],_.prototype,"hass",2),o([d({type:Boolean})],_.prototype,"narrow",2),o([d({type:Object})],_.prototype,"panel",2),o([c()],_.prototype,"_activeView",2),o([c()],_.prototype,"_boxes",2),o([c()],_.prototype,"_tags",2),o([c()],_.prototype,"_logs",2),o([c()],_.prototype,"_editingTag",2),o([c()],_.prototype,"_initialUid",2),o([c()],_.prototype,"_selectedBox",2),o([c()],_.prototype,"_isLearning",2),o([c()],_.prototype,"_learnedUid",2),_=o([v("tonieesp-panel")],_);export{_ as TonieESPPanel};
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
