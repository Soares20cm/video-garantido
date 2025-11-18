import prisma from '../config/database';
import { Channel } from '@prisma/client';
import { ChannelResponse } from '../types/channel.types';

export class ChannelService {
  async createChannel(userId: string, name: string, description?: string): Promise<Channel> {
    // Check if user already has a channel (one channel per user)
    const existingChannel = await prisma.channel.findUnique({
      where: { userId },
    });

    if (existingChannel) {
      throw new Error('User already has a channel');
    }

    // Validate channel name length (3-50 characters)
    if (name.length < 3 || name.length > 50) {
      throw new Error('Channel name must be between 3 and 50 characters');
    }

    // Create channel
    const channel = await prisma.channel.create({
      data: {
        userId,
        name,
        description,
      },
    });

    return channel;
  }

  async getChannelById(channelId: string): Promise<ChannelResponse | null> {
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        _count: {
          select: { videos: true },
        },
      },
    });

    if (!channel) {
      return null;
    }

    return {
      id: channel.id,
      userId: channel.userId,
      name: channel.name,
      avatarUrl: channel.avatarUrl || undefined,
      description: channel.description || undefined,
      videoCount: channel._count.videos,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt,
    };
  }

  async getChannelByUserId(userId: string): Promise<Channel | null> {
    return prisma.channel.findUnique({
      where: { userId },
    });
  }

  async updateChannel(
    channelId: string,
    userId: string,
    data: { name?: string; description?: string }
  ): Promise<Channel> {
    // Verify ownership
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
    });

    if (!channel) {
      throw new Error('Channel not found');
    }

    if (channel.userId !== userId) {
      throw new Error('Not authorized to update this channel');
    }

    // Validate name if provided
    if (data.name !== undefined) {
      if (data.name.length < 3 || data.name.length > 50) {
        throw new Error('Channel name must be between 3 and 50 characters');
      }
    }

    // Update channel
    const updatedChannel = await prisma.channel.update({
      where: { id: channelId },
      data,
    });

    return updatedChannel;
  }

  async updateChannelAvatar(channelId: string, userId: string, avatarUrl: string): Promise<Channel> {
    // Verify ownership
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
    });

    if (!channel) {
      throw new Error('Channel not found');
    }

    if (channel.userId !== userId) {
      throw new Error('Not authorized to update this channel');
    }

    // Update avatar
    const updatedChannel = await prisma.channel.update({
      where: { id: channelId },
      data: { avatarUrl },
    });

    return updatedChannel;
  }

  async deleteChannel(channelId: string, userId: string): Promise<void> {
    // Verify ownership
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
    });

    if (!channel) {
      throw new Error('Channel not found');
    }

    if (channel.userId !== userId) {
      throw new Error('Not authorized to delete this channel');
    }

    // Delete channel (cascade will delete videos)
    await prisma.channel.delete({
      where: { id: channelId },
    });
  }
}

export default new ChannelService();
