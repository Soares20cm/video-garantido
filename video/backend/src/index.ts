import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { checkDatabaseConnection, disconnectDatabase } from './utils/db-health';
import config from './config';
import apiRoutes from './routes';

dotenv.config();

const app = express();
const PORT = config.port;

// CORS headers - must be before other middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory (for local development)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/health', async (req, res) => {
  const dbHealthy = await checkDatabaseConnection();
  res.json({
    status: dbHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    database: dbHealthy ? 'connected' : 'disconnected',
  });
});

// API routes
app.use('/api', apiRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong!',
    },
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await disconnectDatabase();
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    // Check database connection
    const dbHealthy = await checkDatabaseConnection();
    if (!dbHealthy) {
      console.warn('⚠️  Starting server without database connection');
      console.warn('   Make sure PostgreSQL is running and DATABASE_URL is configured');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
      console.log(`✅ CORS enabled for all origins`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
