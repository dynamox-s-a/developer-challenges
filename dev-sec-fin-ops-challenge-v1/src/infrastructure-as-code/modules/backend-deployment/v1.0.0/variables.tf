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
