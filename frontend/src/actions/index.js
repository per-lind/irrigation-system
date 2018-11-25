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

export {
  login,
  logout,
};
