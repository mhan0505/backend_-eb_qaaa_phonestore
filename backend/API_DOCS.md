# API Documentation

## Base URL

`http://localhost:3000/api`

## Authentication

- Access token: Bearer JWT, expires in 15 minutes
- Refresh token: JWT, expires in 7 days
- Header format:

Authorization: Bearer {accessToken}

## Standard Response Format

### Success

```json
{
  "success": true,
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Readable error message"
  }
}
```

## Health Check

### GET /health

- Description: Check API, Postgres, and Redis connection status
- Public: Yes

Example response:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "database": "connected",
    "redis": "connected",
    "timestamp": "2026-03-20T15:50:04.224Z"
  }
}
```

## Auth Endpoints

### POST /auth/register

- Description: Register a new customer account
- Public: Yes

Request body:

```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "fullName": "Nguyen Van A",
  "phone": "0901234567"
}
```

Success response: 201

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "Nguyen Van A",
      "phone": "0901234567",
      "role": "CUSTOMER",
      "createdAt": "2026-03-20T15:50:16.715Z"
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### POST /auth/login

- Description: Login with email and password
- Public: Yes

Request body:

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

Success response: 200

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "Nguyen Van A",
      "phone": "0901234567",
      "role": "CUSTOMER"
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

Error responses:

- 401 INVALID_CREDENTIALS
- 403 ACCOUNT_INACTIVE

### GET /auth/me

- Description: Get current user profile from access token
- Public: No

Headers:

- Authorization: Bearer {accessToken}

Success response: 200

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "Nguyen Van A",
      "phone": "0901234567",
      "role": "CUSTOMER",
      "gender": null,
      "birthday": null,
      "isActive": true,
      "emailVerified": false,
      "createdAt": "2026-03-20T15:50:16.715Z",
      "updatedAt": "2026-03-20T15:50:16.715Z"
    }
  }
}
```

Error responses:

- 401 UNAUTHORIZED
- 401 INVALID_TOKEN

### POST /auth/refresh

- Description: Exchange refresh token for new access token
- Public: Yes

Request body:

```json
{
  "refreshToken": "..."
}
```

Success response: 200

```json
{
  "success": true,
  "data": {
    "accessToken": "..."
  }
}
```

Error responses:

- 401 INVALID_TOKEN
- 401 TOKEN_REVOKED
- 401 TOKEN_EXPIRED
- 403 ACCOUNT_INACTIVE

### POST /auth/logout

- Description: Revoke current refresh token
- Public: No

Headers:

- Authorization: Bearer {accessToken}

Request body:

```json
{
  "refreshToken": "..."
}
```

Success response: 200

```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

## Products Endpoints

### GET /products

- Description: List active products with pagination and filters
- Public: Yes

Supported query params:

- page
- limit
- q
- brand
- category
- minPrice
- maxPrice
- sortBy (`createdAt`, `name`, `basePrice`, `soldCount`, `viewCount`)
- sortOrder (`asc`, `desc`)
- featured (`true`, `false`)

Success response: 200

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 11,
        "name": "iPhone 15 Pro Max",
        "slug": "iphone-15-pro-max",
        "displayPrice": 28490000
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 10,
      "totalPages": 1
    }
  }
}
```

### GET /products/:identifier

- Description: Get product detail by slug or numeric id
- Public: Yes

Success response: 200

```json
{
  "success": true,
  "data": {
    "id": 11,
    "name": "iPhone 15 Pro Max",
    "slug": "iphone-15-pro-max",
    "variants": []
  }
}
```

Error responses:

- 404 PRODUCT_NOT_FOUND

## Cart Endpoints

All cart endpoints require `Authorization: Bearer {accessToken}`.

### GET /cart

- Description: Get current user cart from Redis
- Public: No

### POST /cart/items

- Description: Add item to cart with stock validation
- Public: No

Request body:

```json
{
  "variantId": 49,
  "quantity": 2
}
```

### PATCH /cart/items/:variantId

- Description: Update cart item quantity
- Public: No

Request body:

```json
{
  "quantity": 1
}
```

### DELETE /cart/items/:variantId

- Description: Remove cart item
- Public: No

Error responses:

- 404 CART_ITEM_NOT_FOUND
- 404 VARIANT_NOT_FOUND
- 400 INSUFFICIENT_STOCK

## Orders Endpoints

### POST /orders/checkout

- Description: Checkout from Redis cart and create order transactionally
- Public: No

Headers:

- Authorization: Bearer {accessToken}

Request body:

```json
{
  "shippingAddressId": 1,
  "paymentMethod": "COD",
  "customerNote": "Please call before delivery"
}
```

Success response: 201

```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "OD253964439776",
    "paymentMethod": "COD",
    "paymentStatus": "PENDING",
    "orderStatus": "PENDING",
    "subtotal": 28490000,
    "total": 28490000,
    "itemsCount": 1
  }
}
```

Error responses:

- 400 CART_EMPTY
- 400 INSUFFICIENT_STOCK
- 404 ADDRESS_NOT_FOUND
- 404 VARIANT_NOT_FOUND
- 401 UNAUTHORIZED

## Verified Test Snapshot

The following flow was executed successfully:

1. Register new user: 201
2. Login: 200
3. Get me: 200
4. Refresh token: 200
5. Logout: 200
6. Login wrong password: 401
7. Me without token: 401
8. Refresh invalid token: 401
9. Products list: 200
10. Product detail: 200
11. Cart add/get/update/remove: 201/200/200/200
12. Orders checkout success: 201
13. Orders checkout with empty cart: 400 (CART_EMPTY)
