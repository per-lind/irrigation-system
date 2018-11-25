import db
from jobs import periodic_reading, clean_data, upload_readings
from utils import Hardware, IotHub
from config import PERIODIC_READING_INTERVAL, UPLOAD_INTERVAL

import threading
import schedule
import time

def run_threaded(job_func):
    job_thread = threading.Thread(target=job_func)
    job_thread.start()

def main_loop():
  hardware = None
  try:
    print('Setting up hardware...')
    hardware = Hardware()
    # print('Connecting to Iot Hub...')
    # iothub = IotHub()

    print('Setting up background jobs...')
    schedule.every(PERIODIC_READING_INTERVAL).seconds.do(run_threaded, lambda: periodic_reading.run(hardware))
    schedule.every().hour.do(run_threaded, lambda: clean_data.run())
    schedule.every(UPLOAD_INTERVAL).seconds.do(run_threaded, lambda: upload_readings.run(iothub=None))

    print('App ready!')

    while True:
      schedule.run_pending()
      time.sleep(1)

  except KeyboardInterrupt:
    print('Process ended by user.')

  except Exception as inst:
    print('Unexpected error!')
    print(type(inst))
    print(inst.args)
    print(inst)

  finally:
    shutdown_gracefully(hardware)

def shutdown_gracefully(hardware):
  if hardware:
    print('Shutting down gracefully...')
    print('Trying to shut down all relays')
    status = hardware.stop_all()
    print('Shutdown successful: %s' % status)

if __name__ == '__main__':
  print("Starting raspberry pi app...")
  main_loop()
