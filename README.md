# 🏎️ Картинг-центр MVP

Веб-приложение для бронирования заездов в картинг-центре.

## Стек технологий

- Backend: Node.js + Express + SQLite (sqlite3)
- Frontend: React + Vite + Axios
- ИИ-инструменты: opencode

## Запуск проекта

```bash
# Backend
cd backend
npm install
npm run dev
# Сервер запускается на http://localhost:3001

# Frontend
cd frontend
npm install
npm run dev
# Приложение запускается на http://localhost:5173
```

## API эндпоинты

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | /api/sessions | Получить список всех заездов |
| GET | /api/sessions/:id | Получить заезд по ID |
| POST | /api/sessions | Создать заезд |
| PUT | /api/sessions/:id | Обновить заезд |
| DELETE | /api/sessions/:id | Удалить заезд |
| GET | /api/bookings | Получить список всех бронирований |
| GET | /api/bookings/phone/:phone | Получить бронирования по телефону |
| GET | /api/bookings/:id | Получить бронирование по ID |
| POST | /api/bookings | Создать бронирование |
| PUT | /api/bookings/:id | Обновить бронирование |
| DELETE | /api/bookings/:id | Удалить бронирование |

## Структура проекта

```
karting-mvp/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── models/
│   │   │   └── database.js
│   │   └── routes/
│   │       ├── sessions.js
│   │       └── bookings.js
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
│   ├── 02_architecture.md
│   ├── 03_feature_1.md
│   ├── 03_feature_2.md
│   ├── 03_feature_3.md
│   ├── 04_test_cases.md
│   └── 05_bug_1.md
└── README.md
```
