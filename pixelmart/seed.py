import os
from app import create_app
from app.extensions import db
from app.models import User, Category, Product

app = create_app()

def seed_database():
    with app.app_context():
        db.create_all()

        # 1. Seed Categories
        categories_data = [
            ("Nature", "Wilderness, mountain ranges, tranquil lakes, and pristine landscapes."),
            ("Technology", "Circuitry, computing hardware, optical processors, and cyber setups."),
            ("Architecture", "Helical stairs, brutalist monoliths, modern interiors, and glass facades."),
            ("Abstract", "Fluid chromatics, kinetic wave forms, and generative gradient textures."),
            ("Portraits", "Expressive studio lighting, chiaroscuro contrast, and character portraits."),
            ("Animals", "Wildlife in natural habitats, macro animal encounters, and majestic creatures."),
            ("Wallpapers", "Ultra-wide 4K and 8K backgrounds crafted for multi-display workstations."),
            ("Travel", "Historic cobblestone passages, coastal sunsets, and cultural architecture."),
        ]

        category_objs = {}
        for name, desc in categories_data:
            cat = Category.query.filter_by(category_name=name).first()
            if not cat:
                cat = Category(category_name=name, description=desc)
                db.session.add(cat)
                db.session.flush()
            category_objs[name] = cat

        # 2. Seed Users
        admin = User.query.filter_by(email="admin@pixelmart.com").first()
        if not admin:
            admin = User(username="admin", email="admin@pixelmart.com", role="admin", is_active=True)
            admin.set_password("Admin123!")
            db.session.add(admin)

        customer = User.query.filter_by(email="customer@pixelmart.com").first()
        if not customer:
            customer = User(username="barath_creator", email="customer@pixelmart.com", role="customer", is_active=True)
            customer.set_password("Customer123!")
            db.session.add(customer)

        db.session.commit()

        # 3. Seed Products
        products_data = [
            ("Alpine Dawn Over Dolomite Pinnacles", "First light cascading through morning mist across the jagged limestone peaks of the Italian Dolomites.", 34.0, "Nature", "alpine_dawn_preview.jpg", "alpine_dawn_master.jpg", 6000, 4000, "18.4 MB"),
            ("Silicon Matrix & Photonic Processor", "High-magnification darkfield macro shot of an integrated optical circuit wafer with rainbow diffraction.", 49.0, "Technology", "photonic_wafer_preview.jpg", "photonic_wafer_master.png", 5472, 3648, "24.1 MB"),
            ("Minimalist Monolithic Spiral Staircase", "Pristine raw concrete helical stair structure illuminated by a single overhead cylindrical skylight.", 29.0, "Architecture", "spiral_stair_preview.jpg", "spiral_stair_master.jpg", 5184, 3888, "15.8 MB"),
            ("Iridescent Kinetic Fluid Silk", "Liquid pigment macro photography showcasing fluid wave dynamics with metallic cobalt and copper gradients.", 39.0, "Abstract", "fluid_waves_preview.jpg", "fluid_waves_master.webp", 6240, 4160, "12.6 MB"),
            ("Emerald Fjord Reflection Under Starlight", "Long-exposure night photograph of Geirangerfjord Norway, with emerald glacial water reflecting snowbound peaks.", 45.0, "Nature", "emerald_fjord_preview.jpg", "emerald_fjord_master.jpg", 7952, 5304, "31.2 MB"),
            ("Topographic Dune Shadows at Sunset", "Harmonic wind-swept ripples and knife-edge shadows on Erg Chebbi sand dunes during golden twilight.", 38.0, "Wallpapers", "dune_shadows_preview.jpg", "dune_shadows_master.jpg", 6720, 4480, "22.5 MB")
        ]

        for title, desc, price, cat_name, prev_img, orig_img, w, h, size in products_data:
            existing_prod = Product.query.filter_by(title=title).first()
            if not existing_prod and cat_name in category_objs:
                prod = Product(
                    title=title,
                    description=desc,
                    price=price,
                    category_id=category_objs[cat_name].id,
                    preview_image=prev_img,
                    original_image=orig_img,
                    image_width=w,
                    image_height=h,
                    file_size=size,
                    is_active=True
                )
                db.session.add(prod)

        db.session.commit()
        print("Successfully seeded PixelMart database with initial categories, admin account, customer, and catalog products.")

if __name__ == '__main__':
    seed_database()
