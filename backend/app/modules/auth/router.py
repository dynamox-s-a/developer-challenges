from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from app.core.database import get_session
from app.core.security import verify_password, create_access_token
from app.models import User
from .schemas import Token, UserCreate, UserRead
from app.core.security import get_password_hash

router = APIRouter()

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == form_data.username)).first()

    if not user or not verify_password(form_data.password, user.hash):
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos")

    token = create_access_token(data={"sub": user.email})
    return Token(access_token=token, token_type="bearer")

@router.post("/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def signup(user_in: UserCreate, session: Session = Depends(get_session)):
    user_exists = session.exec(select(User).where(User.email == user_in.email)).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="E-mail ja cadastrado")

    new_user = User(
        name=user_in.name,
        email=user_in.email,
        hash=get_password_hash(user_in.password)
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user