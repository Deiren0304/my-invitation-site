"use client";

import { useState, useEffect } from "react";

// Accept an onBack prop to handle returning to the info view smoothly
interface ImageGalleryProps {
  onBack: () => void;
}

export default function ImageGallery({ onBack }: ImageGalleryProps) {
  const [activeLightbox, setActiveLightbox] = useState<{ src: string; alt: string } | null>(null);

  // Generate 30 Images mapping to local files 1.jpg to 30.jpg in your public folder
  const galleryImages = Array.from({ length: 30 }).map((_, i) => ({
    id: i + 1,
    src: `/${i + 1}.jpg`, // This looks for /public/1.jpg, /public/2.jpg, etc.
    alt: `Wedding Memory ${i + 1}`,
  }));

  // Scroll Reveal Animation Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add visible classes and remove hidden classes when in viewport
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-12");
            // Stop observing once it has animated in
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the image is visible
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before it hits the very bottom
      }
    );

    // Grab all elements with the reveal class and observe them
    const elements = document.querySelectorAll(".scroll-reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Modal Keyboard & Scroll Lock Logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };

    if (activeLightbox) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeLightbox]);

  const openLightbox = (src: string, alt: string) => {
    setActiveLightbox({ src, alt });
  };

  const closeLightbox = () => {
    setActiveLightbox(null);
  };

  return (
    <>
      {/* FIXED BACKGROUND MOVED HERE - Matching info.tsx perfectly */}
      <div className="fixed inset-0 w-screen h-[100dvh] -z-10 bg-[#F5EBE1]">
        <img
          src="/heross.svg"
          alt="Wedding Background"
          className="absolute inset-0 w-full h-full object-cover object-center md:object-top"
        />
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>
      </div>

      <main className="min-h-screen w-full flex flex-col items-center justify-start py-12 px-4 md:px-12 lg:px-24 bg-transparent text-[#3A2522] selection:bg-[#B58382]/20">
        
        {/* Gallery Header */}
        <header className="text-center space-y-4 mb-12 md:mb-16 mt-4 w-full max-w-3xl">
          <p 
            className="tracking-[0.35em] uppercase text-[10px] md:text-xs text-[#844C44] font-medium animate-fade-in"
            style={{ animationDelay: '100ms' }}
          >
            A Glimpse into our Love Story
          </p>
          <h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#3A2522] tracking-wide italic drop-shadow-sm animate-fade-in"
            style={{ animationDelay: '300ms' }}
          >
            The Gallery
          </h1>
          
          {/* Elegant Fine-Art Divider */}
          <div 
            className="flex items-center justify-center space-x-3 pt-2 animate-fade-in"
            style={{ animationDelay: '500ms' }}
          >
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-[#B58382]/60"></div>
            <span className="text-[10px] text-[#B58382] mb-0.5">✦</span>
            <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-[#B58382]/60"></div>
          </div>
        </header>

        {/* Responsive Image Grid (1 col mobile, 3 tablet, 4 desktop) */}
        <section className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-5 px-2 md:px-0">
          {galleryImages.map((image) => (
            <button
              key={image.id}
              onClick={() => openLightbox(image.src, image.alt)}
              className="scroll-reveal opacity-0 translate-y-12 transition-all duration-1000 ease-out group relative aspect-[3/4] md:aspect-[3/4] bg-white/60 backdrop-blur-sm p-3 md:p-3 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-white/60 overflow-hidden cursor-pointer w-full text-left hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(0,0,0,0.05)]"
            >
              <div className="w-full h-full bg-[#EADCCF]/40 rounded-xl relative overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#3A2522]/0 group-hover:bg-[#3A2522]/20 transition-colors duration-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-50 group-hover:scale-100 transform drop-shadow-md">
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </section>

        {/* Centered Back Button styled exactly like the RSVP component */}
        <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out mt-4 md:mt-10 mb-12">
          <button 
            onClick={onBack}
            className="mt-10 text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#844C44] hover:text-[#3A2522] transition-colors underline underline-offset-4 cursor-pointer font-semibold bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            Back to Invitation Details
          </button>
        </div>

      </main>

      {/* Upgraded Fit-To-Content Responsive Modal */}
      {activeLightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in-fast"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Container Box */}
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

            {/* Modal Image */}
            <div className="flex justify-center items-center overflow-hidden pt-6 md:pt-4">
              <img
                src={activeLightbox.src}
                alt={activeLightbox.alt}
                className="w-auto h-auto max-w-full max-h-[65vh] md:max-h-[75vh] rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Inline styles for custom animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInFast {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes slideUpFast {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
        .animate-fade-in-fast {
          opacity: 0;
          animation: fadeInFast 0.25s ease forwards;
        }
        .animate-slide-up-fast {
          opacity: 0;
          animation: slideUpFast 0.35s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
      `}</style>
    </>
  );
}