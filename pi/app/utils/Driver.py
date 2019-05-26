from datetime import datetime
import pytz

class Driver:
  def __init__(self, name, methods=[]):
    # Name of driver
    self.name = name
    # Available methods
    self.methods = {item['id']:item for item in methods}
    # Last method calls
    self.method_calls = {}

    self.connect()

  def is_healthy(self):
    return self.connected

  def invoke(self, method, payload={}):
    print("Invoking method {} on {} with payload {}".format(method, self.name, payload))
    # Method not available
    if method not in self.methods:
      print("Method {} does not exist for {}!".format(method, self.name))
      raise NotImplementedError

    self._can_invoke_method(method)
    self._validate_payload(method, payload)
    self._enough_time_elapsed(method)

    self.method_calls[method] = {'timestamp': datetime.now(pytz.timezone('Europe/Stockholm'))}
    try:
      result = getattr(self, "_{}".format(method))(payload)
      self.method_calls[method]['value'] = result
      return result
    except AttributeError:
      raise NotImplementedError

  def _validate_payload(self, method, payload):
    # Call _validate_{method}_payload if it is defined
    try:
      getattr(self, "_validate_{}_payload".format(method))(payload)
    except AttributeError:
      return True

  # Make sure enough time has passed since last call
  def _enough_time_elapsed(self, method):
    last_call = self.method_calls[method] if method in self.method_calls else None
    # Minimum pause between calls (defaults to 60 seconds)
    min_pause = self.methods[method].get('min_pause', 60)

    if last_call is not None and last_call['timestamp'] is not None and \
       (datetime.now() - last_call['timestamp']).total_seconds() < min_pause:
      raise Exception('not enough time elapsed since last call!')

  def _can_invoke_method(self, method):
    # Call _can_invoke_{method}_method if it is defined
    try:
      getattr(self, "_can_invoke_{}_method".format(method))()
    except AttributeError:
      return True

  def connect(self):
    try:
      self._connect_to_hardware()
      print('Connection to ' + self.name + ' established.')
      self.connected = True
      return True
    except Exception as inst:
      print("Failed to initialize sensor " + self.name)
      print(type(inst))
      print(inst.args)
      print(inst)
      self.connected = False
      return False

  def _connect_to_hardware(self):
    return True

  def disconnect(self):
    try:
      self._shutdown()
      self.connected = False
      return True
    except Exception as inst:
      print("Failed to shut down sensor " + self.name)
      print(type(inst))
      print(inst.args)
      print(inst)
      return False

  # Make sure sensor is off
  def _shutdown(self):
    return True

  def to_json(self):
    return {
      'name': self.name,
      'methods': self.methods,
      'healthy': self.is_healthy(),
      'last_method_calls': self.method_calls,
    }
