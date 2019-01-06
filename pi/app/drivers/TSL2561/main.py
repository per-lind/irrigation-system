from utils.Driver import Driver
from tsl2561 import TSL2561 as TSL2561Drv

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
    self.sensor = TSL2561Drv(autogain=True)

  def _read(self, payload={}):
    return {
      'light': self.sensor.lux()
    }
