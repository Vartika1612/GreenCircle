"""
models.py — SQLAlchemy ORM models.
Table names and column names exactly match the MySQL schema in database/schema.sql.
"""
import enum
from datetime import datetime

from sqlalchemy import (
    BigInteger,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.orm import relationship

from app.database import Base


# ── Enums ─────────────────────────────────────────────────────────────────────

class UserRole(str, enum.Enum):
    CUSTOMER = "CUSTOMER"
    FARMER = "FARMER"


class ProductCategory(str, enum.Enum):
    VEGETABLES = "VEGETABLES"
    FRUITS = "FRUITS"
    GRAINS = "GRAINS"
    EGGS = "EGGS"
    HONEY = "HONEY"
    DAIRY = "DAIRY"
    HERBS = "HERBS"


class OrderStatus(str, enum.Enum):
    PLACED = "PLACED"
    CONFIRMED = "CONFIRMED"
    COMPLETED = "COMPLETED"


# ── ORM Models ────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    location = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())

    products = relationship("Product", back_populates="farmer", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="customer", cascade="all, delete-orphan")


class Product(Base):
    __tablename__ = "products"
    __table_args__ = (
        Index("idx_product_category_location", "category", "location"),
        Index("idx_product_farmer", "farmer_id"),
    )

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    name = Column(String(150), nullable=False)
    description = Column(Text)
    category = Column(Enum(ProductCategory), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    unit = Column(String(50), nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    image_key = Column(String(500))
    farming_method = Column(String(200))
    location = Column(String(200))
    farmer_id = Column(
        BigInteger().with_variant(Integer, "sqlite"),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())

    farmer = relationship("User", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")


class Order(Base):
    __tablename__ = "orders"
    __table_args__ = (Index("idx_order_customer", "customer_id"),)

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    customer_id = Column(
        BigInteger().with_variant(Integer, "sqlite"),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    total_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(Enum(OrderStatus), nullable=False, default=OrderStatus.PLACED)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())

    customer = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"
    __table_args__ = (
        Index("idx_orderitem_order", "order_id"),
        Index("idx_orderitem_product", "product_id"),
    )

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    order_id = Column(
        BigInteger().with_variant(Integer, "sqlite"),
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
    )
    product_id = Column(
        BigInteger().with_variant(Integer, "sqlite"),
        ForeignKey("products.id", ondelete="RESTRICT"),
        nullable=False,
    )
    quantity = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)  # snapshot price at order time

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
