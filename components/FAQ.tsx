'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItemProps {
  question: string
  answer: string
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border-b border-fintech-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left hover:bg-fintech-bg/50 transition-colors rounded-lg px-2"
      >
        <span className="font-semibold text-navy pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-5 px-2 animate-fade-in">
          <p className="text-slate leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const faqItems = [
    {
      question: "Is mijn data veilig? (GDPR/AVG compliant)",
      answer: "Absoluut. We zijn volledig GDPR/AVG compliant. Alle data wordt versleuteld opgeslagen (AES-256) en verwerkt binnen de EU. We verkopen nooit data aan derden en gebruiken je documenten alleen voor de conversie."
    },
    {
      question: "Hoe snel worden mijn documenten verwijderd?",
      answer: "Direct na conversie wordt je document automatisch verwijderd van onze servers. We hanteren een strikt 24-uurs data-delete beleid. Je kunt ook direct na downloaden zelf je document verwijderen uit je dashboard."
    },
    {
      question: "Hoe nauwkeurig is de AI conversie?",
      answer: "Onze AI behaalt 99.2% nauwkeurigheid op standaard bankafschriften. Bij complexe documenten of onduidelijke scans kan dit iets lager liggen. Je ontvangt altijd een overzicht om te controleren voordat je downloadt."
    },
    {
      question: "Welke banken en documenten worden ondersteund?",
      answer: "We ondersteunen alle Nederlandse banken: ING, Rabobank, ABN AMRO, Bunq, Revolut, SNS, ASN, Triodos en meer. Daarnaast werken we met creditcard afschriften (Mastercard, Visa, Amex) en PDF facturen."
    }
  ]

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            Veelgestelde Vragen
          </h2>
          <p className="text-slate text-lg">Alles wat je moet weten over BSC Pro</p>
        </div>

        <div className="bg-fintech-bg rounded-2xl p-6 md:p-8">
          {faqItems.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}
