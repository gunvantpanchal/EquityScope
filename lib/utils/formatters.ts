/**
 * Format number as Indian Rupee currency
 * @param value - Number to format
 * @returns Formatted currency string (e.g., ₹1,234.56)
 */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Format market cap with Indian numbering system
 * @param value - Market cap value
 * @returns Formatted market cap (e.g., ₹1.2L Cr, ₹500 Cr)
 */
export function formatMarketCap(value: number): string {
  if (value >= 10000000000) {
    // >= 1000 Cr
    const inLakhCr = value / 10000000000
    return `₹${inLakhCr.toFixed(2)}L Cr`
  } else if (value >= 100000000) {
    // >= 10 Cr
    const inCr = value / 10000000
    return `₹${inCr.toFixed(0)} Cr`
  } else if (value >= 1000000) {
    // >= 10 Lakh
    const inLakh = value / 100000
    return `₹${inLakh.toFixed(2)} Lakh`
  } else {
    return formatPrice(value)
  }
}

/**
 * Format percentage with sign
 * @param value - Percentage value
 * @returns Formatted percentage (e.g., +2.5%, -1.2%)
 */
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

/**
 * Format volume with K/M suffix
 * @param value - Volume value
 * @returns Formatted volume (e.g., 1.2M, 500K)
 */
export function formatVolume(value: number): string {
  if (value >= 10000000) {
    // >= 1 Crore
    return `${(value / 10000000).toFixed(2)} Cr`
  } else if (value >= 100000) {
    // >= 1 Lakh
    return `${(value / 100000).toFixed(2)} L`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`
  }
  return value.toString()
}

/**
 * Format date to various formats
 * @param date - Date to format
 * @param format - Format type
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (format === 'relative') {
    const now = new Date()
    const diffInMs = now.getTime() - d.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return `${Math.floor(diffInDays / 365)} years ago`
  }

  if (format === 'long') {
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Format large numbers with K/M/B suffix
 * @param value - Number to format
 * @returns Formatted number (e.g., 1.2K, 5M, 1.5B)
 */
export function formatNumber(value: number): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}
