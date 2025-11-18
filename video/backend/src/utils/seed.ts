import prisma from '../config/database';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        passwordHash: hashedPassword,
      },
    });

    console.log('✅ Created test user:', user.email);

    // Create test channel
    const channel = await prisma.channel.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        name: 'Test Channel',
        description: 'This is a test channel for development',
      },
    });

    console.log('✅ Created test channel:', channel.name);

    console.log('\n🎉 Seeding completed!');
    console.log('\nTest credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
