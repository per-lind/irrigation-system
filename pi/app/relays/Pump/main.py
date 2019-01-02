from utils.Driver import Driver
import time

import Adafruit_GPIO as GPIO

class Pump(Driver):
  def __init__(self, config):
    # Pin
    self.pin = int(config['pin'])
    # Minimum pause between calls (in seconds)
    methods = [
      {
        'id': 'status',
        'min_pause': 2,
      },
      {
        'id': 'call',
        'min_pause': 10 * 60,
        'payload': [{
          'id': "duration",
          'label': "Duration",
          'required': True,
          'type': "integer",
          'min': 1,
          'max': 60,
        }]
      }
    ]
    Driver.__init__(self, name='Pump', methods=methods)

  # Whether pump is on or off
  def _status(self, payload={}):
    return {
      'status': self._is_on()
    }

  def _is_on(self):
    self._input(self.pin)

  # Pump can only be run for a duration of up to 60 seconds
  def _validate_call_payload(self, payload={}):
    if 'duration' not in payload:
      raise ValueError('Duration must be given')

    duration = payload['duration']
    if duration <= 0 or duration > 60:
      raise ValueError('Duration must be in the interval of (0, 60] seconds')

  # Pump can only be started if it's off
  def _can_invoke_call_method(self):
    if self._is_on(self):
      raise Exception('Pump is already on')

  # Run pump for `payload.duration` seconds
  def _call(self, payload={}):
    # Start pump
    self.sensor._output(self.pin, GPIO.HIGH)

    # Wait for `duration` seconds
    time.sleep(payload['duration'])

    # Stop pump
    self._output(self.pin, GPIO.LOW)

    # Make sure pump is off
    if self._is_on():
      raise Exception("Pump {} is still on!".format(self.id))

    return True
