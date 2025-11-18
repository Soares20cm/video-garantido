'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Header from '@/components/Header';
import { Video } from '@/types';

export const dynamic = 'force-dynamic';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchVideos();
    }
  }, [query]);

  const searchVideos = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/videos/search?q=${encodeURIComponent(query)}`);
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          Search results for "{query}"
        </h1>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : videos.length === 0 ? (
          <p className="text-gray-500">No videos found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <Link key={video.id} href={`/video/${video.id}`} className="group">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <h3 className="mt-2 font-medium line-clamp-2">{video.title}</h3>
                <p className="text-sm text-gray-600">{video.channel?.name}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
