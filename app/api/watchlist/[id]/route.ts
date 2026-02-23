import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/db/mongodb'
import Watchlist from '@/lib/models/Watchlist'
import { watchlistAddStockSchema } from '@/lib/utils/validators'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = watchlistAddStockSchema.parse(body)

    await dbConnect()

    const watchlist = await Watchlist.findOne({
      _id: id,
      userId: session.user.id,
    })

    if (!watchlist) {
      return NextResponse.json(
        { success: false, error: 'Watchlist not found' },
        { status: 404 }
      )
    }

    // Check if stock already exists in watchlist
    const stockExists = watchlist.stocks.some(
      (s: any) =>
        s.symbol === validatedData.symbol &&
        s.exchange === validatedData.exchange
    )

    if (stockExists) {
      // Remove stock
      watchlist.stocks = watchlist.stocks.filter(
        (s: any) =>
          !(
            s.symbol === validatedData.symbol &&
            s.exchange === validatedData.exchange
          )
      )
    } else {
      // Add stock
      watchlist.stocks.push({
        symbol: validatedData.symbol,
        exchange: validatedData.exchange,
        addedAt: new Date(),
      })
    }

    await watchlist.save()

    return NextResponse.json({
      success: true,
      data: watchlist,
    })
  } catch (error: any) {
    console.error('Error updating watchlist:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update watchlist' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    await dbConnect()

    const result = await Watchlist.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    })

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Watchlist not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Watchlist deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting watchlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete watchlist' },
      { status: 500 }
    )
  }
}
