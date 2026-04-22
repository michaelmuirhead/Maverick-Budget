(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();function cT(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var xv={exports:{}},bu={},kv={exports:{}},re={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var oa=Symbol.for("react.element"),dT=Symbol.for("react.portal"),hT=Symbol.for("react.fragment"),fT=Symbol.for("react.strict_mode"),pT=Symbol.for("react.profiler"),gT=Symbol.for("react.provider"),mT=Symbol.for("react.context"),yT=Symbol.for("react.forward_ref"),vT=Symbol.for("react.suspense"),_T=Symbol.for("react.memo"),wT=Symbol.for("react.lazy"),Ag=Symbol.iterator;function ET(t){return t===null||typeof t!="object"?null:(t=Ag&&t[Ag]||t["@@iterator"],typeof t=="function"?t:null)}var Cv={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},bv=Object.assign,Av={};function Ts(t,e,n){this.props=t,this.context=e,this.refs=Av,this.updater=n||Cv}Ts.prototype.isReactComponent={};Ts.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Ts.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Rv(){}Rv.prototype=Ts.prototype;function Uh(t,e,n){this.props=t,this.context=e,this.refs=Av,this.updater=n||Cv}var Bh=Uh.prototype=new Rv;Bh.constructor=Uh;bv(Bh,Ts.prototype);Bh.isPureReactComponent=!0;var Rg=Array.isArray,Pv=Object.prototype.hasOwnProperty,$h={current:null},Dv={key:!0,ref:!0,__self:!0,__source:!0};function Nv(t,e,n){var r,i={},s=null,o=null;if(e!=null)for(r in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)Pv.call(e,r)&&!Dv.hasOwnProperty(r)&&(i[r]=e[r]);var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){for(var u=Array(l),c=0;c<l;c++)u[c]=arguments[c+2];i.children=u}if(t&&t.defaultProps)for(r in l=t.defaultProps,l)i[r]===void 0&&(i[r]=l[r]);return{$$typeof:oa,type:t,key:s,ref:o,props:i,_owner:$h.current}}function TT(t,e){return{$$typeof:oa,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function Wh(t){return typeof t=="object"&&t!==null&&t.$$typeof===oa}function ST(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Pg=/\/+/g;function Ac(t,e){return typeof t=="object"&&t!==null&&t.key!=null?ST(""+t.key):e.toString(36)}function ll(t,e,n,r,i){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case oa:case dT:o=!0}}if(o)return o=t,i=i(o),t=r===""?"."+Ac(o,0):r,Rg(i)?(n="",t!=null&&(n=t.replace(Pg,"$&/")+"/"),ll(i,e,n,"",function(c){return c})):i!=null&&(Wh(i)&&(i=TT(i,n+(!i.key||o&&o.key===i.key?"":(""+i.key).replace(Pg,"$&/")+"/")+t)),e.push(i)),1;if(o=0,r=r===""?".":r+":",Rg(t))for(var l=0;l<t.length;l++){s=t[l];var u=r+Ac(s,l);o+=ll(s,e,n,u,i)}else if(u=ET(t),typeof u=="function")for(t=u.call(t),l=0;!(s=t.next()).done;)s=s.value,u=r+Ac(s,l++),o+=ll(s,e,n,u,i);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function Fa(t,e,n){if(t==null)return t;var r=[],i=0;return ll(t,r,"","",function(s){return e.call(n,s,i++)}),r}function IT(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var It={current:null},ul={transition:null},xT={ReactCurrentDispatcher:It,ReactCurrentBatchConfig:ul,ReactCurrentOwner:$h};function Ov(){throw Error("act(...) is not supported in production builds of React.")}re.Children={map:Fa,forEach:function(t,e,n){Fa(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return Fa(t,function(){e++}),e},toArray:function(t){return Fa(t,function(e){return e})||[]},only:function(t){if(!Wh(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};re.Component=Ts;re.Fragment=hT;re.Profiler=pT;re.PureComponent=Uh;re.StrictMode=fT;re.Suspense=vT;re.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=xT;re.act=Ov;re.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var r=bv({},t.props),i=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=$h.current),e.key!==void 0&&(i=""+e.key),t.type&&t.type.defaultProps)var l=t.type.defaultProps;for(u in e)Pv.call(e,u)&&!Dv.hasOwnProperty(u)&&(r[u]=e[u]===void 0&&l!==void 0?l[u]:e[u])}var u=arguments.length-2;if(u===1)r.children=n;else if(1<u){l=Array(u);for(var c=0;c<u;c++)l[c]=arguments[c+2];r.children=l}return{$$typeof:oa,type:t.type,key:i,ref:s,props:r,_owner:o}};re.createContext=function(t){return t={$$typeof:mT,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:gT,_context:t},t.Consumer=t};re.createElement=Nv;re.createFactory=function(t){var e=Nv.bind(null,t);return e.type=t,e};re.createRef=function(){return{current:null}};re.forwardRef=function(t){return{$$typeof:yT,render:t}};re.isValidElement=Wh;re.lazy=function(t){return{$$typeof:wT,_payload:{_status:-1,_result:t},_init:IT}};re.memo=function(t,e){return{$$typeof:_T,type:t,compare:e===void 0?null:e}};re.startTransition=function(t){var e=ul.transition;ul.transition={};try{t()}finally{ul.transition=e}};re.unstable_act=Ov;re.useCallback=function(t,e){return It.current.useCallback(t,e)};re.useContext=function(t){return It.current.useContext(t)};re.useDebugValue=function(){};re.useDeferredValue=function(t){return It.current.useDeferredValue(t)};re.useEffect=function(t,e){return It.current.useEffect(t,e)};re.useId=function(){return It.current.useId()};re.useImperativeHandle=function(t,e,n){return It.current.useImperativeHandle(t,e,n)};re.useInsertionEffect=function(t,e){return It.current.useInsertionEffect(t,e)};re.useLayoutEffect=function(t,e){return It.current.useLayoutEffect(t,e)};re.useMemo=function(t,e){return It.current.useMemo(t,e)};re.useReducer=function(t,e,n){return It.current.useReducer(t,e,n)};re.useRef=function(t){return It.current.useRef(t)};re.useState=function(t){return It.current.useState(t)};re.useSyncExternalStore=function(t,e,n){return It.current.useSyncExternalStore(t,e,n)};re.useTransition=function(){return It.current.useTransition()};re.version="18.3.1";kv.exports=re;var z=kv.exports;const kT=cT(z);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var CT=z,bT=Symbol.for("react.element"),AT=Symbol.for("react.fragment"),RT=Object.prototype.hasOwnProperty,PT=CT.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,DT={key:!0,ref:!0,__self:!0,__source:!0};function Vv(t,e,n){var r,i={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(r in e)RT.call(e,r)&&!DT.hasOwnProperty(r)&&(i[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)i[r]===void 0&&(i[r]=e[r]);return{$$typeof:bT,type:t,key:s,ref:o,props:i,_owner:PT.current}}bu.Fragment=AT;bu.jsx=Vv;bu.jsxs=Vv;xv.exports=bu;var h=xv.exports,vd={},Mv={exports:{}},Ft={},Lv={exports:{}},jv={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(B,G){var K=B.length;B.push(G);e:for(;0<K;){var fe=K-1>>>1,de=B[fe];if(0<i(de,G))B[fe]=G,B[K]=de,K=fe;else break e}}function n(B){return B.length===0?null:B[0]}function r(B){if(B.length===0)return null;var G=B[0],K=B.pop();if(K!==G){B[0]=K;e:for(var fe=0,de=B.length,ge=de>>>1;fe<ge;){var ve=2*(fe+1)-1,qe=B[ve],Ye=ve+1,ot=B[Ye];if(0>i(qe,K))Ye<de&&0>i(ot,qe)?(B[fe]=ot,B[Ye]=K,fe=Ye):(B[fe]=qe,B[ve]=K,fe=ve);else if(Ye<de&&0>i(ot,K))B[fe]=ot,B[Ye]=K,fe=Ye;else break e}}return G}function i(B,G){var K=B.sortIndex-G.sortIndex;return K!==0?K:B.id-G.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,l=o.now();t.unstable_now=function(){return o.now()-l}}var u=[],c=[],f=1,m=null,g=3,_=!1,b=!1,x=!1,O=typeof setTimeout=="function"?setTimeout:null,k=typeof clearTimeout=="function"?clearTimeout:null,E=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function A(B){for(var G=n(c);G!==null;){if(G.callback===null)r(c);else if(G.startTime<=B)r(c),G.sortIndex=G.expirationTime,e(u,G);else break;G=n(c)}}function V(B){if(x=!1,A(B),!b)if(n(u)!==null)b=!0,Oe(F);else{var G=n(c);G!==null&&Q(V,G.startTime-B)}}function F(B,G){b=!1,x&&(x=!1,k(v),v=-1),_=!0;var K=g;try{for(A(G),m=n(u);m!==null&&(!(m.expirationTime>G)||B&&!P());){var fe=m.callback;if(typeof fe=="function"){m.callback=null,g=m.priorityLevel;var de=fe(m.expirationTime<=G);G=t.unstable_now(),typeof de=="function"?m.callback=de:m===n(u)&&r(u),A(G)}else r(u);m=n(u)}if(m!==null)var ge=!0;else{var ve=n(c);ve!==null&&Q(V,ve.startTime-G),ge=!1}return ge}finally{m=null,g=K,_=!1}}var D=!1,S=null,v=-1,T=5,C=-1;function P(){return!(t.unstable_now()-C<T)}function R(){if(S!==null){var B=t.unstable_now();C=B;var G=!0;try{G=S(!0,B)}finally{G?w():(D=!1,S=null)}}else D=!1}var w;if(typeof E=="function")w=function(){E(R)};else if(typeof MessageChannel<"u"){var ae=new MessageChannel,ce=ae.port2;ae.port1.onmessage=R,w=function(){ce.postMessage(null)}}else w=function(){O(R,0)};function Oe(B){S=B,D||(D=!0,w())}function Q(B,G){v=O(function(){B(t.unstable_now())},G)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(B){B.callback=null},t.unstable_continueExecution=function(){b||_||(b=!0,Oe(F))},t.unstable_forceFrameRate=function(B){0>B||125<B?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):T=0<B?Math.floor(1e3/B):5},t.unstable_getCurrentPriorityLevel=function(){return g},t.unstable_getFirstCallbackNode=function(){return n(u)},t.unstable_next=function(B){switch(g){case 1:case 2:case 3:var G=3;break;default:G=g}var K=g;g=G;try{return B()}finally{g=K}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(B,G){switch(B){case 1:case 2:case 3:case 4:case 5:break;default:B=3}var K=g;g=B;try{return G()}finally{g=K}},t.unstable_scheduleCallback=function(B,G,K){var fe=t.unstable_now();switch(typeof K=="object"&&K!==null?(K=K.delay,K=typeof K=="number"&&0<K?fe+K:fe):K=fe,B){case 1:var de=-1;break;case 2:de=250;break;case 5:de=1073741823;break;case 4:de=1e4;break;default:de=5e3}return de=K+de,B={id:f++,callback:G,priorityLevel:B,startTime:K,expirationTime:de,sortIndex:-1},K>fe?(B.sortIndex=K,e(c,B),n(u)===null&&B===n(c)&&(x?(k(v),v=-1):x=!0,Q(V,K-fe))):(B.sortIndex=de,e(u,B),b||_||(b=!0,Oe(F))),B},t.unstable_shouldYield=P,t.unstable_wrapCallback=function(B){var G=g;return function(){var K=g;g=G;try{return B.apply(this,arguments)}finally{g=K}}}})(jv);Lv.exports=jv;var NT=Lv.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var OT=z,jt=NT;function $(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Fv=new Set,Po={};function _i(t,e){ls(t,e),ls(t+"Capture",e)}function ls(t,e){for(Po[t]=e,t=0;t<e.length;t++)Fv.add(e[t])}var qn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),_d=Object.prototype.hasOwnProperty,VT=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Dg={},Ng={};function MT(t){return _d.call(Ng,t)?!0:_d.call(Dg,t)?!1:VT.test(t)?Ng[t]=!0:(Dg[t]=!0,!1)}function LT(t,e,n,r){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function jT(t,e,n,r){if(e===null||typeof e>"u"||LT(t,e,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function xt(t,e,n,r,i,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var rt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){rt[t]=new xt(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];rt[e]=new xt(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){rt[t]=new xt(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){rt[t]=new xt(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){rt[t]=new xt(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){rt[t]=new xt(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){rt[t]=new xt(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){rt[t]=new xt(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){rt[t]=new xt(t,5,!1,t.toLowerCase(),null,!1,!1)});var Hh=/[\-:]([a-z])/g;function qh(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(Hh,qh);rt[e]=new xt(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(Hh,qh);rt[e]=new xt(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(Hh,qh);rt[e]=new xt(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){rt[t]=new xt(t,1,!1,t.toLowerCase(),null,!1,!1)});rt.xlinkHref=new xt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){rt[t]=new xt(t,1,!1,t.toLowerCase(),null,!0,!0)});function Kh(t,e,n,r){var i=rt.hasOwnProperty(e)?rt[e]:null;(i!==null?i.type!==0:r||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(jT(e,n,i,r)&&(n=null),r||i===null?MT(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):i.mustUseProperty?t[i.propertyName]=n===null?i.type===3?!1:"":n:(e=i.attributeName,r=i.attributeNamespace,n===null?t.removeAttribute(e):(i=i.type,n=i===3||i===4&&n===!0?"":""+n,r?t.setAttributeNS(r,e,n):t.setAttribute(e,n))))}var er=OT.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,za=Symbol.for("react.element"),Mi=Symbol.for("react.portal"),Li=Symbol.for("react.fragment"),Gh=Symbol.for("react.strict_mode"),wd=Symbol.for("react.profiler"),zv=Symbol.for("react.provider"),Uv=Symbol.for("react.context"),Qh=Symbol.for("react.forward_ref"),Ed=Symbol.for("react.suspense"),Td=Symbol.for("react.suspense_list"),Yh=Symbol.for("react.memo"),or=Symbol.for("react.lazy"),Bv=Symbol.for("react.offscreen"),Og=Symbol.iterator;function Ys(t){return t===null||typeof t!="object"?null:(t=Og&&t[Og]||t["@@iterator"],typeof t=="function"?t:null)}var Re=Object.assign,Rc;function io(t){if(Rc===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Rc=e&&e[1]||""}return`
`+Rc+t}var Pc=!1;function Dc(t,e){if(!t||Pc)return"";Pc=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var r=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){r=c}t.call(e.prototype)}else{try{throw Error()}catch(c){r=c}t()}}catch(c){if(c&&r&&typeof c.stack=="string"){for(var i=c.stack.split(`
`),s=r.stack.split(`
`),o=i.length-1,l=s.length-1;1<=o&&0<=l&&i[o]!==s[l];)l--;for(;1<=o&&0<=l;o--,l--)if(i[o]!==s[l]){if(o!==1||l!==1)do if(o--,l--,0>l||i[o]!==s[l]){var u=`
`+i[o].replace(" at new "," at ");return t.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",t.displayName)),u}while(1<=o&&0<=l);break}}}finally{Pc=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?io(t):""}function FT(t){switch(t.tag){case 5:return io(t.type);case 16:return io("Lazy");case 13:return io("Suspense");case 19:return io("SuspenseList");case 0:case 2:case 15:return t=Dc(t.type,!1),t;case 11:return t=Dc(t.type.render,!1),t;case 1:return t=Dc(t.type,!0),t;default:return""}}function Sd(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case Li:return"Fragment";case Mi:return"Portal";case wd:return"Profiler";case Gh:return"StrictMode";case Ed:return"Suspense";case Td:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case Uv:return(t.displayName||"Context")+".Consumer";case zv:return(t._context.displayName||"Context")+".Provider";case Qh:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Yh:return e=t.displayName||null,e!==null?e:Sd(t.type)||"Memo";case or:e=t._payload,t=t._init;try{return Sd(t(e))}catch{}}return null}function zT(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Sd(e);case 8:return e===Gh?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function br(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function $v(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function UT(t){var e=$v(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),r=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var i=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return i.call(this)},set:function(o){r=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Ua(t){t._valueTracker||(t._valueTracker=UT(t))}function Wv(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),r="";return t&&(r=$v(t)?t.checked?"true":"false":t.value),t=r,t!==n?(e.setValue(t),!0):!1}function Nl(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Id(t,e){var n=e.checked;return Re({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Vg(t,e){var n=e.defaultValue==null?"":e.defaultValue,r=e.checked!=null?e.checked:e.defaultChecked;n=br(e.value!=null?e.value:n),t._wrapperState={initialChecked:r,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Hv(t,e){e=e.checked,e!=null&&Kh(t,"checked",e,!1)}function xd(t,e){Hv(t,e);var n=br(e.value),r=e.type;if(n!=null)r==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(r==="submit"||r==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?kd(t,e.type,n):e.hasOwnProperty("defaultValue")&&kd(t,e.type,br(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Mg(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var r=e.type;if(!(r!=="submit"&&r!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function kd(t,e,n){(e!=="number"||Nl(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var so=Array.isArray;function Gi(t,e,n,r){if(t=t.options,e){e={};for(var i=0;i<n.length;i++)e["$"+n[i]]=!0;for(n=0;n<t.length;n++)i=e.hasOwnProperty("$"+t[n].value),t[n].selected!==i&&(t[n].selected=i),i&&r&&(t[n].defaultSelected=!0)}else{for(n=""+br(n),e=null,i=0;i<t.length;i++){if(t[i].value===n){t[i].selected=!0,r&&(t[i].defaultSelected=!0);return}e!==null||t[i].disabled||(e=t[i])}e!==null&&(e.selected=!0)}}function Cd(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error($(91));return Re({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Lg(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error($(92));if(so(n)){if(1<n.length)throw Error($(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:br(n)}}function qv(t,e){var n=br(e.value),r=br(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),r!=null&&(t.defaultValue=""+r)}function jg(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function Kv(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function bd(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?Kv(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Ba,Gv=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,r,i){MSApp.execUnsafeLocalFunction(function(){return t(e,n,r,i)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(Ba=Ba||document.createElement("div"),Ba.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Ba.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Do(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var mo={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},BT=["Webkit","ms","Moz","O"];Object.keys(mo).forEach(function(t){BT.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),mo[e]=mo[t]})});function Qv(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||mo.hasOwnProperty(t)&&mo[t]?(""+e).trim():e+"px"}function Yv(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var r=n.indexOf("--")===0,i=Qv(n,e[n],r);n==="float"&&(n="cssFloat"),r?t.setProperty(n,i):t[n]=i}}var $T=Re({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ad(t,e){if(e){if($T[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error($(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error($(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error($(61))}if(e.style!=null&&typeof e.style!="object")throw Error($(62))}}function Rd(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Pd=null;function Xh(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Dd=null,Qi=null,Yi=null;function Fg(t){if(t=ua(t)){if(typeof Dd!="function")throw Error($(280));var e=t.stateNode;e&&(e=Nu(e),Dd(t.stateNode,t.type,e))}}function Xv(t){Qi?Yi?Yi.push(t):Yi=[t]:Qi=t}function Jv(){if(Qi){var t=Qi,e=Yi;if(Yi=Qi=null,Fg(t),e)for(t=0;t<e.length;t++)Fg(e[t])}}function Zv(t,e){return t(e)}function e0(){}var Nc=!1;function t0(t,e,n){if(Nc)return t(e,n);Nc=!0;try{return Zv(t,e,n)}finally{Nc=!1,(Qi!==null||Yi!==null)&&(e0(),Jv())}}function No(t,e){var n=t.stateNode;if(n===null)return null;var r=Nu(n);if(r===null)return null;n=r[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(t=t.type,r=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!r;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error($(231,e,typeof n));return n}var Nd=!1;if(qn)try{var Xs={};Object.defineProperty(Xs,"passive",{get:function(){Nd=!0}}),window.addEventListener("test",Xs,Xs),window.removeEventListener("test",Xs,Xs)}catch{Nd=!1}function WT(t,e,n,r,i,s,o,l,u){var c=Array.prototype.slice.call(arguments,3);try{e.apply(n,c)}catch(f){this.onError(f)}}var yo=!1,Ol=null,Vl=!1,Od=null,HT={onError:function(t){yo=!0,Ol=t}};function qT(t,e,n,r,i,s,o,l,u){yo=!1,Ol=null,WT.apply(HT,arguments)}function KT(t,e,n,r,i,s,o,l,u){if(qT.apply(this,arguments),yo){if(yo){var c=Ol;yo=!1,Ol=null}else throw Error($(198));Vl||(Vl=!0,Od=c)}}function wi(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function n0(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function zg(t){if(wi(t)!==t)throw Error($(188))}function GT(t){var e=t.alternate;if(!e){if(e=wi(t),e===null)throw Error($(188));return e!==t?null:t}for(var n=t,r=e;;){var i=n.return;if(i===null)break;var s=i.alternate;if(s===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===s.child){for(s=i.child;s;){if(s===n)return zg(i),t;if(s===r)return zg(i),e;s=s.sibling}throw Error($(188))}if(n.return!==r.return)n=i,r=s;else{for(var o=!1,l=i.child;l;){if(l===n){o=!0,n=i,r=s;break}if(l===r){o=!0,r=i,n=s;break}l=l.sibling}if(!o){for(l=s.child;l;){if(l===n){o=!0,n=s,r=i;break}if(l===r){o=!0,r=s,n=i;break}l=l.sibling}if(!o)throw Error($(189))}}if(n.alternate!==r)throw Error($(190))}if(n.tag!==3)throw Error($(188));return n.stateNode.current===n?t:e}function r0(t){return t=GT(t),t!==null?i0(t):null}function i0(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=i0(t);if(e!==null)return e;t=t.sibling}return null}var s0=jt.unstable_scheduleCallback,Ug=jt.unstable_cancelCallback,QT=jt.unstable_shouldYield,YT=jt.unstable_requestPaint,Le=jt.unstable_now,XT=jt.unstable_getCurrentPriorityLevel,Jh=jt.unstable_ImmediatePriority,o0=jt.unstable_UserBlockingPriority,Ml=jt.unstable_NormalPriority,JT=jt.unstable_LowPriority,a0=jt.unstable_IdlePriority,Au=null,vn=null;function ZT(t){if(vn&&typeof vn.onCommitFiberRoot=="function")try{vn.onCommitFiberRoot(Au,t,void 0,(t.current.flags&128)===128)}catch{}}var ln=Math.clz32?Math.clz32:nS,eS=Math.log,tS=Math.LN2;function nS(t){return t>>>=0,t===0?32:31-(eS(t)/tS|0)|0}var $a=64,Wa=4194304;function oo(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Ll(t,e){var n=t.pendingLanes;if(n===0)return 0;var r=0,i=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var l=o&~i;l!==0?r=oo(l):(s&=o,s!==0&&(r=oo(s)))}else o=n&~i,o!==0?r=oo(o):s!==0&&(r=oo(s));if(r===0)return 0;if(e!==0&&e!==r&&!(e&i)&&(i=r&-r,s=e&-e,i>=s||i===16&&(s&4194240)!==0))return e;if(r&4&&(r|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=r;0<e;)n=31-ln(e),i=1<<n,r|=t[n],e&=~i;return r}function rS(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function iS(t,e){for(var n=t.suspendedLanes,r=t.pingedLanes,i=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-ln(s),l=1<<o,u=i[o];u===-1?(!(l&n)||l&r)&&(i[o]=rS(l,e)):u<=e&&(t.expiredLanes|=l),s&=~l}}function Vd(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function l0(){var t=$a;return $a<<=1,!($a&4194240)&&($a=64),t}function Oc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function aa(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-ln(e),t[e]=n}function sS(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var r=t.eventTimes;for(t=t.expirationTimes;0<n;){var i=31-ln(n),s=1<<i;e[i]=0,r[i]=-1,t[i]=-1,n&=~s}}function Zh(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var r=31-ln(n),i=1<<r;i&e|t[r]&e&&(t[r]|=e),n&=~i}}var ye=0;function u0(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var c0,ef,d0,h0,f0,Md=!1,Ha=[],yr=null,vr=null,_r=null,Oo=new Map,Vo=new Map,lr=[],oS="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Bg(t,e){switch(t){case"focusin":case"focusout":yr=null;break;case"dragenter":case"dragleave":vr=null;break;case"mouseover":case"mouseout":_r=null;break;case"pointerover":case"pointerout":Oo.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Vo.delete(e.pointerId)}}function Js(t,e,n,r,i,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:r,nativeEvent:s,targetContainers:[i]},e!==null&&(e=ua(e),e!==null&&ef(e)),t):(t.eventSystemFlags|=r,e=t.targetContainers,i!==null&&e.indexOf(i)===-1&&e.push(i),t)}function aS(t,e,n,r,i){switch(e){case"focusin":return yr=Js(yr,t,e,n,r,i),!0;case"dragenter":return vr=Js(vr,t,e,n,r,i),!0;case"mouseover":return _r=Js(_r,t,e,n,r,i),!0;case"pointerover":var s=i.pointerId;return Oo.set(s,Js(Oo.get(s)||null,t,e,n,r,i)),!0;case"gotpointercapture":return s=i.pointerId,Vo.set(s,Js(Vo.get(s)||null,t,e,n,r,i)),!0}return!1}function p0(t){var e=Jr(t.target);if(e!==null){var n=wi(e);if(n!==null){if(e=n.tag,e===13){if(e=n0(n),e!==null){t.blockedOn=e,f0(t.priority,function(){d0(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function cl(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=Ld(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var r=new n.constructor(n.type,n);Pd=r,n.target.dispatchEvent(r),Pd=null}else return e=ua(n),e!==null&&ef(e),t.blockedOn=n,!1;e.shift()}return!0}function $g(t,e,n){cl(t)&&n.delete(e)}function lS(){Md=!1,yr!==null&&cl(yr)&&(yr=null),vr!==null&&cl(vr)&&(vr=null),_r!==null&&cl(_r)&&(_r=null),Oo.forEach($g),Vo.forEach($g)}function Zs(t,e){t.blockedOn===e&&(t.blockedOn=null,Md||(Md=!0,jt.unstable_scheduleCallback(jt.unstable_NormalPriority,lS)))}function Mo(t){function e(i){return Zs(i,t)}if(0<Ha.length){Zs(Ha[0],t);for(var n=1;n<Ha.length;n++){var r=Ha[n];r.blockedOn===t&&(r.blockedOn=null)}}for(yr!==null&&Zs(yr,t),vr!==null&&Zs(vr,t),_r!==null&&Zs(_r,t),Oo.forEach(e),Vo.forEach(e),n=0;n<lr.length;n++)r=lr[n],r.blockedOn===t&&(r.blockedOn=null);for(;0<lr.length&&(n=lr[0],n.blockedOn===null);)p0(n),n.blockedOn===null&&lr.shift()}var Xi=er.ReactCurrentBatchConfig,jl=!0;function uS(t,e,n,r){var i=ye,s=Xi.transition;Xi.transition=null;try{ye=1,tf(t,e,n,r)}finally{ye=i,Xi.transition=s}}function cS(t,e,n,r){var i=ye,s=Xi.transition;Xi.transition=null;try{ye=4,tf(t,e,n,r)}finally{ye=i,Xi.transition=s}}function tf(t,e,n,r){if(jl){var i=Ld(t,e,n,r);if(i===null)Wc(t,e,r,Fl,n),Bg(t,r);else if(aS(i,t,e,n,r))r.stopPropagation();else if(Bg(t,r),e&4&&-1<oS.indexOf(t)){for(;i!==null;){var s=ua(i);if(s!==null&&c0(s),s=Ld(t,e,n,r),s===null&&Wc(t,e,r,Fl,n),s===i)break;i=s}i!==null&&r.stopPropagation()}else Wc(t,e,r,null,n)}}var Fl=null;function Ld(t,e,n,r){if(Fl=null,t=Xh(r),t=Jr(t),t!==null)if(e=wi(t),e===null)t=null;else if(n=e.tag,n===13){if(t=n0(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return Fl=t,null}function g0(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(XT()){case Jh:return 1;case o0:return 4;case Ml:case JT:return 16;case a0:return 536870912;default:return 16}default:return 16}}var pr=null,nf=null,dl=null;function m0(){if(dl)return dl;var t,e=nf,n=e.length,r,i="value"in pr?pr.value:pr.textContent,s=i.length;for(t=0;t<n&&e[t]===i[t];t++);var o=n-t;for(r=1;r<=o&&e[n-r]===i[s-r];r++);return dl=i.slice(t,1<r?1-r:void 0)}function hl(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function qa(){return!0}function Wg(){return!1}function zt(t){function e(n,r,i,s,o){this._reactName=n,this._targetInst=i,this.type=r,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var l in t)t.hasOwnProperty(l)&&(n=t[l],this[l]=n?n(s):s[l]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?qa:Wg,this.isPropagationStopped=Wg,this}return Re(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=qa)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=qa)},persist:function(){},isPersistent:qa}),e}var Ss={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},rf=zt(Ss),la=Re({},Ss,{view:0,detail:0}),dS=zt(la),Vc,Mc,eo,Ru=Re({},la,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:sf,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==eo&&(eo&&t.type==="mousemove"?(Vc=t.screenX-eo.screenX,Mc=t.screenY-eo.screenY):Mc=Vc=0,eo=t),Vc)},movementY:function(t){return"movementY"in t?t.movementY:Mc}}),Hg=zt(Ru),hS=Re({},Ru,{dataTransfer:0}),fS=zt(hS),pS=Re({},la,{relatedTarget:0}),Lc=zt(pS),gS=Re({},Ss,{animationName:0,elapsedTime:0,pseudoElement:0}),mS=zt(gS),yS=Re({},Ss,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),vS=zt(yS),_S=Re({},Ss,{data:0}),qg=zt(_S),wS={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},ES={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},TS={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function SS(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=TS[t])?!!e[t]:!1}function sf(){return SS}var IS=Re({},la,{key:function(t){if(t.key){var e=wS[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=hl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?ES[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:sf,charCode:function(t){return t.type==="keypress"?hl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?hl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),xS=zt(IS),kS=Re({},Ru,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Kg=zt(kS),CS=Re({},la,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:sf}),bS=zt(CS),AS=Re({},Ss,{propertyName:0,elapsedTime:0,pseudoElement:0}),RS=zt(AS),PS=Re({},Ru,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),DS=zt(PS),NS=[9,13,27,32],of=qn&&"CompositionEvent"in window,vo=null;qn&&"documentMode"in document&&(vo=document.documentMode);var OS=qn&&"TextEvent"in window&&!vo,y0=qn&&(!of||vo&&8<vo&&11>=vo),Gg=" ",Qg=!1;function v0(t,e){switch(t){case"keyup":return NS.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function _0(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var ji=!1;function VS(t,e){switch(t){case"compositionend":return _0(e);case"keypress":return e.which!==32?null:(Qg=!0,Gg);case"textInput":return t=e.data,t===Gg&&Qg?null:t;default:return null}}function MS(t,e){if(ji)return t==="compositionend"||!of&&v0(t,e)?(t=m0(),dl=nf=pr=null,ji=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return y0&&e.locale!=="ko"?null:e.data;default:return null}}var LS={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Yg(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!LS[t.type]:e==="textarea"}function w0(t,e,n,r){Xv(r),e=zl(e,"onChange"),0<e.length&&(n=new rf("onChange","change",null,n,r),t.push({event:n,listeners:e}))}var _o=null,Lo=null;function jS(t){P0(t,0)}function Pu(t){var e=Ui(t);if(Wv(e))return t}function FS(t,e){if(t==="change")return e}var E0=!1;if(qn){var jc;if(qn){var Fc="oninput"in document;if(!Fc){var Xg=document.createElement("div");Xg.setAttribute("oninput","return;"),Fc=typeof Xg.oninput=="function"}jc=Fc}else jc=!1;E0=jc&&(!document.documentMode||9<document.documentMode)}function Jg(){_o&&(_o.detachEvent("onpropertychange",T0),Lo=_o=null)}function T0(t){if(t.propertyName==="value"&&Pu(Lo)){var e=[];w0(e,Lo,t,Xh(t)),t0(jS,e)}}function zS(t,e,n){t==="focusin"?(Jg(),_o=e,Lo=n,_o.attachEvent("onpropertychange",T0)):t==="focusout"&&Jg()}function US(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Pu(Lo)}function BS(t,e){if(t==="click")return Pu(e)}function $S(t,e){if(t==="input"||t==="change")return Pu(e)}function WS(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var dn=typeof Object.is=="function"?Object.is:WS;function jo(t,e){if(dn(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),r=Object.keys(e);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!_d.call(e,i)||!dn(t[i],e[i]))return!1}return!0}function Zg(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function em(t,e){var n=Zg(t);t=0;for(var r;n;){if(n.nodeType===3){if(r=t+n.textContent.length,t<=e&&r>=e)return{node:n,offset:e-t};t=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Zg(n)}}function S0(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?S0(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function I0(){for(var t=window,e=Nl();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=Nl(t.document)}return e}function af(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function HS(t){var e=I0(),n=t.focusedElem,r=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&S0(n.ownerDocument.documentElement,n)){if(r!==null&&af(n)){if(e=r.start,t=r.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var i=n.textContent.length,s=Math.min(r.start,i);r=r.end===void 0?s:Math.min(r.end,i),!t.extend&&s>r&&(i=r,r=s,s=i),i=em(n,s);var o=em(n,r);i&&o&&(t.rangeCount!==1||t.anchorNode!==i.node||t.anchorOffset!==i.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(i.node,i.offset),t.removeAllRanges(),s>r?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var qS=qn&&"documentMode"in document&&11>=document.documentMode,Fi=null,jd=null,wo=null,Fd=!1;function tm(t,e,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Fd||Fi==null||Fi!==Nl(r)||(r=Fi,"selectionStart"in r&&af(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),wo&&jo(wo,r)||(wo=r,r=zl(jd,"onSelect"),0<r.length&&(e=new rf("onSelect","select",null,e,n),t.push({event:e,listeners:r}),e.target=Fi)))}function Ka(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var zi={animationend:Ka("Animation","AnimationEnd"),animationiteration:Ka("Animation","AnimationIteration"),animationstart:Ka("Animation","AnimationStart"),transitionend:Ka("Transition","TransitionEnd")},zc={},x0={};qn&&(x0=document.createElement("div").style,"AnimationEvent"in window||(delete zi.animationend.animation,delete zi.animationiteration.animation,delete zi.animationstart.animation),"TransitionEvent"in window||delete zi.transitionend.transition);function Du(t){if(zc[t])return zc[t];if(!zi[t])return t;var e=zi[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in x0)return zc[t]=e[n];return t}var k0=Du("animationend"),C0=Du("animationiteration"),b0=Du("animationstart"),A0=Du("transitionend"),R0=new Map,nm="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Lr(t,e){R0.set(t,e),_i(e,[t])}for(var Uc=0;Uc<nm.length;Uc++){var Bc=nm[Uc],KS=Bc.toLowerCase(),GS=Bc[0].toUpperCase()+Bc.slice(1);Lr(KS,"on"+GS)}Lr(k0,"onAnimationEnd");Lr(C0,"onAnimationIteration");Lr(b0,"onAnimationStart");Lr("dblclick","onDoubleClick");Lr("focusin","onFocus");Lr("focusout","onBlur");Lr(A0,"onTransitionEnd");ls("onMouseEnter",["mouseout","mouseover"]);ls("onMouseLeave",["mouseout","mouseover"]);ls("onPointerEnter",["pointerout","pointerover"]);ls("onPointerLeave",["pointerout","pointerover"]);_i("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));_i("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));_i("onBeforeInput",["compositionend","keypress","textInput","paste"]);_i("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));_i("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));_i("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ao="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),QS=new Set("cancel close invalid load scroll toggle".split(" ").concat(ao));function rm(t,e,n){var r=t.type||"unknown-event";t.currentTarget=n,KT(r,e,void 0,t),t.currentTarget=null}function P0(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var r=t[n],i=r.event;r=r.listeners;e:{var s=void 0;if(e)for(var o=r.length-1;0<=o;o--){var l=r[o],u=l.instance,c=l.currentTarget;if(l=l.listener,u!==s&&i.isPropagationStopped())break e;rm(i,l,c),s=u}else for(o=0;o<r.length;o++){if(l=r[o],u=l.instance,c=l.currentTarget,l=l.listener,u!==s&&i.isPropagationStopped())break e;rm(i,l,c),s=u}}}if(Vl)throw t=Od,Vl=!1,Od=null,t}function Te(t,e){var n=e[Wd];n===void 0&&(n=e[Wd]=new Set);var r=t+"__bubble";n.has(r)||(D0(e,t,2,!1),n.add(r))}function $c(t,e,n){var r=0;e&&(r|=4),D0(n,t,r,e)}var Ga="_reactListening"+Math.random().toString(36).slice(2);function Fo(t){if(!t[Ga]){t[Ga]=!0,Fv.forEach(function(n){n!=="selectionchange"&&(QS.has(n)||$c(n,!1,t),$c(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Ga]||(e[Ga]=!0,$c("selectionchange",!1,e))}}function D0(t,e,n,r){switch(g0(e)){case 1:var i=uS;break;case 4:i=cS;break;default:i=tf}n=i.bind(null,e,n,t),i=void 0,!Nd||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(i=!0),r?i!==void 0?t.addEventListener(e,n,{capture:!0,passive:i}):t.addEventListener(e,n,!0):i!==void 0?t.addEventListener(e,n,{passive:i}):t.addEventListener(e,n,!1)}function Wc(t,e,n,r,i){var s=r;if(!(e&1)&&!(e&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var l=r.stateNode.containerInfo;if(l===i||l.nodeType===8&&l.parentNode===i)break;if(o===4)for(o=r.return;o!==null;){var u=o.tag;if((u===3||u===4)&&(u=o.stateNode.containerInfo,u===i||u.nodeType===8&&u.parentNode===i))return;o=o.return}for(;l!==null;){if(o=Jr(l),o===null)return;if(u=o.tag,u===5||u===6){r=s=o;continue e}l=l.parentNode}}r=r.return}t0(function(){var c=s,f=Xh(n),m=[];e:{var g=R0.get(t);if(g!==void 0){var _=rf,b=t;switch(t){case"keypress":if(hl(n)===0)break e;case"keydown":case"keyup":_=xS;break;case"focusin":b="focus",_=Lc;break;case"focusout":b="blur",_=Lc;break;case"beforeblur":case"afterblur":_=Lc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":_=Hg;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":_=fS;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":_=bS;break;case k0:case C0:case b0:_=mS;break;case A0:_=RS;break;case"scroll":_=dS;break;case"wheel":_=DS;break;case"copy":case"cut":case"paste":_=vS;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":_=Kg}var x=(e&4)!==0,O=!x&&t==="scroll",k=x?g!==null?g+"Capture":null:g;x=[];for(var E=c,A;E!==null;){A=E;var V=A.stateNode;if(A.tag===5&&V!==null&&(A=V,k!==null&&(V=No(E,k),V!=null&&x.push(zo(E,V,A)))),O)break;E=E.return}0<x.length&&(g=new _(g,b,null,n,f),m.push({event:g,listeners:x}))}}if(!(e&7)){e:{if(g=t==="mouseover"||t==="pointerover",_=t==="mouseout"||t==="pointerout",g&&n!==Pd&&(b=n.relatedTarget||n.fromElement)&&(Jr(b)||b[Kn]))break e;if((_||g)&&(g=f.window===f?f:(g=f.ownerDocument)?g.defaultView||g.parentWindow:window,_?(b=n.relatedTarget||n.toElement,_=c,b=b?Jr(b):null,b!==null&&(O=wi(b),b!==O||b.tag!==5&&b.tag!==6)&&(b=null)):(_=null,b=c),_!==b)){if(x=Hg,V="onMouseLeave",k="onMouseEnter",E="mouse",(t==="pointerout"||t==="pointerover")&&(x=Kg,V="onPointerLeave",k="onPointerEnter",E="pointer"),O=_==null?g:Ui(_),A=b==null?g:Ui(b),g=new x(V,E+"leave",_,n,f),g.target=O,g.relatedTarget=A,V=null,Jr(f)===c&&(x=new x(k,E+"enter",b,n,f),x.target=A,x.relatedTarget=O,V=x),O=V,_&&b)t:{for(x=_,k=b,E=0,A=x;A;A=Pi(A))E++;for(A=0,V=k;V;V=Pi(V))A++;for(;0<E-A;)x=Pi(x),E--;for(;0<A-E;)k=Pi(k),A--;for(;E--;){if(x===k||k!==null&&x===k.alternate)break t;x=Pi(x),k=Pi(k)}x=null}else x=null;_!==null&&im(m,g,_,x,!1),b!==null&&O!==null&&im(m,O,b,x,!0)}}e:{if(g=c?Ui(c):window,_=g.nodeName&&g.nodeName.toLowerCase(),_==="select"||_==="input"&&g.type==="file")var F=FS;else if(Yg(g))if(E0)F=$S;else{F=US;var D=zS}else(_=g.nodeName)&&_.toLowerCase()==="input"&&(g.type==="checkbox"||g.type==="radio")&&(F=BS);if(F&&(F=F(t,c))){w0(m,F,n,f);break e}D&&D(t,g,c),t==="focusout"&&(D=g._wrapperState)&&D.controlled&&g.type==="number"&&kd(g,"number",g.value)}switch(D=c?Ui(c):window,t){case"focusin":(Yg(D)||D.contentEditable==="true")&&(Fi=D,jd=c,wo=null);break;case"focusout":wo=jd=Fi=null;break;case"mousedown":Fd=!0;break;case"contextmenu":case"mouseup":case"dragend":Fd=!1,tm(m,n,f);break;case"selectionchange":if(qS)break;case"keydown":case"keyup":tm(m,n,f)}var S;if(of)e:{switch(t){case"compositionstart":var v="onCompositionStart";break e;case"compositionend":v="onCompositionEnd";break e;case"compositionupdate":v="onCompositionUpdate";break e}v=void 0}else ji?v0(t,n)&&(v="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(v="onCompositionStart");v&&(y0&&n.locale!=="ko"&&(ji||v!=="onCompositionStart"?v==="onCompositionEnd"&&ji&&(S=m0()):(pr=f,nf="value"in pr?pr.value:pr.textContent,ji=!0)),D=zl(c,v),0<D.length&&(v=new qg(v,t,null,n,f),m.push({event:v,listeners:D}),S?v.data=S:(S=_0(n),S!==null&&(v.data=S)))),(S=OS?VS(t,n):MS(t,n))&&(c=zl(c,"onBeforeInput"),0<c.length&&(f=new qg("onBeforeInput","beforeinput",null,n,f),m.push({event:f,listeners:c}),f.data=S))}P0(m,e)})}function zo(t,e,n){return{instance:t,listener:e,currentTarget:n}}function zl(t,e){for(var n=e+"Capture",r=[];t!==null;){var i=t,s=i.stateNode;i.tag===5&&s!==null&&(i=s,s=No(t,n),s!=null&&r.unshift(zo(t,s,i)),s=No(t,e),s!=null&&r.push(zo(t,s,i))),t=t.return}return r}function Pi(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function im(t,e,n,r,i){for(var s=e._reactName,o=[];n!==null&&n!==r;){var l=n,u=l.alternate,c=l.stateNode;if(u!==null&&u===r)break;l.tag===5&&c!==null&&(l=c,i?(u=No(n,s),u!=null&&o.unshift(zo(n,u,l))):i||(u=No(n,s),u!=null&&o.push(zo(n,u,l)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var YS=/\r\n?/g,XS=/\u0000|\uFFFD/g;function sm(t){return(typeof t=="string"?t:""+t).replace(YS,`
`).replace(XS,"")}function Qa(t,e,n){if(e=sm(e),sm(t)!==e&&n)throw Error($(425))}function Ul(){}var zd=null,Ud=null;function Bd(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var $d=typeof setTimeout=="function"?setTimeout:void 0,JS=typeof clearTimeout=="function"?clearTimeout:void 0,om=typeof Promise=="function"?Promise:void 0,ZS=typeof queueMicrotask=="function"?queueMicrotask:typeof om<"u"?function(t){return om.resolve(null).then(t).catch(eI)}:$d;function eI(t){setTimeout(function(){throw t})}function Hc(t,e){var n=e,r=0;do{var i=n.nextSibling;if(t.removeChild(n),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(r===0){t.removeChild(i),Mo(e);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=i}while(n);Mo(e)}function wr(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function am(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Is=Math.random().toString(36).slice(2),mn="__reactFiber$"+Is,Uo="__reactProps$"+Is,Kn="__reactContainer$"+Is,Wd="__reactEvents$"+Is,tI="__reactListeners$"+Is,nI="__reactHandles$"+Is;function Jr(t){var e=t[mn];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Kn]||n[mn]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=am(t);t!==null;){if(n=t[mn])return n;t=am(t)}return e}t=n,n=t.parentNode}return null}function ua(t){return t=t[mn]||t[Kn],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function Ui(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error($(33))}function Nu(t){return t[Uo]||null}var Hd=[],Bi=-1;function jr(t){return{current:t}}function Ie(t){0>Bi||(t.current=Hd[Bi],Hd[Bi]=null,Bi--)}function we(t,e){Bi++,Hd[Bi]=t.current,t.current=e}var Ar={},yt=jr(Ar),At=jr(!1),ai=Ar;function us(t,e){var n=t.type.contextTypes;if(!n)return Ar;var r=t.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===e)return r.__reactInternalMemoizedMaskedChildContext;var i={},s;for(s in n)i[s]=e[s];return r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=i),i}function Rt(t){return t=t.childContextTypes,t!=null}function Bl(){Ie(At),Ie(yt)}function lm(t,e,n){if(yt.current!==Ar)throw Error($(168));we(yt,e),we(At,n)}function N0(t,e,n){var r=t.stateNode;if(e=e.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var i in r)if(!(i in e))throw Error($(108,zT(t)||"Unknown",i));return Re({},n,r)}function $l(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||Ar,ai=yt.current,we(yt,t),we(At,At.current),!0}function um(t,e,n){var r=t.stateNode;if(!r)throw Error($(169));n?(t=N0(t,e,ai),r.__reactInternalMemoizedMergedChildContext=t,Ie(At),Ie(yt),we(yt,t)):Ie(At),we(At,n)}var Vn=null,Ou=!1,qc=!1;function O0(t){Vn===null?Vn=[t]:Vn.push(t)}function rI(t){Ou=!0,O0(t)}function Fr(){if(!qc&&Vn!==null){qc=!0;var t=0,e=ye;try{var n=Vn;for(ye=1;t<n.length;t++){var r=n[t];do r=r(!0);while(r!==null)}Vn=null,Ou=!1}catch(i){throw Vn!==null&&(Vn=Vn.slice(t+1)),s0(Jh,Fr),i}finally{ye=e,qc=!1}}return null}var $i=[],Wi=0,Wl=null,Hl=0,Bt=[],$t=0,li=null,jn=1,Fn="";function Qr(t,e){$i[Wi++]=Hl,$i[Wi++]=Wl,Wl=t,Hl=e}function V0(t,e,n){Bt[$t++]=jn,Bt[$t++]=Fn,Bt[$t++]=li,li=t;var r=jn;t=Fn;var i=32-ln(r)-1;r&=~(1<<i),n+=1;var s=32-ln(e)+i;if(30<s){var o=i-i%5;s=(r&(1<<o)-1).toString(32),r>>=o,i-=o,jn=1<<32-ln(e)+i|n<<i|r,Fn=s+t}else jn=1<<s|n<<i|r,Fn=t}function lf(t){t.return!==null&&(Qr(t,1),V0(t,1,0))}function uf(t){for(;t===Wl;)Wl=$i[--Wi],$i[Wi]=null,Hl=$i[--Wi],$i[Wi]=null;for(;t===li;)li=Bt[--$t],Bt[$t]=null,Fn=Bt[--$t],Bt[$t]=null,jn=Bt[--$t],Bt[$t]=null}var Mt=null,Vt=null,ke=!1,sn=null;function M0(t,e){var n=Gt(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function cm(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,Mt=t,Vt=wr(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,Mt=t,Vt=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=li!==null?{id:jn,overflow:Fn}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Gt(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,Mt=t,Vt=null,!0):!1;default:return!1}}function qd(t){return(t.mode&1)!==0&&(t.flags&128)===0}function Kd(t){if(ke){var e=Vt;if(e){var n=e;if(!cm(t,e)){if(qd(t))throw Error($(418));e=wr(n.nextSibling);var r=Mt;e&&cm(t,e)?M0(r,n):(t.flags=t.flags&-4097|2,ke=!1,Mt=t)}}else{if(qd(t))throw Error($(418));t.flags=t.flags&-4097|2,ke=!1,Mt=t}}}function dm(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;Mt=t}function Ya(t){if(t!==Mt)return!1;if(!ke)return dm(t),ke=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!Bd(t.type,t.memoizedProps)),e&&(e=Vt)){if(qd(t))throw L0(),Error($(418));for(;e;)M0(t,e),e=wr(e.nextSibling)}if(dm(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error($(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){Vt=wr(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}Vt=null}}else Vt=Mt?wr(t.stateNode.nextSibling):null;return!0}function L0(){for(var t=Vt;t;)t=wr(t.nextSibling)}function cs(){Vt=Mt=null,ke=!1}function cf(t){sn===null?sn=[t]:sn.push(t)}var iI=er.ReactCurrentBatchConfig;function to(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error($(309));var r=n.stateNode}if(!r)throw Error($(147,t));var i=r,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var l=i.refs;o===null?delete l[s]:l[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error($(284));if(!n._owner)throw Error($(290,t))}return t}function Xa(t,e){throw t=Object.prototype.toString.call(e),Error($(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function hm(t){var e=t._init;return e(t._payload)}function j0(t){function e(k,E){if(t){var A=k.deletions;A===null?(k.deletions=[E],k.flags|=16):A.push(E)}}function n(k,E){if(!t)return null;for(;E!==null;)e(k,E),E=E.sibling;return null}function r(k,E){for(k=new Map;E!==null;)E.key!==null?k.set(E.key,E):k.set(E.index,E),E=E.sibling;return k}function i(k,E){return k=Ir(k,E),k.index=0,k.sibling=null,k}function s(k,E,A){return k.index=A,t?(A=k.alternate,A!==null?(A=A.index,A<E?(k.flags|=2,E):A):(k.flags|=2,E)):(k.flags|=1048576,E)}function o(k){return t&&k.alternate===null&&(k.flags|=2),k}function l(k,E,A,V){return E===null||E.tag!==6?(E=Zc(A,k.mode,V),E.return=k,E):(E=i(E,A),E.return=k,E)}function u(k,E,A,V){var F=A.type;return F===Li?f(k,E,A.props.children,V,A.key):E!==null&&(E.elementType===F||typeof F=="object"&&F!==null&&F.$$typeof===or&&hm(F)===E.type)?(V=i(E,A.props),V.ref=to(k,E,A),V.return=k,V):(V=_l(A.type,A.key,A.props,null,k.mode,V),V.ref=to(k,E,A),V.return=k,V)}function c(k,E,A,V){return E===null||E.tag!==4||E.stateNode.containerInfo!==A.containerInfo||E.stateNode.implementation!==A.implementation?(E=ed(A,k.mode,V),E.return=k,E):(E=i(E,A.children||[]),E.return=k,E)}function f(k,E,A,V,F){return E===null||E.tag!==7?(E=si(A,k.mode,V,F),E.return=k,E):(E=i(E,A),E.return=k,E)}function m(k,E,A){if(typeof E=="string"&&E!==""||typeof E=="number")return E=Zc(""+E,k.mode,A),E.return=k,E;if(typeof E=="object"&&E!==null){switch(E.$$typeof){case za:return A=_l(E.type,E.key,E.props,null,k.mode,A),A.ref=to(k,null,E),A.return=k,A;case Mi:return E=ed(E,k.mode,A),E.return=k,E;case or:var V=E._init;return m(k,V(E._payload),A)}if(so(E)||Ys(E))return E=si(E,k.mode,A,null),E.return=k,E;Xa(k,E)}return null}function g(k,E,A,V){var F=E!==null?E.key:null;if(typeof A=="string"&&A!==""||typeof A=="number")return F!==null?null:l(k,E,""+A,V);if(typeof A=="object"&&A!==null){switch(A.$$typeof){case za:return A.key===F?u(k,E,A,V):null;case Mi:return A.key===F?c(k,E,A,V):null;case or:return F=A._init,g(k,E,F(A._payload),V)}if(so(A)||Ys(A))return F!==null?null:f(k,E,A,V,null);Xa(k,A)}return null}function _(k,E,A,V,F){if(typeof V=="string"&&V!==""||typeof V=="number")return k=k.get(A)||null,l(E,k,""+V,F);if(typeof V=="object"&&V!==null){switch(V.$$typeof){case za:return k=k.get(V.key===null?A:V.key)||null,u(E,k,V,F);case Mi:return k=k.get(V.key===null?A:V.key)||null,c(E,k,V,F);case or:var D=V._init;return _(k,E,A,D(V._payload),F)}if(so(V)||Ys(V))return k=k.get(A)||null,f(E,k,V,F,null);Xa(E,V)}return null}function b(k,E,A,V){for(var F=null,D=null,S=E,v=E=0,T=null;S!==null&&v<A.length;v++){S.index>v?(T=S,S=null):T=S.sibling;var C=g(k,S,A[v],V);if(C===null){S===null&&(S=T);break}t&&S&&C.alternate===null&&e(k,S),E=s(C,E,v),D===null?F=C:D.sibling=C,D=C,S=T}if(v===A.length)return n(k,S),ke&&Qr(k,v),F;if(S===null){for(;v<A.length;v++)S=m(k,A[v],V),S!==null&&(E=s(S,E,v),D===null?F=S:D.sibling=S,D=S);return ke&&Qr(k,v),F}for(S=r(k,S);v<A.length;v++)T=_(S,k,v,A[v],V),T!==null&&(t&&T.alternate!==null&&S.delete(T.key===null?v:T.key),E=s(T,E,v),D===null?F=T:D.sibling=T,D=T);return t&&S.forEach(function(P){return e(k,P)}),ke&&Qr(k,v),F}function x(k,E,A,V){var F=Ys(A);if(typeof F!="function")throw Error($(150));if(A=F.call(A),A==null)throw Error($(151));for(var D=F=null,S=E,v=E=0,T=null,C=A.next();S!==null&&!C.done;v++,C=A.next()){S.index>v?(T=S,S=null):T=S.sibling;var P=g(k,S,C.value,V);if(P===null){S===null&&(S=T);break}t&&S&&P.alternate===null&&e(k,S),E=s(P,E,v),D===null?F=P:D.sibling=P,D=P,S=T}if(C.done)return n(k,S),ke&&Qr(k,v),F;if(S===null){for(;!C.done;v++,C=A.next())C=m(k,C.value,V),C!==null&&(E=s(C,E,v),D===null?F=C:D.sibling=C,D=C);return ke&&Qr(k,v),F}for(S=r(k,S);!C.done;v++,C=A.next())C=_(S,k,v,C.value,V),C!==null&&(t&&C.alternate!==null&&S.delete(C.key===null?v:C.key),E=s(C,E,v),D===null?F=C:D.sibling=C,D=C);return t&&S.forEach(function(R){return e(k,R)}),ke&&Qr(k,v),F}function O(k,E,A,V){if(typeof A=="object"&&A!==null&&A.type===Li&&A.key===null&&(A=A.props.children),typeof A=="object"&&A!==null){switch(A.$$typeof){case za:e:{for(var F=A.key,D=E;D!==null;){if(D.key===F){if(F=A.type,F===Li){if(D.tag===7){n(k,D.sibling),E=i(D,A.props.children),E.return=k,k=E;break e}}else if(D.elementType===F||typeof F=="object"&&F!==null&&F.$$typeof===or&&hm(F)===D.type){n(k,D.sibling),E=i(D,A.props),E.ref=to(k,D,A),E.return=k,k=E;break e}n(k,D);break}else e(k,D);D=D.sibling}A.type===Li?(E=si(A.props.children,k.mode,V,A.key),E.return=k,k=E):(V=_l(A.type,A.key,A.props,null,k.mode,V),V.ref=to(k,E,A),V.return=k,k=V)}return o(k);case Mi:e:{for(D=A.key;E!==null;){if(E.key===D)if(E.tag===4&&E.stateNode.containerInfo===A.containerInfo&&E.stateNode.implementation===A.implementation){n(k,E.sibling),E=i(E,A.children||[]),E.return=k,k=E;break e}else{n(k,E);break}else e(k,E);E=E.sibling}E=ed(A,k.mode,V),E.return=k,k=E}return o(k);case or:return D=A._init,O(k,E,D(A._payload),V)}if(so(A))return b(k,E,A,V);if(Ys(A))return x(k,E,A,V);Xa(k,A)}return typeof A=="string"&&A!==""||typeof A=="number"?(A=""+A,E!==null&&E.tag===6?(n(k,E.sibling),E=i(E,A),E.return=k,k=E):(n(k,E),E=Zc(A,k.mode,V),E.return=k,k=E),o(k)):n(k,E)}return O}var ds=j0(!0),F0=j0(!1),ql=jr(null),Kl=null,Hi=null,df=null;function hf(){df=Hi=Kl=null}function ff(t){var e=ql.current;Ie(ql),t._currentValue=e}function Gd(t,e,n){for(;t!==null;){var r=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,r!==null&&(r.childLanes|=e)):r!==null&&(r.childLanes&e)!==e&&(r.childLanes|=e),t===n)break;t=t.return}}function Ji(t,e){Kl=t,df=Hi=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(bt=!0),t.firstContext=null)}function Xt(t){var e=t._currentValue;if(df!==t)if(t={context:t,memoizedValue:e,next:null},Hi===null){if(Kl===null)throw Error($(308));Hi=t,Kl.dependencies={lanes:0,firstContext:t}}else Hi=Hi.next=t;return e}var Zr=null;function pf(t){Zr===null?Zr=[t]:Zr.push(t)}function z0(t,e,n,r){var i=e.interleaved;return i===null?(n.next=n,pf(e)):(n.next=i.next,i.next=n),e.interleaved=n,Gn(t,r)}function Gn(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var ar=!1;function gf(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function U0(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Bn(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Er(t,e,n){var r=t.updateQueue;if(r===null)return null;if(r=r.shared,he&2){var i=r.pending;return i===null?e.next=e:(e.next=i.next,i.next=e),r.pending=e,Gn(t,n)}return i=r.interleaved,i===null?(e.next=e,pf(r)):(e.next=i.next,i.next=e),r.interleaved=e,Gn(t,n)}function fl(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,Zh(t,n)}}function fm(t,e){var n=t.updateQueue,r=t.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?i=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?i=s=e:s=s.next=e}else i=s=e;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:s,shared:r.shared,effects:r.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function Gl(t,e,n,r){var i=t.updateQueue;ar=!1;var s=i.firstBaseUpdate,o=i.lastBaseUpdate,l=i.shared.pending;if(l!==null){i.shared.pending=null;var u=l,c=u.next;u.next=null,o===null?s=c:o.next=c,o=u;var f=t.alternate;f!==null&&(f=f.updateQueue,l=f.lastBaseUpdate,l!==o&&(l===null?f.firstBaseUpdate=c:l.next=c,f.lastBaseUpdate=u))}if(s!==null){var m=i.baseState;o=0,f=c=u=null,l=s;do{var g=l.lane,_=l.eventTime;if((r&g)===g){f!==null&&(f=f.next={eventTime:_,lane:0,tag:l.tag,payload:l.payload,callback:l.callback,next:null});e:{var b=t,x=l;switch(g=e,_=n,x.tag){case 1:if(b=x.payload,typeof b=="function"){m=b.call(_,m,g);break e}m=b;break e;case 3:b.flags=b.flags&-65537|128;case 0:if(b=x.payload,g=typeof b=="function"?b.call(_,m,g):b,g==null)break e;m=Re({},m,g);break e;case 2:ar=!0}}l.callback!==null&&l.lane!==0&&(t.flags|=64,g=i.effects,g===null?i.effects=[l]:g.push(l))}else _={eventTime:_,lane:g,tag:l.tag,payload:l.payload,callback:l.callback,next:null},f===null?(c=f=_,u=m):f=f.next=_,o|=g;if(l=l.next,l===null){if(l=i.shared.pending,l===null)break;g=l,l=g.next,g.next=null,i.lastBaseUpdate=g,i.shared.pending=null}}while(!0);if(f===null&&(u=m),i.baseState=u,i.firstBaseUpdate=c,i.lastBaseUpdate=f,e=i.shared.interleaved,e!==null){i=e;do o|=i.lane,i=i.next;while(i!==e)}else s===null&&(i.shared.lanes=0);ci|=o,t.lanes=o,t.memoizedState=m}}function pm(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var r=t[e],i=r.callback;if(i!==null){if(r.callback=null,r=n,typeof i!="function")throw Error($(191,i));i.call(r)}}}var ca={},_n=jr(ca),Bo=jr(ca),$o=jr(ca);function ei(t){if(t===ca)throw Error($(174));return t}function mf(t,e){switch(we($o,e),we(Bo,t),we(_n,ca),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:bd(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=bd(e,t)}Ie(_n),we(_n,e)}function hs(){Ie(_n),Ie(Bo),Ie($o)}function B0(t){ei($o.current);var e=ei(_n.current),n=bd(e,t.type);e!==n&&(we(Bo,t),we(_n,n))}function yf(t){Bo.current===t&&(Ie(_n),Ie(Bo))}var Ce=jr(0);function Ql(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Kc=[];function vf(){for(var t=0;t<Kc.length;t++)Kc[t]._workInProgressVersionPrimary=null;Kc.length=0}var pl=er.ReactCurrentDispatcher,Gc=er.ReactCurrentBatchConfig,ui=0,Ae=null,Ue=null,Ge=null,Yl=!1,Eo=!1,Wo=0,sI=0;function ct(){throw Error($(321))}function _f(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!dn(t[n],e[n]))return!1;return!0}function wf(t,e,n,r,i,s){if(ui=s,Ae=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,pl.current=t===null||t.memoizedState===null?uI:cI,t=n(r,i),Eo){s=0;do{if(Eo=!1,Wo=0,25<=s)throw Error($(301));s+=1,Ge=Ue=null,e.updateQueue=null,pl.current=dI,t=n(r,i)}while(Eo)}if(pl.current=Xl,e=Ue!==null&&Ue.next!==null,ui=0,Ge=Ue=Ae=null,Yl=!1,e)throw Error($(300));return t}function Ef(){var t=Wo!==0;return Wo=0,t}function pn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ge===null?Ae.memoizedState=Ge=t:Ge=Ge.next=t,Ge}function Jt(){if(Ue===null){var t=Ae.alternate;t=t!==null?t.memoizedState:null}else t=Ue.next;var e=Ge===null?Ae.memoizedState:Ge.next;if(e!==null)Ge=e,Ue=t;else{if(t===null)throw Error($(310));Ue=t,t={memoizedState:Ue.memoizedState,baseState:Ue.baseState,baseQueue:Ue.baseQueue,queue:Ue.queue,next:null},Ge===null?Ae.memoizedState=Ge=t:Ge=Ge.next=t}return Ge}function Ho(t,e){return typeof e=="function"?e(t):e}function Qc(t){var e=Jt(),n=e.queue;if(n===null)throw Error($(311));n.lastRenderedReducer=t;var r=Ue,i=r.baseQueue,s=n.pending;if(s!==null){if(i!==null){var o=i.next;i.next=s.next,s.next=o}r.baseQueue=i=s,n.pending=null}if(i!==null){s=i.next,r=r.baseState;var l=o=null,u=null,c=s;do{var f=c.lane;if((ui&f)===f)u!==null&&(u=u.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),r=c.hasEagerState?c.eagerState:t(r,c.action);else{var m={lane:f,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};u===null?(l=u=m,o=r):u=u.next=m,Ae.lanes|=f,ci|=f}c=c.next}while(c!==null&&c!==s);u===null?o=r:u.next=l,dn(r,e.memoizedState)||(bt=!0),e.memoizedState=r,e.baseState=o,e.baseQueue=u,n.lastRenderedState=r}if(t=n.interleaved,t!==null){i=t;do s=i.lane,Ae.lanes|=s,ci|=s,i=i.next;while(i!==t)}else i===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Yc(t){var e=Jt(),n=e.queue;if(n===null)throw Error($(311));n.lastRenderedReducer=t;var r=n.dispatch,i=n.pending,s=e.memoizedState;if(i!==null){n.pending=null;var o=i=i.next;do s=t(s,o.action),o=o.next;while(o!==i);dn(s,e.memoizedState)||(bt=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,r]}function $0(){}function W0(t,e){var n=Ae,r=Jt(),i=e(),s=!dn(r.memoizedState,i);if(s&&(r.memoizedState=i,bt=!0),r=r.queue,Tf(K0.bind(null,n,r,t),[t]),r.getSnapshot!==e||s||Ge!==null&&Ge.memoizedState.tag&1){if(n.flags|=2048,qo(9,q0.bind(null,n,r,i,e),void 0,null),Qe===null)throw Error($(349));ui&30||H0(n,e,i)}return i}function H0(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=Ae.updateQueue,e===null?(e={lastEffect:null,stores:null},Ae.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function q0(t,e,n,r){e.value=n,e.getSnapshot=r,G0(e)&&Q0(t)}function K0(t,e,n){return n(function(){G0(e)&&Q0(t)})}function G0(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!dn(t,n)}catch{return!0}}function Q0(t){var e=Gn(t,1);e!==null&&un(e,t,1,-1)}function gm(t){var e=pn();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ho,lastRenderedState:t},e.queue=t,t=t.dispatch=lI.bind(null,Ae,t),[e.memoizedState,t]}function qo(t,e,n,r){return t={tag:t,create:e,destroy:n,deps:r,next:null},e=Ae.updateQueue,e===null?(e={lastEffect:null,stores:null},Ae.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(r=n.next,n.next=t,t.next=r,e.lastEffect=t)),t}function Y0(){return Jt().memoizedState}function gl(t,e,n,r){var i=pn();Ae.flags|=t,i.memoizedState=qo(1|e,n,void 0,r===void 0?null:r)}function Vu(t,e,n,r){var i=Jt();r=r===void 0?null:r;var s=void 0;if(Ue!==null){var o=Ue.memoizedState;if(s=o.destroy,r!==null&&_f(r,o.deps)){i.memoizedState=qo(e,n,s,r);return}}Ae.flags|=t,i.memoizedState=qo(1|e,n,s,r)}function mm(t,e){return gl(8390656,8,t,e)}function Tf(t,e){return Vu(2048,8,t,e)}function X0(t,e){return Vu(4,2,t,e)}function J0(t,e){return Vu(4,4,t,e)}function Z0(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function e_(t,e,n){return n=n!=null?n.concat([t]):null,Vu(4,4,Z0.bind(null,e,t),n)}function Sf(){}function t_(t,e){var n=Jt();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&_f(e,r[1])?r[0]:(n.memoizedState=[t,e],t)}function n_(t,e){var n=Jt();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&_f(e,r[1])?r[0]:(t=t(),n.memoizedState=[t,e],t)}function r_(t,e,n){return ui&21?(dn(n,e)||(n=l0(),Ae.lanes|=n,ci|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,bt=!0),t.memoizedState=n)}function oI(t,e){var n=ye;ye=n!==0&&4>n?n:4,t(!0);var r=Gc.transition;Gc.transition={};try{t(!1),e()}finally{ye=n,Gc.transition=r}}function i_(){return Jt().memoizedState}function aI(t,e,n){var r=Sr(t);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},s_(t))o_(e,n);else if(n=z0(t,e,n,r),n!==null){var i=St();un(n,t,r,i),a_(n,e,r)}}function lI(t,e,n){var r=Sr(t),i={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(s_(t))o_(e,i);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,l=s(o,n);if(i.hasEagerState=!0,i.eagerState=l,dn(l,o)){var u=e.interleaved;u===null?(i.next=i,pf(e)):(i.next=u.next,u.next=i),e.interleaved=i;return}}catch{}finally{}n=z0(t,e,i,r),n!==null&&(i=St(),un(n,t,r,i),a_(n,e,r))}}function s_(t){var e=t.alternate;return t===Ae||e!==null&&e===Ae}function o_(t,e){Eo=Yl=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function a_(t,e,n){if(n&4194240){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,Zh(t,n)}}var Xl={readContext:Xt,useCallback:ct,useContext:ct,useEffect:ct,useImperativeHandle:ct,useInsertionEffect:ct,useLayoutEffect:ct,useMemo:ct,useReducer:ct,useRef:ct,useState:ct,useDebugValue:ct,useDeferredValue:ct,useTransition:ct,useMutableSource:ct,useSyncExternalStore:ct,useId:ct,unstable_isNewReconciler:!1},uI={readContext:Xt,useCallback:function(t,e){return pn().memoizedState=[t,e===void 0?null:e],t},useContext:Xt,useEffect:mm,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,gl(4194308,4,Z0.bind(null,e,t),n)},useLayoutEffect:function(t,e){return gl(4194308,4,t,e)},useInsertionEffect:function(t,e){return gl(4,2,t,e)},useMemo:function(t,e){var n=pn();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var r=pn();return e=n!==void 0?n(e):e,r.memoizedState=r.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},r.queue=t,t=t.dispatch=aI.bind(null,Ae,t),[r.memoizedState,t]},useRef:function(t){var e=pn();return t={current:t},e.memoizedState=t},useState:gm,useDebugValue:Sf,useDeferredValue:function(t){return pn().memoizedState=t},useTransition:function(){var t=gm(!1),e=t[0];return t=oI.bind(null,t[1]),pn().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var r=Ae,i=pn();if(ke){if(n===void 0)throw Error($(407));n=n()}else{if(n=e(),Qe===null)throw Error($(349));ui&30||H0(r,e,n)}i.memoizedState=n;var s={value:n,getSnapshot:e};return i.queue=s,mm(K0.bind(null,r,s,t),[t]),r.flags|=2048,qo(9,q0.bind(null,r,s,n,e),void 0,null),n},useId:function(){var t=pn(),e=Qe.identifierPrefix;if(ke){var n=Fn,r=jn;n=(r&~(1<<32-ln(r)-1)).toString(32)+n,e=":"+e+"R"+n,n=Wo++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=sI++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},cI={readContext:Xt,useCallback:t_,useContext:Xt,useEffect:Tf,useImperativeHandle:e_,useInsertionEffect:X0,useLayoutEffect:J0,useMemo:n_,useReducer:Qc,useRef:Y0,useState:function(){return Qc(Ho)},useDebugValue:Sf,useDeferredValue:function(t){var e=Jt();return r_(e,Ue.memoizedState,t)},useTransition:function(){var t=Qc(Ho)[0],e=Jt().memoizedState;return[t,e]},useMutableSource:$0,useSyncExternalStore:W0,useId:i_,unstable_isNewReconciler:!1},dI={readContext:Xt,useCallback:t_,useContext:Xt,useEffect:Tf,useImperativeHandle:e_,useInsertionEffect:X0,useLayoutEffect:J0,useMemo:n_,useReducer:Yc,useRef:Y0,useState:function(){return Yc(Ho)},useDebugValue:Sf,useDeferredValue:function(t){var e=Jt();return Ue===null?e.memoizedState=t:r_(e,Ue.memoizedState,t)},useTransition:function(){var t=Yc(Ho)[0],e=Jt().memoizedState;return[t,e]},useMutableSource:$0,useSyncExternalStore:W0,useId:i_,unstable_isNewReconciler:!1};function nn(t,e){if(t&&t.defaultProps){e=Re({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function Qd(t,e,n,r){e=t.memoizedState,n=n(r,e),n=n==null?e:Re({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var Mu={isMounted:function(t){return(t=t._reactInternals)?wi(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var r=St(),i=Sr(t),s=Bn(r,i);s.payload=e,n!=null&&(s.callback=n),e=Er(t,s,i),e!==null&&(un(e,t,i,r),fl(e,t,i))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var r=St(),i=Sr(t),s=Bn(r,i);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=Er(t,s,i),e!==null&&(un(e,t,i,r),fl(e,t,i))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=St(),r=Sr(t),i=Bn(n,r);i.tag=2,e!=null&&(i.callback=e),e=Er(t,i,r),e!==null&&(un(e,t,r,n),fl(e,t,r))}};function ym(t,e,n,r,i,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(r,s,o):e.prototype&&e.prototype.isPureReactComponent?!jo(n,r)||!jo(i,s):!0}function l_(t,e,n){var r=!1,i=Ar,s=e.contextType;return typeof s=="object"&&s!==null?s=Xt(s):(i=Rt(e)?ai:yt.current,r=e.contextTypes,s=(r=r!=null)?us(t,i):Ar),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Mu,t.stateNode=e,e._reactInternals=t,r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=s),e}function vm(t,e,n,r){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,r),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,r),e.state!==t&&Mu.enqueueReplaceState(e,e.state,null)}function Yd(t,e,n,r){var i=t.stateNode;i.props=n,i.state=t.memoizedState,i.refs={},gf(t);var s=e.contextType;typeof s=="object"&&s!==null?i.context=Xt(s):(s=Rt(e)?ai:yt.current,i.context=us(t,s)),i.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Qd(t,e,s,n),i.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(e=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),e!==i.state&&Mu.enqueueReplaceState(i,i.state,null),Gl(t,n,i,r),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308)}function fs(t,e){try{var n="",r=e;do n+=FT(r),r=r.return;while(r);var i=n}catch(s){i=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:i,digest:null}}function Xc(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function Xd(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var hI=typeof WeakMap=="function"?WeakMap:Map;function u_(t,e,n){n=Bn(-1,n),n.tag=3,n.payload={element:null};var r=e.value;return n.callback=function(){Zl||(Zl=!0,ah=r),Xd(t,e)},n}function c_(t,e,n){n=Bn(-1,n),n.tag=3;var r=t.type.getDerivedStateFromError;if(typeof r=="function"){var i=e.value;n.payload=function(){return r(i)},n.callback=function(){Xd(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Xd(t,e),typeof r!="function"&&(Tr===null?Tr=new Set([this]):Tr.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function _m(t,e,n){var r=t.pingCache;if(r===null){r=t.pingCache=new hI;var i=new Set;r.set(e,i)}else i=r.get(e),i===void 0&&(i=new Set,r.set(e,i));i.has(n)||(i.add(n),t=kI.bind(null,t,e,n),e.then(t,t))}function wm(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Em(t,e,n,r,i){return t.mode&1?(t.flags|=65536,t.lanes=i,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=Bn(-1,1),e.tag=2,Er(n,e,1))),n.lanes|=1),t)}var fI=er.ReactCurrentOwner,bt=!1;function Tt(t,e,n,r){e.child=t===null?F0(e,null,n,r):ds(e,t.child,n,r)}function Tm(t,e,n,r,i){n=n.render;var s=e.ref;return Ji(e,i),r=wf(t,e,n,r,s,i),n=Ef(),t!==null&&!bt?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,Qn(t,e,i)):(ke&&n&&lf(e),e.flags|=1,Tt(t,e,r,i),e.child)}function Sm(t,e,n,r,i){if(t===null){var s=n.type;return typeof s=="function"&&!Pf(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,d_(t,e,s,r,i)):(t=_l(n.type,null,r,e,e.mode,i),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&i)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:jo,n(o,r)&&t.ref===e.ref)return Qn(t,e,i)}return e.flags|=1,t=Ir(s,r),t.ref=e.ref,t.return=e,e.child=t}function d_(t,e,n,r,i){if(t!==null){var s=t.memoizedProps;if(jo(s,r)&&t.ref===e.ref)if(bt=!1,e.pendingProps=r=s,(t.lanes&i)!==0)t.flags&131072&&(bt=!0);else return e.lanes=t.lanes,Qn(t,e,i)}return Jd(t,e,n,r,i)}function h_(t,e,n){var r=e.pendingProps,i=r.children,s=t!==null?t.memoizedState:null;if(r.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},we(Ki,Nt),Nt|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,we(Ki,Nt),Nt|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=s!==null?s.baseLanes:n,we(Ki,Nt),Nt|=r}else s!==null?(r=s.baseLanes|n,e.memoizedState=null):r=n,we(Ki,Nt),Nt|=r;return Tt(t,e,i,n),e.child}function f_(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function Jd(t,e,n,r,i){var s=Rt(n)?ai:yt.current;return s=us(e,s),Ji(e,i),n=wf(t,e,n,r,s,i),r=Ef(),t!==null&&!bt?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,Qn(t,e,i)):(ke&&r&&lf(e),e.flags|=1,Tt(t,e,n,i),e.child)}function Im(t,e,n,r,i){if(Rt(n)){var s=!0;$l(e)}else s=!1;if(Ji(e,i),e.stateNode===null)ml(t,e),l_(e,n,r),Yd(e,n,r,i),r=!0;else if(t===null){var o=e.stateNode,l=e.memoizedProps;o.props=l;var u=o.context,c=n.contextType;typeof c=="object"&&c!==null?c=Xt(c):(c=Rt(n)?ai:yt.current,c=us(e,c));var f=n.getDerivedStateFromProps,m=typeof f=="function"||typeof o.getSnapshotBeforeUpdate=="function";m||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==r||u!==c)&&vm(e,o,r,c),ar=!1;var g=e.memoizedState;o.state=g,Gl(e,r,o,i),u=e.memoizedState,l!==r||g!==u||At.current||ar?(typeof f=="function"&&(Qd(e,n,f,r),u=e.memoizedState),(l=ar||ym(e,n,l,r,g,u,c))?(m||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=r,e.memoizedState=u),o.props=r,o.state=u,o.context=c,r=l):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),r=!1)}else{o=e.stateNode,U0(t,e),l=e.memoizedProps,c=e.type===e.elementType?l:nn(e.type,l),o.props=c,m=e.pendingProps,g=o.context,u=n.contextType,typeof u=="object"&&u!==null?u=Xt(u):(u=Rt(n)?ai:yt.current,u=us(e,u));var _=n.getDerivedStateFromProps;(f=typeof _=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==m||g!==u)&&vm(e,o,r,u),ar=!1,g=e.memoizedState,o.state=g,Gl(e,r,o,i);var b=e.memoizedState;l!==m||g!==b||At.current||ar?(typeof _=="function"&&(Qd(e,n,_,r),b=e.memoizedState),(c=ar||ym(e,n,c,r,g,b,u)||!1)?(f||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,b,u),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,b,u)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=1024),e.memoizedProps=r,e.memoizedState=b),o.props=r,o.state=b,o.context=u,r=c):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=1024),r=!1)}return Zd(t,e,n,r,s,i)}function Zd(t,e,n,r,i,s){f_(t,e);var o=(e.flags&128)!==0;if(!r&&!o)return i&&um(e,n,!1),Qn(t,e,s);r=e.stateNode,fI.current=e;var l=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return e.flags|=1,t!==null&&o?(e.child=ds(e,t.child,null,s),e.child=ds(e,null,l,s)):Tt(t,e,l,s),e.memoizedState=r.state,i&&um(e,n,!0),e.child}function p_(t){var e=t.stateNode;e.pendingContext?lm(t,e.pendingContext,e.pendingContext!==e.context):e.context&&lm(t,e.context,!1),mf(t,e.containerInfo)}function xm(t,e,n,r,i){return cs(),cf(i),e.flags|=256,Tt(t,e,n,r),e.child}var eh={dehydrated:null,treeContext:null,retryLane:0};function th(t){return{baseLanes:t,cachePool:null,transitions:null}}function g_(t,e,n){var r=e.pendingProps,i=Ce.current,s=!1,o=(e.flags&128)!==0,l;if((l=o)||(l=t!==null&&t.memoizedState===null?!1:(i&2)!==0),l?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(i|=1),we(Ce,i&1),t===null)return Kd(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=r.children,t=r.fallback,s?(r=e.mode,s=e.child,o={mode:"hidden",children:o},!(r&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=Fu(o,r,0,null),t=si(t,r,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=th(n),e.memoizedState=eh,t):If(e,o));if(i=t.memoizedState,i!==null&&(l=i.dehydrated,l!==null))return pI(t,e,o,r,l,i,n);if(s){s=r.fallback,o=e.mode,i=t.child,l=i.sibling;var u={mode:"hidden",children:r.children};return!(o&1)&&e.child!==i?(r=e.child,r.childLanes=0,r.pendingProps=u,e.deletions=null):(r=Ir(i,u),r.subtreeFlags=i.subtreeFlags&14680064),l!==null?s=Ir(l,s):(s=si(s,o,n,null),s.flags|=2),s.return=e,r.return=e,r.sibling=s,e.child=r,r=s,s=e.child,o=t.child.memoizedState,o=o===null?th(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=eh,r}return s=t.child,t=s.sibling,r=Ir(s,{mode:"visible",children:r.children}),!(e.mode&1)&&(r.lanes=n),r.return=e,r.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=r,e.memoizedState=null,r}function If(t,e){return e=Fu({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function Ja(t,e,n,r){return r!==null&&cf(r),ds(e,t.child,null,n),t=If(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function pI(t,e,n,r,i,s,o){if(n)return e.flags&256?(e.flags&=-257,r=Xc(Error($(422))),Ja(t,e,o,r)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=r.fallback,i=e.mode,r=Fu({mode:"visible",children:r.children},i,0,null),s=si(s,i,o,null),s.flags|=2,r.return=e,s.return=e,r.sibling=s,e.child=r,e.mode&1&&ds(e,t.child,null,o),e.child.memoizedState=th(o),e.memoizedState=eh,s);if(!(e.mode&1))return Ja(t,e,o,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var l=r.dgst;return r=l,s=Error($(419)),r=Xc(s,r,void 0),Ja(t,e,o,r)}if(l=(o&t.childLanes)!==0,bt||l){if(r=Qe,r!==null){switch(o&-o){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(r.suspendedLanes|o)?0:i,i!==0&&i!==s.retryLane&&(s.retryLane=i,Gn(t,i),un(r,t,i,-1))}return Rf(),r=Xc(Error($(421))),Ja(t,e,o,r)}return i.data==="$?"?(e.flags|=128,e.child=t.child,e=CI.bind(null,t),i._reactRetry=e,null):(t=s.treeContext,Vt=wr(i.nextSibling),Mt=e,ke=!0,sn=null,t!==null&&(Bt[$t++]=jn,Bt[$t++]=Fn,Bt[$t++]=li,jn=t.id,Fn=t.overflow,li=e),e=If(e,r.children),e.flags|=4096,e)}function km(t,e,n){t.lanes|=e;var r=t.alternate;r!==null&&(r.lanes|=e),Gd(t.return,e,n)}function Jc(t,e,n,r,i){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=r,s.tail=n,s.tailMode=i)}function m_(t,e,n){var r=e.pendingProps,i=r.revealOrder,s=r.tail;if(Tt(t,e,r.children,n),r=Ce.current,r&2)r=r&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&km(t,n,e);else if(t.tag===19)km(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}r&=1}if(we(Ce,r),!(e.mode&1))e.memoizedState=null;else switch(i){case"forwards":for(n=e.child,i=null;n!==null;)t=n.alternate,t!==null&&Ql(t)===null&&(i=n),n=n.sibling;n=i,n===null?(i=e.child,e.child=null):(i=n.sibling,n.sibling=null),Jc(e,!1,i,n,s);break;case"backwards":for(n=null,i=e.child,e.child=null;i!==null;){if(t=i.alternate,t!==null&&Ql(t)===null){e.child=i;break}t=i.sibling,i.sibling=n,n=i,i=t}Jc(e,!0,n,null,s);break;case"together":Jc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function ml(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Qn(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),ci|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error($(153));if(e.child!==null){for(t=e.child,n=Ir(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=Ir(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function gI(t,e,n){switch(e.tag){case 3:p_(e),cs();break;case 5:B0(e);break;case 1:Rt(e.type)&&$l(e);break;case 4:mf(e,e.stateNode.containerInfo);break;case 10:var r=e.type._context,i=e.memoizedProps.value;we(ql,r._currentValue),r._currentValue=i;break;case 13:if(r=e.memoizedState,r!==null)return r.dehydrated!==null?(we(Ce,Ce.current&1),e.flags|=128,null):n&e.child.childLanes?g_(t,e,n):(we(Ce,Ce.current&1),t=Qn(t,e,n),t!==null?t.sibling:null);we(Ce,Ce.current&1);break;case 19:if(r=(n&e.childLanes)!==0,t.flags&128){if(r)return m_(t,e,n);e.flags|=128}if(i=e.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),we(Ce,Ce.current),r)break;return null;case 22:case 23:return e.lanes=0,h_(t,e,n)}return Qn(t,e,n)}var y_,nh,v_,__;y_=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};nh=function(){};v_=function(t,e,n,r){var i=t.memoizedProps;if(i!==r){t=e.stateNode,ei(_n.current);var s=null;switch(n){case"input":i=Id(t,i),r=Id(t,r),s=[];break;case"select":i=Re({},i,{value:void 0}),r=Re({},r,{value:void 0}),s=[];break;case"textarea":i=Cd(t,i),r=Cd(t,r),s=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(t.onclick=Ul)}Ad(n,r);var o;n=null;for(c in i)if(!r.hasOwnProperty(c)&&i.hasOwnProperty(c)&&i[c]!=null)if(c==="style"){var l=i[c];for(o in l)l.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Po.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in r){var u=r[c];if(l=i!=null?i[c]:void 0,r.hasOwnProperty(c)&&u!==l&&(u!=null||l!=null))if(c==="style")if(l){for(o in l)!l.hasOwnProperty(o)||u&&u.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in u)u.hasOwnProperty(o)&&l[o]!==u[o]&&(n||(n={}),n[o]=u[o])}else n||(s||(s=[]),s.push(c,n)),n=u;else c==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,l=l?l.__html:void 0,u!=null&&l!==u&&(s=s||[]).push(c,u)):c==="children"?typeof u!="string"&&typeof u!="number"||(s=s||[]).push(c,""+u):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Po.hasOwnProperty(c)?(u!=null&&c==="onScroll"&&Te("scroll",t),s||l===u||(s=[])):(s=s||[]).push(c,u))}n&&(s=s||[]).push("style",n);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};__=function(t,e,n,r){n!==r&&(e.flags|=4)};function no(t,e){if(!ke)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:r.sibling=null}}function dt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,r=0;if(e)for(var i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=t,i=i.sibling;else for(i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=t,i=i.sibling;return t.subtreeFlags|=r,t.childLanes=n,e}function mI(t,e,n){var r=e.pendingProps;switch(uf(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return dt(e),null;case 1:return Rt(e.type)&&Bl(),dt(e),null;case 3:return r=e.stateNode,hs(),Ie(At),Ie(yt),vf(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(t===null||t.child===null)&&(Ya(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,sn!==null&&(ch(sn),sn=null))),nh(t,e),dt(e),null;case 5:yf(e);var i=ei($o.current);if(n=e.type,t!==null&&e.stateNode!=null)v_(t,e,n,r,i),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!r){if(e.stateNode===null)throw Error($(166));return dt(e),null}if(t=ei(_n.current),Ya(e)){r=e.stateNode,n=e.type;var s=e.memoizedProps;switch(r[mn]=e,r[Uo]=s,t=(e.mode&1)!==0,n){case"dialog":Te("cancel",r),Te("close",r);break;case"iframe":case"object":case"embed":Te("load",r);break;case"video":case"audio":for(i=0;i<ao.length;i++)Te(ao[i],r);break;case"source":Te("error",r);break;case"img":case"image":case"link":Te("error",r),Te("load",r);break;case"details":Te("toggle",r);break;case"input":Vg(r,s),Te("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!s.multiple},Te("invalid",r);break;case"textarea":Lg(r,s),Te("invalid",r)}Ad(n,s),i=null;for(var o in s)if(s.hasOwnProperty(o)){var l=s[o];o==="children"?typeof l=="string"?r.textContent!==l&&(s.suppressHydrationWarning!==!0&&Qa(r.textContent,l,t),i=["children",l]):typeof l=="number"&&r.textContent!==""+l&&(s.suppressHydrationWarning!==!0&&Qa(r.textContent,l,t),i=["children",""+l]):Po.hasOwnProperty(o)&&l!=null&&o==="onScroll"&&Te("scroll",r)}switch(n){case"input":Ua(r),Mg(r,s,!0);break;case"textarea":Ua(r),jg(r);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(r.onclick=Ul)}r=i,e.updateQueue=r,r!==null&&(e.flags|=4)}else{o=i.nodeType===9?i:i.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Kv(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof r.is=="string"?t=o.createElement(n,{is:r.is}):(t=o.createElement(n),n==="select"&&(o=t,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):t=o.createElementNS(t,n),t[mn]=e,t[Uo]=r,y_(t,e,!1,!1),e.stateNode=t;e:{switch(o=Rd(n,r),n){case"dialog":Te("cancel",t),Te("close",t),i=r;break;case"iframe":case"object":case"embed":Te("load",t),i=r;break;case"video":case"audio":for(i=0;i<ao.length;i++)Te(ao[i],t);i=r;break;case"source":Te("error",t),i=r;break;case"img":case"image":case"link":Te("error",t),Te("load",t),i=r;break;case"details":Te("toggle",t),i=r;break;case"input":Vg(t,r),i=Id(t,r),Te("invalid",t);break;case"option":i=r;break;case"select":t._wrapperState={wasMultiple:!!r.multiple},i=Re({},r,{value:void 0}),Te("invalid",t);break;case"textarea":Lg(t,r),i=Cd(t,r),Te("invalid",t);break;default:i=r}Ad(n,i),l=i;for(s in l)if(l.hasOwnProperty(s)){var u=l[s];s==="style"?Yv(t,u):s==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&Gv(t,u)):s==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&Do(t,u):typeof u=="number"&&Do(t,""+u):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Po.hasOwnProperty(s)?u!=null&&s==="onScroll"&&Te("scroll",t):u!=null&&Kh(t,s,u,o))}switch(n){case"input":Ua(t),Mg(t,r,!1);break;case"textarea":Ua(t),jg(t);break;case"option":r.value!=null&&t.setAttribute("value",""+br(r.value));break;case"select":t.multiple=!!r.multiple,s=r.value,s!=null?Gi(t,!!r.multiple,s,!1):r.defaultValue!=null&&Gi(t,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(t.onclick=Ul)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return dt(e),null;case 6:if(t&&e.stateNode!=null)__(t,e,t.memoizedProps,r);else{if(typeof r!="string"&&e.stateNode===null)throw Error($(166));if(n=ei($o.current),ei(_n.current),Ya(e)){if(r=e.stateNode,n=e.memoizedProps,r[mn]=e,(s=r.nodeValue!==n)&&(t=Mt,t!==null))switch(t.tag){case 3:Qa(r.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&Qa(r.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[mn]=e,e.stateNode=r}return dt(e),null;case 13:if(Ie(Ce),r=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(ke&&Vt!==null&&e.mode&1&&!(e.flags&128))L0(),cs(),e.flags|=98560,s=!1;else if(s=Ya(e),r!==null&&r.dehydrated!==null){if(t===null){if(!s)throw Error($(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error($(317));s[mn]=e}else cs(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;dt(e),s=!1}else sn!==null&&(ch(sn),sn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(r=r!==null,r!==(t!==null&&t.memoizedState!==null)&&r&&(e.child.flags|=8192,e.mode&1&&(t===null||Ce.current&1?$e===0&&($e=3):Rf())),e.updateQueue!==null&&(e.flags|=4),dt(e),null);case 4:return hs(),nh(t,e),t===null&&Fo(e.stateNode.containerInfo),dt(e),null;case 10:return ff(e.type._context),dt(e),null;case 17:return Rt(e.type)&&Bl(),dt(e),null;case 19:if(Ie(Ce),s=e.memoizedState,s===null)return dt(e),null;if(r=(e.flags&128)!==0,o=s.rendering,o===null)if(r)no(s,!1);else{if($e!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=Ql(t),o!==null){for(e.flags|=128,no(s,!1),r=o.updateQueue,r!==null&&(e.updateQueue=r,e.flags|=4),e.subtreeFlags=0,r=n,n=e.child;n!==null;)s=n,t=r,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return we(Ce,Ce.current&1|2),e.child}t=t.sibling}s.tail!==null&&Le()>ps&&(e.flags|=128,r=!0,no(s,!1),e.lanes=4194304)}else{if(!r)if(t=Ql(o),t!==null){if(e.flags|=128,r=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),no(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!ke)return dt(e),null}else 2*Le()-s.renderingStartTime>ps&&n!==1073741824&&(e.flags|=128,r=!0,no(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Le(),e.sibling=null,n=Ce.current,we(Ce,r?n&1|2:n&1),e):(dt(e),null);case 22:case 23:return Af(),r=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==r&&(e.flags|=8192),r&&e.mode&1?Nt&1073741824&&(dt(e),e.subtreeFlags&6&&(e.flags|=8192)):dt(e),null;case 24:return null;case 25:return null}throw Error($(156,e.tag))}function yI(t,e){switch(uf(e),e.tag){case 1:return Rt(e.type)&&Bl(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return hs(),Ie(At),Ie(yt),vf(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return yf(e),null;case 13:if(Ie(Ce),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error($(340));cs()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return Ie(Ce),null;case 4:return hs(),null;case 10:return ff(e.type._context),null;case 22:case 23:return Af(),null;case 24:return null;default:return null}}var Za=!1,pt=!1,vI=typeof WeakSet=="function"?WeakSet:Set,q=null;function qi(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){Ne(t,e,r)}else n.current=null}function rh(t,e,n){try{n()}catch(r){Ne(t,e,r)}}var Cm=!1;function _I(t,e){if(zd=jl,t=I0(),af(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var i=r.anchorOffset,s=r.focusNode;r=r.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,l=-1,u=-1,c=0,f=0,m=t,g=null;t:for(;;){for(var _;m!==n||i!==0&&m.nodeType!==3||(l=o+i),m!==s||r!==0&&m.nodeType!==3||(u=o+r),m.nodeType===3&&(o+=m.nodeValue.length),(_=m.firstChild)!==null;)g=m,m=_;for(;;){if(m===t)break t;if(g===n&&++c===i&&(l=o),g===s&&++f===r&&(u=o),(_=m.nextSibling)!==null)break;m=g,g=m.parentNode}m=_}n=l===-1||u===-1?null:{start:l,end:u}}else n=null}n=n||{start:0,end:0}}else n=null;for(Ud={focusedElem:t,selectionRange:n},jl=!1,q=e;q!==null;)if(e=q,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,q=t;else for(;q!==null;){e=q;try{var b=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(b!==null){var x=b.memoizedProps,O=b.memoizedState,k=e.stateNode,E=k.getSnapshotBeforeUpdate(e.elementType===e.type?x:nn(e.type,x),O);k.__reactInternalSnapshotBeforeUpdate=E}break;case 3:var A=e.stateNode.containerInfo;A.nodeType===1?A.textContent="":A.nodeType===9&&A.documentElement&&A.removeChild(A.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error($(163))}}catch(V){Ne(e,e.return,V)}if(t=e.sibling,t!==null){t.return=e.return,q=t;break}q=e.return}return b=Cm,Cm=!1,b}function To(t,e,n){var r=e.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&t)===t){var s=i.destroy;i.destroy=void 0,s!==void 0&&rh(e,n,s)}i=i.next}while(i!==r)}}function Lu(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var r=n.create;n.destroy=r()}n=n.next}while(n!==e)}}function ih(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function w_(t){var e=t.alternate;e!==null&&(t.alternate=null,w_(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[mn],delete e[Uo],delete e[Wd],delete e[tI],delete e[nI])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function E_(t){return t.tag===5||t.tag===3||t.tag===4}function bm(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||E_(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function sh(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=Ul));else if(r!==4&&(t=t.child,t!==null))for(sh(t,e,n),t=t.sibling;t!==null;)sh(t,e,n),t=t.sibling}function oh(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(r!==4&&(t=t.child,t!==null))for(oh(t,e,n),t=t.sibling;t!==null;)oh(t,e,n),t=t.sibling}var Ze=null,rn=!1;function ir(t,e,n){for(n=n.child;n!==null;)T_(t,e,n),n=n.sibling}function T_(t,e,n){if(vn&&typeof vn.onCommitFiberUnmount=="function")try{vn.onCommitFiberUnmount(Au,n)}catch{}switch(n.tag){case 5:pt||qi(n,e);case 6:var r=Ze,i=rn;Ze=null,ir(t,e,n),Ze=r,rn=i,Ze!==null&&(rn?(t=Ze,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Ze.removeChild(n.stateNode));break;case 18:Ze!==null&&(rn?(t=Ze,n=n.stateNode,t.nodeType===8?Hc(t.parentNode,n):t.nodeType===1&&Hc(t,n),Mo(t)):Hc(Ze,n.stateNode));break;case 4:r=Ze,i=rn,Ze=n.stateNode.containerInfo,rn=!0,ir(t,e,n),Ze=r,rn=i;break;case 0:case 11:case 14:case 15:if(!pt&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var s=i,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&rh(n,e,o),i=i.next}while(i!==r)}ir(t,e,n);break;case 1:if(!pt&&(qi(n,e),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(l){Ne(n,e,l)}ir(t,e,n);break;case 21:ir(t,e,n);break;case 22:n.mode&1?(pt=(r=pt)||n.memoizedState!==null,ir(t,e,n),pt=r):ir(t,e,n);break;default:ir(t,e,n)}}function Am(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new vI),e.forEach(function(r){var i=bI.bind(null,t,r);n.has(r)||(n.add(r),r.then(i,i))})}}function tn(t,e){var n=e.deletions;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];try{var s=t,o=e,l=o;e:for(;l!==null;){switch(l.tag){case 5:Ze=l.stateNode,rn=!1;break e;case 3:Ze=l.stateNode.containerInfo,rn=!0;break e;case 4:Ze=l.stateNode.containerInfo,rn=!0;break e}l=l.return}if(Ze===null)throw Error($(160));T_(s,o,i),Ze=null,rn=!1;var u=i.alternate;u!==null&&(u.return=null),i.return=null}catch(c){Ne(i,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)S_(e,t),e=e.sibling}function S_(t,e){var n=t.alternate,r=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(tn(e,t),fn(t),r&4){try{To(3,t,t.return),Lu(3,t)}catch(x){Ne(t,t.return,x)}try{To(5,t,t.return)}catch(x){Ne(t,t.return,x)}}break;case 1:tn(e,t),fn(t),r&512&&n!==null&&qi(n,n.return);break;case 5:if(tn(e,t),fn(t),r&512&&n!==null&&qi(n,n.return),t.flags&32){var i=t.stateNode;try{Do(i,"")}catch(x){Ne(t,t.return,x)}}if(r&4&&(i=t.stateNode,i!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,l=t.type,u=t.updateQueue;if(t.updateQueue=null,u!==null)try{l==="input"&&s.type==="radio"&&s.name!=null&&Hv(i,s),Rd(l,o);var c=Rd(l,s);for(o=0;o<u.length;o+=2){var f=u[o],m=u[o+1];f==="style"?Yv(i,m):f==="dangerouslySetInnerHTML"?Gv(i,m):f==="children"?Do(i,m):Kh(i,f,m,c)}switch(l){case"input":xd(i,s);break;case"textarea":qv(i,s);break;case"select":var g=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!s.multiple;var _=s.value;_!=null?Gi(i,!!s.multiple,_,!1):g!==!!s.multiple&&(s.defaultValue!=null?Gi(i,!!s.multiple,s.defaultValue,!0):Gi(i,!!s.multiple,s.multiple?[]:"",!1))}i[Uo]=s}catch(x){Ne(t,t.return,x)}}break;case 6:if(tn(e,t),fn(t),r&4){if(t.stateNode===null)throw Error($(162));i=t.stateNode,s=t.memoizedProps;try{i.nodeValue=s}catch(x){Ne(t,t.return,x)}}break;case 3:if(tn(e,t),fn(t),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Mo(e.containerInfo)}catch(x){Ne(t,t.return,x)}break;case 4:tn(e,t),fn(t);break;case 13:tn(e,t),fn(t),i=t.child,i.flags&8192&&(s=i.memoizedState!==null,i.stateNode.isHidden=s,!s||i.alternate!==null&&i.alternate.memoizedState!==null||(Cf=Le())),r&4&&Am(t);break;case 22:if(f=n!==null&&n.memoizedState!==null,t.mode&1?(pt=(c=pt)||f,tn(e,t),pt=c):tn(e,t),fn(t),r&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!f&&t.mode&1)for(q=t,f=t.child;f!==null;){for(m=q=f;q!==null;){switch(g=q,_=g.child,g.tag){case 0:case 11:case 14:case 15:To(4,g,g.return);break;case 1:qi(g,g.return);var b=g.stateNode;if(typeof b.componentWillUnmount=="function"){r=g,n=g.return;try{e=r,b.props=e.memoizedProps,b.state=e.memoizedState,b.componentWillUnmount()}catch(x){Ne(r,n,x)}}break;case 5:qi(g,g.return);break;case 22:if(g.memoizedState!==null){Pm(m);continue}}_!==null?(_.return=g,q=_):Pm(m)}f=f.sibling}e:for(f=null,m=t;;){if(m.tag===5){if(f===null){f=m;try{i=m.stateNode,c?(s=i.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(l=m.stateNode,u=m.memoizedProps.style,o=u!=null&&u.hasOwnProperty("display")?u.display:null,l.style.display=Qv("display",o))}catch(x){Ne(t,t.return,x)}}}else if(m.tag===6){if(f===null)try{m.stateNode.nodeValue=c?"":m.memoizedProps}catch(x){Ne(t,t.return,x)}}else if((m.tag!==22&&m.tag!==23||m.memoizedState===null||m===t)&&m.child!==null){m.child.return=m,m=m.child;continue}if(m===t)break e;for(;m.sibling===null;){if(m.return===null||m.return===t)break e;f===m&&(f=null),m=m.return}f===m&&(f=null),m.sibling.return=m.return,m=m.sibling}}break;case 19:tn(e,t),fn(t),r&4&&Am(t);break;case 21:break;default:tn(e,t),fn(t)}}function fn(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(E_(n)){var r=n;break e}n=n.return}throw Error($(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(Do(i,""),r.flags&=-33);var s=bm(t);oh(t,s,i);break;case 3:case 4:var o=r.stateNode.containerInfo,l=bm(t);sh(t,l,o);break;default:throw Error($(161))}}catch(u){Ne(t,t.return,u)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function wI(t,e,n){q=t,I_(t)}function I_(t,e,n){for(var r=(t.mode&1)!==0;q!==null;){var i=q,s=i.child;if(i.tag===22&&r){var o=i.memoizedState!==null||Za;if(!o){var l=i.alternate,u=l!==null&&l.memoizedState!==null||pt;l=Za;var c=pt;if(Za=o,(pt=u)&&!c)for(q=i;q!==null;)o=q,u=o.child,o.tag===22&&o.memoizedState!==null?Dm(i):u!==null?(u.return=o,q=u):Dm(i);for(;s!==null;)q=s,I_(s),s=s.sibling;q=i,Za=l,pt=c}Rm(t)}else i.subtreeFlags&8772&&s!==null?(s.return=i,q=s):Rm(t)}}function Rm(t){for(;q!==null;){var e=q;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:pt||Lu(5,e);break;case 1:var r=e.stateNode;if(e.flags&4&&!pt)if(n===null)r.componentDidMount();else{var i=e.elementType===e.type?n.memoizedProps:nn(e.type,n.memoizedProps);r.componentDidUpdate(i,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&pm(e,s,r);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}pm(e,o,n)}break;case 5:var l=e.stateNode;if(n===null&&e.flags&4){n=l;var u=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&n.focus();break;case"img":u.src&&(n.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var f=c.memoizedState;if(f!==null){var m=f.dehydrated;m!==null&&Mo(m)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error($(163))}pt||e.flags&512&&ih(e)}catch(g){Ne(e,e.return,g)}}if(e===t){q=null;break}if(n=e.sibling,n!==null){n.return=e.return,q=n;break}q=e.return}}function Pm(t){for(;q!==null;){var e=q;if(e===t){q=null;break}var n=e.sibling;if(n!==null){n.return=e.return,q=n;break}q=e.return}}function Dm(t){for(;q!==null;){var e=q;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{Lu(4,e)}catch(u){Ne(e,n,u)}break;case 1:var r=e.stateNode;if(typeof r.componentDidMount=="function"){var i=e.return;try{r.componentDidMount()}catch(u){Ne(e,i,u)}}var s=e.return;try{ih(e)}catch(u){Ne(e,s,u)}break;case 5:var o=e.return;try{ih(e)}catch(u){Ne(e,o,u)}}}catch(u){Ne(e,e.return,u)}if(e===t){q=null;break}var l=e.sibling;if(l!==null){l.return=e.return,q=l;break}q=e.return}}var EI=Math.ceil,Jl=er.ReactCurrentDispatcher,xf=er.ReactCurrentOwner,Qt=er.ReactCurrentBatchConfig,he=0,Qe=null,Fe=null,nt=0,Nt=0,Ki=jr(0),$e=0,Ko=null,ci=0,ju=0,kf=0,So=null,Ct=null,Cf=0,ps=1/0,Nn=null,Zl=!1,ah=null,Tr=null,el=!1,gr=null,eu=0,Io=0,lh=null,yl=-1,vl=0;function St(){return he&6?Le():yl!==-1?yl:yl=Le()}function Sr(t){return t.mode&1?he&2&&nt!==0?nt&-nt:iI.transition!==null?(vl===0&&(vl=l0()),vl):(t=ye,t!==0||(t=window.event,t=t===void 0?16:g0(t.type)),t):1}function un(t,e,n,r){if(50<Io)throw Io=0,lh=null,Error($(185));aa(t,n,r),(!(he&2)||t!==Qe)&&(t===Qe&&(!(he&2)&&(ju|=n),$e===4&&ur(t,nt)),Pt(t,r),n===1&&he===0&&!(e.mode&1)&&(ps=Le()+500,Ou&&Fr()))}function Pt(t,e){var n=t.callbackNode;iS(t,e);var r=Ll(t,t===Qe?nt:0);if(r===0)n!==null&&Ug(n),t.callbackNode=null,t.callbackPriority=0;else if(e=r&-r,t.callbackPriority!==e){if(n!=null&&Ug(n),e===1)t.tag===0?rI(Nm.bind(null,t)):O0(Nm.bind(null,t)),ZS(function(){!(he&6)&&Fr()}),n=null;else{switch(u0(r)){case 1:n=Jh;break;case 4:n=o0;break;case 16:n=Ml;break;case 536870912:n=a0;break;default:n=Ml}n=D_(n,x_.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function x_(t,e){if(yl=-1,vl=0,he&6)throw Error($(327));var n=t.callbackNode;if(Zi()&&t.callbackNode!==n)return null;var r=Ll(t,t===Qe?nt:0);if(r===0)return null;if(r&30||r&t.expiredLanes||e)e=tu(t,r);else{e=r;var i=he;he|=2;var s=C_();(Qe!==t||nt!==e)&&(Nn=null,ps=Le()+500,ii(t,e));do try{II();break}catch(l){k_(t,l)}while(!0);hf(),Jl.current=s,he=i,Fe!==null?e=0:(Qe=null,nt=0,e=$e)}if(e!==0){if(e===2&&(i=Vd(t),i!==0&&(r=i,e=uh(t,i))),e===1)throw n=Ko,ii(t,0),ur(t,r),Pt(t,Le()),n;if(e===6)ur(t,r);else{if(i=t.current.alternate,!(r&30)&&!TI(i)&&(e=tu(t,r),e===2&&(s=Vd(t),s!==0&&(r=s,e=uh(t,s))),e===1))throw n=Ko,ii(t,0),ur(t,r),Pt(t,Le()),n;switch(t.finishedWork=i,t.finishedLanes=r,e){case 0:case 1:throw Error($(345));case 2:Yr(t,Ct,Nn);break;case 3:if(ur(t,r),(r&130023424)===r&&(e=Cf+500-Le(),10<e)){if(Ll(t,0)!==0)break;if(i=t.suspendedLanes,(i&r)!==r){St(),t.pingedLanes|=t.suspendedLanes&i;break}t.timeoutHandle=$d(Yr.bind(null,t,Ct,Nn),e);break}Yr(t,Ct,Nn);break;case 4:if(ur(t,r),(r&4194240)===r)break;for(e=t.eventTimes,i=-1;0<r;){var o=31-ln(r);s=1<<o,o=e[o],o>i&&(i=o),r&=~s}if(r=i,r=Le()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*EI(r/1960))-r,10<r){t.timeoutHandle=$d(Yr.bind(null,t,Ct,Nn),r);break}Yr(t,Ct,Nn);break;case 5:Yr(t,Ct,Nn);break;default:throw Error($(329))}}}return Pt(t,Le()),t.callbackNode===n?x_.bind(null,t):null}function uh(t,e){var n=So;return t.current.memoizedState.isDehydrated&&(ii(t,e).flags|=256),t=tu(t,e),t!==2&&(e=Ct,Ct=n,e!==null&&ch(e)),t}function ch(t){Ct===null?Ct=t:Ct.push.apply(Ct,t)}function TI(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var i=n[r],s=i.getSnapshot;i=i.value;try{if(!dn(s(),i))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function ur(t,e){for(e&=~kf,e&=~ju,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-ln(e),r=1<<n;t[n]=-1,e&=~r}}function Nm(t){if(he&6)throw Error($(327));Zi();var e=Ll(t,0);if(!(e&1))return Pt(t,Le()),null;var n=tu(t,e);if(t.tag!==0&&n===2){var r=Vd(t);r!==0&&(e=r,n=uh(t,r))}if(n===1)throw n=Ko,ii(t,0),ur(t,e),Pt(t,Le()),n;if(n===6)throw Error($(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,Yr(t,Ct,Nn),Pt(t,Le()),null}function bf(t,e){var n=he;he|=1;try{return t(e)}finally{he=n,he===0&&(ps=Le()+500,Ou&&Fr())}}function di(t){gr!==null&&gr.tag===0&&!(he&6)&&Zi();var e=he;he|=1;var n=Qt.transition,r=ye;try{if(Qt.transition=null,ye=1,t)return t()}finally{ye=r,Qt.transition=n,he=e,!(he&6)&&Fr()}}function Af(){Nt=Ki.current,Ie(Ki)}function ii(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,JS(n)),Fe!==null)for(n=Fe.return;n!==null;){var r=n;switch(uf(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Bl();break;case 3:hs(),Ie(At),Ie(yt),vf();break;case 5:yf(r);break;case 4:hs();break;case 13:Ie(Ce);break;case 19:Ie(Ce);break;case 10:ff(r.type._context);break;case 22:case 23:Af()}n=n.return}if(Qe=t,Fe=t=Ir(t.current,null),nt=Nt=e,$e=0,Ko=null,kf=ju=ci=0,Ct=So=null,Zr!==null){for(e=0;e<Zr.length;e++)if(n=Zr[e],r=n.interleaved,r!==null){n.interleaved=null;var i=r.next,s=n.pending;if(s!==null){var o=s.next;s.next=i,r.next=o}n.pending=r}Zr=null}return t}function k_(t,e){do{var n=Fe;try{if(hf(),pl.current=Xl,Yl){for(var r=Ae.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}Yl=!1}if(ui=0,Ge=Ue=Ae=null,Eo=!1,Wo=0,xf.current=null,n===null||n.return===null){$e=1,Ko=e,Fe=null;break}e:{var s=t,o=n.return,l=n,u=e;if(e=nt,l.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var c=u,f=l,m=f.tag;if(!(f.mode&1)&&(m===0||m===11||m===15)){var g=f.alternate;g?(f.updateQueue=g.updateQueue,f.memoizedState=g.memoizedState,f.lanes=g.lanes):(f.updateQueue=null,f.memoizedState=null)}var _=wm(o);if(_!==null){_.flags&=-257,Em(_,o,l,s,e),_.mode&1&&_m(s,c,e),e=_,u=c;var b=e.updateQueue;if(b===null){var x=new Set;x.add(u),e.updateQueue=x}else b.add(u);break e}else{if(!(e&1)){_m(s,c,e),Rf();break e}u=Error($(426))}}else if(ke&&l.mode&1){var O=wm(o);if(O!==null){!(O.flags&65536)&&(O.flags|=256),Em(O,o,l,s,e),cf(fs(u,l));break e}}s=u=fs(u,l),$e!==4&&($e=2),So===null?So=[s]:So.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var k=u_(s,u,e);fm(s,k);break e;case 1:l=u;var E=s.type,A=s.stateNode;if(!(s.flags&128)&&(typeof E.getDerivedStateFromError=="function"||A!==null&&typeof A.componentDidCatch=="function"&&(Tr===null||!Tr.has(A)))){s.flags|=65536,e&=-e,s.lanes|=e;var V=c_(s,l,e);fm(s,V);break e}}s=s.return}while(s!==null)}A_(n)}catch(F){e=F,Fe===n&&n!==null&&(Fe=n=n.return);continue}break}while(!0)}function C_(){var t=Jl.current;return Jl.current=Xl,t===null?Xl:t}function Rf(){($e===0||$e===3||$e===2)&&($e=4),Qe===null||!(ci&268435455)&&!(ju&268435455)||ur(Qe,nt)}function tu(t,e){var n=he;he|=2;var r=C_();(Qe!==t||nt!==e)&&(Nn=null,ii(t,e));do try{SI();break}catch(i){k_(t,i)}while(!0);if(hf(),he=n,Jl.current=r,Fe!==null)throw Error($(261));return Qe=null,nt=0,$e}function SI(){for(;Fe!==null;)b_(Fe)}function II(){for(;Fe!==null&&!QT();)b_(Fe)}function b_(t){var e=P_(t.alternate,t,Nt);t.memoizedProps=t.pendingProps,e===null?A_(t):Fe=e,xf.current=null}function A_(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=yI(n,e),n!==null){n.flags&=32767,Fe=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{$e=6,Fe=null;return}}else if(n=mI(n,e,Nt),n!==null){Fe=n;return}if(e=e.sibling,e!==null){Fe=e;return}Fe=e=t}while(e!==null);$e===0&&($e=5)}function Yr(t,e,n){var r=ye,i=Qt.transition;try{Qt.transition=null,ye=1,xI(t,e,n,r)}finally{Qt.transition=i,ye=r}return null}function xI(t,e,n,r){do Zi();while(gr!==null);if(he&6)throw Error($(327));n=t.finishedWork;var i=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error($(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(sS(t,s),t===Qe&&(Fe=Qe=null,nt=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||el||(el=!0,D_(Ml,function(){return Zi(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Qt.transition,Qt.transition=null;var o=ye;ye=1;var l=he;he|=4,xf.current=null,_I(t,n),S_(n,t),HS(Ud),jl=!!zd,Ud=zd=null,t.current=n,wI(n),YT(),he=l,ye=o,Qt.transition=s}else t.current=n;if(el&&(el=!1,gr=t,eu=i),s=t.pendingLanes,s===0&&(Tr=null),ZT(n.stateNode),Pt(t,Le()),e!==null)for(r=t.onRecoverableError,n=0;n<e.length;n++)i=e[n],r(i.value,{componentStack:i.stack,digest:i.digest});if(Zl)throw Zl=!1,t=ah,ah=null,t;return eu&1&&t.tag!==0&&Zi(),s=t.pendingLanes,s&1?t===lh?Io++:(Io=0,lh=t):Io=0,Fr(),null}function Zi(){if(gr!==null){var t=u0(eu),e=Qt.transition,n=ye;try{if(Qt.transition=null,ye=16>t?16:t,gr===null)var r=!1;else{if(t=gr,gr=null,eu=0,he&6)throw Error($(331));var i=he;for(he|=4,q=t.current;q!==null;){var s=q,o=s.child;if(q.flags&16){var l=s.deletions;if(l!==null){for(var u=0;u<l.length;u++){var c=l[u];for(q=c;q!==null;){var f=q;switch(f.tag){case 0:case 11:case 15:To(8,f,s)}var m=f.child;if(m!==null)m.return=f,q=m;else for(;q!==null;){f=q;var g=f.sibling,_=f.return;if(w_(f),f===c){q=null;break}if(g!==null){g.return=_,q=g;break}q=_}}}var b=s.alternate;if(b!==null){var x=b.child;if(x!==null){b.child=null;do{var O=x.sibling;x.sibling=null,x=O}while(x!==null)}}q=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,q=o;else e:for(;q!==null;){if(s=q,s.flags&2048)switch(s.tag){case 0:case 11:case 15:To(9,s,s.return)}var k=s.sibling;if(k!==null){k.return=s.return,q=k;break e}q=s.return}}var E=t.current;for(q=E;q!==null;){o=q;var A=o.child;if(o.subtreeFlags&2064&&A!==null)A.return=o,q=A;else e:for(o=E;q!==null;){if(l=q,l.flags&2048)try{switch(l.tag){case 0:case 11:case 15:Lu(9,l)}}catch(F){Ne(l,l.return,F)}if(l===o){q=null;break e}var V=l.sibling;if(V!==null){V.return=l.return,q=V;break e}q=l.return}}if(he=i,Fr(),vn&&typeof vn.onPostCommitFiberRoot=="function")try{vn.onPostCommitFiberRoot(Au,t)}catch{}r=!0}return r}finally{ye=n,Qt.transition=e}}return!1}function Om(t,e,n){e=fs(n,e),e=u_(t,e,1),t=Er(t,e,1),e=St(),t!==null&&(aa(t,1,e),Pt(t,e))}function Ne(t,e,n){if(t.tag===3)Om(t,t,n);else for(;e!==null;){if(e.tag===3){Om(e,t,n);break}else if(e.tag===1){var r=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Tr===null||!Tr.has(r))){t=fs(n,t),t=c_(e,t,1),e=Er(e,t,1),t=St(),e!==null&&(aa(e,1,t),Pt(e,t));break}}e=e.return}}function kI(t,e,n){var r=t.pingCache;r!==null&&r.delete(e),e=St(),t.pingedLanes|=t.suspendedLanes&n,Qe===t&&(nt&n)===n&&($e===4||$e===3&&(nt&130023424)===nt&&500>Le()-Cf?ii(t,0):kf|=n),Pt(t,e)}function R_(t,e){e===0&&(t.mode&1?(e=Wa,Wa<<=1,!(Wa&130023424)&&(Wa=4194304)):e=1);var n=St();t=Gn(t,e),t!==null&&(aa(t,e,n),Pt(t,n))}function CI(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),R_(t,n)}function bI(t,e){var n=0;switch(t.tag){case 13:var r=t.stateNode,i=t.memoizedState;i!==null&&(n=i.retryLane);break;case 19:r=t.stateNode;break;default:throw Error($(314))}r!==null&&r.delete(e),R_(t,n)}var P_;P_=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||At.current)bt=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return bt=!1,gI(t,e,n);bt=!!(t.flags&131072)}else bt=!1,ke&&e.flags&1048576&&V0(e,Hl,e.index);switch(e.lanes=0,e.tag){case 2:var r=e.type;ml(t,e),t=e.pendingProps;var i=us(e,yt.current);Ji(e,n),i=wf(null,e,r,t,i,n);var s=Ef();return e.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,Rt(r)?(s=!0,$l(e)):s=!1,e.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,gf(e),i.updater=Mu,e.stateNode=i,i._reactInternals=e,Yd(e,r,t,n),e=Zd(null,e,r,!0,s,n)):(e.tag=0,ke&&s&&lf(e),Tt(null,e,i,n),e=e.child),e;case 16:r=e.elementType;e:{switch(ml(t,e),t=e.pendingProps,i=r._init,r=i(r._payload),e.type=r,i=e.tag=RI(r),t=nn(r,t),i){case 0:e=Jd(null,e,r,t,n);break e;case 1:e=Im(null,e,r,t,n);break e;case 11:e=Tm(null,e,r,t,n);break e;case 14:e=Sm(null,e,r,nn(r.type,t),n);break e}throw Error($(306,r,""))}return e;case 0:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:nn(r,i),Jd(t,e,r,i,n);case 1:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:nn(r,i),Im(t,e,r,i,n);case 3:e:{if(p_(e),t===null)throw Error($(387));r=e.pendingProps,s=e.memoizedState,i=s.element,U0(t,e),Gl(e,r,null,n);var o=e.memoizedState;if(r=o.element,s.isDehydrated)if(s={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){i=fs(Error($(423)),e),e=xm(t,e,r,n,i);break e}else if(r!==i){i=fs(Error($(424)),e),e=xm(t,e,r,n,i);break e}else for(Vt=wr(e.stateNode.containerInfo.firstChild),Mt=e,ke=!0,sn=null,n=F0(e,null,r,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(cs(),r===i){e=Qn(t,e,n);break e}Tt(t,e,r,n)}e=e.child}return e;case 5:return B0(e),t===null&&Kd(e),r=e.type,i=e.pendingProps,s=t!==null?t.memoizedProps:null,o=i.children,Bd(r,i)?o=null:s!==null&&Bd(r,s)&&(e.flags|=32),f_(t,e),Tt(t,e,o,n),e.child;case 6:return t===null&&Kd(e),null;case 13:return g_(t,e,n);case 4:return mf(e,e.stateNode.containerInfo),r=e.pendingProps,t===null?e.child=ds(e,null,r,n):Tt(t,e,r,n),e.child;case 11:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:nn(r,i),Tm(t,e,r,i,n);case 7:return Tt(t,e,e.pendingProps,n),e.child;case 8:return Tt(t,e,e.pendingProps.children,n),e.child;case 12:return Tt(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(r=e.type._context,i=e.pendingProps,s=e.memoizedProps,o=i.value,we(ql,r._currentValue),r._currentValue=o,s!==null)if(dn(s.value,o)){if(s.children===i.children&&!At.current){e=Qn(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var l=s.dependencies;if(l!==null){o=s.child;for(var u=l.firstContext;u!==null;){if(u.context===r){if(s.tag===1){u=Bn(-1,n&-n),u.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var f=c.pending;f===null?u.next=u:(u.next=f.next,f.next=u),c.pending=u}}s.lanes|=n,u=s.alternate,u!==null&&(u.lanes|=n),Gd(s.return,n,e),l.lanes|=n;break}u=u.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error($(341));o.lanes|=n,l=o.alternate,l!==null&&(l.lanes|=n),Gd(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}Tt(t,e,i.children,n),e=e.child}return e;case 9:return i=e.type,r=e.pendingProps.children,Ji(e,n),i=Xt(i),r=r(i),e.flags|=1,Tt(t,e,r,n),e.child;case 14:return r=e.type,i=nn(r,e.pendingProps),i=nn(r.type,i),Sm(t,e,r,i,n);case 15:return d_(t,e,e.type,e.pendingProps,n);case 17:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:nn(r,i),ml(t,e),e.tag=1,Rt(r)?(t=!0,$l(e)):t=!1,Ji(e,n),l_(e,r,i),Yd(e,r,i,n),Zd(null,e,r,!0,t,n);case 19:return m_(t,e,n);case 22:return h_(t,e,n)}throw Error($(156,e.tag))};function D_(t,e){return s0(t,e)}function AI(t,e,n,r){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Gt(t,e,n,r){return new AI(t,e,n,r)}function Pf(t){return t=t.prototype,!(!t||!t.isReactComponent)}function RI(t){if(typeof t=="function")return Pf(t)?1:0;if(t!=null){if(t=t.$$typeof,t===Qh)return 11;if(t===Yh)return 14}return 2}function Ir(t,e){var n=t.alternate;return n===null?(n=Gt(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function _l(t,e,n,r,i,s){var o=2;if(r=t,typeof t=="function")Pf(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case Li:return si(n.children,i,s,e);case Gh:o=8,i|=8;break;case wd:return t=Gt(12,n,e,i|2),t.elementType=wd,t.lanes=s,t;case Ed:return t=Gt(13,n,e,i),t.elementType=Ed,t.lanes=s,t;case Td:return t=Gt(19,n,e,i),t.elementType=Td,t.lanes=s,t;case Bv:return Fu(n,i,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case zv:o=10;break e;case Uv:o=9;break e;case Qh:o=11;break e;case Yh:o=14;break e;case or:o=16,r=null;break e}throw Error($(130,t==null?t:typeof t,""))}return e=Gt(o,n,e,i),e.elementType=t,e.type=r,e.lanes=s,e}function si(t,e,n,r){return t=Gt(7,t,r,e),t.lanes=n,t}function Fu(t,e,n,r){return t=Gt(22,t,r,e),t.elementType=Bv,t.lanes=n,t.stateNode={isHidden:!1},t}function Zc(t,e,n){return t=Gt(6,t,null,e),t.lanes=n,t}function ed(t,e,n){return e=Gt(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function PI(t,e,n,r,i){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Oc(0),this.expirationTimes=Oc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Oc(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function Df(t,e,n,r,i,s,o,l,u){return t=new PI(t,e,n,l,u),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Gt(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},gf(s),t}function DI(t,e,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Mi,key:r==null?null:""+r,children:t,containerInfo:e,implementation:n}}function N_(t){if(!t)return Ar;t=t._reactInternals;e:{if(wi(t)!==t||t.tag!==1)throw Error($(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(Rt(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error($(171))}if(t.tag===1){var n=t.type;if(Rt(n))return N0(t,n,e)}return e}function O_(t,e,n,r,i,s,o,l,u){return t=Df(n,r,!0,t,i,s,o,l,u),t.context=N_(null),n=t.current,r=St(),i=Sr(n),s=Bn(r,i),s.callback=e??null,Er(n,s,i),t.current.lanes=i,aa(t,i,r),Pt(t,r),t}function zu(t,e,n,r){var i=e.current,s=St(),o=Sr(i);return n=N_(n),e.context===null?e.context=n:e.pendingContext=n,e=Bn(s,o),e.payload={element:t},r=r===void 0?null:r,r!==null&&(e.callback=r),t=Er(i,e,o),t!==null&&(un(t,i,o,s),fl(t,i,o)),o}function nu(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Vm(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function Nf(t,e){Vm(t,e),(t=t.alternate)&&Vm(t,e)}function NI(){return null}var V_=typeof reportError=="function"?reportError:function(t){console.error(t)};function Of(t){this._internalRoot=t}Uu.prototype.render=Of.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error($(409));zu(t,e,null,null)};Uu.prototype.unmount=Of.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;di(function(){zu(null,t,null,null)}),e[Kn]=null}};function Uu(t){this._internalRoot=t}Uu.prototype.unstable_scheduleHydration=function(t){if(t){var e=h0();t={blockedOn:null,target:t,priority:e};for(var n=0;n<lr.length&&e!==0&&e<lr[n].priority;n++);lr.splice(n,0,t),n===0&&p0(t)}};function Vf(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Bu(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Mm(){}function OI(t,e,n,r,i){if(i){if(typeof r=="function"){var s=r;r=function(){var c=nu(o);s.call(c)}}var o=O_(e,r,t,0,null,!1,!1,"",Mm);return t._reactRootContainer=o,t[Kn]=o.current,Fo(t.nodeType===8?t.parentNode:t),di(),o}for(;i=t.lastChild;)t.removeChild(i);if(typeof r=="function"){var l=r;r=function(){var c=nu(u);l.call(c)}}var u=Df(t,0,!1,null,null,!1,!1,"",Mm);return t._reactRootContainer=u,t[Kn]=u.current,Fo(t.nodeType===8?t.parentNode:t),di(function(){zu(e,u,n,r)}),u}function $u(t,e,n,r,i){var s=n._reactRootContainer;if(s){var o=s;if(typeof i=="function"){var l=i;i=function(){var u=nu(o);l.call(u)}}zu(e,o,t,i)}else o=OI(n,e,t,i,r);return nu(o)}c0=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=oo(e.pendingLanes);n!==0&&(Zh(e,n|1),Pt(e,Le()),!(he&6)&&(ps=Le()+500,Fr()))}break;case 13:di(function(){var r=Gn(t,1);if(r!==null){var i=St();un(r,t,1,i)}}),Nf(t,1)}};ef=function(t){if(t.tag===13){var e=Gn(t,134217728);if(e!==null){var n=St();un(e,t,134217728,n)}Nf(t,134217728)}};d0=function(t){if(t.tag===13){var e=Sr(t),n=Gn(t,e);if(n!==null){var r=St();un(n,t,e,r)}Nf(t,e)}};h0=function(){return ye};f0=function(t,e){var n=ye;try{return ye=t,e()}finally{ye=n}};Dd=function(t,e,n){switch(e){case"input":if(xd(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var r=n[e];if(r!==t&&r.form===t.form){var i=Nu(r);if(!i)throw Error($(90));Wv(r),xd(r,i)}}}break;case"textarea":qv(t,n);break;case"select":e=n.value,e!=null&&Gi(t,!!n.multiple,e,!1)}};Zv=bf;e0=di;var VI={usingClientEntryPoint:!1,Events:[ua,Ui,Nu,Xv,Jv,bf]},ro={findFiberByHostInstance:Jr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},MI={bundleType:ro.bundleType,version:ro.version,rendererPackageName:ro.rendererPackageName,rendererConfig:ro.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:er.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=r0(t),t===null?null:t.stateNode},findFiberByHostInstance:ro.findFiberByHostInstance||NI,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var tl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!tl.isDisabled&&tl.supportsFiber)try{Au=tl.inject(MI),vn=tl}catch{}}Ft.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=VI;Ft.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Vf(e))throw Error($(200));return DI(t,e,null,n)};Ft.createRoot=function(t,e){if(!Vf(t))throw Error($(299));var n=!1,r="",i=V_;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(r=e.identifierPrefix),e.onRecoverableError!==void 0&&(i=e.onRecoverableError)),e=Df(t,1,!1,null,null,n,!1,r,i),t[Kn]=e.current,Fo(t.nodeType===8?t.parentNode:t),new Of(e)};Ft.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error($(188)):(t=Object.keys(t).join(","),Error($(268,t)));return t=r0(e),t=t===null?null:t.stateNode,t};Ft.flushSync=function(t){return di(t)};Ft.hydrate=function(t,e,n){if(!Bu(e))throw Error($(200));return $u(null,t,e,!0,n)};Ft.hydrateRoot=function(t,e,n){if(!Vf(t))throw Error($(405));var r=n!=null&&n.hydratedSources||null,i=!1,s="",o=V_;if(n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=O_(e,null,t,1,n??null,i,!1,s,o),t[Kn]=e.current,Fo(t),r)for(t=0;t<r.length;t++)n=r[t],i=n._getVersion,i=i(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,i]:e.mutableSourceEagerHydrationData.push(n,i);return new Uu(e)};Ft.render=function(t,e,n){if(!Bu(e))throw Error($(200));return $u(null,t,e,!1,n)};Ft.unmountComponentAtNode=function(t){if(!Bu(t))throw Error($(40));return t._reactRootContainer?(di(function(){$u(null,null,t,!1,function(){t._reactRootContainer=null,t[Kn]=null})}),!0):!1};Ft.unstable_batchedUpdates=bf;Ft.unstable_renderSubtreeIntoContainer=function(t,e,n,r){if(!Bu(n))throw Error($(200));if(t==null||t._reactInternals===void 0)throw Error($(38));return $u(t,e,n,!1,r)};Ft.version="18.3.1-next-f1338f8080-20240426";function M_(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(M_)}catch(t){console.error(t)}}M_(),Mv.exports=Ft;var LI=Mv.exports,Lm=LI;vd.createRoot=Lm.createRoot,vd.hydrateRoot=Lm.hydrateRoot;/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jI=()=>{};var jm={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const L_=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},FI=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],o=t[n++],l=t[n++],u=((i&7)<<18|(s&63)<<12|(o&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{const s=t[n++],o=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},j_={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],o=i+1<t.length,l=o?t[i+1]:0,u=i+2<t.length,c=u?t[i+2]:0,f=s>>2,m=(s&3)<<4|l>>4;let g=(l&15)<<2|c>>6,_=c&63;u||(_=64,o||(g=64)),r.push(n[f],n[m],n[g],n[_])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(L_(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):FI(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],l=i<t.length?n[t.charAt(i)]:0;++i;const c=i<t.length?n[t.charAt(i)]:64;++i;const m=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||l==null||c==null||m==null)throw new zI;const g=s<<2|l>>4;if(r.push(g),c!==64){const _=l<<4&240|c>>2;if(r.push(_),m!==64){const b=c<<6&192|m;r.push(b)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class zI extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const UI=function(t){const e=L_(t);return j_.encodeByteArray(e,!0)},ru=function(t){return UI(t).replace(/\./g,"")},F_=function(t){try{return j_.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function BI(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $I=()=>BI().__FIREBASE_DEFAULTS__,WI=()=>{if(typeof process>"u"||typeof jm>"u")return;const t=jm.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},HI=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&F_(t[1]);return e&&JSON.parse(e)},Wu=()=>{try{return jI()||$I()||WI()||HI()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},z_=t=>{var e,n;return(n=(e=Wu())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},qI=t=>{const e=z_(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},U_=()=>{var t;return(t=Wu())===null||t===void 0?void 0:t.config},B_=t=>{var e;return(e=Wu())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class KI{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xs(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function $_(t){return(await fetch(t,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function GI(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",i=t.iat||0,s=t.sub||t.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},t);return[ru(JSON.stringify(n)),ru(JSON.stringify(o)),""].join(".")}const xo={};function QI(){const t={prod:[],emulator:[]};for(const e of Object.keys(xo))xo[e]?t.emulator.push(e):t.prod.push(e);return t}function YI(t){let e=document.getElementById(t),n=!1;return e||(e=document.createElement("div"),e.setAttribute("id",t),n=!0),{created:n,element:e}}let Fm=!1;function W_(t,e){if(typeof window>"u"||typeof document>"u"||!xs(window.location.host)||xo[t]===e||xo[t]||Fm)return;xo[t]=e;function n(g){return`__firebase__banner__${g}`}const r="__firebase__banner",s=QI().prod.length>0;function o(){const g=document.getElementById(r);g&&g.remove()}function l(g){g.style.display="flex",g.style.background="#7faaf0",g.style.position="fixed",g.style.bottom="5px",g.style.left="5px",g.style.padding=".5em",g.style.borderRadius="5px",g.style.alignItems="center"}function u(g,_){g.setAttribute("width","24"),g.setAttribute("id",_),g.setAttribute("height","24"),g.setAttribute("viewBox","0 0 24 24"),g.setAttribute("fill","none"),g.style.marginLeft="-6px"}function c(){const g=document.createElement("span");return g.style.cursor="pointer",g.style.marginLeft="16px",g.style.fontSize="24px",g.innerHTML=" &times;",g.onclick=()=>{Fm=!0,o()},g}function f(g,_){g.setAttribute("id",_),g.innerText="Learn more",g.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",g.setAttribute("target","__blank"),g.style.paddingLeft="5px",g.style.textDecoration="underline"}function m(){const g=YI(r),_=n("text"),b=document.getElementById(_)||document.createElement("span"),x=n("learnmore"),O=document.getElementById(x)||document.createElement("a"),k=n("preprendIcon"),E=document.getElementById(k)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(g.created){const A=g.element;l(A),f(O,x);const V=c();u(E,k),A.append(E,b,O,V),document.body.appendChild(A)}s?(b.innerText="Preview backend disconnected.",E.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(E.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,b.innerText="Preview backend running in this workspace."),b.setAttribute("id",_)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",m):m()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function XI(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(vt())}function JI(){var t;const e=(t=Wu())===null||t===void 0?void 0:t.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function ZI(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function ex(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function tx(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function nx(){const t=vt();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function rx(){return!JI()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function H_(){try{return typeof indexedDB=="object"}catch{return!1}}function q_(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(n){e(n)}})}function ix(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sx="FirebaseError";class An extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=sx,Object.setPrototypeOf(this,An.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ei.prototype.create)}}class Ei{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?ox(s,r):"Error",l=`${this.serviceName}: ${o} (${i}).`;return new An(i,l,r)}}function ox(t,e){return t.replace(ax,(n,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const ax=/\{\$([^}]+)}/g;function lx(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function hi(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],o=e[i];if(zm(s)&&zm(o)){if(!hi(s,o))return!1}else if(s!==o)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function zm(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function da(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function lo(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function uo(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function ux(t,e){const n=new cx(t,e);return n.subscribe.bind(n)}class cx{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");dx(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=td),i.error===void 0&&(i.error=td),i.complete===void 0&&(i.complete=td);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function dx(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function td(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function it(t){return t&&t._delegate?t._delegate:t}class hn{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xr="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hx{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new KI;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(px(e))try{this.getOrInitializeService({instanceIdentifier:Xr})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Xr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Xr){return this.instances.has(e)}getOptions(e=Xr){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(s);r===l&&o.resolve(i)}return i}onInit(e,n){var r;const i=this.normalizeInstanceIdentifier(n),s=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(i,s);const o=this.instances.get(i);return o&&e(o,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:fx(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Xr){return this.component?this.component.multipleInstances?e:Xr:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function fx(t){return t===Xr?void 0:t}function px(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gx{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new hx(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ie;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(ie||(ie={}));const mx={debug:ie.DEBUG,verbose:ie.VERBOSE,info:ie.INFO,warn:ie.WARN,error:ie.ERROR,silent:ie.SILENT},yx=ie.INFO,vx={[ie.DEBUG]:"log",[ie.VERBOSE]:"log",[ie.INFO]:"info",[ie.WARN]:"warn",[ie.ERROR]:"error"},_x=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=vx[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Mf{constructor(e){this.name=e,this._logLevel=yx,this._logHandler=_x,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ie))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?mx[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ie.DEBUG,...e),this._logHandler(this,ie.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ie.VERBOSE,...e),this._logHandler(this,ie.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ie.INFO,...e),this._logHandler(this,ie.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ie.WARN,...e),this._logHandler(this,ie.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ie.ERROR,...e),this._logHandler(this,ie.ERROR,...e)}}const wx=(t,e)=>e.some(n=>t instanceof n);let Um,Bm;function Ex(){return Um||(Um=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Tx(){return Bm||(Bm=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const K_=new WeakMap,dh=new WeakMap,G_=new WeakMap,nd=new WeakMap,Lf=new WeakMap;function Sx(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",o)},s=()=>{n($n(t.result)),i()},o=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&K_.set(n,t)}).catch(()=>{}),Lf.set(e,t),e}function Ix(t){if(dh.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",o),t.removeEventListener("abort",o)},s=()=>{n(),i()},o=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",o),t.addEventListener("abort",o)});dh.set(t,e)}let hh={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return dh.get(t);if(e==="objectStoreNames")return t.objectStoreNames||G_.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return $n(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function xx(t){hh=t(hh)}function kx(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(rd(this),e,...n);return G_.set(r,e.sort?e.sort():[e]),$n(r)}:Tx().includes(t)?function(...e){return t.apply(rd(this),e),$n(K_.get(this))}:function(...e){return $n(t.apply(rd(this),e))}}function Cx(t){return typeof t=="function"?kx(t):(t instanceof IDBTransaction&&Ix(t),wx(t,Ex())?new Proxy(t,hh):t)}function $n(t){if(t instanceof IDBRequest)return Sx(t);if(nd.has(t))return nd.get(t);const e=Cx(t);return e!==t&&(nd.set(t,e),Lf.set(e,t)),e}const rd=t=>Lf.get(t);function Hu(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(t,e),l=$n(o);return r&&o.addEventListener("upgradeneeded",u=>{r($n(o.result),u.oldVersion,u.newVersion,$n(o.transaction),u)}),n&&o.addEventListener("blocked",u=>n(u.oldVersion,u.newVersion,u)),l.then(u=>{s&&u.addEventListener("close",()=>s()),i&&u.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),l}function id(t,{blocked:e}={}){const n=indexedDB.deleteDatabase(t);return e&&n.addEventListener("blocked",r=>e(r.oldVersion,r)),$n(n).then(()=>{})}const bx=["get","getKey","getAll","getAllKeys","count"],Ax=["put","add","delete","clear"],sd=new Map;function $m(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(sd.get(e))return sd.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=Ax.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||bx.includes(n)))return;const s=async function(o,...l){const u=this.transaction(o,i?"readwrite":"readonly");let c=u.store;return r&&(c=c.index(l.shift())),(await Promise.all([c[n](...l),i&&u.done]))[0]};return sd.set(e,s),s}xx(t=>({...t,get:(e,n,r)=>$m(e,n)||t.get(e,n,r),has:(e,n)=>!!$m(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rx{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Px(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function Px(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const fh="@firebase/app",Wm="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yn=new Mf("@firebase/app"),Dx="@firebase/app-compat",Nx="@firebase/analytics-compat",Ox="@firebase/analytics",Vx="@firebase/app-check-compat",Mx="@firebase/app-check",Lx="@firebase/auth",jx="@firebase/auth-compat",Fx="@firebase/database",zx="@firebase/data-connect",Ux="@firebase/database-compat",Bx="@firebase/functions",$x="@firebase/functions-compat",Wx="@firebase/installations",Hx="@firebase/installations-compat",qx="@firebase/messaging",Kx="@firebase/messaging-compat",Gx="@firebase/performance",Qx="@firebase/performance-compat",Yx="@firebase/remote-config",Xx="@firebase/remote-config-compat",Jx="@firebase/storage",Zx="@firebase/storage-compat",ek="@firebase/firestore",tk="@firebase/ai",nk="@firebase/firestore-compat",rk="firebase",ik="11.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ph="[DEFAULT]",sk={[fh]:"fire-core",[Dx]:"fire-core-compat",[Ox]:"fire-analytics",[Nx]:"fire-analytics-compat",[Mx]:"fire-app-check",[Vx]:"fire-app-check-compat",[Lx]:"fire-auth",[jx]:"fire-auth-compat",[Fx]:"fire-rtdb",[zx]:"fire-data-connect",[Ux]:"fire-rtdb-compat",[Bx]:"fire-fn",[$x]:"fire-fn-compat",[Wx]:"fire-iid",[Hx]:"fire-iid-compat",[qx]:"fire-fcm",[Kx]:"fire-fcm-compat",[Gx]:"fire-perf",[Qx]:"fire-perf-compat",[Yx]:"fire-rc",[Xx]:"fire-rc-compat",[Jx]:"fire-gcs",[Zx]:"fire-gcs-compat",[ek]:"fire-fst",[nk]:"fire-fst-compat",[tk]:"fire-vertex","fire-js":"fire-js",[rk]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iu=new Map,ok=new Map,gh=new Map;function Hm(t,e){try{t.container.addComponent(e)}catch(n){Yn.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function kn(t){const e=t.name;if(gh.has(e))return Yn.debug(`There were multiple attempts to register component ${e}.`),!1;gh.set(e,t);for(const n of iu.values())Hm(n,t);for(const n of ok.values())Hm(n,t);return!0}function ks(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Ot(t){return t==null?!1:t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ak={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},xr=new Ei("app","Firebase",ak);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lk{constructor(e,n,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new hn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw xr.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cs=ik;function Q_(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r=Object.assign({name:ph,automaticDataCollectionEnabled:!0},e),i=r.name;if(typeof i!="string"||!i)throw xr.create("bad-app-name",{appName:String(i)});if(n||(n=U_()),!n)throw xr.create("no-options");const s=iu.get(i);if(s){if(hi(n,s.options)&&hi(r,s.config))return s;throw xr.create("duplicate-app",{appName:i})}const o=new gx(i);for(const u of gh.values())o.addComponent(u);const l=new lk(n,r,o);return iu.set(i,l),l}function jf(t=ph){const e=iu.get(t);if(!e&&t===ph&&U_())return Q_();if(!e)throw xr.create("no-app",{appName:t});return e}function Yt(t,e,n){var r;let i=(r=sk[t])!==null&&r!==void 0?r:t;n&&(i+=`-${n}`);const s=i.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const l=[`Unable to register library "${i}" with version "${e}":`];s&&l.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Yn.warn(l.join(" "));return}kn(new hn(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uk="firebase-heartbeat-database",ck=1,Go="firebase-heartbeat-store";let od=null;function Y_(){return od||(od=Hu(uk,ck,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Go)}catch(n){console.warn(n)}}}}).catch(t=>{throw xr.create("idb-open",{originalErrorMessage:t.message})})),od}async function dk(t){try{const n=(await Y_()).transaction(Go),r=await n.objectStore(Go).get(X_(t));return await n.done,r}catch(e){if(e instanceof An)Yn.warn(e.message);else{const n=xr.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Yn.warn(n.message)}}}async function qm(t,e){try{const r=(await Y_()).transaction(Go,"readwrite");await r.objectStore(Go).put(e,X_(t)),await r.done}catch(n){if(n instanceof An)Yn.warn(n.message);else{const r=xr.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Yn.warn(r.message)}}}function X_(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hk=1024,fk=30;class pk{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new mk(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Km();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>fk){const o=yk(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Yn.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Km(),{heartbeatsToSend:r,unsentEntries:i}=gk(this._heartbeatsCache.heartbeats),s=ru(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Yn.warn(n),""}}}function Km(){return new Date().toISOString().substring(0,10)}function gk(t,e=hk){const n=[];let r=t.slice();for(const i of t){const s=n.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),Gm(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Gm(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class mk{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return H_()?q_().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await dk(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return qm(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return qm(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function Gm(t){return ru(JSON.stringify({version:2,heartbeats:t})).length}function yk(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vk(t){kn(new hn("platform-logger",e=>new Rx(e),"PRIVATE")),kn(new hn("heartbeat",e=>new pk(e),"PRIVATE")),Yt(fh,Wm,t),Yt(fh,Wm,"esm2017"),Yt("fire-js","")}vk("");var _k="firebase",wk="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Yt(_k,wk,"app");function Ff(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(t);i<r.length;i++)e.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(t,r[i])&&(n[r[i]]=t[r[i]]);return n}function J_(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Ek=J_,Z_=new Ei("auth","Firebase",J_());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const su=new Mf("@firebase/auth");function Tk(t,...e){su.logLevel<=ie.WARN&&su.warn(`Auth (${Cs}): ${t}`,...e)}function wl(t,...e){su.logLevel<=ie.ERROR&&su.error(`Auth (${Cs}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zt(t,...e){throw Uf(t,...e)}function cn(t,...e){return Uf(t,...e)}function zf(t,e,n){const r=Object.assign(Object.assign({},Ek()),{[e]:n});return new Ei("auth","Firebase",r).create(e,{appName:t.name})}function Wn(t){return zf(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Sk(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&Zt(t,"argument-error"),zf(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Uf(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return Z_.create(t,...e)}function J(t,e,...n){if(!t)throw Uf(e,...n)}function zn(t){const e="INTERNAL ASSERTION FAILED: "+t;throw wl(e),new Error(e)}function Xn(t,e){t||zn(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mh(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function Ik(){return Qm()==="http:"||Qm()==="https:"}function Qm(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xk(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Ik()||ex()||"connection"in navigator)?navigator.onLine:!0}function kk(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ha{constructor(e,n){this.shortDelay=e,this.longDelay=n,Xn(n>e,"Short delay should be less than long delay!"),this.isMobile=XI()||tx()}get(){return xk()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bf(t,e){Xn(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ew{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;zn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;zn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;zn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ck={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bk=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Ak=new ha(3e4,6e4);function zr(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function Ur(t,e,n,r,i={}){return tw(t,i,async()=>{let s={},o={};r&&(e==="GET"?o=r:s={body:JSON.stringify(r)});const l=da(Object.assign({key:t.config.apiKey},o)).slice(1),u=await t._getAdditionalHeaders();u["Content-Type"]="application/json",t.languageCode&&(u["X-Firebase-Locale"]=t.languageCode);const c=Object.assign({method:e,headers:u},s);return ZI()||(c.referrerPolicy="no-referrer"),t.emulatorConfig&&xs(t.emulatorConfig.host)&&(c.credentials="include"),ew.fetch()(await nw(t,t.config.apiHost,n,l),c)})}async function tw(t,e,n){t._canInitEmulator=!1;const r=Object.assign(Object.assign({},Ck),e);try{const i=new Pk(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw nl(t,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const l=s.ok?o.errorMessage:o.error.message,[u,c]=l.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw nl(t,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw nl(t,"email-already-in-use",o);if(u==="USER_DISABLED")throw nl(t,"user-disabled",o);const f=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw zf(t,f,c);Zt(t,f)}}catch(i){if(i instanceof An)throw i;Zt(t,"network-request-failed",{message:String(i)})}}async function fa(t,e,n,r,i={}){const s=await Ur(t,e,n,r,i);return"mfaPendingCredential"in s&&Zt(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function nw(t,e,n,r){const i=`${e}${n}?${r}`,s=t,o=s.config.emulator?Bf(t.config,i):`${t.config.apiScheme}://${i}`;return bk.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(o).toString():o}function Rk(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Pk{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(cn(this.auth,"network-request-failed")),Ak.get())})}}function nl(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=cn(t,e,r);return i.customData._tokenResponse=n,i}function Ym(t){return t!==void 0&&t.enterprise!==void 0}class Dk{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return Rk(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function Nk(t,e){return Ur(t,"GET","/v2/recaptchaConfig",zr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ok(t,e){return Ur(t,"POST","/v1/accounts:delete",e)}async function ou(t,e){return Ur(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ko(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Vk(t,e=!1){const n=it(t),r=await n.getIdToken(e),i=$f(r);J(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:ko(ad(i.auth_time)),issuedAtTime:ko(ad(i.iat)),expirationTime:ko(ad(i.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function ad(t){return Number(t)*1e3}function $f(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return wl("JWT malformed, contained fewer than 3 sections"),null;try{const i=F_(n);return i?JSON.parse(i):(wl("Failed to decode base64 JWT payload"),null)}catch(i){return wl("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Xm(t){const e=$f(t);return J(e,"internal-error"),J(typeof e.exp<"u","internal-error"),J(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qo(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof An&&Mk(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function Mk({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lk{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const i=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yh{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=ko(this.lastLoginAt),this.creationTime=ko(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function au(t){var e;const n=t.auth,r=await t.getIdToken(),i=await Qo(t,ou(n,{idToken:r}));J(i==null?void 0:i.users.length,n,"internal-error");const s=i.users[0];t._notifyReloadListener(s);const o=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?rw(s.providerUserInfo):[],l=Fk(t.providerData,o),u=t.isAnonymous,c=!(t.email&&s.passwordHash)&&!(l!=null&&l.length),f=u?c:!1,m={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:l,metadata:new yh(s.createdAt,s.lastLoginAt),isAnonymous:f};Object.assign(t,m)}async function jk(t){const e=it(t);await au(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Fk(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function rw(t){return t.map(e=>{var{providerId:n}=e,r=Ff(e,["providerId"]);return{providerId:n,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zk(t,e){const n=await tw(t,{},async()=>{const r=da({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,o=await nw(t,i,"/v1/token",`key=${s}`),l=await t._getAdditionalHeaders();l["Content-Type"]="application/x-www-form-urlencoded";const u={method:"POST",headers:l,body:r};return t.emulatorConfig&&xs(t.emulatorConfig.host)&&(u.credentials="include"),ew.fetch()(o,u)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Uk(t,e){return Ur(t,"POST","/v2/accounts:revokeToken",zr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class es{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){J(e.idToken,"internal-error"),J(typeof e.idToken<"u","internal-error"),J(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Xm(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){J(e.length!==0,"internal-error");const n=Xm(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(J(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await zk(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,o=new es;return r&&(J(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),i&&(J(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(J(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new es,this.toJSON())}_performRefresh(){return zn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sr(t,e){J(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class on{constructor(e){var{uid:n,auth:r,stsTokenManager:i}=e,s=Ff(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Lk(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=r,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new yh(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const n=await Qo(this,this.stsTokenManager.getToken(this.auth,e));return J(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return Vk(this,e)}reload(){return jk(this)}_assign(e){this!==e&&(J(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new on(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){J(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await au(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Ot(this.auth.app))return Promise.reject(Wn(this.auth));const e=await this.getIdToken();return await Qo(this,Ok(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var r,i,s,o,l,u,c,f;const m=(r=n.displayName)!==null&&r!==void 0?r:void 0,g=(i=n.email)!==null&&i!==void 0?i:void 0,_=(s=n.phoneNumber)!==null&&s!==void 0?s:void 0,b=(o=n.photoURL)!==null&&o!==void 0?o:void 0,x=(l=n.tenantId)!==null&&l!==void 0?l:void 0,O=(u=n._redirectEventId)!==null&&u!==void 0?u:void 0,k=(c=n.createdAt)!==null&&c!==void 0?c:void 0,E=(f=n.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:A,emailVerified:V,isAnonymous:F,providerData:D,stsTokenManager:S}=n;J(A&&S,e,"internal-error");const v=es.fromJSON(this.name,S);J(typeof A=="string",e,"internal-error"),sr(m,e.name),sr(g,e.name),J(typeof V=="boolean",e,"internal-error"),J(typeof F=="boolean",e,"internal-error"),sr(_,e.name),sr(b,e.name),sr(x,e.name),sr(O,e.name),sr(k,e.name),sr(E,e.name);const T=new on({uid:A,auth:e,email:g,emailVerified:V,displayName:m,isAnonymous:F,photoURL:b,phoneNumber:_,tenantId:x,stsTokenManager:v,createdAt:k,lastLoginAt:E});return D&&Array.isArray(D)&&(T.providerData=D.map(C=>Object.assign({},C))),O&&(T._redirectEventId=O),T}static async _fromIdTokenResponse(e,n,r=!1){const i=new es;i.updateFromServerResponse(n);const s=new on({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await au(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];J(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?rw(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),l=new es;l.updateFromIdToken(r);const u=new on({uid:i.localId,auth:e,stsTokenManager:l,isAnonymous:o}),c={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new yh(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(u,c),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jm=new Map;function Un(t){Xn(t instanceof Function,"Expected a class definition");let e=Jm.get(t);return e?(Xn(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Jm.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iw{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}iw.type="NONE";const Zm=iw;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function El(t,e,n){return`firebase:${t}:${e}:${n}`}class ts{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=El(this.userKey,i.apiKey,s),this.fullPersistenceKey=El("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await ou(this.auth,{idToken:e}).catch(()=>{});return n?on._fromGetAccountInfoResponse(this.auth,n,e):null}return on._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new ts(Un(Zm),e,r);const i=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let s=i[0]||Un(Zm);const o=El(r,e.config.apiKey,e.name);let l=null;for(const c of n)try{const f=await c._get(o);if(f){let m;if(typeof f=="string"){const g=await ou(e,{idToken:f}).catch(()=>{});if(!g)break;m=await on._fromGetAccountInfoResponse(e,g,f)}else m=on._fromJSON(e,f);c!==s&&(l=m),s=c;break}}catch{}const u=i.filter(c=>c._shouldAllowMigration);return!s._shouldAllowMigration||!u.length?new ts(s,e,r):(s=u[0],l&&await s._set(o,l.toJSON()),await Promise.all(n.map(async c=>{if(c!==s)try{await c._remove(o)}catch{}})),new ts(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ey(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(lw(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(sw(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(cw(e))return"Blackberry";if(dw(e))return"Webos";if(ow(e))return"Safari";if((e.includes("chrome/")||aw(e))&&!e.includes("edge/"))return"Chrome";if(uw(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function sw(t=vt()){return/firefox\//i.test(t)}function ow(t=vt()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function aw(t=vt()){return/crios\//i.test(t)}function lw(t=vt()){return/iemobile/i.test(t)}function uw(t=vt()){return/android/i.test(t)}function cw(t=vt()){return/blackberry/i.test(t)}function dw(t=vt()){return/webos/i.test(t)}function Wf(t=vt()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function Bk(t=vt()){var e;return Wf(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function $k(){return nx()&&document.documentMode===10}function hw(t=vt()){return Wf(t)||uw(t)||dw(t)||cw(t)||/windows phone/i.test(t)||lw(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fw(t,e=[]){let n;switch(t){case"Browser":n=ey(vt());break;case"Worker":n=`${ey(vt())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Cs}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wk{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((o,l)=>{try{const u=e(s);o(u)}catch(u){l(u)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Hk(t,e={}){return Ur(t,"GET","/v2/passwordPolicy",zr(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qk=6;class Kk{constructor(e){var n,r,i,s;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:qk,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,r,i,s,o,l;const u={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,u),this.validatePasswordCharacterOptions(e,u),u.isValid&&(u.isValid=(n=u.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),u.isValid&&(u.isValid=(r=u.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),u.isValid&&(u.isValid=(i=u.containsLowercaseLetter)!==null&&i!==void 0?i:!0),u.isValid&&(u.isValid=(s=u.containsUppercaseLetter)!==null&&s!==void 0?s:!0),u.isValid&&(u.isValid=(o=u.containsNumericCharacter)!==null&&o!==void 0?o:!0),u.isValid&&(u.isValid=(l=u.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),u}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gk{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new ty(this),this.idTokenSubscription=new ty(this),this.beforeStateQueue=new Wk(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Z_,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Un(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await ts.create(this,e),(r=this._resolvePersistenceManagerAvailable)===null||r===void 0||r.call(this),!this._deleted)){if(!((i=this._popupRedirectResolver)===null||i===void 0)&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await ou(this,{idToken:e}),r=await on._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(Ot(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let i=r,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,l=i==null?void 0:i._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===l)&&(u!=null&&u.user)&&(i=u.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return J(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await au(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=kk()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Ot(this.app))return Promise.reject(Wn(this));const n=e?it(e):null;return n&&J(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&J(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Ot(this.app)?Promise.reject(Wn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Ot(this.app)?Promise.reject(Wn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Un(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Hk(this),n=new Kk(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Ei("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await Uk(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Un(e)||this._popupRedirectResolver;J(n,this,"argument-error"),this.redirectPersistenceManager=await ts.create(this,[Un(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(J(l,this,"internal-error"),l.then(()=>{o||s(this.currentUser)}),typeof n=="function"){const u=e.addObserver(n,r,i);return()=>{o=!0,u()}}else{const u=e.addObserver(n);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return J(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=fw(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(n["X-Firebase-Client"]=r);const i=await this._getAppCheckToken();return i&&(n["X-Firebase-AppCheck"]=i),n}async _getAppCheckToken(){var e;if(Ot(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&Tk(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function Br(t){return it(t)}class ty{constructor(e){this.auth=e,this.observer=null,this.addObserver=ux(n=>this.observer=n)}get next(){return J(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let qu={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Qk(t){qu=t}function pw(t){return qu.loadJS(t)}function Yk(){return qu.recaptchaEnterpriseScript}function Xk(){return qu.gapiScript}function Jk(t){return`__${t}${Math.floor(Math.random()*1e6)}`}class Zk{constructor(){this.enterprise=new e2}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class e2{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}const t2="recaptcha-enterprise",gw="NO_RECAPTCHA";class n2{constructor(e){this.type=t2,this.auth=Br(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(o,l)=>{Nk(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const c=new Dk(u);return s.tenantId==null?s._agentRecaptchaConfig=c:s._tenantRecaptchaConfigs[s.tenantId]=c,o(c.siteKey)}}).catch(u=>{l(u)})})}function i(s,o,l){const u=window.grecaptcha;Ym(u)?u.enterprise.ready(()=>{u.enterprise.execute(s,{action:e}).then(c=>{o(c)}).catch(()=>{o(gw)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new Zk().execute("siteKey",{action:"verify"}):new Promise((s,o)=>{r(this.auth).then(l=>{if(!n&&Ym(window.grecaptcha))i(l,s,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=Yk();u.length!==0&&(u+=l),pw(u).then(()=>{i(l,s,o)}).catch(c=>{o(c)})}}).catch(l=>{o(l)})})}}async function ny(t,e,n,r=!1,i=!1){const s=new n2(t);let o;if(i)o=gw;else try{o=await s.verify(n)}catch{o=await s.verify(n,!0)}const l=Object.assign({},e);if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in l){const u=l.phoneEnrollmentInfo.phoneNumber,c=l.phoneEnrollmentInfo.recaptchaToken;Object.assign(l,{phoneEnrollmentInfo:{phoneNumber:u,recaptchaToken:c,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in l){const u=l.phoneSignInInfo.recaptchaToken;Object.assign(l,{phoneSignInInfo:{recaptchaToken:u,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return l}return r?Object.assign(l,{captchaResp:o}):Object.assign(l,{captchaResponse:o}),Object.assign(l,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(l,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),l}async function vh(t,e,n,r,i){var s;if(!((s=t._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const o=await ny(t,e,n,n==="getOobCode");return r(t,o)}else return r(t,e).catch(async o=>{if(o.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const l=await ny(t,e,n,n==="getOobCode");return r(t,l)}else return Promise.reject(o)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function r2(t,e){const n=ks(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(hi(s,e??{}))return i;Zt(i,"already-initialized")}return n.initialize({options:e})}function i2(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(Un);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function s2(t,e,n){const r=Br(t);J(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=mw(e),{host:o,port:l}=o2(e),u=l===null?"":`:${l}`,c={url:`${s}//${o}${u}/`},f=Object.freeze({host:o,port:l,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){J(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),J(hi(c,r.config.emulator)&&hi(f,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=c,r.emulatorConfig=f,r.settings.appVerificationDisabledForTesting=!0,xs(o)?($_(`${s}//${o}${u}`),W_("Auth",!0)):a2()}function mw(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function o2(t){const e=mw(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:ry(r.substr(s.length+1))}}else{const[s,o]=r.split(":");return{host:s,port:ry(o)}}}function ry(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function a2(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hf{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return zn("not implemented")}_getIdTokenResponse(e){return zn("not implemented")}_linkToIdToken(e,n){return zn("not implemented")}_getReauthenticationResolver(e){return zn("not implemented")}}async function l2(t,e){return Ur(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function u2(t,e){return fa(t,"POST","/v1/accounts:signInWithPassword",zr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function c2(t,e){return fa(t,"POST","/v1/accounts:signInWithEmailLink",zr(t,e))}async function d2(t,e){return fa(t,"POST","/v1/accounts:signInWithEmailLink",zr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yo extends Hf{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new Yo(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new Yo(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return vh(e,n,"signInWithPassword",u2);case"emailLink":return c2(e,{email:this._email,oobCode:this._password});default:Zt(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return vh(e,r,"signUpPassword",l2);case"emailLink":return d2(e,{idToken:n,email:this._email,oobCode:this._password});default:Zt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ns(t,e){return fa(t,"POST","/v1/accounts:signInWithIdp",zr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const h2="http://localhost";class fi extends Hf{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new fi(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):Zt("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=n,s=Ff(n,["providerId","signInMethod"]);if(!r||!i)return null;const o=new fi(r,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return ns(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,ns(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,ns(e,n)}buildRequest(){const e={requestUri:h2,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=da(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function f2(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function p2(t){const e=lo(uo(t)).link,n=e?lo(uo(e)).deep_link_id:null,r=lo(uo(t)).deep_link_id;return(r?lo(uo(r)).link:null)||r||n||e||t}class qf{constructor(e){var n,r,i,s,o,l;const u=lo(uo(e)),c=(n=u.apiKey)!==null&&n!==void 0?n:null,f=(r=u.oobCode)!==null&&r!==void 0?r:null,m=f2((i=u.mode)!==null&&i!==void 0?i:null);J(c&&f&&m,"argument-error"),this.apiKey=c,this.operation=m,this.code=f,this.continueUrl=(s=u.continueUrl)!==null&&s!==void 0?s:null,this.languageCode=(o=u.lang)!==null&&o!==void 0?o:null,this.tenantId=(l=u.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){const n=p2(e);try{return new qf(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bs{constructor(){this.providerId=bs.PROVIDER_ID}static credential(e,n){return Yo._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=qf.parseLink(n);return J(r,"argument-error"),Yo._fromEmailAndCode(e,r.code,r.tenantId)}}bs.PROVIDER_ID="password";bs.EMAIL_PASSWORD_SIGN_IN_METHOD="password";bs.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kf{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pa extends Kf{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cr extends pa{constructor(){super("facebook.com")}static credential(e){return fi._fromParams({providerId:cr.PROVIDER_ID,signInMethod:cr.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return cr.credentialFromTaggedObject(e)}static credentialFromError(e){return cr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return cr.credential(e.oauthAccessToken)}catch{return null}}}cr.FACEBOOK_SIGN_IN_METHOD="facebook.com";cr.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mn extends pa{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return fi._fromParams({providerId:Mn.PROVIDER_ID,signInMethod:Mn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return Mn.credentialFromTaggedObject(e)}static credentialFromError(e){return Mn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return Mn.credential(n,r)}catch{return null}}}Mn.GOOGLE_SIGN_IN_METHOD="google.com";Mn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dr extends pa{constructor(){super("github.com")}static credential(e){return fi._fromParams({providerId:dr.PROVIDER_ID,signInMethod:dr.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return dr.credentialFromTaggedObject(e)}static credentialFromError(e){return dr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return dr.credential(e.oauthAccessToken)}catch{return null}}}dr.GITHUB_SIGN_IN_METHOD="github.com";dr.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hr extends pa{constructor(){super("twitter.com")}static credential(e,n){return fi._fromParams({providerId:hr.PROVIDER_ID,signInMethod:hr.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return hr.credentialFromTaggedObject(e)}static credentialFromError(e){return hr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return hr.credential(n,r)}catch{return null}}}hr.TWITTER_SIGN_IN_METHOD="twitter.com";hr.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function g2(t,e){return fa(t,"POST","/v1/accounts:signUp",zr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pi{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await on._fromIdTokenResponse(e,r,i),o=iy(r);return new pi({user:s,providerId:o,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=iy(r);return new pi({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function iy(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lu extends An{constructor(e,n,r,i){var s;super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,lu.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new lu(e,n,r,i)}}function yw(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?lu._fromErrorAndOperation(t,s,e,r):s})}async function m2(t,e,n=!1){const r=await Qo(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return pi._forOperation(t,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function y2(t,e,n=!1){const{auth:r}=t;if(Ot(r.app))return Promise.reject(Wn(r));const i="reauthenticate";try{const s=await Qo(t,yw(r,i,e,t),n);J(s.idToken,r,"internal-error");const o=$f(s.idToken);J(o,r,"internal-error");const{sub:l}=o;return J(t.uid===l,r,"user-mismatch"),pi._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&Zt(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vw(t,e,n=!1){if(Ot(t.app))return Promise.reject(Wn(t));const r="signIn",i=await yw(t,r,e),s=await pi._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function v2(t,e){return vw(Br(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _w(t){const e=Br(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function _2(t,e,n){if(Ot(t.app))return Promise.reject(Wn(t));const r=Br(t),o=await vh(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",g2).catch(u=>{throw u.code==="auth/password-does-not-meet-requirements"&&_w(t),u}),l=await pi._fromIdTokenResponse(r,"signIn",o);return await r._updateCurrentUser(l.user),l}function w2(t,e,n){return Ot(t.app)?Promise.reject(Wn(t)):v2(it(t),bs.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&_w(t),r})}function E2(t,e,n,r){return it(t).onIdTokenChanged(e,n,r)}function T2(t,e,n){return it(t).beforeAuthStateChanged(e,n)}function S2(t,e,n,r){return it(t).onAuthStateChanged(e,n,r)}function ww(t){return it(t).signOut()}const uu="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ew{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(uu,"1"),this.storage.removeItem(uu),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const I2=1e3,x2=10;class Tw extends Ew{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=hw(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,l,u)=>{this.notifyListeners(o,u)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(r);!n&&this.localCache[r]===o||this.notifyListeners(r,o)},s=this.storage.getItem(r);$k()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,x2):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},I2)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Tw.type="LOCAL";const k2=Tw;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sw extends Ew{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Sw.type="SESSION";const Iw=Sw;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function C2(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ku{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new Ku(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const l=Array.from(o).map(async c=>c(n.origin,s)),u=await C2(l);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:u})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Ku.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gf(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b2{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((l,u)=>{const c=Gf("",20);i.port1.start();const f=setTimeout(()=>{u(new Error("unsupported_event"))},r);o={messageChannel:i,onMessage(m){const g=m;if(g.data.eventId===c)switch(g.data.status){case"ack":clearTimeout(f),s=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),l(g.data.response);break;default:clearTimeout(f),clearTimeout(s),u(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wn(){return window}function A2(t){wn().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xw(){return typeof wn().WorkerGlobalScope<"u"&&typeof wn().importScripts=="function"}async function R2(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function P2(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function D2(){return xw()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kw="firebaseLocalStorageDb",N2=1,cu="firebaseLocalStorage",Cw="fbase_key";class ga{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Gu(t,e){return t.transaction([cu],e?"readwrite":"readonly").objectStore(cu)}function O2(){const t=indexedDB.deleteDatabase(kw);return new ga(t).toPromise()}function _h(){const t=indexedDB.open(kw,N2);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(cu,{keyPath:Cw})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(cu)?e(r):(r.close(),await O2(),e(await _h()))})})}async function sy(t,e,n){const r=Gu(t,!0).put({[Cw]:e,value:n});return new ga(r).toPromise()}async function V2(t,e){const n=Gu(t,!1).get(e),r=await new ga(n).toPromise();return r===void 0?null:r.value}function oy(t,e){const n=Gu(t,!0).delete(e);return new ga(n).toPromise()}const M2=800,L2=3;class bw{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await _h(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>L2)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return xw()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Ku._getInstance(D2()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await R2(),!this.activeServiceWorker)return;this.sender=new b2(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((n=r[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||P2()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await _h();return await sy(e,uu,"1"),await oy(e,uu),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>sy(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>V2(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>oy(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=Gu(i,!1).getAll();return new ga(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),M2)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}bw.type="LOCAL";const j2=bw;new ha(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Aw(t,e){return e?Un(e):(J(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qf extends Hf{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return ns(e,this._buildIdpRequest())}_linkToIdToken(e,n){return ns(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return ns(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function F2(t){return vw(t.auth,new Qf(t),t.bypassAuthState)}function z2(t){const{auth:e,user:n}=t;return J(n,e,"internal-error"),y2(n,new Qf(t),t.bypassAuthState)}async function U2(t){const{auth:e,user:n}=t;return J(n,e,"internal-error"),m2(n,new Qf(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rw{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:o,type:l}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(u))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return F2;case"linkViaPopup":case"linkViaRedirect":return U2;case"reauthViaPopup":case"reauthViaRedirect":return z2;default:Zt(this.auth,"internal-error")}}resolve(e){Xn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Xn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const B2=new ha(2e3,1e4);async function $2(t,e,n){if(Ot(t.app))return Promise.reject(cn(t,"operation-not-supported-in-this-environment"));const r=Br(t);Sk(t,e,Kf);const i=Aw(r,n);return new ti(r,"signInViaPopup",e,i).executeNotNull()}class ti extends Rw{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,ti.currentPopupAction&&ti.currentPopupAction.cancel(),ti.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return J(e,this.auth,"internal-error"),e}async onExecution(){Xn(this.filter.length===1,"Popup operations only handle one event");const e=Gf();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(cn(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(cn(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,ti.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if(!((r=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(cn(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,B2.get())};e()}}ti.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const W2="pendingRedirect",Tl=new Map;class H2 extends Rw{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Tl.get(this.auth._key());if(!e){try{const r=await q2(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Tl.set(this.auth._key(),e)}return this.bypassAuthState||Tl.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function q2(t,e){const n=Q2(e),r=G2(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}function K2(t,e){Tl.set(t._key(),e)}function G2(t){return Un(t._redirectPersistence)}function Q2(t){return El(W2,t.config.apiKey,t.name)}async function Y2(t,e,n=!1){if(Ot(t.app))return Promise.reject(Wn(t));const r=Br(t),i=Aw(r,e),o=await new H2(r,i,n).execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const X2=10*60*1e3;class J2{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Z2(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!Pw(e)){const i=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";n.onError(cn(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=X2&&this.cachedEventUids.clear(),this.cachedEventUids.has(ay(e))}saveEventToCache(e){this.cachedEventUids.add(ay(e)),this.lastProcessedEventTime=Date.now()}}function ay(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function Pw({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Z2(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Pw(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function eC(t,e={}){return Ur(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tC=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,nC=/^https?/;async function rC(t){if(t.config.emulator)return;const{authorizedDomains:e}=await eC(t);for(const n of e)try{if(iC(n))return}catch{}Zt(t,"unauthorized-domain")}function iC(t){const e=mh(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===r}if(!nC.test(n))return!1;if(tC.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sC=new ha(3e4,6e4);function ly(){const t=wn().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function oC(t){return new Promise((e,n)=>{var r,i,s;function o(){ly(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{ly(),n(cn(t,"network-request-failed"))},timeout:sC.get()})}if(!((i=(r=wn().gapi)===null||r===void 0?void 0:r.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=wn().gapi)===null||s===void 0)&&s.load)o();else{const l=Jk("iframefcb");return wn()[l]=()=>{gapi.load?o():n(cn(t,"network-request-failed"))},pw(`${Xk()}?onload=${l}`).catch(u=>n(u))}}).catch(e=>{throw Sl=null,e})}let Sl=null;function aC(t){return Sl=Sl||oC(t),Sl}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lC=new ha(5e3,15e3),uC="__/auth/iframe",cC="emulator/auth/iframe",dC={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},hC=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function fC(t){const e=t.config;J(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Bf(e,cC):`https://${t.config.authDomain}/${uC}`,r={apiKey:e.apiKey,appName:t.name,v:Cs},i=hC.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${da(r).slice(1)}`}async function pC(t){const e=await aC(t),n=wn().gapi;return J(n,t,"internal-error"),e.open({where:document.body,url:fC(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:dC,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const o=cn(t,"network-request-failed"),l=wn().setTimeout(()=>{s(o)},lC.get());function u(){wn().clearTimeout(l),i(r)}r.ping(u).then(u,()=>{s(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gC={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},mC=500,yC=600,vC="_blank",_C="http://localhost";class uy{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function wC(t,e,n,r=mC,i=yC){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const u=Object.assign(Object.assign({},gC),{width:r.toString(),height:i.toString(),top:s,left:o}),c=vt().toLowerCase();n&&(l=aw(c)?vC:n),sw(c)&&(e=e||_C,u.scrollbars="yes");const f=Object.entries(u).reduce((g,[_,b])=>`${g}${_}=${b},`,"");if(Bk(c)&&l!=="_self")return EC(e||"",l),new uy(null);const m=window.open(e||"",l,f);J(m,t,"popup-blocked");try{m.focus()}catch{}return new uy(m)}function EC(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TC="__/auth/handler",SC="emulator/auth/handler",IC=encodeURIComponent("fac");async function cy(t,e,n,r,i,s){J(t.config.authDomain,t,"auth-domain-config-required"),J(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:Cs,eventId:i};if(e instanceof Kf){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",lx(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,m]of Object.entries({}))o[f]=m}if(e instanceof pa){const f=e.getScopes().filter(m=>m!=="");f.length>0&&(o.scopes=f.join(","))}t.tenantId&&(o.tid=t.tenantId);const l=o;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const u=await t._getAppCheckToken(),c=u?`#${IC}=${encodeURIComponent(u)}`:"";return`${xC(t)}?${da(l).slice(1)}${c}`}function xC({config:t}){return t.emulator?Bf(t,SC):`https://${t.authDomain}/${TC}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ld="webStorageSupport";class kC{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Iw,this._completeRedirectFn=Y2,this._overrideRedirectResult=K2}async _openPopup(e,n,r,i){var s;Xn((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const o=await cy(e,n,r,mh(),i);return wC(e,o,Gf())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await cy(e,n,r,mh(),i);return A2(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(Xn(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await pC(e),r=new J2(e);return n.register("authEvent",i=>(J(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(ld,{type:ld},i=>{var s;const o=(s=i==null?void 0:i[0])===null||s===void 0?void 0:s[ld];o!==void 0&&n(!!o),Zt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=rC(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return hw()||ow()||Wf()}}const CC=kC;var dy="@firebase/auth",hy="1.10.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bC{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){J(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function AC(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function RC(t){kn(new hn("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=r.options;J(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const u={apiKey:o,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:fw(t)},c=new Gk(r,i,s,u);return i2(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),kn(new hn("auth-internal",e=>{const n=Br(e.getProvider("auth").getImmediate());return(r=>new bC(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Yt(dy,hy,AC(t)),Yt(dy,hy,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PC=5*60,DC=B_("authIdTokenMaxAge")||PC;let fy=null;const NC=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>DC)return;const i=n==null?void 0:n.token;fy!==i&&(fy=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function OC(t=jf()){const e=ks(t,"auth");if(e.isInitialized())return e.getImmediate();const n=r2(t,{popupRedirectResolver:CC,persistence:[j2,k2,Iw]}),r=B_("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const o=NC(s.toString());T2(n,o,()=>o(n.currentUser)),E2(n,l=>o(l))}}const i=z_("auth");return i&&s2(n,`http://${i}`),n}function VC(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}Qk({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=cn("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",VC().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});RC("Browser");var py=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var kr,Dw;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(S,v){function T(){}T.prototype=v.prototype,S.D=v.prototype,S.prototype=new T,S.prototype.constructor=S,S.C=function(C,P,R){for(var w=Array(arguments.length-2),ae=2;ae<arguments.length;ae++)w[ae-2]=arguments[ae];return v.prototype[P].apply(C,w)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,n),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(S,v,T){T||(T=0);var C=Array(16);if(typeof v=="string")for(var P=0;16>P;++P)C[P]=v.charCodeAt(T++)|v.charCodeAt(T++)<<8|v.charCodeAt(T++)<<16|v.charCodeAt(T++)<<24;else for(P=0;16>P;++P)C[P]=v[T++]|v[T++]<<8|v[T++]<<16|v[T++]<<24;v=S.g[0],T=S.g[1],P=S.g[2];var R=S.g[3],w=v+(R^T&(P^R))+C[0]+3614090360&4294967295;v=T+(w<<7&4294967295|w>>>25),w=R+(P^v&(T^P))+C[1]+3905402710&4294967295,R=v+(w<<12&4294967295|w>>>20),w=P+(T^R&(v^T))+C[2]+606105819&4294967295,P=R+(w<<17&4294967295|w>>>15),w=T+(v^P&(R^v))+C[3]+3250441966&4294967295,T=P+(w<<22&4294967295|w>>>10),w=v+(R^T&(P^R))+C[4]+4118548399&4294967295,v=T+(w<<7&4294967295|w>>>25),w=R+(P^v&(T^P))+C[5]+1200080426&4294967295,R=v+(w<<12&4294967295|w>>>20),w=P+(T^R&(v^T))+C[6]+2821735955&4294967295,P=R+(w<<17&4294967295|w>>>15),w=T+(v^P&(R^v))+C[7]+4249261313&4294967295,T=P+(w<<22&4294967295|w>>>10),w=v+(R^T&(P^R))+C[8]+1770035416&4294967295,v=T+(w<<7&4294967295|w>>>25),w=R+(P^v&(T^P))+C[9]+2336552879&4294967295,R=v+(w<<12&4294967295|w>>>20),w=P+(T^R&(v^T))+C[10]+4294925233&4294967295,P=R+(w<<17&4294967295|w>>>15),w=T+(v^P&(R^v))+C[11]+2304563134&4294967295,T=P+(w<<22&4294967295|w>>>10),w=v+(R^T&(P^R))+C[12]+1804603682&4294967295,v=T+(w<<7&4294967295|w>>>25),w=R+(P^v&(T^P))+C[13]+4254626195&4294967295,R=v+(w<<12&4294967295|w>>>20),w=P+(T^R&(v^T))+C[14]+2792965006&4294967295,P=R+(w<<17&4294967295|w>>>15),w=T+(v^P&(R^v))+C[15]+1236535329&4294967295,T=P+(w<<22&4294967295|w>>>10),w=v+(P^R&(T^P))+C[1]+4129170786&4294967295,v=T+(w<<5&4294967295|w>>>27),w=R+(T^P&(v^T))+C[6]+3225465664&4294967295,R=v+(w<<9&4294967295|w>>>23),w=P+(v^T&(R^v))+C[11]+643717713&4294967295,P=R+(w<<14&4294967295|w>>>18),w=T+(R^v&(P^R))+C[0]+3921069994&4294967295,T=P+(w<<20&4294967295|w>>>12),w=v+(P^R&(T^P))+C[5]+3593408605&4294967295,v=T+(w<<5&4294967295|w>>>27),w=R+(T^P&(v^T))+C[10]+38016083&4294967295,R=v+(w<<9&4294967295|w>>>23),w=P+(v^T&(R^v))+C[15]+3634488961&4294967295,P=R+(w<<14&4294967295|w>>>18),w=T+(R^v&(P^R))+C[4]+3889429448&4294967295,T=P+(w<<20&4294967295|w>>>12),w=v+(P^R&(T^P))+C[9]+568446438&4294967295,v=T+(w<<5&4294967295|w>>>27),w=R+(T^P&(v^T))+C[14]+3275163606&4294967295,R=v+(w<<9&4294967295|w>>>23),w=P+(v^T&(R^v))+C[3]+4107603335&4294967295,P=R+(w<<14&4294967295|w>>>18),w=T+(R^v&(P^R))+C[8]+1163531501&4294967295,T=P+(w<<20&4294967295|w>>>12),w=v+(P^R&(T^P))+C[13]+2850285829&4294967295,v=T+(w<<5&4294967295|w>>>27),w=R+(T^P&(v^T))+C[2]+4243563512&4294967295,R=v+(w<<9&4294967295|w>>>23),w=P+(v^T&(R^v))+C[7]+1735328473&4294967295,P=R+(w<<14&4294967295|w>>>18),w=T+(R^v&(P^R))+C[12]+2368359562&4294967295,T=P+(w<<20&4294967295|w>>>12),w=v+(T^P^R)+C[5]+4294588738&4294967295,v=T+(w<<4&4294967295|w>>>28),w=R+(v^T^P)+C[8]+2272392833&4294967295,R=v+(w<<11&4294967295|w>>>21),w=P+(R^v^T)+C[11]+1839030562&4294967295,P=R+(w<<16&4294967295|w>>>16),w=T+(P^R^v)+C[14]+4259657740&4294967295,T=P+(w<<23&4294967295|w>>>9),w=v+(T^P^R)+C[1]+2763975236&4294967295,v=T+(w<<4&4294967295|w>>>28),w=R+(v^T^P)+C[4]+1272893353&4294967295,R=v+(w<<11&4294967295|w>>>21),w=P+(R^v^T)+C[7]+4139469664&4294967295,P=R+(w<<16&4294967295|w>>>16),w=T+(P^R^v)+C[10]+3200236656&4294967295,T=P+(w<<23&4294967295|w>>>9),w=v+(T^P^R)+C[13]+681279174&4294967295,v=T+(w<<4&4294967295|w>>>28),w=R+(v^T^P)+C[0]+3936430074&4294967295,R=v+(w<<11&4294967295|w>>>21),w=P+(R^v^T)+C[3]+3572445317&4294967295,P=R+(w<<16&4294967295|w>>>16),w=T+(P^R^v)+C[6]+76029189&4294967295,T=P+(w<<23&4294967295|w>>>9),w=v+(T^P^R)+C[9]+3654602809&4294967295,v=T+(w<<4&4294967295|w>>>28),w=R+(v^T^P)+C[12]+3873151461&4294967295,R=v+(w<<11&4294967295|w>>>21),w=P+(R^v^T)+C[15]+530742520&4294967295,P=R+(w<<16&4294967295|w>>>16),w=T+(P^R^v)+C[2]+3299628645&4294967295,T=P+(w<<23&4294967295|w>>>9),w=v+(P^(T|~R))+C[0]+4096336452&4294967295,v=T+(w<<6&4294967295|w>>>26),w=R+(T^(v|~P))+C[7]+1126891415&4294967295,R=v+(w<<10&4294967295|w>>>22),w=P+(v^(R|~T))+C[14]+2878612391&4294967295,P=R+(w<<15&4294967295|w>>>17),w=T+(R^(P|~v))+C[5]+4237533241&4294967295,T=P+(w<<21&4294967295|w>>>11),w=v+(P^(T|~R))+C[12]+1700485571&4294967295,v=T+(w<<6&4294967295|w>>>26),w=R+(T^(v|~P))+C[3]+2399980690&4294967295,R=v+(w<<10&4294967295|w>>>22),w=P+(v^(R|~T))+C[10]+4293915773&4294967295,P=R+(w<<15&4294967295|w>>>17),w=T+(R^(P|~v))+C[1]+2240044497&4294967295,T=P+(w<<21&4294967295|w>>>11),w=v+(P^(T|~R))+C[8]+1873313359&4294967295,v=T+(w<<6&4294967295|w>>>26),w=R+(T^(v|~P))+C[15]+4264355552&4294967295,R=v+(w<<10&4294967295|w>>>22),w=P+(v^(R|~T))+C[6]+2734768916&4294967295,P=R+(w<<15&4294967295|w>>>17),w=T+(R^(P|~v))+C[13]+1309151649&4294967295,T=P+(w<<21&4294967295|w>>>11),w=v+(P^(T|~R))+C[4]+4149444226&4294967295,v=T+(w<<6&4294967295|w>>>26),w=R+(T^(v|~P))+C[11]+3174756917&4294967295,R=v+(w<<10&4294967295|w>>>22),w=P+(v^(R|~T))+C[2]+718787259&4294967295,P=R+(w<<15&4294967295|w>>>17),w=T+(R^(P|~v))+C[9]+3951481745&4294967295,S.g[0]=S.g[0]+v&4294967295,S.g[1]=S.g[1]+(P+(w<<21&4294967295|w>>>11))&4294967295,S.g[2]=S.g[2]+P&4294967295,S.g[3]=S.g[3]+R&4294967295}r.prototype.u=function(S,v){v===void 0&&(v=S.length);for(var T=v-this.blockSize,C=this.B,P=this.h,R=0;R<v;){if(P==0)for(;R<=T;)i(this,S,R),R+=this.blockSize;if(typeof S=="string"){for(;R<v;)if(C[P++]=S.charCodeAt(R++),P==this.blockSize){i(this,C),P=0;break}}else for(;R<v;)if(C[P++]=S[R++],P==this.blockSize){i(this,C),P=0;break}}this.h=P,this.o+=v},r.prototype.v=function(){var S=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);S[0]=128;for(var v=1;v<S.length-8;++v)S[v]=0;var T=8*this.o;for(v=S.length-8;v<S.length;++v)S[v]=T&255,T/=256;for(this.u(S),S=Array(16),v=T=0;4>v;++v)for(var C=0;32>C;C+=8)S[T++]=this.g[v]>>>C&255;return S};function s(S,v){var T=l;return Object.prototype.hasOwnProperty.call(T,S)?T[S]:T[S]=v(S)}function o(S,v){this.h=v;for(var T=[],C=!0,P=S.length-1;0<=P;P--){var R=S[P]|0;C&&R==v||(T[P]=R,C=!1)}this.g=T}var l={};function u(S){return-128<=S&&128>S?s(S,function(v){return new o([v|0],0>v?-1:0)}):new o([S|0],0>S?-1:0)}function c(S){if(isNaN(S)||!isFinite(S))return m;if(0>S)return O(c(-S));for(var v=[],T=1,C=0;S>=T;C++)v[C]=S/T|0,T*=4294967296;return new o(v,0)}function f(S,v){if(S.length==0)throw Error("number format error: empty string");if(v=v||10,2>v||36<v)throw Error("radix out of range: "+v);if(S.charAt(0)=="-")return O(f(S.substring(1),v));if(0<=S.indexOf("-"))throw Error('number format error: interior "-" character');for(var T=c(Math.pow(v,8)),C=m,P=0;P<S.length;P+=8){var R=Math.min(8,S.length-P),w=parseInt(S.substring(P,P+R),v);8>R?(R=c(Math.pow(v,R)),C=C.j(R).add(c(w))):(C=C.j(T),C=C.add(c(w)))}return C}var m=u(0),g=u(1),_=u(16777216);t=o.prototype,t.m=function(){if(x(this))return-O(this).m();for(var S=0,v=1,T=0;T<this.g.length;T++){var C=this.i(T);S+=(0<=C?C:4294967296+C)*v,v*=4294967296}return S},t.toString=function(S){if(S=S||10,2>S||36<S)throw Error("radix out of range: "+S);if(b(this))return"0";if(x(this))return"-"+O(this).toString(S);for(var v=c(Math.pow(S,6)),T=this,C="";;){var P=V(T,v).g;T=k(T,P.j(v));var R=((0<T.g.length?T.g[0]:T.h)>>>0).toString(S);if(T=P,b(T))return R+C;for(;6>R.length;)R="0"+R;C=R+C}},t.i=function(S){return 0>S?0:S<this.g.length?this.g[S]:this.h};function b(S){if(S.h!=0)return!1;for(var v=0;v<S.g.length;v++)if(S.g[v]!=0)return!1;return!0}function x(S){return S.h==-1}t.l=function(S){return S=k(this,S),x(S)?-1:b(S)?0:1};function O(S){for(var v=S.g.length,T=[],C=0;C<v;C++)T[C]=~S.g[C];return new o(T,~S.h).add(g)}t.abs=function(){return x(this)?O(this):this},t.add=function(S){for(var v=Math.max(this.g.length,S.g.length),T=[],C=0,P=0;P<=v;P++){var R=C+(this.i(P)&65535)+(S.i(P)&65535),w=(R>>>16)+(this.i(P)>>>16)+(S.i(P)>>>16);C=w>>>16,R&=65535,w&=65535,T[P]=w<<16|R}return new o(T,T[T.length-1]&-2147483648?-1:0)};function k(S,v){return S.add(O(v))}t.j=function(S){if(b(this)||b(S))return m;if(x(this))return x(S)?O(this).j(O(S)):O(O(this).j(S));if(x(S))return O(this.j(O(S)));if(0>this.l(_)&&0>S.l(_))return c(this.m()*S.m());for(var v=this.g.length+S.g.length,T=[],C=0;C<2*v;C++)T[C]=0;for(C=0;C<this.g.length;C++)for(var P=0;P<S.g.length;P++){var R=this.i(C)>>>16,w=this.i(C)&65535,ae=S.i(P)>>>16,ce=S.i(P)&65535;T[2*C+2*P]+=w*ce,E(T,2*C+2*P),T[2*C+2*P+1]+=R*ce,E(T,2*C+2*P+1),T[2*C+2*P+1]+=w*ae,E(T,2*C+2*P+1),T[2*C+2*P+2]+=R*ae,E(T,2*C+2*P+2)}for(C=0;C<v;C++)T[C]=T[2*C+1]<<16|T[2*C];for(C=v;C<2*v;C++)T[C]=0;return new o(T,0)};function E(S,v){for(;(S[v]&65535)!=S[v];)S[v+1]+=S[v]>>>16,S[v]&=65535,v++}function A(S,v){this.g=S,this.h=v}function V(S,v){if(b(v))throw Error("division by zero");if(b(S))return new A(m,m);if(x(S))return v=V(O(S),v),new A(O(v.g),O(v.h));if(x(v))return v=V(S,O(v)),new A(O(v.g),v.h);if(30<S.g.length){if(x(S)||x(v))throw Error("slowDivide_ only works with positive integers.");for(var T=g,C=v;0>=C.l(S);)T=F(T),C=F(C);var P=D(T,1),R=D(C,1);for(C=D(C,2),T=D(T,2);!b(C);){var w=R.add(C);0>=w.l(S)&&(P=P.add(T),R=w),C=D(C,1),T=D(T,1)}return v=k(S,P.j(v)),new A(P,v)}for(P=m;0<=S.l(v);){for(T=Math.max(1,Math.floor(S.m()/v.m())),C=Math.ceil(Math.log(T)/Math.LN2),C=48>=C?1:Math.pow(2,C-48),R=c(T),w=R.j(v);x(w)||0<w.l(S);)T-=C,R=c(T),w=R.j(v);b(R)&&(R=g),P=P.add(R),S=k(S,w)}return new A(P,S)}t.A=function(S){return V(this,S).h},t.and=function(S){for(var v=Math.max(this.g.length,S.g.length),T=[],C=0;C<v;C++)T[C]=this.i(C)&S.i(C);return new o(T,this.h&S.h)},t.or=function(S){for(var v=Math.max(this.g.length,S.g.length),T=[],C=0;C<v;C++)T[C]=this.i(C)|S.i(C);return new o(T,this.h|S.h)},t.xor=function(S){for(var v=Math.max(this.g.length,S.g.length),T=[],C=0;C<v;C++)T[C]=this.i(C)^S.i(C);return new o(T,this.h^S.h)};function F(S){for(var v=S.g.length+1,T=[],C=0;C<v;C++)T[C]=S.i(C)<<1|S.i(C-1)>>>31;return new o(T,S.h)}function D(S,v){var T=v>>5;v%=32;for(var C=S.g.length-T,P=[],R=0;R<C;R++)P[R]=0<v?S.i(R+T)>>>v|S.i(R+T+1)<<32-v:S.i(R+T);return new o(P,S.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,Dw=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=c,o.fromString=f,kr=o}).apply(typeof py<"u"?py:typeof self<"u"?self:typeof window<"u"?window:{});var rl=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Nw,co,Ow,Il,wh,Vw,Mw,Lw;(function(){var t,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,d,p){return a==Array.prototype||a==Object.prototype||(a[d]=p.value),a};function n(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof rl=="object"&&rl];for(var d=0;d<a.length;++d){var p=a[d];if(p&&p.Math==Math)return p}throw Error("Cannot find global object")}var r=n(this);function i(a,d){if(d)e:{var p=r;a=a.split(".");for(var y=0;y<a.length-1;y++){var N=a[y];if(!(N in p))break e;p=p[N]}a=a[a.length-1],y=p[a],d=d(y),d!=y&&d!=null&&e(p,a,{configurable:!0,writable:!0,value:d})}}function s(a,d){a instanceof String&&(a+="");var p=0,y=!1,N={next:function(){if(!y&&p<a.length){var M=p++;return{value:d(M,a[M]),done:!1}}return y=!0,{done:!0,value:void 0}}};return N[Symbol.iterator]=function(){return N},N}i("Array.prototype.values",function(a){return a||function(){return s(this,function(d,p){return p})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function u(a){var d=typeof a;return d=d!="object"?d:a?Array.isArray(a)?"array":d:"null",d=="array"||d=="object"&&typeof a.length=="number"}function c(a){var d=typeof a;return d=="object"&&a!=null||d=="function"}function f(a,d,p){return a.call.apply(a.bind,arguments)}function m(a,d,p){if(!a)throw Error();if(2<arguments.length){var y=Array.prototype.slice.call(arguments,2);return function(){var N=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(N,y),a.apply(d,N)}}return function(){return a.apply(d,arguments)}}function g(a,d,p){return g=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,g.apply(null,arguments)}function _(a,d){var p=Array.prototype.slice.call(arguments,1);return function(){var y=p.slice();return y.push.apply(y,arguments),a.apply(this,y)}}function b(a,d){function p(){}p.prototype=d.prototype,a.aa=d.prototype,a.prototype=new p,a.prototype.constructor=a,a.Qb=function(y,N,M){for(var W=Array(arguments.length-2),_e=2;_e<arguments.length;_e++)W[_e-2]=arguments[_e];return d.prototype[N].apply(y,W)}}function x(a){const d=a.length;if(0<d){const p=Array(d);for(let y=0;y<d;y++)p[y]=a[y];return p}return[]}function O(a,d){for(let p=1;p<arguments.length;p++){const y=arguments[p];if(u(y)){const N=a.length||0,M=y.length||0;a.length=N+M;for(let W=0;W<M;W++)a[N+W]=y[W]}else a.push(y)}}class k{constructor(d,p){this.i=d,this.j=p,this.h=0,this.g=null}get(){let d;return 0<this.h?(this.h--,d=this.g,this.g=d.next,d.next=null):d=this.i(),d}}function E(a){return/^[\s\xa0]*$/.test(a)}function A(){var a=l.navigator;return a&&(a=a.userAgent)?a:""}function V(a){return V[" "](a),a}V[" "]=function(){};var F=A().indexOf("Gecko")!=-1&&!(A().toLowerCase().indexOf("webkit")!=-1&&A().indexOf("Edge")==-1)&&!(A().indexOf("Trident")!=-1||A().indexOf("MSIE")!=-1)&&A().indexOf("Edge")==-1;function D(a,d,p){for(const y in a)d.call(p,a[y],y,a)}function S(a,d){for(const p in a)d.call(void 0,a[p],p,a)}function v(a){const d={};for(const p in a)d[p]=a[p];return d}const T="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function C(a,d){let p,y;for(let N=1;N<arguments.length;N++){y=arguments[N];for(p in y)a[p]=y[p];for(let M=0;M<T.length;M++)p=T[M],Object.prototype.hasOwnProperty.call(y,p)&&(a[p]=y[p])}}function P(a){var d=1;a=a.split(":");const p=[];for(;0<d&&a.length;)p.push(a.shift()),d--;return a.length&&p.push(a.join(":")),p}function R(a){l.setTimeout(()=>{throw a},0)}function w(){var a=G;let d=null;return a.g&&(d=a.g,a.g=a.g.next,a.g||(a.h=null),d.next=null),d}class ae{constructor(){this.h=this.g=null}add(d,p){const y=ce.get();y.set(d,p),this.h?this.h.next=y:this.g=y,this.h=y}}var ce=new k(()=>new Oe,a=>a.reset());class Oe{constructor(){this.next=this.g=this.h=null}set(d,p){this.h=d,this.g=p,this.next=null}reset(){this.next=this.g=this.h=null}}let Q,B=!1,G=new ae,K=()=>{const a=l.Promise.resolve(void 0);Q=()=>{a.then(fe)}};var fe=()=>{for(var a;a=w();){try{a.h.call(a.g)}catch(p){R(p)}var d=ce;d.j(a),100>d.h&&(d.h++,a.next=d.g,d.g=a)}B=!1};function de(){this.s=this.s,this.C=this.C}de.prototype.s=!1,de.prototype.ma=function(){this.s||(this.s=!0,this.N())},de.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function ge(a,d){this.type=a,this.g=this.target=d,this.defaultPrevented=!1}ge.prototype.h=function(){this.defaultPrevented=!0};var ve=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,d=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const p=()=>{};l.addEventListener("test",p,d),l.removeEventListener("test",p,d)}catch{}return a}();function qe(a,d){if(ge.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var p=this.type=a.type,y=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=d,d=a.relatedTarget){if(F){e:{try{V(d.nodeName);var N=!0;break e}catch{}N=!1}N||(d=null)}}else p=="mouseover"?d=a.fromElement:p=="mouseout"&&(d=a.toElement);this.relatedTarget=d,y?(this.clientX=y.clientX!==void 0?y.clientX:y.pageX,this.clientY=y.clientY!==void 0?y.clientY:y.pageY,this.screenX=y.screenX||0,this.screenY=y.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:Ye[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&qe.aa.h.call(this)}}b(qe,ge);var Ye={2:"touch",3:"pen",4:"mouse"};qe.prototype.h=function(){qe.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var ot="closure_listenable_"+(1e6*Math.random()|0),dc=0;function hc(a,d,p,y,N){this.listener=a,this.proxy=null,this.src=d,this.type=p,this.capture=!!y,this.ha=N,this.key=++dc,this.da=this.fa=!1}function $r(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function _t(a){this.src=a,this.g={},this.h=0}_t.prototype.add=function(a,d,p,y,N){var M=a.toString();a=this.g[M],a||(a=this.g[M]=[],this.h++);var W=Ns(a,d,y,N);return-1<W?(d=a[W],p||(d.fa=!1)):(d=new hc(d,this.src,M,!!y,N),d.fa=p,a.push(d)),d};function Wr(a,d){var p=d.type;if(p in a.g){var y=a.g[p],N=Array.prototype.indexOf.call(y,d,void 0),M;(M=0<=N)&&Array.prototype.splice.call(y,N,1),M&&($r(d),a.g[p].length==0&&(delete a.g[p],a.h--))}}function Ns(a,d,p,y){for(var N=0;N<a.length;++N){var M=a[N];if(!M.da&&M.listener==d&&M.capture==!!p&&M.ha==y)return N}return-1}var Rn="closure_lm_"+(1e6*Math.random()|0),ki={};function Os(a,d,p,y,N){if(Array.isArray(d)){for(var M=0;M<d.length;M++)Os(a,d[M],p,y,N);return null}return p=Ms(p),a&&a[ot]?a.K(d,p,c(y)?!!y.capture:!1,N):Vs(a,d,p,!1,y,N)}function Vs(a,d,p,y,N,M){if(!d)throw Error("Invalid event type");var W=c(N)?!!N.capture:!!N,_e=oe(a);if(_e||(a[Rn]=_e=new _t(a)),p=_e.add(d,p,y,W,M),p.proxy)return p;if(y=Ea(),p.proxy=y,y.src=a,y.listener=p,a.addEventListener)ve||(N=W),N===void 0&&(N=!1),a.addEventListener(d.toString(),y,N);else if(a.attachEvent)a.attachEvent(Ve(d.toString()),y);else if(a.addListener&&a.removeListener)a.addListener(y);else throw Error("addEventListener and attachEvent are unavailable.");return p}function Ea(){function a(p){return d.call(a.src,a.listener,p)}const d=Xe;return a}function Ta(a,d,p,y,N){if(Array.isArray(d))for(var M=0;M<d.length;M++)Ta(a,d[M],p,y,N);else y=c(y)?!!y.capture:!!y,p=Ms(p),a&&a[ot]?(a=a.i,d=String(d).toString(),d in a.g&&(M=a.g[d],p=Ns(M,p,y,N),-1<p&&($r(M[p]),Array.prototype.splice.call(M,p,1),M.length==0&&(delete a.g[d],a.h--)))):a&&(a=oe(a))&&(d=a.g[d.toString()],a=-1,d&&(a=Ns(d,p,y,N)),(p=-1<a?d[a]:null)&&j(p))}function j(a){if(typeof a!="number"&&a&&!a.da){var d=a.src;if(d&&d[ot])Wr(d.i,a);else{var p=a.type,y=a.proxy;d.removeEventListener?d.removeEventListener(p,y,a.capture):d.detachEvent?d.detachEvent(Ve(p),y):d.addListener&&d.removeListener&&d.removeListener(y),(p=oe(d))?(Wr(p,a),p.h==0&&(p.src=null,d[Rn]=null)):$r(a)}}}function Ve(a){return a in ki?ki[a]:ki[a]="on"+a}function Xe(a,d){if(a.da)a=!0;else{d=new qe(d,this);var p=a.listener,y=a.ha||a.src;a.fa&&j(a),a=p.call(y,d)}return a}function oe(a){return a=a[Rn],a instanceof _t?a:null}var Ut="__closure_events_fn_"+(1e9*Math.random()>>>0);function Ms(a){return typeof a=="function"?a:(a[Ut]||(a[Ut]=function(d){return a.handleEvent(d)}),a[Ut])}function at(){de.call(this),this.i=new _t(this),this.M=this,this.F=null}b(at,de),at.prototype[ot]=!0,at.prototype.removeEventListener=function(a,d,p,y){Ta(this,a,d,p,y)};function wt(a,d){var p,y=a.F;if(y)for(p=[];y;y=y.F)p.push(y);if(a=a.M,y=d.type||d,typeof d=="string")d=new ge(d,a);else if(d instanceof ge)d.target=d.target||a;else{var N=d;d=new ge(y,a),C(d,N)}if(N=!0,p)for(var M=p.length-1;0<=M;M--){var W=d.g=p[M];N=Sa(W,y,!0,d)&&N}if(W=d.g=a,N=Sa(W,y,!0,d)&&N,N=Sa(W,y,!1,d)&&N,p)for(M=0;M<p.length;M++)W=d.g=p[M],N=Sa(W,y,!1,d)&&N}at.prototype.N=function(){if(at.aa.N.call(this),this.i){var a=this.i,d;for(d in a.g){for(var p=a.g[d],y=0;y<p.length;y++)$r(p[y]);delete a.g[d],a.h--}}this.F=null},at.prototype.K=function(a,d,p,y){return this.i.add(String(a),d,!1,p,y)},at.prototype.L=function(a,d,p,y){return this.i.add(String(a),d,!0,p,y)};function Sa(a,d,p,y){if(d=a.i.g[String(d)],!d)return!0;d=d.concat();for(var N=!0,M=0;M<d.length;++M){var W=d[M];if(W&&!W.da&&W.capture==p){var _e=W.listener,Je=W.ha||W.src;W.fa&&Wr(a.i,W),N=_e.call(Je,y)!==!1&&N}}return N&&!y.defaultPrevented}function Op(a,d,p){if(typeof a=="function")p&&(a=g(a,p));else if(a&&typeof a.handleEvent=="function")a=g(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(d)?-1:l.setTimeout(a,d||0)}function Vp(a){a.g=Op(()=>{a.g=null,a.i&&(a.i=!1,Vp(a))},a.l);const d=a.h;a.h=null,a.m.apply(null,d)}class jE extends de{constructor(d,p){super(),this.m=d,this.l=p,this.h=null,this.i=!1,this.g=null}j(d){this.h=arguments,this.g?this.i=!0:Vp(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Ls(a){de.call(this),this.h=a,this.g={}}b(Ls,de);var Mp=[];function Lp(a){D(a.g,function(d,p){this.g.hasOwnProperty(p)&&j(d)},a),a.g={}}Ls.prototype.N=function(){Ls.aa.N.call(this),Lp(this)},Ls.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var fc=l.JSON.stringify,FE=l.JSON.parse,zE=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function pc(){}pc.prototype.h=null;function jp(a){return a.h||(a.h=a.i())}function Fp(){}var js={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function gc(){ge.call(this,"d")}b(gc,ge);function mc(){ge.call(this,"c")}b(mc,ge);var Hr={},zp=null;function Ia(){return zp=zp||new at}Hr.La="serverreachability";function Up(a){ge.call(this,Hr.La,a)}b(Up,ge);function Fs(a){const d=Ia();wt(d,new Up(d))}Hr.STAT_EVENT="statevent";function Bp(a,d){ge.call(this,Hr.STAT_EVENT,a),this.stat=d}b(Bp,ge);function Et(a){const d=Ia();wt(d,new Bp(d,a))}Hr.Ma="timingevent";function $p(a,d){ge.call(this,Hr.Ma,a),this.size=d}b($p,ge);function zs(a,d){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},d)}function Us(){this.g=!0}Us.prototype.xa=function(){this.g=!1};function UE(a,d,p,y,N,M){a.info(function(){if(a.g)if(M)for(var W="",_e=M.split("&"),Je=0;Je<_e.length;Je++){var pe=_e[Je].split("=");if(1<pe.length){var lt=pe[0];pe=pe[1];var ut=lt.split("_");W=2<=ut.length&&ut[1]=="type"?W+(lt+"="+pe+"&"):W+(lt+"=redacted&")}}else W=null;else W=M;return"XMLHTTP REQ ("+y+") [attempt "+N+"]: "+d+`
`+p+`
`+W})}function BE(a,d,p,y,N,M,W){a.info(function(){return"XMLHTTP RESP ("+y+") [ attempt "+N+"]: "+d+`
`+p+`
`+M+" "+W})}function Ci(a,d,p,y){a.info(function(){return"XMLHTTP TEXT ("+d+"): "+WE(a,p)+(y?" "+y:"")})}function $E(a,d){a.info(function(){return"TIMEOUT: "+d})}Us.prototype.info=function(){};function WE(a,d){if(!a.g)return d;if(!d)return null;try{var p=JSON.parse(d);if(p){for(a=0;a<p.length;a++)if(Array.isArray(p[a])){var y=p[a];if(!(2>y.length)){var N=y[1];if(Array.isArray(N)&&!(1>N.length)){var M=N[0];if(M!="noop"&&M!="stop"&&M!="close")for(var W=1;W<N.length;W++)N[W]=""}}}}return fc(p)}catch{return d}}var xa={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Wp={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},yc;function ka(){}b(ka,pc),ka.prototype.g=function(){return new XMLHttpRequest},ka.prototype.i=function(){return{}},yc=new ka;function tr(a,d,p,y){this.j=a,this.i=d,this.l=p,this.R=y||1,this.U=new Ls(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Hp}function Hp(){this.i=null,this.g="",this.h=!1}var qp={},vc={};function _c(a,d,p){a.L=1,a.v=Ra(Pn(d)),a.m=p,a.P=!0,Kp(a,null)}function Kp(a,d){a.F=Date.now(),Ca(a),a.A=Pn(a.v);var p=a.A,y=a.R;Array.isArray(y)||(y=[String(y)]),ag(p.i,"t",y),a.C=0,p=a.j.J,a.h=new Hp,a.g=xg(a.j,p?d:null,!a.m),0<a.O&&(a.M=new jE(g(a.Y,a,a.g),a.O)),d=a.U,p=a.g,y=a.ca;var N="readystatechange";Array.isArray(N)||(N&&(Mp[0]=N.toString()),N=Mp);for(var M=0;M<N.length;M++){var W=Os(p,N[M],y||d.handleEvent,!1,d.h||d);if(!W)break;d.g[W.key]=W}d=a.H?v(a.H):{},a.m?(a.u||(a.u="POST"),d["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,d)):(a.u="GET",a.g.ea(a.A,a.u,null,d)),Fs(),UE(a.i,a.u,a.A,a.l,a.R,a.m)}tr.prototype.ca=function(a){a=a.target;const d=this.M;d&&Dn(a)==3?d.j():this.Y(a)},tr.prototype.Y=function(a){try{if(a==this.g)e:{const ut=Dn(this.g);var d=this.g.Ba();const Ri=this.g.Z();if(!(3>ut)&&(ut!=3||this.g&&(this.h.h||this.g.oa()||pg(this.g)))){this.J||ut!=4||d==7||(d==8||0>=Ri?Fs(3):Fs(2)),wc(this);var p=this.g.Z();this.X=p;t:if(Gp(this)){var y=pg(this.g);a="";var N=y.length,M=Dn(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){qr(this),Bs(this);var W="";break t}this.h.i=new l.TextDecoder}for(d=0;d<N;d++)this.h.h=!0,a+=this.h.i.decode(y[d],{stream:!(M&&d==N-1)});y.length=0,this.h.g+=a,this.C=0,W=this.h.g}else W=this.g.oa();if(this.o=p==200,BE(this.i,this.u,this.A,this.l,this.R,ut,p),this.o){if(this.T&&!this.K){t:{if(this.g){var _e,Je=this.g;if((_e=Je.g?Je.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!E(_e)){var pe=_e;break t}}pe=null}if(p=pe)Ci(this.i,this.l,p,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Ec(this,p);else{this.o=!1,this.s=3,Et(12),qr(this),Bs(this);break e}}if(this.P){p=!0;let en;for(;!this.J&&this.C<W.length;)if(en=HE(this,W),en==vc){ut==4&&(this.s=4,Et(14),p=!1),Ci(this.i,this.l,null,"[Incomplete Response]");break}else if(en==qp){this.s=4,Et(15),Ci(this.i,this.l,W,"[Invalid Chunk]"),p=!1;break}else Ci(this.i,this.l,en,null),Ec(this,en);if(Gp(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ut!=4||W.length!=0||this.h.h||(this.s=1,Et(16),p=!1),this.o=this.o&&p,!p)Ci(this.i,this.l,W,"[Invalid Chunked Response]"),qr(this),Bs(this);else if(0<W.length&&!this.W){this.W=!0;var lt=this.j;lt.g==this&&lt.ba&&!lt.M&&(lt.j.info("Great, no buffering proxy detected. Bytes received: "+W.length),Cc(lt),lt.M=!0,Et(11))}}else Ci(this.i,this.l,W,null),Ec(this,W);ut==4&&qr(this),this.o&&!this.J&&(ut==4?Eg(this.j,this):(this.o=!1,Ca(this)))}else lT(this.g),p==400&&0<W.indexOf("Unknown SID")?(this.s=3,Et(12)):(this.s=0,Et(13)),qr(this),Bs(this)}}}catch{}finally{}};function Gp(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function HE(a,d){var p=a.C,y=d.indexOf(`
`,p);return y==-1?vc:(p=Number(d.substring(p,y)),isNaN(p)?qp:(y+=1,y+p>d.length?vc:(d=d.slice(y,y+p),a.C=y+p,d)))}tr.prototype.cancel=function(){this.J=!0,qr(this)};function Ca(a){a.S=Date.now()+a.I,Qp(a,a.I)}function Qp(a,d){if(a.B!=null)throw Error("WatchDog timer not null");a.B=zs(g(a.ba,a),d)}function wc(a){a.B&&(l.clearTimeout(a.B),a.B=null)}tr.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?($E(this.i,this.A),this.L!=2&&(Fs(),Et(17)),qr(this),this.s=2,Bs(this)):Qp(this,this.S-a)};function Bs(a){a.j.G==0||a.J||Eg(a.j,a)}function qr(a){wc(a);var d=a.M;d&&typeof d.ma=="function"&&d.ma(),a.M=null,Lp(a.U),a.g&&(d=a.g,a.g=null,d.abort(),d.ma())}function Ec(a,d){try{var p=a.j;if(p.G!=0&&(p.g==a||Tc(p.h,a))){if(!a.K&&Tc(p.h,a)&&p.G==3){try{var y=p.Da.g.parse(d)}catch{y=null}if(Array.isArray(y)&&y.length==3){var N=y;if(N[0]==0){e:if(!p.u){if(p.g)if(p.g.F+3e3<a.F)Ma(p),Oa(p);else break e;kc(p),Et(18)}}else p.za=N[1],0<p.za-p.T&&37500>N[2]&&p.F&&p.v==0&&!p.C&&(p.C=zs(g(p.Za,p),6e3));if(1>=Jp(p.h)&&p.ca){try{p.ca()}catch{}p.ca=void 0}}else Gr(p,11)}else if((a.K||p.g==a)&&Ma(p),!E(d))for(N=p.Da.g.parse(d),d=0;d<N.length;d++){let pe=N[d];if(p.T=pe[0],pe=pe[1],p.G==2)if(pe[0]=="c"){p.K=pe[1],p.ia=pe[2];const lt=pe[3];lt!=null&&(p.la=lt,p.j.info("VER="+p.la));const ut=pe[4];ut!=null&&(p.Aa=ut,p.j.info("SVER="+p.Aa));const Ri=pe[5];Ri!=null&&typeof Ri=="number"&&0<Ri&&(y=1.5*Ri,p.L=y,p.j.info("backChannelRequestTimeoutMs_="+y)),y=p;const en=a.g;if(en){const ja=en.g?en.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(ja){var M=y.h;M.g||ja.indexOf("spdy")==-1&&ja.indexOf("quic")==-1&&ja.indexOf("h2")==-1||(M.j=M.l,M.g=new Set,M.h&&(Sc(M,M.h),M.h=null))}if(y.D){const bc=en.g?en.g.getResponseHeader("X-HTTP-Session-Id"):null;bc&&(y.ya=bc,Ee(y.I,y.D,bc))}}p.G=3,p.l&&p.l.ua(),p.ba&&(p.R=Date.now()-a.F,p.j.info("Handshake RTT: "+p.R+"ms")),y=p;var W=a;if(y.qa=Ig(y,y.J?y.ia:null,y.W),W.K){Zp(y.h,W);var _e=W,Je=y.L;Je&&(_e.I=Je),_e.B&&(wc(_e),Ca(_e)),y.g=W}else _g(y);0<p.i.length&&Va(p)}else pe[0]!="stop"&&pe[0]!="close"||Gr(p,7);else p.G==3&&(pe[0]=="stop"||pe[0]=="close"?pe[0]=="stop"?Gr(p,7):xc(p):pe[0]!="noop"&&p.l&&p.l.ta(pe),p.v=0)}}Fs(4)}catch{}}var qE=class{constructor(a,d){this.g=a,this.map=d}};function Yp(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Xp(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function Jp(a){return a.h?1:a.g?a.g.size:0}function Tc(a,d){return a.h?a.h==d:a.g?a.g.has(d):!1}function Sc(a,d){a.g?a.g.add(d):a.h=d}function Zp(a,d){a.h&&a.h==d?a.h=null:a.g&&a.g.has(d)&&a.g.delete(d)}Yp.prototype.cancel=function(){if(this.i=eg(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function eg(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let d=a.i;for(const p of a.g.values())d=d.concat(p.D);return d}return x(a.i)}function KE(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(u(a)){for(var d=[],p=a.length,y=0;y<p;y++)d.push(a[y]);return d}d=[],p=0;for(y in a)d[p++]=a[y];return d}function GE(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(u(a)||typeof a=="string"){var d=[];a=a.length;for(var p=0;p<a;p++)d.push(p);return d}d=[],p=0;for(const y in a)d[p++]=y;return d}}}function tg(a,d){if(a.forEach&&typeof a.forEach=="function")a.forEach(d,void 0);else if(u(a)||typeof a=="string")Array.prototype.forEach.call(a,d,void 0);else for(var p=GE(a),y=KE(a),N=y.length,M=0;M<N;M++)d.call(void 0,y[M],p&&p[M],a)}var ng=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function QE(a,d){if(a){a=a.split("&");for(var p=0;p<a.length;p++){var y=a[p].indexOf("="),N=null;if(0<=y){var M=a[p].substring(0,y);N=a[p].substring(y+1)}else M=a[p];d(M,N?decodeURIComponent(N.replace(/\+/g," ")):"")}}}function Kr(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof Kr){this.h=a.h,ba(this,a.j),this.o=a.o,this.g=a.g,Aa(this,a.s),this.l=a.l;var d=a.i,p=new Hs;p.i=d.i,d.g&&(p.g=new Map(d.g),p.h=d.h),rg(this,p),this.m=a.m}else a&&(d=String(a).match(ng))?(this.h=!1,ba(this,d[1]||"",!0),this.o=$s(d[2]||""),this.g=$s(d[3]||"",!0),Aa(this,d[4]),this.l=$s(d[5]||"",!0),rg(this,d[6]||"",!0),this.m=$s(d[7]||"")):(this.h=!1,this.i=new Hs(null,this.h))}Kr.prototype.toString=function(){var a=[],d=this.j;d&&a.push(Ws(d,ig,!0),":");var p=this.g;return(p||d=="file")&&(a.push("//"),(d=this.o)&&a.push(Ws(d,ig,!0),"@"),a.push(encodeURIComponent(String(p)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),p=this.s,p!=null&&a.push(":",String(p))),(p=this.l)&&(this.g&&p.charAt(0)!="/"&&a.push("/"),a.push(Ws(p,p.charAt(0)=="/"?JE:XE,!0))),(p=this.i.toString())&&a.push("?",p),(p=this.m)&&a.push("#",Ws(p,eT)),a.join("")};function Pn(a){return new Kr(a)}function ba(a,d,p){a.j=p?$s(d,!0):d,a.j&&(a.j=a.j.replace(/:$/,""))}function Aa(a,d){if(d){if(d=Number(d),isNaN(d)||0>d)throw Error("Bad port number "+d);a.s=d}else a.s=null}function rg(a,d,p){d instanceof Hs?(a.i=d,tT(a.i,a.h)):(p||(d=Ws(d,ZE)),a.i=new Hs(d,a.h))}function Ee(a,d,p){a.i.set(d,p)}function Ra(a){return Ee(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function $s(a,d){return a?d?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function Ws(a,d,p){return typeof a=="string"?(a=encodeURI(a).replace(d,YE),p&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function YE(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var ig=/[#\/\?@]/g,XE=/[#\?:]/g,JE=/[#\?]/g,ZE=/[#\?@]/g,eT=/#/g;function Hs(a,d){this.h=this.g=null,this.i=a||null,this.j=!!d}function nr(a){a.g||(a.g=new Map,a.h=0,a.i&&QE(a.i,function(d,p){a.add(decodeURIComponent(d.replace(/\+/g," ")),p)}))}t=Hs.prototype,t.add=function(a,d){nr(this),this.i=null,a=bi(this,a);var p=this.g.get(a);return p||this.g.set(a,p=[]),p.push(d),this.h+=1,this};function sg(a,d){nr(a),d=bi(a,d),a.g.has(d)&&(a.i=null,a.h-=a.g.get(d).length,a.g.delete(d))}function og(a,d){return nr(a),d=bi(a,d),a.g.has(d)}t.forEach=function(a,d){nr(this),this.g.forEach(function(p,y){p.forEach(function(N){a.call(d,N,y,this)},this)},this)},t.na=function(){nr(this);const a=Array.from(this.g.values()),d=Array.from(this.g.keys()),p=[];for(let y=0;y<d.length;y++){const N=a[y];for(let M=0;M<N.length;M++)p.push(d[y])}return p},t.V=function(a){nr(this);let d=[];if(typeof a=="string")og(this,a)&&(d=d.concat(this.g.get(bi(this,a))));else{a=Array.from(this.g.values());for(let p=0;p<a.length;p++)d=d.concat(a[p])}return d},t.set=function(a,d){return nr(this),this.i=null,a=bi(this,a),og(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[d]),this.h+=1,this},t.get=function(a,d){return a?(a=this.V(a),0<a.length?String(a[0]):d):d};function ag(a,d,p){sg(a,d),0<p.length&&(a.i=null,a.g.set(bi(a,d),x(p)),a.h+=p.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],d=Array.from(this.g.keys());for(var p=0;p<d.length;p++){var y=d[p];const M=encodeURIComponent(String(y)),W=this.V(y);for(y=0;y<W.length;y++){var N=M;W[y]!==""&&(N+="="+encodeURIComponent(String(W[y]))),a.push(N)}}return this.i=a.join("&")};function bi(a,d){return d=String(d),a.j&&(d=d.toLowerCase()),d}function tT(a,d){d&&!a.j&&(nr(a),a.i=null,a.g.forEach(function(p,y){var N=y.toLowerCase();y!=N&&(sg(this,y),ag(this,N,p))},a)),a.j=d}function nT(a,d){const p=new Us;if(l.Image){const y=new Image;y.onload=_(rr,p,"TestLoadImage: loaded",!0,d,y),y.onerror=_(rr,p,"TestLoadImage: error",!1,d,y),y.onabort=_(rr,p,"TestLoadImage: abort",!1,d,y),y.ontimeout=_(rr,p,"TestLoadImage: timeout",!1,d,y),l.setTimeout(function(){y.ontimeout&&y.ontimeout()},1e4),y.src=a}else d(!1)}function rT(a,d){const p=new Us,y=new AbortController,N=setTimeout(()=>{y.abort(),rr(p,"TestPingServer: timeout",!1,d)},1e4);fetch(a,{signal:y.signal}).then(M=>{clearTimeout(N),M.ok?rr(p,"TestPingServer: ok",!0,d):rr(p,"TestPingServer: server error",!1,d)}).catch(()=>{clearTimeout(N),rr(p,"TestPingServer: error",!1,d)})}function rr(a,d,p,y,N){try{N&&(N.onload=null,N.onerror=null,N.onabort=null,N.ontimeout=null),y(p)}catch{}}function iT(){this.g=new zE}function sT(a,d,p){const y=p||"";try{tg(a,function(N,M){let W=N;c(N)&&(W=fc(N)),d.push(y+M+"="+encodeURIComponent(W))})}catch(N){throw d.push(y+"type="+encodeURIComponent("_badmap")),N}}function Pa(a){this.l=a.Ub||null,this.j=a.eb||!1}b(Pa,pc),Pa.prototype.g=function(){return new Da(this.l,this.j)},Pa.prototype.i=function(a){return function(){return a}}({});function Da(a,d){at.call(this),this.D=a,this.o=d,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}b(Da,at),t=Da.prototype,t.open=function(a,d){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=d,this.readyState=1,Ks(this)},t.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const d={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(d.body=a),(this.D||l).fetch(new Request(this.A,d)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,qs(this)),this.readyState=0},t.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Ks(this)),this.g&&(this.readyState=3,Ks(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;lg(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function lg(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}t.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var d=a.value?a.value:new Uint8Array(0);(d=this.v.decode(d,{stream:!a.done}))&&(this.response=this.responseText+=d)}a.done?qs(this):Ks(this),this.readyState==3&&lg(this)}},t.Ra=function(a){this.g&&(this.response=this.responseText=a,qs(this))},t.Qa=function(a){this.g&&(this.response=a,qs(this))},t.ga=function(){this.g&&qs(this)};function qs(a){a.readyState=4,a.l=null,a.j=null,a.v=null,Ks(a)}t.setRequestHeader=function(a,d){this.u.append(a,d)},t.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],d=this.h.entries();for(var p=d.next();!p.done;)p=p.value,a.push(p[0]+": "+p[1]),p=d.next();return a.join(`\r
`)};function Ks(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(Da.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function ug(a){let d="";return D(a,function(p,y){d+=y,d+=":",d+=p,d+=`\r
`}),d}function Ic(a,d,p){e:{for(y in p){var y=!1;break e}y=!0}y||(p=ug(p),typeof a=="string"?p!=null&&encodeURIComponent(String(p)):Ee(a,d,p))}function De(a){at.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}b(De,at);var oT=/^https?$/i,aT=["POST","PUT"];t=De.prototype,t.Ha=function(a){this.J=a},t.ea=function(a,d,p,y){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);d=d?d.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():yc.g(),this.v=this.o?jp(this.o):jp(yc),this.g.onreadystatechange=g(this.Ea,this);try{this.B=!0,this.g.open(d,String(a),!0),this.B=!1}catch(M){cg(this,M);return}if(a=p||"",p=new Map(this.headers),y)if(Object.getPrototypeOf(y)===Object.prototype)for(var N in y)p.set(N,y[N]);else if(typeof y.keys=="function"&&typeof y.get=="function")for(const M of y.keys())p.set(M,y.get(M));else throw Error("Unknown input type for opt_headers: "+String(y));y=Array.from(p.keys()).find(M=>M.toLowerCase()=="content-type"),N=l.FormData&&a instanceof l.FormData,!(0<=Array.prototype.indexOf.call(aT,d,void 0))||y||N||p.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[M,W]of p)this.g.setRequestHeader(M,W);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{fg(this),this.u=!0,this.g.send(a),this.u=!1}catch(M){cg(this,M)}};function cg(a,d){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=d,a.m=5,dg(a),Na(a)}function dg(a){a.A||(a.A=!0,wt(a,"complete"),wt(a,"error"))}t.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,wt(this,"complete"),wt(this,"abort"),Na(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Na(this,!0)),De.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?hg(this):this.bb())},t.bb=function(){hg(this)};function hg(a){if(a.h&&typeof o<"u"&&(!a.v[1]||Dn(a)!=4||a.Z()!=2)){if(a.u&&Dn(a)==4)Op(a.Ea,0,a);else if(wt(a,"readystatechange"),Dn(a)==4){a.h=!1;try{const W=a.Z();e:switch(W){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var d=!0;break e;default:d=!1}var p;if(!(p=d)){var y;if(y=W===0){var N=String(a.D).match(ng)[1]||null;!N&&l.self&&l.self.location&&(N=l.self.location.protocol.slice(0,-1)),y=!oT.test(N?N.toLowerCase():"")}p=y}if(p)wt(a,"complete"),wt(a,"success");else{a.m=6;try{var M=2<Dn(a)?a.g.statusText:""}catch{M=""}a.l=M+" ["+a.Z()+"]",dg(a)}}finally{Na(a)}}}}function Na(a,d){if(a.g){fg(a);const p=a.g,y=a.v[0]?()=>{}:null;a.g=null,a.v=null,d||wt(a,"ready");try{p.onreadystatechange=y}catch{}}}function fg(a){a.I&&(l.clearTimeout(a.I),a.I=null)}t.isActive=function(){return!!this.g};function Dn(a){return a.g?a.g.readyState:0}t.Z=function(){try{return 2<Dn(this)?this.g.status:-1}catch{return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.Oa=function(a){if(this.g){var d=this.g.responseText;return a&&d.indexOf(a)==0&&(d=d.substring(a.length)),FE(d)}};function pg(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function lT(a){const d={};a=(a.g&&2<=Dn(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let y=0;y<a.length;y++){if(E(a[y]))continue;var p=P(a[y]);const N=p[0];if(p=p[1],typeof p!="string")continue;p=p.trim();const M=d[N]||[];d[N]=M,M.push(p)}S(d,function(y){return y.join(", ")})}t.Ba=function(){return this.m},t.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Gs(a,d,p){return p&&p.internalChannelParams&&p.internalChannelParams[a]||d}function gg(a){this.Aa=0,this.i=[],this.j=new Us,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Gs("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Gs("baseRetryDelayMs",5e3,a),this.cb=Gs("retryDelaySeedMs",1e4,a),this.Wa=Gs("forwardChannelMaxRetries",2,a),this.wa=Gs("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new Yp(a&&a.concurrentRequestLimit),this.Da=new iT,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}t=gg.prototype,t.la=8,t.G=1,t.connect=function(a,d,p,y){Et(0),this.W=a,this.H=d||{},p&&y!==void 0&&(this.H.OSID=p,this.H.OAID=y),this.F=this.X,this.I=Ig(this,null,this.W),Va(this)};function xc(a){if(mg(a),a.G==3){var d=a.U++,p=Pn(a.I);if(Ee(p,"SID",a.K),Ee(p,"RID",d),Ee(p,"TYPE","terminate"),Qs(a,p),d=new tr(a,a.j,d),d.L=2,d.v=Ra(Pn(p)),p=!1,l.navigator&&l.navigator.sendBeacon)try{p=l.navigator.sendBeacon(d.v.toString(),"")}catch{}!p&&l.Image&&(new Image().src=d.v,p=!0),p||(d.g=xg(d.j,null),d.g.ea(d.v)),d.F=Date.now(),Ca(d)}Sg(a)}function Oa(a){a.g&&(Cc(a),a.g.cancel(),a.g=null)}function mg(a){Oa(a),a.u&&(l.clearTimeout(a.u),a.u=null),Ma(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&l.clearTimeout(a.s),a.s=null)}function Va(a){if(!Xp(a.h)&&!a.s){a.s=!0;var d=a.Ga;Q||K(),B||(Q(),B=!0),G.add(d,a),a.B=0}}function uT(a,d){return Jp(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=d.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=zs(g(a.Ga,a,d),Tg(a,a.B)),a.B++,!0)}t.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const N=new tr(this,this.j,a);let M=this.o;if(this.S&&(M?(M=v(M),C(M,this.S)):M=this.S),this.m!==null||this.O||(N.H=M,M=null),this.P)e:{for(var d=0,p=0;p<this.i.length;p++){t:{var y=this.i[p];if("__data__"in y.map&&(y=y.map.__data__,typeof y=="string")){y=y.length;break t}y=void 0}if(y===void 0)break;if(d+=y,4096<d){d=p;break e}if(d===4096||p===this.i.length-1){d=p+1;break e}}d=1e3}else d=1e3;d=vg(this,N,d),p=Pn(this.I),Ee(p,"RID",a),Ee(p,"CVER",22),this.D&&Ee(p,"X-HTTP-Session-Id",this.D),Qs(this,p),M&&(this.O?d="headers="+encodeURIComponent(String(ug(M)))+"&"+d:this.m&&Ic(p,this.m,M)),Sc(this.h,N),this.Ua&&Ee(p,"TYPE","init"),this.P?(Ee(p,"$req",d),Ee(p,"SID","null"),N.T=!0,_c(N,p,null)):_c(N,p,d),this.G=2}}else this.G==3&&(a?yg(this,a):this.i.length==0||Xp(this.h)||yg(this))};function yg(a,d){var p;d?p=d.l:p=a.U++;const y=Pn(a.I);Ee(y,"SID",a.K),Ee(y,"RID",p),Ee(y,"AID",a.T),Qs(a,y),a.m&&a.o&&Ic(y,a.m,a.o),p=new tr(a,a.j,p,a.B+1),a.m===null&&(p.H=a.o),d&&(a.i=d.D.concat(a.i)),d=vg(a,p,1e3),p.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),Sc(a.h,p),_c(p,y,d)}function Qs(a,d){a.H&&D(a.H,function(p,y){Ee(d,y,p)}),a.l&&tg({},function(p,y){Ee(d,y,p)})}function vg(a,d,p){p=Math.min(a.i.length,p);var y=a.l?g(a.l.Na,a.l,a):null;e:{var N=a.i;let M=-1;for(;;){const W=["count="+p];M==-1?0<p?(M=N[0].g,W.push("ofs="+M)):M=0:W.push("ofs="+M);let _e=!0;for(let Je=0;Je<p;Je++){let pe=N[Je].g;const lt=N[Je].map;if(pe-=M,0>pe)M=Math.max(0,N[Je].g-100),_e=!1;else try{sT(lt,W,"req"+pe+"_")}catch{y&&y(lt)}}if(_e){y=W.join("&");break e}}}return a=a.i.splice(0,p),d.D=a,y}function _g(a){if(!a.g&&!a.u){a.Y=1;var d=a.Fa;Q||K(),B||(Q(),B=!0),G.add(d,a),a.v=0}}function kc(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=zs(g(a.Fa,a),Tg(a,a.v)),a.v++,!0)}t.Fa=function(){if(this.u=null,wg(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=zs(g(this.ab,this),a)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Et(10),Oa(this),wg(this))};function Cc(a){a.A!=null&&(l.clearTimeout(a.A),a.A=null)}function wg(a){a.g=new tr(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var d=Pn(a.qa);Ee(d,"RID","rpc"),Ee(d,"SID",a.K),Ee(d,"AID",a.T),Ee(d,"CI",a.F?"0":"1"),!a.F&&a.ja&&Ee(d,"TO",a.ja),Ee(d,"TYPE","xmlhttp"),Qs(a,d),a.m&&a.o&&Ic(d,a.m,a.o),a.L&&(a.g.I=a.L);var p=a.g;a=a.ia,p.L=1,p.v=Ra(Pn(d)),p.m=null,p.P=!0,Kp(p,a)}t.Za=function(){this.C!=null&&(this.C=null,Oa(this),kc(this),Et(19))};function Ma(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function Eg(a,d){var p=null;if(a.g==d){Ma(a),Cc(a),a.g=null;var y=2}else if(Tc(a.h,d))p=d.D,Zp(a.h,d),y=1;else return;if(a.G!=0){if(d.o)if(y==1){p=d.m?d.m.length:0,d=Date.now()-d.F;var N=a.B;y=Ia(),wt(y,new $p(y,p)),Va(a)}else _g(a);else if(N=d.s,N==3||N==0&&0<d.X||!(y==1&&uT(a,d)||y==2&&kc(a)))switch(p&&0<p.length&&(d=a.h,d.i=d.i.concat(p)),N){case 1:Gr(a,5);break;case 4:Gr(a,10);break;case 3:Gr(a,6);break;default:Gr(a,2)}}}function Tg(a,d){let p=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(p*=2),p*d}function Gr(a,d){if(a.j.info("Error code "+d),d==2){var p=g(a.fb,a),y=a.Xa;const N=!y;y=new Kr(y||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||ba(y,"https"),Ra(y),N?nT(y.toString(),p):rT(y.toString(),p)}else Et(2);a.G=0,a.l&&a.l.sa(d),Sg(a),mg(a)}t.fb=function(a){a?(this.j.info("Successfully pinged google.com"),Et(2)):(this.j.info("Failed to ping google.com"),Et(1))};function Sg(a){if(a.G=0,a.ka=[],a.l){const d=eg(a.h);(d.length!=0||a.i.length!=0)&&(O(a.ka,d),O(a.ka,a.i),a.h.i.length=0,x(a.i),a.i.length=0),a.l.ra()}}function Ig(a,d,p){var y=p instanceof Kr?Pn(p):new Kr(p);if(y.g!="")d&&(y.g=d+"."+y.g),Aa(y,y.s);else{var N=l.location;y=N.protocol,d=d?d+"."+N.hostname:N.hostname,N=+N.port;var M=new Kr(null);y&&ba(M,y),d&&(M.g=d),N&&Aa(M,N),p&&(M.l=p),y=M}return p=a.D,d=a.ya,p&&d&&Ee(y,p,d),Ee(y,"VER",a.la),Qs(a,y),y}function xg(a,d,p){if(d&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return d=a.Ca&&!a.pa?new De(new Pa({eb:p})):new De(a.pa),d.Ha(a.J),d}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function kg(){}t=kg.prototype,t.ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){};function La(){}La.prototype.g=function(a,d){return new Dt(a,d)};function Dt(a,d){at.call(this),this.g=new gg(d),this.l=a,this.h=d&&d.messageUrlParams||null,a=d&&d.messageHeaders||null,d&&d.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=d&&d.initMessageHeaders||null,d&&d.messageContentType&&(a?a["X-WebChannel-Content-Type"]=d.messageContentType:a={"X-WebChannel-Content-Type":d.messageContentType}),d&&d.va&&(a?a["X-WebChannel-Client-Profile"]=d.va:a={"X-WebChannel-Client-Profile":d.va}),this.g.S=a,(a=d&&d.Sb)&&!E(a)&&(this.g.m=a),this.v=d&&d.supportsCrossDomainXhr||!1,this.u=d&&d.sendRawJson||!1,(d=d&&d.httpSessionIdParam)&&!E(d)&&(this.g.D=d,a=this.h,a!==null&&d in a&&(a=this.h,d in a&&delete a[d])),this.j=new Ai(this)}b(Dt,at),Dt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Dt.prototype.close=function(){xc(this.g)},Dt.prototype.o=function(a){var d=this.g;if(typeof a=="string"){var p={};p.__data__=a,a=p}else this.u&&(p={},p.__data__=fc(a),a=p);d.i.push(new qE(d.Ya++,a)),d.G==3&&Va(d)},Dt.prototype.N=function(){this.g.l=null,delete this.j,xc(this.g),delete this.g,Dt.aa.N.call(this)};function Cg(a){gc.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var d=a.__sm__;if(d){e:{for(const p in d){a=p;break e}a=void 0}(this.i=a)&&(a=this.i,d=d!==null&&a in d?d[a]:void 0),this.data=d}else this.data=a}b(Cg,gc);function bg(){mc.call(this),this.status=1}b(bg,mc);function Ai(a){this.g=a}b(Ai,kg),Ai.prototype.ua=function(){wt(this.g,"a")},Ai.prototype.ta=function(a){wt(this.g,new Cg(a))},Ai.prototype.sa=function(a){wt(this.g,new bg)},Ai.prototype.ra=function(){wt(this.g,"b")},La.prototype.createWebChannel=La.prototype.g,Dt.prototype.send=Dt.prototype.o,Dt.prototype.open=Dt.prototype.m,Dt.prototype.close=Dt.prototype.close,Lw=function(){return new La},Mw=function(){return Ia()},Vw=Hr,wh={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},xa.NO_ERROR=0,xa.TIMEOUT=8,xa.HTTP_ERROR=6,Il=xa,Wp.COMPLETE="complete",Ow=Wp,Fp.EventType=js,js.OPEN="a",js.CLOSE="b",js.ERROR="c",js.MESSAGE="d",at.prototype.listen=at.prototype.K,co=Fp,De.prototype.listenOnce=De.prototype.L,De.prototype.getLastError=De.prototype.Ka,De.prototype.getLastErrorCode=De.prototype.Ba,De.prototype.getStatus=De.prototype.Z,De.prototype.getResponseJson=De.prototype.Oa,De.prototype.getResponseText=De.prototype.oa,De.prototype.send=De.prototype.ea,De.prototype.setWithCredentials=De.prototype.Ha,Nw=De}).apply(typeof rl<"u"?rl:typeof self<"u"?self:typeof window<"u"?window:{});const gy="@firebase/firestore",my="4.8.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ft{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}ft.UNAUTHENTICATED=new ft(null),ft.GOOGLE_CREDENTIALS=new ft("google-credentials-uid"),ft.FIRST_PARTY=new ft("first-party-uid"),ft.MOCK_USER=new ft("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let As="11.10.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gi=new Mf("@firebase/firestore");function Di(){return gi.logLevel}function H(t,...e){if(gi.logLevel<=ie.DEBUG){const n=e.map(Yf);gi.debug(`Firestore (${As}): ${t}`,...n)}}function Jn(t,...e){if(gi.logLevel<=ie.ERROR){const n=e.map(Yf);gi.error(`Firestore (${As}): ${t}`,...n)}}function Rr(t,...e){if(gi.logLevel<=ie.WARN){const n=e.map(Yf);gi.warn(`Firestore (${As}): ${t}`,...n)}}function Yf(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(n){return JSON.stringify(n)}(t)}catch{return t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Z(t,e,n){let r="Unexpected state";typeof e=="string"?r=e:n=e,jw(t,r,n)}function jw(t,e,n){let r=`FIRESTORE (${As}) INTERNAL ASSERTION FAILED: ${e} (ID: ${t.toString(16)})`;if(n!==void 0)try{r+=" CONTEXT: "+JSON.stringify(n)}catch{r+=" CONTEXT: "+n}throw Jn(r),new Error(r)}function me(t,e,n,r){let i="Unexpected state";typeof n=="string"?i=n:r=n,t||jw(e,i,r)}function te(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const U={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class Y extends An{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cr{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fw{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class MC{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(ft.UNAUTHENTICATED))}shutdown(){}}class LC{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class jC{constructor(e){this.t=e,this.currentUser=ft.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){me(this.o===void 0,42304);let r=this.i;const i=u=>this.i!==r?(r=this.i,n(u)):Promise.resolve();let s=new Cr;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new Cr,e.enqueueRetryable(()=>i(this.currentUser))};const o=()=>{const u=s;e.enqueueRetryable(async()=>{await u.promise,await i(this.currentUser)})},l=u=>{H("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(u=>l(u)),setTimeout(()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?l(u):(H("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new Cr)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(r=>this.i!==e?(H("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(me(typeof r.accessToken=="string",31837,{l:r}),new Fw(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return me(e===null||typeof e=="string",2055,{h:e}),new ft(e)}}class FC{constructor(e,n,r){this.P=e,this.T=n,this.I=r,this.type="FirstParty",this.user=ft.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class zC{constructor(e,n,r){this.P=e,this.T=n,this.I=r}getToken(){return Promise.resolve(new FC(this.P,this.T,this.I))}start(e,n){e.enqueueRetryable(()=>n(ft.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class yy{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class UC{constructor(e,n){this.V=n,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Ot(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,n){me(this.o===void 0,3512);const r=s=>{s.error!=null&&H("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const o=s.token!==this.m;return this.m=s.token,H("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>r(s))};const i=s=>{H("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(s=>i(s)),setTimeout(()=>{if(!this.appCheck){const s=this.V.getImmediate({optional:!0});s?i(s):H("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new yy(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(me(typeof n.token=="string",44558,{tokenResult:n}),this.m=n.token,new yy(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function BC(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zw(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xf{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const i=BC(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<n&&(r+=e.charAt(i[s]%62))}return r}}function ne(t,e){return t<e?-1:t>e?1:0}function Eh(t,e){let n=0;for(;n<t.length&&n<e.length;){const r=t.codePointAt(n),i=e.codePointAt(n);if(r!==i){if(r<128&&i<128)return ne(r,i);{const s=zw(),o=$C(s.encode(vy(t,n)),s.encode(vy(e,n)));return o!==0?o:ne(r,i)}}n+=r>65535?2:1}return ne(t.length,e.length)}function vy(t,e){return t.codePointAt(e)>65535?t.substring(e,e+2):t.substring(e,e+1)}function $C(t,e){for(let n=0;n<t.length&&n<e.length;++n)if(t[n]!==e[n])return ne(t[n],e[n]);return ne(t.length,e.length)}function gs(t,e,n){return t.length===e.length&&t.every((r,i)=>n(r,e[i]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _y="__name__";class gn{constructor(e,n,r){n===void 0?n=0:n>e.length&&Z(637,{offset:n,range:e.length}),r===void 0?r=e.length-n:r>e.length-n&&Z(1746,{length:r,range:e.length-n}),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return gn.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof gn?e.forEach(r=>{n.push(r)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const r=Math.min(e.length,n.length);for(let i=0;i<r;i++){const s=gn.compareSegments(e.get(i),n.get(i));if(s!==0)return s}return ne(e.length,n.length)}static compareSegments(e,n){const r=gn.isNumericId(e),i=gn.isNumericId(n);return r&&!i?-1:!r&&i?1:r&&i?gn.extractNumericId(e).compare(gn.extractNumericId(n)):Eh(e,n)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return kr.fromString(e.substring(4,e.length-2))}}class be extends gn{construct(e,n,r){return new be(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const r of e){if(r.indexOf("//")>=0)throw new Y(U.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(i=>i.length>0))}return new be(n)}static emptyPath(){return new be([])}}const WC=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class tt extends gn{construct(e,n,r){return new tt(e,n,r)}static isValidIdentifier(e){return WC.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),tt.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===_y}static keyField(){return new tt([_y])}static fromServerFormat(e){const n=[];let r="",i=0;const s=()=>{if(r.length===0)throw new Y(U.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let o=!1;for(;i<e.length;){const l=e[i];if(l==="\\"){if(i+1===e.length)throw new Y(U.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[i+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new Y(U.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,i+=2}else l==="`"?(o=!o,i++):l!=="."||o?(r+=l,i++):(s(),i++)}if(s(),o)throw new Y(U.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new tt(n)}static emptyPath(){return new tt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X{constructor(e){this.path=e}static fromPath(e){return new X(be.fromString(e))}static fromName(e){return new X(be.fromString(e).popFirst(5))}static empty(){return new X(be.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&be.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return be.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new X(new be(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function HC(t,e,n){if(!n)throw new Y(U.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function qC(t,e,n,r){if(e===!0&&r===!0)throw new Y(U.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function wy(t){if(!X.isDocumentKey(t))throw new Y(U.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function Uw(t){return typeof t=="object"&&t!==null&&(Object.getPrototypeOf(t)===Object.prototype||Object.getPrototypeOf(t)===null)}function Jf(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":Z(12329,{type:typeof t})}function Hn(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new Y(U.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=Jf(t);throw new Y(U.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ze(t,e){const n={typeString:t};return e&&(n.value=e),n}function ma(t,e){if(!Uw(t))throw new Y(U.INVALID_ARGUMENT,"JSON must be an object");let n;for(const r in e)if(e[r]){const i=e[r].typeString,s="value"in e[r]?{value:e[r].value}:void 0;if(!(r in t)){n=`JSON missing required field: '${r}'`;break}const o=t[r];if(i&&typeof o!==i){n=`JSON field '${r}' must be a ${i}.`;break}if(s!==void 0&&o!==s.value){n=`Expected '${r}' field to equal '${s.value}'`;break}}if(n)throw new Y(U.INVALID_ARGUMENT,n);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ey=-62135596800,Ty=1e6;class Se{static now(){return Se.fromMillis(Date.now())}static fromDate(e){return Se.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),r=Math.floor((e-1e3*n)*Ty);return new Se(n,r)}constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new Y(U.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new Y(U.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<Ey)throw new Y(U.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new Y(U.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Ty}_compareTo(e){return this.seconds===e.seconds?ne(this.nanoseconds,e.nanoseconds):ne(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Se._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(ma(e,Se._jsonSchema))return new Se(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Ey;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Se._jsonSchemaVersion="firestore/timestamp/1.0",Se._jsonSchema={type:ze("string",Se._jsonSchemaVersion),seconds:ze("number"),nanoseconds:ze("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee{static fromTimestamp(e){return new ee(e)}static min(){return new ee(new Se(0,0))}static max(){return new ee(new Se(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xo=-1;function KC(t,e){const n=t.toTimestamp().seconds,r=t.toTimestamp().nanoseconds+1,i=ee.fromTimestamp(r===1e9?new Se(n+1,0):new Se(n,r));return new Pr(i,X.empty(),e)}function GC(t){return new Pr(t.readTime,t.key,Xo)}class Pr{constructor(e,n,r){this.readTime=e,this.documentKey=n,this.largestBatchId=r}static min(){return new Pr(ee.min(),X.empty(),Xo)}static max(){return new Pr(ee.max(),X.empty(),Xo)}}function QC(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=X.comparator(t.documentKey,e.documentKey),n!==0?n:ne(t.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const YC="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class XC{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rs(t){if(t.code!==U.FAILED_PRECONDITION||t.message!==YC)throw t;H("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&Z(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new L((r,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(r,i)},this.catchCallback=s=>{this.wrapFailure(n,s).next(r,i)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof L?n:L.resolve(n)}catch(n){return L.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):L.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):L.reject(n)}static resolve(e){return new L((n,r)=>{n(e)})}static reject(e){return new L((n,r)=>{r(e)})}static waitFor(e){return new L((n,r)=>{let i=0,s=0,o=!1;e.forEach(l=>{++i,l.next(()=>{++s,o&&s===i&&n()},u=>r(u))}),o=!0,s===i&&n()})}static or(e){let n=L.resolve(!1);for(const r of e)n=n.next(i=>i?L.resolve(i):r());return n}static forEach(e,n){const r=[];return e.forEach((i,s)=>{r.push(n.call(this,i,s))}),this.waitFor(r)}static mapArray(e,n){return new L((r,i)=>{const s=e.length,o=new Array(s);let l=0;for(let u=0;u<s;u++){const c=u;n(e[c]).next(f=>{o[c]=f,++l,l===s&&r(o)},f=>i(f))}})}static doWhile(e,n){return new L((r,i)=>{const s=()=>{e()===!0?n().next(()=>{s()},i):r()};s()})}}function JC(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function Ps(t){return t.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qu{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=r=>this._e(r),this.ae=r=>n.writeSequenceNumber(r))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}Qu.ue=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zf=-1;function Yu(t){return t==null}function du(t){return t===0&&1/t==-1/0}function ZC(t){return typeof t=="number"&&Number.isInteger(t)&&!du(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bw="";function eb(t){let e="";for(let n=0;n<t.length;n++)e.length>0&&(e=Sy(e)),e=tb(t.get(n),e);return Sy(e)}function tb(t,e){let n=e;const r=t.length;for(let i=0;i<r;i++){const s=t.charAt(i);switch(s){case"\0":n+="";break;case Bw:n+="";break;default:n+=s}}return n}function Sy(t){return t+Bw+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Iy(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function Ti(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function $w(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe{constructor(e,n){this.comparator=e,this.root=n||et.EMPTY}insert(e,n){return new Pe(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,et.BLACK,null,null))}remove(e){return new Pe(this.comparator,this.root.remove(e,this.comparator).copy(null,null,et.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return n+r.left.size;i<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,r)=>(e(n,r),!1))}toString(){const e=[];return this.inorderTraversal((n,r)=>(e.push(`${n}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new il(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new il(this.root,e,this.comparator,!1)}getReverseIterator(){return new il(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new il(this.root,e,this.comparator,!0)}}class il{constructor(e,n,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=n?r(e.key,n):1,n&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class et{constructor(e,n,r,i,s){this.key=e,this.value=n,this.color=r??et.RED,this.left=i??et.EMPTY,this.right=s??et.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,i,s){return new et(e??this.key,n??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let i=this;const s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,n,r),null):s===0?i.copy(null,n,null,null,null):i.copy(null,null,null,null,i.right.insert(e,n,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return et.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,i=this;if(n(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,n),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),n(e,i.key)===0){if(i.right.isEmpty())return et.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,n))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,et.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,et.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw Z(43730,{key:this.key,value:this.value});if(this.right.isRed())throw Z(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw Z(27949);return e+(this.isRed()?0:1)}}et.EMPTY=null,et.RED=!0,et.BLACK=!1;et.EMPTY=new class{constructor(){this.size=0}get key(){throw Z(57766)}get value(){throw Z(16141)}get color(){throw Z(16727)}get left(){throw Z(29726)}get right(){throw Z(36894)}copy(e,n,r,i,s){return this}insert(e,n,r){return new et(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class He{constructor(e){this.comparator=e,this.data=new Pe(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,r)=>(e(n),!1))}forEachInRange(e,n){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;n(i.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new xy(this.data.getIterator())}getIteratorFrom(e){return new xy(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(r=>{n=n.add(r)}),n}isEqual(e){if(!(e instanceof He)||this.size!==e.size)return!1;const n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){const i=n.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new He(this.comparator);return n.data=e,n}}class xy{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class an{constructor(e){this.fields=e,e.sort(tt.comparator)}static empty(){return new an([])}unionWith(e){let n=new He(tt.comparator);for(const r of this.fields)n=n.add(r);for(const r of e)n=n.add(r);return new an(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return gs(this.fields,e.fields,(n,r)=>n.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ww extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class st{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new Ww("Invalid base64 string: "+s):s}}(e);return new st(n)}static fromUint8Array(e){const n=function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s}(e);return new st(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ne(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}st.EMPTY_BYTE_STRING=new st("");const nb=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Dr(t){if(me(!!t,39018),typeof t=="string"){let e=0;const n=nb.exec(t);if(me(!!n,46558,{timestamp:t}),n[1]){let i=n[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Me(t.seconds),nanos:Me(t.nanos)}}function Me(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function Nr(t){return typeof t=="string"?st.fromBase64String(t):st.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hw="server_timestamp",qw="__type__",Kw="__previous_value__",Gw="__local_write_time__";function ep(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{})[qw])===null||n===void 0?void 0:n.stringValue)===Hw}function Xu(t){const e=t.mapValue.fields[Kw];return ep(e)?Xu(e):e}function Jo(t){const e=Dr(t.mapValue.fields[Gw].timestampValue);return new Se(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rb{constructor(e,n,r,i,s,o,l,u,c,f){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=u,this.useFetchStreams=c,this.isUsingEmulator=f}}const hu="(default)";class Zo{constructor(e,n){this.projectId=e,this.database=n||hu}static empty(){return new Zo("","")}get isDefaultDatabase(){return this.database===hu}isEqual(e){return e instanceof Zo&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qw="__type__",ib="__max__",sl={mapValue:{}},Yw="__vector__",fu="value";function Or(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?ep(t)?4:ob(t)?9007199254740991:sb(t)?10:11:Z(28295,{value:t})}function Cn(t,e){if(t===e)return!0;const n=Or(t);if(n!==Or(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return Jo(t).isEqual(Jo(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const o=Dr(i.timestampValue),l=Dr(s.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(i,s){return Nr(i.bytesValue).isEqual(Nr(s.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(i,s){return Me(i.geoPointValue.latitude)===Me(s.geoPointValue.latitude)&&Me(i.geoPointValue.longitude)===Me(s.geoPointValue.longitude)}(t,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return Me(i.integerValue)===Me(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const o=Me(i.doubleValue),l=Me(s.doubleValue);return o===l?du(o)===du(l):isNaN(o)&&isNaN(l)}return!1}(t,e);case 9:return gs(t.arrayValue.values||[],e.arrayValue.values||[],Cn);case 10:case 11:return function(i,s){const o=i.mapValue.fields||{},l=s.mapValue.fields||{};if(Iy(o)!==Iy(l))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(l[u]===void 0||!Cn(o[u],l[u])))return!1;return!0}(t,e);default:return Z(52216,{left:t})}}function ea(t,e){return(t.values||[]).find(n=>Cn(n,e))!==void 0}function ms(t,e){if(t===e)return 0;const n=Or(t),r=Or(e);if(n!==r)return ne(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return ne(t.booleanValue,e.booleanValue);case 2:return function(s,o){const l=Me(s.integerValue||s.doubleValue),u=Me(o.integerValue||o.doubleValue);return l<u?-1:l>u?1:l===u?0:isNaN(l)?isNaN(u)?0:-1:1}(t,e);case 3:return ky(t.timestampValue,e.timestampValue);case 4:return ky(Jo(t),Jo(e));case 5:return Eh(t.stringValue,e.stringValue);case 6:return function(s,o){const l=Nr(s),u=Nr(o);return l.compareTo(u)}(t.bytesValue,e.bytesValue);case 7:return function(s,o){const l=s.split("/"),u=o.split("/");for(let c=0;c<l.length&&c<u.length;c++){const f=ne(l[c],u[c]);if(f!==0)return f}return ne(l.length,u.length)}(t.referenceValue,e.referenceValue);case 8:return function(s,o){const l=ne(Me(s.latitude),Me(o.latitude));return l!==0?l:ne(Me(s.longitude),Me(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return Cy(t.arrayValue,e.arrayValue);case 10:return function(s,o){var l,u,c,f;const m=s.fields||{},g=o.fields||{},_=(l=m[fu])===null||l===void 0?void 0:l.arrayValue,b=(u=g[fu])===null||u===void 0?void 0:u.arrayValue,x=ne(((c=_==null?void 0:_.values)===null||c===void 0?void 0:c.length)||0,((f=b==null?void 0:b.values)===null||f===void 0?void 0:f.length)||0);return x!==0?x:Cy(_,b)}(t.mapValue,e.mapValue);case 11:return function(s,o){if(s===sl.mapValue&&o===sl.mapValue)return 0;if(s===sl.mapValue)return 1;if(o===sl.mapValue)return-1;const l=s.fields||{},u=Object.keys(l),c=o.fields||{},f=Object.keys(c);u.sort(),f.sort();for(let m=0;m<u.length&&m<f.length;++m){const g=Eh(u[m],f[m]);if(g!==0)return g;const _=ms(l[u[m]],c[f[m]]);if(_!==0)return _}return ne(u.length,f.length)}(t.mapValue,e.mapValue);default:throw Z(23264,{le:n})}}function ky(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return ne(t,e);const n=Dr(t),r=Dr(e),i=ne(n.seconds,r.seconds);return i!==0?i:ne(n.nanos,r.nanos)}function Cy(t,e){const n=t.values||[],r=e.values||[];for(let i=0;i<n.length&&i<r.length;++i){const s=ms(n[i],r[i]);if(s)return s}return ne(n.length,r.length)}function ys(t){return Th(t)}function Th(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const r=Dr(n);return`time(${r.seconds},${r.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return Nr(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return X.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let r="[",i=!0;for(const s of n.values||[])i?i=!1:r+=",",r+=Th(s);return r+"]"}(t.arrayValue):"mapValue"in t?function(n){const r=Object.keys(n.fields||{}).sort();let i="{",s=!0;for(const o of r)s?s=!1:i+=",",i+=`${o}:${Th(n.fields[o])}`;return i+"}"}(t.mapValue):Z(61005,{value:t})}function xl(t){switch(Or(t)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Xu(t);return e?16+xl(e):16;case 5:return 2*t.stringValue.length;case 6:return Nr(t.bytesValue).approximateByteSize();case 7:return t.referenceValue.length;case 9:return function(r){return(r.values||[]).reduce((i,s)=>i+xl(s),0)}(t.arrayValue);case 10:case 11:return function(r){let i=0;return Ti(r.fields,(s,o)=>{i+=s.length+xl(o)}),i}(t.mapValue);default:throw Z(13486,{value:t})}}function Sh(t){return!!t&&"integerValue"in t}function tp(t){return!!t&&"arrayValue"in t}function by(t){return!!t&&"nullValue"in t}function Ay(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function kl(t){return!!t&&"mapValue"in t}function sb(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{})[Qw])===null||n===void 0?void 0:n.stringValue)===Yw}function Co(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return Ti(t.mapValue.fields,(n,r)=>e.mapValue.fields[n]=Co(r)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=Co(t.arrayValue.values[n]);return e}return Object.assign({},t)}function ob(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue===ib}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qt{constructor(e){this.value=e}static empty(){return new qt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!kl(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=Co(n)}setAll(e){let n=tt.emptyPath(),r={},i=[];e.forEach((o,l)=>{if(!n.isImmediateParentOf(l)){const u=this.getFieldsMap(n);this.applyChanges(u,r,i),r={},i=[],n=l.popLast()}o?r[l.lastSegment()]=Co(o):i.push(l.lastSegment())});const s=this.getFieldsMap(n);this.applyChanges(s,r,i)}delete(e){const n=this.field(e.popLast());kl(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return Cn(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=n.mapValue.fields[e.get(r)];kl(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=i),n=i}return n.mapValue.fields}applyChanges(e,n,r){Ti(n,(i,s)=>e[i]=s);for(const i of r)delete e[i]}clone(){return new qt(Co(this.value))}}function Xw(t){const e=[];return Ti(t.fields,(n,r)=>{const i=new tt([n]);if(kl(r)){const s=Xw(r.mapValue).fields;if(s.length===0)e.push(i);else for(const o of s)e.push(i.child(o))}else e.push(i)}),new an(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt{constructor(e,n,r,i,s,o,l){this.key=e,this.documentType=n,this.version=r,this.readTime=i,this.createTime=s,this.data=o,this.documentState=l}static newInvalidDocument(e){return new gt(e,0,ee.min(),ee.min(),ee.min(),qt.empty(),0)}static newFoundDocument(e,n,r,i){return new gt(e,1,n,ee.min(),r,i,0)}static newNoDocument(e,n){return new gt(e,2,n,ee.min(),ee.min(),qt.empty(),0)}static newUnknownDocument(e,n){return new gt(e,3,n,ee.min(),ee.min(),qt.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(ee.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=qt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=qt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=ee.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof gt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new gt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pu{constructor(e,n){this.position=e,this.inclusive=n}}function Ry(t,e,n){let r=0;for(let i=0;i<t.position.length;i++){const s=e[i],o=t.position[i];if(s.field.isKeyField()?r=X.comparator(X.fromName(o.referenceValue),n.key):r=ms(o,n.data.field(s.field)),s.dir==="desc"&&(r*=-1),r!==0)break}return r}function Py(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!Cn(t.position[n],e.position[n]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gu{constructor(e,n="asc"){this.field=e,this.dir=n}}function ab(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jw{}class Be extends Jw{constructor(e,n,r){super(),this.field=e,this.op=n,this.value=r}static create(e,n,r){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,r):new ub(e,n,r):n==="array-contains"?new hb(e,r):n==="in"?new fb(e,r):n==="not-in"?new pb(e,r):n==="array-contains-any"?new gb(e,r):new Be(e,n,r)}static createKeyFieldInFilter(e,n,r){return n==="in"?new cb(e,r):new db(e,r)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&n.nullValue===void 0&&this.matchesComparison(ms(n,this.value)):n!==null&&Or(this.value)===Or(n)&&this.matchesComparison(ms(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return Z(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class bn extends Jw{constructor(e,n){super(),this.filters=e,this.op=n,this.he=null}static create(e,n){return new bn(e,n)}matches(e){return Zw(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function Zw(t){return t.op==="and"}function e1(t){return lb(t)&&Zw(t)}function lb(t){for(const e of t.filters)if(e instanceof bn)return!1;return!0}function Ih(t){if(t instanceof Be)return t.field.canonicalString()+t.op.toString()+ys(t.value);if(e1(t))return t.filters.map(e=>Ih(e)).join(",");{const e=t.filters.map(n=>Ih(n)).join(",");return`${t.op}(${e})`}}function t1(t,e){return t instanceof Be?function(r,i){return i instanceof Be&&r.op===i.op&&r.field.isEqual(i.field)&&Cn(r.value,i.value)}(t,e):t instanceof bn?function(r,i){return i instanceof bn&&r.op===i.op&&r.filters.length===i.filters.length?r.filters.reduce((s,o,l)=>s&&t1(o,i.filters[l]),!0):!1}(t,e):void Z(19439)}function n1(t){return t instanceof Be?function(n){return`${n.field.canonicalString()} ${n.op} ${ys(n.value)}`}(t):t instanceof bn?function(n){return n.op.toString()+" {"+n.getFilters().map(n1).join(" ,")+"}"}(t):"Filter"}class ub extends Be{constructor(e,n,r){super(e,n,r),this.key=X.fromName(r.referenceValue)}matches(e){const n=X.comparator(e.key,this.key);return this.matchesComparison(n)}}class cb extends Be{constructor(e,n){super(e,"in",n),this.keys=r1("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class db extends Be{constructor(e,n){super(e,"not-in",n),this.keys=r1("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function r1(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(r=>X.fromName(r.referenceValue))}class hb extends Be{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return tp(n)&&ea(n.arrayValue,this.value)}}class fb extends Be{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&ea(this.value.arrayValue,n)}}class pb extends Be{constructor(e,n){super(e,"not-in",n)}matches(e){if(ea(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&n.nullValue===void 0&&!ea(this.value.arrayValue,n)}}class gb extends Be{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!tp(n)||!n.arrayValue.values)&&n.arrayValue.values.some(r=>ea(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mb{constructor(e,n=null,r=[],i=[],s=null,o=null,l=null){this.path=e,this.collectionGroup=n,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=o,this.endAt=l,this.Pe=null}}function Dy(t,e=null,n=[],r=[],i=null,s=null,o=null){return new mb(t,e,n,r,i,s,o)}function np(t){const e=te(t);if(e.Pe===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(r=>Ih(r)).join(","),n+="|ob:",n+=e.orderBy.map(r=>function(s){return s.field.canonicalString()+s.dir}(r)).join(","),Yu(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(r=>ys(r)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(r=>ys(r)).join(",")),e.Pe=n}return e.Pe}function rp(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!ab(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!t1(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!Py(t.startAt,e.startAt)&&Py(t.endAt,e.endAt)}function xh(t){return X.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ju{constructor(e,n=null,r=[],i=[],s=null,o="F",l=null,u=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=o,this.startAt=l,this.endAt=u,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function yb(t,e,n,r,i,s,o,l){return new Ju(t,e,n,r,i,s,o,l)}function Zu(t){return new Ju(t)}function Ny(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function vb(t){return t.collectionGroup!==null}function bo(t){const e=te(t);if(e.Te===null){e.Te=[];const n=new Set;for(const s of e.explicitOrderBy)e.Te.push(s),n.add(s.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new He(tt.comparator);return o.filters.forEach(u=>{u.getFlattenedFilters().forEach(c=>{c.isInequality()&&(l=l.add(c.field))})}),l})(e).forEach(s=>{n.has(s.canonicalString())||s.isKeyField()||e.Te.push(new gu(s,r))}),n.has(tt.keyField().canonicalString())||e.Te.push(new gu(tt.keyField(),r))}return e.Te}function En(t){const e=te(t);return e.Ie||(e.Ie=_b(e,bo(t))),e.Ie}function _b(t,e){if(t.limitType==="F")return Dy(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new gu(i.field,s)});const n=t.endAt?new pu(t.endAt.position,t.endAt.inclusive):null,r=t.startAt?new pu(t.startAt.position,t.startAt.inclusive):null;return Dy(t.path,t.collectionGroup,e,t.filters,t.limit,n,r)}}function kh(t,e,n){return new Ju(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function ec(t,e){return rp(En(t),En(e))&&t.limitType===e.limitType}function i1(t){return`${np(En(t))}|lt:${t.limitType}`}function Ni(t){return`Query(target=${function(n){let r=n.path.canonicalString();return n.collectionGroup!==null&&(r+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(r+=`, filters: [${n.filters.map(i=>n1(i)).join(", ")}]`),Yu(n.limit)||(r+=", limit: "+n.limit),n.orderBy.length>0&&(r+=`, orderBy: [${n.orderBy.map(i=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(i)).join(", ")}]`),n.startAt&&(r+=", startAt: ",r+=n.startAt.inclusive?"b:":"a:",r+=n.startAt.position.map(i=>ys(i)).join(",")),n.endAt&&(r+=", endAt: ",r+=n.endAt.inclusive?"a:":"b:",r+=n.endAt.position.map(i=>ys(i)).join(",")),`Target(${r})`}(En(t))}; limitType=${t.limitType})`}function tc(t,e){return e.isFoundDocument()&&function(r,i){const s=i.key.path;return r.collectionGroup!==null?i.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(s):X.isDocumentKey(r.path)?r.path.isEqual(s):r.path.isImmediateParentOf(s)}(t,e)&&function(r,i){for(const s of bo(r))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(t,e)&&function(r,i){for(const s of r.filters)if(!s.matches(i))return!1;return!0}(t,e)&&function(r,i){return!(r.startAt&&!function(o,l,u){const c=Ry(o,l,u);return o.inclusive?c<=0:c<0}(r.startAt,bo(r),i)||r.endAt&&!function(o,l,u){const c=Ry(o,l,u);return o.inclusive?c>=0:c>0}(r.endAt,bo(r),i))}(t,e)}function wb(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function s1(t){return(e,n)=>{let r=!1;for(const i of bo(t)){const s=Eb(i,e,n);if(s!==0)return s;r=r||i.field.isKeyField()}return 0}}function Eb(t,e,n){const r=t.field.isKeyField()?X.comparator(e.key,n.key):function(s,o,l){const u=o.data.field(s),c=l.data.field(s);return u!==null&&c!==null?ms(u,c):Z(42886)}(t.field,e,n);switch(t.dir){case"asc":return r;case"desc":return-1*r;default:return Z(19790,{direction:t.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Si{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r!==void 0){for(const[i,s]of r)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,n){const r=this.mapKeyFn(e),i=this.inner[r];if(i===void 0)return this.inner[r]=[[e,n]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,n]);i.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r===void 0)return!1;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return r.length===1?delete this.inner[n]:r.splice(i,1),this.innerSize--,!0;return!1}forEach(e){Ti(this.inner,(n,r)=>{for(const[i,s]of r)e(i,s)})}isEmpty(){return $w(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tb=new Pe(X.comparator);function Zn(){return Tb}const o1=new Pe(X.comparator);function ho(...t){let e=o1;for(const n of t)e=e.insert(n.key,n);return e}function a1(t){let e=o1;return t.forEach((n,r)=>e=e.insert(n,r.overlayedDocument)),e}function ni(){return Ao()}function l1(){return Ao()}function Ao(){return new Si(t=>t.toString(),(t,e)=>t.isEqual(e))}const Sb=new Pe(X.comparator),Ib=new He(X.comparator);function se(...t){let e=Ib;for(const n of t)e=e.add(n);return e}const xb=new He(ne);function kb(){return xb}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ip(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:du(e)?"-0":e}}function u1(t){return{integerValue:""+t}}function Cb(t,e){return ZC(e)?u1(e):ip(t,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nc{constructor(){this._=void 0}}function bb(t,e,n){return t instanceof mu?function(i,s){const o={fields:{[qw]:{stringValue:Hw},[Gw]:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&ep(s)&&(s=Xu(s)),s&&(o.fields[Kw]=s),{mapValue:o}}(n,e):t instanceof ta?d1(t,e):t instanceof na?h1(t,e):function(i,s){const o=c1(i,s),l=Oy(o)+Oy(i.Ee);return Sh(o)&&Sh(i.Ee)?u1(l):ip(i.serializer,l)}(t,e)}function Ab(t,e,n){return t instanceof ta?d1(t,e):t instanceof na?h1(t,e):n}function c1(t,e){return t instanceof yu?function(r){return Sh(r)||function(s){return!!s&&"doubleValue"in s}(r)}(e)?e:{integerValue:0}:null}class mu extends nc{}class ta extends nc{constructor(e){super(),this.elements=e}}function d1(t,e){const n=f1(e);for(const r of t.elements)n.some(i=>Cn(i,r))||n.push(r);return{arrayValue:{values:n}}}class na extends nc{constructor(e){super(),this.elements=e}}function h1(t,e){let n=f1(e);for(const r of t.elements)n=n.filter(i=>!Cn(i,r));return{arrayValue:{values:n}}}class yu extends nc{constructor(e,n){super(),this.serializer=e,this.Ee=n}}function Oy(t){return Me(t.integerValue||t.doubleValue)}function f1(t){return tp(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}function Rb(t,e){return t.field.isEqual(e.field)&&function(r,i){return r instanceof ta&&i instanceof ta||r instanceof na&&i instanceof na?gs(r.elements,i.elements,Cn):r instanceof yu&&i instanceof yu?Cn(r.Ee,i.Ee):r instanceof mu&&i instanceof mu}(t.transform,e.transform)}class Pb{constructor(e,n){this.version=e,this.transformResults=n}}class Tn{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new Tn}static exists(e){return new Tn(void 0,e)}static updateTime(e){return new Tn(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Cl(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class rc{}function p1(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new sp(t.key,Tn.none()):new ya(t.key,t.data,Tn.none());{const n=t.data,r=qt.empty();let i=new He(tt.comparator);for(let s of e.fields)if(!i.has(s)){let o=n.field(s);o===null&&s.length>1&&(s=s.popLast(),o=n.field(s)),o===null?r.delete(s):r.set(s,o),i=i.add(s)}return new Ii(t.key,r,new an(i.toArray()),Tn.none())}}function Db(t,e,n){t instanceof ya?function(i,s,o){const l=i.value.clone(),u=My(i.fieldTransforms,s,o.transformResults);l.setAll(u),s.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(t,e,n):t instanceof Ii?function(i,s,o){if(!Cl(i.precondition,s))return void s.convertToUnknownDocument(o.version);const l=My(i.fieldTransforms,s,o.transformResults),u=s.data;u.setAll(g1(i)),u.setAll(l),s.convertToFoundDocument(o.version,u).setHasCommittedMutations()}(t,e,n):function(i,s,o){s.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,n)}function Ro(t,e,n,r){return t instanceof ya?function(s,o,l,u){if(!Cl(s.precondition,o))return l;const c=s.value.clone(),f=Ly(s.fieldTransforms,u,o);return c.setAll(f),o.convertToFoundDocument(o.version,c).setHasLocalMutations(),null}(t,e,n,r):t instanceof Ii?function(s,o,l,u){if(!Cl(s.precondition,o))return l;const c=Ly(s.fieldTransforms,u,o),f=o.data;return f.setAll(g1(s)),f.setAll(c),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),l===null?null:l.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(m=>m.field))}(t,e,n,r):function(s,o,l){return Cl(s.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l}(t,e,n)}function Nb(t,e){let n=null;for(const r of t.fieldTransforms){const i=e.data.field(r.field),s=c1(r.transform,i||null);s!=null&&(n===null&&(n=qt.empty()),n.set(r.field,s))}return n||null}function Vy(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(r,i){return r===void 0&&i===void 0||!(!r||!i)&&gs(r,i,(s,o)=>Rb(s,o))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class ya extends rc{constructor(e,n,r,i=[]){super(),this.key=e,this.value=n,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Ii extends rc{constructor(e,n,r,i,s=[]){super(),this.key=e,this.data=n,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function g1(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=t.data.field(n);e.set(n,r)}}),e}function My(t,e,n){const r=new Map;me(t.length===n.length,32656,{Ae:n.length,Re:t.length});for(let i=0;i<n.length;i++){const s=t[i],o=s.transform,l=e.data.field(s.field);r.set(s.field,Ab(o,l,n[i]))}return r}function Ly(t,e,n){const r=new Map;for(const i of t){const s=i.transform,o=n.data.field(i.field);r.set(i.field,bb(s,o,e))}return r}class sp extends rc{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Ob extends rc{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vb{constructor(e,n,r,i){this.batchId=e,this.localWriteTime=n,this.baseMutations=r,this.mutations=i}applyToRemoteDocument(e,n){const r=n.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&Db(s,e,r[i])}}applyToLocalView(e,n){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(n=Ro(r,e,n,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(n=Ro(r,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const r=l1();return this.mutations.forEach(i=>{const s=e.get(i.key),o=s.overlayedDocument;let l=this.applyToLocalView(o,s.mutatedFields);l=n.has(i.key)?null:l;const u=p1(o,l);u!==null&&r.set(i.key,u),o.isValidDocument()||o.convertToNoDocument(ee.min())}),r}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),se())}isEqual(e){return this.batchId===e.batchId&&gs(this.mutations,e.mutations,(n,r)=>Vy(n,r))&&gs(this.baseMutations,e.baseMutations,(n,r)=>Vy(n,r))}}class op{constructor(e,n,r,i){this.batch=e,this.commitVersion=n,this.mutationResults=r,this.docVersions=i}static from(e,n,r){me(e.mutations.length===r.length,58842,{Ve:e.mutations.length,me:r.length});let i=function(){return Sb}();const s=e.mutations;for(let o=0;o<s.length;o++)i=i.insert(s[o].key,r[o].version);return new op(e,n,r,i)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mb{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lb{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var je,le;function jb(t){switch(t){case U.OK:return Z(64938);case U.CANCELLED:case U.UNKNOWN:case U.DEADLINE_EXCEEDED:case U.RESOURCE_EXHAUSTED:case U.INTERNAL:case U.UNAVAILABLE:case U.UNAUTHENTICATED:return!1;case U.INVALID_ARGUMENT:case U.NOT_FOUND:case U.ALREADY_EXISTS:case U.PERMISSION_DENIED:case U.FAILED_PRECONDITION:case U.ABORTED:case U.OUT_OF_RANGE:case U.UNIMPLEMENTED:case U.DATA_LOSS:return!0;default:return Z(15467,{code:t})}}function m1(t){if(t===void 0)return Jn("GRPC error has no .code"),U.UNKNOWN;switch(t){case je.OK:return U.OK;case je.CANCELLED:return U.CANCELLED;case je.UNKNOWN:return U.UNKNOWN;case je.DEADLINE_EXCEEDED:return U.DEADLINE_EXCEEDED;case je.RESOURCE_EXHAUSTED:return U.RESOURCE_EXHAUSTED;case je.INTERNAL:return U.INTERNAL;case je.UNAVAILABLE:return U.UNAVAILABLE;case je.UNAUTHENTICATED:return U.UNAUTHENTICATED;case je.INVALID_ARGUMENT:return U.INVALID_ARGUMENT;case je.NOT_FOUND:return U.NOT_FOUND;case je.ALREADY_EXISTS:return U.ALREADY_EXISTS;case je.PERMISSION_DENIED:return U.PERMISSION_DENIED;case je.FAILED_PRECONDITION:return U.FAILED_PRECONDITION;case je.ABORTED:return U.ABORTED;case je.OUT_OF_RANGE:return U.OUT_OF_RANGE;case je.UNIMPLEMENTED:return U.UNIMPLEMENTED;case je.DATA_LOSS:return U.DATA_LOSS;default:return Z(39323,{code:t})}}(le=je||(je={}))[le.OK=0]="OK",le[le.CANCELLED=1]="CANCELLED",le[le.UNKNOWN=2]="UNKNOWN",le[le.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",le[le.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",le[le.NOT_FOUND=5]="NOT_FOUND",le[le.ALREADY_EXISTS=6]="ALREADY_EXISTS",le[le.PERMISSION_DENIED=7]="PERMISSION_DENIED",le[le.UNAUTHENTICATED=16]="UNAUTHENTICATED",le[le.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",le[le.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",le[le.ABORTED=10]="ABORTED",le[le.OUT_OF_RANGE=11]="OUT_OF_RANGE",le[le.UNIMPLEMENTED=12]="UNIMPLEMENTED",le[le.INTERNAL=13]="INTERNAL",le[le.UNAVAILABLE=14]="UNAVAILABLE",le[le.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fb=new kr([4294967295,4294967295],0);function jy(t){const e=zw().encode(t),n=new Dw;return n.update(e),new Uint8Array(n.digest())}function Fy(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),r=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new kr([n,r],0),new kr([i,s],0)]}class ap{constructor(e,n,r){if(this.bitmap=e,this.padding=n,this.hashCount=r,n<0||n>=8)throw new fo(`Invalid padding: ${n}`);if(r<0)throw new fo(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new fo(`Invalid hash count: ${r}`);if(e.length===0&&n!==0)throw new fo(`Invalid padding when bitmap length is 0: ${n}`);this.fe=8*e.length-n,this.ge=kr.fromNumber(this.fe)}pe(e,n,r){let i=e.add(n.multiply(kr.fromNumber(r)));return i.compare(Fb)===1&&(i=new kr([i.getBits(0),i.getBits(1)],0)),i.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.fe===0)return!1;const n=jy(e),[r,i]=Fy(n);for(let s=0;s<this.hashCount;s++){const o=this.pe(r,i,s);if(!this.ye(o))return!1}return!0}static create(e,n,r){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),o=new ap(s,i,n);return r.forEach(l=>o.insert(l)),o}insert(e){if(this.fe===0)return;const n=jy(e),[r,i]=Fy(n);for(let s=0;s<this.hashCount;s++){const o=this.pe(r,i,s);this.we(o)}}we(e){const n=Math.floor(e/8),r=e%8;this.bitmap[n]|=1<<r}}class fo extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ic{constructor(e,n,r,i,s){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=r,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,n,r){const i=new Map;return i.set(e,va.createSynthesizedTargetChangeForCurrentChange(e,n,r)),new ic(ee.min(),i,new Pe(ne),Zn(),se())}}class va{constructor(e,n,r,i,s){this.resumeToken=e,this.current=n,this.addedDocuments=r,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,n,r){return new va(r,n,se(),se(),se())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bl{constructor(e,n,r,i){this.Se=e,this.removedTargetIds=n,this.key=r,this.be=i}}class y1{constructor(e,n){this.targetId=e,this.De=n}}class v1{constructor(e,n,r=st.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=n,this.resumeToken=r,this.cause=i}}class zy{constructor(){this.ve=0,this.Ce=Uy(),this.Fe=st.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=se(),n=se(),r=se();return this.Ce.forEach((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:n=n.add(i);break;case 1:r=r.add(i);break;default:Z(38017,{changeType:s})}}),new va(this.Fe,this.Me,e,n,r)}ke(){this.xe=!1,this.Ce=Uy()}qe(e,n){this.xe=!0,this.Ce=this.Ce.insert(e,n)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,me(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class zb{constructor(e){this.We=e,this.Ge=new Map,this.ze=Zn(),this.je=ol(),this.Je=ol(),this.He=new Pe(ne)}Ye(e){for(const n of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(n,e.be):this.Xe(n,e.key,e.be);for(const n of e.removedTargetIds)this.Xe(n,e.key,e.be)}et(e){this.forEachTarget(e,n=>{const r=this.tt(n);switch(e.state){case 0:this.nt(n)&&r.Be(e.resumeToken);break;case 1:r.Ue(),r.Oe||r.ke(),r.Be(e.resumeToken);break;case 2:r.Ue(),r.Oe||this.removeTarget(n);break;case 3:this.nt(n)&&(r.Ke(),r.Be(e.resumeToken));break;case 4:this.nt(n)&&(this.rt(n),r.Be(e.resumeToken));break;default:Z(56790,{state:e.state})}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.Ge.forEach((r,i)=>{this.nt(i)&&n(i)})}it(e){const n=e.targetId,r=e.De.count,i=this.st(n);if(i){const s=i.target;if(xh(s))if(r===0){const o=new X(s.path);this.Xe(n,o,gt.newNoDocument(o,ee.min()))}else me(r===1,20013,{expectedCount:r});else{const o=this.ot(n);if(o!==r){const l=this._t(e),u=l?this.ut(l,e,o):1;if(u!==0){this.rt(n);const c=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(n,c)}}}}}_t(e){const n=e.De.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:r="",padding:i=0},hashCount:s=0}=n;let o,l;try{o=Nr(r).toUint8Array()}catch(u){if(u instanceof Ww)return Rr("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{l=new ap(o,i,s)}catch(u){return Rr(u instanceof fo?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return l.fe===0?null:l}ut(e,n,r){return n.De.count===r-this.ht(e,n.targetId)?0:2}ht(e,n){const r=this.We.getRemoteKeysForTarget(n);let i=0;return r.forEach(s=>{const o=this.We.lt(),l=`projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`;e.mightContain(l)||(this.Xe(n,s,null),i++)}),i}Pt(e){const n=new Map;this.Ge.forEach((s,o)=>{const l=this.st(o);if(l){if(s.current&&xh(l.target)){const u=new X(l.target.path);this.Tt(u).has(o)||this.It(o,u)||this.Xe(o,u,gt.newNoDocument(u,e))}s.Ne&&(n.set(o,s.Le()),s.ke())}});let r=se();this.Je.forEach((s,o)=>{let l=!0;o.forEachWhile(u=>{const c=this.st(u);return!c||c.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(r=r.add(s))}),this.ze.forEach((s,o)=>o.setReadTime(e));const i=new ic(e,n,this.He,this.ze,r);return this.ze=Zn(),this.je=ol(),this.Je=ol(),this.He=new Pe(ne),i}Ze(e,n){if(!this.nt(e))return;const r=this.It(e,n.key)?2:0;this.tt(e).qe(n.key,r),this.ze=this.ze.insert(n.key,n),this.je=this.je.insert(n.key,this.Tt(n.key).add(e)),this.Je=this.Je.insert(n.key,this.dt(n.key).add(e))}Xe(e,n,r){if(!this.nt(e))return;const i=this.tt(e);this.It(e,n)?i.qe(n,1):i.Qe(n),this.Je=this.Je.insert(n,this.dt(n).delete(e)),this.Je=this.Je.insert(n,this.dt(n).add(e)),r&&(this.ze=this.ze.insert(n,r))}removeTarget(e){this.Ge.delete(e)}ot(e){const n=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let n=this.Ge.get(e);return n||(n=new zy,this.Ge.set(e,n)),n}dt(e){let n=this.Je.get(e);return n||(n=new He(ne),this.Je=this.Je.insert(e,n)),n}Tt(e){let n=this.je.get(e);return n||(n=new He(ne),this.je=this.je.insert(e,n)),n}nt(e){const n=this.st(e)!==null;return n||H("WatchChangeAggregator","Detected inactive target",e),n}st(e){const n=this.Ge.get(e);return n&&n.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new zy),this.We.getRemoteKeysForTarget(e).forEach(n=>{this.Xe(e,n,null)})}It(e,n){return this.We.getRemoteKeysForTarget(e).has(n)}}function ol(){return new Pe(X.comparator)}function Uy(){return new Pe(X.comparator)}const Ub={asc:"ASCENDING",desc:"DESCENDING"},Bb={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},$b={and:"AND",or:"OR"};class Wb{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function Ch(t,e){return t.useProto3Json||Yu(e)?e:{value:e}}function vu(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function _1(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function Hb(t,e){return vu(t,e.toTimestamp())}function Sn(t){return me(!!t,49232),ee.fromTimestamp(function(n){const r=Dr(n);return new Se(r.seconds,r.nanos)}(t))}function lp(t,e){return bh(t,e).canonicalString()}function bh(t,e){const n=function(i){return new be(["projects",i.projectId,"databases",i.database])}(t).child("documents");return e===void 0?n:n.child(e)}function w1(t){const e=be.fromString(t);return me(x1(e),10190,{key:e.toString()}),e}function Ah(t,e){return lp(t.databaseId,e.path)}function ud(t,e){const n=w1(e);if(n.get(1)!==t.databaseId.projectId)throw new Y(U.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new Y(U.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new X(T1(n))}function E1(t,e){return lp(t.databaseId,e)}function qb(t){const e=w1(t);return e.length===4?be.emptyPath():T1(e)}function Rh(t){return new be(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function T1(t){return me(t.length>4&&t.get(4)==="documents",29091,{key:t.toString()}),t.popFirst(5)}function By(t,e,n){return{name:Ah(t,e),fields:n.value.mapValue.fields}}function Kb(t,e){let n;if("targetChange"in e){e.targetChange;const r=function(c){return c==="NO_CHANGE"?0:c==="ADD"?1:c==="REMOVE"?2:c==="CURRENT"?3:c==="RESET"?4:Z(39313,{state:c})}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=function(c,f){return c.useProto3Json?(me(f===void 0||typeof f=="string",58123),st.fromBase64String(f||"")):(me(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),st.fromUint8Array(f||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&function(c){const f=c.code===void 0?U.UNKNOWN:m1(c.code);return new Y(f,c.message||"")}(o);n=new v1(r,i,s,l||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const i=ud(t,r.document.name),s=Sn(r.document.updateTime),o=r.document.createTime?Sn(r.document.createTime):ee.min(),l=new qt({mapValue:{fields:r.document.fields}}),u=gt.newFoundDocument(i,s,o,l),c=r.targetIds||[],f=r.removedTargetIds||[];n=new bl(c,f,u.key,u)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const i=ud(t,r.document),s=r.readTime?Sn(r.readTime):ee.min(),o=gt.newNoDocument(i,s),l=r.removedTargetIds||[];n=new bl([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const i=ud(t,r.document),s=r.removedTargetIds||[];n=new bl([],s,i,null)}else{if(!("filter"in e))return Z(11601,{At:e});{e.filter;const r=e.filter;r.targetId;const{count:i=0,unchangedNames:s}=r,o=new Lb(i,s),l=r.targetId;n=new y1(l,o)}}return n}function Gb(t,e){let n;if(e instanceof ya)n={update:By(t,e.key,e.value)};else if(e instanceof sp)n={delete:Ah(t,e.key)};else if(e instanceof Ii)n={update:By(t,e.key,e.data),updateMask:rA(e.fieldMask)};else{if(!(e instanceof Ob))return Z(16599,{Rt:e.type});n={verify:Ah(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(r=>function(s,o){const l=o.transform;if(l instanceof mu)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof ta)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof na)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof yu)return{fieldPath:o.field.canonicalString(),increment:l.Ee};throw Z(20930,{transform:o.transform})}(0,r))),e.precondition.isNone||(n.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:Hb(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:Z(27497)}(t,e.precondition)),n}function Qb(t,e){return t&&t.length>0?(me(e!==void 0,14353),t.map(n=>function(i,s){let o=i.updateTime?Sn(i.updateTime):Sn(s);return o.isEqual(ee.min())&&(o=Sn(s)),new Pb(o,i.transformResults||[])}(n,e))):[]}function Yb(t,e){return{documents:[E1(t,e.path)]}}function Xb(t,e){const n={structuredQuery:{}},r=e.path;let i;e.collectionGroup!==null?(i=r,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=E1(t,i);const s=function(c){if(c.length!==0)return I1(bn.create(c,"and"))}(e.filters);s&&(n.structuredQuery.where=s);const o=function(c){if(c.length!==0)return c.map(f=>function(g){return{field:Oi(g.field),direction:eA(g.dir)}}(f))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const l=Ch(t,e.limit);return l!==null&&(n.structuredQuery.limit=l),e.startAt&&(n.structuredQuery.startAt=function(c){return{before:c.inclusive,values:c.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(c){return{before:!c.inclusive,values:c.position}}(e.endAt)),{Vt:n,parent:i}}function Jb(t){let e=qb(t.parent);const n=t.structuredQuery,r=n.from?n.from.length:0;let i=null;if(r>0){me(r===1,65062);const f=n.from[0];f.allDescendants?i=f.collectionId:e=e.child(f.collectionId)}let s=[];n.where&&(s=function(m){const g=S1(m);return g instanceof bn&&e1(g)?g.getFilters():[g]}(n.where));let o=[];n.orderBy&&(o=function(m){return m.map(g=>function(b){return new gu(Vi(b.field),function(O){switch(O){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(b.direction))}(g))}(n.orderBy));let l=null;n.limit&&(l=function(m){let g;return g=typeof m=="object"?m.value:m,Yu(g)?null:g}(n.limit));let u=null;n.startAt&&(u=function(m){const g=!!m.before,_=m.values||[];return new pu(_,g)}(n.startAt));let c=null;return n.endAt&&(c=function(m){const g=!m.before,_=m.values||[];return new pu(_,g)}(n.endAt)),yb(e,i,o,s,l,"F",u,c)}function Zb(t,e){const n=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Z(28987,{purpose:i})}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function S1(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const r=Vi(n.unaryFilter.field);return Be.create(r,"==",{doubleValue:NaN});case"IS_NULL":const i=Vi(n.unaryFilter.field);return Be.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=Vi(n.unaryFilter.field);return Be.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Vi(n.unaryFilter.field);return Be.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return Z(61313);default:return Z(60726)}}(t):t.fieldFilter!==void 0?function(n){return Be.create(Vi(n.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return Z(58110);default:return Z(50506)}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return bn.create(n.compositeFilter.filters.map(r=>S1(r)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return Z(1026)}}(n.compositeFilter.op))}(t):Z(30097,{filter:t})}function eA(t){return Ub[t]}function tA(t){return Bb[t]}function nA(t){return $b[t]}function Oi(t){return{fieldPath:t.canonicalString()}}function Vi(t){return tt.fromServerFormat(t.fieldPath)}function I1(t){return t instanceof Be?function(n){if(n.op==="=="){if(Ay(n.value))return{unaryFilter:{field:Oi(n.field),op:"IS_NAN"}};if(by(n.value))return{unaryFilter:{field:Oi(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(Ay(n.value))return{unaryFilter:{field:Oi(n.field),op:"IS_NOT_NAN"}};if(by(n.value))return{unaryFilter:{field:Oi(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Oi(n.field),op:tA(n.op),value:n.value}}}(t):t instanceof bn?function(n){const r=n.getFilters().map(i=>I1(i));return r.length===1?r[0]:{compositeFilter:{op:nA(n.op),filters:r}}}(t):Z(54877,{filter:t})}function rA(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function x1(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mr{constructor(e,n,r,i,s=ee.min(),o=ee.min(),l=st.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=n,this.purpose=r,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=u}withSequenceNumber(e){return new mr(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new mr(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new mr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new mr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iA{constructor(e){this.gt=e}}function sA(t){const e=Jb({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?kh(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oA{constructor(){this.Dn=new aA}addToCollectionParentIndex(e,n){return this.Dn.add(n),L.resolve()}getCollectionParents(e,n){return L.resolve(this.Dn.getEntries(n))}addFieldIndex(e,n){return L.resolve()}deleteFieldIndex(e,n){return L.resolve()}deleteAllFieldIndexes(e){return L.resolve()}createTargetIndexes(e,n){return L.resolve()}getDocumentsMatchingTarget(e,n){return L.resolve(null)}getIndexType(e,n){return L.resolve(0)}getFieldIndexes(e,n){return L.resolve([])}getNextCollectionGroupToUpdate(e){return L.resolve(null)}getMinOffset(e,n){return L.resolve(Pr.min())}getMinOffsetFromCollectionGroup(e,n){return L.resolve(Pr.min())}updateCollectionGroup(e,n,r){return L.resolve()}updateIndexEntries(e,n){return L.resolve()}}class aA{constructor(){this.index={}}add(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n]||new He(be.comparator),s=!i.has(r);return this.index[n]=i.add(r),s}has(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n];return i&&i.has(r)}getEntries(e){return(this.index[e]||new He(be.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $y={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},k1=41943040;class kt{static withCacheSize(e){return new kt(e,kt.DEFAULT_COLLECTION_PERCENTILE,kt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,n,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=n,this.maximumSequenceNumbersToCollect=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */kt.DEFAULT_COLLECTION_PERCENTILE=10,kt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,kt.DEFAULT=new kt(k1,kt.DEFAULT_COLLECTION_PERCENTILE,kt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),kt.DISABLED=new kt(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vs{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new vs(0)}static ur(){return new vs(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wy="LruGarbageCollector",lA=1048576;function Hy([t,e],[n,r]){const i=ne(t,n);return i===0?ne(e,r):i}class uA{constructor(e){this.Tr=e,this.buffer=new He(Hy),this.Ir=0}dr(){return++this.Ir}Er(e){const n=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(n);else{const r=this.buffer.last();Hy(n,r)<0&&(this.buffer=this.buffer.delete(r).add(n))}}get maxValue(){return this.buffer.last()[0]}}class cA{constructor(e,n,r){this.garbageCollector=e,this.asyncQueue=n,this.localStore=r,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(e){H(Wy,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(n){Ps(n)?H(Wy,"Ignoring IndexedDB error during garbage collection: ",n):await Rs(n)}await this.Rr(3e5)})}}class dA{constructor(e,n){this.Vr=e,this.params=n}calculateTargetCount(e,n){return this.Vr.mr(e).next(r=>Math.floor(n/100*r))}nthSequenceNumber(e,n){if(n===0)return L.resolve(Qu.ue);const r=new uA(n);return this.Vr.forEachTarget(e,i=>r.Er(i.sequenceNumber)).next(()=>this.Vr.gr(e,i=>r.Er(i))).next(()=>r.maxValue)}removeTargets(e,n,r){return this.Vr.removeTargets(e,n,r)}removeOrphanedDocuments(e,n){return this.Vr.removeOrphanedDocuments(e,n)}collect(e,n){return this.params.cacheSizeCollectionThreshold===-1?(H("LruGarbageCollector","Garbage collection skipped; disabled"),L.resolve($y)):this.getCacheSize(e).next(r=>r<this.params.cacheSizeCollectionThreshold?(H("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),$y):this.pr(e,n))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,n){let r,i,s,o,l,u,c;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(m=>(m>this.params.maximumSequenceNumbersToCollect?(H("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${m}`),i=this.params.maximumSequenceNumbersToCollect):i=m,o=Date.now(),this.nthSequenceNumber(e,i))).next(m=>(r=m,l=Date.now(),this.removeTargets(e,r,n))).next(m=>(s=m,u=Date.now(),this.removeOrphanedDocuments(e,r))).next(m=>(c=Date.now(),Di()<=ie.DEBUG&&H("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-f}ms
	Determined least recently used ${i} in `+(l-o)+`ms
	Removed ${s} targets in `+(u-l)+`ms
	Removed ${m} documents in `+(c-u)+`ms
Total Duration: ${c-f}ms`),L.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:s,documentsRemoved:m})))}}function hA(t,e){return new dA(t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fA{constructor(){this.changes=new Si(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,gt.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const r=this.changes.get(n);return r!==void 0?L.resolve(r):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pA{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gA{constructor(e,n,r,i){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=r,this.indexManager=i}getDocument(e,n){let r=null;return this.documentOverlayCache.getOverlay(e,n).next(i=>(r=i,this.remoteDocumentCache.getEntry(e,n))).next(i=>(r!==null&&Ro(r.mutation,i,an.empty(),Se.now()),i))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.getLocalViewOfDocuments(e,r,se()).next(()=>r))}getLocalViewOfDocuments(e,n,r=se()){const i=ni();return this.populateOverlays(e,i,n).next(()=>this.computeViews(e,n,i,r).next(s=>{let o=ho();return s.forEach((l,u)=>{o=o.insert(l,u.overlayedDocument)}),o}))}getOverlayedDocuments(e,n){const r=ni();return this.populateOverlays(e,r,n).next(()=>this.computeViews(e,n,r,se()))}populateOverlays(e,n,r){const i=[];return r.forEach(s=>{n.has(s)||i.push(s)}),this.documentOverlayCache.getOverlays(e,i).next(s=>{s.forEach((o,l)=>{n.set(o,l)})})}computeViews(e,n,r,i){let s=Zn();const o=Ao(),l=function(){return Ao()}();return n.forEach((u,c)=>{const f=r.get(c.key);i.has(c.key)&&(f===void 0||f.mutation instanceof Ii)?s=s.insert(c.key,c):f!==void 0?(o.set(c.key,f.mutation.getFieldMask()),Ro(f.mutation,c,f.mutation.getFieldMask(),Se.now())):o.set(c.key,an.empty())}),this.recalculateAndSaveOverlays(e,s).next(u=>(u.forEach((c,f)=>o.set(c,f)),n.forEach((c,f)=>{var m;return l.set(c,new pA(f,(m=o.get(c))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(e,n){const r=Ao();let i=new Pe((o,l)=>o-l),s=se();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(o=>{for(const l of o)l.keys().forEach(u=>{const c=n.get(u);if(c===null)return;let f=r.get(u)||an.empty();f=l.applyToLocalView(c,f),r.set(u,f);const m=(i.get(l.batchId)||se()).add(u);i=i.insert(l.batchId,m)})}).next(()=>{const o=[],l=i.getReverseIterator();for(;l.hasNext();){const u=l.getNext(),c=u.key,f=u.value,m=l1();f.forEach(g=>{if(!s.has(g)){const _=p1(n.get(g),r.get(g));_!==null&&m.set(g,_),s=s.add(g)}}),o.push(this.documentOverlayCache.saveOverlays(e,c,m))}return L.waitFor(o)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,n,r,i){return function(o){return X.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):vb(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,r,i):this.getDocumentsMatchingCollectionQuery(e,n,r,i)}getNextDocuments(e,n,r,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,r,i).next(s=>{const o=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,r.largestBatchId,i-s.size):L.resolve(ni());let l=Xo,u=s;return o.next(c=>L.forEach(c,(f,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),s.get(f)?L.resolve():this.remoteDocumentCache.getEntry(e,f).next(g=>{u=u.insert(f,g)}))).next(()=>this.populateOverlays(e,c,s)).next(()=>this.computeViews(e,u,c,se())).next(f=>({batchId:l,changes:a1(f)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new X(n)).next(r=>{let i=ho();return r.isFoundDocument()&&(i=i.insert(r.key,r)),i})}getDocumentsMatchingCollectionGroupQuery(e,n,r,i){const s=n.collectionGroup;let o=ho();return this.indexManager.getCollectionParents(e,s).next(l=>L.forEach(l,u=>{const c=function(m,g){return new Ju(g,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(n,u.child(s));return this.getDocumentsMatchingCollectionQuery(e,c,r,i).next(f=>{f.forEach((m,g)=>{o=o.insert(m,g)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,n,r,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,r.largestBatchId).next(o=>(s=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,r,s,i))).next(o=>{s.forEach((u,c)=>{const f=c.getKey();o.get(f)===null&&(o=o.insert(f,gt.newInvalidDocument(f)))});let l=ho();return o.forEach((u,c)=>{const f=s.get(u);f!==void 0&&Ro(f.mutation,c,an.empty(),Se.now()),tc(n,c)&&(l=l.insert(u,c))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mA{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,n){return L.resolve(this.Br.get(n))}saveBundleMetadata(e,n){return this.Br.set(n.id,function(i){return{id:i.id,version:i.version,createTime:Sn(i.createTime)}}(n)),L.resolve()}getNamedQuery(e,n){return L.resolve(this.Lr.get(n))}saveNamedQuery(e,n){return this.Lr.set(n.name,function(i){return{name:i.name,query:sA(i.bundledQuery),readTime:Sn(i.readTime)}}(n)),L.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yA{constructor(){this.overlays=new Pe(X.comparator),this.kr=new Map}getOverlay(e,n){return L.resolve(this.overlays.get(n))}getOverlays(e,n){const r=ni();return L.forEach(n,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,n,r){return r.forEach((i,s)=>{this.wt(e,n,s)}),L.resolve()}removeOverlaysForBatchId(e,n,r){const i=this.kr.get(r);return i!==void 0&&(i.forEach(s=>this.overlays=this.overlays.remove(s)),this.kr.delete(r)),L.resolve()}getOverlaysForCollection(e,n,r){const i=ni(),s=n.length+1,o=new X(n.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const u=l.getNext().value,c=u.getKey();if(!n.isPrefixOf(c.path))break;c.path.length===s&&u.largestBatchId>r&&i.set(u.getKey(),u)}return L.resolve(i)}getOverlaysForCollectionGroup(e,n,r,i){let s=new Pe((c,f)=>c-f);const o=this.overlays.getIterator();for(;o.hasNext();){const c=o.getNext().value;if(c.getKey().getCollectionGroup()===n&&c.largestBatchId>r){let f=s.get(c.largestBatchId);f===null&&(f=ni(),s=s.insert(c.largestBatchId,f)),f.set(c.getKey(),c)}}const l=ni(),u=s.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((c,f)=>l.set(c,f)),!(l.size()>=i)););return L.resolve(l)}wt(e,n,r){const i=this.overlays.get(r.key);if(i!==null){const o=this.kr.get(i.largestBatchId).delete(r.key);this.kr.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new Mb(n,r));let s=this.kr.get(n);s===void 0&&(s=se(),this.kr.set(n,s)),this.kr.set(n,s.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vA{constructor(){this.sessionToken=st.EMPTY_BYTE_STRING}getSessionToken(e){return L.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,L.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class up{constructor(){this.qr=new He(Ke.Qr),this.$r=new He(Ke.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,n){const r=new Ke(e,n);this.qr=this.qr.add(r),this.$r=this.$r.add(r)}Kr(e,n){e.forEach(r=>this.addReference(r,n))}removeReference(e,n){this.Wr(new Ke(e,n))}Gr(e,n){e.forEach(r=>this.removeReference(r,n))}zr(e){const n=new X(new be([])),r=new Ke(n,e),i=new Ke(n,e+1),s=[];return this.$r.forEachInRange([r,i],o=>{this.Wr(o),s.push(o.key)}),s}jr(){this.qr.forEach(e=>this.Wr(e))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const n=new X(new be([])),r=new Ke(n,e),i=new Ke(n,e+1);let s=se();return this.$r.forEachInRange([r,i],o=>{s=s.add(o.key)}),s}containsKey(e){const n=new Ke(e,0),r=this.qr.firstAfterOrEqual(n);return r!==null&&e.isEqual(r.key)}}class Ke{constructor(e,n){this.key=e,this.Hr=n}static Qr(e,n){return X.comparator(e.key,n.key)||ne(e.Hr,n.Hr)}static Ur(e,n){return ne(e.Hr,n.Hr)||X.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _A{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.er=1,this.Yr=new He(Ke.Qr)}checkEmpty(e){return L.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,r,i){const s=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new Vb(s,n,r,i);this.mutationQueue.push(o);for(const l of i)this.Yr=this.Yr.add(new Ke(l.key,s)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return L.resolve(o)}lookupMutationBatch(e,n){return L.resolve(this.Zr(n))}getNextMutationBatchAfterBatchId(e,n){const r=n+1,i=this.Xr(r),s=i<0?0:i;return L.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return L.resolve(this.mutationQueue.length===0?Zf:this.er-1)}getAllMutationBatches(e){return L.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const r=new Ke(n,0),i=new Ke(n,Number.POSITIVE_INFINITY),s=[];return this.Yr.forEachInRange([r,i],o=>{const l=this.Zr(o.Hr);s.push(l)}),L.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,n){let r=new He(ne);return n.forEach(i=>{const s=new Ke(i,0),o=new Ke(i,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([s,o],l=>{r=r.add(l.Hr)})}),L.resolve(this.ei(r))}getAllMutationBatchesAffectingQuery(e,n){const r=n.path,i=r.length+1;let s=r;X.isDocumentKey(s)||(s=s.child(""));const o=new Ke(new X(s),0);let l=new He(ne);return this.Yr.forEachWhile(u=>{const c=u.key.path;return!!r.isPrefixOf(c)&&(c.length===i&&(l=l.add(u.Hr)),!0)},o),L.resolve(this.ei(l))}ei(e){const n=[];return e.forEach(r=>{const i=this.Zr(r);i!==null&&n.push(i)}),n}removeMutationBatch(e,n){me(this.ti(n.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Yr;return L.forEach(n.mutations,i=>{const s=new Ke(i.key,n.batchId);return r=r.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.Yr=r})}rr(e){}containsKey(e,n){const r=new Ke(n,0),i=this.Yr.firstAfterOrEqual(r);return L.resolve(n.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,L.resolve()}ti(e,n){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const n=this.Xr(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wA{constructor(e){this.ni=e,this.docs=function(){return new Pe(X.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const r=n.key,i=this.docs.get(r),s=i?i.size:0,o=this.ni(n);return this.docs=this.docs.insert(r,{document:n.mutableCopy(),size:o}),this.size+=o-s,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const r=this.docs.get(n);return L.resolve(r?r.document.mutableCopy():gt.newInvalidDocument(n))}getEntries(e,n){let r=Zn();return n.forEach(i=>{const s=this.docs.get(i);r=r.insert(i,s?s.document.mutableCopy():gt.newInvalidDocument(i))}),L.resolve(r)}getDocumentsMatchingQuery(e,n,r,i){let s=Zn();const o=n.path,l=new X(o.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(l);for(;u.hasNext();){const{key:c,value:{document:f}}=u.getNext();if(!o.isPrefixOf(c.path))break;c.path.length>o.length+1||QC(GC(f),r)<=0||(i.has(f.key)||tc(n,f))&&(s=s.insert(f.key,f.mutableCopy()))}return L.resolve(s)}getAllFromCollectionGroup(e,n,r,i){Z(9500)}ri(e,n){return L.forEach(this.docs,r=>n(r))}newChangeBuffer(e){return new EA(this)}getSize(e){return L.resolve(this.size)}}class EA extends fA{constructor(e){super(),this.Or=e}applyChanges(e){const n=[];return this.changes.forEach((r,i)=>{i.isValidDocument()?n.push(this.Or.addEntry(e,i)):this.Or.removeEntry(r)}),L.waitFor(n)}getFromCache(e,n){return this.Or.getEntry(e,n)}getAllFromCache(e,n){return this.Or.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class TA{constructor(e){this.persistence=e,this.ii=new Si(n=>np(n),rp),this.lastRemoteSnapshotVersion=ee.min(),this.highestTargetId=0,this.si=0,this.oi=new up,this.targetCount=0,this._i=vs.ar()}forEachTarget(e,n){return this.ii.forEach((r,i)=>n(i)),L.resolve()}getLastRemoteSnapshotVersion(e){return L.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return L.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),L.resolve(this.highestTargetId)}setTargetsMetadata(e,n,r){return r&&(this.lastRemoteSnapshotVersion=r),n>this.si&&(this.si=n),L.resolve()}hr(e){this.ii.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this._i=new vs(n),this.highestTargetId=n),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,n){return this.hr(n),this.targetCount+=1,L.resolve()}updateTargetData(e,n){return this.hr(n),L.resolve()}removeTargetData(e,n){return this.ii.delete(n.target),this.oi.zr(n.targetId),this.targetCount-=1,L.resolve()}removeTargets(e,n,r){let i=0;const s=[];return this.ii.forEach((o,l)=>{l.sequenceNumber<=n&&r.get(l.targetId)===null&&(this.ii.delete(o),s.push(this.removeMatchingKeysForTargetId(e,l.targetId)),i++)}),L.waitFor(s).next(()=>i)}getTargetCount(e){return L.resolve(this.targetCount)}getTargetData(e,n){const r=this.ii.get(n)||null;return L.resolve(r)}addMatchingKeys(e,n,r){return this.oi.Kr(n,r),L.resolve()}removeMatchingKeys(e,n,r){this.oi.Gr(n,r);const i=this.persistence.referenceDelegate,s=[];return i&&n.forEach(o=>{s.push(i.markPotentiallyOrphaned(e,o))}),L.waitFor(s)}removeMatchingKeysForTargetId(e,n){return this.oi.zr(n),L.resolve()}getMatchingKeysForTargetId(e,n){const r=this.oi.Jr(n);return L.resolve(r)}containsKey(e,n){return L.resolve(this.oi.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class C1{constructor(e,n){this.ai={},this.overlays={},this.ui=new Qu(0),this.ci=!1,this.ci=!0,this.li=new vA,this.referenceDelegate=e(this),this.hi=new TA(this),this.indexManager=new oA,this.remoteDocumentCache=function(i){return new wA(i)}(r=>this.referenceDelegate.Pi(r)),this.serializer=new iA(n),this.Ti=new mA(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new yA,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let r=this.ai[e.toKey()];return r||(r=new _A(n,this.referenceDelegate),this.ai[e.toKey()]=r),r}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,n,r){H("MemoryPersistence","Starting transaction:",e);const i=new SA(this.ui.next());return this.referenceDelegate.Ii(),r(i).next(s=>this.referenceDelegate.di(i).next(()=>s)).toPromise().then(s=>(i.raiseOnCommittedEvent(),s))}Ei(e,n){return L.or(Object.values(this.ai).map(r=>()=>r.containsKey(e,n)))}}class SA extends XC{constructor(e){super(),this.currentSequenceNumber=e}}class cp{constructor(e){this.persistence=e,this.Ai=new up,this.Ri=null}static Vi(e){return new cp(e)}get mi(){if(this.Ri)return this.Ri;throw Z(60996)}addReference(e,n,r){return this.Ai.addReference(r,n),this.mi.delete(r.toString()),L.resolve()}removeReference(e,n,r){return this.Ai.removeReference(r,n),this.mi.add(r.toString()),L.resolve()}markPotentiallyOrphaned(e,n){return this.mi.add(n.toString()),L.resolve()}removeTarget(e,n){this.Ai.zr(n.targetId).forEach(i=>this.mi.add(i.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,n.targetId).next(i=>{i.forEach(s=>this.mi.add(s.toString()))}).next(()=>r.removeTargetData(e,n))}Ii(){this.Ri=new Set}di(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return L.forEach(this.mi,r=>{const i=X.fromPath(r);return this.fi(e,i).next(s=>{s||n.removeEntry(i,ee.min())})}).next(()=>(this.Ri=null,n.apply(e)))}updateLimboDocument(e,n){return this.fi(e,n).next(r=>{r?this.mi.delete(n.toString()):this.mi.add(n.toString())})}Pi(e){return 0}fi(e,n){return L.or([()=>L.resolve(this.Ai.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Ei(e,n)])}}class _u{constructor(e,n){this.persistence=e,this.gi=new Si(r=>eb(r.path),(r,i)=>r.isEqual(i)),this.garbageCollector=hA(this,n)}static Vi(e,n){return new _u(e,n)}Ii(){}di(e){return L.resolve()}forEachTarget(e,n){return this.persistence.getTargetCache().forEachTarget(e,n)}mr(e){const n=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next(r=>n.next(i=>r+i))}yr(e){let n=0;return this.gr(e,r=>{n++}).next(()=>n)}gr(e,n){return L.forEach(this.gi,(r,i)=>this.Sr(e,r,i).next(s=>s?L.resolve():n(i)))}removeTargets(e,n,r){return this.persistence.getTargetCache().removeTargets(e,n,r)}removeOrphanedDocuments(e,n){let r=0;const i=this.persistence.getRemoteDocumentCache(),s=i.newChangeBuffer();return i.ri(e,o=>this.Sr(e,o,n).next(l=>{l||(r++,s.removeEntry(o,ee.min()))})).next(()=>s.apply(e)).next(()=>r)}markPotentiallyOrphaned(e,n){return this.gi.set(n,e.currentSequenceNumber),L.resolve()}removeTarget(e,n){const r=n.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,n,r){return this.gi.set(r,e.currentSequenceNumber),L.resolve()}removeReference(e,n,r){return this.gi.set(r,e.currentSequenceNumber),L.resolve()}updateLimboDocument(e,n){return this.gi.set(n,e.currentSequenceNumber),L.resolve()}Pi(e){let n=e.key.toString().length;return e.isFoundDocument()&&(n+=xl(e.data.value)),n}Sr(e,n,r){return L.or([()=>this.persistence.Ei(e,n),()=>this.persistence.getTargetCache().containsKey(e,n),()=>{const i=this.gi.get(n);return L.resolve(i!==void 0&&i>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dp{constructor(e,n,r,i){this.targetId=e,this.fromCache=n,this.Is=r,this.ds=i}static Es(e,n){let r=se(),i=se();for(const s of n.docChanges)switch(s.type){case 0:r=r.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new dp(e,n.fromCache,r,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IA{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xA{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=function(){return rx()?8:JC(vt())>0?6:4}()}initialize(e,n){this.gs=e,this.indexManager=n,this.As=!0}getDocumentsMatchingQuery(e,n,r,i){const s={result:null};return this.ps(e,n).next(o=>{s.result=o}).next(()=>{if(!s.result)return this.ys(e,n,i,r).next(o=>{s.result=o})}).next(()=>{if(s.result)return;const o=new IA;return this.ws(e,n,o).next(l=>{if(s.result=l,this.Rs)return this.Ss(e,n,o,l.size)})}).next(()=>s.result)}Ss(e,n,r,i){return r.documentReadCount<this.Vs?(Di()<=ie.DEBUG&&H("QueryEngine","SDK will not create cache indexes for query:",Ni(n),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),L.resolve()):(Di()<=ie.DEBUG&&H("QueryEngine","Query:",Ni(n),"scans",r.documentReadCount,"local documents and returns",i,"documents as results."),r.documentReadCount>this.fs*i?(Di()<=ie.DEBUG&&H("QueryEngine","The SDK decides to create cache indexes for query:",Ni(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,En(n))):L.resolve())}ps(e,n){if(Ny(n))return L.resolve(null);let r=En(n);return this.indexManager.getIndexType(e,r).next(i=>i===0?null:(n.limit!==null&&i===1&&(n=kh(n,null,"F"),r=En(n)),this.indexManager.getDocumentsMatchingTarget(e,r).next(s=>{const o=se(...s);return this.gs.getDocuments(e,o).next(l=>this.indexManager.getMinOffset(e,r).next(u=>{const c=this.bs(n,l);return this.Ds(n,c,o,u.readTime)?this.ps(e,kh(n,null,"F")):this.vs(e,c,n,u)}))})))}ys(e,n,r,i){return Ny(n)||i.isEqual(ee.min())?L.resolve(null):this.gs.getDocuments(e,r).next(s=>{const o=this.bs(n,s);return this.Ds(n,o,r,i)?L.resolve(null):(Di()<=ie.DEBUG&&H("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),Ni(n)),this.vs(e,o,n,KC(i,Xo)).next(l=>l))})}bs(e,n){let r=new He(s1(e));return n.forEach((i,s)=>{tc(e,s)&&(r=r.add(s))}),r}Ds(e,n,r,i){if(e.limit===null)return!1;if(r.size!==n.size)return!0;const s=e.limitType==="F"?n.last():n.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}ws(e,n,r){return Di()<=ie.DEBUG&&H("QueryEngine","Using full collection scan to execute query:",Ni(n)),this.gs.getDocumentsMatchingQuery(e,n,Pr.min(),r)}vs(e,n,r,i){return this.gs.getDocumentsMatchingQuery(e,r,i).next(s=>(n.forEach(o=>{s=s.insert(o.key,o)}),s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hp="LocalStore",kA=3e8;class CA{constructor(e,n,r,i){this.persistence=e,this.Cs=n,this.serializer=i,this.Fs=new Pe(ne),this.Ms=new Si(s=>np(s),rp),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(r)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new gA(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.Fs))}}function bA(t,e,n,r){return new CA(t,e,n,r)}async function b1(t,e){const n=te(t);return await n.persistence.runTransaction("Handle user change","readonly",r=>{let i;return n.mutationQueue.getAllMutationBatches(r).next(s=>(i=s,n.Ns(e),n.mutationQueue.getAllMutationBatches(r))).next(s=>{const o=[],l=[];let u=se();for(const c of i){o.push(c.batchId);for(const f of c.mutations)u=u.add(f.key)}for(const c of s){l.push(c.batchId);for(const f of c.mutations)u=u.add(f.key)}return n.localDocuments.getDocuments(r,u).next(c=>({Bs:c,removedBatchIds:o,addedBatchIds:l}))})})}function AA(t,e){const n=te(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const i=e.batch.keys(),s=n.Os.newChangeBuffer({trackRemovals:!0});return function(l,u,c,f){const m=c.batch,g=m.keys();let _=L.resolve();return g.forEach(b=>{_=_.next(()=>f.getEntry(u,b)).next(x=>{const O=c.docVersions.get(b);me(O!==null,48541),x.version.compareTo(O)<0&&(m.applyToRemoteDocument(x,c),x.isValidDocument()&&(x.setReadTime(c.commitVersion),f.addEntry(x)))})}),_.next(()=>l.mutationQueue.removeMutationBatch(u,m))}(n,r,e,s).next(()=>s.apply(r)).next(()=>n.mutationQueue.performConsistencyCheck(r)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(r,i,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(l){let u=se();for(let c=0;c<l.mutationResults.length;++c)l.mutationResults[c].transformResults.length>0&&(u=u.add(l.batch.mutations[c].key));return u}(e))).next(()=>n.localDocuments.getDocuments(r,i))})}function A1(t){const e=te(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.hi.getLastRemoteSnapshotVersion(n))}function RA(t,e){const n=te(t),r=e.snapshotVersion;let i=n.Fs;return n.persistence.runTransaction("Apply remote event","readwrite-primary",s=>{const o=n.Os.newChangeBuffer({trackRemovals:!0});i=n.Fs;const l=[];e.targetChanges.forEach((f,m)=>{const g=i.get(m);if(!g)return;l.push(n.hi.removeMatchingKeys(s,f.removedDocuments,m).next(()=>n.hi.addMatchingKeys(s,f.addedDocuments,m)));let _=g.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(m)!==null?_=_.withResumeToken(st.EMPTY_BYTE_STRING,ee.min()).withLastLimboFreeSnapshotVersion(ee.min()):f.resumeToken.approximateByteSize()>0&&(_=_.withResumeToken(f.resumeToken,r)),i=i.insert(m,_),function(x,O,k){return x.resumeToken.approximateByteSize()===0||O.snapshotVersion.toMicroseconds()-x.snapshotVersion.toMicroseconds()>=kA?!0:k.addedDocuments.size+k.modifiedDocuments.size+k.removedDocuments.size>0}(g,_,f)&&l.push(n.hi.updateTargetData(s,_))});let u=Zn(),c=se();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&l.push(n.persistence.referenceDelegate.updateLimboDocument(s,f))}),l.push(PA(s,o,e.documentUpdates).next(f=>{u=f.Ls,c=f.ks})),!r.isEqual(ee.min())){const f=n.hi.getLastRemoteSnapshotVersion(s).next(m=>n.hi.setTargetsMetadata(s,s.currentSequenceNumber,r));l.push(f)}return L.waitFor(l).next(()=>o.apply(s)).next(()=>n.localDocuments.getLocalViewOfDocuments(s,u,c)).next(()=>u)}).then(s=>(n.Fs=i,s))}function PA(t,e,n){let r=se(),i=se();return n.forEach(s=>r=r.add(s)),e.getEntries(t,r).next(s=>{let o=Zn();return n.forEach((l,u)=>{const c=s.get(l);u.isFoundDocument()!==c.isFoundDocument()&&(i=i.add(l)),u.isNoDocument()&&u.version.isEqual(ee.min())?(e.removeEntry(l,u.readTime),o=o.insert(l,u)):!c.isValidDocument()||u.version.compareTo(c.version)>0||u.version.compareTo(c.version)===0&&c.hasPendingWrites?(e.addEntry(u),o=o.insert(l,u)):H(hp,"Ignoring outdated watch update for ",l,". Current version:",c.version," Watch version:",u.version)}),{Ls:o,ks:i}})}function DA(t,e){const n=te(t);return n.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=Zf),n.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function NA(t,e){const n=te(t);return n.persistence.runTransaction("Allocate target","readwrite",r=>{let i;return n.hi.getTargetData(r,e).next(s=>s?(i=s,L.resolve(i)):n.hi.allocateTargetId(r).next(o=>(i=new mr(e,o,"TargetPurposeListen",r.currentSequenceNumber),n.hi.addTargetData(r,i).next(()=>i))))}).then(r=>{const i=n.Fs.get(r.targetId);return(i===null||r.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(n.Fs=n.Fs.insert(r.targetId,r),n.Ms.set(e,r.targetId)),r})}async function Ph(t,e,n){const r=te(t),i=r.Fs.get(e),s=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",s,o=>r.persistence.referenceDelegate.removeTarget(o,i))}catch(o){if(!Ps(o))throw o;H(hp,`Failed to update sequence numbers for target ${e}: ${o}`)}r.Fs=r.Fs.remove(e),r.Ms.delete(i.target)}function qy(t,e,n){const r=te(t);let i=ee.min(),s=se();return r.persistence.runTransaction("Execute query","readwrite",o=>function(u,c,f){const m=te(u),g=m.Ms.get(f);return g!==void 0?L.resolve(m.Fs.get(g)):m.hi.getTargetData(c,f)}(r,o,En(e)).next(l=>{if(l)return i=l.lastLimboFreeSnapshotVersion,r.hi.getMatchingKeysForTargetId(o,l.targetId).next(u=>{s=u})}).next(()=>r.Cs.getDocumentsMatchingQuery(o,e,n?i:ee.min(),n?s:se())).next(l=>(OA(r,wb(e),l),{documents:l,qs:s})))}function OA(t,e,n){let r=t.xs.get(e)||ee.min();n.forEach((i,s)=>{s.readTime.compareTo(r)>0&&(r=s.readTime)}),t.xs.set(e,r)}class Ky{constructor(){this.activeTargetIds=kb()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class VA{constructor(){this.Fo=new Ky,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,r){}addLocalQueryTarget(e,n=!0){return n&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,n,r){this.Mo[e]=n}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new Ky,Promise.resolve()}handleUserChange(e,n,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MA{xo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gy="ConnectivityMonitor";class Qy{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){H(Gy,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){H(Gy,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let al=null;function Dh(){return al===null?al=function(){return 268435456+Math.round(2147483648*Math.random())}():al++,"0x"+al.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cd="RestConnection",LA={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class jA{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const n=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.$o=n+"://"+e.host,this.Uo=`projects/${r}/databases/${i}`,this.Ko=this.databaseId.database===hu?`project_id=${r}`:`project_id=${r}&database_id=${i}`}Wo(e,n,r,i,s){const o=Dh(),l=this.Go(e,n.toUriEncodedString());H(cd,`Sending RPC '${e}' ${o}:`,l,r);const u={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(u,i,s);const{host:c}=new URL(l),f=xs(c);return this.jo(e,l,u,r,f).then(m=>(H(cd,`Received RPC '${e}' ${o}: `,m),m),m=>{throw Rr(cd,`RPC '${e}' ${o} failed with error: `,m,"url: ",l,"request:",r),m})}Jo(e,n,r,i,s,o){return this.Wo(e,n,r,i,s)}zo(e,n,r){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+As}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach((i,s)=>e[s]=i),r&&r.headers.forEach((i,s)=>e[s]=i)}Go(e,n){const r=LA[e];return`${this.$o}/v1/${n}:${r}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FA{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ht="WebChannelConnection";class zA extends jA{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,n,r,i,s){const o=Dh();return new Promise((l,u)=>{const c=new Nw;c.setWithCredentials(!0),c.listenOnce(Ow.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case Il.NO_ERROR:const m=c.getResponseJson();H(ht,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(m)),l(m);break;case Il.TIMEOUT:H(ht,`RPC '${e}' ${o} timed out`),u(new Y(U.DEADLINE_EXCEEDED,"Request time out"));break;case Il.HTTP_ERROR:const g=c.getStatus();if(H(ht,`RPC '${e}' ${o} failed with status:`,g,"response text:",c.getResponseText()),g>0){let _=c.getResponseJson();Array.isArray(_)&&(_=_[0]);const b=_==null?void 0:_.error;if(b&&b.status&&b.message){const x=function(k){const E=k.toLowerCase().replace(/_/g,"-");return Object.values(U).indexOf(E)>=0?E:U.UNKNOWN}(b.status);u(new Y(x,b.message))}else u(new Y(U.UNKNOWN,"Server responded with status "+c.getStatus()))}else u(new Y(U.UNAVAILABLE,"Connection failed."));break;default:Z(9055,{c_:e,streamId:o,l_:c.getLastErrorCode(),h_:c.getLastError()})}}finally{H(ht,`RPC '${e}' ${o} completed.`)}});const f=JSON.stringify(i);H(ht,`RPC '${e}' ${o} sending request:`,i),c.send(n,"POST",f,r,15)})}P_(e,n,r){const i=Dh(),s=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=Lw(),l=Mw(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;c!==void 0&&(u.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(u.useFetchStreams=!0),this.zo(u.initMessageHeaders,n,r),u.encodeInitMessageHeaders=!0;const f=s.join("");H(ht,`Creating RPC '${e}' stream ${i}: ${f}`,u);const m=o.createWebChannel(f,u);this.T_(m);let g=!1,_=!1;const b=new FA({Ho:O=>{_?H(ht,`Not sending because RPC '${e}' stream ${i} is closed:`,O):(g||(H(ht,`Opening RPC '${e}' stream ${i} transport.`),m.open(),g=!0),H(ht,`RPC '${e}' stream ${i} sending:`,O),m.send(O))},Yo:()=>m.close()}),x=(O,k,E)=>{O.listen(k,A=>{try{E(A)}catch(V){setTimeout(()=>{throw V},0)}})};return x(m,co.EventType.OPEN,()=>{_||(H(ht,`RPC '${e}' stream ${i} transport opened.`),b.s_())}),x(m,co.EventType.CLOSE,()=>{_||(_=!0,H(ht,`RPC '${e}' stream ${i} transport closed`),b.__(),this.I_(m))}),x(m,co.EventType.ERROR,O=>{_||(_=!0,Rr(ht,`RPC '${e}' stream ${i} transport errored. Name:`,O.name,"Message:",O.message),b.__(new Y(U.UNAVAILABLE,"The operation could not be completed")))}),x(m,co.EventType.MESSAGE,O=>{var k;if(!_){const E=O.data[0];me(!!E,16349);const A=E,V=(A==null?void 0:A.error)||((k=A[0])===null||k===void 0?void 0:k.error);if(V){H(ht,`RPC '${e}' stream ${i} received error:`,V);const F=V.status;let D=function(T){const C=je[T];if(C!==void 0)return m1(C)}(F),S=V.message;D===void 0&&(D=U.INTERNAL,S="Unknown error status: "+F+" with message "+V.message),_=!0,b.__(new Y(D,S)),m.close()}else H(ht,`RPC '${e}' stream ${i} received:`,E),b.a_(E)}}),x(l,Vw.STAT_EVENT,O=>{O.stat===wh.PROXY?H(ht,`RPC '${e}' stream ${i} detected buffering proxy`):O.stat===wh.NOPROXY&&H(ht,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{b.o_()},0),b}terminate(){this.u_.forEach(e=>e.close()),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter(n=>n===e)}}function dd(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sc(t){return new Wb(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class R1{constructor(e,n,r=1e3,i=1.5,s=6e4){this.Fi=e,this.timerId=n,this.d_=r,this.E_=i,this.A_=s,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const n=Math.floor(this.R_+this.p_()),r=Math.max(0,Date.now()-this.m_),i=Math.max(0,n-r);i>0&&H("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.R_} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,i,()=>(this.m_=Date.now(),e())),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yy="PersistentStream";class P1{constructor(e,n,r,i,s,o,l,u){this.Fi=e,this.w_=r,this.S_=i,this.connection=s,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=u,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new R1(e,n)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,()=>this.L_()))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,n){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():n&&n.code===U.RESOURCE_EXHAUSTED?(Jn(n.toString()),Jn("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):n&&n.code===U.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(n)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),n=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,i])=>{this.b_===n&&this.W_(r,i)},r=>{e(()=>{const i=new Y(U.UNKNOWN,"Fetching auth token failed: "+r.message);return this.G_(i)})})}W_(e,n){const r=this.K_(this.b_);this.stream=this.z_(e,n),this.stream.Zo(()=>{r(()=>this.listener.Zo())}),this.stream.e_(()=>{r(()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,()=>(this.x_()&&(this.state=3),Promise.resolve())),this.listener.e_()))}),this.stream.n_(i=>{r(()=>this.G_(i))}),this.stream.onMessage(i=>{r(()=>++this.C_==1?this.j_(i):this.onNext(i))})}O_(){this.state=5,this.F_.g_(async()=>{this.state=0,this.start()})}G_(e){return H(Yy,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return n=>{this.Fi.enqueueAndForget(()=>this.b_===e?n():(H(Yy,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class UA extends P1{constructor(e,n,r,i,s,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,r,i,o),this.serializer=s}z_(e,n){return this.connection.P_("Listen",e,n)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const n=Kb(this.serializer,e),r=function(s){if(!("targetChange"in s))return ee.min();const o=s.targetChange;return o.targetIds&&o.targetIds.length?ee.min():o.readTime?Sn(o.readTime):ee.min()}(e);return this.listener.J_(n,r)}H_(e){const n={};n.database=Rh(this.serializer),n.addTarget=function(s,o){let l;const u=o.target;if(l=xh(u)?{documents:Yb(s,u)}:{query:Xb(s,u).Vt},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=_1(s,o.resumeToken);const c=Ch(s,o.expectedCount);c!==null&&(l.expectedCount=c)}else if(o.snapshotVersion.compareTo(ee.min())>0){l.readTime=vu(s,o.snapshotVersion.toTimestamp());const c=Ch(s,o.expectedCount);c!==null&&(l.expectedCount=c)}return l}(this.serializer,e);const r=Zb(this.serializer,e);r&&(n.labels=r),this.k_(n)}Y_(e){const n={};n.database=Rh(this.serializer),n.removeTarget=e,this.k_(n)}}class BA extends P1{constructor(e,n,r,i,s,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,r,i,o),this.serializer=s}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,n){return this.connection.P_("Write",e,n)}j_(e){return me(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,me(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){me(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const n=Qb(e.writeResults,e.commitTime),r=Sn(e.commitTime);return this.listener.ta(r,n)}na(){const e={};e.database=Rh(this.serializer),this.k_(e)}X_(e){const n={streamToken:this.lastStreamToken,writes:e.map(r=>Gb(this.serializer,r))};this.k_(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $A{}class WA extends $A{constructor(e,n,r,i){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=i,this.ra=!1}ia(){if(this.ra)throw new Y(U.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,n,r,i){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.Wo(e,bh(n,r),i,s,o)).catch(s=>{throw s.name==="FirebaseError"?(s.code===U.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new Y(U.UNKNOWN,s.toString())})}Jo(e,n,r,i,s){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.Jo(e,bh(n,r),i,o,l,s)).catch(o=>{throw o.name==="FirebaseError"?(o.code===U.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new Y(U.UNKNOWN,o.toString())})}terminate(){this.ra=!0,this.connection.terminate()}}class HA{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve())))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(Jn(n),this._a=!1):H("OnlineStateTracker",n)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mi="RemoteStore";class qA{constructor(e,n,r,i,s){this.localStore=e,this.datastore=n,this.asyncQueue=r,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=s,this.Ea.xo(o=>{r.enqueueAndForget(async()=>{xi(this)&&(H(mi,"Restarting streams for network reachability change."),await async function(u){const c=te(u);c.Ia.add(4),await _a(c),c.Aa.set("Unknown"),c.Ia.delete(4),await oc(c)}(this))})}),this.Aa=new HA(r,i)}}async function oc(t){if(xi(t))for(const e of t.da)await e(!0)}async function _a(t){for(const e of t.da)await e(!1)}function D1(t,e){const n=te(t);n.Ta.has(e.targetId)||(n.Ta.set(e.targetId,e),mp(n)?gp(n):Ds(n).x_()&&pp(n,e))}function fp(t,e){const n=te(t),r=Ds(n);n.Ta.delete(e),r.x_()&&N1(n,e),n.Ta.size===0&&(r.x_()?r.B_():xi(n)&&n.Aa.set("Unknown"))}function pp(t,e){if(t.Ra.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(ee.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}Ds(t).H_(e)}function N1(t,e){t.Ra.$e(e),Ds(t).Y_(e)}function gp(t){t.Ra=new zb({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>t.Ta.get(e)||null,lt:()=>t.datastore.serializer.databaseId}),Ds(t).start(),t.Aa.aa()}function mp(t){return xi(t)&&!Ds(t).M_()&&t.Ta.size>0}function xi(t){return te(t).Ia.size===0}function O1(t){t.Ra=void 0}async function KA(t){t.Aa.set("Online")}async function GA(t){t.Ta.forEach((e,n)=>{pp(t,e)})}async function QA(t,e){O1(t),mp(t)?(t.Aa.la(e),gp(t)):t.Aa.set("Unknown")}async function YA(t,e,n){if(t.Aa.set("Online"),e instanceof v1&&e.state===2&&e.cause)try{await async function(i,s){const o=s.cause;for(const l of s.targetIds)i.Ta.has(l)&&(await i.remoteSyncer.rejectListen(l,o),i.Ta.delete(l),i.Ra.removeTarget(l))}(t,e)}catch(r){H(mi,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await wu(t,r)}else if(e instanceof bl?t.Ra.Ye(e):e instanceof y1?t.Ra.it(e):t.Ra.et(e),!n.isEqual(ee.min()))try{const r=await A1(t.localStore);n.compareTo(r)>=0&&await function(s,o){const l=s.Ra.Pt(o);return l.targetChanges.forEach((u,c)=>{if(u.resumeToken.approximateByteSize()>0){const f=s.Ta.get(c);f&&s.Ta.set(c,f.withResumeToken(u.resumeToken,o))}}),l.targetMismatches.forEach((u,c)=>{const f=s.Ta.get(u);if(!f)return;s.Ta.set(u,f.withResumeToken(st.EMPTY_BYTE_STRING,f.snapshotVersion)),N1(s,u);const m=new mr(f.target,u,c,f.sequenceNumber);pp(s,m)}),s.remoteSyncer.applyRemoteEvent(l)}(t,n)}catch(r){H(mi,"Failed to raise snapshot:",r),await wu(t,r)}}async function wu(t,e,n){if(!Ps(e))throw e;t.Ia.add(1),await _a(t),t.Aa.set("Offline"),n||(n=()=>A1(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{H(mi,"Retrying IndexedDB access"),await n(),t.Ia.delete(1),await oc(t)})}function V1(t,e){return e().catch(n=>wu(t,n,e))}async function ac(t){const e=te(t),n=Vr(e);let r=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:Zf;for(;XA(e);)try{const i=await DA(e.localStore,r);if(i===null){e.Pa.length===0&&n.B_();break}r=i.batchId,JA(e,i)}catch(i){await wu(e,i)}M1(e)&&L1(e)}function XA(t){return xi(t)&&t.Pa.length<10}function JA(t,e){t.Pa.push(e);const n=Vr(t);n.x_()&&n.Z_&&n.X_(e.mutations)}function M1(t){return xi(t)&&!Vr(t).M_()&&t.Pa.length>0}function L1(t){Vr(t).start()}async function ZA(t){Vr(t).na()}async function eR(t){const e=Vr(t);for(const n of t.Pa)e.X_(n.mutations)}async function tR(t,e,n){const r=t.Pa.shift(),i=op.from(r,e,n);await V1(t,()=>t.remoteSyncer.applySuccessfulWrite(i)),await ac(t)}async function nR(t,e){e&&Vr(t).Z_&&await async function(r,i){if(function(o){return jb(o)&&o!==U.ABORTED}(i.code)){const s=r.Pa.shift();Vr(r).N_(),await V1(r,()=>r.remoteSyncer.rejectFailedWrite(s.batchId,i)),await ac(r)}}(t,e),M1(t)&&L1(t)}async function Xy(t,e){const n=te(t);n.asyncQueue.verifyOperationInProgress(),H(mi,"RemoteStore received new credentials");const r=xi(n);n.Ia.add(3),await _a(n),r&&n.Aa.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.Ia.delete(3),await oc(n)}async function rR(t,e){const n=te(t);e?(n.Ia.delete(2),await oc(n)):e||(n.Ia.add(2),await _a(n),n.Aa.set("Unknown"))}function Ds(t){return t.Va||(t.Va=function(n,r,i){const s=te(n);return s.ia(),new UA(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(t.datastore,t.asyncQueue,{Zo:KA.bind(null,t),e_:GA.bind(null,t),n_:QA.bind(null,t),J_:YA.bind(null,t)}),t.da.push(async e=>{e?(t.Va.N_(),mp(t)?gp(t):t.Aa.set("Unknown")):(await t.Va.stop(),O1(t))})),t.Va}function Vr(t){return t.ma||(t.ma=function(n,r,i){const s=te(n);return s.ia(),new BA(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(t.datastore,t.asyncQueue,{Zo:()=>Promise.resolve(),e_:ZA.bind(null,t),n_:nR.bind(null,t),ea:eR.bind(null,t),ta:tR.bind(null,t)}),t.da.push(async e=>{e?(t.ma.N_(),await ac(t)):(await t.ma.stop(),t.Pa.length>0&&(H(mi,`Stopping write stream with ${t.Pa.length} pending writes`),t.Pa=[]))})),t.ma}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yp{constructor(e,n,r,i,s){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=r,this.op=i,this.removalCallback=s,this.deferred=new Cr,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,r,i,s){const o=Date.now()+r,l=new yp(e,n,o,i,s);return l.start(r),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new Y(U.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function vp(t,e){if(Jn("AsyncQueue",`${e}: ${t}`),Ps(t))return new Y(U.UNAVAILABLE,`${e}: ${t}`);throw t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rs{static emptySet(e){return new rs(e.comparator)}constructor(e){this.comparator=e?(n,r)=>e(n,r)||X.comparator(n.key,r.key):(n,r)=>X.comparator(n.key,r.key),this.keyedMap=ho(),this.sortedSet=new Pe(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,r)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof rs)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;n.hasNext();){const i=n.getNext().key,s=r.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const r=new rs;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=n,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jy{constructor(){this.fa=new Pe(X.comparator)}track(e){const n=e.doc.key,r=this.fa.get(n);r?e.type!==0&&r.type===3?this.fa=this.fa.insert(n,e):e.type===3&&r.type!==1?this.fa=this.fa.insert(n,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.fa=this.fa.insert(n,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.fa=this.fa.insert(n,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.fa=this.fa.remove(n):e.type===1&&r.type===2?this.fa=this.fa.insert(n,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.fa=this.fa.insert(n,{type:2,doc:e.doc}):Z(63341,{At:e,ga:r}):this.fa=this.fa.insert(n,e)}pa(){const e=[];return this.fa.inorderTraversal((n,r)=>{e.push(r)}),e}}class _s{constructor(e,n,r,i,s,o,l,u,c){this.query=e,this.docs=n,this.oldDocs=r,this.docChanges=i,this.mutatedKeys=s,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=u,this.hasCachedResults=c}static fromInitialDocuments(e,n,r,i,s){const o=[];return n.forEach(l=>{o.push({type:0,doc:l})}),new _s(e,n,rs.emptySet(n),o,r,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&ec(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,r=e.docChanges;if(n.length!==r.length)return!1;for(let i=0;i<n.length;i++)if(n[i].type!==r[i].type||!n[i].doc.isEqual(r[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iR{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some(e=>e.ba())}}class sR{constructor(){this.queries=Zy(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(n,r){const i=te(n),s=i.queries;i.queries=Zy(),s.forEach((o,l)=>{for(const u of l.wa)u.onError(r)})})(this,new Y(U.ABORTED,"Firestore shutting down"))}}function Zy(){return new Si(t=>i1(t),ec)}async function j1(t,e){const n=te(t);let r=3;const i=e.query;let s=n.queries.get(i);s?!s.Sa()&&e.ba()&&(r=2):(s=new iR,r=e.ba()?0:1);try{switch(r){case 0:s.ya=await n.onListen(i,!0);break;case 1:s.ya=await n.onListen(i,!1);break;case 2:await n.onFirstRemoteStoreListen(i)}}catch(o){const l=vp(o,`Initialization of query '${Ni(e.query)}' failed`);return void e.onError(l)}n.queries.set(i,s),s.wa.push(e),e.va(n.onlineState),s.ya&&e.Ca(s.ya)&&_p(n)}async function F1(t,e){const n=te(t),r=e.query;let i=3;const s=n.queries.get(r);if(s){const o=s.wa.indexOf(e);o>=0&&(s.wa.splice(o,1),s.wa.length===0?i=e.ba()?0:1:!s.Sa()&&e.ba()&&(i=2))}switch(i){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function oR(t,e){const n=te(t);let r=!1;for(const i of e){const s=i.query,o=n.queries.get(s);if(o){for(const l of o.wa)l.Ca(i)&&(r=!0);o.ya=i}}r&&_p(n)}function aR(t,e,n){const r=te(t),i=r.queries.get(e);if(i)for(const s of i.wa)s.onError(n);r.queries.delete(e)}function _p(t){t.Da.forEach(e=>{e.next()})}var Nh,ev;(ev=Nh||(Nh={})).Fa="default",ev.Cache="cache";class z1{constructor(e,n,r){this.query=e,this.Ma=n,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=r||{}}Ca(e){if(!this.options.includeMetadataChanges){const r=[];for(const i of e.docChanges)i.type!==3&&r.push(i);e=new _s(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),n=!0):this.Ba(e,this.onlineState)&&(this.La(e),n=!0),this.Oa=e,n}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let n=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),n=!0),n}Ba(e,n){if(!e.fromCache||!this.ba())return!0;const r=n!=="Offline";return(!this.options.ka||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}Na(e){if(e.docChanges.length>0)return!0;const n=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}La(e){e=_s.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==Nh.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U1{constructor(e){this.key=e}}class B1{constructor(e){this.key=e}}class lR{constructor(e,n){this.query=e,this.Ha=n,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=se(),this.mutatedKeys=se(),this.Xa=s1(e),this.eu=new rs(this.Xa)}get tu(){return this.Ha}nu(e,n){const r=n?n.ru:new Jy,i=n?n.eu:this.eu;let s=n?n.mutatedKeys:this.mutatedKeys,o=i,l=!1;const u=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,c=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((f,m)=>{const g=i.get(f),_=tc(this.query,m)?m:null,b=!!g&&this.mutatedKeys.has(g.key),x=!!_&&(_.hasLocalMutations||this.mutatedKeys.has(_.key)&&_.hasCommittedMutations);let O=!1;g&&_?g.data.isEqual(_.data)?b!==x&&(r.track({type:3,doc:_}),O=!0):this.iu(g,_)||(r.track({type:2,doc:_}),O=!0,(u&&this.Xa(_,u)>0||c&&this.Xa(_,c)<0)&&(l=!0)):!g&&_?(r.track({type:0,doc:_}),O=!0):g&&!_&&(r.track({type:1,doc:g}),O=!0,(u||c)&&(l=!0)),O&&(_?(o=o.add(_),s=x?s.add(f):s.delete(f)):(o=o.delete(f),s=s.delete(f)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),s=s.delete(f.key),r.track({type:1,doc:f})}return{eu:o,ru:r,Ds:l,mutatedKeys:s}}iu(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,r,i){const s=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const o=e.ru.pa();o.sort((f,m)=>function(_,b){const x=O=>{switch(O){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Z(20277,{At:O})}};return x(_)-x(b)}(f.type,m.type)||this.Xa(f.doc,m.doc)),this.su(r),i=i!=null&&i;const l=n&&!i?this.ou():[],u=this.Za.size===0&&this.current&&!i?1:0,c=u!==this.Ya;return this.Ya=u,o.length!==0||c?{snapshot:new _s(this.query,e.eu,s,o,e.mutatedKeys,u===0,c,!1,!!r&&r.resumeToken.approximateByteSize()>0),_u:l}:{_u:l}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new Jy,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach(n=>this.Ha=this.Ha.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.Ha=this.Ha.delete(n)),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=se(),this.eu.forEach(r=>{this.au(r.key)&&(this.Za=this.Za.add(r.key))});const n=[];return e.forEach(r=>{this.Za.has(r)||n.push(new B1(r))}),this.Za.forEach(r=>{e.has(r)||n.push(new U1(r))}),n}uu(e){this.Ha=e.qs,this.Za=se();const n=this.nu(e.documents);return this.applyChanges(n,!0)}cu(){return _s.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const wp="SyncEngine";class uR{constructor(e,n,r){this.query=e,this.targetId=n,this.view=r}}class cR{constructor(e){this.key=e,this.lu=!1}}class dR{constructor(e,n,r,i,s,o){this.localStore=e,this.remoteStore=n,this.eventManager=r,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=o,this.hu={},this.Pu=new Si(l=>i1(l),ec),this.Tu=new Map,this.Iu=new Set,this.du=new Pe(X.comparator),this.Eu=new Map,this.Au=new up,this.Ru={},this.Vu=new Map,this.mu=vs.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function hR(t,e,n=!0){const r=G1(t);let i;const s=r.Pu.get(e);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.cu()):i=await $1(r,e,n,!0),i}async function fR(t,e){const n=G1(t);await $1(n,e,!0,!1)}async function $1(t,e,n,r){const i=await NA(t.localStore,En(e)),s=i.targetId,o=t.sharedClientState.addLocalQueryTarget(s,n);let l;return r&&(l=await pR(t,e,s,o==="current",i.resumeToken)),t.isPrimaryClient&&n&&D1(t.remoteStore,i),l}async function pR(t,e,n,r,i){t.gu=(m,g,_)=>async function(x,O,k,E){let A=O.view.nu(k);A.Ds&&(A=await qy(x.localStore,O.query,!1).then(({documents:S})=>O.view.nu(S,A)));const V=E&&E.targetChanges.get(O.targetId),F=E&&E.targetMismatches.get(O.targetId)!=null,D=O.view.applyChanges(A,x.isPrimaryClient,V,F);return nv(x,O.targetId,D._u),D.snapshot}(t,m,g,_);const s=await qy(t.localStore,e,!0),o=new lR(e,s.qs),l=o.nu(s.documents),u=va.createSynthesizedTargetChangeForCurrentChange(n,r&&t.onlineState!=="Offline",i),c=o.applyChanges(l,t.isPrimaryClient,u);nv(t,n,c._u);const f=new uR(e,n,o);return t.Pu.set(e,f),t.Tu.has(n)?t.Tu.get(n).push(e):t.Tu.set(n,[e]),c.snapshot}async function gR(t,e,n){const r=te(t),i=r.Pu.get(e),s=r.Tu.get(i.targetId);if(s.length>1)return r.Tu.set(i.targetId,s.filter(o=>!ec(o,e))),void r.Pu.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await Ph(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),n&&fp(r.remoteStore,i.targetId),Oh(r,i.targetId)}).catch(Rs)):(Oh(r,i.targetId),await Ph(r.localStore,i.targetId,!0))}async function mR(t,e){const n=te(t),r=n.Pu.get(e),i=n.Tu.get(r.targetId);n.isPrimaryClient&&i.length===1&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),fp(n.remoteStore,r.targetId))}async function yR(t,e,n){const r=IR(t);try{const i=await function(o,l){const u=te(o),c=Se.now(),f=l.reduce((_,b)=>_.add(b.key),se());let m,g;return u.persistence.runTransaction("Locally write mutations","readwrite",_=>{let b=Zn(),x=se();return u.Os.getEntries(_,f).next(O=>{b=O,b.forEach((k,E)=>{E.isValidDocument()||(x=x.add(k))})}).next(()=>u.localDocuments.getOverlayedDocuments(_,b)).next(O=>{m=O;const k=[];for(const E of l){const A=Nb(E,m.get(E.key).overlayedDocument);A!=null&&k.push(new Ii(E.key,A,Xw(A.value.mapValue),Tn.exists(!0)))}return u.mutationQueue.addMutationBatch(_,c,k,l)}).next(O=>{g=O;const k=O.applyToLocalDocumentSet(m,x);return u.documentOverlayCache.saveOverlays(_,O.batchId,k)})}).then(()=>({batchId:g.batchId,changes:a1(m)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(i.batchId),function(o,l,u){let c=o.Ru[o.currentUser.toKey()];c||(c=new Pe(ne)),c=c.insert(l,u),o.Ru[o.currentUser.toKey()]=c}(r,i.batchId,n),await wa(r,i.changes),await ac(r.remoteStore)}catch(i){const s=vp(i,"Failed to persist write");n.reject(s)}}async function W1(t,e){const n=te(t);try{const r=await RA(n.localStore,e);e.targetChanges.forEach((i,s)=>{const o=n.Eu.get(s);o&&(me(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1,22616),i.addedDocuments.size>0?o.lu=!0:i.modifiedDocuments.size>0?me(o.lu,14607):i.removedDocuments.size>0&&(me(o.lu,42227),o.lu=!1))}),await wa(n,r,e)}catch(r){await Rs(r)}}function tv(t,e,n){const r=te(t);if(r.isPrimaryClient&&n===0||!r.isPrimaryClient&&n===1){const i=[];r.Pu.forEach((s,o)=>{const l=o.view.va(e);l.snapshot&&i.push(l.snapshot)}),function(o,l){const u=te(o);u.onlineState=l;let c=!1;u.queries.forEach((f,m)=>{for(const g of m.wa)g.va(l)&&(c=!0)}),c&&_p(u)}(r.eventManager,e),i.length&&r.hu.J_(i),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function vR(t,e,n){const r=te(t);r.sharedClientState.updateQueryState(e,"rejected",n);const i=r.Eu.get(e),s=i&&i.key;if(s){let o=new Pe(X.comparator);o=o.insert(s,gt.newNoDocument(s,ee.min()));const l=se().add(s),u=new ic(ee.min(),new Map,new Pe(ne),o,l);await W1(r,u),r.du=r.du.remove(s),r.Eu.delete(e),Ep(r)}else await Ph(r.localStore,e,!1).then(()=>Oh(r,e,n)).catch(Rs)}async function _R(t,e){const n=te(t),r=e.batch.batchId;try{const i=await AA(n.localStore,e);q1(n,r,null),H1(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await wa(n,i)}catch(i){await Rs(i)}}async function wR(t,e,n){const r=te(t);try{const i=await function(o,l){const u=te(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",c=>{let f;return u.mutationQueue.lookupMutationBatch(c,l).next(m=>(me(m!==null,37113),f=m.keys(),u.mutationQueue.removeMutationBatch(c,m))).next(()=>u.mutationQueue.performConsistencyCheck(c)).next(()=>u.documentOverlayCache.removeOverlaysForBatchId(c,f,l)).next(()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(c,f)).next(()=>u.localDocuments.getDocuments(c,f))})}(r.localStore,e);q1(r,e,n),H1(r,e),r.sharedClientState.updateMutationState(e,"rejected",n),await wa(r,i)}catch(i){await Rs(i)}}function H1(t,e){(t.Vu.get(e)||[]).forEach(n=>{n.resolve()}),t.Vu.delete(e)}function q1(t,e,n){const r=te(t);let i=r.Ru[r.currentUser.toKey()];if(i){const s=i.get(e);s&&(n?s.reject(n):s.resolve(),i=i.remove(e)),r.Ru[r.currentUser.toKey()]=i}}function Oh(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const r of t.Tu.get(e))t.Pu.delete(r),n&&t.hu.pu(r,n);t.Tu.delete(e),t.isPrimaryClient&&t.Au.zr(e).forEach(r=>{t.Au.containsKey(r)||K1(t,r)})}function K1(t,e){t.Iu.delete(e.path.canonicalString());const n=t.du.get(e);n!==null&&(fp(t.remoteStore,n),t.du=t.du.remove(e),t.Eu.delete(n),Ep(t))}function nv(t,e,n){for(const r of n)r instanceof U1?(t.Au.addReference(r.key,e),ER(t,r)):r instanceof B1?(H(wp,"Document no longer in limbo: "+r.key),t.Au.removeReference(r.key,e),t.Au.containsKey(r.key)||K1(t,r.key)):Z(19791,{yu:r})}function ER(t,e){const n=e.key,r=n.path.canonicalString();t.du.get(n)||t.Iu.has(r)||(H(wp,"New document in limbo: "+n),t.Iu.add(r),Ep(t))}function Ep(t){for(;t.Iu.size>0&&t.du.size<t.maxConcurrentLimboResolutions;){const e=t.Iu.values().next().value;t.Iu.delete(e);const n=new X(be.fromString(e)),r=t.mu.next();t.Eu.set(r,new cR(n)),t.du=t.du.insert(n,r),D1(t.remoteStore,new mr(En(Zu(n.path)),r,"TargetPurposeLimboResolution",Qu.ue))}}async function wa(t,e,n){const r=te(t),i=[],s=[],o=[];r.Pu.isEmpty()||(r.Pu.forEach((l,u)=>{o.push(r.gu(u,e,n).then(c=>{var f;if((c||n)&&r.isPrimaryClient){const m=c?!c.fromCache:(f=n==null?void 0:n.targetChanges.get(u.targetId))===null||f===void 0?void 0:f.current;r.sharedClientState.updateQueryState(u.targetId,m?"current":"not-current")}if(c){i.push(c);const m=dp.Es(u.targetId,c);s.push(m)}}))}),await Promise.all(o),r.hu.J_(i),await async function(u,c){const f=te(u);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>L.forEach(c,g=>L.forEach(g.Is,_=>f.persistence.referenceDelegate.addReference(m,g.targetId,_)).next(()=>L.forEach(g.ds,_=>f.persistence.referenceDelegate.removeReference(m,g.targetId,_)))))}catch(m){if(!Ps(m))throw m;H(hp,"Failed to update sequence numbers: "+m)}for(const m of c){const g=m.targetId;if(!m.fromCache){const _=f.Fs.get(g),b=_.snapshotVersion,x=_.withLastLimboFreeSnapshotVersion(b);f.Fs=f.Fs.insert(g,x)}}}(r.localStore,s))}async function TR(t,e){const n=te(t);if(!n.currentUser.isEqual(e)){H(wp,"User change. New user:",e.toKey());const r=await b1(n.localStore,e);n.currentUser=e,function(s,o){s.Vu.forEach(l=>{l.forEach(u=>{u.reject(new Y(U.CANCELLED,o))})}),s.Vu.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await wa(n,r.Bs)}}function SR(t,e){const n=te(t),r=n.Eu.get(e);if(r&&r.lu)return se().add(r.key);{let i=se();const s=n.Tu.get(e);if(!s)return i;for(const o of s){const l=n.Pu.get(o);i=i.unionWith(l.view.tu)}return i}}function G1(t){const e=te(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=W1.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=SR.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=vR.bind(null,e),e.hu.J_=oR.bind(null,e.eventManager),e.hu.pu=aR.bind(null,e.eventManager),e}function IR(t){const e=te(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=_R.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=wR.bind(null,e),e}class Eu{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=sc(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,n){return null}Fu(e,n){return null}vu(e){return bA(this.persistence,new xA,e.initialUser,this.serializer)}Du(e){return new C1(cp.Vi,this.serializer)}bu(e){return new VA}async terminate(){var e,n;(e=this.gcScheduler)===null||e===void 0||e.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Eu.provider={build:()=>new Eu};class xR extends Eu{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,n){me(this.persistence.referenceDelegate instanceof _u,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new cA(r,e.asyncQueue,n)}Du(e){const n=this.cacheSizeBytes!==void 0?kt.withCacheSize(this.cacheSizeBytes):kt.DEFAULT;return new C1(r=>_u.Vi(r,n),this.serializer)}}class Vh{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>tv(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=TR.bind(null,this.syncEngine),await rR(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new sR}()}createDatastore(e){const n=sc(e.databaseInfo.databaseId),r=function(s){return new zA(s)}(e.databaseInfo);return function(s,o,l,u){return new WA(s,o,l,u)}(e.authCredentials,e.appCheckCredentials,r,n)}createRemoteStore(e){return function(r,i,s,o,l){return new qA(r,i,s,o,l)}(this.localStore,this.datastore,e.asyncQueue,n=>tv(this.syncEngine,n,0),function(){return Qy.C()?new Qy:new MA}())}createSyncEngine(e,n){return function(i,s,o,l,u,c,f){const m=new dR(i,s,o,l,u,c);return f&&(m.fu=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await async function(i){const s=te(i);H(mi,"RemoteStore shutting down."),s.Ia.add(5),await _a(s),s.Ea.shutdown(),s.Aa.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(n=this.eventManager)===null||n===void 0||n.terminate()}}Vh.provider={build:()=>new Vh};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q1{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):Jn("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,n){setTimeout(()=>{this.muted||e(n)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mr="FirestoreClient";class kR{constructor(e,n,r,i,s){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=r,this.databaseInfo=i,this.user=ft.UNAUTHENTICATED,this.clientId=Xf.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(r,async o=>{H(Mr,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(r,o=>(H(Mr,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Cr;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const r=vp(n,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function hd(t,e){t.asyncQueue.verifyOperationInProgress(),H(Mr,"Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let r=n.initialUser;t.setCredentialChangeListener(async i=>{r.isEqual(i)||(await b1(e.localStore,i),r=i)}),e.persistence.setDatabaseDeletedListener(()=>{Rr("Terminating Firestore due to IndexedDb database deletion"),t.terminate().then(()=>{H("Terminating Firestore due to IndexedDb database deletion completed successfully")}).catch(i=>{Rr("Terminating Firestore due to IndexedDb database deletion failed",i)})}),t._offlineComponents=e}async function rv(t,e){t.asyncQueue.verifyOperationInProgress();const n=await CR(t);H(Mr,"Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(r=>Xy(e.remoteStore,r)),t.setAppCheckTokenChangeListener((r,i)=>Xy(e.remoteStore,i)),t._onlineComponents=e}async function CR(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){H(Mr,"Using user provided OfflineComponentProvider");try{await hd(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!function(i){return i.name==="FirebaseError"?i.code===U.FAILED_PRECONDITION||i.code===U.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(n))throw n;Rr("Error using user provided cache. Falling back to memory cache: "+n),await hd(t,new Eu)}}else H(Mr,"Using default OfflineComponentProvider"),await hd(t,new xR(void 0));return t._offlineComponents}async function Y1(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(H(Mr,"Using user provided OnlineComponentProvider"),await rv(t,t._uninitializedComponentsProvider._online)):(H(Mr,"Using default OnlineComponentProvider"),await rv(t,new Vh))),t._onlineComponents}function bR(t){return Y1(t).then(e=>e.syncEngine)}async function Mh(t){const e=await Y1(t),n=e.eventManager;return n.onListen=hR.bind(null,e.syncEngine),n.onUnlisten=gR.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=fR.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=mR.bind(null,e.syncEngine),n}function AR(t,e,n={}){const r=new Cr;return t.asyncQueue.enqueueAndForget(async()=>function(s,o,l,u,c){const f=new Q1({next:g=>{f.Ou(),o.enqueueAndForget(()=>F1(s,m));const _=g.docs.has(l);!_&&g.fromCache?c.reject(new Y(U.UNAVAILABLE,"Failed to get document because the client is offline.")):_&&g.fromCache&&u&&u.source==="server"?c.reject(new Y(U.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):c.resolve(g)},error:g=>c.reject(g)}),m=new z1(Zu(l.path),f,{includeMetadataChanges:!0,ka:!0});return j1(s,m)}(await Mh(t),t.asyncQueue,e,n,r)),r.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function X1(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iv=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const J1="firestore.googleapis.com",sv=!0;class ov{constructor(e){var n,r;if(e.host===void 0){if(e.ssl!==void 0)throw new Y(U.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=J1,this.ssl=sv}else this.host=e.host,this.ssl=(n=e.ssl)!==null&&n!==void 0?n:sv;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=k1;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<lA)throw new Y(U.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}qC("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=X1((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new Y(U.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new Y(U.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new Y(U.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Tp{constructor(e,n,r,i){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ov({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new Y(U.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new Y(U.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ov(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new MC;switch(r.type){case"firstParty":return new zC(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new Y(U.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const r=iv.get(n);r&&(H("ComponentProvider","Removing Datastore"),iv.delete(n),r.terminate())}(this),Promise.resolve()}}function RR(t,e,n,r={}){var i;t=Hn(t,Tp);const s=xs(e),o=t._getSettings(),l=Object.assign(Object.assign({},o),{emulatorOptions:t._getEmulatorOptions()}),u=`${e}:${n}`;s&&($_(`https://${u}`),W_("Firestore",!0)),o.host!==J1&&o.host!==u&&Rr("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const c=Object.assign(Object.assign({},o),{host:u,ssl:s,emulatorOptions:r});if(!hi(c,l)&&(t._setSettings(c),r.mockUserToken)){let f,m;if(typeof r.mockUserToken=="string")f=r.mockUserToken,m=ft.MOCK_USER;else{f=GI(r.mockUserToken,(i=t._app)===null||i===void 0?void 0:i.options.projectId);const g=r.mockUserToken.sub||r.mockUserToken.user_id;if(!g)throw new Y(U.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");m=new ft(g)}t._authCredentials=new LC(new Fw(f,m))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lc{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new lc(this.firestore,e,this._query)}}class We{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new ra(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new We(this.firestore,e,this._key)}toJSON(){return{type:We._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,n,r){if(ma(n,We._jsonSchema))return new We(e,r||null,new X(be.fromString(n.referencePath)))}}We._jsonSchemaVersion="firestore/documentReference/1.0",We._jsonSchema={type:ze("string",We._jsonSchemaVersion),referencePath:ze("string")};class ra extends lc{constructor(e,n,r){super(e,n,Zu(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new We(this.firestore,null,new X(e))}withConverter(e){return new ra(this.firestore,e,this._path)}}function Wt(t,e,...n){if(t=it(t),arguments.length===1&&(e=Xf.newId()),HC("doc","path",e),t instanceof Tp){const r=be.fromString(e,...n);return wy(r),new We(t,null,new X(r))}{if(!(t instanceof We||t instanceof ra))throw new Y(U.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(be.fromString(e,...n));return wy(r),new We(t.firestore,t instanceof ra?t.converter:null,new X(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const av="AsyncQueue";class lv{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new R1(this,"async_queue_retry"),this.oc=()=>{const r=dd();r&&H(av,"Visibility state changed to "+r.visibilityState),this.F_.y_()},this._c=e;const n=dd();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const n=dd();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise(()=>{});const n=new Cr;return this.uc(()=>this.Xu&&this.rc?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Zu.push(e),this.cc()))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!Ps(e))throw e;H(av,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_(()=>this.cc())}}uc(e){const n=this._c.then(()=>(this.nc=!0,e().catch(r=>{throw this.tc=r,this.nc=!1,Jn("INTERNAL UNHANDLED ERROR: ",uv(r)),r}).then(r=>(this.nc=!1,r))));return this._c=n,n}enqueueAfterDelay(e,n,r){this.ac(),this.sc.indexOf(e)>-1&&(n=0);const i=yp.createAndSchedule(this,e,n,r,s=>this.lc(s));return this.ec.push(i),i}ac(){this.tc&&Z(47125,{hc:uv(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const n of this.ec)if(n.timerId===e)return!0;return!1}Ic(e){return this.Pc().then(()=>{this.ec.sort((n,r)=>n.targetTimeMs-r.targetTimeMs);for(const n of this.ec)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.Pc()})}dc(e){this.sc.push(e)}lc(e){const n=this.ec.indexOf(e);this.ec.splice(n,1)}}function uv(t){let e=t.message||"";return t.stack&&(e=t.stack.includes(t.message)?t.stack:t.message+`
`+t.stack),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cv(t){return function(n,r){if(typeof n!="object"||n===null)return!1;const i=n;for(const s of r)if(s in i&&typeof i[s]=="function")return!0;return!1}(t,["next","error","complete"])}class ws extends Tp{constructor(e,n,r,i){super(e,n,r,i),this.type="firestore",this._queue=new lv,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new lv(e),this._firestoreClient=void 0,await e}}}function PR(t,e){const n=typeof t=="object"?t:jf(),r=typeof t=="string"?t:hu,i=ks(n,"firestore").getImmediate({identifier:r});if(!i._initialized){const s=qI("firestore");s&&RR(i,...s)}return i}function Sp(t){if(t._terminated)throw new Y(U.FAILED_PRECONDITION,"The client has already been terminated.");return t._firestoreClient||DR(t),t._firestoreClient}function DR(t){var e,n,r;const i=t._freezeSettings(),s=function(l,u,c,f){return new rb(l,u,c,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,X1(f.experimentalLongPollingOptions),f.useFetchStreams,f.isUsingEmulator)}(t._databaseId,((e=t._app)===null||e===void 0?void 0:e.options.appId)||"",t._persistenceKey,i);t._componentsProvider||!((n=i.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((r=i.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(t._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),t._firestoreClient=new kR(t._authCredentials,t._appCheckCredentials,t._queue,s,t._componentsProvider&&function(l){const u=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(u),_online:u}}(t._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kt{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Kt(st.fromBase64String(e))}catch(n){throw new Y(U.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Kt(st.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Kt._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(ma(e,Kt._jsonSchema))return Kt.fromBase64String(e.bytes)}}Kt._jsonSchemaVersion="firestore/bytes/1.0",Kt._jsonSchema={type:ze("string",Kt._jsonSchemaVersion),bytes:ze("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ip{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new Y(U.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new tt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z1{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class In{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new Y(U.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new Y(U.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return ne(this._lat,e._lat)||ne(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:In._jsonSchemaVersion}}static fromJSON(e){if(ma(e,In._jsonSchema))return new In(e.latitude,e.longitude)}}In._jsonSchemaVersion="firestore/geoPoint/1.0",In._jsonSchema={type:ze("string",In._jsonSchemaVersion),latitude:ze("number"),longitude:ze("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0}(this._values,e._values)}toJSON(){return{type:xn._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(ma(e,xn._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(n=>typeof n=="number"))return new xn(e.vectorValues);throw new Y(U.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}xn._jsonSchemaVersion="firestore/vectorValue/1.0",xn._jsonSchema={type:ze("string",xn._jsonSchemaVersion),vectorValues:ze("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NR=/^__.*__$/;class OR{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return this.fieldMask!==null?new Ii(e,this.data,this.fieldMask,n,this.fieldTransforms):new ya(e,this.data,n,this.fieldTransforms)}}function eE(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Z(40011,{Ec:t})}}class xp{constructor(e,n,r,i,s,o){this.settings=e,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.Ac(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new xp(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.Rc({path:r,mc:!1});return i.fc(e),i}gc(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.Rc({path:r,mc:!1});return i.Ac(),i}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return Tu(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(e.length===0)throw this.wc("Document fields must not be empty");if(eE(this.Ec)&&NR.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class VR{constructor(e,n,r){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=r||sc(e)}Dc(e,n,r,i=!1){return new xp({Ec:e,methodName:n,bc:r,path:tt.emptyPath(),mc:!1,Sc:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function MR(t){const e=t._freezeSettings(),n=sc(t._databaseId);return new VR(t._databaseId,!!e.ignoreUndefinedProperties,n)}function LR(t,e,n,r,i,s={}){const o=t.Dc(s.merge||s.mergeFields?2:0,e,n,i);iE("Data must be an object, but it was:",o,r);const l=nE(r,o);let u,c;if(s.merge)u=new an(o.fieldMask),c=o.fieldTransforms;else if(s.mergeFields){const f=[];for(const m of s.mergeFields){const g=jR(e,m,n);if(!o.contains(g))throw new Y(U.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);zR(f,g)||f.push(g)}u=new an(f),c=o.fieldTransforms.filter(m=>u.covers(m.field))}else u=null,c=o.fieldTransforms;return new OR(new qt(l),u,c)}function tE(t,e){if(rE(t=it(t)))return iE("Unsupported field value:",e,t),nE(t,e);if(t instanceof Z1)return function(r,i){if(!eE(i.Ec))throw i.wc(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.wc(`${r._methodName}() is not currently supported inside arrays`);const s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.mc&&e.Ec!==4)throw e.wc("Nested arrays are not supported");return function(r,i){const s=[];let o=0;for(const l of r){let u=tE(l,i.yc(o));u==null&&(u={nullValue:"NULL_VALUE"}),s.push(u),o++}return{arrayValue:{values:s}}}(t,e)}return function(r,i){if((r=it(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return Cb(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const s=Se.fromDate(r);return{timestampValue:vu(i.serializer,s)}}if(r instanceof Se){const s=new Se(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:vu(i.serializer,s)}}if(r instanceof In)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Kt)return{bytesValue:_1(i.serializer,r._byteString)};if(r instanceof We){const s=i.databaseId,o=r.firestore._databaseId;if(!o.isEqual(s))throw i.wc(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:lp(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof xn)return function(o,l){return{mapValue:{fields:{[Qw]:{stringValue:Yw},[fu]:{arrayValue:{values:o.toArray().map(c=>{if(typeof c!="number")throw l.wc("VectorValues must only contain numeric values.");return ip(l.serializer,c)})}}}}}}(r,i);throw i.wc(`Unsupported field value: ${Jf(r)}`)}(t,e)}function nE(t,e){const n={};return $w(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Ti(t,(r,i)=>{const s=tE(i,e.Vc(r));s!=null&&(n[r]=s)}),{mapValue:{fields:n}}}function rE(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof Se||t instanceof In||t instanceof Kt||t instanceof We||t instanceof Z1||t instanceof xn)}function iE(t,e,n){if(!rE(n)||!Uw(n)){const r=Jf(n);throw r==="an object"?e.wc(t+" a custom object"):e.wc(t+" "+r)}}function jR(t,e,n){if((e=it(e))instanceof Ip)return e._internalPath;if(typeof e=="string")return sE(t,e);throw Tu("Field path arguments must be of type string or ",t,!1,void 0,n)}const FR=new RegExp("[~\\*/\\[\\]]");function sE(t,e,n){if(e.search(FR)>=0)throw Tu(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new Ip(...e.split("."))._internalPath}catch{throw Tu(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function Tu(t,e,n,r,i){const s=r&&!r.isEmpty(),o=i!==void 0;let l=`Function ${e}() called with invalid data`;n&&(l+=" (via `toFirestore()`)"),l+=". ";let u="";return(s||o)&&(u+=" (found",s&&(u+=` in field ${r}`),o&&(u+=` in document ${i}`),u+=")"),new Y(U.INVALID_ARGUMENT,l+t+u)}function zR(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oE{constructor(e,n,r,i,s){this._firestore=e,this._userDataWriter=n,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new We(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new UR(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(aE("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class UR extends oE{data(){return super.data()}}function aE(t,e){return typeof e=="string"?sE(t,e):e instanceof Ip?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function BR(t){if(t.limitType==="L"&&t.explicitOrderBy.length===0)throw new Y(U.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class $R{convertValue(e,n="none"){switch(Or(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Me(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(Nr(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw Z(62114,{value:e})}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const r={};return Ti(e,(i,s)=>{r[i]=this.convertValue(s,n)}),r}convertVectorValue(e){var n,r,i;const s=(i=(r=(n=e.fields)===null||n===void 0?void 0:n[fu].arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.map(o=>Me(o.doubleValue));return new xn(s)}convertGeoPoint(e){return new In(Me(e.latitude),Me(e.longitude))}convertArray(e,n){return(e.values||[]).map(r=>this.convertValue(r,n))}convertServerTimestamp(e,n){switch(n){case"previous":const r=Xu(e);return r==null?null:this.convertValue(r,n);case"estimate":return this.convertTimestamp(Jo(e));default:return null}}convertTimestamp(e){const n=Dr(e);return new Se(n.seconds,n.nanos)}convertDocumentKey(e,n){const r=be.fromString(e);me(x1(r),9688,{name:e});const i=new Zo(r.get(1),r.get(3)),s=new X(r.popFirst(5));return i.isEqual(n)||Jn(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function WR(t,e,n){let r;return r=t?t.toFirestore(e):e,r}class po{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class oi extends oE{constructor(e,n,r,i,s,o){super(e,n,r,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new Al(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const r=this._document.data.field(aE("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,n.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new Y(U.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,n={};return n.type=oi._jsonSchemaVersion,n.bundle="",n.bundleSource="DocumentSnapshot",n.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?n:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),n.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),n)}}oi._jsonSchemaVersion="firestore/documentSnapshot/1.0",oi._jsonSchema={type:ze("string",oi._jsonSchemaVersion),bundleSource:ze("string","DocumentSnapshot"),bundleName:ze("string"),bundle:ze("string")};class Al extends oi{data(e={}){return super.data(e)}}class is{constructor(e,n,r,i){this._firestore=e,this._userDataWriter=n,this._snapshot=i,this.metadata=new po(i.hasPendingWrites,i.fromCache),this.query=r}get docs(){const e=[];return this.forEach(n=>e.push(n)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach(r=>{e.call(n,new Al(this._firestore,this._userDataWriter,r.key,r,new po(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new Y(U.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(i,s){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map(l=>{const u=new Al(i._firestore,i._userDataWriter,l.doc.key,l.doc,new po(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);return l.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}})}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(l=>s||l.type!==3).map(l=>{const u=new Al(i._firestore,i._userDataWriter,l.doc.key,l.doc,new po(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);let c=-1,f=-1;return l.type!==0&&(c=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),f=o.indexOf(l.doc.key)),{type:HR(l.type),doc:u,oldIndex:c,newIndex:f}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new Y(U.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=is._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Xf.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const n=[],r=[],i=[];return this.docs.forEach(s=>{s._document!==null&&(n.push(s._document),r.push(this._userDataWriter.convertObjectMap(s._document.data.value.mapValue.fields,"previous")),i.push(s.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function HR(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Z(61501,{type:t})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Su(t){t=Hn(t,We);const e=Hn(t.firestore,ws);return AR(Sp(e),t._key).then(n=>cE(e,t,n))}is._jsonSchemaVersion="firestore/querySnapshot/1.0",is._jsonSchema={type:ze("string",is._jsonSchemaVersion),bundleSource:ze("string","QuerySnapshot"),bundleName:ze("string"),bundle:ze("string")};class lE extends $R{constructor(e){super(),this.firestore=e}convertBytes(e){return new Kt(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new We(this.firestore,null,n)}}function fr(t,e,n){t=Hn(t,We);const r=Hn(t.firestore,ws),i=WR(t.converter,e);return uE(r,[LR(MR(r),"setDoc",t._key,i,t.converter!==null,n).toMutation(t._key,Tn.none())])}function qR(t){return uE(Hn(t.firestore,ws),[new sp(t._key,Tn.none())])}function KR(t,...e){var n,r,i;t=it(t);let s={includeMetadataChanges:!1,source:"default"},o=0;typeof e[o]!="object"||cv(e[o])||(s=e[o++]);const l={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(cv(e[o])){const m=e[o];e[o]=(n=m.next)===null||n===void 0?void 0:n.bind(m),e[o+1]=(r=m.error)===null||r===void 0?void 0:r.bind(m),e[o+2]=(i=m.complete)===null||i===void 0?void 0:i.bind(m)}let u,c,f;if(t instanceof We)c=Hn(t.firestore,ws),f=Zu(t._key.path),u={next:m=>{e[o]&&e[o](cE(c,t,m))},error:e[o+1],complete:e[o+2]};else{const m=Hn(t,lc);c=Hn(m.firestore,ws),f=m._query;const g=new lE(c);u={next:_=>{e[o]&&e[o](new is(c,g,m,_))},error:e[o+1],complete:e[o+2]},BR(t._query)}return function(g,_,b,x){const O=new Q1(x),k=new z1(_,O,b);return g.asyncQueue.enqueueAndForget(async()=>j1(await Mh(g),k)),()=>{O.Ou(),g.asyncQueue.enqueueAndForget(async()=>F1(await Mh(g),k))}}(Sp(c),f,l,u)}function uE(t,e){return function(r,i){const s=new Cr;return r.asyncQueue.enqueueAndForget(async()=>yR(await bR(r),i,s)),s.promise}(Sp(t),e)}function cE(t,e,n){const r=n.docs.get(e._key),i=new lE(t);return new oi(t,i,e._key,r,new po(n.hasPendingWrites,n.fromCache),e.converter)}(function(e,n=!0){(function(i){As=i})(Cs),kn(new hn("firestore",(r,{instanceIdentifier:i,options:s})=>{const o=r.getProvider("app").getImmediate(),l=new ws(new jC(r.getProvider("auth-internal")),new UC(o,r.getProvider("app-check-internal")),function(c,f){if(!Object.prototype.hasOwnProperty.apply(c.options,["projectId"]))throw new Y(U.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Zo(c.options.projectId,f)}(o,i),o);return s=Object.assign({useFetchStreams:n},s),l._setSettings(s),l},"PUBLIC").setMultipleInstances(!0)),Yt(gy,my,e),Yt(gy,my,"esm2017")})();const dE="@firebase/installations",kp="0.6.18";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hE=1e4,fE=`w:${kp}`,pE="FIS_v2",GR="https://firebaseinstallations.googleapis.com/v1",QR=60*60*1e3,YR="installations",XR="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const JR={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},yi=new Ei(YR,XR,JR);function gE(t){return t instanceof An&&t.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mE({projectId:t}){return`${GR}/projects/${t}/installations`}function yE(t){return{token:t.token,requestStatus:2,expiresIn:eP(t.expiresIn),creationTime:Date.now()}}async function vE(t,e){const r=(await e.json()).error;return yi.create("request-failed",{requestName:t,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function _E({apiKey:t}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":t})}function ZR(t,{refreshToken:e}){const n=_E(t);return n.append("Authorization",tP(e)),n}async function wE(t){const e=await t();return e.status>=500&&e.status<600?t():e}function eP(t){return Number(t.replace("s","000"))}function tP(t){return`${pE} ${t}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nP({appConfig:t,heartbeatServiceProvider:e},{fid:n}){const r=mE(t),i=_E(t),s=e.getImmediate({optional:!0});if(s){const c=await s.getHeartbeatsHeader();c&&i.append("x-firebase-client",c)}const o={fid:n,authVersion:pE,appId:t.appId,sdkVersion:fE},l={method:"POST",headers:i,body:JSON.stringify(o)},u=await wE(()=>fetch(r,l));if(u.ok){const c=await u.json();return{fid:c.fid||n,registrationStatus:2,refreshToken:c.refreshToken,authToken:yE(c.authToken)}}else throw await vE("Create Installation",u)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function EE(t){return new Promise(e=>{setTimeout(e,t)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rP(t){return btoa(String.fromCharCode(...t)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iP=/^[cdef][\w-]{21}$/,Lh="";function sP(){try{const t=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(t),t[0]=112+t[0]%16;const n=oP(t);return iP.test(n)?n:Lh}catch{return Lh}}function oP(t){return rP(t).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uc(t){return`${t.appName}!${t.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TE=new Map;function SE(t,e){const n=uc(t);IE(n,e),aP(n,e)}function IE(t,e){const n=TE.get(t);if(n)for(const r of n)r(e)}function aP(t,e){const n=lP();n&&n.postMessage({key:t,fid:e}),uP()}let ri=null;function lP(){return!ri&&"BroadcastChannel"in self&&(ri=new BroadcastChannel("[Firebase] FID Change"),ri.onmessage=t=>{IE(t.data.key,t.data.fid)}),ri}function uP(){TE.size===0&&ri&&(ri.close(),ri=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cP="firebase-installations-database",dP=1,vi="firebase-installations-store";let fd=null;function Cp(){return fd||(fd=Hu(cP,dP,{upgrade:(t,e)=>{switch(e){case 0:t.createObjectStore(vi)}}})),fd}async function Iu(t,e){const n=uc(t),i=(await Cp()).transaction(vi,"readwrite"),s=i.objectStore(vi),o=await s.get(n);return await s.put(e,n),await i.done,(!o||o.fid!==e.fid)&&SE(t,e.fid),e}async function xE(t){const e=uc(t),r=(await Cp()).transaction(vi,"readwrite");await r.objectStore(vi).delete(e),await r.done}async function cc(t,e){const n=uc(t),i=(await Cp()).transaction(vi,"readwrite"),s=i.objectStore(vi),o=await s.get(n),l=e(o);return l===void 0?await s.delete(n):await s.put(l,n),await i.done,l&&(!o||o.fid!==l.fid)&&SE(t,l.fid),l}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bp(t){let e;const n=await cc(t.appConfig,r=>{const i=hP(r),s=fP(t,i);return e=s.registrationPromise,s.installationEntry});return n.fid===Lh?{installationEntry:await e}:{installationEntry:n,registrationPromise:e}}function hP(t){const e=t||{fid:sP(),registrationStatus:0};return kE(e)}function fP(t,e){if(e.registrationStatus===0){if(!navigator.onLine){const i=Promise.reject(yi.create("app-offline"));return{installationEntry:e,registrationPromise:i}}const n={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=pP(t,n);return{installationEntry:n,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:gP(t)}:{installationEntry:e}}async function pP(t,e){try{const n=await nP(t,e);return Iu(t.appConfig,n)}catch(n){throw gE(n)&&n.customData.serverCode===409?await xE(t.appConfig):await Iu(t.appConfig,{fid:e.fid,registrationStatus:0}),n}}async function gP(t){let e=await dv(t.appConfig);for(;e.registrationStatus===1;)await EE(100),e=await dv(t.appConfig);if(e.registrationStatus===0){const{installationEntry:n,registrationPromise:r}=await bp(t);return r||n}return e}function dv(t){return cc(t,e=>{if(!e)throw yi.create("installation-not-found");return kE(e)})}function kE(t){return mP(t)?{fid:t.fid,registrationStatus:0}:t}function mP(t){return t.registrationStatus===1&&t.registrationTime+hE<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yP({appConfig:t,heartbeatServiceProvider:e},n){const r=vP(t,n),i=ZR(t,n),s=e.getImmediate({optional:!0});if(s){const c=await s.getHeartbeatsHeader();c&&i.append("x-firebase-client",c)}const o={installation:{sdkVersion:fE,appId:t.appId}},l={method:"POST",headers:i,body:JSON.stringify(o)},u=await wE(()=>fetch(r,l));if(u.ok){const c=await u.json();return yE(c)}else throw await vE("Generate Auth Token",u)}function vP(t,{fid:e}){return`${mE(t)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ap(t,e=!1){let n;const r=await cc(t.appConfig,s=>{if(!CE(s))throw yi.create("not-registered");const o=s.authToken;if(!e&&EP(o))return s;if(o.requestStatus===1)return n=_P(t,e),s;{if(!navigator.onLine)throw yi.create("app-offline");const l=SP(s);return n=wP(t,l),l}});return n?await n:r.authToken}async function _P(t,e){let n=await hv(t.appConfig);for(;n.authToken.requestStatus===1;)await EE(100),n=await hv(t.appConfig);const r=n.authToken;return r.requestStatus===0?Ap(t,e):r}function hv(t){return cc(t,e=>{if(!CE(e))throw yi.create("not-registered");const n=e.authToken;return IP(n)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function wP(t,e){try{const n=await yP(t,e),r=Object.assign(Object.assign({},e),{authToken:n});return await Iu(t.appConfig,r),n}catch(n){if(gE(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await xE(t.appConfig);else{const r=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await Iu(t.appConfig,r)}throw n}}function CE(t){return t!==void 0&&t.registrationStatus===2}function EP(t){return t.requestStatus===2&&!TP(t)}function TP(t){const e=Date.now();return e<t.creationTime||t.creationTime+t.expiresIn<e+QR}function SP(t){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},t),{authToken:e})}function IP(t){return t.requestStatus===1&&t.requestTime+hE<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xP(t){const e=t,{installationEntry:n,registrationPromise:r}=await bp(e);return r?r.catch(console.error):Ap(e).catch(console.error),n.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kP(t,e=!1){const n=t;return await CP(n),(await Ap(n,e)).token}async function CP(t){const{registrationPromise:e}=await bp(t);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bP(t){if(!t||!t.options)throw pd("App Configuration");if(!t.name)throw pd("App Name");const e=["projectId","apiKey","appId"];for(const n of e)if(!t.options[n])throw pd(n);return{appName:t.name,projectId:t.options.projectId,apiKey:t.options.apiKey,appId:t.options.appId}}function pd(t){return yi.create("missing-app-config-values",{valueName:t})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bE="installations",AP="installations-internal",RP=t=>{const e=t.getProvider("app").getImmediate(),n=bP(e),r=ks(e,"heartbeat");return{app:e,appConfig:n,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},PP=t=>{const e=t.getProvider("app").getImmediate(),n=ks(e,bE).getImmediate();return{getId:()=>xP(n),getToken:i=>kP(n,i)}};function DP(){kn(new hn(bE,RP,"PUBLIC")),kn(new hn(AP,PP,"PRIVATE"))}DP();Yt(dE,kp);Yt(dE,kp,"esm2017");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NP="/firebase-messaging-sw.js",OP="/firebase-cloud-messaging-push-scope",AE="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",VP="https://fcmregistrations.googleapis.com/v1",RE="google.c.a.c_id",MP="google.c.a.c_l",LP="google.c.a.ts",jP="google.c.a.e",fv=1e4;var pv;(function(t){t[t.DATA_MESSAGE=1]="DATA_MESSAGE",t[t.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"})(pv||(pv={}));/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */var ia;(function(t){t.PUSH_RECEIVED="push-received",t.NOTIFICATION_CLICKED="notification-clicked"})(ia||(ia={}));/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function On(t){const e=new Uint8Array(t);return btoa(String.fromCharCode(...e)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function FP(t){const e="=".repeat((4-t.length%4)%4),n=(t+e).replace(/\-/g,"+").replace(/_/g,"/"),r=atob(n),i=new Uint8Array(r.length);for(let s=0;s<r.length;++s)i[s]=r.charCodeAt(s);return i}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gd="fcm_token_details_db",zP=5,gv="fcm_token_object_Store";async function UP(t){if("databases"in indexedDB&&!(await indexedDB.databases()).map(s=>s.name).includes(gd))return null;let e=null;return(await Hu(gd,zP,{upgrade:async(r,i,s,o)=>{var l;if(i<2||!r.objectStoreNames.contains(gv))return;const u=o.objectStore(gv),c=await u.index("fcmSenderId").get(t);if(await u.clear(),!!c){if(i===2){const f=c;if(!f.auth||!f.p256dh||!f.endpoint)return;e={token:f.fcmToken,createTime:(l=f.createTime)!==null&&l!==void 0?l:Date.now(),subscriptionOptions:{auth:f.auth,p256dh:f.p256dh,endpoint:f.endpoint,swScope:f.swScope,vapidKey:typeof f.vapidKey=="string"?f.vapidKey:On(f.vapidKey)}}}else if(i===3){const f=c;e={token:f.fcmToken,createTime:f.createTime,subscriptionOptions:{auth:On(f.auth),p256dh:On(f.p256dh),endpoint:f.endpoint,swScope:f.swScope,vapidKey:On(f.vapidKey)}}}else if(i===4){const f=c;e={token:f.fcmToken,createTime:f.createTime,subscriptionOptions:{auth:On(f.auth),p256dh:On(f.p256dh),endpoint:f.endpoint,swScope:f.swScope,vapidKey:On(f.vapidKey)}}}}}})).close(),await id(gd),await id("fcm_vapid_details_db"),await id("undefined"),BP(e)?e:null}function BP(t){if(!t||!t.subscriptionOptions)return!1;const{subscriptionOptions:e}=t;return typeof t.createTime=="number"&&t.createTime>0&&typeof t.token=="string"&&t.token.length>0&&typeof e.auth=="string"&&e.auth.length>0&&typeof e.p256dh=="string"&&e.p256dh.length>0&&typeof e.endpoint=="string"&&e.endpoint.length>0&&typeof e.swScope=="string"&&e.swScope.length>0&&typeof e.vapidKey=="string"&&e.vapidKey.length>0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $P="firebase-messaging-database",WP=1,sa="firebase-messaging-store";let md=null;function PE(){return md||(md=Hu($P,WP,{upgrade:(t,e)=>{switch(e){case 0:t.createObjectStore(sa)}}})),md}async function HP(t){const e=DE(t),r=await(await PE()).transaction(sa).objectStore(sa).get(e);if(r)return r;{const i=await UP(t.appConfig.senderId);if(i)return await Rp(t,i),i}}async function Rp(t,e){const n=DE(t),i=(await PE()).transaction(sa,"readwrite");return await i.objectStore(sa).put(e,n),await i.done,e}function DE({appConfig:t}){return t.appId}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qP={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."},mt=new Ei("messaging","Messaging",qP);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function KP(t,e){const n=await Dp(t),r=NE(e),i={method:"POST",headers:n,body:JSON.stringify(r)};let s;try{s=await(await fetch(Pp(t.appConfig),i)).json()}catch(o){throw mt.create("token-subscribe-failed",{errorInfo:o==null?void 0:o.toString()})}if(s.error){const o=s.error.message;throw mt.create("token-subscribe-failed",{errorInfo:o})}if(!s.token)throw mt.create("token-subscribe-no-token");return s.token}async function GP(t,e){const n=await Dp(t),r=NE(e.subscriptionOptions),i={method:"PATCH",headers:n,body:JSON.stringify(r)};let s;try{s=await(await fetch(`${Pp(t.appConfig)}/${e.token}`,i)).json()}catch(o){throw mt.create("token-update-failed",{errorInfo:o==null?void 0:o.toString()})}if(s.error){const o=s.error.message;throw mt.create("token-update-failed",{errorInfo:o})}if(!s.token)throw mt.create("token-update-no-token");return s.token}async function QP(t,e){const r={method:"DELETE",headers:await Dp(t)};try{const s=await(await fetch(`${Pp(t.appConfig)}/${e}`,r)).json();if(s.error){const o=s.error.message;throw mt.create("token-unsubscribe-failed",{errorInfo:o})}}catch(i){throw mt.create("token-unsubscribe-failed",{errorInfo:i==null?void 0:i.toString()})}}function Pp({projectId:t}){return`${VP}/projects/${t}/registrations`}async function Dp({appConfig:t,installations:e}){const n=await e.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":t.apiKey,"x-goog-firebase-installations-auth":`FIS ${n}`})}function NE({p256dh:t,auth:e,endpoint:n,vapidKey:r}){const i={web:{endpoint:n,auth:e,p256dh:t}};return r!==AE&&(i.web.applicationPubKey=r),i}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const YP=7*24*60*60*1e3;async function XP(t){const e=await ZP(t.swRegistration,t.vapidKey),n={vapidKey:t.vapidKey,swScope:t.swRegistration.scope,endpoint:e.endpoint,auth:On(e.getKey("auth")),p256dh:On(e.getKey("p256dh"))},r=await HP(t.firebaseDependencies);if(r){if(e5(r.subscriptionOptions,n))return Date.now()>=r.createTime+YP?JP(t,{token:r.token,createTime:Date.now(),subscriptionOptions:n}):r.token;try{await QP(t.firebaseDependencies,r.token)}catch(i){console.warn(i)}return mv(t.firebaseDependencies,n)}else return mv(t.firebaseDependencies,n)}async function JP(t,e){try{const n=await GP(t.firebaseDependencies,e),r=Object.assign(Object.assign({},e),{token:n,createTime:Date.now()});return await Rp(t.firebaseDependencies,r),n}catch(n){throw n}}async function mv(t,e){const r={token:await KP(t,e),createTime:Date.now(),subscriptionOptions:e};return await Rp(t,r),r.token}async function ZP(t,e){const n=await t.pushManager.getSubscription();return n||t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:FP(e)})}function e5(t,e){const n=e.vapidKey===t.vapidKey,r=e.endpoint===t.endpoint,i=e.auth===t.auth,s=e.p256dh===t.p256dh;return n&&r&&i&&s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yv(t){const e={from:t.from,collapseKey:t.collapse_key,messageId:t.fcmMessageId};return t5(e,t),n5(e,t),r5(e,t),e}function t5(t,e){if(!e.notification)return;t.notification={};const n=e.notification.title;n&&(t.notification.title=n);const r=e.notification.body;r&&(t.notification.body=r);const i=e.notification.image;i&&(t.notification.image=i);const s=e.notification.icon;s&&(t.notification.icon=s)}function n5(t,e){e.data&&(t.data=e.data)}function r5(t,e){var n,r,i,s,o;if(!e.fcmOptions&&!(!((n=e.notification)===null||n===void 0)&&n.click_action))return;t.fcmOptions={};const l=(i=(r=e.fcmOptions)===null||r===void 0?void 0:r.link)!==null&&i!==void 0?i:(s=e.notification)===null||s===void 0?void 0:s.click_action;l&&(t.fcmOptions.link=l);const u=(o=e.fcmOptions)===null||o===void 0?void 0:o.analytics_label;u&&(t.fcmOptions.analyticsLabel=u)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function i5(t){return typeof t=="object"&&!!t&&RE in t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function s5(t){if(!t||!t.options)throw yd("App Configuration Object");if(!t.name)throw yd("App Name");const e=["projectId","apiKey","appId","messagingSenderId"],{options:n}=t;for(const r of e)if(!n[r])throw yd(r);return{appName:t.name,projectId:n.projectId,apiKey:n.apiKey,appId:n.appId,senderId:n.messagingSenderId}}function yd(t){return mt.create("missing-app-config-values",{valueName:t})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class o5{constructor(e,n,r){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;const i=s5(e);this.firebaseDependencies={app:e,appConfig:i,installations:n,analyticsProvider:r}}_delete(){return Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function a5(t){try{t.swRegistration=await navigator.serviceWorker.register(NP,{scope:OP}),t.swRegistration.update().catch(()=>{}),await l5(t.swRegistration)}catch(e){throw mt.create("failed-service-worker-registration",{browserErrorMessage:e==null?void 0:e.message})}}async function l5(t){return new Promise((e,n)=>{const r=setTimeout(()=>n(new Error(`Service worker not registered after ${fv} ms`)),fv),i=t.installing||t.waiting;t.active?(clearTimeout(r),e()):i?i.onstatechange=s=>{var o;((o=s.target)===null||o===void 0?void 0:o.state)==="activated"&&(i.onstatechange=null,clearTimeout(r),e())}:(clearTimeout(r),n(new Error("No incoming service worker found.")))})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function u5(t,e){if(!e&&!t.swRegistration&&await a5(t),!(!e&&t.swRegistration)){if(!(e instanceof ServiceWorkerRegistration))throw mt.create("invalid-sw-registration");t.swRegistration=e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function c5(t,e){e?t.vapidKey=e:t.vapidKey||(t.vapidKey=AE)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function OE(t,e){if(!navigator)throw mt.create("only-available-in-window");if(Notification.permission==="default"&&await Notification.requestPermission(),Notification.permission!=="granted")throw mt.create("permission-blocked");return await c5(t,e==null?void 0:e.vapidKey),await u5(t,e==null?void 0:e.serviceWorkerRegistration),XP(t)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function d5(t,e,n){const r=h5(e);(await t.firebaseDependencies.analyticsProvider.get()).logEvent(r,{message_id:n[RE],message_name:n[MP],message_time:n[LP],message_device_time:Math.floor(Date.now()/1e3)})}function h5(t){switch(t){case ia.NOTIFICATION_CLICKED:return"notification_open";case ia.PUSH_RECEIVED:return"notification_foreground";default:throw new Error}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function f5(t,e){const n=e.data;if(!n.isFirebaseMessaging)return;t.onMessageHandler&&n.messageType===ia.PUSH_RECEIVED&&(typeof t.onMessageHandler=="function"?t.onMessageHandler(yv(n)):t.onMessageHandler.next(yv(n)));const r=n.data;i5(r)&&r[jP]==="1"&&await d5(t,n.messageType,r)}const vv="@firebase/messaging",_v="0.12.22";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const p5=t=>{const e=new o5(t.getProvider("app").getImmediate(),t.getProvider("installations-internal").getImmediate(),t.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",n=>f5(e,n)),e},g5=t=>{const e=t.getProvider("messaging").getImmediate();return{getToken:r=>OE(e,r)}};function m5(){kn(new hn("messaging",p5,"PUBLIC")),kn(new hn("messaging-internal",g5,"PRIVATE")),Yt(vv,_v),Yt(vv,_v,"esm2017")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function y5(){try{await q_()}catch{return!1}return typeof window<"u"&&H_()&&ix()&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function v5(t,e){if(!navigator)throw mt.create("only-available-in-window");return t.onMessageHandler=e,()=>{t.onMessageHandler=null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _5(t=jf()){return y5().then(e=>{if(!e)throw mt.create("unsupported-browser")},e=>{throw mt.create("indexed-db-unsupported")}),ks(it(t),"messaging").getImmediate()}async function w5(t,e){return t=it(t),OE(t,e)}function E5(t,e){return t=it(t),v5(t,e)}m5();const T5={apiKey:"AIzaSyD_VgKQLA6tLLYDd4wRU5PR4c9DxEdQdUk",authDomain:"maverick-budget.firebaseapp.com",projectId:"maverick-budget",storageBucket:"maverick-budget.firebasestorage.app",messagingSenderId:"891091568658",appId:"1:891091568658:web:5eac14e5ea7945316cb0cb"},Np=Q_(T5),ss=OC(Np),Ht=PR(Np),S5=new Mn;let os=null;try{os=_5(Np)}catch{console.log("FCM not supported in this browser")}async function xu(t,e){var n;if(console.log("[FCM] requestNotificationPermission called",{userId:t,householdId:e,messagingAvailable:!!os}),!os)return null;try{const r=await Notification.requestPermission();if(console.log("[FCM] Permission result:",r),r!=="granted")return null;const i=await navigator.serviceWorker.ready;console.log("[FCM] Service worker ready:",(n=i.active)==null?void 0:n.scriptURL);const s=await w5(os,{vapidKey:"BAl2XBpMegRmgKa-2pTLnydrY7bozRL8geULzkp8IL7RbAHrWuTo7HJ7ukgEBsch7TC5gg7pHkK-nqT0A2oQPtg",serviceWorkerRegistration:i});if(console.log("[FCM] Token received:",s?s.slice(0,20)+"...":"null"),s){const o=`users/${t}/tokens/fcm`;console.log("[FCM] Saving token to Firestore at:",o),await fr(Wt(Ht,"users",t,"tokens","fcm"),{token:s,householdId:e,updatedAt:new Date().toISOString()}),console.log("[FCM] Token saved successfully")}return s}catch(r){return console.error("[FCM] Token error:",r),null}}function I5(t){return os?E5(os,e=>{t(e)}):()=>{}}const Rl={newTransaction:!0,editTransaction:!1,deleteTransaction:!1,budgetUpdate:!1,envelopeAlert:!0};async function x5(t){try{const e=await Su(Wt(Ht,"users",t,"settings","notifications"));return e.exists()?{...Rl,...e.data()}:{...Rl}}catch(e){return console.error("Error loading notification prefs:",e),{...Rl}}}async function k5(t,e){try{await fr(Wt(Ht,"users",t,"settings","notifications"),e)}catch(n){console.error("Error saving notification prefs:",n)}}function C5({userId:t,householdId:e}){const[n,r]=z.useState(null),[i,s]=z.useState(typeof Notification<"u"?Notification.permission:"denied");z.useEffect(()=>{i==="granted"&&t&&e&&xu(t,e)},[t,e,i]),z.useEffect(()=>I5(u=>{var m,g;const c=((m=u.notification)==null?void 0:m.title)||"Maverick Budget",f=((g=u.notification)==null?void 0:g.body)||"Budget updated";r({title:c,body:f}),setTimeout(()=>r(null),4e3)}),[]);const o=async()=>{const l=await xu(t,e);s(l?"granted":Notification.permission)};return h.jsxs(h.Fragment,{children:[i==="default"&&h.jsxs("button",{onClick:o,style:{width:"100%",padding:"10px 16px",marginBottom:12,borderRadius:10,border:"1px solid rgba(99,102,241,0.2)",background:"rgba(99,102,241,0.08)",color:"#818cf8",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:8},children:[h.jsx("span",{style:{fontSize:16},children:"🔔"}),"Enable notifications to see when your partner updates the budget"]}),n&&h.jsxs("div",{style:{position:"fixed",top:50,left:"50%",transform:"translateX(-50%)",maxWidth:380,width:"90%",padding:"12px 16px",borderRadius:14,background:"rgba(15, 22, 41, 0.95)",border:"1px solid rgba(99,102,241,0.2)",backdropFilter:"blur(20px)",zIndex:1e3,animation:"slideIn 0.3s ease",boxShadow:"0 8px 32px rgba(0,0,0,0.4)"},children:[h.jsx("div",{style:{fontSize:13,fontWeight:600,color:"#e2e8f0"},children:n.title}),h.jsx("div",{style:{fontSize:12,color:"#94a3b8",marginTop:2},children:n.body})]})]})}const wv=[{id:"income",label:"Income",icon:"💰",color:"#22c55e"},{id:"housing",label:"Housing",icon:"🏠",color:"#f59e0b"},{id:"food",label:"Food",icon:"🍕",color:"#ef4444"},{id:"transport",label:"Transport",icon:"🚗",color:"#3b82f6"},{id:"utilities",label:"Utilities",icon:"⚡",color:"#8b5cf6"},{id:"entertainment",label:"Fun",icon:"🎮",color:"#ec4899"},{id:"savings",label:"Savings",icon:"🏦",color:"#06b6d4"},{id:"other",label:"Other",icon:"📋",color:"#f97316"}];function VE(t=[]){return[...wv,...t.filter(e=>e.id&&!wv.find(n=>n.id===e.id))]}window.__CUSTOM_CATS__=[];function Lt(){return VE(window.__CUSTOM_CATS__||[])}const b5=["🛒","🏥","👶","🐾","🎓","💪","✈️","🎁","☕","📱","💇","🔧","🏋️","🎵","📚","👗","🧹","💊","🚌","🍔","🎬","💡","🏖️","🛍️"],A5={housing:["rent","mortgage","hoa","property","lease","apartment","housing","landlord","realtor"],food:["grocery","groceries","walmart","costco","kroger","aldi","trader joe","whole foods","safeway","publix","heb","food","restaurant","dining","doordash","uber eats","grubhub","chipotle","mcdonald","starbucks","coffee","pizza","chick-fil-a","wendy","taco bell","panera","subway","lunch","dinner","breakfast"],transport:["gas","shell","exxon","chevron","bp","fuel","uber","lyft","parking","toll","car wash","auto","mechanic","oil change","tire","car payment","car insurance","vehicle","transit","metro","bus pass"],utilities:["electric","electricity","power","water","gas bill","internet","wifi","phone bill","cell phone","verizon","att","t-mobile","sprint","comcast","xfinity","duke energy","utility","sewer","trash","waste"],entertainment:["netflix","hulu","disney","spotify","apple music","youtube","hbo","amazon prime","movie","theater","concert","game","steam","playstation","xbox","nintendo","subscription","fun","entertainment","bowling","arcade","bar","drinks"],savings:["savings","invest","investment","401k","ira","roth","stock","crypto","emergency fund","transfer to savings","deposit"],income:["paycheck","salary","direct deposit","wage","bonus","freelance","commission","refund","reimbursement","dividend","interest","income","side hustle","payment received"]};function R5(t,e=[]){if(!t)return null;const n=t.toLowerCase().trim(),r=e.find(s=>s.label&&s.label.toLowerCase().trim()===n&&s.category&&s.category!=="other");if(r)return r.category;const i=e.find(s=>s.label&&s.category&&s.category!=="other"&&(n.includes(s.label.toLowerCase().trim())||s.label.toLowerCase().trim().includes(n))&&n.length>2);if(i)return i.category;for(const[s,o]of Object.entries(A5))for(const l of o)if(n.includes(l)||l.includes(n))return s;return null}const yn=["#6366f1","#3b82f6","#22c55e","#f59e0b","#ef4444","#ec4899","#8b5cf6","#06b6d4","#14b8a6","#f97316","#a855f7","#64748b"],Pl=[{id:"weekly",label:"Weekly",days:7},{id:"biweekly",label:"Bi-weekly",days:14},{id:"semimonthly",label:"Semi-monthly",days:15},{id:"monthly",label:"Monthly",days:30},{id:"yearly",label:"Yearly",days:365}],ku={midnight:{id:"midnight",name:"Midnight Indigo",bg:"linear-gradient(160deg, #0a0a1a 0%, #0f1629 40%, #0a0a1a 100%)",text:"#e2e8f0",textSub:"#94a3b8",textMuted:"#64748b",textDim:"#475569",textDark:"#334155",accent:"#6366f1",accentLight:"#818cf8",inc:"#22c55e",exp:"#ef4444",card:"linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",cardBorder:"rgba(255,255,255,0.06)",surface:"rgba(255,255,255,0.02)",surfaceHover:"rgba(255,255,255,0.05)",row:"#0d1025",inputBg:"rgba(255,255,255,0.05)",inputBorder:"rgba(255,255,255,0.08)",glow:"radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",titleGrad:"linear-gradient(135deg, #e2e8f0, #94a3b8)",selectBg:"#1a1a2e",font:"'DM Sans', 'Segoe UI', system-ui, sans-serif",mono:"'JetBrains Mono', monospace",fontImport:"https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"},ocean:{id:"ocean",name:"Ocean Depth",bg:"linear-gradient(170deg, #021a1a 0%, #042f2e 40%, #021a1a 100%)",text:"#e0f2f1",textSub:"#80cbc4",textMuted:"#4d7c7a",textDim:"#3d6361",textDark:"#2d4a49",accent:"#0d9488",accentLight:"#14b8a6",inc:"#2dd4bf",exp:"#fb923c",card:"linear-gradient(135deg, rgba(20,184,166,0.06), rgba(20,184,166,0.01))",cardBorder:"rgba(20,184,166,0.12)",surface:"rgba(20,184,166,0.04)",surfaceHover:"rgba(20,184,166,0.08)",row:"#0a2524",inputBg:"rgba(20,184,166,0.06)",inputBorder:"rgba(20,184,166,0.12)",glow:"radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)",titleGrad:"linear-gradient(135deg, #5eead4, #14b8a6)",selectBg:"#0a2524",font:"'Sora', system-ui, sans-serif",mono:"'Fira Code', monospace",fontImport:"https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap"}};function I(){return ku[window.__THEME__||"midnight"]||ku.midnight}function Ln(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function ue(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(t)}function Es(){return new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})}function as(){return new Date().toISOString().slice(0,10)}function P5(t){return t?new Date(t+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"}):Es()}function D5(t,e){return Math.floor((e-t)/864e5)}function xe(t=10){var e;try{(e=navigator.vibrate)==null||e.call(navigator,t)}catch{}}function Ev(t){const e=new Date;let{nodes:n,entries:r,recurrings:i=[],limits:s={}}=t,o=!1;const l=[];return i=i.map(u=>{const c=Pl.find(g=>g.id===u.frequency);if(!c)return u;const f=u.lastRun?new Date(u.lastRun):new Date(0),m=D5(f,e);if(m>=c.days){for(let g=0;g<Math.floor(m/c.days);g++)l.push({id:Ln(),nodeId:u.nodeId,label:u.label+" (auto)",amount:u.amount,category:u.category,type:u.type,date:Es(),dateISO:as(),recurring:!0,tags:[]});return o=!0,{...u,lastRun:e.toISOString()}}return u}),o?{nodes:n,entries:[...r,...l],recurrings:i,limits:s}:{...t,recurrings:t.recurrings||[],limits:t.limits||{}}}function N5(t,e){const n=[["Date","Label","Category","Type","Amount","Tags"]];t.forEach(l=>{const u=Lt().find(c=>c.id===l.category);n.push([l.date,l.label,(u==null?void 0:u.label)||l.category,l.type,l.type==="income"?l.amount:-l.amount,(l.tags||[]).join(";")])});const r=n.map(l=>l.map(u=>`"${String(u).replace(/"/g,'""')}"`).join(",")).join(`
`),i=new Blob([r],{type:"text/csv"}),s=URL.createObjectURL(i),o=document.createElement("a");o.href=s,o.download=`${e||"maverick"}-export.csv`,o.click(),URL.revokeObjectURL(s)}function O5(t){const e=t.trim().split(`
`).map(n=>{const r=[];let i="",s=!1;for(let o=0;o<n.length;o++){const l=n[o];l==='"'?s=!s:l===","&&!s?(r.push(i.trim()),i=""):i+=l}return r.push(i.trim()),r});return e.length<2?[]:e.slice(1).map(n=>{const r=Math.abs(parseFloat(n[4])||0),i=parseFloat(n[4])>=0?"income":"expense",s=(n[2]||"").toLowerCase(),o=Lt().find(u=>u.label.toLowerCase()===s)||{id:"other"},l=n[5]?n[5].split(";").filter(Boolean):[];return{label:n[1]||"(imported)",category:i==="income"?"income":o.id,type:i,amount:r,date:n[0]||Es(),tags:l}}).filter(n=>n.amount>0)}const V5={nodes:[],entries:[],recurrings:[],limits:{},customCategories:[],envelopes:{}};function M5(t,e){const[n,r]=z.useState(V5),[i,s]=z.useState(!1),o=z.useRef(null),l=z.useRef(!1),u=e?Wt(Ht,"households",e,"data","budget"):null;z.useEffect(()=>{window.__CUSTOM_CATS__=n.customCategories||[]},[n]),z.useEffect(()=>u?KR(u,_=>{if(l.current){l.current=!1;return}if(_.exists()){const b=_.data();r(Ev({nodes:b.nodes||[],entries:b.entries||[],recurrings:b.recurrings||[],limits:b.limits||{},customCategories:b.customCategories||[],envelopes:b.envelopes||{}}))}s(!0)},()=>{try{const _=localStorage.getItem("maverick-budget-data");_&&r(Ev(JSON.parse(_)))}catch{}s(!0)}):void 0,[e]);const c=z.useCallback(g=>{try{localStorage.setItem("maverick-budget-data",JSON.stringify(g))}catch{}o.current&&clearTimeout(o.current),o.current=setTimeout(()=>{u&&(l.current=!0,fr(u,{...g,updatedAt:new Date().toISOString(),updatedBy:(t==null?void 0:t.email)||"unknown"}).catch(_=>console.error("Save:",_)))},500)},[u,t]),f=g=>r(_=>{const b=g(_);return c(b),b}),m=z.useCallback((g,_)=>{const b=g.filter(O=>O.parentId===_);let x=b.map(O=>O.id);return b.forEach(O=>{x=x.concat(m(g,O.id))}),x},[]);return{d:n,synced:i,cats:VE(n.customCategories),addNode:z.useCallback(g=>f(_=>({..._,nodes:[..._.nodes,g]})),[]),updateNode:z.useCallback((g,_)=>f(b=>({...b,nodes:b.nodes.map(x=>x.id===g?{...x,..._}:x)})),[]),removeNode:z.useCallback(g=>f(_=>{const b=[g,...m(_.nodes,g)];return{..._,nodes:_.nodes.filter(x=>!b.includes(x.id)),entries:_.entries.filter(x=>!b.includes(x.nodeId)),recurrings:(_.recurrings||[]).filter(x=>!b.includes(x.nodeId))}}),[m]),reorderNodes:z.useCallback((g,_)=>f(b=>{const x=b.nodes.filter(k=>k.parentId!==g),O=_.map(k=>b.nodes.find(E=>E.id===k)).filter(Boolean);return{...b,nodes:[...x,...O]}}),[]),addEntry:z.useCallback(g=>f(_=>({..._,entries:[..._.entries,g]})),[]),updateEntry:z.useCallback((g,_)=>f(b=>({...b,entries:b.entries.map(x=>x.id===g?{...x,..._}:x)})),[]),removeEntry:z.useCallback(g=>f(_=>({..._,entries:_.entries.filter(b=>b.id!==g)})),[]),reorderEntries:z.useCallback((g,_)=>f(b=>{const x=b.entries.filter(k=>k.nodeId!==g),O=_.map(k=>b.entries.find(E=>E.id===k)).filter(Boolean);return{...b,entries:[...x,...O]}}),[]),addRecurring:z.useCallback(g=>f(_=>({..._,recurrings:[..._.recurrings||[],g]})),[]),updateRecurring:z.useCallback((g,_)=>f(b=>({...b,recurrings:(b.recurrings||[]).map(x=>x.id===g?{...x,..._}:x)})),[]),removeRecurring:z.useCallback(g=>f(_=>({..._,recurrings:(_.recurrings||[]).filter(b=>b.id!==g)})),[]),setLimit:z.useCallback((g,_)=>f(b=>({...b,limits:{...b.limits||{},[g]:_}})),[]),removeLimit:z.useCallback(g=>f(_=>{const b={..._.limits||{}};return delete b[g],{..._,limits:b}}),[]),addCategory:z.useCallback(g=>f(_=>({..._,customCategories:[..._.customCategories||[],g]})),[]),removeCategory:z.useCallback(g=>f(_=>({..._,customCategories:(_.customCategories||[]).filter(b=>b.id!==g)})),[]),setEnvelope:z.useCallback((g,_)=>f(b=>({...b,envelopes:{...b.envelopes||{},[g]:_}})),[]),removeEnvelope:z.useCallback(g=>f(_=>{const b={..._.envelopes||{}};return delete b[g],{..._,envelopes:b}}),[]),getDesc:m}}function Cu(t,e,n){const r=e.filter(o=>o.nodeId===n);let i=r.filter(o=>o.type==="income").reduce((o,l)=>o+l.amount,0),s=r.filter(o=>o.type==="expense").reduce((o,l)=>o+l.amount,0);return t.filter(o=>o.parentId===n).forEach(o=>{const l=Cu(t,e,o.id);i+=l.inc,s+=l.exp}),{inc:i,exp:s,balance:i-s}}function ME(t,e,n){let r=e.filter(i=>i.nodeId===n);return t.filter(i=>i.parentId===n).forEach(i=>{r=r.concat(ME(t,e,i.id))}),r}function Tv({color:t="#f59e0b",size:e=20}){return h.jsx("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:h.jsx("path",{d:"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"})})}function L5({color:t="#94a3b8",size:e=20}){return h.jsxs("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[h.jsx("path",{d:"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"}),h.jsx("line",{x1:"12",y1:"11",x2:"12",y2:"17"}),h.jsx("line",{x1:"9",y1:"14",x2:"15",y2:"14"})]})}function jh({children:t}){return h.jsx("div",{style:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,padding:"12px 20px 20px",background:`linear-gradient(to top, ${I().bg.includes("#0a0a1a")?"#0a0a1a":"#021a1a"} 60%, transparent)`,display:"flex",gap:10,zIndex:10},children:t})}function go({onClick:t,bg:e,color:n,children:r}){return h.jsx("button",{onClick:t,style:{flex:1,padding:"12px 0",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,letterSpacing:"0.03em",background:e,color:n,transition:"all 0.2s"},children:r})}function Fh({text:t,sub:e}){return h.jsxs("div",{style:{textAlign:"center",padding:"40px 0",color:"#334155"},children:[h.jsx("div",{style:{fontSize:32,marginBottom:8},children:"◇"}),h.jsx("div",{style:{fontSize:13},children:t}),e&&h.jsx("div",{style:{fontSize:11,marginTop:4,color:"#1e293b"},children:e})]})}function j5({value:t}){const[e,n]=z.useState(t),r=z.useRef();return z.useEffect(()=>{const i=e,s=t;if(i===s)return;const o=performance.now();function l(u){const c=Math.min((u-o)/400,1);n(i+(s-i)*(1-Math.pow(1-c,3))),c<1&&(r.current=requestAnimationFrame(l))}return r.current=requestAnimationFrame(l),()=>cancelAnimationFrame(r.current)},[t]),h.jsx("span",{children:ue(e)})}function zh({placeholder:t,onCommit:e,onCancel:n,accentColor:r,icon:i}){const s=z.useRef(null);z.useEffect(()=>{var l;(l=s.current)==null||l.focus()},[]);const o=()=>{var u,c;const l=(c=(u=s.current)==null?void 0:u.value)==null?void 0:c.trim();l?e(l):n()};return h.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"rgba(255,255,255,0.04)",borderRadius:12,borderLeft:`4px solid ${r}`,animation:"slideIn 0.2s ease"},children:[i,h.jsx("input",{ref:s,placeholder:t,onKeyDown:l=>{l.key==="Enter"&&o(),l.key==="Escape"&&n()},style:{flex:1,background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.1)",padding:"6px 2px",color:I().text,fontSize:15,outline:"none"}}),h.jsx("button",{onClick:o,style:{background:r,border:"none",borderRadius:6,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",flexShrink:0},children:"✓"})]})}function F5({value:t,onSave:e,style:n}){const[r,i]=z.useState(!1),s=z.useRef(null);z.useEffect(()=>{var l;r&&((l=s.current)==null||l.focus())},[r]);const o=()=>{var u,c;const l=(c=(u=s.current)==null?void 0:u.value)==null?void 0:c.trim();l&&l!==t&&e(l),i(!1)};return r?h.jsx("input",{ref:s,defaultValue:t,onBlur:o,onKeyDown:l=>{l.key==="Enter"&&o(),l.key==="Escape"&&i(!1)},style:{...n,background:"rgba(255,255,255,0.06)",border:"none",borderBottom:"1px solid rgba(255,255,255,0.2)",borderRadius:0,padding:"2px 4px",outline:"none",minWidth:0,width:"100%"}}):h.jsx("h2",{onClick:()=>i(!0),title:"Tap to rename",style:{...n,cursor:"text",borderBottom:"1px dashed rgba(255,255,255,0.15)"},children:t})}function z5({value:t,onChange:e}){return h.jsxs("div",{style:{position:"relative",marginBottom:12},children:[h.jsx("span",{style:{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#475569",fontSize:14},children:"⌕"}),h.jsx("input",{value:t,onChange:n=>e(n.target.value),placeholder:"Search transactions...",style:{width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"8px 10px 8px 30px",color:I().text,fontSize:13,outline:"none"}}),t&&h.jsx("button",{onClick:()=>e(""),style:{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:I().textMuted,cursor:"pointer",fontSize:14,padding:2},children:"×"})]})}function U5({value:t,onChange:e}){const[n,r]=z.useState(!1);return h.jsxs("div",{style:{position:"relative"},children:[h.jsx("button",{onClick:()=>r(!n),style:{width:26,height:26,borderRadius:6,background:t,border:"2px solid rgba(255,255,255,0.15)",cursor:"pointer",flexShrink:0}}),n&&h.jsx("div",{style:{position:"absolute",top:32,right:0,background:"#1a1a2e",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:8,display:"flex",flexWrap:"wrap",gap:6,width:140,zIndex:20,animation:"slideIn 0.15s ease"},children:yn.map(i=>h.jsx("button",{onClick:()=>{e(i),r(!1)},style:{width:22,height:22,borderRadius:5,background:i,border:i===t?"2px solid #fff":"2px solid transparent",cursor:"pointer",padding:0}},i))})]})}function Dl({items:t,renderItem:e,onReorder:n}){const[r,i]=z.useState(null),[s,o]=z.useState(null),[l,u]=z.useState(0),c=z.useRef(null),f=z.useRef([]),m=z.useRef([]),g=z.useRef(0),_=z.useRef(0),b=z.useRef(0),x=z.useRef(!1),O=()=>{m.current=f.current.map(F=>{var D;return((D=F==null?void 0:F.getBoundingClientRect())==null?void 0:D.height)||56})},k=(F,D)=>{O(),g.current=F.touches[0].clientY,_.current=D,b.current=D,x.current=!0,o(D),u(0),i(t.map((S,v)=>v)),xe(10)},E=F=>{if(!x.current||s===null)return;F.preventDefault();const S=F.touches[0].clientY-g.current;u(S);let v=0,T=_.current;if(S>0)for(let C=_.current+1;C<t.length&&(v+=m.current[C],S>v-m.current[C]/2);C++)T=C;else for(let C=_.current-1;C>=0&&(v-=m.current[C],S<v+m.current[C]/2);C--)T=C;if(T!==b.current){b.current=T,xe(3);const C=t.map((R,w)=>w),[P]=C.splice(_.current,1);C.splice(T,0,P),i(C)}},A=()=>{if(x.current){if(x.current=!1,r&&b.current!==_.current){const F=r.map(D=>t[D].id);n(F),xe(12)}window.__DRAG_ENDED__=Date.now(),o(null),u(0),i(null)}},V=F=>{if(s===null||!r||F===_.current)return 0;const v=r.indexOf(F)-F;return v===0?0:v*(m.current[_.current]||56)};return h.jsx("div",{ref:c,style:{display:"flex",flexDirection:"column",gap:8,position:"relative"},onTouchMove:E,onTouchEnd:A,onTouchCancel:A,children:t.map((F,D)=>{const S=s===D,v=S?l:V(D);return h.jsx("div",{ref:T=>f.current[D]=T,style:{transform:`translateY(${v}px)${S?" scale(1.02)":""}`,transition:S?"none":"transform 0.25s cubic-bezier(0.2, 0, 0, 1)",zIndex:S?50:1,opacity:S?.9:1,boxShadow:S?"0 8px 30px rgba(0,0,0,0.4)":"none",borderRadius:12,position:"relative"},children:e(F,D,T=>k(T,D))},F.id)})})}function B5({children:t}){const e=z.useRef(null),[n,r]=z.useState(!1);return z.useEffect(()=>{const i=()=>{e.current&&r(e.current.scrollHeight>e.current.clientHeight)};i();const s=new ResizeObserver(i);e.current&&s.observe(e.current);const o=new MutationObserver(i);return e.current&&o.observe(e.current,{childList:!0,subtree:!0}),()=>{s.disconnect(),o.disconnect()}},[]),h.jsx("div",{ref:e,style:{height:"100vh",overflowY:n?"auto":"hidden",WebkitOverflowScrolling:"touch",overscrollBehavior:"none"},children:t})}function $5({tags:t=[],onChange:e}){const[n,r]=z.useState(""),i=s=>{const o=s.trim().toLowerCase();o&&!t.includes(o)&&(e([...t,o]),xe(5)),r("")};return h.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:4,alignItems:"center",paddingLeft:34},children:[h.jsx("span",{style:{fontSize:11,color:I().textMuted},children:"Tags:"}),t.map(s=>h.jsxs("span",{onClick:()=>e(t.filter(o=>o!==s)),style:{fontSize:10,background:"rgba(99,102,241,0.2)",color:I().accentLight,borderRadius:4,padding:"2px 6px",cursor:"pointer"},children:[s," ×"]},s)),h.jsx("input",{value:n,onChange:s=>r(s.target.value),onKeyDown:s=>{(s.key==="Enter"||s.key===",")&&(s.preventDefault(),i(n))},placeholder:"add tag",style:{background:"transparent",border:"none",color:I().text,fontSize:11,outline:"none",width:60,padding:"2px 0"}})]})}function W5({entries:t}){const e={};t.forEach(i=>{const s=i.dateISO?i.dateISO.slice(0,7):"unknown";s!=="unknown"&&(e[s]||(e[s]={inc:0,exp:0}),i.type==="income"?e[s].inc+=i.amount:e[s].exp+=i.amount)});const n=Object.entries(e).sort((i,s)=>i[0].localeCompare(s[0])).slice(-6);if(n.length<2)return null;const r=Math.max(...n.map(([,i])=>Math.max(i.inc,i.exp)),1);return h.jsxs("div",{style:{background:I().surface,border:"1px solid rgba(255,255,255,0.05)",borderRadius:14,padding:16,marginBottom:12},children:[h.jsx("div",{style:{fontSize:12,color:I().textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10},children:"Monthly Trends"}),h.jsx("div",{style:{display:"flex",alignItems:"flex-end",gap:6,height:80},children:n.map(([i,s])=>{const o=new Date(i+"-15").toLocaleDateString("en-US",{month:"short"}),l=s.inc/r*70,u=s.exp/r*70;return h.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2},children:[h.jsxs("div",{style:{display:"flex",gap:2,alignItems:"flex-end",height:70},children:[h.jsx("div",{style:{width:8,height:Math.max(2,l),background:"#22c55e",borderRadius:2}}),h.jsx("div",{style:{width:8,height:Math.max(2,u),background:"#ef4444",borderRadius:2}})]}),h.jsx("span",{style:{fontSize:9,color:I().textMuted},children:o})]},i)})}),h.jsxs("div",{style:{display:"flex",gap:12,marginTop:8,justifyContent:"center"},children:[h.jsxs("span",{style:{fontSize:9,color:I().textMuted},children:[h.jsx("span",{style:{display:"inline-block",width:8,height:8,background:"#22c55e",borderRadius:2,marginRight:4,verticalAlign:"middle"}}),"Income"]}),h.jsxs("span",{style:{fontSize:9,color:I().textMuted},children:[h.jsx("span",{style:{display:"inline-block",width:8,height:8,background:"#ef4444",borderRadius:2,marginRight:4,verticalAlign:"middle"}}),"Expenses"]})]})]})}function H5({entries:t}){const e=new Date().getFullYear(),n=t.filter(u=>u.dateISO&&u.dateISO.startsWith(String(e)));if(n.length<3)return null;const r=n.filter(u=>u.type==="income").reduce((u,c)=>u+c.amount,0),i=n.filter(u=>u.type==="expense").reduce((u,c)=>u+c.amount,0),s=Lt().filter(u=>u.id!=="income").map(u=>({...u,total:n.filter(c=>c.category===u.id&&c.type==="expense").reduce((c,f)=>c+f.amount,0)})).filter(u=>u.total>0).sort((u,c)=>c.total-u.total).slice(0,3),o=new Set(n.map(u=>u.dateISO.slice(0,7))),l=o.size>0?i/o.size:0;return h.jsxs("div",{style:{background:I().surface,border:"1px solid rgba(255,255,255,0.05)",borderRadius:14,padding:16,marginBottom:12},children:[h.jsxs("div",{style:{fontSize:12,color:I().textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10},children:[e," Summary"]}),h.jsxs("div",{style:{display:"flex",gap:16,marginBottom:10},children:[h.jsxs("div",{children:[h.jsx("div",{style:{fontSize:9,color:I().textMuted,textTransform:"uppercase"},children:"Income"}),h.jsxs("div",{style:{fontSize:14,fontWeight:600,color:I().inc,fontFamily:I().mono},children:["+",ue(r)]})]}),h.jsxs("div",{children:[h.jsx("div",{style:{fontSize:9,color:I().textMuted,textTransform:"uppercase"},children:"Spent"}),h.jsxs("div",{style:{fontSize:14,fontWeight:600,color:I().exp,fontFamily:I().mono},children:["−",ue(i)]})]}),h.jsxs("div",{children:[h.jsx("div",{style:{fontSize:9,color:I().textMuted,textTransform:"uppercase"},children:"Avg/mo"}),h.jsx("div",{style:{fontSize:14,fontWeight:600,color:I().textSub,fontFamily:I().mono},children:ue(l)})]})]}),s.length>0&&h.jsxs("div",{children:[h.jsx("div",{style:{fontSize:10,color:"#475569",marginBottom:4},children:"Top categories:"}),s.map(u=>h.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,fontSize:11,color:I().textSub,marginBottom:2},children:[h.jsx("span",{style:{color:u.color},children:u.icon})," ",h.jsx("span",{children:u.label}),h.jsx("span",{style:{fontFamily:I().mono,color:I().textMuted,marginLeft:"auto"},children:ue(u.total)})]},u.id))]})]})}function q5({nodeId:t,entries:e,limits:n}){const r=[];return Lt().filter(i=>i.id!=="income").forEach(i=>{const s=`${t}-${i.id}`,o=n[s];if(!o||o<=0)return;const l=e.filter(c=>c.nodeId===t&&c.category===i.id&&c.type==="expense").reduce((c,f)=>c+f.amount,0),u=l/o*100;u>=100?r.push({cat:i,pct:u,spent:l,lim:o,type:"over"}):u>=80&&r.push({cat:i,pct:u,spent:l,lim:o,type:"warning"})}),r.length?h.jsx("div",{style:{display:"flex",flexDirection:"column",gap:6,marginBottom:12},children:r.map(i=>h.jsxs("div",{style:{padding:"8px 12px",borderRadius:8,fontSize:12,fontWeight:500,background:i.type==="over"?"rgba(239,68,68,0.12)":"rgba(245,158,11,0.12)",color:i.type==="over"?"#ef4444":"#f59e0b",border:`1px solid ${i.type==="over"?"rgba(239,68,68,0.2)":"rgba(245,158,11,0.2)"}`},children:[i.type==="over"?"⚠ ":"⚡ ",h.jsx("strong",{children:i.cat.label}),": ",ue(i.spent)," of ",ue(i.lim)," (",Math.round(i.pct),"%)",i.type==="over"?" — over budget!":" — nearing limit"]},i.cat.id))}):null}function K5({nodeId:t,recurrings:e,onAdd:n,onUpdate:r,onRemove:i,onAddEntry:s}){const[o,l]=z.useState(!1),[u,c]=z.useState(null),[f,m]=z.useState({label:"",amount:"",category:"other",type:"expense",frequency:"monthly"}),g=(e||[]).filter(x=>x.nodeId===t),_=()=>{const x=parseFloat(f.amount);if(!f.label.trim()||!x||x<=0)return;const O=f.type==="income"?"income":f.category;n({id:Ln(),nodeId:t,label:f.label.trim(),amount:x,category:O,type:f.type,frequency:f.frequency,lastRun:new Date().toISOString()}),s({id:Ln(),nodeId:t,label:f.label.trim(),amount:x,category:O,type:f.type,date:Es(),dateISO:as(),recurring:!0,tags:[]}),m({label:"",amount:"",category:"other",type:"expense",frequency:"monthly"}),l(!1),xe()},b=({r:x})=>{const O=Lt().find(D=>D.id===x.category)||{label:"Other",icon:"📋",color:"#f97316"},k=Pl.find(D=>D.id===x.frequency),E=u===x.id,[A,V]=z.useState({label:x.label,amount:String(x.amount),category:x.category,type:x.type,frequency:x.frequency}),F=()=>{const D=parseFloat(A.amount);if(!A.label.trim()||!D){c(null);return}r(x.id,{label:A.label.trim(),amount:D,category:A.type==="income"?"income":A.category,type:A.type,frequency:A.frequency}),c(null),xe()};return E?h.jsxs("div",{style:{padding:10,background:"rgba(255,255,255,0.04)",borderRadius:8,borderLeft:`3px solid ${O.color}`,display:"flex",flexDirection:"column",gap:6,animation:"slideIn 0.15s ease"},children:[h.jsx("div",{style:{display:"flex",gap:6},children:["expense","income"].map(D=>h.jsx("button",{onClick:()=>V({...A,type:D}),style:{flex:1,padding:"5px 0",borderRadius:6,border:"none",cursor:"pointer",fontSize:10,fontWeight:600,textTransform:"uppercase",background:A.type===D?D==="income"?"#22c55e":"#ef4444":"rgba(255,255,255,0.05)",color:A.type===D?"#0a0a1a":"#94a3b8"},children:D},D))}),h.jsx("input",{value:A.label,onChange:D=>V({...A,label:D.target.value}),placeholder:"Label",style:{background:I().inputBg,border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,padding:"5px 8px",color:I().text,fontSize:12,outline:"none"}}),h.jsxs("div",{style:{display:"flex",gap:6},children:[h.jsxs("div",{style:{position:"relative",flex:1},children:[h.jsx("span",{style:{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",color:I().textMuted,fontSize:11,fontFamily:I().mono},children:"$"}),h.jsx("input",{value:A.amount,onChange:D=>V({...A,amount:D.target.value.replace(/[^0-9.]/g,"")}),placeholder:"0.00",style:{width:"100%",boxSizing:"border-box",background:I().inputBg,border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,padding:"5px 8px 5px 20px",color:I().text,fontSize:12,fontFamily:I().mono,outline:"none"}})]}),h.jsx("select",{value:A.frequency,onChange:D=>V({...A,frequency:D.target.value}),style:{background:I().inputBg,border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,padding:"5px 6px",color:I().text,fontSize:11,outline:"none"},children:Pl.map(D=>h.jsx("option",{value:D.id,children:D.label},D.id))})]}),A.type==="expense"&&h.jsx("select",{value:A.category,onChange:D=>V({...A,category:D.target.value}),style:{background:I().inputBg,border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,padding:"5px 6px",color:I().text,fontSize:11,outline:"none"},children:Lt().filter(D=>D.id!=="income").map(D=>h.jsxs("option",{value:D.id,children:[D.icon," ",D.label]},D.id))}),h.jsxs("div",{style:{display:"flex",gap:6},children:[h.jsx("button",{onClick:F,style:{flex:1,padding:"7px 0",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:I().accent,color:"#fff"},children:"Save"}),h.jsx("button",{onClick:()=>c(null),style:{padding:"7px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,color:I().textSub,background:I().inputBg},children:"Cancel"}),h.jsx("button",{onClick:()=>{i(x.id),c(null),xe()},style:{padding:"7px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,color:"#ef4444",background:"rgba(239,68,68,0.1)"},children:"Delete"})]})]}):h.jsxs("div",{onClick:()=>c(x.id),style:{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:I().surface,borderRadius:8,borderLeft:`3px solid ${O.color}`,cursor:"pointer",transition:"background 0.15s"},onMouseEnter:D=>D.currentTarget.style.background="rgba(255,255,255,0.06)",onMouseLeave:D=>D.currentTarget.style.background="rgba(255,255,255,0.03)",children:[h.jsx("span",{style:{fontSize:14},children:O.icon}),h.jsxs("div",{style:{flex:1,minWidth:0},children:[h.jsx("div",{style:{fontSize:13,color:I().text,fontWeight:500},children:x.label}),h.jsxs("div",{style:{fontSize:10,color:I().textMuted},children:[k==null?void 0:k.label," · ",x.type==="income"?"Income":O.label]})]}),h.jsxs("span",{style:{fontSize:13,fontFamily:I().mono,fontWeight:600,color:x.type==="income"?"#22c55e":"#f1f5f9"},children:[x.type==="income"?"+":"−",ue(x.amount)]}),h.jsx("span",{style:{fontSize:10,color:"#475569"},children:"✎"})]})};return h.jsxs("div",{children:[h.jsxs("div",{style:{fontSize:12,color:I().textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8},children:["Recurring (",g.length,")"]}),g.length===0&&!o&&h.jsx("div",{style:{fontSize:12,color:"#334155",marginBottom:8},children:"No recurring transactions"}),h.jsx("div",{style:{display:"flex",flexDirection:"column",gap:6},children:g.map(x=>h.jsx(b,{r:x},x.id))}),o?h.jsxs("div",{style:{marginTop:8,padding:12,background:I().surface,borderRadius:10,display:"flex",flexDirection:"column",gap:8,animation:"slideIn 0.2s ease"},children:[h.jsx("div",{style:{display:"flex",gap:6},children:["expense","income"].map(x=>h.jsx("button",{onClick:()=>m({...f,type:x}),style:{flex:1,padding:"6px 0",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,textTransform:"uppercase",background:f.type===x?x==="income"?"#22c55e":"#ef4444":"rgba(255,255,255,0.05)",color:f.type===x?"#0a0a1a":"#94a3b8"},children:x},x))}),h.jsx("input",{value:f.label,onChange:x=>m({...f,label:x.target.value}),placeholder:"Label",style:{background:I().inputBg,border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,padding:"6px 10px",color:I().text,fontSize:13,outline:"none"}}),h.jsxs("div",{style:{display:"flex",gap:6},children:[h.jsxs("div",{style:{position:"relative",flex:1},children:[h.jsx("span",{style:{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",color:I().textMuted,fontSize:12,fontFamily:I().mono},children:"$"}),h.jsx("input",{value:f.amount,onChange:x=>m({...f,amount:x.target.value.replace(/[^0-9.]/g,"")}),placeholder:"0.00",style:{width:"100%",boxSizing:"border-box",background:I().inputBg,border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,padding:"6px 10px 6px 22px",color:I().text,fontSize:13,fontFamily:I().mono,outline:"none"}})]}),h.jsx("select",{value:f.frequency,onChange:x=>m({...f,frequency:x.target.value}),style:{background:I().inputBg,border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,padding:"6px 8px",color:I().text,fontSize:12,outline:"none"},children:Pl.map(x=>h.jsx("option",{value:x.id,children:x.label},x.id))})]}),f.type==="expense"&&h.jsx("select",{value:f.category,onChange:x=>m({...f,category:x.target.value}),style:{background:I().inputBg,border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,padding:"6px 8px",color:I().text,fontSize:12,outline:"none"},children:Lt().filter(x=>x.id!=="income").map(x=>h.jsxs("option",{value:x.id,children:[x.icon," ",x.label]},x.id))}),h.jsxs("div",{style:{display:"flex",gap:6},children:[h.jsx("button",{onClick:_,style:{flex:1,padding:"8px 0",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:I().accent,color:"#fff"},children:"Add Recurring"}),h.jsx("button",{onClick:()=>l(!1),style:{padding:"8px 12px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,color:I().textSub,background:I().inputBg},children:"Cancel"})]})]}):h.jsx("button",{onClick:()=>l(!0),style:{marginTop:8,padding:"8px 0",width:"100%",borderRadius:8,border:"1px dashed rgba(255,255,255,0.1)",background:"transparent",color:I().textMuted,fontSize:12,cursor:"pointer"},children:"+ Add recurring"})]})}function G5({nodeId:t,entries:e,limits:n,setLimit:r,removeLimit:i}){const s=Lt().filter(l=>l.id!=="income"),o=e.filter(l=>l.nodeId===t&&l.type==="expense");return h.jsxs("div",{children:[h.jsx("div",{style:{fontSize:12,color:I().textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8},children:"Category Limits"}),h.jsx("div",{style:{display:"flex",flexDirection:"column",gap:6},children:s.map(l=>{const u=`${t}-${l.id}`,c=n[u]||0,f=o.filter(b=>b.category===l.id).reduce((b,x)=>b+x.amount,0),m=c>0?Math.min(f/c*100,100):0,g=c>0&&f>c,_=m>=80&&!g;return h.jsxs("div",{children:[h.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:2},children:[h.jsx("span",{style:{fontSize:13,width:22,textAlign:"center",color:l.color},children:l.icon}),h.jsx("span",{style:{fontSize:11,color:I().textSub,flex:1},children:l.label}),h.jsxs("span",{style:{fontSize:10,fontFamily:I().mono,color:I().textMuted},children:["Spent: ",ue(f)]}),h.jsxs("div",{style:{position:"relative",width:64},children:[h.jsx("span",{style:{position:"absolute",left:6,top:"50%",transform:"translateY(-50%)",color:"#475569",fontSize:10,fontFamily:I().mono},children:"$"}),h.jsx("input",{type:"number",min:"0",step:"50",value:c||"",onChange:b=>{const x=parseFloat(b.target.value)||0;x>0?r(u,x):i(u)},placeholder:"Limit",style:{width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:6,padding:"4px 6px 4px 18px",color:I().text,fontSize:11,fontFamily:I().mono,outline:"none",textAlign:"right"}})]})]}),c>0&&h.jsx("div",{style:{height:6,background:"#1a1a2e",borderRadius:3,overflow:"hidden"},children:h.jsx("div",{style:{width:`${m}%`,height:"100%",background:g?"#ef4444":_?"#f59e0b":l.color,borderRadius:3,transition:"width 0.5s ease"}})})]},l.id)})})]})}function Q5({customCategories:t=[],onAdd:e,onRemove:n}){const[r,i]=z.useState(!1),[s,o]=z.useState({label:"",icon:"●",color:I().accent}),l=()=>{const u=s.label.trim();if(!u)return;const c=u.toLowerCase().replace(/[^a-z0-9]/g,"_")+"_"+Date.now().toString(36).slice(-3);e({id:c,label:u,icon:s.icon,color:s.color}),o({label:"",icon:"●",color:I().accent}),i(!1),xe()};return h.jsxs("div",{children:[h.jsxs("div",{style:{fontSize:12,color:I().textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8},children:["Custom Categories (",t.length,")"]}),t.length===0&&!r&&h.jsx("div",{style:{fontSize:12,color:"#334155",marginBottom:8},children:"Default categories only"}),h.jsx("div",{style:{display:"flex",flexDirection:"column",gap:4},children:t.map(u=>h.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:I().surface,borderRadius:8,borderLeft:`3px solid ${u.color}`},children:[h.jsx("span",{style:{fontSize:14},children:u.icon}),h.jsx("span",{style:{fontSize:12,color:I().text,flex:1},children:u.label}),h.jsx("button",{onClick:()=>{n(u.id),xe()},style:{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:12,padding:"2px 4px"},onMouseEnter:c=>c.currentTarget.style.color="#ef4444",onMouseLeave:c=>c.currentTarget.style.color="#475569",children:"×"})]},u.id))}),r?h.jsxs("div",{style:{marginTop:6,padding:10,background:I().surface,borderRadius:10,display:"flex",flexDirection:"column",gap:8,animation:"slideIn 0.15s ease"},children:[h.jsx("input",{value:s.label,onChange:u=>o({...s,label:u.target.value}),placeholder:"Category name",style:{background:I().inputBg,border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,padding:"6px 10px",color:I().text,fontSize:13,outline:"none"}}),h.jsxs("div",{style:{display:"flex",gap:6,alignItems:"center"},children:[h.jsx("span",{style:{fontSize:11,color:I().textMuted},children:"Icon:"}),h.jsx("div",{style:{display:"flex",gap:3,flexWrap:"wrap",flex:1},children:b5.slice(0,12).map(u=>h.jsx("button",{onClick:()=>o({...s,icon:u}),style:{width:26,height:26,borderRadius:5,border:s.icon===u?"2px solid #818cf8":"1px solid rgba(255,255,255,0.08)",background:s.icon===u?"rgba(99,102,241,0.15)":"rgba(255,255,255,0.03)",color:I().text,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",padding:0},children:u},u))})]}),h.jsxs("div",{style:{display:"flex",gap:3,alignItems:"center"},children:[h.jsx("span",{style:{fontSize:11,color:I().textMuted},children:"Color:"}),yn.map(u=>h.jsx("button",{onClick:()=>o({...s,color:u}),style:{width:20,height:20,borderRadius:4,background:u,border:s.color===u?"2px solid #fff":"2px solid transparent",cursor:"pointer",padding:0}},u))]}),h.jsxs("div",{style:{display:"flex",gap:6},children:[h.jsx("button",{onClick:l,style:{flex:1,padding:"7px 0",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:I().accent,color:"#fff"},children:"Add Category"}),h.jsx("button",{onClick:()=>i(!1),style:{padding:"7px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,color:I().textSub,background:I().inputBg},children:"Cancel"})]})]}):h.jsx("button",{onClick:()=>i(!0),style:{marginTop:6,padding:"7px 0",width:"100%",borderRadius:8,border:"1px dashed rgba(255,255,255,0.1)",background:"transparent",color:I().textMuted,fontSize:11,cursor:"pointer"},children:"+ Add custom category"})]})}function Y5({entry:t,runningBalance:e,onUpdate:n,onRemove:r,onDuplicate:i,isEditing:s,onStartEdit:o,onStopEdit:l,onDragHandle:u,allEntries:c}){var P;const f=Lt().find(R=>R.id===t.category)||{label:"Other",icon:"📋",color:"#f97316"},m=t.type==="income",g=z.useRef(null),_=z.useRef(null),b=z.useRef(null),x=z.useRef(null),[O,k]=z.useState(0),[E,A]=z.useState(!1),V=z.useRef({x:0,y:0}),F=R=>{V.current={x:R.touches[0].clientX,y:R.touches[0].clientY},A(!1)},D=R=>{const w=R.touches[0].clientX-V.current.x,ae=R.touches[0].clientY-V.current.y;Math.abs(w)>Math.abs(ae)&&w<0?(A(!0),k(Math.max(w,-160)),R.preventDefault()):Math.abs(w)>Math.abs(ae)&&w>0&&O<0&&(A(!0),k(Math.min(O+w,0)),R.preventDefault())},S=()=>{O<-60?k(-160):k(0),A(!1)};z.useEffect(()=>{s&&setTimeout(()=>{var R,w;(R=g.current)==null||R.focus(),(w=b.current)==null||w.scrollIntoView({behavior:"smooth",block:"center"})},100)},[s]);const v=()=>{var ae,ce;if(m||t.category&&t.category!=="other")return;const R=(ce=(ae=g.current)==null?void 0:ae.value)==null?void 0:ce.trim();if(!R)return;const w=R5(R,c||[]);w&&w!=="income"&&w!=="other"&&n(t.id,{category:w})},T=()=>{var ce,Oe,Q,B;const R=(Oe=(ce=g.current)==null?void 0:ce.value)==null?void 0:Oe.trim(),w=parseFloat((Q=_.current)==null?void 0:Q.value),ae=(B=x.current)==null?void 0:B.value;if(!R&&(!w||w===0))r(t.id);else{const G={label:R||"(untitled)",amount:w||0};ae&&(G.dateISO=ae,G.date=P5(ae)),v(),n(t.id,G)}xe(),l()},C=R=>{R.key==="Enter"&&(R.target===g.current&&_.current?_.current.focus():T()),R.key==="Escape"&&(!t.label&&t.amount===0?r(t.id):l())};return s?h.jsxs("div",{ref:b,style:{display:"flex",flexDirection:"column",gap:6,padding:"8px 10px",background:I().inputBg,borderRadius:10,animation:"slideIn 0.2s ease"},children:[h.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6},children:[h.jsx("span",{style:{fontSize:18,width:28,textAlign:"center",color:m?"#22c55e":f.color},children:m?"↑":f.icon}),h.jsx("input",{ref:g,defaultValue:t.label,placeholder:m?"e.g. Salary":"e.g. Groceries",onKeyDown:C,onBlur:v,style:{flex:1,minWidth:0,background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.1)",padding:"4px 2px",color:I().text,fontSize:14,outline:"none"}}),h.jsxs("div",{style:{position:"relative",width:90},children:[h.jsx("span",{style:{position:"absolute",left:4,top:"50%",transform:"translateY(-50%)",color:I().textMuted,fontSize:12,fontFamily:I().mono},children:"$"}),h.jsx("input",{ref:_,defaultValue:t.amount||"",placeholder:"0.00",inputMode:"decimal",onKeyDown:C,style:{width:"100%",boxSizing:"border-box",background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.1)",padding:"4px 2px 4px 16px",color:m?I().inc:I().exp,fontSize:14,fontFamily:I().mono,outline:"none",textAlign:"right"}})]}),h.jsx("button",{onClick:T,style:{background:m?"#22c55e":"#6366f1",border:"none",borderRadius:6,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",color:m?"#0a0a1a":"#fff",fontSize:14,fontWeight:700,cursor:"pointer",flexShrink:0},children:"✓"})]}),h.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,paddingLeft:34,flexWrap:"wrap"},children:[h.jsx("span",{style:{fontSize:11,color:I().textMuted},children:"Date:"}),h.jsx("input",{ref:x,type:"date",defaultValue:t.dateISO||as(),style:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,padding:"3px 8px",color:I().text,fontSize:12,outline:"none",colorScheme:"dark"}}),!m&&h.jsxs(h.Fragment,{children:[h.jsx("span",{style:{fontSize:11,color:I().textMuted,marginLeft:4},children:"Category:"}),h.jsx("select",{defaultValue:t.category,onChange:R=>n(t.id,{category:R.target.value}),style:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,padding:"3px 8px",color:I().text,fontSize:12,outline:"none",cursor:"pointer",colorScheme:"dark"},children:Lt().filter(R=>R.id!=="income").map(R=>h.jsxs("option",{value:R.id,children:[R.icon," ",R.label]},R.id))})]})]}),h.jsx($5,{tags:t.tags||[],onChange:R=>n(t.id,{tags:R})})]}):h.jsxs("div",{style:{position:"relative",overflow:"hidden",borderRadius:10},children:[h.jsxs("div",{style:{position:"absolute",right:0,top:0,bottom:0,width:160,display:"flex",borderRadius:"0 10px 10px 0"},children:[h.jsx("button",{onClick:()=>{i(t),xe(),k(0)},style:{flex:1,background:I().accent,border:"none",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4},children:"❐ Copy"}),h.jsx("button",{onClick:()=>{r(t.id),xe(15)},style:{flex:1,background:"#ef4444",border:"none",borderRadius:"0 10px 10px 0",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},children:"Delete"})]}),h.jsxs("div",{onTouchStart:F,onTouchMove:D,onTouchEnd:S,onClick:()=>{if(!(window.__DRAG_ENDED__&&Date.now()-window.__DRAG_ENDED__<300)){if(O<0){k(0);return}!E&&O===0&&o(t.id)}},style:{display:"flex",alignItems:"center",gap:8,padding:"10px 10px 10px 6px",background:I().row,borderRadius:10,transition:E?"none":"transform 0.2s ease",transform:`translateX(${O}px)`,cursor:"pointer",position:"relative",zIndex:1},children:[h.jsx("div",{onTouchStart:u,style:{cursor:"grab",color:I().textDark,fontSize:14,padding:"12px 10px",margin:"-10px -4px -10px -6px",touchAction:"none",userSelect:"none",flexShrink:0},children:"⠿"}),h.jsx("span",{style:{fontSize:16,width:24,textAlign:"center",opacity:.7,flexShrink:0},children:f.icon}),h.jsxs("div",{style:{flex:1,minWidth:0},children:[h.jsxs("div",{style:{fontSize:14,fontWeight:500,color:I().text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:[t.label||"(untitled)",t.recurring&&h.jsx("span",{style:{fontSize:9,color:I().accent,marginLeft:6,fontWeight:600},children:"↻"})]}),h.jsxs("div",{style:{fontSize:11,color:I().textMuted,marginTop:1},children:[f.label," · ",t.date,((P=t.tags)==null?void 0:P.length)>0&&h.jsx("span",{style:{marginLeft:4,color:I().accentLight},children:t.tags.map(R=>`#${R}`).join(" ")})]})]}),h.jsxs("div",{style:{textAlign:"right",flexShrink:0},children:[h.jsxs("div",{style:{fontFamily:I().mono,fontWeight:600,fontSize:14,color:m?I().inc:I().exp},children:[m?"+":"−",ue(Math.abs(t.amount))]}),e!==void 0&&h.jsx("div",{style:{fontFamily:I().mono,fontSize:10,color:e>=0?`${I().inc}80`:`${I().exp}80`,marginTop:1},children:ue(e)})]})]})]})}function X5({entries:t}){const e=t.filter(u=>u.type==="expense"),n=Lt().filter(u=>u.id!=="income").map(u=>({...u,total:e.filter(c=>c.category===u.id).reduce((c,f)=>c+f.amount,0)})).filter(u=>u.total>0).sort((u,c)=>c.total-u.total),r=n.reduce((u,c)=>u+c.total,0);if(r===0)return h.jsx("div",{style:{textAlign:"center",padding:20,color:"#475569",fontSize:13},children:"No expenses yet"});const i=38,s=2*Math.PI*i;let o=0;const l=n.map(u=>{const c=u.total/r,f={...u,da:`${c*s} ${s}`,doff:-o};return o+=c*s,f});return h.jsxs("div",{style:{display:"flex",alignItems:"center",gap:16},children:[h.jsxs("svg",{width:100,height:100,viewBox:"0 0 100 100",children:[l.map((u,c)=>h.jsx("circle",{cx:50,cy:50,r:i,fill:"none",stroke:u.color,strokeWidth:14,strokeDasharray:u.da,strokeDashoffset:u.doff,transform:"rotate(-90 50 50)"},c)),h.jsx("text",{x:"50",y:"48",textAnchor:"middle",fill:"#e2e8f0",fontSize:"11",fontWeight:"700",fontFamily:"'JetBrains Mono', monospace",children:ue(r).replace(".00","")}),h.jsx("text",{x:"50",y:"60",textAnchor:"middle",fill:"#64748b",fontSize:"7",children:"spent"})]}),h.jsx("div",{style:{display:"flex",flexDirection:"column",gap:4},children:n.map(u=>h.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,fontSize:11,color:I().textSub},children:[h.jsx("div",{style:{width:8,height:8,borderRadius:2,background:u.color,flexShrink:0}}),h.jsx("span",{children:u.label}),h.jsx("span",{style:{color:I().textMuted,fontFamily:I().mono},children:ue(u.total)}),h.jsxs("span",{style:{color:"#475569",fontFamily:I().mono,fontSize:10},children:[Math.round(u.total/r*100),"%"]})]},u.id))})]})}function LE(t){return t<60?I().inc:t<85?"#f59e0b":I().exp}function J5(){const t=new Date;return new Date(t.getFullYear(),t.getMonth()+1,0).getDate()-t.getDate()}function Z5(){return new Date().getDate()}function e4(){const t=new Date;return new Date(t.getFullYear(),t.getMonth()+1,0).getDate()}function Sv({title:t,count:e,defaultOpen:n,children:r}){const[i,s]=z.useState(n??!1);return h.jsxs("div",{children:[h.jsxs("button",{onClick:()=>s(!i),style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",background:"none",border:"none",cursor:"pointer",padding:"8px 0",marginBottom:i?8:0},children:[h.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6},children:[h.jsx("span",{style:{fontSize:11,color:I().textDim,transition:"transform 0.2s",transform:i?"rotate(90deg)":"rotate(0deg)",display:"inline-block"},children:"▶"}),h.jsx("span",{style:{fontSize:12,color:I().textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em"},children:t}),e!==void 0&&h.jsxs("span",{style:{fontSize:10,color:I().textDim,fontFamily:I().mono},children:["(",e,")"]})]}),h.jsx("span",{style:{fontSize:10,color:I().textDim},children:i?"Hide":"Show"})]}),i&&h.jsx("div",{style:{animation:"slideIn 0.2s ease"},children:r})]})}function t4({amount:t,target:e}){return h.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.15)",borderRadius:8,marginTop:10},children:[h.jsx("span",{style:{fontSize:12},children:"✓"}),h.jsxs("span",{style:{fontSize:11,color:I().inc,fontWeight:600},children:[ue(t)," → ",e]}),h.jsx("span",{style:{fontSize:10,color:I().textMuted,marginLeft:"auto"},children:"Rolled forward"})]})}function n4({name:t,amount:e,target:n,onConfirm:r,onCancel:i}){return h.jsxs("div",{style:{background:"linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",border:`1px solid ${I().cardBorder}`,borderRadius:14,padding:"16px 18px",marginTop:10,animation:"slideIn 0.2s ease"},children:[h.jsxs("div",{style:{fontSize:13,color:I().text,fontWeight:600,marginBottom:8},children:["Roll forward to ",n,"?"]}),h.jsxs("div",{style:{fontSize:12,color:I().textMuted,marginBottom:12,lineHeight:1.5},children:["This will add ",h.jsx("span",{style:{color:I().inc,fontWeight:600,fontFamily:I().mono},children:ue(e)})," from"," ",h.jsx("span",{style:{color:I().text,fontWeight:500},children:t})," to ",n,"'s envelope as rollover."]}),h.jsxs("div",{style:{display:"flex",gap:8},children:[h.jsxs("button",{onClick:r,style:{flex:1,padding:"10px 0",borderRadius:8,border:"none",background:I().inc,color:"#0a0a1a",fontSize:12,fontWeight:700,cursor:"pointer"},children:["Roll ",ue(e)," → ",n]}),h.jsx("button",{onClick:i,style:{padding:"10px 16px",borderRadius:8,border:`1px solid ${I().cardBorder}`,background:"transparent",color:I().textMuted,fontSize:12,fontWeight:600,cursor:"pointer"},children:"Cancel"})]})]})}function r4({childNodes:t,envelopes:e,entries:n,parentName:r}){const i=t.map(u=>{const c=e[u.id];if(!c||!c.cap)return null;const f=n.filter(m=>m.nodeId===u.id&&m.type==="expense").reduce((m,g)=>m+g.amount,0);return{...c,name:u.name,color:u.color||"#6366f1",spent:f,nodeId:u.id}}).filter(Boolean);if(i.length===0)return null;const s=i.reduce((u,c)=>u+c.cap+(c.rollover||0),0),o=i.reduce((u,c)=>u+c.spent,0),l=s-o;return h.jsxs("div",{style:{background:"linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",border:`1px solid ${I().cardBorder}`,borderRadius:16,padding:"14px 16px",marginBottom:14},children:[h.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10},children:[h.jsxs("div",{style:{fontSize:10,color:I().textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.12em"},children:["Envelopes · ",r]}),h.jsxs("div",{style:{fontSize:13,fontWeight:700,fontFamily:I().mono,color:l>=0?I().inc:I().exp},children:[ue(Math.abs(l))," ",h.jsx("span",{style:{fontSize:10,fontWeight:500,color:I().textMuted},children:l>=0?"left":"over"})]})]}),h.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8},children:i.map((u,c)=>{const f=u.cap+(u.rollover||0),m=Math.min(u.spent/f*100,100),g=f-u.spent,_=u.spent>f,b=!!u.rolledTo;return h.jsxs("div",{children:[h.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3},children:[h.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6},children:[h.jsx("div",{style:{width:8,height:8,borderRadius:2,background:u.color,flexShrink:0}}),h.jsx("span",{style:{fontSize:12,color:I().text,fontWeight:500},children:u.name}),b&&h.jsxs("span",{style:{fontSize:9,color:I().inc,fontWeight:600,background:"rgba(34,197,94,0.1)",padding:"1px 5px",borderRadius:4},children:["✓ ",ue(u.rolledAmount)," rolled"]}),!b&&h.jsxs("span",{style:{fontSize:9,color:I().textDim,fontFamily:I().mono},children:[ue(u.spent)," / ",ue(f)]})]}),h.jsxs("span",{style:{fontSize:11,fontFamily:I().mono,fontWeight:600,color:_?I().exp:I().textSub},children:[_?"−":"",ue(Math.abs(g))]})]}),h.jsx("div",{style:{height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"},children:h.jsx("div",{style:{height:"100%",width:`${m}%`,background:b?I().textDim:LE(m),borderRadius:3,transition:"width 0.4s ease",opacity:b?.5:1}})})]},u.nodeId)})})]})}function i4({node:t,envelope:e,entries:n,nodes:r,parentName:i,setEnvelope:s,onEdit:o,allEnvelopes:l}){const u=e||{},c=u.cap||0,f=u.rollover||0,m=c+f,g=n.filter(B=>B.nodeId===t.id&&B.type==="expense").reduce((B,G)=>B+G.amount,0),_=m-g,b=m>0?Math.min(g/m*100,100):0,x=LE(b),O=g>m,k=!!u.rolledTo,E=J5(),A=Z5(),V=e4(),F=_>0&&E>0?(_/E).toFixed(2):"0.00",D=_>0&&!k&&c>0,S=t.color||"#6366f1",[v,T]=z.useState(!1),[C,P]=z.useState(!1),[R,w]=z.useState(String(c||"")),ce=D?(()=>{const B=r.find(ve=>ve.id===t.parentId);if(!B)return null;const G=r.find(ve=>ve.id===B.parentId);if(!G)return null;const K=r.filter(ve=>ve.parentId===G.id),fe=K.findIndex(ve=>ve.id===B.id);if(fe<0||fe>=K.length-1)return null;const de=K[fe+1],ge=r.find(ve=>ve.parentId===de.id&&ve.name===t.name);return ge?{node:ge,monthName:de.name}:null})():null,Oe=()=>{if(!ce)return;s(t.id,{...u,rolledTo:ce.node.id,rolledAmount:_});const B=(l||{})[ce.node.id]||{};s(ce.node.id,{cap:B.cap||u.cap,rollover:(B.rollover||0)+_,rolloverFrom:t.id,rolledTo:B.rolledTo||null,rolledAmount:B.rolledAmount||0}),T(!1)},Q=()=>{const B=parseFloat(R);B>0&&s(t.id,{...e||{},cap:B,rollover:u.rollover||0,rolloverFrom:u.rolloverFrom||null,rolledTo:u.rolledTo||null,rolledAmount:u.rolledAmount||0}),P(!1)};return!c||c<=0?h.jsx("div",{style:{background:"linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",border:`1px dashed ${I().cardBorder}`,borderRadius:16,padding:"16px 18px",marginBottom:12,borderTop:`3px solid ${S}`},children:C?h.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:8,animation:"slideIn 0.2s ease"},children:[h.jsx("div",{style:{fontSize:12,color:I().text,fontWeight:600},children:"Monthly envelope cap"}),h.jsxs("div",{style:{display:"flex",gap:8},children:[h.jsxs("div",{style:{position:"relative",flex:1},children:[h.jsx("span",{style:{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:I().textMuted,fontSize:14,fontFamily:I().mono},children:"$"}),h.jsx("input",{value:R,onChange:B=>w(B.target.value.replace(/[^0-9.]/g,"")),placeholder:"0.00",inputMode:"decimal",style:{width:"100%",boxSizing:"border-box",background:I().inputBg,border:`1px solid ${I().inputBorder}`,borderRadius:8,padding:"10px 10px 10px 24px",color:I().text,fontSize:14,fontFamily:I().mono,outline:"none"}})]}),h.jsx("button",{onClick:Q,style:{padding:"10px 16px",borderRadius:8,border:"none",background:I().accent,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"},children:"Set"}),h.jsx("button",{onClick:()=>P(!1),style:{padding:"10px 12px",borderRadius:8,border:`1px solid ${I().cardBorder}`,background:"transparent",color:I().textMuted,fontSize:12,cursor:"pointer"},children:"Cancel"})]})]}):h.jsxs("div",{style:{textAlign:"center"},children:[h.jsx("div",{style:{fontSize:12,color:I().textMuted,marginBottom:8},children:"No envelope set for this budget"}),h.jsx("button",{onClick:()=>P(!0),style:{padding:"10px 20px",borderRadius:8,border:`1px dashed ${I().accent}40`,background:`${I().accent}10`,color:I().accentLight,fontSize:12,fontWeight:600,cursor:"pointer"},children:"+ Set Envelope Budget"})]})}):h.jsxs("div",{style:{background:"linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",border:`1px solid ${I().cardBorder}`,borderRadius:16,padding:"16px 18px",marginBottom:12,borderTop:`3px solid ${S}`,opacity:k?.75:1},children:[h.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12},children:[h.jsxs("div",{children:[h.jsxs("div",{style:{fontSize:10,color:I().textMuted,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:600,marginBottom:2},children:["Envelope · ",i]}),h.jsxs("div",{style:{fontSize:26,fontWeight:700,fontFamily:I().mono,color:O?I().exp:I().inc,letterSpacing:"-0.02em"},children:[O?"−":"",ue(Math.abs(_)),h.jsx("span",{style:{fontSize:12,fontWeight:500,color:I().textMuted,marginLeft:6},children:O?"over budget":"remaining"})]})]}),h.jsx("button",{onClick:o,style:{background:`${I().accent}15`,border:`1px solid ${I().accent}30`,borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:10,fontWeight:600,color:I().accentLight},children:"✎ Edit"})]}),h.jsxs("div",{style:{height:8,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden",marginBottom:10,position:"relative"},children:[h.jsx("div",{style:{height:"100%",width:`${b}%`,background:k?I().textDim:`linear-gradient(90deg, ${x}cc, ${x})`,borderRadius:4,opacity:k?.5:1}}),h.jsx("div",{style:{position:"absolute",left:`${A/V*100}%`,top:-2,bottom:-2,width:2,background:"rgba(255,255,255,0.3)",borderRadius:1}})]}),h.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[h.jsxs("div",{children:[h.jsx("div",{style:{fontSize:9,color:I().textMuted,textTransform:"uppercase",letterSpacing:"0.1em"},children:"Budget"}),h.jsx("div",{style:{fontSize:13,fontWeight:600,color:I().text,fontFamily:I().mono,marginTop:1},children:ue(c)})]}),f>0&&h.jsxs("div",{children:[h.jsx("div",{style:{fontSize:9,color:I().textMuted,textTransform:"uppercase",letterSpacing:"0.1em"},children:"Rollover"}),h.jsxs("div",{style:{fontSize:13,fontWeight:600,color:I().accentLight,fontFamily:I().mono,marginTop:1},children:["+",ue(f)]})]}),h.jsxs("div",{children:[h.jsx("div",{style:{fontSize:9,color:I().textMuted,textTransform:"uppercase",letterSpacing:"0.1em"},children:"Spent"}),h.jsx("div",{style:{fontSize:13,fontWeight:600,color:I().exp,fontFamily:I().mono,marginTop:1},children:ue(g)})]}),!k&&!O&&h.jsxs("div",{children:[h.jsx("div",{style:{fontSize:9,color:I().textMuted,textTransform:"uppercase",letterSpacing:"0.1em"},children:"Per Day"}),h.jsxs("div",{style:{fontSize:13,fontWeight:600,color:I().textSub,fontFamily:I().mono,marginTop:1},children:["$",F]})]})]}),k&&h.jsx(t4,{amount:u.rolledAmount,target:ce?ce.monthName:"Next month"}),D&&ce&&!v&&h.jsxs("button",{onClick:()=>T(!0),style:{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",marginTop:12,padding:"10px 0",borderRadius:8,border:"1px dashed rgba(34,197,94,0.3)",background:"rgba(34,197,94,0.04)",color:I().inc,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.2s"},children:[h.jsxs("span",{children:["Roll forward ",ue(_)," → ",ce.monthName]}),h.jsx("span",{style:{fontSize:14},children:"→"})]}),O&&!k&&h.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",marginTop:10,background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.12)",borderRadius:8},children:[h.jsx("span",{style:{fontSize:12},children:"⚠"}),h.jsxs("span",{style:{fontSize:11,color:I().exp,fontWeight:500},children:["Overspent — next month starts fresh at ",ue(c)]})]}),v&&ce&&h.jsx(n4,{name:t.name,amount:_,target:ce.monthName,onConfirm:Oe,onCancel:()=>T(!1)})]})}function s4({nodeId:t,envelope:e,setEnvelope:n,removeEnvelope:r}){const i=e||{},[s,o]=z.useState(!1),[l,u]=z.useState(String(i.cap||"")),c=()=>{const f=parseFloat(l);f>0?n(t,{cap:f,rollover:i.rollover||0,rolloverFrom:i.rolloverFrom||null,rolledTo:i.rolledTo||null,rolledAmount:i.rolledAmount||0}):r(t),o(!1)};return h.jsxs("div",{children:[h.jsx("div",{style:{fontSize:12,color:I().textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8},children:"Envelope Budget"}),i.cap>0&&!s?h.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:I().surface,borderRadius:10,border:`1px solid ${I().cardBorder}`},children:[h.jsxs("div",{children:[h.jsxs("div",{style:{fontSize:13,color:I().text,fontWeight:600},children:["Monthly cap: ",h.jsx("span",{style:{fontFamily:I().mono,color:I().inc},children:ue(i.cap)})]}),i.rollover>0&&h.jsxs("div",{style:{fontSize:11,color:I().accentLight,marginTop:2},children:["+ ",ue(i.rollover)," rollover"]})]}),h.jsxs("div",{style:{display:"flex",gap:6},children:[h.jsx("button",{onClick:()=>{u(String(i.cap)),o(!0)},style:{padding:"5px 10px",borderRadius:6,border:`1px solid ${I().accent}30`,background:`${I().accent}10`,color:I().accentLight,fontSize:11,fontWeight:600,cursor:"pointer"},children:"Edit"}),h.jsx("button",{onClick:()=>{r(t),xe()},style:{padding:"5px 10px",borderRadius:6,border:"1px solid rgba(239,68,68,0.2)",background:"rgba(239,68,68,0.06)",color:"#ef4444",fontSize:11,fontWeight:600,cursor:"pointer"},children:"Remove"})]})]}):s||!i.cap?h.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center"},children:[h.jsxs("div",{style:{position:"relative",flex:1},children:[h.jsx("span",{style:{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:I().textMuted,fontSize:13,fontFamily:I().mono},children:"$"}),h.jsx("input",{value:l,onChange:f=>u(f.target.value.replace(/[^0-9.]/g,"")),placeholder:"Monthly cap",inputMode:"decimal",style:{width:"100%",boxSizing:"border-box",background:I().inputBg,border:`1px solid ${I().inputBorder}`,borderRadius:8,padding:"8px 10px 8px 24px",color:I().text,fontSize:13,fontFamily:I().mono,outline:"none"}})]}),h.jsx("button",{onClick:c,style:{padding:"8px 14px",borderRadius:8,border:"none",background:I().accent,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"},children:i.cap>0?"Update":"Set Cap"}),s&&h.jsx("button",{onClick:()=>o(!1),style:{padding:"8px 10px",borderRadius:8,border:`1px solid ${I().cardBorder}`,background:"transparent",color:I().textMuted,fontSize:12,cursor:"pointer"},children:"Cancel"})]}):null]})}function o4({node:t,parentName:e,nodes:n,entries:r,recurrings:i,limits:s,customCategories:o,envelopes:l,onBack:u,onNavigate:c,addNode:f,updateNode:m,removeNode:g,reorderNodes:_,addEntry:b,updateEntry:x,removeEntry:O,reorderEntries:k,addRecurring:E,updateRecurring:A,removeRecurring:V,setLimit:F,removeLimit:D,addCategory:S,removeCategory:v,setEnvelope:T,removeEnvelope:C,getDesc:P}){const[R,w]=z.useState(!1),[ae,ce]=z.useState(null),[Oe,Q]=z.useState(""),[B,G]=z.useState("overview"),[K,fe]=z.useState(!1),de=z.useRef(null),ge=n.filter(j=>j.parentId===t.id),ve=K?ge:ge.filter(j=>!j.archived),qe=ge.filter(j=>j.archived).length,Ye=r.filter(j=>j.nodeId===t.id),ot=ve.length>0||R||ge.length>0,{inc:dc,exp:hc,balance:$r}=Cu(n,r,t.id),_t=t.color||"#6366f1",Wr=ve.map(j=>({...j,...Cu(n,r,j.id),childCount:n.filter(Ve=>Ve.parentId===j.id).length})),Ns=ot&&!Wr.some(j=>j.childCount>0),Rn=ME(n,r,t.id);let ki=0;const Os={};Ye.forEach(j=>{ki+=j.type==="income"?j.amount:-j.amount,Os[j.id]=ki});const Vs=Oe?Ye.filter(j=>{var Ve;return j.label.toLowerCase().includes(Oe.toLowerCase())||(((Ve=Lt().find(Xe=>Xe.id===j.category))==null?void 0:Ve.label)||"").toLowerCase().includes(Oe.toLowerCase())||(j.tags||[]).some(Xe=>Xe.includes(Oe.toLowerCase()))}):Ye,Ea=j=>{const Ve=Ln();b({id:Ve,nodeId:t.id,label:"",amount:0,category:j==="income"?"income":"other",type:j,date:Es(),dateISO:as(),tags:[]}),ce(Ve),Q(""),G("overview"),xe()},Ta=j=>{var oe;const Ve=(oe=j.target.files)==null?void 0:oe[0];if(!Ve)return;const Xe=new FileReader;Xe.onload=Ut=>{O5(Ut.target.result).forEach(Ms=>b({id:Ln(),nodeId:t.id,...Ms,dateISO:as(),tags:Ms.tags||[]}))},Xe.readAsText(Ve),j.target.value=""};return h.jsxs("div",{style:{animation:"fadeIn 0.3s ease"},children:[h.jsxs("div",{style:{padding:"24px 20px 0"},children:[h.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:16},children:[h.jsxs("button",{onClick:u,style:{background:I().inputBg,border:"none",color:I().textSub,borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:13,fontWeight:600,flexShrink:0},children:["‹ ",e]}),h.jsx(U5,{value:_t,onChange:j=>m(t.id,{color:j})}),h.jsx(F5,{value:t.name,onSave:j=>m(t.id,{name:j}),style:{fontSize:17,fontWeight:700,margin:0,color:I().text,flex:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}),(!ot||ge.length>0)&&h.jsx("button",{onClick:()=>w(!0),title:"Add sub-budget",style:{background:I().inputBg,border:"none",borderRadius:8,padding:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:h.jsx(L5,{color:"#94a3b8",size:18})})]}),!ot&&h.jsxs(h.Fragment,{children:[h.jsx(i4,{node:t,envelope:(l||{})[t.id]||null,entries:r,nodes:n,parentName:e,setEnvelope:T,onEdit:()=>G("settings"),allEnvelopes:l||{}}),h.jsx(q5,{nodeId:t.id,entries:r,limits:s})]})]}),!ot&&h.jsx("div",{style:{display:"flex",gap:4,padding:"0 20px",marginBottom:12},children:[{id:"overview",label:"Overview"},{id:"settings",label:"⚙ Limits & Recurring"}].map(j=>h.jsx("button",{onClick:()=>G(j.id),style:{flex:1,padding:"8px 0",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:B===j.id?"rgba(99,102,241,0.15)":"rgba(255,255,255,0.03)",color:B===j.id?"#818cf8":"#64748b",transition:"all 0.2s"},children:j.label},j.id))}),h.jsx("div",{style:{padding:"0 0 0",display:"flex",flexDirection:"column",height:"calc(100vh - env(safe-area-inset-top, 0px))",overflow:"hidden"},children:ot&&Ns?h.jsxs("div",{style:{padding:"0 20px 120px",flex:1,overflowY:"auto",overscrollBehavior:"contain"},children:[h.jsxs("div",{style:{background:"linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:"16px 18px",marginBottom:12,borderTop:`3px solid ${_t}`},children:[h.jsx("div",{style:{fontSize:10,color:I().textMuted,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:600,marginBottom:4},children:"Balance"}),h.jsx("div",{style:{fontSize:26,fontWeight:700,fontFamily:I().mono,color:$r>=0?I().inc:I().exp,letterSpacing:"-0.02em"},children:h.jsx(j5,{value:$r})}),h.jsxs("div",{style:{display:"flex",gap:24,marginTop:8},children:[h.jsxs("div",{children:[h.jsx("div",{style:{fontSize:10,color:I().textMuted,textTransform:"uppercase",letterSpacing:"0.1em"},children:"Income"}),h.jsxs("div",{style:{fontSize:14,fontWeight:600,color:I().inc,fontFamily:I().mono,marginTop:2},children:["+",ue(dc)]})]}),h.jsxs("div",{children:[h.jsx("div",{style:{fontSize:10,color:I().textMuted,textTransform:"uppercase",letterSpacing:"0.1em"},children:"Expenses"}),h.jsxs("div",{style:{fontSize:14,fontWeight:600,color:I().exp,fontFamily:I().mono,marginTop:2},children:["−",ue(hc)]})]})]})]}),h.jsx(r4,{childNodes:ve,envelopes:l||{},entries:r,parentName:t.name}),h.jsx(Sv,{title:"Transactions",count:Rn.length,defaultOpen:!0,children:h.jsx("div",{style:{display:"flex",flexDirection:"column",gap:4,marginBottom:12},children:Rn.length===0?h.jsx(Fh,{text:"No entries yet",sub:"Add transactions in your sub-budgets"}):Rn.slice().sort((j,Ve)=>(Ve.dateISO||"").localeCompare(j.dateISO||"")).map(j=>{const Ve=Lt().find(Ut=>Ut.id===j.category)||{label:"Other",icon:"📋"},Xe=j.type==="income",oe=n.find(Ut=>Ut.id===j.nodeId);return h.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,padding:"10px 10px 10px 10px",background:I().row,borderRadius:10},children:[h.jsx("span",{style:{fontSize:16,width:24,textAlign:"center",opacity:.7,flexShrink:0},children:Ve.icon}),h.jsxs("div",{style:{flex:1,minWidth:0},children:[h.jsx("div",{style:{fontSize:14,fontWeight:500,color:I().text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:j.label||"(untitled)"}),h.jsxs("div",{style:{fontSize:11,color:I().textMuted,marginTop:1},children:[Ve.label," · ",j.date,oe&&h.jsxs("span",{style:{marginLeft:4,color:I().accentLight,fontSize:10},children:["→ ",oe.name]})]})]}),h.jsx("div",{style:{textAlign:"right",flexShrink:0},children:h.jsxs("div",{style:{fontFamily:I().mono,fontWeight:600,fontSize:14,color:Xe?I().inc:I().exp},children:[Xe?"+":"−",ue(Math.abs(j.amount))]})})]},j.id)})})}),h.jsx("div",{style:{marginBottom:16}}),h.jsxs(Sv,{title:"Sub-budgets",count:ve.length,defaultOpen:!1,children:[h.jsx(Dl,{items:Wr,onReorder:j=>_(t.id,j),renderItem:(j,Ve,Xe)=>h.jsxs("div",{onClick:()=>{window.__DRAG_ENDED__&&Date.now()-window.__DRAG_ENDED__<300||c(j.id)},style:{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:j.archived?"rgba(255,255,255,0.01)":"rgba(255,255,255,0.02)",borderRadius:12,borderLeft:`4px solid ${j.color||_t}`,cursor:"pointer",transition:"background 0.15s",opacity:j.archived?.5:1},onMouseEnter:oe=>oe.currentTarget.style.background="rgba(255,255,255,0.05)",onMouseLeave:oe=>oe.currentTarget.style.background=j.archived?"rgba(255,255,255,0.01)":"rgba(255,255,255,0.02)",children:[h.jsx("div",{onTouchStart:Xe,style:{cursor:"grab",color:"#475569",fontSize:16,padding:"4px 6px",touchAction:"none",userSelect:"none"},children:"⠿"}),h.jsx("div",{style:{flex:1,minWidth:0},children:h.jsxs("div",{style:{fontSize:15,fontWeight:600,color:I().text},children:[j.name,j.archived&&h.jsx("span",{style:{fontSize:9,color:I().textMuted,marginLeft:6},children:"archived"})]})}),h.jsxs("span",{style:{fontSize:14,fontWeight:600,fontFamily:I().mono,color:j.balance>=0?"#22c55e":"#ef4444"},children:[j.balance>=0?"+":"−"," ",ue(Math.abs(j.balance))]}),h.jsx("span",{style:{fontSize:18,color:"#475569"},children:"›"}),h.jsx("button",{onClick:oe=>{oe.stopPropagation(),m(j.id,{archived:!j.archived}),xe()},title:j.archived?"Unarchive":"Archive",style:{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:12,padding:"2px 4px"},children:j.archived?"↩":"📦"}),h.jsx("button",{onClick:oe=>{oe.stopPropagation(),confirm(`Delete "${j.name}"?`)&&(g(j.id),xe(15))},style:{background:"none",border:"none",color:"#334155",cursor:"pointer",fontSize:16,padding:"2px 4px",borderRadius:4,flexShrink:0},onMouseEnter:oe=>oe.currentTarget.style.color="#ef4444",onMouseLeave:oe=>oe.currentTarget.style.color="#334155",children:"×"})]})}),qe>0&&!K&&h.jsxs("button",{onClick:()=>fe(!0),style:{marginTop:8,padding:"8px 0",width:"100%",borderRadius:8,border:"none",background:I().surface,color:"#475569",fontSize:11,cursor:"pointer"},children:["Show ",qe," archived budget",qe!==1?"s":""]}),K&&qe>0&&h.jsx("button",{onClick:()=>fe(!1),style:{marginTop:8,padding:"8px 0",width:"100%",borderRadius:8,border:"none",background:I().surface,color:"#475569",fontSize:11,cursor:"pointer"},children:"Hide archived"})]}),R&&h.jsx("div",{style:{marginTop:8},children:h.jsx(zh,{placeholder:"Sub-budget name",accentColor:_t,icon:h.jsx("div",{style:{width:8}}),onCommit:j=>{f({id:Ln(),parentId:t.id,name:j,color:yn[ve.length%yn.length]}),w(!1),xe()},onCancel:()=>w(!1)})}),h.jsx(jh,{children:h.jsx(go,{onClick:()=>w(!0),bg:`${_t}25`,color:_t,children:"+ New Sub-budget"})})]}):ot?h.jsxs("div",{style:{padding:"0 20px 120px",flex:1,overflowY:"auto",overscrollBehavior:"contain"},children:[h.jsx(W5,{entries:Rn}),h.jsx(H5,{entries:Rn}),h.jsxs("div",{style:{fontSize:12,color:I().textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10},children:["Sub-budgets (",ve.length,")"]}),h.jsx(Dl,{items:Wr,onReorder:j=>_(t.id,j),renderItem:(j,Ve,Xe)=>h.jsxs("div",{onClick:()=>{window.__DRAG_ENDED__&&Date.now()-window.__DRAG_ENDED__<300||c(j.id)},style:{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:j.archived?"rgba(255,255,255,0.01)":"rgba(255,255,255,0.02)",borderRadius:12,borderLeft:`4px solid ${j.color||_t}`,cursor:"pointer",transition:"background 0.15s",opacity:j.archived?.5:1},onMouseEnter:oe=>oe.currentTarget.style.background="rgba(255,255,255,0.05)",onMouseLeave:oe=>oe.currentTarget.style.background=j.archived?"rgba(255,255,255,0.01)":"rgba(255,255,255,0.02)",children:[h.jsx("div",{onTouchStart:Xe,style:{cursor:"grab",color:"#475569",fontSize:16,padding:"4px 6px",touchAction:"none",userSelect:"none"},children:"⠿"}),h.jsxs("div",{style:{flex:1,minWidth:0},children:[h.jsxs("div",{style:{fontSize:15,fontWeight:600,color:I().text},children:[j.name,j.archived&&h.jsx("span",{style:{fontSize:9,color:I().textMuted,marginLeft:6},children:"archived"})]}),j.childCount>0&&h.jsxs("div",{style:{fontSize:11,color:I().textMuted,marginTop:2},children:[j.childCount," sub-budget",j.childCount!==1?"s":""]})]}),h.jsxs("span",{style:{fontSize:14,fontWeight:600,fontFamily:I().mono,color:j.balance>=0?"#22c55e":"#ef4444"},children:[j.balance>=0?"+":"−"," ",ue(Math.abs(j.balance))]}),h.jsx("span",{style:{fontSize:18,color:"#475569"},children:"›"}),h.jsx("button",{onClick:oe=>{oe.stopPropagation(),m(j.id,{archived:!j.archived}),xe()},title:j.archived?"Unarchive":"Archive",style:{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:12,padding:"2px 4px"},children:j.archived?"↩":"📦"}),h.jsx("button",{onClick:oe=>{oe.stopPropagation(),confirm(`Delete "${j.name}"?`)&&(g(j.id),xe(15))},style:{background:"none",border:"none",color:"#334155",cursor:"pointer",fontSize:16,padding:"2px 4px",borderRadius:4,flexShrink:0},onMouseEnter:oe=>oe.currentTarget.style.color="#ef4444",onMouseLeave:oe=>oe.currentTarget.style.color="#334155",children:"×"})]})}),qe>0&&!K&&h.jsxs("button",{onClick:()=>fe(!0),style:{marginTop:8,padding:"8px 0",width:"100%",borderRadius:8,border:"none",background:I().surface,color:"#475569",fontSize:11,cursor:"pointer"},children:["Show ",qe," archived budget",qe!==1?"s":""]}),K&&qe>0&&h.jsx("button",{onClick:()=>fe(!1),style:{marginTop:8,padding:"8px 0",width:"100%",borderRadius:8,border:"none",background:I().surface,color:"#475569",fontSize:11,cursor:"pointer"},children:"Hide archived"}),R&&h.jsx("div",{style:{marginTop:8},children:h.jsx(zh,{placeholder:"Sub-budget name",accentColor:_t,icon:h.jsx("div",{style:{width:8}}),onCommit:j=>{f({id:Ln(),parentId:t.id,name:j,color:yn[ve.length%yn.length]}),w(!1),xe()},onCancel:()=>w(!1)})}),h.jsx(jh,{children:h.jsx(go,{onClick:()=>w(!0),bg:`${_t}25`,color:_t,children:"+ New Sub-budget"})})]}):B==="settings"?h.jsxs("div",{style:{padding:"0 20px 40px",flex:1,overflowY:"auto",overscrollBehavior:"contain",display:"flex",flexDirection:"column",gap:20},children:[h.jsx(s4,{nodeId:t.id,envelope:(l||{})[t.id],setEnvelope:T,removeEnvelope:C}),h.jsx(G5,{nodeId:t.id,entries:r,limits:s,setLimit:F,removeLimit:D}),h.jsx(K5,{nodeId:t.id,recurrings:i,onAdd:E,onUpdate:A,onRemove:V,onAddEntry:b}),h.jsx(Q5,{customCategories:o||[],onAdd:S,onRemove:v}),h.jsxs("div",{children:[h.jsx("div",{style:{fontSize:12,color:I().textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8},children:"Import / Export"}),h.jsxs("div",{style:{display:"flex",gap:8},children:[h.jsx("button",{onClick:()=>N5(Ye,t.name),style:{flex:1,padding:"8px 0",borderRadius:8,border:"1px solid rgba(255,255,255,0.08)",background:I().surface,color:I().textSub,fontSize:12,fontWeight:600,cursor:"pointer"},children:"↓ Export CSV"}),h.jsx("button",{onClick:()=>{var j;return(j=de.current)==null?void 0:j.click()},style:{flex:1,padding:"8px 0",borderRadius:8,border:"1px solid rgba(255,255,255,0.08)",background:I().surface,color:I().textSub,fontSize:12,fontWeight:600,cursor:"pointer"},children:"↑ Import CSV"}),h.jsx("input",{ref:de,type:"file",accept:".csv",onChange:Ta,style:{display:"none"}})]})]})]}):h.jsxs(h.Fragment,{children:[h.jsxs("div",{style:{padding:"0 20px"},children:[h.jsx("div",{style:{background:I().surface,border:"1px solid rgba(255,255,255,0.05)",borderRadius:14,padding:16,marginBottom:12},children:h.jsx(X5,{entries:Ye})}),Ye.length>3&&h.jsx(z5,{value:Oe,onChange:Q}),h.jsxs("div",{style:{fontSize:12,color:I().textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10},children:["Transactions (",Vs.length,Oe?` of ${Ye.length}`:"",")"]})]}),h.jsxs("div",{style:{flex:1,overflowY:"auto",overscrollBehavior:"contain",padding:"0 20px",WebkitOverflowScrolling:"touch"},children:[Vs.length===0?h.jsx(Fh,{text:Oe?"No matches":"No entries yet",sub:Oe?"Try a different search or tag":"Add transactions or tap ⚙ for recurring & CSV import"}):h.jsx(Dl,{items:Vs,onReorder:j=>k(t.id,j),renderItem:(j,Ve,Xe)=>h.jsx(Y5,{entry:j,runningBalance:Os[j.id],onUpdate:x,onRemove:O,onDuplicate:oe=>{const Ut=Ln();b({...oe,id:Ut,date:Es(),dateISO:as(),recurring:!1}),ce(Ut),xe()},isEditing:ae===j.id,onStartEdit:ce,onStopEdit:()=>ce(null),onDragHandle:Xe,allEntries:r},j.id)}),h.jsxs("div",{style:{display:"flex",gap:10,padding:"16px 0 24px"},children:[h.jsx(go,{onClick:()=>Ea("income"),bg:`${I().inc}25`,color:I().inc,children:"+ Income"}),h.jsx(go,{onClick:()=>Ea("expense"),bg:`${I().exp}25`,color:I().exp,children:"+ Expense"})]})]})]})})]})}function a4({user:t,householdId:e}){const n=M5(t,e),{d:r,synced:i}=n,[s,o]=z.useState([]),[l,u]=z.useState(!1),[c,f]=z.useState(!1),[m,g]=z.useState(!1),[_,b]=z.useState(()=>{try{return localStorage.getItem("maverick-theme")||"midnight"}catch{return"midnight"}}),[x,O]=z.useState(()=>typeof Notification<"u"&&Notification.permission==="granted"),[k,E]=z.useState({...Rl}),[A,V]=z.useState(!1);z.useEffect(()=>{t!=null&&t.uid&&x5(t.uid).then(w=>{E(w),V(!0)})},[t==null?void 0:t.uid]);const F=async w=>{const ae={...k,[w]:!k[w]};E(ae),t!=null&&t.uid&&await k5(t.uid,ae)},D=ku[_]||ku.midnight;window.__THEME__=_;const S=()=>{const w=_==="midnight"?"ocean":"midnight";b(w);try{localStorage.setItem("maverick-theme",w)}catch{}window.__THEME__=w},v=s.length>0?r.nodes.find(w=>w.id===s[s.length-1]):null,T=s.length>=2?r.nodes.find(w=>w.id===s[s.length-2]):null,C=w=>o([...s,w]),P=()=>o(s.slice(0,-1)),R=w=>h.jsxs("div",{className:"app-shell",style:{fontFamily:D.font,background:D.bg,color:D.text,minHeight:"100vh",maxWidth:480,margin:"0 auto",position:"relative",overflow:"hidden"},children:[h.jsx("style",{children:`
        @import url('${D.fontImport}');
        @keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:0.7}}
        input::placeholder,select{color:${D.textDim}} select option{background:${D.selectBg};color:${D.text}}
        input,select,textarea{font-size:16px !important;-webkit-text-size-adjust:100%}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.7)}
        .app-shell{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
      `}),h.jsx("div",{style:{position:"absolute",top:-120,right:-80,width:300,height:300,background:D.glow,animation:"pulse 6s ease-in-out infinite",pointerEvents:"none"}}),h.jsx(C5,{userId:t.uid,householdId:e}),h.jsx(B5,{children:w})]});if(!v){const w=r.nodes.filter(Q=>Q.parentId===null),ae=c?w:w.filter(Q=>!Q.archived),ce=w.filter(Q=>Q.archived).length,Oe=ae.map(Q=>({...Q,...Cu(r.nodes,r.entries,Q.id),childCount:r.nodes.filter(B=>B.parentId===Q.id).length}));return R(h.jsxs("div",{style:{padding:"24px 20px 20px",animation:"fadeIn 0.4s ease"},children:[h.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24},children:[h.jsxs("div",{children:[h.jsx("h1",{style:{fontSize:22,fontWeight:700,margin:0,letterSpacing:"-0.02em",background:D.titleGrad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},children:"Maverick"}),h.jsx("span",{style:{fontSize:10,color:D.textDim,textTransform:"uppercase",letterSpacing:"0.15em",fontWeight:600},children:"Budget"})]}),h.jsx("button",{onClick:()=>g(!m),style:{background:m?`${D.accent}20`:D.surface,border:`1px solid ${m?D.accent+"40":D.cardBorder}`,borderRadius:10,width:36,height:36,cursor:"pointer",fontSize:18,color:m?D.accentLight:D.textSub,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"},children:"⚙"})]}),m&&h.jsxs("div",{style:{background:D.card,border:`1px solid ${D.cardBorder}`,borderRadius:14,padding:"16px 18px",marginBottom:16,animation:"slideIn 0.2s ease"},children:[h.jsx("div",{style:{fontSize:12,color:D.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12},children:"Settings"}),h.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12},children:[h.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[h.jsx("span",{style:{fontSize:16},children:_==="midnight"?"🌙":"🌊"}),h.jsxs("div",{children:[h.jsx("div",{style:{fontSize:13,color:D.text,fontWeight:500},children:"Theme"}),h.jsx("div",{style:{fontSize:10,color:D.textMuted},children:D.name})]})]}),h.jsxs("button",{onClick:S,style:{background:`${D.accent}20`,border:`1px solid ${D.accent}30`,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:11,fontWeight:600,color:D.accentLight},children:["Switch to ",_==="midnight"?"Ocean":"Midnight"]})]}),h.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8},children:[h.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[h.jsx("span",{style:{fontSize:16},children:"🔔"}),h.jsxs("div",{children:[h.jsx("div",{style:{fontSize:13,color:D.text,fontWeight:500},children:"Notifications"}),h.jsx("div",{style:{fontSize:10,color:D.textMuted},children:x?"Enabled":"Disabled"})]})]}),h.jsx("button",{onClick:async()=>{if(!(typeof Notification>"u"))if(Notification.permission==="granted")if(x){try{await qR(Wt(Ht,"users",t.uid,"tokens","fcm"))}catch(Q){console.error("Token remove error:",Q)}O(!1)}else{const Q=await xu(t.uid,e);O(!!Q)}else{const Q=await xu(t.uid,e);O(!!Q)}},style:{width:44,height:26,borderRadius:13,border:"none",cursor:"pointer",position:"relative",transition:"background 0.2s",background:x?D.inc:"rgba(255,255,255,0.1)"},children:h.jsx("div",{style:{width:20,height:20,borderRadius:10,background:"#fff",position:"absolute",top:3,transition:"left 0.2s",left:x?21:3}})})]}),x&&A&&h.jsx("div",{style:{marginLeft:32,marginBottom:12},children:[{key:"newTransaction",label:"New transactions",sub:"When someone posts a new entry"},{key:"editTransaction",label:"Edited transactions",sub:"When someone edits an entry"},{key:"deleteTransaction",label:"Deleted transactions",sub:"When someone removes an entry"},{key:"budgetUpdate",label:"Budget changes",sub:"Folders, limits, or categories"},{key:"envelopeAlert",label:"Envelope alerts",sub:"When an envelope hits 80% or 100%"}].map(({key:Q,label:B,sub:G})=>h.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0"},children:[h.jsxs("div",{children:[h.jsx("div",{style:{fontSize:12,color:D.text,fontWeight:500},children:B}),h.jsx("div",{style:{fontSize:9,color:D.textMuted},children:G})]}),h.jsx("button",{onClick:()=>F(Q),style:{width:36,height:20,borderRadius:10,border:"none",cursor:"pointer",position:"relative",transition:"background 0.2s",background:k[Q]?D.inc:"rgba(255,255,255,0.1)"},children:h.jsx("div",{style:{width:16,height:16,borderRadius:8,background:"#fff",position:"absolute",top:2,transition:"left 0.2s",left:k[Q]?18:2}})})]},Q))}),h.jsxs("div",{style:{borderTop:`1px solid ${D.cardBorder}`,paddingTop:12,marginTop:4},children:[h.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:6},children:[h.jsx("span",{style:{fontSize:16},children:"👥"}),h.jsxs("div",{children:[h.jsx("div",{style:{fontSize:13,color:D.text,fontWeight:500},children:"Household"}),h.jsx("div",{style:{fontSize:10,color:D.textMuted},children:"Invite your partner"})]})]}),h.jsxs("div",{style:{background:`${D.accent}10`,borderRadius:8,padding:"8px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[h.jsx("span",{style:{fontSize:18,fontWeight:700,fontFamily:I().mono,color:D.text,letterSpacing:"0.12em"},children:e}),h.jsx("span",{style:{fontSize:10,color:D.textMuted},children:t==null?void 0:t.email})]})]}),h.jsx("button",{onClick:()=>{confirm("Sign out?")&&ww(ss)},style:{marginTop:12,width:"100%",padding:"10px 0",borderRadius:8,border:"1px solid rgba(239,68,68,0.2)",background:"rgba(239,68,68,0.06)",color:"#ef4444",fontSize:12,fontWeight:600,cursor:"pointer"},children:"Sign Out"})]}),h.jsxs("div",{style:{fontSize:12,color:I().textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12},children:["Folders (",ae.length,")"]}),h.jsxs("div",{style:{paddingBottom:100},children:[h.jsx(Dl,{items:Oe,onReorder:Q=>n.reorderNodes(null,Q),renderItem:(Q,B,G)=>h.jsxs("div",{onClick:()=>{window.__DRAG_ENDED__&&Date.now()-window.__DRAG_ENDED__<300||C(Q.id)},style:{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:Q.archived?"rgba(255,255,255,0.01)":"rgba(255,255,255,0.02)",borderRadius:12,borderLeft:`4px solid ${Q.color}`,cursor:"pointer",transition:"background 0.15s",opacity:Q.archived?.5:1},onMouseEnter:K=>K.currentTarget.style.background="rgba(255,255,255,0.05)",onMouseLeave:K=>K.currentTarget.style.background=Q.archived?"rgba(255,255,255,0.01)":"rgba(255,255,255,0.02)",children:[h.jsx("div",{onTouchStart:G,style:{cursor:"grab",color:"#475569",fontSize:16,padding:"4px 6px",touchAction:"none",userSelect:"none"},children:"⠿"}),h.jsx("div",{style:{width:40,height:40,borderRadius:10,background:`${Q.color}20`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:h.jsx(Tv,{color:Q.color})}),h.jsxs("div",{style:{flex:1,minWidth:0},children:[h.jsxs("div",{style:{fontSize:15,fontWeight:600,color:I().text},children:[Q.name,Q.archived&&h.jsx("span",{style:{fontSize:9,color:I().textMuted,marginLeft:6},children:"archived"})]}),h.jsxs("div",{style:{fontSize:11,color:I().textMuted,marginTop:2},children:[Q.childCount," budget",Q.childCount!==1?"s":""]})]}),h.jsx("span",{style:{fontSize:18,color:"#475569"},children:"›"}),h.jsx("button",{onClick:K=>{K.stopPropagation(),n.updateNode(Q.id,{archived:!Q.archived}),xe()},title:Q.archived?"Unarchive":"Archive",style:{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:12,padding:"2px 4px"},children:Q.archived?"↩":"📦"}),h.jsx("button",{onClick:K=>{K.stopPropagation(),confirm(`Delete "${Q.name}"?`)&&(n.removeNode(Q.id),xe(15))},style:{background:"none",border:"none",color:"#334155",cursor:"pointer",fontSize:16,padding:"2px 4px",borderRadius:4,flexShrink:0},onMouseEnter:K=>K.currentTarget.style.color="#ef4444",onMouseLeave:K=>K.currentTarget.style.color="#334155",children:"×"})]})}),ce>0&&!c&&h.jsxs("button",{onClick:()=>f(!0),style:{marginTop:8,padding:"8px 0",width:"100%",borderRadius:8,border:"none",background:I().surface,color:"#475569",fontSize:11,cursor:"pointer"},children:["Show ",ce," archived"]}),c&&ce>0&&h.jsx("button",{onClick:()=>f(!1),style:{marginTop:8,padding:"8px 0",width:"100%",borderRadius:8,border:"none",background:I().surface,color:"#475569",fontSize:11,cursor:"pointer"},children:"Hide archived"}),l&&h.jsx("div",{style:{marginTop:8},children:h.jsx(zh,{placeholder:"Folder name",accentColor:yn[ae.length%yn.length],icon:h.jsx("div",{style:{width:40,height:40,borderRadius:10,background:"rgba(99,102,241,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:h.jsx(Tv,{color:"#6366f1"})}),onCommit:Q=>{n.addNode({id:Ln(),parentId:null,name:Q,color:yn[ae.length%yn.length]}),u(!1),xe()},onCancel:()=>u(!1)})}),!l&&ae.length===0&&h.jsx(Fh,{text:"No folders yet",sub:"Tap below to create one"})]}),h.jsx(jh,{children:h.jsx(go,{onClick:()=>u(!0),bg:`${I().accent}25`,color:I().accentLight,children:"+ New Folder"})})]}))}return R(h.jsx(o4,{node:v,parentName:T?T.name:"Folders",nodes:r.nodes,entries:r.entries,recurrings:r.recurrings,limits:r.limits,customCategories:r.customCategories,envelopes:r.envelopes,onBack:P,onNavigate:C,addNode:n.addNode,updateNode:n.updateNode,removeNode:n.removeNode,reorderNodes:n.reorderNodes,addEntry:n.addEntry,updateEntry:n.updateEntry,removeEntry:n.removeEntry,reorderEntries:n.reorderEntries,addRecurring:n.addRecurring,updateRecurring:n.updateRecurring,removeRecurring:n.removeRecurring,setLimit:n.setLimit,removeLimit:n.removeLimit,addCategory:n.addCategory,removeCategory:n.removeCategory,setEnvelope:n.setEnvelope,removeEnvelope:n.removeEnvelope,getDesc:n.getDesc}))}function l4(){const[t,e]=z.useState("login"),[n,r]=z.useState(""),[i,s]=z.useState(""),[o,l]=z.useState(""),[u,c]=z.useState(!1),f=async()=>{var _;if(!n||!i){l("Email and password required");return}l(""),c(!0);try{t==="signup"?await _2(ss,n,i):await w2(ss,n,i)}catch(b){const x=((_=b.code)==null?void 0:_.replace("auth/","").replace(/-/g," "))||"Something went wrong";l(x.charAt(0).toUpperCase()+x.slice(1))}c(!1)},m=async()=>{l(""),c(!0);try{await $2(ss,S5)}catch(_){_.code!=="auth/popup-closed-by-user"&&l("Google sign-in failed")}c(!1)},g={width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"12px 16px",color:"#e2e8f0",fontSize:16,outline:"none"};return h.jsxs("div",{style:{fontFamily:"'DM Sans', 'Segoe UI', system-ui, sans-serif",background:"linear-gradient(160deg, #0a0a1a 0%, #0f1629 40%, #0a0a1a 100%)",color:"#e2e8f0",minHeight:"100vh",maxWidth:480,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",overflowY:"auto",WebkitOverflowScrolling:"touch",position:"relative",zIndex:1},children:[h.jsxs("div",{style:{textAlign:"center",marginBottom:40},children:[h.jsx("h1",{style:{fontSize:32,fontWeight:700,margin:0,letterSpacing:"-0.03em",background:"linear-gradient(135deg, #e2e8f0, #94a3b8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},children:"Maverick"}),h.jsx("span",{style:{fontSize:11,color:"#475569",textTransform:"uppercase",letterSpacing:"0.2em",fontWeight:600},children:"Budget"})]}),h.jsxs("div",{style:{width:"100%",background:"linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",border:"1px solid rgba(255,255,255,0.06)",borderRadius:20,padding:"28px 24px"},children:[h.jsx("h2",{style:{fontSize:18,fontWeight:700,margin:"0 0 20px",color:"#e2e8f0"},children:t==="login"?"Welcome back":"Create account"}),h.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:12},children:[h.jsx("input",{type:"email",value:n,onChange:_=>r(_.target.value),placeholder:"Email address",autoComplete:"email",style:g}),h.jsx("input",{type:"password",value:i,onChange:_=>s(_.target.value),placeholder:"Password",autoComplete:t==="signup"?"new-password":"current-password",onKeyDown:_=>_.key==="Enter"&&f(),style:g}),o&&h.jsx("div",{style:{fontSize:13,color:"#ef4444",background:"rgba(239,68,68,0.1)",padding:"8px 12px",borderRadius:8},children:o}),h.jsx("button",{onClick:f,disabled:u,style:{padding:"13px 0",borderRadius:10,border:"none",cursor:u?"wait":"pointer",fontSize:15,fontWeight:600,letterSpacing:"0.02em",background:"linear-gradient(135deg, #6366f1, #818cf8)",color:"#fff",opacity:u?.6:1,transition:"opacity 0.2s"},children:u?"...":t==="login"?"Sign In":"Sign Up"}),h.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12,margin:"4px 0"},children:[h.jsx("div",{style:{flex:1,height:1,background:"rgba(255,255,255,0.08)"}}),h.jsx("span",{style:{fontSize:11,color:"#475569"},children:"or"}),h.jsx("div",{style:{flex:1,height:1,background:"rgba(255,255,255,0.08)"}})]}),h.jsxs("button",{onClick:m,disabled:u,style:{padding:"12px 0",borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",cursor:u?"wait":"pointer",fontSize:14,fontWeight:600,background:"rgba(255,255,255,0.03)",color:"#e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",gap:8},children:[h.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 48 48",children:[h.jsx("path",{fill:"#EA4335",d:"M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"}),h.jsx("path",{fill:"#4285F4",d:"M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"}),h.jsx("path",{fill:"#FBBC05",d:"M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"}),h.jsx("path",{fill:"#34A853",d:"M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"})]}),"Continue with Google"]})]}),h.jsx("div",{style:{textAlign:"center",marginTop:16},children:h.jsx("button",{onClick:()=>{e(t==="login"?"signup":"login"),l("")},style:{background:"none",border:"none",color:"#818cf8",cursor:"pointer",fontSize:13,fontWeight:500},children:t==="login"?"Don't have an account? Sign up":"Already have an account? Sign in"})})]})]})}function Iv(){const t="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let e="";for(let n=0;n<6;n++)e+=t[Math.floor(Math.random()*t.length)];return e}function u4({user:t,onReady:e}){const[n,r]=z.useState(null),[i,s]=z.useState(""),[o,l]=z.useState(""),[u,c]=z.useState(!1),f=async()=>{c(!0),l("");try{let x=Iv(),O=0;for(;O<5&&(await Su(Wt(Ht,"households",x))).exists();)x=Iv(),O++;await fr(Wt(Ht,"households",x),{ownerUid:t.uid,ownerEmail:t.email,members:[t.uid],memberEmails:[t.email],createdAt:new Date().toISOString()}),await fr(Wt(Ht,"users",t.uid,"profile","main"),{householdId:x,email:t.email,joinedAt:new Date().toISOString()}),e(x)}catch(x){console.error(x),l("Failed to create household. Check Firestore rules.")}c(!1)},m=async()=>{var O;const x=i.trim().toUpperCase();if(x.length!==6){l("Enter a 6-character code");return}c(!0),l("");try{const k=Wt(Ht,"households",x),E=await Su(k);if(!E.exists()){l("Household not found. Check the code."),c(!1);return}const A=E.data();if((O=A.members)!=null&&O.includes(t.uid)){await fr(Wt(Ht,"users",t.uid,"profile","main"),{householdId:x,email:t.email,joinedAt:new Date().toISOString()}),e(x),c(!1);return}await fr(k,{...A,members:[...A.members||[],t.uid],memberEmails:[...A.memberEmails||[],t.email]}),await fr(Wt(Ht,"users",t.uid,"profile","main"),{householdId:x,email:t.email,joinedAt:new Date().toISOString()}),e(x)}catch(k){console.error(k),l("Failed to join. Check your connection and Firestore rules.")}c(!1)},g={width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"12px 16px",color:"#e2e8f0",fontSize:16,outline:"none"},_={padding:"13px 0",borderRadius:10,border:"none",cursor:u?"wait":"pointer",fontSize:15,fontWeight:600,width:"100%",background:"linear-gradient(135deg, #6366f1, #818cf8)",color:"#fff",opacity:u?.6:1},b={padding:"13px 0",borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",cursor:"pointer",fontSize:15,fontWeight:600,width:"100%",background:"rgba(255,255,255,0.03)",color:"#e2e8f0"};return h.jsxs("div",{style:{fontFamily:"'DM Sans', 'Segoe UI', system-ui, sans-serif",background:"linear-gradient(160deg, #0a0a1a 0%, #0f1629 40%, #0a0a1a 100%)",color:"#e2e8f0",minHeight:"100vh",maxWidth:480,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",overflowY:"auto",WebkitOverflowScrolling:"touch",position:"relative",zIndex:1},children:[h.jsxs("div",{style:{textAlign:"center",marginBottom:32},children:[h.jsx("h1",{style:{fontSize:28,fontWeight:700,margin:0,background:"linear-gradient(135deg, #e2e8f0, #94a3b8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},children:"Maverick"}),h.jsx("span",{style:{fontSize:11,color:"#475569",textTransform:"uppercase",letterSpacing:"0.2em",fontWeight:600},children:"Budget"})]}),h.jsxs("div",{style:{width:"100%",background:"linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",border:"1px solid rgba(255,255,255,0.06)",borderRadius:20,padding:"28px 24px"},children:[n===null&&h.jsxs(h.Fragment,{children:[h.jsx("h2",{style:{fontSize:18,fontWeight:700,margin:"0 0 6px"},children:"Set up your household"}),h.jsx("p",{style:{fontSize:13,color:"#64748b",margin:"0 0 24px",lineHeight:1.5},children:"Create a household to start budgeting, or join an existing one with an invite code from your partner."}),h.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:10},children:[h.jsx("button",{onClick:()=>r("create"),style:_,children:"Create New Household"}),h.jsx("button",{onClick:()=>r("join"),style:b,children:"Join with Invite Code"})]})]}),n==="create"&&h.jsxs(h.Fragment,{children:[h.jsx("h2",{style:{fontSize:18,fontWeight:700,margin:"0 0 6px"},children:"Create household"}),h.jsx("p",{style:{fontSize:13,color:"#64748b",margin:"0 0 20px",lineHeight:1.5},children:"This will create a new shared budget space. You'll get an invite code to share with your partner."}),o&&h.jsx("div",{style:{fontSize:13,color:"#ef4444",background:"rgba(239,68,68,0.1)",padding:"8px 12px",borderRadius:8,marginBottom:12},children:o}),h.jsx("button",{onClick:f,disabled:u,style:_,children:u?"Creating...":"Create Household"}),h.jsx("button",{onClick:()=>{r(null),l("")},style:{background:"none",border:"none",color:"#818cf8",cursor:"pointer",fontSize:13,fontWeight:500,marginTop:16,display:"block",width:"100%",textAlign:"center"},children:"← Back"})]}),n==="join"&&h.jsxs(h.Fragment,{children:[h.jsx("h2",{style:{fontSize:18,fontWeight:700,margin:"0 0 6px"},children:"Join household"}),h.jsx("p",{style:{fontSize:13,color:"#64748b",margin:"0 0 20px",lineHeight:1.5},children:"Enter the 6-character invite code from your partner."}),h.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:12},children:[h.jsx("input",{value:i,onChange:x=>s(x.target.value.toUpperCase().slice(0,6)),placeholder:"INVITE CODE",maxLength:6,style:{...g,textAlign:"center",letterSpacing:"0.3em",fontSize:20,fontFamily:"'JetBrains Mono', monospace",fontWeight:700}}),o&&h.jsx("div",{style:{fontSize:13,color:"#ef4444",background:"rgba(239,68,68,0.1)",padding:"8px 12px",borderRadius:8},children:o}),h.jsx("button",{onClick:m,disabled:u||i.length!==6,style:{..._,opacity:u||i.length!==6?.4:1},children:u?"Joining...":"Join Household"})]}),h.jsx("button",{onClick:()=>{r(null),l(""),s("")},style:{background:"none",border:"none",color:"#818cf8",cursor:"pointer",fontSize:13,fontWeight:500,marginTop:16,display:"block",width:"100%",textAlign:"center"},children:"← Back"})]})]}),h.jsxs("button",{onClick:()=>{confirm("Sign out?")&&ww(ss)},style:{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:12,marginTop:20},children:["Signed in as ",t.email," · Sign out"]})]})}function c4(){const[t,e]=z.useState(void 0),[n,r]=z.useState(void 0);z.useEffect(()=>S2(ss,o=>{e(o||null),o||r(void 0)}),[]),z.useEffect(()=>{if(!t)return;let s=!1;return(async()=>{try{const o=await Su(Wt(Ht,"users",t.uid,"profile","main"));if(s)return;o.exists()&&o.data().householdId?r(o.data().householdId):r(null)}catch(o){console.error("Profile fetch error:",o),s||r(null)}})(),()=>{s=!0}},[t]);const i=s=>h.jsx("div",{style:{fontFamily:"'DM Sans', system-ui, sans-serif",background:"linear-gradient(160deg, #0a0a1a 0%, #0f1629 40%, #0a0a1a 100%)",color:"#e2e8f0",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"},children:h.jsxs("div",{style:{textAlign:"center"},children:[h.jsx("h1",{style:{fontSize:24,fontWeight:700,margin:0,background:"linear-gradient(135deg, #e2e8f0, #94a3b8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},children:"Maverick"}),h.jsx("div",{style:{fontSize:11,color:"#475569",marginTop:4},children:s})]})});return t===void 0?i("Loading..."):t===null?h.jsx(l4,{}):n===void 0?i("Setting up..."):n===null?h.jsx(u4,{user:t,onReady:s=>r(s)}):h.jsx(a4,{user:t,householdId:n})}vd.createRoot(document.getElementById("root")).render(h.jsx(kT.StrictMode,{children:h.jsx(c4,{})}));
