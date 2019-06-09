import queue
from jobs import periodic_reading, invoke_method

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

  def work(self):
    try:
      job = self.queue.get(False)
      name = job["name"]
      settings = job["settings"]

      if name == "periodic_reading":
        periodic_reading.run(self.hardware)
      elif name == "invoke_method":
        invoke_method.run(self.hardware, settings)

    except queue.Empty:
      return
