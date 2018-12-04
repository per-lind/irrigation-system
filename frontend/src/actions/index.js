import { request, auth } from '../utilities';

const login = password => {
  return request({
    url: '/api/login',
    method: 'post',
    data: { username: 'user1', password: password }
  }).then(response => {
    auth.setToken(response.data.token);
    auth.setUser(response.data.user);
  });
};

const logout = () => {
  return request({
    url: '/api/logout',
  }).then(response => {
    auth.clearAppStorage();
  });
};

const getHardwareList = () => {
  return request({
    url: '/api/invoke',
    params: {
      method: 'list',
    }
  })
  .then(response => response.data.Response);
}

const invoke = (method, payload) => {
  return request({
    url: '/api/invoke',
    params: {
      method,
      payload,
    }
  })
  .then(response => JSON.parse(response))
};

export {
  login,
  logout,
  getHardwareList,
  invoke,
};
