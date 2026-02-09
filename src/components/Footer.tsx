import { Link } from "react-router-dom";
import { Heart, Facebook, Instagram, Twitter, Mail, Phone, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLandingContent } from "@/contexts/LandingContentContext";

const Footer = () => {
  const { content } = useLandingContent();
  const { footer, nav } = content;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground relative overflow-hidden" role="contentinfo">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-[80px]" />
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <h3 className="font-display text-xl font-bold text-primary-foreground mb-2 flex items-center gap-2 justify-center md:justify-start">
                <Sparkles className="w-5 h-5 text-primary" />
                הישארו מעודכנים
              </h3>
              <p className="text-primary-foreground/60 text-sm">
                טיפים לזוגיות, עדכונים חדשים והצעות מיוחדות
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/register">
                <Button variant="hero" className="gap-2">
                  <Heart className="w-4 h-4" />
                  הצטרפו עכשיו
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand - takes 2 columns */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-8 h-8 text-primary fill-current" aria-hidden="true" />
              <span className="font-display text-2xl font-bold text-primary-foreground">{nav.brandName}</span>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-6 max-w-sm">
              {footer.brandDescription}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary rounded-full flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="עקבו אחרינו בפייסבוק"
              >
                <Facebook className="w-5 h-5 text-primary-foreground/70 group-hover:text-primary-foreground" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary rounded-full flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="עקבו אחרינו באינסטגרם"
              >
                <Instagram className="w-5 h-5 text-primary-foreground/70 group-hover:text-primary-foreground" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary rounded-full flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="עקבו אחרינו בטוויטר"
              >
                <Twitter className="w-5 h-5 text-primary-foreground/70 group-hover:text-primary-foreground" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="קישורים מהירים">
            <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">{footer.quickLinksTitle}</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link to="/members" className="text-primary-foreground/60 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {footer.quickLink1}
                </Link>
              </li>
              <li>
                <Link to="/discover" className="text-primary-foreground/60 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {footer.quickLink2}
                </Link>
              </li>
              <li>
                <Link to="/messages" className="text-primary-foreground/60 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {footer.quickLink3}
                </Link>
              </li>
              <li>
                <Link to="/matches" className="text-primary-foreground/60 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  התאמות שלי
                </Link>
              </li>
            </ul>
          </nav>

          {/* Account */}
          <nav aria-label="חשבון">
            <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">{footer.accountTitle}</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link to="/login" className="text-primary-foreground/60 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {footer.accountLink1}
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-primary-foreground/60 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {footer.accountLink2}
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-primary-foreground/60 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {footer.accountLink3}
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-primary-foreground/60 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  הגדרות
                </Link>
              </li>
            </ul>
          </nav>

          {/* Support & Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">{footer.supportTitle}</h4>
            <ul className="flex flex-col gap-3 mb-6">
              <li>
                <a href="#faq" className="text-primary-foreground/60 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {footer.supportLink1}
                </a>
              </li>
              <li>
                <Link to="/support" className="text-primary-foreground/60 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {footer.supportLink2}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-primary-foreground/60 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {footer.supportLink3}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-primary-foreground/60 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {footer.supportLink4}
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-primary-foreground/60 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  מרכז בטיחות
                </Link>
              </li>
            </ul>

            {/* Contact Info */}
            <div className="space-y-2">
              <a 
                href="mailto:support@spark.co.il" 
                className="text-primary-foreground/60 hover:text-primary transition-colors text-xs flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                support@spark.co.il
              </a>
              <p className="text-primary-foreground/40 text-xs flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                תל אביב, ישראל
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 text-sm">
            {footer.copyright.replace("{year}", currentYear.toString())}
          </p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="text-primary-foreground/40 hover:text-primary-foreground/70 text-xs transition-colors">
              תנאי שימוש
            </Link>
            <Link to="/privacy" className="text-primary-foreground/40 hover:text-primary-foreground/70 text-xs transition-colors">
              מדיניות פרטיות
            </Link>
            <span className="text-primary-foreground/40 text-xs flex items-center gap-1">
              {footer.madeWith}
              <Heart className="w-3 h-3 text-primary fill-current" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
