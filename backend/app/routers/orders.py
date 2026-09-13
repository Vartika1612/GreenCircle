"""
routers/orders.py

POST /api/orders        CUSTOMER only — place a new order
GET  /api/orders        CUSTOMER — own order history
GET  /api/orders/{id}   CUSTOMER or relevant FARMER — single order detail
"""
from decimal import Decimal
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.auth import get_current_user, require_customer
from app.database import get_db
from app.models import Order, OrderItem, OrderStatus, Product, User
from app.schemas import (
    CreateOrderRequest,
    OrderItemResponse,
    OrderResponse,
)

router = APIRouter(prefix="/api/orders", tags=["orders"])


# ── Helpers ───────────────────────────────────────────────────────────────────

def _load_order(order_id: int, db: Session) -> Order:
    order = (
        db.query(Order)
        .options(
            joinedload(Order.customer),
            joinedload(Order.items)
            .joinedload(OrderItem.product)
            .joinedload(Product.farmer),
        )
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order not found: {order_id}",
        )
    return order


def _to_item_response(item: OrderItem) -> OrderItemResponse:
    price = Decimal(str(item.price))
    qty = item.quantity
    return OrderItemResponse(
        productId=item.product_id,
        productName=item.product.name,
        quantity=qty,
        price=price,
        lineTotal=price * qty,
    )


def _to_response(order: Order) -> OrderResponse:
    return OrderResponse(
        id=order.id,
        status=order.status,
        totalAmount=order.total_amount,
        createdAt=order.created_at,
        items=[_to_item_response(i) for i in order.items],
    )


# ── Routes ────────────────────────────────────────────────────────────────────

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: CreateOrderRequest,
    db: Session = Depends(get_db),
    customer: User = Depends(require_customer),
):
    """CUSTOMER only — place a new order, deducting stock atomically."""
    order = Order(customer_id=customer.id, status=OrderStatus.PLACED)
    db.add(order)
    db.flush()  # get order.id before adding items

    total = Decimal("0")

    for item_req in payload.items:
        product = (
            db.query(Product)
            .filter(Product.id == item_req.productId)
            .with_for_update()  # row-level lock to prevent overselling
            .first()
        )
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product not found: {item_req.productId}",
            )
        if product.stock < item_req.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Insufficient stock for product: {product.name} "
                    f"(available: {product.stock})"
                ),
            )

        product.stock -= item_req.quantity
        price = Decimal(str(product.price))

        item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item_req.quantity,
            price=price,
        )
        db.add(item)
        total += price * item_req.quantity

    order.total_amount = total
    db.commit()

    return _to_response(_load_order(order.id, db))


@router.get("", response_model=List[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    customer: User = Depends(require_customer),
):
    """CUSTOMER — own order history, newest first."""
    orders = (
        db.query(Order)
        .options(
            joinedload(Order.items)
            .joinedload(OrderItem.product)
            .joinedload(Product.farmer),
        )
        .filter(Order.customer_id == customer.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return [_to_response(o) for o in orders]


@router.get("/{order_id}", response_model=OrderResponse)
def get_order_by_id(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """CUSTOMER or relevant FARMER — single order detail."""
    order = _load_order(order_id, db)

    is_customer = order.customer_id == current_user.id
    is_farmer_with_item = any(
        item.product.farmer_id == current_user.id for item in order.items
    )

    if not is_customer and not is_farmer_with_item:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this order",
        )

    return _to_response(order)
