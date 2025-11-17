# Alur Aplikasi Toko API

## 1.1 Alur Authentication

```
┌─────────────┐
│   Register  │ (Opsional - untuk membuat user baru)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Login    │ (Mendapatkan accessToken & refreshToken)
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌──────────────┐
│ Access API  │   │ Refresh Token│ (Jika token expired)
└─────────────┘   └──────┬───────┘
                         │
                         ▼
                    ┌─────────────┐
                    │  New Token  │
                    └─────────────┘
```

**Penjelasan:**
1. User melakukan **Register** (opsional) untuk membuat akun baru
2. User melakukan **Login** dengan email dan password
3. Sistem mengembalikan `accessToken` dan `refreshToken`
4. User menggunakan `accessToken` untuk mengakses API protected
5. Jika token expired, gunakan `refreshToken` untuk mendapatkan token baru

---

## 1.2 Alur CRUD Products (Admin)

```
┌─────────────┐
│   Login     │ (Sebagai admin)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Get Token   │
└──────┬──────┘
       │
       ├─────────────────────────────────────┐
       │                                     │
       ▼                                     ▼
┌─────────────┐                      ┌─────────────┐
│  GET        │ (Lihat semua)       │  POST       │ (Buat baru)
│  Products   │                      │  Product    │
└─────────────┘                      └──────┬──────┘
       │                                           │
       │                                           ▼
       │                                    ┌─────────────┐
       │                                    │  Product    │
       │                                    │  Created    │
       │                                    └─────────────┘
       │
       ├─────────────────────────────────────┐
       │                                     │
       ▼                                     ▼
┌─────────────┐                      ┌─────────────┐
│  PUT        │ (Update)             │  DELETE     │ (Hapus)
│  Product    │                      │  Product    │
└─────────────┘                      └─────────────┘
```

**Penjelasan:**
1. Admin login untuk mendapatkan token
2. Admin bisa:
   - **GET** - Melihat semua produk atau detail produk
   - **POST** - Membuat produk baru
   - **PUT** - Update produk yang ada
   - **DELETE** - Menghapus produk

---

## 1.3 Alur Transaksi (Cashier)

```
┌─────────────┐
│   Login     │ (Sebagai cashier)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Get Token   │
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│  GET        │   │  POST        │
│  Products   │   │  Transaction │
│  (View)     │   │  (Create)    │
└─────────────┘   └──────┬───────┘
                         │
                         ▼
                    ┌─────────────┐
                    │ Transaction │
                    │  Created    │
                    └─────────────┘
```

**Penjelasan:**
1. Cashier login untuk mendapatkan token
2. Cashier bisa:
   - **GET Products** - Melihat produk yang tersedia (public)
   - **POST Transaction** - Membuat transaksi baru
3. Cashier **TIDAK BISA**:
   - Insert/Update/Delete produk
   - Melihat semua transaksi
   - Manage users

---

## 1.4 Alur Permission (Role-Based Access)

```
                    ┌─────────────┐
                    │    User     │
                    └──────┬──────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
        ┌─────────────┐       ┌─────────────┐
        │    Admin    │       │   Cashier   │
        └──────┬──────┘       └──────┬──────┘
               │                     │
    ┌──────────┼──────────┐         │
    │          │          │         │
    ▼          ▼          ▼         ▼
┌──────┐  ┌──────┐  ┌──────┐  ┌──────────┐
│ CRUD │  │ CRUD │  │ CRUD │  │  Create  │
│Users │  │Products│ │Categories│ │Transaction│
└──────┘  └──────┘  └──────┘  └──────────┘
```

**Penjelasan:**
- **Admin**: Full access (CRUD semua resource)
- **Cashier**: Limited access (hanya bisa create transaction dan view products/categories)

