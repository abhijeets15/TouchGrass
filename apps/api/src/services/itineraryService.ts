import { GoogleGenAI, Type, Schema } from '@google/genai';
import { config } from '../config';

// 1. Initialize the client once at the top level
const genAI = new GoogleGenAI({ apiKey: config.geminiApiKey || process.env.GEMINI_API_KEY });

interface ItineraryRequest {
  vibe: string;
  budget: string;
  time: string;
  group: string;
  distance: string;
  destination?: string;
}

interface ItineraryStop {
  name: string;
  type: string;
  duration: string;
  note: string;
  priceTier: string;
}

interface Itinerary {
  title: string;
  duration: string;
  estimatedCost: string;
  closingNote: string;
  stops: ItineraryStop[];
}

const BUDGET_LABEL: Record<string, string> = {
  free: 'Free activities only',
  cheap: 'Under $20 per person',
  moderate: '$20–$60 per person',
  splurge: 'No budget limit',
};

const GROUP_LABEL: Record<string, string> = {
  solo: 'Solo traveler',
  date: 'Couple on a date',
  friends: 'Group of friends',
  family: 'Family outing',
};

const TIME_LABEL: Record<string, string> = {
  quick: '2-3 hours',
  half: '4-5 hours',
  full: 'Full day (6-8 hours)',
};

const VIBE_LABEL: Record<string, string> = {
  chill: 'Relaxed and laid-back',
  adventure: 'Active and adventurous',
  culture: 'Cultural and educational',
  nightlife: 'Nightlife and entertainment',
  foodie: 'Food-focused experience',
  nature: 'Nature and outdoors',
  romantic: 'Romantic atmosphere',
  social: 'Social and lively',
};

// 2. Define the strict visual structure schema for Gemini
const ItineraryResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    duration: { type: Type.STRING },
    estimatedCost: { type: Type.STRING },
    closingNote: { type: Type.STRING },
    stops: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING },
          duration: { type: Type.STRING },
          note: { type: Type.STRING },
          priceTier: { type: Type.STRING },
        },
        required: ['name', 'type', 'duration', 'note', 'priceTier'],
      },
    },
  },
  required: ['title', 'duration', 'estimatedCost', 'closingNote', 'stops'],
};

export async function generateItineraries(params: ItineraryRequest): Promise<Itinerary[]> {
  console.log('API Key configured:', config.geminiApiKey ? 'YES' : 'NO');
  
  if (!config.geminiApiKey) {
    throw new Error('GEMINI_API_KEY not configured in environment');
  }

  const destination = params.destination || 'your city';
  
  const prompt = `Generate 5 different detailed itineraries for a night out in ${destination}.

Parameters:
- Vibe: ${VIBE_LABEL[params.vibe] || params.vibe}
- Budget: ${BUDGET_LABEL[params.budget] || params.budget}
- Duration: ${TIME_LABEL[params.time] || params.time}
- Group: ${GROUP_LABEL[params.group] || params.group}
- Distance preference: ${params.distance}

Requirements:
- Each itinerary should be unique and different from the others
- Generate 3-5 stops appropriate for the duration for each itinerary
- Make it realistic for the specified location
- Match the vibe and budget constraints
- Include a mix of activities (dining, entertainment, etc.)
- Be specific with venue names when possible
- Vary the neighborhoods and types of venues across the 5 itineraries`;

  try {
    console.log('Calling Gemini API for 5 itineraries...');
    
    // Generate 5 itineraries in parallel
    const itineraryPromises = Array.from({ length: 5 }, async (_, i) => {
      const result = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${prompt}\n\nThis is itinerary #${i + 1} of 5. Make this one unique and different from the others.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: ItineraryResponseSchema,
        }
      });

      const responseText = result.text;
      if (!responseText) {
        throw new Error('Empty response received from Gemini API');
      }

      return JSON.parse(responseText) as Itinerary;
    });

    const itineraries = await Promise.all(itineraryPromises);
    console.log('Generated 5 itineraries successfully');
    return itineraries;

  } catch (error) {
    console.error('AI generation error:', error);
    throw new Error('Failed to generate itineraries. Please try again.');
  }
}
