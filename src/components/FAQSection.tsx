import { faqs } from "@/data/members";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQSection = () => {
  return (
    <section className="py-24" aria-labelledby="faq-heading">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-6" aria-hidden="true">
            <HelpCircle className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 id="faq-heading" className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            שאלות <span className="text-gradient">נפוצות</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            מצאו תשובות לשאלות הכי נפוצות
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="bg-card rounded-2xl border border-gold/10 px-6 overflow-hidden"
              >
                <AccordionTrigger 
                  className="text-right font-display text-lg hover:text-primary py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-controls={`faq-content-${index}`}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent 
                  id={`faq-content-${index}`}
                  className="text-muted-foreground pb-6 leading-relaxed"
                >
                  {faq.answer}
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
