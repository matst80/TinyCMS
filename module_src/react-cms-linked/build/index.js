module.exports=function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=2)}([function(e,n){e.exports=require("react")},function(e,n){var t=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e};!function(e){var n={};e.cmslink=n;var o=function(){try{var e=localStorage.getItem("__nodes");if(e&&e.length)return JSON.parse(e)}catch(e){return console.log("load error"),{}}};n.createLink=function(r,i){var c=r.url,u=new WebSocket(c),a=o()||{},s={},f=function(e){"function"==typeof i&&i(e)},l=function(e,n){var t=s[e];t&&t.forEach(function(e){e.stopped||e.callback(n)})},p=!1,d=void 0,h=500,y=function(){console.warn("requesting reconnect"),f({connected:p=!1,reconnecting:!0}),d&&clearTimeout(d),d=setTimeout(function(){u=null,u=new WebSocket(c),m()},h+=500)},b=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:200;f(t({},e,{connected:p})),setTimeout(function(){f({connected:p})},n)},m=function(){f({connecting:!0,connected:p}),u.onopen=function(e){h=500,f({connected:p=!0}),console.log("sending token",w),u.send("##"+w+"##"),u.send("?root"),g()},u.onerror=y,u.onclose=y,u.onmessage=function(e){b({data:!0}),function e(n){var t=n.id,o=n.children;t&&(a[t]=n,l(t,n)),o&&o.map(function(n){return e(n)})}(JSON.parse(e.data))}},v=[],g=function e(){if(v.length&&p){var n=v.shift();b({sending:!0}),u.send(n),e()}},k=function(e){v.push(e),g()},O={fakeNode:function(e){console.log("render temp node",e),l(e.id,t({},e,{__fake:!0}))},send:k,getById:function(e){k("?"+e)},listenTo:function(e,n){var t={id:e,stopped:!1,stop:function(){t.stopped=!0},resume:function(){t.stopped=!1},remove:function(){var n=s[e].indexOf(t);s[e].splice(n,1)},callback:n};return s[e]?s[e].push(t):s[e]=[t],a[e]&&o.children?t.stopped||n(a[e]):k("?"+e),t}},w=n.getToken().token;return n.onAuthenticationChanged(function(e){e&&e.token&&(w=e.token),k("!!"+w+"!!")}),m(),e.currentLink=O,O},n.getCurrentLink=function(){return e.currentLink};var r=[],i={},c=localStorage.getItem("_cmsState");c&&c.length&&(i=JSON.parse(c)),n.sessionChanged=function(e){var n={stopped:!1,stop:function(){n.stopped=!0},resume:function(){n.stopped=!1},remove:function(){var e=r.indexOf(n);r.splice(e,1)},callback:e};return r.push(n),setTimeout(function(){e(i)},10),n};n.setSession=function(e){"function"==typeof e&&(e=e(i)),function(e){i=e,r.forEach(function(n){var t=n.stopped,o=n.callback;t||o(e)})}(t({},i,e))},n.schemaHelper={getSchema:function(e){return fetch("/nodeschema/"+e).then(function(e){return e.json()})},getAll:function(){return fetch("/nodeschema/").then(function(e){return e.json()})}};var u=function(e){return console.log("handle user auth status",e),e&&e.token&&localStorage.setItem("currentUserToken",e.token),a(e.token),e};n.getToken=function(){var e=localStorage.getItem("currentUserToken");return a(e)};var a=function(e){var n={valid:!1};if(e&&e.length){var t=e.split("."),o=atob(t[0]),r=JSON.parse(o),i=atob(t[1]),c=JSON.parse(i);n={valid:c.exp>Date.now()/1e3,header:r,data:c,token:e}}return s(n),n},s=function(e){p!==e.valid&&(p=e.valid,f.map(function(n){return n(e)}))},f=[],l=!1,p=!1;n.onAuthenticationChanged=function(e){-1===f.indexOf(e)&&f.push(e),e(n.getToken()),l||(l=!0,setInterval(function(){n.hasValidToken()},36e5))},n.isAdmin=function(){return n.hasValidToken()},n.hasValidToken=function(){return n.getToken().valid},n.signInWithToken=function(e){return fetch("/api/signInWithToken/",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:e})}).then(function(e){return e.json()}).then(u)}}(window)},function(e,n,t){"use strict";t.r(n);var o=t(0),r=t.n(o);const i=function(){return window.cmslink||t(1),window.cmslink},c=i().createLink,u=i().getCurrentLink,a=(i().hasValidToken,i().onAuthenticationChanged,i().schemaHelper,i().sessionChanged);i().setSession,i().signInWithToken;function s(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}var f,l=function(e){for(var n=arguments.length,t=new Array(n>1?n-1:0),o=1;o<n;o++)t[o-1]=arguments[o];var i=Object.assign.apply(Object,[{}].concat(t));return r.a.createElement(e,i)},p={},d=(f=p,{setComponents:function(e){for(var n in e)f[n]=e[n]},getComponents:function(){return p},getComponent:function(e,n){var t=f[e];if(t)return r.a.createElement(t,function(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{},o=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(t).filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.forEach(function(n){s(e,n,t[n])})}return e}({},n));throw"component not found:"+e},getValue:function(e){return f[e]},hasComponent:function(e){return e.type?!!f[e.type]:!!f[e]}}),h=function(e,n){window.currentEditorLink&&window.currentEditorLink(e,n)},y=function(e){window.currentEditorLink=e};function b(e){return(b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function m(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{},o=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(t).filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.forEach(function(n){v(e,n,t[n])})}return e}function v(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function g(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function k(e){return(k=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function O(e,n){return(O=Object.setPrototypeOf||function(e,n){return e.__proto__=n,e})(e,n)}function w(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var S=function(e){function n(e){var t,o,r;!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,n),o=this,r=k(n).call(this,e),(t=!r||"object"!==b(r)&&"function"!=typeof r?w(o):r).linked={},t.gotLinkData=t.gotLinkData.bind(w(w(t))),t.renderChildren=t.renderChildren.bind(w(w(t))),t.setupListener=t.setupListener.bind(w(w(t))),t.isChanged=t.isChanged.bind(w(w(t))),t.connect=t.connect.bind(w(w(t))),t.filterProperties=t.filterProperties.bind(w(w(t))),t.delete=t.delete.bind(w(w(t))),t.connect=t.connect.bind(w(w(t))),t.fakeSend=t.fakeSend.bind(w(w(t))),t.store=t.store.bind(w(w(t))),t.resumeLink=t.resumeLink.bind(w(w(t))),t.stopLink=t.stopLink.bind(w(w(t)));var i=e.id;return i&&t.setupListener(i),t._stateListener=a(function(e){try{var n=t.sessionFilter?t.sessionFilter(e):m({},e);t.isChanged(t.sessionData,n)&&(t.sessionData=n,t._mounted&&t.forceUpdate())}catch(e){console.warn("set session failed",e)}}),t}var t,o,i;return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),n&&O(e,n)}(n,r.a.Component),t=n,(o=[{key:"gotLinkData",value:function(e){var n=this.filterProperties(e);this.isChanged(this.linked,n)&&(this.linked=n,this._mounted&&this.forceUpdate())}},{key:"renderChildren",value:function(){var e=this.linked.children;return(void 0===e?[]:e).filter(d.hasComponent).map(function(e){var n=e.id,t=e.type;return d.getComponent(t,{key:n,id:n})})}},{key:"setupListener",value:function(e,n){this._listener&&this._listener.remove(),this.linkedId=e,this.linked={},this._listener=u().listenTo(e,n||this.gotLinkData)}},{key:"isChanged",value:function(e,n){return function(e,n){return e!==n&&(void 0===e&&void 0!==n||void 0===n&&void 0!==e||JSON.stringify(e)!==JSON.stringify(n))}(e,n)}},{key:"connect",value:function(e){this.filterFunction=e}},{key:"filterProperties",value:function(e){return this.filterFunction?this.filterFunction(e):e}},{key:"delete",value:function(){var e=JSON.stringify({id:this.linkedId});u().send("-".concat(e))}},{key:"fakeSend",value:function(e){var n=this.linkedId;u().fakeNode(m({id:n},this.linked,e))}},{key:"store",value:function(e,n){var t=this.linkedId,o=n?e:m({id:t},e),r=JSON.stringify(o),i=n?"+":"=";u().send("".concat(i).concat(r))}},{key:"resumeLink",value:function(){this._mounted=!0,this._listener&&this._listener.resume(),this._stateListener&&this._stateListener.resume()}},{key:"stopLink",value:function(){this._mounted=!1,this._listener&&this._listener.stop(),this._stateListener&&this._stateListener.stop()}},{key:"render",value:function(){return r.a.createElement("div",null,children)}},{key:"componentDidMount",value:function(){this.resumeLink()}},{key:"componentWillUnmount",value:function(){this.stopLink()}}])&&g(t.prototype,o),i&&g(t,i),n}();function j(e){arguments.length>1&&void 0!==arguments[1]&&arguments[1],arguments.length>2&&void 0!==arguments[2]&&arguments[2],arguments.length>3&&void 0!==arguments[3]&&arguments[3];if("function"!=typeof e&&null!==e)return null;return ret}function _(e){return(_="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function T(e){return function(e){if(Array.isArray(e)){for(var n=0,t=new Array(e.length);n<e.length;n++)t[n]=e[n];return t}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function P(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function C(e){return(C=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function L(e,n){return(L=Object.setPrototypeOf||function(e,n){return e.__proto__=n,e})(e,n)}function E(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var x=r.a.createElement("svg",{style:{width:20,height:20},"aria-hidden":"true",role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 640 512"},r.a.createElement("path",{fill:"currentColor",d:"M634.91 154.88C457.74-8.99 182.19-8.93 5.09 154.88c-6.66 6.16-6.79 16.59-.35 22.98l34.24 33.97c6.14 6.1 16.02 6.23 22.4.38 145.92-133.68 371.3-133.71 517.25 0 6.38 5.85 16.26 5.71 22.4-.38l34.24-33.97c6.43-6.39 6.3-16.82-.36-22.98zM320 352c-35.35 0-64 28.65-64 64s28.65 64 64 64 64-28.65 64-64-28.65-64-64-64zm202.67-83.59c-115.26-101.93-290.21-101.82-405.34 0-6.9 6.1-7.12 16.69-.57 23.15l34.44 33.99c6 5.92 15.66 6.32 22.05.8 83.95-72.57 209.74-72.41 293.49 0 6.39 5.52 16.05 5.13 22.05-.8l34.44-33.99c6.56-6.46 6.33-17.06-.56-23.15z"})),I=r.a.createElement("svg",{style:{width:20,height:20},"aria-hidden":"true",role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512"},r.a.createElement("path",{fill:"currentColor",d:"M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"})),N=function(e){function n(e){var t,o,r;return function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,n),o=this,r=C(n).call(this,e),(t=!r||"object"!==_(r)&&"function"!=typeof r?E(o):r).connectionText="Connecting...",t.updateText=t.updateText.bind(E(E(t))),c({url:e.url},function(e){t.currentStatus=e,t.updateText(e),t._mounted&&t.forceUpdate()}),t}var t,o,i;return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),n&&L(e,n)}(n,r.a.Component),t=n,(o=[{key:"updateText",value:function(e){var n="Connecting...";e.connected?(n="Connected!",e.data&&(n+=" got data")):n="Disconnected!",e.reconnecting&&(n="Reconnecting..."),this.connectionText=n}},{key:"componentDidMount",value:function(){this._mounted=!0}},{key:"componentWillUnmount",value:function(){this._mounted=!1}},{key:"render",value:function(){var e=this.currentStatus,n=e.connected,t=e.reconnecting,o=e.connecting,i=n?x:I,c=t||o;return[].concat(T(this.props.children),[r.a.createElement("div",{key:"cmslink-status",className:"connection-status"},r.a.createElement("span",{className:"status-icon"+(c?" spinning":"")},i),r.a.createElement("span",null,this.connectionText))])}}])&&P(t.prototype,o),i&&P(t,i),n}();function D(e){return(D="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function M(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function A(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function z(e){return(z=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function J(e,n){return(J=Object.setPrototypeOf||function(e,n){return e.__proto__=n,e})(e,n)}function U(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}t.d(n,"isOfType",function(){return R}),t.d(n,"isNotOfType",function(){return V}),t.d(n,"routeSelector",function(){return W}),t.d(n,"withLinkSelector",function(){return F}),t.d(n,"renderMergedProps",function(){return l}),t.d(n,"componentRegistry",function(){return d}),t.d(n,"setEditComponent",function(){return h}),t.d(n,"setEditorLink",function(){return y}),t.d(n,"createLinkWrapper",function(){return j}),t.d(n,"LinkedComponent",function(){return S}),t.d(n,"CMSLink",function(){return N});var W=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"id";return function(n){if(n.match&&n.match.params)return n.match.params[e]}},F=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:W(),t=arguments.length>2?arguments[2]:void 0;return function(o){function i(e){var t,o,r;return function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,i),o=this,(t=!(r=z(i).call(this,e))||"object"!==D(r)&&"function"!=typeof r?U(o):r).linkId=n(e),t.scrollToTop=t.scrollToTop.bind(U(U(t))),t}var c,u,a;return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),n&&J(e,n)}(i,r.a.Component),c=i,(u=[{key:"componentDidUpdate",value:function(e){var o=n(this.props);o!=n(e)&&(this.linkId=o,this.scrollToTop(),t&&t(o),this.forceUpdate())}},{key:"scrollToTop",value:function(){window.scrollTo({top:0,left:0,behavior:"smooth"})}},{key:"render",value:function(){var n=function(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{},o=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(t).filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.forEach(function(n){M(e,n,t[n])})}return e}({},this.props,{id:this.linkId});return r.a.createElement(e,n)}}])&&A(c.prototype,u),a&&A(c,a),i}()},R=function(e){return function(n){return n.type==e}},V=function(e){return function(n){return n.type!=e}}}]);