"use client"

import Navbar from "@/components/Navbar"
import Hero from "@/components/home/Hero"
import About from "@/components/home/About"
import ClinicDetails from "@/components/home/ClinicDetails"
import Services from "@/components/home/Services"
import Steps from "@/components/home/Steps"
import Testimonials from "@/components/home/Testimonials"
import FAQ from "@/components/home/FAQ"
import Footer from "@/components/Footer"
import Contact from "@/components/Contact"

export default function Home() {

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - No Image */}
      <Hero />

      {/* About the Doctor section */}
      <About />

      {/* Clinic Details section */}
     <ClinicDetails />

      {/* Enhanced services section */}
      <Services />

      {/* Patient Journey section */}
      <Steps />

      {/* FAQ section */}
      <FAQ />

      {/* Contact & Map section */}
      <Contact />

    </main>
  )
}
