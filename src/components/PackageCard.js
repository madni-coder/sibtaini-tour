export default function PackageCard({ package: pkg }) {
    // Alternate gradient colors for cards
    const gradients = [
        'bg-gradient-to-br from-emerald-500 to-teal-600', // Green/Teal
        'bg-gradient-to-br from-purple-600 to-violet-700', // Purple
        'bg-gradient-to-br from-teal-600 to-cyan-600', // Teal/Cyan
    ]
    const gradientClass = gradients[pkg.id % 3]

    return (
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border border-gray-100">
            {/* Card Header with Gradient */}
            <div className={`${gradientClass} p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>

                <h3 className="text-2xl font-bold mb-2 relative z-10">{pkg.title}</h3>
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="text-3xl">📅</span>
                        <div>
                            <p className="text-sm opacity-90">Travel Date</p>
                            <p className="text-lg font-semibold">{pkg.month} {pkg.date}, {pkg.year}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
                {/* Route Information */}
                <div className="mb-4 flex items-center gap-2 text-gray-600">
                    <span className="text-2xl">✈️</span>
                    <p className="text-sm font-medium">{pkg.route}</p>
                </div>

                {/* Price */}
                <div className="mb-6 bg-gradient-to-r from-gold/10 to-yellow-100 rounded-xl p-4 border-2 border-gold/30">
                    <p className="text-sm text-gray-600 mb-1">Package Price</p>
                    <p className="text-4xl font-bold text-islamic-green">
                        ₹{pkg.amount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Per Person</p>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Package Includes:</p>
                    {pkg.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                            <span className="text-emerald-600 mt-1">✓</span>
                            <p className="text-sm text-gray-600">{feature}</p>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <button className={`w-full ${gradientClass} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105`}>
                    Book Now
                </button>
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
