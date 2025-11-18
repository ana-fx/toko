# Testing Categories API

## Base URL
```
http://localhost:3000/api
```

## Endpoints

| Method | Path            | Description                                 |
| ------ | --------------- | ------------------------------------------- |
| GET    | /categories     | Retrieve all categories                     |
| GET    | /categories/:id | Retrieve a category by specified ID         |
| POST   | /categories     | Store a new category                        |
| PUT    | /categories/:id | Modify an existing category by specified ID |
| DELETE | /categories/:id | Delete an existing category by specified ID |

---

## 1. GET /categories

### Test 1.1: Get All Categories (Public)

**Request:**
```
GET http://localhost:3000/api/categories
```

**Expected:**
- Status: `200 OK`
- Response: Array semua categories

---

### Test 1.2: Get Category By ID

**Request:**
```
GET http://localhost:3000/api/categories/6
```

**Expected:**
- Status: `200 OK`
- Response: Detail category dengan ID 6

---

### Test 1.3: Category Not Found

**Request:**
```
GET http://localhost:3000/api/categories/99999
```

**Expected:**
- Status: `404 Not Found`
- Response: `{"error": "Category not found"}`

---

## 2. POST /categories

### Test 2.1: Create Category (Admin)

**Request:**
```
POST http://localhost:3000/api/categories
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "name": "Kategori Baru",
  "description": "Deskripsi kategori"
}
```

**Expected:**
- Status: `201 Created`
- Response: Category data dengan id baru

---

### Test 2.2: Missing Name

**Request:**
```
POST http://localhost:3000/api/categories
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "description": "Hanya deskripsi"
}
```

**Expected:**
- Status: `400 Bad Request`
- Response: `{"error": "Name is required"}`

---

### Test 2.3: Without Token

**Request:**
```
POST http://localhost:3000/api/categories
Headers:
  Content-Type: application/json

Body:
{
  "name": "Kategori Baru"
}
```

**Expected:**
- Status: `401 Unauthorized`
- Response: `{"error": "No token provided"}`

---

### Test 2.4: Cashier Token (Forbidden)

**Request:**
```
POST http://localhost:3000/api/categories
Headers:
  Content-Type: application/json
  Authorization: Bearer <cashier_token>

Body:
{
  "name": "Kategori Baru"
}
```

**Expected:**
- Status: `403 Forbidden`
- Response: `{"error": "Forbidden"}`

---

## 3. PUT /categories/:id

### Test 3.1: Update Category (Admin)

**Request:**
```
PUT http://localhost:3000/api/categories/6
Headers:
  Content-Type: application/json
  Authorization: Bearer <admin_token>

Body:
{
  "name": "Pakaian Pria Updated",
  "description": "Deskripsi updated"
}
```

**Expected:**
- Status: `200 OK`
- Response: Updated category data

---

### Test 3.2: Category Not Found

**Request:**
```
PUT http://localhost:3000/api/categories/99999
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
- Response: `{"error": "Category not found"}`

---

### Test 3.3: Cashier Token (Forbidden)

**Request:**
```
PUT http://localhost:3000/api/categories/6
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

## 4. DELETE /categories/:id

### Test 4.1: Delete Category (Admin)

**Request:**
```
DELETE http://localhost:3000/api/categories/6
Headers:
  Authorization: Bearer <admin_token>
```

**Expected:**
- Status: `200 OK`
- Response: `{"message": "Category deleted successfully"}`

**Note:** Products dengan category_id = 6 akan memiliki category_id = NULL

---

### Test 4.2: Category Not Found

**Request:**
```
DELETE http://localhost:3000/api/categories/99999
Headers:
  Authorization: Bearer <admin_token>
```

**Expected:**
- Status: `404 Not Found`
- Response: `{"error": "Category not found"}`

---

### Test 4.3: Cashier Token (Forbidden)

**Request:**
```
DELETE http://localhost:3000/api/categories/6
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

