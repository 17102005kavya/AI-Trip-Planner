/**
 * Helper to get a beautiful high-resolution image URL from Unsplash
 * matching the type of place (hotel, beach, restaurant, city, etc.)
 * based on keywords, using a stable hash function so the same place
 * always shows the same image.
 */
export function getPlacePhotoUrl(placeName: string, fallbackCategory?: string): string {
  const categoryImages: Record<string, string> = {
    hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    sight: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80",
    restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
    beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    city: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&auto=format&fit=crop&q=80",
    nature: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=80",
    adventure: "https://images.unsplash.com/photo-1533240332313-0db49b439ad3?w=800&auto=format&fit=crop&q=80"
  };

  const nameLower = placeName?.toLowerCase() || "";
  
  if (nameLower.includes("hotel") || nameLower.includes("resort") || nameLower.includes("inn") || nameLower.includes("stay") || nameLower.includes("hostel") || nameLower.includes("motel")) {
    return categoryImages.hotel;
  }
  if (nameLower.includes("beach") || nameLower.includes("coast") || nameLower.includes("island") || nameLower.includes("sea") || nameLower.includes("ocean")) {
    return categoryImages.beach;
  }
  if (nameLower.includes("park") || nameLower.includes("mountain") || nameLower.includes("lake") || nameLower.includes("forest") || nameLower.includes("hiking") || nameLower.includes("river") || nameLower.includes("garden")) {
    return categoryImages.nature;
  }
  if (nameLower.includes("restaurant") || nameLower.includes("food") || nameLower.includes("cafe") || nameLower.includes("bar") || nameLower.includes("dinner") || nameLower.includes("bistro")) {
    return categoryImages.restaurant;
  }
  if (nameLower.includes("museum") || nameLower.includes("temple") || nameLower.includes("castle") || nameLower.includes("church") || nameLower.includes("historical") || nameLower.includes("palace") || nameLower.includes("monument")) {
    return categoryImages.sight;
  }
  
  if (fallbackCategory && categoryImages[fallbackCategory]) {
    return categoryImages[fallbackCategory];
  }

  // Stable hash to pick a generic travel image
  let hash = 0;
  for (let i = 0; i < nameLower.length; i++) {
    hash = nameLower.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const imageIds = [
    "photo-1469854523086-cc02fe5d8800", // travel road
    "photo-1476514525535-07fb3b4ae5f1", // boat in lake
    "photo-1488646953014-85cb44e25828", // travel map/passport
    "photo-1501854140801-50d01698950b", // scenic mountains
    "photo-1472214222541-d510753a4907"  // nature field
  ];
  
  const idx = Math.abs(hash) % imageIds.length;
  return `https://images.unsplash.com/${imageIds[idx]}?w=800&auto=format&fit=crop&q=80`;
}
