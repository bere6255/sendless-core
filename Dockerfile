# Use Node 20 Alpine for smaller image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy all source files
COPY . .

# Build TypeScript
RUN npm run build

# --- Production stage ---
FROM node:20-alpine

WORKDIR /app

# Copy dependencies and build output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Set environment variables (optional)
ENV NODE_ENV=production

EXPOSE 4000

# Start API
CMD ["npm", "start"]
