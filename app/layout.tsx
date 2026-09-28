import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0C100D",
};

export const metadata: Metadata = {
  title: {
    default: "Élaia Mediterranean Table | Authentic Coastal Gastronomy & Cocktails",
    template: "%s | Élaia Mediterranean Table",
  },
  description:
    "Rooted in Peloponnese olive groves and wood-fired stone hearths, Élaia brings slow-crafted Mediterranean coastal gastronomy and late-night botanical mixology to the waterfront.",
  keywords: [
    "Mediterranean Restaurant",
    "Aegean Coastal Dining",
    "Greek Restaurant",
    "Wood-fired Hearth",
    "Table Reservations",
    "Seafood & Mezze",
    "Elena Rossi",
  ],
  openGraph: {
    title: "Élaia Mediterranean Table | Authentic Coastal Gastronomy",
    description:
      "Slow-crafted coastal dining under olive branches. Taste charred Aegean octopus, wood-fired hearth grills, and botanical mixology.",
    url: "https://elaia-table.com",
    siteName: "Élaia Mediterranean Table",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} bg-[#0C100D] text-[#F3EEE7] antialiased scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-[#0C100D] text-[#F3EEE7] selection:bg-[#D47D57] selection:text-white">
        {children}
      </body>
    </html>
  );
}
