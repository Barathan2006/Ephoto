from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from ..extensions import db
from ..models import Product, CartItem

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/')
@login_required
def view_cart():
    cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
    # Calculate backend total
    subtotal = sum(item.product.price * item.quantity for item in cart_items if item.product and item.product.is_active)

    return render_template('cart/cart.html', cart_items=cart_items, subtotal=subtotal)


@cart_bp.route('/add/<int:product_id>', methods=['POST'])
@login_required
def add_to_cart(product_id):
    product = Product.query.get_or_404(product_id)

    if not product.is_active:
        flash('This digital image is currently inactive and cannot be ordered.', 'danger')
        return redirect(request.referrer or url_for('products.listing'))

    existing_item = CartItem.query.filter_by(user_id=current_user.id, product_id=product_id).first()

    if existing_item:
        flash(f'"{product.title}" is already in your cart.', 'info')
    else:
        new_item = CartItem(user_id=current_user.id, product_id=product_id, quantity=1)
        db.session.add(new_item)
        db.session.commit()
        flash(f'Added "{product.title}" to your cart.', 'success')

    return redirect(request.referrer or url_for('cart.view_cart'))


@cart_bp.route('/remove/<int:item_id>', methods=['POST'])
@login_required
def remove_from_cart(item_id):
    item = CartItem.query.filter_by(id=item_id, user_id=current_user.id).first_or_404()
    title = item.product.title if item.product else 'Item'
    db.session.delete(item)
    db.session.commit()
    flash(f'Removed "{title}" from your cart.', 'info')
    return redirect(url_for('cart.view_cart'))


@cart_bp.route('/clear', methods=['POST'])
@login_required
def clear_cart():
    CartItem.query.filter_by(user_id=current_user.id).delete()
    db.session.commit()
    flash('Your cart has been cleared.', 'info')
    return redirect(url_for('cart.view_cart'))
