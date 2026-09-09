const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:o,defineProperty:a,getOwnPropertyDescriptor:l,getOwnPropertyNames:c,getOwnPropertySymbols:h,getPrototypeOf:d}=Object,u=globalThis,p=u.trustedTypes,m=p?p.emptyScript:"",f=u.reactiveElementPolyfillSupport,g=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>!o(t,e),$={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&a(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);n?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=d(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...c(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),n=t.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:_).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=s;const r=n.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const r=this.constructor;if(!1===s&&(n=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??v)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[g("elementProperties")]=new Map,y[g("finalized")]=new Map,f?.({ReactiveElement:y}),(u.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,b=t=>t,A=w.trustedTypes,x=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+k,P=`<${E}>`,M=document,T=()=>M.createComment(""),C=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,R="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,B=/>/g,H=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),z=/'/g,D=/"/g,L=/^(?:script|style|textarea|title)$/i,I=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),j=I(1),W=I(2),F=Symbol.for("lit-noChange"),Y=Symbol.for("lit-nothing"),V=new WeakMap,Z=M.createTreeWalker(M,129);function q(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,s=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=U;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(o.lastIndex=h,l=o.exec(i),null!==l);)h=o.lastIndex,o===U?"!--"===l[1]?o=O:void 0!==l[1]?o=B:void 0!==l[2]?(L.test(l[2])&&(n=RegExp("</"+l[2],"g")),o=H):void 0!==l[3]&&(o=H):o===H?">"===l[0]?(o=n??U,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?H:'"'===l[3]?D:z):o===D||o===z?o=H:o===O||o===B?o=U:(o=H,n=void 0);const d=o===H&&t[e+1].startsWith("/>")?" ":"";r+=o===U?i+P:c>=0?(s.push(a),i.slice(0,c)+S+i.slice(c)+k+d):i+k+(-2===c?e:d)}return[q(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[l,c]=G(t,e);if(this.el=K.createElement(l,i),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Z.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(S)){const e=c[r++],i=s.getAttribute(t).split(k),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:i,ctor:"."===o[1]?et:"?"===o[1]?it:"@"===o[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(k),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],T()),Z.nextNode(),a.push({type:2,index:++n});s.append(t[e],T())}}}else if(8===s.nodeType)if(s.data===E)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(k,t+1));)a.push({type:7,index:n}),t+=k.length-1}n++}}static createElement(t,e){const i=M.createElement("template");return i.innerHTML=t,i}}function X(t,e,i=t,s){if(e===F)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const r=C(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=X(t,n._$AS(t,e.values),n,s)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??M).importNode(e,!0);Z.currentNode=s;let n=Z.nextNode(),r=0,o=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Q(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new nt(n,this,t)),this._$AV.push(e),a=i[++o]}r!==a?.index&&(n=Z.nextNode(),r++)}return Z.currentNode=M,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=Y,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),C(t)?t===Y||null==t||""===t?(this._$AH!==Y&&this._$AR(),this._$AH=Y):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==Y&&C(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new J(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new K(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new Q(this.O(T()),this.O(T()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=b(t).nextSibling;b(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=Y,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Y}_$AI(t,e=this,i,s){const n=this.strings;let r=!1;if(void 0===n)t=X(this,t,e,0),r=!C(t)||t!==this._$AH&&t!==F,r&&(this._$AH=t);else{const s=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=X(this,s[i+o],e,o),a===F&&(a=this._$AH[o]),r||=!C(a)||a!==this._$AH[o],a===Y?t=Y:t!==Y&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!s&&this.j(t)}j(t){t===Y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Y?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Y)}}class st extends tt{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??Y)===F)return;const i=this._$AH,s=t===Y&&i!==Y||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==Y&&(i===Y||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(K,Q),(w.litHtmlVersions??=[]).push("3.3.3");const ot=globalThis;class at extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new Q(e.insertBefore(T(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}at._$litElement$=!0,at.finalized=!0,ot.litElementHydrateSupport?.({LitElement:at});const lt=ot.litElementPolyfillSupport;lt?.({LitElement:at}),(ot.litElementVersions??=[]).push("4.2.2");const ct=((t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(s,t,i)})`
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
`,ht={S:{model:"ms",name:"Model S"},X:{model:"mx",name:"Model X"},3:{model:"m3",name:"Model 3"},Y:{model:"my",name:"Model Y"},C:{model:"ct",name:"Cybertruck"},R:{model:"mr",name:"Roadster"},T:{model:"ms",name:"Semi"},A:{model:"my",name:"Cybercab"}},dt={L:2020,M:2021,N:2022,P:2023,R:2024,S:2025,T:2026,V:2027,W:2028,X:2029,Y:2030},ut={my:{year:2025,current:"juniper",previous:"legacy"},m3:{year:2024,current:"highland",previous:"legacy"},ms:{year:2021,current:"palladium",previous:"legacy"},mx:{year:2021,current:"palladium",previous:"legacy"}},pt=new Set(["GB","IE","AU","NZ","JP","IN","ZA","SG","MY","TH","HK","ID","PK","LK","KE","CY","MT"]);function mt(t,e){const i=ut[t];return i?null===e||e>=i.year?i.current:i.previous:null}const ft=["FRONT34","STUD_3QTR","SIDE","STUD_SIDE","REAR34","STUD_REAR"],gt={my:{juniper:{label:"Model Y (2025 onwards)",trim:"$MTY86",performanceTrim:"$MTY53",interior:"$IPB12",performanceInterior:"$IPB14",paints:[{id:"stealth_grey",code:"$PN01",name:"Stealth Grey",swatch:"#494955"},{id:"pearl_white",code:"$PPSW",name:"Pearl White",swatch:"#e7e8ec"},{id:"diamond_black",code:"$PBSB",name:"Diamond Black",swatch:"#262629"},{id:"deep_blue",code:"$PPSB",name:"Deep Blue Metallic",swatch:"#113683"},{id:"ultra_red",code:"$PR01",name:"Ultra Red",swatch:"#a7111f"},{id:"quicksilver",code:"$PN00",name:"Quicksilver",swatch:"#97969f"},{id:"glacier_blue",code:"$PB01",name:"Glacier Blue",swatch:"#6e84a4"},{id:"navy_pb02",code:"$PB02",name:"Dark Blue (PB02)",swatch:"#2a3650"}],wheels:[{id:"crossflow_19",code:"$WY19P",name:'19" Crossflow'},{id:"helix_20",code:"$WY20B",name:'20" Helix 2.0'},{id:"induction_20",code:"$WY20A",name:'20" Induction'},{id:"performance_21",code:"$WY21A",name:'21" Performance',performanceOnly:!0}]},legacy:{label:"Model Y (2020 to 2024)",trim:"$MDLY,$MTY01",interior:"$INPB0",paints:[{id:"pearl_white",code:"$PPSW",name:"Pearl White",swatch:"#e7e8ec"},{id:"solid_black",code:"$PBSB",name:"Solid Black",swatch:"#262629"},{id:"midnight_silver",code:"$PMNG",name:"Midnight Silver",swatch:"#5b6065"},{id:"deep_blue",code:"$PPSB",name:"Deep Blue Metallic",swatch:"#113683"},{id:"red_multicoat",code:"$PPMR",name:"Red Multi-Coat",swatch:"#a51d2c"}],wheels:[{id:"gemini_19",code:"$WY19B",name:'19" Gemini'},{id:"induction_20",code:"$WY20P",name:'20" Induction'}]}},m3:{legacy:{label:"Model 3",trim:"$MDL3,$MT300",interior:"$IN3PB",paints:[{id:"pearl_white",code:"$PPSW",name:"Pearl White",swatch:"#e7e8ec"},{id:"solid_black",code:"$PBSB",name:"Solid Black",swatch:"#262629"},{id:"midnight_silver",code:"$PMNG",name:"Midnight Silver",swatch:"#5b6065"},{id:"deep_blue",code:"$PPSB",name:"Deep Blue Metallic",swatch:"#113683"},{id:"red_multicoat",code:"$PPMR",name:"Red Multi-Coat",swatch:"#a51d2c"}],wheels:[{id:"aero_18",code:"$W38B",name:'18" Aero'}]}}};function _t(t,e){return vt(t,e)?.wheels[0]?.id??null}function vt(t,e){const i=gt[t];return i?e&&i[e]?i[e]:Object.values(i)[0]??null:null}function $t(t,e){return null!==vt(t,e)}function yt(t,e,i=!1){const s=vt(t,e);return s?s.wheels.filter(t=>i||!t.performanceOnly):[]}function wt(t,e){return vt(t,e)?.paints??[]}const bt={FRONT34:{width:1.613,left:-.316,top:-.503,aspect:2.273},STUD_3QTR:{width:1.613,left:-.316,top:-.503,aspect:2.273},REAR34:{width:1.613,left:-.316,top:-.503,aspect:2.273},SIDE:{width:1.53,left:-.27,top:-.47,aspect:2.5},STUD_SIDE:{width:1.53,left:-.27,top:-.47,aspect:2.5},STUD_REAR:{width:1.613,left:-.316,top:-.503,aspect:2.273}};function At(t,e){return t.find(t=>t.id===e)??null}const xt="tesla_fleet",St={battery:"charge_state_battery_level",batteryUsable:"charge_state_usable_battery_level",range:"charge_state_battery_range",rangeEstimated:"charge_state_est_battery_range",chargingState:"charge_state_charging_state",chargerPower:"charge_state_charger_power",chargeLimit:"charge_state_charge_limit_soc",timeToFull:"charge_state_minutes_to_full_charge",cableConnected:"charge_state_conn_charge_cable",speed:"drive_state_speed",shiftState:"drive_state_shift_state",odometer:"vehicle_state_odometer",insideTemp:"climate_state_inside_temp",outsideTemp:"climate_state_outside_temp",online:"state",locked:"vehicle_state_locked",location:"location",route:"route",destination:"drive_state_active_route_destination",arrivalTime:"drive_state_active_route_minutes_to_arrival",distanceToArrival:"drive_state_active_route_miles_to_arrival",chargeAtArrival:"drive_state_active_route_energy_at_arrival",sentry:"vehicle_state_sentry_mode",climate:"driver_temp",frunk:"vehicle_state_ft",trunk:"vehicle_state_rt",windows:"windows",wake:"wake"};function kt(t){if(!t?.entities||!t?.devices)return[];const e=new Set;for(const i of Object.values(t.entities))i.platform===xt&&i.device_id&&i.translation_key===St.battery&&e.add(i.device_id);return[...e].filter(e=>t.devices[e])}function Et(t,e){if(!e)return null;const i=t?.states?.[e];return i?"unavailable"===i.state||"unknown"===i.state?null:i:null}function Pt(t,e){const i=Et(t,e);if(!i)return null;const s=Number(i.state);return Number.isFinite(s)?s:null}function Mt(t,e){return t?.states?.[e]?.attributes?.unit_of_measurement??null}const Tt="asleep",Ct="charging",Nt="driving",Rt=new Set(["charging","starting"]),Ut=new Set(["d","r","n"]);function Ot(t,e){const i=Pt(t,e.battery)??Pt(t,e.batteryUsable),s=Pt(t,e.speed),n=Et(t,e.shiftState)?.state??null,r=Et(t,e.chargingState)?.state??null,o=Et(t,e.online)?.state??null,a=Rt.has(r);let l;l=Ut.has(n??"")||null!==s&&s>0?Nt:a?Ct:"on"===o||null===o?"parked":Tt;const c=function(t,e){const i=Et(t,e.arrivalTime)?.state??null,s=Pt(t,e.distanceToArrival);return i||null!==s?{destination:Et(t,e.destination)?.state??null,destinationAvailable:Boolean(e.destination),arrival:i,distance:s,distanceUnit:Mt(t,e.distanceToArrival),chargeAtArrival:Pt(t,e.chargeAtArrival)}:null}(t,e);return{status:l,battery:i,range:Pt(t,e.range)??Pt(t,e.rangeEstimated),rangeUnit:Mt(t,e.range)??Mt(t,e.rangeEstimated),speed:s,speedUnit:Mt(t,e.speed),chargeLimit:Pt(t,e.chargeLimit),chargerPower:Pt(t,e.chargerPower),timeToFull:Et(t,e.timeToFull)?.state??null,locked:Bt(t,e),zone:Ht(t,e),route:c}}function Bt(t,e){const i=Et(t,e.locked);return i?"locked"===i.state:null}function Ht(t,e){const i=Et(t,e.location);if(!i)return null;const s=i.state;return"not_home"===s?null:"home"===s?"Home":s}const zt={lock:W`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17a2 2 0 0 0 2-2 2 2 0 0 0-2-2 2 2 0 0 0-2 2 2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5 5 5 0 0 1 5 5v2h1M12 3a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3Z"/></svg>`,lockOpen:W`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8h-1V6A5 5 0 0 0 7 6h1.9A3.1 3.1 0 0 1 15 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2m-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/></svg>`,pin:W`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 11.5A2.5 2.5 0 0 1 9.5 9 2.5 2.5 0 0 1 12 6.5 2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z"/></svg>`,bolt:W`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 15H6l7-14v8h5l-7 14v-8Z"/></svg>`,climate:W`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a1 1 0 0 1 1 1v7.27a3 3 0 1 1-2 0V3a1 1 0 0 1 1-1m0 3.5a2.5 2.5 0 0 0-2.5 2.5v4.6a4.5 4.5 0 1 0 5 0V8A2.5 2.5 0 0 0 12 5.5Z"/></svg>`,wake:W`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.56 5.44 15.11 6.89A6 6 0 1 1 8.89 6.9L7.44 5.44a8 8 0 1 0 9.12 0M13 3h-2v10h2Z"/></svg>`};class Dt extends at{static properties={hass:{attribute:!1},_config:{state:!0},_imageFailed:{state:!0},_trail:{state:!0}};static styles=ct;constructor(){super(),this._imageFailed=!1,this._trail=null,this._unsubscribeHistory=null,this._trailFor=null}setConfig(t){if(void 0!==t.device_id&&"string"!=typeof t.device_id)throw new Error("device_id must be the id of a Tesla Fleet vehicle");this._config={view:"FRONT34",controls:!1,map:!0,trail:!0,...t},ft.includes(this._config.view)||(this._config.view="FRONT34"),this._imageFailed=!1}disconnectedCallback(){super.disconnectedCallback(),this._stopHistory()}getCardSize(){return this._showMap()?8:5}getGridOptions(){return{rows:this._showMap()?8:5,columns:12,min_columns:6,min_rows:4}}static getStubConfig(t){return{device_id:kt(t)[0]??""}}static getConfigForm(){return{schema:[{name:"device_id",required:!0,selector:{device:{filter:{integration:"tesla_fleet"}}}},{type:"grid",name:"",flatten:!0,schema:[{name:"paint",selector:{select:{mode:"dropdown",options:It}}},{name:"wheels",selector:{select:{mode:"dropdown",options:jt}}}]},{type:"expandable",name:"advanced",title:"More options",flatten:!0,schema:[{type:"grid",name:"",flatten:!0,schema:[{name:"map",selector:{boolean:{}}},{name:"trail",selector:{boolean:{}}},{name:"controls",selector:{boolean:{}}},{name:"performance",selector:{boolean:{}}}]},{name:"view",selector:{select:{mode:"dropdown",options:ft.map(t=>({value:t,label:t}))}}},{name:"drive_hand",selector:{select:{mode:"dropdown",options:[{value:"auto",label:"From your country setting"},{value:"lhd",label:"Left-hand drive"},{value:"rhd",label:"Right-hand drive"}]}}},{name:"name",selector:{text:{}}},{name:"image",selector:{text:{}}},{name:"options_override",selector:{text:{}}}]}],computeLabel:t=>Ft[t.name],computeHelper:t=>Yt[t.name]}}render(){if(!this._config||!this.hass)return Y;const t=this._config.device_id,e=t?this.hass.devices?.[t]:null;if(!e)return this._shell("Tesla",Y,j`<div class="notice">
          Choose a vehicle to show. The card reads everything else from the Tesla Fleet integration.
        </div>`);const i=function(t,e){const i={};if(!t?.entities||!e)return i;const s=new Map(Object.entries(St).map(([t,e])=>[e,t]));for(const n of Object.values(t.entities)){if(n.device_id!==e)continue;if(n.platform!==xt)continue;const t=s.get(n.translation_key);t&&(i[t]=n.entity_id)}return i}(this.hass,t),s=Ot(this.hass,i),n=function(t){if("string"!=typeof t)return null;const e=t.trim().toUpperCase();if(17!==e.length)return null;const i=ht[e[3]];if(!i)return null;const s=dt[e[9]]??null,n=mt(i.model,s);return{vin:e,model:i.model,name:i.name,year:s,generation:n,plant:e[10]??null}}(e.serial_number)??function(t){if("string"!=typeof t)return null;const e=Object.values(ht).find(e=>e.name.toLowerCase()===t.trim().toLowerCase());return e?{vin:null,model:e.model,name:e.name,year:null,generation:mt(e.model,null),plant:null}:null}(e.model)??null,r=this._config.name||e.name_by_user||e.name||n?.name||"Tesla",o=function(t){if(null===t)return null;if(t<1)return"just now";if(t<60)return`${t} min ago`;const e=Math.floor(t/60);if(e<24)return 1===e?"1 hr ago":`${e} hrs ago`;const i=Math.floor(e/24);return 1===i?"1 day ago":`${i} days ago`}(function(t,e=new Date){if(!t)return null;const i=Math.floor((e.getTime()-t.getTime())/6e4);return i<0?0:i}(function(t,e){let i=null;for(const s of Object.values(e)){const e=t?.states?.[s]?.last_updated;if(!e)continue;const n=new Date(e);Number.isNaN(n.getTime())||(!i||n>i)&&(i=n)}return i}(this.hass,i))),a=s.route,l=this._showMap()&&Boolean(a)&&Boolean(i.location);return this._syncHistory(l&&this._config.trail?i.location:null),j`
      <ha-card>
        <div class="head">
          <div class="name">${r}</div>
          ${this._status(s)}
        </div>
        ${this._hero(n,s)}
        <div class="strip">
          ${this._readout(s)} ${o?j`<span class="age">${o}</span>`:Y}
        </div>
        ${this._gauge(s)} ${this._place(s,a)}
        ${l?this._map(i,a):Y}
        ${this._config.controls?this._controls(i):Y}
        ${this._notices(n,a)}
      </ha-card>
    `}_shell(t,e,i){return j`<ha-card>
      <div class="head"><div class="name">${t}</div></div>
      ${e}${i}
    </ha-card>`}_status(t){const e={[Tt]:"Asleep",[Ct]:"Charging",[Nt]:"Driving",parked:"Parked"},i=!1===t.locked&&t.status!==Nt,s=["status",t.status,i?"unlocked":""].join(" ");return j`<span class=${s}>
      ${!1===t.locked?zt.lockOpen:zt.lock}
      <span>${e[t.status]??"Parked"}</span>
    </span>`}_hero(t,e){const i=this._imageSource(t,e);if(!i)return j`<div class="hero blank">
        ${t?`No configurator artwork for the ${t.name} yet.`:"Waiting for the vehicle to report."}
      </div>`;const s=(n=this._config.view,bt[n]??bt.FRONT34);var n;const r=`aspect-ratio:${s.aspect}`,o=`width:${100*s.width}%;left:${100*s.left}%;top:${100*s.top}%`;return j`<div class="hero ${e.status===Tt?"asleep":""}" style=${r}>
      <img
        src=${i}
        alt=${t?.name??"Tesla"}
        style=${o}
        loading="lazy"
        @error=${()=>{this._imageFailed=!0}}
      />
    </div>`}_imageSource(t,e){return this._config.image?this._config.image:this._imageFailed||!t?null:$t(t.model,t.generation)?function({model:t,generation:e=null,paint:i,wheels:s,performance:n=!1,hand:r="lhd",view:o="FRONT34",size:a=1400,optionsOverride:l=null}){const c=vt(t,e);if(!c)return null;let h;if(l)h=l;else{const t=At(c.paints,i)?.code??c.paints[0].code,e=At(c.wheels,s),o=!e||!n&&e.performanceOnly?c.wheels[0].code:e.code,a=[n&&c.performanceTrim?c.performanceTrim:c.trim,t,o,n&&c.performanceInterior?c.performanceInterior:c.interior];"rhd"===r&&a.push("$DRRH"),h=a.join(",")}return`https://static-assets.tesla.com/configurator/compositor?${new URLSearchParams({context:"design_studio_2",model:t,view:o,size:String(a),bkba_opt:"1",overlay:"0",options:h}).toString()}`}({model:t.model,generation:t.generation,paint:this._config.paint??(i=t.model,s=t.generation,vt(i,s)?.paints[0]?.id??null),wheels:this._config.wheels??_t(t.model,t.generation),performance:!0===this._config.performance,hand:this._hand(),view:this._config.view,optionsOverride:this._config.options_override??null}):null;var i,s}_hand(){const t=this._config.drive_hand;return"lhd"===t||"rhd"===t?t:(e=this.hass?.config?.country,"string"!=typeof e?"lhd":pt.has(e.toUpperCase())?"rhd":"lhd");var e}_readout(t){const e=t.status===Nt&&null!==t.speed,i=e?t.speed:t.battery,s=e?t.speedUnit??"mph":"%",n=null!==t.range?`${Math.round(t.range)} ${t.rangeUnit??"mi"} remaining`:null;return j`
      <span class="value"
        >${null===i?"—":Math.round(i)}<span class="unit">${s}</span></span
      >
      ${n?j`<span class="range">${n}</span>`:Y}
    `}_gauge(t){const e=t.battery??0,i=["fill",t.status===Ct?"charging":"",t.status===Tt?"asleep":"",t.status!==Ct&&e<=20?"low":""].join(" "),s=t.chargeLimit;return j`<div class="gauge">
      <div class=${i} style=${`width:${Lt(e)}%`}></div>
      ${null!==s&&s>0&&s<100?j`<div
              class="limit"
              style=${`left:${Lt(s)}%`}
              title=${`Charge limit ${Math.round(s)}%`}
            ></div>`:Y}
    </div>`}_place(t,e){if(e){const t=this._arrivalIn(e.arrival),i=e.destination??"Destination",s=t?`${i} in ${t}`:i,n=[null!==e.distance?`${Math.round(e.distance)} ${e.distanceUnit??"mi"}`:null,e.arrival?`arriving ${this._clock(e.arrival)}`:null].filter(Boolean).join(", ");return j`<div class="place">
        <span class="lead">${s}</span>
        ${n?j`<span class="detail">${n}</span>`:Y}
      </div>`}return t.zone?j`<div class="place">
      <span class="lead zone">${zt.pin}${t.zone}</span>
    </div>`:Y}_map(t,e){if(!customElements.get("ha-map"))return Y;const i=[t.location,t.route].filter(Boolean),s=[];return this._trail?.length>1&&s.push({points:this._trail,color:"var(--tc-accent)",gradualOpacity:.8}),j`<ha-map
      .hass=${this.hass}
      .entities=${i}
      .paths=${s}
      .themeMode=${"auto"}
      .autoFit=${!0}
      .zoom=${13}
      .clusterMarkers=${!1}
    ></ha-map>`}_controls(t){const e=[{id:"lock",label:"Lock",icon:zt.lock,entity:t.locked,domain:"lock"},{id:"charge",label:"Charge",icon:zt.bolt,entity:t.chargingState,domain:"switch"},{id:"climate",label:"Climate",icon:zt.climate,entity:t.climate,domain:"climate"},{id:"wake",label:"Wake",icon:zt.wake,entity:t.wake,domain:"button"}].filter(t=>Boolean(t.entity));return e.length?j`<div class="controls">
      ${e.map(t=>j`<button
            type="button"
            @click=${e=>this._runAction(e,t)}
            title=${t.label}
          >
            ${t.icon}${t.label}
          </button>`)}
    </div>`:Y}async _runAction(t,e){t.stopPropagation();const i=Et(this.hass,e.entity);try{if("lock"===e.domain){const t="locked"===i?.state;await this.hass.callService("lock",t?"unlock":"lock",{entity_id:e.entity})}else"button"===e.domain?await this.hass.callService("button","press",{entity_id:e.entity}):await this.hass.callService("homeassistant","toggle",{entity_id:e.entity})}catch(t){this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:`${e.label} failed: ${t?.message??"unknown error"}`},bubbles:!0,composed:!0}))}}_notices(t,e){const i=[];return!t||$t(t.model,t.generation)||this._config.image||i.push(j`Artwork for the ${t.name} is not mapped yet. Set an <code>image</code> URL to
          show your own.`),e&&!e.destinationAvailable&&i.push(j`Enable the <code>Destination</code> entity on this device to see where the car is
          headed by name.`),i.length?j`${i.map(t=>j`<div class="notice">${t}</div>`)}`:Y}_syncHistory(t){if(this._trailFor===t)return;if(this._trailFor=t,this._stopHistory(),this._trail=null,!t||!this.hass?.connection)return;const e=new Date(Date.now()-72e5).toISOString();this.hass.connection.subscribeMessage(e=>{const i=e?.states?.[t];if(!i)return;const s=i.map(t=>{const e=t.a??t.attributes??{},i=e.latitude,s=e.longitude;if("number"!=typeof i||"number"!=typeof s)return null;const n=t.lu??t.last_updated;return{point:[i,s],timestamp:new Date(1e3*(n??0))}}).filter(Boolean);s.length&&(this._trail=s)},{type:"history/stream",entity_ids:[t],start_time:e,minimal_response:!0,no_attributes:!1}).then(t=>{this._unsubscribeHistory=t}).catch(()=>{this._trail=null})}_stopHistory(){if(this._unsubscribeHistory){try{this._unsubscribeHistory()}catch{}this._unsubscribeHistory=null}}_showMap(){return!1!==this._config?.map}_arrivalIn(t){if(!t)return null;const e=new Date(t);if(Number.isNaN(e.getTime()))return null;const i=Math.round((e.getTime()-Date.now())/6e4);if(i<1)return null;if(i<60)return`${i} min`;const s=Math.floor(i/60),n=i%60;return n?`${s} hr ${n} min`:`${s} hr`}_clock(t){const e=new Date(t);if(Number.isNaN(e.getTime()))return"";try{return e.toLocaleTimeString(this.hass?.locale?.language??void 0,{hour:"2-digit",minute:"2-digit"})}catch{return e.toISOString().slice(11,16)}}}function Lt(t){return Math.min(100,Math.max(0,Number(t)||0))}const It=Wt(wt("my","juniper").concat(wt("my","legacy"))),jt=Wt(yt("my","juniper",!0).concat(yt("my","legacy",!0)));function Wt(t){const e=new Map;for(const i of t)e.has(i.id)||e.set(i.id,i.name);return[...e].map(([t,e])=>({value:t,label:e}))}const Ft={device_id:"Vehicle",paint:"Paint",wheels:"Wheels",view:"Angle",map:"Show a map while navigating",trail:"Draw where it has been",controls:"Show controls",performance:"Performance model",drive_hand:"Steering wheel",name:"Name",image:"Image URL",options_override:"Configurator options"},Yt={device_id:"The card reads the model, year and body from this vehicle.",paint:"Not reported by the integration, so pick your colour here.",wheels:"Not reported by the integration, so pick your wheels here.",map:"The map appears only when a route is set. A parked car shows its zone instead.",performance:"Needed before the configurator will render the larger wheels.",image:"Show your own picture instead of the configurator render.",options_override:"Raw option string, for a configuration the dropdowns do not cover."},Vt="tesla-fleet-card";customElements.get(Vt)||customElements.define(Vt,Dt),window.customCards=window.customCards||[],window.customCards.some(t=>t.type===Vt)||window.customCards.push({type:Vt,name:"Tesla Card",description:"Battery, range and status for a vehicle on the Tesla Fleet integration.",preview:!0,documentationURL:"https://github.com/alexluckett/tesla-card"});export{Dt as TeslaFleetCard};
