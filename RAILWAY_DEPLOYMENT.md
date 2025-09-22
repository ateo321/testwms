# 🚂 Railway Deployment Guide

## Prerequisites
- Railway account (free tier available)
- GitHub repository with your code
- PostgreSQL database (Railway provides this)

## Step 1: Deploy Backend to Railway

### 1.1 Create New Project
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your WMS repository

### 1.2 Configure Backend Service
1. Railway will detect the `backend` folder
2. Set the **Root Directory** to `backend`
3. Railway will automatically detect it's a Node.js project

### 1.3 Set Environment Variables
Go to your backend service → Variables tab and add:

```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
```

**Note**: Railway will set `PORT` automatically

### 1.4 Add PostgreSQL Database
1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a database
4. Copy the `DATABASE_URL` from the PostgreSQL service
5. Set it as `DATABASE_URL` in your backend service

### 1.5 Deploy
1. Railway will automatically build and deploy
2. Check the logs for any errors
3. Your backend will be available at: `https://your-app-name.railway.app`

## Step 2: Deploy Frontend to Vercel

### 2.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set **Root Directory** to `frontend`

### 2.2 Set Environment Variables
Add this environment variable in Vercel:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
```

### 2.3 Deploy
1. Vercel will automatically build and deploy
2. Your frontend will be available at: `https://your-app-name.vercel.app`

## Step 3: Database Setup

### 3.1 Run Migrations
Railway will automatically run migrations during deployment because of the `postinstall` script.

### 3.2 Seed Database (Optional)
If you want to add sample data, you can run:
```bash
# Connect to your Railway database and run:
npx prisma db seed
```

## Troubleshooting

### Common Issues

#### 1. "railpack" Error
- **Cause**: Build configuration issues
- **Solution**: Ensure you have the correct `railway.json` and `nixpacks.toml` files

#### 2. Database Connection Error
- **Cause**: Wrong DATABASE_URL or database not ready
- **Solution**: Check DATABASE_URL format and ensure PostgreSQL service is running

#### 3. Port Binding Error
- **Cause**: Server not binding to 0.0.0.0
- **Solution**: Updated server to bind to `0.0.0.0` instead of `localhost`

#### 4. Prisma Client Error
- **Cause**: Prisma client not generated
- **Solution**: Added `postinstall` script to generate Prisma client

### Build Logs
Check Railway build logs for:
- Node.js version compatibility
- Package installation errors
- TypeScript compilation errors
- Prisma generation errors

### Health Check
Your backend should respond to:
```
GET https://your-backend-url.railway.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "WMS API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

## Environment Variables Reference

### Backend (Railway)
```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
PORT=5001 (set automatically by Railway)
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
```

## Monitoring

### Railway Dashboard
- View build logs
- Monitor resource usage
- Check service health
- View environment variables

### Vercel Dashboard
- View deployment logs
- Monitor performance
- Check build status
- View analytics

## Cost Estimation

### Railway (Free Tier)
- **Backend**: Free (500 hours/month)
- **PostgreSQL**: Free (1GB storage)
- **Total**: $0/month

### Vercel (Free Tier)
- **Frontend**: Free (unlimited static hosting)
- **Total**: $0/month

### Total Monthly Cost: $0 (Free Tier)

## Next Steps

1. **Custom Domain**: Add custom domain to both services
2. **SSL**: Automatic HTTPS with both platforms
3. **Monitoring**: Set up error tracking (Sentry)
4. **CI/CD**: Automatic deployments on git push
5. **Scaling**: Upgrade plans as needed

## Support

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Project Issues**: Create GitHub issue for project-specific problems
