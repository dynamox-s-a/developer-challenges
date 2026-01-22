module "extractor" {
  source = "../modules/extractor-cronjob/v1.0.0"
  
  gcp_project="dynamoxdevops"

  gcp_region="southamerica-east1"

  artifact_registry_repository= "extractor-repo"

  image_tag = "latest"

  image_name ="extractor-cronjob-extraction-script"

  dockerfile_path = "../../services/extractor-cronjob"
}
