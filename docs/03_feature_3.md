# Feature 3: Просмотр истории бронирований по телефону

## Цель

Реализовать возможность просмотра всех бронирований клиента по номеру телефона.

## Требования

User Story #4 из `01_analysis.md`:

> Как **клиент**, я хочу **просматривать историю моих бронирований по номеру телефона**, чтобы отслеживать статус и даты поездок.

## Реализация

### Backend

**`GET /api/bookings/phone/:phone`** — новый эндпоинт, возвращает бронирования клиента с JOIN sessions:

```sql
SELECT bookings.id, bookings.session_id,
       sessions.date AS session_date, sessions.time AS session_time,
       bookings.karts_count, bookings.status, bookings.customer_name
FROM bookings
LEFT JOIN sessions ON bookings.session_id = sessions.id
WHERE bookings.customer_phone = ?
ORDER BY sessions.date DESC, sessions.time DESC
```

Роут `GET /phone/:phone` зарегистрирован **до** `GET /:id`, чтобы избежать конфликта маршрутизации Express.

Фильтр `?phone=` из `GET /` удалён (теперь это отдельный эндпоинт).

### Frontend

**`api.js`**:

```js
export const getBookingsByPhone = (phone) =>
  api.get(`/bookings/phone/${encodeURIComponent(phone)}`);
```

**`BookingHistory.jsx`** — поле ввода телефона, кнопка «Найти», таблица с колонками: дата, время, количество картов, статус. Пустой результат: «Ничего не найдено».

## Проверка вручную

```bash
# 1. Создать бронь
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"session_id":1,"customer_name":"Иван","customer_phone":"+79991234567","karts_count":2}'

# 2. Получить историю по телефону
curl "http://localhost:3001/api/bookings/phone/%2B79991234567"
```

Ожидаемый ответ:

```json
[
  {
    "id": 1,
    "session_id": 1,
    "session_date": "2026-07-10",
    "session_time": "14:00",
    "karts_count": 2,
    "status": "active",
    "customer_name": "Иван"
  }
]
```

```bash
# 3. Пустой результат
curl "http://localhost:3001/api/bookings/phone/%2B70000000000"
# → []
```

## Промпты

<!-- Раздел заполняется вручную -->
