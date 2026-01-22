# Backend Deployment Module

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_kubernetes"></a> [kubernetes](#requirement\_kubernetes) | ~> 2.27 |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_name"></a> [name](#input\_name) | Backend Deployment name | `string` | n/a | yes |
| <a name="input_image"></a> [image](#input\_image) | Backend Deployment image | `string` | n/a | yes |
| <a name="input_replicas"></a> [replicas](#input\_replicas) | Backend Deployment number of replicas | `string` | n/a | yes |
| <a name="input_limits"></a> [limits](#input\_limits) | Backend Deployment number of replicas | <pre>object({<br/>    cpu    = string<br/>    memory = string<br/>  })</pre> | n/a | yes |
| <a name="input_requests"></a> [requests](#input\_requests) | Backend Deployment number of replicas | <pre>object({<br/>    cpu    = string<br/>    memory = string<br/>  })</pre> | n/a | yes |
| <a name="input_gcp_project"></a> [gcp\_project](#input\_gcp\_project) | GCP project name | `string` | n/a | yes |
| <a name="input_gcp_region"></a> [gcp\_region](#input\_gcp\_region) | GCP project region | `string` | n/a | yes |
| <a name="input_artifact_registry_repository"></a> [artifact\_registry\_repository](#input\_artifact\_registry\_repository) | Artifact registry repository | `string` | n/a | yes |
| <a name="input_image_tag"></a> [image\_tag](#input\_image\_tag) | Docker image tag | `string` | n/a | yes |
| <a name="input_image_name"></a> [image\_name](#input\_image\_name) | Docker image name | `string` | n/a | yes |
| <a name="input_dockerfile_path"></a> [dockerfile\_path](#input\_dockerfile\_path) | Dockerfile path | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_cloud_run_service_url"></a> [cloud\_run\_service\_url](#output\_cloud\_run\_service\_url) | Publicly accessible URI of the Cloud Run service |

## Resources

| Name | Type |
|------|------|
| [google_artifact_registry_repository.artifact_repository](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/artifact_registry_repository) | resource |
| [google_cloud_run_v2_service.backend_service](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloud_run_v2_service) | resource |
| [google_project_iam_member.artifact_registry_reader_access](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/project_iam_member) | resource |
| [google_project_service.artifact_registry_api](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/project_service) | resource |
| [google_project_service.google_cloud_run_v2_service](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/project_service) | resource |
| [google_service_account.cloud_run_service_identity](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/service_account) | resource |
| [null_resource.auth_docker](https://registry.terraform.io/providers/hashicorp/null/latest/docs/resources/resource) | resource |
| [null_resource.build_image](https://registry.terraform.io/providers/hashicorp/null/latest/docs/resources/resource) | resource |
<!-- END_TF_DOCS -->
