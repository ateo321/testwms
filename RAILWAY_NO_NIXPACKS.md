# 🚂 Railway Deployment Without Nixpacks

## Overview
This guide shows how to deploy your WMS backend to Railway using alternatives to Nixpacks.

## Option 1: Docker (Recommended) ⭐

### Advantages:
- ✅ Full control over build process
- ✅ Consistent across environments
- ✅ No dependency on package-lock.json
- ✅ Easy to debug and customize

### Configuration:
```dockerfile
# backend/Dockerfile
FROM node:18-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 5001
CMD ["npm", "start"]
```

```json
// backend/railway.json
{
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "healthcheckPath": "/api/health"
  }
}
```

### Deploy:
1. Push to GitHub
2. Railway detects Dockerfile
3. Builds using Docker
4. Deploys automatically

---

## Option 2: Railway Buildpacks

### Advantages:
- ✅ Uses Heroku buildpacks
- ✅ Automatic Node.js detection
- ✅ No Docker knowledge required

### Configuration:
```toml
# backend/buildpacks.toml
[[buildpacks]]
uri = "heroku/nodejs"

[build]
buildCommand = "npm run build"

[run]
startCommand = "npm start"
```

### Deploy:
1. Remove nixpacks.toml
2. Add buildpacks.toml
3. Railway uses buildpacks

---

## Option 3: Procfile

### Advantages:
- ✅ Simple configuration
- ✅ Heroku-compatible
- ✅ Minimal setup

### Configuration:
```
# backend/Procfile
web: npm start
```

### Deploy:
1. Remove nixpacks.toml
2. Add Procfile
3. Railway detects Procfile

---

## Option 4: Package.json Scripts

### Advantages:
- ✅ Uses existing package.json
- ✅ No additional files needed
- ✅ Railway auto-detects

### Configuration:
```json
// backend/package.json
{
  "scripts": {
    "build": "prisma generate && tsc",
    "start": "node dist/index.js",
    "postinstall": "prisma generate"
  }
}
```

### Deploy:
1. Remove nixpacks.toml
2. Railway uses package.json scripts

---

## Option 5: Railway CLI

### Advantages:
- ✅ Direct deployment
- ✅ No GitHub required
- ✅ Full control

### Setup:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy from backend directory
cd backend
railway up
```

### Deploy:
```bash
# Deploy with specific start command
railway up --start "npm start"

# Deploy with build command
railway up --build "npm run build"
```

---

## Comparison Table

| Method | Complexity | Control | Reliability | Speed |
|--------|------------|---------|-------------|-------|
| **Docker** | Medium | High | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Buildpacks** | Low | Medium | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Procfile** | Low | Low | ⭐⭐⭐ | ⭐⭐⭐ |
| **Package.json** | Low | Low | ⭐⭐⭐ | ⭐⭐⭐ |
| **Railway CLI** | Medium | High | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## Recommended Approach

### For Production: Docker
- Most reliable and consistent
- Full control over environment
- Easy to debug issues

### For Development: Package.json Scripts
- Simplest setup
- Uses existing configuration
- Quick deployment

---

## Step-by-Step: Switch to Docker

### 1. Remove Nixpacks
```bash
rm backend/nixpacks.toml
```

### 2. Add Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 5001
CMD ["npm", "start"]
```

### 3. Update Railway Config
```json
// backend/railway.json
{
  "build": {
    "builder": "DOCKERFILE"
  }
}
```

### 4. Deploy
```bash
git add .
git commit -m "Switch to Docker deployment"
git push
```

---

## Troubleshooting

### Docker Build Fails
- Check Dockerfile syntax
- Verify package.json scripts
- Check Railway build logs

### Buildpacks Not Working
- Ensure buildpacks.toml is correct
- Check Heroku buildpack compatibility
- Verify Node.js version

### Procfile Issues
- Check Procfile format
- Ensure start command is correct
- Verify package.json scripts

### Package.json Scripts
- Check script names match Railway expectations
- Verify all dependencies are installed
- Check build and start commands

---

## Environment Variables

All methods support the same environment variables:

```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
PORT=5001 (set automatically by Railway)
```

---

## Next Steps

1. **Choose Method** - Docker recommended for production
2. **Update Configuration** - Add required files
3. **Test Locally** - Verify build process works
4. **Deploy to Railway** - Push changes and monitor
5. **Monitor Logs** - Check Railway dashboard for issues

---

## Support

- **Railway Docs**: https://docs.railway.app
- **Docker Docs**: https://docs.docker.com
- **Heroku Buildpacks**: https://devcenter.heroku.com/articles/buildpacks
- **Project Issues**: Create GitHub issue for project-specific problems
