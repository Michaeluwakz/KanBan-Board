# Deployment Guide

This guide covers different deployment options for the Kanban Board application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [Vercel Deployment](#vercel-deployment)
- [Railway Deployment](#railway-deployment)
- [AWS Deployment](#aws-deployment)
- [Database Setup](#database-setup)

## Prerequisites

- PostgreSQL database (local or hosted)
- Node.js 18+ (for non-Docker deployments)
- Domain name (optional, for production)

## Environment Variables

Create a `.env.production` file with the following variables:

\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="<generated-secret>"

# OAuth Providers
GOOGLE_CLIENT_ID="<your-google-client-id>"
GOOGLE_CLIENT_SECRET="<your-google-client-secret>"
GITHUB_ID="<your-github-id>"
GITHUB_SECRET="<your-github-secret>"

# Socket.io
SOCKET_URL="https://yourdomain.com"

# File Upload (Optional)
CLOUDINARY_URL="<cloudinary-url>"
\`\`\`

Generate a secure `NEXTAUTH_SECRET`:
\`\`\`bash
openssl rand -base64 32
\`\`\`

## Docker Deployment

### 1. Local Docker Setup

\`\`\`bash
# Build and run with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f app

# Stop services
docker-compose down
\`\`\`

### 2. Production Docker Setup

\`\`\`bash
# Build production image
docker build -t kanban-board:latest .

# Run with environment file
docker run -d \
  --name kanban-board \
  -p 3000:3000 \
  --env-file .env.production \
  kanban-board:latest
\`\`\`

### 3. Docker Registry

\`\`\`bash
# Tag image
docker tag kanban-board:latest registry.example.com/kanban-board:latest

# Push to registry
docker push registry.example.com/kanban-board:latest
\`\`\`

## Vercel Deployment

### 1. Via Vercel CLI

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
\`\`\`

### 2. Via GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Configure environment variables
5. Deploy

### 3. Database Setup for Vercel

Use a managed PostgreSQL service:
- **Neon** (Recommended for Vercel)
- **Supabase**
- **Railway**
- **AWS RDS**

Configure `DATABASE_URL` in Vercel environment variables.

### 4. Post-deployment

\`\`\`bash
# Run migrations on Vercel
vercel env pull .env.local
npx prisma migrate deploy
\`\`\`

## Railway Deployment

### 1. Using Railway CLI

\`\`\`bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add

# Deploy
railway up
\`\`\`

### 2. Using Railway Dashboard

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL service
4. Deploy from GitHub
5. Configure environment variables
6. Deploy

### 3. Configure Database

Railway provides automatic `DATABASE_URL`. Add other env vars:

\`\`\`
NEXTAUTH_URL=${{ RAILWAY_PUBLIC_DOMAIN }}
NEXTAUTH_SECRET=<your-secret>
\`\`\`

## AWS Deployment

### 1. Using ECS (Elastic Container Service)

\`\`\`bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

docker build -t kanban-board .
docker tag kanban-board:latest <account>.dkr.ecr.us-east-1.amazonaws.com/kanban-board:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/kanban-board:latest

# Create ECS task definition and service
aws ecs create-service --cli-input-json file://ecs-service.json
\`\`\`

### 2. Using EC2

\`\`\`bash
# SSH into EC2 instance
ssh -i key.pem ec2-user@<instance-ip>

# Install Docker
sudo yum update -y
sudo yum install docker -y
sudo service docker start

# Clone and run
git clone <repo-url>
cd kanban-board
docker-compose up -d
\`\`\`

### 3. Using Amplify

1. Push to GitHub
2. Go to AWS Amplify Console
3. Connect repository
4. Configure build settings
5. Add environment variables
6. Deploy

## Database Setup

### Using Neon (Serverless PostgreSQL)

1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Update `DATABASE_URL`
5. Run migrations:

\`\`\`bash
npx prisma migrate deploy
\`\`\`

### Using Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy connection string (use connection pooling)
5. Update `DATABASE_URL`
6. Run migrations

### Using RDS (AWS)

1. Create RDS PostgreSQL instance
2. Configure security groups
3. Get connection endpoint
4. Create database user
5. Update `DATABASE_URL`

## SSL/HTTPS Setup

### Using Vercel/Railway
- Automatic HTTPS

### Using Custom Domain

1. Configure DNS:
\`\`\`
A Record: @ -> <your-server-ip>
CNAME: www -> <your-domain>
\`\`\`

2. Set up Nginx reverse proxy:

\`\`\`nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

3. Install SSL with Let's Encrypt:
\`\`\`bash
sudo certbot --nginx -d yourdomain.com
\`\`\`

## Performance Optimization

### 1. Enable Caching

Add to `next.config.ts`:
\`\`\`typescript
module.exports = {
  experimental: {
    outputStandalone: true,
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}
\`\`\`

### 2. Database Optimization

- Use connection pooling (PgBouncer)
- Add database indexes
- Enable query caching

### 3. CDN Setup

Use Vercel Edge Network or CloudFront for static assets.

## Monitoring

### 1. Error Tracking

Integrate Sentry:
\`\`\`bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
\`\`\`

### 2. Performance Monitoring

- Vercel Analytics
- Google Analytics
- PostHog

### 3. Uptime Monitoring

- UptimeRobot
- Pingdom
- StatusCake

## Backup Strategy

### Database Backups

\`\`\`bash
# Automated daily backups
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup_20240101.sql
\`\`\`

### File Backups

- Store in S3/CloudStorage
- Use automated backup tools

## Troubleshooting

### Build Failures

1. Check Node.js version
2. Clear `.next` cache
3. Verify environment variables
4. Check Prisma client generation

### Database Connection Issues

1. Verify `DATABASE_URL`
2. Check firewall/security groups
3. Test connection: `psql $DATABASE_URL`
4. Check SSL mode

### Socket.io Issues

1. Ensure WebSocket support
2. Check proxy configuration
3. Verify CORS settings

## Security Checklist

- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS
- [ ] Set up firewall rules
- [ ] Use environment variables for secrets
- [ ] Enable database SSL
- [ ] Set up rate limiting
- [ ] Configure CSP headers
- [ ] Regular security updates

## Support

For deployment issues, contact support@kanbanboard.com or open an issue on GitHub.


