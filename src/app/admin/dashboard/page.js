"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HiTruck, HiPhotograph, HiUserGroup, HiClock } from 'react-icons/hi'

export default function AdminDashboard() {
    const router = useRouter()
    const [adminEmail, setAdminEmail] = useState('')

    useEffect(() => {
        // Check authentication
        const isAuth = localStorage.getItem('adminAuth')
        const email = localStorage.getItem('adminEmail')

        if (!isAuth || isAuth !== 'true') {
            router.push('/admin/login')
        } else {
            setAdminEmail(email)
        }
    }, [router])

   

    return (
        <div className="space-y-6">
             {/* Welcome Section */}
         

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                    onClick={() => router.push('/admin/tours/create')}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 text-left group"
                >
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                        <HiTruck className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Create New Tour</h4>
                    <p className="text-sm text-gray-600">Add a new tour package</p>
                </button>

                <button
                    onClick={() => router.push('/admin/gallery')}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 text-left group"
                >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                        <HiPhotograph className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Manage Gallery</h4>
                    <p className="text-sm text-gray-600">Upload and organize photos</p>
                </button>

                <button
                    onClick={() => router.push('/admin/tours')}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 text-left group"
                >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                        <HiUserGroup className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">View All Tours</h4>
                    <p className="text-sm text-gray-600">Manage existing tours</p>
                </button>
            </div>
        </div>
    )
}
