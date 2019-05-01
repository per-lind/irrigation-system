import time
import json
import drivers
from config import hardware_config, MOCK_HARDWARE

filename = 'mock' if MOCK_HARDWARE else 'main'

class Hardware:
  def __init__(self):
    self.config = hardware_config
    self.hardware = {}

    for c in hardware_config:
      Driver = getattr(getattr(drivers, c['driver']), filename)
      c['driver'] = Driver(config=c)
      self.hardware[c['id']] = c

  def invoke(self, method, id, payload={}):
    if isinstance(id, str):
      selected = [self.hardware[id]] if id in self.hardware else []
    elif isinstance(id, list):
      selected = [self.hardware[h] for h in self.hardware if h in id]
    else:
      raise TypeError

    result = {}
    for h in selected:
      result[h['id']] = h['driver'].invoke(method, payload)
      # Wait 10ms before next call
      time.sleep(0.010)
    return result

  def list(self):
    items = []
    for h in self.hardware.values():
      item = {
        'id': h['id'],
        'name': h['name'],
        'driver': h['driver'].to_json()
      }
      items.append(item)

    return items

  def stop_all(self):
    success = True
    for _, h in self.hardware.items():
      stopped = h['driver'].disconnect()
      success = success and stopped
    return success
