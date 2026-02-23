import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/db/mongodb'
import Watchlist from '@/lib/models/Watchlist'
import { watchlistCreateSchema } from '@/lib/utils/validators'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await dbConnect()

    const watchlists = await Watchlist.find({ userId: session.user.id })

    return NextResponse.json({
      success: true,
      data: watchlists,
    })
  } catch (error) {
    console.error('Error fetching watchlists:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch watchlists' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = watchlistCreateSchema.parse(body)

    await dbConnect()

    const watchlist = await Watchlist.create({
      userId: session.user.id,
      name: validatedData.name,
      stocks: [],
    })

    return NextResponse.json(
      {
        success: true,
        data: watchlist,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating watchlist:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create watchlist' },
      { status: 500 }
    )
  }
}
