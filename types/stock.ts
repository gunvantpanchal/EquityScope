export interface Stock {
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

export interface StockFilters {
  marketCapMin?: number
  marketCapMax?: number
  peRatioMin?: number
  peRatioMax?: number
  priceMin?: number
  priceMax?: number
  volumeMin?: number
  sectors?: string[]
  industries?: string[]
  exchange?: 'NSE' | 'BSE' | 'ALL'
}

export interface StockSearchResult {
  symbol: string
  name: string
  exchange: 'NSE' | 'BSE'
}

export interface HistoricalData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface StockDetails extends Stock {
  about?: string
  revenue?: number
  profit?: number
  historicalData?: HistoricalData[]
}
