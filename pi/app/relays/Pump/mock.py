from utils.Driver import Driver
import time

class Pump(Driver):
  def __init__(self, config):
    # Pin
    self.pin = int(config['pin'])
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
      'status': False
    }

  # Pump can only be run for a duration of up to 60 seconds
  def _validate_call_payload(self, payload={}):
    if 'duration' not in payload:
      raise ValueError('Duration must be given')

    duration = payload['duration']
    if duration <= 0 or duration > 60:
      raise ValueError('Duration must be in the interval of (0, 60] seconds')

  # Run pump for `payload.duration` seconds
  def _call(self, payload = {}):
    # Wait for `duration` seconds
    time.sleep(payload['duration'])
    return True
