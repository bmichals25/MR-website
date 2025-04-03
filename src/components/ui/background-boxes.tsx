"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  // Even fewer boxes for better performance
  const rows = new Array(30).fill(1);
  const cols = new Array(30).fill(1);
  
  // Track recently hovered boxes to create lingering effect
  const [hoveredBoxes, setHoveredBoxes] = useState<Record<string, string>>({});
  
  // Subtle, more transparent colors for a gentler effect
  const colors = [
    "rgba(255, 255, 255, 0.4)",   // White
    "rgba(173, 216, 230, 0.4)",   // Light blue
    "rgba(255, 182, 193, 0.4)",   // Light pink
    "rgba(152, 251, 152, 0.4)",   // Light green
    "rgba(255, 222, 173, 0.4)",   // Light orange
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleHoverStart = (boxId: string) => {
    const color = getRandomColor();
    setHoveredBoxes(prev => ({
      ...prev,
      [boxId]: color
    }));
    
    // Schedule removal of the box after delay to create lingering effect
    // Shorter duration for more fluid interaction
    setTimeout(() => {
      setHoveredBoxes(prev => {
        const newState = { ...prev };
        delete newState[boxId];
        return newState;
      });
    }, 800); // 0.8 second lingering effect - much shorter for subtle trail
  };

  return (
    <div
      style={{
        transform: `translate(-40%,-40%) skewX(-48deg) skewY(14deg) scale(2.5) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "fixed inset-0 flex w-screen h-screen z-[5] pointer-events-auto opacity-70",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="w-24 h-12 border-l border-slate-700/20 relative"
          style={{ 
            willChange: "auto"
          }}
        >
          {cols.map((_, j) => {
            // Only render every other box for performance
            if ((i + j) % 2 !== 0) return null;
            
            const boxId = `${i}-${j}`;
            const isActive = boxId in hoveredBoxes;
            const color = hoveredBoxes[boxId];
            
            return (
              <motion.div
                onHoverStart={() => handleHoverStart(boxId)}
                animate={{
                  backgroundColor: isActive ? color : "transparent",
                  boxShadow: isActive ? "0 0 6px rgba(255, 255, 255, 0.3)" : "none",
                  scale: isActive ? 1.05 : 1,
                }}
                transition={{ 
                  duration: 0.2,
                  type: "tween",
                  ease: "easeOut"
                }}
                key={`col` + j}
                className="w-24 h-12 border-r border-t border-slate-700/20 relative cursor-pointer"
                style={{
                  willChange: "auto",
                  zIndex: isActive ? 5 : 0
                }}
              >
                {j % 8 === 0 && i % 8 === 0 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="absolute h-6 w-10 -top-[14px] -left-[22px] text-slate-700/30 stroke-[1px]"
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