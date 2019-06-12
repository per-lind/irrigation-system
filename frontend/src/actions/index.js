import { request, auth } from '../utilities';

const login = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'post',
    data: { username, password }
  }).then(response => {
    auth.setToken(response.data.token);
    auth.setUser(response.data.user);
  });
};

const data = ({ socket, message, token, update }) => {
  const callback = response => {
    if (response.status === 200) {
      update({ data: response.data })
    } else {
      // TODO: display alert
    }
  }
  socket.emit('message', { action: 'data', message, token }, callback);
};

const events = ({ socket, message, token, update }) => {
  const callback = response => {
    if (response.status === 200) {
      update({ events: response.data })
    } else {
      // TODO: display alert
    }
  }
  socket.emit('message', { action: 'events', message, token }, callback);
};

const hardware = ({ socket, token, update }) => {
  const callback = response => {
    if (response.status === 200) {
      update({ hardware: response.Response })
    } else {
      // TODO: display alert
    }
  }
  socket.emit('message', {
    action: 'invoke',
    message: { method: 'list' },
    token,
  }, callback);
};

const invoke = ({ socket, token, message }) => {
  const callback = response => {
    console.log("got response", response);
    if (response.status === 200) {
      // TODO: update result
    } else {
      // TODO: display alert
    }
  }
  socket.emit('message', { action: 'invoke', message, token }, callback);
};

export {
  login,
  data,
  events,
  hardware,
  invoke,
};

export default {
  login,
  data,
  events,
  hardware,
  invoke,
};
