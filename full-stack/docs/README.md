# Project Documentation

This folder contains detailed documentation of all system aspects.

## Available Guides

### [dependencies.md](./dependencies.md)
Complete installation and dependency configuration guide:
- Node.js, pnpm, Docker, Git
- Automatic script verification
- Instructions for macOS, Linux and Windows
- Common troubleshooting

### [docker-containers.md](./docker-containers.md)
Complete Docker architecture documentation:
- Container configuration (PostgreSQL, Backend, Frontend)
- Volumes, networking and security
- Build optimization and production ready
- Backup, monitoring and troubleshooting

### [database.md](./database.md)
Complete database specification:
- PostgreSQL schema with all tables
- Performance indexes and optimizations
- Migrations, seeds and versioning
- Backup, recovery and maintenance

### [features.md](./features.md)
Detailed description of all functionalities:
- Authentication and authorization
- Machine and sensor management
- Time series and visualization
- Performance, security and roadmap

## How to Use

### For Developers
1. Read **dependencies.md** to set up the environment
2. Check **docker-containers.md** to understand the architecture
3. Reference **features.md** to implement new features

### For DevOps/SRE
1. **docker-containers.md** - Deploy and monitoring
2. **database.md** - Backup and maintenance

### For QA
1. **features.md** - Features to validate

## Quick Navigation

| Need... | Documentation | Main Section |
|---------|---------------|--------------|
| Setup environment | `dependencies.md` | Installation |
| Understand containers | `docker-containers.md` | Architecture |
| Database | `database.md` | Schema |
| Features | `features.md` | Features |

**To get started**: Go back to the main README and run `./scripts/check-deps.sh`
