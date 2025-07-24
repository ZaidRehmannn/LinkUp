import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar/Navbar";
import AuthWrapper from "@/components/AuthWrapper";
import Menu from "@/components/navbar/Menu";

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
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthWrapper>
          <Navbar />
          <Menu />
          <main className="flex-grow">{children}</main>
        </AuthWrapper>
      </body>
    </html>
  );
}
