FROM node:20.14.0

RUN apt update && apt install -y openssl procps

RUN npm install -g @nestjs/cli@10.4.2

WORKDIR /home/node/app

USER node

CMD tail -f /dev/null