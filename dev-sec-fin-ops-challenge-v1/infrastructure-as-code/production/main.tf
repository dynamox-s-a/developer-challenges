# Create the VPC and subnet for our GKE cluster
module "network" {
  source   = "../modules/network"
  vpc_name = "devops-challenge-vpc"
  region   = var.region
}

# Creates our GKE cluster using the network outputs
module "gke" {
  source      = "../modules/gke"
  cluster_name = "challenge-cluster"
  region      = var.region
  vpc_link    = module.network.vpc_self_link
  subnet_link = module.network.subnet_self_link
}

# Deploy our backend application to the GKE cluster
module "backend" {
  source = "../modules/backend"
  image  = var.backend_image
}

# Deploy our extractor cronjob to the GKE cluster
module "extractor" {
  source      = "../modules/extractor"
  image       = var.extractor_image
  backend_url = "http://backend-service.default.svc.cluster.local"
}