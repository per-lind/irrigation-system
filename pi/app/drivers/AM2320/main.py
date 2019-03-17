from utils.Driver import Driver
import board
import busio
import adafruit_am2320

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

  def _read(self, payload={}):
    i2c = busio.I2C(board.SCL, board.SDA)
    am = adafruit_am2320.AM2320(i2c)

    return {
      'temperature': am.temperature,
      'humidity': am.relative_humidity
    }

  @staticmethod
  def _calc_crc16(data):
    crc = 0xFFFF
    for x in data:
      crc = crc ^ x
      for bit in range(0, 8):
        if (crc & 0x0001) == 0x0001:
          crc >>= 1
          crc ^= 0xA001
        else:
          crc >>= 1
    return crc

  @staticmethod
  def _combine_bytes(msb, lsb):
    return msb << 8 | lsb
