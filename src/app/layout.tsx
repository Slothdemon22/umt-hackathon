import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/landingPage/Navbar";
import { Toaster } from "sonner";
import { UserRegistration } from "@/components/auth/user-registration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lost & Found - UMT",
  description: "Find your lost items or help others find theirs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white antialiased`}>
          <UserRegistration>
            <div className="min-h-screen flex flex-col">
              <header className="h-32 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 relative">
                <Navbar />
              </header>
              <main className="flex-1">
                {children}
              </main>
            </div>
            <Toaster 
              position="top-right"
              toastOptions={{
                style: {
                  background: "#1e293b",
                  color: "#fff",
                  border: "1px solid #334155",
                },
              }}
            />
          </UserRegistration>
        </body>
      </html>
    </ClerkProvider>
  );
}
