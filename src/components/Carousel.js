'use client'

import { useState, useEffect } from 'react'
import '../app/carousel.css'

export default function Carousel() {
    const [currentSlide, setCurrentSlide] = useState(0)

    const slides = [
        { id: 1, src: '/pic1.jpg', alt: 'Hajj and Umrah Journey 1' },
        { id: 2, src: '/pic2.jpg', alt: 'Hajj and Umrah Journey 2' },
        { id: 3, src: '/pic3.jpg', alt: 'Hajj and Umrah Journey 3' }
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 3000) // Change slide every 3 seconds

        return () => clearInterval(timer)
    }, [slides.length])

    const goToSlide = (index) => {
        setCurrentSlide(index)
    }

    return (
        <div className="carousel-container">
            <div className="carousel-wrapper">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                    >
                        <img
                            src={slide.src}
                            alt={slide.alt}
                            loading={index === 0 ? 'eager' : 'lazy'}
                        />
                    </div>
                ))}
            </div>

            {/* Indicators */}
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
        </div>
    )
}
