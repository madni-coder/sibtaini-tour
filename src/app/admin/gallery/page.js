"use client"

import { useRef, useState } from 'react'

export default function Page() {
    const inputRef = useRef(null)
    const [preview, setPreview] = useState(null)

    const openFilePicker = () => {
        inputRef.current?.click()
    }

    const onFileChange = (e) => {
        const file = e.target.files && e.target.files[0]
        if (!file) return
        // create preview URL for local display
        const url = URL.createObjectURL(file)
        setPreview(url)
    }

    const clearPreview = () => {
        setPreview(null)
        if (inputRef.current) inputRef.current.value = ''
    }

    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Gallery - Upload Image</h2>

            <div className="">
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="hidden"
                />

                {/* Upload container (clickable) */}
                <div
                    role="button"
                    tabIndex={0}
                    onClick={openFilePicker}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openFilePicker() }}
                    className="relative w-full rounded-xl overflow-hidden shadow-lg mb-6 cursor-pointer"
                    aria-label="Upload image"
                >
                    {/* Responsive height similar to carousel.css */}
                    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100 flex items-center justify-center">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Uploaded preview"
                                className="w-full h-full object-cover object-center"
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
                    <div className="absolute top-3 right-3">
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); openFilePicker() }}
                            className="bg-white/80 text-gray-700 px-3 py-1 rounded-md text-sm shadow-sm hover:bg-white"
                        >
                            Upload
                        </button>
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
                        <button onClick={clearPreview} className="px-4 py-2 bg-red-600 text-white rounded">Remove Image</button>
                        <a href={preview} target="_blank" rel="noreferrer" className="px-4 py-2 bg-gray-800 text-white rounded">Open Full</a>
                    </div>
                )}
            </div>
        </div>
    )
}

