import type React from "react"
import type { Metadata } from "next"
import { GoogleOAuthProvider } from "@react-oauth/google";
import { DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const dmSans = DM_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Excellence Oncology - Cancer Care & Treatment",
  description:
    "Leading oncology center providing comprehensive cancer care, cutting-edge treatments, and compassionate support.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} font-sans antialiased`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <Navbar />
          {children}
          <Footer />
        </GoogleOAuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
