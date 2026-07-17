import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import PageLoader from "../component/pageloader";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Arlan Dave & Rei Marie Anne - Wedding Invitation",
  description: "Join us in celebrating our special day.",

  metadataBase: new URL("https://canales-yumolwedding.vercel.app"),

  openGraph: {
    title: "Arlan Dave & Rei Marie Anne - Wedding Invitation",
    description: "Join us in celebrating our special day.",
    url: "https://canales-yumolwedding.vercel.app",
    siteName: "Canales Wedding Invitation",
    images: [
      {
        // Use the FULL absolute URL here to ensure Messenger finds it
        url: "https://canales-yumolwedding.vercel.app/ogi-image.png",
        width: 1200,
        height: 630,
        alt: "Arlan Dave & Rei Marie Anne - Wedding Invitation",
        type: "image/png", // Explicitly state the image type
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Arlan Dave & Rei Marie Anne - Wedding Invitation",
    description: "Join us in celebrating our special day.",
    // Use the full URL for Twitter as well just in case
    images: ["https://canales-yumolwedding.vercel.app/ogi-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${lato.variable} font-sans bg-[#FDFBF7] text-stone-800 antialiased`}
      >
        <PageLoader />
        {children}
      </body>
    </html>
  );
}