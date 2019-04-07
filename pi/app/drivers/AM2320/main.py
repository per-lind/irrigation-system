from utils.Driver import Driver

class AM2320(Driver):
  def __init__(self, config):
    methods = [{
      'id': 'read',
      'min_pause': 2,
      'response': [
        {
          'id': 'humidity',
          'name': 'Humidity',
          'unit': 'percent',
        },
        {
          'id': 'temperature',
          'name': 'Temperature',
          'unit': 'celsius',
        }
      ]
    }]
    Driver.__init__(self, name='AM2320', methods=methods)

  def _connect_to_hardware(self):
    import board
    import busio
    import adafruit_am2320
    self.i2c = busio.I2C(board.SCL, board.SDA)
    self.sensor = adafruit_am2320.AM2320(self.i2c)

  def _read(self, payload={}):
    return {
      'temperature': self.sensor.temperature,
      'humidity': self.sensor.relative_humidity
    }
