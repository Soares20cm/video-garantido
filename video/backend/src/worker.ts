import dotenv from 'dotenv';

dotenv.config();

console.log('🔧 Video processing worker starting...');

// Worker implementation will be added in task 7
// This is a placeholder for the video processing worker

process.on('SIGTERM', () => {
  console.log('Worker shutting down...');
  process.exit(0);
});
