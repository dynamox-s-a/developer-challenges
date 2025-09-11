resource "google_cloudbuild_trigger" "cloudbuild_trigger" {
  count     = length(var.service_names)
  name      = "${var.service_names[count.index]}-trigger-${var.gcp_environment}"
  project   = var.gcp_project_id

  # Taking in account automatic building from branches
  github {
    name  = var.github_repo_name[count.index]
    owner = var.github_repo_owner
    push {
      branch       = "^${var.repo_branch_name}$"
      invert_regex = false
    }
  }

  # Necessary on GCP as of new updates to how build pipelines are made on Terraform
  service_account = "projects/${var.gcp_project_id}/serviceAccounts/${data.google_compute_default_service_account.default.email}"

  substitutions = var.gcp_cloud_build_substitutions_trigger[count.index]
  # This makes a concatenation to link all necessary filter files on the Cloud Build
  included_files = formatlist("%s**", concat(var.gcp_cloudbuild_filter_files, formatlist(var.gcp_cloud_build_path[count.index])))
  filename = "${var.gcp_cloud_build_path[count.index]}cloudbuild.yaml"

  depends_on = [
    google_project_service.cloud_build_api
  ]
}

data "google_compute_default_service_account" "default" {
  depends_on = [
    google_project_service.compute_engine_api
  ]
}