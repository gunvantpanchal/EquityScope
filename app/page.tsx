import Link from 'next/link'
import { SearchBar } from '@/components/common/SearchBar'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            EquityScope
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/screener"
              className="text-sm font-medium hover:text-primary"
            >
              Screener
            </Link>
            <Link
              href="/watchlist"
              className="text-sm font-medium hover:text-primary"
            >
              Watchlist
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium hover:text-primary"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Your Next Investment
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive stock screening for NSE and BSE markets. Find the
            perfect stocks based on your criteria.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-card rounded-lg shadow-sm text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Nifty 50
              </h3>
              <p className="text-3xl font-bold">19,512.35</p>
              <p className="text-sm text-green-600 mt-1">+0.85%</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Sensex
              </h3>
              <p className="text-3xl font-bold">65,280.45</p>
              <p className="text-sm text-green-600 mt-1">+0.72%</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Active Stocks
              </h3>
              <p className="text-3xl font-bold">2,500+</p>
              <p className="text-sm text-muted-foreground mt-1">NSE & BSE</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Screening</h3>
              <p className="text-muted-foreground">
                Filter stocks by market cap, P/E ratio, sector, and more
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Real-time Data
              </h3>
              <p className="text-muted-foreground">
                Live stock prices and market data from NSE and BSE
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Watchlists</h3>
              <p className="text-muted-foreground">
                Track your favorite stocks and get personalized updates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of investors making smarter decisions
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-background text-foreground rounded-md text-lg font-medium hover:bg-background/90"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 EquityScope. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
