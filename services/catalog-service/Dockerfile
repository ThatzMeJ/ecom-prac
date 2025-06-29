FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for TypeScript)
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3002

# Start the application in dev mode (hot reload)
CMD ["npm", "run", "dev"]


