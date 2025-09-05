import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar/Navbar";
import Menu from "@/components/navbar/Menu";
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import RouteGuard from "@/components/RouteGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LinkUp",
  description: "Connect with people, share moments, and grow your social circle — all in one place with LinkUp.",
  icons: {
    icon: "/favicon.ico"
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RouteGuard>
            <Toaster position="top-center" />
            <Navbar />
            <Menu />
            <main className="flex-grow">{children}</main>
          </RouteGuard>
        </ThemeProvider>
      </body>
    </html >
  );
}
