# Setup

Setup for provisioning Infrastructure as Code (IaC).

``` bash
.
└── infrastructure-as-code/
    ├── modules    # Collection of multiple resources about the same service/solution.
    ├── production # end-user environment
    └── staging    # test/developer environment
```

## Provisioning

* [Provisioning](./PROVISIONING.md)

## Apply Terraform IaC

```bash
cd ./src/infrastructure-as-code/production
terraform init
terraform plan
terraform apply
```

## Validate Kubernetes workloads

```bash
kubectl get pods
```

## Cleanup

```bash
cd ./src/infrastructure-as-code/production
terraform destroy
minikube stop
minikube delete
```
