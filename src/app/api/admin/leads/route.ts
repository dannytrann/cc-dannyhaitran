import { NextResponse } from "next/server";
import { getLeads, getStats } from "@/lib/leads-db";

export async function GET() {
  const [leads, stats] = await Promise.all([getLeads(), getStats()]);
  return NextResponse.json({ leads, stats });
}
