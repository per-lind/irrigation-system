import json
import db

def run(hardware):
  print("Saving periodic reading")
  try:
    # Read sensors
    data = hardware.read()
    print(data)
    # Save reading in database
    reading = db.Reading.create(data=json.dumps(data))
    print('Periodic reading saved')
    return True

  except Exception as inst:
    print('Unexpected error with periodic reading!')
    print(type(inst))
    print(inst.args)
    print(inst)
    return False
