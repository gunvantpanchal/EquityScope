'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  formatPrice,
  formatPercentage,
  formatMarketCap,
  formatVolume,
  formatDate,
} from '@/lib/utils/formatters'
import { StockDetails } from '@/types/stock'
import { ArrowLeft, TrendingUp, TrendingDown, Plus } from 'lucide-react'

export default function StockDetailsPage() {
  const params = useParams()
  const symbol = params.symbol as string
  const [stock, setStock] = useState<StockDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingToWatchlist, setAddingToWatchlist] = useState(false)

  useEffect(() => {
    if (symbol) {
      fetchStockDetails()
    }
  }, [symbol])

  const fetchStockDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/stocks/${symbol}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch stock details')
      }
      
      const data = await response.json()
      setStock(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addToWatchlist = async () => {
    try {
      setAddingToWatchlist(true)
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      })

      if (!response.ok) {
        throw new Error('Failed to add to watchlist')
      }

      alert(`${symbol} added to watchlist!`)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add to watchlist')
    } finally {
      setAddingToWatchlist(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <div className="text-center py-12 text-muted-foreground">
          Loading stock details...
        </div>
      </div>
    )
  }

  if (error || !stock) {
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">
            {error || 'Stock not found'}
          </p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const isPositive = stock.changePercent >= 0

  return (
    <div className="container mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{stock.symbol}</h1>
              <Badge variant="outline">{stock.exchange}</Badge>
            </div>
            <p className="text-lg text-muted-foreground mb-3">{stock.name}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{stock.sector}</Badge>
              <Badge variant="outline">{stock.industry}</Badge>
            </div>
          </div>
          <Button onClick={addToWatchlist} disabled={addingToWatchlist}>
            <Plus className="h-4 w-4 mr-2" />
            Add to Watchlist
          </Button>
        </div>
      </div>

      {/* Price Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Current Price
              </div>
              <div className="text-3xl font-bold">
                {formatPrice(stock.price)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Day Change
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={isPositive ? 'success' : 'destructive'}
                  className="text-lg py-1 px-3"
                >
                  <span className="flex items-center gap-1">
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {formatPercentage(stock.changePercent)}
                  </span>
                </Badge>
                <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                  {formatPrice(stock.change)}
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                52 Week Range
              </div>
              <div className="text-lg">
                {formatPrice(stock.low52Week)} - {formatPrice(stock.high52Week)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Placeholder */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Price Chart</CardTitle>
          <CardDescription>Historical price data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted/30 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Price chart will be displayed here</p>
              <p className="text-sm mt-1">Integration with charting library pending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Market Cap</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatMarketCap(stock.marketCap)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>P/E Ratio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stock.peRatio?.toFixed(2) || 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatVolume(stock.volume)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Dividend Yield</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Financial Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Earnings Per Share (EPS)
              </div>
              <div className="text-xl font-semibold">
                {stock.eps ? formatPrice(stock.eps) : 'N/A'}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Return on Equity (ROE)
              </div>
              <div className="text-xl font-semibold">
                {stock.roe ? `${stock.roe.toFixed(2)}%` : 'N/A'}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Debt to Equity
              </div>
              <div className="text-xl font-semibold">
                {stock.debtToEquity?.toFixed(2) || 'N/A'}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Beta</div>
              <div className="text-xl font-semibold">
                {stock.beta?.toFixed(2) || 'N/A'}
              </div>
            </div>

            {stock.revenue && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Revenue
                </div>
                <div className="text-xl font-semibold">
                  {formatMarketCap(stock.revenue)}
                </div>
              </div>
            )}

            {stock.profit && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Profit
                </div>
                <div className="text-xl font-semibold">
                  {formatMarketCap(stock.profit)}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      {stock.about && (
        <Card>
          <CardHeader>
            <CardTitle>About {stock.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {stock.about}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
