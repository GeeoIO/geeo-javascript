# What is Geeo.io?

Please read [this introduction](./doc/introduction.md) to understand the fundamentals of Geeo.

Or consult our [website geeo.io](https://geeo.io/) to learn more about Geeo and how to use it in your apps.

# Javascript SDK

`geeo-javascript` is the open source Javascript Client for Geeo.io, usable from node.js or an HTML5 browser.

You can get it with npm:

```
$ npm install geeo-javascript
```

or clone this repository.

## Files

`geeo-javascript` is written with ES6 in the `src` folder, babelified to ES5 in `lib` and webpacked and minified in `dist`.

The node.js module can be used with

```
const {GeeoWS, GeeoHTTP} = require("geeo-javascript")
```

If you're writing for browsers, include `./dist/geeo.js` or `./dist/geeo.min.js` to your webpage. See [example.html](./example.html) for a working example.

## API

You can find the API docs in [the doc folder](./doc/api.md).

## the API at a glance

_Note: functions I'm not allowed to use with my token are just ignored by the server._

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