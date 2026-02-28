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
    <div className="border-b last:border-0" style={{ borderColor: 'rgba(0, 184, 217, 0.12)' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left transition-colors rounded-lg px-2 cursor-pointer hover:bg-[rgba(0,184,217,0.05)]"
      >
        <span className="font-semibold pr-4" style={{ color: '#e8edf5' }}>{question}</span>
        <span className="flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="w-5 h-5" style={{ color: '#6b7fa3' }} />
          ) : (
            <ChevronDown className="w-5 h-5" style={{ color: '#6b7fa3' }} />
          )}
        </span>
      </button>
      {isOpen && (
        <div className="pb-5 px-2 animate-fade-in">
          <p className="leading-relaxed" style={{ color: '#6b7fa3' }}>{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const faqItems = [
    {
      question: "Is mijn data veilig? (GDPR/AVG compliant)",
      answer: "Absoluut. We zijn volledig GDPR/AVG compliant. Alle data wordt versleuteld opgeslagen (AES-256) en verwerkt binnen de EU. We verkopen nooit data aan derden en gebruiken je documenten alleen voor de conversie. In tegenstelling tot andere tools gebruiken wij jouw financiële data niet om onze AI-modellen te trainen."
    },
    {
      question: "Hoe snel worden mijn documenten verwijderd?",
      answer: "Direct na conversie wordt je document automatisch gemarkeerd voor verwijdering. We hanteren een strikt 24-uurs data-delete beleid. Na 24 uur zijn je bestanden definitief verwijderd van al onze servers. Je kunt ook direct na downloaden zelf je document verwijderen uit je dashboard."
    },
    {
      question: "Hoe nauwkeurig is de AI conversie?",
      answer: "Onze AI behaalt 99.2% nauwkeurigheid op standaard bankafschriften. Bij complexe documenten of onduidelijke scans kan dit iets lager liggen. Je ontvangt altijd een preview om te controleren voordat je definitief downloadt. Enterprise gebruikers zien een 'confidence score' per transactie."
    },
    {
      question: "Welke banken en documenten worden ondersteund?",
      answer: "We ondersteunen alle Nederlandse banken: ING, Rabobank, ABN AMRO, Bunq, Revolut, SNS, ASN, Triodos en meer. Daarnaast werken we met creditcard afschriften (Mastercard, Visa, Amex) en PDF facturen. Heb je een specifiek formaat? Neem contact op, we voegen nieuwe banken snel toe."
    },
    {
      question: "Kan ik mijn geconverteerde data nog bewerken?",
      answer: "Ja! Voordat je de definitieve Excel downloadt, krijg je een preview te zien waarin je transacties kunt bewerken, toevoegen of verwijderen. Zo heb je volledige controle over de output voordat deze naar je boekhouding gaat."
    },
    {
      question: "Wat is het verschil tussen de abonnementen?",
      answer: "Basic (€2/doc) is pay-as-you-go voor incidenteel gebruik. Business (€15/maand) biedt 50 conversies per maand met batch processing en priority support. Enterprise (€30/maand) geeft onbeperkte conversies, whitelabel rapporten, JSON export en een dedicated account manager."
    }
  ]

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#080d14' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#e8edf5' }}>
            Veelgestelde Vragen
          </h2>
          <p className="text-lg" style={{ color: '#6b7fa3' }}>Alles wat je moet weten over BSC Pro</p>
        </div>

        <div className="rounded-2xl p-6 md:p-8" style={{ background: 'rgba(10, 18, 32, 0.8)', border: '1px solid rgba(0, 184, 217, 0.12)' }}>
          {faqItems.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}
