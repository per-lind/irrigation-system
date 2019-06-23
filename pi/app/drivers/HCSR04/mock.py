from drivers.HCSR04.main import HCSR04 as Main
from random import random

class HCSR04(Main):
  def _connect_to_hardware(self):
    pass

  def _raw_read(self):
    return 10 + random() * 20
