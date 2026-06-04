"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Check, Loader2, Sparkles, Plane, ShieldCheck, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = () => {
    if (!isSignedIn) return;
    router.push("/checkout/mock");
  };

  const plans = [
    {
      name: "Free Explorer",
      price: "$0",
      period: "forever",
      desc: "For occasional travelers planning quick getaways.",
      icon: <Plane className="h-6 w-6 text-neutral-400" />,
      features: [
        "Create up to 3 trips per day",
        "Day-by-day itinerary timeline",
        "Hotel stay recommendations",
        "Standard interactive maps",
        "Concise destination descriptions",
      ],
      buttonText: "Current Plan",
      premium: false,
    },
    {
      name: "Premium Globetrotter",
      price: "$9.99",
      period: "month",
      desc: "For adventurers who want complete plans with zero limits.",
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      features: [
        "Unlimited trip generations",
        "Extended details and descriptions",
        "Priority AI model response times",
        "Interactive route coordinate tracking",
        "Premium hotel & activity photo mapping",
        "Cancel subscription anytime",
      ],
      buttonText: "Upgrade to Premium",
      premium: true,
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center">
      {/* Header text */}
      <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
        <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
          Simple Pricing Plans
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-neutral-800 tracking-tight leading-none">
          Ready to explore <span className="text-primary">without limits?</span>
        </h1>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
          Start for free or upgrade to Premium to unlock unlimited AI trip planning, deeper details, and priority model execution.
        </p>
      </div>

      {/* Plans comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`bg-white border rounded-3xl p-8 relative flex flex-col justify-between shadow-sm transition-all duration-300 ${
              plan.premium
                ? "border-primary shadow-md hover:shadow-lg ring-2 ring-primary/15"
                : "border-neutral-100 hover:border-neutral-200"
            }`}
          >
            {plan.premium && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                <Zap className="h-3 w-3 fill-current animate-pulse" />
                Highly Recommended
              </div>
            )}

            <div className="space-y-6">
              {/* Plan title */}
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xl text-neutral-800">{plan.name}</h3>
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center border border-neutral-100">
                  {plan.icon}
                </div>
              </div>

              <p className="text-sm text-gray-500 min-h-[40px] leading-relaxed">{plan.desc}</p>

              {/* Price display */}
              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-4xl md:text-5xl font-black text-neutral-800">{plan.price}</span>
                <span className="text-xs font-bold text-gray-400 uppercase">/ {plan.period}</span>
              </div>

              {/* Feature checkmark list */}
              <ul className="space-y-4 pt-6 border-t border-neutral-50">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex gap-3 items-center text-sm font-medium text-neutral-600">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-50 border border-green-200 text-green-500 flex items-center justify-center">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action CTA Button */}
            <div className="mt-10">
              {plan.premium ? (
                isSignedIn ? (
                  <Button
                    disabled={loading}
                    onClick={handleSubscribe}
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Upgrade to Premium
                        <Sparkles className="h-4 w-4 fill-current" />
                      </>
                    )}
                  </Button>
                ) : (
                  <SignInButton mode="modal">
                    <Button className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-4 rounded-2xl">
                      Get Started
                    </Button>
                  </SignInButton>
                )
              ) : (
                <Button
                  disabled
                  className="w-full bg-neutral-100 text-neutral-400 border border-neutral-200 font-bold py-4 rounded-2xl cursor-not-allowed shadow-none"
                >
                  {plan.buttonText}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info Badge */}
      <div className="mt-12 flex items-center gap-2 text-xs text-gray-400 font-medium bg-neutral-50 px-4 py-2 rounded-full border border-neutral-100">
        <ShieldCheck className="h-4 w-4 text-green-500" />
        Secure checkout powered by Stripe. You can upgrade or downgrade anytime.
      </div>
    </main>
  );
}
