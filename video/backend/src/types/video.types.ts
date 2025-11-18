export interface CreateVideoRequest {
  title: string;
  description?: string;
}

export interface UpdateVideoRequest {
  title?: string;
  description?: string;
}

export interface VideoResponse {
  id: string;
  channelId: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  duration: number;
  status: string;
  hlsPlaylistUrl?: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  channel?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface UploadProgressData {
  videoId: string;
  progress: number;
  status: 'uploading' | 'processing' | 'ready' | 'failed';
  message?: string;
}
