'use client'

import Navbar from '../../components/Navbar'

export default function JourneyPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
            <Navbar />

            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Your Spiritual Journey
                    </h1>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        Embark on a transformative experience with Sibtaini Tours & Travels
                    </p>
                </div>

                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                    <div className="prose prose-lg max-w-none">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Our Journey Together</h2>

                        <p className="text-gray-700 mb-4">
                            At Sibtaini Tours & Travels, we understand that your pilgrimage is more than just a trip—it&apos;s a journey of faith, devotion, and spiritual awakening.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 my-8">
                            <div className="bg-emerald-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-emerald-800 mb-3">Our Mission</h3>
                                <p className="text-gray-700">
                                    To provide comfortable, affordable, and spiritually enriching Hajj and Umrah experiences for pilgrims.
                                </p>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-blue-800 mb-3">Our Promise</h3>
                                <p className="text-gray-700">
                                    Dedicated support, quality accommodations, and seamless travel arrangements throughout your journey.
                                </p>
                            </div>
                        </div>

                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">What Sets Us Apart</h3>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-emerald-600 mr-2">✓</span>
                                <span>Experienced and knowledgeable guides</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-emerald-600 mr-2">✓</span>
                                <span>Comfortable accommodations close to holy sites</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-emerald-600 mr-2">✓</span>
                                <span>24/7 support throughout your journey</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-emerald-600 mr-2">✓</span>
                                <span>Transparent pricing with no hidden costs</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-emerald-600 mr-2">✓</span>
                                <span>Small group sizes for personalized attention</span>
                            </li>
                        </ul>

                        <div className="mt-8 p-6 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-lg">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Begin Your Journey Today</h3>
                            <p className="text-gray-700 mb-4">
                                Contact us to learn more about our packages and start planning your spiritual journey.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="tel:+919302887855" className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition text-center">
                                    📞 Call Us: +91 93028 87855
                                </a>
                                <a href="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-center">
                                    View Our Packages
                                </a>
                            </div>
                        </div>
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
        </main>
    )
}