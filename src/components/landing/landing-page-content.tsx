"use client"

import { useState } from "react"
import { HeroSection } from "./hero-section"
import { FeaturesSection } from "./features-section"
import { FAQSection } from "./faq-section"
import { Footer } from "./footer"

export function LandingPageContent() {
   const [openFaq, setOpenFaq] = useState<number | null>(null)

   const toggleFaq = (index: number) => {
      setOpenFaq(openFaq === index ? null : index)
   }

   return (
      <div className="min-h-screen flex flex-col bg-white">
         <HeroSection />
         <FeaturesSection />
         <FAQSection openFaq={openFaq} toggleFaq={toggleFaq} />
         <Footer />
      </div>
   )
}