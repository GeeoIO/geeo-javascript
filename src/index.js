import EventEmitter from 'wolfy87-eventemitter'
import fetch from 'whatwg-fetch'

class View extends EventEmitter {
	constructor(parent) {
		super()
		this.parent = parent
		this.position = null
		this.pois = {}
		this.agents = {}
	}

	move(lon1, lat1, lon2, lat2) {
		this.position = [lon1, lat1, lon2, lat2]
		this.ws.send(JSON.stringify({ZoomWindowPosition: this.position}))
	}

	getPosition() {
		return this.position
	}

	_receiveMessage(message) {
		arr.forEach((update)=> {
			if (update.agent_id) {
				if (update.entered) {
					const agent = new Agent(update.agent_id, update.pos, update.publicData)
					this.agents[agent.id] = agent
					this.emit("agent.entered", agent)
				} else if (update.left) {
					agent = this.agents[update.agent_id]
					this.emit("agent.left", agent)
					delete(this.agents, agent.id)
				} else {
					agent = this.agents[update.agent_id]
					agent.pos = update.pos
					this.emit("agent.moved", agent)
				}
			} else if (update.poi_id) {
				if (update.entered) {
					const poi = new POI(update.poi_id, update.pos, update.publicData)
					this.pois[poi.id] = poi
					this.emit("poi.entered", poi)
				} else if (update.left) {
					poi = this.agents[update.poi_id]
					this.emit("poi.left", poi)
					delete(this.agents, poi.id)
				} else {
					poi = this.agents[update.poi_id]
					poi.pos = update.pos
					this.emit("poi.moved", update)
				}
			}
		})
	}

}

class GeeoWS extends EventEmitter {

	constructor(wsURL) {
		super()
		this.wsURL = wsURL
		this.ws = null
		this.position = null
		this.view = new View(this)
	}

	connect(token) {
		this.ws = new WebSocket('${this.wsUrl}?token=${token}')

		this.ws.on("connect", ()=> {
			this.emit("connect")
		})
		this.ws.on("error", (err)=> {
			this.emit("error", err)
		})
		this.ws.on("message", (message)=> {
			arr = JSON.parse(message)
			if (arr.error) {
				return this.parent.emit("error", arr)
			}
			this._receiveMessage(message)
			this.emit("view.updated")
		})
		this.ws.on("close", (err)=> {
			this.emit("close", err)
		})
	}

	move(lon, lat) {
		this.position = [lon, lat]
		this.ws.send(JSON.stringify({AgentPosition: this.position}))
	}

	getPosition() {
		return this.position
	}


	close() {
		this.ws.close()
	}

}

class Agent {
	constructor(id, pos, publicData) {
		this.id = id
		this.pos = pos
		this.publicData = publicData
	}
}

class POI {
	constructor(id, pos, publicData) {
		this.id = id
		this.pos = pos
		this.publicData = publicData
	}
}

class GeeoHTTP {

	constructor(httpURL) {
		this.httpURL = httpURL
	}

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