import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import arcjet, { tokenBucket } from "@arcjet/next";
import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_KEY,
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const aj = process.env.ARCJET_KEY
  ? arcjet({
      key: process.env.ARCJET_KEY,
      rules: [
        tokenBucket({
          mode: process.env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE",
          characteristics: ["ip.src"],
          refillRate: 15,
          interval: 3600, // 15 requests per hour
          capacity: 15,
        }),
      ],
    })
  : null;

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
- "final"        → ONLY after all 7 answers are collected — put the full trip plan in "resp"

Once a ui widget has been triggered, set ui back to "none" for every subsequent message until the next widget is due.

EXAMPLE of correct output:
{"resp":"Where will you be starting your trip from?","ui":"none"}

EXAMPLE of incorrect output (never do this):
I understood the destination. Let me ask the starting location first.{"resp":"...","ui":"none"}`;

const FINAL_PROMPT = `Generate Travel Plan with the given details. Give me hotel options list with Hotel Name, Hotel Address, Price per night, Hotel Image URL, Geo Coordinates (latitude, longitude), Rating, and Description. Also suggest a day-by-day itinerary with Place Name, Place Details, Place Image URL, Geo Coordinates, Place Address, Ticket Pricing, Travel time to each location, and Best time to visit.
All details must be returned in JSON format matching the schema below:

{
  "trip_plan": {
    "destination": "string",
    "duration": "string",
    "origin": "string",
    "budget": "string",
    "group_size": "string",
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
        "hotel_image_url": "string",
        "geo_coordinates": {
          "latitude": number,
          "longitude": number
        },
        "rating": number,
        "description": "string"
      }
    ],
    "itinerary": [
      {
        "day": number,
        "day_plan": "string",
        "best_time_to_visit_day": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",
            "geo_coordinates": {
              "latitude": number,
              "longitude": number
            },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string"
          }
        ]
      }
    ]
  }
}

STRICT RULES:
1. Return ONLY a valid JSON object matching the above schema. Do not wrap it in markdown code blocks or add any other explanation.
2. Keep all text fields (like "description", "place_details", and "hotel_address") extremely short and concise (under 15 words each). This is critical to prevent running out of tokens and cutting off the JSON.`;

export async function POST(req: NextRequest) {
  console.log("KEY loaded:", !!process.env.OPENAI_KEY);

  if (aj) {
    const decision = await aj.protect(req, { requested: 1 });
    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Too Many Requests", reason: decision.reason },
        { status: 429 }
      );
    }
  }

  if (!process.env.OPENAI_KEY) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const { messages,isFinal } = await req.json();

  // Clerk authentication & Stripe Subscription Rate-limiting check
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress;

  let isPremium = false;
  let userIdInConvex = null;

  if (email) {
    const convexUser = await convex.query(api.user.getUserByEmail, { email });
    if (convexUser) {
      isPremium = convexUser.subscription === "premium";
      userIdInConvex = convexUser._id;
    }
  }

  // Only check limits on the final generation step
  if (isFinal && !isPremium && userIdInConvex) {
    const count = await convex.query(api.user.getUserTripsCountToday, {
      uid: userIdInConvex,
    });
    if (count >= 3) {
      return NextResponse.json(
        {
          error: "Free Tier Limit Reached",
          resp: "You have reached your limit of 3 free trips per day. Please upgrade to the Premium Globetrotter plan to generate unlimited trips!",
          ui: "none"
        },
        { status: 403 }
      );
    }
  }

  const apiMessages = [
    { role: "system", content: isFinal ? FINAL_PROMPT : PROMPT },
    ...messages,
  ];

  if (isFinal) {
    apiMessages.push({
      role: "user",
      content: "All details have been collected. Generate the complete travel plan in the strict JSON format matching the schema now.",
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash",
      max_tokens: 4096,
      messages: apiMessages as any,
    });

    const raw = completion.choices[0].message.content ?? "{}";
    
    // Robust JSON extractor to handle any preamble/postamble conversational text
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    let cleaned = raw;
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = raw.substring(firstBrace, lastBrace + 1);
    } else {
      // Fallback: strip markdown code blocks
      cleaned = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("--- JSON PARSING FAILED ---");
      console.error("RAW AI OUTPUT:", raw);
      console.error("CLEANED TEXT:", cleaned);
      console.error("ERROR DETAIL:", parseError);
      console.error("---------------------------");
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