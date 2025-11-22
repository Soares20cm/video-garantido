'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  views: number;
  createdAt: string;
  channel: {
    id: string;
    name: string;
  };
}

export default function MyVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadMyVideos();
  }, [user, router]);

  const loadMyVideos = async () => {
    try {
      setLoading(true);
      // Primeiro pega o canal do usuário
      const channelResponse = await api.get('/channels/me');
      const channel = channelResponse.data;
      
      // Depois pega os vídeos do canal
      const videosResponse = await api.get(`/channels/${channel.id}/videos`);
      setVideos(videosResponse.data);
    } catch (err: any) {
      console.error('Erro ao carregar vídeos:', err);
      setError('Erro ao carregar seus vídeos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('Tem certeza que deseja deletar este vídeo?')) {
      return;
    }

    try {
      await api.delete(`/videos/${videoId}`);
      setVideos(videos.filter(v => v.id !== videoId));
    } catch (err) {
      alert('Erro ao deletar vídeo');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600">Carregando seus vídeos...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Meus Vídeos</h1>
            <p className="mt-2 text-gray-600">
              {videos.length} {videos.length === 1 ? 'vídeo' : 'vídeos'} postados
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {videos.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum vídeo</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece fazendo upload do seu primeiro vídeo.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/upload')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-salmon-600 hover:bg-salmon-700"
                >
                  Fazer Upload
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => router.push(`/video/${video.id}`)}
                  >
                    <div className="relative pb-[56.25%] bg-gray-200">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            className="h-12 w-12 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span>{video.views} visualizações</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(video.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pb-4 flex gap-2">
                    <button
                      onClick={() => router.push(`/video/${video.id}`)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded hover:bg-red-100"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
