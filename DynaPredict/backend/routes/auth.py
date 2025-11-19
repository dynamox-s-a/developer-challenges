from fastapi import APIRouter, Depends, HTTPException, status
from models.user import User
from dependencies import get_session, verify_token
from utils.security import hash_password, create_token, authenticate_user
from schemas import UserSchema
from sqlalchemy.orm import Session
from datetime import timedelta

auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/create-account", status_code=status.HTTP_201_CREATED)
async def create_account(user_schema: UserSchema, session: Session = Depends(get_session)):
    user = session.query(User).filter(User.email == user_schema.email).first()
    print(user)
    if user:
        # Usuário já existe
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email do usuário já existe.")
    else:
        # Cria novo usuário
        print("------------------------------------------\n" + user_schema.password)
        hashed_password = hash_password(user_schema.password)
        new_user = User(email=user_schema.email, password=hashed_password)
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return {"message": "Conta criada com sucesso."}


@auth_router.post("/login")
async def login(user_schema: UserSchema, session: Session = Depends(get_session)):
    user = authenticate_user(user_schema.email, user_schema.password, session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Usuário não encontrado ou credenciais inválidas")
    else:
        access_token = create_token(user.id)
        refresh_token = create_token(user.id, expires_delta=timedelta(days=7))

        return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@auth_router.get("/refresh-token")
async def refresh_token(user: User = Depends(verify_token)):
    access_token = create_token(user.id)
    return {"access_token": access_token, "token_type": "bearer"}
