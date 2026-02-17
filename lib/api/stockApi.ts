import axios from 'axios'
import { Stock, StockSearchResult } from '@/types/stock'
import StockCache from '@/lib/models/StockCache'
import { CACHE_TTL } from '@/constants'

// Mock API service for Indian stocks
// In production, replace with actual API endpoints

const API_BASE_URL = process.env.NEXT_PUBLIC_STOCK_API_URL || ''

/**
 * Get cached stock data or fetch from API
 */
async function getCachedData(
  symbol: string,
  exchange: 'NSE' | 'BSE',
  fetchFn: () => Promise<any>
) {
  try {
    // Try to get from cache
    const cached = await StockCache.findOne({
      symbol: symbol.toUpperCase(),
      exchange,
      expiresAt: { $gt: new Date() },
    })

    if (cached) {
      return cached.data
    }
  } catch (error) {
    // If cache fails, continue to fetch from API
    console.error('Cache read error:', error)
  }

  // Fetch from API
  const data = await fetchFn()

  // Save to cache
  try {
    const expiresAt = new Date(Date.now() + CACHE_TTL.STOCK_DATA)
    await StockCache.findOneAndUpdate(
      { symbol: symbol.toUpperCase(), exchange },
      { data, expiresAt },
      { upsert: true, new: true }
    )
  } catch (error) {
    console.error('Cache write error:', error)
  }

  return data
}

/**
 * Get stock by symbol
 */
export async function getStockBySymbol(
  symbol: string,
  exchange: 'NSE' | 'BSE' = 'NSE'
): Promise<Stock | null> {
  try {
    // For now, return mock data since we don't have API credentials
    // In production, implement actual API call
    const mockStock: Stock = {
      symbol: symbol.toUpperCase(),
      name: `${symbol.toUpperCase()} Limited`,
      exchange,
      price: Math.random() * 1000 + 100,
      change: Math.random() * 20 - 10,
      changePercent: Math.random() * 5 - 2.5,
      marketCap: Math.random() * 1000000000000,
      peRatio: Math.random() * 50 + 5,
      volume: Math.random() * 10000000,
      high52Week: Math.random() * 1200 + 100,
      low52Week: Math.random() * 800 + 50,
      sector: 'IT',
      industry: 'Software',
    }

    return mockStock
  } catch (error) {
    console.error('Error fetching stock:', error)
    return null
  }
}

/**
 * Search stocks by query
 */
export async function searchStocks(
  query: string
): Promise<StockSearchResult[]> {
  try {
    // For now, return mock data
    // In production, implement actual search API
    const mockResults: StockSearchResult[] = [
      { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', exchange: 'NSE' },
      { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', exchange: 'NSE' },
      { symbol: 'INFY', name: 'Infosys Ltd', exchange: 'NSE' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', exchange: 'NSE' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', exchange: 'NSE' },
    ].filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
    )

    return mockResults
  } catch (error) {
    console.error('Error searching stocks:', error)
    return []
  }
}

/**
 * Get multiple stocks with filters
 */
export async function getStocks(filters?: {
  marketCapMin?: number
  marketCapMax?: number
  peRatioMin?: number
  peRatioMax?: number
  priceMin?: number
  priceMax?: number
  volumeMin?: number
  sectors?: string[]
}): Promise<Stock[]> {
  try {
    // For now, return mock data
    // In production, implement actual filtering API
    const mockStocks: Stock[] = [
      {
        symbol: 'RELIANCE',
        name: 'Reliance Industries Ltd',
        exchange: 'NSE',
        price: 2456.75,
        change: 12.5,
        changePercent: 0.51,
        marketCap: 166000000000000,
        peRatio: 28.5,
        volume: 5234567,
        high52Week: 2750,
        low52Week: 2100,
        sector: 'Energy',
        industry: 'Oil & Gas',
      },
      {
        symbol: 'TCS',
        name: 'Tata Consultancy Services Ltd',
        exchange: 'NSE',
        price: 3567.25,
        change: -8.75,
        changePercent: -0.24,
        marketCap: 130000000000000,
        peRatio: 31.2,
        volume: 1876543,
        high52Week: 3900,
        low52Week: 3000,
        sector: 'IT',
        industry: 'Software',
      },
      {
        symbol: 'INFY',
        name: 'Infosys Ltd',
        exchange: 'NSE',
        price: 1456.80,
        change: 5.6,
        changePercent: 0.39,
        marketCap: 60000000000000,
        peRatio: 24.8,
        volume: 3245678,
        high52Week: 1650,
        low52Week: 1200,
        sector: 'IT',
        industry: 'Software',
      },
      {
        symbol: 'HDFCBANK',
        name: 'HDFC Bank Ltd',
        exchange: 'NSE',
        price: 1623.45,
        change: 7.2,
        changePercent: 0.45,
        marketCap: 90000000000000,
        peRatio: 19.5,
        volume: 4567890,
        high52Week: 1750,
        low52Week: 1400,
        sector: 'Banking',
        industry: 'Private Bank',
      },
      {
        symbol: 'ICICIBANK',
        name: 'ICICI Bank Ltd',
        exchange: 'NSE',
        price: 987.65,
        change: -3.4,
        changePercent: -0.34,
        marketCap: 70000000000000,
        peRatio: 17.8,
        volume: 5678901,
        high52Week: 1100,
        low52Week: 800,
        sector: 'Banking',
        industry: 'Private Bank',
      },
    ]

    // Apply filters if provided
    let filtered = mockStocks

    if (filters) {
      if (filters.marketCapMin) {
        filtered = filtered.filter(
          (stock) => stock.marketCap >= filters.marketCapMin!
        )
      }
      if (filters.marketCapMax) {
        filtered = filtered.filter(
          (stock) => stock.marketCap <= filters.marketCapMax!
        )
      }
      if (filters.peRatioMin && filters.peRatioMin > 0) {
        filtered = filtered.filter(
          (stock) => stock.peRatio && stock.peRatio >= filters.peRatioMin!
        )
      }
      if (filters.peRatioMax && filters.peRatioMax > 0) {
        filtered = filtered.filter(
          (stock) => stock.peRatio && stock.peRatio <= filters.peRatioMax!
        )
      }
      if (filters.priceMin) {
        filtered = filtered.filter((stock) => stock.price >= filters.priceMin!)
      }
      if (filters.priceMax) {
        filtered = filtered.filter((stock) => stock.price <= filters.priceMax!)
      }
      if (filters.volumeMin) {
        filtered = filtered.filter(
          (stock) => stock.volume >= filters.volumeMin!
        )
      }
      if (filters.sectors && filters.sectors.length > 0) {
        filtered = filtered.filter((stock) =>
          filters.sectors!.includes(stock.sector)
        )
      }
    }

    return filtered
  } catch (error) {
    console.error('Error fetching stocks:', error)
    return []
  }
}
