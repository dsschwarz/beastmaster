function canvasSize(width, height) {
	var canvas = document.getElementById("game-canvas")
	canvas.width  = width;
	canvas.height = height;
}

function map(spec) {
	var that = {
			rows: spec.size.rows || 1,
			cols: spec.size.cols || 1,
			tiles: [],
			objects: []
		}

	if (spec.size) {
		for (var i = 0; i < that.rows; i++) {
			for (var j = 0; j < that.cols; j++) {
				that.tiles.push(tile( {pos: [i, j]} ))
			};
		};
	}

	that.draw = function (ctx) {
		for (var i = 0; i < that.tiles.length; i++) {
			that.tiles[i].draw(ctx)
		};
		for (var i = 0; i < that.objects.length; i++) {
			that.objects[i].draw(ctx)
		};
	}

	that.update = function (ms) {
		for (var i = 0; i < that.objects.length; i++) {
			that.objects[i].update(ms)
		};
	}

	that.getObjById = function (id) {
		for (var i = 0; i < that.objects.length; i++) {
			if (that.objects[i].id === id) {
				return that.objects[i]
			}
		};
	}
	return that;
}

function tile(spec) {
	var that = {
		pos: spec.pos || [0,0] // Format [row, col]
	}
	that.draw = function (ctx) {
		var x = 10 + that.pos[1] * 12,
			y = 10 + that.pos[0] * 12;
		ctx.fillStyle = "#ddd";
		ctx.fillRect (x, y, 10, 10);
	}
	return that;
}

function object(spec) {
	var that = {
		moving: spec.moving || false,
		direction: spec.direction || "down",
		moveDelay: spec.moveDelay || 0,
		pos: spec.pos || [0, 0],
		id: spec.id
	};
	var map = spec.map;

	that.update = function (ms) {
		if (that.moving) {
			if (that.moveDelay < 0) {
				console.log("moving")
				dir = that.direction;
				if (dir === "up") {
					if (that.pos[0] > 0)
						that.pos[0] -= 1;
				} else if (dir === "right") {
					if (that.pos[1] < map.cols)
						that.pos[1] += 1;
				} else if (dir === "down") {
					if (that.pos[0] < map.rows)
						that.pos[0] += 1;
				} else if (dir === "left") {
					if (that.pos[1] > 0)
						that.pos[1] -= 1;
				}
				that.moveDelay = 200;
			} else {
				that.moveDelay -= ms;
			}
		}
	}

	that.draw = function (ctx) {
		var x = 12 + that.pos[1] * 12,
			y = 12 + that.pos[0] * 12;
		ctx.fillStyle = "#111";
		ctx.fillRect (x, y, 6, 6);
	}
	return that;
}

function tick (callback) {
	var TIMER_LASTCALL = Date.now();
	function repeat () {
		var msDuration = (Date.now() - TIMER_LASTCALL);
		TIMER_LASTCALL = Date.now();
		callback(msDuration);
		setTimeout(repeat, 0);
	}
	repeat();
}

function sendEvent (event) {
	console.log("Sending: ", event)
	receiveEvent(event)
}

function receiveEvent (event) {
	try {
		if (event.type === "move") {
			var obj = myMap.getObjById(event.id);
			obj.moving = true;
			obj.direction = event.direction
		} else if(event.type = "stop") {
			myMap.getObjById(event.id).moving = false;
		}
	} catch(err) {
		console.log("receiveEvent error - ", err)
	}
}

var keyBindings = {
	65: "left",
	68: "right",
	83: "down",
	87: "up",
	32: "stop"
};
var ctx = document.getElementById("game-canvas").getContext("2d");
canvasSize(800, 600);
var myMap = map( {size: {rows: 100, cols: 100}} );
var player = object({
	map: myMap, 
	pos: [1, 2], 
	moving: false,
	id: 1
})
myMap.objects.push(player);
myMap.draw(ctx);

tick(function (ms) {
	myMap.update(ms);
	myMap.draw(ctx);
})

document.addEventListener('mousedown', function(event) {
    console.log('mousedown');
    // find mouse target
}, false);

document.addEventListener('keydown', function(event) {
	var key = event.keyCode
	console.log(event.keyCode)
	if ((keyBindings[key] === "up") ||
    		(keyBindings[key] === "right") ||
    		(keyBindings[key] === "down") ||
    		(keyBindings[key] === "left")) {

		sendEvent({type: "move", direction: keyBindings[key], id: player.id})
	}
	else if (keyBindings[key] === "stop") {
		sendEvent({type: "stop", id: player.id})
	}
}, false);
