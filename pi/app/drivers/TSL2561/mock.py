from utils.Driver import Driver
from random import random

class TSL2561(Driver):
  def __init__(self, config):
    methods = [
      {
        'id': 'read',
        'min_pause': 2,
        'response': [{
          'id': 'light',
          'name': 'Light',
          'unit': 'lux',
        }]
      }
    ]
    Driver.__init__(self, name='TSL2561', methods=methods)

  def _read(self, payload={}):
    return {
      'light': 100 + random() * 30,
    }
