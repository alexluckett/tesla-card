const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;let s=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const i=this.t;if(t&&void 0===e){const t=void 0!==i&&1===i.length;t&&(e=n.get(i)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&n.set(i,e))}return e}toString(){return this.cssText}};const r=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new s("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:a,defineProperty:o,getOwnPropertyDescriptor:l,getOwnPropertyNames:c,getOwnPropertySymbols:h,getPrototypeOf:d}=Object,u=globalThis,p=u.trustedTypes,m=p?p.emptyScript:"",f=u.reactiveElementPolyfillSupport,g=(e,t)=>e,_={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},v=(e,t)=>!a(e,t),$={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);void 0!==n&&o(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:s}=l(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:n,set(t){const r=n?.call(this);s?.call(this,t),this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const e=d(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const e=this.properties,t=[...c(e),...h(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(r(e))}else void 0!==e&&t.push(r(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,n)=>{if(t)i.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of n){const n=document.createElement("style"),s=e.litNonce;void 0!==s&&n.setAttribute("nonce",s),n.textContent=t.cssText,i.appendChild(n)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(void 0!==n&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:_).toAttribute(t,i.type);this._$Em=e,null==s?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(e,t){const i=this.constructor,n=i._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=i.getPropertyOptions(n),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:_;this._$Em=n;const r=s.fromAttribute(t,e.type);this[n]=r??this._$Ej?.get(n)??r,this._$Em=null}}requestUpdate(e,t,i,n=!1,s){if(void 0!==e){const r=this.constructor;if(!1===n&&(s=this[e]),i??=r.getPropertyOptions(e),!((i.hasChanged??v)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:s},r){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==s||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===n&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,n=this[t];!0!==e||this._$AL.has(t)||void 0===n||this.C(t,void 0,i,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[g("elementProperties")]=new Map,y[g("finalized")]=new Map,f?.({ReactiveElement:y}),(u.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,b=e=>e,A=w.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:e=>e}):void 0,x="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+k,P=`<${E}>`,M=document,T=()=>M.createComment(""),C=e=>null===e||"object"!=typeof e&&"function"!=typeof e,U=Array.isArray,R="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,B=/>/g,H=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,z=/"/g,j=/^(?:script|style|textarea|title)$/i,L=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),I=L(1),F=L(2),W=Symbol.for("lit-noChange"),Y=Symbol.for("lit-nothing"),V=new WeakMap,Z=M.createTreeWalker(M,129);function q(e,t){if(!U(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const G=(e,t)=>{const i=e.length-1,n=[];let s,r=2===t?"<svg>":3===t?"<math>":"",a=N;for(let t=0;t<i;t++){const i=e[t];let o,l,c=-1,h=0;for(;h<i.length&&(a.lastIndex=h,l=a.exec(i),null!==l);)h=a.lastIndex,a===N?"!--"===l[1]?a=O:void 0!==l[1]?a=B:void 0!==l[2]?(j.test(l[2])&&(s=RegExp("</"+l[2],"g")),a=H):void 0!==l[3]&&(a=H):a===H?">"===l[0]?(a=s??N,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,o=l[1],a=void 0===l[3]?H:'"'===l[3]?z:D):a===z||a===D?a=H:a===O||a===B?a=N:(a=H,s=void 0);const d=a===H&&e[t+1].startsWith("/>")?" ":"";r+=a===N?i+P:c>=0?(n.push(o),i.slice(0,c)+x+i.slice(c)+k+d):i+k+(-2===c?t:d)}return[q(e,r+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),n]};class K{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let s=0,r=0;const a=e.length-1,o=this.parts,[l,c]=G(e,t);if(this.el=K.createElement(l,i),Z.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=Z.nextNode())&&o.length<a;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(x)){const t=c[r++],i=n.getAttribute(e).split(k),a=/([.?@])?(.*)/.exec(t);o.push({type:1,index:s,name:a[2],strings:i,ctor:"."===a[1]?te:"?"===a[1]?ie:"@"===a[1]?ne:ee}),n.removeAttribute(e)}else e.startsWith(k)&&(o.push({type:6,index:s}),n.removeAttribute(e));if(j.test(n.tagName)){const e=n.textContent.split(k),t=e.length-1;if(t>0){n.textContent=A?A.emptyScript:"";for(let i=0;i<t;i++)n.append(e[i],T()),Z.nextNode(),o.push({type:2,index:++s});n.append(e[t],T())}}}else if(8===n.nodeType)if(n.data===E)o.push({type:2,index:s});else{let e=-1;for(;-1!==(e=n.data.indexOf(k,e+1));)o.push({type:7,index:s}),e+=k.length-1}s++}}static createElement(e,t){const i=M.createElement("template");return i.innerHTML=e,i}}function X(e,t,i=e,n){if(t===W)return t;let s=void 0!==n?i._$Co?.[n]:i._$Cl;const r=C(t)?void 0:t._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),void 0===r?s=void 0:(s=new r(e),s._$AT(e,i,n)),void 0!==n?(i._$Co??=[])[n]=s:i._$Cl=s),void 0!==s&&(t=X(e,s._$AS(e,t.values),s,n)),t}class J{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??M).importNode(t,!0);Z.currentNode=n;let s=Z.nextNode(),r=0,a=0,o=i[0];for(;void 0!==o;){if(r===o.index){let t;2===o.type?t=new Q(s,s.nextSibling,this,e):1===o.type?t=new o.ctor(s,o.name,o.strings,this,e):6===o.type&&(t=new se(s,this,e)),this._$AV.push(t),o=i[++a]}r!==o?.index&&(s=Z.nextNode(),r++)}return Z.currentNode=M,n}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=Y,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),C(e)?e===Y||null==e||""===e?(this._$AH!==Y&&this._$AR(),this._$AH=Y):e!==this._$AH&&e!==W&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>U(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==Y&&C(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,n="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=K.createElement(q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new J(n,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=V.get(e.strings);return void 0===t&&V.set(e.strings,t=new K(e)),t}k(e){U(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const s of e)n===t.length?t.push(i=new Q(this.O(T()),this.O(T()),this,this.options)):i=t[n],i._$AI(s),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=b(e).nextSibling;b(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,s){this.type=1,this._$AH=Y,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Y}_$AI(e,t=this,i,n){const s=this.strings;let r=!1;if(void 0===s)e=X(this,e,t,0),r=!C(e)||e!==this._$AH&&e!==W,r&&(this._$AH=e);else{const n=e;let a,o;for(e=s[0],a=0;a<s.length-1;a++)o=X(this,n[i+a],t,a),o===W&&(o=this._$AH[a]),r||=!C(o)||o!==this._$AH[a],o===Y?e=Y:e!==Y&&(e+=(o??"")+s[a+1]),this._$AH[a]=o}r&&!n&&this.j(e)}j(e){e===Y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===Y?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==Y)}}class ne extends ee{constructor(e,t,i,n,s){super(e,t,i,n,s),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??Y)===W)return;const i=this._$AH,n=e===Y&&i!==Y||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==Y&&(i===Y||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class se{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const re=w.litHtmlPolyfillSupport;re?.(K,Q),(w.litHtmlVersions??=[]).push("3.3.3");const ae=globalThis;class oe extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const n=i?.renderBefore??t;let s=n._$litPart$;if(void 0===s){const e=i?.renderBefore??null;n._$litPart$=s=new Q(t.insertBefore(T(),e),e,void 0,i??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}oe._$litElement$=!0,oe.finalized=!0,ae.litElementHydrateSupport?.({LitElement:oe});const le=ae.litElementPolyfillSupport;le?.({LitElement:oe}),(ae.litElementVersions??=[]).push("4.2.2");const ce=((e,...t)=>{const n=1===e.length?e[0]:t.reduce((t,i,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1],e[0]);return new s(n,e,i)})`
  :host {
    --tc-text: var(--primary-text-color, #212121);
    --tc-dim: var(--secondary-text-color, #727272);
    --tc-line: var(--divider-color, rgba(0, 0, 0, 0.12));
    --tc-accent: var(--primary-color, #03a9f4);
    --tc-warn: var(--warning-color, #ffa726);
    --tc-ok: var(--success-color, #43a047);
    --tc-surface: var(--ha-card-background, var(--card-background-color, #fff));
    --tc-font: var(--ha-font-family-body, Roboto, Noto, sans-serif);
  }

  ha-card {
    padding: 16px;
    font-family: var(--tc-font);
    display: block;
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .name {
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-medium, 500);
    color: var(--tc-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* The glyph carries lock state, the word carries motion state. They are
     separate facts, so they take separate colours. */
  .status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: var(--ha-font-size-s, 13px);
    white-space: nowrap;
  }
  .status svg {
    width: 15px;
    height: 15px;
    fill: var(--tc-dim);
    flex: none;
  }
  .status.unlocked svg {
    fill: var(--tc-warn);
  }
  .status span {
    color: var(--tc-dim);
  }
  .status.charging span {
    color: var(--tc-ok);
  }
  .status.driving span {
    color: var(--tc-accent);
  }
  .status.asleep {
    opacity: 0.8;
  }

  /* Cropped to the render's real content bounds. The compositor frames every
     vehicle identically per view, so one constant per view holds throughout. */
  .hero {
    position: relative;
    width: 100%;
    overflow: hidden;
    margin: 10px 0 14px;
  }
  .hero img {
    position: absolute;
    max-width: none;
    display: block;
  }
  .hero.asleep img {
    opacity: 0.65;
    filter: saturate(0.65);
  }
  .hero.blank {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 2.273;
    background: var(--tc-line);
    border-radius: 10px;
    color: var(--tc-dim);
    font-size: var(--ha-font-size-s, 13px);
    text-align: center;
    padding: 0 24px;
  }

  .strip {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin: 0 0 10px;
    font-variant-numeric: tabular-nums;
  }
  .value {
    font-size: var(--ha-font-size-2xl, 28px);
    font-weight: var(--ha-font-weight-light, 300);
    line-height: 1;
    letter-spacing: -0.01em;
    color: var(--tc-text);
  }
  .unit {
    font-size: var(--ha-font-size-m, 14px);
    color: var(--tc-dim);
    margin-left: 1px;
  }
  .range {
    font-size: var(--ha-font-size-l, 15px);
    color: var(--tc-text);
    opacity: 0.72;
    margin-left: 4px;
  }
  .age {
    font-size: var(--ha-font-size-s, 12px);
    color: var(--tc-dim);
    opacity: 0.75;
    margin-left: auto;
    white-space: nowrap;
  }

  .gauge {
    height: 7px;
    border-radius: 3.5px;
    background: var(--tc-line);
    position: relative;
    overflow: visible;
  }
  .fill {
    height: 100%;
    border-radius: 3.5px;
    background: var(--tc-accent);
    position: relative;
    overflow: hidden;
  }
  .fill.charging {
    background: var(--tc-ok);
  }
  .fill.asleep {
    background: var(--tc-dim);
    opacity: 0.55;
  }
  .fill.low {
    background: var(--tc-warn);
  }
  .fill.charging::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
    animation: sheen 2.6s linear infinite;
  }
  @keyframes sheen {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(240%);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .fill.charging::after {
      animation: none;
    }
  }

  /* One mark on the gauge, meaning one thing: the charge limit. */
  .limit {
    position: absolute;
    top: -4px;
    bottom: -4px;
    width: 2px;
    border-radius: 1px;
    background: var(--tc-dim);
    box-shadow: 0 0 0 2px var(--tc-surface);
  }

  /* Where the car is, or where it is going. Absent when there is nothing true
     to say. */
  .place {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    margin-top: 11px;
    font-size: var(--ha-font-size-s, 13px);
    color: var(--tc-text);
    opacity: 0.85;
    white-space: nowrap;
  }
  .place .lead {
    font-weight: var(--ha-font-weight-medium, 500);
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .place .zone {
    font-weight: var(--ha-font-weight-normal, 400);
    color: var(--tc-dim);
  }
  .place .lead svg {
    width: 13px;
    height: 13px;
    fill: currentColor;
    opacity: 0.9;
    flex: none;
  }
  .place .detail {
    color: var(--tc-dim);
    font-size: var(--ha-font-size-s, 12.5px);
  }

  ha-map {
    display: block;
    margin-top: 12px;
    border-radius: 10px;
    overflow: hidden;
    height: 170px;
  }

  .controls {
    display: flex;
    gap: 6px;
    margin-top: 14px;
    flex-wrap: wrap;
  }
  .controls button {
    flex: 1 1 0;
    min-width: 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 10px 4px;
    font: inherit;
    font-size: var(--ha-font-size-s, 11.5px);
    color: var(--tc-text);
    background: var(--tc-line);
    border: none;
    border-radius: 12px;
    cursor: pointer;
  }
  .controls button:hover:not(:disabled) {
    background: var(--tc-dim);
    color: var(--tc-surface);
  }
  .controls button:focus-visible {
    outline: 2px solid var(--tc-accent);
    outline-offset: 2px;
  }
  .controls button:disabled {
    opacity: 0.45;
    cursor: default;
  }
  .controls svg {
    width: 19px;
    height: 19px;
    fill: currentColor;
  }

  .notice {
    margin-top: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    background: var(--tc-line);
    color: var(--tc-dim);
    font-size: var(--ha-font-size-s, 12.5px);
    line-height: 1.5;
  }
  .notice code {
    font-family: var(--ha-font-family-code, monospace);
    color: var(--tc-text);
  }
`,he={S:{model:"ms",name:"Model S"},X:{model:"mx",name:"Model X"},3:{model:"m3",name:"Model 3"},Y:{model:"my",name:"Model Y"},C:{model:"ct",name:"Cybertruck"},R:{model:"mr",name:"Roadster"},T:{model:"ms",name:"Semi"},A:{model:"my",name:"Cybercab"}},de={L:2020,M:2021,N:2022,P:2023,R:2024,S:2025,T:2026,V:2027,W:2028,X:2029,Y:2030},ue={my:{year:2025,current:"juniper",previous:"legacy"},m3:{year:2024,current:"highland",previous:"legacy"},ms:{year:2021,current:"palladium",previous:"legacy"},mx:{year:2021,current:"palladium",previous:"legacy"}},pe=new Set(["GB","IE","AU","NZ","JP","IN","ZA","SG","MY","TH","HK","ID","PK","LK","KE","CY","MT"]);function me(e,t){const i=ue[e];return i?null===t||t>=i.year?i.current:i.previous:null}const fe=["FRONT34","STUD_3QTR","SIDE","STUD_SIDE","REAR34","STUD_REAR"],ge={my:{juniper:{label:"Model Y (2025 onwards)",trim:"$MTY86",performanceTrim:"$MTY53",interior:"$IPB12",performanceInterior:"$IPB14",paints:[{id:"stealth_grey",code:"$PN01",name:"Stealth Grey",swatch:"#494955"},{id:"pearl_white",code:"$PPSW",name:"Pearl White",swatch:"#e7e8ec"},{id:"diamond_black",code:"$PBSB",name:"Diamond Black",swatch:"#262629"},{id:"deep_blue",code:"$PPSB",name:"Deep Blue Metallic",swatch:"#113683"},{id:"ultra_red",code:"$PR01",name:"Ultra Red",swatch:"#a7111f"},{id:"quicksilver",code:"$PN00",name:"Quicksilver",swatch:"#97969f"},{id:"glacier_blue",code:"$PB01",name:"Glacier Blue",swatch:"#6e84a4"},{id:"navy_pb02",code:"$PB02",name:"Dark Blue (PB02)",swatch:"#2a3650"}],wheels:[{id:"crossflow_19",code:"$WY19P",name:'19" Crossflow'},{id:"helix_20",code:"$WY20B",name:'20" Helix 2.0'},{id:"induction_20",code:"$WY20A",name:'20" Induction'},{id:"performance_21",code:"$WY21A",name:'21" Performance',performanceOnly:!0}]},legacy:{label:"Model Y (2020 to 2024)",trim:"$MDLY,$MTY01",interior:"$INPB0",paints:[{id:"pearl_white",code:"$PPSW",name:"Pearl White",swatch:"#e7e8ec"},{id:"solid_black",code:"$PBSB",name:"Solid Black",swatch:"#262629"},{id:"midnight_silver",code:"$PMNG",name:"Midnight Silver",swatch:"#5b6065"},{id:"deep_blue",code:"$PPSB",name:"Deep Blue Metallic",swatch:"#113683"},{id:"red_multicoat",code:"$PPMR",name:"Red Multi-Coat",swatch:"#a51d2c"}],wheels:[{id:"gemini_19",code:"$WY19B",name:'19" Gemini'},{id:"induction_20",code:"$WY20P",name:'20" Induction'}]}},m3:{legacy:{label:"Model 3",trim:"$MDL3,$MT300",interior:"$IN3PB",paints:[{id:"pearl_white",code:"$PPSW",name:"Pearl White",swatch:"#e7e8ec"},{id:"solid_black",code:"$PBSB",name:"Solid Black",swatch:"#262629"},{id:"midnight_silver",code:"$PMNG",name:"Midnight Silver",swatch:"#5b6065"},{id:"deep_blue",code:"$PPSB",name:"Deep Blue Metallic",swatch:"#113683"},{id:"red_multicoat",code:"$PPMR",name:"Red Multi-Coat",swatch:"#a51d2c"}],wheels:[{id:"aero_18",code:"$W38B",name:'18" Aero'}]}}};function _e(e,t){return ve(e,t)?.wheels[0]?.id??null}function ve(e,t){const i=ge[e];return i?t&&i[t]?i[t]:Object.values(i)[0]??null:null}function $e(e,t){return null!==ve(e,t)}function ye(e,t,i=!1){const n=ve(e,t);return n?n.wheels.filter(e=>i||!e.performanceOnly):[]}function we(e,t){return ve(e,t)?.paints??[]}const be={FRONT34:{width:1.613,left:-.316,top:-.503,aspect:2.273},STUD_3QTR:{width:1.613,left:-.316,top:-.503,aspect:2.273},REAR34:{width:1.613,left:-.316,top:-.503,aspect:2.273},SIDE:{width:1.53,left:-.27,top:-.47,aspect:2.5},STUD_SIDE:{width:1.53,left:-.27,top:-.47,aspect:2.5},STUD_REAR:{width:1.613,left:-.316,top:-.503,aspect:2.273}};function Ae(e,t){return e.find(e=>e.id===t)??null}const Se="tesla_fleet",xe={battery:"charge_state_battery_level",batteryUsable:"charge_state_usable_battery_level",range:"charge_state_battery_range",rangeEstimated:"charge_state_est_battery_range",chargingState:"charge_state_charging_state",chargerPower:"charge_state_charger_power",chargeLimit:"charge_state_charge_limit_soc",timeToFull:"charge_state_minutes_to_full_charge",cableConnected:"charge_state_conn_charge_cable",speed:"drive_state_speed",shiftState:"drive_state_shift_state",odometer:"vehicle_state_odometer",insideTemp:"climate_state_inside_temp",outsideTemp:"climate_state_outside_temp",online:"state",locked:"vehicle_state_locked",location:"location",route:"route",destination:"drive_state_active_route_destination",arrivalTime:"drive_state_active_route_minutes_to_arrival",distanceToArrival:"drive_state_active_route_miles_to_arrival",chargeAtArrival:"drive_state_active_route_energy_at_arrival",sentry:"vehicle_state_sentry_mode",climate:"driver_temp",frunk:"vehicle_state_ft",trunk:"vehicle_state_rt",windows:"windows",wake:"wake"};function ke(e){if(!e?.entities||!e?.devices)return[];const t=new Set;for(const i of Object.values(e.entities))i.platform===Se&&i.device_id&&i.translation_key===xe.battery&&t.add(i.device_id);return[...t].filter(t=>e.devices[t])}function Ee(e,t){if(!t)return null;const i=e?.states?.[t];return i?"unavailable"===i.state||"unknown"===i.state?null:i:null}function Pe(e,t){const i=Ee(e,t);if(!i)return null;const n=Number(i.state);return Number.isFinite(n)?n:null}function Me(e,t){return e?.states?.[t]?.attributes?.unit_of_measurement??null}const Te="asleep",Ce="charging",Ue="driving",Re=new Set(["charging","starting"]),Ne=new Set(["d","r","n"]);function Oe(e,t){const i=Pe(e,t.battery)??Pe(e,t.batteryUsable),n=Pe(e,t.speed),s=Ee(e,t.shiftState)?.state??null,r=Ee(e,t.chargingState)?.state??null,a=Ee(e,t.online)?.state??null,o=Re.has(r);let l;l=Ne.has(s??"")||null!==n&&n>0?Ue:o?Ce:"on"===a||null===a?"parked":Te;const c=function(e,t){const i=Ee(e,t.arrivalTime)?.state??null,n=Pe(e,t.distanceToArrival);return i||null!==n?{destination:Ee(e,t.destination)?.state??null,destinationAvailable:Boolean(t.destination),arrival:i,distance:n,distanceUnit:Me(e,t.distanceToArrival),chargeAtArrival:Pe(e,t.chargeAtArrival)}:null}(e,t);return{status:l,battery:i,range:Pe(e,t.range)??Pe(e,t.rangeEstimated),rangeUnit:Me(e,t.range)??Me(e,t.rangeEstimated),speed:n,speedUnit:Me(e,t.speed),chargeLimit:Pe(e,t.chargeLimit),chargerPower:Pe(e,t.chargerPower),timeToFull:Ee(e,t.timeToFull)?.state??null,locked:Be(e,t),zone:He(e,t),route:c}}function Be(e,t){const i=Ee(e,t.locked);return i?"locked"===i.state:null}function He(e,t){const i=Ee(e,t.location);if(!i)return null;const n=i.state;return"not_home"===n?null:"home"===n?"Home":n}const De={lock:F`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17a2 2 0 0 0 2-2 2 2 0 0 0-2-2 2 2 0 0 0-2 2 2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5 5 5 0 0 1 5 5v2h1M12 3a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3Z"/></svg>`,lockOpen:F`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8h-1V6A5 5 0 0 0 7 6h1.9A3.1 3.1 0 0 1 15 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2m-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/></svg>`,pin:F`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 11.5A2.5 2.5 0 0 1 9.5 9 2.5 2.5 0 0 1 12 6.5 2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z"/></svg>`,bolt:F`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 15H6l7-14v8h5l-7 14v-8Z"/></svg>`,climate:F`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a1 1 0 0 1 1 1v7.27a3 3 0 1 1-2 0V3a1 1 0 0 1 1-1m0 3.5a2.5 2.5 0 0 0-2.5 2.5v4.6a4.5 4.5 0 1 0 5 0V8A2.5 2.5 0 0 0 12 5.5Z"/></svg>`,wake:F`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.56 5.44 15.11 6.89A6 6 0 1 1 8.89 6.9L7.44 5.44a8 8 0 1 0 9.12 0M13 3h-2v10h2Z"/></svg>`},ze="renders";function je(e={}){const{openDatabase:t=Le,fetchImage:i=Ie,createObjectUrl:n=e=>URL.createObjectURL(e),revokeObjectUrl:s=e=>URL.revokeObjectURL(e)}=e,r=new Map,a=new Map;return{resolve:async function(e){if(!e)return null;if(r.has(e))return r.get(e);if(a.has(e))return a.get(e);const s=(async()=>{let s=await async function(e){const i=await t();return i?We(i,e):null}(e).catch(()=>null);if(s||(s=await i(e).catch(()=>null),s&&await async function(e,i){const n=await t();if(!n)return;return Ye(n,e,i)}(e,s).catch(()=>{})),!s)return null;const a=n(s);return r.set(e,a),a})();a.set(e,s);try{return await s}finally{a.delete(e)}},prune:async function(e){const i=new Set(e.filter(Boolean));for(const[e,t]of r)i.has(e)||(s(t),r.delete(e));try{const e=await t();if(!e)return;const n=(await Ve(e)).filter(e=>!i.has(e));n.length&&await function(e,t){return Fe(e,"readwrite",e=>{for(const i of t)e.delete(i);return null})}(e,n)}catch{}},release:function(){for(const e of r.values())s(e);r.clear()}}}function Le(){return new Promise(e=>{if("undefined"==typeof indexedDB)return e(null);let t;try{t=indexedDB.open("tesla-card",1)}catch{return e(null)}t.onupgradeneeded=()=>{const e=t.result;e.objectStoreNames.contains(ze)||e.createObjectStore(ze)},t.onsuccess=()=>e(t.result),t.onerror=()=>e(null),t.onblocked=()=>e(null)})}async function Ie(e){const t=await fetch(e,{mode:"cors",credentials:"omit"});if(!t.ok)throw new Error(`image request failed: ${t.status}`);return t.blob()}function Fe(e,t,i){return new Promise((n,s)=>{let r;try{r=e.transaction(ze,t)}catch(e){return s(e)}const a=i(r.objectStore(ze));r.onabort=()=>s(r.error),r.onerror=()=>s(r.error),a?(a.onsuccess=()=>n(a.result),a.onerror=()=>s(a.error)):r.oncomplete=()=>n()})}const We=(e,t)=>Fe(e,"readonly",e=>e.get(t)),Ye=(e,t,i)=>Fe(e,"readwrite",e=>e.put(i,t)),Ve=e=>Fe(e,"readonly",e=>e.getAllKeys());class Ze extends oe{static properties={hass:{attribute:!1},_config:{state:!0},_imageFailed:{state:!0},_trail:{state:!0},_cachedSrc:{state:!0}};static styles=ce;constructor(){super(),this._imageFailed=!1,this._trail=null,this._unsubscribeHistory=null,this._trailFor=null,this._cachedSrc=null,this._cachedFor=null,this._images=je()}setConfig(e){if(void 0!==e.device_id&&"string"!=typeof e.device_id)throw new Error("device_id must be the id of a Tesla Fleet vehicle");this._config={view:"FRONT34",controls:!1,map:!0,trail:!0,...e},fe.includes(this._config.view)||(this._config.view="FRONT34"),this._imageFailed=!1}disconnectedCallback(){super.disconnectedCallback(),this._stopHistory(),this._images.release(),this._cachedSrc=null,this._cachedFor=null}getCardSize(){return this._showMap()?8:5}getGridOptions(){return{rows:this._showMap()?8:5,columns:12,min_columns:6,min_rows:4}}static getStubConfig(e){return{device_id:ke(e)[0]??""}}static getConfigForm(){return{schema:[{name:"device_id",required:!0,selector:{device:{filter:{integration:"tesla_fleet"}}}},{type:"grid",name:"",flatten:!0,schema:[{name:"paint",selector:{select:{mode:"dropdown",options:Ge}}},{name:"wheels",selector:{select:{mode:"dropdown",options:Ke}}}]},{type:"expandable",name:"advanced",title:"More options",flatten:!0,schema:[{type:"grid",name:"",flatten:!0,schema:[{name:"map",selector:{boolean:{}}},{name:"trail",selector:{boolean:{}}},{name:"controls",selector:{boolean:{}}},{name:"performance",selector:{boolean:{}}}]},{name:"view",selector:{select:{mode:"dropdown",options:fe.map(e=>({value:e,label:e}))}}},{name:"drive_hand",selector:{select:{mode:"dropdown",options:[{value:"auto",label:"From your country setting"},{value:"lhd",label:"Left-hand drive"},{value:"rhd",label:"Right-hand drive"}]}}},{name:"name",selector:{text:{}}},{name:"image",selector:{text:{}}},{name:"options_override",selector:{text:{}}}]}],computeLabel:e=>Je[e.name],computeHelper:e=>Qe[e.name]}}render(){if(!this._config||!this.hass)return Y;const e=this._config.device_id,t=e?this.hass.devices?.[e]:null;if(!t)return this._shell("Tesla",Y,I`<div class="notice">
          Choose a vehicle to show. The card reads everything else from the Tesla Fleet integration.
        </div>`);const i=function(e,t){const i={};if(!e?.entities||!t)return i;const n=new Map(Object.entries(xe).map(([e,t])=>[t,e]));for(const s of Object.values(e.entities)){if(s.device_id!==t)continue;if(s.platform!==Se)continue;const e=n.get(s.translation_key);e&&(i[e]=s.entity_id)}return i}(this.hass,e),n=Oe(this.hass,i),s=function(e){if("string"!=typeof e)return null;const t=e.trim().toUpperCase();if(17!==t.length)return null;const i=he[t[3]];if(!i)return null;const n=de[t[9]]??null,s=me(i.model,n);return{vin:t,model:i.model,name:i.name,year:n,generation:s,plant:t[10]??null}}(t.serial_number)??function(e){if("string"!=typeof e)return null;const t=Object.values(he).find(t=>t.name.toLowerCase()===e.trim().toLowerCase());return t?{vin:null,model:t.model,name:t.name,year:null,generation:me(t.model,null),plant:null}:null}(t.model)??null,r=this._config.name||t.name_by_user||t.name||s?.name||"Tesla",a=function(e){if(null===e)return null;if(e<1)return"just now";if(e<60)return`${e} min ago`;const t=Math.floor(e/60);if(t<24)return 1===t?"1 hr ago":`${t} hrs ago`;const i=Math.floor(t/24);return 1===i?"1 day ago":`${i} days ago`}(function(e,t=new Date){if(!e)return null;const i=Math.floor((t.getTime()-e.getTime())/6e4);return i<0?0:i}(function(e,t){let i=null;for(const n of Object.values(t)){const t=e?.states?.[n]?.last_updated;if(!t)continue;const s=new Date(t);Number.isNaN(s.getTime())||(!i||s>i)&&(i=s)}return i}(this.hass,i))),o=n.route,l=this._showMap()&&Boolean(o)&&Boolean(i.location);return this._syncHistory(l&&this._config.trail?i.location:null),I`
      <ha-card>
        <div class="head">
          <div class="name">${r}</div>
          ${this._status(n)}
        </div>
        ${this._hero(s,n)}
        <div class="strip">
          ${this._readout(n)} ${a?I`<span class="age">${a}</span>`:Y}
        </div>
        ${this._gauge(n)} ${this._place(n,o)}
        ${l?this._map(i,o):Y}
        ${this._config.controls?this._controls(i):Y}
        ${this._notices(s,o)}
      </ha-card>
    `}_shell(e,t,i){return I`<ha-card>
      <div class="head"><div class="name">${e}</div></div>
      ${t}${i}
    </ha-card>`}_status(e){const t={[Te]:"Asleep",[Ce]:"Charging",[Ue]:"Driving",parked:"Parked"},i=!1===e.locked&&e.status!==Ue,n=["status",e.status,i?"unlocked":""].join(" ");return I`<span class=${n}>
      ${!1===e.locked?De.lockOpen:De.lock}
      <span>${t[e.status]??"Parked"}</span>
    </span>`}_hero(e,t){const i=this._imageSource(e,t);this._syncImage(i);const n=this._cachedFor===i&&this._cachedSrc?this._cachedSrc:i;if(!n)return I`<div class="hero blank">
        ${e?`No configurator artwork for the ${e.name} yet.`:"Waiting for the vehicle to report."}
      </div>`;const s=(r=this._config.view,be[r]??be.FRONT34);var r;const a=`aspect-ratio:${s.aspect}`,o=`width:${100*s.width}%;left:${100*s.left}%;top:${100*s.top}%`;return I`<div class="hero ${t.status===Te?"asleep":""}" style=${a}>
      <img
        src=${n}
        alt=${e?.name??"Tesla"}
        style=${o}
        loading="lazy"
        @error=${()=>{this._imageFailed=!0}}
      />
    </div>`}_imageSource(e,t){return this._config.image?this._config.image:this._imageFailed||!e?null:$e(e.model,e.generation)?function({model:e,generation:t=null,paint:i,wheels:n,performance:s=!1,hand:r="lhd",view:a="FRONT34",size:o=1400,optionsOverride:l=null}){const c=ve(e,t);if(!c)return null;let h;if(l)h=l;else{const e=Ae(c.paints,i)?.code??c.paints[0].code,t=Ae(c.wheels,n),a=!t||!s&&t.performanceOnly?c.wheels[0].code:t.code,o=[s&&c.performanceTrim?c.performanceTrim:c.trim,e,a,s&&c.performanceInterior?c.performanceInterior:c.interior];"rhd"===r&&o.push("$DRRH"),h=o.join(",")}return`https://static-assets.tesla.com/configurator/compositor?${new URLSearchParams({context:"design_studio_2",model:e,view:a,size:String(o),bkba_opt:"1",overlay:"0",options:h}).toString()}`}({model:e.model,generation:e.generation,paint:this._config.paint??(i=e.model,n=e.generation,ve(i,n)?.paints[0]?.id??null),wheels:this._config.wheels??_e(e.model,e.generation),performance:!0===this._config.performance,hand:this._hand(),view:this._config.view,optionsOverride:this._config.options_override??null}):null;var i,n}_syncImage(e){this._cachedFor!==e&&(this._cachedFor=e,this._cachedSrc=null,e&&!this._config.image&&this._images.resolve(e).then(t=>{this._cachedFor===e&&(this._cachedSrc=t,this._images.prune([e]))}))}_hand(){const e=this._config.drive_hand;return"lhd"===e||"rhd"===e?e:(t=this.hass?.config?.country,"string"!=typeof t?"lhd":pe.has(t.toUpperCase())?"rhd":"lhd");var t}_readout(e){const t=e.status===Ue&&null!==e.speed,i=t?e.speed:e.battery,n=t?e.speedUnit??"mph":"%",s=null!==e.range?`${Math.round(e.range)} ${e.rangeUnit??"mi"} remaining`:null;return I`
      <span class="value"
        >${null===i?"—":Math.round(i)}<span class="unit">${n}</span></span
      >
      ${s?I`<span class="range">${s}</span>`:Y}
    `}_gauge(e){const t=e.battery??0,i=["fill",e.status===Ce?"charging":"",e.status===Te?"asleep":"",e.status!==Ce&&t<=20?"low":""].join(" "),n=e.chargeLimit;return I`<div class="gauge">
      <div class=${i} style=${`width:${qe(t)}%`}></div>
      ${null!==n&&n>0&&n<100?I`<div
              class="limit"
              style=${`left:${qe(n)}%`}
              title=${`Charge limit ${Math.round(n)}%`}
            ></div>`:Y}
    </div>`}_place(e,t){if(t){const e=this._arrivalIn(t.arrival),i=t.destination??"Destination",n=e?`${i} in ${e}`:i,s=[null!==t.distance?`${Math.round(t.distance)} ${t.distanceUnit??"mi"}`:null,t.arrival?`arriving ${this._clock(t.arrival)}`:null].filter(Boolean).join(", ");return I`<div class="place">
        <span class="lead">${n}</span>
        ${s?I`<span class="detail">${s}</span>`:Y}
      </div>`}return e.zone?I`<div class="place">
      <span class="lead zone">${De.pin}${e.zone}</span>
    </div>`:Y}_map(e,t){if(!customElements.get("ha-map"))return Y;const i=[e.location,e.route].filter(Boolean),n=[];return this._trail?.length>1&&n.push({points:this._trail,color:"var(--tc-accent)",gradualOpacity:.8}),I`<ha-map
      .hass=${this.hass}
      .entities=${i}
      .paths=${n}
      .themeMode=${"auto"}
      .autoFit=${!0}
      .zoom=${13}
      .clusterMarkers=${!1}
    ></ha-map>`}_controls(e){const t=[{id:"lock",label:"Lock",icon:De.lock,entity:e.locked,domain:"lock"},{id:"charge",label:"Charge",icon:De.bolt,entity:e.chargingState,domain:"switch"},{id:"climate",label:"Climate",icon:De.climate,entity:e.climate,domain:"climate"},{id:"wake",label:"Wake",icon:De.wake,entity:e.wake,domain:"button"}].filter(e=>Boolean(e.entity));return t.length?I`<div class="controls">
      ${t.map(e=>I`<button
            type="button"
            @click=${t=>this._runAction(t,e)}
            title=${e.label}
          >
            ${e.icon}${e.label}
          </button>`)}
    </div>`:Y}async _runAction(e,t){e.stopPropagation();const i=Ee(this.hass,t.entity);try{if("lock"===t.domain){const e="locked"===i?.state;await this.hass.callService("lock",e?"unlock":"lock",{entity_id:t.entity})}else"button"===t.domain?await this.hass.callService("button","press",{entity_id:t.entity}):await this.hass.callService("homeassistant","toggle",{entity_id:t.entity})}catch(e){this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:`${t.label} failed: ${e?.message??"unknown error"}`},bubbles:!0,composed:!0}))}}_notices(e,t){const i=[];return!e||$e(e.model,e.generation)||this._config.image||i.push(I`Artwork for the ${e.name} is not mapped yet. Set an <code>image</code> URL to
          show your own.`),t&&!t.destinationAvailable&&i.push(I`Enable the <code>Destination</code> entity on this device to see where the car is
          headed by name.`),i.length?I`${i.map(e=>I`<div class="notice">${e}</div>`)}`:Y}_syncHistory(e){if(this._trailFor===e)return;if(this._trailFor=e,this._stopHistory(),this._trail=null,!e||!this.hass?.connection)return;const t=new Date(Date.now()-72e5).toISOString();this.hass.connection.subscribeMessage(t=>{const i=t?.states?.[e];if(!i)return;const n=i.map(e=>{const t=e.a??e.attributes??{},i=t.latitude,n=t.longitude;if("number"!=typeof i||"number"!=typeof n)return null;const s=e.lu??e.last_updated;return{point:[i,n],timestamp:new Date(1e3*(s??0))}}).filter(Boolean);n.length&&(this._trail=n)},{type:"history/stream",entity_ids:[e],start_time:t,minimal_response:!0,no_attributes:!1}).then(e=>{this._unsubscribeHistory=e}).catch(()=>{this._trail=null})}_stopHistory(){if(this._unsubscribeHistory){try{this._unsubscribeHistory()}catch{}this._unsubscribeHistory=null}}_showMap(){return!1!==this._config?.map}_arrivalIn(e){if(!e)return null;const t=new Date(e);if(Number.isNaN(t.getTime()))return null;const i=Math.round((t.getTime()-Date.now())/6e4);if(i<1)return null;if(i<60)return`${i} min`;const n=Math.floor(i/60),s=i%60;return s?`${n} hr ${s} min`:`${n} hr`}_clock(e){const t=new Date(e);if(Number.isNaN(t.getTime()))return"";try{return t.toLocaleTimeString(this.hass?.locale?.language??void 0,{hour:"2-digit",minute:"2-digit"})}catch{return t.toISOString().slice(11,16)}}}function qe(e){return Math.min(100,Math.max(0,Number(e)||0))}const Ge=Xe(we("my","juniper").concat(we("my","legacy"))),Ke=Xe(ye("my","juniper",!0).concat(ye("my","legacy",!0)));function Xe(e){const t=new Map;for(const i of e)t.has(i.id)||t.set(i.id,i.name);return[...t].map(([e,t])=>({value:e,label:t}))}const Je={device_id:"Vehicle",paint:"Paint",wheels:"Wheels",view:"Angle",map:"Show a map while navigating",trail:"Draw where it has been",controls:"Show controls",performance:"Performance model",drive_hand:"Steering wheel",name:"Name",image:"Image URL",options_override:"Configurator options"},Qe={device_id:"The card reads the model, year and body from this vehicle.",paint:"Not reported by the integration, so pick your colour here.",wheels:"Not reported by the integration, so pick your wheels here.",map:"The map appears only when a route is set. A parked car shows its zone instead.",performance:"Needed before the configurator will render the larger wheels.",image:"Show your own picture instead of the configurator render.",options_override:"Raw option string, for a configuration the dropdowns do not cover."},et="tesla-fleet-card";customElements.get(et)||customElements.define(et,Ze),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===et)||window.customCards.push({type:et,name:"Tesla Card",description:"Battery, range and status for a vehicle on the Tesla Fleet integration.",preview:!0,documentationURL:"https://github.com/alexluckett/tesla-card"});export{Ze as TeslaFleetCard};
