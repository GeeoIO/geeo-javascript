"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.GeeoHTTP = exports.AirBeacon = exports.POI = exports.Agent = exports.View = exports.GeeoWS = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.debounce = debounce;

var _wolfy87Eventemitter = require("wolfy87-eventemitter");

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
		key: "pois",
		value: function pois() {
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
		key: "agents",
		value: function agents() {
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
	}]);

	return GeeoHTTP;
}();