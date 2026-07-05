import { useState, useEffect } from 'react';
import api from '../services/api';

export default function SessionList() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/sessions')
      .then((res) => setSessions(res.data))
      .catch((err) => console.error('Failed to load sessions:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading sessions...</p>;

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {sessions.map((s) => (
        <div key={s.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: '1rem', width: 260 }}>
          <h3>{s.name}</h3>
          <p>{s.description}</p>
          <p><strong>{s.price} ₽</strong> &middot; {s.duration_minutes} мин &middot; до {s.max_participants} чел.</p>
        </div>
      ))}
    </div>
  );
}
