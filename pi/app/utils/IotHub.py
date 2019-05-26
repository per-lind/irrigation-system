from uuid import uuid4
from iothub_client import IoTHubClient, IoTHubTransportProvider, IoTHubMessage, DeviceMethodReturnValue
from utils.json_serializer import json_dumps
import json
from datetime import datetime
import pytz

from config import IOTHUB_CONNECTION, IOTHUB_MESSAGE_TIMEOUT

def send_confirmation_callback(message, result, user_context):
    print("Confirmation received for message with result = %s" % (result))

class IotHub:
  def __init__(self, hardware):
    self.method_callbacks = 0
    self.hardware = hardware
    self._init_client()

  def _init_client(self):
    # Connect to iot-hub
    self.client = IoTHubClient(IOTHUB_CONNECTION, IoTHubTransportProvider.MQTT)
    # Settings
    self.client.set_option("messageTimeout", IOTHUB_MESSAGE_TIMEOUT)
    self.client.set_device_method_callback(self.device_method_callback, 0)

  def send_confirmation_callback(self, message, result, user_context):
    print("Confirmation received for message with result {}".format(result))
    print("    message_id: %s" % message.message_id )
    print("    correlation_id: %s" % message.correlation_id )

  def send_message(self, payload):
    message_id = uuid4()
    message = IoTHubMessage(bytearray(payload, 'utf8'))
    self.client.send_event_async(message, self.send_confirmation_callback, message_id)
    print("Message {} accepted for transmission to IoT Hub.".format(message_id))
    return self.client.get_send_status()

  # Gets invoked by message from the cloud
  def device_method_callback(self, method_name, payload, user_context):
    print("Method callback called with: methodName = {}, payload = {}, context = {}".format(method_name, payload, user_context))

    msg = json.loads(payload)

    try:
      if method_name == 'list':
        response = self.hardware.list()
      else:
        payload = msg['payload'] if 'payload' in msg else {}
        result = self.hardware.invoke(method_name, msg['id'], payload)
        response = {
          'timestamp': datetime.now(pytz.timezone('Europe/Stockholm')),
          **result,
        }

      status = 200

    except NotImplementedError:
      response = 'Method not defined'
      status = 404

    except ValueError as inst:
      response = inst.args
      status = 400

    except Exception as inst:
      response = inst.args
      status = 500

    return_value = DeviceMethodReturnValue()
    return_value.status = status
    return_value.response = json_dumps({ 'Response': response })

    return return_value
