from drivers.BMP280.main import BMP280 as Main
from random import uniform

class BMP280(Main):
  def _connect_to_hardware(self):
    pass

  def _read(self, payload={}):
    return {
      'temperature': uniform(-20.0, 30.0),
      'pressure': round(uniform(800.0, 1200.0),2)
    }
