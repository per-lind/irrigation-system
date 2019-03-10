from utils.Driver import Driver
import time

pins = {
  'CLK' : {'pin' : 5},
  'MISO' : {'pin' : 4},
  'MOSI' : {'pin' : 2},
  'CS' : {'pin' : 3},
}

class MCP23017(Driver):
  def __init__(self, config):
    self.pins = pins
    self.config = config
    self.relays = {}

    Driver.__init__(self, name='MCP23017')

  def _connect_to_hardware(self):
    for relay in self.config['relays']:
      # Transform methods and their payloads to dictionaries
      methods = {item['id']:item for item in relay['methods']}
      for id, method in methods.items():
        if 'payload' in method:
          methods[id]['payload'] = {item['id']:item for item in method['payload']}
      self.relays[relay['id']] = {
        'methods': methods,
      }

  def invoke(self, method, payload={}):
    relay = payload['relay']
    self._validate_payload(method, relay, payload)

    try:
      return getattr(self, "_{}".format(method))(relay, payload)
    except AttributeError:
      raise NotImplementedError

  def _validate_payload(self, method, relay, payload):
    # Relay must exist
    if not relay or relay not in self.relays:
      raise ValueError('Relay {} not found'.format(relay))
    # If relay has no driver, method must be 'read', 'switch' or 'run'
    if 'driver' not in self.relays[relay]:
      if method not in ['status', 'switch', 'run']:
        raise ValueError("Method {} not found".format(method))
      # Furthermore, method must be allowed for given relay
      if method not in self.relays[relay]['methods']:
        raise ValueError("Method {} not allowed for {}".format(method, relay))
    try:
      getattr(self, "_validate_{}_payload".format(method))(relay, payload)
    except AttributeError:
      return True

  def _status(self, relay, payload={}):
    return { payload['relay']: True }

  def _validate_switch_payload(self, relay, payload):
    if payload['status'] not in ['on', 'off', 'toggle']:
      raise ValueError('Status {} not allowed. Must be on, off or toggle'.format(payload['status']))

  def _switch(self, relay, payload={}):
    return { payload['relay']: True }

  def _validate_run_payload(self, relay, payload):
    duration = payload['duration']
    min_duration = self.relays[payload['relay']]['methods']['run']['payload']['duration']['min']
    max_duration = self.relays[payload['relay']]['methods']['run']['payload']['duration']['max']
    if not isinstance(duration, int):
      raise ValueError("Duration must be integer".format(duration))
    if duration >= max_duration:
      raise ValueError("Duration must be less than {}".format(max_duration))
    if duration <= min_duration:
      raise ValueError("Duration must be at least {}".format(min_duration))

  def _run(self, relay, payload={}):
    # Wait for `duration` seconds
    time.sleep(payload['duration'])

    return { 'relay': True }
