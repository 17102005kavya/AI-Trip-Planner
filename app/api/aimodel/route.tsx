import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_KEY,
});


const PROMPT = `You are an AI Trip Planner Agent. Your goal is to help the user plan a trip by asking one relevant trip-related question at a time.

Ask questions in this exact order, one at a time, waiting for the user's answer before proceeding:
1. Starting location (source)
2. Destination city or country
3. Group size (Solo, Couple, Family, Friends)
4. Budget (Low, Medium, High)
5. Trip duration (number of days)
6. Travel interests (e.g., adventure, sightseeing, cultural, food, nightlife, relaxation)
7. Special requirements or preferences (if any)

STRICT RULES:
- Never ask multiple questions at once
- Never repeat a question already answered
- Never think out loud, explain your reasoning, or narrate what you are about to do
- Never include phrases like "Let me ask", "I understood", "To proceed", "Thank you", or any self-referential commentary
- The "resp" field must contain ONLY the question or final plan — nothing else
- Never output raw JSON, brackets, or code inside the "resp" value
- If the user's answer implies info for a future question (e.g., they mention a city that could be a destination), silently note it and still ask the current required question first

RESPONSE FORMAT — always return a single valid JSON object on one line, no markdown, no backticks, no extra text before or after:
{"resp":"your message","ui":"none"}

The "ui" field controls which UI widget to show. Use EXACTLY these values and ONLY once each:
- "none"         → default (use for questions 1, 2, 6, 7 and all other turns)
- "groupSize"    → ONLY when asking question 3 (group size) — use exactly once
- "budget"       → ONLY when asking question 4 (budget) — use exactly once
- "TripDuration" → ONLY when asking question 5 (trip duration) — use exactly once
- "Final"        → ONLY after all 7 answers are collected — put the full trip plan in "resp"

Once a ui widget has been triggered, set ui back to "none" for every subsequent message until the next widget is due.

EXAMPLE of correct output:
{"resp":"Where will you be starting your trip from?","ui":"none"}

EXAMPLE of incorrect output (never do this):
I understood the destination. Let me ask the starting location first.{"resp":"...","ui":"none"}`;


const FINAL_PROMPT = `Generate Travel Plan with give details, give me Hotels options list with HotelName,
Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, Place address, ticket Pricing, Time travel each of the location, with each day plan with best time to visit in JSON format. Output Schema:
{
"trip_plan": {
"destination": "string",
"duration": "string".
"origin": "string".
"budget": "string",
"group_size": "string", "hotels":[
{
}
"hotel_name": "string", "hotel address": "string", "price_per_night": "string", hotel_image_url":"string", "geo_coordinates":{
"latitude": "number", "longitude": "number"
"rating": "number", "description": "string"
"itinerary":[
"day": "number",
"day_plan": "string",
"best_time_to_visit_day": "string", "activities": [
"place_name": "string", "place_details": "string", "place_image_url":"string", "geo_coordinates":{ "latitude": "number",
},
"longitude": "number"
"place_address": "string", "ticket pricing": "string",
"time_travel_each_location": "string",
"best_time_to_visit": "string`

export async function POST(req: NextRequest) {
  console.log("KEY loaded:", !!process.env.OPENAI_KEY);

  if (!process.env.OPENAI_KEY) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const { messages,isFinal } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b:free",   // auto-selects best available free model
      max_tokens: 1024,
      // removed response_format — not supported by all free models
      messages: [
        { role: "system", content:isFinal? FINAL_PROMPT:PROMPT },
        ...messages,
      ],
    });

    const raw = completion.choices[0].message.content ?? "{}";
    
    // Strip markdown code blocks if model wraps response in them
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // If JSON parse fails, wrap the raw text as a fallback
      parsed = { resp: cleaned, ui: "budget" };
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("API error:", err?.error ?? err);
    return NextResponse.json(
      { error: err?.error?.message ?? "Unknown error" },
      { status: err?.status ?? 500 }
    );
  }
}