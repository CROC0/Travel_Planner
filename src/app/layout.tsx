import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { NavBar } from "@/components/layout/NavBar";
import { MobileNav } from "@/components/layout/MobileNav";
import { ActiveHolidayProvider } from "@/context/ActiveHolidayContext";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trip Planner",
  description: "Plan your holidays with your crew",
  openGraph: {
    title: "Trip Planner",
    description: "Plan your holidays with your crew",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-white">
        <ActiveHolidayProvider>
          <NavBar />
          <main className="flex-1 md:pt-16 pb-16 md:pb-0">{children}</main>
          <MobileNav />
        </ActiveHolidayProvider>
        <Toaster
          theme="dark"
          position="top-center"
          richColors
        />
        <Analytics />
      </body>
    </html>
  );
}
