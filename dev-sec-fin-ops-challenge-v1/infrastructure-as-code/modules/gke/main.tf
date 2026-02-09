resource "google_container_cluster" "primary" {
  name     = var.cluster_name
  location = var.region

  enable_autopilot = true
  network          = var.vpc_link
  subnetwork       = var.subnet_link
}