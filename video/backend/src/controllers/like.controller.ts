import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const likeVideo = async (req: Request, res: Response) => {
  try {
    const { id: videoId } = req.params;
    const userId = req.user!.id;

    // Check if video exists
    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video) {
      return res.status(404).json({ error: { message: 'Video not found' } });
    }

    // Check if user already liked/disliked
    const existingLike = await prisma.videoLike.findUnique({
      where: {
        userId_videoId: { userId, videoId },
      },
    });

    if (existingLike) {
      if (existingLike.isLike) {
        // Remove like
        await prisma.videoLike.delete({
          where: { id: existingLike.id },
        });
        await prisma.video.update({
          where: { id: videoId },
          data: { likeCount: { decrement: 1 } },
        });
        return res.json({ liked: false, disliked: false });
      } else {
        // Change from dislike to like
        await prisma.videoLike.update({
          where: { id: existingLike.id },
          data: { isLike: true },
        });
        await prisma.video.update({
          where: { id: videoId },
          data: {
            likeCount: { increment: 1 },
            dislikeCount: { decrement: 1 },
          },
        });
        return res.json({ liked: true, disliked: false });
      }
    }

    // Create new like
    await prisma.videoLike.create({
      data: {
        userId,
        videoId,
        isLike: true,
      },
    });

    await prisma.video.update({
      where: { id: videoId },
      data: { likeCount: { increment: 1 } },
    });

    res.json({ liked: true, disliked: false });
  } catch (error) {
    console.error('Like video error:', error);
    res.status(500).json({ error: { message: 'Failed to like video' } });
  }
};

export const dislikeVideo = async (req: Request, res: Response) => {
  try {
    const { id: videoId } = req.params;
    const userId = req.user!.id;

    // Check if video exists
    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video) {
      return res.status(404).json({ error: { message: 'Video not found' } });
    }

    // Check if user already liked/disliked
    const existingLike = await prisma.videoLike.findUnique({
      where: {
        userId_videoId: { userId, videoId },
      },
    });

    if (existingLike) {
      if (!existingLike.isLike) {
        // Remove dislike
        await prisma.videoLike.delete({
          where: { id: existingLike.id },
        });
        await prisma.video.update({
          where: { id: videoId },
          data: { dislikeCount: { decrement: 1 } },
        });
        return res.json({ liked: false, disliked: false });
      } else {
        // Change from like to dislike
        await prisma.videoLike.update({
          where: { id: existingLike.id },
          data: { isLike: false },
        });
        await prisma.video.update({
          where: { id: videoId },
          data: {
            likeCount: { decrement: 1 },
            dislikeCount: { increment: 1 },
          },
        });
        return res.json({ liked: false, disliked: true });
      }
    }

    // Create new dislike
    await prisma.videoLike.create({
      data: {
        userId,
        videoId,
        isLike: false,
      },
    });

    await prisma.video.update({
      where: { id: videoId },
      data: { dislikeCount: { increment: 1 } },
    });

    res.json({ liked: false, disliked: true });
  } catch (error) {
    console.error('Dislike video error:', error);
    res.status(500).json({ error: { message: 'Failed to dislike video' } });
  }
};

export const getLikeStatus = async (req: Request, res: Response) => {
  try {
    const { id: videoId } = req.params;
    const userId = req.user!.id;

    const like = await prisma.videoLike.findUnique({
      where: {
        userId_videoId: { userId, videoId },
      },
    });

    if (!like) {
      return res.json({ liked: false, disliked: false });
    }

    res.json({
      liked: like.isLike,
      disliked: !like.isLike,
    });
  } catch (error) {
    console.error('Get like status error:', error);
    res.status(500).json({ error: { message: 'Failed to get like status' } });
  }
};
