"use client"

import { useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout({ children }) {
    const [open, setOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <AdminSidebar open={open} onClose={() => setOpen(false)} />

            <div className="md:pl-64">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between">
                    <div className="flex items-center gap-3">
                        <button className="md:hidden p-2 rounded hover:bg-gray-100" onClick={() => setOpen(true)} aria-label="Open menu">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <h1 className="text-lg font-medium">Admin</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-sm text-gray-600">Welcome, Admin</div>
                    </div>
                </header>

                <main className="p-4">
                    {children}
                </main>
            </div>
        </div>
    )
}
