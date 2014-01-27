// TODO: Split this up once a module system is chosen. Maybe use require.js
requirejs.config({
	baseUrl: "js"
})
require(["map", "objects"], function(_m, _o) {
	/** Create a game loop.
	 * Pass it a function to call repeatedly. Calls function with one argument - milliseconds elapsed since last call
	 * Returns an interval, which can be cleared with clearInterval()
	 */
	function tick (callback) {
		var TIMER_LASTCALL = Date.now();
		return setInterval(function() {
			var msDuration = (Date.now() - TIMER_LASTCALL);
			TIMER_LASTCALL = Date.now();
			callback(msDuration);
		})
	}

	// Stub
	function sendEvent (event) {
		console.log("Sending: ", event)
		receiveEvent(event)
	}

	// Stub
	function receiveEvent (event) {
		try {
			if (event.type === "move") {
				var obj = myMap.getObjById(event.id);
				obj.moving = true;
				obj.direction = event.direction
			} else if (event.type === "stop") {
				var obj = myMap.getObjById(event.id);
				if (event.direction) {
					if (obj.direction === event.direction) {
						obj.moving = false;
					}
				} else {
					obj.moving = false;
				}
				if (event.pos) {
					obj.pos = event.pos;
				}
			} else if (event.type === "addObject") {
				myMap.addObject(object(event.data))
			} else if (event.type === "updateObject") {
				myMap.updateObject(event.data)
			} else if (event.type === "removeObject") {
				myMap.removeObject(event.id)
			}
		} catch(err) {
			console.log("receiveEvent error - ", err)
		}
	}

	// Object containing all the key mappings
	var keyBindings = {
		65: "left",
		68: "right",
		83: "down",
		87: "up",
		32: "stop"
	};

	// Initialize the game
	var canvas = document.getElementById("game-canvas");
	canvas.width = 800;
	canvas.height = 400;
	var ctx = canvas.getContext("2d");
	var myMap = _m.map( {size: {rows: 10, cols: 10}} );

	// Add player to the map
	myMap.setPlayer({
		pos: [1, 2], 
		moving: false,
		id: 1
	})
	// Start the game loop
	tick(function (ms) {
		myMap.update(ms);
		myMap.draw(ctx);
	})

	document.addEventListener('mousedown', function(event) {
	    console.log('mousedown');
	    // TODO: find mouse target
	}, false);
	var lastKey = null;
	document.addEventListener('keydown', function(event) {
		var key = event.keyCode
		// console.log(event.keyCode)
		if ((keyBindings[key] === "up") ||
	    		(keyBindings[key] === "right") ||
	    		(keyBindings[key] === "down") ||
	    		(keyBindings[key] === "left")) {

			// Prevent spamming server
			if (lastKey !== key) {
				sendEvent({type: "move", direction: keyBindings[key], id: myMap.player.id})
			}
		}
		else if (keyBindings[key] === "stop") {
			sendEvent({type: "stop", id: myMap.player.id})
		}
		lastKey = key;
	}, false);

	document.addEventListener('keyup', function(event) {
		var key = event.keyCode
		lastKey = null;

		// console.log(event.keyCode)
		if ((keyBindings[key] === "up") ||
	    		(keyBindings[key] === "right") ||
	    		(keyBindings[key] === "down") ||
	    		(keyBindings[key] === "left")) {

			sendEvent({type: "stop", direction: keyBindings[key], id: myMap.player.id})
		}
	}, false);
})