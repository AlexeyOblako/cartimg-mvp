# Feature 2: Бронирование заезда

## Цель

Реализовать возможность забронировать карты на выбранный заезд с проверкой доступных мест и атомарным уменьшением счётчика свободных картов.

## Требования

User Story #2 из `01_analysis.md`:

> Как **клиент**, я хочу **забронировать заезд на определённую дату и время**, чтобы гарантировать себе место.

User Story #5:

> Как **клиент**, я хочу **отменить бронирование**, чтобы освободить место, если планы изменились.

## Реализация

### Backend

**POST /api/bookings** — создание брони в транзакции:

```sql
BEGIN TRANSACTION;

  -- 1. Проверка существования и доступности
  SELECT * FROM sessions WHERE id = ?;   -- 404 если нет
  -- available_karts < karts_count → 400

  -- 2. Вставка брони
  INSERT INTO bookings (session_id, customer_name, customer_phone, karts_count)
  VALUES (?, ?, ?, ?);

  -- 3. Декремент счётчика
  UPDATE sessions SET available_karts = available_karts - ? WHERE id = ?;

COMMIT;
```

Ключевой код (`backend/src/routes/bookings.js`):

```js
db.serialize(() => {
  db.run('BEGIN TRANSACTION');

  db.get('SELECT * FROM sessions WHERE id = ?', [session_id], (err, session) => {
    if (!session) {
      db.run('ROLLBACK');
      return res.status(404).json({ error: 'Заезд не найден' });
    }

    if (session.available_karts < karts_count) {
      db.run('ROLLBACK');
      return res.status(400).json({ error: '...' });
    }

    db.run('INSERT INTO bookings ...', [...], function (err) {
      const bookingId = this.lastID;

      db.run('UPDATE sessions SET available_karts = available_karts - ? WHERE id = ?',
        [karts_count, session_id], function (err) {
          db.run('COMMIT');
          res.status(201).json({
            id: bookingId, session_id, customer_name,
            status: 'active', message: 'Бронь подтверждена',
          });
        });
    });
  });
});
```

### Изменения схемы

| Таблица | Было | Стало |
|---------|------|-------|
| `sessions` | `max_participants INTEGER` | `available_karts INTEGER` (хранимый счётчик) |
| `bookings` | `participants INTEGER` | `karts_count INTEGER` |

### Frontend

**SessionList.jsx** — на каждой карточке заезда кнопка «Забронировать». При клике раскрывается **BookingForm** с props `sessionId` и `sessionName`.

**BookingForm.jsx** — форма с полями: имя, телефон, количество картов. Отправляет `POST /api/bookings`. Ошибки отображаются красным. После успеха форма очищается, список заездов перезагружается.

## Проверка вручную

```bash
# 1. Создать бронь (доступно 8 картов)
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"session_id": 1, "customer_name": "Иван", "customer_phone": "+79991234567", "karts_count": 2}'
```

Ожидаемый ответ:

```json
{
  "id": 1,
  "session_id": 1,
  "customer_name": "Иван",
  "status": "active",
  "message": "Бронь подтверждена"
}
```

```bash
# 2. Проверить, что available_karts уменьшился с 8 до 6
curl http://localhost:3001/api/sessions/1
```

```bash
# 3. Ошибка — несуществующий заезд
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"session_id": 999, "customer_name": "Иван", "customer_phone": "+79991234567", "karts_count": 1}'
# → 404 {"error": "Заезд не найден"}
```

```bash
# 4. Ошибка — больше картов, чем доступно
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"session_id": 4, "customer_name": "Иван", "customer_phone": "+79991234567", "karts_count": 10}'
# → 400 {"error": "Нет свободных картов. Доступно: 6, запрошено: 10"}
```

## Промпты

Реализуй Фичу 2: бронирование заезда.

Backend (backend/src/routes/bookings.js):
- POST / — принимает {session_id, customer_name, customer_phone, karts_count}
- Логика:
    1. Проверить, что заезд существует (404 если нет)
    2. Проверить, что available_karts >= karts_count (400 если нет)
    3. Создать запись в bookings
    4. Уменьшить available_karts в sessions
    5. Вернуть {id, session_id, customer_name, status: 'active', message}
- Подключи роутер в src/index.js

Frontend:
- src/services/api.js — добавь createBooking(data)
- src/components/BookingForm.jsx — форма с полями: имя, телефон, количество картов
    * Отправляет POST на /api/bookings
    * Показывает ошибки (красным текстом)
    * Очищает форму после успеха
    * Принимает sessionId как prop
- Обнови SessionList.jsx — рядом с каждым заездом кнопка "Забронировать", которая показывает BookingForm
- Обнови App.jsx


ВАЖНО: Обработка ошибок должна быть корректной (try/catch, status codes).
