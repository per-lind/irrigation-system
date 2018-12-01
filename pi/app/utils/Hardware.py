import time
import json
import drivers
from config import hardware_config, MOCK_HARDWARE
import db

filename = 'mock' if MOCK_HARDWARE else 'main'

class Hardware:
  def __init__(self):
    self.config = hardware_config
    self.hardware = {}

    for c in hardware_config:
      Driver = getattr(getattr(drivers, c['driver']), filename)
      c['driver'] = Driver(config=c)
      self.hardware[c['id']] = c
      db.Hardware.get_or_create(hardware_id=c['id'])

  def read(self, hardware=None):
    if hardware is None:
      selected = self.hardware.values()
    elif isinstance(hardware, str):
      selected = [self.hardware[hardware]] if hardware in self.hardware else []
    elif isinstance(hardware, list):
      selected = [h for h in self.hardware.values() if h in self.hardware]
    else:
      raise TypeError

    readings = {}
    for h in selected:
      periodic_reading = h['periodicReading'] if 'periodicReading' in h else False
      if h['driver'].readable and periodic_reading:
        readings[h['id']] = h['driver'].read()
        # Wait 10ms before next reading
        time.sleep(0.010)
    return json.dumps(readings)

  def call(self, id, payload={}):
    hardware = self.hardware[id] if id in self.hardware else None
    if hardware and hardware['driver'].callable:
      return hardware['driver'].call(payload)
    else:
      return None

  def list(self):
    return hardware_config

  def stop_all(self):
    success = True
    for _, h in self.hardware.items():
      stopped = h['driver'].disconnect()
      success = success and stopped
    return success
