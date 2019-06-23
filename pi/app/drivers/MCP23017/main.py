from utils.Driver import Driver
from config import MOCK_HARDWARE
import time
import drivers.MCP3008 as MCP3008
from datetime import datetime
import pytz
from config import MOCK_HARDWARE
filename = 'mock' if MOCK_HARDWARE else 'main'

class MCP23017(Driver):
  def __init__(self, config):
    methods = [{
      'id': 'switch',
      'min_pause': 0,
      'response': {
        'success': {
          'name': 'Success',
          'unit': 'boolean',
        },
        'target': {
          'name': 'Current status',
          'unit': 'onoff',
        }
      },
      'payload': {
        'state': {
          'type': 'select',
          'options': [
            {'value': 'on', 'label': 'On'},
            {'value': 'off', 'label': 'Off'},
            {'value': 'toggle', 'label': 'Toggle'},
          ],
        }
      }
    }, {
      'id': 'status',
      'min_pause': 0,
      'response': {
        'status': {
          'name': 'Status',
          'unit': 'onoff',
        }
      }
    }]

    self.pins = {}
    self.config = config
    self.relays = {}

    Driver.__init__(self, name='MCP23017', methods=methods)

  def _connect_to_hardware(self):
    import board
    import busio
    import adafruit_mcp230xx

    self.i2c = busio.I2C(board.SCL, board.SDA)
    self.sensor = adafruit_mcp230xx.MCP23017(self.i2c)

    self.setup_relays()

  def setup_relays(self):
    for relay in self.config['relays']:
      self.pins[relay['id']] = relay['pin']
      output = relay['output'] if 'output' in relay else False
      self.setup_pin(relay['pin'], output)
      self.relays[relay['id']] = relay

  def _setup_child(self, settings):
    pins = settings['pins']
    cs = self.setup_pin(pins["CS"], True)
    miso = self.get_pin(pins["MISO"])
    mosi = self.get_pin(pins["MOSI"])
    clk = self.get_pin(pins["CLK"])
    return {
      'cs': cs,
      'miso': miso,
      'mosi': mosi,
      'clk': clk,
    }

  def get_pin(self, pin):
    return self.sensor.get_pin(pin)

  def setup_pin(self, pin, output=False):
    x = self.get_pin(pin)
    if output:
      x.switch_to_output(value=False)
    return x

  def _input(self, pin):
    try:
      x = self.get_pin(pin)
      return x.value
    except Exception as inst:
      print("Failed to read pin " + str(pin) + " of " + self.name)
      print(type(inst))
      print(inst.args)
      print(inst)
      return None

  def _output(self, pin, status):
    try:
      x = self.get_pin(pin)
      x.value = status
      return True
    except Exception as inst:
      print("Failed to call pin " + str(pin) + " of " + self.name)
      print(type(inst))
      print(inst.args)
      print(inst)
      return False

  def _relay_exists(self, relay):
    if not relay or relay not in self.relays:
      raise ValueError("Relay {} not found".format(relay))

  def _validate_status_payload(self, payload):
    relay = payload.get("relay", None)
    self._relay_exists(relay)

  def _status(self, payload={}):
    relay = payload['relay']
    return {
      'status': self._input(self.relays[relay]['pin']),
    }

  def _validate_switch_payload(self, payload):
    relay = payload.get("relay", None)
    self._relay_exists(relay)
    if !self.relays[relay]['output']:
      raise ValueError("Relay {} is not an output".format(relay))
    if payload['status'] not in ['on', 'off', 'toggle']:
      raise ValueError("Status {} not allowed. Must be on, off or toggle".format(payload['status']))

  def _switch(self, payload={}):
    # TODO add custom enough_time_elapsed-check
    relay = payload['relay']
    status = payload['status']
    target = 0
    if status == 'on':
      target = 1
    elif status == 'toggle':
      current = self._input(self.relays[relay]['pin'])
      if current == 0:
        target = 1

    return {
      'success': self._output(self.relays[relay]['pin'], target),
      'target': target == 1,
    }

  def _shutdown(self):
    success = True
    for _, relay in self.relays.items():
      if relay['output']:
        status = self._output(relay['pin'], 0)
        success = success and status
    return success

  def to_json(self):
    return {
      'name': self.name,
      'methods': self.methods,
      'healthy': self.is_healthy(),
      'relays': self.relays,
    }
