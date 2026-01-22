provider "kubernetes" {
    config_path    = "~/.kube/config"
    config_context = "minikube"
}


module "backend_deployment" {
  source        = "../modules/backend-deployment/v1.0.0"
  name          = "backend-deployment"
  replicas = 1
  image         = "nginx"
  limits = {
    cpu = "0.5"
    memory = "250Mi"
  }
  requests = {
    cpu = "0.25"
    memory = "100Mi"
  }
  gcp_project="dynamoxdevops"

  gcp_region="southamerica-east1"

  artifact_registry_repository= "backend-repo"

  image_tag = "latest"

  image_name ="backend-deployment-count-api"

  dockerfile_path = "../../services/backend-deployment"
}
