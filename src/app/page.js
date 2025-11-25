import PackageCard from '../components/PackageCard'
import Carousel from '../components/Carousel'
import Navbar from '../components/Navbar'

export default function Home() {
    const packages = [
        {
            id: 1,
            title: 'Premium Hajj Package',
            month: 'June',
            date: '15',
            year: 2026,
            amount: 725000,
            route: 'Raipur to Mumbai',
            features: [
                '5-Star Hotel Accommodation',
                'Direct Flights',
                'Guided Tours',
                'Meals Included',
                'Visa Processing'
            ]
        },
        {
            id: 2,
            title: 'Deluxe Umrah Package',
            month: 'January',
            date: '10',
            year: 2026,
            amount: 85000,
            route: 'Raipur to Mumbai',
            features: [
                '4-Star Hotel Near Haram',
                'Round Trip Flights',
                'Transportation',
                'Breakfast Included',
                'Visa Assistance'
            ]
        },
        {
            id: 3,
            title: 'Economy Umrah Package',
            month: 'March',
            date: '5',
            year: 2026,
            amount: 65000,
            route: 'Raipur to Mumbai',
            features: [
                '3-Star Hotel',
                'Economy Flights',
                'Ground Transport',
                'Group Tour',
                'Visa Support'
            ]
        },

    ]

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {packages.map((pkg) => (
                        <PackageCard key={pkg.id} package={pkg} />
                    ))}
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
        </main>
    )
}
