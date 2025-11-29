"use client"

import Link from 'next/link'

export default function AdminSidebar({ open, onClose }) {
    return (
        <>
            {/* overlay for mobile when sidebar is open */}
            <div className={`fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

            <aside className={`fixed z-40 inset-y-0 left-0 w-64 bg-gray-800 text-gray-100 transform transition-transform duration-200 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} md:static md:inset-auto md:translate-x-0`}>
                <div className="h-16 flex items-center px-4 border-b border-gray-700">
                    <h2 className="text-lg font-semibold">Admin Panel</h2>
                </div>

                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
                                </svg>
                                Dashboard
                            </Link>
                        </li>

                        <li>
                            <Link href="/admin/gallery" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M8 11l2 2 3-3 4 4" />
                                </svg>
                                Gallery
                            </Link>
                        </li>

                        <li>
                            <Link href="/admin/tours" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3zM6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                                </svg>
                                Tours
                            </Link>
                        </li>

                        <li>
                            <Link href="/admin/tours/create" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Create Tour
                            </Link>
                        </li>

                    </ul>
                </nav>

                <div className="mt-auto p-4 border-t border-gray-700">
                    <button className="w-full text-left text-sm text-gray-300 hover:text-white">Sign out</button>
                </div>
            </aside>
        </>
    )
}
