# Testing Transactions API

## Base URL
```
http://localhost:3000/api
```

## Endpoints

| Method | Path              | Description                                    |
| ------ | ----------------- | ---------------------------------------------- |
| GET    | /transactions     | Retrieve all transactions                      |
| GET    | /transactions/:id | Retrieve a transaction by specified ID         |
| POST   | /transactions     | Store a new transaction                        |
| PUT    | /transactions/:id | Modify an existing transaction by specified ID |

---

## 1. GET /transactions

### Test 1.1: Get All Transactions (Admin Only)

**Request:**
```
GET http://localhost:3000/api/transactions
Headers:
  Authorization: Bearer <admin_token>
```

**Expected:**
- Status: `200 OK`
- Response: Array semua transactions dengan user_name

---

### Test 1.2: Cashier Token (Forbidden)

**Request:**
```
GET http://localhost:3000/api/transactions
Headers:
  Authorization: Bearer <cashier_token>
```

**Expected:**
- Status: `403 Forbidden`
- Response: `{"error": "Forbidden"}`

**Note:** Cashier tidak bisa melihat semua transactions, hanya admin yang bisa

---

### Test 1.3: Without Token

**Request:**
```
GET http://localhost:3000/api/transactions
```

**Expected:**
- Status: `401 Unauthorized`
- Response: `{"error": "No token provided"}`

---

## 2. GET /transactions/:id

### Test 2.1: Get Transaction By ID (Admin Only)

**Request:**
```
GET http://localhost:3000/api/transactions/16
Headers:
  Authorization: Bearer <admin_token>
```

**Expected:**
- Status: `200 OK`
- Response: Detail transaction dengan ID 16

---

### Test 2.2: Cashier Token (Forbidden)

**Request:**
```
GET http://localhost:3000/api/transactions/16
Headers:
  Authorization: Bearer <cashier_token>
```

**Expected:**
- Status: `403 Forbidden`
- Response: `{"error": "Forbidden"}`

---

### Test 2.3: Transaction Not Found

**Request:**
```
GET http://localhost:3000/api/transactions/99999
Headers:
  Authorization: Bearer <admin_token>
```

**Expected:**
- Status: `404 Not Found`
- Response: `{"error": "Transaction not found"}`

---

## 3. POST /transactions

### Test 3.1: Create Transaction (Admin)

**Request:**
```
POST http://localhost:3000/api/transactions
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "total_price": 450000
}
```

**Expected:**
- Status: `201 Created`
- Response: Transaction data dengan user_id = admin yang login

---

### Test 3.2: Create Transaction (Cashier)

**Request:**
```
POST http://localhost:3000/api/transactions
Headers:
  Content-Type: application/json
  Authorization: Bearer <cashier_token>

Body:
{
  "total_price": 350000
}
```

**Expected:**
- Status: `201 Created`
- Response: Transaction data dengan user_id = cashier yang login

**Note:** Cashier bisa create transaction, user_id otomatis terisi dengan ID cashier yang login

---

### Test 3.3: Missing total_price

**Request:**
```
POST http://localhost:3000/api/transactions
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{}
```

**Expected:**
- Status: `400 Bad Request`
- Response: `{"error": "Total price is required"}`

---

### Test 3.4: Negative total_price

**Request:**
```
POST http://localhost:3000/api/transactions
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "total_price": -1000
}
```

**Expected:**
- Status: `400 Bad Request`
- Response: `{"error": "Total price must be non-negative"}`

---

### Test 3.5: Zero total_price

**Request:**
```
POST http://localhost:3000/api/transactions
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "total_price": 0
}
```

**Expected:**
- Status: `201 Created` (jika 0 diizinkan) atau `400`

---

### Test 3.6: Without Token

**Request:**
```
POST http://localhost:3000/api/transactions
Headers:
  Content-Type: application/json

Body:
{
  "total_price": 450000
}
```

**Expected:**
- Status: `401 Unauthorized`
- Response: `{"error": "No token provided"}`

---

### Test 3.7: Very Large total_price

**Request:**
```
POST http://localhost:3000/api/transactions
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "total_price": 999999999999
}
```

**Expected:**
- Status: `201 Created` atau `400` (tergantung validasi)

---

## 4. PUT /transactions/:id

### Test 4.1: Update Transaction (Admin Only)

**Request:**
```
PUT http://localhost:3000/api/transactions/16
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "total_price": 500000,
  "user_id": 4
}
```

**Expected:**
- Status: `200 OK`
- Response: Updated transaction data

---

### Test 4.2: Update total_price Only

**Request:**
```
PUT http://localhost:3000/api/transactions/16
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "total_price": 600000
}
```

**Expected:**
- Status: `200 OK`
- Response: Transaction dengan total_price ter-update

---

### Test 4.3: Cashier Token (Forbidden)

**Request:**
```
PUT http://localhost:3000/api/transactions/16
Headers:
  Content-Type: application/json
  Authorization: Bearer <cashier_token>

Body:
{
  "total_price": 500000
}
```

**Expected:**
- Status: `403 Forbidden`
- Response: `{"error": "Forbidden"}`

**Note:** Cashier tidak bisa update transaction, hanya admin yang bisa

---

### Test 4.4: Transaction Not Found

**Request:**
```
PUT http://localhost:3000/api/transactions/99999
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "total_price": 500000
}
```

**Expected:**
- Status: `404 Not Found`
- Response: `{"error": "Transaction not found"}`

---

### Test 4.5: Invalid user_id

**Request:**
```
PUT http://localhost:3000/api/transactions/16
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "user_id": 99999
}
```

**Expected:**
- Status: `404 Not Found`
- Response: `{"error": "User not found"}`

---

### Test 4.6: Negative total_price

**Request:**
```
PUT http://localhost:3000/api/transactions/16
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "total_price": -1000
}
```

**Expected:**
- Status: `400 Bad Request`
- Response: `{"error": "Total price must be non-negative"}`

---

## Quick Reference

### Login Credentials

**Admin:**
- Email: `admin@toko.com`
- Password: `admin123`

**Cashier:**
- Email: `kasir1@toko.com`
- Password: `cashier123`

### Headers

**POST/PUT:**
```
Content-Type: application/json
```

**Protected Endpoints:**
```
Authorization: Bearer <access_token>
```

### Status Codes

- `200 OK` - Success
- `201 Created` - Created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - No/invalid token
- `403 Forbidden` - No permission
- `404 Not Found` - Resource not found

### Permission Summary

| Endpoint | Admin | Cashier |
|----------|-------|---------|
| GET /transactions | ✅ | ❌ 403 |
| GET /transactions/:id | ✅ | ❌ 403 |
| POST /transactions | ✅ | ✅ |
| PUT /transactions/:id | ✅ | ❌ 403 |

