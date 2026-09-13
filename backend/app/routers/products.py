"""
routers/products.py

GET    /api/products            public — search/filter
GET    /api/products/{id}       public — single product
POST   /api/products            FARMER only — create
PUT    /api/products/{id}       FARMER owner only — update
DELETE /api/products/{id}       FARMER owner only — delete
"""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.auth import get_current_user, require_farmer
from app.database import get_db
from app.models import Product, ProductCategory, User
from app.schemas import ProductRequest, ProductResponse, UserSummaryResponse

router = APIRouter(prefix="/api/products", tags=["products"])


# ── Helpers ───────────────────────────────────────────────────────────────────

def _to_response(p: Product) -> ProductResponse:
    return ProductResponse(
        id=p.id,
        name=p.name,
        description=p.description,
        category=p.category,
        price=p.price,
        unit=p.unit,
        stock=p.stock,
        imageKey=p.image_key,
        farmingMethod=p.farming_method,
        location=p.location,
        createdAt=p.created_at,
        farmer=UserSummaryResponse(
            id=p.farmer.id,
            name=p.farmer.name,
            location=p.farmer.location,
        ),
    )


def _get_product_or_404(product_id: int, db: Session) -> Product:
    product = (
        db.query(Product)
        .options(joinedload(Product.farmer))
        .filter(Product.id == product_id)
        .first()
    )
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product not found: {product_id}",
        )
    return product


def _assert_ownership(product: Product, farmer: User) -> None:
    if product.farmer_id != farmer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not own this product",
        )


def _apply_request(product: Product, req: ProductRequest) -> None:
    product.name = req.name
    product.description = req.description
    product.category = req.category
    product.price = req.price
    product.unit = req.unit
    product.stock = req.stock
    product.image_key = req.imageKey
    product.farming_method = req.farmingMethod
    product.location = req.location


# ── Routes ────────────────────────────────────────────────────────────────────

@router.get("", response_model=List[ProductResponse])
def search_products(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """Public — browse and filter products."""
    q = db.query(Product).options(joinedload(Product.farmer))

    if search:
        q = q.filter(Product.name.ilike(f"%{search}%"))

    if category:
        try:
            cat = ProductCategory(category.upper())
            q = q.filter(Product.category == cat)
        except ValueError:
            pass  # unknown category → no filter, return all

    if location:
        q = q.filter(Product.location.ilike(f"%{location}%"))

    products = q.order_by(Product.created_at.desc()).all()
    return [_to_response(p) for p in products]


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Public — single product detail."""
    return _to_response(_get_product_or_404(product_id, db))


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductRequest,
    db: Session = Depends(get_db),
    farmer: User = Depends(require_farmer),
):
    """FARMER only — create a new product listing."""
    product = Product(farmer_id=farmer.id)
    _apply_request(product, payload)
    db.add(product)
    db.commit()
    db.refresh(product)
    # reload with farmer relationship
    return _to_response(_get_product_or_404(product.id, db))


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    payload: ProductRequest,
    db: Session = Depends(get_db),
    farmer: User = Depends(require_farmer),
):
    """FARMER owner only — update own product."""
    product = _get_product_or_404(product_id, db)
    _assert_ownership(product, farmer)
    _apply_request(product, payload)
    db.commit()
    db.refresh(product)
    return _to_response(_get_product_or_404(product.id, db))


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    farmer: User = Depends(require_farmer),
):
    """FARMER owner only — delete own product."""
    product = _get_product_or_404(product_id, db)
    _assert_ownership(product, farmer)
    db.delete(product)
    db.commit()
