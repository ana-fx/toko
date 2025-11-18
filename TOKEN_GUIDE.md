# Panduan Token Authentication

## Kondisi Token

### 1. Request Tanpa Token (Public)
**Endpoint yang tidak memerlukan token:**
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

**Status:** ✅ Tidak perlu token

---

### 2. Request dengan Token (Authenticated)
**Endpoint yang memerlukan token (Admin atau Cashier):**
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/transactions` - Get all transactions (Admin only)
- `GET /api/transactions/:id` - Get transaction by ID (Admin only)
- `POST /api/transactions` - Create transaction (Admin atau Cashier)
- `PUT /api/transactions/:id` - Update transaction (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)

**Status:** ⚠️ **WAJIB** memiliki token di header

---

## Cara Menggunakan Token di Insomnia

### Step 1: Login untuk Mendapatkan Token

1. Buka folder **Authentication**
2. Jalankan request **"Login - Admin"**
3. Response akan berisi:
   ```json
   {
     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {...}
   }
   ```

### Step 2: Set Token ke Environment Variable

1. Klik ikon **Globe** (Manage Environments) di toolbar
2. Pilih **Base Environment**
3. Edit variabel `accessToken`:
   - Salin `accessToken` dari response login
   - Paste ke value `accessToken`
   - Klik **Save**

### Step 3: Token Otomatis Digunakan

Semua request yang memerlukan token akan otomatis menggunakan `{{ accessToken }}` dari environment.

**Contoh Header:**
```
Authorization: Bearer {{ accessToken }}
```

---

## Error Token dan Solusinya

### Error 401: "No token provided"
**Penyebab:** Request tidak memiliki header Authorization

**Solusi:**
1. Pastikan sudah login dan mendapatkan token
2. Set token ke environment variable `accessToken`
3. Pastikan request memiliki header `Authorization: Bearer {{ accessToken }}`

---

### Error 401: "Invalid token" atau "Token expired"
**Penyebab:** Token sudah expired (expires dalam 1 jam)

**Solusi:**
1. Login ulang untuk mendapatkan token baru
2. Atau gunakan **Refresh Token**:
   - Jalankan request **"Refresh Token"**
   - Salin `accessToken` baru dari response
   - Update environment variable `accessToken`

---

### Error 403: "Forbidden"
**Penyebab:** Token valid tapi role tidak memiliki permission

**Solusi:**
- Endpoint admin-only: Gunakan token dari **Login - Admin**
- Endpoint cashier: Gunakan token dari **Login - Cashier**
- Jangan gunakan cashier token untuk endpoint admin-only

---

## Kondisi Token per Endpoint

| Endpoint | Token Required | Role Required |
|----------|---------------|---------------|
| GET /categories | ❌ No | - |
| GET /categories/:id | ❌ No | - |
| POST /categories | ✅ Yes | Admin |
| PUT /categories/:id | ✅ Yes | Admin |
| DELETE /categories/:id | ✅ Yes | Admin |
| GET /products | ❌ No | - |
| GET /products/:id | ❌ No | - |
| POST /products | ✅ Yes | Admin |
| PUT /products/:id | ✅ Yes | Admin |
| DELETE /products/:id | ✅ Yes | Admin |
| GET /transactions | ✅ Yes | Admin |
| GET /transactions/:id | ✅ Yes | Admin |
| POST /transactions | ✅ Yes | Admin atau Cashier |
| PUT /transactions/:id | ✅ Yes | Admin |
| GET /users/:id | ✅ Yes | Admin |
| PUT /users/:id | ✅ Yes | Admin |
| POST /auth/register | ❌ No | - |
| POST /auth/login | ❌ No | - |
| POST /auth/refresh | ❌ No | - |
| POST /auth/logout | ❌ No | - |

---

## Quick Fix untuk Error "No token provided"

1. **Login dulu:**
   - Authentication → Login - Admin
   - Copy `accessToken` dari response

2. **Set ke environment:**
   - Globe icon → Base Environment
   - Edit `accessToken` → Paste token
   - Save

3. **Test ulang request:**
   - Request akan otomatis menggunakan token
   - Header `Authorization: Bearer {{ accessToken }}` akan terisi

---

## Tips

1. **Token Expires:** Access token expires dalam 1 jam, refresh token expires dalam 7 hari
2. **Auto Refresh:** Gunakan Refresh Token sebelum access token expired
3. **Multiple Tokens:** Bisa set `accessToken` (admin) dan `cashierToken` (cashier) untuk testing berbeda role
4. **Logout:** Gunakan Logout untuk menghapus refresh token dari database

