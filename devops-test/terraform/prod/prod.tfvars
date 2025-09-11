gcp_project_id = "my-project-randomhashednumber"

gcp_environment = "prod"

repo_branch_name = "master"

github_repo_name = "developer-challenges"

github_repo_owner = "Dunkelmond"

service_names =                ["backend", 
                                "extractor"]

gcp_cloud_build_path =         ["backend/",
                                "extractor/"]

gcp_cloudbuild_filter_files = [""]

gcp_cloud_build_substitutions_trigger = [{
    _SERVICE_NAME = "backend-prod"
    _PROJECT_NAME = "my-project-randomhashednumber"
    _REGION = "southamerica-east1"
    _GSM_KEY = "backend-prod-secret"
    _GSM_VERSION = "latest"
},
{
    _SERVICE_NAME = "extractor-prod"
    _PROJECT_NAME = "my-project-randomhashednumber"
    _REGION = "southamerica-east1"
    _GSM_KEY = "extractor-prod-secret"
    _GSM_VERSION = "latest"
}]

gcp_all_services_region = "southamerica-east1"
