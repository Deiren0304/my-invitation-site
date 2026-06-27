import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import PageLoader from "../component/pageloader";

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair" 
});

const lato = Lato({ 
  weight: ["300", "400", "700"], 
  subsets: ["latin"], 
  variable: "--font-lato" 
});

export const metadata: Metadata = {
  title: "Arlan Dave & Rei Marie - Wedding Invitation",
  description: "Join us in celebrating our special day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${playfair.variable} ${lato.variable} font-sans bg-[#FDFBF7] text-stone-800 antialiased`}>
        {/* THIS is what was missing! We render the loader here so it sits on top of everything */}
        <PageLoader />
        
        {children}
      </body>
    </html>
  );
}