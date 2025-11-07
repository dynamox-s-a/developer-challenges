from passlib.context import CryptContext
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from models.user import User
from pwdlib import PasswordHash
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
from typing import Union, Optional
from dependencies import get_session
from sqlalchemy.orm import Session
from fastapi import Depends
# load environment variables (don't import main — that caused a circular import)
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
# use getenv with a default string so int() always receives a valid value
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:

    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_hash.verify(plain_password, hashed_password)


def authenticate_user(email: str, password: str, session: Session):
    user = session.query(User).filter(User.email == email).first()
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


def create_token(id_user: int, expires_delta: Optional[Union[int, timedelta]] = None) -> str:

    if not SECRET_KEY:
        raise RuntimeError("SECRET_KEY environment variable is not set")

    now = datetime.now(timezone.utc)
    if expires_delta is None:
        expires_delta = ACCESS_TOKEN_EXPIRE_MINUTES

    if isinstance(expires_delta, timedelta):
        expire = now + expires_delta
    else:
        # treat as minutes
        expire = now + timedelta(minutes=int(expires_delta))

    to_encode = {"sub": str(id_user), "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
