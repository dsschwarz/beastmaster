from mapobject import Actor
from engine import Engine
from room import Room

class CustomEvent():
	pass		

def printObjs(objs):
	for o in objs:
		print vars(o)

eng = Engine()
rm = Room((5, 5))
eng.addRoom(rm, (0,0))
print rm, eng.getRoom((0, 0))

p1 = Actor((1,1))
p1.id = 1
rm.addObj(p1)
printObjs(rm.objects)

ev = CustomEvent()
ev.id = 1
ev.type = "move"
ev.direction = "right"
eng.pushEvent(ev)
printObjs(rm.objects)
eng.update()
printObjs(rm.objects)

for i in range(200):
	eng.update()

ev = CustomEvent()
ev.id = 1
ev.type = "move"
ev.direction = "up"
eng.pushEvent(ev)

for i in range(200):
	eng.update()


printObjs(rm.objects)