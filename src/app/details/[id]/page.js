import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'

// Fetch tour data from API
async function getTour(id) {
    try {
        // Get the host from request headers to support both localhost and network access
        const headersList = headers()
        const host = headersList.get('host') || 'localhost:3000'
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
        const baseUrl = `${protocol}://${host}`

        console.log('Fetching tour details from:', `${baseUrl}/admin/api/tour?id=${id}`)

        const res = await fetch(`${baseUrl}/admin/api/tour?id=${id}`, {
            cache: 'no-store'
        })

        if (!res.ok) {
            console.error('API Response not OK:', res.status)
            return null
        }

        const tour = await res.json()
        console.log('Successfully fetched tour:', tour.name)

        return tour
    } catch (error) {
        console.error('Error fetching tour:', error)
        return null
    }
}

// Format date helper
function formatDate(dateString) {
    const date = new Date(dateString)
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return {
        month: months[date.getMonth()],
        date: date.getDate(),
        year: date.getFullYear()
    }
}

// Calculate days between dates
function calculateDaysBetween(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
}

// Generate facilities from tour data
function getFacilities(tour) {
    const facilities = []

    if (tour.hotelAccommodation) {
        facilities.push({ icon: '🏨', title: 'Hotel', description: tour.hotelAccommodation })
    }
    if (tour.roundTripFlights) {
        facilities.push({ icon: '✈️', title: 'Round Trip Flights', description: tour.roundTripFlights })
    }
    if (tour.transportation) {
        facilities.push({ icon: '🚌', title: 'Transport', description: tour.transportation })
    }
    if (tour.meals) {
        facilities.push({ icon: '🍽️', title: 'Meals', description: tour.meals })
    }
    if (tour.visaAssistance) {
        facilities.push({ icon: '📋', title: 'Visa Assistance', description: tour.visaAssistance })
    }
    if (tour.expertGuides) {
        facilities.push({ icon: '👨‍🏫', title: 'Expert Guides', description: tour.expertGuides })
    }

    // If no facilities are provided, return default ones
    if (facilities.length === 0) {
        return [
            { icon: '🏨', title: 'Hotel', description: 'Comfortable stay near the holy sites' },
            { icon: '✈️', title: 'Round Trip Flights', description: 'Air travel arrangements included' },
            { icon: '🚌', title: 'Transportation', description: 'Ground transport for all transfers' },
            { icon: '🍽️', title: 'Meals', description: 'Daily meals during the journey' },
            { icon: '📋', title: 'Visa Assistance', description: 'Complete visa application support' },
            { icon: '👨‍🏫', title: 'Expert Guides', description: 'Knowledgeable guides throughout the journey' },
        ]
    }

    return facilities
}

export default async function PackageDetails({ params }) {
    const { id: tourId } = await params
    const tour = await getTour(tourId)

    if (!tour) {
        notFound()
    }

    const startDate = formatDate(tour.startDate)
    const endDate = formatDate(tour.endDate)
    const duration = calculateDaysBetween(tour.startDate, tour.endDate)
    const imageSrc = tour.images && tour.images.length > 0 ? tour.images[0] : '/cardPics/image1.jpg'
    const gradient = 'bg-gradient-to-br from-emerald-500 to-teal-600'
    const facilities = getFacilities(tour)

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <span className="text-xl">←</span>
                    <span className="font-semibold">Back to Packages</span>
                </Link>

                {/* Package Header */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Image Section */}
                        <div className="relative h-80 md:h-auto">
                            <Image
                                src={imageSrc}
                                alt={tour.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-4 left-4 bg-gray-800/80 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                                {tour.from} to {tour.to}
                            </div>
                        </div>

                        {/* Package Info Section */}
                        <div className={`${gradient} p-8 text-white flex flex-col justify-center`}>
                            <h1 className="text-4xl font-bold mb-4">{tour.name}</h1>

                            <div className="mb-6">
                                <p className="text-lg opacity-90 mb-2">Travel Dates</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">📅</span>
                                    <div>
                                        <p className="text-2xl font-semibold">
                                            {startDate.month} {startDate.date} - {endDate.month} {endDate.date}, {startDate.year}
                                        </p>
                                        <p className="text-sm opacity-80 mt-1">{duration} Days Package Duration</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                                <p className="text-sm opacity-90 mb-2">Package Price</p>
                                <p className="text-5xl font-bold">₹{tour.price.toLocaleString('en-IN')}</p>
                                <p className="text-sm opacity-90 mt-2">Per Person</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                {tour.description && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">About This Package</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{tour.description}</p>
                    </div>
                )}

                {/* Facilities Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                        Package Facilities & Amenities
                    </h2>
                    <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
                        Everything you need for a comfortable and spiritually fulfilling journey
                    </p>
                    {/* Facilities Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {facilities.map((facility, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="text-3xl md:text-4xl mb-2 md:mb-3">{facility.icon}</div>
                                <h3 className="text-sm md:text-lg font-bold text-gray-800 mb-1 md:mb-2 break-words">{facility.title}</h3>
                                <p className="text-xs md:text-sm text-gray-600 break-words">{facility.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Important Information */}
                <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-bold text-amber-900 mb-3">📌 Important Information</h3>
                    <ul className="space-y-2 text-amber-800 text-sm">
                        <li>• Valid passport with at least 6 months validity required</li>
                        <li>• Prices are subject to change based on airline and hotel availability</li>
                        <li>• Travel insurance is recommended but not included</li>
                        <li>• Full payment required 30 days before departure</li>
                        <li>• Cancellation charges apply as per our policy</li>
                    </ul>
                </div>

                {/* Book Now Section */}
                <div className={`${gradient} rounded-2xl shadow-xl p-8 text-white text-center`}>
                    <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Spiritual Journey?</h2>
                    <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                        Contact us now to book this package or get more information
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button className="bg-white text-gray-800 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            📞 +91 93028 87855
                        </button>
                        <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            💬 WhatsApp Us
                        </button>
                        
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold mb-2">Sibtaini Tours & Travels</h3>
                    <p className="text-gray-300 mb-4">Making your spiritual journey memorable</p>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-gray-400">
                        <p>📞 Contact: +91 93028 87855</p>
                        <p>📍 Location: Raipur, Chhattisgarh</p>
                    </div>
                   
                </div>
            </footer>
        </div>
    )
}
