# Railway Environment Variables

Copy these environment variables to your Railway project dashboard:

## Required Environment Variables

```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
PORT=5001
```

## How to Set Environment Variables in Railway

1. Go to your Railway project dashboard
2. Click on your backend service
3. Go to "Variables" tab
4. Add each variable with its value
5. Click "Deploy" to apply changes

## Database Setup

1. Add PostgreSQL service to your Railway project
2. Copy the DATABASE_URL from the PostgreSQL service
3. Set it as DATABASE_URL in your backend service variables
4. Railway will automatically run migrations on deployment
