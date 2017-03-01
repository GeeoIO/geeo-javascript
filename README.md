# geeo-javascript

Javascript Client for Geeo.io

# JS API proposal

Note: functions I'm not allowed to use with my token are just ignored by the server.

```
const wsURL = "wss://demo.geeo.io"
const httpURL = "https://demo.geeo.io"

var geeo = new GeeoWS(wsURL);
var geeoHttp = new GeeoHTTP(httpURL);

geeoHttp.getGuestToken(httpURL, {name: 'chris', age: 45})
.then( function(token) {
	geeo.connect(token)
}).catch(function(error) {
	console.log("Server doesn't allow guest tokens)
})

geeo.on('error', function (error) {
	geeo.close()
})

geeo.on('connect', function() {
	geeo.view.move([0,0,1,1]) // lon1 lat1 lon2 lat2 (point1 lower left, point2 upper right)
	geeo.move([0.5, 0.5]) // lon lat

	geeo.view.getPosition() // null if not set, [lon1, lat1, lon2, lat2] otherwise
	geeo.getPosition() // null if not set [lon, lat] otherwise
})

geeo.on('view.update', function() {
	geeo.view.getAll() // agents and pois
	geeo.view.pois() // pois only
	geeo.view.agents() // agents

	geeo.addPOI(poi)
	geeo.addAirBeacon(ab)
	geeo.removePOI(poi)
	geeo.removeAirBeacon(ab)
})

geeo.on('agent.added', function(agent){})
geeo.on('agent.moved', function(agent){})
geeo.on('agent.removed', function(agent){})

geeo.on('poi.added', function(poi){})
geeo.on('poi.moved', function(poi){})
geeo.on('poi.removed', function(poi){})

geeoHttp.setToken(token) // necessary to use the following features
geeoHttp.createPOI(poi)
geeoHTTP.removePOI(poi)
geeoHttp.createAirBeacon(ab)
geeoHttp.removeAirBeacon(ab)
geeoHttp.view([0,0,1,1]) // returns agents + POIs
```