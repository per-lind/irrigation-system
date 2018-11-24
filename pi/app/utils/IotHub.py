from uuid import uuid4
from iothub_client import IoTHubClient, IoTHubTransportProvider, IoTHubMessage

from config import IOTHUB_CONNECTION, IOTHUB_MESSAGE_TIMEOUT

def send_confirmation_callback(message, result, user_context):
    print("Confirmation received for message with result = %s" % (result))

class IotHub:
  def __init__(self):
    self.method_callbacks = 0
    self._init_client()

  def _init_client(self):
    # Connect to iot-hub
    self.client = IoTHubClient(IOTHUB_CONNECTION, IoTHubTransportProvider.MQTT)
    # Settings
    self.client.set_option("messageTimeout", IOTHUB_MESSAGE_TIMEOUT)

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
