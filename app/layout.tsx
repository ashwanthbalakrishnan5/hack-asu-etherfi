import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { ToastContainer } from "@/components/ui";
import { Header, Footer } from "@/components/layout";
import { OnboardingChecklist } from "@/components/onboarding/OnboardingChecklist";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EtherFi Prediction Game | No-Loss Yield Predictions",
  description:
    "Predict with yield, keep your principal safe. Powered by EtherFi weETH and Claude AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Web3Provider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ToastContainer />
          <OnboardingChecklist />
        </Web3Provider>
      </body>
    </html>
  );
}
