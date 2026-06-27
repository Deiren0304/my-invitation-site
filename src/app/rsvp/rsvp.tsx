"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase"; // Update this path based on where you saved supabase.ts

export default function RsvpForm() {
  // Navigation State
  const [step, setStep] = useState<1 | 2 | 3>(1); 
  
  // Step 1 State: Search
  const [searchQuery, setSearchQuery] = useState("");
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

  // Handle Step 1: Find Invitation via Supabase
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchError("");
    
    const query = searchQuery.trim();

    try {
      // .ilike() allows for case-insensitive searching (e.g., "john doe" matches "John Doe")
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .ilike('full_name', query)
        .single();

      if (error || !data) {
        setSearchError("We couldn't find your name. Please try using your full name or family name as written on your physical envelope.");
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

  // Handle Step 2: Final Submission to Supabase
  const handleSubmitRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const isAttending = formData.attending === "yes";
    const actualCount = isAttending ? formData.attendingCount : 0;
    const finalGuestNames = isAttending ? formData.guestNames.slice(0, formData.attendingCount) : [];

    try {
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
      
      setStep(3);
    } catch (err) {
      console.error("Error submitting RSVP:", err);
      alert("Something went wrong saving your RSVP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-2">
      
      {/* STEP 1: FIND INVITATION */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out flex flex-col items-center">
          
          {/* Elegant Floating Typography Header (No Box/Divider) */}
          <div className="text-center space-y-4 mb-8 w-full">
            <p className="tracking-[0.4em] uppercase text-[9px] md:text-[10px] text-[#844C44] font-semibold opacity-80">
              RSVP for the Wedding of
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-[#3A2522] italic tracking-wide drop-shadow-sm">
              Arlan & Rei Marie
            </h1>
            <div className="h-px w-12 bg-[#B58382]/30 mx-auto mt-2"></div>
          </div>

          {/* Search Form Card */}
          <form 
            onSubmit={handleSearch}
            className="w-full bg-white/70 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.02)] border border-white/80 relative group overflow-hidden"
          >
            {/* Decorative Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#B58382]/20 rounded-tl-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#B58382]/20 rounded-tr-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#B58382]/20 rounded-bl-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#B58382]/20 rounded-br-2xl pointer-events-none" />

            <div className="text-center space-y-2 pb-5">
              <h2 className="font-serif text-xl md:text-2xl text-[#3A2522] tracking-wide">Find Your Invitation</h2>
              <p className="text-stone-500 text-xs font-sans max-w-xs mx-auto leading-relaxed">Please enter your first and last name exactly as it appears on your envelope.</p>
            </div>

            <div className="space-y-2 mb-6">
              <label htmlFor="searchQuery" className="block text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold text-[#844C44] font-sans">
                Full Name
              </label>
              <input
                type="text"
                id="searchQuery"
                required
                disabled={isSearching}
                className="w-full px-5 py-3.5 rounded-xl border border-stone-200/80 focus:ring-1 focus:ring-[#844C44] focus:border-[#844C44] outline-none text-stone-800 transition-all duration-300 text-sm font-sans bg-white/90 shadow-2xs hover:border-[#B58382]/40 placeholder:text-stone-400 placeholder:italic placeholder:font-serif disabled:opacity-50"
                placeholder="e.g., John Doe"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchError && (
                <p className="text-[#844C44] text-[11px] pt-2 font-serif italic animate-in fade-in">{searchError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-[#844C44] hover:bg-[#6D3C36] disabled:bg-stone-400 disabled:cursor-not-allowed text-white font-serif tracking-[0.15em] uppercase text-xs py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 select-none font-semibold flex justify-center items-center mt-auto"
            >
              {isSearching ? "Searching Records..." : "Find Invitation"}
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: RSVP DETAILS FORM */}
      {step === 2 && (
        <form 
          onSubmit={handleSubmitRSVP} 
          className="space-y-7 bg-white/70 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.02)] border border-white/80 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out relative group overflow-hidden"
        >
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#B58382]/20 rounded-tl-2xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#B58382]/20 rounded-tr-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#B58382]/20 rounded-bl-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#B58382]/20 rounded-br-2xl pointer-events-none" />

          {/* Form Header */}
          <div className="text-center space-y-2 border-b border-[#B58382]/20 pb-6">
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#B58382] font-sans">Welcome,</p>
            <h2 className="font-serif text-2xl text-[#3A2522] tracking-wide italic capitalize">{matchedName}</h2>
            <p className="text-stone-600 text-xs font-sans pt-1">
              We have reserved <span className="font-semibold text-[#844C44]">{allocatedSeats}</span> seat{allocatedSeats > 1 ? 's' : ''} in your honor.
            </p>
          </div>

          {/* Attendance Toggle */}
          <div className="space-y-3">
            <label className="block text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold text-[#844C44] font-sans text-center">
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
                <div className="text-center py-4 text-sm rounded-xl border border-stone-200/80 text-stone-600 bg-white/90 peer-checked:bg-[#844C44] peer-checked:text-white peer-checked:border-[#844C44] peer-checked:shadow-md hover:border-[#844C44]/40 transition-all duration-300 font-sans font-medium tracking-wide group-hover/radio:-translate-y-0.5">
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
                <div className="text-center py-4 text-sm rounded-xl border border-stone-200/80 text-stone-600 bg-white/90 peer-checked:bg-[#844C44] peer-checked:text-white peer-checked:border-[#844C44] peer-checked:shadow-md hover:border-[#844C44]/40 transition-all duration-300 font-sans font-medium tracking-wide group-hover/radio:-translate-y-0.5">
                  Regretfully Declines
                </div>
              </label>
            </div>
          </div>

          {/* Conditional Fields if Attending */}
          {formData.attending === "yes" && (
            <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-4 duration-500 ease-out border-t border-[#B58382]/10">
              
              {allocatedSeats > 1 && (
                <div className="space-y-2">
                  <label htmlFor="attendingCount" className="block text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold text-[#844C44] font-sans">
                    How many guests will be attending?
                  </label>
                  <div className="relative">
                    <select
                      id="attendingCount"
                      className="w-full px-5 py-3.5 rounded-xl border border-stone-200/80 focus:ring-1 focus:ring-[#844C44] outline-none bg-white/90 text-stone-800 text-sm font-sans shadow-2xs hover:border-[#B58382]/40 transition-all appearance-none cursor-pointer"
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

              {/* Dynamic Name Inputs */}
              <div className="space-y-4">
                <label className="block text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold text-[#844C44] font-sans">
                  Guest Names
                </label>
                {Array.from({ length: formData.attendingCount }).map((_, index) => (
                  <div key={index} className="relative">
                    <input
                      type="text"
                      required
                      className="w-full px-5 py-3.5 rounded-xl border border-stone-200/80 focus:ring-1 focus:ring-[#844C44] focus:border-[#844C44] outline-none text-stone-800 transition-all duration-300 text-sm font-sans bg-white/90 shadow-2xs hover:border-[#B58382]/40 placeholder:text-stone-400 placeholder:italic placeholder:font-serif"
                      placeholder={`Guest ${index + 1} Full Name`}
                      value={formData.guestNames[index] || ""}
                      onChange={(e) => handleGuestNameChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label htmlFor="notes" className="block text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold text-[#844C44] font-sans">
                  Notes & Dietary Restrictions
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  className="w-full px-5 py-3.5 rounded-xl border border-stone-200/80 focus:ring-1 focus:ring-[#844C44] outline-none resize-none text-stone-800 text-sm font-sans bg-white/90 shadow-2xs hover:border-[#B58382]/40 transition-all placeholder:text-stone-400 placeholder:italic placeholder:font-serif"
                  placeholder="Optional: Please share any dietary restrictions or messages for the couple."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

            </div>
          )}

          <div className="pt-2 flex flex-col space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#844C44] hover:bg-[#6D3C36] disabled:bg-stone-400 disabled:cursor-not-allowed text-white font-serif tracking-[0.15em] uppercase text-xs py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 select-none font-semibold flex justify-center items-center"
            >
              {isSubmitting ? "Securing Reservation..." : "Confirm RSVP"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={isSubmitting}
              className="w-full text-[10px] uppercase tracking-[0.2em] text-stone-500 hover:text-[#844C44] transition-colors py-2 font-medium disabled:opacity-50"
            >
              Not {matchedName}? Search Again
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: SUCCESS STATE */}
      {step === 3 && (
        <div className="bg-white/70 backdrop-blur-md p-10 md:p-14 rounded-3xl text-center border border-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.03)] transition-all duration-700 animate-in fade-in zoom-in-95 ease-out flex flex-col items-center space-y-5">
          <div className="w-14 h-14 bg-[#F5EBE1] border border-[#B58382]/30 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in duration-700 delay-300">
            <svg className="w-6 h-6 text-[#844C44]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="font-serif text-3xl text-[#3A2522] font-normal tracking-wide italic">
            Thank You
          </h3>
          <div className="h-px w-16 bg-[#B58382]/40 my-2"></div>
          <p className="text-stone-600 text-sm font-light font-sans max-w-sm leading-relaxed">
            {formData.attending === "yes" 
              ? "Your response has been graciously received. We look forward to celebrating this special day with you."
              : "We are so sorry you won't be able to join us, but we sincerely appreciate you letting us know. You will be missed!"}
          </p>
        </div>
      )}
      
    </div>
  );
}