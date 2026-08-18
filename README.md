# GreenCircle 🌿

> **Connecting local organic farmers with their community.**

A full-stack portfolio project built with Spring Boot (Java), React, and MySQL — deployable on AWS free tier.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6, Plain CSS |
| Backend | Java 17, Spring Boot 3, Spring Security + JWT |
| Database | MySQL 8 (prod) / H2 (local dev) |
| Infra | AWS EC2, RDS, S3, CloudFront |
| CI/CD | GitHub Actions |

---

## Project Structure

```
greencircle/
├── backend/          # Spring Boot REST API
├── frontend/         # React SPA (Vite)
├── database/         # schema.sql + seed data
├── docs/             # architecture diagram + deployment notes
├── Dockerfile        # backend container
├── docker-compose.yml
└── .github/workflows/ci.yml
```

---

## Local Development (Docker Compose)

**Prerequisites:** Docker Desktop, Java 17, Node 18+

```bash
# 1. Clone the repo
git clone https://github.com/yourname/greencircle.git
cd greencircle

# 2. Copy env files
cp .env.example .env           # edit DB password, JWT secret

# 3. Start backend + MySQL
docker-compose up -d

# 4. Start frontend dev server
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
| `S3_BUCKET` | `greencircle-images` | S3 bucket for product images |

### Frontend (`.env.local`)

| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8080` | Backend API base URL |
| `VITE_S3_BASE_URL` | `https://bucket.s3.amazonaws.com` | S3 image base URL |

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

## AWS Deployment

See [`docs/architecture.md`](docs/architecture.md) for the full deployment guide.

**Summary:**
- **RDS**: MySQL db.t3.micro — create DB, run `database/schema.sql`
- **EC2**: t2.micro — install Java 17, run the Spring Boot jar with env vars
- **S3 + CloudFront**: Upload the Vite `dist/` build; CloudFront in front

---

## Demo Credentials (seed data)

| Role | Email | Password |
|------|-------|----------|
| FARMER | farmer@greencircle.com | password123 |
| CUSTOMER | customer@greencircle.com | password123 |

---

## License

MIT
