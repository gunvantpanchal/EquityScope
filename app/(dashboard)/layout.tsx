import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
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
            {session?.user && (
              <>
                <span className="text-sm text-muted-foreground">
                  {session.user.name}
                </span>
                <form
                  action={async () => {
                    'use server'
                    await signOut()
                  }}
                >
                  <Button variant="outline" size="sm" type="submit">
                    Sign Out
                  </Button>
                </form>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t py-6 bg-secondary/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 EquityScope. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
