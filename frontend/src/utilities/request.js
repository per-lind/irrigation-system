import axios from 'axios';
import auth from './auth';
import { API_URL } from './config';


const url = (path) => API_URL + path

const request = (options) => {
  // Set headers
  options.headers = { 'Content-Type': 'application/json' };
  // Authentication token
  const token = auth.getToken();
  if (token) options.headers.Authorization = `Bearer ${token}`

  return axios({ method: 'get', ...options, url: url(options.url) })
}

export { url };
export default request;
