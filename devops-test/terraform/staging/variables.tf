variable "gcp_project_id" {
  type = string
  description = "The name of the GCP Project."
  
  validation {
    condition     = length(var.gcp_project_id) != 0
    error_message = "The name of the GCP project should not be null."
  }
}

variable "gcp_environment" {
  type = string
  description = "Whether the environment is production or staging. Must conform with either 'stg' or 'prod'. Used for differentiation."

  validation {
    condition     = contains(["stg", "prod"], var.gcp_environment) && length(var.gcp_environment) != 0
    error_message = "The environment must be either 'stg' or 'prod' and should not be null."
  }
}

variable "github_repo_name" {
  type = list(string)
  description = "The name of the Github Repository."
  
  validation {
    condition     = length(var.github_repo_name) != 0
    error_message = "The name of the Github Repository should not be null."
  }
}

variable "github_repo_owner" {
  type = string
  description = "The name of the Github Owner aka. Business name."
  
  validation {
    condition     = length(var.github_repo_owner) != 0
    error_message = "The name of the Github Owner should not be null."
  }
}

variable "gcp_cloudbuild_filter_files" {
  type        = list(string)
  description = "The path of additional folder/files to be checked for changes for build triggering, usually used for shared files/libraries. Can be empty."
}

variable "service_names" {
  type        = list(string)
  description = "the name of the services to be iterated, as needed, inside the following services: Cloud Build, Secret Manager."
}

variable "repo_branch_name" {
  type = string
  description = "The name of the repository branch, must conform with either \"staging\" or \"master\" enviroments, with \"master\" being the production enviroment."
  
  validation {
    condition     = contains(["staging", "master"], var.repo_branch_name) && length(var.repo_branch_name) != 0
    error_message = "The branch must be either \"staging\" or \"master\" and should not be null."
  }
}

variable "gcp_cloud_build_substitutions_trigger" {
  type = list(object({
    _SERVICE_NAME = string
    _PROJECT_NAME = string
    _REGION = string
    _GSM_KEY = string
    _GSM_VERSION = string
  }))
  description = <<-EOT
  Substitution variables for the services, used on Cloud Build:
    _SERVICE_NAME = sets the name of the service.
    _PROJECT_NAME = sets the name of the GCP Project.
    _REGION = sets the region in which the Application will be created.
    _GSM_KEY = sets the Google Secret Manager key name.
    _GSM_VERSION = sets the GSM key version.
  EOT
}

variable "gcp_cloud_build_path" {
  type = list(string)
  description = "The path to the application, used in building. Must end with a '/' character."
}

variable "gcp_all_services_region" {
  type = string
  description = "Region to be used by default in all applicable GCP services"
  validation {
    condition     = length(var.gcp_all_services_region) != 0
    error_message = "The region should not be null."
  }
}


variable "rolesList-compute-and-api" {
  type = list(string)
  description = "List of default permissions for the compute and API service accounts on GCP."
  default = ["roles/editor"]
}

variable "rolesList-cloudbuild" {
  type = list(string)
  description = "List of default permissions for the Cloud Build service account on GCP."
  default = ["roles/cloudbuild.builds.builder", "roles/run.admin", "roles/compute.instanceAdmin.v1", "roles/secretmanager.secretAccessor", "roles/iam.serviceAccountUser"]
}