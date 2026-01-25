import type { Metadata } from "next";
import { Space_Mono, Grenze_Gotisch } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";

const ggSerif = Grenze_Gotisch({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Critique | Get Judged",
  description: "Get judged based on your profiles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ggSerif.variable} ${spaceMono.variable} antialiased`}
      >
        <Providers>
        {children}
        <Toaster position="bottom-center"/>
        </Providers>
      </body>
    </html>
  );
}
