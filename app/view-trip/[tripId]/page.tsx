"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getPlacePhotoUrl } from "@/lib/photo-helper";
import MapComponent from "./_components/MapComponent";
import {
  Calendar,
  DollarSign,
  Users,
  Compass,
  MapPin,
  Star,
  ExternalLink,
  ChevronRight,
  Clock,
  Ticket,
} from "lucide-react";
import Image from "next/image";

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.tripId as string;

  // Retrieve trip details from Convex
  const tripResult = useQuery(api.tripDetail.GetTripDetail, { tripId });

  // Mock dataset to verify UI and maps without Convex or OpenRouter running
  const mockTrip = {
    tripDetail: {
      destination: "Paris, France",
      duration: "3 Days",
      origin: "New York, USA",
      budget: "Moderate",
      group_size: "Couple",
      hotels: [
        {
          hotel_name: "Hotel Regina Louvre",
          hotel_address: "2 Place des Pyramides, 75001 Paris, France",
          price_per_night: "€250",
          rating: 4.8,
          description: "Elegant 19th-century hotel offering refined rooms & suites, plus an upscale restaurant & a bar.",
          geo_coordinates: { latitude: 48.8631, longitude: 2.3315 }
        },
        {
          hotel_name: "Hôtel Les Deux Gares",
          hotel_address: "2 Rue des Deux Gares, 75010 Paris, France",
          price_per_night: "€140",
          rating: 4.5,
          description: "Colorful, eclectic boutique lodging offering quirky rooms, plus a fitness room & a sauna.",
          geo_coordinates: { latitude: 48.8795, longitude: 2.3592 }
        }
      ],
      itinerary: [
        {
          day: 1,
          day_plan: "Iconic Sights & Eiffel Tower View",
          best_time_to_visit_day: "09:00 AM - 08:00 PM",
          activities: [
            {
              place_name: "Eiffel Tower",
              place_details: "The iconic iron grid tower on the Champ de Mars, offering panoramic views of Paris.",
              place_address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
              ticket_pricing: "€26.80",
              time_travel_each_location: "Starting point",
              best_time_to_visit: "Morning",
              geo_coordinates: { latitude: 48.8584, longitude: 2.2945 }
            },
            {
              place_name: "Louvre Museum",
              place_details: "The world's largest art museum, home to the Mona Lisa and thousands of historic treasures.",
              place_address: "Rue de Rivoli, 75001 Paris, France",
              ticket_pricing: "€17.00",
              time_travel_each_location: "15 mins ride",
              best_time_to_visit: "Afternoon",
              geo_coordinates: { latitude: 48.8606, longitude: 2.3376 }
            }
          ]
        },
        {
          day: 2,
          day_plan: "Montmartre Artist Culture & Cafes",
          best_time_to_visit_day: "10:00 AM - 09:00 PM",
          activities: [
            {
              place_name: "Sacre-Coeur Basilica",
              place_details: "Stunning white-domed church on top of the Montmartre hill, offering the highest view of Paris.",
              place_address: "35 Rue du Chevalier de la Barre, 75018 Paris, France",
              ticket_pricing: "Free entry",
              time_travel_each_location: "20 mins Metro",
              best_time_to_visit: "Morning",
              geo_coordinates: { latitude: 48.8867, longitude: 2.3431 }
            },
            {
              place_name: "Moulin Rouge",
              place_details: "The world-famous cabaret birthplace of the modern can-can dance, located in Pigalle.",
              place_address: "82 Boulevard de Clichy, 75018 Paris, France",
              ticket_pricing: "€120+",
              time_travel_each_location: "10 mins walk",
              best_time_to_visit: "Evening",
              geo_coordinates: { latitude: 48.8841, longitude: 2.3323 }
            }
          ]
        }
      ]
    }
  };

  const trip = tripId === "test" ? mockTrip : tripResult;

  // Map state to track the active location selection
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  if (trip === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-semibold animate-pulse">Loading your custom itinerary...</p>
      </div>
    );
  }

  if (trip === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
        <h2 className="text-2xl font-bold text-neutral-800">Trip Not Found</h2>
        <p className="text-gray-500 mt-2 max-w-sm">
          We couldn't locate details for this trip. Make sure you generated it successfully.
        </p>
      </div>
    );
  }

  const { destination, duration, budget, group_size, origin, hotels, itinerary } =
    trip.tripDetail || {};

  const handleLocatePlace = (geo: { latitude: number; longitude: number } | undefined) => {
    if (geo && geo.latitude && geo.longitude) {
      setSelectedLocation({
        latitude: Number(geo.latitude),
        longitude: Number(geo.longitude),
      });
    }
  };

  const getGoogleMapsSearchUrl = (name: string, address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${name} ${address}`
    )}`;
  };

  const heroImage = getPlacePhotoUrl(destination, "city");

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Banner Section */}
      <section className="relative h-[250px] md:h-[400px] w-full rounded-3xl overflow-hidden shadow-xl mb-8">
        <Image
          src={heroImage}
          alt={destination}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-10">
          <span className="bg-primary text-white text-xs md:text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit mb-3">
            Your Generated Trip
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            Explore {destination}
          </h1>
          <p className="text-gray-300 text-sm md:text-base mt-2 flex items-center gap-1.5 font-medium">
            <MapPin className="h-4.5 w-4.5 text-primary-foreground" />
            Departing from {origin}
          </p>
        </div>
      </section>

      {/* Trip Info Quick Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white border border-neutral-100 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 text-xl">
            📅
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold">Duration</p>
            <p className="text-sm font-bold text-neutral-800">{duration}</p>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0 text-xl">
            💰
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold">Budget</p>
            <p className="text-sm font-bold text-neutral-800 capitalize">{budget}</p>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center flex-shrink-0 text-xl">
            👥
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold">Travelers</p>
            <p className="text-sm font-bold text-neutral-800 capitalize">{group_size}</p>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0 text-xl">
            🗺️
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold">Destination</p>
            <p className="text-sm font-bold text-neutral-800 truncate max-w-[120px]">
              {destination}
            </p>
          </div>
        </div>
      </section>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Itinerary/Hotels Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* Hotel Recommendations */}
          <div>
            <h2 className="text-2xl font-black text-neutral-800 flex items-center gap-2 mb-6">
              🏨 Stay Recommendations
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotels?.map((hotel: any, index: number) => {
                const hotelImage = getPlacePhotoUrl(hotel.hotel_name, "hotel");
                return (
                  <div
                    key={index}
                    onClick={() => handleLocatePlace(hotel.geo_coordinates)}
                    className="group bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer flex flex-col h-full"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={hotelImage}
                        alt={hotel.hotel_name}
                        fill
                        sizes="(max-width: 768px) 100vw, 350px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-yellow-600 shadow-sm">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {hotel.rating}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-neutral-800 line-clamp-1 group-hover:text-primary transition-colors">
                          {hotel.hotel_name}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 line-clamp-1">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          {hotel.hotel_address}
                        </p>
                        <p className="text-xs text-gray-600 mt-3 line-clamp-2">
                          {hotel.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-5 pt-3 border-t border-neutral-50">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            Est. Price
                          </p>
                          <p className="text-sm font-black text-neutral-800">
                            {hotel.price_per_night}
                            <span className="text-xs font-medium text-gray-500"> / night</span>
                          </p>
                        </div>

                        <a
                          href={getGoogleMapsSearchUrl(hotel.hotel_name, hotel.hotel_address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-xl bg-neutral-50 text-neutral-600 hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-sm"
                          title="Search on Google Maps"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Itinerary */}
          <div>
            <h2 className="text-2xl font-black text-neutral-800 flex items-center gap-2 mb-8">
              🗺️ Day Plan & Activities
            </h2>

            <div className="space-y-8 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-[2px] before:bg-neutral-100">
              {itinerary?.map((dayPlan: any, dayIdx: number) => (
                <div key={dayIdx} className="relative pl-12">
                  {/* Day marker pin */}
                  <div className="absolute left-[13px] top-1.5 w-8 h-8 rounded-full bg-primary text-white border-4 border-white shadow-md flex items-center justify-center font-black text-sm z-10">
                    {dayPlan.day}
                  </div>

                  <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 mb-6 border-b border-neutral-50">
                      <div>
                        <h3 className="font-black text-xl text-neutral-800">
                          Day {dayPlan.day}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">
                          {dayPlan.day_plan || "Explore the sights"}
                        </p>
                      </div>
                      {dayPlan.best_time_to_visit_day && (
                        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full w-fit flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          Best hours: {dayPlan.best_time_to_visit_day}
                        </span>
                      )}
                    </div>

                    <div className="space-y-6">
                      {dayPlan.activities?.map((activity: any, actIdx: number) => {
                        const activityImage = getPlacePhotoUrl(activity.place_name, "sight");
                        return (
                          <div
                            key={actIdx}
                            onClick={() => handleLocatePlace(activity.geo_coordinates)}
                            className="group flex flex-col md:flex-row gap-5 p-4 rounded-2xl hover:bg-neutral-50 cursor-pointer transition-colors duration-200"
                          >
                            <div className="relative h-32 w-full md:w-32 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                              <Image
                                src={activityImage}
                                alt={activity.place_name}
                                fill
                                sizes="120px"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between gap-4">
                                  <h4 className="font-extrabold text-base text-neutral-800 line-clamp-1 group-hover:text-primary transition-colors">
                                    {activity.place_name}
                                  </h4>
                                  {activity.best_time_to_visit && (
                                    <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex-shrink-0">
                                      🕒 {activity.best_time_to_visit}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2 mt-1.5">
                                  {activity.place_details}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-400 mt-4 font-medium">
                                {activity.ticket_pricing && (
                                  <span className="flex items-center gap-1">
                                    <Ticket className="h-3.5 w-3.5 text-green-500" />
                                    {activity.ticket_pricing}
                                  </span>
                                )}
                                {activity.time_travel_each_location && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5 text-blue-500" />
                                    Travel time: {activity.time_travel_each_location}
                                  </span>
                                )}
                                <span className="flex items-center gap-1 text-primary hover:underline">
                                  <Compass className="h-3.5 w-3.5 text-primary" />
                                  Locate map
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Map Column */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6 space-y-6">
            <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm">
              <h3 className="font-black text-lg text-neutral-800 flex items-center gap-2 mb-4">
                🗺️ Route & Stops
              </h3>

              <div className="h-[450px] w-full rounded-2xl overflow-hidden relative">
                <MapComponent
                  hotels={hotels || []}
                  itinerary={itinerary || []}
                  selectedLocation={selectedLocation}
                />
              </div>

              <div className="mt-4 text-xs text-gray-400 font-medium leading-relaxed">
                * Select hotels or activities in the list on the left to instantly center and focus the map on their location.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
