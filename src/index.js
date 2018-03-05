import EventEmitter from 'wolfy87-eventemitter'

export function debounce(fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
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
export class GeeoWS extends EventEmitter {

	/**
	 * Creates a new GeeoWS
	 * @param {string} wsURL - the websocket URL connection string
	 */
	constructor(wsURL) {
		super()
		this.wsURL = wsURL
		this.ws = null
		this.position = null
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
		this.ws = new WebSocket(`${this.wsURL}?token=${token}`)

		this.ws.onopen = function() {
			/**
			 * Connect event when the websocket is connected
			 * @event GeeoWS#connect
			 */
			this.emit("connect")
		}.bind(this)
		this.ws.onerror = function(err) {
			/**
			 * Error event when an error occurs on the websocket
			 * @event GeeoWS#error
			 */
			this.emit("error", err)
		}.bind(this)
		this.ws.onmessage = function(message) {
			var arr = JSON.parse(message.data)
			if (arr.error) {
				return this.emit("error", arr)
			}
			this.view._receiveMessage(arr)
			/**
			 * Event sent when the view is updated
			 * @event GeeoWS#viewUpdated
			 */
			this.emit("viewUpdated")
		}.bind(this)
		this.ws.onclose = function (err) {
			/**
			 * Close event when the websocket is closed
			 * @event GeeoWS#close
			 */
			this.emit("close", err)
		}.bind(this)
	}

	/**
	 * Move the agent to a specific location
	 * @param {number} lon - the longitude 
	 * @param {number} lat - the latitude
	 */
	move(lon, lat) {
		this.position = [lon, lat]
		this.ws.send(JSON.stringify({ agentPosition: this.position }))
	}

	/**
	 * Get the current agent location
	 * @returns {number[]} an array with [lon, lat]
	 */
	getPosition() {
		return this.position
	}

	/**
	 * Add a point of interest
	 * @param {POI} poi - the point of interest to add
	 */
	addPOI(poi) {
		this.ws.send(JSON.stringify({ createPOI: poi }))
	}

	/**
	 * Remove a point of interest
	 * @param {POI} poi - the point of interest to remove
	 */
	removePOI(poi) {
		this.ws.send(JSON.stringify({ removePOI: poi }))
	}

	/**
	 * Add an Air Beacon
	 * @param {AirBeacon} ab - the air beacon to add
	 */
	addAirBeacon(ab) {
		this.ws.send(JSON.stringify({ createAirBeacon: ab }))
	}

	/**
	 * Remove an Air Beacon
	 * @param {AirBeacon} ab - the air beacon to remove
	 */
	removeAirBeacon(ab) {
		this.ws.send(JSON.stringify({ removeAirBeacon: ab }))
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
export class View extends EventEmitter {
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
		this.parent.ws.send(JSON.stringify({ viewPosition: this.position }))
	}

	/**
	 * Get the current Viewport
	 * @returns {number[]} an array with [lon1, lat1, lon2, lat2]
	 */
	getPosition() {
		return this.position
	}

	/**
	 * Returns all points of interest in the view
	 * @returns {Array.POI} the array of pois
	 */
	getPois() {
		let result = []
		for (let [k, v] of this.pois) {
			result.push(v)
		}
		return result
	}

	/**
	 * Returns all agents in the view
	 * @returns {Array.Agent} the array of agents
	 */
	getAgents() {
		let result = []
		for (let [k, v] of this.agents) {
			result.push(v)
		}
		return result
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
		message.forEach((update) => {
			if (update.agent_id) {
				if (update.entered) {
					const agent = new Agent(update.agent_id, update.pos, update.publicData)
					this.agents[agent.id] = agent
					/**
					 * Event sent when a new agent becomes visible in the view
					 * @event View#agentEntered
					 * @type {Agent}
 					 * @property {string} id - the ID of the agent
 					 * @property {number[]} pos - the position of the agent as [lon, lat]
 					 * @property {Object} publicData - the public data of the agent 
					 */
					this.emit("agentEntered", agent)
				} else if (update.left) {
					const agent = this.agents[update.agent_id]
					/**
					 * Event sent when an agent becomes invisible in the view
					 * @event View#agentLeft
					 * @type {Agent}
 					 * @property {string} id - the ID of the agent
 					 * @property {number[]} pos - the position of the agent as [lon, lat]
 					 * @property {Object} publicData - the public data of the agent 
					 */
					this.emit("agentLeft", agent)
					delete (this.agents, agent.id)
				} else {
					const agent = this.agents[update.agent_id]
					if (!agent) {
						console.log(update)
						return
					}
					agent.pos = update.pos
					/**
					 * Event sent when an agent moves
					 * @event View#agentMoved
					 * @type {Agent}
 					 * @property {string} id - the ID of the agent
 					 * @property {number[]} pos - the position of the agent as [lon, lat]
 					 * @property {Object} publicData - the public data of the agent 
					 */
					this.emit("agentMoved", agent)
				}
			} else if (update.poi_id) {
				if (update.entered && update.pos != undefined) {
					const poi = new POI(update.poi_id, update.pos, update.publicData, update.creator)
					this.pois[poi.id] = poi
					/**
					 * Event sent when a new POI becomes visible in the view
					 * @event View#poiEntered
					 * @type {POI}
					 * @property {string} id - the ID of the POI
					 * @property {number[]} pos - the position of the POI as [lon, lat]
				 	 * @property {Object} publicData - the public data of the POI 
					 * @property {string} creator - the ID of the creator of the POI
					 */
					this.emit("poiEntered", poi)
				}
				if (update.left) {
					const poi = this.pois[update.poi_id]
					/**
					 * Event sent when a POI becomes invisible for the view
					 * @event View#poiLeft
					 * @type {POI}
					 * @property {string} id - the ID of the POI
					 * @property {number[]} pos - the position of the POI as [lon, lat]
				 	 * @property {Object} publicData - the public data of the POI 
					 * @property {string} creator - the ID of the creator of the POI
					 */
					this.emit("poiLeft", poi)
					delete (this.pois, poi.id)
				}
			}
		})
	}
}

/**
 * Agent models a transient moving agent
 * @property {string} id - the ID of the agent
 * @property {number[]} pos - the position of the agent as [lon, lat]
 * @property {Object} publicData - the public data of the agent 
 */
export class Agent {
	constructor(id, pos, publicData) {
		this.id = id
		this.pos = pos
		this.publicData = publicData
	}
}

/**
 * POI models a persistent immovable point of interest
 * @property {string} id - the ID of the POI
 * @property {number[]} pos - the position of the POI as [lon, lat]
 * @property {Object} publicData - the public data of the POI 
 * @property {string} creator - the ID of the creator of the POI
 */
export class POI {
	constructor(id, pos, publicData, creator) {
		this.id = id
		this.pos = pos
		this.publicData = publicData
		this.creator = creator
	}
}

/**
 * AirBeacon models a persistent immovable Air Beacon
 * @property {string} id - the ID of the AirBeacon
 * @property {number[]} pos - the position of the AirBeacon as [lon1, lat1, lon2, lat2]
 * @property {Object} publicData - the public data of the AirBeacon 
 * @property {string} creator - the ID of the creator of the AirBeacon
 */
export class AirBeacon {
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
export class GeeoHTTP {

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
		return fetch(`${this.httpURL}/api/dev/token?viewId=${viewPortId}&agId=${agentId}`)
			.then(function (response) {
				if (response.ok) {
					return response.text()
				} else {
					throw new Error(`Can't get JWT Token (status=${response.status})`)
				}
			})
	}

	/**
	 * Create a new Point of Interest
	 * @param {String} token - A JWT token with HTTP capability
	 * @param {String} poi_id - The ID for the POI
	 * @param {number[]} pos  - The coords of the POI
	 * @param {Object} publicData - The public data
	 * @param {String} creator - The creator id
	 */
	createPOI(token, poi_id, pos, publicData, creator) {
		return fetch(`${this.httpURL}/api/v1/poi`, {
			headers: {"X-GEEO-TOKEN": token},
			method: 'POST',
			body: {
				poi_id, pos, publicData, creator
			}
		}).then(function (response) {
			if (response.ok) {
				return response.json()
			} else {
				throw new Error("Can't create POI")
			}
		})
	}

	/**
	 * Delete a POI
	 * @param {String} token - a JWT token with HTTP capability 
	 * @param {String} poi_id - The ID of the poi to remove
	 */
	deletePOI(token, poi_id) {
		return fetch(`${this.httpURL}/api/v1/poi`, {
			headers: {"X-GEEO-TOKEN": token},
			method: 'DELETE',
			body: {
				poi_id
			}
		}).then(function (response) {
			if (response.ok) {
				return response.json()
			} else {
				throw new Error("Can't remove POI")
			}
		})
	}

	/**
	 * Create a new Air Beacon
	 * @param {String} token - A JWT token with HTTP capability
	 * @param {String} ab_id - The ID for the AirBeacon
	 * @param {number[]} pos  - The coords of the AirBeacon
	 * @param {Object} publicData - The public data
	 * @param {String} creator - The creator id
	 */
	createAirBeacon(token, ab_id, pos, publicData, creator) {
		return fetch(`${this.httpURL}/api/v1/airbeacon`, {
			headers: {"X-GEEO-TOKEN": token},
			method: 'POST',
			body: {
				ab_id, pos, publicData, creator
			}
		}).then(function (response) {
			if (response.ok) {
				return response.json()
			} else {
				throw new Error("Can't create AirBeacon")
			}
		})
	}
	
	/**
	 * Delete an AirBeacon
	 * @param {String} token - a JWT token with HTTP capability 
	 * @param {String} ab_id - The ID of the AirBeacon to remove
	 */
	deleteAirBeacon(token, ab_id) {
		return fetch(`${this.httpURL}/api/v1/airbeacon`, {
			headers: {"X-GEEO-TOKEN": token},
			method: 'DELETE',
			body: {
				ab_id
			}
		}).then(function (response) {
			if (response.ok) {
				return response.json()
			} else {
				throw new Error("Can't remove AirBeacon")
			}
		})
	}
}