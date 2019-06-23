import time
import drivers
from config import hardware_config, MOCK_HARDWARE
from helpers import methods, invoke

filename = 'mock' if MOCK_HARDWARE else 'main'

class Hardware:
  def __init__(self):
    self.config = hardware_config
    self.hardware = {}

    for c in hardware_config:
      Driver = getattr(getattr(drivers, c['driver']), filename)
      parent = c.get('parent', None)
      if parent:
        # Warning: only works if parent is declared before child in hardware_config...
        settings = self.hardware[parent['id']]['driver'].setup_child(parent)
        if settings:
          c['driver'] = Driver(config=c, settings=settings)
        else:
          print("Failed to setup {}".format(c['id']))
      else:
        c['driver'] = Driver(config=c)
      self.hardware[c['id']] = c

  def invoke_method(self, method, payload={}):
    return {
      method: invoke(self)[method](payload),
    }

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

  def list_methods(self):
    return methods(self)

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

  def to_json(self, id, method=None):
    device = self.hardware[id]

    result = {
      'id': device['id'],
      'name': device['name'],
      'driver': device['driver'].name,
    }

    if method:
      method_definition = device['driver'].methods[method]
      return {
        **method_definition,
        **result,
        'method': method_definition['id']
      }
    else:
      return {
        **device['driver'].to_json(),
        **result,
      }

  def stop_all(self):
    success = True
    for _, h in self.hardware.items():
      stopped = h['driver'].disconnect()
      success = success and stopped
    return success
