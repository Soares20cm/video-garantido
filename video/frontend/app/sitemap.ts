import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  
  try {
    // Buscar todos os vídeos
    const response = await fetch(`${apiUrl}/api/videos/recent?limit=1000`, {
      next: { revalidate: 3600 }, // Revalidar a cada hora
    });
    const data = await response.json();
    
    const videos = data.videos.map((video: any) => ({
      url: `${baseUrl}/video/${video.id}`,
      lastModified: new Date(video.updatedAt),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));
    
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/search`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/register`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/login`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      ...videos,
    ];
  } catch (error) {
    // Fallback se a API não estiver disponível
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
