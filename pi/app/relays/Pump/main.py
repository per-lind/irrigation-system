from utils.Driver import Driver
import time

import Adafruit_GPIO as GPIO

class Pump(Driver):
  def __init__(self, config):
    # Pin
    self.pin = int(config['pin'])
    # Minimum pause between calls (in seconds)
    min_pause = 10 * 60
    Driver.__init__(self, name='Pump', id=config['id'], readable=True, callable=True, read_min_pause=1, call_min_pause=min_pause)

  # Whether pump is on or off
  def _get_new_reading(self):
    return {
      'status': self._is_on()
    }

  def _is_on(self):
    self._input(self.pin)

  # Pump can only be run for a duration of up to 60 seconds
  def _validate_call_payload(self, payload={}):
    duration = payload['duration']
    if duration <= 0 or duration > 60:
      raise ValueError('Duration must be in the interval of (0, 60] seconds')

  # Pump can only be started if it's off
  def _other_call_validations(self):
    if self._is_on(self):
      raise Exception('Pump is already on')

  # Run pump for `payload.duration` seconds
  def _run(self, payload = {}):
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
