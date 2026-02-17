# Deployment Guide

## Deploying to Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications.

### Prerequisites

- GitHub/GitLab/Bitbucket account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- MongoDB Atlas account (or other MongoDB hosting)

### Step-by-Step Deployment

#### 1. Prepare Your Repository

Ensure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### 2. Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect Next.js configuration

#### 3. Configure Environment Variables

Add the following environment variables in Vercel:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/equityscope
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-generated-secret-key
ALPHA_VANTAGE_API_KEY=your-api-key
NODE_ENV=production
```

**To add environment variables:**
1. Go to Project Settings
2. Click "Environment Variables"
3. Add each variable with its value
4. Select "Production", "Preview", and "Development" environments

#### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be live at `https://your-project.vercel.app`

### Custom Domain

To add a custom domain:

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS settings as instructed
4. Update `NEXTAUTH_URL` environment variable to your custom domain

### Automatic Deployments

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

## Deploying to Other Platforms

### Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables in Netlify dashboard
4. Deploy

**Note:** Netlify requires additional configuration for Next.js API routes. Consider using Vercel instead.

### Railway

1. Create a new project in Railway
2. Connect your GitHub repository
3. Add environment variables
4. Deploy

Railway automatically detects Next.js and configures the deployment.

### AWS (Advanced)

For AWS deployment:

1. Use AWS Amplify for easy deployment
2. Or configure EC2 with PM2:

```bash
# Install PM2
npm install -g pm2

# Build the app
npm run build

# Start with PM2
pm2 start npm --name "equityscope" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t equityscope .
docker run -p 3000:3000 --env-file .env equityscope
```

## MongoDB Setup

### MongoDB Atlas (Recommended)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Configure network access:
   - Add your IP address
   - Or allow access from anywhere (0.0.0.0/0) for cloud deployments
4. Create database user
5. Get connection string
6. Replace username, password, and database name
7. Add to environment variables

### Self-Hosted MongoDB

If self-hosting MongoDB:

```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Connection string
MONGODB_URI=mongodb://localhost:27017/equityscope
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `NEXTAUTH_URL` | Application URL | `https://your-domain.com` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Generate with `openssl rand -base64 32` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key | N/A |
| `NODE_ENV` | Environment mode | `production` |

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test user registration and login
- [ ] Check database connection
- [ ] Verify API endpoints work
- [ ] Test stock screening functionality
- [ ] Test watchlist creation and management
- [ ] Check mobile responsiveness
- [ ] Verify environment variables are set
- [ ] Test authentication flow
- [ ] Monitor application logs

## Performance Optimization

### Next.js Production Build

```bash
npm run build
```

This creates an optimized production build with:
- Server-side rendering
- Static site generation where possible
- Image optimization
- Code splitting
- Minification

### Caching Strategy

1. **Stock Data**: Cached in MongoDB (5 min TTL)
2. **Static Assets**: Cached by CDN
3. **API Responses**: Client-side caching with React Query

### Monitoring

Set up monitoring for:
- Application errors (Sentry)
- Performance metrics (Vercel Analytics)
- Database performance (MongoDB Atlas)
- API rate limits

## Troubleshooting

### Build Failures

**Issue:** Build fails with TypeScript errors
```bash
# Check for type errors
npm run build

# Fix type errors and rebuild
```

**Issue:** Build fails with dependency errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Runtime Errors

**Issue:** Database connection fails
- Check `MONGODB_URI` is correct
- Verify network access in MongoDB Atlas
- Check database user credentials

**Issue:** Authentication not working
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and retry

### Performance Issues

**Issue:** Slow page loads
- Check MongoDB query performance
- Verify images are optimized
- Enable Vercel Analytics for insights

## Scaling

### Horizontal Scaling

Vercel automatically scales based on traffic.

### Database Scaling

For MongoDB Atlas:
1. Upgrade cluster tier for more resources
2. Enable auto-scaling
3. Add read replicas for read-heavy workloads

### CDN Configuration

Vercel includes global CDN by default. For custom CDN:
1. Configure Cloudflare
2. Set up custom caching rules
3. Optimize asset delivery

## Security Considerations

### Production Checklist

- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Set secure password requirements
- [ ] Implement rate limiting for API routes
- [ ] Enable CORS with specific origins
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Regular security updates
- [ ] Implement CSP headers
- [ ] Monitor for vulnerabilities

## Backup and Recovery

### Database Backups

MongoDB Atlas provides automated backups.

For manual backups:
```bash
mongodump --uri="MONGODB_URI" --out=./backup
```

### Code Backups

- Use Git for version control
- Tag releases for easy rollback
- Maintain staging environment

## Cost Optimization

### Vercel

- Free tier: Suitable for personal projects
- Pro tier: $20/month for production apps
- Enterprise: Custom pricing

### MongoDB Atlas

- Free tier: 512MB storage (sufficient for MVP)
- Shared cluster: $9+/month
- Dedicated cluster: $57+/month

### Total Estimated Cost

**MVP/Personal Project:**
- Vercel: Free
- MongoDB Atlas: Free
- **Total: $0/month**

**Production App:**
- Vercel Pro: $20/month
- MongoDB Shared: $9/month
- **Total: $29/month**

## Support

For deployment issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
