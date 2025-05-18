import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { AppProvider } from "@/lib/context/app-provider";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { MoneyVisibilityToggle } from "@/components/money-visibility-toggle";
import { ProfileToggle } from "@/components/profile-toggle";

const kanit = Kanit({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin", "thai"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Expense Tracker For Everyone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${kanit.variable} antialiased`}
      >
        <AppProvider>
          <header className="sticky top-0 z-10 bg-background border-b">
            <div className="container max-w-md mx-auto p-4 flex items-center justify-between">
              <Link href="/dashboard">
                <h1 className="text-xl font-bold cursor-pointer 
                bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text  text-transparent
                ">
                  Expense Tracker
                </h1>
              </Link>
              <div className="flex items-center gap-2">
                <MoneyVisibilityToggle />
                <ModeToggle />
                <ProfileToggle />
              </div>
            </div>
          </header>
          {children}
        </AppProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
