var geeo =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.GeeoHTTP = exports.AirBeacon = exports.POI = exports.Agent = exports.View = exports.GeeoWS = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.debounce = debounce;

var _wolfy87Eventemitter = __webpack_require__(1);

var _wolfy87Eventemitter2 = _interopRequireDefault(_wolfy87Eventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function debounce(fn, delay) {
	var timer = null;
	return function () {
		var context = this,
		    args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function () {
			fn.apply(context, args);
		}, delay);
	};
}

/**
 * GeeoWS helps manage a Websocket connection to a Geeo instance.
 * 
 * Some GeeoWS connections allow the use of .view to watch objects, some allow the move() function, 
 * some allow the creation of POIs or AirBeacons, but some don't: it all depends on the capabilities offered
 * by the token used in GeeoWS#connect.
 * @extends EventEmitter
 * @property {Websocket} ws - the actual socket
 * @property {View} view - the view object
 */

var GeeoWS = exports.GeeoWS = function (_EventEmitter) {
	_inherits(GeeoWS, _EventEmitter);

	/**
  * Creates a new GeeoWS
  * @param {string} wsURL - the websocket URL connection string
  */
	function GeeoWS(wsURL) {
		_classCallCheck(this, GeeoWS);

		var _this = _possibleConstructorReturn(this, (GeeoWS.__proto__ || Object.getPrototypeOf(GeeoWS)).call(this));

		_this.wsURL = wsURL;
		_this.ws = null;
		_this.position = null;
		_this.view = new View(_this);
		return _this;
	}

	/**
  * Connect to the WS server with a JWT token
  * @param {string} token - a JWT token signed for the WS server
  * @fires GeeoWS#connect
  * @fires GeeoWS#error
  * @fires GeeoWS#viewUpdated
  * @fires GeeoWS#close
  */


	_createClass(GeeoWS, [{
		key: "connect",
		value: function connect(token) {
			this.ws = new WebSocket(this.wsURL + "?token=" + token);

			this.ws.onopen = function () {
				/**
     * Connect event when the websocket is connected
     * @event GeeoWS#connect
     */
				this.emit("connect");
			}.bind(this);
			this.ws.onerror = function (err) {
				/**
     * Error event when an error occurs on the websocket
     * @event GeeoWS#error
     */
				this.emit("error", err);
			}.bind(this);
			this.ws.onmessage = function (message) {
				var arr = JSON.parse(message.data);
				if (arr.error) {
					return this.emit("error", arr);
				}
				this.view._receiveMessage(arr);
				/**
     * Event sent when the view is updated
     * @event GeeoWS#viewUpdated
     */
				this.emit("viewUpdated");
			}.bind(this);
			this.ws.onclose = function (err) {
				/**
     * Close event when the websocket is closed
     * @event GeeoWS#close
     */
				this.emit("close", err);
			}.bind(this);
		}

		/**
   * Move the agent to a specific location
   * @param {number} lon - the longitude 
   * @param {number} lat - the latitude
   */

	}, {
		key: "move",
		value: function move(lon, lat) {
			this.position = [lon, lat];
			this.ws.send(JSON.stringify({ agentPosition: this.position }));
		}

		/**
   * Get the current agent location
   * @returns {number[]} an array with [lon, lat]
   */

	}, {
		key: "getPosition",
		value: function getPosition() {
			return this.position;
		}

		/**
   * Add a point of interest
   * @param {POI} poi - the point of interest to add
   */

	}, {
		key: "addPOI",
		value: function addPOI(poi) {
			this.ws.send(JSON.stringify({ createPOI: poi }));
		}

		/**
   * Remove a point of interest
   * @param {POI} poi - the point of interest to remove
   */

	}, {
		key: "removePOI",
		value: function removePOI(poi) {
			this.ws.send(JSON.stringify({ removePOI: poi }));
		}

		/**
   * Add an Air Beacon
   * @param {AirBeacon} ab - the air beacon to add
   */

	}, {
		key: "addAirBeacon",
		value: function addAirBeacon(ab) {
			this.ws.send(JSON.stringify({ createAirBeacon: ab }));
		}

		/**
   * Remove an Air Beacon
   * @param {AirBeacon} ab - the air beacon to remove
   */

	}, {
		key: "removeAirBeacon",
		value: function removeAirBeacon(ab) {
			this.ws.send(JSON.stringify({ removeAirBeacon: ab }));
		}

		/**
   * Close the WebSocket connection
   */

	}, {
		key: "close",
		value: function close() {
			this.ws.close();
		}
	}]);

	return GeeoWS;
}(_wolfy87Eventemitter2.default);

/**
 * View contains all the features related to the viewport.
 * You can use it only if your token allows it.
 * @extends EventEmitter
 */


var View = exports.View = function (_EventEmitter2) {
	_inherits(View, _EventEmitter2);

	/**
  * @private
  * @param {GeeoWS} parent 
  */
	function View(parent) {
		_classCallCheck(this, View);

		var _this2 = _possibleConstructorReturn(this, (View.__proto__ || Object.getPrototypeOf(View)).call(this));

		_this2.parent = parent;
		_this2.position = null;
		_this2.pois = {};
		_this2.agents = {};
		return _this2;
	}

	/**
  * Move the ViewPort
  * @param {number} lon1 the lower left point longitude
  * @param {number} lat1 the lower left point latitude
  * @param {number} lon2 the upper right point longitude
  * @param {number} lat2 the upper right point latitude
  */


	_createClass(View, [{
		key: "move",
		value: function move(lon1, lat1, lon2, lat2) {
			this.position = [lon1, lat1, lon2, lat2];
			this.parent.ws.send(JSON.stringify({ viewPosition: this.position }));
		}

		/**
   * Get the current Viewport
   * @returns {number[]} an array with [lon1, lat1, lon2, lat2]
   */

	}, {
		key: "getPosition",
		value: function getPosition() {
			return this.position;
		}

		/**
   * Returns all points of interest in the view
   * @returns {Array.POI} the array of pois
   */

	}, {
		key: "getPois",
		value: function getPois() {
			var result = [];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.pois[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _step$value = _slicedToArray(_step.value, 2),
					    k = _step$value[0],
					    v = _step$value[1];

					result.push(v);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return result;
		}

		/**
   * Returns all agents in the view
   * @returns {Array.Agent} the array of agents
   */

	}, {
		key: "getAgents",
		value: function getAgents() {
			var result = [];
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.agents[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var _step2$value = _slicedToArray(_step2.value, 2),
					    k = _step2$value[0],
					    v = _step2$value[1];

					result.push(v);
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			return result;
		}

		/** 
   * @private
   * @fires View#agentEntered
   * @fires View#agentMoved
   * @fires View#agentLeft
   * @fires View#poiEntered
   * @fires View#poiMoved
   * @fires View#poiLeft
   */

	}, {
		key: "_receiveMessage",
		value: function _receiveMessage(message) {
			var _this3 = this;

			message.forEach(function (update) {
				if (update.agent_id) {
					if (update.entered) {
						var agent = new Agent(update.agent_id, update.pos, update.publicData);
						_this3.agents[agent.id] = agent;
						/**
       * Event sent when a new agent becomes visible in the view
       * @event View#agentEntered
       * @type {Agent}
      	 * @property {string} id - the ID of the agent
      	 * @property {number[]} pos - the position of the agent as [lon, lat]
      	 * @property {Object} publicData - the public data of the agent 
       */
						_this3.emit("agentEntered", agent);
					} else if (update.left) {
						var _agent = _this3.agents[update.agent_id];
						/**
       * Event sent when an agent becomes invisible in the view
       * @event View#agentLeft
       * @type {Agent}
      	 * @property {string} id - the ID of the agent
      	 * @property {number[]} pos - the position of the agent as [lon, lat]
      	 * @property {Object} publicData - the public data of the agent 
       */
						_this3.emit("agentLeft", _agent);
						delete (_this3.agents, _agent.id);
					} else {
						var _agent2 = _this3.agents[update.agent_id];
						if (!_agent2) {
							console.log(update);
							return;
						}
						_agent2.pos = update.pos;
						/**
       * Event sent when an agent moves
       * @event View#agentMoved
       * @type {Agent}
      	 * @property {string} id - the ID of the agent
      	 * @property {number[]} pos - the position of the agent as [lon, lat]
      	 * @property {Object} publicData - the public data of the agent 
       */
						_this3.emit("agentMoved", _agent2);
					}
				} else if (update.poi_id) {
					if (update.entered && update.pos != undefined) {
						var poi = new POI(update.poi_id, update.pos, update.publicData, update.creator);
						_this3.pois[poi.id] = poi;
						/**
       * Event sent when a new POI becomes visible in the view
       * @event View#poiEntered
       * @type {POI}
       * @property {string} id - the ID of the POI
       * @property {number[]} pos - the position of the POI as [lon, lat]
      	 * @property {Object} publicData - the public data of the POI 
       * @property {string} creator - the ID of the creator of the POI
       */
						_this3.emit("poiEntered", poi);
					}
					if (update.left) {
						var _poi = _this3.pois[update.poi_id];
						/**
       * Event sent when a POI becomes invisible for the view
       * @event View#poiLeft
       * @type {POI}
       * @property {string} id - the ID of the POI
       * @property {number[]} pos - the position of the POI as [lon, lat]
      	 * @property {Object} publicData - the public data of the POI 
       * @property {string} creator - the ID of the creator of the POI
       */
						_this3.emit("poiLeft", _poi);
						delete (_this3.pois, _poi.id);
					}
				}
			});
		}
	}]);

	return View;
}(_wolfy87Eventemitter2.default);

/**
 * Agent models a transient moving agent
 * @property {string} id - the ID of the agent
 * @property {number[]} pos - the position of the agent as [lon, lat]
 * @property {Object} publicData - the public data of the agent 
 */


var Agent = exports.Agent = function Agent(id, pos, publicData) {
	_classCallCheck(this, Agent);

	this.id = id;
	this.pos = pos;
	this.publicData = publicData;
};

/**
 * POI models a persistent immovable point of interest
 * @property {string} id - the ID of the POI
 * @property {number[]} pos - the position of the POI as [lon, lat]
 * @property {Object} publicData - the public data of the POI 
 * @property {string} creator - the ID of the creator of the POI
 */


var POI = exports.POI = function POI(id, pos, publicData, creator) {
	_classCallCheck(this, POI);

	this.id = id;
	this.pos = pos;
	this.publicData = publicData;
	this.creator = creator;
};

/**
 * AirBeacon models a persistent immovable Air Beacon
 * @property {string} id - the ID of the AirBeacon
 * @property {number[]} pos - the position of the AirBeacon as [lon1, lat1, lon2, lat2]
 * @property {Object} publicData - the public data of the AirBeacon 
 * @property {string} creator - the ID of the creator of the AirBeacon
 */


var AirBeacon = exports.AirBeacon = function AirBeacon(id, pos, publicData, creator) {
	_classCallCheck(this, AirBeacon);

	this.id = id;
	this.pos = pos;
	this.publicData = publicData;
	this.creator = creator;
};

/**
 * GeeoHTTP let's you connect to the Geeo HTTP RESTful API
 */


var GeeoHTTP = exports.GeeoHTTP = function () {

	/**
  * Creates a new HTTP connection to Geeo
  * @param {string} httpURL - The HTTP endpoint URL
  */
	function GeeoHTTP(httpURL) {
		_classCallCheck(this, GeeoHTTP);

		this.httpURL = httpURL;
	}

	/**
  * Get a guest token from server. Only possible with development routes allowed
  * @param {string} agentId - The ID to use for the agent
  * @param {string} viewPortId - The ID to use for the viewport
  */


	_createClass(GeeoHTTP, [{
		key: "getGuestToken",
		value: function getGuestToken(agentId, viewPortId) {
			return fetch(this.httpURL + "/api/dev/token?viewId=" + viewPortId + "&agId=" + agentId).then(function (response) {
				if (response.ok) {
					return response.text();
				} else {
					throw new Error("Can't get JWT Token (status=" + response.status + ")");
				}
			});
		}

		/**
   * Create a new Point of Interest
   * @param {String} token - A JWT token with HTTP capability
   * @param {String} poi_id - The ID for the POI
   * @param {number[]} pos  - The coords of the POI
   * @param {Object} publicData - The public data
   * @param {String} creator - The creator id
   */

	}, {
		key: "createPOI",
		value: function createPOI(token, poi_id, pos, publicData, creator) {
			return fetch(this.httpURL + "/api/v1/poi", {
				headers: { "X-GEEO-TOKEN": token },
				method: 'POST',
				body: {
					poi_id: poi_id, pos: pos, publicData: publicData, creator: creator
				}
			}).then(function (response) {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error("Can't create POI");
				}
			});
		}

		/**
   * Delete a POI
   * @param {String} token - a JWT token with HTTP capability 
   * @param {String} poi_id - The ID of the poi to remove
   */

	}, {
		key: "deletePOI",
		value: function deletePOI(token, poi_id) {
			return fetch(this.httpURL + "/api/v1/poi", {
				headers: { "X-GEEO-TOKEN": token },
				method: 'DELETE',
				body: {
					poi_id: poi_id
				}
			}).then(function (response) {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error("Can't remove POI");
				}
			});
		}

		/**
   * Create a new Air Beacon
   * @param {String} token - A JWT token with HTTP capability
   * @param {String} ab_id - The ID for the AirBeacon
   * @param {number[]} pos  - The coords of the AirBeacon
   * @param {Object} publicData - The public data
   * @param {String} creator - The creator id
   */

	}, {
		key: "createAirBeacon",
		value: function createAirBeacon(token, ab_id, pos, publicData, creator) {
			return fetch(this.httpURL + "/api/v1/airbeacon", {
				headers: { "X-GEEO-TOKEN": token },
				method: 'POST',
				body: {
					ab_id: ab_id, pos: pos, publicData: publicData, creator: creator
				}
			}).then(function (response) {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error("Can't create AirBeacon");
				}
			});
		}

		/**
   * Delete an AirBeacon
   * @param {String} token - a JWT token with HTTP capability 
   * @param {String} ab_id - The ID of the AirBeacon to remove
   */

	}, {
		key: "deleteAirBeacon",
		value: function deleteAirBeacon(token, ab_id) {
			return fetch(this.httpURL + "/api/v1/airbeacon", {
				headers: { "X-GEEO-TOKEN": token },
				method: 'DELETE',
				body: {
					ab_id: ab_id
				}
			}).then(function (response) {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error("Can't remove AirBeacon");
				}
			});
		}
	}]);

	return GeeoHTTP;
}();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * EventEmitter v5.1.0 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

;(function (exports) {
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    function isValidListener (listener) {
        if (typeof listener === 'function' || listener instanceof RegExp) {
            return true
        } else if (listener && typeof listener === 'object') {
            return isValidListener(listener.listener)
        } else {
            return false
        }
    }

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        if (!isValidListener(listener)) {
            throw new TypeError('listener must be a function');
        }

        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listenersMap = this.getListenersAsObject(evt);
        var listeners;
        var listener;
        var i;
        var key;
        var response;

        for (key in listenersMap) {
            if (listenersMap.hasOwnProperty(key)) {
                listeners = listenersMap[key].slice(0);

                for (i = 0; i < listeners.length; i++) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (true) {
        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
            return EventEmitter;
        }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = EventEmitter;
    }
    else {
        exports.EventEmitter = EventEmitter;
    }
}(this || {}));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
module.exports = __webpack_require__(0);


/***/ })
/******/ ]);