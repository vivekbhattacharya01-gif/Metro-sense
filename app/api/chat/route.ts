import { streamText, consumeStream } from "ai";

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
  const { messages, systemPrompt } = await req.json();

  // Convert simple message format to model messages
  const modelMessages = messages.map((m: { role: string; content: string }) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const result = streamText({
    model: "anthropic/claude-sonnet-4-20250514",
    system: systemPrompt || SYSTEM_PROMPT,
    messages: modelMessages,
    abortSignal: req.signal,
  });

  // Collect streamed text and return as JSON for simpler client handling
  let fullContent = "";
  
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of (await result).textStream) {
        fullContent += chunk;
        controller.enqueue(new TextEncoder().encode(chunk));
      }
      controller.close();
    }
  });

  // For simpler client integration, we'll return a non-streaming JSON response
  const response = await result;
  const text = await response.text;

  return Response.json({ content: text });
}
