FROM node:20-alpine

# Install FFmpeg for video processing
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copy root package files (monorepo)
COPY video/package*.json ./

# Copy backend package files
COPY video/backend/package*.json ./backend/
COPY video/backend/prisma ./backend/prisma/

# Install dependencies from root (this is a workspace)
RUN npm ci

# Generate Prisma Client
WORKDIR /app/backend
RUN npx prisma generate

# Copy backend source code
COPY video/backend ./

# Build TypeScript
RUN npm run build

# Remove devDependencies to reduce image size
WORKDIR /app
RUN npm prune --production

# Expose port
EXPOSE 4000

WORKDIR /app/backend

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["npm", "start"]
