module.exports=function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=2)}([function(e,n){e.exports=require("react")},function(e,n){var t=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e};!function(e){var n={};e.cmslink=n;var r=function(){try{var e=localStorage.getItem("__nodes");if(e&&e.length)return JSON.parse(e)}catch(e){return console.log("load error"),{}}};n.createLink=function(o,i){var c=o.url,u=new WebSocket(c),a=r()||{},s={},f=function(e){"function"==typeof i&&i(e)},l=function(e,n){var t=s[e];t&&t.forEach(function(e){e.stopped||e.callback(n)})},p=!1,d=void 0,h=500,y=function(){console.warn("requesting reconnect"),f({connected:p=!1,reconnecting:!0}),d&&clearTimeout(d),d=setTimeout(function(){u=null,u=new WebSocket(c),m()},h+=500)},b=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:200;f(t({},e,{connected:p})),setTimeout(function(){f({connected:p})},n)},m=function(){f({connecting:!0,connected:p}),u.onopen=function(e){h=500,f({connected:p=!0}),console.log("sending token",w),u.send("##"+w+"##"),u.send("?root"),g()},u.onerror=y,u.onclose=y,u.onmessage=function(e){b({data:!0}),function e(n){var t=n.id,r=n.children;t&&(a[t]=n,l(t,n)),r&&r.map(function(n){return e(n)})}(JSON.parse(e.data))}},v=[],g=function e(){if(v.length&&p){var n=v.shift();b({sending:!0}),u.send(n),e()}},k=function(e){v.push(e),g()},O={fakeNode:function(e){console.log("render temp node",e),l(e.id,t({},e,{__fake:!0}))},send:k,getById:function(e){k("?"+e)},listenTo:function(e,n){var t={id:e,stopped:!1,stop:function(){t.stopped=!0},resume:function(){t.stopped=!1},remove:function(){var n=s[e].indexOf(t);s[e].splice(n,1)},callback:n};return s[e]?s[e].push(t):s[e]=[t],a[e]&&r.children?t.stopped||n(a[e]):k("?"+e),t}},w=n.getToken().token;return n.onAuthenticationChanged(function(e){e&&e.token&&(w=e.token),k("!!"+w+"!!")}),m(),e.currentLink=O,O},n.getCurrentLink=function(){return e.currentLink};var o=[],i={},c=localStorage.getItem("_cmsState");c&&c.length&&(i=JSON.parse(c)),n.sessionChanged=function(e){var n={stopped:!1,stop:function(){n.stopped=!0},resume:function(){n.stopped=!1},remove:function(){var e=o.indexOf(n);o.splice(e,1)},callback:e};return o.push(n),setTimeout(function(){e(i)},10),n};n.setSession=function(e){"function"==typeof e&&(e=e(i)),function(e){i=e,o.forEach(function(n){var t=n.stopped,r=n.callback;t||r(e)})}(t({},i,e))},n.schemaHelper={getSchema:function(e){return fetch("/nodeschema/"+e).then(function(e){return e.json()})},getAll:function(){return fetch("/nodeschema/").then(function(e){return e.json()})}};var u=function(e){return console.log("handle user auth status",e),e&&e.token&&localStorage.setItem("currentUserToken",e.token),a(e.token),e};n.getToken=function(){var e=localStorage.getItem("currentUserToken");return a(e)};var a=function(e){var n={valid:!1};if(e&&e.length){var t=e.split("."),r=atob(t[0]),o=JSON.parse(r),i=atob(t[1]),c=JSON.parse(i);n={valid:c.exp>Date.now()/1e3,header:o,data:c,token:e}}return s(n),n},s=function(e){p!==e.valid&&(p=e.valid,f.map(function(n){return n(e)}))},f=[],l=!1,p=!1;n.onAuthenticationChanged=function(e){-1===f.indexOf(e)&&f.push(e),e(n.getToken()),l||(l=!0,setInterval(function(){n.hasValidToken()},36e5))},n.isAdmin=function(){return n.hasValidToken()},n.hasValidToken=function(){return n.getToken().valid},n.signInWithToken=function(e){return fetch("/api/signInWithToken/",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:e})}).then(function(e){return e.json()}).then(u)}}(window)},function(e,n,t){"use strict";t.r(n);var r=t(0),o=t.n(r);const i=function(){return window.cmslink||t(1),window.cmslink},c=i().createLink,u=i().getCurrentLink,a=(i().hasValidToken,i().onAuthenticationChanged,i().schemaHelper,i().sessionChanged);i().setSession,i().signInWithToken;function s(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}var f,l=function(e){for(var n=arguments.length,t=new Array(n>1?n-1:0),r=1;r<n;r++)t[r-1]=arguments[r];var i=Object.assign.apply(Object,[{}].concat(t));return o.a.createElement(e,i)},p={},d=(f=p,{setComponents:function(e){for(var n in e)f[n]=e[n]},getComponents:function(){return p},getComponent:function(e,n){var t=f[e];if(t)return o.a.createElement(t,function(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{},r=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(t).filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.forEach(function(n){s(e,n,t[n])})}return e}({},n));throw"component not found:"+e},getValue:function(e){return f[e]},hasComponent:function(e){return e.type?!!f[e.type]:!!f[e]}}),h=function(e,n){window.currentEditorLink&&window.currentEditorLink(e,n)},y=function(e){window.currentEditorLink=e};function b(e){return(b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function m(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{},r=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(t).filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.forEach(function(n){v(e,n,t[n])})}return e}function v(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function g(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function k(e){return(k=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function O(e,n){return(O=Object.setPrototypeOf||function(e,n){return e.__proto__=n,e})(e,n)}function w(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var S=function(e){function n(e){var t,r,o;!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,n),r=this,o=k(n).call(this,e),(t=!o||"object"!==b(o)&&"function"!=typeof o?w(r):o).linked={},t.gotLinkData=t.gotLinkData.bind(w(w(t))),t.renderChildren=t.renderChildren.bind(w(w(t))),t.setupListener=t.setupListener.bind(w(w(t))),t.isChanged=t.isChanged.bind(w(w(t))),t.connect=t.connect.bind(w(w(t))),t.filterProperties=t.filterProperties.bind(w(w(t))),t.delete=t.delete.bind(w(w(t))),t.connect=t.connect.bind(w(w(t))),t.fakeSend=t.fakeSend.bind(w(w(t))),t.store=t.store.bind(w(w(t))),t.resumeLink=t.resumeLink.bind(w(w(t))),t.stopLink=t.stopLink.bind(w(w(t)));var i=e.id;return i&&t.setupListener(i),t._stateListener=a(function(e){try{var n=t.sessionFilter?t.sessionFilter(e):m({},e);t.isChanged(t.sessionData,n)&&(t.sessionData=n,t._mounted&&t.forceUpdate())}catch(e){console.warn("set session failed",e)}}),t}var t,r,i;return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),n&&O(e,n)}(n,o.a.Component),t=n,(r=[{key:"gotLinkData",value:function(e){var n=this.filterProperties(e);this.isChanged(this.linked,n)&&(this.linked=n,this._mounted&&this.forceUpdate())}},{key:"renderChildren",value:function(){var e=this.linked.children;return(void 0===e?[]:e).filter(d.hasComponent).map(function(e){var n=e.id,t=e.type;return d.getComponent(t,{key:n,id:n})})}},{key:"setupListener",value:function(e,n){this._listener&&this._listener.remove(),this.linkedId=e,this.linked={},this._listener=u().listenTo(e,n||this.gotLinkData)}},{key:"isChanged",value:function(e,n){return function(e,n){return e!==n&&(void 0===e&&void 0!==n||void 0===n&&void 0!==e||JSON.stringify(e)!==JSON.stringify(n))}(e,n)}},{key:"connect",value:function(e){this.filterFunction=e}},{key:"filterProperties",value:function(e){return this.filterFunction?this.filterFunction(e):e}},{key:"delete",value:function(){var e=JSON.stringify({id:this.linkedId});u().send("-".concat(e))}},{key:"fakeSend",value:function(e){var n=this.linkedId;u().fakeNode(m({id:n},this.linked,e))}},{key:"store",value:function(e,n){var t=this.linkedId,r=n?e:m({id:t},e),o=JSON.stringify(r),i=n?"+":"=";u().send("".concat(i).concat(o))}},{key:"resumeLink",value:function(){this._mounted=!0,this._listener&&this._listener.resume(),this._stateListener&&this._stateListener.resume()}},{key:"stopLink",value:function(){this._mounted=!1,this._listener&&this._listener.stop(),this._stateListener&&this._stateListener.stop()}},{key:"render",value:function(){return o.a.createElement("div",null,children)}},{key:"componentDidMount",value:function(){this.resumeLink()}},{key:"componentWillUnmount",value:function(){this.stopLink()}}])&&g(t.prototype,r),i&&g(t,i),n}();function j(e){return(j="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{},r=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(t).filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.forEach(function(n){T(e,n,t[n])})}return e}function T(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function P(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function C(e,n){return!n||"object"!==j(n)&&"function"!=typeof n?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):n}function L(e){return(L=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function E(e,n){return(E=Object.setPrototypeOf||function(e,n){return e.__proto__=n,e})(e,n)}function x(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){return{}},t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){return{}},r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{children:!0};return"function"!=typeof e&&null!==e?null:function(i){function c(e){var o;return function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,c),(o=C(this,L(c).call(this,e))).sessionFilter=t,o.filterFunction=function(e){return r.children?_({},n(e),{children:e.children}):n(e)},o}var u,a,s;return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),n&&E(e,n)}(c,S),u=c,(a=[{key:"componentDidUpdate",value:function(){this.props.id&&this.props.id!=this.linkedId&&this.setupListener(this.props.id)}},{key:"render",value:function(){var n=_({},this.sessionData,this.props,this.linked,{store:this.store,setupListener:this.setupListener});return r.children&&(n.children=this.renderChildren()),o.a.createElement(e,n)}}])&&P(u.prototype,a),s&&P(u,s),c}()}function I(e){return(I="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function D(e){return function(e){if(Array.isArray(e)){for(var n=0,t=new Array(e.length);n<e.length;n++)t[n]=e[n];return t}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function N(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function M(e){return(M=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function A(e,n){return(A=Object.setPrototypeOf||function(e,n){return e.__proto__=n,e})(e,n)}function z(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var J=o.a.createElement("svg",{style:{width:20,height:20},"aria-hidden":"true",role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 640 512"},o.a.createElement("path",{fill:"currentColor",d:"M634.91 154.88C457.74-8.99 182.19-8.93 5.09 154.88c-6.66 6.16-6.79 16.59-.35 22.98l34.24 33.97c6.14 6.1 16.02 6.23 22.4.38 145.92-133.68 371.3-133.71 517.25 0 6.38 5.85 16.26 5.71 22.4-.38l34.24-33.97c6.43-6.39 6.3-16.82-.36-22.98zM320 352c-35.35 0-64 28.65-64 64s28.65 64 64 64 64-28.65 64-64-28.65-64-64-64zm202.67-83.59c-115.26-101.93-290.21-101.82-405.34 0-6.9 6.1-7.12 16.69-.57 23.15l34.44 33.99c6 5.92 15.66 6.32 22.05.8 83.95-72.57 209.74-72.41 293.49 0 6.39 5.52 16.05 5.13 22.05-.8l34.44-33.99c6.56-6.46 6.33-17.06-.56-23.15z"})),U=o.a.createElement("svg",{style:{width:20,height:20},"aria-hidden":"true",role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512"},o.a.createElement("path",{fill:"currentColor",d:"M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"})),W=function(e){function n(e){var t,r,o;return function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,n),r=this,o=M(n).call(this,e),(t=!o||"object"!==I(o)&&"function"!=typeof o?z(r):o).connectionText="Connecting...",t.updateText=t.updateText.bind(z(z(t))),c({url:e.url},function(e){t.currentStatus=e,t.updateText(e),t._mounted&&t.forceUpdate()}),t}var t,r,i;return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),n&&A(e,n)}(n,o.a.Component),t=n,(r=[{key:"updateText",value:function(e){var n="Connecting...";e.connected?(n="Connected!",e.data&&(n+=" got data")):n="Disconnected!",e.reconnecting&&(n="Reconnecting..."),this.connectionText=n}},{key:"componentDidMount",value:function(){this._mounted=!0}},{key:"componentWillUnmount",value:function(){this._mounted=!1}},{key:"render",value:function(){var e=this.currentStatus,n=e.connected,t=e.reconnecting,r=e.connecting,i=n?J:U,c=t||r;return[].concat(D(this.props.children),[o.a.createElement("div",{key:"cmslink-status",className:"connection-status"},o.a.createElement("span",{className:"status-icon"+(c?" spinning":"")},i),o.a.createElement("span",null,this.connectionText))])}}])&&N(t.prototype,r),i&&N(t,i),n}();function F(e){return(F="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function R(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function V(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function B(e){return(B=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function q(e,n){return(q=Object.setPrototypeOf||function(e,n){return e.__proto__=n,e})(e,n)}function H(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}t.d(n,"isOfType",function(){return X}),t.d(n,"isNotOfType",function(){return Y}),t.d(n,"routeSelector",function(){return G}),t.d(n,"withLinkSelector",function(){return Q}),t.d(n,"renderMergedProps",function(){return l}),t.d(n,"componentRegistry",function(){return d}),t.d(n,"setEditComponent",function(){return h}),t.d(n,"setEditorLink",function(){return y}),t.d(n,"createLinkWrapper",function(){return x}),t.d(n,"LinkedComponent",function(){return S}),t.d(n,"CMSLink",function(){return W});var G=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"id";return function(n){if(n.match&&n.match.params)return n.match.params[e]}},K=G("test");console.log(K);var Q=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:G(),t=arguments.length>2?arguments[2]:void 0;return function(r){function i(e){var t,r,o;return function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,i),r=this,(t=!(o=B(i).call(this,e))||"object"!==F(o)&&"function"!=typeof o?H(r):o).linkId=n(e),t.scrollToTop=t.scrollToTop.bind(H(H(t))),t}var c,u,a;return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),n&&q(e,n)}(i,o.a.Component),c=i,(u=[{key:"componentDidUpdate",value:function(e){var r=n(this.props);r!=n(e)&&(this.linkId=r,t&&t(r),this.forceUpdate(),this.scrollToTop())}},{key:"scrollToTop",value:function(){window.scrollTo({top:0,left:0,behavior:"smooth"})}},{key:"render",value:function(){var n=function(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{},r=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(t).filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.forEach(function(n){R(e,n,t[n])})}return e}({},this.props,{id:this.linkId});return o.a.createElement(e,n)}}])&&V(c.prototype,u),a&&V(c,a),i}()},X=function(e){return function(n){return n.type==e}},Y=function(e){return function(n){return n.type!=e}}}]);