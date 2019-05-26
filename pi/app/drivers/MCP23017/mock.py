from drivers.MCP23017.main import MCP23017 as Main
import time

class MCP23017(Main):
  def _connect_to_hardware(self):
    self.setup_relays()

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
      status: True
    }

  def _switch(self, relay, payload={}):
    return {
      success: True,
      target: True,
    }

  def _run(self, relay, payload={}):
    # Wait for `duration` seconds
    time.sleep(payload['duration'])

    return {
      'success': True,
      'duration': payload['duration'],
    }
