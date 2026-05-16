import type { Itinerary, VibeQuery } from '../constants/types';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// NOTE: In production, this call should go through your own backend (apps/api)
// so you never expose your API key in the mobile client.
// For local dev, set EXPO_PUBLIC_ANTHROPIC_API_KEY in your .env file.
const API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';

const BUDGET_LABELS: Record<string, string> = {
  free: 'completely free, no spend',
  cheap: 'budget-friendly, under $20 total',
  moderate: 'moderate spend, $20–$60 total',
  splurge: 'worth splurging, $60+ for a special experience',
};

function buildPrompt(query: VibeQuery): string {
  return `You are Vibecheck, an expert local experience curator known for specific, opinionated, insider recommendations.

Generate a curated itinerary based on:
- Vibe/mood: ${query.vibe}
- Budget: ${BUDGET_LABELS[query.budget]}
- Time available: ${query.time}
- Group type: ${query.group}
- Distance willing to travel: ${query.distance}

Location: New York City (use real NYC neighborhoods and real-feeling place names).

Return ONLY valid JSON with no markdown fences, no preamble, no explanation. Exact schema:
{
  "title": "A short evocative title for the night (5–8 words)",
  "duration": "e.g. 3–4 hours",
  "estimatedCost": "e.g. $35–$55 per person",
  "stops": [
    {
      "name": "Specific place name",
      "type": "Category label e.g. Cocktail bar / Ramen spot / Rooftop park",
      "duration": "~45 min",
      "note": "One punchy, specific sentence about why this fits the vibe and what to do or order.",
      "priceTier": "Free" | "$" | "$$" | "$$$"
    }
  ],
  "closingNote": "One atmospheric sentence summing up the feel of the whole night."
}

Rules:
- 3–4 stops only
- Make place names feel real and specific (a plausible NYC spot)
- Each note should feel like a recommendation from a local friend, not a review site
- Match the vibe consistently across all stops`;
}

export async function generateItinerary(query: VibeQuery): Promise<Itinerary> {
  if (!API_KEY) {
    throw new Error('Missing EXPO_PUBLIC_ANTHROPIC_API_KEY in environment');
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: buildPrompt(query) }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text: string = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? '';

  if (!text) throw new Error('Empty response from API');

  const clean = text.replace(/```json|```/g, '').trim();

  let parsed: Itinerary;
  try {
    parsed = JSON.parse(clean);
  } catch {
    throw new Error('Failed to parse itinerary JSON from response');
  }

  if (!parsed.stops || !Array.isArray(parsed.stops) || parsed.stops.length === 0) {
    throw new Error('Itinerary response missing stops');
  }

  return parsed;
}
