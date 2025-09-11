# Mostly permission giving for Cloud Build and related services 

data "google_project" "project" {
}

resource "google_project_iam_member" "permissions-compute" {
  project = var.gcp_project_id
  count   = length(var.rolesList-compute-and-api)
  role    = var.rolesList-compute-and-api[count.index]
  member  = "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"

  depends_on = [ google_project_service.compute_engine_api ]
}

resource "google_project_iam_member" "permissions-api" {
  project = var.gcp_project_id
  count   = length(var.rolesList-compute-and-api)
  role    = var.rolesList-compute-and-api[count.index]
  member  = "serviceAccount:${data.google_project.project.number}@cloudservices.gserviceaccount.com"

  depends_on = [ google_project_service.compute_engine_api ]
}

resource "google_project_iam_member" "permissions-cloudbuild" {
  project = var.gcp_project_id
  count   = length(var.rolesList-cloudbuild)
  role    = var.rolesList-cloudbuild[count.index]
  member  = "serviceAccount:${data.google_project.project.number}@cloudbuild.gserviceaccount.com"

  depends_on = [ google_project_service.cloud_build_api ]
}

# Same permissions, but for default Compute

resource "google_project_iam_member" "permissions-api-compute" {
  project = var.gcp_project_id
  count   = length(var.rolesList-compute-and-api)
  role    = var.rolesList-compute-and-api[count.index]
  member  = "serviceAccount:${data.google_project.project.number}-compute@cloudservices.gserviceaccount.com"

  depends_on = [ google_project_service.compute_engine_api ]
}

resource "google_project_iam_member" "permissions-cloudbuild-compute" {
  project = var.gcp_project_id
  count   = length(var.rolesList-cloudbuild)
  role    = var.rolesList-cloudbuild[count.index]
  member  = "serviceAccount:${data.google_project.project.number}-compute@cloudbuild.gserviceaccount.com"

  depends_on = [ google_project_service.cloud_build_api ]
}