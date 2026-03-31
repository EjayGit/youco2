"use client"

import { SignInButton, SignUpButton } from "@clerk/react";
import HomeChart from '@/components/HomeChart';

export default function Home() {
  return (
    <>
      <div style={{ display: "flex", gap: "1rem" }}>
        <SignInButton mode="modal">
          <button className="btn-primary">Sign In</button>
        </SignInButton>

        <SignUpButton mode="modal">
          <button className="btn-secondary">Sign Up</button>
        </SignUpButton>
      </div>
      <HomeChart />
    </>
  );
}
