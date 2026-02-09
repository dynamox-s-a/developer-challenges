FROM node:20-alpine

WORKDIR /app

# Copy package.json and install
COPY package.json ./
RUN npm install -g typescript && npm install

# Copy code and schema
COPY . .

# Generate Prisma Client
ENV DATABASE_URL="file:./dev.db"
RUN npx prisma generate

# Build
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3001

CMD sh -c "npx prisma migrate deploy && npx prisma db seed && node dist/server.js"
