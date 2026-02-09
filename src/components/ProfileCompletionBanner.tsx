import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";

const DISMISS_KEY = "profile_banner_dismissed";

export default function ProfileCompletionBanner() {
  const { profile, loading } = useCurrentProfile();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(DISMISS_KEY);
    setDismissed(stored === "true");
  }, []);

  if (loading || dismissed || !profile) return null;

  // Calculate completeness
  const checks = [
    !!profile.name,
    !!profile.avatar_url,
    !!profile.bio && profile.bio.length > 20,
    !!profile.interests && profile.interests.length >= 3,
    !!profile.education,
    !!profile.height,
    !!profile.relationship_goal,
  ];
  const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  if (pct >= 80) return null;

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, "true");
  };

  const missingItems = [];
  if (!profile.avatar_url) missingItems.push("תמונה");
  if (!profile.bio || profile.bio.length <= 20) missingItems.push("תיאור");
  if (!profile.interests || profile.interests.length < 3) missingItems.push("תחומי עניין");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mx-4 mb-4 relative"
      >
        <div className="gradient-primary rounded-2xl p-4 text-primary-foreground shadow-lg">
          <button
            onClick={dismiss}
            className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="סגור"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">
                השלם את הפרופיל ({pct}%) וקבל עד 3x יותר התאמות! 🚀
              </p>
              <p className="text-xs opacity-90 mt-1">
                חסר: {missingItems.slice(0, 3).join(", ")}
              </p>
              <Link to="/profile">
                <Button
                  size="sm"
                  className="mt-2 bg-white/20 hover:bg-white/30 text-primary-foreground border-0 gap-1 text-xs h-8"
                >
                  השלם עכשיו
                  <ArrowLeft className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
