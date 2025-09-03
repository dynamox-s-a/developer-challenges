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
| <a name="input_limits"></a> [limits](#input\_limits) | Backend Deployment number of replicas | <pre>object({<br>    cpu    = string<br>    memory = string<br>  })</pre> | n/a | yes |
| <a name="input_requests"></a> [requests](#input\_requests) | Backend Deployment number of replicas | <pre>object({<br>    cpu    = string<br>    memory = string<br>  })</pre> | n/a | yes |

## Outputs

No outputs.

## Resources

| Name | Type |
|------|------|
| [kubernetes_deployment_v1.main](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/deployment_v1) | resource |
<!-- END_TF_DOCS -->
