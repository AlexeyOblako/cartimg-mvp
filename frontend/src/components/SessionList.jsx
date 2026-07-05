import { useState, useEffect } from 'react';
import { getSessions } from '../services/api';
import BookingForm from './BookingForm';

export default function SessionList() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const loadSessions = () => {
    setLoading(true);
    getSessions()
      .then((res) => setSessions(res.data))
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSessions();
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: 'red' }}>Ошибка: {error}</p>;
  if (sessions.length === 0) return <p>Нет заездов</p>;

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {sessions.map((s) => (
        <div
          key={s.id}
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: '1rem',
            width: 260,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3 style={{ margin: '0 0 0.5rem' }}>{s.name}</h3>
          <p style={{ margin: '0.15rem 0' }}>
            <strong>Дата:</strong> {s.date}
          </p>
          <p style={{ margin: '0.15rem 0' }}>
            <strong>Время:</strong> {s.time}
          </p>
          <p style={{ margin: '0.15rem 0' }}>
            <strong>Цена:</strong> {s.price} ₽
          </p>
          <p style={{ margin: '0.15rem 0' }}>
            <strong>Свободно картов:</strong> {s.available_karts}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.15rem 0' }}>
            {s.duration_minutes} мин &middot; {s.description}
          </p>

          {selectedSessionId !== s.id && (
            <button
              onClick={() => setSelectedSessionId(s.id)}
              style={{ marginTop: 'auto', alignSelf: 'stretch' }}
            >
              Забронировать
            </button>
          )}

          {selectedSessionId === s.id && (
            <BookingForm
              sessionId={s.id}
              sessionName={`${s.name} — ${s.date} ${s.time}`}
              onSuccess={() => {
                setSelectedSessionId(null);
                loadSessions();
              }}
              onCancel={() => setSelectedSessionId(null)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
