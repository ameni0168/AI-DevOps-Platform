from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.user import UserResponse, UserCreate
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserResponse,
             status_code=status.HTTP_201_CREATED)
def create_user(data: UserCreate, db: Session = Depends(get_db)):
    return UserService.create_user(db, data)


@router.get("/count")
def count_users(db: Session = Depends(get_db)):
    total = UserService.count_users(db)
    return {
        "total_users": total,
        "message": "Database session is working"
    }


@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return UserService.get_users(db)