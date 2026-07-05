import { useState, useEffect } from 'react';
import api from '../services/api';

export default function BookingForm() {
  const [sessions, setSessions] = useState([]);
  const [form, setForm] = useState({
    session_id: '',
    customer_name: '',
    customer_phone: '',
    participants: 1,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/sessions').then((res) => setSessions(res.data)).catch(console.error);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings', form);
      setMessage('Бронь подтверждена!');
      setForm({ session_id: '', customer_name: '', customer_phone: '', participants: 1 });
    } catch (err) {
      setMessage('Ошибка: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <h3>Забронировать заезд</h3>

      <select name="session_id" value={form.session_id} onChange={handleChange} required>
        <option value="">-- Выберите заезд --</option>
        {sessions.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} — {s.date} {s.time} — {s.price} ₽
          </option>
        ))}
      </select>

      <input name="customer_name" placeholder="Ваше имя" value={form.customer_name} onChange={handleChange} required />
      <input name="customer_phone" placeholder="Телефон (например +79991234567)" value={form.customer_phone} onChange={handleChange} required />
      <input name="participants" type="number" min={1} placeholder="Количество участников" value={form.participants} onChange={handleChange} required />

      <button type="submit">Забронировать</button>
      {message && <p>{message}</p>}
    </form>
  );
}
