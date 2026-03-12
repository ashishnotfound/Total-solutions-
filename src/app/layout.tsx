import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from "@/context/SettingsContext";
import PageTransition from "@/components/PageTransition";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Total Solutions — Premium Printing & Branding",
  description:
    "Total Solutions is a one-stop printing & branding company offering offset printing, digital/flex/vinyl printing, packaging, promotional items, and finishing — all in-house since 2016.",
  keywords: [
    "printing",
    "branding",
    "flex printing",
    "vinyl printing",
    "business cards",
    "packaging",
    "Noida",
    "Delhi",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SettingsProvider>
          <PageTransition>
            {children}
          </PageTransition>
          <Toaster position="bottom-right" />
        </SettingsProvider>
      </body>
    </html>
  );
}
