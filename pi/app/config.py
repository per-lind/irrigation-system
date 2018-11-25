# Environment variables
import os
import json

# Whether hardware should be mocked
MOCK_HARDWARE = os.getenv('MOCK_HARDWARE', False)

# Azure IotHub settings
IOTHUB_CONNECTION = os.environ.get('IOTHUB_CONNECTION')
IOTHUB_MESSAGE_TIMEOUT = os.getenv('IOTHUB_MESSAGE_TIMEOUT', 10000)

# Interval (in seconds) between periodic readings
PERIODIC_READING_INTERVAL = os.getenv('PERIODIC_READING_INTERVAL', 15 * 60)
# How frequently (in seconds) stuff should be uploaded to iothub
UPLOAD_INTERVAL = os.getenv('UPLOAD_INTERVAL', 15)
# How old (in days) data should be deleted
PURGE_DATA = os.getenv('PURGE_DATA', 2)

with open('hardware.json') as f:
  hardware_config = json.load(f)
