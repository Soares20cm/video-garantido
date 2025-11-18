'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import Header from '@/components/Header';
import { Video } from '@/types';

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadVideos();
  }, [page]);

  const loadVideos = async () => {
    try {
      const response = await api.get(`/videos/recent?page=${page}&limit=20`);
      if (page === 1) {
        setVideos(response.data.videos);
      } else {
        setVideos((prev) => [...prev, ...response.data.videos]);
      }
      setHasMore(response.data.pages > page);
    } catch (error) {
      console.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Recent Videos</h1>

        {loading && videos.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-300 rounded-lg"></div>
                <div className="mt-2 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No videos yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by uploading a video.</p>
            <div className="mt-6">
              <Link
                href="/register"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-salmon-500 hover:bg-salmon-600"
              >
                Get Started
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <Link key={video.id} href={`/video/${video.id}`} className="group">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {video.status !== 'READY' && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {video.status === 'PROCESSING' ? 'Processing...' : 'Uploading...'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="flex gap-3">
                      {video.channel?.avatarUrl ? (
                        <img
                          src={video.channel.avatarUrl}
                          alt={video.channel.name}
                          className="w-9 h-9 rounded-full flex-shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-300 flex-shrink-0"></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-salmon-600">
                          {video.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{video.channel?.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatViewCount(video.viewCount)} views • {formatDate(video.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
