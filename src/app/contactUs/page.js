'use client'

import Navbar from '../../components/Navbar'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa'

export default function ContactUs() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 text-9xl">☪️</div>
                    <div className="absolute bottom-10 right-10 text-9xl">🕌</div>
                    <div className="absolute top-1/2 left-1/4 text-6xl">✨</div>
                    <div className="absolute top-1/3 right-1/4 text-6xl">✨</div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">Get in Touch</h1>
                        <p className="text-xl md:text-2xl text-emerald-50 mb-4">Your Spiritual Journey Begins Here</p>
                        <p className="text-lg text-emerald-100">With over 10 years of experience in Umrah tours, we are here to guide you every step of the way</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                {/* Experience Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 -mt-20 relative z-20">
                    <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform hover:scale-105 transition-all duration-300 border-t-4 border-emerald-500">
                        <div className="text-5xl mb-4">🕋</div>
                        <h3 className="text-3xl font-bold text-emerald-600 mb-2">10+</h3>
                        <p className="text-gray-600 font-semibold">Years Experience</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform hover:scale-105 transition-all duration-300 border-t-4 border-teal-500">
                        <div className="text-5xl mb-4">✈️</div>
                        <h3 className="text-3xl font-bold text-teal-600 mb-2">500+</h3>
                        <p className="text-gray-600 font-semibold">Happy Pilgrims</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform hover:scale-105 transition-all duration-300 border-t-4 border-purple-500">
                        <div className="text-5xl mb-4">⭐</div>
                        <h3 className="text-3xl font-bold text-purple-600 mb-2">100%</h3>
                        <p className="text-gray-600 font-semibold">Satisfaction Rate</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform hover:scale-105 transition-all duration-300 border-t-4 border-cyan-500">
                        <div className="text-5xl mb-4">🤝</div>
                        <h3 className="text-3xl font-bold text-cyan-600 mb-2">24/7</h3>
                        <p className="text-gray-600 font-semibold">Support Available</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-800 mb-6">Contact Information</h2>
                            <p className="text-gray-600 text-lg mb-8">Reach out to us for any inquiries about our Umrah and Hajj packages. We are here to make your spiritual journey unforgettable.</p>
                        </div>

                        {/* Contact Person Card */}
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl mr-4">👤</div>
                                <div>
                                    <h3 className="text-2xl font-bold">Noorudin Sibtaini</h3>
                                    <p className="text-emerald-100">Tour Director & Founder</p>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <p className="text-sm text-emerald-100 mb-2">Specialization</p>
                                <p className="text-lg font-semibold">Umrah Tour Expert - 10+ Years Experience</p>
                            </div>
                        </div>

                        {/* Contact Details Cards */}
                        <div className="space-y-4">
                            {/* Phone */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-l-4 border-emerald-500 group">
                                <div className="flex items-start">
                                    <div className="bg-emerald-100 rounded-full p-4 mr-4 group-hover:bg-emerald-500 transition-colors duration-300">
                                        <FaPhone className="text-2xl text-emerald-600 group-hover:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Phone Number</h4>
                                        <a href="tel:+919302887855" className="text-emerald-600 text-xl font-bold hover:text-emerald-700">+91 93028 87855</a>
                                        <p className="text-gray-500 text-sm mt-1">Available 24/7 for your queries</p>
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-l-4 border-teal-500 group">
                                <div className="flex items-start">
                                    <div className="bg-teal-100 rounded-full p-4 mr-4 group-hover:bg-teal-500 transition-colors duration-300">
                                        <FaEnvelope className="text-2xl text-teal-600 group-hover:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Email</h4>
                                        <a href="mailto:info@sibtainitours.com" className="text-teal-600 text-xl font-bold hover:text-teal-700">info@sibtainitours.com</a>
                                        <p className="text-gray-500 text-sm mt-1">We will respond within 24 hours</p>
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-l-4 border-cyan-500 group">
                                <div className="flex items-start">
                                    <div className="bg-cyan-100 rounded-full p-4 mr-4 group-hover:bg-cyan-500 transition-colors duration-300">
                                        <FaMapMarkerAlt className="text-2xl text-cyan-600 group-hover:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Office Address</h4>
                                        <span className="text-cyan-600 text-xl font-bold">Nawapara Rajim, Chhattisgarh</span>
                                        <p className="text-gray-500 text-sm mt-1">Visit us for personalized assistance</p>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-l-4 border-green-500 group">
                                <div className="flex items-start">
                                    <div className="bg-green-100 rounded-full p-4 mr-4 group-hover:bg-green-500 transition-colors duration-300">
                                        <FaWhatsapp className="text-2xl text-green-600 group-hover:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">WhatsApp</h4>
                                        <a href="https://wa.me/919302887855" target="_blank" rel="noopener noreferrer" className="text-green-600 text-xl font-bold hover:text-green-700">+91 93028 87855</a>
                                        <p className="text-gray-500 text-sm mt-1">Chat with us instantly</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Why Choose Us Section */}
                    <div className="mt-20">
                        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Why Choose Sibtaini Tours?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 text-center border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-300 transform hover:-translate-y-2">
                                <div className="text-6xl mb-4">🕋</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">Expert Guidance</h3>
                                <p className="text-gray-600">With 10+ years of experience in organizing Umrah tours, we ensure every aspect of your journey is handled with care and expertise.</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 text-center border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 transform hover:-translate-y-2">
                                <div className="text-6xl mb-4">💎</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">Premium Services</h3>
                                <p className="text-gray-600">We offer carefully curated packages with comfortable accommodations, reliable transportation, and dedicated support throughout your journey.</p>
                            </div>
                            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 text-center border-2 border-cyan-200 hover:border-cyan-400 transition-all duration-300 transform hover:-translate-y-2">
                                <div className="text-6xl mb-4">🤲</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">Spiritual Focus</h3>
                                <p className="text-gray-600">We understand the spiritual significance of your journey and ensure you have ample time for worship and reflection at the holy sites.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white py-12 mt-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="text-5xl mb-4">🕌</div>
                    <h3 className="text-3xl font-bold mb-3">Sibtaini Tours & Travels</h3>
                    <p className="text-gray-300 text-lg mb-6">Making your spiritual journey memorable since 2014</p>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-gray-400">
                        <p className="flex items-center gap-2"><FaPhone /> +91 93028 87855</p>
                        <p className="flex items-center gap-2"><FaMapMarkerAlt /> Baijnath Para,Raipur, Chhattisgarh</p>
                        <p className="flex items-center gap-2"><FaEnvelope /> info@sibtainitours.com</p>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-700">
                        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Sibtaini Tours & Travels. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
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