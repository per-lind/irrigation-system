from helpers import json_dumps
from utils import database_api
from datetime import datetime
import pytz

def run(hardware, settings):
  try:
    print("Invoking device method")
    method = settings["method"]
    payload = settings["payload"]

    result = hardware.invoke_method(method, payload)

    to_upload = json_dumps({
      "deviceId": "Huvudsta",
      "timestamp": datetime.now(pytz.timezone('Europe/Stockholm')),
      "model": "events",
      "data": {
        'method': method,
        **result,
      },
    })

    print("Uploading event data to db")
    print("Data to upload: {}".format(to_upload))
    response = database_api.upload(to_upload)

    print("Upload status: %s" % response.status_code)

  except Exception as inst:
    print('Unexpected error with method invoke!')
    print(type(inst))
    print(inst.args)
    print(inst)
    try:
      print('Sending error message api')
      to_upload = json_dumps({
          "deviceId": "Huvudsta",
          "timestamp": datetime.now(pytz.timezone('Europe/Stockholm')),
          "model": "errors",
          "data": {
            'message': inst.args
          },
      })
      print("Data to upload: {}".format(to_upload))
      response = database_api.upload(to_upload)
    except Exception as inst:
      print('Failed to upload error')
      print(type(inst))
      print(inst.args)
      print(inst)
