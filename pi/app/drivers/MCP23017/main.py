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

    Driver.__init__(self, name='MCP23017', id=config['id'], readable=True, callable=True)

  def _validate_read_payload(self, payload):
    # Relay must exist
    relay = payload['relay']
    if not relay or relay not in self.relays:
      raise ValueError('Relay {} not found'.format(relay))

  def _validate_call_payload(self, payload):
    # Same as read validation
    self._validate_read_payload(payload)

  def _get_last_reading(self, payload):
    return self.relays[payload['relay']]['type']._get_last_reading(payload)

  def _get_new_reading(self, payload):
    return self.relays[payload['relay']]['type']._read(payload)

  def _run(self, payload={}):
    return self.relays[payload['relay']]['type']._run(payload)

  def _connect_to_hardware(self):
    self.sensor = MCP.MCP23017()

    for relay in self.config['relays']:
      Type = getattr(getattr(relays, relay['type']), filename)
      relay['type'] = Type(config=relay)
      self.sensor.setup(self.pin, GPIO.OUT)
      db.Hardware.get_or_create(hardware_id=relay['id'])
      self.relays[relay['id']] = relay

  def _input(self, pin):
    try:
      return self.sensor.input(pin)
    except Exception as inst:
      print("Failed to read pin " + pin + " of " + self.name)
      print(type(inst))
      print(inst.args)
      print(inst)
      return None

  def _output(self, pin, status):
    try:
      self.sensor.output(pin, status)
      return True
    except Exception as inst:
      print("Failed to call pin " + pin + " of " + self.name)
      print(type(inst))
      print(inst.args)
      print(inst)
      return False

  def _shutdown(self):
    success = True
    for relay in self.relays.items():
      status = self._output(relay['pin'], GPIO.LOW)
      success = success and status
    return success
