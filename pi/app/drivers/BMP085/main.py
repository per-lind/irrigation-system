from utils.Driver import Driver
from Adafruit_BMP.BMP085 import BMP085 as BMP085Drv

class BMP085(Driver):
  def __init__(self, config):
    methods = [{
      'id': 'read',
      'min_pause': 2,
      'response': [
        {
          'id': 'pressure',
          'name': 'Pressure',
          'unit': 'hPa',
        },
        {
          'id': 'temperature',
          'name': 'Temperature',
          'unit': 'celsius',
        }
      ]
    }]
    Driver.__init__(self, name='BMP085', methods=methods)

  def _connect_to_hardware(self):
    self.sensor = BMP085Drv()

  def _read(self, payload={}):
    return {
      'temperature': self.sensor.read_temperature(),
      'pressure': round((self.sensor.read_sealevel_pressure(58.0)/100),2)
    }
