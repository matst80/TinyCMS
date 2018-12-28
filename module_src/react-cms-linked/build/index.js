module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _cmslink = __webpack_require__(3);

var _connection = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var compare = function compare(a, b) {
    if (a === b) return false;
    if (a === undefined && b !== undefined) return true;
    if (b === undefined && a !== undefined) return true;
    return JSON.stringify(a) !== JSON.stringify(b);
};

var LinkedComponent = function (_React$Component) {
    _inherits(LinkedComponent, _React$Component);

    function LinkedComponent(props, linkId) {
        _classCallCheck(this, LinkedComponent);

        var _this = _possibleConstructorReturn(this, (LinkedComponent.__proto__ || Object.getPrototypeOf(LinkedComponent)).call(this, props));

        _this.linked = {};

        _this.gotLinkData = _this.gotLinkData.bind(_this);
        _this.renderChildren = _this.renderChildren.bind(_this);
        _this.setupListener = _this.setupListener.bind(_this);
        _this.isChanged = _this.isChanged.bind(_this);
        _this.connect = _this.connect.bind(_this);
        _this.filterProperties = _this.filterProperties.bind(_this);
        _this.delete = _this.delete.bind(_this);
        _this.connect = _this.connect.bind(_this);
        _this.fakeSend = _this.fakeSend.bind(_this);
        _this.store = _this.store.bind(_this);
        _this.resumeLink = _this.resumeLink.bind(_this);
        _this.stopLink = _this.stopLink.bind(_this);

        var idToWatch = props.id;
        if (typeof linkId === "string") idToWatch = linkId;
        if (idToWatch) {
            _this.setupListener(idToWatch);
        }
        _this._stateListener = (0, _cmslink.sessionChanged)(function (session) {
            try {
                var sessionData = _this.sessionFilter ? _this.sessionFilter(session) : _extends({}, session);
                if (_this.isChanged(_this.sessionData, sessionData)) {
                    _this.sessionData = sessionData;
                    if (_this._mounted) _this.forceUpdate();
                }
            } catch (err) {
                console.warn('set session failed', err);
            }
        });

        return _this;
    }

    _createClass(LinkedComponent, [{
        key: 'gotLinkData',
        value: function gotLinkData(data) {
            var linkedData = this.filterProperties(data);
            if (this.isChanged(this.linked, linkedData)) {
                this.linked = linkedData;
                if (this._mounted) this.forceUpdate();
            }
        }
    }, {
        key: 'renderChildren',
        value: function renderChildren() {
            var _linked$children = this.linked.children,
                children = _linked$children === undefined ? [] : _linked$children;

            return children.filter(_connection.componentRegistry.hasComponent).map(function (_ref) {
                var id = _ref.id,
                    type = _ref.type;
                return _connection.componentRegistry.getComponent(type, { key: id, id: id });
            });
        }
    }, {
        key: 'setupListener',
        value: function setupListener(id, customCallback) {
            this._listener && this._listener.remove();
            this.linkedId = id;
            this.linked = {};
            this._listener = (0, _cmslink.getCurrentLink)().listenTo(id, customCallback || this.gotLinkData);
        }
    }, {
        key: 'isChanged',
        value: function isChanged(a, b) {
            return compare(a, b);
        }
    }, {
        key: 'connect',
        value: function connect(filterFunction) {
            this.filterFunction = filterFunction;
        }
    }, {
        key: 'filterProperties',
        value: function filterProperties(props) {
            if (this.filterFunction) return this.filterFunction(props);
            return props;
        }
    }, {
        key: 'delete',
        value: function _delete() {
            var jsonData = JSON.stringify({ id: this.linkedId });
            (0, _cmslink.getCurrentLink)().send('-' + jsonData);
        }
    }, {
        key: 'fakeSend',
        value: function fakeSend(newValue) {
            var idToWatch = this.linkedId;
            (0, _cmslink.getCurrentLink)().fakeNode(_extends({ id: idToWatch }, this.linked, newValue));
        }
    }, {
        key: 'store',
        value: function store(valueObject, isNew) {
            var idToWatch = this.linkedId;
            var sendObject = isNew ? valueObject : _extends({ id: idToWatch }, valueObject);
            var jsonData = JSON.stringify(sendObject);
            var command = isNew ? '+' : '=';
            (0, _cmslink.getCurrentLink)().send('' + command + jsonData);
        }
    }, {
        key: 'resumeLink',
        value: function resumeLink() {
            this._mounted = true;
            this._listener && this._listener.resume();
            this._stateListener && this._stateListener.resume();
        }
    }, {
        key: 'stopLink',
        value: function stopLink() {
            this._mounted = false;
            this._listener && this._listener.stop();
            this._stateListener && this._stateListener.stop();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.resumeLink();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.stopLink();
        }
    }]);

    return LinkedComponent;
}(_react2.default.Component);

exports.default = LinkedComponent;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setEditorLink = exports.setEditComponent = exports.componentRegistry = exports.renderMergedProps = undefined;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderMergedProps = exports.renderMergedProps = function renderMergedProps(component) {
    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
    }

    var finalProps = Object.assign.apply(Object, [{}].concat(rest));
    return _react2.default.createElement(component, finalProps);
};

var registeredComponents = {};

var componentRegistry = exports.componentRegistry = function (registry) {
    return {
        setComponents: function setComponents(templates) {
            for (var key in templates) {
                registry[key] = templates[key];
            }
        },
        getComponent: function getComponent(type, props) {
            return renderMergedProps(registry[type], props);
        },
        getValue: function getValue(type) {
            return registry[type];
        },
        hasComponent: function hasComponent(data) {
            if (data.type) return !!registry[data.type];
            return !!registry[data];
        }
    };
}(registeredComponents);

var setEditComponent = exports.setEditComponent = function setEditComponent(element, id) {
    if (window.currentEditorLink) window.currentEditorLink(element, id);
};

var setEditorLink = exports.setEditorLink = function setEditorLink(callback) {
    window.currentEditorLink = callback;
};

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });



const getLink = function () {
    if (!window.cmslink) {
        __webpack_require__(6);
    }
    return window.cmslink;
}

console.log('linking', window.cmslink);

const createLink = getLink().createLink;
/* harmony export (immutable) */ __webpack_exports__["createLink"] = createLink;

const getCurrentLink = getLink().getCurrentLink;
/* harmony export (immutable) */ __webpack_exports__["getCurrentLink"] = getCurrentLink;

const hasValidToken = getLink().hasValidToken;
/* harmony export (immutable) */ __webpack_exports__["hasValidToken"] = hasValidToken;

const onAuthenticationChanged = getLink().onAuthenticationChanged;
/* harmony export (immutable) */ __webpack_exports__["onAuthenticationChanged"] = onAuthenticationChanged;

const schemaHelper = getLink().schemaHelper;
/* harmony export (immutable) */ __webpack_exports__["schemaHelper"] = schemaHelper;

const sessionChanged = getLink().sessionChanged;
/* harmony export (immutable) */ __webpack_exports__["sessionChanged"] = sessionChanged;

const setSession = getLink().setSession;
/* harmony export (immutable) */ __webpack_exports__["setSession"] = setSession;

const signInWithToken = getLink().signInWithToken;
/* harmony export (immutable) */ __webpack_exports__["signInWithToken"] = signInWithToken;




/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _cmslink = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var wifiIcon = _react2.default.createElement(
    'svg',
    { style: { width: 20, height: 20 }, 'aria-hidden': 'true', role: 'img', xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 640 512' },
    _react2.default.createElement('path', { fill: 'currentColor', d: 'M634.91 154.88C457.74-8.99 182.19-8.93 5.09 154.88c-6.66 6.16-6.79 16.59-.35 22.98l34.24 33.97c6.14 6.1 16.02 6.23 22.4.38 145.92-133.68 371.3-133.71 517.25 0 6.38 5.85 16.26 5.71 22.4-.38l34.24-33.97c6.43-6.39 6.3-16.82-.36-22.98zM320 352c-35.35 0-64 28.65-64 64s28.65 64 64 64 64-28.65 64-64-28.65-64-64-64zm202.67-83.59c-115.26-101.93-290.21-101.82-405.34 0-6.9 6.1-7.12 16.69-.57 23.15l34.44 33.99c6 5.92 15.66 6.32 22.05.8 83.95-72.57 209.74-72.41 293.49 0 6.39 5.52 16.05 5.13 22.05-.8l34.44-33.99c6.56-6.46 6.33-17.06-.56-23.15z' })
);
var spinnerIcon = _react2.default.createElement(
    'svg',
    { style: { width: 20, height: 20 }, 'aria-hidden': 'true', role: 'img', xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 512 512' },
    _react2.default.createElement('path', { fill: 'currentColor', d: 'M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z' })
);

var CMSLink = function (_React$Component) {
    _inherits(CMSLink, _React$Component);

    function CMSLink(props) {
        _classCallCheck(this, CMSLink);

        var _this = _possibleConstructorReturn(this, (CMSLink.__proto__ || Object.getPrototypeOf(CMSLink)).call(this, props));

        _this.connectionText = 'Connecting...';
        _this.updateText = _this.updateText.bind(_this);
        (0, _cmslink.createLink)({ url: props.url }, function (data) {
            _this.currentStatus = data;
            _this.updateText(data);
            if (_this._mounted) _this.forceUpdate();
        });
        return _this;
    }

    _createClass(CMSLink, [{
        key: 'updateText',
        value: function updateText(data) {
            var text = 'Connecting...';
            if (data.connected) {
                text = 'Connected!';
                if (data.data) {
                    text += ' got data';
                }
            } else {
                text = 'Disconnected!';
            }
            if (data.reconnecting) text = 'Reconnecting...';
            this.connectionText = text;
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this._mounted = true;
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this._mounted = false;
        }
    }, {
        key: 'render',
        value: function render() {
            var _currentStatus = this.currentStatus,
                connected = _currentStatus.connected,
                reconnecting = _currentStatus.reconnecting,
                connecting = _currentStatus.connecting;

            var icon = connected ? wifiIcon : spinnerIcon;
            var spinning = reconnecting || connecting;
            return [].concat(_toConsumableArray(this.props.children), [_react2.default.createElement(
                'div',
                { key: 'cmslink-status', className: 'connection-status' },
                _react2.default.createElement(
                    'span',
                    { className: "status-icon" + (spinning ? ' spinning' : '') },
                    icon
                ),
                _react2.default.createElement(
                    'span',
                    null,
                    this.connectionText
                )
            )]);
        }
    }]);

    return CMSLink;
}(_react2.default.Component);

exports.default = CMSLink;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createLinkWrapper = createLinkWrapper;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _LinkedComponent2 = __webpack_require__(1);

var _LinkedComponent3 = _interopRequireDefault(_LinkedComponent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function createLinkWrapper(WrappedComponent) {
    var connect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
        return {};
    };
    var connectState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
        return {};
    };
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { children: true };

    return function (_LinkedComponent) {
        _inherits(_class, _LinkedComponent);

        function _class(props) {
            _classCallCheck(this, _class);

            var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

            _this.sessionFilter = connectState;
            _this.filterFunction = function (data) {
                return options.children ? _extends({}, connect(data), { children: data.children }) : connect(data);
            };
            return _this;
        }

        _createClass(_class, [{
            key: "render",
            value: function render() {

                var props = _extends({}, this.sessionData, this.props, this.linked);

                if (options.children) {
                    props.children = this.renderChildren();
                }
                return _react2.default.createElement(WrappedComponent, props);
            }
        }]);

        return _class;
    }(_LinkedComponent3.default);
}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

(function (win) {

    var w = {};

    win.cmslink = w;

    var cachedData = function cachedData() {
        try {
            var data = localStorage.getItem('__nodes');
            if (data && data.length) return JSON.parse(data);
        } catch (err) {
            console.log('load error');
            return {};
        }
    };

    var setCache = function setCache(nodes) {
        localStorage.setItem('__nodes', JSON.stringify(nodes));
    };

    w.createLink = function (settings, onStatusChange) {
        var url = settings.url;

        var socket = new WebSocket(url);
        var nodeCache = cachedData() || {};

        var listeners = {};

        var triggerStatusChange = function triggerStatusChange(data) {
            if (typeof onStatusChange === 'function') onStatusChange(data);
        };

        var triggerListeners = function triggerListeners(id, data) {
            var listenersForId = listeners[id];
            if (listenersForId) listenersForId.forEach(function (listener) {
                if (!listener.stopped) {
                    listener.callback(data);
                }
            });
        };

        var parseNodesToCache = function parseNodesToCache(data) {
            var id = data.id,
                children = data.children;

            if (id) {
                nodeCache[id] = data;
                triggerListeners(id, data);
            }
            if (children) {
                children.map(function (child) {
                    return parseNodesToCache(child, id);
                });
            }
        };

        var connected = false;
        var tryingToConnect = void 0;
        var reconnectTime = 500;

        var reconnect = function reconnect() {
            console.warn('requesting reconnect');
            connected = false;
            triggerStatusChange({ connected: connected, reconnecting: true });
            if (tryingToConnect) clearTimeout(tryingToConnect);
            tryingToConnect = setTimeout(function () {

                socket = null;
                socket = new WebSocket(url);
                connect();
            }, reconnectTime += 500);
        };

        var debounceStatus = function debounceStatus(data) {
            var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;

            triggerStatusChange(_extends({}, data, { connected: connected }));
            setTimeout(function () {
                triggerStatusChange({ connected: connected });
            }, time);
        };

        var connect = function connect() {
            triggerStatusChange({ connecting: true, connected: connected });
            socket.onopen = function (event) {
                reconnectTime = 500;
                connected = true;
                triggerStatusChange({ connected: connected });
                console.log('sending token', lastToken);
                socket.send('##' + lastToken + '##');
                socket.send('?root');
                sendToServer();
                // Object.keys(nodeCache).forEach((cachedId) => {
                //     if (cachedId !== "root")
                //         send('?' + cachedId);
                // });
            };
            socket.onerror = reconnect;
            socket.onclose = reconnect;
            socket.onmessage = function (event) {
                debounceStatus({ data: true });

                var jsonData = JSON.parse(event.data);

                parseNodesToCache(jsonData);
                setCache(nodeCache);
            };
        };

        var queue = [];

        var sendToServer = function sendToServer() {
            if (queue.length && connected) {
                var toSend = queue.shift();
                debounceStatus({ sending: true });
                socket.send(toSend);
                sendToServer();
            }
        };

        var send = function send(data) {
            queue.push(data);
            sendToServer();
        };

        var fakeNode = function fakeNode(node) {
            console.log('render temp node', node);
            triggerListeners(node.id, _extends({}, node, { __fake: true }));
        };

        var ret = {
            fakeNode: fakeNode,
            send: send,
            getById: function getById(id) {
                send('?' + id);
            },
            listenTo: function listenTo(id, callback) {
                var ret = {
                    id: id,
                    stopped: false,
                    stop: function stop() {
                        ret.stopped = true;
                    },
                    resume: function resume() {
                        ret.stopped = false;
                    },
                    remove: function remove() {
                        var idx = listeners[id].indexOf(ret);
                        listeners[id].splice(idx, 1);
                    },
                    callback: callback
                };
                if (!listeners[id]) {
                    listeners[id] = [ret];
                } else listeners[id].push(ret);
                if (nodeCache[id]) {
                    if (!ret.stopped) callback(nodeCache[id]);
                } else send('?' + id);
                return ret;
            }
        };

        var lastToken = w.getToken().token;

        w.onAuthenticationChanged(function (data) {
            if (data && data.token) lastToken = data.token;
            send('!!' + lastToken + '!!');
        });

        connect();

        win.currentLink = ret;
        return ret;
    };

    w.getCurrentLink = function () {
        return win.currentLink;
    };

    var storageKey = '_cmsState';
    var sessionListeners = [];

    var currentState = {};
    var storedSessionString = localStorage.getItem(storageKey);
    if (storedSessionString && storedSessionString.length) {
        currentState = JSON.parse(storedSessionString);
    }

    w.sessionChanged = function (callback) {
        var ret = {
            stopped: false,
            stop: function stop() {
                ret.stopped = true;
            },
            resume: function resume() {
                ret.stopped = false;
            },
            remove: function remove() {
                var idx = sessionListeners.indexOf(ret);
                sessionListeners.splice(idx, 1);
            },
            callback: callback
        };
        sessionListeners.push(ret);
        setTimeout(function () {
            callback(currentState);
        }, 10);
        return ret;
    };

    var triggerSessionChange = function triggerSessionChange(data) {
        currentState = data;
        sessionListeners.forEach(function (_ref) {
            var stopped = _ref.stopped,
                callback = _ref.callback;

            if (!stopped) callback(data);
        });
        localStorage.setItem(storageKey, JSON.stringify(data));
    };
    w.setSession = function (data) {
        if (typeof data == 'function') {
            data = data(currentState);
        }
        var newSession = _extends({}, currentState, data);

        triggerSessionChange(newSession);
    };

    w.schemaHelper = {
        getSchema: function getSchema(type) {
            return fetch('/api/schema/' + type + '/').then(function (res) {
                return res.json();
            });
        },
        getAll: function getAll() {
            return fetch('/api/schema/').then(function (res) {
                return res.json();
            });
        }
    };

    var handleUserWithToken = function handleUserWithToken(user) {
        console.log('handle user auth status', user);
        if (user && user.token) {
            localStorage.setItem('currentUserToken', user.token);
        }
        isValidToken(user.token);
        return user;
    };

    w.getToken = function () {
        var token = localStorage.getItem('currentUserToken');
        return isValidToken(token);
    };

    var isValidToken = function isValidToken(token) {
        var ret = { valid: false };
        if (token && token.length) {
            var parts = token.split('.');
            var decodedHeader = atob(parts[0]);
            var header = JSON.parse(decodedHeader);
            var decodedData = atob(parts[1]);
            var data = JSON.parse(decodedData);
            //console.log(data, data.exp, (Date.now() / 1000));
            ret = { valid: data.exp > Date.now() / 1000, header: header, data: data, token: token };
        }
        compareAuthState(ret);
        return ret;
    };

    var compareAuthState = function compareAuthState(newState) {
        if (lastState !== newState.valid) {
            lastState = newState.valid;
            authListeners.map(function (cb) {
                return cb(newState);
            });
        }
    };

    var authListeners = [];
    var hasStartedListener = false;
    var lastState = false;

    w.onAuthenticationChanged = function (onAuthChanged) {
        if (authListeners.indexOf(onAuthChanged) === -1) authListeners.push(onAuthChanged);
        onAuthChanged(w.getToken());
        if (!hasStartedListener) {
            hasStartedListener = true;
            setInterval(function () {
                w.hasValidToken();
            }, 3600 * 1000);
        }
    };

    w.isAdmin = function () {
        return w.hasValidToken();
    };

    w.hasValidToken = function () {
        return w.getToken().valid;
    };

    w.signInWithToken = function (token) {
        return fetch('/api/signInWithToken/', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token })
        }).then(function (d) {
            return d.json();
        }).then(handleUserWithToken);
    };
})(window);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CMSLink = exports.LinkedComponent = exports.createLinkWrapper = exports.setEditorLink = exports.setEditComponent = exports.componentRegistry = exports.renderMergedProps = undefined;

var _createLinkWrapper = __webpack_require__(5);

var _CMSLink = __webpack_require__(4);

var _CMSLink2 = _interopRequireDefault(_CMSLink);

var _LinkedComponent = __webpack_require__(1);

var _LinkedComponent2 = _interopRequireDefault(_LinkedComponent);

var _connection = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.renderMergedProps = _connection.renderMergedProps;
exports.componentRegistry = _connection.componentRegistry;
exports.setEditComponent = _connection.setEditComponent;
exports.setEditorLink = _connection.setEditorLink;
exports.createLinkWrapper = _createLinkWrapper.createLinkWrapper;
exports.LinkedComponent = _LinkedComponent2.default;
exports.CMSLink = _CMSLink2.default;

/***/ })
/******/ ]);