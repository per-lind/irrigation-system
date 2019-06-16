from utils.Driver import Driver
import math
import time

class MCP3008(Driver):
  def __init__(self, config, cs, miso, mosi, clk):
    methods = [{
      'id': 'read',
      'min_pause': 2,
      'response': {
        'output': {
          'name': 'Output',
        }
      }
    }]
    self.cs = cs
    self.miso = miso
    self.mosi = mosi
    self.clk = clk
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

  def _read(self, payload={}):
    result = {}

    for x in range(0, 8):
      try:
        for y in range(0, 3):
          pin = getattr(self.MCP, "P{}".format(x))
          value = self.sensor.read(pin)
          print("Reading pin {}: {}".format(pin, value))
          time.sleep(0.5)
        print("")
      except Exception as inst:
        print('Failed to read pin {}'.format(x))
        print(type(inst))
        print(inst.args)
        print(inst)

    chan7 = self.sensor.read(self.MCP.P7)
    rV = ((1024.0/chan7) - 1.0)*10000.0
    value = round(((1/(1.125614740E-03 + (2.346500768E-04*math.log(rV)) + (0.8600178326E-07*math.pow(math.log(rV), 3))))-273.15),3)
    result['chan7'] = value

    return result
