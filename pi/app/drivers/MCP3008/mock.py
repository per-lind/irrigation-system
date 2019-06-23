from drivers.MCP3008.main import MCP3008 as Main
from random import random

class MCP3008(Main):
  def _connect_to_hardware(self):
    pass

  def _get_pin(self, pin):
    return 0

  def _read_pin(self, pin):
    return 10 + random() * 20
