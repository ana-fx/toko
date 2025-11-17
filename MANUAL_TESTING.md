# Panduan Pengujian Manual GET dan POST

## 1. Persiapan

### A. Jalankan Server
```bash
cd /Users/macbookpro/Herd/toko
npm start
```

Server akan berjalan di `http://localhost:3000`

### B. Siapkan Insomnia
1. Buka aplikasi **Insomnia**
2. Buat **New Request** (klik tombol + atau "Send a request")

---

## 2. Menguji GET Request

### Test 1: GET All Products (Public - Tidak Perlu Token)

**Langkah-langkah:**

1. **Buat Request Baru**
   - Klik **New Request** atau tombol **+**
   - Beri nama: "Get All Products"

2. **Set Method dan URL**
   - **Method**: Pilih `GET` dari dropdown
   - **URL**: `http://localhost:3000/api/products`

3. **Headers** (Tidak perlu, karena public endpoint)
   - Biarkan kosong atau tidak perlu set header

4. **Body** (Tidak perlu untuk GET request)
   - Tab Body bisa dikosongkan

5. **Send Request**
   - Klik tombol **Send** (atau tekan `Cmd+Enter` / `Ctrl+Enter`)

6. **Lihat Response**
   - Response akan muncul di panel bawah
   - Status: `200 OK` (hijau)
   - Body akan menampilkan array produk:
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

---

### Test 2: GET Product By ID (Public)

**Langkah-langkah:**

1. **Buat Request Baru**
   - Nama: "Get Product By ID"

2. **Set Method dan URL**
   - **Method**: `GET`
   - **URL**: `http://localhost:3000/api/products/1`
   - (Ganti `1` dengan ID produk yang ingin dilihat)

3. **Send Request**
   - Klik **Send**

4. **Expected Response**
   - Status: `200 OK`
   - Body: Detail produk dengan ID 1

---

### Test 3: GET All Users (Protected - Perlu Token)

**Langkah-langkah:**

1. **Login Dulu untuk Dapat Token**
   - Buat request baru: "Login"
   - **Method**: `POST`
   - **URL**: `http://localhost:3000/api/auth/login`
   - **Body** (tab Body → JSON):
     ```json
     {
       "email": "admin@toko.com",
       "password": "admin123"
     }
     ```
   - **Headers**: 
     ```
     Content-Type: application/json
     ```
   - Klik **Send**
   - Copy `accessToken` dari response

2. **Buat Request GET Users**
   - Buat request baru: "Get All Users"
   - **Method**: `GET`
   - **URL**: `http://localhost:3000/api/users`

3. **Set Authorization Header**
   - Klik tab **Headers**
   - Tambahkan header:
     - **Name**: `Authorization`
     - **Value**: `Bearer <paste_access_token_di_sini>`
     - Contoh: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

4. **Send Request**
   - Klik **Send**

5. **Expected Response**
   - Status: `200 OK`
   - Body: Array semua users

---

## 3. Menguji POST Request

### Test 1: POST Login (Public)

**Langkah-langkah:**

1. **Buat Request Baru**
   - Nama: "Login"

2. **Set Method dan URL**
   - **Method**: `POST`
   - **URL**: `http://localhost:3000/api/auth/login`

3. **Set Headers**
   - Klik tab **Headers**
   - Tambahkan:
     - **Name**: `Content-Type`
     - **Value**: `application/json`

4. **Set Body**
   - Klik tab **Body**
   - Pilih **JSON** (bukan Text atau Form)
   - Masukkan:
     ```json
     {
       "email": "admin@toko.com",
       "password": "admin123"
     }
     ```

5. **Send Request**
   - Klik **Send**

6. **Expected Response**
   - Status: `200 OK`
   - Body:
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

---

### Test 2: POST Create Product (Protected - Admin Only)

**Langkah-langkah:**

1. **Login Dulu (Jika Belum)**
   - Ikuti langkah Test 1 POST Login di atas
   - Copy `accessToken`

2. **Buat Request Baru**
   - Nama: "Create Product"

3. **Set Method dan URL**
   - **Method**: `POST`
   - **URL**: `http://localhost:3000/api/products`

4. **Set Headers**
   - Klik tab **Headers**
   - Tambahkan 2 headers:
     - **Name**: `Content-Type` | **Value**: `application/json`
     - **Name**: `Authorization` | **Value**: `Bearer <access_token>`

5. **Set Body**
   - Klik tab **Body**
   - Pilih **JSON**
   - Masukkan:
     ```json
     {
       "name": "Kemeja Pria Baru",
       "price": 300000,
       "stock": 20,
       "category_id": 1
     }
     ```

6. **Send Request**
   - Klik **Send**

7. **Expected Response**
   - Status: `201 Created` (hijau)
   - Body:
     ```json
     {
       "id": 39,
       "name": "Kemeja Pria Baru",
       "price": "300000.00",
       "stock": 20,
       "category_id": 1,
       "created_at": "2024-01-01T00:00:00.000Z"
     }
     ```

8. **Test Error Case (Sebagai Cashier)**
   - Login sebagai cashier (`kasir1@toko.com` / `cashier123`)
   - Coba POST product dengan token cashier
   - **Expected**: Status `403 Forbidden`
   - Response: `{"error": "Forbidden"}`

---

### Test 3: POST Create Transaction (Protected - Authenticated)

**Langkah-langkah:**

1. **Login** (Admin atau Cashier)
   - Copy `accessToken`

2. **Buat Request Baru**
   - Nama: "Create Transaction"

3. **Set Method dan URL**
   - **Method**: `POST`
   - **URL**: `http://localhost:3000/api/transactions`

4. **Set Headers**
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer <access_token>`

5. **Set Body**
   ```json
   {
     "total_price": 450000
   }
   ```

6. **Send Request**

7. **Expected Response**
   - Status: `201 Created`
   - Body:
     ```json
     {
       "id": 16,
       "user_id": 1,
       "total_price": "450000.00",
       "created_at": "2024-01-01T00:00:00.000Z"
     }
     ```
   - Note: `user_id` akan otomatis terisi dengan ID user yang login

---

## 4. Tips Testing Manual

### A. Menggunakan Environment Variables (Opsional)

1. Di Insomnia, klik icon **globe** (Manage Environments)
2. Buat environment variable:
   - `base_url`: `http://localhost:3000`
   - `access_token`: (kosongkan dulu)
3. Gunakan di URL: `{{base_url}}/api/products`
4. Setelah login, update `access_token` di environment

### B. Mengorganisir Request

1. Buat **Folder/Collection** untuk mengelompokkan request:
   - Folder "Auth" (Login, Register, dll)
   - Folder "Products" (GET, POST, PUT, DELETE)
   - Folder "Transactions"
   - dll

### C. Test Error Cases

1. **Test tanpa token** → Harus error 401
2. **Test dengan token cashier untuk admin endpoint** → Harus error 403
3. **Test dengan data invalid** → Harus error 400
4. **Test dengan ID tidak ada** → Harus error 404

### D. Checklist Testing

**GET Requests:**
- [ ] GET /api/products (tanpa token) → 200 OK
- [ ] GET /api/products/1 (tanpa token) → 200 OK
- [ ] GET /api/categories (tanpa token) → 200 OK
- [ ] GET /api/users (dengan token admin) → 200 OK
- [ ] GET /api/users (dengan token cashier) → 403 Forbidden
- [ ] GET /api/transactions (dengan token admin) → 200 OK
- [ ] GET /api/transactions (dengan token cashier) → 403 Forbidden

**POST Requests:**
- [ ] POST /api/auth/login → 200 OK, dapat token
- [ ] POST /api/auth/register → 201 Created
- [ ] POST /api/products (dengan token admin) → 201 Created
- [ ] POST /api/products (dengan token cashier) → 403 Forbidden
- [ ] POST /api/products (tanpa token) → 401 Unauthorized
- [ ] POST /api/categories (dengan token admin) → 201 Created
- [ ] POST /api/transactions (dengan token) → 201 Created

---

## 5. Troubleshooting

**Error 401 Unauthorized**
- Token tidak ada atau invalid
- Solusi: Login ulang dan copy token baru

**Error 403 Forbidden**
- User tidak memiliki permission
- Solusi: Login sebagai admin untuk admin-only endpoints

**Error 400 Bad Request**
- Request body tidak valid atau field required kosong
- Solusi: Cek format JSON dan pastikan semua field required terisi

**Error 404 Not Found**
- ID resource tidak ada
- Solusi: Gunakan ID yang valid dari database

**Error 500 Internal Server Error**
- Server error
- Solusi: Cek console log server, pastikan database running

---

## 6. Quick Reference

### Base URL
```
http://localhost:3000
```

### Login Credentials

**Admin:**
- Email: `admin@toko.com`
- Password: `admin123`

**Cashier:**
- Email: `kasir1@toko.com` atau `kasir2@toko.com`
- Password: `cashier123`

### Common Headers

**Untuk POST/PUT:**
```
Content-Type: application/json
```

**Untuk Protected Endpoints:**
```
Authorization: Bearer <access_token>
```

### Response Status Codes

- `200 OK` - Success (GET, PUT)
- `201 Created` - Success (POST)
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - No/invalid token
- `403 Forbidden` - No permission
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

