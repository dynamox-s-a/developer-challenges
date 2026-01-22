# Frontend Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Command will be overridden by docker-compose
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]