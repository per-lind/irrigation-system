import db
from utils import Hardware

def main_loop():
  hardware = None
  try:
    print('Setting up hardware...')
    hardware = Hardware()
    print('done')

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
