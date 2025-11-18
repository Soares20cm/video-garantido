import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getComments = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    const { page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Get top-level comments (no parent)
    const comments = await prisma.comment.findMany({
      where: {
        videoId,
        parentId: null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    const total = await prisma.comment.count({
      where: {
        videoId,
        parentId: null,
      },
    });

    res.json({
      comments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: { message: 'Failed to get comments' } });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user!.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: { message: 'Comment content is required' } });
    }

    if (content.length > 1000) {
      return res.status(400).json({ error: { message: 'Comment is too long (max 1000 characters)' } });
    }

    // Check if video exists
    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video) {
      return res.status(404).json({ error: { message: 'Video not found' } });
    }

    // If it's a reply, check if parent comment exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({ where: { id: parentId } });
      if (!parentComment) {
        return res.status(404).json({ error: { message: 'Parent comment not found' } });
      }
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        userId,
        videoId,
        content: content.trim(),
        parentId: parentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Increment comment count (only for top-level comments)
    if (!parentId) {
      await prisma.video.update({
        where: { id: videoId },
        data: { commentCount: { increment: 1 } },
      });
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: { message: 'Failed to create comment' } });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user!.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: { message: 'Comment content is required' } });
    }

    if (content.length > 1000) {
      return res.status(400).json({ error: { message: 'Comment is too long (max 1000 characters)' } });
    }

    // Check if comment exists and user owns it
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return res.status(404).json({ error: { message: 'Comment not found' } });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ error: { message: 'Not authorized to edit this comment' } });
    }

    // Update comment
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content: content.trim() },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.json(updatedComment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ error: { message: 'Failed to update comment' } });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if comment exists and user owns it
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return res.status(404).json({ error: { message: 'Comment not found' } });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ error: { message: 'Not authorized to delete this comment' } });
    }

    // Delete comment (replies will be deleted automatically due to cascade)
    await prisma.comment.delete({ where: { id } });

    // Decrement comment count (only for top-level comments)
    if (!comment.parentId) {
      await prisma.video.update({
        where: { id: comment.videoId },
        data: { commentCount: { decrement: 1 } },
      });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: { message: 'Failed to delete comment' } });
  }
};
