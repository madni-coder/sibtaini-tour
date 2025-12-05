import Link from 'next/link'
import Image from 'next/image'

export default function PackageCard({ package: pkg }) {
    // Format dates from API (expecting ISO format or date strings)
    const formatDate = (dateString) => {
        if (!dateString) return { month: '', date: '', year: '' }
        const date = new Date(dateString)
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        return {
            month: months[date.getMonth()],
            date: date.getDate(),
            year: date.getFullYear()
        }
    }

    // Calculate days between start and end dates
    const calculateDays = (startDate, endDate) => {
        if (!startDate || !endDate) return 15
        const start = new Date(startDate)
        const end = new Date(endDate)
        const diffTime = Math.abs(end - start)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays || 15
    }

    const startDate = formatDate(pkg.startDate)
    const endDate = formatDate(pkg.endDate)
    const daysPackage = calculateDays(pkg.startDate, pkg.endDate)

    // Alternate gradient colors for cards
    const gradients = [
        'bg-gradient-to-br from-emerald-500 to-teal-600', // Green/Teal
        'bg-gradient-to-br from-purple-600 to-violet-700', // Purple
        'bg-gradient-to-br from-teal-600 to-cyan-600', // Teal/Cyan
    ]
    const gradientClass = gradients[pkg.id % 3]

    // Use first image from API or fallback
    const imageSrc = (pkg.images && pkg.images[0])
    console.log('hello ', imageSrc)
    // Build route string from 'from' and 'to' fields
    const route = pkg.from && pkg.to ? `${pkg.from} to ${pkg.to}` : (pkg.route || 'Tour Package')

    // Title from API 'name' field
    const title = pkg.name || pkg.title || 'Tour Package'

    // Price from API
    const price = typeof pkg.price === 'string' ? parseFloat(pkg.price) : (pkg.price || pkg.amount || 0)

    return (
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border border-gray-100">
            {/* Image Section */}
            <div className="relative w-full h-56 overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Location Badge Overlay */}
                <div className="absolute top-4 left-4 bg-gray-800/80 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                    {route}
                </div>
            </div>

            {/* Card Header with Gradient - Below Image */}
            <div className={`${gradientClass} p-6 text-white relative overflow-hidden`}>
                <h3 className="text-2xl font-bold mb-3 relative z-10">{title}</h3>
                <div className="relative z-10">
                    <p className="text-sm opacity-90 mb-1">Travel Dates</p>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">📅</span>
                        <div>
                            <p className="text-lg font-semibold">{startDate.month} {startDate.date} - {endDate.month} {endDate.date}, {startDate.year}</p>
                            <p className="text-xs opacity-80 mt-1">{daysPackage} Days Package</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
                {/* Price */}
                <div className="mb-6 bg-gradient-to-r from-gold/10 to-yellow-100 rounded-xl p-4 border-2 border-gold/30">
                    <p className="text-sm text-gray-600 mb-1">Package Price</p>
                    <p className="text-4xl font-bold text-islamic-green">
                        ₹{price.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Per Person</p>
                </div>

                {/* CTA Button */}
                <Link href={`/details/${pkg.id}`}>
                    <button className={`w-full ${gradientClass} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105`}>
                        See Details
                    </button>
                </Link>
            </div>

            {/* Decorative Badge */}
            {pkg.id % 2 === 0 && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    ⭐ POPULAR
                </div>
            )}
        </div>
    )
}
