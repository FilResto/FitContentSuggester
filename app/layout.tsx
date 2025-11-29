import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitContent Suggester - Instagram Analytics for Fitness Creators",
  description: "AI-powered Instagram analytics and content suggestions for fitness influencers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
