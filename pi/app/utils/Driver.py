import db
from datetime import datetime
import json

class Driver:
  def __init__(self, name, id, readable=False, callable=False, read_min_pause=10, call_min_pause=60):
    # Name of driver
    self.name = name
    # If in hardware.json
    self.id = id
    # Whether `call` and `read`-methods are available
    self.readable = readable
    self.callable = callable
    # Minimum time to wait between readings/calls
    self.call_min_pause = call_min_pause
    self.read_min_pause = read_min_pause
    self.connect()

  def is_healthy(self):
    return self.connected

  def read(self, payload={}):
    # If this hardware is not readable, 'fail' silently
    if not self.readable:
      return {}

    self._validate_read_payload(payload)

    if (self._enough_time_since_last_reading()):
      reading = self._get_new_reading()
      db.Hardware.update(
        last_read_at=datetime.now(),
        last_reading=json.dumps(reading)
      ).where(db.Hardware.hardware_id == self.id).execute()
      return reading
    else:
      return self._get_last_reading()

  # Make sure enough time has passed since last reading
  def _enough_time_since_last_reading(self):
    h = db.Hardware.get(db.Hardware.hardware_id == self.id)

    return h.last_read_at is None or \
           h.last_reading is None or \
           (datetime.now() - h.last_read_at).total_seconds() >= self.read_min_pause

  # Enough time has passed since last call
  def _enough_time_since_last_call(self):
    h = db.Hardware.get(db.Hardware.hardware_id == self.id)

    return h.last_call_at is None or \
           (datetime.now() - h.last_call_at).total_seconds() >= self.call_min_pause

  def _get_last_reading(self, payload={}):
    return json.loads(db.Hardware.get(db.Hardware.hardware_id == self.id).last_reading)

  def _get_new_reading(self, payload={}):
    raise NotImplementedError

  def _validate_read_payload(self, payload):
    return True

  def call(self, payload={}):
    # If hw is not callable, fail silently
    if not self.callable:
      return False

    self._validate_call_payload(payload)

    if not self._enough_time_since_last_call():
      raise Exception('not enough time elapsed since last call!')

    self._other_call_validations()

    db.Hardware.update(
      last_call_at=datetime.now(),
    ).where(db.Hardware.hardware_id == self.id).execute()
    return self._run(payload)

  def _validate_call_payload(self, payload={}):
    return True

  def _other_call_validations(self):
    return True

  def _run(self, payload={}):
    raise NotImplementedError

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
      'callable': self.callable,
      'readable': self.readable,
    }
