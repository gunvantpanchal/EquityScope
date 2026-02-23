'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatPercentage, formatMarketCap } from '@/lib/utils/formatters'
import { Stock, StockFilters } from '@/types/stock'
import { Plus, Filter, X } from 'lucide-react'

const SECTORS = [
  'All Sectors',
  'Technology',
  'Finance',
  'Healthcare',
  'Consumer Goods',
  'Energy',
  'Industrials',
  'Real Estate',
  'Utilities',
  'Materials',
]

const MARKET_CAP_RANGES = [
  { label: 'All', min: 0, max: Infinity },
  { label: 'Large Cap (>₹20,000 Cr)', min: 200000000000, max: Infinity },
  { label: 'Mid Cap (₹5,000-20,000 Cr)', min: 50000000000, max: 200000000000 },
  { label: 'Small Cap (<₹5,000 Cr)', min: 0, max: 50000000000 },
]

export default function ScreenerPage() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(true)
  const [addingToWatchlist, setAddingToWatchlist] = useState<string | null>(null)
  
  const [filters, setFilters] = useState<StockFilters>({
    marketCapMin: undefined,
    marketCapMax: undefined,
    peRatioMin: undefined,
    peRatioMax: undefined,
    priceMin: undefined,
    priceMax: undefined,
    sectors: [],
    exchange: 'ALL',
  })

  useEffect(() => {
    fetchStocks()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [stocks, filters])

  const fetchStocks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/stocks')
      
      if (!response.ok) {
        throw new Error('Failed to fetch stocks')
      }
      
      const data = await response.json()
      setStocks(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...stocks]

    if (filters.marketCapMin !== undefined) {
      filtered = filtered.filter(s => s.marketCap >= filters.marketCapMin!)
    }
    if (filters.marketCapMax !== undefined && filters.marketCapMax !== Infinity) {
      filtered = filtered.filter(s => s.marketCap <= filters.marketCapMax!)
    }
    if (filters.peRatioMin !== undefined) {
      filtered = filtered.filter(s => s.peRatio !== null && s.peRatio >= filters.peRatioMin!)
    }
    if (filters.peRatioMax !== undefined) {
      filtered = filtered.filter(s => s.peRatio !== null && s.peRatio <= filters.peRatioMax!)
    }
    if (filters.priceMin !== undefined) {
      filtered = filtered.filter(s => s.price >= filters.priceMin!)
    }
    if (filters.priceMax !== undefined) {
      filtered = filtered.filter(s => s.price <= filters.priceMax!)
    }
    if (filters.sectors && filters.sectors.length > 0 && !filters.sectors.includes('All Sectors')) {
      filtered = filtered.filter(s => filters.sectors!.includes(s.sector))
    }
    if (filters.exchange && filters.exchange !== 'ALL') {
      filtered = filtered.filter(s => s.exchange === filters.exchange)
    }

    setFilteredStocks(filtered)
  }

  const handleMarketCapChange = (value: string) => {
    const range = MARKET_CAP_RANGES.find(r => r.label === value)
    if (range) {
      setFilters(prev => ({
        ...prev,
        marketCapMin: range.min,
        marketCapMax: range.max,
      }))
    }
  }

  const handleSectorChange = (value: string) => {
    if (value === 'All Sectors') {
      setFilters(prev => ({ ...prev, sectors: [] }))
    } else {
      setFilters(prev => ({ ...prev, sectors: [value] }))
    }
  }

  const resetFilters = () => {
    setFilters({
      marketCapMin: undefined,
      marketCapMax: undefined,
      peRatioMin: undefined,
      peRatioMax: undefined,
      priceMin: undefined,
      priceMax: undefined,
      sectors: [],
      exchange: 'ALL',
    })
  }

  const addToWatchlist = async (symbol: string) => {
    try {
      setAddingToWatchlist(symbol)
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
      setAddingToWatchlist(null)
    }
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Stock Screener</h1>
        <p className="text-muted-foreground">
          Filter and discover stocks based on your investment criteria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Panel */}
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Filters</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="h-8"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Market Cap */}
              <div className="space-y-2">
                <Label>Market Cap</Label>
                <Select onValueChange={handleMarketCapChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {MARKET_CAP_RANGES.map((range) => (
                      <SelectItem key={range.label} value={range.label}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sector */}
              <div className="space-y-2">
                <Label>Sector</Label>
                <Select onValueChange={handleSectorChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin || ''}
                    onChange={(e) =>
                      setFilters(prev => ({
                        ...prev,
                        priceMin: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax || ''}
                    onChange={(e) =>
                      setFilters(prev => ({
                        ...prev,
                        priceMax: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                  />
                </div>
              </div>

              {/* P/E Ratio */}
              <div className="space-y-2">
                <Label>P/E Ratio</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.peRatioMin || ''}
                    onChange={(e) =>
                      setFilters(prev => ({
                        ...prev,
                        peRatioMin: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.peRatioMax || ''}
                    onChange={(e) =>
                      setFilters(prev => ({
                        ...prev,
                        peRatioMax: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Exchange */}
              <div className="space-y-2">
                <Label>Exchange</Label>
                <Select
                  value={filters.exchange}
                  onValueChange={(value) =>
                    setFilters(prev => ({ ...prev, exchange: value as any }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Exchanges</SelectItem>
                    <SelectItem value="NSE">NSE</SelectItem>
                    <SelectItem value="BSE">BSE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle>Results</CardTitle>
                  <CardDescription>
                    {filteredStocks.length} stocks found
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading stocks...
                </div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">
                  Error: {error}
                </div>
              ) : filteredStocks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No stocks found matching your criteria
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Change</TableHead>
                        <TableHead className="text-right hidden md:table-cell">
                          Market Cap
                        </TableHead>
                        <TableHead className="text-right hidden md:table-cell">
                          P/E Ratio
                        </TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStocks.map((stock) => (
                        <TableRow key={stock.symbol}>
                          <TableCell>
                            <div>
                              <a
                                href={`/stock/${stock.symbol}`}
                                className="font-medium hover:underline"
                              >
                                {stock.symbol}
                              </a>
                              <div className="text-sm text-muted-foreground hidden md:block">
                                {stock.name}
                              </div>
                              <Badge variant="outline" className="mt-1 md:hidden">
                                {stock.exchange}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatPrice(stock.price)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={
                                stock.changePercent >= 0 ? 'success' : 'destructive'
                              }
                            >
                              {formatPercentage(stock.changePercent)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right hidden md:table-cell">
                            {formatMarketCap(stock.marketCap)}
                          </TableCell>
                          <TableCell className="text-right hidden md:table-cell">
                            {stock.peRatio?.toFixed(2) || 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToWatchlist(stock.symbol)}
                              disabled={addingToWatchlist === stock.symbol}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              <span className="hidden md:inline">Add</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
