variable "app_name" { default = "backend" }
variable "image"    { type = string }
variable "replicas" { default = 2 }
variable "extractor_image" { type = string }
variable "backend_image" { type = string }
variable "region"    { type = string }