# Panduan Pengujian API di Insomnia

## Persiapan

### 1. Import Collection
1. Buka aplikasi **Insomnia**
2. Klik **Create** → **Import From** → **File**
3. Pilih file `Insomnia_Toko_API.json` dari folder project
4. Collection "Toko API" akan muncul di sidebar

### 2. Setup Environment Variables
1. Di Insomnia, klik **Manage Environments** (icon globe di kanan atas)
2. Pilih **Base Environment**
3. Set environment variables:
   ```
   base_url: http://localhost:3000
   access_token: (kosongkan dulu, akan diisi setelah login)
   refresh_token: (kosongkan dulu, akan diisi setelah login)
   ```

### 3. Jalankan Server
```bash
npm start
```
Server akan berjalan di `http://localhost:3000`

---

## Skenario Pengujian

### A. Pengujian Authentication

#### Test 1: Register User Baru
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "Admin Toko",
  "email": "admin@toko.com",
  "password": "admin123",
  "role": "admin"
}
```

**Expected Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Admin Toko",
    "email": "admin@toko.com",
    "role": "admin",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Test Cases:**
- ✅ Register dengan role "admin" → Success
- ✅ Register dengan role "cashier" → Success
- ❌ Register dengan email yang sudah ada → Error 400
- ❌ Register dengan role selain admin/cashier → Error 400

---

#### Test 2: Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "admin@toko.com",
  "password": "admin123"
}
```

**Expected Response (200):**
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin Toko",
    "email": "admin@toko.com",
    "role": "admin"
  }
}
```

**Action:** Copy `accessToken` dan `refreshToken`, lalu paste ke environment variables di Insomnia.

**Test Cases:**
- ✅ Login dengan email dan password benar → Success, dapat token
- ❌ Login dengan email salah → Error 401
- ❌ Login dengan password salah → Error 401
- ❌ Login dengan user inactive → Error 401

---

#### Test 3: Refresh Token
**Endpoint:** `POST /api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "{{refresh_token}}"
}
```

**Expected Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Test Cases:**
- ✅ Refresh dengan token valid → Success, dapat accessToken baru
- ❌ Refresh dengan token invalid → Error 401
- ❌ Refresh dengan token expired → Error 401

---

### B. Pengujian Categories (Public Read, Admin Write)

#### Test 4: Get All Categories (Public)
**Endpoint:** `GET /api/categories`

**Headers:** Tidak perlu (Public endpoint)

**Expected Response (200):**
```json
[
  {
    "id": 1,
    "name": "Pakaian Pria",
    "description": "Pakaian untuk pria dewasa",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  ...
]
```

**Test Cases:**
- ✅ Get categories tanpa token → Success
- ✅ Get categories dengan token → Success

---

#### Test 5: Get Category By ID (Public)
**Endpoint:** `GET /api/categories/1`

**Headers:** Tidak perlu

**Expected Response (200):**
```json
{
  "id": 1,
  "name": "Pakaian Pria",
  "description": "Pakaian untuk pria dewasa",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**Test Cases:**
- ✅ Get category dengan ID valid → Success
- ❌ Get category dengan ID tidak ada → Error 404

---

#### Test 6: Create Category (Admin Only)
**Endpoint:** `POST /api/categories`

**Headers:**
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Pakaian Pria",
  "description": "Pakaian untuk pria dewasa"
}
```

**Expected Response (201):**
```json
{
  "id": 1,
  "name": "Pakaian Pria",
  "description": "Pakaian untuk pria dewasa",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**Test Cases:**
- ✅ Create category sebagai admin → Success
- ❌ Create category sebagai cashier → Error 403 Forbidden
- ❌ Create category tanpa token → Error 401
- ❌ Create category tanpa name → Error 400

---

#### Test 7: Update Category (Admin Only)
**Endpoint:** `PUT /api/categories/1`

**Headers:**
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Pakaian Pria Updated",
  "description": "Deskripsi updated"
}
```

**Test Cases:**
- ✅ Update category sebagai admin → Success
- ❌ Update category sebagai cashier → Error 403
- ❌ Update category dengan ID tidak ada → Error 404

---

#### Test 8: Delete Category (Admin Only)
**Endpoint:** `DELETE /api/categories/1`

**Headers:**
```
Authorization: Bearer {{access_token}}
```

**Expected Response (200):**
```json
{
  "message": "Category deleted successfully"
}
```

**Test Cases:**
- ✅ Delete category sebagai admin → Success
- ❌ Delete category sebagai cashier → Error 403
- ❌ Delete category dengan ID tidak ada → Error 404

---

### C. Pengujian Products (Public Read, Admin Write)

#### Test 9: Get All Products (Public)
**Endpoint:** `GET /api/products`

**Headers:** Tidak perlu

**Expected Response (200):**
```json
[
  {
    "id": 1,
    "name": "Kemeja Pria Formal Putih",
    "price": "250000.00",
    "stock": 30,
    "category_id": 1,
    "category_name": "Pakaian Pria",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  ...
]
```

**Test Cases:**
- ✅ Get products tanpa token → Success
- ✅ Get products dengan token → Success

---

#### Test 10: Get Product By ID (Public)
**Endpoint:** `GET /api/products/1`

**Expected Response (200):**
```json
{
  "id": 1,
  "name": "Kemeja Pria Formal Putih",
  "price": "250000.00",
  "stock": 30,
  "category_id": 1,
  "category_name": "Pakaian Pria",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

---

#### Test 11: Create Product (Admin Only)
**Endpoint:** `POST /api/products`

**Headers:**
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Kemeja Pria Formal Putih",
  "price": 250000,
  "stock": 30,
  "category_id": 1
}
```

**Expected Response (201):**
```json
{
  "id": 1,
  "name": "Kemeja Pria Formal Putih",
  "price": "250000.00",
  "stock": 30,
  "category_id": 1,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**Test Cases:**
- ✅ Create product sebagai admin → Success
- ❌ Create product sebagai cashier → Error 403 Forbidden
- ❌ Create product tanpa name → Error 400
- ❌ Create product dengan price negatif → Error 400
- ❌ Create product dengan category_id tidak ada → Error 404

---

#### Test 12: Update Product (Admin Only)
**Endpoint:** `PUT /api/products/1`

**Headers:**
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Kemeja Pria Updated",
  "price": 300000,
  "stock": 25
}
```

**Test Cases:**
- ✅ Update product sebagai admin → Success
- ❌ Update product sebagai cashier → Error 403
- ❌ Update product dengan ID tidak ada → Error 404

---

#### Test 13: Delete Product (Admin Only)
**Endpoint:** `DELETE /api/products/1`

**Headers:**
```
Authorization: Bearer {{access_token}}
```

**Test Cases:**
- ✅ Delete product sebagai admin → Success
- ❌ Delete product sebagai cashier → Error 403

---

### D. Pengujian Transactions

#### Test 14: Create Transaction (Authenticated)
**Endpoint:** `POST /api/transactions`

**Headers:**
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "total_price": 450000
}
```

**Expected Response (201):**
```json
{
  "id": 1,
  "user_id": 1,
  "total_price": "450000.00",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**Test Cases:**
- ✅ Create transaction sebagai admin → Success
- ✅ Create transaction sebagai cashier → Success
- ❌ Create transaction tanpa token → Error 401
- ❌ Create transaction dengan total_price negatif → Error 400

---

#### Test 15: Get All Transactions (Admin Only)
**Endpoint:** `GET /api/transactions`

**Headers:**
```
Authorization: Bearer {{access_token}}
```

**Test Cases:**
- ✅ Get transactions sebagai admin → Success
- ❌ Get transactions sebagai cashier → Error 403

---

### E. Pengujian Users (Admin Only)

#### Test 16: Get All Users (Admin Only)
**Endpoint:** `GET /api/users`

**Headers:**
```
Authorization: Bearer {{access_token}}
```

**Test Cases:**
- ✅ Get users sebagai admin → Success
- ❌ Get users sebagai cashier → Error 403

---

#### Test 17: Update User (Admin Only)
**Endpoint:** `PUT /api/users/1`

**Headers:**
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Admin Updated",
  "is_active": true
}
```

**Test Cases:**
- ✅ Update user sebagai admin → Success
- ❌ Update user sebagai cashier → Error 403

---

## Checklist Pengujian

### Authentication
- [ ] Register user baru (admin)
- [ ] Register user baru (cashier)
- [ ] Login dengan admin
- [ ] Login dengan cashier
- [ ] Refresh token
- [ ] Logout

### Categories
- [ ] Get all categories (tanpa auth)
- [ ] Get category by ID (tanpa auth)
- [ ] Create category (sebagai admin) ✅
- [ ] Create category (sebagai cashier) ❌ harus error 403
- [ ] Update category (sebagai admin)
- [ ] Delete category (sebagai admin)

### Products
- [ ] Get all products (tanpa auth)
- [ ] Get product by ID (tanpa auth)
- [ ] Create product (sebagai admin) ✅
- [ ] Create product (sebagai cashier) ❌ harus error 403
- [ ] Update product (sebagai admin)
- [ ] Delete product (sebagai admin)

### Transactions
- [ ] Create transaction (sebagai admin)
- [ ] Create transaction (sebagai cashier)
- [ ] Get all transactions (sebagai admin)
- [ ] Get all transactions (sebagai cashier) ❌ harus error 403

### Users
- [ ] Get all users (sebagai admin)
- [ ] Get all users (sebagai cashier) ❌ harus error 403
- [ ] Update user (sebagai admin)
- [ ] Delete user (sebagai admin)

---

## Tips Pengujian

1. **Test dengan Role Berbeda**
   - Login sebagai admin, test semua endpoint
   - Login sebagai cashier, test endpoint yang seharusnya dilarang

2. **Test Error Cases**
   - Test dengan data invalid
   - Test dengan ID yang tidak ada
   - Test tanpa token
   - Test dengan token expired

3. **Verify Response**
   - Check status code (200, 201, 400, 401, 403, 404)
   - Check response body structure
   - Check error messages

4. **Test Authorization**
   - Pastikan cashier tidak bisa insert/update/delete products dan categories
   - Pastikan hanya admin yang bisa manage users

---

## Troubleshooting

**Error 401 Unauthorized**
- Token tidak ada atau invalid
- Token expired, gunakan refresh token atau login ulang

**Error 403 Forbidden**
- User tidak memiliki permission (bukan admin)
- Pastikan login dengan role yang benar

**Error 400 Bad Request**
- Request body tidak valid
- Field required tidak diisi
- Format data salah

**Error 404 Not Found**
- ID resource tidak ada di database
- Endpoint URL salah

**Error 500 Internal Server Error**
- Server error, cek console log
- Database connection issue
