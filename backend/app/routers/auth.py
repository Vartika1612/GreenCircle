"""
routers/auth.py

POST /api/auth/register  → 201 AuthResponse
POST /api/auth/login     → 200 AuthResponse
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import create_access_token, hash_password, verify_password
from app.database import get_db
from app.models import User
from app.schemas import AuthResponse, LoginRequest, RegisterRequest

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _build_auth_response(token: str, user: User) -> AuthResponse:
    return AuthResponse(
        token=token,
        userId=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        location=user.location,
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user (CUSTOMER or FARMER)."""
    if db.query(User).filter(User.email == payload.email.lower()).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email already registered: {payload.email}",
        )

    user = User(
        name=payload.name,
        email=payload.email.lower(),
        password=hash_password(payload.password),
        role=payload.role,
        location=payload.location,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.email)
    return _build_auth_response(token, user)


@router.post("/login", response_model=AuthResponse, status_code=status.HTTP_200_OK)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate with email + password and receive a JWT."""
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_access_token(user.email)
    return _build_auth_response(token, user)
