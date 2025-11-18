import { Router } from 'express';
import videoController from '../controllers/video.controller';
import { authenticate } from '../middleware/auth.middleware';
import { uploadVideo, uploadImage, handleMulterError } from '../middleware/upload.middleware';

const router = Router();

// POST /api/videos - Upload video (protected)
router.post(
  '/',
  authenticate,
  uploadVideo,
  handleMulterError,
  videoController.uploadVideo.bind(videoController)
);

// GET /api/videos/search - Search videos (public)
router.get('/search', videoController.searchVideos.bind(videoController));

// GET /api/videos/recent - Get recent videos (public)
router.get('/recent', videoController.getRecentVideos.bind(videoController));

// GET /api/videos/:id - Get video details (public)
router.get('/:id', videoController.getVideo.bind(videoController));

// GET /api/videos/:id/progress - Get upload progress (public)
router.get('/:id/progress', videoController.getUploadProgress.bind(videoController));

// GET /api/videos/:id/stream - Get video streaming URL (public)
router.get('/:id/stream', videoController.getVideoStream.bind(videoController));

// PUT /api/videos/:id - Update video metadata (protected)
router.put('/:id', authenticate, videoController.updateVideo.bind(videoController));

// DELETE /api/videos/:id - Delete video (protected)
router.delete('/:id', authenticate, videoController.deleteVideo.bind(videoController));

// POST /api/videos/:id/thumbnail - Upload custom thumbnail (protected)
router.post(
  '/:id/thumbnail',
  authenticate,
  uploadImage,
  handleMulterError,
  videoController.uploadThumbnail.bind(videoController)
);

// POST /api/videos/:id/view - Record video view (public)
router.post('/:id/view', videoController.recordView.bind(videoController));

export default router;

// Like/Dislike routes
import { likeVideo, dislikeVideo, getLikeStatus } from '../controllers/like.controller';

// POST /api/videos/:id/like - Like video (protected)
router.post('/:id/like', authenticate, likeVideo);

// POST /api/videos/:id/dislike - Dislike video (protected)
router.post('/:id/dislike', authenticate, dislikeVideo);

// GET /api/videos/:id/like-status - Get like status (protected)
router.get('/:id/like-status', authenticate, getLikeStatus);
