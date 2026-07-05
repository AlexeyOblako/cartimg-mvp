import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const getSessions = () => api.get('/sessions');
export const createBooking = (data) => api.post('/bookings', data);
export const getBookingsByPhone = (phone) => api.get(`/bookings/phone/${encodeURIComponent(phone)}`);

export default api;
