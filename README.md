# LMS Admin Starter (MERN)

This is a runnable starter for an LMS administration panel. It includes:
- Express + MongoDB backend
- JWT login and admin-protected API
- User, course, category, enrollment and lesson models
- Basic CRUD APIs for users, courses and categories
- React + Vite + Tailwind-style utility classes (plain CSS included)
- Dashboard overview and starter navigation

## Requirements
- Node.js 20+
- MongoDB local or Atlas connection string

## 1. Backend setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
Edit `backend/.env` and set `MONGO_URI`, `JWT_SECRET`, and `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
On first startup, the server creates the initial admin account if it does not already exist.

Backend runs at `http://localhost:5000`.

## 2. Frontend setup
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

Login with the admin email/password configured in `backend/.env`.

## Folder map
- `backend/src/models`: MongoDB schemas
- `backend/src/controllers`: request handlers
- `backend/src/routes`: API endpoints
- `backend/src/middleware`: JWT and role checks
- `frontend/src/pages`: dashboard pages
- `frontend/src/components`: shared UI
- `frontend/src/services`: API client

## API routes
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard/stats`
- `GET/POST /api/users`
- `GET/POST/PUT/DELETE /api/courses`
- `GET/POST/PUT/DELETE /api/categories`

All management endpoints require `Authorization: Bearer <token>`.

## Important production work still required
Before real deployment, add request validation, rate limiting, audit logs, password reset, email verification, secure refresh-token handling, file upload to S3/Cloudinary, payment-provider webhooks, automated tests, backups, and fine-grained permissions. Never commit `.env`.
