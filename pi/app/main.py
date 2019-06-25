from jobs import periodic_reading
from utils import Hardware, IotHub, Queue
from config import PERIODIC_READING_INTERVAL
import json
import schedule
import time

def main_loop():
  hardware = None
  try:
    print('Setting up hardware...')
    hardware = Hardware()

    # Set up job queue
    queue = Queue(hardware)

    print('Connecting to IotHub...')
    IotHub(hardware=hardware, queue=queue)

    print('Setting up background jobs...')

    def sensor_reading(): return queue.append(
      "periodic_reading",
      {"methods": ['read_humidity', 'read_light', 'read_pressure']}
    )
    def soil_moisture_reading(): return queue.append(
      "periodic_reading",
      {"methods": ['read_mcp3008_soil_moisture', 'read_water_level']}
    )

    # Read humidity, light, pressure and temperature frequently
    schedule.every(PERIODIC_READING_INTERVAL).seconds.do(sensor_reading)
    # Read soil moisture and water level twice a day
    schedule.every().day.at("06:00").do(soil_moisture_reading) # 08:00 Swedish summer time
    schedule.every().day.at("18:00").do(soil_moisture_reading) # 20:00 Swedish summer time

    print('App ready!')

    while True:
      # Add scheduled jobs to queue
      schedule.run_pending()
      # Pop queue
      queue.work()
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
