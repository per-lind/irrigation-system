from utils.Driver import Driver
import math

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
    chan7 = self.sensor.read(self.MCP.P7)
    rV = ((1024.0/chan7) - 1.0)*10000.0
    value = round(((1/(1.125614740E-03 + (2.346500768E-04*math.log(rV)) + (0.8600178326E-07*math.pow(math.log(rV), 3))))-273.15),3)
    return {
      'output': value,
    }
