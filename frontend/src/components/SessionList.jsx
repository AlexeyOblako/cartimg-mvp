import { useState, useEffect } from 'react';
import { getSessions } from '../services/api';

export default function SessionList() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSessions()
      .then((res) => setSessions(res.data))
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: 'red' }}>Ошибка: {error}</p>;

  if (sessions.length === 0) return <p>Нет заездов</p>;

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {sessions.map((s) => (
        <div key={s.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: '1rem', width: 260 }}>
          <h3>{s.name}</h3>
          <p><strong>Дата:</strong> {s.date}</p>
          <p><strong>Время:</strong> {s.time}</p>
          <p><strong>Цена:</strong> {s.price} ₽</p>
          <p><strong>Свободно мест:</strong> {s.available_places} / {s.max_participants}</p>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>{s.duration_minutes} мин · {s.description}</p>
        </div>
      ))}
    </div>
  );
}
