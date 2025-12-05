'use client'

import { useEffect, useState, useRef } from 'react'
import Navbar from '../../components/Navbar'
import { FaPlay, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export default function JourneyPage() {
    const [journeyItems, setJourneyItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedMedia, setSelectedMedia] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const hasFetchedRef = useRef(false)

    useEffect(() => {
        // Prevent duplicate API calls in React Strict Mode
        if (hasFetchedRef.current) return
        hasFetchedRef.current = true

        fetchJourneyItems()
    }, [])

    const fetchJourneyItems = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
            const res = await fetch(`${baseUrl}/api/journey`, {
                cache: 'no-store'
            })

            if (!res.ok) {
                throw new Error('Failed to fetch journey items')
            }

            const data = await res.json()
            setJourneyItems(data)
        } catch (error) {
            console.error('Error fetching journey items:', error)
        } finally {
            setLoading(false)
        }
    }

    const openLightbox = (item, index) => {
        setSelectedMedia(item)
        setCurrentIndex(index)
    }

    const closeLightbox = () => {
        setSelectedMedia(null)
    }

    const navigateMedia = (direction) => {
        const newIndex = direction === 'next'
            ? (currentIndex + 1) % journeyItems.length
            : (currentIndex - 1 + journeyItems.length) % journeyItems.length

        setCurrentIndex(newIndex)
        setSelectedMedia(journeyItems[newIndex])
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Navbar />

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-3xl"></div>
                <div className="relative container mx-auto px-4 py-20 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
                        Our Journey
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mt-2">
                            Captured Moments
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Experience the beauty and spirituality of our travels through these cherished memories
                    </p>
                </div>
            </div>

            {/* Gallery Section */}
            <div className="container mx-auto px-4 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
                        </div>
                        <p className="text-gray-400 text-lg">Loading memories...</p>
                    </div>
                ) : journeyItems.length > 0 ? (
                    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                        {journeyItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/50 p-1 bg-gradient-to-br from-emerald-500 via-white to-emerald-400 hover:from-emerald-400 hover:via-white hover:to-emerald-300"
                                onClick={() => openLightbox(item, index)}
                            >
                                <div className="relative rounded-xl overflow-hidden bg-black">
                                    {item.mediaType === 'image' ? (
                                        <img
                                            src={item.mediaUrl}
                                            alt={item.fileName}
                                            className="w-full h-auto object-cover rounded-xl"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="relative rounded-xl overflow-hidden">
                                            <video
                                                src={item.mediaUrl}
                                                className="w-full h-auto object-cover rounded-xl"
                                                muted
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-all duration-300">
                                                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                                    <FaPlay className="text-purple-600 text-2xl ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <p className="text-white text-sm font-medium truncate">
                                                {item.fileName}
                                            </p>
                                            <p className="text-gray-300 text-xs mt-1">
                                                {new Date(item.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-8xl mb-6 opacity-50">📸</div>
                        <h3 className="text-3xl font-bold text-white mb-3">No Memories Yet</h3>
                        <p className="text-gray-400 text-lg">Journey moments will appear here once they are uploaded.</p>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedMedia && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in">
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-300 group"
                    >
                        <FaTimes className="text-white text-xl group-hover:rotate-90 transition-transform duration-300" />
                    </button>

                    {/* Navigation Buttons */}
                    {journeyItems.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    navigateMedia('prev')
                                }}
                                className="absolute left-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-300 group"
                            >
                                <FaChevronLeft className="text-white text-xl group-hover:-translate-x-1 transition-transform duration-300" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    navigateMedia('next')
                                }}
                                className="absolute right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-300 group"
                            >
                                <FaChevronRight className="text-white text-xl group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </>
                    )}

                    {/* Media Content */}
                    <div className="max-w-7xl max-h-[90vh] w-full mx-4 flex items-center justify-center">
                        {selectedMedia.mediaType === 'image' ? (
                            <div className="p-2 bg-gradient-to-br from-emerald-500 via-white to-emerald-400 rounded-2xl shadow-2xl shadow-emerald-500/50">
                                <img
                                    src={selectedMedia.mediaUrl}
                                    alt={selectedMedia.fileName}
                                    className="max-w-full max-h-[85vh] object-contain rounded-xl"
                                />
                            </div>
                        ) : (
                            <div className="p-2 bg-gradient-to-br from-emerald-500 via-white to-emerald-400 rounded-2xl shadow-2xl shadow-emerald-500/50">
                                <video
                                    src={selectedMedia.mediaUrl}
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-[85vh] object-contain rounded-xl"
                                />
                            </div>
                        )}
                    </div>

                    {/* Media Info */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3">
                        <p className="text-white text-sm font-medium">
                            {currentIndex + 1} / {journeyItems.length}
                        </p>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-black/40 backdrop-blur-md text-white py-8 mt-16 border-t border-white/10">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Sibtaini Tours & Travels
                    </h3>
                    <p className="text-gray-300 mb-4">Making your spiritual journey memorable</p>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-gray-400">
                        <p>📞 Contact: +91 93028 87855</p>
                        <p>📍 Location: Raipur, Chhattisgarh</p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
            `}</style>
        </main>
    )
}
