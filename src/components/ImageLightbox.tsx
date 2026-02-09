import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
  alt?: string;
}

const ImageLightbox = ({ images, initialIndex = 0, open, onClose, alt = "תמונה" }: ImageLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (open) setCurrentIndex(initialIndex);
  }, [open, initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrentIndex(i => Math.min(images.length - 1, i + 1));
      if (e.key === "ArrowRight") setCurrentIndex(i => Math.max(0, i - 1));
      if (e.key === "+" || e.key === "=") setZoomed(true);
      if (e.key === "-") setZoomed(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, images.length, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  const goNext = useCallback(() => {
    setCurrentIndex(i => Math.min(images.length - 1, i + 1));
    setZoomed(false);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(i => Math.max(0, i - 1));
    setZoomed(false);
  }, []);

  if (!images.length) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          role="dialog"
          aria-modal="true"
          aria-label="תצוגת תמונה מוגדלת"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="סגור"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Zoom toggle */}
          <button
            onClick={() => setZoomed(!zoomed)}
            className="absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label={zoomed ? "הקטן" : "הגדל"}
          >
            {zoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white/80 text-sm font-medium bg-black/40 px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Navigation arrows */}
          {images.length > 1 && currentIndex > 0 && (
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              aria-label="תמונה קודמת"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
          {images.length > 1 && currentIndex < images.length - 1 && (
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              aria-label="תמונה הבאה"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Image */}
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${alt} ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "max-h-[85vh] max-w-[90vw] object-contain rounded-lg transition-transform duration-300 select-none",
              zoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
            )}
            onClick={() => setZoomed(!zoomed)}
            draggable={false}
          />

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentIndex(i); setZoomed(false); }}
                  className={cn(
                    "w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                    i === currentIndex ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                  aria-label={`תמונה ${i + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageLightbox;
