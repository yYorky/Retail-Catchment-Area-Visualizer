import { GoogleGenAI } from "@google/genai";
import { Location, TravelMode, GeminiResult, GroundingChunk } from '../types';

export async function fetchTravelInfo(
  location: Location,
  travelTime: number,
  retailCategory: string,
): Promise<GeminiResult> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const categoryText = retailCategory.trim() ? ` ${retailCategory}` : 'retail store';

  const prompt = `Your task is a catchment area analysis for a potential new${categoryText}.

**Step 1: Identify Primary Landmark (CRITICAL)**
First, identify the **nearest major public transit hub** (MRT Station, LRT Station, or Bus Interchange) to the precise geographic coordinates provided:
- Latitude: ${location.lat}
- Longitude: ${location.lng}
This transit hub will be the central reference for the entire analysis.

**Step 2: Perform Analysis**
Using the identified transit hub from Step 1 as the primary landmark, perform a detailed, consolidated analysis and provide travel distance estimates for a ${travelTime}-minute travel time originating from that landmark.

**Output Format:**
Return ONLY a valid JSON object with the following structure. Do not include any other text, explanations, or markdown formatting (like \`\`\`json) outside of the JSON object itself.

{
  "locationName": "string",
  "estimatedDistancesKm": {
    "walk": number,
    "public transport": number,
    "car": number
  },
  "analysis": "string in Markdown format"
}

**Field Descriptions:**
- "locationName": The name of the major transit hub you identified in Step 1 (e.g., "Orchard MRT Station, Singapore"). This is mandatory for verification.
- "estimatedDistancesKm": An object containing CONSERVATIVE and REALISTIC estimated travel distances in kilometers for all three modes, originating from the identified transit hub. Each estimate must account for real-world conditions:
    - "walk": Consider pedestrian pathways, crosswalks.
    - "car": Consider local speed limits, traffic signals, intersections, typical congestion.
    - "public transport": Consider walking to stops, wait times, and transfers.
- "analysis": A SINGLE, CONSOLIDATED catchment area analysis in Markdown format, contextualized by "locationName" and considering the accessibility by all three travel modes from that hub. It must cover:
  - **Area Identity & Demographics:** Based on "locationName", what is this area? Who lives/works here?
  - **Foot Traffic & Visibility:** What drives foot traffic around "locationName"? Consider accessibility by walk, transit, and car from the hub.
  - **Competition & Synergy:** In the vicinity of "locationName", provide 1-2 examples of potential competing and 1-2 examples of complementary businesses.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleMaps: {}}],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.lat,
              longitude: location.lng
            }
          }
        }
      },
    });

    let jsonText = response.text.trim();
    // Clean potential markdown fences from the response
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.substring(7, jsonText.length - 3).trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.substring(3, jsonText.length - 3).trim();
    }

    const jsonResponse = JSON.parse(jsonText);
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks || [];

    return {
      locationName: jsonResponse.locationName,
      analysis: jsonResponse.analysis,
      estimatedDistancesKm: jsonResponse.estimatedDistancesKm,
      sources: sources as GroundingChunk[],
    };
  } catch (error) {
    console.error(`Error fetching data for location ${location.lat}, ${location.lng}:`, error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      locationName: "Unknown",
      analysis: `Sorry, I couldn't fetch information for this location. Error: ${errorMessage}`,
      estimatedDistancesKm: {
        [TravelMode.WALK]: 0,
        [TravelMode.TRANSIT]: 0,
        [TravelMode.DRIVE]: 0,
      },
      sources: [],
    };
  }
}