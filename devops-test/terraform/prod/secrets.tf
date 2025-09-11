resource "google_secret_manager_secret" "secret_manager" {
  count     = length(var.service_names)
  secret_id = "${var.service_names[count.index]}-${var.gcp_environment}-secret"
  project   = var.gcp_project_id

  replication {
    automatic = true
  }

  depends_on = [
    google_project_service.secret_manager_api
  ]
}

# Seeding secrets, can be done in many ways
resource "google_secret_manager_secret_version" "secret_version" {
  count       = length(var.service_names)
  secret      = google_secret_manager_secret.secret_manager[count.index].id
  secret_data = "secret: data"
}