import axios from 'axios';
import { auth } from '../firebase/firebase'
const API_BASE_URL = 'http://localhost:3000';


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if(user) {
      const idToken = await user.getIdToken();
      config.headers.Authorization = `Bearer ${idToken}`
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;