import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { v4 as uuidv4 } from 'uuid';
import config from '../config';
import * as fs from 'fs';
import * as path from 'path';

export class StorageService {
  private s3Client: S3Client;
  private bucket: string;
  private cdnUrl: string;

  constructor() {
    // Configure S3 client (works with both AWS S3 and Cloudflare R2)
    this.s3Client = new S3Client({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
      },
      ...(config.aws.s3Endpoint && { endpoint: config.aws.s3Endpoint }),
    });

    this.bucket = config.aws.s3Bucket;
    this.cdnUrl = config.cdnUrl || `https://${this.bucket}.s3.${config.aws.region}.amazonaws.com`;
  }

  /**
   * Generate a unique file name with UUID
   */
  generateFileName(originalName: string): string {
    const ext = path.extname(originalName);
    return `${uuidv4()}${ext}`;
  }

  /**
   * Upload file to S3/R2 or local storage
   */
  async uploadFile(
    file: Buffer | fs.ReadStream,
    key: string,
    contentType: string,
    metadata?: Record<string, string>
  ): Promise<string> {
    // If S3 is not configured, save locally
    if (!this.isConfigured()) {
      return this.uploadFileLocally(file, key);
    }

    try {
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucket,
          Key: key,
          Body: file,
          ContentType: contentType,
          Metadata: metadata,
          // Cache for 1 year for video files
          CacheControl: contentType.startsWith('video/') ? 'public, max-age=31536000' : 'public, max-age=86400',
        },
      });

      await upload.done();

      // Return CDN URL
      return `${this.cdnUrl}/${key}`;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload file to storage');
    }
  }

  /**
   * Upload file to local storage (fallback)
   */
  private async uploadFileLocally(file: Buffer | fs.ReadStream, key: string): Promise<string> {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const filePath = path.join(uploadsDir, key);
    const fileDir = path.dirname(filePath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    // Write file
    if (Buffer.isBuffer(file)) {
      fs.writeFileSync(filePath, file);
    } else {
      // Handle stream
      const writeStream = fs.createWriteStream(filePath);
      await new Promise((resolve, reject) => {
        file.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });
    }

    // Return local URL
    return `/uploads/${key}`;
  }

  /**
   * Upload video file
   */
  async uploadVideo(
    file: Buffer | fs.ReadStream,
    videoId: string,
    fileName: string
  ): Promise<string> {
    const key = `videos/${videoId}/original/${fileName}`;
    return this.uploadFile(file, key, 'video/mp4');
  }

  /**
   * Upload video variant (transcoded)
   */
  async uploadVideoVariant(
    file: Buffer | fs.ReadStream,
    videoId: string,
    quality: string,
    fileName: string
  ): Promise<string> {
    const key = `videos/${videoId}/${quality}/${fileName}`;
    const contentType = fileName.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp2t';
    return this.uploadFile(file, key, contentType);
  }

  /**
   * Upload thumbnail
   */
  async uploadThumbnail(
    file: Buffer | fs.ReadStream,
    videoId: string,
    fileName: string
  ): Promise<string> {
    const key = `videos/${videoId}/thumbnails/${fileName}`;
    return this.uploadFile(file, key, 'image/jpeg');
  }

  /**
   * Upload channel avatar
   */
  async uploadAvatar(
    file: Buffer | fs.ReadStream,
    channelId: string,
    fileName: string
  ): Promise<string> {
    const key = `avatars/${channelId}/${fileName}`;
    const contentType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
    return this.uploadFile(file, key, contentType);
  }

  /**
   * Delete file from S3/R2
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('Delete error:', error);
      throw new Error('Failed to delete file from storage');
    }
  }

  /**
   * Delete all files for a video
   */
  async deleteVideoFiles(videoId: string): Promise<void> {
    // In production, you'd want to list and delete all files in the video folder
    // For now, we'll just note that this should be implemented with S3 ListObjects
    console.log(`Deleting files for video ${videoId}`);
    // TODO: Implement batch delete with ListObjectsV2 and DeleteObjects
  }

  /**
   * Extract key from URL
   */
  extractKeyFromUrl(url: string): string {
    // Remove CDN URL prefix to get the key
    return url.replace(`${this.cdnUrl}/`, '');
  }

  /**
   * Check if storage is configured
   */
  isConfigured(): boolean {
    return !!(config.aws.accessKeyId && config.aws.secretAccessKey && this.bucket);
  }

  /**
   * Get public URL for a key
   */
  getPublicUrl(key: string): string {
    return `${this.cdnUrl}/${key}`;
  }
}

export default new StorageService();
