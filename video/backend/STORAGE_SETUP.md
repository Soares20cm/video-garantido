# Storage Setup Guide

The platform supports both AWS S3 and Cloudflare R2 for file storage.

## Option 1: AWS S3 (Recommended for Production)

### 1. Create S3 Bucket

1. Go to AWS Console > S3
2. Click "Create bucket"
3. Choose a unique bucket name (e.g., `my-video-platform`)
4. Select your region
5. Uncheck "Block all public access" (we'll use CloudFront for CDN)
6. Create bucket

### 2. Configure CORS

Add CORS configuration to your bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### 3. Create IAM User

1. Go to IAM > Users > Add user
2. Choose a username (e.g., `video-platform-uploader`)
3. Select "Programmatic access"
4. Attach policy: `AmazonS3FullAccess` (or create custom policy)
5. Save Access Key ID and Secret Access Key

### 4. Setup CloudFront (Optional but Recommended)

1. Go to CloudFront > Create Distribution
2. Origin Domain: Select your S3 bucket
3. Origin Access: Use OAI (Origin Access Identity)
4. Viewer Protocol Policy: Redirect HTTP to HTTPS
5. Cache Policy: CachingOptimized
6. Create distribution
7. Copy the CloudFront domain name

### 5. Configure Environment Variables

```env
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1
S3_BUCKET=my-video-platform
CDN_URL=https://d1234567890.cloudfront.net
```

## Option 2: Cloudflare R2 (Cost-Effective)

### 1. Create R2 Bucket

1. Go to Cloudflare Dashboard > R2
2. Click "Create bucket"
3. Choose a bucket name
4. Create bucket

### 2. Configure CORS

In bucket settings, add CORS policy:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"]
  }
]
```

### 3. Create API Token

1. Go to R2 > Manage R2 API Tokens
2. Create API Token
3. Permissions: Object Read & Write
4. Save Access Key ID and Secret Access Key

### 4. Get R2 Endpoint

Your R2 endpoint will be:
```
https://<account-id>.r2.cloudflarestorage.com
```

### 5. Configure Environment Variables

```env
AWS_ACCESS_KEY_ID=your-r2-access-key-id
AWS_SECRET_ACCESS_KEY=your-r2-secret-access-key
AWS_REGION=auto
S3_BUCKET=my-video-platform
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
CDN_URL=https://your-custom-domain.com
```

### 6. Setup Custom Domain (Optional)

1. Go to your R2 bucket settings
2. Add custom domain
3. Update DNS records as instructed
4. Use custom domain as CDN_URL

## Option 3: Local Storage (Development Only)

For local development without cloud storage:

1. Create a local uploads directory:
```bash
mkdir -p backend/uploads
```

2. The storage service will fall back to local file system if AWS credentials are not configured

3. Files will be stored in `backend/uploads/`

**Note:** This is NOT recommended for production!

## Testing Storage Configuration

Create a test file to verify your storage setup:

```typescript
// backend/src/test-storage.ts
import storageService from './services/storage.service';
import fs from 'fs';

async function testStorage() {
  if (!storageService.isConfigured()) {
    console.log('❌ Storage is not configured');
    return;
  }

  try {
    // Create a test file
    const testContent = Buffer.from('Hello, World!');
    const url = await storageService.uploadFile(
      testContent,
      'test/hello.txt',
      'text/plain'
    );

    console.log('✅ Upload successful!');
    console.log('URL:', url);

    // Clean up
    await storageService.deleteFile('test/hello.txt');
    console.log('✅ Delete successful!');
  } catch (error) {
    console.error('❌ Storage test failed:', error);
  }
}

testStorage();
```

Run the test:
```bash
cd backend
npx tsx src/test-storage.ts
```

## Storage Structure

Files are organized as follows:

```
bucket/
├── videos/
│   └── {video-id}/
│       ├── original/
│       │   └── video.mp4
│       ├── 1080p/
│       │   ├── playlist.m3u8
│       │   └── segment_*.ts
│       ├── 720p/
│       │   ├── playlist.m3u8
│       │   └── segment_*.ts
│       ├── 480p/
│       │   └── ...
│       ├── 360p/
│       │   └── ...
│       └── thumbnails/
│           ├── default.jpg
│           └── custom.jpg
└── avatars/
    └── {channel-id}/
        └── avatar.jpg
```

## Cost Considerations

### AWS S3 Pricing (Approximate)
- Storage: $0.023/GB/month
- Data transfer out: $0.09/GB
- Requests: $0.0004 per 1,000 PUT requests

### Cloudflare R2 Pricing
- Storage: $0.015/GB/month
- Data transfer: FREE (no egress fees!)
- Requests: $0.36 per million Class A operations

**Recommendation:** Use Cloudflare R2 for better pricing, especially for video platforms with high bandwidth usage.

## Security Best Practices

1. **Never commit credentials** - Use environment variables
2. **Use IAM roles** in production (AWS)
3. **Enable versioning** for backup
4. **Set up lifecycle policies** to delete old files
5. **Use signed URLs** for private content (future feature)
6. **Enable server-side encryption**
7. **Monitor usage** and set up billing alerts

## Troubleshooting

### Upload Fails

- Check AWS credentials are correct
- Verify bucket name and region
- Check CORS configuration
- Ensure IAM user has proper permissions

### Files Not Accessible

- Check bucket public access settings
- Verify CDN_URL is correct
- Check CloudFront distribution status
- Verify CORS headers

### Slow Uploads

- Use multipart upload for large files (already implemented)
- Consider using Transfer Acceleration (AWS S3)
- Check network connection
- Use CloudFront for better performance
