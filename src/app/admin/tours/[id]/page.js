'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditTourPage() {
    const [imagePreviews, setImagePreviews] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [statusMessage, setStatusMessage] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [tourData, setTourData] = useState(null)
    const formRef = useRef(null)
    const hasFetched = useRef(false)
    const router = useRouter()
    const params = useParams()
    const tourId = params?.id

    // Fetch tour data when component mounts
    useEffect(() => {
        if (hasFetched.current || !tourId) return
        hasFetched.current = true

        const fetchTour = async () => {
            try {
                setIsLoading(true)
                const res = await fetch('/admin/api/tour')
                if (!res.ok) throw new Error('Failed to fetch tours')
                const tours = await res.json()

                // Compare as strings or numbers - handle both cases
                const tour = tours.find(t => String(t.id) === String(tourId) || t.id === parseInt(tourId))

                if (!tour) {
                    setStatusMessage('Tour not found')
                    setIsLoading(false)
                    return
                }

                setTourData(tour)

                // Set existing image preview if available
                if (tour.images && tour.images.length > 0) {
                    setImagePreviews(tour.images.map((url, index) => ({
                        url: url,
                        name: `Existing image ${index + 1}`,
                        isExisting: true
                    })))
                }
                setIsLoading(false)
            } catch (err) {
                console.error('Error fetching tour:', err)
                setStatusMessage('Failed to load tour data')
                setIsLoading(false)
            }
        }

        fetchTour()
    }, [tourId])

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)

        // Create preview URLs for each selected image
        const previews = files.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name,
            isExisting: false
        }))

        setImagePreviews(previews)
        setSelectedFiles(files)
    }

    const removeImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setStatusMessage('')

        try {
            const fd = new FormData(formRef.current)
            fd.append('id', tourId) // Add tour ID for PATCH request

            // Add image file to form data if new file selected
            if (selectedFiles.length > 0) {
                fd.append('image', selectedFiles[0])
            }

            const res = await fetch('/admin/api/tour', { method: 'PATCH', body: fd })
            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || 'Server error')
            }
            const data = await res.json()
            setStatusMessage('Updated successfully')

            // Redirect back to tours list after a short delay
            setTimeout(() => {
                router.push('/admin/tours')
            }, 1500)
        } catch (err) {
            setStatusMessage(err.message || 'Failed to update package')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
                <div className="text-center">
                    <p className="text-gray-600">Loading tour data...</p>
                </div>
            </div>
        )
    }

    if (!tourData) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
                <div className="text-center">
                    <p className="text-red-600">{statusMessage || 'Tour not found'}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
            <h1 className="text-2xl font-bold mb-1">Edit Tour Package</h1>
            <p className="text-sm text-gray-500 mb-6">Update the details of your tour package.</p>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>

                <input
                    id="images"
                    name="images"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />

                {/* Image Preview with Edit Icon */}
                {imagePreviews.length > 0 ? (
                    <div className="relative w-full max-w-md">
                        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                            <img
                                src={imagePreviews[0].url}
                                alt={imagePreviews[0].name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => document.getElementById('images').click()}
                            className="absolute top-3 right-3 bg-white hover:bg-gray-50 text-gray-700 rounded-full p-2.5 shadow-lg transition-colors border border-gray-200"
                            aria-label="Edit image"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <p className="text-xs text-gray-500 mt-2">{imagePreviews[0].name}</p>
                    </div>
                ) : (
                    <div className="w-full max-w-md">
                        <div className="aspect-video rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => document.getElementById('images').click()}
                                className="flex flex-col items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-medium">Click to select image</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Package name <span className="text-red-500">*</span></label>
                    <input
                        id="name"
                        name="name"
                        placeholder="e.g. 7-Day Mecca & Medina Pilgrimage"
                        required
                        defaultValue={tourData.name}
                        className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <p className="text-xs text-gray-400 mt-1">Give a short, descriptive name so visitors can scan it easily.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start date <span className="text-red-500">*</span></label>
                        <input
                            id="startDate"
                            type="date"
                            name="startDate"
                            required
                            defaultValue={tourData.startDate ? new Date(tourData.startDate).toISOString().split('T')[0] : ''}
                            className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End date <span className="text-red-500">*</span></label>
                        <input
                            id="endDate"
                            type="date"
                            name="endDate"
                            required
                            defaultValue={tourData.endDate ? new Date(tourData.endDate).toISOString().split('T')[0] : ''}
                            className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                        <div className="mt-2 relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">Rs</span>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                defaultValue={tourData.price || ''}
                                className="block w-full rounded-lg border border-gray-200 bg-white px-10 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Leave blank if price varies; use 0 for free packages.</p>
                    </div>
                </div>

                <div>
                    <label htmlFor="from" className="block text-sm font-medium text-gray-700">From</label>
                    <input
                        id="from"
                        name="from"
                        placeholder="City or region (optional)"
                        defaultValue={tourData.from || ''}
                        className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>
                <div>
                    <label htmlFor="to" className="block text-sm font-medium text-gray-700">To</label>
                    <input
                        id="to"
                        name="to"
                        placeholder="City or region (optional)"
                        defaultValue={tourData.to || ''}
                        className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        placeholder="Short summary of the package, highlights, and inclusions"
                        defaultValue={tourData.description || ''}
                        className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                    ></textarea>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 bg-green-600 text-white rounded-lg shadow disabled:opacity-60 hover:bg-green-700 transition-colors"
                        >
                            {isSubmitting ? 'Updating…' : 'Update'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/admin/tours')}
                            className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                        {statusMessage && <p className="text-sm text-gray-600 ml-3">{statusMessage}</p>}
                    </div>
                </div>
            </form>
        </div>
    )
}
