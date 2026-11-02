import os
from flask import Flask, render_template
from .extensions import db, login_manager, csrf
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Ensure upload directories exist
    os.makedirs(app.config['ORIGINALS_FOLDER'], exist_ok=True)
    os.makedirs(app.config['PREVIEWS_FOLDER'], exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    csrf.init_app(app)

    # Register Blueprints
    from .auth.routes import auth_bp
    from .main.routes import main_bp
    from .products.routes import products_bp
    from .cart.routes import cart_bp
    from .orders.routes import orders_bp
    from .admin.routes import admin_bp
    from .api.routes import api_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(main_bp)
    app.register_blueprint(products_bp, url_prefix='/products')
    app.register_blueprint(cart_bp, url_prefix='/cart')
    app.register_blueprint(orders_bp, url_prefix='/orders')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(api_bp, url_prefix='/api')

    # Global Context Processor for cart count & categories
    @app.context_processor
    def inject_global_data():
        from .models import Category, CartItem
        from flask_login import current_user

        categories = Category.query.all()
        cart_count = 0
        if current_user.is_authenticated:
            cart_count = CartItem.query.filter_by(user_id=current_user.id).count()

        return dict(
            global_categories=categories,
            global_cart_count=cart_count,
            current_year=2026
        )

    # Error Handlers
    @app.errorhandler(403)
    def forbidden(e):
        return render_template('errors/403.html'), 403

    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('errors/404.html'), 404

    @app.errorhandler(500)
    def server_error(e):
        return render_template('errors/500.html'), 500

    return app
