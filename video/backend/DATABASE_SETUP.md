# Database Setup Guide

## Option 1: Using Docker (Recommended)

If you have Docker installed:

```bash
# Start PostgreSQL and Redis
npm run docker:up

# Run migrations
npx prisma migrate dev --schema=backend/prisma/schema.prisma
```

## Option 2: Local PostgreSQL Installation (Windows)

### Install PostgreSQL

1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Default port is `5432`

### Create Database

Open Command Prompt or PowerShell and run:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE videodb;
CREATE USER videouser WITH PASSWORD 'videopass';
GRANT ALL PRIVILEGES ON DATABASE videodb TO videouser;

# Exit psql
\q
```

### Configure Environment

Create `backend/.env` file:

```env
DATABASE_URL="postgresql://videouser:videopass@localhost:5432/videodb"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key-change-in-production"
```

### Run Migrations

```bash
cd backend
npx prisma migrate dev
```

## Option 3: Using Online Database (Easiest)

### Neon (Free PostgreSQL)

1. Go to https://neon.tech
2. Sign up for free account
3. Create a new project
4. Copy the connection string
5. Update `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
```

### Supabase (Free PostgreSQL)

1. Go to https://supabase.com
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (URI format)
5. Update `backend/.env`

### Run Migrations

```bash
cd backend
npx prisma migrate dev
```

## Verify Setup

Test the database connection:

```bash
cd backend
npm run dev
```

Visit http://localhost:4000/health - should show `"database": "connected"`

## Prisma Studio

View and edit your database with Prisma Studio:

```bash
cd backend
npx prisma studio
```

Opens at http://localhost:5555

## Common Issues

### Connection Refused

- Make sure PostgreSQL is running
- Check if port 5432 is available
- Verify DATABASE_URL is correct

### Authentication Failed

- Check username and password
- Ensure user has proper permissions

### Migration Errors

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```
