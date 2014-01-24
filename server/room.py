from matrix import TileMatrix
import mapobject

class Room(object):
	eventQ = []
	def __init__(self, size):
		self.tiles = TileMatrix(size)
		self.objects = []

	def update(self):
		self.readEvents()
		for o in self.objects:
			o.update()
		# for row in self.tiles.rows():
		# 	for cell in row:
		# 		cell.update()

	def readEvents(self):
		for event in self.eventQ:
			if(event.type == "move"):
				target = self.getObj(event.id)
				target.setMove(event.direction)


	def pushEvent(self, event):
		self.eventQ.append(event)


	def tile(self, pos):
		return self.tiles.get(pos)

	def getObjsAtPos(self, pos):
		objs = []
		for o in self.objects:
			if (o.pos == pos):
				objs.append(o)
		return objs

	def getObjById(self, id):
		for o in self.objects:
			if o.id == id:
				return o

	def addObj(self, object):
		# circular ref - BEWARE
		object.room = self
		self.objects.append(object)

	def delObj(self, id):
		for i in range(len(self.objects)):
			if self.objects[i].id == id:
				# delete it and break
				del self.objects[i]
				break

	def setPos(self, pos):
		self.pos = pos

	def getSize(self):
		return self.tiles.size()