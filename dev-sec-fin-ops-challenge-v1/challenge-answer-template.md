# Dynamox Dev-Sec-Fin-Ops Developer Challenge Answer Template

The following is a template for your answer to [Dynamox Dev-Sec-Fin-Ops Developer Challenge](./README.md).

## Initial Setup

* [Git setup](https://git-scm.com/downloads)
* Editor setup ([Visual Studio Code](https://code.visualstudio.com/download) is a differentiator)

## Test's Setup

* Backend Deployment
  * [O.S. environment setup](services/backend-deployment/src/README.md)
  * [Docker environment setup](services/backend-deployment/README.md)
  * [Minikube environment setup](k8s/README.md)
  * [Cloud environment setup](infrastructure-as-code/production/README.md)
* Extractor Cronjob
  * [O.S. environment setup](services/backend-deployment/src/README.md)
  * [Docker environment setup](services/backend-deployment/README.md)
  * [Minikube environment setup](infrastructure-as-code/README.md)
  * [Cloud environment setup](infrastructure-as-code/production/README.md)

## Test's architectural diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Google Kubernetes Engine                    │
│                                                                   │
│  ┌──────────────────────────┐         ┌──────────────────────┐  │
│  │   Backend Deployment     │         │  Extractor CronJob   │  │
│  │                          │         │                      │  │
│  │  - Flask API (Python)    │         │  - Runs every 15min  │  │
│  │  - Port: 5000            │◄────────┤  - Pulls metrics     │  │
│  │  - Routes:               │         │  - Python + Requests │  │
│  │    /health (health check)│         │                      │  │
│  │    /metrics (data scrape)│         └──────────────────────┘  │
│  │    / (increment counter) │                                    │
│  └──────────────────────────┘                                    │
│                                                                   │
│  Storage: In-memory counter tracking successful requests         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

Data Flow:
1. Users call Backend Deployment API endpoint "/"
2. Backend increments successful_requests counter
3. Extractor CronJob runs on schedule (*/15 * * * *)
4. Cronjob fetches /metrics endpoint from Backend
5. Data is logged for analysis
```

## DevOps Brief Analysis

### Current Implementation
- **Containerization**: Both services are containerized using Docker
- **Orchestration**: Kubernetes (GKE) for production deployment
- **Infrastructure as Code**: Terraform modules for reproducible infrastructure
- **Configuration Management**: Environment variables for cross-environment configuration

### Key DevOps Features
1. **Health Checks**: Backend includes `/health` endpoint for Kubernetes liveness/readiness probes
2. **Logging**: Structured logging with timestamps and log levels for both services
3. **Cronjob Automation**: Automated extraction via Kubernetes CronJob scheduler
4. **Containerized Pipeline**: Docker images for both backend and extractor

### DevOps Recommendations for Future Implementation
1. **CI/CD Pipeline**: Implement automated testing and deployment (GitHub Actions, GitLab CI, or Cloud Build)
2. **Monitoring & Observability**: Add Prometheus metrics and Grafana dashboards
3. **Log Aggregation**: Implement ELK stack or Cloud Logging for centralized log management
4. **Blue-Green Deployments**: Implement zero-downtime deployments
5. **Infrastructure Versioning**: Version control for Terraform states with remote backend (GCS/S3)
6. **Secrets Management**: Use Google Secret Manager for sensitive data instead of environment variables
7. **GitOps**: Implement ArgoCD for declarative deployment management

## SecOps Brief Analysis

### Security Risks Identified

| Risk | Severity | Mitigation |
|------|----------|-----------|
| **Plain Text Environment Variables** | High | Use Google Secret Manager or Kubernetes Secrets for BACKEND_URL |
| **No Authentication/Authorization** | High | Implement API key or JWT authentication on /metrics and / endpoints |
| **Exposed Metrics Endpoint** | Medium | Restrict /metrics access to internal cluster only or use network policies |
| **No HTTPS/TLS** | High | Implement TLS termination with Ingress controller |
| **No Rate Limiting** | Medium | Implement rate limiting to prevent DDoS attacks |
| **Container Security** | Medium | Scan images with Container Analysis, use minimal base images |
| **No Network Policies** | Medium | Implement Kubernetes NetworkPolicies to restrict pod-to-pod communication |
| **Unvalidated Input** | Low | Add input validation and sanitization |

### Recommended Security Enhancements
1. Implement Kubernetes RBAC (Role-Based Access Control)
2. Use Pod Security Policies or Pod Security Standards
3. Enable GKE Security Best Practices:
   - Shielded nodes
   - Network policies enforcement
   - Binary Authorization
4. Regular vulnerability scanning of container images
5. Audit logging for all API calls
6. Implement secrets rotation policy

## FinOps Brief Analysis

### Cost Estimation for Production Configuration

**Specification:**
- Backend Deployment: 55 pods × n1-highcpu-4 (1250m CPU, 512Mi memory)
- Extractor Cronjob: 28 pods × n1-highmem-2 (0.5 CPU, 2Gi memory)

### 30-Day Cost Estimate

| Component | Unit Price | Quantity | Usage | Monthly Cost |
|-----------|-----------|----------|-------|--------------|
| **Backend - Compute** | $0.0951/hour | 55 pods | 720 hours | $3,766.68 |
| **Backend - Memory** | $0.0127/hour | 55 × 512Mi | 720 hours | $504.96 |
| **Extractor - Compute** | $0.0379/hour | 28 pods | 720 hours | $762.43 |
| **Extractor - Memory** | $0.0127/hour | 28 × 2Gi | 720 hours | $1,009.92 |
| **GKE Cluster Management** | $0.10/hour | 1 cluster | 720 hours | $72.00 |
| **Network Egress** | $0.12/GB | ~50GB | - | $6.00 |
| **Storage (logs/data)** | $0.020/GB | 100GB | - | $2.00 |
| | | | **TOTAL (30 days)** | **$6,123.99** |

### 365-Day Cost Estimate

| Component | 30-Day Cost | Annual Cost |
|-----------|-----------|------------|
| Compute & Memory | ~$6,044 | **$73,024** |
| GKE Management | $72 | **$864** |
| Network & Storage | $8 | **$96** |
| | | **TOTAL (365 days)** |
| | | **~$73,984** |

### Cost Optimization Recommendations
1. **Reduce Pod Count**: Scale down to production needs (current: 55 + 28 pods is high)
2. **Use Preemptible VMs**: 70% cost savings for non-critical workloads
3. **Implement Horizontal Pod Autoscaling (HPA)**: Scale based on actual demand
4. **Use Committed Use Discounts**: 30-37% savings for 1-3 year commitments
5. **Optimize Resource Requests**: Right-size CPU/memory allocations
6. **Use Managed Services**: Consider Cloud Run for cronjob (simpler, cheaper)
7. **Implement Pod Disruption Budgets**: Better resource utilization

## Future Implementations Plan

### Phase 1: Quality & Testing (Priority: High)
- [ ] Implement unit tests for backend Flask app (pytest)
- [ ] Implement integration tests for backend-cronjob communication
- [ ] Add E2E tests with Pytest
- [ ] Set up test coverage reporting (>80% target)

### Phase 2: Security (Priority: High)
- [ ] Migrate environment variables to Google Secret Manager
- [ ] Implement JWT authentication on API endpoints
- [ ] Add rate limiting and request validation
- [ ] Set up Kubernetes NetworkPolicies
- [ ] Enable Pod Security Standards

### Phase 3: Observability (Priority: Medium)
- [ ] Integrate Prometheus metrics collection
- [ ] Set up Grafana dashboards for monitoring
- [ ] Implement centralized logging (Google Cloud Logging)
- [ ] Add distributed tracing (Jaeger)
- [ ] Create alert policies for anomalies

### Phase 4: DevOps & Automation (Priority: Medium)
- [ ] Build CI/CD pipeline (GitHub Actions/Cloud Build)
- [ ] Implement automated infrastructure testing (Terratest)
- [ ] Set up automated rollouts with GitOps (ArgoCD)
- [ ] Implement Blue-Green deployment strategy
- [ ] Create disaster recovery playbooks

### Phase 5: Data Persistence (Priority: Medium)
- [ ] Implement PostgreSQL/MongoDB for request storage
- [ ] Add data retention policies
- [ ] Implement backup and recovery procedures
- [ ] Add data analytics pipeline

### Phase 6: Advanced Features (Priority: Low)
- [ ] Implement API versioning
- [ ] Add GraphQL endpoint alongside REST
- [ ] Implement request caching strategy
- [ ] Add webhook notifications for metrics thresholds
- [ ] Implement service mesh (Istio) for advanced traffic management
