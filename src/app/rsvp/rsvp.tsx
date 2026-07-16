"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RsvpForm() {
  // Navigation State
  const [step, setStep] = useState<1 | 2 | 3>(1); 
  
  // Step 1 State: Search & Autocomplete
  const [fullName, setFullName] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // Guest Data State
  const [guestId, setGuestId] = useState<string>("");
  const [allocatedSeats, setAllocatedSeats] = useState(0);
  const [matchedName, setMatchedName] = useState("");

  // Step 2 State: Form Data
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    attending: "yes",
    attendingCount: 1,
    guestNames: [""] as string[],
    notes: "",
  });

  // Handle Input Change for Autocomplete
  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);
    setSearchError("");

    // Changed from >= 2 to >= 1 to trigger immediately
    if (value.trim().length >= 1) {
      try {
        // Query for names that contain the typed string
        const { data, error } = await supabase
          .from('guests')
          .select('full_name')
          .ilike('full_name', `%${value}%`)
          .limit(5);

        if (data && !error) {
          setSuggestions(data.map(guest => guest.full_name));
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle clicking a suggestion from the dropdown
  const handleSelectSuggestion = (name: string) => {
    setFullName(name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle Step 1: Find Invitation via Supabase
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchError("");
    
    const query = fullName.trim();

    try {
      // Find the exact match (case-insensitive) based on the input
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .ilike('full_name', query)
        .single();

      if (error || !data) {
        setSearchError("We couldn't find your name. Please ensure it matches exactly what was written on your physical envelope.");
        setIsSearching(false);
        return;
      }

      if (data.has_rsvpd) {
        setSearchError("It looks like you have already submitted your RSVP! Please contact the couple if you need to make changes.");
        setIsSearching(false);
        return;
      }

      // Populate data from Supabase
      setGuestId(data.id);
      setAllocatedSeats(data.allocated_seats);
      setMatchedName(data.full_name);
      
      const initialGuestNames = Array.from(
        { length: data.allocated_seats }, 
        (_, index) => index === 0 ? data.full_name : ""
      );
      
      setFormData(prev => ({
        ...prev,
        attendingCount: data.allocated_seats, 
        guestNames: initialGuestNames
      }));
      
      setStep(2);
    } catch (err) {
      setSearchError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Dynamic Guest Name Inputs
  const handleGuestNameChange = (index: number, value: string) => {
    const updatedNames = [...formData.guestNames];
    updatedNames[index] = value;
    setFormData(prev => ({ ...prev, guestNames: updatedNames }));
  };

  // Handle Changing the number of people actually attending
  const handleAttendingCountChange = (count: number) => {
    setFormData(prev => {
      const newNames = [...prev.guestNames];
      while (newNames.length < count) newNames.push("");
      return { ...prev, attendingCount: count, guestNames: newNames.slice(0, count) };
    });
  };

  // Handle Step 2: Final Submission to Supabase AND Formspree
  const handleSubmitRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const isAttending = formData.attending === "yes";
    const actualCount = isAttending ? formData.attendingCount : 0;
    const finalGuestNames = isAttending ? formData.guestNames.slice(0, formData.attendingCount) : [];

    try {
      // 1. Update Supabase Database
      const { error } = await supabase
        .from('guests')
        .update({
          is_attending: isAttending,
          actual_guest_count: actualCount,
          guest_names: finalGuestNames,
          notes: formData.notes,
          has_rsvpd: true // Lock the RSVP so they can't submit twice
        })
        .eq('id', guestId);

      if (error) throw error;

      // 2. Send Email Notification via Formspree
      const formspreeEndpoint = "https://formspree.io/f/xjgnvagv"; 
      
      await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          Invitation_Name: matchedName,
          Attending: formData.attending === "yes" ? "Yes" : "No",
          Guest_Count: actualCount,
          Guest_Names: finalGuestNames.join(", ") || "None",
          Notes: formData.notes || "None",
        }),
      });
      
      // Move to success step
      setStep(3);
    } catch (err) {
      console.error("Error submitting RSVP:", err);
      alert("Something went wrong saving your RSVP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-2 flex flex-col items-center">
      {/* STEP 1: FIND INVITATION */}
      {step === 1 && (
        <div className="flex flex-col items-center w-full">
          <div className="text-center space-y-4 mb-8 w-full pt-1">
            <div className="overflow-hidden pb-1">
              <p className="tracking-[0.4em] uppercase text-[9px] md:text-[10px] text-[#EADCCF] font-semibold opacity-0 animate-reveal-text delay-[150ms] [animation-fill-mode:forwards]">
                RSVP for the Wedding of
              </p>
            </div>
            
            <div className="pb-2 px-2 w-full flex justify-center">
              <h1
                className="font-californian text-[#F5EBE1] tracking-wide leading-tight text-center drop-shadow-sm opacity-0 animate-reveal-text delay-[300ms] [animation-fill-mode:forwards]"
                style={{ fontSize: "clamp(1.5rem, 9vw, 8.5rem)" }}
              >
                <span className="block">ARLAN DAVE</span>

                <span
                  className="block text-[#EADCCF]/70 font-light leading-none my-1"
                  style={{ fontSize: "0.55em" }}
                >
                  &amp;
                </span>

                <span
                  className="block whitespace-nowrap"
                  style={{ fontSize: "0.95em" }}
                >
                  REI MARIE ANNE
                </span>
              </h1>
            </div>

            <div className="h-px w-12 bg-[#EADCCF]/30 mx-auto mt-2 opacity-0 animate-fade-in delay-[450ms] [animation-fill-mode:forwards]"></div>
          </div>

          {/* Search Form Card */}
          <form 
            onSubmit={handleSearch}
            className="w-full bg-white/70 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.02)] border border-white/80 relative group overflow-hidden opacity-0 animate-fade-in delay-[600ms] [animation-fill-mode:forwards]"
          >
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#B58382]/20 rounded-tl-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#B58382]/20 rounded-tr-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#B58382]/20 rounded-bl-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#B58382]/20 rounded-br-2xl pointer-events-none" />

            <div className="text-center space-y-2 pb-5 pt-1">
              <div className="overflow-hidden pb-1">
                <h2 className="font-roxborough text-xl md:text-2xl text-[#3A2522] tracking-wide opacity-0 animate-reveal-text delay-[750ms] [animation-fill-mode:forwards]">Find Your Invitation</h2>
              </div>
              <div className="overflow-hidden pb-1">
                <p className="text-stone-500 text-xs font-arapey max-w-xs mx-auto leading-relaxed opacity-0 animate-reveal-text delay-[900ms] [animation-fill-mode:forwards]">Please enter your full name below to locate your reservation.</p>
              </div>
            </div>

            <div className="space-y-4 mb-6 opacity-0 animate-fade-in delay-[1050ms] [animation-fill-mode:forwards]">
              
              {/* Autocomplete Input Container */}
              <div className="space-y-2 relative">
                <label htmlFor="fullName" className="block text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold text-[#844C44] font-arapey text-left">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  required
                  disabled={isSearching}
                  className="w-full px-5 py-3.5 rounded-xl border border-stone-200/80 focus:ring-1 focus:ring-[#844C44] focus:border-[#844C44] outline-none text-stone-800 transition-all duration-300 text-sm font-arapey bg-white/90 shadow-2xs hover:border-[#B58382]/40 placeholder:text-stone-400 placeholder:italic placeholder:font-roxborough disabled:opacity-50"
                  placeholder="e.g., Juan Dela Cruz"
                  value={fullName}
                  onChange={handleNameChange}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  onBlur={() => {
                    // Delay hiding so clicking a suggestion registers before it unmounts
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                />

                {/* Suggestions Dropdown (Absolute positioning removed, mt-2 added to push elements down) */}
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="w-full bg-white border border-stone-200/80 rounded-xl shadow-sm mt-2 max-h-48 overflow-y-auto">
                    {suggestions.map((name, idx) => (
                      <li 
                        key={idx}
                        // Use onMouseDown instead of onClick to prevent the input's onBlur from firing first
                        onMouseDown={() => handleSelectSuggestion(name)}
                        className="px-5 py-3 hover:bg-[#F5EBE1]/50 cursor-pointer text-sm font-arapey text-stone-700 border-b border-stone-100 last:border-none transition-colors"
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {searchError && (
                <p className="text-[#844C44] text-[11px] pt-2 font-roxborough italic animate-in fade-in">{searchError}</p>
              )}
            </div>

            <div className="opacity-0 animate-fade-in delay-[1200ms] [animation-fill-mode:forwards]">
              <button
                type="submit"
                disabled={isSearching}
                className="w-full bg-[#844C44] hover:bg-[#6D3C36] disabled:bg-stone-400 disabled:cursor-not-allowed text-white font-roxborough tracking-[0.15em] uppercase text-xs py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 select-none font-semibold flex justify-center items-center mt-auto"
              >
                {isSearching ? "Searching Records..." : "Find Invitation"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2: RSVP DETAILS FORM */}
      {step === 2 && (
        <form 
          onSubmit={handleSubmitRSVP} 
          className="w-full space-y-7 bg-white/70 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.02)] border border-white/80 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out relative group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#B58382]/20 rounded-tl-2xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#B58382]/20 rounded-tr-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#B58382]/20 rounded-bl-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#B58382]/20 rounded-br-2xl pointer-events-none" />

          <div className="text-center space-y-2 border-b border-[#B58382]/20 pb-6 pt-2">
            <div className="overflow-hidden pb-1">
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#B58382] font-arapey opacity-0 animate-reveal-text delay-[150ms] [animation-fill-mode:forwards]">Welcome,</p>
            </div>
            <div className="overflow-hidden pb-1">
              <h2 className="font-roxborough text-2xl text-[#3A2522] tracking-wide italic capitalize opacity-0 animate-reveal-text delay-[300ms] [animation-fill-mode:forwards]">{matchedName}</h2>
            </div>
            <div className="overflow-hidden pt-1 pb-1">
              <p className="text-stone-600 text-xs font-arapey opacity-0 animate-reveal-text delay-[450ms] [animation-fill-mode:forwards]">
                We have reserved <span className="font-semibold text-[#844C44]">{allocatedSeats}</span> seat{allocatedSeats > 1 ? 's' : ''} in your honor.
              </p>
            </div>
          </div>

          <div className="space-y-3 opacity-0 animate-fade-in delay-[600ms] [animation-fill-mode:forwards]">
            <label className="block text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold text-[#844C44] font-arapey text-center">
              Will you attend?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="cursor-pointer group/radio">
                <input
                  type="radio"
                  name="attending"
                  value="yes"
                  className="peer sr-only"
                  checked={formData.attending === "yes"}
                  onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                />
                <div className="text-center py-4 text-sm rounded-xl border border-stone-200/80 text-stone-600 bg-white/90 peer-checked:bg-[#844C44] peer-checked:text-white peer-checked:border-[#844C44] peer-checked:shadow-md hover:border-[#844C44]/40 transition-all duration-300 font-arapey font-medium tracking-wide group-hover/radio:-translate-y-0.5">
                  Joyfully Accepts
                </div>
              </label>

              <label className="cursor-pointer group/radio">
                <input
                  type="radio"
                  name="attending"
                  value="no"
                  className="peer sr-only"
                  checked={formData.attending === "no"}
                  onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                />
                <div className="text-center py-4 text-sm rounded-xl border border-stone-200/80 text-stone-600 bg-white/90 peer-checked:bg-[#844C44] peer-checked:text-white peer-checked:border-[#844C44] peer-checked:shadow-md hover:border-[#844C44]/40 transition-all duration-300 font-arapey font-medium tracking-wide group-hover/radio:-translate-y-0.5">
                  Regretfully Declines
                </div>
              </label>
            </div>
          </div>

          {formData.attending === "yes" && (
            <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-4 duration-500 ease-out border-t border-[#B58382]/10 opacity-0 animate-fade-in delay-[750ms] [animation-fill-mode:forwards]">
              
              {allocatedSeats > 1 && (
                <div className="space-y-2">
                  <label htmlFor="attendingCount" className="block text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold text-[#844C44] font-arapey">
                    How many guests will be attending?
                  </label>
                  <div className="relative">
                    <select
                      id="attendingCount"
                      className="w-full px-5 py-3.5 rounded-xl border border-stone-200/80 focus:ring-1 focus:ring-[#844C44] outline-none bg-white/90 text-stone-800 text-sm font-arapey shadow-2xs hover:border-[#B58382]/40 transition-all appearance-none cursor-pointer"
                      value={formData.attendingCount}
                      onChange={(e) => handleAttendingCountChange(Number(e.target.value))}
                    >
                      {Array.from({ length: allocatedSeats }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pr-1 pointer-events-none text-xs text-[#B58382]">
                      ▼
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="block text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold text-[#844C44] font-arapey">
                  Guest Names
                </label>
                {Array.from({ length: formData.attendingCount }).map((_, index) => (
                  <div key={index} className="relative">
                    <input
                      type="text"
                      required
                      className="w-full px-5 py-3.5 rounded-xl border border-stone-200/80 focus:ring-1 focus:ring-[#844C44] focus:border-[#844C44] outline-none text-stone-800 transition-all duration-300 text-sm font-arapey bg-white/90 shadow-2xs hover:border-[#B58382]/40 placeholder:text-stone-400 placeholder:italic placeholder:font-roxborough"
                      placeholder={`Guest ${index + 1} Full Name`}
                      value={formData.guestNames[index] || ""}
                      onChange={(e) => handleGuestNameChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="block text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold text-[#844C44] font-arapey">
                  Notes & Dietary Restrictions
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  className="w-full px-5 py-3.5 rounded-xl border border-stone-200/80 focus:ring-1 focus:ring-[#844C44] outline-none resize-none text-stone-800 text-sm font-arapey bg-white/90 shadow-2xs hover:border-[#B58382]/40 transition-all placeholder:text-stone-400 placeholder:italic placeholder:font-roxborough"
                  placeholder="Optional: Please share any dietary restrictions or messages for the couple."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

            </div>
          )}

          <div className="pt-2 flex flex-col space-y-3 opacity-0 animate-fade-in delay-[900ms] [animation-fill-mode:forwards]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#844C44] hover:bg-[#6D3C36] disabled:bg-stone-400 disabled:cursor-not-allowed text-white font-roxborough tracking-[0.15em] uppercase text-xs py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 select-none font-semibold flex justify-center items-center"
            >
              {isSubmitting ? "Securing Reservation..." : "Confirm RSVP"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={isSubmitting}
              className="w-full text-[10px] uppercase tracking-[0.2em] text-stone-500 hover:text-[#844C44] transition-colors py-2 font-medium font-arapey disabled:opacity-50 cursor-pointer"
            >
              Not {matchedName}? Search Again
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: SUCCESS STATE */}
      {step === 3 && (
        <div className="w-full bg-white/70 backdrop-blur-md p-10 md:p-14 rounded-3xl text-center border border-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col items-center space-y-5">
          
          <div className="w-14 h-14 bg-[#F5EBE1] border border-[#B58382]/30 rounded-full flex items-center justify-center shadow-sm opacity-0 animate-fade-in delay-[150ms] [animation-fill-mode:forwards]">
            <svg className="w-6 h-6 text-[#844C44]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          
          <div className="overflow-hidden pb-1">
            <h3 className="font-roxborough text-3xl text-[#3A2522] font-normal tracking-wide italic opacity-0 animate-reveal-text delay-[300ms] [animation-fill-mode:forwards]">
              Thank You
            </h3>
          </div>
          
          <div className="h-px w-16 bg-[#B58382]/40 my-2 opacity-0 animate-fade-in delay-[450ms] [animation-fill-mode:forwards]"></div>
          
          <div className="overflow-hidden pt-1 pb-1">
            <p className="text-stone-600 text-sm font-light font-arapey max-w-sm leading-relaxed opacity-0 animate-reveal-text delay-[600ms] [animation-fill-mode:forwards]">
              {formData.attending === "yes" 
                ? "Your response has been graciously received. We look forward to celebrating this special day with you."
                : "We are so sorry you won't be able to join us, but we sincerely appreciate you letting us know. You will be missed!"}
            </p>
          </div>
          
        </div>
      )}
      
      {/* RSVP STRICT RULES NOTE (Always visible at the bottom) */}
      <div className="mt-10 mb-2 w-full text-center opacity-0 animate-fade-in delay-[700ms] [animation-fill-mode:forwards]">
        <p className="font-arapey text-[#EADCCF]/90 text-[14px] md:text-[15px] leading-relaxed">
          <span className="font-bold text-white">Note:</span> Only guests who have<br className="md:hidden" /> confirmed their RSVP will attend.
        </p>
        <p className="font-roxborough font-bold text-white text-[13px] md:text-[14px] uppercase tracking-wider my-3 drop-shadow-sm">
          Strictly No Plus One.
        </p>
        <p className="font-arapey text-[#EADCCF]/90 text-[14px] md:text-[15px] leading-relaxed max-w-sm mx-auto">
          Please refer to the number of guests allotted for you. Thank you for understanding.
        </p>
      </div>

    </div>
  );
}