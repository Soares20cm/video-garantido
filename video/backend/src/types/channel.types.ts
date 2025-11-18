export interface CreateChannelRequest {
  name: string;
  description?: string;
}

export interface UpdateChannelRequest {
  name?: string;
  description?: string;
}

export interface ChannelResponse {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  description?: string;
  videoCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
