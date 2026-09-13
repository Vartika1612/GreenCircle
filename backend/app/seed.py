"""
seed.py — Populates the database with the same demo data as schema.sql.
Only runs if the users table is empty (idempotent).
Passwords are bcrypt hashes of "password123".
"""
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.models import (
    Order,
    OrderItem,
    OrderStatus,
    Product,
    ProductCategory,
    User,
    UserRole,
)

_pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
# Pre-computed hash of "password123" — same as schema.sql seed data
_HASHED_PW = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi"


def run_seed(db: Session) -> None:
    if db.query(User).count() > 0:
        return  # already seeded

    # ── Users ─────────────────────────────────────────────────────────────────
    farmer1 = User(
        name="Green Valley Farm",
        email="farmer@greencircle.com",
        password=_HASHED_PW,
        role=UserRole.FARMER,
        location="Napa Valley, CA",
    )
    farmer2 = User(
        name="Sunrise Organics",
        email="farmer2@greencircle.com",
        password=_HASHED_PW,
        role=UserRole.FARMER,
        location="Sonoma County, CA",
    )
    customer = User(
        name="Jane Customer",
        email="customer@greencircle.com",
        password=_HASHED_PW,
        role=UserRole.CUSTOMER,
        location="San Francisco, CA",
    )
    db.add_all([farmer1, farmer2, customer])
    db.flush()

    # ── Products ──────────────────────────────────────────────────────────────
    products = [
        Product(
            name="Heirloom Tomatoes",
            description=(
                "Sun-ripened heirloom tomatoes grown without pesticides. "
                "Varieties include Cherokee Purple, Brandywine, and Green Zebra. "
                "Picked at peak ripeness for maximum flavour."
            ),
            category=ProductCategory.VEGETABLES,
            price="4.50",
            unit="lb",
            stock=80,
            farming_method="Certified Organic, No-till",
            location="Napa Valley, CA",
            farmer_id=farmer1.id,
        ),
        Product(
            name="Rainbow Chard",
            description=(
                "Vibrant mix of red, yellow, and orange stemmed Swiss chard. "
                "Tender leaves, earthy flavour. Great sautéed or in salads."
            ),
            category=ProductCategory.VEGETABLES,
            price="3.00",
            unit="bunch",
            stock=50,
            farming_method="Certified Organic",
            location="Napa Valley, CA",
            farmer_id=farmer1.id,
        ),
        Product(
            name="Raw Wildflower Honey",
            description=(
                "Unfiltered, unheated raw honey from our own hives. "
                "Floral notes from wildflower meadows. Each jar is hand-labelled."
            ),
            category=ProductCategory.HONEY,
            price="12.00",
            unit="jar (16oz)",
            stock=30,
            farming_method="Natural Beekeeping",
            location="Napa Valley, CA",
            farmer_id=farmer1.id,
        ),
        Product(
            name="Free-Range Eggs",
            description=(
                "A dozen large eggs from pasture-raised hens that roam freely. "
                "Rich orange yolks, superior taste."
            ),
            category=ProductCategory.EGGS,
            price="7.00",
            unit="dozen",
            stock=60,
            farming_method="Pasture-Raised, Free-Range",
            location="Sonoma County, CA",
            farmer_id=farmer2.id,
        ),
        Product(
            name="Organic Blueberries",
            description=(
                "Plump, sweet-tart blueberries handpicked at the height of summer. "
                "Great fresh, frozen, or baked."
            ),
            category=ProductCategory.FRUITS,
            price="6.50",
            unit="pint",
            stock=40,
            farming_method="USDA Certified Organic",
            location="Sonoma County, CA",
            farmer_id=farmer2.id,
        ),
        Product(
            name="Stone-Ground Whole Wheat Flour",
            description=(
                "Milled from heritage red wheat grown on our farm. "
                "Nutty flavour, high in fibre. Great for breads and pastries."
            ),
            category=ProductCategory.GRAINS,
            price="5.00",
            unit="lb",
            stock=100,
            farming_method="Regenerative Agriculture",
            location="Sonoma County, CA",
            farmer_id=farmer2.id,
        ),
        Product(
            name="Fresh Basil",
            description=(
                "Large, fragrant Genovese basil bunches, perfect for pesto, "
                "caprese, or pizza. Harvested same day."
            ),
            category=ProductCategory.HERBS,
            price="2.50",
            unit="bunch",
            stock=45,
            farming_method="Certified Organic, Greenhouse-grown",
            location="Napa Valley, CA",
            farmer_id=farmer1.id,
        ),
        Product(
            name="Whole Milk Yogurt",
            description=(
                "Creamy, probiotic-rich yogurt from our grass-fed Jersey cows. "
                "Lightly sweetened with local honey. No artificial thickeners."
            ),
            category=ProductCategory.DAIRY,
            price="5.50",
            unit="pint",
            stock=25,
            farming_method="Grass-Fed, Hormone-Free",
            location="Sonoma County, CA",
            farmer_id=farmer2.id,
        ),
    ]
    db.add_all(products)
    db.commit()
