"use client";
import Image from "next/image";
import { Boxes } from "@/components/ui/background-boxes";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setEmail("");
    }, 500); // Reduced timeout for better responsiveness
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-900 overflow-hidden flex flex-col items-center justify-center">
      {/* Background boxes effect */}
      <Boxes className="absolute inset-0" />
      
      {/* Main content - centered and contained to preserve background interactivity */}
      <div className="relative z-20 text-center px-4 max-w-xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
          The Future of Music Creation is{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-sky-400 font-extrabold">Here</span>
            {/* Simplified glow effect */}
            <span className="absolute inset-0 blur-xl bg-sky-400 opacity-40 z-0"></span>
          </span>
        </h1>
        
        {/* Waitlist signup section */}
        <div className="mt-10 bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-xl">
          <h2 className="text-xl md:text-2xl font-medium text-white mb-4">Join the waitlist</h2>
          
          {submitted ? (
            <div className="text-green-400 py-4 text-lg font-medium">
              Thanks for joining! We'll be in touch soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow px-4 py-3 rounded-md bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-400/70 focus:border-transparent"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <button 
                type="submit" 
                className="bg-sky-500 hover:bg-sky-400 text-white font-medium px-6 py-3 rounded-md shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Join Now'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
