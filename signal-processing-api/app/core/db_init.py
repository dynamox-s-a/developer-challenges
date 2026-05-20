from app.core.database import engine, Base
from app.models.device import Device
from app.models.raw_data import RawData


def init_db():
    Base.metadata.create_all(bind=engine)
    print("Tabelas criadas com sucesso!")

if __name__ == "__main__":
    init_db()