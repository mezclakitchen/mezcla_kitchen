import { useState, useEffect } from "react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Swipe left (next)
    if (diff > 40) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    } 
    // Swipe right (prev)
    else if (diff < -40) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
    setTouchStart(null);
  };

  const goNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="relative size-full overflow-hidden group"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {images.map((img, idx) => (
        <img
          key={img}
          src={img}
          alt={`${alt} - view ${idx + 1}`}
          loading={idx === 0 ? "lazy" : "lazy"} // can optimise first load if needed
          width={1024}
          height={1280}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}

      {/* Pagination dots (Zepto style) */}
      {images.length > 1 && (
        <>
          {/* Tap zones for desktop/mobile click navigation */}
          <div className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer" onClick={goPrev} />
          <div className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer" onClick={goNext} />

          <div className="absolute bottom-10 inset-x-0 z-30 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-3 bg-gold" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
