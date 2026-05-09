"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { useUser } from '@clerk/nextjs';

const menuOptions = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Pricing",
    link: "/pricing",
  },
  {
    name: "Contact us",
    link: "/contact-us",
  },
];

function Header() {
  const {user}=useUser();
  return (
    <div className="flex justify-between items-center p-2">
      
      <div className="flex gap-2 items-center">
        <Image src="/image.png" alt="logo" width={100} height={100} />
        <h2 className="font-bold text-2xl">AI Trip Planner</h2>
      </div>

      <div className="flex gap-12 items-center">
        {menuOptions.map((option) => (
          <Link key={option.link} href={option.link}>
            <h2 className="ml-5 text-gray-600 hover:text-gray-900">
              {option.name}
            </h2>
          </Link>
        ))}
      </div>

      {!user ? <SignInButton mode="modal">
        <Button>Get Started</Button>
      </SignInButton>:
      <Link href="/create-new-trip">
        <Button>Create new trip</Button>
      </Link>}

    </div>
  );
}

export default Header;