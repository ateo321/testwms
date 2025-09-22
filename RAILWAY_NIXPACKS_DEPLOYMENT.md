# 🚂 Railway Deployment with Nixpacks (No Docker)

## Overview
This guide shows how to deploy your WMS backend to Railway using Nixpacks (automatic detection) instead of Docker.

## Prerequisites
- Railway account (free tier available)
- GitHub repository with your code
- PostgreSQL database (Railway provides this)

## Step 1: Prepare Your Repository

### 1.1 Ensure Required Files Exist
Make sure these files are in your `backend/` directory:
- `package.json` ✅
- `package-lock.json` ✅
- `nixpacks.toml` ✅
- `railway.json` ✅
- `src/` directory with your code ✅

### 1.2 Verify Package.json Scripts
Your `backend/package.json` should have:
```json
{
  "scripts": {
    "build": "prisma generate && tsc",
    "start": "node dist/index.js",
    "postinstall": "prisma generate"
  }
}
```

## Step 2: Deploy to Railway

### 2.1 Create New Project
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your WMS repository

### 2.2 Configure Backend Service
1. Railway will automatically detect the `backend/` folder
2. Set the **Root Directory** to `backend`
3. Railway will use Nixpacks to build your Node.js app

### 2.3 Add PostgreSQL Database
1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will create a PostgreSQL database
4. Copy the `DATABASE_URL` from the PostgreSQL service

### 2.4 Set Environment Variables
Go to your backend service → Variables tab and add:

```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
```

**Note**: Railway will automatically set `PORT` variable

## Step 3: Deploy Frontend to Vercel

### 3.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set **Root Directory** to `frontend`

### 3.2 Set Environment Variables
Add this environment variable in Vercel:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
```

### 3.3 Deploy
Vercel will automatically build and deploy your Next.js app.

## Step 4: Database Setup

### 4.1 Automatic Migrations
Railway will automatically run Prisma migrations because of the `postinstall` script in your `package.json`.

### 4.2 Manual Database Setup (if needed)
If you need to seed the database, you can run:
```bash
# Connect to your Railway database and run:
npx prisma db seed
```

## How Nixpacks Works

### Automatic Detection
Railway's Nixpacks automatically detects:
- **Node.js project** from `package.json`
- **TypeScript** from `tsconfig.json`
- **Prisma** from `prisma/schema.prisma`
- **Build commands** from `package.json` scripts

### Build Process
1. **Setup**: Install Node.js 18
2. **Install**: Run `npm ci` to install dependencies
3. **Build**: Run `npm run build` to compile TypeScript
4. **Start**: Run `npm start` to start the application

### Custom Configuration
Your `nixpacks.toml` file customizes the build:
```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

## Troubleshooting

### Common Issues

#### 1. Build Fails
- **Check**: Railway build logs
- **Solution**: Ensure all dependencies are in `package.json`
- **Verify**: TypeScript compilation works locally

#### 2. Database Connection Error
- **Check**: `DATABASE_URL` environment variable
- **Solution**: Copy correct URL from PostgreSQL service
- **Verify**: Database is running and accessible

#### 3. Prisma Client Error
- **Check**: `postinstall` script in `package.json`
- **Solution**: Ensure `prisma generate` runs after install
- **Verify**: Prisma schema is valid

#### 4. Port Binding Error
- **Check**: Server binds to `0.0.0.0` not `localhost`
- **Solution**: Use `app.listen(PORT, '0.0.0.0')`
- **Verify**: Railway sets `PORT` environment variable

### Debugging Steps

#### 1. Check Build Logs
1. Go to Railway dashboard
2. Click on your backend service
3. Go to "Deployments" tab
4. Click on latest deployment
5. View build logs for errors

#### 2. Check Runtime Logs
1. Go to "Logs" tab in your service
2. Look for application startup messages
3. Check for any runtime errors

#### 3. Test Health Check
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

## Advantages of Nixpacks

### ✅ Pros
- **Automatic Detection**: No manual configuration needed
- **Fast Builds**: Optimized for Node.js applications
- **Easy Updates**: Just push to GitHub
- **No Docker Knowledge**: No need to understand Docker
- **Railway Optimized**: Built specifically for Railway

### ❌ Cons
- **Less Control**: Limited customization compared to Docker
- **Platform Specific**: Only works on Railway
- **Debugging**: Harder to debug build issues

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
- **Build Status**: Check if builds are successful
- **Runtime Logs**: Monitor application logs
- **Resource Usage**: CPU and memory usage
- **Health Checks**: Automatic health monitoring

### Vercel Dashboard
- **Deployment Status**: Check frontend deployments
- **Performance**: Monitor page load times
- **Analytics**: User traffic and behavior

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

1. **Deploy Backend**: Follow Railway deployment steps
2. **Deploy Frontend**: Follow Vercel deployment steps
3. **Test Application**: Verify all functionality works
4. **Custom Domain**: Add your own domain (optional)
5. **Monitoring**: Set up error tracking and analytics

## Support

- **Railway Docs**: https://docs.railway.app
- **Nixpacks Docs**: https://nixpacks.com
- **Vercel Docs**: https://vercel.com/docs
- **Project Issues**: Create GitHub issue for project-specific problems
