output "cloud_run_service_url" {
  description = "Publicly accessible URI of the Cloud Run service"
  value       = google_cloud_run_v2_service.backend_service.uri
}