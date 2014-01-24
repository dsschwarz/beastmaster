define(["objects"], function(_o) {	
	// 'Class' definitions
	// spec is the options hash passed to each 'constructor'

	var TILE_SIZE = 30;
	/**
	 * @class map
	 * Creates a map holding tiles and objects.
	 * @param  {Object} spec = {size: {rows: <int>, cols: <int>}}
	 * 						size => size of tile array
	 */
	function map(spec) {
		var that = {
				rows: spec.size.rows || 1,
				cols: spec.size.cols || 1,
				tiles: [],
				objects: []
			}

		// Create tile array
		if (spec.size) {
			for (var i = 0; i < that.rows; i++) {
				for (var j = 0; j < that.cols; j++) {
					that.tiles.push(tile( {pos: [i, j]} ))
				};
			};
		}

		/**
		 * draws tiles, then objects to canvas
		 * @param  {Context} ctx
		 */
		that.draw = function (ctx) {
			for (var i = 0; i < that.tiles.length; i++) {
				that.tiles[i].draw(ctx)
			};
			for (var i = 0; i < that.objects.length; i++) {
				that.objects[i].draw(ctx)
			};
		}

		/**
		 * update all objects
		 * @param  {int} ms Time elapsed in ms since last call
		 */
		that.update = function (ms) {
			for (var i = 0; i < that.objects.length; i++) {
				that.objects[i].update(ms)
			};
		}

		/**
		 * Gets an object by id. Returns null if not found
		 * @param  {int/String} id
		 */
		that.getObjById = function (id) {
			for (var i = 0; i < that.objects.length; i++) {
				if (that.objects[i].id === id) {
					return that.objects[i]
				}
			};
			return null;
		}
		that.setPlayer = function (spec) {
			spec.map = that;
			that.player = _o.object(spec);
			that.objects.push(that.player);
		}
		return that;
	}

	/**
	 * Creates a single tile
	 * @param  {Object} spec = {pos: [row, col]} row and col should be type <int>
	 */
	function tile(spec) {
		var that = {
			pos: spec.pos || [0,0] // Format [row, col]
		}
		that.draw = function (ctx) {
			var x = 10 + that.pos[1] * (TILE_SIZE + 1),
				y = 10 + that.pos[0] * (TILE_SIZE + 1);
			ctx.fillStyle = "#ddd";
			ctx.fillRect (x, y, TILE_SIZE, TILE_SIZE);
		}
		return that;
	}

	return {
		map: map
	}
})