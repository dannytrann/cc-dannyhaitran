import fs from "fs/promises";
import path from "path";

export type LeadStatus = "new" | "contacted" | "proposal_sent" | "won" | "lost";

export interface Lead {
  id: string;
  businessName: string;
  businessType: string;
  address: string;
  phone: string;
  email: string;
  currentWebsite: string | null;
  websiteScore: number; // 0-10
  websiteIssues: string[];
  notes: string;
  status: LeadStatus;
  generatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const DB_PATH = path.join(process.cwd(), "data", "leads.json");
const GENERATED_DIR = path.join(process.cwd(), "data", "generated");

export async function getLeads(): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function getLead(id: string): Promise<Lead | null> {
  const leads = await getLeads();
  return leads.find((l) => l.id === id) ?? null;
}

export async function updateLead(
  id: string,
  updates: Partial<Lead>
): Promise<Lead | null> {
  const leads = await getLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  leads[idx] = {
    ...leads[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(DB_PATH, JSON.stringify(leads, null, 2));
  return leads[idx];
}

export async function saveGeneratedWebsite(
  leadId: string,
  html: string
): Promise<void> {
  await fs.mkdir(GENERATED_DIR, { recursive: true });
  await fs.writeFile(path.join(GENERATED_DIR, `${leadId}.html`), html);
  await updateLead(leadId, { generatedAt: new Date().toISOString() });
}

export async function getGeneratedWebsite(
  leadId: string
): Promise<string | null> {
  try {
    return await fs.readFile(
      path.join(GENERATED_DIR, `${leadId}.html`),
      "utf-8"
    );
  } catch {
    return null;
  }
}

export async function getStats() {
  const leads = await getLeads();
  return {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    proposal_sent: leads.filter((l) => l.status === "proposal_sent").length,
    won: leads.filter((l) => l.status === "won").length,
    lost: leads.filter((l) => l.status === "lost").length,
    generated: leads.filter((l) => l.generatedAt !== null).length,
  };
}
