'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

function formatDate(dateStr) {
    try {
        const d = new Date(dateStr)
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
        return dateStr
    }
}

function formatPrice(value) {
    if (typeof value !== 'number') return value
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
}

export default function AdminToursPage() {
    const router = useRouter()
    const [packages, setPackages] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [tourToDelete, setTourToDelete] = useState(null)
    const hasFetched = useRef(false)

    useEffect(() => {
        // Prevent duplicate fetches in Strict Mode
        if (hasFetched.current) return
        hasFetched.current = true

        async function loadPackages() {
            try {
                setIsLoading(true)
                const res = await fetch('/admin/api/tour', { cache: 'no-store' })
                if (!res.ok) throw new Error('Failed to fetch tours')
                const data = await res.json()
                setPackages(data)
            } catch (e) {
                console.error('Error fetching tours:', e)
                setPackages([])
            } finally {
                setIsLoading(false)
            }
        }

        loadPackages()
    }, [])

    async function refreshPackages() {
        try {
            const res = await fetch('/admin/api/tour', { cache: 'no-store' })
            if (!res.ok) throw new Error('Failed to fetch tours')
            const data = await res.json()
            setPackages(data)
        } catch (e) {
            console.error('Error fetching tours:', e)
        }
    }

    function handleDeleteClick(tourId) {
        setTourToDelete(tourId)
        setShowDeleteModal(true)
    }

    async function confirmDelete() {
        if (!tourToDelete) return

        setDeletingId(tourToDelete)
        setShowDeleteModal(false)

        try {
            const res = await fetch('/admin/api/tour', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: tourToDelete }),
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Failed to delete tour')
            }

            // Refresh the list
            await refreshPackages()
        } catch (error) {
            console.error('Error deleting tour:', error)
        } finally {
            setDeletingId(null)
            setTourToDelete(null)
        }
    }

    function cancelDelete() {
        setShowDeleteModal(false)
        setTourToDelete(null)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
            <div className="absolute top-0 right-0 mt-2 mr-2">
                <Link href="/admin/tours/create">
                    <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-200">
                        Create Package
                    </button>
                </Link>
            </div>
            <div className="w-full max-w-lg">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Packages</h1>

                <p className="mb-8 text-base text-gray-500">List of tour packages — tap a row action to open details.</p>

                {isLoading ? (
                    <div className="text-center py-12 text-gray-500">Loading packages...</div>
                ) : packages.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No packages found.</div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {packages.map((pkg) => (
                            <div key={pkg.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                                {/* Package Image */}
                                {pkg.images && pkg.images.length > 0 && (
                                    <div className="relative w-full h-48">
                                        <Image
                                            src={pkg.images[0]}
                                            alt={pkg.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 512px"
                                        />
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="mb-5">
                                        <span className="text-xs font-medium text-gray-400">Package Name</span>
                                        <h2 className="text-xl font-bold text-gray-800 mt-1">{pkg.name}</h2>
                                    </div>
                                    <div className="mb-3">
                                        <span className="text-xs font-medium text-gray-400">Start & End Date</span>
                                        <p className="text-sm text-gray-700 mt-1">{formatDate(pkg.startDate)} - {formatDate(pkg.endDate)}</p>
                                    </div>
                                    <div className="mb-5">
                                        <span className="text-xs font-medium text-gray-400">Price</span>
                                        <p className="text-xl font-extrabold text-green-600 mt-1">{formatPrice(pkg.price)}</p>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <span className="text-xs font-medium text-gray-400">Actions</span>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/tours/${pkg.id}`} aria-label={`Edit ${pkg.name}`} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition flex items-center justify-center">
                                                <FiEdit2 className="h-5 w-5 text-gray-500" />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(pkg.id)}
                                                disabled={deletingId === pkg.id}
                                                aria-label={`Delete ${pkg.name}`}
                                                className="p-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-300 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <FiTrash2 className={`h-5 w-5 ${deletingId === pkg.id ? 'text-gray-400' : 'text-red-500'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                            <FiTrash2 className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                            Delete Tour Package
                        </h3>
                        <p className="text-gray-600 text-center mb-6">
                            Are you sure you want to delete this tour package? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
