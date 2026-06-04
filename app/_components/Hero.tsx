"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog"
import { Globe2, Landmark, Plane, Send } from "lucide-react"
import { PopularList } from "./PopularList"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

const suggestions = [
  {
    title: "Create New Trip",
    icon: <Globe2 className="text-blue-400 h-5 w-5" />,
  },
  {
    title: "Inspire me where to go",
    icon: <Plane className="text-green-400 h-5 w-5" />,
  },
  {
    title: "Discover Hidden gems",
    icon: <Landmark className="text-orange-400 h-5 w-5" />,
  },
  {
    title: "Adventure Destination",
    icon: <Globe2 className="text-yellow-400 h-5 w-5" />,
  },
]

function Hero() {
  const { user } = useUser()
  const router = useRouter()

  const onSend = () => {
    if (!user) {
      router.push("/sign-in")
      return
    }
    router.push("/create-new-trip")

    console.log("User is logged in")
  }

  return (
    <div className="mt-24 w-full flex justify-center">
      <div className="max-w-3xl w-full text-center space-y-6">

        <h1 className="text-5xl font-bold">
          Hey I'm your personal{" "}
          <span className="text-primary">trip planner</span>
        </h1>

        <p className="text-lg text-gray-600">
          Tell me what you want and I'll handle the rest: Flights, Hotels,
          trip Planner — all in seconds
        </p>

        {/* Input Box */}
        <div className="border rounded-3xl p-4 relative">
          <textarea
            placeholder="Create a trip from Paris to New York"
            className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none outline-none resize-none"
          />

          <Button
            size="icon"
            onClick={onSend}
            className="absolute bottom-6 right-6"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Suggestions */}
        <div className="flex justify-center gap-4 flex-wrap w-full">
          {suggestions.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 border rounded-full p-4 cursor-pointer hover:bg-primary hover:text-white transition-colors"
            >
              {item.icon}
              <p>{item.title}</p>
            </div>
          ))}
        </div>

        {/* Video section */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-6 mt-12">
            Not sure where to go? Let me inspire you with some amazing destinations!
          </h2>

          <HeroVideoDialog
            className="block dark:hidden"
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/exI_hD_4jAM"
            thumbnailSrc="https://www.holidaysplease.co.uk/assets/images/18-46-_YWRvYmVzdG9ja18xNDY1Njc4MzcuanBlZw%3D%3D-BasicCrop.jpg"
            thumbnailAlt="Travel inspiration video"
          />
        </div>

        {/* Popular destinations */}
        <PopularList />

      </div>
    </div>
  )
}

export default Hero