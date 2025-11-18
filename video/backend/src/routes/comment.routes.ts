import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller';

const router = Router();

// GET /api/videos/:videoId/comments - Get comments for a video (public)
router.get('/:videoId/comments', getComments);

// POST /api/videos/:videoId/comments - Create comment (protected)
router.post('/:videoId/comments', authenticate, createComment);

// PUT /api/comments/:id - Update comment (protected)
router.put('/comments/:id', authenticate, updateComment);

// DELETE /api/comments/:id - Delete comment (protected)
router.delete('/comments/:id', authenticate, deleteComment);

export default router;
