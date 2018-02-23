# What is Geeo.io

There are two main characteristics to Geeo:

- it's a geo database
- and it's a websocket server

Let's explore them in details

## A Geographic Database

Geeo is a highly optimized Geo-database like no other.
It's designed to store and retrieve geo location data extremely efficiently.

At its core, Geeo stores both Points and Rectangles. This is different from many databases with geo indexes: in Geeo, the data is stored in the index, not in tables.

#### Two types of points

The kind you already know, **points of interest** or POI, is easy to understand. They are immovable, and persisted to disk.

_Use them to model venues in a Foursquare-like app, or any other kind of content with a location, either created by you or your users._

The other kind is called an **Agent: it's an object that's moving in real-time**, and it's transient. Each agent is linked to the WebSocket connection that created it, and you can have only one agent per connection. When the connection is closed, the agent is gone.

_Use agents to model your users, or buses, or any moving and geolocated thing._

#### Two kinds of rectangles

The first one is called **Views, they're transient and linked to a Websocket**. You can think about them as a live query: Views know what points they contain, and they're kept up to date when points move, appear, or leave the view. Views can be moved too. When the WebSocket is closed, the view is gone.

_Use Views to efficiently query the contents of a geographic area in any Mapping application._

The second kind of rectangles is called an **Air Beacon. They're persisted to disk**, and they are also live queries. However they trigger a WebHook when a point enters of leaves the View. They don't receive updates when points only move within the Air Beacon. 

_Use AirBeacons to model beacons, to create alerts, to gather statistics about specific places, etc._

#### How Geeo is different

It's highly optimized to do two things:

- search points in rectangles extremely fast
- find rectangles that contain a point to notify them of changes

This is what allows the realtime characteristics of Geeo: it's geo-database is so fast it can be used at scale for realtime applications.

## A Websocket Server

Geeo is designed to **work over WebSockets**: location data is frequently updated, and Geeo is pushing data to clients continuously, which makes it the perfect usecase for WebSockets.

With Geeo, a single WebSocket can be used to control one Agent and/or One View. When the socket is closed, the agent and the view disappear from Geeo. This ensures that only pertinent realtime data is stored in Geeo.

Coupling a performant geo-database and a websocket server is what makes the reactive nature of Geeo: it's able to stream changes in real time, sending only what's pertinent, over the wire.

Geeo is **designed to accomodate more than 10,000 concurrent websocket connection per 99$ instance**, where each connection is handling one moving Agent and one View. The agent can be constantly moving, and the view is constantly updated. 

You mileage may vary depending on your application: you could have many more agents if you're using fewer views, or a bit less if you have many POIs and AirBeacons.

Depending on your use case, you may separate agents and views in different applications: buses could stream their position over 4G to Geeo, and a monitoring application or mobile app would stream live updates in real time.

Or you may build a mobile app which needs both an agent placed at the current location of the user, and a view showing the surroundings.

In addition to agents and views, you can add many more POIs and AirBeacons to Geeo. Depending on use cases, you'll need only certain elements of Geeo, but you can build very reactive applications by using them all!

Geeo also includes HTTP routes for operations that don't require a WebSocket.

#### How Geeo is different from other DBs

The use of WebSockets makes it possible to connect users to the DB directly, and to perform realtime live queries in the most optimized way. The data-path is optimized, the storage is optimized and the queries are optimized to build realtime reactive geolocation apps.

# Security and Privacy

**Geeo.io is very concerned about Security, and Privacy**. Each Geeo instance is completely separate from other instances, with no shared infrastructure (db, etc). Your data belongs only to you and your users.

We don't persist agents positions to disk. When the connection is gone, the data is gone. If the server restarts (for update/maintenance or failure), the connections are closed anyway, and all transient data is gone. The persistent data is persistent and backed up, but it contains much less sensitive data and no user location.

We've designed AirBeacons so they can be useful without being too intrusive. A Webhook will be called when an agent enters/leaves the air beacon, but without coordinates information to preserve privacy and avoid geo-tracking.

We're using HTTPS and WSS with free Let's Encrypt certificates for all communication.

Finally, our instances don't log at all. You can setup WebHooks if your app requires it and be notified of connections, disconnections, and AirBeacon events.

#### Authentication workflow

Authentication to a Geeo Server should always rely on an external authentication system. We're using JsonWebTokens to transfer trust from your system to Geeo (they must share a secret): if you have authenticated a user, sign a JsonWebToken and hand it over to the client so it can connect to Geeo. This token is also used to restrain capabilities (agent or view or both, ability to create POIs or AirBeacons) to precisely manage the level of power you're giving users.

We're including a development-only HTTP route to obtain a token from a Geeo server, but it does not authenticate users and should be disabled in production.

The normal workflow looks like this:

- every user connects to your backend, and authenticates
- your backend should checks auth, and build a JWT token with the capabilities required by the client and his ID
- the client receives the token and can use it to connect to Geeo

Geeo has no user database to further protect privacy.

