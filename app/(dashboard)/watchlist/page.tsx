'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatPercentage } from '@/lib/utils/formatters'
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react'

interface WatchlistStock {
  symbol: string
  name: string
  price: number
  changePercent: number
  addedAt: string
}

interface Watchlist {
  _id: string
  name: string
  description?: string
  stocks: WatchlistStock[]
  createdAt: string
  updatedAt: string
}

export default function WatchlistPage() {
  const router = useRouter()
  const [watchlists, setWatchlists] = useState<Watchlist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newWatchlistName, setNewWatchlistName] = useState('')
  const [newWatchlistDescription, setNewWatchlistDescription] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchWatchlists()
  }, [])

  const fetchWatchlists = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/watchlist')
      
      if (!response.ok) {
        throw new Error('Failed to fetch watchlists')
      }
      
      const data = await response.json()
      setWatchlists(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createWatchlist = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newWatchlistName.trim()) {
      alert('Please enter a watchlist name')
      return
    }

    try {
      setCreating(true)
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newWatchlistName,
          description: newWatchlistDescription,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create watchlist')
      }

      const data = await response.json()
      setWatchlists([...watchlists, data.data])
      setNewWatchlistName('')
      setNewWatchlistDescription('')
      setShowCreateForm(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create watchlist')
    } finally {
      setCreating(false)
    }
  }

  const deleteWatchlist = async (id: string) => {
    if (!confirm('Are you sure you want to delete this watchlist?')) {
      return
    }

    try {
      const response = await fetch(`/api/watchlist/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete watchlist')
      }

      setWatchlists(watchlists.filter(w => w._id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete watchlist')
    }
  }

  const removeStockFromWatchlist = async (watchlistId: string, symbol: string) => {
    try {
      const response = await fetch(`/api/watchlist/${watchlistId}/stocks/${symbol}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove stock')
      }

      // Refresh watchlists
      await fetchWatchlists()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove stock')
    }
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Watchlists</h1>
            <p className="text-muted-foreground">
              Create and manage your stock watchlists
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="h-4 w-4 mr-2" />
            New Watchlist
          </Button>
        </div>
      </div>

      {/* Create Watchlist Form */}
      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Watchlist</CardTitle>
            <CardDescription>
              Add a new watchlist to organize your stocks
            </CardDescription>
          </CardHeader>
          <form onSubmit={createWatchlist}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Watchlist Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Tech Stocks, Blue Chips"
                  value={newWatchlistName}
                  onChange={(e) => setNewWatchlistName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Brief description of this watchlist"
                  value={newWatchlistDescription}
                  onChange={(e) => setNewWatchlistDescription(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button type="submit" disabled={creating}>
                {creating ? 'Creating...' : 'Create Watchlist'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Watchlists Grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading watchlists...
        </div>
      ) : error ? (
        <div className="text-center py-12 text-destructive">
          Error: {error}
        </div>
      ) : watchlists.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <p className="mb-4">You haven't created any watchlists yet.</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Watchlist
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlists.map((watchlist) => (
            <Card key={watchlist._id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">
                      {watchlist.name}
                    </CardTitle>
                    {watchlist.description && (
                      <CardDescription>{watchlist.description}</CardDescription>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteWatchlist(watchlist._id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {watchlist.stocks.length} stock{watchlist.stocks.length !== 1 ? 's' : ''}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                {watchlist.stocks.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    No stocks added yet. Use the screener to add stocks.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {watchlist.stocks.slice(0, 5).map((stock) => (
                      <div
                        key={stock.symbol}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1">
                          <a
                            href={`/stock/${stock.symbol}`}
                            className="font-medium hover:underline"
                          >
                            {stock.symbol}
                          </a>
                          <div className="text-sm text-muted-foreground">
                            {formatPrice(stock.price)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={stock.changePercent >= 0 ? 'success' : 'destructive'}
                            className="flex items-center gap-1"
                          >
                            {stock.changePercent >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {formatPercentage(stock.changePercent)}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStockFromWatchlist(watchlist._id, stock.symbol)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {watchlist.stocks.length > 5 && (
                      <div className="text-center text-sm text-muted-foreground pt-2">
                        +{watchlist.stocks.length - 5} more stocks
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/watchlist/${watchlist._id}`)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
