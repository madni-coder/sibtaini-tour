'use client'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/Navbar'

export default function PackageDetails() {
    const params = useParams()
    const router = useRouter()
    const packageId = parseInt(params.id)

    // Function to calculate end date (15 days after start date)
    const calculateEndDate = (month, date, year) => {
        const monthMap = {
            'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
            'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
        }
        const startDate = new Date(year, monthMap[month], parseInt(date))
        const endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 15)

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        return {
            month: months[endDate.getMonth()],
            date: endDate.getDate(),
            year: endDate.getFullYear()
        }
    }

    // Package data with detailed facilities
    const packagesData = {
        1: {
            id: 1,
            title: 'Premium Hajj Package',
            month: 'June',
            date: '15',
            year: 2026,
            amount: 725000,
            route: 'Raipur to Mumbai',
            gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
            imageNumber: 1,
            facilities: [
                { icon: '🏨', title: '5-Star Hotel', description: 'Luxurious accommodation near Haram with premium amenities' },
                { icon: '✈️', title: 'Direct Flights', description: 'Comfortable economy class seats with baggage allowance' },
                { icon: '🚌', title: 'AC Transportation', description: 'Private AC buses for all transfers and Ziyarat' },
                { icon: '🍽️', title: 'Full Board Meals', description: 'Breakfast, lunch, and dinner with variety of cuisines' },
                { icon: '📋', title: 'Visa Processing', description: 'Complete visa assistance and documentation support' },
                { icon: '👨‍🏫', title: 'Expert Guides', description: 'Experienced multilingual guides throughout the journey' },
                { icon: '🏥', title: 'Medical Support', description: '24/7 medical assistance and emergency care' },
                { icon: '📱', title: 'SIM & WiFi', description: 'Local SIM card and WiFi connectivity included' },
            ]
        },
        2: {
            id: 2,
            title: 'Deluxe Umrah Package',
            month: 'January',
            date: '10',
            year: 2026,
            amount: 85000,
            route: 'Raipur to Mumbai',
            gradient: 'bg-gradient-to-br from-purple-600 to-violet-700',
            imageNumber: 2,
            facilities: [
                { icon: '🏨', title: '4-Star Hotel', description: 'Comfortable hotel near Haram, 5-10 minutes walking distance' },
                { icon: '✈️', title: 'Round Trip Flights', description: 'Economy class flights with convenient timings' },
                { icon: '🚌', title: 'Ground Transport', description: 'Shared AC transport for airport and Ziyarat tours' },
                { icon: '🍽️', title: 'Breakfast Included', description: 'Daily buffet breakfast at the hotel' },
                { icon: '📋', title: 'Visa Assistance', description: 'Complete visa application support and guidance' },
                { icon: '👨‍🏫', title: 'Group Guide', description: 'Knowledgeable guide for religious rituals and tours' },
                { icon: '💼', title: 'Travel Kit', description: 'Essential travel kit with Ihram and travel accessories' },
                { icon: '📞', title: '24/7 Support', description: 'Round-the-clock customer support helpline' },
            ]
        },
        3: {
            id: 3,
            title: 'Economy Umrah Package',
            month: 'March',
            date: '5',
            year: 2026,
            amount: 65000,
            route: 'Raipur to Mumbai',
            gradient: 'bg-gradient-to-br from-teal-600 to-cyan-600',
            imageNumber: 3,
            facilities: [
                { icon: '🏨', title: '3-Star Hotel', description: 'Clean and comfortable hotel with basic amenities' },
                { icon: '✈️', title: 'Economy Flights', description: 'Budget-friendly round trip flights' },
                { icon: '🚌', title: 'Shared Transport', description: 'Group transportation for all necessary transfers' },
                { icon: '🍽️', title: 'Breakfast', description: 'Daily continental breakfast' },
                { icon: '📋', title: 'Visa Support', description: 'Visa application documentation support' },
                { icon: '👥', title: 'Group Tour', description: 'Travel with a friendly group of pilgrims' },
                { icon: '📚', title: 'Guidebook', description: 'Comprehensive guidebook for Umrah rituals' },
                { icon: '🆘', title: 'Emergency Help', description: 'Emergency contact support during travel' },
            ]
        }
    }

    const packageInfo = packagesData[packageId]

    const endDate = packageInfo ? calculateEndDate(packageInfo.month, packageInfo.date, packageInfo.year) : null

    if (!packageInfo) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
                <Navbar />
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Package Not Found</h1>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    const imageSrc = `/cardPics/image${packageInfo.imageNumber}.jpg`

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/')}
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <span className="text-xl">←</span>
                    <span className="font-semibold">Back to Packages</span>
                </button>

                {/* Package Header */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Image Section */}
                        <div className="relative h-80 md:h-auto">
                            <Image
                                src={imageSrc}
                                alt={packageInfo.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-4 left-4 bg-gray-800/80 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                                {packageInfo.route}
                            </div>
                        </div>

                        {/* Package Info Section */}
                        <div className={`${packageInfo.gradient} p-8 text-white flex flex-col justify-center`}>
                            <h1 className="text-4xl font-bold mb-4">{packageInfo.title}</h1>

                            <div className="mb-6">
                                <p className="text-lg opacity-90 mb-2">Travel Dates</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">📅</span>
                                    <div>
                                        <p className="text-2xl font-semibold">{packageInfo.month} {packageInfo.date} - {endDate.month} {endDate.date}, {packageInfo.year}</p>
                                        <p className="text-sm opacity-80 mt-1">15 Days Package Duration</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                                <p className="text-sm opacity-90 mb-2">Package Price</p>
                                <p className="text-5xl font-bold">₹{packageInfo.amount.toLocaleString('en-IN')}</p>
                                <p className="text-sm opacity-90 mt-2">Per Person</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Facilities Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                        Package Facilities & Amenities
                    </h2>
                    <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
                        Everything you need for a comfortable and spiritually fulfilling journey
                    </p>

                    {/* Facilities Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {packageInfo.facilities.map((facility, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="text-4xl mb-3">{facility.icon}</div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{facility.title}</h3>
                                <p className="text-sm text-gray-600">{facility.description}</p>
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
                <div className={`${packageInfo.gradient} rounded-2xl shadow-xl p-8 text-white text-center`}>
                    <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Spiritual Journey?</h2>
                    <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                        Contact us now to book this package or get more information
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button className="bg-white text-gray-800 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            📞 Call Now: +91 XXXX-XXXXXX
                        </button>
                        <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            💬 WhatsApp Us
                        </button>
                        <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            ✉️ Email Inquiry
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
                        <p>📞 Contact: +91 XXXX-XXXXXX</p>
                        <p>📧 Email: info@sibtainitours.com</p>
                        <p>📍 Location: Raipur, Chhattisgarh</p>
                    </div>
                    <p className="text-gray-500 mt-4 text-xs">
                        © 2025 Sibtaini Tours & Travels. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
