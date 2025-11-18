# Testing Authentication API

## Base URL
```
http://localhost:3000/api
```

## Endpoints

| Method | Path                | Description   |
| ------ | ------------------- | ------------- |
| POST   | /auth/login         | Login         |
| POST   | /auth/refresh-token | Refresh token |
| POST   | /auth/logout        | Logout        |

---

## 1. POST /auth/login

### Test 1.1: Login Success (Admin)

**Request:**
```
POST http://localhost:3000/api/auth/login
Headers:
  Content-Type: application/json

Body:
{
  "email": "admin@toko.com",
  "password": "admin123"
}
```

**Expected:**
- Status: `200 OK`
- Response:
  ```json
  {
    "message": "Login successful",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 4,
      "name": "Admin Toko",
      "email": "admin@toko.com",
      "role": "admin"
    }
  }
  ```

---

### Test 1.2: Login Success (Cashier)

**Request:**
```
POST http://localhost:3000/api/auth/login
Headers:
  Content-Type: application/json

Body:
{
  "email": "kasir1@toko.com",
  "password": "cashier123"
}
```

**Expected:**
- Status: `200 OK`
- Response: accessToken, refreshToken, user data dengan role = "cashier"

---

### Test 1.3: Wrong Email

**Request:**
```
POST http://localhost:3000/api/auth/login
Headers:
  Content-Type: application/json

Body:
{
  "email": "wrong@toko.com",
  "password": "admin123"
}
```

**Expected:**
- Status: `401 Unauthorized`
- Response: `{"error": "Invalid credentials"}`

---

### Test 1.4: Wrong Password

**Request:**
```
POST http://localhost:3000/api/auth/login
Headers:
  Content-Type: application/json

Body:
{
  "email": "admin@toko.com",
  "password": "wrongpassword"
}
```

**Expected:**
- Status: `401 Unauthorized`
- Response: `{"error": "Invalid credentials"}`

---

### Test 1.5: Missing Email

**Request:**
```
POST http://localhost:3000/api/auth/login
Headers:
  Content-Type: application/json

Body:
{
  "password": "admin123"
}
```

**Expected:**
- Status: `400 Bad Request`
- Response: `{"error": "Email and password are required"}`

---

### Test 1.6: Missing Password

**Request:**
```
POST http://localhost:3000/api/auth/login
Headers:
  Content-Type: application/json

Body:
{
  "email": "admin@toko.com"
}
```

**Expected:**
- Status: `400 Bad Request`
- Response: `{"error": "Email and password are required"}`

---

### Test 1.7: Empty Body

**Request:**
```
POST http://localhost:3000/api/auth/login
Headers:
  Content-Type: application/json

Body:
{}
```

**Expected:**
- Status: `400 Bad Request`
- Response: `{"error": "Email and password are required"}`

---

## 2. POST /auth/refresh-token

### Test 2.1: Refresh Token Success

**Request:**
```
POST http://localhost:3000/api/auth/refresh-token
Headers:
  Content-Type: application/json

Body:
{
  "refreshToken": "<paste_refresh_token_dari_login>"
}
```

**Expected:**
- Status: `200 OK`
- Response:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

**Note:** Endpoint sebenarnya adalah `/api/auth/refresh` (bukan `/auth/refresh-token`)

---

### Test 2.2: Invalid Refresh Token

**Request:**
```
POST http://localhost:3000/api/auth/refresh
Headers:
  Content-Type: application/json

Body:
{
  "refreshToken": "invalid_token_12345"
}
```

**Expected:**
- Status: `401 Unauthorized`
- Response: `{"error": "Invalid refresh token"}`

---

### Test 2.3: Missing Refresh Token

**Request:**
```
POST http://localhost:3000/api/auth/refresh
Headers:
  Content-Type: application/json

Body:
{}
```

**Expected:**
- Status: `400 Bad Request`
- Response: `{"error": "Refresh token is required"}`

---

### Test 2.4: Expired Refresh Token

**Request:**
```
POST http://localhost:3000/api/auth/refresh
Headers:
  Content-Type: application/json

Body:
{
  "refreshToken": "<expired_refresh_token>"
}
```

**Expected:**
- Status: `401 Unauthorized`
- Response: `{"error": "Refresh token expired"}` atau `{"error": "Invalid refresh token"}`

---

## 3. POST /auth/logout

### Test 3.1: Logout Success

**Request:**
```
POST http://localhost:3000/api/auth/logout
Headers:
  Content-Type: application/json

Body:
{
  "refreshToken": "<paste_refresh_token_dari_login>"
}
```

**Expected:**
- Status: `200 OK`
- Response:
  ```json
  {
    "message": "Logout successful"
  }
  ```

**Note:** Refresh token akan dihapus dari database

---

### Test 3.2: Logout Without Refresh Token

**Request:**
```
POST http://localhost:3000/api/auth/logout
Headers:
  Content-Type: application/json

Body:
{}
```

**Expected:**
- Status: `200 OK`
- Response: `{"message": "Logout successful"}`

**Note:** Logout tetap berhasil meskipun refresh token tidak dikirim

---

### Test 3.3: Logout with Invalid Token

**Request:**
```
POST http://localhost:3000/api/auth/logout
Headers:
  Content-Type: application/json

Body:
{
  "refreshToken": "invalid_token_12345"
}
```

**Expected:**
- Status: `200 OK`
- Response: `{"message": "Logout successful"}`

**Note:** Logout tetap berhasil meskipun token invalid

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

**All Endpoints:**
```
Content-Type: application/json
```

### Status Codes

- `200 OK` - Success
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Invalid credentials/token

### Endpoint Notes

- **Login:** `/api/auth/login`
- **Refresh Token:** `/api/auth/refresh` (bukan `/auth/refresh-token`)
- **Logout:** `/api/auth/logout`

### Token Usage

1. **Login** → Dapat `accessToken` dan `refreshToken`
2. **AccessToken** → Gunakan untuk akses protected endpoints (expires 1 jam)
3. **RefreshToken** → Gunakan untuk mendapatkan accessToken baru (expires 7 hari)
4. **Logout** → Hapus refreshToken dari database

