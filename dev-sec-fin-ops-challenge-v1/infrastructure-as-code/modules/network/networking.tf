resource "google_compute_network" "vpc" {
  name                    = var.vpc_name
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "subnet" {
  name          = "${var.vpc_name}-subnet"
  region        = var.region
  network       = google_compute_network.vpc.self_link
  ip_cidr_range = "10.0.0.0/24"
}