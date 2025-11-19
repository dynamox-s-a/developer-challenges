from app.core.database import Base, engine
from app.devices.models import Device
from app.series.models import TimeSeries
from app.clients.models import Client
from app.users.models import User

print("🔧 Creating tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully!")
