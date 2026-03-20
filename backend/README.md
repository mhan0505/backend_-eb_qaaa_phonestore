# E-Commerce Backend API

Backend API for a smartphone e-commerce platform built with Express, TypeScript, Prisma, PostgreSQL, and Redis.

## Team

- Backend: An
- Frontend: Nhi
- Design: Tung
- PM: Hong

## Tech Stack

- Runtime: Node.js 20+
- Framework: Express 4
- Language: TypeScript 5
- ORM: Prisma 5
- Database: PostgreSQL 16
- Cache: Redis 7
- Auth: JWT access and refresh tokens

## Prerequisites

- Node.js 20+
- Docker Desktop running
- npm

## Quick Start

### 1. Start infrastructure

```bash
# from workspace root
docker-compose up -d
docker-compose ps
```

Expected services:

- postgres on host port 55432
- redis on host port 6379

### 2. Install dependencies

```bash
cd backend
npm install
```

### 3. Setup database

```bash
npm run prisma:generate
npx prisma migrate dev --name init
npm run prisma:seed
```

### 4. Run development server

```bash
npm run dev
```

Default app port is 3000. If the port is occupied, the app automatically retries on the next port.

### 5. Health check

```bash
# PowerShell
node -e "require('http').get('http://localhost:3000/health',res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>{console.log(res.statusCode);console.log(d);});});"
```

## Environment Variables

Create `backend/.env` from `backend/.env.example`.

```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:55432/ecommerce_db?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
JWT_ACCESS_SECRET=change-me-access
JWT_REFRESH_SECRET=change-me-refresh
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
PORT=3000
NODE_ENV=development
```

## Seed Data

Current seed creates:

- 2 users (admin and customer)
- 5 brands
- 4 categories
- 10 products
- 50 product variants
- 3 vouchers

Test accounts:

- admin account: `admin@phonestore.vn` / `Admin@123`
- customer account: `customer@example.com` / `Customer@123`

## API Base URL

`http://localhost:{port}/api`

## Auth Endpoints

- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`
- POST `/api/auth/refresh`
- POST `/api/auth/logout`

## Products Endpoints

- GET `/api/products`
- GET `/api/products/:identifier`

## Cart Endpoints

- GET `/api/cart`
- POST `/api/cart/items`
- PATCH `/api/cart/items/:variantId`
- DELETE `/api/cart/items/:variantId`

## Orders Endpoints

- POST `/api/orders/checkout`

Detailed request and response examples are in `backend/API_DOCS.md`.

## Scripts

- `npm run dev`: run in development with ts-node-dev
- `npm run build`: compile TypeScript to `dist`
- `npm run start`: run compiled app
- `npm run prisma:generate`: generate Prisma client
- `npm run prisma:migrate`: run Prisma migration
- `npm run prisma:seed`: seed database
- `npm run prisma:studio`: open Prisma Studio

## Project Structure

```text
backend/
  prisma/
    schema.prisma
    seed.ts
  src/
    app.ts
    config/
    controllers/
    middlewares/
    repositories/
    routes/
    services/
    utils/
    validators/
  API_DOCS.md
  IMPLEMENTATION_PLAN.md
  README.md
```
