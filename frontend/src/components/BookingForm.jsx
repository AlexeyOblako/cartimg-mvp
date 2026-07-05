import { useState } from 'react';
import { createBooking } from '../services/api';

export default function BookingForm({ sessionId, sessionName, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    karts_count: 1,
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-]{2,}$/;
    const phoneRegex = /^\d{11}$/;

    if (!nameRegex.test(form.customer_name)) {
      setError('Имя должно содержать только буквы (минимум 2 символа)');
      return;
    }

    if (!phoneRegex.test(form.customer_phone)) {
      setError('Телефон должен содержать ровно 11 цифр (например, 88005553312)');
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({
        session_id: sessionId,
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        karts_count: Number(form.karts_count),
      });
      setForm({ customer_name: '', customer_phone: '', karts_count: 1 });
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: '0.5rem',
        padding: '0.75rem',
        border: '1px solid #4caf50',
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        fontSize: '0.9rem',
      }}
    >
      <strong>Бронирование: {sessionName}</strong>

      <input
        name="customer_name"
        placeholder="Ваше имя"
        value={form.customer_name}
        onChange={handleChange}
        required
      />
      <input
        name="customer_phone"
        placeholder="Телефон (11 цифр, например 88005553312)"
        value={form.customer_phone}
        onChange={handleChange}
        required
      />
      <input
        name="karts_count"
        type="number"
        min={1}
        placeholder="Количество картов"
        value={form.karts_count}
        onChange={handleChange}
        required
      />

      {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Бронирую...' : 'Забронировать'}
        </button>
        <button type="button" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  );
}
