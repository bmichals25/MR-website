import Image from "next/image";
import { Boxes } from "@/components/ui/background-boxes";
import { CustomRainbowButton } from "@/components/ui/custom-rainbow-button";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-slate-900 overflow-hidden">
      <Boxes className="absolute inset-0" />
      <div className="absolute inset-0 flex flex-col items-center pt-6 pointer-events-none">
        <div className="relative w-[420px] h-[420px] mb-0">
          <Image 
            src="/Untitled design (4).gif" 
            alt="MR Logo Animation" 
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>
        <div className="text-5xl md:text-7xl lg:text-8xl font-bold text-white text-center tracking-tight max-w-5xl leading-tight">
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
        
        <div className="mt-12 pointer-events-auto">
          <CustomRainbowButton size="lg" className="font-bold text-xl">
            Join the Waitlist
          </CustomRainbowButton>
        </div>
        
        {/* Invisible placeholder to maintain spacing */}
        <div className="mt-8 w-full" style={{ height: "210px" }}></div>
      </div>
    </div>
  );
}
