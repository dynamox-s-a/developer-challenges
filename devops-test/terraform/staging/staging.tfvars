gcp_project_id = "minezada-412617"

gcp_environment = "stg"

repo_branch_name = "staging"

github_repo_name = ["developer-challenges",
		    "developer-challenges"]

github_repo_owner = "Dunkelmond"

service_names =                ["backend", 
                                "extractor"]

gcp_cloud_build_path =         ["backend/",
                                "extractor/"]

gcp_cloudbuild_filter_files = [""]

gcp_cloud_build_substitutions_trigger = [{
    _SERVICE_NAME = "backend-stg"
    _PROJECT_NAME = "my-project-randomhashednumber"
    _REGION = "us-central1"
    _GSM_KEY = "backend-stg-secret"
    _GSM_VERSION = "latest"
},
{
    _SERVICE_NAME = "extractor-stg"
    _PROJECT_NAME = "my-project-randomhashednumber"
    _REGION = "us-central1"
    _GSM_KEY = "extractor-stg-secret"
    _GSM_VERSION = "latest"
}]

gcp_all_services_region = "us-central1"
