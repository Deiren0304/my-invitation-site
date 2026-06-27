"use client";

import { useState } from "react";
import InvitationInfo from "./info/info";

export default function Home() {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenInvitation = () => {
    setIsOpening(true);
    // Smooth transition timing to match the layout fade-out
    setTimeout(() => {
      setIsOpened(true);
    }, 800);
  };

  // Reusable Image Accent Component using your flower.png asset
  const FlowerAccent = ({ className }: { className: string }) => (
    <img 
      src="/flowerss.png" 
      alt="Flower Accent" 
      className={`absolute w-36 h-36 pointer-events-none drop-shadow-md select-none object-contain transition-transform duration-700 ${className}`}
    />
  );

  if (isOpened) {
    return (
      <InvitationInfo 
        onClose={() => {
          setIsOpened(false);
          setIsOpening(false);
        }} 
      />
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 text-[#3A2522] overflow-hidden selection:bg-[#B58382]/20 relative w-full h-full">
      
      {/* NEW FIXED RESPONSIVE BACKGROUND 
        z-index: -10 ensures it stays perfectly behind everything.
        'fixed' makes sure it never moves when scrolling.
      */}
      <div className="fixed inset-0 w-screen h-screen -z-10 bg-[#F5EBE1]">
        <img 
          src="/heross.svg" 
          alt="Wedding Background" 
          className="w-full h-full object-cover object-center md:object-top" 
        />
        {/* Optional soft overlay to ensure your text and envelope remain readable */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>
      </div>

      {/* Self-contained Crisp Geometric Keyframe Animations */}
      <style jsx global>{`
        @keyframes crispReveal {
          0% {
            transform: translateY(105%) skewY(1.5deg);
            opacity: 0;
          }
          100% {
            transform: translateY(0) skewY(0deg);
            opacity: 1;
          }
        }
        @keyframes cleanFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.97) translateY(8px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes pristinePulse {
          0%, 100% { opacity: 0.6; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-3px); }
        }
        .animate-crisp-reveal {
          animation: crispReveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-clean-fade {
          animation: cleanFadeIn 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-pristine-pulse {
          animation: pristinePulse 2.5s ease-in-out infinite;
        }
      `}</style>

      <div 
        className={`w-full max-w-sm text-center flex flex-col items-center select-none transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
          isOpening ? "transform scale-95 opacity-0 translate-y-8" : "opacity-100 scale-100 translate-y-0"
        }`}
      >
        {/* Header Typography - Sharp Mask Reveal */}
        <div className="overflow-hidden mb-5 pt-1 px-2">
          <p 
            className="tracking-[0.3em] text-xs text-[#844C44] uppercase font-light opacity-0 animate-crisp-reveal"
            style={{ animationDelay: "100ms" }}
          >
            You're Invited
          </p>
        </div>
        
        {/* Main Couple Names - Sharp Mask Slide Reveal */}
        <div className="overflow-hidden mb-3 py-1 px-4">
          <h1
          className="font-serif text-[1.75rem] md:text-5xl text-[#3A2522] font-normal tracking-tight md:tracking-wide italic drop-shadow-xs whitespace-nowrap leading-none opacity-0 animate-crisp-reveal"
          style={{ animationDelay: "350ms" }}
          >
          Arlan Dave &amp; Rei Marie Anne
          </h1>
        </div>
        
        {/* Date Stamp - Sharp Mask Slide Reveal */}
        <div className="overflow-hidden mb-10 py-1 px-2">
          <p 
            className="font-serif text-xl text-[#B58382] tracking-widest opacity-0 animate-crisp-reveal"
            style={{ animationDelay: "600ms" }}
          >
            09.28.2026
          </p>
        </div>

        {/* Luxury Animated Envelope Box - Sharp Scale-Up Frame Entry */}
        <div 
          className="relative w-full aspect-[4/3] bg-[#EADCCF]/80 backdrop-blur-md rounded-xl shadow-[0_25px_50px_-12px_rgba(58,37,34,0.25)] border border-white/40 p-2 flex items-center justify-center overflow-visible group opacity-0 animate-clean-fade"
          style={{ animationDelay: "850ms" }}
        >
          
          {/* Flower PNG Placed in all 4 Corners */}
          <FlowerAccent className="-top-8 -left-8 rotate-85 group-hover:-translate-x-1 group-hover:-translate-y-1" />
          <FlowerAccent className="-top-8 -right-8 -rotate-85 scale-x-[-1] group-hover:translate-x-1 group-hover:-translate-y-1" />
          <FlowerAccent className="-bottom-8 -left-8 rotate-[0deg] group-hover:-translate-x-1 group-hover:translate-y-1" />
          <FlowerAccent className="-bottom-8 -right-8 -rotate-[-265deg] group-hover:translate-x-1 group-hover:translate-y-1" />

          {/* Geometric Border Ring Layout */}
          <div className="absolute inset-2 rounded-lg border border-[#B58382]/20 pointer-events-none" />

          {/* Envelope Crease Geometric Overlay */}
          <svg className="absolute inset-0 w-full h-full text-[#A97C7B]/25 pointer-events-none" viewBox="0 0 400 300" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="0" y1="0" x2="200" y2="145" />
            <line x1="400" y1="0" x2="200" y2="145" />
            <line x1="0" y1="300" x2="200" y2="145" strokeWidth="1" />
            <line x1="400" y1="300" x2="200" y2="145" strokeWidth="1" />
          </svg>

          {/* Wax Seal Toggle Button */}
          <button 
            onClick={handleOpenInvitation}
            className={`absolute z-10 w-24 h-24 bg-[#844C44] hover:bg-[#6D3C36] text-[#F5EBE1] rounded-[51%_49%_53%_47%_/_48%_52%_48%_52%] shadow-2xl flex items-center justify-center transition-all duration-500 outline-none border-2 border-[#844C44]/40 cursor-pointer active:scale-95 ${
              isOpening ? "opacity-0 scale-75" : "scale-100 hover:scale-105"
            }`}
            title="Click to open invitation"
          >
            <div className="w-[85%] h-[85%] border border-white/15 rounded-[50%_48%_51%_49%] flex flex-col items-center justify-center p-1.5 bg-black/5 overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Wedding Logo" 
                className="w-full h-full object-contain filter brightness-0 invert opacity-90"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallbackEl = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallbackEl) fallbackEl.style.display = 'flex';
                }}
              />
              <div className="hidden flex-col items-center justify-center text-center">
                <span className="text-[11px] opacity-40 font-sans mb-0.5">🌷</span>
                <span className="font-serif text-xs font-semibold tracking-widest">LOGO</span>
              </div>
            </div>
            <span className="absolute inline-flex h-full w-full rounded-[51%_49%_53%_47%] bg-[#B58382] opacity-35 animate-ping -z-10 pointer-events-none"></span>
          </button>
        </div>

        {/* Action Hint - Sharp Final Lift with Continuous Clean Position Pulse */}
        <div className="overflow-hidden mt-10 py-1">
          <p 
            className="text-[#844C44] font-serif text-sm tracking-wide italic opacity-0 animate-crisp-reveal"
            style={{ animationDelay: "1300ms" }}
          >
            <span className="inline-block animate-pristine-pulse bg-white/40 px-4 py-1 rounded-full backdrop-blur-sm border border-white/50">
              Click to open the invitation
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}