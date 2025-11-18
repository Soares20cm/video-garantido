'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Header from '@/components/Header';
import Comments from '@/components/Comments';
import { useAuth } from '@/contexts/AuthContext';
import { Video } from '@/types';

export default function VideoPage() {
  const params = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const isOwner = user && video?.channel && video.channel.id === user.id;

  useEffect(() => {
    loadVideo();
    recordView();
    if (user) {
      checkLikeStatus();
      checkSubscriptionStatus();
    }
  }, [params.id, user]);

  const loadVideo = async () => {
    try {
      const response = await api.get(`/videos/${params.id}`);
      setVideo(response.data);
    } catch (err) {
      setError('Video not found');
    } finally {
      setLoading(false);
    }
  };

  const recordView = async () => {
    try {
      await api.post(`/videos/${params.id}/view`);
    } catch (err) {
      // Silently fail
    }
  };

  const checkLikeStatus = async () => {
    try {
      const response = await api.get(`/videos/${params.id}/like-status`);
      if (response.data.liked) setIsLiked(true);
      if (response.data.disliked) setIsDisliked(true);
    } catch (err) {
      // Silently fail
    }
  };

  const checkSubscriptionStatus = async () => {
    if (!video?.channel?.id) return;
    try {
      const response = await api.get(`/channels/${video.channel.id}/subscription-status`);
      setIsSubscribed(response.data.isSubscribed);
    } catch (err) {
      // Silently fail
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like videos');
      return;
    }
    try {
      await api.post(`/videos/${params.id}/like`);
      setIsLiked(!isLiked);
      if (isDisliked) setIsDisliked(false);
      // Reload video to get updated counts
      loadVideo();
    } catch (err) {
      console.error('Failed to like video');
    }
  };

  const handleDislike = async () => {
    if (!user) {
      alert('Please login to dislike videos');
      return;
    }
    try {
      await api.post(`/videos/${params.id}/dislike`);
      setIsDisliked(!isDisliked);
      if (isLiked) setIsLiked(false);
      // Reload video to get updated counts
      loadVideo();
    } catch (err) {
      console.error('Failed to dislike video');
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      alert('Please login to subscribe');
      return;
    }
    if (!video?.channel?.id) return;
    
    try {
      if (isSubscribed) {
        await api.delete(`/channels/${video.channel.id}/subscribe`);
      } else {
        await api.post(`/channels/${video.channel.id}/subscribe`);
      }
      setIsSubscribed(!isSubscribed);
    } catch (err) {
      console.error('Failed to subscribe');
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = video?.title || 'Check out this video';
    
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
      setShowShareMenu(false);
      return;
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Video Not Found</h2>
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
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden aspect-video">
              {video.status === 'READY' ? (
                <video
                  controls
                  className="w-full h-full"
                  poster={video.thumbnailUrl}
                  src={video.originalFileUrl || video.hlsPlaylistUrl || ''}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-lg">
                      {video.status === 'PROCESSING' ? 'Processing video...' : 'Video is being uploaded...'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="mt-4">
              <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
              <div className="mt-2 flex items-center justify-between flex-wrap gap-4">
                <p className="text-sm text-gray-600">
                  {formatViewCount(video.viewCount)} views • {formatDate(video.createdAt)}
                </p>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {/* Like/Dislike */}
                  <div className="flex items-center bg-white rounded-full shadow-sm">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-l-full hover:bg-gray-100 transition ${
                        isLiked ? 'text-salmon-600' : 'text-gray-700'
                      }`}
                    >
                      <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      <span className="text-sm font-medium">{formatViewCount(video.likeCount || 0)}</span>
                    </button>
                    <div className="w-px h-6 bg-gray-300"></div>
                    <button
                      onClick={handleDislike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-r-full hover:bg-gray-100 transition ${
                        isDisliked ? 'text-salmon-600' : 'text-gray-700'
                      }`}
                    >
                      <svg className="w-5 h-5" fill={isDisliked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                      </svg>
                    </button>
                  </div>

                  {/* Share Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span className="text-sm font-medium">Share</span>
                    </button>

                    {/* Share Menu */}
                    {showShareMenu && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
                          <button onClick={() => handleShare('facebook')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3">
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            Facebook
                          </button>
                          <button onClick={() => handleShare('twitter')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3">
                            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                            Twitter
                          </button>
                          <button onClick={() => handleShare('whatsapp')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                            WhatsApp
                          </button>
                          <button onClick={() => handleShare('telegram')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3">
                            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                            Telegram
                          </button>
                          <hr className="my-1" />
                          <button onClick={() => handleShare('copy')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            Copy link
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Edit Button (Owner Only) */}
                  {isOwner && (
                    <Link
                      href={`/video/${video.id}/edit`}
                      className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="text-sm font-medium">Edit</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Channel Info */}
            <div className="mt-6 flex items-start gap-4 p-4 bg-white rounded-lg">
              <Link href={`/channel/${video.channel?.id}`}>
                {video.channel?.avatarUrl ? (
                  <img
                    src={video.channel.avatarUrl}
                    alt={video.channel.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                )}
              </Link>
              <div className="flex-1">
                <Link
                  href={`/channel/${video.channel?.id}`}
                  className="font-medium text-gray-900 hover:text-salmon-600"
                >
                  {video.channel?.name}
                </Link>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatViewCount(video.channel?.subscriberCount || 0)} subscribers
                </p>
                {video.description && (
                  <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{video.description}</p>
                )}
              </div>
              {!isOwner && (
                <button
                  onClick={handleSubscribe}
                  className={`px-6 py-2 rounded-full font-medium transition ${
                    isSubscribed
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-salmon-500 text-white hover:bg-salmon-600'
                  }`}
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              )}
            </div>

            {/* Comments Section */}
            <Comments videoId={video.id} />
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">More from this channel</h3>
            <div className="space-y-4">
              {/* Placeholder for related videos */}
              <p className="text-sm text-gray-500">No more videos available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
