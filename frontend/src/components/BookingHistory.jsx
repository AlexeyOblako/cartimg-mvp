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
      <h3>Booking history</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="tel"
          placeholder="Enter phone (e.g. +79991234567)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Find'}
        </button>
      </div>

      {!searched && <p>Enter a phone number to view booking history.</p>}

      {searched && bookings.length === 0 && <p>No bookings found for this number.</p>}

      {bookings.length > 0 && (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Session</th>
              <th>Date</th>
              <th>Time</th>
              <th>Participants</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.session_name}</td>
                <td>{b.booking_date}</td>
                <td>{b.booking_time}</td>
                <td>{b.participants}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
