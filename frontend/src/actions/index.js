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

const data = ({ socket, message, token, update, addAlert }) =>
  new Promise((resolve, reject) => {
    update({ loading: true });
    const callback = response => {
      update({ loading: false });
      if (response.status === 200) {
        resolve({ data: response.data })
      } else {
        const msg = `Failed to retrieve data! ${JSON.stringify(response)}`;
        addAlert(msg);
        reject(msg);
      }
    }
    socket.emit('message', { action: 'data', message, token }, callback);
  });

const events = ({ socket, message, token, update, addAlert }) => {
  update({ loading: true });
  const callback = response => {
    update({ loading: false });
    if (response.status === 200) {
      update({ irrigation: response.data });
    } else {
      addAlert(`Failed to retrieve events! ${JSON.stringify(response)}`);
    }
  }
  socket.emit('message', { action: 'events', message, token }, callback);
};

const hardware = ({ socket, token, update, addAlert }) => {
  update({ loading: true });
  const callback = response => {
    update({ loading: false });
    if (response.status === 200) {
      update({ hardware: response.Response });
    } else {
      addAlert(`Failed to retrieve hardware list! ${JSON.stringify(response)}`);
    }
  }
  socket.emit('message', {
    action: 'invoke',
    message: { method: 'list' },
    token,
  }, callback);
};

const invoke = ({ socket, token, message, update, addAlert }) =>
  new Promise((resolve, reject) => {
    update({ loading: true });
    const callback = response => {
      update({ loading: false });
      if (response.status === 200) {
        resolve(response);
      } else {
        addAlert(`Failed to invoke method! ${JSON.stringify(response)}`);
        reject(response);
      }
    }
    socket.emit('message', { action: 'invoke', message, token }, callback);
  });

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
