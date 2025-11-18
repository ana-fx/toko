# Testing User Management API

## Base URL
```
http://localhost:3000/api
```

## Endpoints

| Method | Path             | Description                                              |
| ------ | ---------------- | -------------------------------------------------------- |
| GET    | /profile         | Retrieve profile of an existing user                     |
| POST   | /register        | Store a new user                                         |
| PUT    | /deactivate-user | Deactivate an existing user by specified ID (ID in body) |

**Note:** 
- `/register` ada di `/api/auth/register`
- `/profile` dan `/deactivate-user` perlu dibuat endpoint baru atau menggunakan endpoint yang ada

---

## 1. GET /profile

### Test 1.1: Get Profile (Authenticated User)

**Request:**
```
GET http://localhost:3000/api/users/profile
Headers:
  Authorization: Bearer <access_token>
```

**Expected:**
- Status: `200 OK`
- Response: Profile user yang sedang login (dari token)

**Note:** Endpoint ini perlu dibuat, atau gunakan GET /users/:id dengan ID dari token

---

### Test 1.2: Without Token

**Request:**
```
GET http://localhost:3000/api/users/profile
```

**Expected:**
- Status: `401 Unauthorized`
- Response: `{"error": "No token provided"}`

---

### Test 1.3: Invalid Token

**Request:**
```
GET http://localhost:3000/api/users/profile
Headers:
  Authorization: Bearer invalid_token_12345
```

**Expected:**
- Status: `401 Unauthorized`
- Response: `{"error": "Invalid token"}`

---

## 2. POST /register

### Test 2.1: Register New User (Public)

**Request:**
```
POST http://localhost:3000/api/auth/register
Headers:
  Content-Type: application/json

Body:
{
  "name": "User Baru",
  "email": "userbaru@toko.com",
  "password": "password123",
  "role": "admin"
}
```

**Expected:**
- Status: `201 Created`
- Response: User data dengan id, name, email, role, is_active, created_at

---

### Test 2.2: Register as Cashier

**Request:**
```
POST http://localhost:3000/api/auth/register
Headers:
  Content-Type: application/json

Body:
{
  "name": "Cashier Baru",
  "email": "cashierbaru@toko.com",
  "password": "password123",
  "role": "cashier"
}
```

**Expected:**
- Status: `201 Created`
- Response: User data dengan role = "cashier"

---

### Test 2.3: Email Already Exists

**Request:**
```
POST http://localhost:3000/api/auth/register
Headers:
  Content-Type: application/json

Body:
{
  "name": "User Lain",
  "email": "admin@toko.com",
  "password": "password123",
  "role": "admin"
}
```

**Expected:**
- Status: `400 Bad Request`
- Response: `{"error": "Email already exists"}`

---

### Test 2.4: Invalid Role

**Request:**
```
POST http://localhost:3000/api/auth/register
Headers:
  Content-Type: application/json

Body:
{
  "name": "User",
  "email": "user@toko.com",
  "password": "password123",
  "role": "manager"
}
```

**Expected:**
- Status: `400 Bad Request`
- Response: `{"error": "Invalid role. Must be admin or cashier"}`

---

### Test 2.5: Missing Required Fields

**Request:**
```
POST http://localhost:3000/api/auth/register
Headers:
  Content-Type: application/json

Body:
{
  "name": "User",
  "email": "user@toko.com"
}
```

**Expected:**
- Status: `400 Bad Request`
- Response: `{"error": "All fields are required"}`

---

## 3. PUT /deactivate-user

### Test 3.1: Deactivate User (Admin Only)

**Request:**
```
PUT http://localhost:3000/api/users/deactivate-user
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "id": 5
}
```

**Expected:**
- Status: `200 OK`
- Response: Updated user data dengan is_active = false

**Note:** Endpoint ini perlu dibuat, atau gunakan PUT /users/:id dengan is_active: false

---

### Test 3.2: Deactivate User (Using Existing Endpoint)

**Request:**
```
PUT http://localhost:3000/api/users/5
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "is_active": false
}
```

**Expected:**
- Status: `200 OK`
- Response: Updated user data dengan is_active = false

---

### Test 3.3: User Not Found

**Request:**
```
PUT http://localhost:3000/api/users/99999
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "is_active": false
}
```

**Expected:**
- Status: `404 Not Found`
- Response: `{"error": "User not found"}`

---

### Test 3.4: Cashier Token (Forbidden)

**Request:**
```
PUT http://localhost:3000/api/users/5
Headers:
  Content-Type: application/json
  Authorization: Bearer <cashier_token>

Body:
{
  "is_active": false
}
```

**Expected:**
- Status: `403 Forbidden`
- Response: `{"error": "Forbidden"}`

---

### Test 3.5: Reactivate User

**Request:**
```
PUT http://localhost:3000/api/users/5
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "is_active": true
}
```

**Expected:**
- Status: `200 OK`
- Response: Updated user data dengan is_active = true

---

### Test 3.6: Deactivate Own Account

**Request:**
```
PUT http://localhost:3000/api/users/4
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token> (dari user ID 4)

Body:
{
  "is_active": false
}
```

**Expected:**
- Status: `200 OK`
- Response: User ter-deactivate
- **Note:** User tidak bisa login lagi setelah deactivate

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

| Endpoint | Admin | Cashier | Public |
|----------|-------|---------|--------|
| GET /profile | ✅ | ✅ | ❌ |
| POST /register | ✅ | ✅ | ✅ |
| PUT /deactivate-user | ✅ | ❌ 403 | ❌ 401 |

### Notes

1. **GET /profile** - Endpoint ini perlu dibuat untuk mendapatkan profile user yang sedang login
2. **POST /register** - Sudah ada di `/api/auth/register`
3. **PUT /deactivate-user** - Bisa menggunakan endpoint yang ada: `PUT /api/users/:id` dengan `is_active: false`

