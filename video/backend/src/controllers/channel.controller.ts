import { Request, Response } from 'express';
import channelService from '../services/channel.service';
import { CreateChannelRequest, UpdateChannelRequest } from '../types/channel.types';

export class ChannelController {
  async createChannel(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        });
        return;
      }

      const { name, description } = req.body as CreateChannelRequest;

      if (!name) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Channel name is required',
          },
        });
        return;
      }

      const channel = await channelService.createChannel(req.user.id, name, description);

      res.status(201).json(channel);
    } catch (error: any) {
      if (error.message === 'User already has a channel') {
        res.status(409).json({
          error: {
            code: 'CHANNEL_EXISTS',
            message: error.message,
          },
        });
        return;
      }

      if (error.message.includes('must be between')) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message,
          },
        });
        return;
      }

      console.error('Create channel error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create channel',
        },
      });
    }
  }

  async getChannel(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const channel = await channelService.getChannelById(id);

      if (!channel) {
        res.status(404).json({
          error: {
            code: 'CHANNEL_NOT_FOUND',
            message: 'Channel not found',
          },
        });
        return;
      }

      res.status(200).json(channel);
    } catch (error) {
      console.error('Get channel error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get channel',
        },
      });
    }
  }

  async updateChannel(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        });
        return;
      }

      const { id } = req.params;
      const { name, description } = req.body as UpdateChannelRequest;

      if (!name && description === undefined) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'At least one field (name or description) is required',
          },
        });
        return;
      }

      const channel = await channelService.updateChannel(id, req.user.id, { name, description });

      res.status(200).json(channel);
    } catch (error: any) {
      if (error.message === 'Channel not found') {
        res.status(404).json({
          error: {
            code: 'CHANNEL_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      if (error.message === 'Not authorized to update this channel') {
        res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: error.message,
          },
        });
        return;
      }

      if (error.message.includes('must be between')) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message,
          },
        });
        return;
      }

      console.error('Update channel error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update channel',
        },
      });
    }
  }

  async uploadAvatar(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        });
        return;
      }

      const { id } = req.params;

      // File upload will be handled by multer middleware (to be implemented in task 5)
      // For now, we'll accept avatarUrl in the body
      const { avatarUrl } = req.body;

      if (!avatarUrl) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Avatar URL is required',
          },
        });
        return;
      }

      const channel = await channelService.updateChannelAvatar(id, req.user.id, avatarUrl);

      res.status(200).json(channel);
    } catch (error: any) {
      if (error.message === 'Channel not found') {
        res.status(404).json({
          error: {
            code: 'CHANNEL_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      if (error.message === 'Not authorized to update this channel') {
        res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: error.message,
          },
        });
        return;
      }

      console.error('Upload avatar error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to upload avatar',
        },
      });
    }
  }

  async getMyChannel(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        });
        return;
      }

      const channel = await channelService.getChannelByUserId(req.user.id);

      if (!channel) {
        res.status(404).json({
          error: {
            code: 'CHANNEL_NOT_FOUND',
            message: 'You do not have a channel yet',
          },
        });
        return;
      }

      res.status(200).json(channel);
    } catch (error) {
      console.error('Get my channel error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get channel',
        },
      });
    }
  }
}

export default new ChannelController();
