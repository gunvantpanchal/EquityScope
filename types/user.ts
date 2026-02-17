export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface WatchlistStock {
  symbol: string
  exchange: 'NSE' | 'BSE'
  addedAt: Date
}

export interface Watchlist {
  id: string
  userId: string
  name: string
  stocks: WatchlistStock[]
  createdAt: Date
  updatedAt: Date
}

export interface PortfolioHolding {
  symbol: string
  exchange: 'NSE' | 'BSE'
  quantity: number
  avgPrice: number
  purchaseDate: Date
}

export interface Portfolio {
  id: string
  userId: string
  holdings: PortfolioHolding[]
  createdAt: Date
  updatedAt: Date
}

export interface UserSession {
  user: {
    id: string
    email: string
    name: string
  }
  expires: string
}
