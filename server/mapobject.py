class BaseMapObj(object):
	opacity = 0
	def __init__(self, pos):
		self.pos = pos

	def update(self):
		if(self.moving):
			self.move(self.direction)

	def move(self, direction):
		# temp alias
		room = self.room
		if (self.moveDelay > 0):
			self.moveDelay -= 1
			return

		targetPos = getTargetPos(self.pos, direction, room.getSize()) 
		if (not targetPos):
			self.moveDelay = 51
			return

		# targetPos is valid
		objs = room.getObjs(targetPos)

		for obj in objs:
			self.onCollide(obj)
			obj.onCollide(self)

			if (self.getHealth() < 0):
				return

		self.relocate(targetPos)
		self.moveDelay = 101

	def relocate(self, pos):
		self.pos = pos

	def setMove(self, direction):
		self.direction = direction
		self.moving = True

	def onCollide(self, target):
		print target

	def delete(self):
		pass

class Actor(BaseMapObj):
	"""Player class and maybe NPC"""
	def __init__(self, pos, room=None):
		super(Actor,self).__init__(pos)
		# Maintain reference to containing room
		self.moveDelay = 0
		self.moving = False
		self.direction = "down"
		if(room):
			self.room = room

	def damage(self, type, damage, callback):
		pass

	def getHealth(self):
		pass

	def setHealth(self):
		pass

	def addEffect(self, effect):
		pass

def getTargetPos(initialPos, dir, mapSize=None):
	if(dir == "up"):
		target = (initialPos[0] - 1, initialPos[1])
	elif(dir == "right"):
		target = (initialPos[0], initialPos[1] + 1)
	elif(dir == "down"):
		target = (initialPos[0] + 1, initialPos[1])
	elif(dir == "left"):
		target = (initialPos[0], initialPos[1] - 1)
	
	# validate
	if mapSize:
		if checkBounds(target, mapSize):
			return target
		else:
			return None

	# Or not
	return target


def checkBounds(pos, mapSize):
	# Check row
	if (pos[0] < 0 or pos[0] > mapSize[0]):
		return False

	# Check Column
	if (pos[1] < 0 or pos[1] > mapSize[1]):
		return False

	# Passes checks
	return True