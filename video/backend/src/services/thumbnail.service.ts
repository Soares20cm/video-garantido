import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';

const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const exists = promisify(fs.exists);
const execPromise = promisify(exec);

class ThumbnailService {
  private ffmpegAvailable: boolean | null = null;

  /**
   * Check if ffmpeg is available on the system
   */
  async checkFFmpegAvailability(): Promise<boolean> {
    if (this.ffmpegAvailable !== null) {
      return this.ffmpegAvailable;
    }

    try {
      await execPromise('ffmpeg -version');
      this.ffmpegAvailable = true;
      console.log('✅ FFmpeg is available');
      return true;
    } catch (error) {
      this.ffmpegAvailable = false;
      console.warn('⚠️  FFmpeg is not installed. Thumbnail generation will be disabled.');
      console.warn('   Install FFmpeg to enable automatic thumbnail generation.');
      console.warn('   See FFMPEG_SETUP.md for installation instructions.');
      return false;
    }
  }
  /**
   * Generate thumbnail from video file
   * @param videoPath - Path to the video file
   * @param outputPath - Path where thumbnail should be saved
   * @param timeInSeconds - Time in video to capture (default: 1 second)
   * @returns Promise<string> - Path to generated thumbnail
   */
  async generateThumbnail(
    videoPath: string,
    outputPath: string,
    timeInSeconds: number = 1
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      ffmpeg(videoPath)
        .screenshots({
          timestamps: [timeInSeconds],
          filename: path.basename(outputPath),
          folder: outputDir,
          size: '1280x720'
        })
        .on('end', () => {
          console.log('✅ Thumbnail generated successfully');
          resolve(outputPath);
        })
        .on('error', (err) => {
          console.error('❌ Error generating thumbnail:', err);
          reject(err);
        });
    });
  }

  /**
   * Generate thumbnail from video buffer
   * @param videoBuffer - Video file buffer
   * @param videoId - Video ID for naming
   * @returns Promise<Buffer> - Thumbnail image buffer
   * @throws Error if ffmpeg is not available
   */
  async generateThumbnailFromBuffer(
    videoBuffer: Buffer,
    videoId: string
  ): Promise<Buffer> {
    // Check if ffmpeg is available
    const isAvailable = await this.checkFFmpegAvailability();
    if (!isAvailable) {
      throw new Error('FFmpeg is not available. Cannot generate thumbnail.');
    }
    const tempDir = path.join(process.cwd(), 'temp');
    const tempVideoPath = path.join(tempDir, `${videoId}_temp.mp4`);
    const tempThumbnailPath = path.join(tempDir, `${videoId}_thumb.jpg`);

    try {
      // Create temp directory if it doesn't exist
      if (!fs.existsSync(tempDir)) {
        await mkdir(tempDir, { recursive: true });
      }

      // Write video buffer to temp file
      fs.writeFileSync(tempVideoPath, videoBuffer);

      // Generate thumbnail
      await this.generateThumbnail(tempVideoPath, tempThumbnailPath, 1);

      // Read thumbnail buffer
      const thumbnailBuffer = fs.readFileSync(tempThumbnailPath);

      // Clean up temp files
      await unlink(tempVideoPath);
      await unlink(tempThumbnailPath);

      return thumbnailBuffer;
    } catch (error) {
      // Clean up on error
      if (fs.existsSync(tempVideoPath)) {
        await unlink(tempVideoPath);
      }
      if (fs.existsSync(tempThumbnailPath)) {
        await unlink(tempThumbnailPath);
      }
      throw error;
    }
  }

  /**
   * Generate thumbnail from local video file
   * @param videoPath - Path to video file
   * @param videoId - Video ID for naming
   * @returns Promise<Buffer> - Thumbnail image buffer
   */
  async generateThumbnailFromFile(
    videoPath: string,
    videoId: string
  ): Promise<Buffer> {
    const tempDir = path.join(process.cwd(), 'temp');
    const tempThumbnailPath = path.join(tempDir, `${videoId}_thumb.jpg`);

    try {
      // Create temp directory if it doesn't exist
      if (!fs.existsSync(tempDir)) {
        await mkdir(tempDir, { recursive: true });
      }

      // Generate thumbnail
      await this.generateThumbnail(videoPath, tempThumbnailPath, 1);

      // Read thumbnail buffer
      const thumbnailBuffer = fs.readFileSync(tempThumbnailPath);

      // Clean up temp file
      await unlink(tempThumbnailPath);

      return thumbnailBuffer;
    } catch (error) {
      // Clean up on error
      if (fs.existsSync(tempThumbnailPath)) {
        await unlink(tempThumbnailPath);
      }
      throw error;
    }
  }
}

export default new ThumbnailService();
