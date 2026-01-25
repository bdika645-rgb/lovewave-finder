import { Eye, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useImpersonation } from '@/contexts/ImpersonationContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImpersonationBanner() {
  const { isImpersonating, impersonatedProfile, stopImpersonation } = useImpersonation();

  return (
    <AnimatePresence>
      {isImpersonating && impersonatedProfile && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-accent to-primary text-primary-foreground shadow-lg"
          role="alert"
          aria-live="polite"
        >
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between gap-4">
              {/* Left side - info */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                  <Eye className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm font-medium">מצב צפייה פעיל</span>
                </div>
                
                <div className="hidden sm:flex items-center gap-2">
                  <Avatar className="w-7 h-7 border-2 border-white/50">
                    <AvatarImage src={impersonatedProfile.avatar_url || undefined} />
                    <AvatarFallback className="bg-white/20 text-white text-xs">
                      {impersonatedProfile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{impersonatedProfile.name}</span>
                </div>
              </div>

              {/* Right side - actions */}
              <div className="flex items-center gap-2">
                {/* Mobile: Show name */}
                <div className="flex sm:hidden items-center gap-2 mr-2">
                  <Avatar className="w-6 h-6 border border-white/50">
                    <AvatarImage src={impersonatedProfile.avatar_url || undefined} />
                    <AvatarFallback className="bg-white/20 text-white text-[10px]">
                      {impersonatedProfile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium max-w-[100px] truncate">
                    {impersonatedProfile.name}
                  </span>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={stopImpersonation}
                  className="bg-background text-primary hover:bg-background/90 gap-1.5 font-medium"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden xs:inline">יציאה ממצב צפייה</span>
                  <span className="xs:hidden">יציאה</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Subtle pulsing indicator */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
