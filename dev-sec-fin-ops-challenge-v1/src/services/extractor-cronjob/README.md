# Extractor Cronjob Service

Small service that performs a extraction job on the URL set in the env variable `EXTRACTION_URL`. If the request fails, the service tries other URLs set on the environment before declaring failure. Currently, the service don't execute any procedure to persistently store the job result, instead the result is just logged on console.

## O.S. Environment Setup

To run the service locally you need the following:

- poetry
- Python (>=3.14);

Then the script can be used with the command:

```bash
POETRY_DOTENV_LOCATION=.env poetry run python src/main.py
```

Then, using a cron daemon of your choosing, make sure that the `crond` service is enable and run the following command:

```bash
(crontab -l 2>/dev/null; echo "15 * * * * $(pwd)/local_job.sh >> /var/log/extractor") | crontab -
```

If successful, a new cronjob will be set in your crontab, running the extractor each 15 minutes.

## Docker Environment Setup

Build the Docker image with:

```bash
docker-compose build
```

After building the image, run the it with the following command:

```bash
docker compose run extraction-script
```

Then, using a cron daemon of your choosing, make sure that the `crond` service is enable and run the following command:

```bash
(crontab -l 2>/dev/null; echo "15 * * * * $(pwd)/docker_job.sh >> /var/log/extractor") | crontab -
```

If successful, a new cronjob will be set in your crontab, running the extractor in a container each 15 minutes.

## Kubernetes Setup

To setup a cronjob using the extractor run the following:

```bash
minikube image load extractor-cronjob-extraction-script:latest
kubectl apply -f k8s.yaml
```

After this, the local Kubernetes cluster will have the cronjob successfully registered to be triggered each 15 minutes, or to be mannually triggered.

