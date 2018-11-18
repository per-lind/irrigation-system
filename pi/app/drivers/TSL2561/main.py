from utils.Driver import Driver
from tsl2561 import TSL2561

class TSL2561(Driver):
  def __init__(self, config):
    Driver.__init__(self, name='TSL2561', id=config['id'], readable=True, callable=False)

  def _connect_to_hardware(self):
    self.sensor = tsl2561(autogain=True)

  def _get_new_reading(self):
    return {
      'light': self.sensor.lux()
    }
