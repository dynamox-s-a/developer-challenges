provider "google" {
    project = var.gcp_project_id
}

terraform {
	required_providers {
		google = {
	    version = "~> 4.40.0"
		}
  }
}
