import os
from app import create_app
from app.extensions import db
from app.models import User, Category, Product, CartItem, Order, OrderItem, Download

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'User': User,
        'Category': Category,
        'Product': Product,
        'CartItem': CartItem,
        'Order': Order,
        'OrderItem': OrderItem,
        'Download': Download
    }

@app.cli.command("init-db")
def init_db():
    """CLI command to create all database tables."""
    with app.app_context():
        db.create_all()
        print("Successfully created database tables for PixelMart.")

@app.cli.command("create-admin")
def create_admin():
    """CLI command to create initial secure administrator account."""
    import getpass
    with app.app_context():
        username = input("Admin username: ").strip() or "admin"
        email = input("Admin email: ").strip() or "admin@pixelmart.com"
        password = getpass.getpass("Admin password: ") or "Admin123!"

        if User.query.filter((User.username == username) | (User.email == email)).first():
            print("User with that username or email already exists.")
            return

        admin_user = User(
            username=username,
            email=email,
            role="admin",
            is_active=True
        )
        admin_user.set_password(password)
        db.session.add(admin_user)
        db.session.commit()
        print(f"Administrator '{username}' created successfully!")

if __name__ == '__main__':
    # Initialize database tables if not yet created
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
