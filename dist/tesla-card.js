const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;let s=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=n.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n.set(i,t))}return t}toString(){return this.cssText}};const r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:o,getOwnPropertyDescriptor:l,getOwnPropertyNames:c,getOwnPropertySymbols:h,getPrototypeOf:d}=Object,u=globalThis,p=u.trustedTypes,m=p?p.emptyScript:"",f=u.reactiveElementPolyfillSupport,g=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>!a(t,e),y={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,e);void 0!==n&&o(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){const{get:n,set:s}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:n,set(e){const r=n?.call(this);s?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=d(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...c(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,n)=>{if(e)i.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of n){const n=document.createElement("style"),s=t.litNonce;void 0!==s&&n.setAttribute("nonce",s),n.textContent=e.cssText,i.appendChild(n)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(void 0!==n&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:_).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,n=i._$Eh.get(t);if(void 0!==n&&this._$Em!==n){const t=i.getPropertyOptions(n),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=n;const r=s.fromAttribute(e,t.type);this[n]=r??this._$Ej?.get(n)??r,this._$Em=null}}requestUpdate(t,e,i,n=!1,s){if(void 0!==t){const r=this.constructor;if(!1===n&&(s=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??v)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:n,wrapped:s},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==s||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===n&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,n=this[e];!0!==t||this._$AL.has(e)||void 0===n||this.C(e,void 0,i,n)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[g("elementProperties")]=new Map,$[g("finalized")]=new Map,f?.({ReactiveElement:$}),(u.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,b=t=>t,A=w.trustedTypes,x=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+k,M=`<${E}>`,C=document,P=()=>C.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,N="[ \t\n\f\r]",O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,B=/>/g,H=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,L=/"/g,z=/^(?:script|style|textarea|title)$/i,j=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),F=j(1),I=j(2),W=Symbol.for("lit-noChange"),Y=Symbol.for("lit-nothing"),V=new WeakMap,q=C.createTreeWalker(C,129);function Z(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,n=[];let s,r=2===e?"<svg>":3===e?"<math>":"",a=O;for(let e=0;e<i;e++){const i=t[e];let o,l,c=-1,h=0;for(;h<i.length&&(a.lastIndex=h,l=a.exec(i),null!==l);)h=a.lastIndex,a===O?"!--"===l[1]?a=R:void 0!==l[1]?a=B:void 0!==l[2]?(z.test(l[2])&&(s=RegExp("</"+l[2],"g")),a=H):void 0!==l[3]&&(a=H):a===H?">"===l[0]?(a=s??O,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,o=l[1],a=void 0===l[3]?H:'"'===l[3]?L:D):a===L||a===D?a=H:a===R||a===B?a=O:(a=H,s=void 0);const d=a===H&&t[e+1].startsWith("/>")?" ":"";r+=a===O?i+M:c>=0?(n.push(o),i.slice(0,c)+S+i.slice(c)+k+d):i+k+(-2===c?e:d)}return[Z(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]};class K{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let s=0,r=0;const a=t.length-1,o=this.parts,[l,c]=G(t,e);if(this.el=K.createElement(l,i),q.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=q.nextNode())&&o.length<a;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(S)){const e=c[r++],i=n.getAttribute(t).split(k),a=/([.?@])?(.*)/.exec(e);o.push({type:1,index:s,name:a[2],strings:i,ctor:"."===a[1]?et:"?"===a[1]?it:"@"===a[1]?nt:tt}),n.removeAttribute(t)}else t.startsWith(k)&&(o.push({type:6,index:s}),n.removeAttribute(t));if(z.test(n.tagName)){const t=n.textContent.split(k),e=t.length-1;if(e>0){n.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],P()),q.nextNode(),o.push({type:2,index:++s});n.append(t[e],P())}}}else if(8===n.nodeType)if(n.data===E)o.push({type:2,index:s});else{let t=-1;for(;-1!==(t=n.data.indexOf(k,t+1));)o.push({type:7,index:s}),t+=k.length-1}s++}}static createElement(t,e){const i=C.createElement("template");return i.innerHTML=t,i}}function X(t,e,i=t,n){if(e===W)return e;let s=void 0!==n?i._$Co?.[n]:i._$Cl;const r=T(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),void 0===r?s=void 0:(s=new r(t),s._$AT(t,i,n)),void 0!==n?(i._$Co??=[])[n]=s:i._$Cl=s),void 0!==s&&(e=X(t,s._$AS(t,e.values),s,n)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??C).importNode(e,!0);q.currentNode=n;let s=q.nextNode(),r=0,a=0,o=i[0];for(;void 0!==o;){if(r===o.index){let e;2===o.type?e=new Q(s,s.nextSibling,this,t):1===o.type?e=new o.ctor(s,o.name,o.strings,this,t):6===o.type&&(e=new st(s,this,t)),this._$AV.push(e),o=i[++a]}r!==o?.index&&(s=q.nextNode(),r++)}return q.currentNode=C,n}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=Y,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),T(t)?t===Y||null==t||""===t?(this._$AH!==Y&&this._$AR(),this._$AH=Y):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==Y&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(C.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{const t=new J(n,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new K(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const s of t)n===e.length?e.push(i=new Q(this.O(P()),this.O(P()),this,this.options)):i=e[n],i._$AI(s),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=b(t).nextSibling;b(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,s){this.type=1,this._$AH=Y,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Y}_$AI(t,e=this,i,n){const s=this.strings;let r=!1;if(void 0===s)t=X(this,t,e,0),r=!T(t)||t!==this._$AH&&t!==W,r&&(this._$AH=t);else{const n=t;let a,o;for(t=s[0],a=0;a<s.length-1;a++)o=X(this,n[i+a],e,a),o===W&&(o=this._$AH[a]),r||=!T(o)||o!==this._$AH[a],o===Y?t=Y:t!==Y&&(t+=(o??"")+s[a+1]),this._$AH[a]=o}r&&!n&&this.j(t)}j(t){t===Y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Y?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Y)}}class nt extends tt{constructor(t,e,i,n,s){super(t,e,i,n,s),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??Y)===W)return;const i=this._$AH,n=t===Y&&i!==Y||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==Y&&(i===Y||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(K,Q),(w.litHtmlVersions??=[]).push("3.3.3");const at=globalThis;class ot extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const n=i?.renderBefore??e;let s=n._$litPart$;if(void 0===s){const t=i?.renderBefore??null;n._$litPart$=s=new Q(e.insertBefore(P(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}ot._$litElement$=!0,ot.finalized=!0,at.litElementHydrateSupport?.({LitElement:ot});const lt=at.litElementPolyfillSupport;lt?.({LitElement:ot}),(at.litElementVersions??=[]).push("4.2.2");const ct=((t,...e)=>{const n=1===t.length?t[0]:e.reduce((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1],t[0]);return new s(n,t,i)})`
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
    align-items: baseline;
    gap: 5px;
    min-width: 0;
  }
  /* Only the name may shrink; the arrival time always survives. */
  .place .where {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }
  .place .eta {
    flex: none;
  }
  /* Baseline is right for the navigation line, where two runs of text share
     one. It is wrong here: an SVG's baseline is its bottom edge, so the pin
     rides up by the descender space. Centre the glyph on the text instead. */
  .place .lead.zone {
    align-items: center;
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
    flex: none;
  }

  ha-map {
    display: block;
    margin-top: 12px;
    border-radius: 10px;
    overflow: hidden;
    height: 170px;
    /* Left alone, a marker is a 48px circle carrying the initials of the
       entity name, so a Tesla Model Y arrives as a large "TMY" badge. Two
       cars on a small map is not what this card is for: shrink it to a dot
       and drop the lettering, keeping the colour to say which is which. */
    --ha-marker-size: 18px;
    --ha-marker-font-size: 0px;
  }

  .controls {
    display: flex;
    gap: 6px;
    margin-top: 14px;
    flex-wrap: wrap;
  }
  .controls button {
    flex: 1 1 0;
    min-width: 60px;
    min-height: 52px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 9px 4px;
    font: inherit;
    font-size: var(--ha-font-size-s, 11.5px);
    color: var(--tc-dim);
    background: var(--tc-line);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background 120ms ease;
  }
  /* Tinted means the car is doing this now, so the row reads as state. */
  .controls button.on {
    color: var(--tc-accent);
    background: var(--tc-line);
    background: color-mix(in srgb, currentColor 16%, transparent);
  }
  .controls button.on.ok {
    color: var(--tc-ok);
  }
  .controls button.on.warn {
    color: var(--tc-warn);
  }
  .controls button:hover:not(:disabled) {
    background: color-mix(in srgb, currentColor 26%, transparent);
  }
  @media (prefers-reduced-motion: reduce) {
    .controls button {
      transition: none;
    }
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
    flex: none;
  }
  .controls button span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
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
`,ht={S:{model:"ms",name:"Model S"},X:{model:"mx",name:"Model X"},3:{model:"m3",name:"Model 3"},Y:{model:"my",name:"Model Y"},C:{model:"ct",name:"Cybertruck"},R:{model:"mr",name:"Roadster"},T:{model:"ms",name:"Semi"},A:{model:"my",name:"Cybercab"}},dt={L:2020,M:2021,N:2022,P:2023,R:2024,S:2025,T:2026,V:2027,W:2028,X:2029,Y:2030},ut={my:{year:2025,current:"juniper",previous:"legacy"},m3:{year:2024,current:"highland",previous:"legacy"},ms:{year:2021,current:"palladium",previous:"legacy"},mx:{year:2021,current:"palladium",previous:"legacy"}},pt=new Set(["GB","IE","AU","NZ","JP","IN","ZA","SG","MY","TH","HK","ID","PK","LK","KE","CY","MT"]);function mt(t,e){const i=ut[t];return i?null===e||e>=i.year?i.current:i.previous:null}const ft=["FRONT34","STUD_3QTR","SIDE","STUD_SIDE","REAR34","STUD_REAR"],gt={my:{juniper:{label:"Model Y (2025 onwards)",trim:"$MTY86",performanceTrim:"$MTY53",interior:"$IPB12",performanceInterior:"$IPB14",paints:[{id:"stealth_grey",code:"$PN01",name:"Stealth Grey",swatch:"#494955"},{id:"pearl_white",code:"$PPSW",name:"Pearl White",swatch:"#e7e8ec"},{id:"diamond_black",code:"$PBSB",name:"Diamond Black",swatch:"#262629"},{id:"deep_blue",code:"$PPSB",name:"Deep Blue Metallic",swatch:"#113683"},{id:"ultra_red",code:"$PR01",name:"Ultra Red",swatch:"#a7111f"},{id:"quicksilver",code:"$PN00",name:"Quicksilver",swatch:"#97969f"},{id:"glacier_blue",code:"$PB01",name:"Glacier Blue",swatch:"#6e84a4"},{id:"navy_pb02",code:"$PB02",name:"Dark Blue (PB02)",swatch:"#2a3650"}],wheels:[{id:"crossflow_19",code:"$WY19P",name:'19" Crossflow'},{id:"helix_20",code:"$WY20B",name:'20" Helix 2.0'},{id:"induction_20",code:"$WY20A",name:'20" Induction'},{id:"performance_21",code:"$WY21A",name:'21" Performance',performanceOnly:!0}]},legacy:{label:"Model Y (2020 to 2024)",trim:"$MDLY,$MTY01",interior:"$INPB0",paints:[{id:"pearl_white",code:"$PPSW",name:"Pearl White",swatch:"#e7e8ec"},{id:"solid_black",code:"$PBSB",name:"Solid Black",swatch:"#262629"},{id:"midnight_silver",code:"$PMNG",name:"Midnight Silver",swatch:"#5b6065"},{id:"deep_blue",code:"$PPSB",name:"Deep Blue Metallic",swatch:"#113683"},{id:"red_multicoat",code:"$PPMR",name:"Red Multi-Coat",swatch:"#a51d2c"}],wheels:[{id:"gemini_19",code:"$WY19B",name:'19" Gemini'},{id:"induction_20",code:"$WY20P",name:'20" Induction'}]}},m3:{legacy:{label:"Model 3",trim:"$MDL3,$MT300",interior:"$IN3PB",paints:[{id:"pearl_white",code:"$PPSW",name:"Pearl White",swatch:"#e7e8ec"},{id:"solid_black",code:"$PBSB",name:"Solid Black",swatch:"#262629"},{id:"midnight_silver",code:"$PMNG",name:"Midnight Silver",swatch:"#5b6065"},{id:"deep_blue",code:"$PPSB",name:"Deep Blue Metallic",swatch:"#113683"},{id:"red_multicoat",code:"$PPMR",name:"Red Multi-Coat",swatch:"#a51d2c"}],wheels:[{id:"aero_18",code:"$W38B",name:'18" Aero'}]}}};function _t(t,e){return vt(t,e)?.wheels[0]?.id??null}function vt(t,e){const i=gt[t];return i?e&&i[e]?i[e]:Object.values(i)[0]??null:null}function yt(t,e){return null!==vt(t,e)}function $t(t,e,i=!1){const n=vt(t,e);return n?n.wheels.filter(t=>i||!t.performanceOnly):[]}function wt(t,e){return vt(t,e)?.paints??[]}const bt={FRONT34:{width:1.613,left:-.316,top:-.503,aspect:2.273},STUD_3QTR:{width:1.613,left:-.316,top:-.503,aspect:2.273},REAR34:{width:1.613,left:-.316,top:-.503,aspect:2.273},SIDE:{width:1.53,left:-.27,top:-.47,aspect:2.5},STUD_SIDE:{width:1.53,left:-.27,top:-.47,aspect:2.5},STUD_REAR:{width:1.613,left:-.316,top:-.503,aspect:2.273}};function At(t,e){return t.find(t=>t.id===e)??null}const xt="tesla_fleet",St={battery:"sensor:charge_state_battery_level",batteryUsable:"sensor:charge_state_usable_battery_level",range:"sensor:charge_state_battery_range",rangeEstimated:"sensor:charge_state_est_battery_range",chargingState:"sensor:charge_state_charging_state",chargerPower:"sensor:charge_state_charger_power",chargeLimit:"number:charge_state_charge_limit_soc",timeToFull:"sensor:charge_state_minutes_to_full_charge",cableConnected:"binary_sensor:charge_state_conn_charge_cable",speed:"sensor:drive_state_speed",shiftState:"sensor:drive_state_shift_state",odometer:"sensor:vehicle_state_odometer",insideTemp:"sensor:climate_state_inside_temp",outsideTemp:"sensor:climate_state_outside_temp",online:"binary_sensor:state",locked:"lock:vehicle_state_locked",location:"device_tracker:location",route:"device_tracker:route",destination:"sensor:drive_state_active_route_destination",arrivalTime:"sensor:drive_state_active_route_minutes_to_arrival",distanceToArrival:"sensor:drive_state_active_route_miles_to_arrival",chargeAtArrival:"sensor:drive_state_active_route_energy_at_arrival",chargeSwitch:"switch:charge_state_charging_state",sentry:"switch:vehicle_state_sentry_mode",climate:"climate:driver_temp",frunk:"cover:vehicle_state_ft",trunk:"cover:vehicle_state_rt",windows:"cover:windows",wake:"button:wake"};function kt(t){const e="string"==typeof t?t.indexOf("."):-1;return e>0?t.slice(0,e):null}function Et(t){if(!t?.entities||!t?.devices)return[];const e=new Set;for(const i of Object.values(t.entities))i.platform===xt&&i.device_id&&`${kt(i.entity_id)}:${i.translation_key}`===St.battery&&e.add(i.device_id);return[...e].filter(e=>t.devices[e])}function Mt(t,e){if(!e)return null;const i=t?.states?.[e];return i?"unavailable"===i.state||"unknown"===i.state?null:i:null}function Ct(t,e){const i=Mt(t,e);if(!i)return null;const n=Number(i.state);return Number.isFinite(n)?n:null}function Pt(t,e){return t?.states?.[e]?.attributes?.unit_of_measurement??null}const Tt="asleep",Ut="charging",Nt="driving",Ot=new Set(["charging","starting"]),Rt=new Set(["d","r","n"]);function Bt(t,e){const i=Ct(t,e.battery)??Ct(t,e.batteryUsable),n=Ct(t,e.speed),s=Mt(t,e.shiftState)?.state??null,r=Mt(t,e.chargingState)?.state??null,a=Mt(t,e.online)?.state??null,o=Ot.has(r);let l;l=Rt.has(s??"")||null!==n&&n>0?Nt:o?Ut:"on"===a||null===a?"parked":Tt;const c=function(t,e){const i=Mt(t,e.arrivalTime)?.state??null,n=Ct(t,e.distanceToArrival);return i||null!==n?{destination:Mt(t,e.destination)?.state??null,destinationEntityMissing:!e.destination,arrival:i,distance:n,distanceUnit:Pt(t,e.distanceToArrival),chargeAtArrival:Ct(t,e.chargeAtArrival)}:null}(t,e);return{status:l,battery:i,range:Ct(t,e.range)??Ct(t,e.rangeEstimated),rangeUnit:Pt(t,e.range)??Pt(t,e.rangeEstimated),speed:n,speedUnit:Pt(t,e.speed),chargeLimit:Ct(t,e.chargeLimit),chargerPower:Ct(t,e.chargerPower),timeToFull:Mt(t,e.timeToFull)?.state??null,locked:Ht(t,e),zone:Dt(t,e),route:c}}function Ht(t,e){const i=Mt(t,e.locked);return i?"locked"===i.state:null}function Dt(t,e){const i=Mt(t,e.location);if(!i)return null;const n=i.state;return"not_home"===n?null:"home"===n?"Home":n}const Lt=I`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17a2 2 0 0 0 2-2 2 2 0 0 0-2-2 2 2 0 0 0-2 2 2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5 5 5 0 0 1 5 5v2h1M12 3a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3Z"/></svg>`,zt=I`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8h-1V6A5 5 0 0 0 7 6h1.9A3.1 3.1 0 0 1 15 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2m-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/></svg>`,jt=I`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 11.5A2.5 2.5 0 0 1 9.5 9 2.5 2.5 0 0 1 12 6.5 2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z"/></svg>`,Ft=I`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 15H6l7-14v8h5l-7 14v-8Z"/></svg>`,It=I`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a1 1 0 0 1 1 1v7.27a3 3 0 1 1-2 0V3a1 1 0 0 1 1-1m0 3.5a2.5 2.5 0 0 0-2.5 2.5v4.6a4.5 4.5 0 1 0 5 0V8A2.5 2.5 0 0 0 12 5.5Z"/></svg>`,Wt=I`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5 5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5Z"/></svg>`,Yt=I`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.56 5.44 15.11 6.89A6 6 0 1 1 8.89 6.9L7.44 5.44a8 8 0 1 0 9.12 0M13 3h-2v10h2Z"/></svg>`,Vt="renders";function qt(t={}){const{openDatabase:e=Zt,fetchImage:i=Kt,createObjectUrl:n=t=>URL.createObjectURL(t),revokeObjectUrl:s=t=>URL.revokeObjectURL(t)}=t,r=new Map,a=new Map;async function o(t){const i=await e();if(i)return ee(i,[t])}return{resolve:async function(t){if(!t)return null;if(r.has(t))return r.get(t);if(a.has(t))return a.get(t);const s=(async()=>{let s=await async function(t){const i=await e();return i?Jt(i,t):null}(t).catch(()=>null);if(s&&!Gt(s)&&(s=null,await o(t).catch(()=>{})),s||(s=await i(t).catch(()=>null),s&&Gt(s)&&await async function(t,i){const n=await e();if(!n)return;return Qt(n,t,i)}(t,s).catch(()=>{}),s&&!Gt(s)&&(s=null)),!s)return null;const a=n(s);return r.set(t,a),a})();a.set(t,s);try{return await s}finally{a.delete(t)}},prune:async function(t){const i=new Set(t.filter(Boolean));for(const[t,e]of r)i.has(t)||(s(e),r.delete(t));try{const t=await e();if(!t)return;const n=(await te(t)).filter(t=>!i.has(t));n.length&&await ee(t,n)}catch{}},release:function(){for(const t of r.values())s(t);r.clear()},evict:async function(t){const e=r.get(t);e&&(s(e),r.delete(t)),a.delete(t),await o(t).catch(()=>{})}}}function Zt(){return new Promise(t=>{if("undefined"==typeof indexedDB)return t(null);let e;try{e=indexedDB.open("tesla-card",1)}catch{return t(null)}e.onupgradeneeded=()=>{const t=e.result;t.objectStoreNames.contains(Vt)||t.createObjectStore(Vt)},e.onsuccess=()=>t(e.result),e.onerror=()=>t(null),e.onblocked=()=>t(null)})}function Gt(t){return!(!t||"number"!=typeof t.size)&&(!(t.size<512)&&("string"==typeof t.type&&t.type.startsWith("image/")))}async function Kt(t){const e=await fetch(t,{mode:"cors",credentials:"omit"});if(!e.ok)throw new Error(`image request failed: ${e.status}`);const i=e.headers?.get?.("content-type")??"";if(!i.startsWith("image/"))throw new Error(`not an image: ${i||"no content-type"}`);return e.blob()}function Xt(t,e,i){return new Promise((n,s)=>{let r;try{r=t.transaction(Vt,e)}catch(t){return s(t)}const a=i(r.objectStore(Vt));r.onabort=()=>s(r.error),r.onerror=()=>s(r.error),a?(a.onsuccess=()=>n(a.result),a.onerror=()=>s(a.error)):r.oncomplete=()=>n()})}const Jt=(t,e)=>Xt(t,"readonly",t=>t.get(e)),Qt=(t,e,i)=>Xt(t,"readwrite",t=>t.put(i,e)),te=t=>Xt(t,"readonly",t=>t.getAllKeys());function ee(t,e){return Xt(t,"readwrite",t=>{for(const i of e)t.delete(i);return null})}const ie=.621371192,ne=1.609344,se={mi:{to:"km",factor:ne},km:{to:"mi",factor:ie}},re={mph:{to:"km/h",factor:ne},"km/h":{to:"mph",factor:ie}},ae="auto",oe="imperial",le=new Set(["mi","mph"]),ce=new Set(["km","km/h"]);function he(t,e,i=ae,n="distance"){const s=function(t){if("string"!=typeof t)return null;const e=t.trim();if(!e)return null;const i=e.toLowerCase();return"mi"===i||"miles"===i||"mile"===i?"mi":"km"===i||"kilometers"===i||"kilometres"===i?"km":"mph"===i||"mi/h"===i?"mph":"km/h"===i||"kph"===i||"kmh"===i?"km/h":e}(e);if(null==t)return{value:null,unit:s};if(i===ae||!s)return{value:t,unit:s};if((i===oe?le:ce).has(s))return{value:t,unit:s};const r=("speed"===n?re:se)[s];return r?{value:t*r.factor,unit:r.to}:{value:t,unit:s}}function de(t,e){if(!e)return null;const i=t?.states?.[e]?.attributes;if(!i)return null;const{latitude:n,longitude:s}=i;return"number"!=typeof n||"number"!=typeof s?null:Number.isFinite(n)&&Number.isFinite(s)?[n,s]:null}const ue=[5,7];function pe(t,e,i,n){if(!t||"function"!=typeof t.polyline)return null;const s=function(t,e){if(!t||!e)return null;const[i,n]=t,[s,r]=e,a=Math.cos((i+s)/2*Math.PI/180)||1,o=(r-n)*a,l=s-i,c=Math.hypot(o,l);if(0===c)return null;const h=Math.atan2(l,o),d=[i+.66*l,n+.66*(r-n)],u=.07*c,p=t=>[d[0]+u*Math.sin(h+Math.PI+t),d[1]+u*Math.cos(h+Math.PI+t)/a];return[p(-.46),d,p(.46)]}(e,i);return s?t.polyline(s,{color:n,weight:1.8,opacity:.75,lineCap:"round",lineJoin:"round",interactive:!1}):null}const me="never",fe="always";function ge(t){return!1===t||t===me?me:t===fe?fe:"navigating"}class _e extends ot{static properties={hass:{attribute:!1},_config:{state:!0},_imageFailed:{state:!0},_trail:{state:!0},_cachedSrc:{state:!0}};static styles=ct;constructor(){super(),this._imageFailed=!1,this._trail=null,this._unsubscribeHistory=null,this._trailFor=null,this._cachedSrc=null,this._cachedFor=null,this._mapLoading=!1,this._leaflet=null,this._bearingLayer=null,this._bearingFor=null,this._retried=new Set,this._images=qt()}setConfig(t){if(void 0!==t.device_id&&"string"!=typeof t.device_id)throw new Error("device_id must be the id of a Tesla Fleet vehicle");this._config={view:"FRONT34",controls:!1,map:"navigating",trail:!0,...t},ft.includes(this._config.view)||(this._config.view="FRONT34"),this._imageFailed=!1}disconnectedCallback(){super.disconnectedCallback(),this._stopHistory(),this._images.release(),this._cachedSrc=null,this._cachedFor=null,this._mapLoading=!1,this._leaflet=null,this._bearingLayer=null,this._bearingFor=null}getCardSize(){return ge(this._config?.map)===fe?8:5}getGridOptions(){return{columns:12,min_columns:6}}static getStubConfig(t){return{device_id:Et(t)[0]??""}}static getConfigForm(){return{schema:[{name:"device_id",required:!0,selector:{device:{filter:{integration:"tesla_fleet"}}}},{type:"grid",name:"",flatten:!0,schema:[{name:"paint",selector:{select:{mode:"dropdown",options:ye}}},{name:"wheels",selector:{select:{mode:"dropdown",options:$e}}}]},{type:"expandable",name:"advanced",title:"More options",flatten:!0,schema:[{type:"grid",name:"",flatten:!0,schema:[{name:"trail",selector:{boolean:{}}},{name:"controls",selector:{boolean:{}}},{name:"performance",selector:{boolean:{}}}]},{name:"view",selector:{select:{mode:"dropdown",options:ft.map(t=>({value:t,label:t}))}}},{name:"map",selector:{select:{mode:"dropdown",options:[{value:"navigating",label:"Only while navigating"},{value:"always",label:"Always"},{value:"never",label:"Never"}]}}},{name:"units",selector:{select:{mode:"dropdown",options:[{value:"auto",label:"Follow Home Assistant"},{value:"imperial",label:"Miles"},{value:"metric",label:"Kilometres"}]}}},{name:"drive_hand",selector:{select:{mode:"dropdown",options:[{value:"auto",label:"From your country setting"},{value:"lhd",label:"Left-hand drive"},{value:"rhd",label:"Right-hand drive"}]}}},{name:"name",selector:{text:{}}},{name:"image",selector:{text:{}}},{name:"options_override",selector:{text:{}}}]}],computeLabel:t=>be[t.name],computeHelper:t=>Ae[t.name]}}render(){if(!this._config||!this.hass)return Y;const t=this._config.device_id,e=t?this.hass.devices?.[t]:null;if(!e)return this._shell("Tesla",Y,F`<div class="notice">
          Choose a vehicle to show. The card reads everything else from the Tesla Fleet integration.
        </div>`);const i=function(t,e){const i={};if(!t?.entities||!e)return i;const n=new Map(Object.entries(St).map(([t,e])=>[e,t]));for(const s of Object.values(t.entities)){if(s.device_id!==e)continue;if(s.platform!==xt)continue;const t=n.get(`${kt(s.entity_id)}:${s.translation_key}`);t&&(i[t]=s.entity_id)}return i}(this.hass,t);this._entities=i;const n=Bt(this.hass,i),s=function(t){if("string"!=typeof t)return null;const e=t.trim().toUpperCase();if(17!==e.length)return null;const i=ht[e[3]];if(!i)return null;const n=dt[e[9]]??null,s=mt(i.model,n);return{vin:e,model:i.model,name:i.name,year:n,generation:s,plant:e[10]??null}}(e.serial_number)??function(t){if("string"!=typeof t)return null;const e=Object.values(ht).find(e=>e.name.toLowerCase()===t.trim().toLowerCase());return e?{vin:null,model:e.model,name:e.name,year:null,generation:mt(e.model,null),plant:null}:null}(e.model)??null,r=this._config.name||e.name_by_user||e.name||s?.name||"Tesla",a=function(t){if(null===t)return null;if(t<1)return"just now";if(t<60)return`${t} min ago`;const e=Math.floor(t/60);if(e<24)return 1===e?"1 hr ago":`${e} hrs ago`;const i=Math.floor(e/24);return 1===i?"1 day ago":`${i} days ago`}(function(t,e=new Date){if(!t)return null;const i=Math.floor((e.getTime()-t.getTime())/6e4);return i<0?0:i}(function(t,e){let i=null;for(const n of Object.values(e)){const e=t?.states?.[n]?.last_updated;if(!e)continue;const s=new Date(e);Number.isNaN(s.getTime())||(!i||s>i)&&(i=s)}return i}(this.hass,i))),o=n.route,l=(c=ge(this._config.map),h=Boolean(o),!(!(null!==de(this.hass,i.location))||c===me)&&(c===fe||h));var c,h;return this._syncHistory(l&&this._config.trail?i.location:null),F`
      <ha-card>
        <div class="head">
          <div class="name">${r}</div>
          ${this._status(n)}
        </div>
        ${this._hero(s,n)}
        <div class="strip">
          ${this._readout(n)} ${a?F`<span class="age">${a}</span>`:Y}
        </div>
        ${this._gauge(n)} ${this._place(n,o)}
        ${l?this._map(i,o):Y}
        ${this._config.controls?this._controls(i,n):Y}
        ${this._notices(s,o)}
      </ha-card>
    `}_shell(t,e,i){return F`<ha-card>
      <div class="head"><div class="name">${t}</div></div>
      ${e}${i}
    </ha-card>`}_status(t){const e={[Tt]:"Asleep",[Ut]:"Charging",[Nt]:"Driving",parked:"Parked"},i=!1===t.locked&&t.status!==Nt,n=["status",t.status,i?"unlocked":""].join(" ");return F`<span class=${n}>
      ${!1===t.locked?zt:Lt}
      <span>${e[t.status]??"Parked"}</span>
    </span>`}_hero(t,e){const i=this._imageSource(t,e);this._syncImage(i);const n=this._cachedFor===i&&this._cachedSrc?this._cachedSrc:i;if(!n)return F`<div class="hero blank">
        ${t?`No configurator artwork for the ${t.name} yet.`:"Waiting for the vehicle to report."}
      </div>`;const s=(r=this._config.view,bt[r]??bt.FRONT34);var r;const a=`aspect-ratio:${s.aspect}`,o=`width:${100*s.width}%;left:${100*s.left}%;top:${100*s.top}%`;return F`<div class="hero ${e.status===Tt?"asleep":""}" style=${a}>
      <img
        src=${n}
        alt=${t?.name??"Tesla"}
        style=${o}
        loading="lazy"
        @error=${()=>this._onImageError(n,i)}
      />
    </div>`}_imageSource(t,e){return this._config.image?this._config.image:this._imageFailed||!t?null:yt(t.model,t.generation)?function({model:t,generation:e=null,paint:i,wheels:n,performance:s=!1,hand:r="lhd",view:a="FRONT34",size:o=1400,optionsOverride:l=null}){const c=vt(t,e);if(!c)return null;let h;if(l)h=l;else{const t=At(c.paints,i)?.code??c.paints[0].code,e=At(c.wheels,n),a=!e||!s&&e.performanceOnly?c.wheels[0].code:e.code,o=[s&&c.performanceTrim?c.performanceTrim:c.trim,t,a,s&&c.performanceInterior?c.performanceInterior:c.interior];"rhd"===r&&o.push("$DRRH"),h=o.join(",")}return`https://static-assets.tesla.com/configurator/compositor?${new URLSearchParams({context:"design_studio_2",model:t,view:a,size:String(o),bkba_opt:"1",overlay:"0",options:h}).toString()}`}({model:t.model,generation:t.generation,paint:this._config.paint??(i=t.model,n=t.generation,vt(i,n)?.paints[0]?.id??null),wheels:this._config.wheels??_t(t.model,t.generation),performance:!0===this._config.performance,hand:this._hand(),view:this._config.view,optionsOverride:this._config.options_override??null}):null;var i,n}_onImageError(t,e){if("retry"===function(t,e,i){return e?t===e||i.has(e)?"give-up":"retry":"give-up"}(t,e,this._retried))return this._retried.add(e),void this._images.evict(e).then(()=>{this._cachedFor===e&&(this._cachedSrc=null,this._images.resolve(e).then(t=>{this._cachedFor===e&&(this._cachedSrc=t)}))});this._imageFailed=!0}_syncImage(t){this._cachedFor!==t&&(this._cachedFor=t,this._cachedSrc=null,this._imageFailed=!1,t&&!this._config.image&&this._images.resolve(t).then(e=>{this._cachedFor===t&&(this._cachedSrc=e,this._images.prune([t]))}))}_cssColor(t,e){try{return getComputedStyle(this).getPropertyValue(t).trim()||e}catch{return e}}_units(){return(t=this._config.units)===oe||"metric"===t?t:ae;var t}_hand(){const t=this._config.drive_hand;return"lhd"===t||"rhd"===t?t:(e=this.hass?.config?.country,"string"!=typeof e?"lhd":pt.has(e.toUpperCase())?"rhd":"lhd");var e}_readout(t){const e=this._units(),i=t.status===Nt&&null!==t.speed,n=he(t.speed,t.speedUnit,e,"speed"),s=he(t.range,t.rangeUnit,e),r=i?n.value:t.battery,a=i?n.unit??"mph":"%",o=null!==s.value?`${Math.round(s.value)} ${s.unit??"mi"} remaining`:null;return F`
      <span class="value"
        >${null===r?"—":Math.round(r)}<span class="unit">${a}</span></span
      >
      ${o?F`<span class="range">${o}</span>`:Y}
    `}_gauge(t){const e=t.battery??0,i=["fill",t.status===Ut?"charging":"",t.status===Tt?"asleep":"",t.status!==Ut&&e<=20?"low":""].join(" "),n=t.chargeLimit;return F`<div class="gauge">
      <div class=${i} style=${`width:${ve(e)}%`}></div>
      ${null!==n&&n>0&&n<100?F`<div
              class="limit"
              style=${`left:${ve(n)}%`}
              title=${`Charge limit ${Math.round(n)}%`}
            ></div>`:Y}
    </div>`}_place(t,e){if(e){const t=function(t,e=new Date){if("string"!=typeof t||!t)return null;const i=new Date(t);if(Number.isNaN(i.getTime()))return null;const n=Math.round((i.getTime()-e.getTime())/6e4);if(n<1)return null;if(n<60)return`${n} min`;const s=Math.floor(n/60),r=n%60;return r?`${s} hr ${r} min`:`${s} hr`}(e.arrival),i=function(t,e=26){if("string"!=typeof t)return null;const i=t.trim().replace(/\s+/g," ");if(!i)return null;if(i.length<=e)return i;const n=i.split(",")[0].trim();return n&&n.length<i.length?n:i}(e.destination),n=i?F`<span class="where" title=${e.destination}>${i}</span>
            ${t?F`<span class="eta">in ${t}</span>`:Y}`:F`<span class="where">${t?`Arriving in ${t}`:"On a route"}</span>`,s=he(e.distance,e.distanceUnit,this._units()),r=[null!==s.value?`${Math.round(s.value)} ${s.unit??"mi"}`:null,e.arrival?`arriving ${this._clock(e.arrival)}`:null].filter(Boolean).join(", ");return F`<div class="place">
        <span class="lead">${n}</span>
        ${r?F`<span class="detail">${r}</span>`:Y}
      </div>`}return t.zone?F`<div class="place">
      <span class="lead zone">${jt}${t.zone}</span>
    </div>`:Y}_map(t,e){if(!customElements.get("ha-map"))return this._loadMapComponent(),Y;const i=[t.location&&{entity_id:t.location,color:this._cssColor("--tc-accent","#03a9f4")},e&&t.route&&{entity_id:t.route,color:this._cssColor("--tc-text","#e1e1e1")}].filter(Boolean),n=[],s=function(t,e=15e5){if(!Array.isArray(t)||t.length<2)return[];const i=t.filter(t=>t?.timestamp instanceof Date&&!Number.isNaN(t.timestamp.getTime())).sort((t,e)=>t.timestamp-e.timestamp);if(i.length<2)return[];let n=0;for(let t=i.length-1;t>0;t--)if(i[t].timestamp-i[t-1].timestamp>e){n=t;break}const s=i.slice(n);return s.length>=2?s:[]}(this._trail??[]);s.length>1&&n.push({points:s,color:this._cssColor("--tc-accent","#03a9f4"),gradualOpacity:.8});const r=e?de(this.hass,t.location):null,a=e?de(this.hass,t.route):null,o=this._cssColor("--tc-dim","#9b9b9b"),l=this._dashedBearing(r,a,o);if(!l){const t=function(t,e,i){if(!t||!e)return null;if(t[0]===e[0]&&t[1]===e[1])return null;const n=new Date;return{points:[{point:t,timestamp:n},{point:e,timestamp:n}],color:i,name:"Direct line to destination"}}(r,a,o);t&&n.push(t)}return F`<ha-map
      .entities=${i}
      .paths=${n}
      .layers=${l??[]}
      .themeMode=${"auto"}
      .autoFit=${!0}
      .zoom=${13}
      .clusterMarkers=${!1}
    ></ha-map>`}_controls(t,e){const i=Mt(this.hass,t.climate),n=i?.attributes?.temperature,s=[t.locked&&{id:"lock",icon:!1===e.locked?zt:Lt,label:!1===e.locked?"Unlocked":"Locked",entity:t.locked,domain:"lock",tone:!1===e.locked?"warn":null},t.chargeSwitch&&{id:"charge",icon:Ft,label:e.status===Ut?"Charging":"Charge",entity:t.chargeSwitch,domain:"switch",tone:e.status===Ut?"ok":null},t.climate&&{id:"climate",icon:It,label:i&&"off"!==i.state?void 0!==n?`${Math.round(n)}°`:"On":"Climate",entity:t.climate,domain:"climate",tone:i&&"off"!==i.state?"on":null},t.sentry&&{id:"sentry",icon:Wt,label:"Sentry",entity:t.sentry,domain:"switch",tone:"on"===Mt(this.hass,t.sentry)?.state?"on":null},t.wake&&{id:"wake",icon:Yt,label:"Wake",entity:t.wake,domain:"button",tone:null}].filter(Boolean);return s.length?F`<div class="controls">
      ${s.map(t=>F`<button
            type="button"
            class=${t.tone?`on ${t.tone}`:""}
            aria-pressed=${t.tone?"true":"false"}
            @click=${e=>this._runAction(e,t)}
          >
            ${t.icon}<span>${t.label}</span>
          </button>`)}
    </div>`:Y}async _runAction(t,e){t.stopPropagation();const i=Mt(this.hass,e.entity);try{if("lock"===e.domain){const t="locked"===i?.state;await this.hass.callService("lock",t?"unlock":"lock",{entity_id:e.entity})}else"button"===e.domain?await this.hass.callService("button","press",{entity_id:e.entity}):await this.hass.callService("homeassistant","toggle",{entity_id:e.entity})}catch(t){this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:`${e.label} failed: ${t?.message??"unknown error"}`},bubbles:!0,composed:!0}))}}_notices(t,e){const i=[];return!t||yt(t.model,t.generation)||this._config.image||i.push(F`Artwork for the ${t.name} is not mapped yet. Set an <code>image</code> URL to
          show your own.`),ge(this._config.map)!==fe||de(this.hass,this._entities?.location)||i.push(F`The map needs a position. Check the <code>Location</code> device tracker on this
          vehicle is enabled and has reported.`),e&&e.destinationEntityMissing&&i.push(F`Enable the <code>Destination</code> entity on this device to see where the car is
          headed by name.`),i.length?F`${i.map(t=>F`<div class="notice">${t}</div>`)}`:Y}_dashedBearing(t,e,i){if(!t||!e||!this._leaflet)return null;const n=`${t}|${e}|${i}`;if(this._bearingFor!==n){this._bearingFor=n;const s=function(t,e,i,n){return t&&"function"==typeof t.polyline&&e&&i?e[0]===i[0]&&e[1]===i[1]?null:t.polyline([e,i],{color:n,weight:2,opacity:.85,dashArray:ue.join(" "),interactive:!1}):null}(this._leaflet,t,e,i),r=s?pe(this._leaflet,t,e,i):null;this._bearingLine=s,this._bearingLayer=[s,r].filter(Boolean)}return this._bearingLayer?.length?this._bearingLayer:null}updated(){if(!this._leaflet){const t=this.shadowRoot?.querySelector("ha-map"),e=t?.Leaflet;return void(e&&(this._leaflet=e,this.requestUpdate()))}const t=this._bearingLine?.getElement?.();t&&!t.dataset.drifting&&(t.dataset.drifting="yes",function(t,e=!1){!t||e||"function"!=typeof t.animate||t.animate([{strokeDashoffset:0},{strokeDashoffset:-12}],{duration:900,iterations:1/0,easing:"linear"})}(t,this._reduceMotion()))}_reduceMotion(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch{return!1}}async _loadMapComponent(){if(!this._mapLoading&&!customElements.get("ha-map")){this._mapLoading=!0;try{const t=await(window.loadCardHelpers?.());await(t?.createCardElement({type:"map",entities:[]})),await customElements.whenDefined("ha-map")}catch{}this.requestUpdate()}}_syncHistory(t){if(this._trailFor===t)return;if(this._trailFor=t,this._stopHistory(),this._trail=null,!t||!this.hass?.connection)return;const e=new Date(Date.now()-72e5).toISOString();this.hass.connection.subscribeMessage(e=>{const i=e?.states?.[t];if(!i)return;const n=i.map(t=>{const e=t.a??t.attributes??{},i=e.latitude,n=e.longitude;if("number"!=typeof i||"number"!=typeof n)return null;const s=t.lu??t.last_updated;return"number"!=typeof s?null:{point:[i,n],timestamp:new Date(1e3*s)}}).filter(Boolean);n.length&&(this._trail=n)},{type:"history/stream",entity_ids:[t],start_time:e,minimal_response:!0,no_attributes:!1}).then(t=>{this._unsubscribeHistory=t}).catch(()=>{this._trail=null})}_stopHistory(){if(this._unsubscribeHistory){try{this._unsubscribeHistory()}catch{}this._unsubscribeHistory=null}}_clock(t){const e=new Date(t);if(Number.isNaN(e.getTime()))return"";try{return e.toLocaleTimeString(this.hass?.locale?.language??void 0,{hour:"2-digit",minute:"2-digit"})}catch{return e.toISOString().slice(11,16)}}}function ve(t){return Math.min(100,Math.max(0,Number(t)||0))}const ye=we(wt("my","juniper").concat(wt("my","legacy"))),$e=we($t("my","juniper",!0).concat($t("my","legacy",!0)));function we(t){const e=new Map;for(const i of t)e.has(i.id)||e.set(i.id,i.name);return[...e].map(([t,e])=>({value:t,label:e}))}const be={device_id:"Vehicle",paint:"Paint",wheels:"Wheels",view:"Angle",map:"Show a map",trail:"Draw where it has been",controls:"Show controls",performance:"Performance model",units:"Distance and speed",drive_hand:"Steering wheel",name:"Name",image:"Image URL",options_override:"Configurator options"},Ae={device_id:"The card reads the model, year and body from this vehicle.",paint:"Not reported by the integration, so pick your colour here.",wheels:"Not reported by the integration, so pick your wheels here.",units:"Home Assistant treats the UK as metric, so set this to miles if you want road units.",map:"Showing it only while navigating keeps the card small the rest of the time.",performance:"Needed before the configurator will render the larger wheels.",image:"Show your own picture instead of the configurator render.",options_override:"Raw option string, for a configuration the dropdowns do not cover."},xe="tesla-fleet-card";customElements.get(xe)||customElements.define(xe,_e),window.customCards=window.customCards||[],window.customCards.some(t=>t.type===xe)||window.customCards.push({type:xe,name:"Tesla Card",description:"Battery, range and status for a vehicle on the Tesla Fleet integration.",preview:!0,documentationURL:"https://github.com/alexluckett/tesla-card"});export{_e as TeslaFleetCard};
