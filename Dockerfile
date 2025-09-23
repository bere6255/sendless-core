# Step 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Step 2: Production stage
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files
COPY package.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# Expose API port
EXPOSE 4000

# Start the API
CMD ["node", "dist/index.js"]
