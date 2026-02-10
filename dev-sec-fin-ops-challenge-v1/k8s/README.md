# Minikube Environment Setup Guide

This document provides technical instructions for deploying the Backend and Extractor services to a local Minikube Kubernetes cluster.

## Prerequisites

Before starting, ensure you have the following installed:

- **Docker**: [Install Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Minikube**: [Install Minikube](https://minikube.sigs.k8s.io/docs/start/)
- **kubectl**: [Install kubectl](https://kubernetes.io/docs/tasks/tools/) (usually included with Docker Desktop)
- **At least 4GB RAM**: Minikube requires sufficient memory
- **20GB Disk Space**: For container images and cluster data

### Verify Installations

```bash
# Check Docker
docker --version

# Check Minikube
minikube version

# Check kubectl
kubectl version --client
```

## Minikube Cluster Setup

### 1. Start Minikube Cluster

```bash
# Start Minikube with sufficient resources
minikube start --cpus=4 --memory=4096 --disk-size=20gb

# Alternative: Specify a different driver
minikube start --driver=docker --cpus=4 --memory=4096

# For Windows with Hyper-V
minikube start --driver=hyperv --cpus=4 --memory=4096
```

**Expected output:**
```
Kubernetes 1.27.3 on Docker 24.0.4
Starting control-plane node minikube in cluster minikube
...
Done! kubectl is now configured to use "minikube".
```

### 2. Verify Cluster Status

```bash
# Check cluster status
minikube status

# Verify kubectl can access the cluster
kubectl cluster-info

# View cluster nodes
kubectl get nodes
```

### 3. Configure Docker to Use Minikube's Docker Daemon

This step is **crucial** to build images directly in Minikube:

```bash
# PowerShell
minikube docker-env | Invoke-Expression

# Bash (Linux/macOS)
eval $(minikube docker-env)
```

This configures Docker to push images directly to Minikube instead of your local Docker daemon.

## Building and Deploying Services

### Step 1: Build Docker Images in Minikube

Navigate to the project root and build images:

```bash
# Build Backend image
docker build -t dev-sec-fin-ops-challenge-v1-backend:latest -f backend-deployment/Dockerfile backend-deployment/

# Build Extractor image
docker build -t dev-sec-fin-ops-challenge-v1-extractor:latest -f extractor-cronjob/Dockerfile extractor-cronjob/
```

**Verify images are in Minikube:**

```bash
minikube image ls | grep dev-sec-fin-ops
```

### Step 2: Deploy Backend Service

Apply the Backend deployment and service:

```bash
kubectl apply -f k8s/backend.yaml
```

**Verify deployment:**

```bash
# Check deployment status
kubectl get deployments

# View pods
kubectl get pods

# Check service
kubectl get svc

# View pod logs
kubectl logs -f deployment/backend
```

Expected output:
```
NAME                 READY   STATUS    RESTARTS   AGE
backend              1/1     Running   0          10s
```

### Step 3: Deploy Extractor CronJob

Apply the Extractor CronJob:

```bash
kubectl apply -f k8s/cronjob.yaml
```

**Verify CronJob:**

```bash
# Check cronjob status
kubectl get cronjob

# View cronjob details
kubectl describe cronjob extractor-cronjob

# Check cronjob logs (will appear after first execution)
kubectl logs -f job/extractor-cronjob-<timestamp>
```

Expected output:
```
NAME                   SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
extractor-cronjob      */15 * * * *   False     0        <none>          10s
```

## Accessing Services

### Port Forwarding to Backend

Access the Backend API from your local machine:

```bash
# Forward port 5000 to your local machine
kubectl port-forward svc/backend 5000:5000
```

In another terminal, test the API:

```bash
# Test home endpoint
curl http://localhost:5000/

# Test metrics endpoint
curl http://localhost:5000/metrics

# Test health check
curl http://localhost:5000/health
```

### Direct Pod Access

Access pods directly using port forwarding:

```bash
# Forward to a specific pod
kubectl port-forward pod/backend-<pod-id> 5000:5000

# List pods to find the full pod ID
kubectl get pods
```

### Using Minikube Service

Open Backend in default browser:

```bash
minikube service backend
```

## Monitoring and Debugging

### View Logs

```bash
# View Backend logs
kubectl logs deployment/backend

# View CronJob job logs (after execution)
kubectl logs -l job-name=<job-name>

# Follow logs in real-time
kubectl logs -f deployment/backend

# View previous logs (if pod restarted)
kubectl logs deployment/backend --previous
```

### Describe Resources

```bash
# Get detailed info about deployment
kubectl describe deployment backend

# Get detailed info about service
kubectl describe svc backend

# Get detailed info about cronjob
kubectl describe cronjob extractor-cronjob

# Get detailed info about a pod
kubectl describe pod <pod-name>
```

### Check Pod Events

```bash
# View events in default namespace
kubectl get events

# Watch events in real-time
kubectl get events --watch
```

### Exec into Pod (Debug)

```bash
# Open shell in backend pod
kubectl exec -it deployment/backend -- /bin/bash

# Run a command in pod
kubectl exec deployment/backend -- curl http://localhost:5000/metrics

# List files in pod
kubectl exec deployment/backend -- ls -la /src
```

## Verifying the Deployment

### 1. Check All Resources

```bash
# List all resources
kubectl get all

# Get more details
kubectl get all -o wide
```

### 2. Test Backend Connectivity

```bash
# From your local machine (with port-forward active)
curl http://localhost:5000/metrics

# Response should show:
# {"successful_requests": 0}
```

### 3. Make Requests to Backend

```bash
# Increment counter
for i in {1..5}; do curl http://localhost:5000/; done

# Check metrics
curl http://localhost:5000/metrics

# Should show: {"successful_requests": 5}
```

### 4. Monitor CronJob Execution

The CronJob runs every 15 minutes by default. To verify it's working:

```bash
# Wait 15 minutes, then check for completed jobs
kubectl get jobs

# View CronJob execution history
kubectl get jobs -l job-name=extractor-cronjob

# Check the logs
kubectl logs job/extractor-cronjob-<timestamp>
```

## Useful kubectl Commands

### Namespace Management

```bash
# Create namespace
kubectl create namespace dev

# Deploy to specific namespace
kubectl apply -f k8s/backend.yaml -n dev

# View all namespaces
kubectl get namespaces
```

### Pod Management

```bash
# List all pods
kubectl get pods

# List pods with more info
kubectl get pods -o wide

# Watch pods
kubectl get pods --watch

# Delete pod (will be recreated by deployment)
kubectl delete pod <pod-name>

# Delete all pods in namespace
kubectl delete pods --all
```

### Deployment Management

```bash
# Scale deployment
kubectl scale deployment backend --replicas=3

# Update image
kubectl set image deployment/backend backend=dev-sec-fin-ops-challenge-v1-backend:v2

# Rollout status
kubectl rollout status deployment/backend

# Rollout history
kubectl rollout history deployment/backend

# Rollback to previous version
kubectl rollout undo deployment/backend
```

### CronJob Management

```bash
# Trigger CronJob manually (if you don't want to wait 15 minutes)
kubectl create job --from=cronjob/extractor-cronjob manual-extractor-run

# Check manual job
kubectl get jobs

# View manual job logs
kubectl logs job/manual-extractor-run
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| **Pod stays in Pending** | Insufficient resources | Increase Minikube resources: `minikube start --cpus=4 --memory=4096` |
| **ImagePullBackOff** | Image not in Minikube | Run `eval $(minikube docker-env)` and rebuild images |
| **CrashLoopBackOff** | Application error | Check logs: `kubectl logs <pod-name>` |
| **Connection refused** | Service not accessible | Ensure port-forward is running: `kubectl port-forward svc/backend 5000:5000` |
| **Backend not found in CronJob** | DNS issue | Verify service exists: `kubectl get svc backend` |
| **No logs from CronJob** | Job not executed yet | Wait 15 minutes or manually trigger: `kubectl create job --from=cronjob/extractor-cronjob test-run` |
| **Minikube not starting** | Resource constraints | Close other applications or increase Docker memory allocation |

### Debug Commands

```bash
# Check resource usage
kubectl top nodes
kubectl top pods

# Describe events for troubleshooting
kubectl describe pod <pod-name>

# Get resource YAML
kubectl get deployment backend -o yaml

# Check service endpoints
kubectl get endpoints

# DNS test (from pod)
kubectl exec deployment/backend -- nslookup backend

# Check persistent volumes
kubectl get pv
kubectl get pvc
```

## Managing Minikube

### Stop/Start Cluster

```bash
# Stop Minikube
minikube stop

# Start Minikube
minikube start

# Delete Minikube cluster
minikube delete
```

### Access Minikube Dashboard

```bash
# Open Kubernetes Dashboard
minikube dashboard

# This opens a web UI showing all resources
```

### SSH into Minikube

```bash
# Access Minikube VM
minikube ssh

# Inside Minikube, you can inspect Docker
docker ps
docker logs <container-id>
```

### Configure Minikube Resources

```bash
# Check current configuration
minikube config view

# Change memory allocation
minikube config set memory 8192

# Change CPU allocation
minikube config set cpus 4
```

## Advanced: Custom Minikube Configuration

### Create Multiple Replicas

Modify `k8s/backend.yaml` to increase replicas:

```yaml
spec:
  replicas: 3  # Change from 1 to 3
```

Apply the change:

```bash
kubectl apply -f k8s/backend.yaml

# Verify
kubectl get pods
kubectl get svc
```

### Add Resource Limits

The YAML files already include resource requests and limits. To modify:

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "500m"
  limits:
    memory: "512Mi"
    cpu: "1000m"
```

### Change CronJob Schedule

Modify the schedule in `k8s/cronjob.yaml`:

```yaml
schedule: "*/5 * * * *"  # Every 5 minutes instead of 15
```

## Best Practices

1. **Always use port-forward for testing**: Minikube services are not exposed by default
2. **Monitor resource usage**: Use `kubectl top` to prevent resource exhaustion
3. **Use namespaces**: Organize different environments (dev, test, staging)
4. **Tag images with versions**: Avoid using `latest` tag in production-like setups
5. **Check logs frequently**: Logs are your best debugging tool
6. **Save configurations**: Keep YAML files versioned in git
7. **Use resource limits**: Prevent pods from consuming all cluster resources
8. **Test scale-up**: Try scaling deployments before production

## Next Steps

- Deploy to Google Cloud: See `../infrastructure-as-code/production/`
- Learn more about Kubernetes: [Kubernetes Documentation](https://kubernetes.io/docs/)
- Monitor with Prometheus: [Prometheus Kubernetes Plugin](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#kubernetes_sd_config)
- Use Helm charts: [Helm Documentation](https://helm.sh/docs/)

## Additional Resources

- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
- [CronJob Documentation](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/)
