import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';

const ImageCarousel = ({ images, title, subtitle, autoPlayInterval = 4000 }) => {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const goTo = useCallback((index) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrent(index);
        setTimeout(() => setIsAnimating(false), 500);
    }, [isAnimating]);

    const prev = () => goTo((current - 1 + images.length) % images.length);
    const next = useCallback(() => goTo((current + 1) % images.length), [current, images.length, goTo]);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(next, autoPlayInterval);
        return () => clearInterval(timer);
    }, [next, autoPlayInterval]);

    return (
        <section className="">
            {/* Header */}
            {(title || subtitle) && (
                <div className="text-center mb-12">
                    {title && (
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-[#2D3142] font-['Outfit']">
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p className="text-text-muted text-lg mt-4 max-w-2xl !mx-auto">
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

            {/* Carousel Container */}
            <div className="relative group">
                {/* Main Image */}
                <div className="overflow-hidden rounded-[32px] shadow-[0_30px_60px_-15px_rgba(53,88,114,0.2)] aspect-video w-full">
                    <img
                        key={current}
                        src={images[current].src}
                        alt={images[current].alt}
                        className="w-full h-full object-cover transition-all duration-500"
                        style={{ animation: 'fadeIn 0.5s ease' }}
                    />
                </div>

                {/* Arrow Buttons */}
                <button
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white z-10"
                >
                    <Icon icon="solar:arrow-left-linear" className="text-[#2D3142]" width="24" height="24" />
                </button>
                <button
                    onClick={next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white z-10"
                >
                    <Icon icon="solar:arrow-right-linear" className="text-[#2D3142]" width="24" height="24" />
                </button>
            </div>

            {/* Caption */}
            {images[current].caption && (
                <p className="text-center text-text-muted mt-4 text-base italic">
                    {images[current].caption}
                </p>
            )}

            {/* Dot Indicators */}
            <div className="flex justify-center gap-3 mt-5">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`transition-all duration-300 rounded-full ${i === current
                            ? 'w-8 h-3 bg-primary'
                            : 'w-3 h-3 bg-primary/20 hover:bg-primary/40'
                            }`}
                    />
                ))}
            </div>

            {/* Thumbnail Strip */}
            <div className="hidden md:flex gap-3 mt-6 pt-6 overflow-x-auto overflow-y-hidden py-3 justify-center">
                {images.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`flex-shrink-0 w-28 h-16 rounded-xl overflow-hidden transition-all duration-300 ${i === current
                            ? 'ring-2 ring-primary ring-offset-2 scale-105'
                            : 'opacity-50 hover:opacity-80'
                            }`}
                    >
                        <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(1.02); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </section>
    );
};

export default ImageCarousel;
