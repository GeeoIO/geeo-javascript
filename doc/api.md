## Classes

<dl>
<dt><a href="#GeeoWS">GeeoWS</a> ⇐ <code>EventEmitter</code></dt>
<dd><p>GeeoWS representing a Websocket connection to a Geeo instance.
The capabilities of this connection depend on the JWT webtoken passed to connect().
Some GeeoWS connections allow the use of .view to watch objects, some don&#39;t.
Some GeeoWS connections allow the move() function, some don&#39;t.
Some GeeoWS connections allow the creation of POIs or AirBeacons, some don&#39;t.</p>
</dd>
<dt><a href="#View">View</a> ⇐ <code>EventEmitter</code></dt>
<dd><p>View contains all the features related to the viewport.
You can use it only if your token allows it.</p>
</dd>
<dt><a href="#Agent">Agent</a></dt>
<dd><p>Agent models a transient moving agent</p>
</dd>
<dt><a href="#POI">POI</a></dt>
<dd><p>POI models a persistent immovable point of interest</p>
</dd>
<dt><a href="#AirBeacon">AirBeacon</a></dt>
<dd><p>AirBeacon models a persistent immovable Air Beacon</p>
</dd>
<dt><a href="#GeeoHTTP">GeeoHTTP</a></dt>
<dd><p>GeeoHTTP let&#39;s you connect to the Geeo HTTP RESTful API</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#ws">ws</a> : <code>WebSocket</code></dt>
<dd><p>The actual websocket</p>
</dd>
<dt><a href="#view">view</a> : <code><a href="#View">View</a></code></dt>
<dd><p>The View object to interact with the viewport</p>
</dd>
</dl>

<a name="GeeoWS"></a>

## GeeoWS ⇐ <code>EventEmitter</code>
GeeoWS representing a Websocket connection to a Geeo instance.
The capabilities of this connection depend on the JWT webtoken passed to connect().
Some GeeoWS connections allow the use of .view to watch objects, some don't.
Some GeeoWS connections allow the move() function, some don't.
Some GeeoWS connections allow the creation of POIs or AirBeacons, some don't.

**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [GeeoWS](#GeeoWS) ⇐ <code>EventEmitter</code>
    * [new GeeoWS(wsURL)](#new_GeeoWS_new)
    * [.connect(token)](#GeeoWS+connect)
    * [.move(lon, lat)](#GeeoWS+move)
    * [.getPosition()](#GeeoWS+getPosition) ⇒
    * [.addPoi(poi)](#GeeoWS+addPoi)
    * [.removePoi(poi)](#GeeoWS+removePoi)
    * [.addAirBeacon(ab)](#GeeoWS+addAirBeacon)
    * [.removeAirBeacon(ab)](#GeeoWS+removeAirBeacon)
    * [.close()](#GeeoWS+close)
    * ["connect"](#GeeoWS+event_connect)
    * ["error"](#GeeoWS+event_error)
    * ["viewUpdated"](#GeeoWS+event_viewUpdated)
    * ["close"](#GeeoWS+event_close)

<a name="new_GeeoWS_new"></a>

### new GeeoWS(wsURL)
Creates a new GeeoWS


| Param | Type | Description |
| --- | --- | --- |
| wsURL | <code>string</code> | the websocket URL connection string |

<a name="GeeoWS+connect"></a>

### geeoWS.connect(token)
Connect to the WS server with a JWT token

**Kind**: instance method of <code>[GeeoWS](#GeeoWS)</code>  
**Emits**: <code>[connect](#GeeoWS+event_connect)</code>, <code>[error](#GeeoWS+event_error)</code>, <code>[viewUpdated](#GeeoWS+event_viewUpdated)</code>, <code>[close](#GeeoWS+event_close)</code>  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | a JWT token signed for the WS server |

<a name="GeeoWS+move"></a>

### geeoWS.move(lon, lat)
Move the agent to a specific location

**Kind**: instance method of <code>[GeeoWS](#GeeoWS)</code>  

| Param | Type | Description |
| --- | --- | --- |
| lon | <code>number</code> | the longitude |
| lat | <code>number</code> | the latitude |

<a name="GeeoWS+getPosition"></a>

### geeoWS.getPosition() ⇒
Get the current agent location

**Kind**: instance method of <code>[GeeoWS](#GeeoWS)</code>  
**Returns**: An array with [lon, lat]  
<a name="GeeoWS+addPoi"></a>

### geeoWS.addPoi(poi)
Add a point of interest

**Kind**: instance method of <code>[GeeoWS](#GeeoWS)</code>  

| Param | Type | Description |
| --- | --- | --- |
| poi | <code>[POI](#POI)</code> | the point of interest to add |

<a name="GeeoWS+removePoi"></a>

### geeoWS.removePoi(poi)
Remove a point of interest

**Kind**: instance method of <code>[GeeoWS](#GeeoWS)</code>  

| Param | Type | Description |
| --- | --- | --- |
| poi | <code>[POI](#POI)</code> | the point of interest to remove |

<a name="GeeoWS+addAirBeacon"></a>

### geeoWS.addAirBeacon(ab)
Add an Air Beacon

**Kind**: instance method of <code>[GeeoWS](#GeeoWS)</code>  

| Param | Type | Description |
| --- | --- | --- |
| ab | <code>[AirBeacon](#AirBeacon)</code> | the air beacon to add |

<a name="GeeoWS+removeAirBeacon"></a>

### geeoWS.removeAirBeacon(ab)
Remove an Air Beacon

**Kind**: instance method of <code>[GeeoWS](#GeeoWS)</code>  

| Param | Type | Description |
| --- | --- | --- |
| ab | <code>[AirBeacon](#AirBeacon)</code> | the air beacon to remove |

<a name="GeeoWS+close"></a>

### geeoWS.close()
Close the WebSocket connection

**Kind**: instance method of <code>[GeeoWS](#GeeoWS)</code>  
<a name="GeeoWS+event_connect"></a>

### "connect"
Connect event when the websocket is connected

**Kind**: event emitted by <code>[GeeoWS](#GeeoWS)</code>  
<a name="GeeoWS+event_error"></a>

### "error"
Error event when an error occurs on the websocket

**Kind**: event emitted by <code>[GeeoWS](#GeeoWS)</code>  
<a name="GeeoWS+event_viewUpdated"></a>

### "viewUpdated"
Event sent when the view is updated

**Kind**: event emitted by <code>[GeeoWS](#GeeoWS)</code>  
<a name="GeeoWS+event_close"></a>

### "close"
Close event when the websocket is closed

**Kind**: event emitted by <code>[GeeoWS](#GeeoWS)</code>  
<a name="View"></a>

## View ⇐ <code>EventEmitter</code>
View contains all the features related to the viewport.
You can use it only if your token allows it.

**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [View](#View) ⇐ <code>EventEmitter</code>
    * [new View(parent)](#new_View_new)
    * [.move(lon1, lat1, lon2, lat2)](#View+move)
    * [.getPosition()](#View+getPosition) ⇒
    * ["agentEntered"](#View+event_agentEntered)
    * ["agentLeft"](#View+event_agentLeft)
    * ["agentMoved"](#View+event_agentMoved)
    * ["poiEntered"](#View+event_poiEntered)
    * ["poiLeft"](#View+event_poiLeft)
    * ["poiMoved"](#View+event_poiMoved)

<a name="new_View_new"></a>

### new View(parent)

| Param | Type |
| --- | --- |
| parent | <code>[GeeoWS](#GeeoWS)</code> | 

<a name="View+move"></a>

### view.move(lon1, lat1, lon2, lat2)
Move the ViewPort

**Kind**: instance method of <code>[View](#View)</code>  

| Param | Type | Description |
| --- | --- | --- |
| lon1 | <code>number</code> | the lower left point longitude |
| lat1 | <code>number</code> | the lower left point latitude |
| lon2 | <code>number</code> | the upper right point longitude |
| lat2 | <code>number</code> | the upper right point latitude |

<a name="View+getPosition"></a>

### view.getPosition() ⇒
Get the current Viewport

**Kind**: instance method of <code>[View](#View)</code>  
**Returns**: An array with [lon1, lat1, lon2, lat2]  
<a name="View+event_agentEntered"></a>

### "agentEntered"
Event sent when a new agent becomes visible in the view

**Kind**: event emitted by <code>[View](#View)</code>  
<a name="View+event_agentLeft"></a>

### "agentLeft"
Event sent when an agent becomes invisible in the view

**Kind**: event emitted by <code>[View](#View)</code>  
<a name="View+event_agentMoved"></a>

### "agentMoved"
Event sent when an agent moves

**Kind**: event emitted by <code>[View](#View)</code>  
<a name="View+event_poiEntered"></a>

### "poiEntered"
Event sent when a new POI becomes visible in the view

**Kind**: event emitted by <code>[View](#View)</code>  
<a name="View+event_poiLeft"></a>

### "poiLeft"
Event sent when a POI becomes invisible for the view

**Kind**: event emitted by <code>[View](#View)</code>  
<a name="View+event_poiMoved"></a>

### "poiMoved"
Event sent when a POI moves

**Kind**: event emitted by <code>[View](#View)</code>  
<a name="Agent"></a>

## Agent
Agent models a transient moving agent

**Kind**: global class  
<a name="POI"></a>

## POI
POI models a persistent immovable point of interest

**Kind**: global class  
<a name="AirBeacon"></a>

## AirBeacon
AirBeacon models a persistent immovable Air Beacon

**Kind**: global class  
<a name="GeeoHTTP"></a>

## GeeoHTTP
GeeoHTTP let's you connect to the Geeo HTTP RESTful API

**Kind**: global class  

* [GeeoHTTP](#GeeoHTTP)
    * [new GeeoHTTP(httpURL)](#new_GeeoHTTP_new)
    * [.getGuestToken(agentId, viewPortId)](#GeeoHTTP+getGuestToken)

<a name="new_GeeoHTTP_new"></a>

### new GeeoHTTP(httpURL)
Creates a new HTTP connection to Geeo


| Param | Type | Description |
| --- | --- | --- |
| httpURL | <code>string</code> | The HTTP endpoint URL |

<a name="GeeoHTTP+getGuestToken"></a>

### geeoHTTP.getGuestToken(agentId, viewPortId)
Get a guest token from server. Only possible with development routes allowed

**Kind**: instance method of <code>[GeeoHTTP](#GeeoHTTP)</code>  

| Param | Type | Description |
| --- | --- | --- |
| agentId | <code>string</code> | The ID to use for the agent |
| viewPortId | <code>string</code> | The ID to use for the viewport |

<a name="ws"></a>

## ws : <code>WebSocket</code>
The actual websocket

**Kind**: global variable  
<a name="view"></a>

## view : <code>[View](#View)</code>
The View object to interact with the viewport

**Kind**: global variable  
