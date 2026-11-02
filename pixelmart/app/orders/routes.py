import os
import random
from datetime import datetime
from flask import Blueprint, render_template, redirect, url_for, flash, request, abort, send_file, current_app
from flask_login import login_required, current_user
from ..extensions import db
from ..models import Order, OrderItem, CartItem, Download, Product

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/checkout', methods=['GET'])
@login_required
def checkout():
    cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
    if not cart_items:
        flash('Your cart is empty. Please add images before proceeding to checkout.', 'warning')
        return redirect(url_for('products.listing'))

    # Verify all items are active
    active_items = [i for i in cart_items if i.product and i.product.is_active]
    if len(active_items) != len(cart_items):
        flash('One or more items in your cart are no longer active.', 'danger')
        return redirect(url_for('cart.view_cart'))

    total_amount = sum(item.product.price * item.quantity for item in active_items)

    return render_template(
        'orders/checkout.html',
        cart_items=active_items,
        total_amount=total_amount
    )


@orders_bp.route('/place-demo-order', methods=['POST'])
@login_required
def place_demo_order():
    """Simulated demo checkout. Strictly zero payment gateway."""
    cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
    if not cart_items:
        flash('Your shopping cart is empty.', 'danger')
        return redirect(url_for('products.listing'))

    # Recalculate total directly from database
    total_amount = 0.0
    for item in cart_items:
        if not item.product or not item.product.is_active:
            flash(f'Product {item.product_id} is no longer available.', 'danger')
            return redirect(url_for('cart.view_cart'))
        total_amount += (item.product.price * item.quantity)

    # Generate unique order number
    order_number = f"DEMO-{datetime.utcnow().year}-{random.randint(10000, 99999)}"

    try:
        # Begin transaction
        new_order = Order(
            order_number=order_number,
            user_id=current_user.id,
            total_amount=total_amount,
            order_status='COMPLETED_DEMO',
            checkout_type='DEMO'
        )
        db.session.add(new_order)
        db.session.flush()  # Obtain order id

        for item in cart_items:
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=item.product.id,
                product_title=item.product.title,
                unit_price=item.product.price,
                quantity=item.quantity,
                subtotal=item.product.price * item.quantity
            )
            db.session.add(order_item)
            db.session.flush()

            # Initialize download entitlement
            dl_record = Download(
                user_id=current_user.id,
                order_item_id=order_item.id,
                download_count=0
            )
            db.session.add(dl_record)

        # Clear customer's shopping cart
        CartItem.query.filter_by(user_id=current_user.id).delete()

        db.session.commit()
        flash('Demo order placed successfully! You may now download your high-resolution files.', 'success')
        return redirect(url_for('orders.success', order_number=order_number))

    except Exception as e:
        db.session.rollback()
        flash(f'An error occurred while processing your demo order: {str(e)}', 'danger')
        return redirect(url_for('cart.view_cart'))


@orders_bp.route('/success/<string:order_number>')
@login_required
def success(order_number):
    order = Order.query.filter_by(order_number=order_number).first_or_404()

    if order.user_id != current_user.id and current_user.role != 'admin':
        abort(403)

    return render_template('orders/success.html', order=order)


@orders_bp.route('/history')
@login_required
def history():
    user_orders = Order.query.filter_by(user_id=current_user.id).order_by(Order.created_at.desc()).all()
    return render_template('orders/history.html', orders=user_orders)


@orders_bp.route('/download/<int:order_item_id>')
@login_required
def download(order_item_id):
    """
    Secure original master download route:
    1. Authenticate user.
    2. Check order ownership & status.
    3. Serve file securely with Flask send_file.
    4. Increment download tracker.
    """
    order_item = OrderItem.query.get_or_404(order_item_id)
    order = order_item.order

    # Verify authorization
    if order.user_id != current_user.id and current_user.role != 'admin':
        abort(403)

    # Verify order status
    if order.order_status not in ['COMPLETED_DEMO', 'COMPLETED']:
        flash('This order is not eligible for downloads at this time.', 'warning')
        return redirect(url_for('orders.history'))

    product = order_item.product
    if not product:
        abort(404)

    # Secure file path resolution (prevent path traversal)
    filename = os.path.basename(product.original_image)
    originals_dir = current_app.config['ORIGINALS_FOLDER']
    file_path = os.path.join(originals_dir, filename)

    # Fallback if local file not written or demo asset:
    if not os.path.exists(file_path):
        # If running in simulation mode where files are external URLs or placeholders
        flash(f'Original master asset "{product.title}" download simulated successfully.', 'success')
        return redirect(url_for('orders.history'))

    # Update download tracking
    dl_record = Download.query.filter_by(user_id=current_user.id, order_item_id=order_item.id).first()
    if dl_record:
        dl_record.download_count += 1
        dl_record.last_downloaded_at = datetime.utcnow()
    else:
        dl_record = Download(
            user_id=current_user.id,
            order_item_id=order_item.id,
            download_count=1,
            last_downloaded_at=datetime.utcnow()
        )
        db.session.add(dl_record)

    db.session.commit()

    return send_file(
        file_path,
        as_attachment=True,
        download_name=f"pixelmart-{product.id}-{filename}"
    )
