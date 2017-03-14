'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wolfy87Eventemitter = require('wolfy87-eventemitter');

var _wolfy87Eventemitter2 = _interopRequireDefault(_wolfy87Eventemitter);

var _whatwgFetch = require('whatwg-fetch');

var _whatwgFetch2 = _interopRequireDefault(_whatwgFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * GeeoWS representing a Websocket connection to a Geeo instance.
 * The capabilities of this connection depend on the JWT webtoken passed to connect().
 * Some GeeoWS connections allow the use of .view to watch objects, some don't.
 * Some GeeoWS connections allow the move() function, some don't.
 * Some GeeoWS connections allow the creation of POIs or AirBeacons, some don't.
 * @extends EventEmitter
 */
var GeeoWS = function (_EventEmitter) {
	_inherits(GeeoWS, _EventEmitter);

	/**
  * Creates a new GeeoWS
  * @param {string} wsURL - the websocket URL connection string
  */
	function GeeoWS(wsURL) {
		_classCallCheck(this, GeeoWS);

		var _this = _possibleConstructorReturn(this, (GeeoWS.__proto__ || Object.getPrototypeOf(GeeoWS)).call(this));

		_this.wsURL = wsURL;
		/** @member {WebSocket} ws - The actual websocket */
		_this.ws = null;
		_this.position = null;
		/** @member {View} view - The View object to interact with the viewport */
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
		key: 'connect',
		value: function connect(token) {
			var _this2 = this;

			this.ws = new WebSocket('${this.wsUrl}?token=${token}');

			this.ws.on("connect", function () {
				/**
     * Connect event when the websocket is connected
     * @event GeeoWS#connect
     */
				_this2.emit("connect");
			});
			this.ws.on("error", function (err) {
				/**
     * Error event when an error occurs on the websocket
     * @event GeeoWS#error
     * */
				_this2.emit("error", err);
			});
			this.ws.on("message", function (message) {
				arr = JSON.parse(message);
				if (arr.error) {
					return _this2.parent.emit("error", arr);
				}
				_this2._receiveMessage(message);
				/**
     * Event sent when the view is updated
     * @event GeeoWS#viewUpdated
     */
				_this2.emit("viewUpdated");
			});
			this.ws.on("close", function (err) {
				/**
     * Close event when the websocket is closed
     * @event GeeoWS#close
     */
				_this2.emit("close", err);
			});
		}

		/**
   * Move the agent to a specific location
   * @param {number} lon - the longitude 
   * @param {number} lat - the latitude
   */

	}, {
		key: 'move',
		value: function move(lon, lat) {
			this.position = [lon, lat];
			this.ws.send(JSON.stringify({ AgentPosition: this.position }));
		}

		/**
   * Get the current agent location
   * @returns An array with [lon, lat]
   */

	}, {
		key: 'getPosition',
		value: function getPosition() {
			return this.position;
		}

		/**
   * Add a point of interest
   * @param {POI} poi - the point of interest to add
   */

	}, {
		key: 'addPoi',
		value: function addPoi(poi) {
			this.ws.send(JSON.stringify({ createPOI: poi }));
		}

		/**
   * Remove a point of interest
   * @param {POI} poi - the point of interest to remove
   */

	}, {
		key: 'removePoi',
		value: function removePoi(poi) {
			this.ws.send(JSON.stringify({ removePOI: poi }));
		}

		/**
   * Add an Air Beacon
   * @param {AirBeacon} ab - the air beacon to add
   */

	}, {
		key: 'addAirBeacon',
		value: function addAirBeacon(ab) {
			this.ws.send(JSON.stringify({ createAirBeacon: ab }));
		}

		/**
   * Remove an Air Beacon
   * @param {AirBeacon} ab - the air beacon to remove
   */

	}, {
		key: 'removeAirBeacon',
		value: function removeAirBeacon(ab) {
			this.ws.send(JSON.stringify({ removeAirBeacon: ab }));
		}

		/**
   * Close the WebSocket connection
   */

	}, {
		key: 'close',
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


var View = function (_EventEmitter2) {
	_inherits(View, _EventEmitter2);

	/**
  * @private
  * @param {GeeoWS} parent 
  */
	function View(parent) {
		_classCallCheck(this, View);

		var _this3 = _possibleConstructorReturn(this, (View.__proto__ || Object.getPrototypeOf(View)).call(this));

		_this3.parent = parent;
		_this3.position = null;
		_this3.pois = {};
		_this3.agents = {};
		return _this3;
	}

	/**
  * Move the ViewPort
  * @param {number} lon1 the lower left point longitude
  * @param {number} lat1 the lower left point latitude
  * @param {number} lon2 the upper right point longitude
  * @param {number} lat2 the upper right point latitude
  */


	_createClass(View, [{
		key: 'move',
		value: function move(lon1, lat1, lon2, lat2) {
			this.position = [lon1, lat1, lon2, lat2];
			this.ws.send(JSON.stringify({ ZoomWindowPosition: this.position }));
		}

		/**
   * Get the current Viewport
   * @returns An array with [lon1, lat1, lon2, lat2]
   */

	}, {
		key: 'getPosition',
		value: function getPosition() {
			return this.position;
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
		key: '_receiveMessage',
		value: function _receiveMessage(message) {
			var _this4 = this;

			arr.forEach(function (update) {
				if (update.agent_id) {
					if (update.entered) {
						var _agent = new Agent(update.agent_id, update.pos, update.publicData);
						_this4.agents[_agent.id] = _agent;
						/**
       * Event sent when a new agent becomes visible in the view
       * @event View#agentEntered
       * @type {Agent}
       */
						_this4.emit("agentEntered", _agent);
					} else if (update.left) {
						agent = _this4.agents[update.agent_id];
						/**
       * Event sent when an agent becomes invisible in the view
       * @event View#agentLeft
       * @type {Agent}
       */
						_this4.emit("agentLeft", agent);
						delete (_this4.agents, agent.id);
					} else {
						agent = _this4.agents[update.agent_id];
						agent.pos = update.pos;
						/**
       * Event sent when an agent moves
       * @event View#agentMoved
       * @type {Agent}
       */
						_this4.emit("agentMoved", agent);
					}
				} else if (update.poi_id) {
					if (update.entered) {
						var _poi = new POI(update.poi_id, update.pos, update.publicData);
						_this4.pois[_poi.id] = _poi;
						/**
       * Event sent when a new POI becomes visible in the view
       * @event View#poiEntered
       * @type {POI}
       */
						_this4.emit("poiEntered", _poi);
					} else if (update.left) {
						poi = _this4.agents[update.poi_id];
						/**
       * Event sent when a POI becomes invisible for the view
       * @event View#poiLeft
       * @type {POI}
       */
						_this4.emit("poiLeft", poi);
						delete (_this4.agents, poi.id);
					} else {
						poi = _this4.agents[update.poi_id];
						poi.pos = update.pos;
						/**
       * Event sent when a POI moves
       * @event View#poiMoved
       * @type {POI}
       */
						_this4.emit("poiMoved", update);
					}
				}
			});
		}
	}]);

	return View;
}(_wolfy87Eventemitter2.default);

/**
 * Agent models a transient moving agent
 */


var Agent = function Agent(id, pos, publicData) {
	_classCallCheck(this, Agent);

	this.id = id;
	this.pos = pos;
	this.publicData = publicData;
};

/**
 * POI models a persistent immovable point of interest
 */


var POI = function POI(id, pos, publicData, creator) {
	_classCallCheck(this, POI);

	this.id = id;
	this.pos = pos;
	this.publicData = publicData;
	this.creator = creator;
};

/**
 * AirBeacon models a persistent immovable Air Beacon
 */


var AirBeacon = function AirBeacon(id, pos, publicData, creator) {
	_classCallCheck(this, AirBeacon);

	this.id = id;
	this.pos = pos;
	this.publicData = publicData;
	this.creator = creator;
};

/**
 * GeeoHTTP let's you connect to the Geeo HTTP RESTful API
 */


var GeeoHTTP = function () {

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
		key: 'getGuestToken',
		value: function getGuestToken(agentId, viewPortId) {
			return (0, _whatwgFetch2.default)(this.httpURL + '/api/dev/token?zwId=' + viewPortId + '&agId=' + agentId).then(function (response) {
				if (response.ok) {
					return response.text();
				} else {
					throw new Error('Can\'t get JWT Token (status=' + response.status + ')');
				}
			});
		}
	}]);

	return GeeoHTTP;
}();