"use client"

import { useRef, useState } from 'react'
import Image from 'next/image'

export default function Page() {
    const inputRef = useRef(null)
    const [preview, setPreview] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)

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
        }
    }

    // Upload preview imageUrl to API
    const uploadImage = async () => {
        if (!selectedFile) return
        try {
            // Build multipart/form-data with the actual File
            const fm = new FormData()
            fm.append('image', selectedFile)

            const res = await fetch('/admin/api/gallery', {
                method: 'POST',
                body: fm // browser will set the proper Content-Type with boundary
            })
            if (res.ok) {
                alert('Image uploaded!')
                clearPreview()
            } else {
                const body = await res.json().catch(() => null)
                console.error('Upload failed', res.status, body)
                alert('Upload failed')
            }
        } catch (err) {
            console.error('Error uploading image', err)
            alert('Error uploading image')
        }
    }

    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Gallery - Upload Image</h2>

            <div>

                {/* Upload container (clickable) */}
                <div
                    className="relative w-full rounded-xl overflow-hidden shadow-lg mb-6 cursor-pointer"
                    aria-label="Upload image"
                >
                    {/* Native file input overlay so clicks open the picker directly */}
                    <input
                        id="gallery-input"
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
                    />
                    {/* Responsive height similar to carousel.css */}
                    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100 flex items-center justify-center">
                        {preview ? (
                            <Image
                                fill
                                src={preview}
                                alt="Uploaded preview"
                                className="object-cover object-center"
                                unoptimized
                            />
                        ) : (
                            <div className="text-center px-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-14 w-14 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0l4-4m-4 4-4-4" />
                                </svg>
                                <p className="mt-3 text-sm text-gray-600">Click to upload an image (any ratio, any image type)</p>
                                <p className="mt-1 text-xs text-gray-400">Will display responsively on mobile and web</p>
                            </div>
                        )}
                    </div>

                    {/* small overlay indicators */}
                    <div className="absolute top-3 right-3 z-10">
                        <label
                            htmlFor="gallery-input"
                            role="button"
                            className="bg-white/80 text-gray-700 px-3 py-1 rounded-md text-sm shadow-sm hover:bg-white inline-flex items-center cursor-pointer"
                        >
                            Upload
                        </label>
                        {preview && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); clearPreview() }}
                                className="ml-2 bg-white/80 text-red-600 px-3 py-1 rounded-md text-sm shadow-sm hover:bg-white"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                </div>

                {/* Small helper / preview actions for mobile */}
                {preview && (
                    <div className="flex items-center gap-3">
                        <button onClick={uploadImage} className="px-4 py-2 bg-green-600 text-white rounded">Post</button>
                        <button onClick={clearPreview} className="px-4 py-2 bg-red-600 text-white rounded">Cancel</button>
                    </div>
                )}
            </div>
        </div>
    )
}
