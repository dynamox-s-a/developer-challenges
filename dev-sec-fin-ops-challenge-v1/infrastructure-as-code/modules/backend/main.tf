resource "kubernetes_deployment" "this" {
  metadata {
    name   = var.app_name
    labels = { app = var.app_name }
  }
  spec {
    replicas = var.replicas
    selector { match_labels = { app = var.app_name } }
    template {
      metadata { labels = { app = var.app_name } }
      spec {
        container {
          name  = var.app_name
          image = var.image
          port { container_port = 5000 }
        }
      }
    }
  }
}

resource "kubernetes_service" "this" {
  metadata { name = var.app_name }
  spec {
    selector = { app = var.app_name }
    port {
      port        = 80
      target_port = 5000
    }
    type = "ClusterIP"
  }
}