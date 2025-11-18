import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const subscribe = async (req: Request, res: Response) => {
  try {
    const { id: channelId } = req.params;
    const userId = req.user!.id;

    // Check if channel exists
    const channel = await prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel) {
      return res.status(404).json({ error: { message: 'Channel not found' } });
    }

    // Check if user is trying to subscribe to their own channel
    if (channel.userId === userId) {
      return res.status(400).json({ error: { message: 'Cannot subscribe to your own channel' } });
    }

    // Check if already subscribed
    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        userId_channelId: { userId, channelId },
      },
    });

    if (existingSubscription) {
      return res.status(400).json({ error: { message: 'Already subscribed' } });
    }

    // Create subscription
    await prisma.subscription.create({
      data: {
        userId,
        channelId,
      },
    });

    // Increment subscriber count
    await prisma.channel.update({
      where: { id: channelId },
      data: { subscriberCount: { increment: 1 } },
    });

    res.json({ message: 'Subscribed successfully', isSubscribed: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: { message: 'Failed to subscribe' } });
  }
};

export const unsubscribe = async (req: Request, res: Response) => {
  try {
    const { id: channelId } = req.params;
    const userId = req.user!.id;

    // Check if subscribed
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId_channelId: { userId, channelId },
      },
    });

    if (!subscription) {
      return res.status(400).json({ error: { message: 'Not subscribed' } });
    }

    // Delete subscription
    await prisma.subscription.delete({
      where: { id: subscription.id },
    });

    // Decrement subscriber count
    await prisma.channel.update({
      where: { id: channelId },
      data: { subscriberCount: { decrement: 1 } },
    });

    res.json({ message: 'Unsubscribed successfully', isSubscribed: false });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ error: { message: 'Failed to unsubscribe' } });
  }
};

export const getSubscriptionStatus = async (req: Request, res: Response) => {
  try {
    const { id: channelId } = req.params;
    const userId = req.user!.id;

    const subscription = await prisma.subscription.findUnique({
      where: {
        userId_channelId: { userId, channelId },
      },
    });

    res.json({ isSubscribed: !!subscription });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ error: { message: 'Failed to get subscription status' } });
  }
};

export const getSubscriptions = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      include: {
        channel: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            subscriberCount: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ subscriptions });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ error: { message: 'Failed to get subscriptions' } });
  }
};
