import time

# ====== Methods exposed to iothub ======

# Read AM2320
def read_humidity_definition(hardware):
  return {**hardware.to_json('humidity', 'read'), 'id': 'read_humidity'}
def read_humidity(hardware):
  return lambda payload={}: hardware.invoke('read', 'humidity')['humidity']

# Read BMP280
def read_pressure_definition(hardware):
  return {**hardware.to_json('pressure', 'read'), 'id': 'read_pressure'}
def read_pressure(hardware):
  return lambda payload={}: hardware.invoke('read', 'pressure')['pressure']

# Read TSL2561
def read_light_definition(hardware):
  return {**hardware.to_json('light', 'read'), 'id': 'read_light'}
def read_light(hardware):
  return lambda payload={}: hardware.invoke('read', 'light')['light']

# Read HCSR04
def read_water_level_definition(hardware):
  return {**hardware.to_json('water_level', 'read'), 'id': 'read_water_level'}
def read_water_level(hardware):
  return lambda payload={}: hardware.invoke('read', 'water_level')['water_level']

# Run pump on MCP23017
def run_pump_definition(hardware, id):
  driver = hardware.to_json('chip')
  pump = driver['relays'][id]
  return {
    'id': "run_{}".format(id),
    'name': pump['name'],
    'driver': driver['driver'],
    'payload': {
      'duration': {
        'name': 'Duration',
        'type': 'integer',
        'unit': 'seconds',
        'min': 1,
        'max': 21,
      }
    },
    'response': {
      'success': {
        'name': 'Success',
        'unit': 'boolean',
      }
    }
  }
def run_pump(hardware, id):
  def run(payload):
    # Validate payload
    duration = payload.get('duration', None)
    definitions = run_pump_definition(hardware, id)['payload']['duration']
    min_duration = definitions['min']
    max_duration = definitions['max']
    if not isinstance(duration, int):
      raise ValueError("Duration must be integer (given: {})".format(duration))
    if duration > max_duration:
      raise ValueError("Duration can be at most {}".format(max_duration))
    if duration < min_duration:
      raise ValueError("Duration must be at least {}".format(min_duration))

    # Run pump
    try:
      # On
      hardware.invoke('switch', 'chip', {'relay': id, 'status': 'on'})
      # Wait for `duration` seconds
      time.sleep(duration)
      # Off
      hardware.invoke('switch', 'chip', {'relay': id, 'status': 'off'})

      return {
        'success': True,
        'duration': duration,
      }
    except:
      return {
        'success': False,
        'duration': duration,
      }

  return run

# Check water level on MCP23017
def watertank_status_definition(hardware):
  driver = hardware.to_json('chip')
  pin = driver['relays']['watertank_empty']
  return {
    **driver['methods'][method],
    'id': 'watertank_status',
    'name': pin['name'],
    'driver': driver['driver'],
  }
def watertank_status(hardware):
  return lambda payload={}: hardware.invoke('status', 'chip', {'relay': 'watertank_empty'})['chip']

# Read temperature on MCP3008
def read_mcp3008_temperature_definition(hardware):
  driver = hardware.to_json('mcp3008')
  relay = driver['relays']['temperature']
  return {
    'id': 'read_mcp3008_{}'.format('temperature'),
    'name': relay['name'],
    'driver': driver['driver'],
    'response': {
      'temperature': {
        'name': 'Value',
        'unit': relay['unit'],
      }
    }
  }
def read_mcp3008_temperature(hardware):
  return lambda payload={}: hardware.invoke('read', 'mcp3008', {'relay': 'temperature'})['mcp3008']

# Read soil moisture on MCP3008
def read_mcp3008_soil_moisture_definition(hardware):
  driver = hardware.to_json('mcp3008')
  return {
    'id': 'read_mcp3008_soil_moisture',
    'name': 'Soil moisture',
    'driver': driver['driver'],
    'response': {
      'soil_moisture1': {
        'name': driver['relays']['soil_moisture1']['name'],
        'unit': driver['relays']['soil_moisture1']['unit'],
      },
      'soil_moisture2': {
        'name': driver['relays']['soil_moisture2']['name'],
        'unit': driver['relays']['soil_moisture2']['unit'],
      },
      'soil_moisture3': {
        'name': driver['relays']['soil_moisture3']['name'],
        'unit': driver['relays']['soil_moisture4']['unit'],
      },
      'soil_moisture4': {
        'name': driver['relays']['soil_moisture4']['name'],
        'unit': driver['relays']['soil_moisture4']['unit'],
      }
    }
  }
def read_mcp3008_soil_moisture(hardware):
  def read(payload={}):
    hardware.invoke('switch', 'chip', {'relay': 'pow1', 'status': 'on'})
    time.sleep(5)
    result = {
      **hardware.invoke('read', 'mcp3008', {'relay': 'soil_moisture1'})['mcp3008'],
      **hardware.invoke('read', 'mcp3008', {'relay': 'soil_moisture2'})['mcp3008'],
      **hardware.invoke('read', 'mcp3008', {'relay': 'soil_moisture3'})['mcp3008'],
      **hardware.invoke('read', 'mcp3008', {'relay': 'soil_moisture4'})['mcp3008'],
    }
    hardware.invoke('switch', 'chip', {'relay': 'pow1', 'status': 'off'})
    return result

  return read

def methods(hardware):
  return [
    read_humidity_definition(hardware),
    read_pressure_definition(hardware),
    read_light_definition(hardware),
    read_water_level_definition(hardware),
    run_pump_definition(hardware, 'pump1'),
    run_pump_definition(hardware, 'pump2'),
    run_pump_definition(hardware, 'pump3'),
    run_pump_definition(hardware, 'pump4'),
    watertank_status_definition(hardware),
    read_mcp3008_temperature_definition(hardware),
    read_mcp3008_soil_moisture_definition(hardware),
  ]

def invoke(hardware):
  return {
    'run_pump1': run_pump(hardware, 'pump1'),
    'run_pump2': run_pump(hardware, 'pump2'),
    'run_pump3': run_pump(hardware, 'pump3'),
    'run_pump4': run_pump(hardware, 'pump4'),
    'watertank_status': watertank_status(hardware),
    'read_humidity': read_humidity(hardware),
    'read_pressure': read_pressure(hardware),
    'read_light': read_light(hardware),
    'read_water_level': read_water_level(hardware),
    'read_mcp3008_temperature': read_mcp3008_temperature(hardware),
    'read_mcp3008_soil_moisture': read_mcp3008_soil_moisture(hardware),
  }
