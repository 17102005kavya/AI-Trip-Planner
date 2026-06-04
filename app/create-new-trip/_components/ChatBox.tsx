"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import EmptyState from "./EmptyState";
import BudgetUi from "./BudgetUi";
import GroupSize from "./GroupSize";
import DaysUi from "./DaysUi";
import FinalUi from "./FinalUi";
import { useMutation } from "convex/react";
import { v4 as uuidv4 } from "uuid";
import { api } from "@/convex/_generated/api";
import { useUserDetails } from "@/app/provider";

import { useRouter } from "next/navigation";

type Message = {
  role: string;
  content: string;
  ui?:string;
};

type tripInfo={
  budget: string,
  destination:string,
  duration: string,
  group_size: string,
  origin: string,
  hotels:any,
  iterinary:any,
}

interface ChatBoxProps {
  onTripDetailsGenerated?: (tripId: string, details: any) => void;
}

function ChatBox({ onTripDetailsGenerated }: ChatBoxProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [tripDetails, setTripDetails] = useState<tripInfo | null>(null);
  const [generatedTripId, setGeneratedTripId] = useState<string | null>(null);
  const SaveTripDetail = useMutation(api.tripDetail.CreateTripDetail);
  const { userDetails } = useUserDetails();

  const onSend = async (textToSend?: string, forceFinal?: boolean) => {
    const text = textToSend !== undefined ? textToSend : userInput;
    if (!text.trim() || loading) return;

    const newMsg: Message = {
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, newMsg]);
    setUserInput("");
    setLoading(true);

    const isFinalCall = forceFinal !== undefined ? forceFinal : isFinal;

    try {
      const result = await axios.post("/api/aimodel", {
        messages: [...messages, newMsg],
        isFinal: isFinalCall,
      });

      !isFinalCall && setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.data.resp,
          ui: result.data.ui,
        },
      ]);
      if(isFinalCall){
        setTripDetails(result.data);
        const tripId=uuidv4(); // Generate a unique trip ID
        setGeneratedTripId(tripId);
        
        const planToSave = result.data.trip_plan || result.data || {};
        
        if (userDetails?._id) {
          await SaveTripDetail({
            tripDetail: planToSave,
            uid: userDetails._id,
            tripId: tripId,
          });
        } else {
          console.error("User not signed in or not found in UserTable");
        }

        if (onTripDetailsGenerated) {
          onTripDetailsGenerated(tripId, result.data);
        }
      }
    } catch (error: any) {
      console.log(error);
      const errorMsg = error?.response?.data?.resp || "Something went wrong.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMsg,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const RenderGenerativeui=(ui:string)=>{
    if(ui=='budget'){
      return <BudgetUi onSelectedOption={(option:string)=>{onSend(option)}}/>

    }
    else if(ui=='groupSize'){
      return <GroupSize onSelectedOption={(option:string)=>{onSend(option)}}/>
    }
    else if(ui=='TripDuration'){
      return <DaysUi onSelectedOption={(option:string)=>{onSend(option)}}/>
    }
    else if(ui=='final'){
      return <FinalUi viewTrip={() => generatedTripId && router.push(`/view-trip/${generatedTripId}`)} disable={!generatedTripId} />
    }
    return null;

  }
  
  useEffect(() => {
    const lastMsg = messages[messages.length - 1]; 
    if (lastMsg?.ui == 'final') {
      setIsFinal(true);
      onSend('Ok, Great!', true);
    }
  }, [messages]);

  return (
    <div className="h-[87vh] flex flex-col">

      {/* CHAT AREA */}
      <section className="flex-1 overflow-y-auto px-2">

        {/* ONLY ADDITION */}
        {messages.length === 0 ? (
          <EmptyState onSelectOption={(v:string)=>{onSend(v)}} />
        ) : (
          <>
            {/* MESSAGES */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex mt-3 ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-lg px-4 py-2 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {msg.content}
                  {RenderGenerativeui(msg.ui??"")}
                </div>
              </div>
            ))}

            {/* LOADING */}
            {loading && (
              <div className="flex justify-start mt-3">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                  <Loader2 className="animate-spin h-5 w-5" />
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* INPUT */}
      <section>
        <div className="border rounded-3xl p-4 relative">
          <textarea
            placeholder="Start typing here..."
            className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none outline-none resize-none"
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
          />

          <Button
            size="icon"
            onClick={() => onSend()}
            disabled={loading}
            className="absolute bottom-6 right-6"
          >
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </section>
    </div>
  );
}

export default ChatBox;