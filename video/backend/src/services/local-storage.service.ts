import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Local file storage service for development
 * NOT recommended for production use
 */
export class LocalStorageService {
  private uploadDir: string;
  private baseUrl: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.baseUrl = process.env.BASE_URL || 'http://localhost:4000';
    
    // Create uploads directory if it doesn't exist
    this.ensureDirectoryExists(this.uploadDir);
  }

  private ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  generateFileName(originalName: string): string {
    const ext = path.extname(originalName);
    return `${uuidv4()}${ext}`;
  }

  async uploadFile(file: Buffer, filePath: string): Promise<string> {
    const fullPath = path.join(this.uploadDir, filePath);
    const dir = path.dirname(fullPath);
    
    this.ensureDirectoryExists(dir);
    
    await fs.promises.writeFile(fullPath, file);
    
    return `${this.baseUrl}/uploads/${filePath}`;
  }

  async uploadVideo(file: Buffer, videoId: string, fileName: string): Promise<string> {
    const filePath = `videos/${videoId}/original/${fileName}`;
    return this.uploadFile(file, filePath);
  }

  async uploadVideoVariant(
    file: Buffer,
    videoId: string,
    quality: string,
    fileName: string
  ): Promise<string> {
    const filePath = `videos/${videoId}/${quality}/${fileName}`;
    return this.uploadFile(file, filePath);
  }

  async uploadThumbnail(file: Buffer, videoId: string, fileName: string): Promise<string> {
    const filePath = `videos/${videoId}/thumbnails/${fileName}`;
    return this.uploadFile(file, filePath);
  }

  async uploadAvatar(file: Buffer, channelId: string, fileName: string): Promise<string> {
    const filePath = `avatars/${channelId}/${fileName}`;
    return this.uploadFile(file, filePath);
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(this.uploadDir, filePath);
    
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  }

  async deleteVideoFiles(videoId: string): Promise<void> {
    const videoDir = path.join(this.uploadDir, 'videos', videoId);
    
    if (fs.existsSync(videoDir)) {
      await fs.promises.rm(videoDir, { recursive: true, force: true });
    }
  }

  extractKeyFromUrl(url: string): string {
    return url.replace(`${this.baseUrl}/uploads/`, '');
  }

  isConfigured(): boolean {
    return true; // Always available for local development
  }

  getPublicUrl(filePath: string): string {
    return `${this.baseUrl}/uploads/${filePath}`;
  }
}

export default new LocalStorageService();
