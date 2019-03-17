from utils.Driver import Driver
import board
import busio
import adafruit_tsl2561

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
    i2c = busio.I2C(board.SCL, board.SDA)
    # Create the TSL2561 instance, passing in the I2C bus
    self.sensor = adafruit_tsl2561.TSL2561(i2c)
    # Enable the light sensor
    self.sensor.enabled = True
    # Set gain 0=1x, 1=16x
    self.sensor.gain = 0
    # Set integration time (0=13.7ms, 1=101ms, 2=402ms, or 3=manual)
    self.sensor.integration_time = 1

  def _read(self, payload={}):
    return {
      'light': round(self.sensor.lux)
    }
