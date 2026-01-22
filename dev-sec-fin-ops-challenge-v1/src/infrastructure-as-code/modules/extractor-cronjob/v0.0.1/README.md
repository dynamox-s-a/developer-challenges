# $MODULE

<!-- BEGIN_TF_DOCS -->
## Requirements

No requirements.

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

No outputs.

## Resources

| Name | Type |
|------|------|
| [google_artifact_registry_repository.artifact_repository](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/artifact_registry_repository) | resource |
| [google_project_service.artifact_registry_api](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/project_service) | resource |
| [null_resource.auth_docker](https://registry.terraform.io/providers/hashicorp/null/latest/docs/resources/resource) | resource |
| [null_resource.build_image](https://registry.terraform.io/providers/hashicorp/null/latest/docs/resources/resource) | resource |
<!-- END_TF_DOCS -->
