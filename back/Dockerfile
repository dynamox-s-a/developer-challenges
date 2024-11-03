FROM node:20
RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 3001
CMD ["npm", "run", "dev"]
