resource "kubernetes_cron_job_v1" "this" {
  metadata {
    name = "extractor"
  }
  spec {
    schedule = var.schedule
    job_template {
      metadata {
        name = "extractor"
      }
      spec {
        template {
          metadata {
            labels = {
              app = "extractor"
            }
          }
          spec {
            container {
              name  = "extractor"
              image = var.image
              env {
                name  = "BACKEND_URL"
                value = var.backend_url
              }
            }
            restart_policy = "OnFailure"
          }
        }
      }
    }
  }
}