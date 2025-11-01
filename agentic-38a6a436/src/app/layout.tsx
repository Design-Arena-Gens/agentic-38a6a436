import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agentic Investment Copilot",
  description:
    "Run an adaptive investment agent that crafts allocations, projections, and tactical playbooks around your goals.",
  metadataBase: new URL("https://agentic-38a6a436.vercel.app"),
  openGraph: {
    title: "Agentic Investment Copilot",
    description:
      "Encode your mandate and receive institutional-grade allocation guidance in seconds.",
    type: "website",
    url: "https://agentic-38a6a436.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agentic Investment Copilot",
    description:
      "Interactive portfolio copilot with allocations, projections, and actionable insights.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
