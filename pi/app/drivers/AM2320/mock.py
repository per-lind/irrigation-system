from drivers.AM2320.main import AM2320 as Main
from random import random

class AM2320(Main):
  def _connect_to_hardware(self):
    pass

  def _read(self, payload={}):
    return {
      'temperature': 10 + random() * 20,
      'humidity': 20 + random() * 20
    }
