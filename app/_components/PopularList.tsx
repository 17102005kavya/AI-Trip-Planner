"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function PopularList() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Discover Popular Destinations Around the World
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = ({ place }: { place: string }) => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        <span className="font-bold text-neutral-700 dark:text-neutral-200">
          Explore {place}.
        </span>{" "}
        Discover breathtaking landscapes, vibrant culture, delicious food, and
        unforgettable experiences. Plan your next adventure and create memories
        that will last a lifetime.
      </p>
    </div>
  );
};

const data = [
  {
    category: "France",
    title: "Visit the romantic city of Paris",
    src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2070&auto=format&fit=crop",
    content: <DummyContent place="Paris" />,
  },
  {
    category: "Italy",
    title: "Sail through the canals of Venice",
    src: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2070&auto=format&fit=crop",
    content: <DummyContent place="Venice" />,
  },
  {
    category: "Japan",
    title: "Experience the energy of Tokyo",
    src: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=2070&auto=format&fit=crop",
    content: <DummyContent place="Tokyo" />,
  },
  {
    category: "UAE",
    title: "Explore the futuristic city of Dubai",
    src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop",
    content: <DummyContent place="Dubai" />,
  },
  {
    category: "USA",
    title: "See the iconic skyline of New York",
    src: "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent place="New York" />,
  },
  {
    category: "Australia",
    title: "Discover the beauty of Sydney",
    src: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2070&auto=format&fit=crop",
    content: <DummyContent place="Sydney" />,
  },
];