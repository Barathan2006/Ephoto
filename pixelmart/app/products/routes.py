import os
from flask import Blueprint, render_template, request, abort, current_app, send_from_directory
from ..models import Product, Category

products_bp = Blueprint('products', __name__)

@products_bp.route('/')
def listing():
    search = request.args.get('search', '').strip()
    category_id = request.args.get('category', type=int)
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    sort_by = request.args.get('sort', 'newest')
    page = request.args.get('page', 1, type=int)

    query = Product.query.filter_by(is_active=True)

    if search:
        query = query.filter(Product.title.ilike(f'%{search}%') | Product.description.ilike(f'%{search}%'))

    if category_id:
        query = query.filter_by(category_id=category_id)

    if min_price is not None:
        query = query.filter(Product.price >= min_price)

    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # Sorting
    if sort_by == 'price_asc':
        query = query.order_by(Product.price.asc())
    elif sort_by == 'price_desc':
        query = query.order_by(Product.price.desc())
    else:
        query = query.order_by(Product.created_at.desc())

    # Pagination: 12 products per page
    pagination = query.paginate(page=page, per_page=12, error_out=False)
    products = pagination.items
    categories = Category.query.all()

    return render_template(
        'products/listing.html',
        products=products,
        pagination=pagination,
        categories=categories,
        current_category=category_id,
        current_sort=sort_by,
        search=search,
        min_price=min_price,
        max_price=max_price
    )


@products_bp.route('/<int:product_id>')
def details(product_id):
    product = Product.query.get_or_404(product_id)

    if not product.is_active:
        abort(404)

    # Related images from the same category
    related_products = Product.query.filter(
        Product.category_id == product.category_id,
        Product.id != product.id,
        Product.is_active == True
    ).limit(4).all()

    return render_template(
        'products/details.html',
        product=product,
        related_products=related_products
    )


@products_bp.route('/preview/<path:filename>')
def serve_preview(filename):
    """Publicly serve only downsampled preview images. Never expose original masters here."""
    previews_dir = current_app.config['PREVIEWS_FOLDER']
    return send_from_directory(previews_dir, filename)
