class TileMatrix(object):
	# creates 2d array from file (not implented)
	def __init__(self, size, defValue=None):
		self.__rows = []
		for i in range(size[0]):
			newCol = []
			isFunc = callable(defValue)
			for j in range(size[1]):
				if (isFunc):
					newCol.append( Tile(defValue()) )
				else:
					newCol.append( Tile(defValue) )
			self.__rows.append( newCol )

	# set value of a cell at coords -> (row #, col #)
	def set (self, coords, val):
		row = coords[0]
		col = coords[1]
		self.__rows[row][col] = val

	# get value at coords -> (row #, col #)
	def get (self, coords, col=None):
		row = coords[0]
		col = coords[1]
		return self.__rows[row][col]

	__getitem__ = get
	__setitem__ = set

	# returns tuple of (row #, col #).
	# Assumes that all rows have same number of columns
	def size(self):
		return [len(self.__rows), len(self.__rows[0])]

	def rows(self):
		return self.__rows

	# get orthogonal nieghbouring cells. Returns None if at edge
	def neighbours (self, coords):
		row = coords[0]
		col = coords[1]

		if (row <= 0):
			above = None
			below = self.get(row + 1, col)
		elif (row >= len(self.__rows) - 1):
			below = None
			above = self.get(row - 1, col)
		else:
			above = self.get(row - 1, col)
			below = self.get(row + 1, col)

		if (col <= 0):
			left = None
			right = self.get(row, col + 1)
		elif (col >= self.size()[1] - 1):
			right = None
			left = self.get(row, col - 1)
		else:
			left = self.get(row, col - 1)
			right = self.get(row, col + 1)

		return {
			"above": above,
			"below": below,
			"left":  left,
			"right": right
		}

class Tile(object):
	def __init__(self, type) :
		self.type = type

	def update(self):
		pass