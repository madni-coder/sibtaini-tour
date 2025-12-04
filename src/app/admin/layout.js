"use client"

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import { HiMenuAlt3 } from 'react-icons/hi'

export default function AdminLayout({ children }) {
    const [open, setOpen] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Check authentication
        const checkAuth = () => {
            const isAuth = localStorage.getItem('adminAuth')

            // Allow access to login page
            if (pathname === '/admin/login') {
                // If already authenticated, redirect to dashboard
                if (isAuth === 'true') {
                    router.push('/admin/dashboard')
                } else {
                    setIsLoading(false)
                }
                return
            }

            // For all other admin pages, require authentication
            if (!isAuth || isAuth !== 'true') {
                router.push('/admin/login')
            } else {
                setIsAuthenticated(true)
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [pathname, router])

    // Show loading or nothing while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    // Show login page without layout
    if (pathname === '/admin/login') {
        return <>{children}</>
    }

    // Show protected layout for authenticated users
    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <AdminSidebar open={open} onClose={() => setOpen(false)} />

            <div className="md:pl-64">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between">
                    <div className="flex items-center gap-3">
                        <button className="md:hidden p-2 rounded hover:bg-gray-100" onClick={() => setOpen(true)} aria-label="Open menu">
                            <HiMenuAlt3 className="h-6 w-6" />
                        </button>

                        <h1 className="text-lg font-medium cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => router.push('/admin')}>Admin Panel</h1>
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
