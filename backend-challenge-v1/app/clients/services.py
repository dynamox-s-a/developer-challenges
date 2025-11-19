from sqlalchemy.orm import Session
from app.clients.models import Client
from app.clients.schemas import ClientCreate

def create_client(db: Session, payload: ClientCreate):
    client = Client(**payload.model_dump())
    db.add(client)
    db.commit()
    db.refresh(client)
    return client

def get_clients(db: Session):
    return db.query(Client).all()

def get_client(db: Session, client_id: int):
    return db.query(Client).filter(Client.id == client_id).first()
