"use client";

import { useState, useRef } from "react";
import InvitationInfo from "./info/info";

export default function Home() {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  
  // Audio states and reference
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleOpenInvitation = () => {
    setIsOpening(true);
    
    // Play music seamlessly when they click the envelope
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log("Audio autoplay was prevented:", err);
      });
    }

    // Smooth transition timing to match the layout fade-out
    setTimeout(() => {
      setIsOpened(true);
    }, 800);
  };

  // Toggle music play/pause
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Reusable Image Accent Component using your flower.png asset
  const FlowerAccent = ({ className }: { className: string }) => (
    <img 
      src="/flowerss.png" 
      alt="Flower Accent" 
      className={`absolute w-36 h-36 pointer-events-none drop-shadow-md select-none object-contain transition-transform duration-700 ${className}`}
    />
  );

  return (
    <>
      {/* Global Audio Element (Hidden) - Loops continuously */}
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />

      {/* Conditionally render the envelope OR the inner invitation */}
      {isOpened ? (
        <InvitationInfo 
          onClose={() => {
            setIsOpened(false);
            setIsOpening(false);
          }} 
        />
      ) : (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 text-[#3A2522] overflow-x-hidden selection:bg-[#B58382]/20 relative w-full h-full">
          
          {/* Solid background color instead of SVG image */}
          <div className="fixed inset-0 w-screen h-screen -z-10 bg-[#825656]"></div>

          <style jsx global>{`
            /* Ensure your custom fonts are available globally */
            .font-roxborough { font-family: 'RoxboroughCF', serif; }
            .font-arapey { font-family: 'Arapey', serif; }

            @keyframes crispReveal {
              0% { transform: translateY(105%) skewY(1.5deg); opacity: 0; }
              100% { transform: translateY(0) skewY(0deg); opacity: 1; }
            }
            @keyframes cleanFadeIn {
              0% { opacity: 0; transform: scale(0.97) translateY(8px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes pristinePulse {
              0%, 100% { opacity: 0.6; transform: translateY(0); }
              50% { opacity: 1; transform: translateY(-3px); }
            }
            .animate-crisp-reveal { animation: crispReveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            .animate-clean-fade { animation: cleanFadeIn 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            .animate-pristine-pulse { animation: pristinePulse 2.5s ease-in-out infinite; }
          `}</style>

          {/* Changed max-w-sm to max-w-3xl to allow the long title to stretch */}
          <div 
            className={`w-full max-w-3xl text-center flex flex-col items-center select-none transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
              isOpening ? "transform scale-95 opacity-0 translate-y-8" : "opacity-100 scale-100 translate-y-0"
            }`}
          >
            {/* Header Typography - Sharp Mask Reveal */}
            <div className="overflow-hidden mb-5 pt-1 px-2">
              <p 
                className="tracking-[0.3em] text-xs text-[#EADCCF] uppercase font-arapey font-semibold opacity-0 animate-crisp-reveal"
                style={{ animationDelay: "100ms" }}
              >
                You're Invited
              </p>
            </div>
            
            {/* FIXED: Removed overflow-hidden and forced 1 straight line just like RSVP */}
            <div className="mb-3 py-1 px-4 w-full flex justify-center">
              <h1
                className="font-roxborough text-[#F5EBE1] italic tracking-wide leading-none whitespace-nowrap drop-shadow-sm opacity-0 animate-crisp-reveal"
                style={{ animationDelay: "350ms", fontSize: "clamp(1.4rem, 4.5vw, 3.5rem)" }}
              >
                Arlan Dave <span className="text-[#EADCCF]/70 font-light mx-1 md:mx-2">&amp;</span> Rei Marie Anne
              </h1>
            </div>
            
            {/* Date Stamp - Sharp Mask Slide Reveal */}
            <div className="overflow-hidden mb-10 py-1 px-2">
              <p 
                className="font-roxborough text-xl text-[#F5EBE1]/90 tracking-widest opacity-0 animate-crisp-reveal"
                style={{ animationDelay: "600ms" }}
              >
                09.28.2026
              </p>
            </div>

            {/* Added max-w-sm specifically to the envelope so it doesn't get huge now that parent is max-w-3xl */}
            <div 
              className="relative w-full max-w-sm aspect-[4/3] bg-[#EADCCF]/80 backdrop-blur-md rounded-xl shadow-[0_25px_50px_-12px_rgba(58,37,34,0.25)] border border-white/40 p-2 flex items-center justify-center overflow-visible group opacity-0 animate-clean-fade"
              style={{ animationDelay: "850ms" }}
            >
              <FlowerAccent className="-top-8 -left-8 rotate-85 group-hover:-translate-x-1 group-hover:-translate-y-1" />
              <FlowerAccent className="-top-8 -right-8 -rotate-85 scale-x-[-1] group-hover:translate-x-1 group-hover:-translate-y-1" />
              <FlowerAccent className="-bottom-8 -left-8 rotate-[0deg] group-hover:-translate-x-1 group-hover:translate-y-1" />
              <FlowerAccent className="-bottom-8 -right-8 -rotate-[-265deg] group-hover:translate-x-1 group-hover:translate-y-1" />

              <div className="absolute inset-2 rounded-lg border border-[#B58382]/20 pointer-events-none" />

              <svg className="absolute inset-0 w-full h-full text-[#A97C7B]/25 pointer-events-none" viewBox="0 0 400 300" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="0" y1="0" x2="200" y2="145" />
                <line x1="400" y1="0" x2="200" y2="145" />
                <line x1="0" y1="300" x2="200" y2="145" strokeWidth="1" />
                <line x1="400" y1="300" x2="200" y2="145" strokeWidth="1" />
              </svg>

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
                    <span className="text-[11px] opacity-40 font-arapey mb-0.5">🌷</span>
                    <span className="font-roxborough text-xs font-semibold tracking-widest">LOGO</span>
                  </div>
                </div>
                <span className="absolute inline-flex h-full w-full rounded-[51%_49%_53%_47%] bg-[#B58382] opacity-35 animate-ping -z-10 pointer-events-none"></span>
              </button>
            </div>

            <div className="overflow-hidden mt-10 py-1">
              <p 
                className="text-[#F5EBE1] font-arapey text-sm tracking-wide italic opacity-0 animate-crisp-reveal"
                style={{ animationDelay: "1300ms" }}
              >
                <span className="inline-block animate-pristine-pulse bg-white/10 px-4 py-1 rounded-full backdrop-blur-sm border border-white/20">
                  Click to open the invitation
                </span>
              </p>
            </div>
          </div>
        </main>
      )}

      {/* Floating Music Control Toggle - Only shows once envelope is opened */}
      {isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-white/70 backdrop-blur-md rounded-full border border-white/50 shadow-md hover:shadow-lg flex items-center justify-center text-[#B58382] hover:text-[#844C44] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
          title={isPlaying ? "Pause Music" : "Play Music"}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          )}
        </button>
      )}
    </>
  );
}