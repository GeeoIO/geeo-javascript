# geeo-javascript

Javascript Client for Geeo.io and html5 sample.

_Note: functions I'm not allowed to use with my token are just ignored by the server._

# API

You can find the API doc in [the doc folder](./doc/api.md).

Otherwise, here's a kind of cheat sheet...
```
var wsURL = "wss://demo.geeo.io"
var httpURL = "https://demo.geeo.io"

var geeo = new GeeoWS(wsURL)
var geeoHttp = new GeeoHTTP(httpURL)

geeoHttp.getGuestToken({name: 'chris', age: 45})
.then( function(token) {
	geeo.connect(token)
}).catch(function(error) {
	console.log("Server doesn't allow guest tokens)
})

geeo.on('error', function (error) {
	geeo.close()
})

geeo.on('connect', function() {
	geeo.view.move(0,0,1,1) // lon1 lat1 lon2 lat2 (point1 is SW, point2 is NE)
	geeo.move(0.5, 0.5) // lon lat

	geeo.view.getPosition() // null if not set, [lon1, lat1, lon2, lat2] otherwise
	geeo.getPosition() // null if not set [lon, lat] otherwise
})

geeo.on('viewUpdated', function() {
	geeo.view.pois() // pois in the view
	geeo.view.agents() // agents in the view

	geeo.addPOI({id, [lon, lat], publicData})
	geeo.addAirBeacon({id, [lon1, lat1, lon2, lat2], publicData})
	geeo.removePOI(poi)
	geeo.removeAirBeacon(ab)
})

geeo.view.on('agentEntered', function(agent){})
geeo.view.on('agentMoved', function(agent){})
geeo.view.on('agentLeft', function(agent){})

geeo.view.on('poiEntered', function(poi){})
geeo.view.on('poiMoved', function(poi){})
geeo.view.on('poiLeft', function(poi){})
```

Not implemented yet in Geeo REST api, coming soon:
```
geeoHttp.setToken(token) // necessary to use the following features
geeoHttp.createPOI(poi)
geeoHTTP.removePOI(poi)
geeoHttp.createAirBeacon(ab)
geeoHttp.removeAirBeacon(ab)
geeoHttp.view([0,0,1,1]) // returns agents + POIs
```