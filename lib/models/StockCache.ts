import mongoose, { Schema, Document } from 'mongoose'

export interface IStockCache extends Document {
  symbol: string
  exchange: 'NSE' | 'BSE'
  data: any
  expiresAt: Date
  createdAt: Date
}

const StockCacheSchema = new Schema<IStockCache>(
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
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Compound index for symbol and exchange
StockCacheSchema.index({ symbol: 1, exchange: 1 })

// TTL index to automatically delete expired documents
StockCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.models.StockCache ||
  mongoose.model<IStockCache>('StockCache', StockCacheSchema)
