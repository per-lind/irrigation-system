from drivers.TSL2561.main import TSL2561 as Main
from random import random

class TSL2561(Main):
  def _connect_to_hardware(self):
    pass

  def _read(self, payload={}):
    return {
      'light': 100 + random() * 30,
    }
