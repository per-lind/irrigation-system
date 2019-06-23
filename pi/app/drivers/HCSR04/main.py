from utils.Driver import Driver
import time

class HCSR04(Driver):
  def __init__(self, config):
    methods = [{
      'id': 'read',
      'min_pause': 2,
      'response': {
        'range': {
          'name': 'Range',
          'unit': 'cm',
        }
      }
    }]
    Driver.__init__(self, name='HCSR04', methods=methods)

  def _connect_to_hardware(self):
    import RPi.GPIO as GPIO
    self.GPIO = GPIO
    GPIO.setmode(GPIO.BCM)
    self.TRIG = 23
    self.ECHO = 24
    GPIO.setup(self.TRIG, GPIO.OUT)
    GPIO.setup(self.ECHO, GPIO.IN)
    GPIO.output(self.TRIG, False)

  def _read(self, payload={}):
    # Number of attempts to read sensor before giving up
    n = 20
    # Number of nonzero readings that we want to get
    m = 10
    # Number of nonzero readings that's good enough
    k = 5

    result = []
    for x in range(0, n):
      try:
        value = self._raw_read()
        print("Reading HCSR04: {}".format(value))
        time.sleep(0.5)
        if value > 0:
          result.append(value)
          if len(result) >= m:
            break
      except Exception as inst:
        print('Failed to read HCSR04, retrying...')
        print(type(inst))
        print(inst.args)
        print(inst)

    # If we didn't get enough nonzero readings
    if len(result) < k:
      print("Error: Got {} nonzero readings from HCSR04".format(len(result)))
      raise Exception("Could not read HCSR04")

    # Calculate average
    value = sum(result)/len(result)

    return {
      'range': value
    }

  def _raw_read(self):
    self.GPIO.output(self.TRIG, False)
    # "Waiting For Sensor To Settle"
    time.sleep(2)
    self.GPIO.output(self.TRIG, True)
    time.sleep(0.00001)
    self.GPIO.output(self.TRIG, False)
    while self.GPIO.input(self.ECHO)==0:
      pulse_start = time.time()
    while self.GPIO.input(self.ECHO)==1:
      pulse_end = time.time()
    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150
    distance = round(distance, 2)
    return distance

  def _shutdown(self):
    success = True
    self.GPIO.cleanup() 
    return success
