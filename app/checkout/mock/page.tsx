"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUserDetails } from "@/app/provider";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CreditCard, ShieldCheck, Loader2, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MockCheckoutPage() {
  const router = useRouter();
  const { userDetails, setUserdetails } = useUserDetails();
  const updateSubscription = useMutation(api.user.updateSubscription);

  // Form states
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  
  // UI States
  const [processing, setProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [cardType, setCardType] = useState("visa");

  // Determine card type based on number
  useEffect(() => {
    if (cardNumber.startsWith("5")) {
      setCardType("mastercard");
    } else if (cardNumber.startsWith("3")) {
      setCardType("amex");
    } else {
      setCardType("visa");
    }
  }, [cardNumber]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces: 4242 4242...
    const value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(" "));
    } else {
      setCardNumber(value);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format expiry: MM/YY
    const value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      setExpiry(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    } else {
      setExpiry(value);
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetails?.email) {
      alert("User details not loaded. Make sure you are signed in.");
      return;
    }

    setProcessing(true);
    
    // Simulate realistic payment process gateways
    const stages = [
      "Contacting secure sandbox server...",
      "Authorizing transaction amount of $9.99...",
      "Upgrading account subscription tier in Convex database...",
      "Finishing up upgrade...",
    ];

    for (let i = 0; i < stages.length; i++) {
      setStatusText(stages[i]);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    try {
      // Update database status
      await updateSubscription({
        email: userDetails.email,
        subscription: "premium",
      });

      // Update local client context userDetails
      if (setUserdetails) {
        setUserdetails((prev: any) => ({
          ...prev,
          subscription: "premium",
        }));
      }

      router.push("/create-new-trip?success=true");
    } catch (err) {
      console.error("Mock checkout error:", err);
      alert("Payment processing simulated error. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-10 items-stretch min-h-[80vh]">
      
      {/* Left side: Simulated Credit Card & Summary */}
      <div className="flex-1 bg-neutral-50/50 border border-neutral-100 rounded-3xl p-8 flex flex-col justify-between">
        <div className="space-y-6">
          <Link href="/pricing" className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 font-semibold">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to plans
          </Link>

          <div>
            <span className="bg-purple-100 text-purple-600 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
              Mock Payments
            </span>
            <h2 className="text-2xl font-black text-neutral-800 mt-2">
              Upgrade Subscription
            </h2>
            <p className="text-gray-500 text-xs mt-1 font-medium">
              Verify Rate-Limiting capabilities with our secure local sandbox.
            </p>
          </div>

          {/* Glowing Virtual Card */}
          <div className="relative h-48 w-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-purple-950 rounded-2xl p-6 text-white shadow-xl overflow-hidden flex flex-col justify-between border border-white/5 group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
            
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold tracking-wider text-white/50 uppercase">Globetrotter Card</span>
              <span className="text-xl font-bold uppercase tracking-widest italic text-white/90">
                {cardType === "visa" && "Visa"}
                {cardType === "mastercard" && "Mastercard"}
                {cardType === "amex" && "Amex"}
              </span>
            </div>

            <div className="space-y-4">
              {/* Chip representation */}
              <div className="w-10 h-7 bg-amber-400/80 border border-amber-300/30 rounded-md"></div>
              
              {/* Numbers */}
              <p className="text-lg md:text-xl font-mono tracking-widest text-white/90">
                {cardNumber || "••••  ••••  ••••  ••••"}
              </p>
            </div>

            <div className="flex justify-between items-center text-xs">
              <div>
                <p className="text-[9px] text-white/40 uppercase font-semibold">Card Holder</p>
                <p className="font-semibold uppercase tracking-wider text-white/80 truncate max-w-[150px]">
                  {cardName || "Your Full Name"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-white/40 uppercase font-semibold">Expires</p>
                <p className="font-semibold text-white/80">{expiry || "MM/YY"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-6 mt-8 space-y-4">
          <div className="flex justify-between text-sm font-medium text-neutral-600">
            <span>Premium Globetrotter Plan</span>
            <span>$9.99</span>
          </div>
          <div className="flex justify-between text-sm font-black text-neutral-800">
            <span>Total amount due</span>
            <span>$9.99 / mo</span>
          </div>
        </div>
      </div>

      {/* Right side: Input Form */}
      <div className="flex-1 bg-white border border-neutral-100 rounded-3xl p-8 shadow-sm flex flex-col justify-center">
        {processing ? (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <h3 className="font-bold text-lg text-neutral-800">Processing Simulated Payment</h3>
            <p className="text-sm text-gray-500 max-w-xs">{statusText}</p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="space-y-5">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 mb-2">
              <Lock className="h-4 w-4 text-green-500" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Secure sandbox Checkout</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 uppercase">Cardholder Name</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-primary text-sm font-medium text-black"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 uppercase">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={19}
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-primary text-sm font-medium text-black font-mono"
                />
                <CreditCard className="absolute right-3.5 top-3.5 h-4 w-4 text-neutral-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase">Expiration</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={handleExpiryChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-primary text-sm font-medium text-black font-mono text-center"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase">CVC</label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  placeholder="•••"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-primary text-sm font-medium text-black font-mono text-center"
                />
              </div>
            </div>

            <div className="bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-100 text-[10px] text-gray-500 font-medium leading-relaxed mt-2">
              * This is a sandbox simulated environment. Enter any test values above (e.g. 4242 for Visa, 5100 for MasterCard) to execute the database upgrade securely.
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/95 text-white font-extrabold text-sm py-4 rounded-2xl shadow-lg shadow-primary/10 mt-6"
            >
              Pay $9.99
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
