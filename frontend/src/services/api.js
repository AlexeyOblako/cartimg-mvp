import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const getSessions = () => api.get('/sessions');

export default api;
