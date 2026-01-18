import { Link } from "react-router-dom";
import { Heart, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6" dir="rtl">
      <div className="text-center">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <Heart className="w-12 h-12 text-primary-foreground fill-current" />
          <span className="font-display text-4xl font-bold text-primary-foreground">Spark</span>
        </Link>

        {/* 404 */}
        <div className="bg-card rounded-3xl p-12 shadow-elevated max-w-md mx-auto">
          <h1 className="font-display text-8xl font-bold text-primary mb-4">404</h1>
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">
            הדף לא נמצא
          </h2>
          <p className="text-muted-foreground mb-8">
            נראה שהלכתם לאיבוד... אבל אל דאגה, אנחנו כאן לעזור לכם למצוא את הדרך חזרה!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="hero" size="lg" className="w-full sm:w-auto">
                <Home className="w-5 h-5" />
                חזרה לבית
              </Button>
            </Link>
            <Link to="/members">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Search className="w-5 h-5" />
                גלו פרופילים
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
