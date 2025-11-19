from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.clients.schemas import ClientCreate, ClientResponse
from app.clients.services import create_client, get_clients, get_client
from app.core.auth import get_current_user
from app.core.database import get_db

router = APIRouter(prefix="/clients", tags=["Clients"], dependencies=[Depends(get_current_user)])

@router.post("/", response_model=ClientResponse, status_code=status.HTTP_200_OK)
def create_route(payload: ClientCreate, db: Session = Depends(get_db)):
    return create_client(db, payload)

@router.get("/", response_model=list[ClientResponse])
def get_clients_route(db: Session = Depends(get_db)):
    return get_clients(db)

@router.get("/{client_id}", response_model=ClientResponse)
def read_client_route(client_id: int, db: Session = Depends(get_db)):
    client = get_client(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client