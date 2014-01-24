class Observable(object):
	callbacks = dict()
	def subscribe(self, callback, name="all"):
		if self.callbacks[name]:
			self.callbacks[name].append(callback)
		else:
			self.callbacks[name] = [callback]

	def fire(self, name="all", **kwargs):
		if (name == "all"):
			for c in self.callbacks["all"]:
				c(**kwargs)
		else:
			for c in self.callbacks["all"]:
				c(**kwargs)
			for c in self.callbacks[name]:
				c(**kwargs)

		