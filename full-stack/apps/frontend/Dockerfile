FROM node:20-alpine AS build

WORKDIR /app

# Copia package.json e instala dependências
COPY package.json ./
RUN npm install

# Copia código
COPY . .

ARG VITE_API_BASE_URL=http://localhost:3001
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
