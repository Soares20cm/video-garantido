# Quick Start Guide

## Prerequisites

Choose ONE of the following options:

### Option A: With Docker (Recommended)
- Docker Desktop installed

### Option B: Without Docker
- PostgreSQL 15+ installed locally
- Redis 7+ installed locally (optional, for video processing)
- Node.js 20+ installed

### Option C: Cloud Database (Easiest)
- Free account on Neon.tech or Supabase.com
- Node.js 20+ installed

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

**Option A - Docker:**
```bash
npm run docker:up
```

**Option B - Local PostgreSQL:**
Follow instructions in `backend/DATABASE_SETUP.md`

**Option C - Cloud Database:**
1. Create database on Neon.tech or Supabase.com
2. Copy connection string
3. Create `backend/.env`:
```env
DATABASE_URL="your-connection-string-here"
JWT_SECRET="your-secret-key"
```

### 3. Run Database Migrations

```bash
cd backend
npx prisma migrate dev --name init
```

### 4. (Optional) Seed Test Data

```bash
cd backend
npm run db:seed
```

This creates a test user:
- Email: test@example.com
- Password: password123

### 5. Start Development Servers

**Start both frontend and backend:**
```bash
npm run dev
```

**Or start individually:**
```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Health Check: http://localhost:4000/health
- Prisma Studio: `cd backend && npx prisma studio` (http://localhost:5555)

## Next Steps

1. Test the API health endpoint
2. Explore the database with Prisma Studio
3. Start implementing features from the task list
4. Check `backend/DATABASE_SETUP.md` for detailed database setup

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
# Windows: Check Services or Task Manager

# Test connection
cd backend
npx prisma studio
```

### Port Already in Use

```bash
# Change ports in .env files:
# Backend: PORT=4001
# Frontend: Update next.config.js
```

### Migration Errors

```bash
cd backend
npx prisma migrate reset  # WARNING: Deletes all data
npx prisma generate
npx prisma migrate dev
```

## Development Workflow

1. Make changes to Prisma schema: `backend/prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name description`
3. Prisma Client is auto-generated
4. Use in code: `import prisma from './config/database'`

## Useful Commands

```bash
# View database
cd backend && npx prisma studio

# Reset database
cd backend && npm run prisma:reset

# Generate Prisma client
cd backend && npm run prisma:generate

# Create migration
cd backend && npx prisma migrate dev --name migration_name
```
