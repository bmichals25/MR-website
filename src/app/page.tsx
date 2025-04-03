"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Boxes } from "@/components/ui/background-boxes";
import { CustomRainbowButton } from "@/components/ui/custom-rainbow-button";
import { motion, AnimatePresence } from "framer-motion";
import NotificationToast from "@/components/ui/notification-toast";

export default function Home() {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [metaQuestChecked, setMetaQuestChecked] = useState(false);
  const [visionProChecked, setVisionProChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ 
    message: string; 
    type: 'success' | 'error'; 
    show: boolean;
  } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const handleButtonClick = () => {
    console.log("Button clicked - current showWaitlist state:", showWaitlist);
    setShowWaitlist(true);
  };
  
  // This effect adds a global click handler when the modal is open
  useEffect(() => {
    if (!showWaitlist) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      // If clicking outside the modal, close it
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowWaitlist(false);
      }
    };
    
    // Add the event listener to the document
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up the event listener when component unmounts or modal closes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showWaitlist]);
  
  // Reset checkbox states when modal closes
  useEffect(() => {
    if (!showWaitlist) {
      setMetaQuestChecked(false);
      setVisionProChecked(false);
    }
  }, [showWaitlist]);
  
  console.log("Rendering Home component, showWaitlist:", showWaitlist);
  
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const ownsMetaQuest = formData.get('meta_quest') === 'on';
    const ownsVisionPro = formData.get('vision_pro') === 'on';
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          ownsMetaQuest,
          ownsVisionPro
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }
      
      // Show success notification
      setNotification({
        message: `Thanks, ${name}! We'll notify you at ${email} when we launch.`,
        type: 'success',
        show: true
      });
      
      // Close form after submission
      setTimeout(() => {
        setShowWaitlist(false);
      }, 1000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setNotification({
        message: error instanceof Error ? error.message : 'Failed to submit form',
        type: 'error',
        show: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#070B34] to-[#0D1339] overflow-hidden">
      {/* Background always remains interactive */}
      <Boxes className="absolute inset-0" />
      
      {/* Main Content - fades when waitlist is shown */}
      <AnimatePresence mode="wait">
        {!showWaitlist && (
          <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-start pt-8 pointer-events-none z-10"
          >
            <div className="relative w-[300px] h-[300px] mb-0 pointer-events-none">
              <Image 
                src="/Untitled design (4).gif" 
                alt="MR Logo Animation" 
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            <div className="text-5xl md:text-7xl lg:text-8xl font-bold text-white text-center tracking-tight max-w-5xl leading-tight pointer-events-none -mt-10">
              <div className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 [text-shadow:0_4px_8px_rgba(0,0,0,0.3)]">
                The Future of Music
              </div>
              <div>
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 [text-shadow:0_4px_8px_rgba(0,0,0,0.3)]">
                  Creation is 
                </span>
                <span className="relative inline-block ml-2 text-blue-400 bg-clip-text text-transparent bg-gradient-to-b from-blue-300 to-blue-600 animate-pulse">
                  Here
                  <span className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full -z-10"></span>
                  <span className="absolute -inset-1 bg-gradient-to-r from-blue-600/40 to-cyan-400/40 blur-md rounded-lg -z-10"></span>
                </span>
              </div>
            </div>
            
            <div className="mt-8 pointer-events-auto z-10">
              <CustomRainbowButton 
                size="lg" 
                className="font-bold text-xl relative z-10"
                onClick={handleButtonClick}
              >
                Join the Waitlist
              </CustomRainbowButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Waitlist Form Modal - Floating above without affecting background */}
      <AnimatePresence>
        {showWaitlist && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
            ref={modalRef}
          >
            <div className="relative bg-black/80 backdrop-blur-md p-10 rounded-3xl max-w-md w-full shadow-2xl border border-indigo-500/40 overflow-y-auto max-h-[90vh]">
              {/* Close button */}
              <button
                onClick={() => setShowWaitlist(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-20 blur-md -z-10"></div>
              
              {/* Form content */}
              <div className="mb-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">Join Our Waitlist</h2>
                <p className="text-gray-300 text-sm">Be the first to experience the future of music creation in MuseRoom</p>
              </div>
              
              <form className="space-y-6" onSubmit={handleFormSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                      Your name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-2">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="(123) 456-7890"
                      className="w-full px-4 py-3 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-800">
                  <p className="text-base font-medium text-white mb-3">Device ownership (optional)</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <label 
                      className={`flex items-center justify-center text-sm ${
                        metaQuestChecked 
                          ? 'bg-purple-900/30 border-purple-500' 
                          : 'bg-gray-900/70 hover:bg-gray-900 border-gray-800'
                      } border rounded-xl p-3 cursor-pointer transition-all duration-200`}
                    >
                      <input 
                        type="checkbox" 
                        name="meta_quest"
                        className="sr-only"
                        checked={metaQuestChecked}
                        onChange={() => setMetaQuestChecked(!metaQuestChecked)}
                      />
                      <div className="relative flex flex-col items-center gap-2">
                        <span className={`h-6 w-6 rounded-full ${
                          metaQuestChecked 
                            ? 'bg-purple-600 scale-110' 
                            : 'bg-purple-600/20'
                        } flex items-center justify-center transition-all duration-200`}>
                          <svg 
                            className={`h-4 w-4 ${
                              metaQuestChecked 
                                ? 'text-white scale-110' 
                                : 'text-purple-500'
                            } transition-all duration-200`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                        <span className={`${
                          metaQuestChecked 
                            ? 'text-white font-medium' 
                            : 'text-gray-300'
                        } transition-colors duration-200`}>
                          Meta Quest
                        </span>
                      </div>
                    </label>
                    
                    <label 
                      className={`flex items-center justify-center text-sm ${
                        visionProChecked 
                          ? 'bg-pink-900/30 border-pink-500' 
                          : 'bg-gray-900/70 hover:bg-gray-900 border-gray-800'
                      } border rounded-xl p-3 cursor-pointer transition-all duration-200`}
                    >
                      <input 
                        type="checkbox" 
                        name="vision_pro"
                        className="sr-only"
                        checked={visionProChecked}
                        onChange={() => setVisionProChecked(!visionProChecked)} 
                      />
                      <div className="relative flex flex-col items-center gap-2">
                        <span className={`h-6 w-6 rounded-full ${
                          visionProChecked 
                            ? 'bg-pink-600 scale-110' 
                            : 'bg-pink-600/20'
                        } flex items-center justify-center transition-all duration-200`}>
                          <svg 
                            className={`h-4 w-4 ${
                              visionProChecked 
                                ? 'text-white scale-110' 
                                : 'text-pink-500'
                            } transition-all duration-200`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                        <span className={`${
                          visionProChecked 
                            ? 'text-white font-medium' 
                            : 'text-gray-300'
                        } transition-colors duration-200`}>
                          Apple Vision Pro
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`relative w-full group rounded-2xl px-6 py-3.5 mt-6 text-lg font-medium text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'} transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Join the Waitlist"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Notification toast */}
      {notification && notification.show && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          duration={4000}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
