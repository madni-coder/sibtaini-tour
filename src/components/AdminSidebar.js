"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HiViewGrid, HiPhotograph, HiUserGroup, HiPlusCircle, HiLogout, HiMap } from 'react-icons/hi'

export default function AdminSidebar({ open, onClose }) {
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem('adminAuth')
        localStorage.removeItem('adminEmail')
        router.push('/admin/login')
    }
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
                            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700" onClick={onClose}>
                                <HiViewGrid className="h-5 w-5" />
                                Dashboard
                            </Link>
                        </li>

                        <li>
                            <Link href="/admin/gallery" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700" onClick={onClose}>
                                <HiPhotograph className="h-5 w-5" />
                                Gallery
                            </Link>
                        </li>

                        <li>
                            <Link href="/admin/tours" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700" onClick={onClose}>
                                <HiUserGroup className="h-5 w-5" />
                                Tours
                            </Link>
                        </li>

                        <li>
                            <Link href="/admin/journey" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700" onClick={onClose}>
                                <HiMap className="h-5 w-5" />
                                Journey
                            </Link>
                        </li>


                    </ul>
                </nav>

                <div className="mt-auto p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                        <HiLogout className="h-5 w-5" />
                        Sign out
                    </button>
                </div>
            </aside>
        </>
    )
}
