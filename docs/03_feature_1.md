# Feature 1: Просмотр списка заездов

## Цель

Реализовать страницу со списком доступных заездов с указанием даты, времени, цены и количества свободных мест.

## Требования

User Story #1 из `01_analysis.md`:

> Как **клиент**, я хочу **просматривать список доступных заездов**, чтобы выбрать подходящий по времени, цене и количеству участников.

## Реализация

### Backend

**Таблица `sessions`** расширена полями `date` и `time` — каждый заезд теперь привязан к конкретной дате и времени.

**`GET /api/sessions`** возвращает заезды с вычисляемым полем `available_places`:

```sql
SELECT s.*, s.max_participants - IFNULL(SUM(b.participants), 0) AS available_places
FROM sessions s
LEFT JOIN bookings b ON b.session_id = s.id AND b.status = 'confirmed'
GROUP BY s.id
ORDER BY s.date ASC, s.time ASC;
```

**Сидер** в `database.js` при первом запуске добавляет 5 тестовых заездов, если таблица пуста.

**`BookingForm`** больше не запрашивает дату и время — они выбираются вместе с сессией. `booking_date` и `booking_time` удалены из таблицы `bookings`.

**`BookingHistory`** получает дату/время через JOIN с `sessions`:

```js
const sql = `
  SELECT bookings.*, sessions.name AS session_name,
         sessions.date AS session_date, sessions.time AS session_time
  FROM bookings
  LEFT JOIN sessions ON bookings.session_id = sessions.id
`;
```

### Frontend

**`SessionList.jsx`** — загружает данные через `getSessions()`, отображает карточки с полями: дата, время, название, цена, свободные места. Обрабатывает состояния: «Загрузка...», ошибка, «Нет заездов».

## Проверка вручную

```bash
# 1. Запустить backend
cd backend && npm run dev

# 2. Получить список заездов
curl http://localhost:3001/api/sessions
```

Ожидаемый ответ:

```json
[
  {
    "id": 1,
    "name": "Спринт 10 мин",
    "description": "Быстрый заезд для начинающих",
    "price": 1500,
    "duration_minutes": 10,
    "max_participants": 8,
    "date": "2026-07-10",
    "time": "14:00",
    "created_at": "2026-07-05 15:00:00",
    "available_places": 8
  }
]
```

## Промпты

Реализуй Фичу 1: просмотр списка заездов.

Backend (backend/src/routes/sessions.js):
- GET / — возвращает все заезды из sessions, отсортированные по date, time
- Подключи роутер в src/index.js через app.use('/api/sessions', sessionsRouter)

Frontend:
- src/services/api.js — добавь функцию getSessions()
- src/components/SessionList.jsx — компонент, который:
    * загружает заезды через useEffect при монтировании
    * отображает список: дата, время, свободные места, цена
    * показывает "Загрузка..." и "Нет заездов"
- src/App.jsx — подключи SessionList

Также добавь в backend/src/models/database.js сидер: при первом запуске, если таблица sessions пустая, добавь 3-5 тестовых заездов на будущие даты.


ВАЖНО: Код должен работать. Проверь, что нет ошибок импорта.
