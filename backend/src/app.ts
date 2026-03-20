import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import prisma from './config/database';
import redis from './config/redis';
import routes from './routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    // Test Redis connection
    await redis.ping();

    res.json({
      success: true,
      data: {
        status: 'ok',
        database: 'connected',
        redis: 'connected',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown health check error';
    res.status(500).json({
      success: false,
      data: {
        status: 'error',
        message,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// ============================================
// ROUTES
// ============================================
app.use('/api', routes);

// ============================================
// ERROR HANDLING
// ============================================
app.use(errorMiddleware);

// ============================================
// START SERVER
// ============================================
let currentPort = PORT;

const logServerStart = (port: number) => {
  console.log('');
  console.log('🚀 ============================================');
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV}`);
  console.log(`🚀 API: http://localhost:${port}/api`);
  console.log(`🚀 Health: http://localhost:${port}/health`);
  console.log('🚀 ============================================');
  console.log('');
};

const startServer = (port: number) => {
  currentPort = port;

  const serverInstance = app.listen(port, () => {
    logServerStart(port);
  });

  serverInstance.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`⚠️ Port ${port} is in use, retrying on port ${nextPort}...`);
      setTimeout(() => startServer(nextPort), 100);
      return;
    }

    throw error;
  });

  return serverInstance;
};

let server = startServer(PORT);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    await redis.quit();
    console.log('✅ Connections closed, process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('👋 SIGINT received, shutting down gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    await redis.quit();
    console.log('✅ Connections closed, process terminated');
    process.exit(0);
  });
});

export default app;
