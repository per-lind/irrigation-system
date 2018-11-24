from peewee import *
from datetime import datetime

db = SqliteDatabase('pi.db')

class BaseModel(Model):
  class Meta:
    database = db

class Hardware(BaseModel):
  hardware_id = CharField(unique=True)
  last_call_at = DateTimeField(null=True)
  last_read_at = DateTimeField(null=True)
  last_reading = TextField(null=True)

class Reading(BaseModel):
  data = TextField()
  timestamp = DateTimeField(default=datetime.now())
  uploaded = BooleanField(default=False)

# Create the tables
db.create_tables([Hardware, Reading])
