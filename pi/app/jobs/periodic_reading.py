from helpers import json_dumps
from utils import database_api
from datetime import datetime
import pytz

def run(hardware):
  print("Saving periodic reading")
  try:
    # Read sensors
    ids = ['humidity', 'light', 'pressure']
    data = {}
    for id in ids:
      try:
        result = hardware.invoke('read', id)
        data = { **data, **result }
      except Exception as inst:
        print('Failed to read {}'.format(id))
        print(type(inst))
        print(inst.args)
        print(inst)

    # Upload data to db
    to_upload = json_dumps({
      "deviceId": "Huvudsta",
      "timestamp": datetime.now(pytz.timezone('Europe/Stockholm')),
      "model": "measures",
      "data": data,
    })

    print("Uploading data to db")
    print("Data to upload: {}".format(to_upload))
    response = database_api.upload(to_upload)

    print("Upload status: %s" % response.status_code)

  except Exception as inst:
    print('Unexpected error with periodic reading!')
    print(type(inst))
    print(inst.args)
    print(inst)
