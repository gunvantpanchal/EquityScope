# API Documentation

## Base URL

Development: `http://localhost:3000/api`  
Production: `https://your-domain.com/api`

## Authentication

All endpoints under `/api/watchlist` require authentication. Include the session cookie in your requests.

## Endpoints

### Stocks

#### GET /api/stocks

Get a list of stocks with optional filters.

**Query Parameters:**
- `marketCapMin` (number, optional): Minimum market cap
- `marketCapMax` (number, optional): Maximum market cap
- `peRatioMin` (number, optional): Minimum P/E ratio
- `peRatioMax` (number, optional): Maximum P/E ratio
- `priceMin` (number, optional): Minimum price
- `priceMax` (number, optional): Maximum price
- `volumeMin` (number, optional): Minimum volume
- `sectors` (string, optional): Comma-separated list of sectors

**Example Request:**
```bash
GET /api/stocks?marketCapMin=50000000000&sectors=IT,Banking
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "TCS",
      "name": "Tata Consultancy Services Ltd",
      "exchange": "NSE",
      "price": 3567.25,
      "change": -8.75,
      "changePercent": -0.24,
      "marketCap": 130000000000000,
      "peRatio": 31.2,
      "volume": 1876543,
      "high52Week": 3900,
      "low52Week": 3000,
      "sector": "IT",
      "industry": "Software"
    }
  ]
}
```

#### GET /api/stocks/[symbol]

Get detailed information for a specific stock.

**Path Parameters:**
- `symbol` (string, required): Stock symbol (e.g., "TCS", "RELIANCE")

**Example Request:**
```bash
GET /api/stocks/TCS
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "TCS",
    "name": "Tata Consultancy Services Ltd",
    "exchange": "NSE",
    "price": 3567.25,
    "change": -8.75,
    "changePercent": -0.24,
    "marketCap": 130000000000000,
    "peRatio": 31.2,
    "volume": 1876543,
    "high52Week": 3900,
    "low52Week": 3000,
    "sector": "IT",
    "industry": "Software"
  }
}
```

#### GET /api/stocks/search

Search for stocks by symbol or name.

**Query Parameters:**
- `q` (string, required): Search query

**Example Request:**
```bash
GET /api/stocks/search?q=tcs
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "TCS",
      "name": "Tata Consultancy Services Ltd",
      "exchange": "NSE"
    }
  ]
}
```

### Screener

#### POST /api/screener

Filter stocks using comprehensive criteria.

**Request Body:**
```json
{
  "marketCapMin": 50000000000,
  "marketCapMax": 200000000000,
  "peRatioMin": 15,
  "peRatioMax": 30,
  "priceMin": 1000,
  "priceMax": 5000,
  "volumeMin": 100000,
  "sectors": ["IT", "Banking"],
  "exchange": "NSE"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": [...]
}
```

### Watchlists

#### GET /api/watchlist

Get all watchlists for the authenticated user.

**Authentication:** Required

**Example Request:**
```bash
GET /api/watchlist
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Tech Stocks",
      "stocks": [
        {
          "symbol": "TCS",
          "exchange": "NSE",
          "addedAt": "2024-01-15T10:30:00.000Z"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### POST /api/watchlist

Create a new watchlist.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "My Watchlist"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "My Watchlist",
    "stocks": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/watchlist/[id]

Add or remove a stock from a watchlist.

**Authentication:** Required

**Path Parameters:**
- `id` (string, required): Watchlist ID

**Request Body:**
```json
{
  "symbol": "TCS",
  "exchange": "NSE"
}
```

**Note:** If the stock already exists in the watchlist, it will be removed. Otherwise, it will be added.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "My Watchlist",
    "stocks": [
      {
        "symbol": "TCS",
        "exchange": "NSE",
        "addedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### DELETE /api/watchlist/[id]

Delete a watchlist.

**Authentication:** Required

**Path Parameters:**
- `id` (string, required): Watchlist ID

**Example Response:**
```json
{
  "success": true,
  "message": "Watchlist deleted successfully"
}
```

### Authentication

#### POST /api/auth/register

Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### POST /api/auth/signin

Login with credentials (handled by NextAuth.js).

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing rate limiting using:
- Vercel's built-in rate limiting
- Redis-based rate limiting
- API Gateway rate limiting

## Caching

Stock data is cached in MongoDB with a 5-minute TTL to reduce API calls and improve performance.

## Data Types

### Stock
```typescript
interface Stock {
  symbol: string
  name: string
  exchange: 'NSE' | 'BSE'
  price: number
  change: number
  changePercent: number
  marketCap: number
  peRatio: number | null
  volume: number
  high52Week: number
  low52Week: number
  sector: string
  industry: string
  dividendYield?: number
  beta?: number
  eps?: number
  roe?: number
  debtToEquity?: number
}
```

### Watchlist
```typescript
interface Watchlist {
  _id: string
  userId: string
  name: string
  stocks: Array<{
    symbol: string
    exchange: 'NSE' | 'BSE'
    addedAt: Date
  }>
  createdAt: Date
  updatedAt: Date
}
```
