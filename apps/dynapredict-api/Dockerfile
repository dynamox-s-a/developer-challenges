# Run the container with `docker run -p 3000:3000 -t dynapredict-api`.
FROM docker.io/node:lts-alpine

WORKDIR /usr/src/app

COPY dist/apps/dynapredict-api .
COPY apps/dynapredict-api/prisma .
COPY apps/dynapredict-api/docker-run.sh .

RUN chown -R node:node . && \
    chmod +x docker-run.sh

USER node

ENV DATABASE_URL=${DATABASE_URL} \
    JWT_SECRET=${JWT_SECRET}

RUN npm --omit=dev -f install

EXPOSE 3000

ENTRYPOINT [ "./docker-run.sh" ]
