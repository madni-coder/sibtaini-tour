import Link from 'next/link'

export default function PackageCard({ package: pkg }) {
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

    const endDate = calculateEndDate(pkg.month, pkg.date, pkg.year)

    // Alternate gradient colors for cards
    const gradients = [
        'bg-gradient-to-br from-emerald-500 to-teal-600', // Green/Teal
        'bg-gradient-to-br from-purple-600 to-violet-700', // Purple
        'bg-gradient-to-br from-teal-600 to-cyan-600', // Teal/Cyan
    ]
    const gradientClass = gradients[pkg.id % 3]

    // Cycle through available images
    const imageNumber = (pkg.id % 3) + 1
    const imageSrc = `/cardPics/image${imageNumber}.jpg`

    return (
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border border-gray-100">
            {/* Image Section */}
            <div className="relative w-full h-56 overflow-hidden">
                <img
                    src={imageSrc}
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Location Badge Overlay */}
                <div className="absolute top-4 left-4 bg-gray-800/80 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                    {pkg.route}
                </div>
            </div>

            {/* Card Header with Gradient - Below Image */}
            <div className={`${gradientClass} p-6 text-white relative overflow-hidden`}>
                <h3 className="text-2xl font-bold mb-3 relative z-10">{pkg.title}</h3>
                <div className="relative z-10">
                    <p className="text-sm opacity-90 mb-1">Travel Dates</p>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">📅</span>
                        <div>
                            <p className="text-lg font-semibold">{pkg.month} {pkg.date} - {endDate.month} {endDate.date}, {pkg.year}</p>
                            <p className="text-xs opacity-80 mt-1">15 Days Package</p>
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
                        ₹{pkg.amount.toLocaleString('en-IN')}
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
