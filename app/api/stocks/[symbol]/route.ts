import { NextRequest, NextResponse } from "next/server"
import { getStockBySymbol } from "@/lib/api/stockApi"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params
    const stock = await getStockBySymbol(symbol)

    if (!stock) {
      return NextResponse.json(
        { success: false, error: "Stock not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: stock,
    })
  } catch (error) {
    console.error("Error fetching stock:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch stock" },
      { status: 500 }
    )
  }
}
