from sqlalchemy.orm import Session
from app.clients.models import Client
from app.clients.schemas import ClientCreate
from fastapi import HTTPException

def create_client(db: Session, payload: ClientCreate):
    verifyClient = db.query(Client).filter(Client.email == payload.email).first()
    if verifyClient:
        raise HTTPException(
            status_code=400,
            detail="A client with this email already exists."
        )

    client = Client(**payload.model_dump())
    db.add(client)
    db.commit()
    db.refresh(client)
    return client

def get_clients(db: Session):
    return db.query(Client).all()

def get_client(db: Session, client_id: int):
    return db.query(Client).filter(Client.id == client_id).first()
