import React, { useContext, useEffect, useState } from 'react'
import Header from './_components/Header';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { User } from 'lucide-react';
import { UserDetailContext } from '@/context/UserDetailContext';

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const CreateUser=useMutation(api.user.CreateNewUser);
  const [userDetails,setUserdetails]=useState<any>();
  const {user}=useUser();
  useEffect(()=>{
    user&&CreateNewUser();
  },[user])
  
  const CreateNewUser=async ()=>{
    if(user){
    const result=await CreateUser({
      name:user?.fullName,
      email:user?.emailAddresses[0]?.email,
      imageUrl:user?.imageUrl
    });
    setUserdetails(result);
  }
  }
  
  return (
    <UserDetailContext.Provider value={{userDetails,setUserdetails}}>
        <div>
        <Header/>
      {children}
    </div>
    </UserDetailContext.Provider>
  
  )
}

export default Provider

export const useUserDetails=()=>{
  const context=useContext(UserDetailContext);}
