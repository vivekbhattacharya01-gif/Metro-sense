import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are MetroSense, an expert Delhi Metro assistant. 
You know all Delhi Metro lines: Red, Blue, Yellow, Green, Violet, Pink, Magenta.
Key interchange stations: Rajiv Chowk (Blue+Yellow), Kashmere Gate (Red+Yellow+Violet), 
Central Secretariat (Yellow+Violet), INA (Yellow+Pink+Magenta), 
Netaji Subhash Place (Red+Pink), Rajouri Garden (Blue+Pink).
Fare slabs: up to 2km=₹10, up to 5km=₹20, up to 12km=₹30, up to 21km=₹40, up to 32km=₹50, above=₹60.
Metro runs 5:30 AM to 11:30 PM. Peak hours: 8-10 AM and 5-8 PM.
Always respond with: best route, which line(s) to take, interchange stations if needed, 
estimated time, fare, and one smart tip (crowd level, best coach, exit gate, etc).
Keep responses clear, structured, and concise. Use Indian English.`;

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt } = await req.json();

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt || SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return Response.json({ content: text });
  } catch (error: any) {
    console.error("Anthropic API error:", error);
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}