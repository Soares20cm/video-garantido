import prisma from '../config/database';
import { Video, VideoStatus } from '@prisma/client';
import storageService from './storage.service';
import localStorageService from './local-storage.service';
import config from '../config';

export class VideoService {
  private storage = config.aws.accessKeyId ? storageService : localStorageService;

  async createVideo(
    channelId: string,
    title: string,
    description: string | undefined,
    originalFileUrl: string,
    thumbnailUrl: string,
    duration: number = 0
  ): Promise<Video> {
    // Validate title length
    if (title.length > 100) {
      throw new Error('Title must not exceed 100 characters');
    }

    // Validate description length
    if (description && description.length > 5000) {
      throw new Error('Description must not exceed 5000 characters');
    }

    const video = await prisma.video.create({
      data: {
        channelId,
        title,
        description,
        originalFileUrl,
        thumbnailUrl,
        duration,
        status: VideoStatus.UPLOADING,
      },
    });

    return video;
  }

  async getVideoById(videoId: string, includeChannel: boolean = false): Promise<Video | null> {
    return prisma.video.findUnique({
      where: { id: videoId },
      include: includeChannel
        ? {
            channel: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          }
        : undefined,
    });
  }

  async getVideosByChannelId(
    channelId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ videos: Video[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where: { channelId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.video.count({ where: { channelId } }),
    ]);

    return {
      videos,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async updateVideo(
    videoId: string,
    userId: string,
    data: { title?: string; description?: string }
  ): Promise<Video> {
    // Get video with channel to verify ownership
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: { channel: true },
    });

    if (!video) {
      throw new Error('Video not found');
    }

    if (video.channel.userId !== userId) {
      throw new Error('Not authorized to update this video');
    }

    // Validate title if provided
    if (data.title !== undefined && data.title.length > 100) {
      throw new Error('Title must not exceed 100 characters');
    }

    // Validate description if provided
    if (data.description !== undefined && data.description.length > 5000) {
      throw new Error('Description must not exceed 5000 characters');
    }

    const updatedVideo = await prisma.video.update({
      where: { id: videoId },
      data,
    });

    return updatedVideo;
  }

  async updateVideoStatus(videoId: string, status: VideoStatus): Promise<Video> {
    return prisma.video.update({
      where: { id: videoId },
      data: { status },
    });
  }

  async updateVideoThumbnail(videoId: string, userId: string, thumbnailUrl: string): Promise<Video> {
    // Verify ownership
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: { channel: true },
    });

    if (!video) {
      throw new Error('Video not found');
    }

    if (video.channel.userId !== userId) {
      throw new Error('Not authorized to update this video');
    }

    return prisma.video.update({
      where: { id: videoId },
      data: { thumbnailUrl },
    });
  }

  async updateVideoHlsUrl(videoId: string, hlsPlaylistUrl: string): Promise<Video> {
    return prisma.video.update({
      where: { id: videoId },
      data: {
        hlsPlaylistUrl,
        status: VideoStatus.READY,
      },
    });
  }

  async deleteVideo(videoId: string, userId: string): Promise<void> {
    // Verify ownership
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: { channel: true },
    });

    if (!video) {
      throw new Error('Video not found');
    }

    if (video.channel.userId !== userId) {
      throw new Error('Not authorized to delete this video');
    }

    // Delete files from storage
    try {
      await this.storage.deleteVideoFiles(videoId);
    } catch (error) {
      console.error('Failed to delete video files:', error);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete video from database (cascade will delete variants)
    await prisma.video.delete({
      where: { id: videoId },
    });
  }

  async incrementViewCount(videoId: string): Promise<void> {
    await prisma.video.update({
      where: { id: videoId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }

  async searchVideos(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ videos: Video[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;

    // Use PostgreSQL full-text search
    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where: {
          AND: [
            { status: VideoStatus.READY },
            {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
              ],
            },
          ],
        },
        include: {
          channel: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.video.count({
        where: {
          AND: [
            { status: VideoStatus.READY },
            {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
              ],
            },
          ],
        },
      }),
    ]);

    return {
      videos,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async getRecentVideos(
    page: number = 1,
    limit: number = 20
  ): Promise<{ videos: Video[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where: { status: VideoStatus.READY },
        include: {
          channel: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.video.count({ where: { status: VideoStatus.READY } }),
    ]);

    return {
      videos,
      total,
      pages: Math.ceil(total / limit),
    };
  }
}

export default new VideoService();
