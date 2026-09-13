"""
schemas.py — Pydantic v2 request/response schemas.
Field names and JSON shapes match the Spring Boot DTOs exactly so
the frontend requires no changes.
"""
from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.models import OrderStatus, ProductCategory, UserRole


# ── Shared / nested ──────────────────────────────────────────────────────────

class UserSummaryResponse(BaseModel):
    id: int
    name: str
    location: Optional[str] = None

    model_config = {"from_attributes": True}


# ── Auth ─────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: UserRole
    location: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    token: str
    userId: int
    name: str
    email: str
    role: UserRole
    location: Optional[str] = None

    model_config = {"from_attributes": True}


# ── Products ─────────────────────────────────────────────────────────────────

class ProductRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    description: Optional[str] = None
    category: ProductCategory
    price: Decimal = Field(..., gt=0, decimal_places=2)
    unit: str = Field(..., min_length=1, max_length=50)
    stock: int = Field(..., ge=0)
    imageKey: Optional[str] = None
    farmingMethod: Optional[str] = None
    location: Optional[str] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    category: ProductCategory
    price: Decimal
    unit: str
    stock: int
    imageKey: Optional[str] = None
    farmingMethod: Optional[str] = None
    location: Optional[str] = None
    createdAt: Optional[datetime] = None
    farmer: UserSummaryResponse

    model_config = {"from_attributes": True}


# ── Orders ───────────────────────────────────────────────────────────────────

class OrderItemRequest(BaseModel):
    productId: int
    quantity: int = Field(..., ge=1)


class CreateOrderRequest(BaseModel):
    items: List[OrderItemRequest] = Field(..., min_length=1)


class OrderItemResponse(BaseModel):
    productId: int
    productName: str
    quantity: int
    price: Decimal
    lineTotal: Decimal

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    status: OrderStatus
    totalAmount: Decimal
    createdAt: Optional[datetime] = None
    items: List[OrderItemResponse] = []

    model_config = {"from_attributes": True}


# ── Farmer Dashboard ─────────────────────────────────────────────────────────

class FarmerDashboardResponse(BaseModel):
    totalProducts: int
    activeProducts: int
    totalOrders: int
    salesTotal: Decimal

    model_config = {"from_attributes": True}


# ── Error ─────────────────────────────────────────────────────────────────────

class ErrorResponse(BaseModel):
    message: str
    status: int
