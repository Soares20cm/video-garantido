FROM node:20-alpine

# Install FFmpeg for video processing
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copy backend files
COPY video/backend/package*.json ./
COPY video/backend/prisma ./prisma/

# Install ALL dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy backend source code
COPY video/backend ./

# Build TypeScript
RUN npm run build

# List dist directory to verify build
RUN ls -la dist/

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/index.js"]
