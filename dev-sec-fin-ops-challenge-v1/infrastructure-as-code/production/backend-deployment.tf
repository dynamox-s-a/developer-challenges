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
}
