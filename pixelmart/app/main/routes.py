from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
from ..extensions import db
from ..models import Product, Category, Order, User

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def home():
    featured_categories = Category.query.limit(6).all()
    featured_products = Product.query.filter_by(is_active=True).order_by(Product.created_at.desc()).limit(8).all()
    return render_template(
        'home.html',
        categories=featured_categories,
        products=featured_products
    )

@main_bp.route('/about')
def about():
    return render_template('about.html')

@main_bp.route('/contact')
def contact():
    return render_template('contact.html')

@main_bp.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    if request.method == 'POST':
        new_username = request.form.get('username', '').strip()
        new_email = request.form.get('email', '').strip().lower()
        new_password = request.form.get('new_password', '')

        if not new_username or not new_email:
            flash('Username and email are required.', 'danger')
            return redirect(url_for('main.profile'))

        # Check duplicate username
        existing_user = User.query.filter(User.username == new_username, User.id != current_user.id).first()
        if existing_user:
            flash('Username is already taken by another account.', 'danger')
            return redirect(url_for('main.profile'))

        # Check duplicate email
        existing_email = User.query.filter(User.email == new_email, User.id != current_user.id).first()
        if existing_email:
            flash('Email is already registered to another account.', 'danger')
            return redirect(url_for('main.profile'))

        current_user.username = new_username
        current_user.email = new_email

        if new_password:
            if len(new_password) < 6:
                flash('New password must be at least 6 characters.', 'warning')
                return redirect(url_for('main.profile'))
            current_user.set_password(new_password)
            flash('Profile and password updated successfully.', 'success')
        else:
            flash('Profile updated successfully.', 'success')

        db.session.commit()
        return redirect(url_for('main.profile'))

    recent_orders = Order.query.filter_by(user_id=current_user.id).order_by(Order.created_at.desc()).limit(5).all()
    total_orders = Order.query.filter_by(user_id=current_user.id).count()

    return render_template(
        'profile/profile.html',
        recent_orders=recent_orders,
        total_orders=total_orders
    )
