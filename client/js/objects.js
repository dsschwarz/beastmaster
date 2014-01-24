// 'Class' definitions
// spec is the options hash passed to each 'constructor'

define(function(){
	var TILE_SIZE = 30;
	/**
	 * Create an object that moves based on tiles
	 * @param  {Object} spec = {id: <int/String>, map: <map>, moving: <bool>, direction: <string>, moveDelay: <int>}
	 * id and map required. moveDelay is time in ms before can move again
	 * 
	 */
	function object(spec) {
		var that = {
			moving: spec.moving || false,
			direction: spec.direction || "down",
			moveTimer: 0, // Can only move when timer hits 0
			pos: spec.pos || [0, 0],
			id: spec.id
		};
		var map = spec.map;

		that.update = function (ms) {
			if (that.moving) {
				if (that.moveTimer <= 0) {
					console.log("moving")
					dir = that.direction;
					if (dir === "up") {
						if (that.pos[0] > 0)
							that.pos[0] -= 1;
					} else if (dir === "right") {
						if (that.pos[1] < map.cols - 1) // Rows and cols are not 0-based
							that.pos[1] += 1;
					} else if (dir === "down") {
						if (that.pos[0] < map.rows - 1)
							that.pos[0] += 1;
					} else if (dir === "left") {
						if (that.pos[1] > 0)
							that.pos[1] -= 1;
					}
					that.moveTimer = spec.moveDelay || 200;
				}
			}
			// Countdown if moving or not
			if (that.moveTimer > 0) {
				that.moveTimer -= ms;
			}
		}

		that.draw = function (ctx) {
			var x = 10 + (TILE_SIZE/4) + that.pos[1] * (TILE_SIZE + 1),
				y = 10 + (TILE_SIZE/4) + that.pos[0] * (TILE_SIZE + 1);
			ctx.fillStyle = "#111";
			ctx.fillRect (x, y, TILE_SIZE/2, TILE_SIZE/2);
		}
		return that;
	}
	return {
		object: object
	}
})