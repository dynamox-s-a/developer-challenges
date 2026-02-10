# Infrastructure as Code (IaC) - Terraform Deployment Guide

This document provides technical instructions for deploying the Backend and Extractor services to Google Cloud Platform (GCP) using Terraform and Google Kubernetes Engine (GKE).

## Directory Structure

```
infrastructure-as-code/
├── modules/              # Reusable Terraform modules
│   ├── backend/         # Backend deployment module
│   ├── extractor/       # Extractor CronJob module
│   ├── gke/             # Google Kubernetes Engine cluster module
│   └── network/         # VPC and networking module
├── production/          # Production environment configuration
├── PROVISIONING.md      # Detailed provisioning steps
└── README.md           # This file
```

## Prerequisites

Before starting, ensure you have the following installed and configured:

### Required Tools

- **Terraform**: [Install Terraform](https://www.terraform.io/downloads.html) (v1.0+)
- **Google Cloud SDK**: [Install gcloud CLI](https://cloud.google.com/sdk/docs/install)
- **kubectl**: [Install kubectl](https://kubernetes.io/docs/tasks/tools/)
- **Docker**: [Install Docker](https://www.docker.com/products/docker-desktop)

### GCP Account Setup

1. **Create a GCP Project**
   ```bash
   gcloud projects create devops-challenge --name="DevOps Challenge"
   ```

2. **Set Project ID**
   ```bash
   export PROJECT_ID=$(gcloud config get-value project)
   echo $PROJECT_ID
   ```

3. **Enable Required APIs**
   ```bash
   gcloud services enable compute.googleapis.com
   gcloud services enable container.googleapis.com
   gcloud services enable cloudresourcemanager.googleapis.com
   ```

4. **Create Service Account**
   ```bash
   gcloud iam service-accounts create terraform-sa \
     --display-name="Terraform Service Account"
   
   # Grant necessary permissions
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:terraform-sa@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/container.admin"
   
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:terraform-sa@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/compute.admin"
   
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:terraform-sa@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/iam.serviceAccountUser"
   ```

5. **Create and Download Service Account Key**
   ```bash
   gcloud iam service-accounts keys create terraform-key.json \
     --iam-account=terraform-sa@$PROJECT_ID.iam.gserviceaccount.com
   ```

6. **Set Authentication**
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=$(pwd)/terraform-key.json
   ```

## Building and Pushing Docker Images to Container Registry

### 1. Enable Container Registry

```bash
gcloud services enable artifactregistry.googleapis.com
```

### 2. Build Images Locally

Navigate to the project root:

```bash
cd path/to/dev-sec-fin-ops-challenge-v1
```

Build Backend image:

```bash
docker build -t backend:latest -f backend-deployment/Dockerfile backend-deployment/
```

Build Extractor image:

```bash
docker build -t extractor:latest -f extractor-cronjob/Dockerfile extractor-cronjob/
```

### 3. Push Images to GCP Container Registry

**Configure Docker authentication:**

```bash
gcloud auth configure-docker
```

**Push Backend image:**

```bash
docker tag backend:latest gcr.io/$PROJECT_ID/backend:latest
docker push gcr.io/$PROJECT_ID/backend:latest
```

**Push Extractor image:**

```bash
docker tag extractor:latest gcr.io/$PROJECT_ID/extractor:latest
docker push gcr.io/$PROJECT_ID/extractor:latest
```

**Verify images:**

```bash
gcloud container images list --project=$PROJECT_ID
```

## Terraform Deployment

### Step 1: Configure Terraform Variables

Navigate to the production environment:

```bash
cd infrastructure-as-code/production
```

Create `terraform.tfvars`:

```hcl
# terraform.tfvars
region             = "us-central1"          # Change to your preferred region
project_id        = "your-project-id"      # Your GCP project ID
backend_image     = "gcr.io/your-project-id/backend:latest"
extractor_image   = "gcr.io/your-project-id/extractor:latest"
cluster_name      = "challenge-cluster"
vpc_name          = "devops-challenge-vpc"
```

**Available GCP Regions:**
- us-central1 (Iowa)
- us-east1 (South Carolina)
- us-west1 (Oregon)
- europe-west1 (Belgium)
- asia-east1 (Taiwan)

### Step 2: Initialize Terraform

Initialize the Terraform working directory:

```bash
terraform init
```

Expected output:
```
Terraform has been successfully configured!
```

### Step 3: Plan Deployment

Generate an execution plan to preview changes:

```bash
terraform plan -out=tfplan
```

Review the output to ensure resources will be created as expected:
- VPC and subnet
- GKE cluster
- Kubernetes deployments
- Services and CronJobs

### Step 4: Apply Terraform Configuration

Deploy the infrastructure:

```bash
terraform apply tfplan
```

This will:
1. Create a VPC network and subnet
2. Provision a GKE Autopilot cluster
3. Deploy the Backend service
4. Deploy the Extractor CronJob
5. Configure load balancing and networking

**Expected output (will take 5-10 minutes):**
```
Apply complete! Resources: X added, 0 changed, 0 destroyed.

Outputs:
cluster_name = "challenge-cluster"
...
```

### Step 5: Configure kubectl

Get GKE cluster credentials:

```bash
gcloud container clusters get-credentials challenge-cluster \
  --region=us-central1 \
  --project=$PROJECT_ID
```

Verify connection:

```bash
kubectl cluster-info
kubectl get nodes
```

## Accessing Deployed Services

### Port Forwarding to Backend

Forward the Backend service to your local machine:

```bash
kubectl port-forward svc/backend 5000:80
```

Test the API:

```bash
# Test home endpoint
curl http://localhost:5000/

# Test metrics endpoint
curl http://localhost:5000/metrics

# Test health check
curl http://localhost:5000/health
```

### Using GKE Load Balancer (Optional)

To expose the Backend service externally with a load balancer:

1. Modify `k8s/backend.yaml` or create a new service:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-lb
spec:
  type: LoadBalancer
  selector:
    app: backend
  ports:
    - port: 80
      targetPort: 5000
```

2. Apply the configuration:

```bash
kubectl apply -f - <<EOF
apiVersion: v1
kind: Service
metadata:
  name: backend-lb
spec:
  type: LoadBalancer
  selector:
    app: backend
  ports:
    - port: 80
      targetPort: 5000
EOF
```

3. Get the external IP:

```bash
kubectl get svc backend-lb

# Wait for external IP assignment (may take 1-2 minutes)
# Access via: http://<EXTERNAL-IP>
```

## Monitoring Deployment

### Check Resource Status

```bash
# View all resources
kubectl get all

# View pods
kubectl get pods -o wide

# View services
kubectl get svc

# View CronJobs
kubectl get cronjob

# View deployments
kubectl get deployments
```

### View Logs

```bash
# Backend deployment logs
kubectl logs deployment/backend -f

# Extractor CronJob logs
kubectl logs job/extractor-cronjob-<timestamp>

# View all pod logs
kubectl logs -l app=backend
```

### Check Pod Status

```bash
# Describe deployment
kubectl describe deployment backend

# Describe service
kubectl describe svc backend

# Describe cronjob
kubectl describe cronjob extractor-cronjob

# View pod events
kubectl get events --sort-by='.lastTimestamp'
```

### Google Cloud Monitoring

Access GCP monitoring:

```bash
# View cluster metrics
gcloud container clusters describe challenge-cluster --region=us-central1

# View GKE dashboard
gcloud container clusters describe challenge-cluster --region=us-central1 --format='value(endpoint)'
```

## Scaling and Management

### Scale Backend Deployment

```bash
# Scale to 3 replicas
kubectl scale deployment backend --replicas=3

# Verify scaling
kubectl get pods

# Auto-scaling (HPA)
kubectl autoscale deployment backend --min=1 --max=5 --cpu-percent=70
```

### Update Container Images

```bash
# Update backend image
kubectl set image deployment/backend backend=gcr.io/$PROJECT_ID/backend:v2

# Verify rollout
kubectl rollout status deployment/backend

# Check history
kubectl rollout history deployment/backend
```

### Modify CronJob Schedule

Edit and reapply the CronJob:

```bash
# Extract current cronjob
kubectl get cronjob extractor-cronjob -o yaml > cronjob.yaml

# Edit the schedule (change "*/15 * * * *" to desired schedule)
# Then apply:
kubectl apply -f cronjob.yaml
```

## Terraform State Management

### View State

```bash
# List all resources in state
terraform state list

# Show specific resource
terraform state show module.gke.google_container_cluster.primary
```

### Backup State

```bash
# Local backup
cp terraform.tfstate terraform.tfstate.backup

# Upload to GCS (recommended for production)
gsutil mb gs://$PROJECT_ID-terraform-state
gsutil versioning set on gs://$PROJECT_ID-terraform-state
```

### Remote State (Recommended for Production)

Create `backend.tf`:

```hcl
terraform {
  backend "gcs" {
    bucket = "your-project-id-terraform-state"
    prefix = "prod"
  }
}
```

Then migrate:

```bash
terraform init
# Answer yes to copy existing state
```

## Cleanup and Destroy

### Destroy All Resources

```bash
# From production directory
cd infrastructure-as-code/production

# Show what will be destroyed
terraform plan -destroy

# Destroy resources
terraform destroy
```

### Manual Cleanup (If Terraform Fails)

```bash
# Delete GKE cluster
gcloud container clusters delete challenge-cluster --region=us-central1

# Delete VPC
gcloud compute networks delete devops-challenge-vpc

# Delete service account
gcloud iam service-accounts delete terraform-sa@$PROJECT_ID.iam.gserviceaccount.com

# Delete service account key
rm terraform-key.json
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| **Authentication failed** | Invalid GCP credentials | Verify `GOOGLE_APPLICATION_CREDENTIALS` is set correctly |
| **Quota exceeded** | Resource limits reached | Check GCP quotas and request increase |
| **Image not found** | Container Registry push failed | Verify images are in Container Registry: `gcloud container images list` |
| **CronJob not executing** | Service DNS issue | Verify backend service exists: `kubectl get svc backend` |
| **Pod crashes** | Application error or config issue | Check logs: `kubectl logs <pod-name>` |
| **Terraform state lock** | Concurrent terraform operations | Wait or manually unlock: `terraform force-unlock <LOCK_ID>` |
| **VPC/Subnet conflicts** | Resources already exist | Check existing resources or use different names |

### Debug Commands

```bash
# Check Terraform errors
terraform validate

# Check GCP project configuration
gcloud config list

# View GKE cluster details
gcloud container clusters describe challenge-cluster --region=us-central1

# SSH into node
gcloud compute ssh <node-name> --zone=us-central1-a

# View GCP logs
gcloud logging read "resource.type=gke_cluster" --limit 50
```

## Cost Optimization

### Reduce Costs During Testing

```hcl
# In terraform.tfvars
enable_autopilot = false  # Use standard cluster instead
```

### Recommended Production Configuration

```hcl
# Add to production configuration
backend_replicas = 3
enable_autoscaling = true
min_nodes = 2
max_nodes = 10
```

## Best Practices

1. **Use Service Accounts**: Always use dedicated service accounts for Terraform
2. **State Management**: Store Terraform state in GCS for team collaboration
3. **Resource Limits**: Set CPU and memory limits to prevent cost overruns
4. **Monitoring**: Enable GCP monitoring and logging
5. **Backup**: Regularly backup Terraform state
6. **Version Control**: Commit Terraform files to git (exclude terraform-key.json)
7. **Documentation**: Document custom configurations and modifications
8. **Testing**: Use `terraform plan` before applying changes

## Additional Resources

- [Terraform Google Cloud Provider Documentation](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [GKE Best Practices](https://cloud.google.com/kubernetes-engine/docs/best-practices)
- [Terraform Best Practices](https://www.terraform.io/docs/cloud/recommended-practices.html)
- [GCP Pricing Calculator](https://cloud.google.com/products/calculator)
- [GCP Free Tier](https://cloud.google.com/free)

## See Also

- [Provisioning Details](./PROVISIONING.md)
- [Local OS Setup](../backend-deployment/src/README.md)
- [Docker Setup](../backend-deployment/README.md)
- [Minikube Setup](../k8s/README.md)
