"use client";

import React, { useState } from "react";
import ChatBox from "./_components/ChatBox";
import MapComponent from "@/app/view-trip/[tripId]/_components/MapComponent";
import { Compass, Sparkles, MapPin, Hotel, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getPlacePhotoUrl } from "@/lib/photo-helper";

export default function CreateNewTripPage() {
  const [tripDetails, setTripDetails] = useState<any>(null);
  const [generatedTripId, setGeneratedTripId] = useState<string | null>(null);

  const handleTripDetailsGenerated = (tripId: string, details: any) => {
    setGeneratedTripId(tripId);
    setTripDetails(details);
  };

  const steps = [
    { label: "1. Starting Location", desc: "Where your journey begins" },
    { label: "2. Destination", desc: "Your dream getaway city" },
    { label: "3. Group Size", desc: "Solo, couple, or a crowd" },
    { label: "4. Budget", desc: "Cost range preference" },
    { label: "5. Trip Duration", desc: "Number of days on tour" },
    { label: "6. Travel Interests", desc: "Sightseeing, food, or adventure" },
    { label: "7. Special Preferences", desc: "Specific customizations" },
  ];

  const plan = tripDetails?.trip_plan || {};
  const hotels = plan.hotels || [];
  const itinerary = plan.itinerary || [];
  const destination = plan.destination || "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-60px)]">
      {/* Left Chat Area */}
      <div className="border-r border-neutral-100 h-full flex flex-col justify-between overflow-hidden p-4 bg-neutral-50/30">
        <ChatBox onTripDetailsGenerated={handleTripDetailsGenerated} />
      </div>

      {/* Right Details/Preview/Map Area */}
      <div className="h-full overflow-y-auto p-6 flex flex-col bg-white">
        {!tripDetails ? (
          // Pre-generation visual: Dynamic Step Checklist & Radar
          <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full py-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-20 h-20 bg-primary/10 border border-primary/25 rounded-3xl flex items-center justify-center shadow-inner">
                <Compass className="h-10 w-10 text-primary animate-spin" style={{ animationDuration: "12s" }} />
              </div>
            </div>

            <div className="text-center mb-10">
              <h2 className="text-2xl font-black text-neutral-800 flex items-center justify-center gap-2">
                Trip Planner Console <Sparkles className="h-5 w-5 text-primary fill-current animate-bounce" />
              </h2>
              <p className="text-gray-500 text-sm mt-1.5 max-w-sm">
                Chat with the AI planner on the left. The assistant will collect details to build your visual map & itinerary here.
              </p>
            </div>

            {/* Checklist of details */}
            <div className="w-full space-y-4 bg-neutral-50/50 border border-neutral-100 rounded-3xl p-6">
              <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">Planning checklist</h3>
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-[10px] text-gray-400 font-bold mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-neutral-700 leading-none">{step.label}</h4>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Post-generation Preview: Visual Map & Summary
          <div className="flex-1 flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              {/* Header preview banner */}
              <div className="relative h-44 w-full rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={getPlacePhotoUrl(destination, "city")}
                  alt={destination}
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-xl font-black text-white">{destination}</h3>
                  <p className="text-xs text-gray-300 font-medium">Itinerary & map coordinates generated successfully!</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 flex flex-col items-center justify-center text-center">
                  <Calendar className="h-4 w-4 text-blue-500 mb-1" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Duration</span>
                  <span className="text-xs font-black text-neutral-800">{plan.duration}</span>
                </div>
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 flex flex-col items-center justify-center text-center">
                  <Hotel className="h-4 w-4 text-purple-500 mb-1" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Hotels</span>
                  <span className="text-xs font-black text-neutral-800">{hotels.length} Options</span>
                </div>
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 flex flex-col items-center justify-center text-center">
                  <Compass className="h-4 w-4 text-orange-500 mb-1" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Stops</span>
                  <span className="text-xs font-black text-neutral-800">{itinerary.length} Days</span>
                </div>
              </div>

              {/* Embed Interactive Map */}
              <div className="h-[280px] w-full rounded-2xl overflow-hidden relative shadow-inner border border-neutral-100">
                <MapComponent
                  hotels={hotels}
                  itinerary={itinerary}
                  selectedLocation={null}
                />
              </div>
            </div>

            {/* View Full Trip CTA Button */}
            <div className="pt-4 border-t border-neutral-100">
              <Link href={`/view-trip/${generatedTripId}`}>
                <button className="w-full bg-primary hover:bg-primary/95 text-white font-extrabold text-sm py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5 transition-all duration-300 animate-bounce" style={{ animationDuration: "3s" }}>
                  Explore Full Detailed Itinerary & Route
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
