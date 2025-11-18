'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Channel, Video } from '@/types';

export default function ChannelPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwner = user && channel && channel.userId === user.id;

  useEffect(() => {
    loadChannel();
    loadVideos();
  }, [params.id]);

  const loadChannel = async () => {
    try {
      const response = await api.get(`/channels/${params.id}`);
      setChannel(response.data);
    } catch (err) {
      setError('Channel not found');
    } finally {
      setLoading(false);
    }
  };

  const loadVideos = async () => {
    try {
      const response = await api.get(`/channels/${params.id}/videos`);
      setVideos(response.data.videos);
    } catch (err) {
      console.error('Failed to load videos');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Channel Not Found</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <Link href="/" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Channel Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {channel.avatarUrl ? (
                <img src={channel.avatarUrl} alt={channel.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{channel.name}</h1>
              {channel.description && (
                <p className="mt-2 text-gray-600">{channel.description}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                {channel.videoCount || 0} videos
              </p>
              {isOwner && (
                <div className="mt-4 flex gap-3">
                  <Link
                    href="/channel/settings"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Edit Channel
                  </Link>
                  <Link
                    href="/upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Upload Video
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Videos</h2>
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No videos yet</p>
            {isOwner && (
              <Link
                href="/upload"
                className="mt-4 inline-block text-primary-600 hover:text-primary-700"
              >
                Upload your first video
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <Link
                key={video.id}
                href={`/video/${video.id}`}
                className="group"
              >
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="mt-2">
                  <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-primary-600">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {video.viewCount} views
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
