from utils.Driver import Driver
from random import uniform

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

  def _read(self, payload={}):
    return {
      'temperature': uniform(-20.0, 30.0),
      'pressure': round(uniform(800.0, 1200.0),2)
    }
