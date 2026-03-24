# Database Schema and Management

## Overview

This document describes the complete database architecture for the Dynamox Full-Stack application, including schema design, relationships, indexes, migrations, and maintenance procedures.

---

## Database Architecture

### Technology Stack
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Migration Tool**: Prisma Migrate
- **Seeding**: Prisma Seed
- **Connection Pooling**: Built-in Prisma pooling

### Design Principles
- **Normalization**: 3NF compliance
- **Data Integrity**: Foreign key constraints
- **Performance**: Optimized indexes
- **Scalability**: Time-series data partitioning
- **Security**: Row-level security policies

---

## Schema Design

### Entity Relationship Diagram

```
┌─────────────────┐    ┌──────────────────────┐    ┌─────────────────┐
│     Users       │    │   MonitoringPoints   │    │  TimeSeries    │
├─────────────────┤    ├──────────────────────┤    ├─────────────────┤
│ id (PK)        │    │ id (PK)            │    │ id (PK)        │
│ username        │    │ name                │    │ value          │
│ passwordHash    │    │ machineId (FK)       │    │ timestamp      │
│ createdAt       │    │ sensorType          │    │ monitoringPoint│
│ updatedAt       │    │ createdAt           │    │ (FK)          │
└─────────────────┘    │ updatedAt           │    └─────────────────┘
                       └──────────────────────┘
                                │
                                │
                       ┌──────────────────────┐
                       │      Machines       │
                       ├──────────────────────┤
                       │ id (PK)            │
                       │ name                │
                       │ type                │
                       │ createdAt           │
                       │ updatedAt           │
                       └──────────────────────┘
                                │
                                │
                       ┌──────────────────────┐
                       │ MonitoringPoints     │
                       │ machineId (FK)──────┘
                       └──────────────────────┘
```

### Table Definitions

#### 1. Users Table

**Purpose**: Authentication and user management

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE UNIQUE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Fields Description**:
- \`id\`: Auto-incrementing primary key
- \`username\`: Unique user identifier for login
- \`password_hash\`: Bcrypt-hashed password (60 chars)
- \`created_at\`: Account creation timestamp
- \`updated_at\`: Last modification timestamp

#### 2. Machines Table

**Purpose**: Industrial machine definitions

```sql
CREATE TABLE machines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Pump', 'Fan')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_machines_name ON machines(name);
CREATE INDEX idx_machines_type ON machines(type);
CREATE INDEX idx_machines_created_at ON machines(created_at);
```

**Fields Description**:
- \`id\`: Auto-incrementing primary key
- \`name\`: Human-readable machine identifier
- \`type\`: Machine type (Pump or Fan) with validation
- \`created_at\`: Machine registration timestamp
- \`updated_at\`: Last modification timestamp

#### 3. MonitoringPoints Table

**Purpose**: Sensor monitoring point definitions

```sql
CREATE TABLE monitoring_points (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    machine_id INTEGER NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    sensor_type VARCHAR(50) NOT NULL CHECK (sensor_type IN ('pressure', 'vibration')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_monitoring_points_name ON monitoring_points(name);
CREATE INDEX idx_monitoring_points_machine_id ON monitoring_points(machine_id);
CREATE INDEX idx_monitoring_points_sensor_type ON monitoring_points(sensor_type);
CREATE INDEX idx_monitoring_points_created_at ON monitoring_points(created_at);
```

**Fields Description**:
- \`id\`: Auto-incrementing primary key
- \`name\`: Human-readable monitoring point identifier
- \`machine_id\`: Foreign key to machines table
- \`sensor_type\`: Type of sensor (pressure or vibration)
- \`created_at\`: Monitoring point creation timestamp
- \`updated_at\`: Last modification timestamp

#### 4. TimeSeries Table

**Purpose**: Time-series sensor data storage

```sql
CREATE TABLE time_series (
    id BIGSERIAL PRIMARY KEY,
    value DECIMAL(10,3) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    monitoring_point_id INTEGER NOT NULL REFERENCES monitoring_points(id) ON DELETE CASCADE
);

-- Indexes for time-series performance
CREATE INDEX idx_time_series_timestamp ON time_series(timestamp);
CREATE INDEX idx_time_series_monitoring_point_id ON time_series(monitoring_point_id);
CREATE INDEX idx_time_series_point_timestamp ON time_series(monitoring_point_id, timestamp);

-- Partitioning for large datasets (optional for production)
CREATE TABLE time_series_y2024m01 PARTITION OF time_series
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

**Fields Description**:
- \`id\`: Auto-incrementing primary key (BIGSERIAL for large datasets)
- \`value\`: Sensor reading value with 3 decimal places
- \`timestamp\`: Measurement timestamp
- \`monitoring_point_id\`: Foreign key to monitoring_points table

---

## Data Relationships

### One-to-Many Relationships

#### Machine to Monitoring Points
```sql
-- One machine can have multiple monitoring points
-- Each monitoring point belongs to exactly one machine
ALTER TABLE monitoring_points 
ADD CONSTRAINT fk_monitoring_points_machine 
FOREIGN KEY (machine_id) REFERENCES machines(id) ON DELETE CASCADE;
```

#### Monitoring Point to Time Series
```sql
-- One monitoring point can have multiple time-series readings
-- Each time-series reading belongs to exactly one monitoring point
ALTER TABLE time_series 
ADD CONSTRAINT fk_time_series_monitoring_point 
FOREIGN KEY (monitoring_point_id) REFERENCES monitoring_points(id) ON DELETE CASCADE;
```

### Data Integrity Constraints

#### Business Rule Validation
```sql
-- Machine type validation
ALTER TABLE machines 
ADD CONSTRAINT chk_machine_type 
CHECK (type IN ('Pump', 'Fan'));

-- Sensor type validation
ALTER TABLE monitoring_points 
ADD CONSTRAINT chk_sensor_type 
CHECK (sensor_type IN ('pressure', 'vibration'));

-- Sensor type compatibility with machine type
-- (This would be implemented at application level or with triggers)
```

---

## Indexing Strategy

### Primary Indexes
```sql
-- Unique constraints
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- Foreign key indexes
CREATE INDEX idx_monitoring_points_machine_id ON monitoring_points(machine_id);
CREATE INDEX idx_time_series_monitoring_point_id ON time_series(monitoring_point_id);
```

### Performance Indexes
```sql
-- Query optimization indexes
CREATE INDEX idx_machines_name ON machines(name);
CREATE INDEX idx_machines_type ON machines(type);
CREATE INDEX idx_monitoring_points_name ON monitoring_points(name);
CREATE INDEX idx_monitoring_points_sensor_type ON monitoring_points(sensor_type);
```

### Time-Series Optimization
```sql
-- Composite index for time-series queries
CREATE INDEX idx_time_series_point_timestamp ON time_series(monitoring_point_id, timestamp DESC);

-- Partial index for recent data
CREATE INDEX idx_time_series_recent ON time_series(timestamp DESC) 
WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL '30 days';
```

---

## Prisma Schema

### Schema Definition
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           Int      @id @default(autoincrement())
  username     String   @unique @db.VarChar(255)
  passwordHash String   @map("password_hash") @db.VarChar(255)
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("users")
}

model Machine {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(255)
  type      MachineType
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  monitoringPoints MonitoringPoint[]

  @@map("machines")
}

model MonitoringPoint {
  id         Int          @id @default(autoincrement())
  name       String       @db.VarChar(255)
  machineId  Int          @map("machine_id")
  sensorType SensorType   @map("sensor_type")
  createdAt  DateTime     @default(now()) @map("created_at")
  updatedAt  DateTime     @updatedAt @map("updated_at")

  machine     Machine      @relation(fields: [machineId], references: [id], onDelete: Cascade)
  timeSeries  TimeSeries[]

  @@map("monitoring_points")
}

model TimeSeries {
  id               BigInt      @id @default(autoincrement())
  value            Decimal     @db.Decimal(10, 3)
  timestamp        DateTime    @default(now())
  monitoringPointId Int         @map("monitoring_point_id")

  monitoringPoint  MonitoringPoint @relation(fields: [monitoringPointId], references: [id], onDelete: Cascade)

  @@map("time_series")
}

enum MachineType {
  Pump
  Fan
}

enum SensorType {
  pressure
  vibration
}
```

### Generated SQL
```sql
-- Prisma generates optimized SQL with proper indexes and constraints
-- Example: Create machines table
CREATE TABLE "machines" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "MachineType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "machines_pkey" PRIMARY KEY ("id")
);

-- Create index for machine name
CREATE INDEX "machines_name_idx" ON "machines"("name");
```

---

## Migrations

### Migration Files Structure
```
prisma/
├── migrations/
│   ├── 20240101000000_init/
│   │   └── migration.sql
│   ├── 20240102000000_add_indexes/
│   │   └── migration.sql
│   └── migration_lock.toml
├── schema.prisma
└── migrations.sql
```

### Creating Migrations
```bash
# Create new migration
npx prisma migrate dev --name add_new_field

# Generate migration SQL
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > init.sql
```

### Migration Examples

#### Initial Migration
```sql
-- 20240101000000_init/migration.sql
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "machines" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "MachineType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "machines_pkey" PRIMARY KEY ("id")
);

-- ... other tables
```

#### Add Indexes Migration
```sql
-- 20240102000000_add_indexes/migration.sql
CREATE INDEX "machines_name_idx" ON "machines"("name");
CREATE INDEX "machines_type_idx" ON "machines"("type");
CREATE INDEX "monitoring_points_machine_id_idx" ON "monitoring_points"("machine_id");
CREATE INDEX "time_series_timestamp_idx" ON "time_series"("timestamp" DESC);
```

### Running Migrations
```bash
# Development migration
npx prisma migrate dev

# Production migration
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

---

## Seeding

### Seed File Structure
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin', 10);
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: hashedPassword,
    },
  });

  // Create sample machines
  const pumpMachine = await prisma.machine.create({
    data: {
      name: 'Main Water Pump',
      type: 'Pump',
    },
  });

  const fanMachine = await prisma.machine.create({
    data: {
      name: 'Cooling Fan Unit',
      type: 'Fan',
    },
  });

  // Create monitoring points
  await prisma.monitoringPoint.createMany({
    data: [
      {
        name: 'Pump Pressure Sensor',
        machineId: pumpMachine.id,
        sensorType: 'pressure',
      },
      {
        name: 'Pump Vibration Sensor',
        machineId: pumpMachine.id,
        sensorType: 'vibration',
      },
      {
        name: 'Fan Vibration Sensor',
        machineId: fanMachine.id,
        sensorType: 'vibration',
      },
    ],
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Running Seeds
```bash
# Run seed script
npx prisma db seed

# Seed after migration
npx prisma migrate dev && npx prisma db seed
```

---

## Performance Optimization

### Query Optimization

#### Time-Series Queries
```sql
-- Efficient time-series data retrieval
SELECT 
    ts.id,
    ts.value,
    ts.timestamp,
    mp.name as monitoring_point_name,
    m.name as machine_name
FROM time_series ts
JOIN monitoring_points mp ON ts.monitoring_point_id = mp.id
JOIN machines m ON mp.machine_id = m.id
WHERE ts.timestamp >= '2024-01-01'
  AND ts.timestamp < '2024-01-02'
  AND mp.id = $1
ORDER BY ts.timestamp DESC
LIMIT 1000;

-- Using composite index efficiently
EXPLAIN ANALYZE
SELECT * FROM time_series 
WHERE monitoring_point_id = 1 
  AND timestamp >= '2024-01-01'
ORDER BY timestamp DESC;
```

#### Aggregation Queries
```sql
-- Calculate metrics efficiently
SELECT 
    COUNT(*) as count,
    MIN(value) as min_value,
    MAX(value) as max_value,
    AVG(value) as avg_value
FROM time_series 
WHERE monitoring_point_id = $1
  AND timestamp >= $2
  AND timestamp < $3;
```

### Index Maintenance
```sql
-- Analyze table statistics
ANALYZE time_series;
ANALYZE monitoring_points;
ANALYZE machines;

-- Rebuild fragmented indexes
REINDEX INDEX CONCURRENTLY idx_time_series_timestamp;
REINDEX INDEX CONCURRENTLY idx_time_series_point_timestamp;
```

### Partitioning Strategy
```sql
-- Monthly partitioning for time-series
CREATE TABLE time_series (
    id BIGSERIAL,
    value DECIMAL(10,3) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    monitoring_point_id INTEGER NOT NULL,
    PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

-- Create partitions
CREATE TABLE time_series_2024_01 PARTITION OF time_series
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE time_series_2024_02 PARTITION OF time_series
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Automatic partition creation (requires trigger or scheduled job)
```

---

## Backup and Recovery

### Backup Strategies

#### Full Database Backup
```bash
#!/bin/bash
# backup-full.sh

BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/full_backup_$DATE.sql"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Perform backup
docker exec dynamox-postgres pg_dump \
  -h localhost \
  -U dynamox \
  -d dynamox \
  --verbose \
  --clean \
  --no-owner \
  --no-privileges \
  > "$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_FILE"

echo "Full backup completed: $BACKUP_FILE.gz"
```

#### Incremental Backup
```bash
#!/bin/bash
# backup-incremental.sh

BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
WAL_DIR="$BACKUP_DIR/wal"

# Enable WAL archiving
docker exec dynamox-postgres psql -U dynamox -d dynamox -c "
  ALTER SYSTEM SET archive_mode = 'on';
  ALTER SYSTEM SET archive_command = 'cp %p /var/lib/postgresql/wal/%f';
  SELECT pg_reload_conf();
"

# Create WAL directory
mkdir -p "$WAL_DIR"

echo "Incremental backup enabled"
```

### Recovery Procedures

#### Full Recovery
```bash
#!/bin/bash
# restore-full.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

# Stop application
docker compose stop backend frontend

# Restore database
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -c "$BACKUP_FILE" | docker exec -i dynamox-postgres psql -U dynamox -d dynamox
else
    docker exec -i dynamox-postgres psql -U dynamox -d dynamox < "$BACKUP_FILE"
fi

# Restart application
docker compose start backend frontend

echo "Database restored from: $BACKUP_FILE"
```

---

## Monitoring and Maintenance

### Health Checks

#### Database Health
```sql
-- Check database connectivity
SELECT 1 as health_check;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Maintenance Tasks

#### Regular Maintenance
```bash
#!/bin/bash
# maintenance.sh

# Update statistics
docker exec dynamox-postgres psql -U dynamox -d dynamox -c "ANALYZE;"

# Rebuild indexes
docker exec dynamox-postgres psql -U dynamox -d dynamox -c "
  REINDEX DATABASE dynamox;
"

# Clean up old data (optional)
docker exec dynamox-postgres psql -U dynamox -d dynamox -c "
  DELETE FROM time_series 
  WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '1 year';
"

# Vacuum database
docker exec dynamox-postgres psql -U dynamox -d dynamox -c "VACUUM ANALYZE;"

echo "Database maintenance completed"
```

---

## Security

### Access Control

#### User Permissions
```sql
-- Create read-only user
CREATE USER readonly_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE dynamox TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;

-- Create application user
CREATE USER app_user WITH PASSWORD 'app_password';
GRANT CONNECT ON DATABASE dynamox TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_user;
```

---

## Troubleshooting

### Common Issues

#### Connection Problems
```bash
# Check database status
docker exec dynamox-postgres pg_isready -U dynamox

# Check logs
docker logs dynamox-postgres

# Test connection from backend container
docker exec dynamox-backend psql -h postgres -U dynamox -d dynamox -c "SELECT 1;"
```

### Debug Commands

#### Database Inspection
```bash
# Connect to database
docker exec -it dynamox-postgres psql -U dynamox -d dynamox

# List all tables
\dt

-- Describe table structure
\d machines

-- Show indexes
\di machines

-- Show constraints
\dr machines
```

**For more information**: Check Prisma documentation and PostgreSQL best practices.
