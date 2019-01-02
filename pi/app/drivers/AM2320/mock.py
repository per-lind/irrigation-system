from utils.Driver import Driver
from random import random

class AM2320(Driver):
  def __init__(self, config):
    methods = [
      {
        'id': 'read',
        'min_pause': 2,
        'response': [{
          'id': 'humidity',
          'name': 'Humidity',
          'unit': 'percent',
        },
        {
          'id': 'temperature',
          'name': 'Temperature',
          'unit': 'celsius',
        }]
      }
    ]
    Driver.__init__(self, name='AM2320', methods=methods)

  def _read(self, payload={}):
    return {
      'temperature': 10 + random() * 20,
      'humidity': 20 + random() * 20
    }
