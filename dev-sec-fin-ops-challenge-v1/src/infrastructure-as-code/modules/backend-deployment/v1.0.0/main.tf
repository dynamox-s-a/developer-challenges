locals {
  module_version = reverse(split("/", abspath(path.module)))[0]
  module_name    = reverse(split("/", abspath(path.module)))[1]
}

locals {
  image_name = var.image_name
  image_tag  = var.image_tag
  artifact_image_path = "${google_artifact_registry_repository.artifact_repository.location}-docker.pkg.dev/${google_artifact_registry_repository.artifact_repository.project}/${google_artifact_registry_repository.artifact_repository.repository_id}/${local.image_name}:${local.image_tag}"
}

//Setup identity and permissions
resource "google_service_account" "cloud_run_service_identity" {
  account_id   = "cloud-run-identity-sa"
}

resource "google_project_iam_member" "artifact_registry_reader_access" {
  project = var.gcp_project
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${google_service_account.cloud_run_service_identity.email}"
}

// Enable services
resource "google_project_service" "artifact_registry_api" {
  service            = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "google_cloud_run_v2_service" {
  service            = "run.googleapis.com"
  disable_on_destroy = false
}

// Create artifact repository
resource "google_artifact_registry_repository" "artifact_repository" {
  location      = var.gcp_region
  repository_id = var.artifact_registry_repository
  format        = "DOCKER"
}

// Build and push image to artifact repository
resource "null_resource" "auth_docker" {
  provisioner "local-exec" {
    command = "gcloud auth configure-docker ${google_artifact_registry_repository.artifact_repository.location}-docker.pkg.dev"
  }
}

resource "null_resource" "build_image" {
  depends_on = [null_resource.auth_docker]
  provisioner "local-exec" {
    command = "(cd ${var.dockerfile_path} && docker buildx build -t ${local.artifact_image_path} -f Dockerfile . --push)"
  }
  triggers = {
    always_run = timestamp() 
  }
}

// Run image on cloud
resource "google_cloud_run_v2_service" "backend_service" {
  name     = "cloudrun-service-min-instances"
  location = var.gcp_region

  deletion_protection = false

  template {
    containers {
      image = local.artifact_image_path
    }
    service_account = google_service_account.cloud_run_service_identity.email
    scaling {
      max_instance_count = 1
      min_instance_count = 1
    }
  }
}