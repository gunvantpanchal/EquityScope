import { NextRequest, NextResponse } from 'next/server'
import { getStocks } from '@/lib/api/stockApi'
import { stockFiltersSchema } from '@/lib/utils/validators'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate filters
    const validatedFilters = stockFiltersSchema.parse(body)

    const stocks = await getStocks(validatedFilters)

    return NextResponse.json({
      success: true,
      data: stocks,
    })
  } catch (error: any) {
    console.error('Error screening stocks:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid filter data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to screen stocks' },
      { status: 500 }
    )
  }
}
