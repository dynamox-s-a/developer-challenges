# Enabling APIs required for the services.
# In order, Cloud Build, Compute Engine, Artifact Registry, Source Repositories
# Secret Manager and Cloud Run
resource "google_project_service" "cloud_build_api" {
  project  = var.gcp_project_id
  service = "cloudbuild.googleapis.com"
}

resource "google_project_service" "compute_engine_api" {
  project  = var.gcp_project_id
  service = "compute.googleapis.com"
}

resource "google_project_service" "artifact_registry" {
  project  = var.gcp_project_id
  service = "artifactregistry.googleapis.com"
}

resource "google_project_service" "source_repository" {
  project  = var.gcp_project_id
  service = "sourcerepo.googleapis.com"
}

resource "google_project_service" "secret_manager_api" {
  project  = var.gcp_project_id
  service = "secretmanager.googleapis.com"
}

resource "google_project_service" "cloud_storage_api" {
  project  = var.gcp_project_id
  service = "storage.googleapis.com"
}

resource "google_project_service" "cloud_run_api" {
  project  = var.gcp_project_id
  service = "run.googleapis.com"
}