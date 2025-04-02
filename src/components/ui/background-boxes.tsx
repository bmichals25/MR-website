"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  // Reduce the number of rows and columns for better performance
  const rows = new Array(75).fill(1);
  const cols = new Array(50).fill(1);
  const [randomBoxes, setRandomBoxes] = useState<Record<string, string>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Using direct color values instead of CSS variables
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

  // Optimized random glowing boxes effect with fewer updates
  useEffect(() => {
    // Only light up a few boxes at a time (3 instead of potentially many)
    const updateRandomBoxes = () => {
      const newBoxes: Record<string, string> = {};
      
      // Limit to just 3 random boxes for better performance
      for (let i = 0; i < 3; i++) {
        const randomRow = Math.floor(Math.random() * rows.length);
        const randomCol = Math.floor(Math.random() * cols.length);
        const key = `${randomRow}-${randomCol}`;
        newBoxes[key] = getRandomColor();
      }
      
      setRandomBoxes(newBoxes);
      
      // Clear after a delay
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setRandomBoxes({});
      }, 800);
    };
    
    // Run less frequently - every 3 seconds instead of 2
    intervalRef.current = setInterval(updateRandomBoxes, 3000);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      style={{
        transform: `translate(-20%,-20%) skewX(-48deg) skewY(14deg) scale(1.5) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "fixed inset-0 flex w-screen h-screen z-0 pointer-events-none",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="w-16 h-8 border-l border-slate-700 relative"
        >
          {cols.map((_, j) => {
            // Only render every other column for better performance
            if (j % 2 !== 0 && i % 2 !== 0) return null;
            
            const key = `${i}-${j}`;
            const hasColor = randomBoxes[key];
            
            return (
              <motion.div
                key={`col` + j}
                style={{
                  backgroundColor: hasColor ? randomBoxes[key] : undefined,
                }}
                className="w-16 h-8 border-r border-t border-slate-700 relative"
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
              </motion.div>
            );
          })}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore); 