'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import '../app/carousel.css'


// Fetch gallery images from API
import { useCallback } from 'react'

// Module-level cache to avoid duplicate network requests (helps in dev Strict Mode)
let galleryCache = null

export default function Carousel() {
    const [slides, setSlides] = useState([])
    const [currentSlide, setCurrentSlide] = useState(0)

    // Fetch gallery images on mount
    useEffect(() => {
        let cancelled = false

        const setFromData = (data) => {
            if (cancelled) return

            // Normalize different payload shapes:
            // - items with `images` array (tours)
            // - items with `imageUrl` (gallery table rows)
            const normalized = []
            for (const item of (data || [])) {
                // prefer images array if present
                if (Array.isArray(item.images) && item.images.length > 0) {
                    normalized.push({
                        id: item.id ?? `${item.name || 'tour'}-${normalized.length}`,
                        src: item.images[0],
                        alt: `${item.name || 'Tour'}${item.from || item.to ? ` - ${item.from || ''} to ${item.to || ''}` : ''}`.trim()
                    })
                    continue
                }

                // fallback to single imageUrl (gallery rows)
                const url = item.imageUrl || item.image_url || item.src || item.url
                if (url) {
                    normalized.push({
                        id: item.id ?? `${url}-${normalized.length}`,
                        src: url,
                        alt: item.title || item.name || 'Gallery image'
                    })
                }
            }

            setSlides(normalized)
        }

        if (galleryCache) {
            // reuse existing promise/result
            galleryCache.then(setFromData).catch(() => { if (!cancelled) setSlides([]) })
            return () => { cancelled = true }
        }

        // store promise so other mounts reuse it
        galleryCache = fetch('/admin/api/gallery').then(res => res.json())
        galleryCache.then(setFromData).catch(() => { if (!cancelled) setSlides([]) })

        return () => { cancelled = true }
    }, [])

    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 3000)
        return () => clearInterval(timer)
    }, [currentSlide, slides.length])

    const goToSlide = useCallback((index) => {
        setCurrentSlide(index)
    }, [])

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, [slides.length])

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }, [slides.length])

    return (
        <div className="carousel-container">
            <div className="carousel-wrapper">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                    >
                        <Image
                            src={slide.src}
                            alt={slide.alt}
                            fill
                            className="object-cover object-center"
                            loading={index === 0 ? 'eager' : 'lazy'}
                            unoptimized
                        />
                    </div>
                ))}
            </div>

            {/* Manual Navigation Buttons */}
            {/* Navigation Controls (Arrows + Indicators) */}
            <div className="carousel-navigation">
                <button
                    className="carousel-control"
                    onClick={prevSlide}
                    aria-label="Previous Slide"
                >
                    <FaArrowLeft />
                </button>

                <div className="carousel-indicators">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                <button
                    className="carousel-control"
                    onClick={nextSlide}
                    aria-label="Next Slide"
                >
                    <FaArrowRight />
                </button>
            </div>
        </div>
    )
}
