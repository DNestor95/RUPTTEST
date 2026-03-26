import { NextRequest, NextResponse } from "next/server";
import { polygonHistoricalPrices } from "@/lib/apis/polygon";

export const revalidate = 3600;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  if (!ticker || typeof ticker !== "string") {
    return NextResponse.json({ error: "Invalid ticker" }, { status: 400 });
  }

  const safe = ticker.toUpperCase().replace(/[^A-Z0-9.]/g, "");
  if (!safe) {
    return NextResponse.json({ error: "Invalid ticker" }, { status: 400 });
  }

  try {
    const data = await polygonHistoricalPrices(safe);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
