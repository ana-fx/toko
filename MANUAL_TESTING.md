# Panduan Pengujian Manual GET dan POST - Lengkap

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
3. Setup Environment Variables:
   - `base_url`: `http://localhost:3000`
   - `access_token_admin`: (kosongkan dulu)
   - `access_token_cashier`: (kosongkan dulu)

---

## 2. Authentication Testing

### Test 1.1: POST Register - Success Case

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "name": "User Baru",
    "email": "userbaru@toko.com",
    "password": "password123",
    "role": "admin"
  }
  ```

**Expected Response:**
- Status: `201 Created`
- Body: User data dengan id, name, email, role

---

### Test 1.2: POST Register - Email Already Exists

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/auth/register`
- **Body**:
  ```json
  {
    "name": "User Lain",
    "email": "admin@toko.com",
    "password": "password123",
    "role": "admin"
  }
  ```

**Expected Response:**
- Status: `400 Bad Request`
- Body: `{"error": "Email already exists"}`

---

### Test 1.3: POST Register - Invalid Role

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/auth/register`
- **Body**:
  ```json
  {
    "name": "User",
    "email": "user@toko.com",
    "password": "password123",
    "role": "manager"
  }
  ```

**Expected Response:**
- Status: `400 Bad Request`
- Body: `{"error": "Invalid role. Must be admin or cashier"}`

---

### Test 1.4: POST Register - Missing Required Fields

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/auth/register`
- **Body**:
  ```json
  {
    "name": "User",
    "email": "user@toko.com"
  }
  ```

**Expected Response:**
- Status: `400 Bad Request`
- Body: `{"error": "All fields are required"}`

---

### Test 1.5: POST Login - Success (Admin)

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/auth/login`
- **Body**:
  ```json
  {
    "email": "admin@toko.com",
    "password": "admin123"
  }
  ```

**Expected Response:**
- Status: `200 OK`
- Body: accessToken, refreshToken, user data
- **Action**: Copy `accessToken` ke `access_token_admin`

---

### Test 1.6: POST Login - Success (Cashier)

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/auth/login`
- **Body**:
  ```json
  {
    "email": "kasir1@toko.com",
    "password": "cashier123"
  }
  ```

**Expected Response:**
- Status: `200 OK`
- **Action**: Copy `accessToken` ke `access_token_cashier`

---

### Test 1.7: POST Login - Wrong Email

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/auth/login`
- **Body**:
  ```json
  {
    "email": "wrong@toko.com",
    "password": "admin123"
  }
  ```

**Expected Response:**
- Status: `401 Unauthorized`
- Body: `{"error": "Invalid credentials"}`

---

### Test 1.8: POST Login - Wrong Password

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/auth/login`
- **Body**:
  ```json
  {
    "email": "admin@toko.com",
    "password": "wrongpassword"
  }
  ```

**Expected Response:**
- Status: `401 Unauthorized`
- Body: `{"error": "Invalid credentials"}`

---

### Test 1.9: POST Login - Missing Fields

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/auth/login`
- **Body**:
  ```json
  {
    "email": "admin@toko.com"
  }
  ```

**Expected Response:**
- Status: `400 Bad Request`
- Body: `{"error": "Email and password are required"}`

---

### Test 1.10: POST Refresh Token - Success

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/auth/refresh`
- **Body**:
  ```json
  {
    "refreshToken": "<paste_refresh_token_dari_login>"
  }
  ```

**Expected Response:**
- Status: `200 OK`
- Body: `{"accessToken": "..."}`

---

### Test 1.11: POST Refresh Token - Invalid Token

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/auth/refresh`
- **Body**:
  ```json
  {
    "refreshToken": "invalid_token_12345"
  }
  ```

**Expected Response:**
- Status: `401 Unauthorized`
- Body: `{"error": "Invalid refresh token"}`

---

## 3. Products Testing

### Test 3.1: GET All Products - Success (Public)

**Request:**
- **Method**: `GET`
- **URL**: `{{base_url}}/api/products`
- **Headers**: Tidak perlu

**Expected Response:**
- Status: `200 OK`
- Body: Array semua products dengan category_name

---

### Test 3.2: GET Product By ID - Success

**Request:**
- **Method**: `GET`
- **URL**: `{{base_url}}/api/products/26`
- **Headers**: Tidak perlu

**Expected Response:**
- Status: `200 OK`
- Body: Detail product dengan ID 26

---

### Test 3.3: GET Product By ID - Not Found

**Request:**
- **Method**: `GET`
- **URL**: `{{base_url}}/api/products/99999`
- **Headers**: Tidak perlu

**Expected Response:**
- Status: `404 Not Found`
- Body: `{"error": "Product not found"}`

---

### Test 3.4: GET Product By ID - Invalid ID Format

**Request:**
- **Method**: `GET`
- **URL**: `{{base_url}}/api/products/abc`
- **Headers**: Tidak perlu

**Expected Response:**
- Status: `500` atau `400` (tergantung handling)

---

### Test 3.5: POST Create Product - Success (Admin)

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/products`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "name": "Kemeja Pria Baru",
    "price": 300000,
    "stock": 20,
    "category_id": 6
  }
  ```

**Expected Response:**
- Status: `201 Created`
- Body: Product data dengan id baru

---

### Test 3.6: POST Create Product - Without Token

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/products`
- **Headers**: `Content-Type: application/json`
- **Body**: (sama seperti Test 3.5)

**Expected Response:**
- Status: `401 Unauthorized`
- Body: `{"error": "No token provided"}`

---

### Test 3.7: POST Create Product - Cashier (Should Fail)

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/products`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_cashier}}`
- **Body**: (sama seperti Test 3.5)

**Expected Response:**
- Status: `403 Forbidden`
- Body: `{"error": "Forbidden"}`

---

### Test 3.8: POST Create Product - Missing Required Fields

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/products`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "name": "Product Baru"
  }
  ```

**Expected Response:**
- Status: `400 Bad Request`
- Body: `{"error": "Name, price, and stock are required"}`

---

### Test 3.9: POST Create Product - Negative Price

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/products`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "name": "Product Baru",
    "price": -1000,
    "stock": 10,
    "category_id": 6
  }
  ```

**Expected Response:**
- Status: `400 Bad Request`
- Body: `{"error": "Price and stock must be non-negative"}`

---

### Test 3.10: POST Create Product - Negative Stock

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/products`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "name": "Product Baru",
    "price": 100000,
    "stock": -5,
    "category_id": 6
  }
  ```

**Expected Response:**
- Status: `400 Bad Request`
- Body: `{"error": "Price and stock must be non-negative"}`

---

### Test 3.11: POST Create Product - Invalid Category ID

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/products`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "name": "Product Baru",
    "price": 100000,
    "stock": 10,
    "category_id": 99999
  }
  ```

**Expected Response:**
- Status: `404 Not Found`
- Body: `{"error": "Category not found"}`

---

### Test 3.12: POST Create Product - Zero Price (Boundary)

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/products`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "name": "Product Gratis",
    "price": 0,
    "stock": 10,
    "category_id": 6
  }
  ```

**Expected Response:**
- Status: `201 Created` (jika 0 diizinkan) atau `400` (jika tidak)

---

### Test 3.13: POST Create Product - Very Large Price

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/products`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "name": "Product Mahal",
    "price": 999999999999,
    "stock": 1,
    "category_id": 6
  }
  ```

**Expected Response:**
- Status: `201 Created` atau `400` (tergantung validasi)

---

### Test 3.14: POST Create Product - Very Long Name

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/products`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "name": "A" * 200,
    "price": 100000,
    "stock": 10,
    "category_id": 6
  }
  ```

**Expected Response:**
- Status: `400` atau `500` (tergantung validasi database)

---

### Test 3.15: PUT Update Product - Success (Admin)

**Request:**
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/products/26`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "name": "Kemeja Pria Updated",
    "price": 350000,
    "stock": 25
  }
  ```

**Expected Response:**
- Status: `200 OK`
- Body: Updated product data

---

### Test 3.16: PUT Update Product - Not Found

**Request:**
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/products/99999`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**: (sama seperti Test 3.15)

**Expected Response:**
- Status: `404 Not Found`
- Body: `{"error": "Product not found"}`

---

### Test 3.17: PUT Update Product - Cashier (Should Fail)

**Request:**
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/products/26`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_cashier}}`
- **Body**: (sama seperti Test 3.15)

**Expected Response:**
- Status: `403 Forbidden`
- Body: `{"error": "Forbidden"}`

---

### Test 3.18: DELETE Product - Success (Admin)

**Request:**
- **Method**: `DELETE`
- **URL**: `{{base_url}}/api/products/26`
- **Headers**: `Authorization: Bearer {{access_token_admin}}`

**Expected Response:**
- Status: `200 OK`
- Body: `{"message": "Product deleted successfully"}`

---

### Test 3.19: DELETE Product - Not Found

**Request:**
- **Method**: `DELETE`
- **URL**: `{{base_url}}/api/products/99999`
- **Headers**: `Authorization: Bearer {{access_token_admin}}`

**Expected Response:**
- Status: `404 Not Found`
- Body: `{"error": "Product not found"}`

---

## 4. Categories Testing

### Test 4.1: GET All Categories - Success (Public)

**Request:**
- **Method**: `GET`
- **URL**: `{{base_url}}/api/categories`
- **Headers**: Tidak perlu

**Expected Response:**
- Status: `200 OK`
- Body: Array semua categories

---

### Test 4.2: GET Category By ID - Success

**Request:**
- **Method**: `GET`
- **URL**: `{{base_url}}/api/categories/6`
- **Headers**: Tidak perlu

**Expected Response:**
- Status: `200 OK`
- Body: Detail category dengan ID 6

---

### Test 4.3: GET Category By ID - Not Found

**Request:**
- **Method**: `GET`
- **URL**: `{{base_url}}/api/categories/99999`
- **Headers**: Tidak perlu

**Expected Response:**
- Status: `404 Not Found`
- Body: `{"error": "Category not found"}`

---

### Test 4.4: POST Create Category - Success (Admin)

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/categories`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "name": "Kategori Baru",
    "description": "Deskripsi kategori baru"
  }
  ```

**Expected Response:**
- Status: `201 Created`
- Body: Category data dengan id baru

---

### Test 4.5: POST Create Category - Missing Name

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/categories`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "description": "Deskripsi saja"
  }
  ```

**Expected Response:**
- Status: `400 Bad Request`
- Body: `{"error": "Name is required"}`

---

### Test 4.6: POST Create Category - Cashier (Should Fail)

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/categories`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_cashier}}`
- **Body**: (sama seperti Test 4.4)

**Expected Response:**
- Status: `403 Forbidden`
- Body: `{"error": "Forbidden"}`

---

### Test 4.7: PUT Update Category - Success (Admin)

**Request:**
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/categories/6`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "name": "Pakaian Pria Updated",
    "description": "Deskripsi updated"
  }
  ```

**Expected Response:**
- Status: `200 OK`
- Body: Updated category data

---

### Test 4.8: DELETE Category - Success (Admin)

**Request:**
- **Method**: `DELETE`
- **URL**: `{{base_url}}/api/categories/6`
- **Headers**: `Authorization: Bearer {{access_token_admin}}`

**Expected Response:**
- Status: `200 OK`
- Body: `{"message": "Category deleted successfully"}`

**Note**: Products dengan category_id 6 akan memiliki category_id = NULL (ON DELETE SET NULL)

---

## 5. Transactions Testing

### Test 5.1: GET All Transactions - Success (Admin)

**Request:**
- **Method**: `GET`
- **URL**: `{{base_url}}/api/transactions`
- **Headers**: `Authorization: Bearer {{access_token_admin}}`

**Expected Response:**
- Status: `200 OK`
- Body: Array semua transactions dengan user_name

---

### Test 5.2: GET All Transactions - Cashier (Should Fail)

**Request:**
- **Method**: `GET`
- **URL**: `{{base_url}}/api/transactions`
- **Headers**: `Authorization: Bearer {{access_token_cashier}}`

**Expected Response:**
- Status: `403 Forbidden`
- Body: `{"error": "Forbidden"}`

---

### Test 5.3: GET Transaction By ID - Success (Admin)

**Request:**
- **Method**: `GET`
- **URL**: `{{base_url}}/api/transactions/16`
- **Headers**: `Authorization: Bearer {{access_token_admin}}`

**Expected Response:**
- Status: `200 OK`
- Body: Detail transaction dengan ID 16

---

### Test 5.4: POST Create Transaction - Success (Admin)

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/transactions`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "total_price": 450000
  }
  ```

**Expected Response:**
- Status: `201 Created`
- Body: Transaction data dengan user_id = admin yang login

---

### Test 5.5: POST Create Transaction - Success (Cashier)

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/transactions`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_cashier}}`
- **Body**:
  ```json
  {
    "total_price": 350000
  }
  ```

**Expected Response:**
- Status: `201 Created`
- Body: Transaction data dengan user_id = cashier yang login

---

### Test 5.6: POST Create Transaction - Without Token

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/transactions`
- **Headers**: `Content-Type: application/json`
- **Body**: (sama seperti Test 5.4)

**Expected Response:**
- Status: `401 Unauthorized`
- Body: `{"error": "No token provided"}`

---

### Test 5.7: POST Create Transaction - Missing total_price

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/transactions`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {}
  ```

**Expected Response:**
- Status: `400 Bad Request`
- Body: `{"error": "Total price is required"}`

---

### Test 5.8: POST Create Transaction - Negative Price

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/transactions`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "total_price": -1000
  }
  ```

**Expected Response:**
- Status: `400 Bad Request`
- Body: `{"error": "Total price must be non-negative"}`

---

### Test 5.9: POST Create Transaction - Zero Price (Boundary)

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/transactions`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "total_price": 0
  }
  ```

**Expected Response:**
- Status: `201 Created` (jika 0 diizinkan) atau `400`

---

### Test 5.10: PUT Update Transaction - Success (Admin)

**Request:**
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/transactions/16`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "total_price": 500000,
    "user_id": 4
  }
  ```

**Expected Response:**
- Status: `200 OK`
- Body: Updated transaction data

---

### Test 5.11: PUT Update Transaction - Cashier (Should Fail)

**Request:**
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/transactions/16`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_cashier}}`
- **Body**: (sama seperti Test 5.10)

**Expected Response:**
- Status: `403 Forbidden`
- Body: `{"error": "Forbidden"}`

---

### Test 5.12: PUT Update Transaction - Invalid User ID

**Request:**
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/transactions/16`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "user_id": 99999
  }
  ```

**Expected Response:**
- Status: `404 Not Found`
- Body: `{"error": "User not found"}`

---

## 6. Users Testing

### Test 6.1: GET All Users - Success (Admin)

**Request:**
- **Method**: `GET`
- **URL**: `{{base_url}}/api/users`
- **Headers**: `Authorization: Bearer {{access_token_admin}}`

**Expected Response:**
- Status: `200 OK`
- Body: Array semua users (tanpa password)

---

### Test 6.2: GET All Users - Cashier (Should Fail)

**Request:**
- **Method**: `GET`
- **URL**: `{{base_url}}/api/users`
- **Headers**: `Authorization: Bearer {{access_token_cashier}}`

**Expected Response:**
- Status: `403 Forbidden`
- Body: `{"error": "Forbidden"}`

---

### Test 6.3: GET User By ID - Success (Admin)

**Request:**
- **Method**: `GET`
- **URL**: `{{base_url}}/api/users/4`
- **Headers**: `Authorization: Bearer {{access_token_admin}}`

**Expected Response:**
- Status: `200 OK`
- Body: Detail user dengan ID 4 (tanpa password)

---

### Test 6.4: GET User By ID - Not Found

**Request:**
- **Method**: `GET`
- **URL**: `{{base_url}}/api/users/99999`
- **Headers**: `Authorization: Bearer {{access_token_admin}}`

**Expected Response:**
- Status: `404 Not Found`
- Body: `{"error": "User not found"}`

---

### Test 6.5: PUT Update User - Success (Admin)

**Request:**
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/users/4`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "name": "Admin Updated",
    "is_active": true
  }
  ```

**Expected Response:**
- Status: `200 OK`
- Body: Updated user data

---

### Test 6.6: PUT Update User - Change Password (Admin)

**Request:**
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/users/4`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "password": "newpassword123"
  }
  ```

**Expected Response:**
- Status: `200 OK`
- Body: Updated user data (password sudah di-hash)

---

### Test 6.7: PUT Update User - Invalid Role

**Request:**
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/users/4`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "role": "manager"
  }
  ```

**Expected Response:**
- Status: `400 Bad Request`
- Body: `{"error": "Invalid role"}`

---

### Test 6.8: PUT Update User - Cashier (Should Fail)

**Request:**
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/users/4`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_cashier}}`
- **Body**: (sama seperti Test 6.5)

**Expected Response:**
- Status: `403 Forbidden`
- Body: `{"error": "Forbidden"}`

---

### Test 6.9: DELETE User - Success (Admin)

**Request:**
- **Method**: `DELETE`
- **URL**: `{{base_url}}/api/users/5`
- **Headers**: `Authorization: Bearer {{access_token_admin}}`

**Expected Response:**
- Status: `200 OK`
- Body: `{"message": "User deleted successfully"}`

**Note**: Auth tokens user tersebut juga akan terhapus (CASCADE)

---

### Test 6.10: DELETE User - Not Found

**Request:**
- **Method**: `DELETE`
- **URL**: `{{base_url}}/api/users/99999`
- **Headers**: `Authorization: Bearer {{access_token_admin}}`

**Expected Response:**
- Status: `404 Not Found`
- Body: `{"error": "User not found"}`

---

## 7. Token & Authorization Testing

### Test 7.1: Invalid Token Format

**Request:**
- **Method**: `GET`
- **URL**: `{{base_url}}/api/users`
- **Headers**: `Authorization: Bearer invalid_token_12345`

**Expected Response:**
- Status: `401 Unauthorized`
- Body: `{"error": "Invalid token"}`

---

### Test 7.2: Missing Bearer Prefix

**Request:**
- **Method**: `GET`
- **URL**: `{{base_url}}/api/users`
- **Headers**: `Authorization: {{access_token_admin}}`

**Expected Response:**
- Status: `401 Unauthorized`
- Body: `{"error": "No token provided"}`

---

### Test 7.3: Expired Token

**Request:**
- **Method**: `GET`
- **URL**: `{{base_url}}/api/users`
- **Headers**: `Authorization: Bearer <expired_token>`

**Expected Response:**
- Status: `401 Unauthorized`
- Body: `{"error": "Invalid token"}`

**Note**: Buat token, tunggu sampai expired (1 jam), lalu test

---

### Test 7.4: Token dari User yang Di-delete

**Request:**
1. Login sebagai user
2. Copy token
3. Delete user tersebut (sebagai admin)
4. Gunakan token yang sudah di-copy

**Expected Response:**
- Status: `401 Unauthorized`
- Body: `{"error": "User not found or inactive"}`

---

### Test 7.5: Token dari User yang Inactive

**Request:**
1. Login sebagai user
2. Copy token
3. Update user menjadi `is_active: false` (sebagai admin)
4. Gunakan token yang sudah di-copy

**Expected Response:**
- Status: `401 Unauthorized`
- Body: `{"error": "User not found or inactive"}`

---

## 8. Edge Cases & Boundary Testing

### Test 8.1: Empty String Values

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/products`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "name": "",
    "price": 100000,
    "stock": 10,
    "category_id": 6
  }
  ```

**Expected Response:**
- Status: `400` atau `201` (tergantung validasi)

---

### Test 8.2: Null Values

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/products`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "name": null,
    "price": 100000,
    "stock": 10,
    "category_id": 6
  }
  ```

**Expected Response:**
- Status: `400 Bad Request`

---

### Test 8.3: Special Characters in Name

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/products`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "name": "Product !@#$%^&*()",
    "price": 100000,
    "stock": 10,
    "category_id": 6
  }
  ```

**Expected Response:**
- Status: `201 Created` (jika diizinkan)

---

### Test 8.4: SQL Injection Attempt

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/products`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "name": "'; DROP TABLE products; --",
    "price": 100000,
    "stock": 10,
    "category_id": 6
  }
  ```

**Expected Response:**
- Status: `201 Created` (parameterized query harus aman)
- **Verify**: Table products masih ada

---

### Test 8.5: XSS Attempt

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/products`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "name": "<script>alert('XSS')</script>",
    "price": 100000,
    "stock": 10,
    "category_id": 6
  }
  ```

**Expected Response:**
- Status: `201 Created`
- **Verify**: Data tersimpan sebagai string, tidak dieksekusi

---

### Test 8.6: Very Large Number

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/products`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "name": "Product",
    "price": 999999999999999999,
    "stock": 10,
    "category_id": 6
  }
  ```

**Expected Response:**
- Status: `400` atau `500` (tergantung validasi)

---

### Test 8.7: Decimal Price

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/products`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token_admin}}`
- **Body**:
  ```json
  {
    "name": "Product",
    "price": 100000.50,
    "stock": 10,
    "category_id": 6
  }
  ```

**Expected Response:**
- Status: `201 Created` (jika decimal diizinkan)

---

## 9. Data Integrity Testing

### Test 9.1: Delete Category dengan Products

**Request:**
1. Buat product dengan category_id = 6
2. Delete category dengan ID 6
3. Cek product tersebut

**Expected Result:**
- Category terhapus
- Product masih ada, tapi category_id = NULL (ON DELETE SET NULL)

---

### Test 9.2: Delete User dengan Transactions

**Request:**
1. Buat transaction dengan user_id = 4
2. Coba delete user dengan ID 4

**Expected Result:**
- Error atau user tidak bisa dihapus jika ada constraint
- Atau user terhapus dan transaction tetap ada (tergantung constraint)

---

### Test 9.3: Delete User dengan Auth Tokens

**Request:**
1. User login (membuat auth_token)
2. Delete user tersebut

**Expected Result:**
- User terhapus
- Auth tokens user tersebut juga terhapus (CASCADE)

---

## 10. Performance & Load Testing

### Test 10.1: Multiple Rapid Requests

**Request:**
- Kirim 10 request GET /api/products secara bersamaan

**Expected Result:**
- Semua request berhasil
- Response time masih wajar

---

### Test 10.2: Large Data Set

**Request:**
- GET /api/products (jika ada banyak data)

**Expected Result:**
- Response time masih wajar
- Data lengkap ter-return

---

## 11. Complete Testing Checklist

### Authentication
- [ ] Register - Success
- [ ] Register - Email exists
- [ ] Register - Invalid role
- [ ] Register - Missing fields
- [ ] Login - Success (Admin)
- [ ] Login - Success (Cashier)
- [ ] Login - Wrong email
- [ ] Login - Wrong password
- [ ] Login - Missing fields
- [ ] Refresh Token - Success
- [ ] Refresh Token - Invalid
- [ ] Logout - Success

### Products
- [ ] GET All - Success (Public)
- [ ] GET By ID - Success
- [ ] GET By ID - Not Found
- [ ] GET By ID - Invalid ID
- [ ] POST Create - Success (Admin)
- [ ] POST Create - Without Token
- [ ] POST Create - Cashier (403)
- [ ] POST Create - Missing fields
- [ ] POST Create - Negative price
- [ ] POST Create - Negative stock
- [ ] POST Create - Invalid category
- [ ] POST Create - Zero price
- [ ] POST Create - Very large price
- [ ] POST Create - Very long name
- [ ] PUT Update - Success (Admin)
- [ ] PUT Update - Not Found
- [ ] PUT Update - Cashier (403)
- [ ] DELETE - Success (Admin)
- [ ] DELETE - Not Found

### Categories
- [ ] GET All - Success (Public)
- [ ] GET By ID - Success
- [ ] GET By ID - Not Found
- [ ] POST Create - Success (Admin)
- [ ] POST Create - Missing name
- [ ] POST Create - Cashier (403)
- [ ] PUT Update - Success (Admin)
- [ ] DELETE - Success (Admin)
- [ ] DELETE - With products (cascade check)

### Transactions
- [ ] GET All - Success (Admin)
- [ ] GET All - Cashier (403)
- [ ] GET By ID - Success (Admin)
- [ ] POST Create - Success (Admin)
- [ ] POST Create - Success (Cashier)
- [ ] POST Create - Without Token
- [ ] POST Create - Missing total_price
- [ ] POST Create - Negative price
- [ ] POST Create - Zero price
- [ ] PUT Update - Success (Admin)
- [ ] PUT Update - Cashier (403)
- [ ] PUT Update - Invalid user_id
- [ ] DELETE - Success (Admin)

### Users
- [ ] GET All - Success (Admin)
- [ ] GET All - Cashier (403)
- [ ] GET By ID - Success (Admin)
- [ ] GET By ID - Not Found
- [ ] PUT Update - Success (Admin)
- [ ] PUT Update - Change password
- [ ] PUT Update - Invalid role
- [ ] PUT Update - Cashier (403)
- [ ] DELETE - Success (Admin)
- [ ] DELETE - Not Found

### Authorization
- [ ] Invalid token format
- [ ] Missing Bearer prefix
- [ ] Expired token
- [ ] Token from deleted user
- [ ] Token from inactive user

### Edge Cases
- [ ] Empty string values
- [ ] Null values
- [ ] Special characters
- [ ] SQL injection attempt
- [ ] XSS attempt
- [ ] Very large numbers
- [ ] Decimal values

---

## 12. Quick Reference

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

---

## 13. Tips Testing

1. **Gunakan Environment Variables** untuk token dan base_url
2. **Organisir Request** dalam folder berdasarkan endpoint
3. **Test Error Cases** untuk memastikan validasi bekerja
4. **Test Boundary Values** (0, negative, very large)
5. **Test Permission** dengan role berbeda
6. **Test Data Integrity** dengan cascade operations
7. **Document Results** untuk setiap test case
