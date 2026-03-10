import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getLead, saveGeneratedWebsite } from "@/lib/leads-db";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { leadId } = await req.json();

  const lead = await getLead(leadId);
  if (!lead) {
    return new Response(JSON.stringify({ error: "Lead not found" }), {
      status: 404,
    });
  }

  const prompt = `Create a complete, single-file HTML website for this local business in Campbell River, BC, Canada.

Business Details:
- Name: ${lead.businessName}
- Type: ${lead.businessType}
- Address: ${lead.address}
- Phone: ${lead.phone}
- Email: ${lead.email}
${lead.currentWebsite ? `- Current website (to improve upon): ${lead.currentWebsite}` : "- No existing website"}
${lead.websiteIssues.length > 0 ? `- Issues to fix: ${lead.websiteIssues.join(", ")}` : ""}
${lead.notes ? `- Notes: ${lead.notes}` : ""}

Requirements:
- Complete single HTML file with embedded CSS (use Tailwind CSS via CDN: https://cdn.tailwindcss.com)
- Professional, modern design that reflects the business type
- Fully mobile responsive
- Sections to include: hero with CTA, services/offerings, about, contact with form
- Use realistic placeholder images from https://picsum.photos (specific dimensions per image)
- Include real business info (name, phone, email, address)
- Modern color scheme appropriate for the business type
- Smooth hover effects and transitions
- Footer with copyright, hours, and contact info
- Google Maps embed placeholder for the address

Output ONLY the complete HTML code starting with <!DOCTYPE html>. No explanations, no markdown fences.`;

  const encoder = new TextEncoder();
  let fullHtml = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const claudeStream = client.messages.stream({
          model: "claude-opus-4-6",
          max_tokens: 8000,
          thinking: { type: "adaptive" },
          system:
            "You are an expert web designer specializing in professional local business websites. You output only complete, production-ready HTML code with no explanations or markdown.",
          messages: [{ role: "user", content: prompt }],
        });

        for await (const event of claudeStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            fullHtml += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        // Save generated website after streaming completes
        await saveGeneratedWebsite(leadId, fullHtml);
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Accel-Buffering": "no",
    },
  });
}
