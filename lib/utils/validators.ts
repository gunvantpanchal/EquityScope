import { z } from 'zod'

export const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
})

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const stockFiltersSchema = z.object({
  marketCapMin: z.number().min(0).optional(),
  marketCapMax: z.number().min(0).optional(),
  peRatioMin: z.number().min(0).optional(),
  peRatioMax: z.number().min(0).optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  volumeMin: z.number().min(0).optional(),
  sectors: z.array(z.string()).optional(),
  industries: z.array(z.string()).optional(),
  exchange: z.enum(['NSE', 'BSE', 'ALL']).optional(),
})

export const watchlistCreateSchema = z.object({
  name: z.string().min(1, 'Watchlist name is required'),
})

export const watchlistAddStockSchema = z.object({
  symbol: z.string().min(1, 'Stock symbol is required'),
  exchange: z.enum(['NSE', 'BSE']),
})

export const portfolioAddHoldingSchema = z.object({
  symbol: z.string().min(1, 'Stock symbol is required'),
  exchange: z.enum(['NSE', 'BSE']),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  avgPrice: z.number().min(0, 'Price must be positive'),
  purchaseDate: z.string().or(z.date()),
})

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>
export type UserLoginInput = z.infer<typeof userLoginSchema>
export type StockFiltersInput = z.infer<typeof stockFiltersSchema>
export type WatchlistCreateInput = z.infer<typeof watchlistCreateSchema>
export type WatchlistAddStockInput = z.infer<typeof watchlistAddStockSchema>
export type PortfolioAddHoldingInput = z.infer<typeof portfolioAddHoldingSchema>
