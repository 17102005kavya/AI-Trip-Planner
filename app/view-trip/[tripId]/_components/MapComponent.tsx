"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Compass, MapPin } from "lucide-react";

interface MapComponentProps {
  hotels: any[];
  itinerary: any[];
  selectedLocation: { latitude: number; longitude: number } | null;
}

export default function MapComponent({
  hotels,
  itinerary,
  selectedLocation,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapboxError, setMapboxError] = useState(false);

  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  // Extract all geolocations from hotels and itinerary
  const locations: { name: string; lat: number; lng: number; type: "hotel" | "activity" }[] = [];

  hotels?.forEach((h) => {
    const lat = Number(h.geo_coordinates?.latitude);
    const lng = Number(h.geo_coordinates?.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      locations.push({ name: h.hotel_name, lat, lng, type: "hotel" });
    }
  });

  itinerary?.forEach((day) => {
    day.activities?.forEach((act: any) => {
      const lat = Number(act.geo_coordinates?.latitude);
      const lng = Number(act.geo_coordinates?.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        locations.push({ name: act.place_name, lat, lng, type: "activity" });
      }
    });
  });

  // Calculate center coordinate
  let centerLat = 0;
  let centerLng = 0;
  if (selectedLocation) {
    centerLat = selectedLocation.latitude;
    centerLng = selectedLocation.longitude;
  } else if (locations.length > 0) {
    const sumLat = locations.reduce((sum, loc) => sum + loc.lat, 0);
    const sumLng = locations.reduce((sum, loc) => sum + loc.lng, 0);
    centerLat = sumLat / locations.length;
    centerLng = sumLng / locations.length;
  } else {
    // Default center (Paris)
    centerLat = 48.8566;
    centerLng = 2.3522;
  }

  // Initialize Mapbox map
  useEffect(() => {
    if (!token || !mapContainerRef.current || mapboxError) return;

    try {
      mapboxgl.accessToken = token;
      
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [centerLng, centerLat],
        zoom: 12,
      });

      mapRef.current = map;

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Draw markers
      locations.forEach((loc) => {
        // Create custom HTML element for marker
        const el = document.createElement("div");
        el.className = `w-8 h-8 flex items-center justify-center rounded-full text-white shadow-lg border-2 border-white transition-all transform hover:scale-110 cursor-pointer ${
          loc.type === "hotel" ? "bg-purple-600" : "bg-primary"
        }`;
        
        // Use inline SVG or simple icon inside
        el.innerHTML = loc.type === "hotel" ? "🏨" : "📍";

        // Create Popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div class="p-1 font-sans">
            <h3 class="font-bold text-sm text-neutral-800">${loc.name}</h3>
            <p class="text-xs text-neutral-500 capitalize">${loc.type}</p>
          </div>`
        );

        // Add Marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat([loc.lng, loc.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });

      return () => {
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
        map.remove();
        mapRef.current = null;
      };
    } catch (err) {
      console.error("Mapbox failed to load, falling back to OSM", err);
      setMapboxError(true);
    }
  }, [token, mapboxError]);

  // Handle selected location changes
  useEffect(() => {
    if (mapRef.current && selectedLocation) {
      mapRef.current.flyTo({
        center: [selectedLocation.longitude, selectedLocation.latitude],
        zoom: 14,
        essential: true,
      });
    }
  }, [selectedLocation]);

  // Fallback map renderer using OpenStreetMap iframe
  const renderOsmFallback = () => {
    const lat = selectedLocation ? selectedLocation.latitude : centerLat;
    const lng = selectedLocation ? selectedLocation.longitude : centerLng;
    // Map bounding box for embed
    const offset = 0.015;
    const bboxMinLng = lng - offset;
    const bboxMinLat = lat - offset;
    const bboxMaxLng = lng + offset;
    const bboxMaxLat = lat + offset;

    const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bboxMinLng}%2C${bboxMinLat}%2C${bboxMaxLng}%2C${bboxMaxLat}&layer=mapnik&marker=${lat}%2C${lng}`;

    return (
      <div className="w-full h-full relative rounded-3xl overflow-hidden border border-neutral-200 shadow-md">
        <iframe
          title="Trip Map"
          width="100%"
          height="100%"
          src={osmUrl}
          style={{ border: 0 }}
          className="absolute inset-0 bg-neutral-100"
        />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-neutral-100 rounded-2xl p-3 shadow-lg max-w-xs pointer-events-none">
          <div className="flex gap-2 items-center">
            <Compass className="h-4 w-4 text-primary animate-spin" style={{ animationDuration: "10s" }} />
            <h4 className="font-bold text-xs text-neutral-800">Interactive Trip Map</h4>
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">
            Displaying active stop. Select any hotel or activity to pan the view.
          </p>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm border border-neutral-100 rounded-xl px-3 py-2 shadow-lg flex gap-3 text-xs font-semibold pointer-events-none">
          <div className="flex items-center gap-1">
            <span className="text-purple-600">🏨</span> Hotel
          </div>
          <div className="flex items-center gap-1">
            <span className="text-primary">📍</span> Activity
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px]">
      {!token || mapboxError ? (
        renderOsmFallback()
      ) : (
        <div
          ref={mapContainerRef}
          className="w-full h-full rounded-3xl overflow-hidden shadow-md border border-neutral-200 min-h-[450px]"
        />
      )}
    </div>
  );
}
