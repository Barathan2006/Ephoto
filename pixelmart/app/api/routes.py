from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from ..extensions import db, csrf
from ..models import Product, Category, CartItem, Order, OrderItem, User

api_bp = Blueprint('api', __name__)

# Exclude API endpoints from CSRF token check for programmatic clients
csrf.exempt(api_bp)

def api_response(success, message, data=None, status_code=200):
    return jsonify({
        'success': success,
        'message': message,
        'data': data if data is not None else {}
    }), status_code


# 1. AUTH API
@api_bp.route('/auth/register', methods=['POST'])
def api_register():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not username or not email or not password:
        return api_response(False, 'Username, email, and password are required', status_code=400)

    if User.query.filter_by(username=username).first():
        return api_response(False, 'Username is already taken', status_code=409)

    if User.query.filter_by(email=email).first():
        return api_response(False, 'Email is already registered', status_code=409)

    user = User(username=username, email=email, role='customer', is_active=True)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return api_response(True, 'User registered successfully', {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role
    }, status_code=201)


@api_bp.route('/auth/login', methods=['POST'])
def api_login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return api_response(False, 'Invalid email or password', status_code=401)

    if not user.is_active:
        return api_response(False, 'User account is deactivated', status_code=403)

    login_user(user)
    return api_response(True, 'Login successful', {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role
    })


@api_bp.route('/auth/logout', methods=['POST'])
def api_logout():
    logout_user()
    return api_response(True, 'Logout successful')


# 2. PRODUCTS & CATEGORIES API
@api_bp.route('/products', methods=['GET'])
def api_get_products():
    category_id = request.args.get('category_id', type=int)
    search = request.args.get('search', '').strip()

    query = Product.query.filter_by(is_active=True)
    if category_id:
        query = query.filter_by(category_id=category_id)
    if search:
        query = query.filter(Product.title.ilike(f'%{search}%'))

    products = query.order_by(Product.created_at.desc()).all()
    data = [{
        'id': p.id,
        'title': p.title,
        'description': p.description,
        'price': p.price,
        'category_id': p.category_id,
        'category_name': p.category.category_name if p.category else None,
        'preview_image': p.preview_image,
        'image_format': p.image_format,
        'dimensions': f"{p.image_width}x{p.image_height}",
        'file_size': p.file_size
    } for p in products]

    return api_response(True, 'Products retrieved successfully', {'products': data})


@api_bp.route('/products/<int:id>', methods=['GET'])
def api_get_product(id):
    p = Product.query.get(id)
    if not p or not p.is_active:
        return api_response(False, 'Product not found', status_code=404)

    return api_response(True, 'Product retrieved successfully', {
        'id': p.id,
        'title': p.title,
        'description': p.description,
        'price': p.price,
        'category_id': p.category_id,
        'category_name': p.category.category_name if p.category else None,
        'preview_image': p.preview_image,
        'image_format': p.image_format,
        'image_width': p.image_width,
        'image_height': p.image_height,
        'file_size': p.file_size
    })


@api_bp.route('/categories', methods=['GET'])
def api_get_categories():
    categories = Category.query.all()
    data = [{
        'id': c.id,
        'category_name': c.category_name,
        'description': c.description,
        'product_count': len(c.products)
    } for c in categories]

    return api_response(True, 'Categories retrieved successfully', {'categories': data})


# 3. CART API
@api_bp.route('/cart', methods=['GET'])
def api_get_cart():
    if not current_user.is_authenticated:
        return api_response(False, 'Authentication required', status_code=401)

    items = CartItem.query.filter_by(user_id=current_user.id).all()
    subtotal = sum(i.product.price * i.quantity for i in items if i.product)
    
    return api_response(True, 'Cart retrieved successfully', {
        'items': [{
            'id': i.id,
            'product_id': i.product_id,
            'title': i.product.title if i.product else None,
            'price': i.product.price if i.product else None,
            'quantity': i.quantity,
            'preview_image': i.product.preview_image if i.product else None
        } for i in items],
        'total': subtotal
    })


@api_bp.route('/cart', methods=['POST'])
def api_add_cart():
    if not current_user.is_authenticated:
        return api_response(False, 'Authentication required', status_code=401)

    data = request.get_json() or {}
    product_id = data.get('product_id')
    product = Product.query.get(product_id)
    if not product or not product.is_active:
        return api_response(False, 'Product not found or inactive', status_code=404)

    existing = CartItem.query.filter_by(user_id=current_user.id, product_id=product_id).first()
    if existing:
        return api_response(True, 'Product already in cart', {'cart_item_id': existing.id})

    item = CartItem(user_id=current_user.id, product_id=product_id, quantity=1)
    db.session.add(item)
    db.session.commit()

    return api_response(True, 'Added to cart successfully', {'cart_item_id': item.id}, status_code=201)


@api_bp.route('/cart/<int:id>', methods=['DELETE'])
def api_delete_cart(id):
    if not current_user.is_authenticated:
        return api_response(False, 'Authentication required', status_code=401)

    item = CartItem.query.filter_by(id=id, user_id=current_user.id).first()
    if not item:
        return api_response(False, 'Cart item not found', status_code=404)

    db.session.delete(item)
    db.session.commit()
    return api_response(True, 'Item removed from cart')


# 4. ORDERS API
@api_bp.route('/orders', methods=['GET'])
def api_get_orders():
    if not current_user.is_authenticated:
        return api_response(False, 'Authentication required', status_code=401)

    orders = Order.query.filter_by(user_id=current_user.id).order_by(Order.created_at.desc()).all()
    return api_response(True, 'Orders retrieved successfully', {
        'orders': [{
            'id': o.id,
            'order_number': o.order_number,
            'total_amount': o.total_amount,
            'order_status': o.order_status,
            'checkout_type': o.checkout_type,
            'items_count': len(o.items),
            'created_at': o.created_at.isoformat()
        } for o in orders]
    })


@api_bp.route('/orders', methods=['POST'])
def api_place_order():
    if not current_user.is_authenticated:
        return api_response(False, 'Authentication required', status_code=401)

    cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
    if not cart_items:
        return api_response(False, 'Cart is empty', status_code=400)

    import random
    order_number = f"DEMO-{random.randint(10000, 99999)}"
    total = sum(i.product.price * i.quantity for i in cart_items if i.product)

    order = Order(
        order_number=order_number,
        user_id=current_user.id,
        total_amount=total,
        order_status='COMPLETED_DEMO',
        checkout_type='DEMO'
    )
    db.session.add(order)
    db.session.flush()

    for item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            product_title=item.product.title,
            unit_price=item.product.price,
            quantity=item.quantity,
            subtotal=item.product.price * item.quantity
        )
        db.session.add(order_item)

    CartItem.query.filter_by(user_id=current_user.id).delete()
    db.session.commit()

    return api_response(True, 'Demo order placed successfully (No payment collected)', {
        'order_number': order_number,
        'total_amount': total,
        'order_status': order.order_status,
        'checkout_type': order.checkout_type
    }, status_code=201)
