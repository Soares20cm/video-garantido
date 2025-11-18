import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  databaseUrl: process.env.DATABASE_URL || '',

  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

  // AWS S3 / Cloudflare R2
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.S3_BUCKET || 'dev-videos',
    s3Endpoint: process.env.S3_ENDPOINT,
  },

  // CDN
  cdnUrl: process.env.CDN_URL || '',

  // Upload limits
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '2147483648', 10), // 2GB
  maxVideoSize: parseInt(process.env.MAX_VIDEO_SIZE || '5368709120', 10), // 5GB
};

export default config;
