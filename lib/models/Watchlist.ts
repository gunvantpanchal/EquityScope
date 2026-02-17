import mongoose, { Schema, Document } from 'mongoose'

interface IWatchlistStock {
  symbol: string
  exchange: 'NSE' | 'BSE'
  addedAt: Date
}

export interface IWatchlist extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  stocks: IWatchlistStock[]
  createdAt: Date
  updatedAt: Date
}

const WatchlistStockSchema = new Schema<IWatchlistStock>(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    exchange: {
      type: String,
      required: true,
      enum: ['NSE', 'BSE'],
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
)

const WatchlistSchema = new Schema<IWatchlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Watchlist name is required'],
      trim: true,
    },
    stocks: [WatchlistStockSchema],
  },
  {
    timestamps: true,
  }
)

WatchlistSchema.index({ userId: 1 })
WatchlistSchema.index({ userId: 1, name: 1 })

export default mongoose.models.Watchlist ||
  mongoose.model<IWatchlist>('Watchlist', WatchlistSchema)
