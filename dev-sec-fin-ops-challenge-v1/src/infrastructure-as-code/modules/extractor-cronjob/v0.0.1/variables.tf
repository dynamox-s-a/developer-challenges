variable "name" {
  description = "Backend Deployment name"
  type = string
}

variable "image" {
  description = "Backend Deployment image"
  type = string
}

variable "replicas" {
  description = "Backend Deployment number of replicas"
  type = string
}

variable "limits" {
  description = "Backend Deployment number of replicas"
  type = object({
    cpu    = string
    memory = string
  })
}

variable "requests" {
  description = "Backend Deployment number of replicas"
  type = object({
    cpu    = string
    memory = string
  })
}

variable "gcp_project" {
  description = "GCP project name"
  type = string
}

variable "gcp_region" {
  description = "GCP project region"
  type = string
}

variable "artifact_registry_repository" {
  description = "Artifact registry repository"
  type = string
}

variable "image_tag" {
  description = "Docker image tag"
  type = string
}

variable "image_name" {
  description = "Docker image name"
  type = string
}

variable "dockerfile_path" {
  description = "Dockerfile path"
  type = string
}

