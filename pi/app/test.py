from utils import Hardware
from helpers import json_dumps
import time
import traceback

def main_loop():
  hardware = None
  try:
    print('Setting up hardware...')
    hardware = Hardware()

    # print(hardware.invoke('read', 'humidity'))
    # print(hardware.invoke('read', 'pressure'))
    # print(hardware.invoke('read', 'light'))

    print('Connected hardware:')
    print(json_dumps(hardware.list()))

    print(hardware.invoke_method('read_humidity'))
    print(hardware.invoke_method('read_pressure'))
    print(hardware.invoke_method('read_light'))
    print(hardware.invoke_method('run_pump1', payload={'duration':4}))
    print(hardware.invoke_method('read_mcp3008_temperature'))
    print(hardware.invoke_method('read_mcp3008_soil_moisture'))

  except KeyboardInterrupt:
    print('Process ended by user.')

  except Exception as inst:
    print('Unexpected error!')
    print(type(inst))
    print(inst.args)
    print(inst)
    print(traceback.format_exc())

  finally:
    shutdown_gracefully(hardware)

def shutdown_gracefully(hardware):
  if hardware:
    print('Shutting down gracefully...')
    print('Trying to shut down all relays')
    status = hardware.stop_all()
    print('Shutdown successful: %s' % status)

if __name__ == '__main__':
  print("Testing pi app...")
  main_loop()
