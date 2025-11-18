import Redis from 'ioredis';
import config from '../config';
import { UploadProgressData } from '../types/video.types';

export class RedisService {
  private client: Redis | null = null;
  private isConnected: boolean = false;

  constructor() {
    try {
      this.client = new Redis(config.redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            console.warn('Redis connection failed after 3 retries');
            return null;
          }
          return Math.min(times * 100, 3000);
        },
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        console.log('✅ Redis connected');
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        console.error('Redis error:', err.message);
      });
    } catch (error) {
      console.warn('Redis not available, progress tracking disabled');
      this.client = null;
    }
  }

  async setUploadProgress(videoId: string, progress: UploadProgressData): Promise<void> {
    if (!this.client || !this.isConnected) return;

    try {
      await this.client.setex(
        `upload:${videoId}`,
        3600, // Expire after 1 hour
        JSON.stringify(progress)
      );
    } catch (error) {
      console.error('Failed to set upload progress:', error);
    }
  }

  async getUploadProgress(videoId: string): Promise<UploadProgressData | null> {
    if (!this.client || !this.isConnected) return null;

    try {
      const data = await this.client.get(`upload:${videoId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get upload progress:', error);
      return null;
    }
  }

  async deleteUploadProgress(videoId: string): Promise<void> {
    if (!this.client || !this.isConnected) return;

    try {
      await this.client.del(`upload:${videoId}`);
    } catch (error) {
      console.error('Failed to delete upload progress:', error);
    }
  }

  async cacheSet(key: string, value: any, ttl: number = 300): Promise<void> {
    if (!this.client || !this.isConnected) return;

    try {
      await this.client.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  }

  async cacheGet<T>(key: string): Promise<T | null> {
    if (!this.client || !this.isConnected) return null;

    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return null;
    }
  }

  async cacheDelete(key: string): Promise<void> {
    if (!this.client || !this.isConnected) return;

    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Failed to delete cached data:', error);
    }
  }

  isAvailable(): boolean {
    return this.isConnected && this.client !== null;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
    }
  }
}

export default new RedisService();
