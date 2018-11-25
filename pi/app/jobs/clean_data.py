import db
from datetime import timedelta
from config import PURGE_DATA

def run():
  print("Cleaning database")
  try:
    # Remove readings that have been uploaded
    db.Reading.delete().where(db.Reading.uploaded == True).execute()

    # Remove any readings older than `PURGE_DATA` days
    db.Reading.delete().where(db.Reading.timestamp < datetime.now() - timedelta(days=PURGE_DATA)).execute()

    print('Cleaning done')

  except Exception as inst:
    print('Unexpected error with cleaning work!')
    print(type(inst))
    print(inst.args)
    print(inst)
