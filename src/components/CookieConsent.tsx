import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cookie, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const COOKIE_CONSENT_KEY = "spark-cookie-consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay so it doesn't appear instantly on first load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-16 md:bottom-0 left-0 right-0 z-[60] p-4 sm:p-6 md:bottom-6 md:left-6 md:right-auto md:max-w-md"
          role="dialog"
          aria-label="הסכמה לעוגיות"
          dir="rtl"
        >
          <div className="bg-card border border-border rounded-2xl p-5 shadow-elevated">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground text-sm">
                  אנחנו משתמשים בעוגיות 🍪
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  האתר שלנו משתמש בעוגיות כדי לשפר את חוויית השימוש שלך. 
                  לפרטים נוספים ניתן לקרוא את{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    מדיניות הפרטיות
                  </Link>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="hero"
                size="sm"
                onClick={handleAccept}
                className="flex-1 gap-1.5 h-9"
              >
                <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                אישור
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
                className="flex-1 h-9"
              >
                דחייה
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
