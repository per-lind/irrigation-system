# Environment variables
import os
import json

# Whether hardware should be mocked
MOCK_HARDWARE = os.getenv('MOCK_HARDWARE', False)

with open('hardware.json') as f:
  hardware_config = json.load(f)
