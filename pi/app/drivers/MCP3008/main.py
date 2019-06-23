from utils.Driver import Driver
import math
import time

class MCP3008(Driver):
  def __init__(self, config, settings):
    methods = [{
      'id': 'read',
      'min_pause': 0,
      'response': {
        'output': {
          'name': 'Output',
        }
      }
    }]
    self.cs = settings['cs']
    self.miso = settings['miso']
    self.mosi = settings['mosi']
    self.clk = settings['clk']
    self.relays = {item['id']: item for item in config['relays']}
    Driver.__init__(self, name='MCP3008', methods=methods)

  def _connect_to_hardware(self):
    import drivers.MCP3008.bbspi as bbspi
    import adafruit_mcp3xxx.mcp3008 as MCP
    self.MCP = MCP
    spi = bbspi.BBSpi(
      clock=self.clk,
      MISO=self.miso,
      MOSI=self.mosi,
    )
    self.sensor = MCP.MCP3008(spi, self.cs)

  def _get_pin(self, pin):
    return getattr(self.MCP, "P{}".format(pin))

  def _read_pin(self, pin):
    return self.sensor.read(pin)

  def _validate_read_payload(self, payload):
    relay = payload.get("relay", None)
    if not relay or relay not in self.relays:
      raise ValueError("Relay {} not found".format(relay))

  def _read(self, payload={}):
    relay_id = payload['relay']
    relay = self.relays[relay_id]
    pin = self._get_pin(relay['pin'])

    # Number of attempts to read sensor before giving up
    n = 20
    # Number of nonzero readings that we want to get
    m = 10
    # Number of nonzero readings that's good enough
    k = 5

    result = []
    for x in range(0, n):
      try:
        value=self._read_pin(pin)
        print("Reading pin {}: {}".format(pin, value))
        time.sleep(0.5)
        if value > 0:
          result.append(value)
          if len(result) >= m:
            break
      except Exception as inst:
        print('Failed to read pin {}, retrying...'.format(x))
        print(type(inst))
        print(inst.args)
        print(inst)

    # If we didn't get enough nonzero readings
    if len(result) < k:
      print("Error: Got {} nonzero readings from pin {}".format(len(result), pin))
      raise Exception("Could not read {}".format(pin))

    # Calculate average
    value = sum(result)/len(result)

    # Convert result
    if relay["conversion"] == "percent":
      value = self.convert_percent(value, relay["max"])
    if relay["conversion"] == "temperature":
      value = self.convert_temperature(value)

    return {relay_id: value}

  def convert_percent(self, value, max_value):
    return round(value/max_value*100, 2)

  def convert_temperature(self, value):
    rV = ((1024.0/value) - 1.0)*10000.0
    return round(((1/(1.125614740E-03 + (2.346500768E-04*math.log(rV)) + (0.8600178326E-07*math.pow(math.log(rV), 3))))-273.15), 3)

  def to_json(self):
    return {
      'name': self.name,
      'methods': self.methods,
      'healthy': self.is_healthy(),
      'relays': self.relays,
    }
