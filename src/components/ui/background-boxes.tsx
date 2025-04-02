"use client";
import React from "react";
import { cn } from "@/lib/utils";

// Simplified component without motion animations for better performance
export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  // Reduced number of boxes for better performance
  const rows = new Array(50).fill(1);
  const cols = new Array(30).fill(1);
  
  // Direct color values
  const colors = [
    "rgb(125 211 252)", // sky-300
    "rgb(249 168 212)", // pink-300
    "rgb(134 239 172)", // green-300
    "rgb(253 224 71)",  // yellow-300
    "rgb(252 165 165)", // red-300
    "rgb(216 180 254)", // purple-300
    "rgb(147 197 253)", // blue-300
    "rgb(165 180 252)", // indigo-300
    "rgb(196 181 253)", // violet-300
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      style={{
        transform: `translate(-20%,-20%) skewX(-48deg) skewY(14deg) scale(1.5) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "fixed inset-0 flex w-screen h-screen z-0",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <div
          key={`row` + i}
          className="w-16 h-8 border-l border-slate-700 relative"
        >
          {cols.map((_, j) => {
            // Skip every other box for better performance
            if (j % 2 !== 0 && i % 2 !== 0) return null;
            
            return (
              <div
                key={`col` + j}
                onMouseEnter={(e) => {
                  // Direct DOM manipulation for instant feedback
                  e.currentTarget.style.backgroundColor = getRandomColor();
                }}
                onMouseLeave={(e) => {
                  // Clear color on leave
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                className="w-16 h-8 border-r border-t border-slate-700 relative transition-none"
              >
                {j % 4 === 0 && i % 4 === 0 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="absolute h-6 w-10 -top-[14px] -left-[22px] text-slate-700 stroke-[1px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                ) : null}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export const Boxes = React.memo(BoxesCore); 