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

  def stop_all(self):
    success = True
    for _, h in self.hardware.items():
      stopped = h['driver'].disconnect()
      success = success and stopped
    return success
