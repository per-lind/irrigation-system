from utils.Driver import Driver
import board
import busio
import adafruit_bmp280

class BMP280(Driver):
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
    Driver.__init__(self, name='BMP280', methods=methods)

  def _connect_to_hardware(self):
    i2c = busio.I2C(board.SCL, board.SDA)
    #bmp280.sea_level_pressure = 1013.25
    self.sensor = adafruit_bmp280.Adafruit_BMP280_I2C(i2c, 0x76)

  def _read(self, payload={}):
    SLpressure_mB = (((self.sensor.pressure)/pow((1.0-((58.0))/44330.0), 5.255))/100.0)
    return {
      'temperature': self.sensor.temperature,
      'pressure': round(SLpressure_mB,2)
    }
