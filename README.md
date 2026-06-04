# Full-Stack AI Trip Planner Web App

An ultra-premium, AI-powered travel planning SaaS application built with **Next.js 16 (Turbopack)**, **React 19**, and a reactive **Convex Cloud** database backend. 

Users can chat conversationally with an AI travel agent to compile their travel preferences, generate a detailed 3-day or multi-day trip plan complete with hotel recommendations and daily itineraries, visualize stops on an interactive map, and manage billing limits via a simulated Stripe checkout sandbox.

---

## 🌟 Key Features

* 💬 **Conversational AI Agent**: Guided step-by-step questionnaire using OpenRouter LLM APIs (`google/gemini-2.5-flash` or free-tier models).
* 📋 **Interactive Checklist**: Real-time progress indicator tracking the collection of your origin, destination, budget, group size, duration, and interests.
* 🏨 **Stay Recommendations**: Highly visual cards displaying hotels, ratings, addresses, prices, and direct Google Maps location links.
* 🗺️ **Interactive Maps**: A dynamic client-side Map component powered by Mapbox GL that falls back automatically to OpenStreetMap (OSM) embeds. Clicking on any hotel or activity automatically pans and zooms the map onto that specific location.
* 🕒 **Daily Itinerary Timeline**: Day-by-day plans specifying best visiting hours, activity descriptions, ticket pricing, and estimated travel times.
* 💳 **SaaS Billing Sandbox (India-regulated)**: A simulated visual credit card checkout dashboard that securely triggers Convex mutations to upgrade users to a `"premium"` tier, bypassing Stripe's Indian merchant onboarding restrictions.
* 🚦 **Tier-Based Rate Limiting**: Free users are strictly limited to generating **3 trips per day** (counted directly in the Convex database). Upgrading to Premium instantly unlocks unlimited generations.
* 🛡️ **Spam Protection**: Integrated with **Arcjet** token-bucket rate limiting to secure the API endpoint against bots and script spam.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons, Axios, UUID
* **Database & Real-time Backend**: Convex Cloud
* **Authentication**: Clerk Core Auth
* **AI Model Engine**: OpenRouter API (Accessing Gemini/Llama models)
* **Visuals & Geography**: Mapbox GL, OpenStreetMap, Unsplash Image Proxy Helper
* **Rate Limiting & Security**: Arcjet

