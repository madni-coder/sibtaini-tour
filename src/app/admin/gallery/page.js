"use client"

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { HiUpload, HiCloudUpload, HiX } from 'react-icons/hi'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export default function Page() {
    const inputRef = useRef(null)
    const [preview, setPreview] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [galleryItems, setGalleryItems] = useState([])
    const [loadingGallery, setLoadingGallery] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmTargetId, setConfirmTargetId] = useState(null)
    const fetchedRef = useRef(false)

    // toast
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' })

    // Remove openFilePicker, not needed

    const onFileChange = (e) => {
        const file = e.target.files && e.target.files[0]
        if (!file) return
        // create preview URL for local display
        const url = URL.createObjectURL(file)
        setPreview(url)
        setSelectedFile(file)
    }

    const clearPreview = () => {
        if (preview) {
            try {
                URL.revokeObjectURL(preview)
            } catch (err) {
                // ignore revoke errors for non-object URLs
            }
            setPreview(null)
            setSelectedFile(null)
            setIsUploading(false)
        }
    }

    // Upload preview imageUrl to API
    const uploadImage = async () => {
        if (!selectedFile) return
        setIsUploading(true)
        try {
            // Build multipart/form-data with the actual File
            const fm = new FormData()
            fm.append('image', selectedFile)

            const res = await fetch('/admin/api/gallery', {
                method: 'POST',
                body: fm // browser will set the proper Content-Type with boundary
            })
            if (res.ok) {
                clearPreview()
                // refresh gallery
                fetchGallery()
                showToast('Your image is uploaded', 'success')
            } else {
                const body = await res.json().catch(() => null)
                console.error('Upload failed', res.status, body)
                showToast(body?.error || 'Upload failed', 'error')
            }
        } catch (err) {
            console.error('Error uploading image', err)
            showToast('Error uploading image', 'error')
        } finally {
            setIsUploading(false)
        }
    }

    const fetchGallery = async () => {
        setLoadingGallery(true)
        try {
            const res = await fetch('/admin/api/gallery')
            if (!res.ok) {
                console.error('Failed to fetch gallery', res.status)
                setGalleryItems([])
                return
            }
            const data = await res.json()
            setGalleryItems(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Error fetching gallery', err)
            setGalleryItems([])
        } finally {
            setLoadingGallery(false)
        }
    }

    useEffect(() => {
        if (fetchedRef.current) return
        fetchedRef.current = true
        fetchGallery()
    }, [])

    const openConfirm = (id) => {
        setConfirmTargetId(id)
        setConfirmOpen(true)
    }

    const cancelDelete = () => {
        setConfirmTargetId(null)
        setConfirmOpen(false)
    }

    const confirmDelete = async () => {
        const id = confirmTargetId
        if (!id) return
        setDeletingId(id)
        try {
            const res = await fetch('/admin/api/gallery', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            if (!res.ok) {
                const body = await res.json().catch(() => null)
                showToast(body?.error || 'Failed to delete', 'error')
                return
            }
            // remove locally
            setGalleryItems((prev) => prev.filter((i) => i.id !== id))
            showToast('Your image is deleted', 'success')
        } catch (err) {
            console.error('Error deleting image', err)
            showToast('Error deleting image', 'error')
        } finally {
            setDeletingId(null)
            setConfirmOpen(false)
            setConfirmTargetId(null)
        }
    }

    const showToast = (message, type = 'success') => {
        setToast({ visible: true, message, type })
        // auto hide
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000)
    }

    return (
        <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-6">Gallery - Upload Image</h2>

            <div>
                {/* Hidden native input - triggered by buttons */}
                <input
                    id="gallery-input"
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="hidden"
                />

                {/* Upload container */}
                <div className="relative w-full rounded-xl overflow-hidden shadow-lg mb-6">
                    <div className="relative w-full h-[420px] md:h-[520px] lg:h-[620px] bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center">
                        {preview ? (
                            <div className="relative w-full h-full">
                                <Image
                                    fill
                                    src={preview}
                                    alt="Uploaded preview"
                                    className="object-cover object-center"
                                    unoptimized
                                />
                                {/* overlay actions centered at bottom */}
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow">
                                    <button
                                        onClick={uploadImage}
                                        disabled={isUploading}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow disabled:opacity-60"
                                    >
                                        {isUploading ? 'Posting...' : 'Post'}
                                    </button>
                                    <button
                                        onClick={clearPreview}
                                        className="px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 shadow-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center px-6">
                                <HiCloudUpload className="mx-auto h-16 w-16 text-gray-400" />
                                <p className="mt-3 text-sm text-gray-600">Click the button to upload an image</p>
                                <p className="mt-1 text-xs text-gray-400">Will display responsively on mobile and web</p>

                                <div className="mt-6">
                                    <button
                                        onClick={() => inputRef.current?.click()}
                                        className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow focus:outline-none"
                                    >
                                        <HiUpload className="h-5 w-5" />
                                        Upload Image
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Gallery grid */}
            <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Uploaded Images</h3>
                {loadingGallery ? (
                    <p className="text-sm text-gray-500">Loading...</p>
                ) : galleryItems.length === 0 ? (
                    <p className="text-sm text-gray-500">No images uploaded yet.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {galleryItems.map((item) => (
                            <div key={item.id} className="relative rounded overflow-hidden bg-gray-50 border border-gray-200">
                                <div className="relative w-full h-40 sm:h-48">
                                    <Image
                                        src={item.imageUrl}
                                        alt={`Gallery ${item.id}`}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                <button
                                    onClick={() => openConfirm(item.id)}
                                    disabled={deletingId === item.id}
                                    className="absolute top-2 right-2 bg-white/80 hover:bg-white px-2 py-1 rounded-md shadow flex items-center gap-2"
                                    title="Delete image"
                                >
                                    {deletingId === item.id ? (
                                        <AiOutlineLoading3Quarters className="h-4 w-4 animate-spin text-red-600" />
                                    ) : (
                                        <HiX className="h-4 w-4 text-red-600" />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {/* Confirm modal */}
                {confirmOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40" onClick={cancelDelete} />
                        <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
                            <h4 className="text-lg font-semibold">Are you sure?</h4>
                            <p className="text-sm text-gray-600 mt-2">Do you really want to delete this image? This action cannot be undone.</p>
                            <div className="mt-4 flex justify-end gap-3">
                                <button onClick={cancelDelete} className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200">No</button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={!!deletingId}
                                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                                >
                                    {deletingId ? 'Deleting...' : 'Yes, delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toast */}
                <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50">
                    {toast.visible && (
                        <div className={`px-4 py-2 rounded shadow-lg ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                            {toast.message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
