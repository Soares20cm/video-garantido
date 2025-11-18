import { Router } from 'express';
import authRoutes from './auth.routes';
import channelRoutes from './channel.routes';
import videoRoutes from './video.routes';
import commentRoutes from './comment.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/channels', channelRoutes);
router.use('/videos', videoRoutes);
router.use('/videos', commentRoutes); // Comment routes are under /videos/:videoId/comments

// Health check for API
router.get('/', (req, res) => {
  res.json({
    message: 'Video Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      channels: '/api/channels',
      videos: '/api/videos',
      comments: '/api/videos/:videoId/comments',
      health: '/health',
    },
  });
});

export default router;
