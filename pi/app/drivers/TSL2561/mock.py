from utils.Driver import Driver
from random import random

class TSL2561(Driver):
  def __init__(self, config):
    Driver.__init__(self, name='TSL2561', id=config['id'], readable=True, callable=False)

  def _get_new_reading(self):
    return {
      'light': 100 + random() * 30,
    }
