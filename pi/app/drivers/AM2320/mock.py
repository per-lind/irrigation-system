from utils.Driver import Driver
from random import random

class AM2320(Driver):
  def __init__(self, config):
    Driver.__init__(self, name='AM2320', id=config['id'], readable=True, callable=False)

  def _get_new_reading(self):
    return {
      'temperature': 10 + random() * 20,
      'humidity': 20 + random() * 20
    }
