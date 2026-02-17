export const SECTORS = [
  'IT',
  'Banking',
  'Pharma',
  'Auto',
  'Energy',
  'FMCG',
  'Infrastructure',
  'Telecom',
  'Media',
  'Metals',
  'Realty',
  'Textiles',
  'Chemicals',
] as const

export const EXCHANGES = ['NSE', 'BSE'] as const

export const MARKET_CAP_RANGES = {
  LARGE_CAP: { min: 200000000000, label: 'Large Cap (₹20,000 Cr+)' },
  MID_CAP: {
    min: 50000000000,
    max: 200000000000,
    label: 'Mid Cap (₹5,000 - ₹20,000 Cr)',
  },
  SMALL_CAP: { max: 50000000000, label: 'Small Cap (< ₹5,000 Cr)' },
} as const

export const CACHE_TTL = {
  STOCK_DATA: 5 * 60 * 1000, // 5 minutes
  SEARCH_RESULTS: 10 * 60 * 1000, // 10 minutes
  MARKET_DATA: 1 * 60 * 1000, // 1 minute
} as const
