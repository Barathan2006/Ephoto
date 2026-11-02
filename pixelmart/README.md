# PixelMart & Ephoto – Digital Image Selling Marketplace

A production-grade digital image selling e-commerce marketplace built using Python Flask, SQLAlchemy ORM, and MySQL, alongside an interactive high-performance modern web application.

> **CRITICAL ARCHITECTURAL DIRECTIVE:**
> This platform contains **strictly NO payment gateway** (No Razorpay, Stripe, PayPal, UPI, credit card, or financial payment API). All transactions are simulated demo orders with the official declaration:
> *"This is a demonstration order. No payment was collected and no real-money transaction occurred."*

---

## 1. Project Overview & Roles

### Customer Capabilities:
- **Browse & Search:** Filter images by title, keywords, price range, and taxonomy categories.
- **Specifications Inspector:** Review image dimensions (e.g. 6000 × 4000), format (RAW/JPEG/PNG/WebP), and file size.
- **Protected Preview:** Previews are served with optional watermark simulation; original master files are securely segregated.
- **Creator Studio:** Generate procedural mathematical canvas art or upload original photography to sell on the marketplace.
- **Shopping Cart:** Add, review, and manage digital items with server-side totals calculation.
- **Demo Checkout:** Place simulated orders with `COMPLETED_DEMO` status without entering financial information.
- **Secure Downloads:** Instant, authorized downloads of full-resolution original master files with tracking.
- **Profile & History:** Manage account credentials and view all previous order licenses.

### Administrator Capabilities:
- **Admin Dashboard:** Real-time statistics on registered users, active assets, categories, demo orders, and demo order volume (clearly distinguished from revenue).
- **Product Management:** Upload original image master files, auto-generate downsampled previews with Pillow, edit specs, toggle availability, and delete.
- **Category Management:** Create, edit, and delete categories with relational protection (cannot delete categories containing active products).
- **User Management:** View registered customers, toggle active/disabled status (preventing self-deactivation).
- **Order Management:** View all simulated orders, inspect ordered assets, and update demo order statuses.

---

## 2. Technology Stack

- **Backend:** Python 3.10+, Flask, Blueprints (`auth`, `main`, `products`, `cart`, `orders`, `admin`, `api`)
- **Database:** MySQL 8.0+ / SQLite development fallback, SQLAlchemy ORM
- **Security:** Werkzeug password hashing (PBKDF2-HMAC-SHA256), Flask-Login session management, CSRF protection, RBAC decorators (`@admin_required`)
- **Image Processing:** Pillow (PIL) for image verification, dimension extraction, and thumbnail/preview generation
- **Frontend:** Responsive HTML5, modern CSS3 / Tailwind CSS, interactive client studio, Jinja2 template inheritance

---

## 3. Database Schema (MySQL: `pixelmart_db`)

```sql
-- 1. Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer',
    profile_image VARCHAR(255) DEFAULT 'default_avatar.png',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(80) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products Table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price FLOAT NOT NULL,
    category_id INT NOT NULL,
    preview_image VARCHAR(255) NOT NULL,
    original_image VARCHAR(255) NOT NULL,
    image_format VARCHAR(20) DEFAULT 'JPEG',
    image_width INT DEFAULT 6000,
    image_height INT DEFAULT 4000,
    file_size VARCHAR(50) DEFAULT '18.4 MB',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 4. Cart Items Table
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_product_cart (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 5. Orders Table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    total_amount FLOAT NOT NULL,
    order_status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED_DEMO',
    checkout_type VARCHAR(30) NOT NULL DEFAULT 'DEMO',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 6. Order Items Table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_title VARCHAR(150) NOT NULL,
    unit_price FLOAT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    subtotal FLOAT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 7. Downloads Table
CREATE TABLE downloads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_item_id INT NOT NULL,
    download_count INT NOT NULL DEFAULT 0,
    last_downloaded_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE
);
```

---

## 4. Installation & Windows Execution Guide

### Prerequisites:
- Python 3.10 or higher
- MySQL Server 8.0+ (or use the automatic SQLite dev fallback)
- Git

### Step-by-Step Setup:

1. **Clone or Navigate to the Repository:**
   ```cmd
   cd pixelmart
   ```

2. **Create and Activate Python Virtual Environment:**
   ```cmd
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install Dependencies:**
   ```cmd
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables (`.env`):**
   Copy `.env.example` to `.env`:
   ```cmd
   copy .env.example .env
   ```
   If using MySQL:
   ```env
   DATABASE_URL=mysql+pymysql://root:yourpassword@localhost:3306/pixelmart_db
   ```
   If MySQL is not running, the application automatically uses SQLite (`sqlite:///pixelmart.db`).

5. **Initialize Database Tables:**
   ```cmd
   python -c "from app import create_app; from app.extensions import db; app = create_app(); app.app_context().push(); db.create_all()"
   ```

6. **Seed Initial Categories & Products:**
   ```cmd
   python seed.py
   ```

7. **Create Initial Administrator Account (CLI):**
   ```cmd
   flask --app run.py create-admin
   ```

8. **Start the Application:**
   ```cmd
   python run.py
   ```
   Access the web platform in your browser at: `http://localhost:5000`

---

## 5. REST API Documentation

All API endpoints return standard JSON envelopes:
```json
{
  "success": true,
  "message": "Operation completed",
  "data": {}
}
```

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new customer account |
| `POST` | `/api/auth/login` | Log in with email & password |
| `POST` | `/api/auth/logout` | End session |
| `GET` | `/api/products` | Query active products (filters: `category_id`, `search`) |
| `GET` | `/api/products/<id>` | Retrieve single product specs |
| `GET` | `/api/categories` | Retrieve list of taxonomy categories |
| `GET` | `/api/cart` | View current user's shopping cart |
| `POST` | `/api/cart` | Add product to shopping cart (`{"product_id": 1}`) |
| `DELETE` | `/api/cart/<id>` | Remove item from cart |
| `GET` | `/api/orders` | Retrieve user's demo order history |
| `POST` | `/api/orders` | Place simulated demo order |

---

## 6. Running Tests

Execute the automated test suite with pytest:
```cmd
pytest tests/test_pixelmart.py -v
```
Tests verify authentication, duplicate rejection, category/product browsing, simulated demo order creation, and role-based access restrictions.
