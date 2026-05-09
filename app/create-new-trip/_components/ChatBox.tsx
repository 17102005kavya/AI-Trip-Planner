"use client"
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react"
import React from 'react'

function ChatBox() {
    const onSend=()=>{
    }
  return (
    <div className='h-{87vh} flex flex-col '>
        
      <section className='flex-1 overflow-y-auto'>
    <div className='flex justify-end mt-2'>
       <div className='max-w-lg bg-primary text-white px-4 py-2 rounded-lg'>
        User Msg</div> 
    </div>
      </section>
      <section>
            <div className='flex justify-start mt-2'>
       <div className='max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg'>
        details</div> 
    </div>
        
      </section>
      <section>
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
      </section>

    </div>
  )
}

export default ChatBox
