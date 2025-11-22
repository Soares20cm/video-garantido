import { Request, Response } from 'express';
import videoService from '../services/video.service';
import channelService from '../services/channel.service';
import storageService from '../services/storage.service';
import localStorageService from '../services/local-storage.service';
import redisService from '../services/redis.service';
import thumbnailService from '../services/thumbnail.service';
import prisma from '../config/database';
import config from '../config';
import { CreateVideoRequest, UpdateVideoRequest } from '../types/video.types';

export class VideoController {
  private storage = config.aws.accessKeyId ? storageService : localStorageService;

  async uploadVideo(req: Request, res: Response): Promise<void> {
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

      // Check if user has a channel
      const channel = await channelService.getChannelByUserId(req.user.id);
      if (!channel) {
        res.status(400).json({
          error: {
            code: 'NO_CHANNEL',
            message: 'You must create a channel before uploading videos',
          },
        });
        return;
      }

      // Get video file from multer
      const videoFile = req.file;
      if (!videoFile) {
        res.status(400).json({
          error: {
            code: 'NO_FILE',
            message: 'Video file is required',
          },
        });
        return;
      }

      // Get metadata from body
      const { title, description } = req.body as CreateVideoRequest;

      if (!title) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Video title is required',
          },
        });
        return;
      }

      // Validate title and description length
      if (title.length > 100) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Title must not exceed 100 characters',
          },
        });
        return;
      }

      if (description && description.length > 5000) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Description must not exceed 5000 characters',
          },
        });
        return;
      }

      // Create video record first to get ID
      const tempVideo = await videoService.createVideo(
        channel.id,
        title,
        description,
        '', // Will be updated after upload
        '', // Will be updated after thumbnail generation
        0 // Duration will be extracted during processing
      );

      // Set initial upload progress
      await redisService.setUploadProgress(tempVideo.id, {
        videoId: tempVideo.id,
        progress: 0,
        status: 'uploading',
        message: 'Starting upload...',
      });

      // Upload original video file
      const fileName = this.storage.generateFileName(videoFile.originalname);
      const videoUrl = await this.storage.uploadVideo(videoFile.buffer, tempVideo.id, fileName);

      // Update video with file URL
      await videoService.updateVideo(tempVideo.id, req.user.id, {});
      await prisma.video.update({
        where: { id: tempVideo.id },
        data: { originalFileUrl: videoUrl },
      });

      // Update progress
      await redisService.setUploadProgress(tempVideo.id, {
        videoId: tempVideo.id,
        progress: 100,
        status: 'processing',
        message: 'Upload complete, generating thumbnail...',
      });

      // Generate thumbnail from first frame of video
      let thumbnailUrl: string;
      try {
        console.log('🎬 Generating thumbnail from video...');
        const thumbnailBuffer = await thumbnailService.generateThumbnailFromBuffer(
          videoFile.buffer,
          tempVideo.id
        );
        
        // Upload thumbnail to storage
        const thumbnailFileName = this.storage.generateFileName(`${tempVideo.id}_thumb.jpg`);
        thumbnailUrl = await this.storage.uploadThumbnail(
          thumbnailBuffer,
          tempVideo.id,
          thumbnailFileName
        );
        console.log('✅ Thumbnail generated and uploaded successfully');
      } catch (thumbnailError) {
        console.error('⚠️  Failed to generate thumbnail, using placeholder:', thumbnailError);
        // Fallback to placeholder if thumbnail generation fails
        thumbnailUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyODAiIGhlaWdodD0iNzIwIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzlhYTBhNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlZpZGVvIFRodW1ibmFpbDwvdGV4dD48L3N2Zz4=';
      }

      // Update video with thumbnail and mark as ready
      await prisma.video.update({
        where: { id: tempVideo.id },
        data: { 
          thumbnailUrl,
          status: 'READY' // Mark video as ready to play
        },
      });

      res.status(201).json({
        id: tempVideo.id,
        title: tempVideo.title,
        description: tempVideo.description,
        status: tempVideo.status,
        message: 'Video uploaded successfully and queued for processing',
      });
    } catch (error: any) {
      console.error('Upload video error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to upload video',
        },
      });
    }
  }

  async getUploadProgress(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const progress = await redisService.getUploadProgress(id);

      if (!progress) {
        // Check if video exists in database
        const video = await videoService.getVideoById(id);
        if (!video) {
          res.status(404).json({
            error: {
              code: 'VIDEO_NOT_FOUND',
              message: 'Video not found',
            },
          });
          return;
        }

        // Return status from database
        res.status(200).json({
          videoId: id,
          progress: 100,
          status: video.status.toLowerCase(),
          message: `Video is ${video.status.toLowerCase()}`,
        });
        return;
      }

      res.status(200).json(progress);
    } catch (error) {
      console.error('Get upload progress error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get upload progress',
        },
      });
    }
  }

  async getVideo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const video = await videoService.getVideoById(id, true);

      if (!video) {
        res.status(404).json({
          error: {
            code: 'VIDEO_NOT_FOUND',
            message: 'Video not found',
          },
        });
        return;
      }

      res.status(200).json(video);
    } catch (error) {
      console.error('Get video error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get video',
        },
      });
    }
  }

  async getVideoStream(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const video = await videoService.getVideoById(id);

      if (!video) {
        res.status(404).json({
          error: {
            code: 'VIDEO_NOT_FOUND',
            message: 'Video not found',
          },
        });
        return;
      }

      if (video.status !== 'READY') {
        res.status(400).json({
          error: {
            code: 'VIDEO_NOT_READY',
            message: 'Video is still processing',
          },
        });
        return;
      }

      res.status(200).json({
        hlsPlaylistUrl: video.hlsPlaylistUrl || video.originalFileUrl,
        originalUrl: video.originalFileUrl,
      });
    } catch (error) {
      console.error('Get video stream error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get video stream',
        },
      });
    }
  }

  async updateVideo(req: Request, res: Response): Promise<void> {
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
      const { title, description } = req.body as UpdateVideoRequest;

      const video = await videoService.updateVideo(id, req.user.id, { title, description });

      res.status(200).json(video);
    } catch (error: any) {
      if (error.message === 'Video not found') {
        res.status(404).json({
          error: {
            code: 'VIDEO_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      if (error.message === 'Not authorized to update this video') {
        res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: error.message,
          },
        });
        return;
      }

      if (error.message.includes('must not exceed')) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message,
          },
        });
        return;
      }

      console.error('Update video error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update video',
        },
      });
    }
  }

  async deleteVideo(req: Request, res: Response): Promise<void> {
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

      await videoService.deleteVideo(id, req.user.id);

      res.status(200).json({
        message: 'Video deleted successfully',
      });
    } catch (error: any) {
      if (error.message === 'Video not found') {
        res.status(404).json({
          error: {
            code: 'VIDEO_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      if (error.message === 'Not authorized to delete this video') {
        res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: error.message,
          },
        });
        return;
      }

      console.error('Delete video error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete video',
        },
      });
    }
  }

  async uploadThumbnail(req: Request, res: Response): Promise<void> {
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
      const thumbnailFile = req.file;

      if (!thumbnailFile) {
        res.status(400).json({
          error: {
            code: 'NO_FILE',
            message: 'Thumbnail file is required',
          },
        });
        return;
      }

      // Upload thumbnail
      const fileName = this.storage.generateFileName(thumbnailFile.originalname);
      const thumbnailUrl = await this.storage.uploadThumbnail(thumbnailFile.buffer, id, fileName);

      // Update video
      const video = await videoService.updateVideoThumbnail(id, req.user.id, thumbnailUrl);

      res.status(200).json(video);
    } catch (error: any) {
      if (error.message === 'Video not found') {
        res.status(404).json({
          error: {
            code: 'VIDEO_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      if (error.message === 'Not authorized to update this video') {
        res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: error.message,
          },
        });
        return;
      }

      console.error('Upload thumbnail error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to upload thumbnail',
        },
      });
    }
  }

  async recordView(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await videoService.incrementViewCount(id);

      res.status(200).json({
        message: 'View recorded',
      });
    } catch (error) {
      console.error('Record view error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to record view',
        },
      });
    }
  }

  async searchVideos(req: Request, res: Response): Promise<void> {
    try {
      const { q, page = '1', limit = '20' } = req.query;

      if (!q || typeof q !== 'string') {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Search query is required',
          },
        });
        return;
      }

      const result = await videoService.searchVideos(
        q,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.status(200).json(result);
    } catch (error) {
      console.error('Search videos error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to search videos',
        },
      });
    }
  }

  async getChannelVideos(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { page = '1', limit = '20' } = req.query;

      const result = await videoService.getVideosByChannelId(
        id,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.status(200).json(result);
    } catch (error) {
      console.error('Get channel videos error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get channel videos',
        },
      });
    }
  }

  async getRecentVideos(req: Request, res: Response): Promise<void> {
    try {
      const { page = '1', limit = '20' } = req.query;

      const result = await videoService.getRecentVideos(
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.status(200).json(result);
    } catch (error) {
      console.error('Get recent videos error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get recent videos',
        },
      });
    }
  }
}

export default new VideoController();
