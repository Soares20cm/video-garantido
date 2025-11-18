import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Criar usuário de exemplo
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@videohub.com' },
    update: {},
    create: {
      email: 'demo@videohub.com',
      passwordHash: hashedPassword,
    },
  });

  console.log('✅ User created:', user.email);

  // Criar canal
  const channel = await prisma.channel.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      name: 'Tech Tutorials',
      description: 'Learn programming, web development, and technology with easy-to-follow tutorials!',
      avatarUrl: 'https://ui-avatars.com/api/?name=Tech+Tutorials&background=ff7a5c&color=fff&size=200',
    },
  });

  console.log('✅ Channel created:', channel.name);

  // Criar vídeos de exemplo
  const videos = [
    {
      title: 'Introduction to React Hooks - Complete Guide',
      description: 'Learn everything about React Hooks including useState, useEffect, useContext, and custom hooks. Perfect for beginners and intermediate developers.',
      thumbnailUrl: 'https://picsum.photos/seed/react1/640/360',
      originalFileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: 596,
      viewCount: 15420,
      status: 'READY' as const,
    },
    {
      title: 'Building a REST API with Node.js and Express',
      description: 'Step-by-step tutorial on creating a professional REST API using Node.js, Express, and MongoDB. Includes authentication and best practices.',
      thumbnailUrl: 'https://picsum.photos/seed/nodejs1/640/360',
      originalFileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      duration: 653,
      viewCount: 8932,
      status: 'READY' as const,
    },
    {
      title: 'CSS Grid Layout - Master Modern Layouts',
      description: 'Master CSS Grid and create beautiful, responsive layouts. Learn grid-template-areas, auto-fit, auto-fill, and advanced techniques.',
      thumbnailUrl: 'https://picsum.photos/seed/css1/640/360',
      originalFileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: 15,
      viewCount: 12567,
      status: 'READY' as const,
    },
    {
      title: 'TypeScript for Beginners - Full Course',
      description: 'Complete TypeScript course covering types, interfaces, generics, decorators, and real-world projects. No prior TypeScript knowledge required!',
      thumbnailUrl: 'https://picsum.photos/seed/typescript1/640/360',
      originalFileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      duration: 15,
      viewCount: 23891,
      status: 'READY' as const,
    },
    {
      title: 'Docker Crash Course - Containerize Your Apps',
      description: 'Learn Docker from scratch! Understand containers, images, volumes, networks, and Docker Compose. Deploy your first containerized application.',
      thumbnailUrl: 'https://picsum.photos/seed/docker1/640/360',
      originalFileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      duration: 60,
      viewCount: 19234,
      status: 'READY' as const,
    },
    {
      title: 'Git and GitHub for Beginners',
      description: 'Master version control with Git and GitHub. Learn commits, branches, merging, pull requests, and collaboration workflows.',
      thumbnailUrl: 'https://picsum.photos/seed/git1/640/360',
      originalFileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      duration: 15,
      viewCount: 31245,
      status: 'READY' as const,
    },
    {
      title: 'Next.js 14 - Build Full-Stack Apps',
      description: 'Build modern full-stack applications with Next.js 14. Learn App Router, Server Components, Server Actions, and deployment.',
      thumbnailUrl: 'https://picsum.photos/seed/nextjs1/640/360',
      originalFileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      duration: 15,
      viewCount: 17823,
      status: 'READY' as const,
    },
    {
      title: 'PostgreSQL Database Design Best Practices',
      description: 'Learn database design, normalization, indexing, and query optimization. Build scalable and efficient PostgreSQL databases.',
      thumbnailUrl: 'https://picsum.photos/seed/postgres1/640/360',
      originalFileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      duration: 888,
      viewCount: 9876,
      status: 'READY' as const,
    },
  ];

  for (const videoData of videos) {
    const video = await prisma.video.create({
      data: {
        ...videoData,
        channelId: channel.id,
      },
    });
    console.log('✅ Video created:', video.title);
  }

  console.log('🎉 Seed completed successfully!');
  console.log('\n📧 Login credentials:');
  console.log('   Email: demo@videohub.com');
  console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
