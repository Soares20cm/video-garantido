export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Channel {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  bannerUrl?: string;
  description?: string;
  subscriberCount?: number;
  videoCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Video interface with all properties
export interface Video {
  id: string;
  channelId: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  duration: number;
  status: 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED';
  originalFileUrl: string; // URL of the original uploaded video file
  hlsPlaylistUrl?: string;
  viewCount: number;
  likeCount?: number;
  dislikeCount?: number;
  commentCount?: number;
  createdAt: string;
  updatedAt: string;
  channel?: {
    id: string;
    name: string;
    avatarUrl?: string;
    subscriberCount?: number;
  };
}

export interface UploadProgress {
  videoId: string;
  progress: number;
  status: 'uploading' | 'processing' | 'ready' | 'failed';
  message?: string;
}
