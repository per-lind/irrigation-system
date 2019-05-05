# Environment variables
from dotenv import load_dotenv
load_dotenv()
import os
import json

# Whether hardware should be mocked
MOCK_HARDWARE = os.getenv('MOCK_HARDWARE', False)

# Azure IotHub settings
IOTHUB_CONNECTION = os.environ.get('IOTHUB_CONNECTION')
IOTHUB_MESSAGE_TIMEOUT = os.getenv('IOTHUB_MESSAGE_TIMEOUT', 10000)

# Api settings (db connection)
API_ENDPOINT = os.environ.get('API_ENDPOINT')
API_TOKEN = os.environ.get('API_TOKEN')

# Interval (in seconds) between periodic readings
PERIODIC_READING_INTERVAL = int(os.getenv('PERIODIC_READING_INTERVAL', 15 * 60))

with open('hardware.json') as f:
  hardware_config = json.load(f)
