import os
from jose import JWTError, jwt
from dotenv import load_dotenv
from models.base import db
from sqlalchemy.orm import sessionmaker, Session
from models.user import User
from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")


def get_session():
    try:
        session = sessionmaker(bind=db)
        session = session()
        yield session
    finally:
        session.close()


def verify_token(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    print(token)
    if not SECRET_KEY:
        raise RuntimeError("SECRET_KEY environment variable is not set")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Acesso não autorizado, verifique a validade do token")

    user = session.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Acesso inválido")
    return user
