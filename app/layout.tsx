import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import AppContent from "@/components/AppContent";
import ToasterProvider from "@/providers/ToasterProvider";
import { SITE_NAME } from "@/lib/constant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const headingSans = Plus_Jakarta_Sans({
  variable: "--font-heading-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SITE_NAME,
  description: "Online courses with a modern learning experience for Nepalese students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${headingSans.variable} antialiased`}>
        <AppContent>
          {children}
        </AppContent>
        <ToasterProvider />
      </body>
    </html>
  );
}
