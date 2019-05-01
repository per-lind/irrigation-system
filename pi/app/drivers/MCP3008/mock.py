from drivers.MCP3008.main import MCP3008 as Main
from random import random

class MCP3008(Main):
  def _connect_to_hardware(self):
    pass

  def _read(self, pin):
    return {
      'output': 10 + random() * 20,
    }
