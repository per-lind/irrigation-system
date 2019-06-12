import auth from './auth';
import { API_URL } from './config';
import io from "socket.io-client";
import actions from '../actions';

const connect = ({ token, update }) => {
  const socket = io.connect(API_URL, {
    query: { token },
  });
  socket.on('error', () => {
    // Failed to connect => force user to connect again
    // auth.clearAppStorage();
    socket.disconnect();
  });
  return {
    socket,
    send: (action, message = {}) => {
      const handler = actions[action];
      if (handler) {
        return handler({ socket, message, token, update });
      } else {
        console.log('Unknown action');
        Promise.reject("Unknown action");
      }
    },
    disconnect: socket.disconnect,
  };
};

const websocket = (update) => {
  // Get authentication token
  const token = auth.getToken();
  // Connect to api
  const socket = connect({ token, update });
  // Get graph hardware list
  socket.send('hardware');
  update({ socket });
};

export default websocket;
