/**
 * Calculate percentage change between two values
 * @param current - Current value
 * @param previous - Previous value
 * @returns Percentage change
 */
export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

/**
 * Calculate absolute change between two values
 * @param current - Current value
 * @param previous - Previous value
 * @returns Absolute change
 */
export function calculateAbsoluteChange(
  current: number,
  previous: number
): number {
  return current - previous
}

/**
 * Calculate Simple Moving Average
 * @param data - Array of numbers
 * @param period - Period for SMA
 * @returns SMA value or null if insufficient data
 */
export function calculateSMA(data: number[], period: number): number | null {
  if (data.length < period) return null

  const sum = data.slice(-period).reduce((acc, val) => acc + val, 0)
  return sum / period
}

/**
 * Calculate portfolio value
 * @param holdings - Array of holdings with quantity and current price
 * @returns Total portfolio value
 */
export function calculatePortfolioValue(
  holdings: Array<{ quantity: number; currentPrice: number }>
): number {
  return holdings.reduce(
    (total, holding) => total + holding.quantity * holding.currentPrice,
    0
  )
}

/**
 * Calculate gain/loss for a holding
 * @param quantity - Number of shares
 * @param avgPrice - Average purchase price
 * @param currentPrice - Current market price
 * @returns Object with absolute and percentage gain/loss
 */
export function calculateGainLoss(
  quantity: number,
  avgPrice: number,
  currentPrice: number
) {
  const investedValue = quantity * avgPrice
  const currentValue = quantity * currentPrice
  const absoluteGain = currentValue - investedValue
  const percentageGain = calculatePercentageChange(currentValue, investedValue)

  return {
    absoluteGain,
    percentageGain,
    investedValue,
    currentValue,
  }
}
