import json
from datetime import datetime
import pytz

def run(hardware, iothub):
  print("Saving periodic reading")
  try:
    # Read sensors
    ids = ['humidity', 'light']
    data = hardware.invoke('read', ids)

    # Upload data to iothub
    to_upload = json.dumps({
      "deviceId": "Huvudsta",
      "timestamp": datetime.now(pytz.timezone('Europe/Stockholm')).isoformat(),
      "measures": data,
    })

    print("Uploading data to iothub")
    print("Data to upload: {}".format(to_upload))
    status = iothub.send_message(to_upload)

    print("Upload status: %s" % status)

  except Exception as inst:
    print('Unexpected error with periodic reading!')
    print(type(inst))
    print(inst.args)
    print(inst)
