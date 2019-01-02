from utils.Driver import Driver
from tsl2561 import TSL2561

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

  def _connect_to_hardware(self):
    self.sensor = tsl2561(autogain=True)

  def _read(self, payload={}):
    return {
      'light': self.sensor.lux()
    }
