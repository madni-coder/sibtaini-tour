import PackageCard from '../components/PackageCard'
import Carousel from '../components/Carousel'
import Navbar from '../components/Navbar'
import { headers } from 'next/headers'

async function getTours() {
    try {
        // Get the host from request headers to support both localhost and network access
        const headersList = headers()
        const host = headersList.get('host') || 'localhost:3000'
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
        const baseUrl = `${protocol}://${host}`

        const res = await fetch(`${baseUrl}/admin/api/tour`, {
            cache: 'no-store' // Ensures fresh data on each request
        })

        if (!res.ok) {
            throw new Error('Failed to fetch tours')
        }

        return await res.json()
    } catch (error) {
        console.error('Error fetching tours:', error)
        return []
    }
}

export default async function Home() {
    const packages = await getTours()

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
                {packages.length > 0 ? (
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
