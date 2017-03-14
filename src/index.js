import EventEmitter from 'wolfy87-eventemitter'
import fetch from 'whatwg-fetch'

/**
 * GeeoWS representing a Websocket connection to a Geeo instance.
 * The capabilities of this connection depend on the JWT webtoken passed to connect().
 * Some GeeoWS connections allow the use of .view to watch objects, some don't.
 * Some GeeoWS connections allow the move() function, some don't.
 * Some GeeoWS connections allow the creation of POIs or AirBeacons, some don't.
 * @extends EventEmitter
 */
class GeeoWS extends EventEmitter {

	/**
	 * Creates a new GeeoWS
	 * @param {string} wsURL - the websocket URL connection string
	 */
	constructor(wsURL) {
		super()
		this.wsURL = wsURL
		/** @member {WebSocket} ws - The actual websocket */
		this.ws = null
		this.position = null
		/** @member {View} view - The View object to interact with the viewport */
		this.view = new View(this)
	}

	/**
	 * Connect to the WS server with a JWT token
	 * @param {string} token - a JWT token signed for the WS server
	 * @fires GeeoWS#connect
	 * @fires GeeoWS#error
	 * @fires GeeoWS#viewUpdated
	 * @fires GeeoWS#close
	 */
	connect(token) {
		this.ws = new WebSocket('${this.wsUrl}?token=${token}')

		this.ws.on("connect", ()=> {
			/**
			 * Connect event when the websocket is connected
			 * @event GeeoWS#connect
			 */
			this.emit("connect")
		})
		this.ws.on("error", (err)=> {
			/**
			 * Error event when an error occurs on the websocket
			 * @event GeeoWS#error
			 * */
			this.emit("error", err)
		})
		this.ws.on("message", (message)=> {
			arr = JSON.parse(message)
			if (arr.error) {
				return this.parent.emit("error", arr)
			}
			this._receiveMessage(message)
			/**
			 * Event sent when the view is updated
			 * @event GeeoWS#viewUpdated
			 */
			this.emit("viewUpdated")
		})
		this.ws.on("close", (err)=> {
			/**
			 * Close event when the websocket is closed
			 * @event GeeoWS#close
			 */
			this.emit("close", err)
		})
	}

	/**
	 * Move the agent to a specific location
	 * @param {number} lon - the longitude 
	 * @param {number} lat - the latitude
	 */
	move(lon, lat) {
		this.position = [lon, lat]
		this.ws.send(JSON.stringify({AgentPosition: this.position}))
	}

	/**
	 * Get the current agent location
	 * @returns An array with [lon, lat]
	 */
	getPosition() {
		return this.position
	}

	/**
	 * Add a point of interest
	 * @param {POI} poi - the point of interest to add
	 */
	addPoi(poi) {
		this.ws.send(JSON.stringify({createPOI: poi}))
	}

	/**
	 * Remove a point of interest
	 * @param {POI} poi - the point of interest to remove
	 */
	removePoi(poi) {
		this.ws.send(JSON.stringify({removePOI: poi}))
	}

	/**
	 * Add an Air Beacon
	 * @param {AirBeacon} ab - the air beacon to add
	 */
	addAirBeacon(ab) {
		this.ws.send(JSON.stringify({createAirBeacon: ab}))
	}

	/**
	 * Remove an Air Beacon
	 * @param {AirBeacon} ab - the air beacon to remove
	 */
	removeAirBeacon(ab) {
		this.ws.send(JSON.stringify({removeAirBeacon: ab}))
	}

	/**
	 * Close the WebSocket connection
	 */
	close() {
		this.ws.close()
	}
}

/**
 * View contains all the features related to the viewport.
 * You can use it only if your token allows it.
 * @extends EventEmitter
 */
class View extends EventEmitter {
	/**
	 * @private
	 * @param {GeeoWS} parent 
	 */
	constructor(parent) {
		super()
		this.parent = parent
		this.position = null
		this.pois = {}
		this.agents = {}
	}

	/**
	 * Move the ViewPort
	 * @param {number} lon1 the lower left point longitude
	 * @param {number} lat1 the lower left point latitude
	 * @param {number} lon2 the upper right point longitude
	 * @param {number} lat2 the upper right point latitude
	 */
	move(lon1, lat1, lon2, lat2) {
		this.position = [lon1, lat1, lon2, lat2]
		this.ws.send(JSON.stringify({ZoomWindowPosition: this.position}))
	}

	/**
	 * Get the current Viewport
	 * @returns An array with [lon1, lat1, lon2, lat2]
	 */
	getPosition() {
		return this.position
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
	_receiveMessage(message) {
		arr.forEach((update)=> {
			if (update.agent_id) {
				if (update.entered) {
					const agent = new Agent(update.agent_id, update.pos, update.publicData)
					this.agents[agent.id] = agent
					/**
					 * Event sent when a new agent becomes visible in the view
					 * @event View#agentEntered
					 * @type {Agent}
					 */
					this.emit("agentEntered", agent)
				} else if (update.left) {
					agent = this.agents[update.agent_id]
					/**
					 * Event sent when an agent becomes invisible in the view
					 * @event View#agentLeft
					 * @type {Agent}
					 */
					this.emit("agentLeft", agent)
					delete(this.agents, agent.id)
				} else {
					agent = this.agents[update.agent_id]
					agent.pos = update.pos
					/**
					 * Event sent when an agent moves
					 * @event View#agentMoved
					 * @type {Agent}
					 */
					this.emit("agentMoved", agent)
				}
			} else if (update.poi_id) {
				if (update.entered) {
					const poi = new POI(update.poi_id, update.pos, update.publicData)
					this.pois[poi.id] = poi
					/**
					 * Event sent when a new POI becomes visible in the view
					 * @event View#poiEntered
					 * @type {POI}
					 */
					this.emit("poiEntered", poi)
				} else if (update.left) {
					poi = this.agents[update.poi_id]
					/**
					 * Event sent when a POI becomes invisible for the view
					 * @event View#poiLeft
					 * @type {POI}
					 */
					this.emit("poiLeft", poi)
					delete(this.agents, poi.id)
				} else {
					poi = this.agents[update.poi_id]
					poi.pos = update.pos
					/**
					 * Event sent when a POI moves
					 * @event View#poiMoved
					 * @type {POI}
					 */
					this.emit("poiMoved", update)
				}
			}
		})
	}
}

/**
 * Agent models a transient moving agent
 */
class Agent {
	constructor(id, pos, publicData) {
		this.id = id
		this.pos = pos
		this.publicData = publicData
	}
}

/**
 * POI models a persistent immovable point of interest
 */
class POI {
	constructor(id, pos, publicData, creator) {
		this.id = id
		this.pos = pos
		this.publicData = publicData
		this.creator = creator
	}
}

/**
 * AirBeacon models a persistent immovable Air Beacon
 */
class AirBeacon {
	constructor(id, pos, publicData, creator) {
		this.id = id
		this.pos = pos
		this.publicData = publicData
		this.creator = creator
	}
}

/**
 * GeeoHTTP let's you connect to the Geeo HTTP RESTful API
 */
class GeeoHTTP {

	/**
	 * Creates a new HTTP connection to Geeo
	 * @param {string} httpURL - The HTTP endpoint URL
	 */
	constructor(httpURL) {
		this.httpURL = httpURL
	}

	/**
	 * Get a guest token from server. Only possible with development routes allowed
	 * @param {string} agentId - The ID to use for the agent
	 * @param {string} viewPortId - The ID to use for the viewport
	 */
	getGuestToken(agentId, viewPortId) {
		return fetch(`${this.httpURL}/api/dev/token?zwId=${viewPortId}&agId=${agentId}`)
		.then(function (response) {
			if (response.ok) {
				return response.text()
			} else {
				throw new Error(`Can't get JWT Token (status=${response.status})`)
			}
		})
	}

}