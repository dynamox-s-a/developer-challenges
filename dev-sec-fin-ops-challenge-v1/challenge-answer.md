# Dynamox Dev-Sec-Fin-Ops Developer Challenge Answer

This file contains the answer for the [Dynamox Dev-Sec-Fin-Ops Developer Challenge](./README.md)

## Initial Setup

This project was developed in a Arch-based Linux distribution. To develop and fully test the project, you'll need the following:

- Linux
- python (>=3.14);
- Python libraries:
  - fastapi (>=0.128.0,<0.129.0)
  - uvicorn (>=0.40.0,<0.41.0)
  - poetry (>=2.2.1-4)
- minikube
- docker
- docker-compose
- terraform

## Test's Setup

To test the services implemented, refer to the corresponding README bellow. Notice that the Kubernetes cluster is not properly delivered on the cloud environment. The current Terraform implementation builds the images, push them to the the Artifact Registry and tries to provide the backend deployment through Cloud Run.

* Backend Deployment
  * [Local setup](src/services/backend-deployment/README.md)
  * [Docker environment setup](src/services/backend-deployment/README.md)
  * [Minikube environment setup](src/services/backend-deployment/README.md)
  * [Cloud environment setup](src/infrastructure-as-code/README.md)
* Extractor Cronjob
  * [Local setup](src/services/extractor-cronjob/README.md)
  * [Docker environment setup](src/services/extractor-cronjob/README.md)
  * [Minikube environment setup](src/services/extractor-cronjob/README.md)
  * [Cloud environment setup](src/infrastructure-as-code/README.md)

## DevOps Brief Analysis

To provide a new release of the backend service, the production modules would need to be updated with a new image tag. This approach would left the current version running and with its image saved on Artifact Registry as a backup. The previous release would need to be manually stopped.

## SecOps Brief Analysis

For the backend service, there is no authentication method implemented, bringing the risk that unexpected parties consume the API, either improperly using the service or even targeting DoS attacks to the backend. Depending on the type of data that the API handles, it's also concerning that the content of the requests/responses may be intercepted. As the API just provides a service and doesn't have other server-side responsibilities, these are the two major concerns. There are multiple ways to mitigate them, but it would depend on the API consumer:

- If the API provides services to end users, who may be a huge number of individuals, and commonly the access would be provided/revoked for them, it would be interesting to implement an authentication service and apply encryption to the messages in both ends of communication;
- If the API provides services to a small controlled number of end users, such as companies or other internal services, it would be easier to use an encrypted tunneling method, such as L2TP/IPsec. This would need more active actions to provide/revoke access to end users but would be easier to maintain and develop, as there are many well-established tunneling methods.

Another action that would be interesting to implement in the backend service is mechanisms to prevent overloads to the server from single individuals, returning a 429 error to individuals that spam the API with too many requests and preventing their requests from occupying the backend resources for a certain amount of time.

For the extractor service, considering that their results would eventually be stored in a database, bucket, or another external service, the same concern around data traffic would be necessary. Encryption would be the first upgrade to the service to provide an extra security layer. In this scenario, the data is stored elsewhere, there is also a concern with third parties intercepting messages to discover and attack the storage endpoint. As for the backend service, any public traffic done by the extractor service could be tunneled to prevent malicious actions.

## FinOps Brief Analysis

The cost for running the backend service and extraction job on the GCP were simulated through the Pricing Calculator, considering only the costs related to the Kubernetes Engine, running on the southamerica-east1 region. The table bellow contains the setup and the results.

| Attributes     | Backend Deployment | Extraction Cronjob | Total         |
| -------------- | ------------------ | ------------------ | ------------- |
| Machine Type   | n1-highcpu-4       | n1-highmem-2       |               |
| Number of Pods | 55                 | 28                 |               |
| CPU            | 1250m              | 0.5                |               |
| Memory         | 512Mi              | 2Gi                |               |
| 30 days cost   | USD 6477.16        | USD 5433.20        | USD 11910.36  |
| 365 days cost  | USD 78805.44       | USD 66103.93       | USD 144909.38 |

### Notes on pricing

- The table already considers Sustained Use Discounts (SUDs) for both services, considering that the services are not intended to perform tasks and shutdown themselves, and thus would be running for the whole period;
- Considering that the backend is supposed to be an API, in a real application, the processing time for each request could be considerably small still. If this is true and the traffic is not saturating the pods, the possibility to use preemptive VMs for the service could be considered, as the cost for 30 and 365 days would go down to, respectively, **USD 1393.55** and **USD 16954.86** (-78.49%). Using preemptive VMs in a cloud environment, however, is not trivial and comes with the challenge that the backend implementation would need to deal gracefully with abrupt shutdowns.
- If the API provides applications with predictable traffic profiles, Committed Usage Discounts (CUDs) could be applied for the backend, reducing the yearly cost to **USD 71130.96** (-9.74%). The extraction cronjob would have a constant workload, executing their jobs within the cronjob setup time. So, there is a high chance that CUDs would apply for them, reducing the yearly cost to **USD 59703.42** (-9.68%), although it's advisable to plan the budget of the project considering the worst-case scenario to prevent unexpected losses;
- Depending on the implementation for logs and storage, the price for the backend service would not cross the monthly free usage quota, but for a production environment, it is interesting to analyze the backend workload in the first weeks/months and analyze the costs for those features to prevent their costs from scaling under the radar and unexpectedly becoming significant for the budget of the project.

## Future Implementations Plan

Since the project doesn't fully provide an infrastructure with the backend service and the cronjob running in a cloud-hosted Kubernetes cluster, as requested, there are many future improvements for the project.

To fulfill the requirements, the infrastructure code would have to include at least definitions to enable the GKE product and use it to deploy a Kubernetes cluster with both services. Without a Kubernetes cluster to configure the extractor cronjob, the extractor image would need several changes to include the request frequency from within the image. This would conceptually change the purpose of the extractor, from performing a job providing a service. Also, some permission issues would need to be revised for the backend service.

With the services properly working, we could focus on improving the infrastructure. Firstly, the deploy pipeline could be integrated with Cloud Build to build the project directly from a GitHub repository. For staging environments this would be just a quality-of-life feature, but for production environments this is an industry standard, reducing the risk of mistakes during deployment and making all the build pipelines independent from local machines.

Talking about deploy environments, the staging environment should be implemented, preferably working within another GCP project. With the development of the services, with the inclusion of proper log contexts, the staging environment also should be built with a broader log context than the production environment to provide better observability for developers, while the production environment could remain on an INFO log level to prevent excessive and/or unnecessary logging.
