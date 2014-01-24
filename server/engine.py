from room import Room

class Engine(object):
	rooms = []
	def update(self):
		self.__readEvents()
		for room in self.rooms :
			room.update()

	def __readEvents(self):
		pass

	# Called async, when a player sends an event
	def pushEvent(self, event):
		room = self.findPlayerRoom(event.id)
		if room:
			room.pushEvent(event)
		else:
			print("Could not find room holding pId: " + str(playerId))

	def findPlayerRoom(self, playerId):
		for room in self.rooms:
			if room.getObj(playerId):
				return room
		return None

	def getRoom(self, roomPos):
		for room in self.rooms:
			if room.pos == roomPos:
				return room
		# Could not find room
		return None

	def addRoom(self, room, pos):
		room.setPos(pos)
		self.rooms.append(room)
