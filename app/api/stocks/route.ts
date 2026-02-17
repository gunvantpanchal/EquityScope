import { NextRequest, NextResponse } from 'next/server'
import { getStocks } from '@/lib/api/stockApi'
import { stockFiltersSchema } from '@/lib/utils/validators'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      marketCapMin: searchParams.get('marketCapMin')
        ? Number(searchParams.get('marketCapMin'))
        : undefined,
      marketCapMax: searchParams.get('marketCapMax')
        ? Number(searchParams.get('marketCapMax'))
        : undefined,
      peRatioMin: searchParams.get('peRatioMin')
        ? Number(searchParams.get('peRatioMin'))
        : undefined,
      peRatioMax: searchParams.get('peRatioMax')
        ? Number(searchParams.get('peRatioMax'))
        : undefined,
      priceMin: searchParams.get('priceMin')
        ? Number(searchParams.get('priceMin'))
        : undefined,
      priceMax: searchParams.get('priceMax')
        ? Number(searchParams.get('priceMax'))
        : undefined,
      volumeMin: searchParams.get('volumeMin')
        ? Number(searchParams.get('volumeMin'))
        : undefined,
      sectors: searchParams.get('sectors')
        ? searchParams.get('sectors')!.split(',')
        : undefined,
    }

    const stocks = await getStocks(filters)

    return NextResponse.json({
      success: true,
      data: stocks,
    })
  } catch (error) {
    console.error('Error fetching stocks:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stocks' },
      { status: 500 }
    )
  }
}
