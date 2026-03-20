<!-- markdownlint-disable -->

# 🚀 IMPLEMENTATION PLAN - Backend E-Commerce (Deadline: 22/03)

**Developer:** An (Backend)
**Tech Stack:** Express + Prisma + TypeScript + npm/pnpm
**Deadline:** 22/03/2026
**Status:** 🔄 IN PROGRESS

---

## 📋 CHECKLIST (BẮT BUỘC THEO THỨ TỰ)

### Phase 1: Infrastructure Setup (Day 1 - 20/03)
- [x] 1.1. Create backend folder structure
- [x] 1.2. Create package.json
- [x] 1.3. Create docker-compose.yml (Postgres + Redis)
- [x] 1.4. Start Docker containers
- [x] 1.5. Install dependencies (npm install)
- [x] 1.6. Create tsconfig.json
- [x] 1.7. Create .env & .env.example
- [x] 1.8. Create .gitignore

### Phase 2: Database Schema (Day 1 - 20/03)
- [x] 2.1. Create prisma/schema.prisma with 20 tables
- [x] 2.2. Run `npx prisma generate`
- [x] 2.3. Run `npx prisma migrate dev --name init`
- [ ] 2.4. Verify tables in Prisma Studio

### Phase 3: Seed Data (Day 2 - 21/03)
- [x] 3.1. Create prisma/seed.ts
- [x] 3.2. Add brands data (Apple, Samsung, Xiaomi, OPPO, Vivo)
- [x] 3.3. Add categories data
- [x] 3.4. Add 50 smartphone products + variants
- [x] 3.5. Add admin user
- [x] 3.6. Run `npm run prisma:seed`
- [ ] 3.7. Verify data in Prisma Studio

### Phase 4: Express Baseline (Day 2 - 21/03)
- [x] 4.1. Create src/app.ts (main Express app)
- [x] 4.2. Create src/config/database.ts (Prisma client)
- [x] 4.3. Create src/config/redis.ts (Redis client)
- [x] 4.4. Add /health endpoint
- [x] 4.5. Test: `npm run dev` + curl /health

### Phase 5: Auth Implementation (Day 2 - 21/03)
- [x] 5.1. Create src/utils/jwt.util.ts
- [x] 5.2. Create src/utils/password.util.ts
- [x] 5.3. Create src/utils/response.util.ts
- [x] 5.4. Create src/validators/auth.validator.ts (Zod)
- [x] 5.5. Create src/repositories/user.repository.ts
- [x] 5.6. Create src/services/auth.service.ts
- [x] 5.7. Create src/controllers/auth.controller.ts
- [x] 5.8. Create src/routes/auth.routes.ts
- [x] 5.9. Create src/routes/index.ts
- [x] 5.10. Create src/middlewares/auth.middleware.ts
- [x] 5.11. Create src/middlewares/error.middleware.ts

### Phase 6: Testing & Documentation (Day 3 - 22/03)
- [x] 6.1. Test POST /api/auth/register
- [x] 6.2. Test POST /api/auth/login
- [x] 6.3. Test GET /api/auth/me
- [x] 6.4. Test POST /api/auth/refresh
- [x] 6.5. Test POST /api/auth/logout
- [x] 6.6. Write README.md
- [x] 6.7. Create API_DOCS.md
- [ ] 6.8. Final verification

---

## 🗂️ FILE STRUCTURE (REQUIRED)

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts       ✅ Prisma client singleton
│   │   └── redis.ts          ✅ Redis client + Cart/Cache helpers
│   ├── routes/
│   │   ├── index.ts          ✅ Main router
│   │   └── auth.routes.ts    ✅ Auth endpoints
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── services/
│   │   └── auth.service.ts
│   ├── repositories/
│   │   └── user.repository.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── utils/
│   │   ├── jwt.util.ts
│   │   ├── password.util.ts
│   │   └── response.util.ts
│   ├── validators/
│   │   └── auth.validator.ts
│   ├── types/
│   │   └── api.types.ts
│   └── app.ts                ✅ Main entry point
├── prisma/
│   ├── schema.prisma         ✅ 20 tables
│   └── seed.ts               ✅ 50 smartphones
├── docker-compose.yml        ✅ Postgres + Redis
├── .env                      ✅ Environment variables
├── .env.example
├── .gitignore
├── tsconfig.json
├── package.json
└── README.md
```

---

## 📦 DEPENDENCIES (package.json)

**Production:**
- express
- @prisma/client
- bcrypt
- jsonwebtoken
- ioredis
- zod
- cors
- dotenv

**Development:**
- typescript
- @types/express
- @types/node
- @types/bcrypt
- @types/jsonwebtoken
- ts-node-dev
- prisma
- prettier

---

## 🗄️ DATABASE SCHEMA (20 TABLES)

### Core Tables (Priority 1):
1. ✅ users - Authentication & user info
2. ✅ refresh_tokens - JWT refresh tokens
3. ✅ addresses - Shipping addresses
4. ✅ categories - Product categories (nested)
5. ✅ brands - Phone brands (Apple, Samsung...)
6. ✅ products - Main product table
7. ✅ product_variants - SKU (Color + Storage + RAM)
8. ✅ product_images - Product images
9. ✅ orders - Order table
10. ✅ order_items - Order line items
11. ✅ order_status_history - Status tracking
12. ✅ payments - Payment transactions
13. ✅ inventory_logs - Stock movements

### Secondary Tables (Priority 2):
14. ✅ reviews - Product reviews
15. ✅ wishlist - User favorites
16. ✅ vouchers - Discount codes
17. ✅ voucher_usages - Voucher tracking
18. ✅ notifications - User notifications
19. ✅ cms_pages - Static pages (About, FAQ...)
20. ✅ banners - Homepage banners

---

## 📱 SAMPLE DATA (50 SMARTPHONES)

### Brands (5):
- Apple (iPhone 15 series)
- Samsung (Galaxy S24 series)
- Xiaomi (14 series, Redmi Note 13)
- OPPO (Find X7, Reno 11)
- Vivo (X100 Pro, V30)

### Products (15 models × ~3.5 variants = 50+ SKUs):
1. iPhone 15 Pro Max (6 variants: 2 colors × 3 storage)
2. iPhone 15 Pro (6 variants)
3. iPhone 15 (4 variants)
4. Galaxy S24 Ultra (6 variants)
5. Galaxy S24 (4 variants)
6. Xiaomi 14 Ultra (4 variants)
7. Xiaomi 14 (4 variants)
8. Redmi Note 13 Pro (6 variants)
9. OPPO Find X7 Ultra (4 variants)
10. OPPO Reno 11 (3 variants)
11. Vivo X100 Pro (4 variants)
12. Vivo V30 (3 variants)

**Price range:** 5,000,000 VND - 45,000,000 VND

---

## 🔐 AUTH API ENDPOINTS

### 1. POST /api/auth/register
**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "fullName": "Nguyen Van A",
  "phone": "0901234567"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "Nguyen Van A",
      "role": "CUSTOMER"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 2. POST /api/auth/login
**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### 3. POST /api/auth/refresh
**Request:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

### 4. GET /api/auth/me
**Headers:** `Authorization: Bearer {accessToken}`

### 5. POST /api/auth/logout
**Request:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

---

## 🐳 DOCKER SETUP

### docker-compose.yml
```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    container_name: ecommerce_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres123
      POSTGRES_DB: ecommerce_db
    ports:
      - "55432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: ecommerce_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

**Commands:**
```bash
docker-compose up -d
docker-compose ps
```

---

## 🔧 ENVIRONMENT VARIABLES (.env)

```env
# Database
DATABASE_URL="postgresql://postgres:postgres123@localhost:55432/ecommerce_db?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_ACCESS_SECRET=supersecret-access-key
JWT_REFRESH_SECRET=supersecret-refresh-key
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Server
PORT=3000
NODE_ENV=development
```

---

## ✅ TESTING CHECKLIST

### Docker
- [ ] `docker-compose ps` shows 2 healthy containers
- [ ] `docker exec -it ecommerce_postgres psql -U postgres -c "SELECT 1"` works
- [ ] `docker exec -it ecommerce_redis redis-cli ping` returns PONG

### Database
- [ ] `npx prisma studio` opens and shows 20 tables
- [ ] Tables have correct columns and relationships
- [ ] Seed data shows 50+ product variants

### Server
- [ ] `npm run dev` starts without errors
- [ ] `curl http://localhost:3000/health` returns OK
- [ ] Server logs show "Server running on http://localhost:3000"

### Auth APIs
- [ ] Register creates user and returns tokens
- [ ] Login with correct password works
- [ ] Login with wrong password fails
- [ ] /me with valid token returns user info
- [ ] /me with invalid token returns 401
- [ ] Refresh token generates new access token
- [ ] Logout deletes refresh token

---

## ⚠️ CRITICAL NOTES

1. **ALWAYS** follow this plan sequentially - don't skip steps
2. **TEST** each step before moving to next
3. **Docker Desktop** must be running before `docker-compose up`
4. **Run `prisma generate`** after any schema changes
5. **Prices in VND** (Vietnamese Dong) - no decimals for currency
6. **Use npm** instead of pnpm if pnpm not installed (faster setup)
7. **JWT secrets** must be strong in production
8. **CORS** must be enabled for frontend (Nhi's work)

---

## 📊 PROGRESS TRACKING

**Day 1 (20/03):** Infrastructure + Database
**Day 2 (21/03):** Seed + Express + Auth
**Day 3 (22/03):** Testing + Documentation

**Current Progress:** Phase 6 - Testing & Documentation (90%)

---

## 🔗 HANDOFF TO FRONTEND (Nhi)

**What Nhi needs:**
- ✅ API Base URL: `http://localhost:3000/api`
- ✅ Auth flow: Register → Login → Store accessToken in localStorage
- ✅ Auth header: `Authorization: Bearer {accessToken}`
- ✅ 50 smartphones seeded in DB
- ✅ CORS enabled

---

## 🎯 SUCCESS CRITERIA (BEFORE 22/03)

- [ ] Docker running (postgres + redis)
- [ ] Database has 20 tables
- [ ] 50+ smartphones in DB
- [ ] Server starts on port 3000
- [ ] /health endpoint returns OK
- [ ] All 5 Auth APIs work
- [ ] Redis cart save/retrieve works
- [ ] README complete
- [ ] Code pushed to repo (if applicable)

---

**Last Updated:** 2026-03-20 22:00
**Next Milestone:** Complete API_DOCS.md and final verification (22/03)

<!-- markdownlint-enable -->
