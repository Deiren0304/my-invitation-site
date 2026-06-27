"use client";

import { useState, useEffect } from "react";
import RsvpForm from "../rsvp/rsvp";

interface InvitationInfoProps {
  onClose: () => void;
}

export default function InvitationInfo({ onClose }: InvitationInfoProps) {
  // Exit State for Close Animation
  const [isExiting, setIsExiting] = useState(false);
  const [activeLightbox, setActiveLightbox] = useState<{ src: string; alt: string } | null>(null);
  
  // Toggle State for RSVP Form
  const [showRsvp, setShowRsvp] = useState(false);
  
  // NEW: Transition Loader State
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Countdown Live Timer State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown Logic
  useEffect(() => {
    const targetDate = new Date("2026-09-28T13:30:00");

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Modal Keyboard & Scroll Lock Logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };

    if (activeLightbox || isTransitioning) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeLightbox, isTransitioning]);

  // Intercept Close Click to run Exit Animation first
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const openLightbox = (src: string, alt: string) => {
    setActiveLightbox({ src, alt });
  };

  const closeLightbox = () => {
    setActiveLightbox(null);
  };

  // Handle Elegant Loader Transition between Views
  const handleToggleRsvp = (show: boolean) => {
    setIsTransitioning(true); // Show Loading Screen
    setTimeout(() => {
      setShowRsvp(show); // Swap Components in the background
      setIsTransitioning(false); // Hide Loading Screen smoothly
    }, 1500); // 1.5 second loading duration
  };

  return (
    <>
      {/* FIXED BACKGROUND MOVED HERE
        Using 100dvh prevents background jumping on mobile scrolling
      */}
      <div className="fixed inset-0 w-screen h-[100dvh] -z-10 bg-[#F5EBE1]">
        <img
          src="/heross.svg"
          alt="Wedding Background"
          className="absolute inset-0 w-full h-full object-cover object-center md:object-top"
        />
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>
      </div>

      <main 
        /* Changed bg-[#F5EBE1] to bg-transparent so the background image shows through */
        className={`min-h-screen w-full flex flex-col items-center justify-start p-4 md:p-16 bg-transparent text-[#3A2522] overflow-x-hidden relative selection:bg-[#B58382]/20 transition-all duration-800 ease-in-out ${
          isExiting 
            ? "opacity-0 translate-y-12 pointer-events-none scale-[0.98]" 
            : "opacity-100 translate-y-0"
        }`}
      >
        
        {/* Floating Close Button - Anchored to Lower Left */}
        <button 
          onClick={handleClose}
          className={`fixed bottom-6 left-6 z-40 text-[11px] uppercase tracking-[0.25em] text-[#B58382] hover:text-[#844C44] font-semibold bg-white/70 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/50 shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${
            isExiting || showRsvp ? "opacity-0 scale-90 pointer-events-none" : "opacity-100"
          }`}
        >
          Close Envelope
        </button>

        {/* Main Content Container with Elegant Fade/Slide-up Entry Animation */}
        <div className="max-w-3xl w-full flex flex-col items-center space-y-20 mt-8 mb-24 px-2 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
          
          {!showRsvp ? (
            <>
              {/* SECTION 1: Welcome Header Title (UPGRADED AESTHETIC) */}
              <section className="text-center space-y-6 md:space-y-8 overflow-hidden pt-4 px-2 w-full max-w-2xl">
                
                {/* Pre-Title */}
                <div className="overflow-hidden pb-1">
                  <p className="tracking-[0.35em] uppercase text-[9px] md:text-xs text-[#844C44] font-medium animate-reveal-text delay-[150ms] [animation-fill-mode:forwards] opacity-0">
                    The Wedding Celebration of
                  </p>
                </div>
                
                {/* Main Title - Beautifully stacked on Mobile, Inline on Desktop */}
                <div className="overflow-hidden pb-2 px-2">
                  <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#3A2522] font-normal tracking-wide italic drop-shadow-sm leading-[1.3] md:leading-none animate-reveal-text delay-[300ms] [animation-fill-mode:forwards] opacity-0">
                    <span className="block md:inline">Arlan Dave</span>
                    <span className="block md:inline text-3xl md:text-5xl text-[#B58382] font-light mx-3 my-1 md:my-0">&amp;</span>
                    <span className="block md:inline">Rei Marie Anne</span>
                  </h1>
                </div>
                
                {/* Elegant Fine-Art Divider */}
                <div className="flex items-center justify-center space-x-3 opacity-0 animate-fade-in delay-[450ms] [animation-fill-mode:forwards]">
                  <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-[#B58382]/50"></div>
                  <span className="text-[10px] text-[#B58382] mb-0.5">✦</span>
                  <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-[#B58382]/50"></div>
                </div>
                
                {/* Date & Time */}
                <div className="space-y-4 font-serif pt-2">
                  <div className="overflow-hidden pb-1">
                    <p className="text-xl md:text-3xl font-light tracking-widest text-[#3A2522] animate-reveal-text delay-[600ms] [animation-fill-mode:forwards] opacity-0">
                      Monday, September 28th, 2026
                    </p>
                  </div>
                  <div className="overflow-hidden pb-1">
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-[#844C44] font-sans font-semibold animate-reveal-text delay-[750ms] [animation-fill-mode:forwards] opacity-0">
                      At One-Thirty in the Afternoon <span className="opacity-60 lowercase font-serif italic tracking-normal ml-1 text-xs">(1:30 pm)</span>
                    </p>
                  </div>
                </div>

              </section>

              {/* SECTION 2: Modern Aesthetic Live Countdown Dashboard */}
              <section className="w-full max-w-xl bg-white/40 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-500 hover:bg-white/50">
                <div className="overflow-hidden pb-2 mb-3">
                  <p className="text-center font-serif text-[11px] uppercase tracking-[0.25em] text-[#844C44] mb-5 font-semibold animate-reveal-text delay-[900ms] [animation-fill-mode:forwards] opacity-0">Counting Down to Forever</p>
                </div>
                <div className="grid grid-cols-4 gap-3 md:gap-5">
                  {[
                    { label: "Days", value: timeLeft.days, delay: 1050 },
                    { label: "Hours", value: timeLeft.hours, delay: 1100 },
                    { label: "Minutes", value: timeLeft.minutes, delay: 1150 },
                    { label: "Seconds", value: timeLeft.seconds, delay: 1200 },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/90 p-3 md:p-4 rounded-2xl text-center shadow-xs border border-[#DCBDAF]/30 relative group overflow-hidden">
                      <span className="block font-serif text-2xl md:text-4xl font-light text-[#3A2522] transition-transform duration-300 group-hover:scale-105">
                        {String(item.value).padStart(2, "0")}
                      </span>
                      <div className="overflow-hidden pt-0.5 mb-1 px-1">
                        <span className={`text-[9px] md:text-[10px] uppercase tracking-widest text-[#B58382] font-sans font-semibold mt-0.5 block animate-reveal-text delay-[${item.delay}ms] [animation-fill-mode:forwards] opacity-0`}>
                          {item.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 3: Fine Art Engagement Image Gallery */}
              <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={() => openLightbox("/imageseconds.png", "Engagement Portrait")}
                  className="relative aspect-[3/4] bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.02)] border border-white/80 transform -rotate-1 hover:rotate-0 hover:-translate-y-1 transition-all duration-700 ease-out group overflow-hidden cursor-pointer w-full text-left"
                >
                  <div className="w-full h-full bg-[#EADCCF]/60 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
                    <img 
                      src="/imageseconds.png" 
                      alt="Engagement Portrait 1"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-1000 group-hover:scale-105"
                      onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                    />
                  </div>
                </button>
                <button 
                  onClick={() => openLightbox("/imagefirsts.png", "Engagement Portrait")}
                  className="relative aspect-[3/4] bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.02)] border border-white/80 transform rotate-1 hover:rotate-0 hover:-translate-y-1 transition-all duration-700 ease-out group overflow-hidden cursor-pointer w-full text-left"
                >
                  <div className="w-full h-full bg-[#EADCCF]/60 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
                    <img 
                      src="/imagefirsts.png" 
                      alt="Engagement Portrait 2"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-1000 group-hover:scale-105"
                      onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                    />
                  </div>
                </button>
              </section>

              {/* SECTION 4: Event Essential Info Matrix */}
              <section className="w-full space-y-10">
                
                {/* Card 1: Location Block */}
                <div className="bg-white/70 backdrop-blur-md rounded-3xl overflow-hidden border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)] transition-all duration-500 grid grid-cols-1 md:grid-cols-12 group">
                  <button 
                    onClick={() => openLightbox("/location.png", "Iglesia ng Dios kay Cristo Jesus, Haligi at Suhay ng Katotohanan")}
                    className="md:col-span-5 relative aspect-video md:aspect-auto bg-[#EADCCF]/50 flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-[#B58382]/20 cursor-pointer text-left w-full"
                  >
                    <img 
                      src="/location.png" 
                      alt="Iglesia ng Dios kay Cristo Jesus, Haligi at Suhay ng Katotohanan"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:scale-105 transition-transform"
                      onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                    />
                  </button>
                  <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center text-center md:text-left space-y-3">
                    <div className="overflow-hidden pb-1">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-[#B58382] font-bold animate-reveal-text delay-[1250ms] [animation-fill-mode:forwards] opacity-0">Location</div>
                    </div>
                    <div className="overflow-hidden pb-2 mb-1 px-1">
                      <h2 className="font-serif text-2xl text-[#3A2522] tracking-wide animate-reveal-text delay-[1350ms] [animation-fill-mode:forwards] opacity-0">The Ceremony Venue</h2>
                    </div>
                    <div className="overflow-hidden pt-1 pb-1">
                      <p className="font-medium text-stone-800 text-[13px] md:text-sm animate-reveal-text delay-[1450ms] [animation-fill-mode:forwards] opacity-0 leading-snug">
                        Iglesia ng Dios kay Cristo Jesus,<br className="hidden md:block" /> Haligi at Suhay ng Katotohanan
                      </p>
                    </div>
                    <div className="overflow-hidden pb-1 px-1">
                      <p className="text-stone-500 text-xs leading-relaxed font-sans font-light max-w-sm mx-auto md:mx-0 animate-reveal-text delay-[1550ms] [animation-fill-mode:forwards] opacity-0 uppercase tracking-widest">
                        Q2WX+JQQ, SJDM, Bulacan
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2: Reception Block */}
                <div className="bg-white/70 backdrop-blur-md rounded-3xl overflow-hidden border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)] transition-all duration-500 grid grid-cols-1 md:grid-cols-12 group">
                  <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center text-center md:text-left space-y-3 order-2 md:order-1">
                    <div className="overflow-hidden pb-1">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-[#B58382] font-bold animate-reveal-text delay-[1600ms] [animation-fill-mode:forwards] opacity-0">Reception</div>
                    </div>
                    <div className="overflow-hidden pb-2 mb-1 px-1">
                      <h2 className="font-serif text-2xl text-[#3A2522] tracking-wide animate-reveal-text delay-[1700ms] [animation-fill-mode:forwards] opacity-0">The Celebration Dinner</h2>
                    </div>
                    <div className="overflow-hidden pt-1 pb-1">
                      <p className="font-medium text-stone-800 text-[13px] md:text-sm animate-reveal-text delay-[1800ms] [animation-fill-mode:forwards] opacity-0">Villa Leonora Resort</p>
                    </div>
                    <div className="overflow-hidden pb-1 px-1">
                      <p className="text-stone-500 text-xs leading-relaxed font-sans font-light max-w-sm mx-auto md:mx-0 animate-reveal-text delay-[1900ms] [animation-fill-mode:forwards] opacity-0 uppercase tracking-widest">
                        Santo Cristo, San Jose del Monte City Bulacan
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => openLightbox("/receptionsss.png", "Villa Leonora Resort")}
                    className="md:col-span-5 relative aspect-video md:aspect-auto bg-[#EADCCF]/50 flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-l border-[#B58382]/20 order-1 md:order-2 cursor-pointer text-left w-full"
                  >
                    <img 
                      src="/receptionsss.png" 
                      alt="Villa Leonora Resort"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:scale-105 transition-transform"
                      onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                    />
                  </button>
                </div>

                {/* Card 3: Attire Block */}
                <div className="bg-white/70 backdrop-blur-md rounded-3xl overflow-hidden border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)] transition-all duration-500 grid grid-cols-1 md:grid-cols-12 group">
                  <button 
                    onClick={() => openLightbox("/attiress.png", "Dress Code Style Inspiration")}
                    className="md:col-span-5 relative aspect-video md:aspect-auto bg-[#EADCCF]/50 flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-[#B58382]/20 cursor-pointer text-left w-full"
                  >
                    <img 
                      src="/attiress.png" 
                      alt="Dress Code Style Inspiration"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:scale-105 transition-transform"
                      onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                    />
                  </button>
                  <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center text-center md:text-left space-y-3">
                    <div className="overflow-hidden pb-1">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-[#B58382] font-bold animate-reveal-text delay-[1950ms] [animation-fill-mode:forwards] opacity-0">Attire</div>
                    </div>
                    <div className="overflow-hidden pb-2 mb-1 px-1">
                      <h2 className="font-serif text-2xl text-[#3A2522] tracking-wide animate-reveal-text delay-[2050ms] [animation-fill-mode:forwards] opacity-0">Dress Code Palette</h2>
                    </div>
                    <div className="overflow-hidden pt-1 pb-1">
                      <p className="font-medium text-stone-800 text-sm animate-reveal-text delay-[2150ms] [animation-fill-mode:forwards] opacity-0">Semi-Formal</p>
                    </div>
                    <div className="overflow-hidden pb-1 px-1">
                      <p className="text-stone-600 text-xs leading-relaxed font-sans font-light max-w-sm mx-auto md:mx-0 animate-reveal-text delay-[2250ms] [animation-fill-mode:forwards] opacity-0">
                        We kindly encourage our favorite people to dress in our color palette on our special day.
                      </p>
                    </div>
                    
                    {/* Updated 5-Color Palette */}
                    <div className="flex justify-center md:justify-start items-center gap-2.5 pt-1 overflow-hidden">
                      <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#7C3A3B] shadow-xs ring-1 ring-white/60 transition-all duration-300 hover:scale-110 animate-fade-in delay-[2350ms] [animation-fill-mode:forwards] opacity-0" title="Burgundy" />
                      <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#D8B4B5] shadow-xs ring-1 ring-white/60 transition-all duration-300 hover:scale-110 animate-fade-in delay-[2400ms] [animation-fill-mode:forwards] opacity-0" title="Light Blush" />
                      <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#A5686E] shadow-xs ring-1 ring-white/60 transition-all duration-300 hover:scale-110 animate-fade-in delay-[2450ms] [animation-fill-mode:forwards] opacity-0" title="Dusty Mauve" />
                      <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#AC705A] shadow-xs ring-1 ring-white/60 transition-all duration-300 hover:scale-110 animate-fade-in delay-[2500ms] [animation-fill-mode:forwards] opacity-0" title="Terracotta" />
                      <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#E2C1AE] shadow-xs ring-1 ring-white/60 transition-all duration-300 hover:scale-110 animate-fade-in delay-[2550ms] [animation-fill-mode:forwards] opacity-0" title="Peach Cream" />
                    </div>
                  </div>
                </div>

                {/* Card 4: Gift Note - Upgraded Aesthetic */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden border border-white/80 shadow-[0_12px_45px_rgba(0,0,0,0.02)] p-2 transition-all duration-500">
                  <div className="border border-[#B58382]/40 rounded-2xl p-8 md:p-14 flex flex-col items-center text-center relative overflow-hidden bg-gradient-to-b from-white/40 to-transparent">
                    
                    {/* Decorative Botanical Icon */}
                    <div className="animate-reveal-text delay-[2500ms] [animation-fill-mode:forwards] opacity-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B58382" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-5 opacity-70">
                        <path d="M12 2v20"/>
                        <path d="M12 10.5a4.5 4.5 0 0 1 4.5-4.5h3a4.5 4.5 0 0 0-4.5 4.5v3"/>
                        <path d="M12 13.5a4.5 4.5 0 0 0 4.5 4.5h3a4.5 4.5 0 0 1-4.5-4.5v-3"/>
                        <path d="M12 10.5a4.5 4.5 0 0 0-4.5-4.5h-3a4.5 4.5 0 0 1 4.5 4.5v3"/>
                        <path d="M12 13.5a4.5 4.5 0 0 1-4.5 4.5h-3a4.5 4.5 0 0 0 4.5-4.5v-3"/>
                      </svg>
                    </div>

                    <div className="overflow-hidden pb-3 mb-2">
                      <h2 className="font-serif text-3xl md:text-4xl text-[#3A2522] tracking-wider italic animate-reveal-text delay-[2600ms] [animation-fill-mode:forwards] opacity-0">Gift Note</h2>
                    </div>

                    <div className="h-px w-16 bg-[#B58382]/50 mb-8 animate-fade-in delay-[2650ms] [animation-fill-mode:forwards] opacity-0"></div>

                    <div className="space-y-3 text-stone-700 text-sm md:text-base leading-loose font-serif max-w-lg mx-auto animate-fade-in delay-[2700ms] [animation-fill-mode:forwards] opacity-0">
                      <p className="italic text-[#3A2522] font-medium">With all that we have, we've been truly blessed.</p>
                      <p className="italic text-[#3A2522] font-medium">Your presence and prayers are all that we request.</p>
                      <p className="italic text-[#3A2522] font-medium">But if you desire to give nonetheless,</p>
                      <p className="italic text-[#3A2522] font-medium">A monetary gift is one we suggest.</p>
                    </div>
                  </div>
                </div>

                {/* Card 5: Upgraded Elegance Reminders & Socials */}
                <div className="bg-white/70 backdrop-blur-md rounded-3xl overflow-hidden border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)] transition-all duration-500 relative">
                  <div className="p-8 md:p-14 flex flex-col items-center text-center bg-gradient-to-t from-white/30 to-transparent">
                    
                    <div className="overflow-hidden pb-3 mb-6">
                      <h2 className="font-serif text-3xl md:text-4xl text-[#3A2522] tracking-wider italic animate-reveal-text delay-[2800ms] [animation-fill-mode:forwards] opacity-0">Gentle Reminders</h2>
                    </div>
                    
                    {/* Reminder Icons - Responsive Layout */}
                    <div className="flex flex-col md:flex-row w-full max-w-2xl justify-center items-center gap-10 md:gap-12 mb-14 animate-fade-in delay-[2900ms] [animation-fill-mode:forwards] opacity-0">
                      
                      {/* Reminder 1 */}
                      <div className="flex flex-col items-center group cursor-default">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#EADCCF]/80 to-white/90 shadow-sm border border-white flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform duration-500">
                          <span className="text-2xl drop-shadow-sm">⏳</span>
                        </div>
                        <h4 className="font-serif text-[#3A2522] text-lg mb-1">Be on Time</h4>
                        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-stone-500 font-medium">Ceremony begins promptly</p>
                      </div>

                      {/* Desktop Divider */}
                      <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-[#B58382]/30 to-transparent"></div>
                      
                      {/* Mobile Divider (Optional subtle line between stacked items) */}
                      <div className="md:hidden w-16 h-px bg-gradient-to-r from-transparent via-[#B58382]/30 to-transparent"></div>

                      {/* Reminder 2 */}
                      <div className="flex flex-col items-center group cursor-default">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#EADCCF]/80 to-white/90 shadow-sm border border-white flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform duration-500">
                          <span className="text-2xl drop-shadow-sm">🥂</span>
                        </div>
                        <h4 className="font-serif text-[#3A2522] text-lg mb-1">Stay with Us</h4>
                        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-stone-500 font-medium">Please finish the event</p>
                      </div>

                      {/* Desktop Divider */}
                      <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-[#B58382]/30 to-transparent"></div>
                      
                      {/* Mobile Divider */}
                      <div className="md:hidden w-16 h-px bg-gradient-to-r from-transparent via-[#B58382]/30 to-transparent"></div>

                      {/* Reminder 3 */}
                      <div className="flex flex-col items-center group cursor-default">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#EADCCF]/80 to-white/90 shadow-sm border border-white flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform duration-500">
                          <span className="text-2xl drop-shadow-sm">✨</span>
                        </div>
                        <h4 className="font-serif text-[#3A2522] text-lg mb-1">Celebrate</h4>
                        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-stone-500 font-medium">Enjoy & have fun</p>
                      </div>
                    </div>

                    {/* Snap & Share Section */}
                    <div className="w-full pt-10 border-t border-[#B58382]/20 animate-fade-in delay-[3000ms] [animation-fill-mode:forwards] opacity-0 relative px-2">
                      {/* Decorative star at center of divider */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/50 backdrop-blur-sm rounded-full p-1 text-[8px] text-[#B58382]">✦</div>
                      
                      <h2 className="font-serif text-3xl md:text-4xl text-[#3A2522] tracking-wide italic mb-3">Snap & Share</h2>
                      <p className="text-stone-500 font-medium text-[9px] md:text-[10px] uppercase tracking-[0.2em] mb-5">Help us capture the love by using our hashtag</p>
                      
                      {/* FIX: Whitespace-nowrap + responsive text scaling keeps it on one line */}
                      <div className="inline-block bg-white/60 backdrop-blur-sm px-3 sm:px-6 py-3 rounded-xl border border-white/50 shadow-sm mb-8 overflow-hidden max-w-[95vw]">
                        <p className="font-sans font-bold text-[3.2vw] min-[400px]:text-sm sm:text-lg md:text-xl text-[#844C44] select-all whitespace-nowrap">
                          #IANNEangSagotSaDasalniARLAN
                        </p>
                      </div>
                      
                      {/* Social Icons */}
                      <div className="flex justify-center gap-6 text-[#3A2522]/80">
                        <svg className="w-5 h-5 hover:text-[#844C44] transition-all cursor-pointer hover:-translate-y-1 hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-label="Instagram"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        <svg className="w-5 h-5 hover:text-[#844C44] transition-all cursor-pointer hover:-translate-y-1 hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-label="Facebook"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                        <svg className="w-5 h-5 hover:text-[#844C44] transition-all cursor-pointer hover:-translate-y-1 hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-label="Twitter"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                        <svg className="w-5 h-5 hover:text-[#844C44] transition-all cursor-pointer hover:-translate-y-1 hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-label="TikTok"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

              </section>

              {/* SECTION 5: RSVP Action Button */}
              <section className="w-full text-center py-6 border-t border-[#B58382]/30 mt-16 animate-fade-in delay-[3100ms] [animation-fill-mode:forwards] opacity-0">
                <p className="font-serif text-sm italic text-[#3A2522] font-medium bg-white/40 inline-block px-4 py-1 rounded-full mb-6">We kindly request the favor of your response</p>
                <br />
                <button 
                  onClick={() => handleToggleRsvp(true)}
                  className="inline-block bg-[#844C44] text-[#F5EBE1] font-sans font-bold uppercase tracking-[0.3em] text-[11px] py-4 px-12 rounded-full border-2 border-white/40 shadow-lg hover:shadow-2xl hover:bg-[#6D3C36] active:bg-[#592F2A] transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0.5 active:scale-95 cursor-pointer"
                >
                  Submit your RSVP Here
                </button>
              </section>
            </>
          ) : (
            /* RSVP FORM VIEW */
            <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out mt-4 md:mt-10">
              <RsvpForm />
              
              <button 
                onClick={() => handleToggleRsvp(false)}
                className="mt-10 text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#844C44] hover:text-[#3A2522] transition-colors underline underline-offset-4 cursor-pointer font-semibold bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm"
              >
                Back to Invitation Details
              </button>
            </div>
          )}

          {/* Tail Signature Branding Accent */}
          <footer className={`text-center pt-8 opacity-60 select-none pointer-events-none transition-opacity duration-700 ${!showRsvp ? 'animate-fade-in delay-[3200ms] [animation-fill-mode:forwards] opacity-0' : 'opacity-100'}`}>
            <p className="font-serif text-xs italic tracking-widest text-[#3A2522] bg-white/30 inline-block px-3 py-1 rounded-full">Arlan Dave &amp; Rei Marie Anne • 2026</p>
          </footer>

        </div>
      </main>

      {/* NEW: Full-Screen Transition Loader with blurred backdrop */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F5EBE1] animate-in fade-in duration-300">
          <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
            <img 
              src="/monoss.png" 
              alt="Arlan & Rei Marie"
              className="w-[180px] h-[180px] object-contain drop-shadow-sm mb-4"
            />
            {/* Elegant rotating loader ring */}
            <div className="mt-6 h-10 w-10 border-[3px] border-[#B58382]/20 border-t-[#844C44] rounded-full animate-spin" style={{ animationDuration: '1.2s' }} />
          </div>
        </div>
      )}

      {/* Upgraded Fit-To-Content Responsive Modal */}
      {activeLightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in-fast"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Container Box: w-auto h-auto to strictly shrink-wrap, max values to prevent overflow */}
          <div
            className="relative flex flex-col items-center bg-[#F5EBE1] rounded-[20px] p-5 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-[#B58382]/30 w-auto h-auto max-w-[95vw] max-h-[95vh] animate-slide-up-fast cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Inner Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 md:top-5 md:right-5 w-[34px] h-[34px] flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-[#3A2522] transition-colors duration-200 focus:outline-none z-10"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Modal Headers */}
            <div className="flex-shrink-0 w-full flex flex-col items-center pt-2 px-8">
              <h2 className="font-serif text-2xl md:text-3xl text-[#3A2522] font-semibold text-center mb-1 italic">
                {activeLightbox.alt}
              </h2>
              <p className="text-[#844C44] text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold text-center border-b border-[#3A2522]/10 pb-3 mb-4 md:mb-6 w-full max-w-[200px]">
                Gallery View
              </p>
            </div>

            {/* Modal Image - Auto sizes ensure the wrapper perfectly hugs this image's natural aspect ratio */}
            <div className="flex justify-center items-center overflow-hidden">
              <img
                src={activeLightbox.src}
                alt={activeLightbox.alt}
                className="w-auto h-auto max-w-full max-h-[60vh] md:max-h-[70vh] rounded-lg shadow-sm"
              />
            </div>
            
          </div>
        </div>
      )}

      {/* Inline styles for custom animations */}
      <style jsx global>{`
        /* Original Text Animations */
        @keyframes revealText {
          0% { transform: translateY(105%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        /* New Modal Animations matching reference code */
        @keyframes fadeInFast {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes slideUpFast {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes revealText delay-delay-150 { animation-delay: 150ms; }
        @keyframes revealText delay-delay-300 { animation-delay: 300ms; }
        @keyframes revealText delay-delay-600 { animation-delay: 600ms; }
        @keyframes revealText delay-delay-750 { animation-delay: 750ms; }
        @keyframes revealText delay-delay-900 { animation-delay: 900ms; }
        @keyframes revealText delay-delay-1250 { animation-delay: 1250ms; }
        @keyframes revealText delay-delay-1350 { animation-delay: 1350ms; }
        @keyframes revealText delay-delay-1450 { animation-delay: 1450ms; }
        @keyframes revealText delay-delay-1550 { animation-delay: 1550ms; }
        @keyframes revealText delay-delay-1600 { animation-delay: 1600ms; }
        @keyframes revealText delay-delay-1700 { animation-delay: 1700ms; }
        @keyframes revealText delay-delay-1800 { animation-delay: 1800ms; }
        @keyframes revealText delay-delay-1900 { animation-delay: 1900ms; }
        @keyframes revealText delay-delay-1950 { animation-delay: 1950ms; }
        @keyframes revealText delay-delay-2050 { animation-delay: 2050ms; }
        @keyframes revealText delay-delay-2150 { animation-delay: 2150ms; }
        @keyframes revealText delay-delay-2250 { animation-delay: 2250ms; }

        .animate-reveal-text {
          animation-name: revealText;
          animation-duration: 1.2s;
          animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .animate-fade-in {
          animation-name: fadeIn;
          animation-duration: 1.5s;
          animation-timing-function: ease-out;
        }
        
        /* Modal Style Classes */
        .animate-fade-in-fast {
          animation: fadeInFast 0.25s ease forwards;
        }
        .animate-slide-up-fast {
          animation: slideUpFast 0.3s ease forwards;
        }
      `}</style>
    </>
  );
}