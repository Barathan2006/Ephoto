import os
import uuid
from flask import Blueprint, render_template, redirect, url_for, flash, request, abort, current_app
from werkzeug.utils import secure_filename
from PIL import Image
from ..extensions import db
from ..decorators import admin_required
from ..models import User, Product, Category, Order, OrderItem

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/')
@admin_required
def dashboard():
    total_users = User.query.count()
    total_products = Product.query.count()
    total_categories = Category.query.count()
    total_orders = Order.query.count()
    
    # Calculate demo order volume (never confuse with actual revenue)
    orders = Order.query.all()
    total_demo_value = sum(o.total_amount for o in orders)

    recent_orders = Order.query.order_by(Order.created_at.desc()).limit(6).all()
    recent_products = Product.query.order_by(Product.created_at.desc()).limit(6).all()

    return render_template(
        'admin/dashboard.html',
        total_users=total_users,
        total_products=total_products,
        total_categories=total_categories,
        total_orders=total_orders,
        total_demo_value=total_demo_value,
        recent_orders=recent_orders,
        recent_products=recent_products
    )


# Product Management
@admin_bp.route('/products')
@admin_required
def products():
    search = request.args.get('search', '').strip()
    category_id = request.args.get('category', type=int)

    query = Product.query
    if search:
        query = query.filter(Product.title.ilike(f'%{search}%'))
    if category_id:
        query = query.filter_by(category_id=category_id)

    product_list = query.order_by(Product.created_at.desc()).all()
    categories = Category.query.all()

    return render_template(
        'admin/products.html',
        products=product_list,
        categories=categories,
        current_category=category_id,
        search=search
    )


@admin_bp.route('/products/add', methods=['GET', 'POST'])
@admin_required
def add_product():
    categories = Category.query.all()
    if not categories:
        flash('Please create at least one category before adding products.', 'warning')
        return redirect(url_for('admin.categories'))

    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        description = request.form.get('description', '').strip()
        price = float(request.form.get('price', 0))
        category_id = int(request.form.get('category_id'))
        original_file = request.files.get('original_image')

        if not title or price <= 0 or not original_file:
            flash('Title, valid price, and original image file are required.', 'danger')
            return render_template('admin/add_product.html', categories=categories)

        # Secure filename generation
        ext = original_file.filename.rsplit('.', 1)[-1].lower() if '.' in original_file.filename else 'jpg'
        if ext not in current_app.config['ALLOWED_EXTENSIONS']:
            flash('Unsupported file extension.', 'danger')
            return render_template('admin/add_product.html', categories=categories)

        unique_id = uuid.uuid4().hex
        orig_filename = f"{unique_id}_original.{ext}"
        prev_filename = f"{unique_id}_preview.jpg"

        orig_path = os.path.join(current_app.config['ORIGINALS_FOLDER'], orig_filename)
        prev_path = os.path.join(current_app.config['PREVIEWS_FOLDER'], prev_filename)

        original_file.save(orig_path)

        # Process image metadata and create preview via Pillow
        try:
            with Image.open(orig_path) as img:
                width, height = img.size
                img_format = img.format or ext.upper()

                # Generate downsampled preview (max 1200px width/height)
                preview_img = img.copy()
                preview_img.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
                if preview_img.mode != 'RGB':
                    preview_img = preview_img.convert('RGB')
                preview_img.save(prev_path, 'JPEG', quality=85)

            file_size_bytes = os.path.getsize(orig_path)
            file_size_str = f"{(file_size_bytes / (1024 * 1024)):.1f} MB"

        except Exception as e:
            flash(f'Error processing image with Pillow: {str(e)}', 'danger')
            return render_template('admin/add_product.html', categories=categories)

        new_product = Product(
            title=title,
            description=description,
            price=price,
            category_id=category_id,
            original_image=orig_filename,
            preview_image=prev_filename,
            image_format=img_format,
            image_width=width,
            image_height=height,
            file_size=file_size_str,
            is_active=True
        )

        db.session.add(new_product)
        db.session.commit()

        flash(f'Product "{title}" added successfully!', 'success')
        return redirect(url_for('admin.products'))

    return render_template('admin/add_product.html', categories=categories)


@admin_bp.route('/products/edit/<int:product_id>', methods=['GET', 'POST'])
@admin_required
def edit_product(product_id):
    product = Product.query.get_or_404(product_id)
    categories = Category.query.all()

    if request.method == 'POST':
        product.title = request.form.get('title', '').strip()
        product.description = request.form.get('description', '').strip()
        product.price = float(request.form.get('price', product.price))
        product.category_id = int(request.form.get('category_id', product.category_id))
        product.is_active = bool(request.form.get('is_active'))

        db.session.commit()
        flash('Product updated successfully.', 'success')
        return redirect(url_for('admin.products'))

    return render_template('admin/edit_product.html', product=product, categories=categories)


@admin_bp.route('/products/toggle/<int:product_id>', methods=['POST'])
@admin_required
def toggle_product(product_id):
    product = Product.query.get_or_404(product_id)
    product.is_active = not product.is_active
    db.session.commit()
    flash(f'Product status toggled to {"Active" if product.is_active else "Inactive"}.', 'info')
    return redirect(url_for('admin.products'))


@admin_bp.route('/products/delete/<int:product_id>', methods=['POST'])
@admin_required
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    title = product.title
    db.session.delete(product)
    db.session.commit()
    flash(f'Product "{title}" deleted.', 'info')
    return redirect(url_for('admin.products'))


# Category Management
@admin_bp.route('/categories', methods=['GET', 'POST'])
@admin_required
def categories():
    if request.method == 'POST':
        cat_name = request.form.get('category_name', '').strip()
        description = request.form.get('description', '').strip()

        if not cat_name:
            flash('Category name is required.', 'danger')
        elif Category.query.filter_by(category_name=cat_name).first():
            flash('A category with this name already exists.', 'warning')
        else:
            new_cat = Category(category_name=cat_name, description=description)
            db.session.add(new_cat)
            db.session.commit()
            flash(f'Category "{cat_name}" created.', 'success')

        return redirect(url_for('admin.categories'))

    cat_list = Category.query.all()
    return render_template('admin/categories.html', categories=cat_list)


@admin_bp.route('/categories/delete/<int:category_id>', methods=['POST'])
@admin_required
def delete_category(category_id):
    category = Category.query.get_or_404(category_id)
    if category.products:
        flash(f'Cannot delete category "{category.category_name}": {len(category.products)} product(s) still belong to it.', 'danger')
        return redirect(url_for('admin.categories'))

    db.session.delete(category)
    db.session.commit()
    flash(f'Category "{category.category_name}" deleted.', 'info')
    return redirect(url_for('admin.categories'))


# User Management
@admin_bp.route('/users')
@admin_required
def users():
    search = request.args.get('search', '').strip()
    query = User.query
    if search:
        query = query.filter(User.username.ilike(f'%{search}%') | User.email.ilike(f'%{search}%'))

    user_list = query.order_by(User.created_at.desc()).all()
    return render_template('admin/users.html', users=user_list, search=search)


@admin_bp.route('/users/toggle/<int:user_id>', methods=['POST'])
@admin_required
def toggle_user(user_id):
    from flask_login import current_user
    if user_id == current_user.id:
        flash('You cannot deactivate your own active administrator account.', 'danger')
        return redirect(url_for('admin.users'))

    user = User.query.get_or_404(user_id)
    user.is_active = not user.is_active
    db.session.commit()
    flash(f'User "{user.username}" {"activated" if user.is_active else "deactivated"}.', 'info')
    return redirect(url_for('admin.users'))


# Order Management
@admin_bp.route('/orders')
@admin_required
def orders():
    search = request.args.get('search', '').strip()
    status_filter = request.args.get('status', 'all')

    query = Order.query
    if search:
        query = query.filter(Order.order_number.ilike(f'%{search}%'))
    if status_filter != 'all':
        query = query.filter_by(order_status=status_filter)

    order_list = query.order_by(Order.created_at.desc()).all()
    return render_template('admin/orders.html', orders=order_list, search=search, status_filter=status_filter)


@admin_bp.route('/orders/status/<int:order_id>', methods=['POST'])
@admin_required
def update_order_status(order_id):
    order = Order.query.get_or_404(order_id)
    new_status = request.form.get('order_status')
    if new_status in ['COMPLETED_DEMO', 'PROCESSING_DEMO', 'CANCELLED']:
        order.order_status = new_status
        db.session.commit()
        flash(f'Order {order.order_number} status updated to {new_status}.', 'success')
    return redirect(url_for('admin.orders'))
