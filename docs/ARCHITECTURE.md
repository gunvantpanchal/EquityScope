# Architecture Documentation

## System Overview

EquityScope is a full-stack web application built with modern technologies following a serverless architecture pattern. The application uses Next.js 16.1.6 with the App Router for both frontend and backend, MongoDB for data persistence, and NextAuth.js for authentication.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Next.js App (React 19)                   │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │   Pages    │  │ Components │  │   Hooks    │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              App Router (Server)                      │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │  API Routes│  │ Middleware │  │  SSR Pages │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Business Logic Layer                     │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │   Models   │  │   Utils    │  │   Services │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌──────────────────┐                 ┌──────────────────┐
│   MongoDB Atlas  │                 │   External APIs  │
│                  │                 │                  │
│ • Users          │                 │ • Stock Data API │
│ • Watchlists     │                 │ • Alpha Vantage  │
│ • Portfolios     │                 │                  │
│ • Stock Cache    │                 │                  │
└──────────────────┘                 └──────────────────┘
```

## Component Architecture

### Frontend Layer

#### 1. Pages (App Router)

```
app/
├── (auth)/                 # Authentication pages
│   ├── login/             # Login page
│   └── register/          # Registration page
├── (dashboard)/           # Protected dashboard
│   ├── screener/          # Stock screener
│   ├── watchlist/         # Watchlist management
│   └── stock/[symbol]/    # Stock details
└── page.tsx               # Home page
```

**Key Patterns:**
- Route groups for organization `(auth)`, `(dashboard)`
- Dynamic routes `[symbol]` for stock details
- Layouts for shared UI and authentication

#### 2. Components

```
components/
├── ui/                    # Reusable UI primitives (shadcn/ui)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── table.tsx
│   └── ...
├── common/                # Shared components
│   └── SearchBar.tsx
├── layout/                # Layout components
├── screener/              # Screener-specific
└── stock/                 # Stock-specific
```

**Component Patterns:**
- Client Components: Use `'use client'` for interactivity
- Server Components: Default for static content
- Composition over inheritance
- Props validation with TypeScript

### Backend Layer

#### 1. API Routes

```
app/api/
├── auth/
│   ├── [...nextauth]/    # NextAuth.js handler
│   └── register/         # User registration
├── stocks/
│   ├── route.ts          # List stocks
│   ├── [symbol]/         # Get stock details
│   └── search/           # Search stocks
├── screener/             # Filter stocks
└── watchlist/            # Watchlist CRUD
    ├── route.ts
    └── [id]/
```

**API Patterns:**
- RESTful design
- Consistent response format
- Error handling middleware
- Input validation with Zod

#### 2. Data Layer

```
lib/
├── db/
│   ├── mongodb.ts        # Connection pooling
│   └── mongoClient.ts    # Client instance
├── models/               # Mongoose schemas
│   ├── User.ts
│   ├── Watchlist.ts
│   ├── Portfolio.ts
│   └── StockCache.ts
└── api/                  # External API integrations
    ├── stockApi.ts
    └── alphaVantage.ts
```

## Data Flow

### 1. Authentication Flow

```
User Login Request
    │
    ├─→ Next.js API Route (/api/auth/signin)
    │       │
    │       ├─→ NextAuth.js Credentials Provider
    │       │       │
    │       │       ├─→ MongoDB (Find User)
    │       │       │
    │       │       ├─→ bcrypt.compare (Verify Password)
    │       │       │
    │       │       └─→ Create JWT Session
    │       │
    │       └─→ Set Session Cookie
    │
    └─→ Redirect to Dashboard
```

### 2. Stock Data Flow

```
User Requests Stock Data
    │
    ├─→ Next.js API Route (/api/stocks)
    │       │
    │       ├─→ Check Cache (MongoDB StockCache)
    │       │       │
    │       │       ├─→ Cache Hit: Return Cached Data
    │       │       │
    │       │       └─→ Cache Miss:
    │       │               │
    │       │               ├─→ Fetch from External API
    │       │               │
    │       │               ├─→ Save to Cache (5 min TTL)
    │       │               │
    │       │               └─→ Return Data
    │       │
    │       └─→ Response with Stock Data
    │
    └─→ Display in UI
```

### 3. Watchlist Management Flow

```
Add Stock to Watchlist
    │
    ├─→ Client-side Request
    │       │
    │       ├─→ Check Authentication (middleware)
    │       │       │
    │       │       ├─→ Authenticated: Continue
    │       │       │
    │       │       └─→ Not Authenticated: Redirect to Login
    │       │
    │       ├─→ API Route (/api/watchlist/[id])
    │       │       │
    │       │       ├─→ Validate Input (Zod)
    │       │       │
    │       │       ├─→ Query MongoDB
    │       │       │
    │       │       ├─→ Update Watchlist Document
    │       │       │
    │       │       └─→ Return Updated Data
    │       │
    │       └─→ Update UI State
    │
    └─→ Display Success Message
```

## Database Schema

### User Collection

```typescript
{
  _id: ObjectId,
  email: string (unique, indexed),
  name: string,
  password: string (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Watchlist Collection

```typescript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  name: string,
  stocks: [
    {
      symbol: string,
      exchange: 'NSE' | 'BSE',
      addedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- userId (ascending)
- userId + name (compound)
```

### Portfolio Collection

```typescript
{
  _id: ObjectId,
  userId: ObjectId (unique, indexed),
  holdings: [
    {
      symbol: string,
      exchange: 'NSE' | 'BSE',
      quantity: number,
      avgPrice: number,
      purchaseDate: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### StockCache Collection

```typescript
{
  _id: ObjectId,
  symbol: string (indexed),
  exchange: 'NSE' | 'BSE' (indexed),
  data: Object,
  expiresAt: Date (TTL index),
  createdAt: Date
}

Indexes:
- symbol + exchange (compound)
- expiresAt (TTL index, expires after 0 seconds)
```

## Security Architecture

### 1. Authentication & Authorization

- **Session Management**: JWT-based sessions with NextAuth.js
- **Password Security**: bcrypt hashing with salt rounds
- **Route Protection**: Middleware checks for authenticated sessions
- **CSRF Protection**: Built into NextAuth.js

### 2. Data Security

- **Input Validation**: Zod schemas for all user inputs
- **SQL Injection Prevention**: Mongoose parameterized queries
- **XSS Prevention**: React auto-escapes outputs
- **Secure Headers**: Next.js security headers

### 3. API Security

- **Authentication**: Required for protected endpoints
- **Rate Limiting**: (To be implemented)
- **CORS**: Configured for specific origins
- **Environment Variables**: Sensitive data in env vars

## Performance Optimization

### 1. Caching Strategy

```
┌─────────────────────────────────────────┐
│          Caching Layers                  │
├─────────────────────────────────────────┤
│ 1. Browser Cache (Static Assets)        │
│    - Images, CSS, JS: 1 year             │
│                                          │
│ 2. React Query (Client-side)            │
│    - API responses: 5 minutes            │
│    - Stale-while-revalidate             │
│                                          │
│ 3. MongoDB Cache (Server-side)          │
│    - Stock data: 5 minutes TTL          │
│    - Search results: 10 minutes         │
│                                          │
│ 4. CDN Cache (Vercel Edge)              │
│    - Static pages: Until revalidate     │
│    - API routes: No cache               │
└─────────────────────────────────────────┘
```

### 2. Code Splitting

- **Route-based**: Automatic code splitting per page
- **Component-level**: Dynamic imports for heavy components
- **Third-party**: Separate vendor bundles

### 3. Database Optimization

- **Connection Pooling**: Reuse MongoDB connections
- **Indexes**: Strategic indexes on frequently queried fields
- **Lean Queries**: Only fetch required fields
- **Aggregation Pipeline**: Efficient data transformations

## Scalability Considerations

### Horizontal Scaling

- **Stateless Design**: No server-side state (JWT sessions)
- **Serverless Functions**: Auto-scaling API routes on Vercel
- **Database Scaling**: MongoDB Atlas auto-scaling

### Vertical Scaling

- **Database**: Upgrade cluster tier
- **API**: Optimize queries and add caching
- **Frontend**: Code splitting and lazy loading

## Technology Choices

### Why Next.js?

- Server-side rendering for better SEO
- App Router for modern routing patterns
- Built-in API routes (no separate backend)
- Automatic code splitting
- Image optimization
- TypeScript support

### Why MongoDB?

- Flexible schema for evolving data models
- Horizontal scalability
- Good query performance
- TTL indexes for auto-expiring cache
- MongoDB Atlas for easy deployment

### Why NextAuth.js?

- Built for Next.js
- Multiple authentication providers
- JWT and database sessions
- CSRF protection
- Type-safe

### Why Tailwind CSS?

- Utility-first approach
- Small bundle size
- Consistent design system
- Responsive design utilities
- Dark mode support

## Future Enhancements

### Phase 2 Features

1. **Advanced Charts**: Candlestick charts with TradingView
2. **Real-time Updates**: WebSocket for live prices
3. **Portfolio Tracking**: Complete portfolio management
4. **Peer Comparison**: Compare stocks side-by-side
5. **Price Alerts**: Email/push notifications
6. **Financial Statements**: Detailed company financials
7. **Export Features**: PDF/CSV export
8. **Dark Mode**: Theme switching
9. **Mobile App**: React Native version

### Infrastructure Improvements

1. **Rate Limiting**: Protect APIs from abuse
2. **Monitoring**: Error tracking with Sentry
3. **Analytics**: User behavior analytics
4. **CDN**: Custom CDN for faster delivery
5. **Load Balancing**: Multiple regions
6. **Database Replication**: Read replicas
7. **Background Jobs**: Queue system for heavy tasks
8. **Search Optimization**: Elasticsearch integration

## Development Guidelines

### Code Organization

- Follow Next.js conventions
- Use TypeScript strictly
- Component-driven development
- Atomic design principles

### Testing Strategy

- Unit tests for utilities
- Integration tests for API routes
- E2E tests for critical user flows
- Visual regression testing

### CI/CD Pipeline

```
Push to GitHub
    │
    ├─→ GitHub Actions
    │       │
    │       ├─→ Run Linters
    │       ├─→ Run Type Checks
    │       ├─→ Run Tests
    │       └─→ Build Application
    │
    └─→ Deploy to Vercel
            │
            ├─→ Preview (PR)
            └─→ Production (main branch)
```

## Monitoring and Maintenance

### Application Monitoring

- **Error Tracking**: Sentry (to be implemented)
- **Performance**: Vercel Analytics
- **Uptime**: UptimeRobot or Pingdom
- **Logs**: Vercel logs

### Database Monitoring

- **MongoDB Atlas Monitoring**: Built-in metrics
- **Slow Queries**: Identify and optimize
- **Connection Pool**: Monitor utilization
- **Storage**: Track usage and costs

### Security Monitoring

- **Dependency Scanning**: npm audit
- **Vulnerability Scanning**: Snyk
- **Access Logs**: Monitor unusual activity
- **Regular Updates**: Keep dependencies current
