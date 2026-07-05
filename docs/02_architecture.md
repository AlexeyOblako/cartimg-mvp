# Архитектура — Картинг-центр MVP

## Цель

Спроектировать модульную архитектуру клиент-серверного приложения для бронирования заездов в картинг-центре с возможностью управления данными через REST API.

## Стек технологий

| Компонент  | Технология                     |
|------------|--------------------------------|
| Frontend   | React + Vite + Axios           |
| Backend    | Node.js + Express              |
| База данных| SQLite (библиотека sqlite3)    |
| Транспорт  | HTTP (JSON)                    |

## Схема базы данных

### Таблица `sessions`

| Поле             | Тип       | Ограничения                     |
|------------------|-----------|---------------------------------|
| id               | INTEGER   | PRIMARY KEY AUTOINCREMENT       |
| name             | TEXT      | NOT NULL                        |
| description      | TEXT      |                                 |
| price            | REAL      | NOT NULL                        |
| duration_minutes | INTEGER   | NOT NULL                        |
| max_participants | INTEGER   | NOT NULL                        |
| created_at       | TEXT      | DEFAULT (datetime('now'))       |

### Таблица `bookings`

| Поле           | Тип       | Ограничения                                      |
|----------------|-----------|--------------------------------------------------|
| id             | INTEGER   | PRIMARY KEY AUTOINCREMENT                        |
| session_id     | INTEGER   | NOT NULL, REFERENCES sessions(id)                |
| customer_name  | TEXT      | NOT NULL                                         |
| customer_phone | TEXT      | NOT NULL                                         |
| participants   | INTEGER   | NOT NULL                                         |
| booking_date   | TEXT      | NOT NULL                                         |
| booking_time   | TEXT      | NOT NULL                                         |
| status         | TEXT      | DEFAULT 'confirmed'                              |
| created_at     | TEXT      | DEFAULT (datetime('now'))                        |

## REST API Endpoints

### `GET /api/sessions` — список заездов

- **Тело запроса**: нет
- **Ответ**: `200 OK`

```json
[
  {
    "id": 1,
    "name": "Спринт 10 мин",
    "description": "Быстрый заезд на 10 минут",
    "price": 1500,
    "duration_minutes": 10,
    "max_participants": 8,
    "created_at": "2026-07-05 15:00:00"
  }
]
```

### `POST /api/bookings` — создать бронь

- **Тело запроса**:

```json
{
  "session_id": 1,
  "customer_name": "Иван",
  "customer_phone": "+79991234567",
  "participants": 2,
  "booking_date": "2026-07-10",
  "booking_time": "14:00"
}
```

- **Ответ**: `201 Created`

```json
{ "id": 5 }
```

### `GET /api/bookings?phone={phone}` — история бронирований по номеру телефона

- **Тело запроса**: нет
- **Ответ**: `200 OK`

```json
[
  {
    "id": 5,
    "session_id": 1,
    "session_name": "Спринт 10 мин",
    "customer_name": "Иван",
    "customer_phone": "+79991234567",
    "participants": 2,
    "booking_date": "2026-07-10",
    "booking_time": "14:00",
    "status": "confirmed",
    "created_at": "2026-07-05 15:10:00"
  }
]
```

### `DELETE /api/bookings/:id` — отменить бронь

- **Тело запроса**: нет
- **Ответ**: `200 OK`

```json
{ "deleted": 1 }
```

### `POST /api/sessions` — создать заезд (администрирование)

- **Тело запроса**:

```json
{
  "name": "Спринт 10 мин",
  "description": "Быстрый заезд на 10 минут",
  "price": 1500,
  "duration_minutes": 10,
  "max_participants": 8
}
```

- **Ответ**: `201 Created`

```json
{ "id": 1 }
```

## Структура проекта

```
cartimg-mvp/
├── backend/
│   ├── src/
│   │   ├── index.js              # Express сервер
│   │   ├── models/
│   │   │   └── database.js       # SQLite подключение + инициализация таблиц
│   │   └── routes/
│   │       ├── sessions.js       # CRUD заездов
│   │       └── bookings.js       # CRUD бронирований + фильтр по телефону
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── SessionList.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   └── BookingHistory.jsx
│   │   └── services/
│   │       └── api.js
│   └── package.json
├── docs/
│   ├── 01_analysis.md
│   └── 02_architecture.md
└── README.md
```

## Промпты

<!-- Раздел заполняется вручную -->
