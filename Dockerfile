FROM node:18-slim

WORKDIR /usr/src/app

# Copy everything including node_modules and built files
COPY . .

# Expose the app port
EXPOSE 8081

# Start the app (adjust path if needed)
CMD ["node", "dist/index.js"]
