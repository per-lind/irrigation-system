from utils import Hardware
import time

def main_loop():
  hardware = None
  try:
    print('Setting up hardware...')
    hardware = Hardware()

    print('Connected hardware:')
    print(hardware.list())

    print(hardware.invoke('read', 'humidity'))
    #print(hardware.invoke('status', 'chip', { 'relay': 'pow1' }))
    #print(hardware.invoke('switch', 'chip', { 'relay': 'pow1', 'status': 'on' }))
    time.sleep(10)
    #print(hardware.invoke('switch', 'chip', { 'relay': 'pow1', 'status': 'off' }))

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
  print("Testing pi app...")
  main_loop()
