from drivers.MCP23017.main import MCP23017 as Main
import time

class MCP23017(Main):
  def _connect_to_hardware(self):
    self.setup_relays()

  def _setup_child(self, settings):
    return {
      'cs': 'cs',
      'miso': 'miso',
      'mosi': 'mosi',
      'clk': 'clk',
    }

  def get_pin(self, pin):
    return 0

  def setup_pin(self, pin, output=False):
    pass

  def _input(self, pin):
    return True

  def _output(self, pin, status):
    return True

  def _status(self, relay, payload={}):
    return {
      'status': True
    }

  def _switch(self, relay, payload={}):
    return {
      'success': True,
      'target': True,
    }
