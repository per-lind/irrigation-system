from utils import Hardware, json_dumps
import time
import traceback

def main_loop():
  hardware = None
  try:
    print('Setting up hardware...')
    hardware = Hardware()

    print(hardware.invoke('read', 'humidity'))
    print(hardware.invoke('read', 'pressure'))
    print(hardware.invoke('read', 'light'))

    print(hardware.invoke('run', 'chip', { 'relay': 'pump1', 'duration': 1 }))
    print(hardware.invoke('switch', 'chip', { 'relay': 'pow1', 'status': 'on' }))
    time.sleep(5)
    print(hardware.invoke('switch', 'chip', { 'relay': 'pow1', 'status': 'off' }))
    print(hardware.invoke('read', 'chip', { 'relay': 'mcp3008' }))

    print('Connected hardware:')
    print(json_dumps(hardware.list()))

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
