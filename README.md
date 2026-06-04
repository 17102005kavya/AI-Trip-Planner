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

---

## 🚀 Local Installation & Setup

Follow these steps to set up and run the project locally on your machine:

### 1. Clone the Repository & Install Dependencies
Open your terminal in the project directory and install the packages:
```bash
npm install
```

### 2. Set up Environment Variables
Create a `.env.local` file in the root directory of your project and configure the following variables:
```ini
# Convex deployment keys (Generated when running npx convex dev)
CONVEX_DEPLOYMENT=dev:...
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://...convex.site

# Clerk Auth Keys (From dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# OpenRouter LLM API Key (From openrouter.ai)
OPENAI_KEY=sk-or-v1-...

# Arcjet Protection Site Key (From app.arcjet.com - Optional in development)
ARCJET_KEY=ajkey_...

# Mapbox Access Token (Optional: Falls back to OpenStreetMap if left empty)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk....
```

### 3. Run the Database Backend (Convex)
Open a new terminal tab and start the Convex developer service:
```bash
npx convex dev
```
*Keep this terminal running. It automatically syncs your schemas (`convex/schema.ts`) and functions (`convex/user.ts`, `convex/tripDetail.ts`) to your database.*

### 4. Run the Development Server (Next.js)
Open another terminal tab and start the local Next.js server:
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser to inspect the application.

---

## 🧪 Testing the Flows Locally

### How to test the Premium Upgrade & Limit Gate:
1. Go to `http://localhost:3000/pricing`.
2. Click **Upgrade to Premium** and fill out the mock card details (e.g. Card Name: `Jane Doe`, Number: `4242 4242...`).
3. Click **Pay $9.99** to trigger the simulated transaction. Your user tier in the Convex database `UserTable` will update to `"premium"` in real-time.
4. Try generating a trip plan. If you are on the Free tier, you will be blocked on your 4th trip. Upgraded premium accounts bypass this limit!

### How to test the Visual Map Centering instantly:
We have built a fallback testing path so you can inspect the dashboard components immediately:
* Visit: **`http://localhost:3000/view-trip/test`**
* Click on the Eiffel Tower or Louvre items in the timeline to see the map zoom onto them.

---

## ☁️ Deployment (Vercel & Convex Cloud)

### Part 1: Deploy Convex
Deploys your schema and DB functions to the Convex production cloud:
```bash
npx convex deploy
```
Copy the **production Convex URL** printed at the end of execution.

### Part 2: Deploy Frontend on Vercel
1. Upload your code to GitHub.
2. Log in at [Vercel](https://vercel.com) and import your repository.
3. Paste all environment variables from `.env.local` into the Vercel variables panel, ensuring `NEXT_PUBLIC_CONVEX_URL` uses the **production Convex URL** copied in Part 1.
4. Click **Deploy**.

### Part 3: Connect Clerk
Go to your Clerk Dashboard, navigate to **Paths / Domains**, and enter your live Vercel URL (e.g. `your-project.vercel.app`) under the production domain section to activate production logins!
