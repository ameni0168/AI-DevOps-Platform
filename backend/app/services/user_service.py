from app.repositories.user_repository import UserRepository
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserService:

    @staticmethod
    def get_users(db):
        return UserRepository.get_all(db)

    @staticmethod
    def count_users(db):
        return UserRepository.count(db)

    @staticmethod
    def create_user(db, data):
        user_data = data.model_dump()
        user_data["password_hash"] = pwd_context.hash(
            user_data.pop("password")
        )
        return UserRepository.create(db, user_data)