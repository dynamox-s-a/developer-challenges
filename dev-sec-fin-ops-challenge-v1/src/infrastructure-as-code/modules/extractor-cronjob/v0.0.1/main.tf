locals {
  module_version = reverse(split("/", abspath(path.module)))[0]
  module_name    = reverse(split("/", abspath(path.module)))[1]
}

locals {
  image_name = var.image_name
  image_tag  = var.image_tag
  artifact_image_path = "${google_artifact_registry_repository.artifact_repository.location}-docker.pkg.dev/${google_artifact_registry_repository.artifact_repository.project}/${google_artifact_registry_repository.artifact_repository.repository_id}/${local.image_name}:${local.image_tag}"
}

resource "google_project_service" "artifact_registry_api" {
  service            = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

resource "google_artifact_registry_repository" "artifact_repository" {
  location      = var.gcp_region
  repository_id = var.artifact_registry_repository
  format        = "DOCKER"
}

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
