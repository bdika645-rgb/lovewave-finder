import { useState, useMemo } from "react";
import { faqs } from "@/data/members";
import { useLandingContent } from "@/contexts/LandingContentContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import FAQSearch from "@/components/FAQSearch";
import { motion, AnimatePresence } from "framer-motion";
import { InlineEditable, EditableSection } from "@/components/VisualEditor";

const FAQSection = () => {
  const { content, updateContent } = useLandingContent();
  const { faq } = content;
  const [searchQuery, setSearchQuery] = useState("");

  const updateFaq = (key: keyof typeof faq, value: string) => {
    updateContent("faq", { [key]: value });
  };

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    
    const query = searchQuery.toLowerCase();
    return faqs.filter(
      (faqItem) =>
        faqItem.question.toLowerCase().includes(query) ||
        faqItem.answer.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <EditableSection sectionName="שאלות נפוצות">
      <section id="faq" className="py-24" aria-labelledby="faq-heading">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-6" aria-hidden="true">
              <HelpCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 id="faq-heading" className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              <InlineEditable
                value={faq.title}
                onChange={(v) => updateFaq("title", v)}
                as="span"
              />{" "}
              <InlineEditable
                value={faq.titleHighlight}
                onChange={(v) => updateFaq("titleHighlight", v)}
                className="text-gradient"
                as="span"
              />
            </h2>
            <InlineEditable
              value={faq.description}
              onChange={(v) => updateFaq("description", v)}
              className="text-muted-foreground text-lg max-w-2xl mx-auto block"
              as="p"
              multiline
            />
          </div>

          {/* Search */}
          <FAQSearch 
            query={searchQuery} 
            onQueryChange={setSearchQuery}
            resultsCount={filteredFaqs.length}
            totalCount={faqs.length}
          />

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-5">
              <AnimatePresence mode="popLayout">
                {filteredFaqs.map((faqItem, index) => (
                  <motion.div
                    key={faqItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    layout
                  >
                    <AccordionItem
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
                  </motion.div>
                ))}
              </AnimatePresence>
            </Accordion>
            
            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">לא נמצאו שאלות מתאימות</p>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-primary hover:underline mt-2 text-sm"
                >
                  נקה חיפוש
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </EditableSection>
  );
};

export default FAQSection;
