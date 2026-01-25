import { faqs } from "@/data/members";
import { useLandingContent } from "@/contexts/LandingContentContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQSection = () => {
  const { content } = useLandingContent();
  const { faq } = content;

  return (
    <section id="faq" className="py-24" aria-labelledby="faq-heading">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-6" aria-hidden="true">
            <HelpCircle className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 id="faq-heading" className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {faq.title} <span className="text-gradient">{faq.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {faq.description}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-5">
            {faqs.map((faqItem, index) => (
              <AccordionItem
                key={faqItem.id}
                value={faqItem.id}
                className="bg-card rounded-2xl border border-border px-6 overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300"
              >
                <AccordionTrigger 
                  className="text-right font-display text-lg hover:text-primary py-6 focus-ring transition-transform hover:scale-[1.01]"
                  aria-controls={`faq-content-${index}`}
                >
                  {faqItem.question}
                </AccordionTrigger>
                <AccordionContent 
                  id={`faq-content-${index}`}
                  className="text-muted-foreground pb-6 leading-relaxed"
                >
                  {faqItem.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
