import mongoose, { Schema, Document } from 'mongoose'

interface IPortfolioHolding {
  symbol: string
  exchange: 'NSE' | 'BSE'
  quantity: number
  avgPrice: number
  purchaseDate: Date
}

export interface IPortfolio extends Document {
  userId: mongoose.Types.ObjectId
  holdings: IPortfolioHolding[]
  createdAt: Date
  updatedAt: Date
}

const PortfolioHoldingSchema = new Schema<IPortfolioHolding>(
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
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    avgPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
)

const PortfolioSchema = new Schema<IPortfolio>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    holdings: [PortfolioHoldingSchema],
  },
  {
    timestamps: true,
  }
)

PortfolioSchema.index({ userId: 1 })

export default mongoose.models.Portfolio ||
  mongoose.model<IPortfolio>('Portfolio', PortfolioSchema)
