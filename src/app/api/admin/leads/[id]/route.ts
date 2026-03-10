import { NextRequest, NextResponse } from "next/server";
import { getLead, updateLead, getGeneratedWebsite } from "@/lib/leads-db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const generatedHtml = await getGeneratedWebsite(id);
  return NextResponse.json({ lead, generatedHtml });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updates = await req.json();

  // Only allow safe fields to be updated
  const allowed = ["status", "notes", "email", "phone"];
  const filtered = Object.fromEntries(
    Object.entries(updates).filter(([k]) => allowed.includes(k))
  );

  const updated = await updateLead(id, filtered);
  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ lead: updated });
}
