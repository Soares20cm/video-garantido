import { Router } from 'express';
import channelController from '../controllers/channel.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// POST /api/channels - Create channel (protected)
router.post('/', authenticate, channelController.createChannel.bind(channelController));

// GET /api/channels/me - Get my channel (protected)
router.get('/me', authenticate, channelController.getMyChannel.bind(channelController));

// GET /api/channels/:id - Get channel details (public)
router.get('/:id', channelController.getChannel.bind(channelController));

// PUT /api/channels/:id - Update channel (protected)
router.put('/:id', authenticate, channelController.updateChannel.bind(channelController));

// POST /api/channels/:id/avatar - Upload channel avatar (protected)
router.post('/:id/avatar', authenticate, channelController.uploadAvatar.bind(channelController));

export default router;

// Subscription routes
import { subscribe, unsubscribe, getSubscriptionStatus, getSubscriptions } from '../controllers/subscription.controller';

// POST /api/channels/:id/subscribe - Subscribe to channel (protected)
router.post('/:id/subscribe', authenticate, subscribe);

// DELETE /api/channels/:id/subscribe - Unsubscribe from channel (protected)
router.delete('/:id/subscribe', authenticate, unsubscribe);

// GET /api/channels/:id/subscription-status - Get subscription status (protected)
router.get('/:id/subscription-status', authenticate, getSubscriptionStatus);

// GET /api/channels/subscriptions/me - Get my subscriptions (protected)
router.get('/subscriptions/me', authenticate, getSubscriptions);
