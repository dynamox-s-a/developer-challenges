
FROM node:18-alpine


RUN apk add --no-cache netcat-openbsd


WORKDIR /app


COPY package*.json ./
COPY prisma ./prisma/


RUN npm ci


RUN npx prisma generate


COPY . .


RUN npm run build


RUN chmod +x docker-entrypoint.sh


EXPOSE 3000


ENTRYPOINT ["./docker-entrypoint.sh"]