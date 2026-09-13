"""
routers/farmer.py

GET /api/farmer/products   FARMER only — own product listings
GET /api/farmer/orders     FARMER only — orders containing their products
GET /api/farmer/dashboard  FARMER only — dashboard stats
"""
from decimal import Decimal
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy import distinct, func
from sqlalchemy.orm import Session, joinedload

from app.auth import require_farmer
from app.database import get_db
from app.models import Order, OrderItem, Product, User
from app.routers.orders import _to_response as order_to_response
from app.routers.products import _to_response as product_to_response
from app.schemas import FarmerDashboardResponse, OrderResponse, ProductResponse

router = APIRouter(prefix="/api/farmer", tags=["farmer"])


@router.get("/products", response_model=List[ProductResponse])
def get_my_products(
    db: Session = Depends(get_db),
    farmer: User = Depends(require_farmer),
):
    """FARMER — list all own product listings."""
    products = (
        db.query(Product)
        .options(joinedload(Product.farmer))
        .filter(Product.farmer_id == farmer.id)
        .order_by(Product.created_at.desc())
        .all()
    )
    return [product_to_response(p) for p in products]


@router.get("/orders", response_model=List[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    farmer: User = Depends(require_farmer),
):
    """FARMER — orders that contain at least one of their products."""
    # Subquery: get distinct order IDs that include this farmer's products
    order_ids = (
        db.query(distinct(OrderItem.order_id))
        .join(Product, OrderItem.product_id == Product.id)
        .filter(Product.farmer_id == farmer.id)
        .subquery()
    )

    orders = (
        db.query(Order)
        .options(
            joinedload(Order.items)
            .joinedload(OrderItem.product)
            .joinedload(Product.farmer),
        )
        .filter(Order.id.in_(order_ids))
        .order_by(Order.created_at.desc())
        .all()
    )
    return [order_to_response(o) for o in orders]


@router.get("/dashboard", response_model=FarmerDashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    farmer: User = Depends(require_farmer),
):
    """FARMER — aggregate stats: product counts, order count, total sales."""
    products = db.query(Product).filter(Product.farmer_id == farmer.id).all()
    total_products = len(products)
    active_products = sum(1 for p in products if p.stock > 0)

    # Count distinct orders that contain at least one of this farmer's products
    total_orders = (
        db.query(func.count(distinct(OrderItem.order_id)))
        .join(Product, OrderItem.product_id == Product.id)
        .filter(Product.farmer_id == farmer.id)
        .scalar()
        or 0
    )

    # Sum revenue across all orders
    raw_sales = (
        db.query(func.sum(OrderItem.price * OrderItem.quantity))
        .join(Product, OrderItem.product_id == Product.id)
        .filter(Product.farmer_id == farmer.id)
        .scalar()
    )
    sales_total = Decimal(str(raw_sales)) if raw_sales else Decimal("0")

    return FarmerDashboardResponse(
        totalProducts=total_products,
        activeProducts=active_products,
        totalOrders=total_orders,
        salesTotal=sales_total,
    )
