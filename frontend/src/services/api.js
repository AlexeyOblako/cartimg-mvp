import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const getSessions = () => api.get('/sessions');
export const createBooking = (data) => api.post('/bookings', data);

export default api;
