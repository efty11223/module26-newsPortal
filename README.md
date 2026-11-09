# The Daily Brief

A news portal assignment using React, Redux Toolkit, Tailwind CSS, Express, and
MongoDB. The public home, news list, and article detail pages are connected to
the backend API, with login, registration, and a user dashboard for managing
profiles and articles.

## Project structure

- `client/` — React frontend
- `server/` — Express API

## Getting started

Requirements: Node.js 20.19+, npm, and a MongoDB instance (local or MongoDB
Atlas).

1. Install dependencies from the project root:

   ```sh
   npm install
   npm --prefix client install
   npm --prefix server install
   ```

2. Copy `server/.env.example` to `server/.env`. Set `MONGODB_URI` to your
   local MongoDB URI or an Atlas connection string, and set `JWT_SECRET` to a
   private random value. Do not commit `server/.env`.
3. Start the frontend and API together:

   ```sh
   npm run dev
   ```

The frontend runs at `http://localhost:5173`; the API runs at
`http://localhost:5000`. The API health check is available at
`http://localhost:5000/api/health` and reports the database connection state.
The API exits with a clear error if MongoDB cannot be reached.

## Authentication API

- `POST /api/auth/register` — create an account.
- `POST /api/auth/login` — log in and receive a token.
- `GET /api/auth/me` — return the logged-in user. Send the token as a
  `Bearer` authorization header.
- `PUT /api/auth/me` — update your name and bio.

## News API

- `GET /api/news` — list published articles.
- `GET /api/news/featured` — the six latest published articles.
- `GET /api/news/:slug` — retrieve one published article.
- `GET /api/news/my` — list your articles (login required).
- `POST /api/news` — create and publish an article (login required).
- `PUT /api/news/:id` — edit your article (login required).
- `DELETE /api/news/:id` — delete your article (login required).

## Data models

- `User` stores profile details and a password hash, never a plaintext
  password. Login checks the stored hash.
- `News` stores article content, category, author, and publication status.
  User-created articles are published immediately.
