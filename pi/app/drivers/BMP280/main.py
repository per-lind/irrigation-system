from utils.Driver import Driver

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
    import board
    import busio
    import adafruit_bmp280

    i2c = busio.I2C(board.SCL, board.SDA)
    #bmp280.sea_level_pressure = 1013.25
    self.sensor = adafruit_bmp280.Adafruit_BMP280_I2C(i2c, 0x76)

  def _read(self, payload={}):
    return {
      'temperature': round(self.sensor.temperature,2),
      'pressure': round(self.sensor.pressure,2)
    }
