locals {
  module_version = reverse(split("/", abspath(path.module)))[0]
  module_name    = reverse(split("/", abspath(path.module)))[1]
}

resource "kubernetes_deployment_v1" "main" {
  metadata {
    name = var.name
    labels = {
      test = var.name
    }
  }

  spec {
    replicas = var.replicas

    selector {
      match_labels = {
        test = var.name
      }
    }

    template {
      metadata {
        labels = {
          test = var.name
        }
      }

      spec {
        container {
          image = var.image
          name  = var.name

          resources {
            limits = {
              cpu    = var.limits.cpu
              memory = var.limits.memory
            }
            requests = {
              cpu    = var.requests.cpu
              memory = var.requests.memory
            }
          }
        }
      }
    }
  }
}