import db
import json

def run(iothub):
  print("Uploading periodic readings to iot hub")
  try:
    # Get all readings that haven't been uploaded to iothub
    to_upload = []
    readings = db.Reading.select().where(db.Reading.uploaded == False)
    for reading in readings:
      to_upload.append({
        'timestamp': reading.timestamp.isoformat(),
        'data': reading.data,
      })

    # Send reading to iothub
    if to_upload:
      print("Data to upload: {}".format(json.dumps(to_upload)))
      status = iothub.send_message(json.dumps(to_upload))
      print("Upload status: %s" % status)
      # If upload was successfull, delete readings
      if status:
        db.Reading.delete().where(db.Reading.id.in_([r.id for r in readings])).execute()

  except Exception as inst:
    print('Unexpected error with upload work!')
    print(type(inst))
    print(inst.args)
    print(inst)
