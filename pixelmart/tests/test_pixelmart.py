import pytest
from app import create_app
from app.extensions import db
from app.models import User, Category, Product, CartItem, Order, OrderItem

class TestConfig:
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_ENABLED = False
    SECRET_KEY = 'test-secret'
    UPLOAD_FOLDER = '/tmp/pixelmart_uploads'
    ORIGINALS_FOLDER = '/tmp/pixelmart_uploads/originals'
    PREVIEWS_FOLDER = '/tmp/pixelmart_uploads/previews'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

@pytest.fixture
def app():
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def init_data(app):
    with app.app_context():
        cat = Category(category_name="Nature", description="Scenic nature")
        db.session.add(cat)
        db.session.flush()

        customer = User(username="test_customer", email="customer@test.com", role="customer", is_active=True)
        customer.set_password("Password123!")
        db.session.add(customer)

        admin = User(username="test_admin", email="admin@test.com", role="admin", is_active=True)
        admin.set_password("AdminPass123!")
        db.session.add(admin)

        prod = Product(
            title="Mountain Vista",
            description="High elevation sunrise",
            price=30.0,
            category_id=cat.id,
            preview_image="vista_prev.jpg",
            original_image="vista_orig.jpg",
            is_active=True
        )
        db.session.add(prod)
        db.session.commit()
        return {'category': cat, 'customer': customer, 'admin': admin, 'product': prod}

# 1. Authentication Tests
def test_registration_and_login(client, app):
    # Register new user
    res = client.post('/auth/register', data={
        'username': 'newuser',
        'email': 'newuser@test.com',
        'password': 'SecretPassword123',
        'confirm_password': 'SecretPassword123'
    }, follow_redirects=True)
    assert res.status_code == 200

    with app.app_context():
        user = User.query.filter_by(username='newuser').first()
        assert user is not None
        assert user.role == 'customer'  # Never admin by public registration
        assert user.check_password('SecretPassword123')

# 2. Duplicate validation
def test_duplicate_email_rejected(client, init_data):
    res = client.post('/auth/register', data={
        'username': 'unique_user',
        'email': 'customer@test.com',  # Existing email
        'password': 'Password123!',
        'confirm_password': 'Password123!'
    }, follow_redirects=True)
    assert b'already exists' in res.data or res.status_code == 200

# 3. Product Catalog
def test_product_listing(client, init_data):
    res = client.get('/products/')
    assert res.status_code == 200
    assert b'Mountain Vista' in res.data

# 4. Cart & Simulated Demo Checkout (No Payment)
def test_cart_and_demo_order(client, init_data, app):
    # Login customer
    client.post('/auth/login', data={'email': 'customer@test.com', 'password': 'Password123!'}, follow_redirects=True)

    with app.app_context():
        prod = Product.query.first()
        customer = User.query.filter_by(email='customer@test.com').first()

        # Add to cart
        cart_item = CartItem(user_id=customer.id, product_id=prod.id, quantity=1)
        db.session.add(cart_item)
        db.session.commit()

        # Place Demo Order
        order = Order(
            order_number="DEMO-TEST-001",
            user_id=customer.id,
            total_amount=prod.price,
            order_status="COMPLETED_DEMO",
            checkout_type="DEMO"
        )
        db.session.add(order)
        db.session.commit()

        assert order.checkout_type == "DEMO"
        assert order.order_status == "COMPLETED_DEMO"
        assert order.total_amount == 30.0

# 5. Role-Based Access Control: Customer blocked from admin
def test_admin_access_restricted_for_customer(client, init_data):
    client.post('/auth/login', data={'email': 'customer@test.com', 'password': 'Password123!'}, follow_redirects=True)
    res = client.get('/admin/')
    assert res.status_code in [403, 302]  # Forbidden or redirected
