from utils.Driver import Driver
from config import MOCK_HARDWARE
import time
import drivers.MCP3008 as MCP3008
from config import MOCK_HARDWARE
filename = 'mock' if MOCK_HARDWARE else 'main'

class MCP23017(Driver):
  def __init__(self, config):
    self.pins = {}
    self.config = config
    self.relays = {}

    Driver.__init__(self, name='MCP23017')

  def _connect_to_hardware(self):
    import board
    import busio
    import adafruit_mcp230xx

    self.i2c = busio.I2C(board.SCL, board.SDA)
    self.sensor = adafruit_mcp230xx.MCP23017(i2c)

    self.setup_relays()

  def setup_relays(self):
    for relay in self.config['relays']:
      if "driver" in relay:
        if relay["driver"] == "MCP3008":
          cs = self.setup_pin(relay["pins"]["CS"], True)
          miso = self.get_pin(relay["pins"]["MISO"])
          mosi = self.get_pin(relay["pins"]["MOSI"])
          clk = self.get_pin(relay["pins"]["CLK"])
          mcp3008 = getattr(MCP3008, filename)
          relay['driver'] = mcp3008(relay, cs, miso, mosi, clk)
          self.relays[relay['id']] = relay

      else:
        self.pins[relay['id']] = relay['pin']
        self.setup_pin(relay['pin'])
        # Transform methods and their payloads to dictionaries
        methods = {item['id']:item.copy() for item in relay['methods']}
        for id, method in methods.items():
          if 'payload' in method:
            methods[id]['payload'] = {item['id']:item for item in method['payload']}
        self.relays[relay['id']] = {
          **relay,
          'methods': methods,
        }

  def get_pin(self, pin):
    return self.sensor.get_pin(pin)

  def setup_pin(self, pin, value=False):
    x = self.sensor.get_pin(pin)
    x.switch_to_output(value=value)
    return x

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

  def invoke(self, method, payload={}):
    relay = payload['relay']
    # Relay must exist
    self._relay_exists(relay)
    # If relay has no driver, use methods in this file
    if 'driver' not in self.relays[relay]:
      self._validate_payload(method, relay, payload)
      try:
        return getattr(self, "_{}".format(method))(relay, payload)
      except AttributeError:
        raise NotImplementedError
    else:
      self.relays[relay]['driver'].invoke(method, payload)

  def _relay_exists(self, relay):
    if not relay or relay not in self.relays:
      raise ValueError("Relay {} not found".format(relay))

  def _validate_payload(self, method, relay, payload):
    # Method must be 'read', 'switch' or 'run'
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
    return { relay: self._input(self.relays[relay]['pin']) }

  def _validate_switch_payload(self, relay, payload):
    if payload['status'] not in ['on', 'off', 'toggle']:
      raise ValueError("Status {} not allowed. Must be on, off or toggle".format(payload['status']))

  def _switch(self, relay, payload={}):
    status = payload['status']
    target = 0
    if status == 'on':
      target = 1
    elif status == 'toggle':
      current = self._input(self.relays[relay]['pin'])
      if current == 0:
        target = 1

    return { relay: self._output(self.relays[relay]['pin'], target) }

  def _validate_run_payload(self, relay, payload):
    duration = payload['duration']
    min_duration = self.relays[payload['relay']]['methods']['run']['payload']['duration']['min']
    max_duration = self.relays[payload['relay']]['methods']['run']['payload']['duration']['max']
    if not isinstance(duration, int):
      raise ValueError("Duration must be integer (given: {})".format(duration))
    if duration >= max_duration:
      raise ValueError("Duration must be less than {}".format(max_duration))
    if duration <= min_duration:
      raise ValueError("Duration must be at least {}".format(min_duration))

  def _run(self, relay, payload={}):
    # On
    self._output(self.pins[payload['relay']], 1)

    # Wait for `duration` seconds
    time.sleep(payload['duration'])

    # Off
    self._output(self.pins[payload['relay']], 0)

    return True

  def _shutdown(self):
    success = True
    for _, relay in self.relays.items():
      if 'driver' in relay:
        stopped = relay['driver'].disconnect()
        success = success and stopped
      else:
        status = self._output(relay['pin'], 0)
        success = success and status
    return success

  def to_json(self):
    def display_relay(relay):
      result = {
        'id': relay['id'],
        'name': relay['name'],
        'healthy': True,
      }
      if 'driver' in relay:
        result['driver'] = relay['driver'].to_json()
      else:
        result['methods'] = list(relay['methods'].values())

      return result

    return {
      'name': self.name,
      'methods': list(self.methods.values()),
      'healthy': self.is_healthy(),
      'relays': [display_relay(relay) for relay in list(self.relays.values())]
    }
