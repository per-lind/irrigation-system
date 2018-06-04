import axios from 'axios';
import auth from './auth';

const baseUrl = (process.env.NODE_ENV === 'production') ? 'http://peli-iot-web.azurewebsites.net' : 'http://localhost:3001'

const url = (path) => baseUrl + path

const request = (options) => {
  // Set headers
  options.headers = { 'Content-Type': 'application/json' };
  // Authentication token
  const token = auth.getToken();
  if (token) options.headers.Authorization = `Bearer ${token}`

  return axios({...{ method: 'get' }, ...options, ...{ url: url(options.url) }})
}

export { url };
export default request;
