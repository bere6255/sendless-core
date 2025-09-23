# Step 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first (better layer caching)
COPY package.json ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build TypeScript
RUN yarn build

# Step 2: Production stage
FROM node:18-alpine

WORKDIR /app

# Copy only necessary files
COPY package.json ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# Expose API port
EXPOSE 4000

# Start the API
CMD ["node", "dist/index.js"]
