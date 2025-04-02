"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CustomRainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "default" | "lg";
}

export function CustomRainbowButton({
  children,
  className,
  size = "default",
  ...props
}: CustomRainbowButtonProps) {
  return (
    <div className="relative group inline-block">
      {/* Rainbow border - outermost layer */}
      <div 
        className="absolute -inset-0.5 rounded-full opacity-70 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-sm group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"
      />
      
      {/* Button with solid background */}
      <button
        className={cn(
          "relative rounded-full",
          "flex items-center justify-center",
          "bg-black text-white font-medium",
          "border-0 outline-none focus:ring-2 focus:ring-blue-500/50",
          "transition-all duration-300",
          size === "default" ? "px-6 py-3 text-base" : "px-8 py-4 text-lg",
          className
        )}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}

// Add this to your globals.css
// @keyframes gradient-x {
//   0%, 100% {
//     background-position: 0% 50%;
//   }
//   50% {
//     background-position: 100% 50%;
//   }
// } 