# GreenCircle 🌿

> **Connecting local organic farmers with their community.**

A full-stack portfolio project built with Spring Boot (Java), React, and MySQL.

---

## ✨ Features

- 🌾 **Farmer dashboard with analytics** — real-time stats on total products, revenue, and pending orders
- 🔍 **Product search & filtering by location/category** — customers can discover local produce by region and type
- 🔐 **JWT-based authentication** — secure stateless auth with access tokens and refresh token strategy for both roles
- 📦 **Order management for both roles** — customers place and track orders; farmers view and manage incoming orders for their products

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6, Plain CSS |
| Backend | Java 17, Spring Boot 3, Spring Security + JWT |
| Database | MySQL 8 (prod) / H2 (local dev) |
| Frontend Deploy | Vercel |
| Backend Deploy | Render (Docker) |
| CI/CD | GitHub Actions |

---

## Project Structure

```
greencircle/
├── backend/          # Spring Boot REST API
├── frontend/         # React SPA (Vite)
├── database/         # schema.sql + seed data
├── Dockerfile        # backend container (used by Render)
├── docker-compose.yml  # local full-stack dev
└── .github/workflows/ci.yml
```

---

## Local Development (Docker Compose)

**Prerequisites:** Docker Desktop

```bash
# 1. Clone the repo
git clone https://github.com/Vartika1612/GreenCircle.git
cd GreenCircle

# 2. Start backend + MySQL
docker-compose up -d

# 3. Start frontend dev server
cd frontend
cp .env.example .env.local     # set VITE_API_BASE_URL=http://localhost:8080
npm install
npm run dev
# → http://localhost:5173
```

---

## Local Development (Without Docker)

```bash
# Backend (H2 in-memory, zero setup)
cd backend
mvn spring-boot:run
# → http://localhost:8080

# Frontend
cd frontend
npm install && npm run dev
```

---

## Environment Variables

### Backend (`.env` or system env)

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_URL` | `jdbc:h2:mem:greencircle` | JDBC connection URL |
| `DB_USER` | `sa` | DB username |
| `DB_PASS` | *(empty)* | DB password |
| `JWT_SECRET` | `dev-secret-change-in-prod` | **Change in production!** |
| `JWT_EXPIRATION_MS` | `86400000` | 24 hours |
| `ALLOWED_ORIGIN` | `http://localhost:5173` | Frontend CORS origin |

### Frontend (`.env.local`)

| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8080` | Backend API base URL |

---

## Running Tests

```bash
cd backend
mvn test
```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | Public | Register (CUSTOMER or FARMER) |
| POST | `/api/auth/login` | Public | Login → JWT |
| GET | `/api/products` | Public | Browse with `?search=&category=&location=` |
| GET | `/api/products/{id}` | Public | Product detail |
| POST | `/api/products` | FARMER | Create product |
| PUT | `/api/products/{id}` | FARMER | Update own product |
| DELETE | `/api/products/{id}` | FARMER | Delete own product |
| POST | `/api/orders` | CUSTOMER | Place order |
| GET | `/api/orders` | CUSTOMER | Own order history |
| GET | `/api/orders/{id}` | CUSTOMER | Order detail |
| GET | `/api/farmer/products` | FARMER | Own products list |
| GET | `/api/farmer/orders` | FARMER | Orders containing their products |
| GET | `/api/farmer/dashboard` | FARMER | Stats summary |

---

## Deployment

### Frontend → Vercel

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import the repo.
3. Set **Root Directory** to `frontend`.
4. Add environment variable: `VITE_API_BASE_URL=https://your-render-backend.onrender.com`
5. Deploy — Vercel auto-deploys on every push to `main`.

### Backend → Render

1. Go to [render.com](https://render.com) → **New → Web Service**.
2. Connect your GitHub repo.
3. Set **Root Directory** to `.` (repo root) and **Dockerfile** as the build method.
4. Add environment variables:

| Key | Value |
|-----|-------|
| `DB_URL` | Your MySQL connection string (e.g. from PlanetScale / Render DB) |
| `DB_USER` | DB username |
| `DB_PASS` | DB password |
| `DB_DRIVER` | `com.mysql.cj.jdbc.Driver` |
| `DDL_AUTO` | `validate` |
| `HIBERNATE_DIALECT` | `org.hibernate.dialect.MySQLDialect` |
| `JWT_SECRET` | A long random secret (min 32 chars) |
| `ALLOWED_ORIGIN` | Your Vercel frontend URL (e.g. `https://greencircle.vercel.app`) |

5. Render builds and deploys automatically on every push.

### Database → Render MySQL or PlanetScale (free tiers)

- **Render**: Create a free **PostgreSQL** or use an external MySQL provider.
- **PlanetScale**: Free MySQL-compatible serverless DB — get a connection string and paste into Render env vars.

---

## Demo Credentials (seed data)

| Role | Email | Password |
|------|-------|----------|
| FARMER | farmer@greencircle.com | password123 |
| CUSTOMER | customer@greencircle.com | password123 |

---

## 🧠 What I Learned

| Topic | Key Takeaway |
|-------|--------------|
| **JWT implementation & refresh token strategy** | Learned how to issue short-lived access tokens alongside long-lived refresh tokens, store them securely (HttpOnly cookies / local storage trade-offs), and rotate them on every use to prevent replay attacks. |
| **Spring Security best practices** | Gained hands-on experience wiring a custom `UserDetailsService`, configuring stateless `SecurityFilterChain`, and applying method-level `@PreAuthorize` guards so that FARMER-only and CUSTOMER-only endpoints are enforced at the service layer — not just the controller. |
| **Docker multi-container orchestration** | Built a `docker-compose.yml` that spins up MySQL, the Spring Boot API, and (optionally) the React dev server in isolated containers with health-checks and a shared bridge network, eliminating "works on my machine" problems. |

---

## License

MIT
