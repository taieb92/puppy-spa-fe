import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "./components/Sidebar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Puppy Spa - Waiting List Management",
    template: "%s | Puppy Spa"
  },
  description: "Efficiently manage your puppy spa's waiting list, appointments, and services.",
  keywords: ["puppy spa", "pet grooming", "waiting list", "pet services", "appointment management"],
  authors: [{ name: "Puppy Spa Team" }],
  creator: "Puppy Spa",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" }
    ]
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://puppy-spa-fe-damq.vercel.app",
    title: "Puppy Spa - Waiting List Management",
    description: "Efficiently manage your puppy spa's waiting list, appointments, and services.",
    siteName: "Puppy Spa"
  },
  twitter: {
    card: "summary_large_image",
    title: "Puppy Spa - Waiting List Management",
    description: "Efficiently manage your puppy spa's waiting list, appointments, and services."
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#FF69B4" />
      </head>
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto lg:pl-[200px]">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
