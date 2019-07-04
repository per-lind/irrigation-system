import auth from './auth';
import { API_URL } from './config';
import io from "socket.io-client";
import actions from '../actions';

const connect = ({ token, update, addAlert, addEvent }) => {
  const socket = io.connect(API_URL, {
    query: { token },
  });
  socket.on('error', () => {
    // Failed to connect => force user to connect again
    auth.clearAppStorage();
    socket.disconnect();
  });
  // New data from pi
  socket.on('upload', ({ timestamp, model, data }) => {
    console.log("Got new data", timestamp, model, data);
    if (model === 'measures') {
      // TODO force graph to reload
    } else if (model === 'events') {
      // TODO force irrigation history to reload
      // Add data to context
      addEvent(data);
    } else if (model === 'errors') {
      addAlert(data.message);
    }
  });
  return {
    socket,
    send: (action, message = {}) => {
      const handler = actions[action];
      if (handler) {
        return handler({ socket, message, token, update, addAlert });
      } else {
        addAlert("Unknown action");
      }
    },
    disconnect: () => socket.disconnect(),
  };
};

const websocket = (update, addAlert, addEvent) => {
  // Get authentication token
  const token = auth.getToken();
  // Connect to api
  const socket = connect({ token, update, addAlert, addEvent });
  // Get graph hardware list
  socket.send('hardware');
  update({ socket });
};

export default websocket;
