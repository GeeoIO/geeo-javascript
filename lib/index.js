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

var View = function (_EventEmitter) {
	_inherits(View, _EventEmitter);

	function View(parent) {
		_classCallCheck(this, View);

		var _this = _possibleConstructorReturn(this, (View.__proto__ || Object.getPrototypeOf(View)).call(this));

		_this.parent = parent;
		_this.position = null;
		_this.pois = {};
		_this.agents = {};
		return _this;
	}

	_createClass(View, [{
		key: 'move',
		value: function move(lon1, lat1, lon2, lat2) {
			this.position = [lon1, lat1, lon2, lat2];
			this.ws.send(JSON.stringify({ ZoomWindowPosition: this.position }));
		}
	}, {
		key: 'getPosition',
		value: function getPosition() {
			return this.position;
		}
	}, {
		key: '_receiveMessage',
		value: function _receiveMessage(message) {
			var _this2 = this;

			arr.forEach(function (update) {
				if (update.agent_id) {
					if (update.entered) {
						var _agent = new Agent(update.agent_id, update.pos, update.publicData);
						_this2.agents[_agent.id] = _agent;
						_this2.emit("agent.entered", _agent);
					} else if (update.left) {
						agent = _this2.agents[update.agent_id];
						_this2.emit("agent.left", agent);
						delete (_this2.agents, agent.id);
					} else {
						agent = _this2.agents[update.agent_id];
						agent.pos = update.pos;
						_this2.emit("agent.moved", agent);
					}
				} else if (update.poi_id) {
					if (update.entered) {
						var _poi = new POI(update.poi_id, update.pos, update.publicData);
						_this2.pois[_poi.id] = _poi;
						_this2.emit("poi.entered", _poi);
					} else if (update.left) {
						poi = _this2.agents[update.poi_id];
						_this2.emit("poi.left", poi);
						delete (_this2.agents, poi.id);
					} else {
						poi = _this2.agents[update.poi_id];
						poi.pos = update.pos;
						_this2.emit("poi.moved", update);
					}
				}
			});
		}
	}]);

	return View;
}(_wolfy87Eventemitter2.default);

var GeeoWS = function (_EventEmitter2) {
	_inherits(GeeoWS, _EventEmitter2);

	function GeeoWS(wsURL) {
		_classCallCheck(this, GeeoWS);

		var _this3 = _possibleConstructorReturn(this, (GeeoWS.__proto__ || Object.getPrototypeOf(GeeoWS)).call(this));

		_this3.wsURL = wsURL;
		_this3.ws = null;
		_this3.position = null;
		_this3.view = new View(_this3);
		return _this3;
	}

	_createClass(GeeoWS, [{
		key: 'connect',
		value: function connect(token) {
			var _this4 = this;

			this.ws = new WebSocket('${this.wsUrl}?token=${token}');

			this.ws.on("connect", function () {
				_this4.emit("connect");
			});
			this.ws.on("error", function (err) {
				_this4.emit("error", err);
			});
			this.ws.on("message", function (message) {
				arr = JSON.parse(message);
				if (arr.error) {
					return _this4.parent.emit("error", arr);
				}
				_this4._receiveMessage(message);
				_this4.emit("view.updated");
			});
			this.ws.on("close", function (err) {
				_this4.emit("close", err);
			});
		}
	}, {
		key: 'move',
		value: function move(lon, lat) {
			this.position = [lon, lat];
			this.ws.send(JSON.stringify({ AgentPosition: this.position }));
		}
	}, {
		key: 'getPosition',
		value: function getPosition() {
			return this.position;
		}
	}, {
		key: 'close',
		value: function close() {
			this.ws.close();
		}
	}]);

	return GeeoWS;
}(_wolfy87Eventemitter2.default);

var Agent = function Agent(id, pos, publicData) {
	_classCallCheck(this, Agent);

	this.id = id;
	this.pos = pos;
	this.publicData = publicData;
};

var POI = function POI(id, pos, publicData) {
	_classCallCheck(this, POI);

	this.id = id;
	this.pos = pos;
	this.publicData = publicData;
};

var GeeoHTTP = function () {
	function GeeoHTTP(httpURL) {
		_classCallCheck(this, GeeoHTTP);

		this.httpURL = httpURL;
	}

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