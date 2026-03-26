import { NextRequest, NextResponse } from "next/server";
import { polygonHistoricalDay } from "@/lib/apis/polygon";

export const revalidate = 86400; // historical data changes only once a day

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  if (!ticker || typeof ticker !== "string") {
    return NextResponse.json({ error: "Invalid ticker" }, { status: 400 });
  }

  // Sanitize: only allow alphanumeric and dots (e.g. BRK.B)
  const safe = ticker.toUpperCase().replace(/[^A-Z0-9.]/g, "");
  if (!safe) {
    return NextResponse.json({ error: "Invalid ticker" }, { status: 400 });
  }

  // Target date: exactly 1 year ago
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const targetDate = oneYearAgo.toISOString().split("T")[0];

  try {
    const data = await polygonHistoricalDay(safe, targetDate);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
