
'use client'
import { useState, useRef } from 'react'
import { HiPhotograph, HiX } from 'react-icons/hi'

export default function CreateTourPage() {
    const [imagePreviews, setImagePreviews] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [statusMessage, setStatusMessage] = useState('')
    const formRef = useRef(null)

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)

        // Create preview URLs for each selected image
        const previews = files.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name
        }))

        setImagePreviews(previews)
        setSelectedFiles(files)
    }

    const removeImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
            <h1 className="text-2xl font-bold mb-1">Create Tour Package</h1>
            <p className="text-sm text-gray-500 mb-6">This page is server-rendered for build-time prerendering. Use the admin UI to add packages.</p>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>

                {/* Upload Container */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors cursor-pointer bg-white">
                    <input
                        id="images"
                        name="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <label htmlFor="images" className="cursor-pointer">
                        <HiPhotograph className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                            <span className="font-semibold text-green-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                    </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                    <img
                                        src={preview.url}
                                        alt={preview.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
                                >
                                    <HiX className="w-4 h-4" />
                                </button>
                                <p className="text-xs text-gray-500 mt-1 truncate">{preview.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <form ref={formRef} className="space-y-6" onSubmit={async (e) => {
                e.preventDefault()
                setIsSubmitting(true)
                setStatusMessage('')
                try {
                    const fd = new FormData(formRef.current)

                    // Add image file to form data if selected
                    if (selectedFiles.length > 0) {
                        fd.append('image', selectedFiles[0]) // Send first image file to tour API
                    }

                    const res = await fetch('/admin/api/tour', { method: 'POST', body: fd })
                    if (!res.ok) {
                        const errorData = await res.json()
                        throw new Error(errorData.error || 'Server error')
                    }
                    const data = await res.json()
                    setStatusMessage('Created successfully')
                    // reset form
                    formRef.current.reset()
                    setImagePreviews([])
                    setSelectedFiles([])
                } catch (err) {
                    setStatusMessage(err.message || 'Failed to create package')
                } finally {
                    setIsSubmitting(false)
                }
            }}>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Package name <span className="text-red-500">*</span></label>
                    <input id="name" name="name" placeholder="e.g. 7-Day Mecca & Medina Pilgrimage" required
                        className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400" />
                    <p className="text-xs text-gray-400 mt-1">Give a short, descriptive name so visitors can scan it easily.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start date <span className="text-red-500">*</span></label>
                        <input id="startDate" type="date" name="startDate" required
                            className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End date <span className="text-red-500">*</span></label>
                        <input id="endDate" type="date" name="endDate" required
                            className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                        <div className="mt-2 relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">Rs</span>
                            <input id="price" name="price" type="number" step="0.01" min="0" placeholder="0.00"
                                className="block w-full rounded-lg border border-gray-200 bg-white px-10 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Leave blank if price varies; use 0 for free packages.</p>
                    </div>


                </div>

                <div>
                    <label htmlFor="from" className="block text-sm font-medium text-gray-700">From</label>
                    <input id="from" name="from" placeholder="City or region (optional)"
                        className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div>
                    <label htmlFor="to" className="block text-sm font-medium text-gray-700">To</label>
                    <input id="to" name="to" placeholder="City or region (optional)"
                        className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" name="description" rows="4" placeholder="Short summary of the package, highlights, and inclusions"
                        className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">



                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-green-600 text-white rounded-lg shadow disabled:opacity-60">{isSubmitting ? 'Creating…' : 'Create'}</button>
                        {statusMessage && <p className="text-sm text-gray-600 ml-3">{statusMessage}</p>}
                    </div>

                </div>
            </form>
        </div>
    )
}
