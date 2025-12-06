'use client'

import PackageCard from '../components/PackageCard'
import Carousel from '../components/Carousel'
import Navbar from '../components/Navbar'
import { useTourContext } from '../context/tourContext'

export default function Home() {
    const { tours: packages, loading, error } = useTourContext()


    return (
        <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
            {/* Navbar */}
            <Navbar />


            {/* Carousel Section */}
            <div className="container mx-auto px-4 py-8">
                <Carousel />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 ">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Our Premium Packages
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Choose from our carefully curated Hajj and Umrah packages designed for comfort, convenience, and spiritual fulfillment
                    </p>
                </div>

                {/* Package Cards Grid */}
                {loading ? (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-2">Loading Packages...</h3>
                        <p className="text-gray-500">Please wait while we fetch the latest tour packages.</p>
                    </div>
                ) : packages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {packages.map((pkg) => (
                            <PackageCard key={pkg.id} package={pkg} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Packages Available</h3>
                        <p className="text-gray-500">Tour packages will appear here once they are created.</p>
                    </div>
                )}
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
        </main>
    )
}
