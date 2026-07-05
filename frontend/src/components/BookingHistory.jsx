import { useState } from 'react';
import api from '../services/api';

export default function BookingHistory() {
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    try {
      const res = await api.get('/bookings', { params: { phone: phone.trim() } });
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setBookings([]);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>История бронирований</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="tel"
          placeholder="Введите телефон (например +79991234567)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Поиск...' : 'Найти'}
        </button>
      </div>

      {!searched && <p>Введите номер телефона для просмотра истории.</p>}

      {searched && bookings.length === 0 && <p>Бронирований по этому номеру не найдено.</p>}

      {bookings.length > 0 && (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Заезд</th>
              <th>Дата</th>
              <th>Время</th>
              <th>Картов</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.session_name}</td>
                <td>{b.session_date}</td>
                <td>{b.session_time}</td>
                <td>{b.karts_count}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
