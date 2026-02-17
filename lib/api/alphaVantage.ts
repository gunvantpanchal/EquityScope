import axios from 'axios'

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || ''
const BASE_URL = 'https://www.alphavantage.co/query'

/**
 * Get historical data for a stock
 */
export async function getHistoricalData(symbol: string, interval = 'daily') {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        apikey: API_KEY,
        outputsize: 'compact', // Last 100 data points
      },
    })

    return response.data
  } catch (error) {
    console.error('Error fetching historical data:', error)
    return null
  }
}

/**
 * Get technical indicators
 */
export async function getTechnicalIndicators(
  symbol: string,
  indicator: 'SMA' | 'EMA' | 'RSI' | 'MACD',
  interval = 'daily',
  timePeriod = 20
) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: indicator,
        symbol,
        interval,
        time_period: timePeriod,
        series_type: 'close',
        apikey: API_KEY,
      },
    })

    return response.data
  } catch (error) {
    console.error('Error fetching technical indicators:', error)
    return null
  }
}

/**
 * Rate limiter for Alpha Vantage (5 calls per minute)
 */
let lastCallTime = 0
const MIN_INTERVAL = 12000 // 12 seconds between calls

export async function rateLimitedCall<T>(
  fn: () => Promise<T>
): Promise<T | null> {
  const now = Date.now()
  const timeSinceLastCall = now - lastCallTime

  if (timeSinceLastCall < MIN_INTERVAL) {
    const waitTime = MIN_INTERVAL - timeSinceLastCall
    await new Promise((resolve) => setTimeout(resolve, waitTime))
  }

  lastCallTime = Date.now()
  return await fn()
}
