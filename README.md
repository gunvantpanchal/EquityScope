# EquityScope 📈

A comprehensive stock screening web application for Indian stock markets (NSE/BSE), built with Next.js 16.1.6, TypeScript, and MongoDB.

![EquityScope](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.3-green)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Features

- **Advanced Stock Screening**: Filter stocks by market cap, P/E ratio, price, sector, and more
- **Real-time Data**: Live stock prices and market data from NSE and BSE
- **Watchlists**: Create and manage multiple watchlists to track your favorite stocks
- **Authentication**: Secure user authentication with NextAuth.js v5
- **Responsive Design**: Mobile-first design that works on all devices
- **Stock Details**: Comprehensive stock information with charts and fundamentals
- **Search**: Fast autocomplete search for stocks

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts

### Backend
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js v5
- **Password Hashing**: bcryptjs
- **Validation**: Zod
- **API Client**: Axios

### Stock Data APIs
- Primary: Indian Stock Market API (mock data in development)
- Secondary: Alpha Vantage (for historical data)

## 📋 Prerequisites

- Node.js 18.x or higher
- MongoDB 6.x or higher (local or MongoDB Atlas)
- npm or yarn package manager

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/gunvantpanchal/EquityScope.git
cd EquityScope
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/equityscope

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# Stock APIs (Optional for development)
ALPHA_VANTAGE_API_KEY=your-api-key-here

# App Config
NODE_ENV=development
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Database Setup

If using MongoDB Atlas:
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Add it to `.env` as `MONGODB_URI`

If using local MongoDB:
```bash
# Start MongoDB service
sudo systemctl start mongod

# Use local connection string
MONGODB_URI=mongodb://localhost:27017/equityscope
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Linting

```bash
npm run lint
```

### Code Formatting

```bash
npm run format
```

## 📁 Project Structure

```
EquityScope/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── screener/      # Stock screener
│   │   ├── watchlist/     # Watchlist management
│   │   └── stock/[symbol]/ # Stock details
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth routes
│   │   ├── stocks/        # Stock data endpoints
│   │   ├── screener/      # Screener endpoint
│   │   └── watchlist/     # Watchlist CRUD
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── common/            # Shared components
│   ├── layout/            # Layout components
│   ├── screener/          # Screener components
│   └── stock/             # Stock-related components
├── lib/
│   ├── api/               # API integrations
│   │   ├── stockApi.ts    # Stock data service
│   │   └── alphaVantage.ts # Alpha Vantage service
│   ├── db/                # Database utilities
│   │   ├── mongodb.ts     # MongoDB connection
│   │   └── mongoClient.ts # MongoDB client
│   ├── models/            # Mongoose models
│   │   ├── User.ts
│   │   ├── Watchlist.ts
│   │   ├── Portfolio.ts
│   │   └── StockCache.ts
│   ├── utils/             # Utility functions
│   │   ├── formatters.ts  # Number/date formatters
│   │   ├── calculations.ts # Calculations
│   │   └── validators.ts  # Zod schemas
│   ├── auth.ts            # NextAuth configuration
│   └── utils.ts           # cn() utility
├── types/                 # TypeScript types
│   ├── stock.ts
│   ├── user.ts
│   └── api.ts
├── constants/             # App constants
├── public/                # Static assets
├── docs/                  # Documentation
├── .env.example           # Environment template
├── next.config.js         # Next.js config
├── tailwind.config.ts     # Tailwind config
├── tsconfig.json          # TypeScript config
└── package.json           # Dependencies
```

## 🔑 Key Features Explained

### Stock Screener
Filter stocks using multiple criteria:
- Market capitalization (Large Cap, Mid Cap, Small Cap)
- Price range
- P/E ratio range
- Sectors (IT, Banking, Pharma, etc.)
- Volume

### Watchlists
- Create multiple watchlists
- Add/remove stocks to watchlists
- Track stock performance in real-time
- Delete watchlists

### Stock Details
- Current price and day change
- 52-week high/low
- Market cap and P/E ratio
- Volume and dividend yield
- Financial metrics (EPS, ROE, Debt to Equity)

### Authentication
- Secure registration with password hashing
- Session-based authentication
- Protected routes middleware
- User profile management

## 📚 API Documentation

See [docs/API.md](docs/API.md) for detailed API documentation.

### Main Endpoints

- `GET /api/stocks` - Get filtered stocks
- `GET /api/stocks/[symbol]` - Get stock details
- `GET /api/stocks/search?q={query}` - Search stocks
- `POST /api/screener` - Filter stocks with criteria
- `GET /api/watchlist` - Get user's watchlists
- `POST /api/watchlist` - Create new watchlist
- `PUT /api/watchlist/[id]` - Add/remove stock
- `DELETE /api/watchlist/[id]` - Delete watchlist

## 🎨 UI Components

Built with shadcn/ui:
- Button, Input, Label, Card
- Table, Select, Slider
- Badge, Dialog, Tabs
- Skeleton (loading states)

## 🧪 Testing

### Manual Testing Checklist

1. ✅ Register a new user
2. ✅ Login with credentials
3. ✅ Access screener page
4. ✅ Apply filters to stocks
5. ✅ View stock details
6. ✅ Create a watchlist
7. ✅ Add stocks to watchlist
8. ✅ Remove stocks from watchlist
9. ✅ Delete a watchlist
10. ✅ Sign out

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Environment Variables on Vercel
Add all variables from `.env.example` in Vercel dashboard.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Gunvant Panchal**

- GitHub: [@gunvantpanchal](https://github.com/gunvantpanchal)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [MongoDB](https://www.mongodb.com/)
- [Vercel](https://vercel.com/)

## 📞 Support

For support, open an issue on GitHub.

---

**Note**: This is an MVP version. Stock data is currently mocked for development. For production use, integrate with real stock market APIs with proper authentication and rate limiting.