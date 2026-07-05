# 🏎️ Carting Center MVP

E-commerce platform for booking go-kart sessions.

## Stack

- **Backend**: Node.js + Express + SQLite (sqlite3)
- **Frontend**: React + Vite + Axios

## Getting started

### Backend

```bash
cd backend
npm install
npm run dev
```

Server starts at `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App starts at `http://localhost:5173`.

## API endpoints

| Method | Endpoint               | Description                |
|--------|------------------------|----------------------------|
| GET    | /api/sessions          | List all sessions          |
| GET    | /api/sessions/:id      | Get session by ID          |
| POST   | /api/sessions          | Create a session           |
| PUT    | /api/sessions/:id      | Update a session           |
| DELETE | /api/sessions/:id      | Delete a session           |
| GET    | /api/bookings          | List bookings (?phone=)    |
| GET    | /api/bookings/:id      | Get booking by ID          |
| POST   | /api/bookings          | Create a booking           |
| PUT    | /api/bookings/:id      | Update a booking           |
| DELETE | /api/bookings/:id      | Delete a booking           |
