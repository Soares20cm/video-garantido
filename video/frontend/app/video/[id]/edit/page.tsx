'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import { Video } from '@/types';

export default function EditVideoPage() {
  const params = useParams();
  const router = useRouter();
  const [video, setVideo] = useState<Video | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadVideo();
  }, [params.id]);

  const loadVideo = async () => {
    try {
      const response = await api.get(`/videos/${params.id}`);
      setVideo(response.data);
      setTitle(response.data.title);
      setDescription(response.data.description || '');
    } catch (err: any) {
      setError('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || title.length > 100) {
      setError('Title must be between 1 and 100 characters');
      return;
    }

    if (description.length > 5000) {
      setError('Description must not exceed 5000 characters');
      return;
    }

    setSaving(true);

    try {
      await api.put(`/videos/${params.id}`, { title, description });
      setSuccess('Video updated successfully');
      setTimeout(() => router.push(`/video/${params.id}`), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to update video');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);

    try {
      await api.delete(`/videos/${params.id}`);
      router.push('/channel/settings');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to delete video');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Video</h1>

            <form onSubmit={handleSave} className="space-y-6">
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-50 p-4">
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              )}

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />
                <p className="mt-1 text-sm text-gray-500">{title.length}/100 characters</p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={6}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={5000}
                />
                <p className="mt-1 text-sm text-gray-500">{description.length}/5000 characters</p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>

            <hr className="my-8" />

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Danger Zone</h2>
              <p className="text-sm text-gray-600 mb-4">
                Once you delete a video, there is no going back. Please be certain.
              </p>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Video'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
