
import React from 'react'
import ChatBox from './_components/ChatBox';

function Page() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 h-screen'>
      <div>
<ChatBox/>
      </div>
      <div>
map and trip
      </div>
    </div>
  )
}

export default Page;
