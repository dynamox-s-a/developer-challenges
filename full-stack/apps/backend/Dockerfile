FROM node:20-alpine

WORKDIR /app

# Copy package.json and install
COPY package.json ./
RUN npm install -g typescript && npm install

# Copy code and schema
COPY . .

ENV NODE_ENV=production
EXPOSE 3001

CMD sh -c "npx prisma generate && npx prisma migrate deploy && npx prisma db seed && npx tsx src/server.ts"
