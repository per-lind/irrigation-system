from utils.Driver import Driver
import time

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
      'status': False
    }

  # Pump can only be run for a duration of up to 60 seconds
  def _validate_call_payload(self, payload={}):
    duration = payload['duration']
    if duration <= 0 or duration > 60:
      raise ValueError('Duration must be in the interval of (0, 60] seconds')

  # Run pump for `payload.duration` seconds
  def _run(self, payload = {}):
    # Wait for `duration` seconds
    time.sleep(payload['duration'])
    return True
