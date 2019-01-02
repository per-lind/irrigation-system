import relays
from utils.Driver import Driver
from config import MOCK_HARDWARE

filename = 'mock' if MOCK_HARDWARE else 'main'

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

  def invoke(self, method, payload={}):
    self._validate_payload(method, payload)

    try:
      return getattr(self, "_{}".format(method))(payload)
    except AttributeError:
      raise NotImplementedError

  def _validate_payload(self, method, payload):
    # Relay must exist
    relay = payload['relay']
    if not relay or relay not in self.relays:
      raise ValueError('Relay {} not found'.format(relay))

  def _status(self, payload={}):
    return { payload['relay']: self.relays[payload['relay']]['type'].invoke('status', payload) }

  def _call(self, payload={}):
    return { payload['relay']: self.relays[payload['relay']]['type'].invoke('call', payload) }

  def _connect_to_hardware(self):
    for relay in self.config['relays']:
      Type = getattr(getattr(relays, relay['type']), filename)
      relay['type'] = Type(config=relay)
      self.relays[relay['id']] = relay
