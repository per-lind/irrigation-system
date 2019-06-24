import queue
from jobs import periodic_reading, invoke_method, close_relays

class Queue:
  def __init__(self, hardware):
    self.hardware = hardware
    # Set up job queue
    self.queue = queue.Queue(maxsize=20)

  def append(self, name, settings={}):
    self.queue.put({
      "name": name,
      "settings": settings,
    })

  def cancel(self):
    # Remove any future jobs
    with self.queue.mutex:
      self.queue.queue.clear()
    # Make sure all relays are off
    close_relays.run(self.hardware)

  def work(self):
    try:
      job = self.queue.get(False)
      name = job["name"]
      settings = job["settings"]

      if name == "periodic_reading":
        periodic_reading.run(self.hardware)
      elif name == "invoke_method":
        invoke_method.run(self.hardware, settings)
        close_relays.run(self.hardware) # Make sure relays are off after method invoke
      else:
        print("Do not recognize task '{}', ignoring...".format(name))
        return

    except queue.Empty:
      return
    except Exception as inst:
      print('Unexpected error in queue.work!')
      print(type(inst))
      print(inst.args)
      print(inst)
