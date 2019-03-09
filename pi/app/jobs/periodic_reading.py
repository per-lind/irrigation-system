import json
from datetime import datetime
from utils import database_api
import pytz

def run(hardware):
  print("Saving periodic reading")
  try:
    # Read sensors
    ids = ['humidity', 'light']
    data = hardware.invoke('read', ids)

    # Upload data to db
    to_upload = json.dumps({
      "deviceId": "Huvudsta",
      "timestamp": datetime.now(pytz.timezone('Europe/Stockholm')).isoformat(),
      "measures": data,
    })

    print("Uploading data to db")
    print("Data to upload: {}".format(to_upload))
    status = database_api.upload(to_upload)

    print("Upload status: %s" % status)

  except Exception as inst:
    print('Unexpected error with periodic reading!')
    print(type(inst))
    print(inst.args)
    print(inst)
