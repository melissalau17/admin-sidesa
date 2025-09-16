import { ChevronDown } from "lucide-react"
import { faqData } from "@/lib/data/faq-data"

interface FAQSectionProps {
    openFaq: number | null
    toggleFaq: (index: number) => void
}

export function FAQSection({ openFaq, toggleFaq }: FAQSectionProps) {
    return (
        <section className="py-20 bg-gradient-to-br from-blue-20 via-white to-teal-50">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqData.map((faq, index) => (
                            <div
                                key={index}
                                // The parent div is now the "group"
                                className="group border border-gray-700 rounded-lg overflow-hidden transition-colors duration-200 ease-in-out hover:border-blue-500"
                            >
                                <button
                                    // The button has no styling of its own, just padding and layout
                                    className="w-full px-6 py-4 text-left flex justify-between items-center bg-transparent transition-colors focus:outline-none"
                                    onClick={() => toggleFaq(index)}
                                >
                                    <span className="font-medium text-gray-800 transition-colors duration-200 ease-in-out group-hover:text-blue-600">
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform duration-200 ease-in-out ${openFaq === index ? "rotate-180 text-blue-500" : "text-gray-500 group-hover:text-blue-500"}`}
                                    />
                                </button>
                                {openFaq === index && <div className="px-6 pb-4 text-gray-800">{faq.answer}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}