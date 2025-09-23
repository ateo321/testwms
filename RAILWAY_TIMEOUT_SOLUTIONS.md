# ⏰ Railway Build Timeout Solutions

## Common Timeout Causes

### 1. **Long Build Process** ⏱️
- **Prisma Generate** - Can take 30-60 seconds
- **TypeScript Compilation** - Can take 30-120 seconds
- **npm install** - Can take 60-300 seconds
- **Total Build Time** - Often exceeds Railway's 10-minute limit

### 2. **Large Dependencies** 📦
- **TypeScript** - Heavy compilation
- **Prisma** - Database client generation
- **@types packages** - Multiple type definitions
- **Dev Dependencies** - Including build tools

### 3. **Network Issues** 🌐
- **Slow npm registry** - Package download delays
- **Prisma downloads** - Binary downloads
- **Railway infrastructure** - Regional latency

### 4. **Resource Limits** 💻
- **Memory constraints** - Insufficient RAM
- **CPU limits** - Slow compilation
- **Disk space** - Large node_modules

## 🚀 Solutions

### **Solution 1: Optimize Build Process**

#### **A. Separate Prisma Generation**
```json
// package.json
{
  "scripts": {
    "build": "tsc",
    "postinstall": "prisma generate",
    "start": "node dist/index.js"
  }
}
```

#### **B. Use Production Dependencies Only**
```json
// package.json
{
  "scripts": {
    "build": "npm ci --only=production && prisma generate && tsc",
    "start": "node dist/index.js"
  }
}
```

#### **C. Optimize TypeScript Compilation**
```json
// tsconfig.json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}
```

### **Solution 2: Use Docker with Multi-Stage Build**

#### **Dockerfile (Optimized)**
```dockerfile
# Multi-stage build for faster deployment
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS build
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runtime
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma ./prisma
EXPOSE 5001
CMD ["npm", "start"]
```

### **Solution 3: Railway Configuration**

#### **railway.json (Timeout Settings)**
```json
{
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  },
  "build": {
    "timeout": 600
  }
}
```

### **Solution 4: Optimize Package.json**

#### **Remove Heavy Dev Dependencies**
```json
// package.json - Remove from production
{
  "devDependencies": {
    // Remove these for production builds:
    // "nodemon": "^3.1.4",
    // "ts-node": "^10.9.2",
    // "tsx": "^4.20.5"
  }
}
```

#### **Use npm ci with --production**
```json
// package.json
{
  "scripts": {
    "build": "npm ci --only=production && prisma generate && tsc",
    "start": "node dist/index.js"
  }
}
```

### **Solution 5: Pre-build Prisma Client**

#### **Generate Prisma Client Locally**
```bash
# Run locally before pushing
cd backend
npx prisma generate
git add node_modules/.prisma
git commit -m "Add pre-generated Prisma client"
git push
```

#### **Update package.json**
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### **Solution 6: Use Railway CLI**

#### **Deploy with Custom Timeout**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy with custom settings
railway up --timeout 600
```

## 🔧 **Immediate Fixes**

### **Fix 1: Update railway.json**
```json
{
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300
  },
  "build": {
    "timeout": 600
  }
}
```

### **Fix 2: Optimize package.json Scripts**
```json
{
  "scripts": {
    "build": "tsc",
    "postinstall": "prisma generate",
    "start": "node dist/index.js"
  }
}
```

### **Fix 3: Add .railwayignore**
```
node_modules
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.nyc_output
coverage
.DS_Store
*.log
.vscode
.idea
dist
```

## 📊 **Build Time Optimization**

### **Before (Slow)**
```bash
npm install          # 60-120s
npx prisma generate  # 30-60s
npm run build        # 30-120s
Total: 120-300s (2-5 minutes)
```

### **After (Fast)**
```bash
npm ci --only=production  # 30-60s
npx prisma generate       # 30-60s
tsc                       # 15-30s
Total: 75-150s (1-2.5 minutes)
```

## 🚨 **Emergency Solutions**

### **Solution A: Use Railway's Build Cache**
```bash
# Add to .railwayignore
node_modules
dist
```

### **Solution B: Pre-compile TypeScript**
```bash
# Build locally
npm run build
git add dist/
git commit -m "Add pre-compiled TypeScript"
git push
```

### **Solution C: Use Railway's Buildpacks**
```toml
# buildpacks.toml
[[buildpacks]]
uri = "heroku/nodejs"

[build]
buildCommand = "npm run build"
timeout = 600
```

## 🔍 **Debugging Build Timeouts**

### **Check Build Logs**
1. Go to Railway dashboard
2. Click on your service
3. Go to "Deployments" tab
4. Click on failed deployment
5. Check build logs for timeout location

### **Common Timeout Points**
- `npm install` - Package download
- `npx prisma generate` - Database client generation
- `npm run build` - TypeScript compilation
- `npm start` - Application startup

### **Monitor Build Progress**
```bash
# Add to package.json scripts
"build:verbose": "echo 'Starting build...' && tsc && echo 'Build complete!'"
```

## 🎯 **Recommended Approach**

### **For Your WMS Project:**

1. **Use Docker Multi-Stage Build** (Most Reliable)
2. **Optimize package.json Scripts** (Quick Fix)
3. **Add Build Timeout Settings** (Railway Config)
4. **Pre-generate Prisma Client** (Fastest)

### **Quick Fix (5 minutes):**
```json
// backend/railway.json
{
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300
  },
  "build": {
    "timeout": 600
  }
}
```

```json
// backend/package.json
{
  "scripts": {
    "build": "tsc",
    "postinstall": "prisma generate",
    "start": "node dist/index.js"
  }
}
```

## 📞 **Support**

- **Railway Docs**: https://docs.railway.app
- **Build Timeouts**: https://docs.railway.app/deploy/builds#build-timeouts
- **Docker Builds**: https://docs.railway.app/deploy/dockerfile
- **Project Issues**: Create GitHub issue for project-specific problems

---

**The most common cause of Railway build timeouts is the combination of `npm install` + `prisma generate` + `tsc` taking too long. The solutions above will significantly reduce build time.**
