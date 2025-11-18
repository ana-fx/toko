# Testing Products API

## Base URL
```
http://localhost:3000/api
```

## Endpoints

| Method | Path          | Description                                |
| ------ | ------------- | ------------------------------------------ |
| GET    | /products     | Retrieve all products                      |
| GET    | /products/:id | Retrieve a product by specified ID         |
| POST   | /products     | Store a new product                        |
| PUT    | /products/:id | Modify an existing product by specified ID |
| DELETE | /products/:id | Delete an existing product by specified ID |

---

## 1. GET /products

### Test 1.1: Get All Products (Public)

**Request:**
```
GET http://localhost:3000/api/products
```

**Expected:**
- Status: `200 OK`
- Response: Array semua products dengan category_name

---

### Test 1.2: Get Product By ID

**Request:**
```
GET http://localhost:3000/api/products/26
```

**Expected:**
- Status: `200 OK`
- Response: Detail product dengan ID 26

---

### Test 1.3: Product Not Found

**Request:**
```
GET http://localhost:3000/api/products/99999
```

**Expected:**
- Status: `404 Not Found`
- Response: `{"error": "Product not found"}`

---

## 2. POST /products

### Test 2.1: Create Product (Admin)

**Request:**
```
POST http://localhost:3000/api/products
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "name": "Kemeja Pria Baru",
  "price": 300000,
  "stock": 20,
  "category_id": 6
}
```

**Expected:**
- Status: `201 Created`
- Response: Product data dengan id baru

---

### Test 2.2: Missing Required Fields

**Request:**
```
POST http://localhost:3000/api/products
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "name": "Product Baru"
}
```

**Expected:**
- Status: `400 Bad Request`
- Response: `{"error": "Name, price, and stock are required"}`

---

### Test 2.3: Negative Price

**Request:**
```
POST http://localhost:3000/api/products
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "name": "Product Baru",
  "price": -1000,
  "stock": 10,
  "category_id": 6
}
```

**Expected:**
- Status: `400 Bad Request`
- Response: `{"error": "Price and stock must be non-negative"}`

---

### Test 2.4: Negative Stock

**Request:**
```
POST http://localhost:3000/api/products
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "name": "Product Baru",
  "price": 100000,
  "stock": -5,
  "category_id": 6
}
```

**Expected:**
- Status: `400 Bad Request`
- Response: `{"error": "Price and stock must be non-negative"}`

---

### Test 2.5: Invalid Category ID

**Request:**
```
POST http://localhost:3000/api/products
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "name": "Product Baru",
  "price": 100000,
  "stock": 10,
  "category_id": 99999
}
```

**Expected:**
- Status: `404 Not Found`
- Response: `{"error": "Category not found"}`

---

### Test 2.6: Without Token

**Request:**
```
POST http://localhost:3000/api/products
Headers:
  Content-Type: application/json

Body:
{
  "name": "Product Baru",
  "price": 100000,
  "stock": 10
}
```

**Expected:**
- Status: `401 Unauthorized`
- Response: `{"error": "No token provided"}`

---

### Test 2.7: Cashier Token (Forbidden)

**Request:**
```
POST http://localhost:3000/api/products
Headers:
  Content-Type: application/json
  Authorization: Bearer <cashier_token>

Body:
{
  "name": "Product Baru",
  "price": 100000,
  "stock": 10,
  "category_id": 6
}
```

**Expected:**
- Status: `403 Forbidden`
- Response: `{"error": "Forbidden"}`

---

## 3. PUT /products/:id

### Test 3.1: Update Product (Admin)

**Request:**
```
PUT http://localhost:3000/api/products/26
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "name": "Kemeja Pria Updated",
  "price": 350000,
  "stock": 25
}
```

**Expected:**
- Status: `200 OK`
- Response: Updated product data

---

### Test 3.2: Update Price Only

**Request:**
```
PUT http://localhost:3000/api/products/26
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "price": 400000
}
```

**Expected:**
- Status: `200 OK`
- Response: Product dengan price ter-update

---

### Test 3.3: Update Stock Only

**Request:**
```
PUT http://localhost:3000/api/products/26
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "stock": 30
}
```

**Expected:**
- Status: `200 OK`
- Response: Product dengan stock ter-update

---

### Test 3.4: Product Not Found

**Request:**
```
PUT http://localhost:3000/api/products/99999
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "name": "Updated Name"
}
```

**Expected:**
- Status: `404 Not Found`
- Response: `{"error": "Product not found"}`

---

### Test 3.5: Cashier Token (Forbidden)

**Request:**
```
PUT http://localhost:3000/api/products/26
Headers:
  Content-Type: application/json
  Authorization: Bearer <cashier_token>

Body:
{
  "name": "Updated Name"
}
```

**Expected:**
- Status: `403 Forbidden`
- Response: `{"error": "Forbidden"}`

---

### Test 3.6: Update with Invalid Category ID

**Request:**
```
PUT http://localhost:3000/api/products/26
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "category_id": 99999
}
```

**Expected:**
- Status: `404 Not Found`
- Response: `{"error": "Category not found"}`

---

## 4. DELETE /products/:id

### Test 4.1: Delete Product (Admin)

**Request:**
```
DELETE http://localhost:3000/api/products/26
Headers:
  Authorization: Bearer <admin_token>
```

**Expected:**
- Status: `200 OK`
- Response: `{"message": "Product deleted successfully"}`

---

### Test 4.2: Product Not Found

**Request:**
```
DELETE http://localhost:3000/api/products/99999
Headers:
  Authorization: Bearer <admin_token>
```

**Expected:**
- Status: `404 Not Found`
- Response: `{"error": "Product not found"}`

---

### Test 4.3: Cashier Token (Forbidden)

**Request:**
```
DELETE http://localhost:3000/api/products/26
Headers:
  Authorization: Bearer <cashier_token>
```

**Expected:**
- Status: `403 Forbidden`
- Response: `{"error": "Forbidden"}`

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

