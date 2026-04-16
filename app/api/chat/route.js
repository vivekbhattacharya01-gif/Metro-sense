import { METRO_SYSTEM_PROMPT, GROQ_MODEL, GROQ_MAX_TOKENS, GROQ_TEMPERATURE } from '@/lib/aiConfig.js';

export const maxDuration = 30;

export async function POST(req) {
  try {
    const { messages, systemPrompt } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt || METRO_SYSTEM_PROMPT },
          ...messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        ],
        max_tokens: GROQ_MAX_TOKENS,
        temperature: GROQ_TEMPERATURE,
      }),
    });

    if (!response.ok) {
      const errBody = await response.json();
      console.error('Groq API error:', errBody);
      return Response.json(
        { error: errBody?.error?.message || 'Groq API error' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content ||
      'Sorry, I could not generate a response. Please try again.';

    return Response.json({ content: text });
  } catch (error) {
    console.error('Server error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
