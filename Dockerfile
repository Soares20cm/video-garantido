FROM node:20-alpine3.19

# Install FFmpeg and OpenSSL 1.1 for Prisma
RUN apk add --no-cache ffmpeg openssl1.1-compat

WORKDIR /app

# Copy backend files
COPY video/backend/package*.json ./
COPY video/backend/prisma ./prisma/

# Install ALL dependencies
RUN npm install

# Generate Prisma Client for Alpine Linux
RUN npx prisma generate

# Copy backend source code
COPY video/backend ./

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/index.js"]
