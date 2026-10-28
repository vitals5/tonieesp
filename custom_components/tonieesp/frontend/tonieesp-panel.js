var ze=Object.defineProperty;var Ue=Object.getOwnPropertyDescriptor;var n=(o,t,e,i)=>{for(var a=i>1?void 0:i?Ue(t,e):t,r=o.length-1,l;r>=0;r--)(l=o[r])&&(a=(i?l(t,e,a):l(a))||a);return i&&a&&ze(t,e,a),a};var Z=globalThis,q=Z.ShadowRoot&&(Z.ShadyCSS===void 0||Z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ae=Symbol(),be=new WeakMap,Q=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==ae)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(q&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=be.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&be.set(e,t))}return t}toString(){return this.cssText}},me=o=>new Q(typeof o=="string"?o:o+"",void 0,ae),v=(o,...t)=>{let e=o.length===1?o[0]:t.reduce((i,a,r)=>i+(l=>{if(l._$cssResult$===!0)return l.cssText;if(typeof l=="number")return l;throw Error("Value passed to 'css' function must be a 'css' function result: "+l+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+o[r+1],o[0]);return new Q(e,o,ae)},ve=(o,t)=>{if(q)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),a=Z.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=e.cssText,o.appendChild(i)}},se=q?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return me(e)})(o):o;var{is:Ne,defineProperty:De,getOwnPropertyDescriptor:Fe,getOwnPropertyNames:Te,getOwnPropertySymbols:Re,getPrototypeOf:Qe}=Object,X=globalThis,fe=X.trustedTypes,He=fe?fe.emptyScript:"",je=X.reactiveElementPolyfillSupport,H=(o,t)=>o,j={toAttribute(o,t){switch(t){case Boolean:o=o?He:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},V=(o,t)=>!Ne(o,t),Ae={attribute:!0,type:String,converter:j,reflect:!1,useDefault:!1,hasChanged:V};Symbol.metadata??=Symbol("metadata"),X.litPropertyMetadata??=new WeakMap;var S=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ae){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(t,i,e);a!==void 0&&De(this.prototype,t,a)}}static getPropertyDescriptor(t,e,i){let{get:a,set:r}=Fe(this.prototype,t)??{get(){return this[e]},set(l){this[e]=l}};return{get:a,set(l){let g=a?.call(this);r?.call(this,l),this.requestUpdate(t,g,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ae}static _$Ei(){if(this.hasOwnProperty(H("elementProperties")))return;let t=Qe(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(H("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(H("properties"))){let e=this.properties,i=[...Te(e),...Re(e)];for(let a of i)this.createProperty(a,e[a])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,a]of e)this.elementProperties.set(i,a)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let a=this._$Eu(e,i);a!==void 0&&this._$Eh.set(a,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let a of i)e.unshift(se(a))}else t!==void 0&&e.push(se(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ve(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),a=this.constructor._$Eu(t,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:j).toAttribute(e,i.type);this._$Em=t,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(t,e){let i=this.constructor,a=i._$Eh.get(t);if(a!==void 0&&this._$Em!==a){let r=i.getPropertyOptions(a),l=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:j;this._$Em=a;let g=l.fromAttribute(e,r.type);this[a]=g??this._$Ej?.get(a)??g,this._$Em=null}}requestUpdate(t,e,i,a=!1,r){if(t!==void 0){let l=this.constructor;if(a===!1&&(r=this[t]),i??=l.getPropertyOptions(t),!((i.hasChanged??V)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(l._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:a,wrapped:r},l){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,l??e??this[t]),r!==!0||l!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),a===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:l}=r,g=this[a];l!==!0||this._$AL.has(a)||g===void 0||this.C(a,void 0,r,g)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[H("elementProperties")]=new Map,S[H("finalized")]=new Map,je?.({ReactiveElement:S}),(X.reactiveElementVersions??=[]).push("2.1.2");var pe=globalThis,xe=o=>o,ee=pe.trustedTypes,_e=ee?ee.createPolicy("lit-html",{createHTML:o=>o}):void 0,Ee="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,Se="?"+M,We=`<${Se}>`,U=document,P=()=>U.createComment(""),G=o=>o===null||typeof o!="object"&&typeof o!="function",he=Array.isArray,Pe=o=>he(o)||typeof o?.[Symbol.iterator]=="function",re=`[ 	
\f\r]`,W=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ye=/-->/g,we=/>/g,L=RegExp(`>|${re}(?:([^\\s"'>=/]+)(${re}*=${re}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),$e=/'/g,ke=/"/g,Ie=/^(?:script|style|textarea|title)$/i,ge=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),d=ge(1),it=ge(2),at=ge(3),N=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),Ce=new WeakMap,z=U.createTreeWalker(U,129);function Me(o,t){if(!he(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return _e!==void 0?_e.createHTML(t):t}var Ge=(o,t)=>{let e=o.length-1,i=[],a,r=t===2?"<svg>":t===3?"<math>":"",l=W;for(let g=0;g<e;g++){let h=o[g],A,w,m=-1,E=0;for(;E<h.length&&(l.lastIndex=E,w=l.exec(h),w!==null);)E=l.lastIndex,l===W?w[1]==="!--"?l=ye:w[1]!==void 0?l=we:w[2]!==void 0?(Ie.test(w[2])&&(a=RegExp("</"+w[2],"g")),l=L):w[3]!==void 0&&(l=L):l===L?w[0]===">"?(l=a??W,m=-1):w[1]===void 0?m=-2:(m=l.lastIndex-w[2].length,A=w[1],l=w[3]===void 0?L:w[3]==='"'?ke:$e):l===ke||l===$e?l=L:l===ye||l===we?l=W:(l=L,a=void 0);let I=l===L&&o[g+1].startsWith("/>")?" ":"";r+=l===W?h+We:m>=0?(i.push(A),h.slice(0,m)+Ee+h.slice(m)+M+I):h+M+(m===-2?g:I)}return[Me(o,r+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},K=class o{constructor({strings:t,_$litType$:e},i){let a;this.parts=[];let r=0,l=0,g=t.length-1,h=this.parts,[A,w]=Ge(t,e);if(this.el=o.createElement(A,i),z.currentNode=this.el.content,e===2||e===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(a=z.nextNode())!==null&&h.length<g;){if(a.nodeType===1){if(a.hasAttributes())for(let m of a.getAttributeNames())if(m.endsWith(Ee)){let E=w[l++],I=a.getAttribute(m).split(M),Y=/([.?@])?(.*)/.exec(E);h.push({type:1,index:r,name:Y[2],strings:I,ctor:Y[1]==="."?ne:Y[1]==="?"?le:Y[1]==="@"?de:R}),a.removeAttribute(m)}else m.startsWith(M)&&(h.push({type:6,index:r}),a.removeAttribute(m));if(Ie.test(a.tagName)){let m=a.textContent.split(M),E=m.length-1;if(E>0){a.textContent=ee?ee.emptyScript:"";for(let I=0;I<E;I++)a.append(m[I],P()),z.nextNode(),h.push({type:2,index:++r});a.append(m[E],P())}}}else if(a.nodeType===8)if(a.data===Se)h.push({type:2,index:r});else{let m=-1;for(;(m=a.data.indexOf(M,m+1))!==-1;)h.push({type:7,index:r}),m+=M.length-1}r++}}static createElement(t,e){let i=U.createElement("template");return i.innerHTML=t,i}};function T(o,t,e=o,i){if(t===N)return t;let a=i!==void 0?e._$Co?.[i]:e._$Cl,r=G(t)?void 0:t._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(o),a._$AT(o,e,i)),i!==void 0?(e._$Co??=[])[i]=a:e._$Cl=a),a!==void 0&&(t=T(o,a._$AS(o,t.values),a,i)),t}var oe=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,a=(t?.creationScope??U).importNode(e,!0);z.currentNode=a;let r=z.nextNode(),l=0,g=0,h=i[0];for(;h!==void 0;){if(l===h.index){let A;h.type===2?A=new J(r,r.nextSibling,this,t):h.type===1?A=new h.ctor(r,h.name,h.strings,this,t):h.type===6&&(A=new ce(r,this,t)),this._$AV.push(A),h=i[++g]}l!==h?.index&&(r=z.nextNode(),l++)}return z.currentNode=U,a}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},J=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,a){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=T(this,t,e),G(t)?t===x||t==null||t===""?(this._$AH!==x&&this._$AR(),this._$AH=x):t!==this._$AH&&t!==N&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Pe(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==x&&G(this._$AH)?this._$AA.nextSibling.data=t:this.T(U.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,a=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=K.createElement(Me(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(e);else{let r=new oe(a,this),l=r.u(this.options);r.p(e),this.T(l),this._$AH=r}}_$AC(t){let e=Ce.get(t.strings);return e===void 0&&Ce.set(t.strings,e=new K(t)),e}k(t){he(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,a=0;for(let r of t)a===e.length?e.push(i=new o(this.O(P()),this.O(P()),this,this.options)):i=e[a],i._$AI(r),a++;a<e.length&&(this._$AR(i&&i._$AB.nextSibling,a),e.length=a)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=xe(t).nextSibling;xe(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},R=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,a,r){this.type=1,this._$AH=x,this._$AN=void 0,this.element=t,this.name=e,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=x}_$AI(t,e=this,i,a){let r=this.strings,l=!1;if(r===void 0)t=T(this,t,e,0),l=!G(t)||t!==this._$AH&&t!==N,l&&(this._$AH=t);else{let g=t,h,A;for(t=r[0],h=0;h<r.length-1;h++)A=T(this,g[i+h],e,h),A===N&&(A=this._$AH[h]),l||=!G(A)||A!==this._$AH[h],A===x?t=x:t!==x&&(t+=(A??"")+r[h+1]),this._$AH[h]=A}l&&!a&&this.j(t)}j(t){t===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ne=class extends R{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===x?void 0:t}},le=class extends R{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==x)}},de=class extends R{constructor(t,e,i,a,r){super(t,e,i,a,r),this.type=5}_$AI(t,e=this){if((t=T(this,t,e,0)??x)===N)return;let i=this._$AH,a=t===x&&i!==x||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==x&&(i===x||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ce=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){T(this,t)}};var Ke=pe.litHtmlPolyfillSupport;Ke?.(K,J),(pe.litHtmlVersions??=[]).push("3.3.3");var Be=(o,t,e)=>{let i=e?.renderBefore??t,a=i._$litPart$;if(a===void 0){let r=e?.renderBefore??null;i._$litPart$=a=new J(t.insertBefore(P(),r),r,void 0,e??{})}return a._$AI(o),a};var ue=globalThis,b=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Be(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return N}};b._$litElement$=!0,b.finalized=!0,ue.litElementHydrateSupport?.({LitElement:b});var Je=ue.litElementPolyfillSupport;Je?.({LitElement:b});(ue.litElementVersions??=[]).push("4.2.2");var f=o=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(o,t)}):customElements.define(o,t)};var Ye={attribute:!0,type:String,converter:j,reflect:!1,hasChanged:V},Ze=(o=Ye,t,e)=>{let{kind:i,metadata:a}=e,r=globalThis.litPropertyMetadata.get(a);if(r===void 0&&globalThis.litPropertyMetadata.set(a,r=new Map),i==="setter"&&((o=Object.create(o)).wrapped=!0),r.set(e.name,o),i==="accessor"){let{name:l}=e;return{set(g){let h=t.get.call(this);t.set.call(this,g),this.requestUpdate(l,h,o,!0,g)},init(g){return g!==void 0&&this.C(l,void 0,o,g),g}}}if(i==="setter"){let{name:l}=e;return function(g){let h=this[l];t.call(this,g),this.requestUpdate(l,h,o,!0,g)}}throw Error("Unsupported decorator location: "+i)};function p(o){return(t,e)=>typeof e=="object"?Ze(o,t,e):((i,a,r)=>{let l=a.hasOwnProperty(r);return a.constructor.createProperty(r,i),l?Object.getOwnPropertyDescriptor(a,r):void 0})(o,t,e)}function c(o){return p({...o,state:!0,attribute:!1})}var ie=class{constructor(t){this.hass=t}updateHass(t){this.hass=t}async getBoxes(){return this.hass.callWS({type:"tonieesp/boxes/list"})}async updateBoxSettings(t,e){return this.hass.callWS({type:"tonieesp/boxes/update",box_id:t,settings:e})}async getTags(t,e){return this.hass.callWS({type:"tonieesp/tags/list",search:t||void 0,media_type:e||void 0})}async getTag(t){return this.hass.callWS({type:"tonieesp/tags/get",uid:t})}async saveTag(t){return this.hass.callWS({type:"tonieesp/tags/save",tag:t})}async deleteTag(t){return this.hass.callWS({type:"tonieesp/tags/delete",uid:t})}async importTags(t,e=!1){return this.hass.callWS({type:"tonieesp/tags/import",tags:t,overwrite:e})}async exportTags(){return this.hass.callWS({type:"tonieesp/tags/export"})}async startLearning(t,e=60){return this.hass.callWS({type:"tonieesp/tags/learn_start",device_id:t||void 0,timeout:e})}async stopLearning(){return this.hass.callWS({type:"tonieesp/tags/learn_stop"})}async searchMedia(t,e){return this.hass.callWS({type:"tonieesp/media/search",query:t,media_types:e})}async controlPlayback(t,e,i){return this.hass.callWS({type:"tonieesp/playback/control",box_id:t,action:e,data:i})}async getDiagnostics(){return this.hass.callWS({type:"tonieesp/diagnostics"})}async subscribeEvents(t){return this.hass?.connection?.subscribeMessage?this.hass.connection.subscribeMessage(t,{type:"tonieesp/events/subscribe"}):()=>{}}};var Oe={de:{"nav.dashboard":"Dashboard","nav.tags":"NFC-Figuren","nav.browser":"Mediathek","nav.settings":"Einstellungen","nav.logs":"Diagnose & Logs","dashboard.title":"TonieESP \xDCbersicht","dashboard.subtitle":"Zentrale Verwaltung und Live-Status aller Tonieboxen","dashboard.boxes_online":"{count} Box(en) online","dashboard.total_boxes":"Tonieboxen gesamt","dashboard.online":"Online","dashboard.active_playbacks":"Aktive Wiedergaben","dashboard.tags_in_library":"NFC-Figuren in Bibliothek","dashboard.no_boxes":"Keine Tonieboxen eingerichtet","dashboard.add_box_hint":"Richte deine Toniebox in Home Assistant unter Einstellungen > Ger\xE4te & Dienste ein.","dashboard.current_tag":"Aktuelle Figur:","dashboard.no_tag":"Keine Figur aufgesetzt","dashboard.unknown_tag_alert":"Unbekannte Figur erkannt!","dashboard.setup_tag_btn":"Jetzt konfigurieren","dashboard.volume":"Lautst\xE4rke","dashboard.battery":"Batterie","dashboard.charging":"Wird geladen","control.play":"Abspielen","control.pause":"Pausieren","control.stop":"Stoppen","control.prev":"Zur\xFCck","control.next":"Weiter","control.details":"Details & Einstellungen","tags.title":"Globale NFC-Figuren-Bibliothek","tags.search_placeholder":"NFC-Figuren durchsuchen (Name, UID, Titel)...","tags.filter_all":"Alle Typen","tags.filter_playlist":"Playlists","tags.filter_album":"Alben","tags.filter_audiobook":"H\xF6rb\xFCcher","tags.filter_track":"Titel","tags.filter_radio":"Radio","tags.filter_podcast":"Podcasts","tags.add_new":"+ Figur hinzuf\xFCgen","tags.scan_learn":"\u26A1 Scan-Lernmodus","tags.play_on":"\u25B6 Play","tags.edit":"Bearbeiten","tags.delete":"L\xF6schen","tags.confirm_delete":"Soll die Figur '{name}' ({uid}) wirklich gel\xF6scht werden?","tags.empty":"Keine Figuren gefunden","tags.empty_hint":"Lege eine Figur auf deine Toniebox oder klicke auf '+ Figur hinzuf\xFCgen'.","tags.no_media":"Kein Medium zugewiesen","tags.resume_badge":"\u23F1 Resume","tags.shuffle_badge":"\u{1F500} Shuffle","tags.overrides_badge":"\u26A1 {count} Override(s)","editor.title_new":"Neue NFC-Figur anlegen","editor.title_edit":"NFC-Figur bearbeiten","editor.tab_global":"Globale Einstellungen","editor.tab_overrides":"Ger\xE4tespezifische Overrides","editor.uid":"NFC UID (16 Hex-Zeichen)","editor.uid_hint":"Z.B. E004015023AABBCC","editor.name":"Name der Figur","editor.desc":"Beschreibung (optional)","editor.image":"Cover-Bild URL (optional)","editor.media_provider":"Medien-Provider","editor.media_type":"Medientyp","editor.media_id":"Medien-ID / URI","editor.media_title":"Titel / Playlist-Name","editor.media_artist":"K\xFCnstler / Interpret (optional)","editor.browse_ma":"\u{1F50D} In Mediathek suchen...","editor.settings":"Wiedergabeeinstellungen","editor.resume":"Wiedergabefortschritt merken (Resume)","editor.shuffle":"Zufallswiedergabe (Shuffle)","editor.repeat":"Wiederholen","editor.repeat_off":"Aus","editor.repeat_one":"Aktuellen Titel wiederholen","editor.repeat_all":"Ganze Playlist wiederholen","editor.vol_limit":"Lautst\xE4rkebegrenzung (optional)","editor.overrides_hint":"Definiere abweichende Playlists oder Einstellungen f\xFCr einzelne Tonieboxen.","editor.select_box":"Toniebox ausw\xE4hlen:","editor.add_override":"+ Override hinzuf\xFCgen","editor.delete_override":"Override entfernen","editor.save":"Speichern","editor.cancel":"Abbrechen","box.detail_title":"Toniebox: {name}","box.section_playback":"Wiedergabe & Verhalten","box.pause_removal":"Automatische Pause beim Herunternehmen der Figur","box.resume_replace":"Automatisches Fortsetzen beim Wiederaufsetzen","box.max_volume":"Maximale Lautst\xE4rke (0 bis 1.0)","box.seek_step":"Spul-Schrittweite f\xFCr Neigegesten (Sekunden)","box.section_gestures":"Gesten-Steuerung (ESPHome)","box.gestures_enabled":"Gestensteuerung aktivieren","box.left_tap":"Linkes Ohr / Linker Klopfer","box.right_tap":"Rechtes Ohr / Rechter Klopfer","box.left_tilt":"Nach links kippen","box.right_tilt":"Nach rechts kippen","box.section_tuning":"Sensor-Feinabstimmung (Vibrationsschutz)","box.tuning_hint":"Filtert Vibrationen des Lautsprechers heraus, um versehentliches \xDCberspringen oder Spulen bei lauter Musik zu verhindern.","box.tap_threshold":"Klopf-Schwellenwert (Tap Threshold)","box.tap_threshold_hint":"H\xF6herer Wert = unempfindlicher gegen Lautsprechervibrationen (Standard 15\u201325).","box.tap_time_limit":"Klopf-Zeitfenster (Tap Time Limit)","box.tap_time_limit_hint":"Zeitfenster f\xFCr die Klopferkennung.","box.save_success":"Einstellungen erfolgreich gespeichert!","box.back":"\u2190 Zur\xFCck zur \xDCbersicht","action.previous_track":"Vorheriger Titel","action.next_track":"N\xE4chster Titel","action.seek_backward":"Zur\xFCckspulen","action.seek_forward":"Vorspulen","action.play_pause":"Play / Pause umschalten","action.volume_up":"Lauter","action.volume_down":"Leiser","action.none":"Keine Aktion (Deaktiviert)","learn.title":"Scan-Lernmodus aktiv","learn.instructions":"Stelle jetzt eine NFC-Figur auf eine beliebige Toniebox. Die UID wird direkt erfasst.","learn.waiting":"Warte auf NFC-Scan...","learn.captured":"Figur erkannt: {uid}!","learn.cancel":"Abbrechen","learn.close":"Schlie\xDFen","learn.use_btn":"Figur einrichten \u2192","browser.title":"Music Assistant Mediathek durchsuchen","browser.subtitle":"Finde Playlists, Alben, H\xF6rb\xFCcher und Sender f\xFCr deine Tonie-Figuren","browser.search_placeholder":"Suchbegriff (z.B. Benjamin Bl\xFCmchen, Die drei ???)...","browser.search_btn":"Suchen","browser.searching":"Suche l\xE4uft...","browser.no_results":"Keine Medien gefunden. Probiere einen anderen Suchbegriff.","browser.select_btn":"\xDCbernehmen","settings.title":"TonieESP Einstellungen & Sicherung","settings.subtitle":"Verwalte globale Daten und erstelle Sicherungskopien deiner Figuren-Bibliothek","settings.export":"NFC-Bibliothek exportieren (JSON)","settings.export_desc":"Lade alle Figuren und Zuordnungen als Sicherung herunter.","settings.export_btn":"Herunterladen","settings.import":"NFC-Bibliothek importieren (JSON)","settings.import_desc":"Stelle eine zuvor gesicherte Figuren-Bibliothek wieder her.","settings.import_btn":"JSON hochladen","settings.overwrite":"Vorhandene UIDs \xFCberschreiben","settings.diagnostics":"System-Diagnose","settings.diagnostics_desc":"\xDCbersicht \xFCber erkannte ESPHome-Boxen, Entit\xE4ten und Music Assistant Status.","logs.title":"Ereignis-Protokoll & Diagnose","logs.clear_btn":"Logs leeren","logs.empty":"Noch keine Ereignisse protokolliert.","common.online":"Online","common.offline":"Offline","common.save_success":"Erfolgreich gespeichert!","common.error":"Fehler aufgetreten: {error}","common.loading":"Wird geladen...","common.cancel":"Abbrechen","common.save":"Speichern","common.delete":"L\xF6schen","common.close":"Schlie\xDFen","common.language":"Sprache"},en:{"nav.dashboard":"Dashboard","nav.tags":"NFC Tags","nav.browser":"Media Library","nav.settings":"Settings","nav.logs":"Diagnostics & Logs","dashboard.title":"TonieESP Overview","dashboard.subtitle":"Central management and live status for all Tonieboxes","dashboard.boxes_online":"{count} box(es) online","dashboard.total_boxes":"Total Tonieboxes","dashboard.online":"Online","dashboard.active_playbacks":"Active Playbacks","dashboard.tags_in_library":"NFC Tags in Library","dashboard.no_boxes":"No Tonieboxes configured yet","dashboard.add_box_hint":"Add your Toniebox in Home Assistant under Settings > Devices & Services.","dashboard.current_tag":"Current Tag:","dashboard.no_tag":"No figure placed","dashboard.unknown_tag_alert":"Unknown figure scanned!","dashboard.setup_tag_btn":"Configure now","dashboard.volume":"Volume","dashboard.battery":"Battery","dashboard.charging":"Charging","control.play":"Play","control.pause":"Pause","control.stop":"Stop","control.prev":"Previous","control.next":"Next","control.details":"Details & Settings","tags.title":"Global NFC Tag Library","tags.search_placeholder":"Search NFC tags (name, UID, title)...","tags.filter_all":"All types","tags.filter_playlist":"Playlists","tags.filter_album":"Albums","tags.filter_audiobook":"Audiobooks","tags.filter_track":"Tracks","tags.filter_radio":"Radio","tags.filter_podcast":"Podcasts","tags.add_new":"+ Add Tag","tags.scan_learn":"\u26A1 Scan Learning","tags.play_on":"\u25B6 Play","tags.edit":"Edit","tags.delete":"Delete","tags.confirm_delete":"Do you really want to delete '{name}' ({uid})?","tags.empty":"No tags found","tags.empty_hint":"Place a figure onto your Toniebox or click '+ Add Tag'.","tags.no_media":"No media assigned","tags.resume_badge":"\u23F1 Resume","tags.shuffle_badge":"\u{1F500} Shuffle","tags.overrides_badge":"\u26A1 {count} Override(s)","editor.title_new":"Add New NFC Tag","editor.title_edit":"Edit NFC Tag","editor.tab_global":"Global Settings","editor.tab_overrides":"Device Overrides","editor.uid":"NFC UID (16 Hex characters)","editor.uid_hint":"E.g. E004015023AABBCC","editor.name":"Tag Name","editor.desc":"Description (optional)","editor.image":"Cover Image URL (optional)","editor.media_provider":"Media Provider","editor.media_type":"Media Type","editor.media_id":"Media ID / URI","editor.media_title":"Title / Playlist Name","editor.media_artist":"Artist / Author (optional)","editor.browse_ma":"\u{1F50D} Search in Media Library...","editor.settings":"Playback Settings","editor.resume":"Remember playback progress (Resume)","editor.shuffle":"Shuffle playback","editor.repeat":"Repeat","editor.repeat_off":"Off","editor.repeat_one":"Repeat Track","editor.repeat_all":"Repeat All","editor.vol_limit":"Volume limit (optional)","editor.overrides_hint":"Define different playlists or settings for specific Tonieboxes.","editor.select_box":"Select Toniebox:","editor.add_override":"+ Add Override","editor.delete_override":"Remove Override","editor.save":"Save Tag","editor.cancel":"Cancel","box.detail_title":"Toniebox: {name}","box.section_playback":"Playback & Behavior","box.pause_removal":"Pause automatically when tag is removed","box.resume_replace":"Resume automatically when tag is replaced","box.max_volume":"Maximum Volume Limit (0 to 1.0)","box.seek_step":"Seek step for tilt gestures (seconds)","box.section_gestures":"Gesture Controls (ESPHome)","box.gestures_enabled":"Enable gesture controls","box.left_tap":"Left ear / Left tap","box.right_tap":"Right ear / Right tap","box.left_tilt":"Tilt left","box.right_tilt":"Tilt right","box.section_tuning":"Sensor Fine-Tuning (Vibration Filter)","box.tuning_hint":"Filters out speaker vibrations to prevent accidental skips or seeking during loud audio playback.","box.tap_threshold":"Tap Threshold","box.tap_threshold_hint":"Higher value = less sensitive to speaker vibrations (standard 15\u201325).","box.tap_time_limit":"Tap Time Limit","box.tap_time_limit_hint":"Time window for tap recognition.","box.save_success":"Settings saved successfully!","box.back":"\u2190 Back to Overview","action.previous_track":"Previous Track","action.next_track":"Next Track","action.seek_backward":"Seek Backward","action.seek_forward":"Seek Forward","action.play_pause":"Toggle Play / Pause","action.volume_up":"Volume Up","action.volume_down":"Volume Down","action.none":"No Action (Disabled)","learn.title":"Scan Learning Mode Active","learn.instructions":"Place a figure onto any of your Tonieboxes now. The UID will be captured directly.","learn.waiting":"Waiting for NFC scan...","learn.captured":"Captured figure: {uid}!","learn.cancel":"Cancel","learn.close":"Close","learn.use_btn":"Set Up Tag \u2192","browser.title":"Search Music Assistant Library","browser.subtitle":"Find playlists, albums, audiobooks and radio stations for your figures","browser.search_placeholder":"Search query (e.g. Bedtime Stories, Peter Pan)...","browser.search_btn":"Search","browser.searching":"Searching...","browser.no_results":"No media found. Try a different search query.","browser.select_btn":"Select","settings.title":"TonieESP Settings & Backup","settings.subtitle":"Manage global data and create backup copies of your tag library","settings.export":"Export Tag Library (JSON)","settings.export_desc":"Download all tags and configurations as a backup file.","settings.export_btn":"Download Backup","settings.import":"Import Tag Library (JSON)","settings.import_desc":"Restore a previously backed up tag library.","settings.import_btn":"Upload JSON","settings.overwrite":"Overwrite existing UIDs","settings.diagnostics":"System Diagnostics","settings.diagnostics_desc":"Overview of discovered ESPHome boxes, entities, and Music Assistant status.","logs.title":"Event Log & Diagnostics","logs.clear_btn":"Clear Logs","logs.empty":"No events recorded yet.","common.online":"Online","common.offline":"Offline","common.save_success":"Saved successfully!","common.error":"An error occurred: {error}","common.loading":"Loading...","common.cancel":"Cancel","common.save":"Save","common.delete":"Delete","common.close":"Close","common.language":"Language"}};function s(o,t="de",e){let i=t&&t.toLowerCase().startsWith("en")?"en":"de",a=Oe[i]?.[o]||Oe.de?.[o]||o;if(e)for(let[r,l]of Object.entries(e))a=a.replace(new RegExp(`\\{${r}\\}`,"g"),String(l));return a}var Le="data:image/png;base64,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";var k=class extends b{constructor(){super(...arguments);this.online=!1;this.batteryLevel=null;this.charging=!1;this.type="";this.text=""}render(){return this.type==="online"?d`
        <span class="${this.online?"badge-online":"badge-offline"}">
          <span class="dot"></span>
          ${this.online?"Online":"Offline"}
        </span>
      `:this.type==="battery"&&this.batteryLevel!==null?d`
        <span class="badge-battery">
          ${this.charging?"\u26A1":"\u{1F50B}"} ${this.batteryLevel}%
        </span>
      `:this.type==="media_type"?d`<span class="badge-type">${this.text}</span>`:d`<span>${this.text}</span>`}};k.styles=v`
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
  `,n([p({type:Boolean})],k.prototype,"online",2),n([p({type:Number})],k.prototype,"batteryLevel",2),n([p({type:Boolean})],k.prototype,"charging",2),n([p({type:String})],k.prototype,"type",2),n([p({type:String})],k.prototype,"text",2),k=n([f("tonieesp-status-badge")],k);var D=class extends b{constructor(){super(...arguments);this.lang="de"}_onControl(e,i){this.dispatchEvent(new CustomEvent("box-control",{detail:{boxId:this.box.id,action:e,data:i},bubbles:!0,composed:!0}))}_onSetupUnknown(){this.dispatchEvent(new CustomEvent("setup-unknown-tag",{detail:{uid:this.box.unknown_tag,boxId:this.box.id},bubbles:!0,composed:!0}))}_onOpenDetails(){this.dispatchEvent(new CustomEvent("open-box-details",{detail:{box:this.box},bubbles:!0,composed:!0}))}_onVolumeChange(e){let i=e.target,a=parseFloat(i.value);this._onControl("volume",{volume:a})}render(){if(!this.box)return d``;let e=this.box.playback||{},i=e.state==="playing";return d`
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
            ${this.box.battery?.level!==null?d`
                  <tonieesp-status-badge
                    type="battery"
                    .batteryLevel=${this.box.battery.level}
                    .charging=${this.box.battery.charging}
                  ></tonieesp-status-badge>
                `:""}
          </div>
        </div>

        <!-- Tag Notification / Current Tag -->
        ${this.box.unknown_tag?d`
              <div class="unknown-banner">
                <span class="unknown-text"
                  >⚡ ${s("dashboard.unknown_tag_alert",this.lang)} ${this.box.unknown_tag}</span
                >
                <button class="btn-setup" @click=${this._onSetupUnknown}>
                  ${s("dashboard.setup_tag_btn",this.lang)}
                </button>
              </div>
            `:d`
              <div class="tag-container">
                ${this.box.current_tag_info?.image?d`<img
                      class="tag-cover"
                      src="${this.box.current_tag_info.image}"
                      alt="Tag"
                    />`:d`<div class="tag-cover">🧸</div>`}
                <div class="tag-details">
                  <div class="tag-label">${s("dashboard.current_tag",this.lang)}</div>
                  <div class="tag-name">
                    ${this.box.current_tag_info?.name||(this.box.current_tag?`UID: ${this.box.current_tag}`:s("dashboard.no_tag",this.lang))}
                  </div>
                  ${this.box.current_tag_info?.media_title?d`<div class="tag-media">
                        ${this.box.current_tag_info.media_title}
                      </div>`:""}
                </div>
              </div>
            `}

        <!-- Playback Controls -->
        <div class="player-section">
          <div class="playback-info">
            <span class="playback-title">${e.title||(this.lang.startsWith("en")?"No playback":"Keine Wiedergabe")}</span>
            <span class="playback-status">${e.state||(this.lang.startsWith("en")?"Ready":"Bereit")}</span>
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
                .value=${String(e.volume_level||.4)}
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
    `}};D.styles=v`
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
  `,n([p({type:Object})],D.prototype,"box",2),n([p({type:String})],D.prototype,"lang",2),D=n([f("tonieesp-box-card")],D);var B=class extends b{constructor(){super(...arguments);this.boxes=[];this.tags=[];this.lang="de"}render(){return d`
      <div class="header-section">
        <h1 class="title">${s("dashboard.title",this.lang)}</h1>
        <p class="subtitle">
          ${s("dashboard.subtitle",this.lang)}
        </p>
      </div>

      ${this.boxes.length===0?d`
            <div class="empty-state">
              <div class="empty-icon">📻</div>
              <h3>${s("dashboard.no_boxes",this.lang)}</h3>
              <p>
                ${s("dashboard.add_box_hint",this.lang)}
              </p>
            </div>
          `:d`
            <div class="boxes-grid">
              ${this.boxes.map(e=>d`<tonieesp-box-card
                    .box=${e}
                    .lang=${this.lang}
                  ></tonieesp-box-card>`)}
            </div>
          `}
    `}};B.styles=v`
    :host {
      display: block;
    }

    .header-section {
      margin-bottom: 24px;
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
  `,n([p({type:Array})],B.prototype,"boxes",2),n([p({type:Array})],B.prototype,"tags",2),n([p({type:String})],B.prototype,"lang",2),B=n([f("tonieesp-dashboard-view")],B);var O=class extends b{constructor(){super(...arguments);this.boxes=[];this.lang="de"}_onPlayOnBox(){let e=this.shadowRoot?.querySelector("select"),i=e?e.value:this.boxes[0]?.id;i&&this.dispatchEvent(new CustomEvent("play-tag-on-box",{detail:{tag:this.tag,boxId:i},bubbles:!0,composed:!0}))}_onEdit(){this.dispatchEvent(new CustomEvent("edit-tag",{detail:{tag:this.tag},bubbles:!0,composed:!0}))}_onDelete(){this.dispatchEvent(new CustomEvent("delete-tag",{detail:{tag:this.tag},bubbles:!0,composed:!0}))}render(){if(!this.tag)return d``;let e=Object.keys(this.tag.overrides||{}).length;return d`
      <div class="card">
        <div class="top-row">
          ${this.tag.image?d`<img class="cover" src="${this.tag.image}" alt="Cover" />`:d`<div class="cover">🧸</div>`}
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
          ${this.tag.settings.resume?d`<span class="badge">${s("tags.resume_badge",this.lang)}</span>`:""}
          ${this.tag.settings.shuffle?d`<span class="badge">${s("tags.shuffle_badge",this.lang)}</span>`:""}
          ${e>0?d`<span class="badge badge-override">${s("tags.overrides_badge",this.lang,{count:e})}</span>`:""}
        </div>

        <div class="actions-row">
          <div class="play-select-group">
            <select>
              ${this.boxes.map(i=>d`<option value="${i.id}">${i.name}</option>`)}
            </select>
            <button class="btn-play-action" @click=${this._onPlayOnBox}>${s("tags.play_on",this.lang)}</button>
          </div>

          <div>
            <button class="btn-icon" title=${s("tags.edit",this.lang)} @click=${this._onEdit}>✏️</button>
            <button class="btn-icon btn-delete" title=${s("tags.delete",this.lang)} @click=${this._onDelete}>🗑️</button>
          </div>
        </div>
      </div>
    `}};O.styles=v`
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
  `,n([p({type:Object})],O.prototype,"tag",2),n([p({type:Array})],O.prototype,"boxes",2),n([p({type:String})],O.prototype,"lang",2),O=n([f("tonieesp-tag-card")],O);var C=class extends b{constructor(){super(...arguments);this.tags=[];this.boxes=[];this.lang="de";this._searchQuery="";this._selectedType=""}_filteredTags(){let e=this._searchQuery.toLowerCase().trim();return this.tags.filter(i=>{if(this._selectedType&&i.media.media_type!==this._selectedType)return!1;if(e){let a=(i.name||"").toLowerCase(),r=(i.description||"").toLowerCase(),l=(i.uid||"").toLowerCase(),g=(i.media.title||"").toLowerCase();if(!a.includes(e)&&!r.includes(e)&&!l.includes(e)&&!g.includes(e))return!1}return!0})}render(){let e=this._filteredTags(),i=[{id:"",label:s("tags.filter_all",this.lang)},{id:"playlist",label:s("tags.filter_playlist",this.lang)},{id:"album",label:s("tags.filter_album",this.lang)},{id:"audiobook",label:s("tags.filter_audiobook",this.lang)},{id:"track",label:s("tags.filter_track",this.lang)},{id:"radio",label:s("tags.filter_radio",this.lang)},{id:"podcast",label:s("tags.filter_podcast",this.lang)}];return d`
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
        ${i.map(a=>d`
            <div
              class="filter-chip ${this._selectedType===a.id?"active":""}"
              @click=${()=>this._selectedType=a.id}
            >
              ${a.label}
            </div>
          `)}
      </div>

      ${e.length===0?d`
            <div class="empty-state">
              <div class="empty-icon">🧸</div>
              <h3>${s("tags.empty",this.lang)}</h3>
              <p>
                ${s("tags.empty_hint",this.lang)}
              </p>
            </div>
          `:d`
            <div class="tags-grid">
              ${e.map(a=>d`<tonieesp-tag-card
                    .tag=${a}
                    .boxes=${this.boxes}
                    .lang=${this.lang}
                  ></tonieesp-tag-card>`)}
            </div>
          `}
    `}};C.styles=v`
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
  `,n([p({type:Array})],C.prototype,"tags",2),n([p({type:Array})],C.prototype,"boxes",2),n([p({type:String})],C.prototype,"lang",2),n([c()],C.prototype,"_searchQuery",2),n([c()],C.prototype,"_selectedType",2),C=n([f("tonieesp-tag-library-view")],C);var u=class extends b{constructor(){super(...arguments);this.boxes=[];this.initialUid="";this.lang="de";this._uid="";this._name="";this._description="";this._image="";this._mediaProvider="music_assistant";this._mediaType="playlist";this._mediaId="";this._mediaTitle="";this._mediaArtist="";this._resume=!0;this._shuffle=!1;this._repeat="off";this._volumeLimit=null;this._overrides={};this._activeTab="global";this._selectedOverrideBoxId="";this._showMediaModal=!1;this._modalSearchQuery="";this._modalSearching=!1;this._modalResults=[];this._modalSearched=!1}connectedCallback(){super.connectedCallback(),this.tag?(this._uid=this.tag.uid,this._name=this.tag.name,this._description=this.tag.description||"",this._image=this.tag.image||"",this._mediaProvider=this.tag.media.provider||"music_assistant",this._mediaType=this.tag.media.media_type||"playlist",this._mediaId=this.tag.media.media_id||"",this._mediaTitle=this.tag.media.title||"",this._mediaArtist=this.tag.media.artist||"",this._resume=this.tag.settings.resume!==!1,this._shuffle=!!this.tag.settings.shuffle,this._repeat=this.tag.settings.repeat||"off",this._volumeLimit=this.tag.settings.volume_limit||null,this._overrides=JSON.parse(JSON.stringify(this.tag.overrides||{}))):this.initialUid&&(this._uid=this.initialUid,this._name=`Tonie ${this.initialUid.slice(-4)}`),this.boxes.length>0&&(this._selectedOverrideBoxId=this.boxes[0].id)}_openMediaSearchModal(){this._showMediaModal=!0,this._modalSearchQuery||(this._modalSearchQuery=this._mediaTitle||(this._name.startsWith("Tonie ")?"":this._name)),this._modalSearchQuery&&this._modalResults.length===0&&this._executeModalSearch()}_closeMediaSearchModal(){this._showMediaModal=!1}async _executeModalSearch(e){if(e&&e.preventDefault(),!(!this._modalSearchQuery.trim()||!this.api)){this._modalSearching=!0,this._modalSearched=!0;try{let i=this._mediaType?[this._mediaType]:void 0,a=await this.api.searchMedia(this._modalSearchQuery.trim(),i);this._modalResults=a||[]}catch(i){console.error("Error searching media:",i),this._modalResults=[]}finally{this._modalSearching=!1}}}_selectMediaItem(e){this._mediaId=e.media_id,this._mediaType=e.media_type,this._mediaTitle=e.title,this._mediaArtist=e.artist||"",e.image&&!this._image&&(this._image=e.image),(!this._name||this._name.startsWith("Tonie "))&&(this._name=e.title),this._showMediaModal=!1}setMediaSelection(e){this._selectMediaItem(e)}_onSave(){if(!this._uid.trim()){alert(this.lang.startsWith("en")?"Please provide a valid NFC UID.":"Bitte gib eine g\xFCltige NFC UID an.");return}let e={uid:this._uid.trim().toUpperCase(),name:this._name.trim()||`Tonie ${this._uid.slice(-4)}`,description:this._description.trim(),image:this._image.trim(),media:{provider:this._mediaProvider,media_type:this._mediaType,media_id:this._mediaId.trim(),title:this._mediaTitle.trim(),artist:this._mediaArtist.trim()},settings:{resume:this._resume,shuffle:this._shuffle,repeat:this._repeat,volume_limit:this._volumeLimit},overrides:this._overrides};this.dispatchEvent(new CustomEvent("save-tag-record",{detail:{tag:e},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("cancel-tag-edit",{bubbles:!0,composed:!0}))}_addOverride(){this._selectedOverrideBoxId&&(this._overrides={...this._overrides,[this._selectedOverrideBoxId]:{media:{provider:"music_assistant",media_type:"playlist",media_id:"",title:""}}})}_removeOverride(e){let i={...this._overrides};delete i[e],this._overrides=i}render(){return d`
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

        ${this._activeTab==="global"?d`
              <div class="form-grid">
                <!-- UID -->
                <div class="form-group full-width">
                  <label>${s("editor.uid",this.lang)}</label>
                  <div class="uid-group">
                    <input
                      type="text"
                      placeholder=${s("editor.uid_hint",this.lang)}
                      .value=${this._uid}
                      @input=${e=>this._uid=e.target.value}
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
                    @input=${e=>this._name=e.target.value}
                  />
                </div>

                <div class="form-group">
                  <label>${s("editor.image",this.lang)}</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    .value=${this._image}
                    @input=${e=>this._image=e.target.value}
                  />
                </div>

                <div class="form-group full-width">
                  <label>${s("editor.desc",this.lang)}</label>
                  <textarea
                    rows="2"
                    placeholder="Notizen..."
                    .value=${this._description}
                    @input=${e=>this._description=e.target.value}
                  ></textarea>
                </div>

                <!-- Media Selection -->
                <div class="form-group">
                  <label>${s("editor.media_type",this.lang)}</label>
                  <select
                    .value=${this._mediaType}
                    @change=${e=>this._mediaType=e.target.value}
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
                    @input=${e=>this._mediaTitle=e.target.value}
                  />
                </div>

                <div class="form-group full-width">
                  <label>${s("editor.media_id",this.lang)}</label>
                  <div class="media-search-group">
                    <input
                      type="text"
                      placeholder="spotify://playlist/..."
                      .value=${this._mediaId}
                      @input=${e=>this._mediaId=e.target.value}
                    />
                    <button
                      class="btn-search"
                      type="button"
                      @click=${this._openMediaSearchModal}
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
                      @change=${e=>this._resume=e.target.checked}
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
                      @change=${e=>this._shuffle=e.target.checked}
                    />
                    <label for="cb-shuffle">${s("editor.shuffle",this.lang)}</label>
                  </div>
                </div>

                <div class="form-group">
                  <label>${s("editor.repeat",this.lang)}</label>
                  <select
                    .value=${this._repeat}
                    @change=${e=>this._repeat=e.target.value}
                  >
                    <option value="off">${s("editor.repeat_off",this.lang)}</option>
                    <option value="one">${s("editor.repeat_one",this.lang)}</option>
                    <option value="all">${s("editor.repeat_all",this.lang)}</option>
                  </select>
                </div>
              </div>
            `:d`
              <!-- Overrides Tab -->
              <div class="overrides-header">
                ${s("editor.overrides_hint",this.lang)}
              </div>

              <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                <select
                  style="flex: 1;"
                  .value=${this._selectedOverrideBoxId}
                  @change=${e=>this._selectedOverrideBoxId=e.target.value}
                >
                  ${this.boxes.map(e=>d`<option value="${e.id}">${e.name}</option>`)}
                </select>
                <button
                  class="btn btn-save"
                  style="white-space: nowrap;"
                  @click=${this._addOverride}
                >
                  ${s("editor.add_override",this.lang)}
                </button>
              </div>

              ${Object.keys(this._overrides).length===0?d`<div style="text-align: center; color: #888; padding: 20px;">
                    ${this.lang.startsWith("en")?"No overrides configured. This figure behaves the same on all boxes.":"Keine Overrides konfiguriert. Diese Figur verh\xE4lt sich auf allen Boxen gleich."}
                  </div>`:Object.entries(this._overrides).map(([e,i])=>{let a=this.boxes.find(r=>r.id===e);return d`
                      <div class="override-item">
                        <div class="override-top">
                          <span>📻 ${a?a.name:e}</span>
                          <button
                            style="background: transparent; border: none; color: #d32f2f; cursor: pointer;"
                            @click=${()=>this._removeOverride(e)}
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
                            @input=${r=>{let l=r.target.value;this._overrides[e]={...this._overrides[e],media:{...this._overrides[e].media||{},media_id:l}}}}
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

      <!-- In-place Media Search Modal -->
      ${this._showMediaModal?d`
            <div class="media-modal-backdrop" @click=${this._closeMediaSearchModal}>
              <div class="media-modal-content" @click=${e=>e.stopPropagation()}>
                <div class="media-modal-header">
                  <h3 class="media-modal-title">🎵 ${s("browser.title",this.lang)}</h3>
                  <button class="btn-close-modal" @click=${this._closeMediaSearchModal} title="Schließen">✕</button>
                </div>
                <div class="media-modal-body">
                  <form class="modal-search-row" @submit=${this._executeModalSearch}>
                    <input
                      class="modal-search-input"
                      type="search"
                      placeholder=${s("browser.search_placeholder",this.lang)}
                      .value=${this._modalSearchQuery}
                      @input=${e=>this._modalSearchQuery=e.target.value}
                    />
                    <button
                      class="btn btn-save"
                      type="submit"
                      ?disabled=${this._modalSearching||!this._modalSearchQuery.trim()}
                    >
                      ${this._modalSearching?s("browser.searching",this.lang):s("browser.search_btn",this.lang)}
                    </button>
                  </form>

                  <div class="modal-results-list">
                    ${this._modalResults.map(e=>d`
                        <div class="media-result-item" @click=${()=>this._selectMediaItem(e)}>
                          ${e.image?d`<img class="media-thumb" src="${e.image}" alt="Cover" />`:d`<div class="media-thumb">🎵</div>`}
                          <div class="media-result-info">
                            <div class="media-result-title">${e.title}</div>
                            <div class="media-result-sub">
                              <span class="media-result-badge">${e.media_type}</span>
                              ${e.artist?` \u2022 ${e.artist}`:""}
                            </div>
                          </div>
                          <button
                            class="btn-take-media"
                            type="button"
                            @click=${i=>{i.stopPropagation(),this._selectMediaItem(e)}}
                          >
                            ${s("browser.select_btn",this.lang)}
                          </button>
                        </div>
                      `)}
                    ${this._modalSearched&&!this._modalSearching&&this._modalResults.length===0?d`<div style="text-align: center; color: #888; padding: 30px;">
                          ${s("browser.no_results",this.lang)}
                        </div>`:""}
                  </div>
                </div>
              </div>
            </div>
          `:""}
    `}};u.styles=v`
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
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .full-width {
      grid-column: span 2;
    }

    @media (max-width: 768px), (max-width: 900px) and (orientation: portrait) {
      .editor-card {
        padding: 16px 12px;
      }

      .form-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .full-width {
        grid-column: span 1;
      }

      .form-group {
        width: 100%;
        min-width: 0;
      }

      .uid-group {
        flex-direction: column;
        align-items: stretch;
      }

      .media-search-group {
        flex-direction: column;
        align-items: stretch;
      }

      .btn-search,
      .btn-scan {
        padding: 10px 14px;
        width: 100%;
        text-align: center;
        box-sizing: border-box;
      }

      .footer-actions {
        flex-direction: column-reverse;
      }

      .footer-actions .btn {
        width: 100%;
        text-align: center;
        box-sizing: border-box;
      }
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

    /* In-place Media Search Modal */
    .media-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
    }

    .media-modal-content {
      background: var(--card-background-color, #ffffff);
      border-radius: 14px;
      width: 100%;
      max-width: 680px;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.25);
      overflow: hidden;
    }

    .media-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--divider-color, #eee);
    }

    .media-modal-title {
      font-size: 17px;
      font-weight: 700;
      margin: 0;
    }

    .btn-close-modal {
      background: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: var(--secondary-text-color, #666);
      line-height: 1;
      padding: 4px;
    }

    .media-modal-body {
      padding: 16px 20px;
      overflow-y: auto;
      flex: 1;
    }

    .modal-search-row {
      display: flex;
      gap: 8px;
      margin-bottom: 14px;
    }

    .modal-search-input {
      flex: 1;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #111);
      font-size: 14px;
    }

    .modal-results-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 400px;
      overflow-y: auto;
    }

    .media-result-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #eee);
      background: var(--card-background-color, #fff);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .media-result-item:hover {
      background: var(--secondary-background-color, #f5f5f5);
      border-color: var(--primary-color, #03a9f4);
    }

    .media-thumb {
      width: 44px;
      height: 44px;
      border-radius: 6px;
      object-fit: cover;
      background: var(--secondary-background-color, #eee);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .media-result-info {
      flex: 1;
      min-width: 0;
    }

    .media-result-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color, #111);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .media-result-sub {
      font-size: 12px;
      color: var(--secondary-text-color, #666);
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .media-result-badge {
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(3, 169, 244, 0.12);
      color: #0288d1;
      text-transform: capitalize;
    }

    .btn-take-media {
      background: var(--primary-color, #03a9f4);
      color: #fff;
      border: none;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
    }
  `,n([p({type:Object})],u.prototype,"tag",2),n([p({type:Array})],u.prototype,"boxes",2),n([p({type:String})],u.prototype,"initialUid",2),n([p({type:String})],u.prototype,"lang",2),n([p({type:Object})],u.prototype,"api",2),n([c()],u.prototype,"_uid",2),n([c()],u.prototype,"_name",2),n([c()],u.prototype,"_description",2),n([c()],u.prototype,"_image",2),n([c()],u.prototype,"_mediaProvider",2),n([c()],u.prototype,"_mediaType",2),n([c()],u.prototype,"_mediaId",2),n([c()],u.prototype,"_mediaTitle",2),n([c()],u.prototype,"_mediaArtist",2),n([c()],u.prototype,"_resume",2),n([c()],u.prototype,"_shuffle",2),n([c()],u.prototype,"_repeat",2),n([c()],u.prototype,"_volumeLimit",2),n([c()],u.prototype,"_overrides",2),n([c()],u.prototype,"_activeTab",2),n([c()],u.prototype,"_selectedOverrideBoxId",2),n([c()],u.prototype,"_showMediaModal",2),n([c()],u.prototype,"_modalSearchQuery",2),n([c()],u.prototype,"_modalSearching",2),n([c()],u.prototype,"_modalResults",2),n([c()],u.prototype,"_modalSearched",2),u=n([f("tonieesp-tag-editor-view")],u);var _=class extends b{constructor(){super(...arguments);this.lang="de";this._pauseOnRemoval=!0;this._resumeOnReplace=!0;this._maxVolume=.8;this._seekStep=10;this._gesturesEnabled=!0;this._leftTapAction="previous_track";this._rightTapAction="next_track";this._leftTiltAction="seek_backward";this._rightTiltAction="seek_forward";this._tapThreshold=null;this._tapTimeLimit=null}connectedCallback(){if(super.connectedCallback(),this.box?.settings){let e=this.box.settings;this._pauseOnRemoval=e.pause_on_removal!==!1,this._resumeOnReplace=e.resume_on_replace!==!1,this._maxVolume=e.max_volume||.8,this._seekStep=e.seek_step||10,this._gesturesEnabled=e.gestures_enabled!==!1,this._leftTapAction=e.left_tap_action||"previous_track",this._rightTapAction=e.right_tap_action||"next_track",this._leftTiltAction=e.left_tilt_action||"seek_backward",this._rightTiltAction=e.right_tilt_action||"seek_forward"}this.box?.hardware_tuning&&(this._tapThreshold=this.box.hardware_tuning.tap_threshold??20,this._tapTimeLimit=this.box.hardware_tuning.tap_time_limit??10)}_onSave(){let e={pause_on_removal:this._pauseOnRemoval,resume_on_replace:this._resumeOnReplace,max_volume:this._maxVolume,seek_step:this._seekStep,gestures_enabled:this._gesturesEnabled,left_tap_action:this._leftTapAction,right_tap_action:this._rightTapAction,left_tilt_action:this._leftTiltAction,right_tilt_action:this._rightTiltAction,tap_threshold:this._tapThreshold,tap_time_limit:this._tapTimeLimit};this.dispatchEvent(new CustomEvent("save-box-settings",{detail:{boxId:this.box.id,settings:e},bubbles:!0,composed:!0}))}_onBack(){this.dispatchEvent(new CustomEvent("back-to-dashboard",{bubbles:!0,composed:!0}))}render(){return this.box?d`
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
              @change=${e=>this._pauseOnRemoval=e.target.checked}
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
              @change=${e=>this._resumeOnReplace=e.target.checked}
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
                @input=${e=>this._maxVolume=parseFloat(e.target.value)}
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
              @change=${e=>this._gesturesEnabled=e.target.checked}
            />
            <label for="gest_en">${s("box.gestures_enabled",this.lang)}</label>
          </div>

          <div class="grid-2">
            <div class="setting-group">
              <label>${s("box.left_tap",this.lang)}</label>
              <select
                .value=${this._leftTapAction}
                @change=${e=>this._leftTapAction=e.target.value}
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
                @change=${e=>this._rightTapAction=e.target.value}
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
                @change=${e=>this._leftTiltAction=e.target.value}
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
                @change=${e=>this._rightTiltAction=e.target.value}
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
                @change=${e=>this._seekStep=parseInt(e.target.value,10)}
              />
            </div>
          </div>
        </div>

        <!-- Sensor Fine-Tuning (Vibration Filter) -->
        <div class="section">
          <h3 class="section-title">${s("box.section_tuning",this.lang)}</h3>
          <p style="font-size: 13px; color: var(--secondary-text-color, #666); margin: -4px 0 16px 0;">
            ${s("box.tuning_hint",this.lang)}
          </p>
          <div class="grid-2">
            <div class="setting-group">
              <label>${s("box.tap_threshold",this.lang)}</label>
              <input
                type="number"
                min="1"
                max="127"
                step="1"
                .value=${this._tapThreshold!==null?String(this._tapThreshold):"20"}
                @change=${e=>this._tapThreshold=parseFloat(e.target.value)}
              />
              <span style="font-size: 12px; color: var(--secondary-text-color, #777); margin-top: 4px;">
                ${s("box.tap_threshold_hint",this.lang)}
              </span>
            </div>

            <div class="setting-group">
              <label>${s("box.tap_time_limit",this.lang)}</label>
              <input
                type="number"
                min="1"
                max="255"
                step="1"
                .value=${this._tapTimeLimit!==null?String(this._tapTimeLimit):"10"}
                @change=${e=>this._tapTimeLimit=parseFloat(e.target.value)}
              />
              <span style="font-size: 12px; color: var(--secondary-text-color, #777); margin-top: 4px;">
                ${s("box.tap_time_limit_hint",this.lang)}
              </span>
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
    `:d``}};_.styles=v`
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
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    @media (max-width: 768px), (max-width: 900px) and (orientation: portrait) {
      .container {
        padding: 16px 12px;
      }

      .grid-2 {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .setting-group {
        width: 100%;
        min-width: 0;
      }

      .header-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .header-row .btn-back {
        width: 100%;
        text-align: center;
        box-sizing: border-box;
      }

      .actions-row {
        flex-direction: column-reverse;
      }

      .actions-row .btn {
        width: 100%;
        text-align: center;
        box-sizing: border-box;
      }
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
  `,n([p({type:Object})],_.prototype,"box",2),n([p({type:String})],_.prototype,"lang",2),n([c()],_.prototype,"_pauseOnRemoval",2),n([c()],_.prototype,"_resumeOnReplace",2),n([c()],_.prototype,"_maxVolume",2),n([c()],_.prototype,"_seekStep",2),n([c()],_.prototype,"_gesturesEnabled",2),n([c()],_.prototype,"_leftTapAction",2),n([c()],_.prototype,"_rightTapAction",2),n([c()],_.prototype,"_leftTiltAction",2),n([c()],_.prototype,"_rightTiltAction",2),n([c()],_.prototype,"_tapThreshold",2),n([c()],_.prototype,"_tapTimeLimit",2),_=n([f("tonieesp-box-detail-view")],_);var $=class extends b{constructor(){super(...arguments);this.lang="de";this._diagnostics=null;this._overwrite=!1;this._message="";this._isError=!1}async connectedCallback(){super.connectedCallback(),await this._loadDiagnostics()}async _loadDiagnostics(){if(this.api)try{this._diagnostics=await this.api.getDiagnostics()}catch(e){console.error("Error loading diagnostics:",e)}}async _exportTags(){if(this.api)try{let e=await this.api.exportTags(),i=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),a=URL.createObjectURL(i),r=document.createElement("a");r.href=a,r.download=`tonieesp-tags-${new Date().toISOString().slice(0,10)}.json`,r.click(),URL.revokeObjectURL(a),this._showMessage(s("common.save_success",this.lang),!1)}catch(e){this._showMessage(s("common.error",this.lang,{error:e?.message||e}),!0)}}_triggerFileInput(){let e=this.shadowRoot?.querySelector("#file-input");e&&e.click()}async _onFileSelected(e){let i=e.target;if(!i.files||i.files.length===0)return;let a=i.files[0],r=new FileReader;r.onload=async()=>{try{let l=JSON.parse(r.result);if(!Array.isArray(l))throw new Error("Invalid format. Expected a JSON array.");let g=await this.api.importTags(l,this._overwrite);this._showMessage(this.lang.startsWith("en")?`Successfully imported: ${g.count} tags added / updated.`:`Erfolgreich importiert: ${g.count} Figuren hinzugef\xFCgt / aktualisiert.`,!1),this.dispatchEvent(new CustomEvent("tags-imported",{bubbles:!0,composed:!0}))}catch(l){this._showMessage(s("common.error",this.lang,{error:l?.message||l}),!0)}},r.readAsText(a),i.value=""}_showMessage(e,i){this._message=e,this._isError=i,setTimeout(()=>{this._message=""},5e3)}render(){return d`
      <div class="container">
        <h2 class="title">${s("settings.title",this.lang)}</h2>
        <p class="subtitle">
          ${s("settings.subtitle",this.lang)}
        </p>

        ${this._message?d`
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
              @change=${e=>this._overwrite=e.target.checked}
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
        ${this._diagnostics?d`
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
    `}};$.styles=v`
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
  `,n([p({type:Object})],$.prototype,"api",2),n([p({type:String})],$.prototype,"lang",2),n([c()],$.prototype,"_diagnostics",2),n([c()],$.prototype,"_overwrite",2),n([c()],$.prototype,"_message",2),n([c()],$.prototype,"_isError",2),$=n([f("tonieesp-settings-view")],$);var F=class extends b{constructor(){super(...arguments);this.logs=[];this.lang="de"}render(){return d`
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
          ${this.logs.length===0?d`<div class="empty-state">
                ${s("logs.empty",this.lang)}
              </div>`:this.logs.map(e=>{let i="";return e.type.includes("tag")&&(i="log-type-tag"),(e.type.includes("gesture")||e.type.includes("tap")||e.type.includes("tilt"))&&(i="log-type-gesture"),d`
                  <div class="log-item">
                    <span class="log-time">${e.timestamp}</span>
                    <span class="log-type ${i}">${e.type}</span>
                    <span class="log-summary">${e.summary}</span>
                  </div>
                `})}
        </div>
      </div>
    `}};F.styles=v`
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
  `,n([p({type:Array})],F.prototype,"logs",2),n([p({type:String})],F.prototype,"lang",2),F=n([f("tonieesp-logs-view")],F);var y=class extends b{constructor(){super(...arguments);this.narrow=!1;this._lang="de";this._activeView="dashboard";this._boxes=[];this._tags=[];this._logs=[];this._initialUid="";this._isLearning=!1;this._learnedUid=null}connectedCallback(){super.connectedCallback(),this._updateLanguageFromHass()}_updateLanguageFromHass(){let e=(this.hass?.locale?.language||this.hass?.language||"de").toLowerCase();this._lang=e.startsWith("de")?"de":"en"}updated(e){e.has("hass")&&this.hass&&(this._updateLanguageFromHass(),this._api?this._api.updateHass(this.hass):(this._api=new ie(this.hass),this._initData(),this._subscribeToEvents()))}disconnectedCallback(){super.disconnectedCallback(),this._unsubEvents&&(this._unsubEvents(),this._unsubEvents=void 0)}async _initData(){if(this._api)try{let[e,i]=await Promise.all([this._api.getBoxes(),this._api.getTags()]);this._boxes=e||[],this._tags=i||[],this._addLog("init",`TonieESP geladen: ${this._boxes.length} Boxen, ${this._tags.length} Tags`)}catch(e){console.error("Error loading TonieESP initial data:",e)}}async _subscribeToEvents(){if(this._api)try{this._unsubEvents=await this._api.subscribeEvents(e=>{this._handleIncomingEvent(e)})}catch(e){console.error("Error subscribing to TonieESP events:",e)}}_handleIncomingEvent(e){let{event_type:i,data:a}=e;if(i==="box_box_updated"||i==="box_box_added"){let r=a;this._boxes=this._boxes.map(l=>l.id===r.id?r:l),this._boxes.find(l=>l.id===r.id)||(this._boxes=[...this._boxes,r]),this._addLog("box",`Toniebox '${r.name}' aktualisiert (Online: ${r.online})`)}else i==="box_box_removed"?(this._boxes=this._boxes.filter(r=>r.id!==a.id),this._addLog("box",`Toniebox '${a.name}' entfernt`)):i==="tag_create"||i==="tag_update"||i==="tag_delete"?(this._api?.getTags().then(r=>this._tags=r),this._addLog("tag",`NFC-Bibliothek aktualisiert (${i})`)):i==="tag_learned"?(this._learnedUid=a.uid,this._addLog("learn",`Figur erfasst im Lernmodus: ${a.uid}`)):this._addLog("event",`${i}: ${JSON.stringify(a)}`)}_addLog(e,i,a){let r={id:Math.random().toString(36).substring(2,9),timestamp:new Date().toLocaleTimeString(),type:e,summary:i,details:a};this._logs=[r,...this._logs.slice(0,99)]}async _handleBoxControl(e){let{boxId:i,action:a,data:r}=e.detail;if(this._api)try{await this._api.controlPlayback(i,a,r),this._addLog("playback",`Action '${a}' sent to box`)}catch(l){alert(s("common.error",this._lang,{error:l?.message||l}))}}async _handlePlayTagOnBox(e){let{tag:i,boxId:a}=e.detail;if(this._api)try{await this._api.controlPlayback(a,"play_tag",{uid:i.uid}),this._addLog("playback",`Tag ${i.name} (${i.uid}) started on box`)}catch(r){alert(s("common.error",this._lang,{error:r?.message||r}))}}_handleSetupUnknownTag(e){let{uid:i}=e.detail;this._editingTag=void 0,this._initialUid=i,this._activeView="editor"}_handleOpenBoxDetails(e){this._selectedBox=e.detail.box,this._activeView="detail"}async _handleSaveBoxSettings(e){let{boxId:i,settings:a}=e.detail;if(this._api)try{let r=await this._api.updateBoxSettings(i,a);this._boxes=this._boxes.map(l=>l.id===r.id?r:l),alert(s("box.save_success",this._lang)),this._activeView="dashboard"}catch(r){alert(s("common.error",this._lang,{error:r?.message||r}))}}_handleAddNewTag(){this._editingTag=void 0,this._initialUid="",this._activeView="editor"}_handleEditTag(e){this._editingTag=e.detail.tag,this._initialUid="",this._activeView="editor"}async _handleDeleteTag(e){let{tag:i}=e.detail;if(confirm(s("tags.confirm_delete",this._lang,{name:i.name,uid:i.uid}))&&this._api)try{await this._api.deleteTag(i.uid),this._tags=this._tags.filter(a=>a.uid!==i.uid),this._addLog("tag",`Tag '${i.name}' deleted`)}catch(a){alert(s("common.error",this._lang,{error:a?.message||a}))}}async _handleSaveTagRecord(e){let{tag:i}=e.detail;if(this._api)try{let a=await this._api.saveTag(i),r=this._tags.findIndex(l=>l.uid===a.uid);r>=0?this._tags[r]=a:this._tags=[a,...this._tags],this._tags=[...this._tags],this._activeView="tags",this._addLog("tag",`Tag '${a.name}' saved`)}catch(a){alert(s("common.error",this._lang,{error:a?.message||a}))}}async _handleStartScanLearning(){this._isLearning=!0,this._learnedUid=null,this._api&&await this._api.startLearning()}async _handleStopScanLearning(){this._isLearning=!1,this._learnedUid=null,this._api&&await this._api.stopLearning()}_handleUseLearnedTag(){if(!this._learnedUid)return;let e=this._learnedUid;this._handleStopScanLearning(),this._editingTag=void 0,this._initialUid=e,this._activeView="editor"}_handleBrandClick(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))}render(){return d`
      <!-- Top Navigation Bar -->
      <header class="top-bar">
        <div class="brand" @click=${this._handleBrandClick} title="TonieESP (Klick auf Logo öffnet HA-Seitenleiste)">
          <img class="logo-img" src="${Le}" alt="TonieESP" />
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
        @start-scan-learning=${this._handleStartScanLearning}
        @tags-imported=${()=>this._api?.getTags().then(e=>this._tags=e)}
        @clear-logs=${()=>this._logs=[]}
      >
        ${this._activeView==="dashboard"?d`<tonieesp-dashboard-view
              .boxes=${this._boxes}
              .tags=${this._tags}
              .lang=${this._lang}
            ></tonieesp-dashboard-view>`:""}
        ${this._activeView==="tags"?d`<tonieesp-tag-library-view
              .tags=${this._tags}
              .boxes=${this._boxes}
              .lang=${this._lang}
            ></tonieesp-tag-library-view>`:""}
        ${this._activeView==="editor"?d`<tonieesp-tag-editor-view
              .tag=${this._editingTag}
              .boxes=${this._boxes}
              .initialUid=${this._initialUid}
              .lang=${this._lang}
              .api=${this._api}
            ></tonieesp-tag-editor-view>`:""}
        ${this._activeView==="detail"&&this._selectedBox?d`<tonieesp-box-detail-view
              .box=${this._selectedBox}
              .lang=${this._lang}
            ></tonieesp-box-detail-view>`:""}
        ${this._activeView==="settings"?d`<tonieesp-settings-view
              .api=${this._api}
              .lang=${this._lang}
            ></tonieesp-settings-view>`:""}
        ${this._activeView==="logs"?d`<tonieesp-logs-view
              .logs=${this._logs}
              .lang=${this._lang}
            ></tonieesp-logs-view>`:""}
      </main>

      <!-- Scan Learning Modal Dialog -->
      ${this._isLearning?d`
            <div class="modal-backdrop">
              <div class="modal-content">
                <div class="pulse-icon">📡</div>
                <h3 class="modal-title">${s("learn.title",this._lang)}</h3>
                <p class="modal-text">
                  ${s("learn.instructions",this._lang)}
                </p>

                ${this._learnedUid?d`
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
                    `:d`
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
    `}};y.styles=v`
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
      justify-content: flex-start;
      gap: 16px;
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
      user-select: none;
      -webkit-user-select: none;
      padding: 4px 8px;
      border-radius: 8px;
      transition: background 0.15s ease;
      flex-shrink: 0;
    }

    .brand:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
    }

    .logo-img {
      width: 34px;
      height: 34px;
      object-fit: contain;
      border-radius: 6px;
      display: block;
      cursor: pointer;
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
      margin-left: auto;
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
      white-space: nowrap;
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

    @media (max-width: 768px), (max-width: 900px) and (orientation: portrait) {
      .top-bar {
        padding: 8px 12px;
        flex-direction: column;
        gap: 8px;
        align-items: stretch;
      }

      .brand {
        align-self: flex-start;
        justify-content: flex-start;
      }

      .nav-tabs {
        margin-left: 0;
        overflow-x: auto;
        padding-bottom: 4px;
        justify-content: flex-start;
        -webkit-overflow-scrolling: touch;
      }

      .nav-btn {
        padding: 6px 10px;
        font-size: 13px;
        flex-shrink: 0;
      }

      .content-area {
        padding: 12px;
      }
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
  `,n([p({attribute:!1})],y.prototype,"hass",2),n([p({type:Boolean})],y.prototype,"narrow",2),n([p({type:Object})],y.prototype,"panel",2),n([c()],y.prototype,"_lang",2),n([c()],y.prototype,"_activeView",2),n([c()],y.prototype,"_boxes",2),n([c()],y.prototype,"_tags",2),n([c()],y.prototype,"_logs",2),n([c()],y.prototype,"_editingTag",2),n([c()],y.prototype,"_initialUid",2),n([c()],y.prototype,"_selectedBox",2),n([c()],y.prototype,"_isLearning",2),n([c()],y.prototype,"_learnedUid",2),y=n([f("tonieesp-panel")],y);export{y as TonieESPPanel};
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
