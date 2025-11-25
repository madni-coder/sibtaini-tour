'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <Link href="/" className="text-white text-xl font-bold hover:text-emerald-100 transition">
                        Sibtaini Tours & Travels
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-1">
                        <Link href="/" className="text-white hover:bg-amber-800 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300">
                            Home
                        </Link>
                        <Link href="/gallery" className="text-white hover:bg-amber-800 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300">
                            Gallery
                        </Link>
                        <Link href="/umrah" className="text-white hover:bg-amber-800 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300">
                            Umrah
                        </Link>
                        <Link href="/ramdan" className="text-white hover:bg-amber-800 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300">
                            Ramdan
                        </Link>
                        <Link href="/ziyarat" className="text-white hover:bg-amber-800 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300">
                            Ziyarat
                        </Link>
                        <Link href="/contact" className="text-white hover:bg-amber-800 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300">
                            Contact Us
                        </Link>
                        <Link href="/about" className="text-white hover:bg-amber-800 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300">
                            About Us
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-white hover:text-emerald-100 focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="pb-4 space-y-1 animate-slideDown">
                        <Link
                            href="/"
                            className="block text-white hover:bg-amber-1000 active:bg-amber-1000 px-4 py-2 rounded-md text-base font-medium transition-all duration-300 transform hover:translate-x-2"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/gallery"
                            className="block text-white hover:bg-amber-800 active:bg-amber-800 px-4 py-2 rounded-md text-base font-medium transition-all duration-300 transform hover:translate-x-2"
                            onClick={() => setIsOpen(false)}
                        >
                            Gallery
                        </Link>
                        <Link
                            href="/umrah"
                            className="block text-white hover:bg-amber-800 active:bg-amber-800 px-4 py-2 rounded-md text-base font-medium transition-all duration-300 transform hover:translate-x-2"
                            onClick={() => setIsOpen(false)}
                        >
                            Umrah
                        </Link>
                        <Link
                            href="/ramdan"
                            className="block text-white hover:bg-amber-800 active:bg-amber-800 px-4 py-2 rounded-md text-base font-medium transition-all duration-300 transform hover:translate-x-2"
                            onClick={() => setIsOpen(false)}
                        >
                            Ramdan
                        </Link>
                        <Link
                            href="/ziyarat"
                            className="block text-white hover:bg-amber-800 active:bg-amber-800 px-4 py-2 rounded-md text-base font-medium transition-all duration-300 transform hover:translate-x-2"
                            onClick={() => setIsOpen(false)}
                        >
                            Ziyarat
                        </Link>
                        <Link
                            href="/contact"
                            className="block text-white hover:bg-amber-800 active:bg-amber-800 px-4 py-2 rounded-md text-base font-medium transition-all duration-300 transform hover:translate-x-2"
                            onClick={() => setIsOpen(false)}
                        >
                            Contact Us
                        </Link>
                        <Link
                            href="/about"
                            className="block text-white hover:bg-amber-800 active:bg-amber-800 px-4 py-2 rounded-md text-base font-medium transition-all duration-300 transform hover:translate-x-2"
                            onClick={() => setIsOpen(false)}
                        >
                            About Us
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
