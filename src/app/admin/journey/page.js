"use client"

import { useState, useEffect, useRef } from 'react'
import { HiCloudUpload, HiX, HiPhotograph, HiVideoCamera, HiTrash, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi'

export default function JourneyPage() {
    const [selectedFiles, setSelectedFiles] = useState([])
    const [uploadedItems, setUploadedItems] = useState([])
    const [isDragging, setIsDragging] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState({})
    const [loading, setLoading] = useState(true)
    const [deleteConfirmation, setDeleteConfirmation] = useState(null) // { id, fileName }
    const [notification, setNotification] = useState(null) // { message, type: 'success' | 'error' }
    const hasFetchedRef = useRef(false)

    // Fetch uploaded items on component mount
    useEffect(() => {
        // Prevent duplicate API calls in React Strict Mode
        if (hasFetchedRef.current) return
        hasFetchedRef.current = true

        fetchUploadedItems()
    }, [])

    // Auto-dismiss notification after 3 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [notification])

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type })
    }

    const fetchUploadedItems = async () => {
        try {
            setLoading(true)
            const response = await fetch('/admin/api/journey')
            if (response.ok) {
                const data = await response.json()
                setUploadedItems(data)
            } else {
                console.error('Failed to fetch journey items')
            }
        } catch (error) {
            console.error('Error fetching journey items:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files)
        processFiles(files)
    }

    const processFiles = (files) => {
        const validFiles = files.filter(file =>
            file.type.startsWith('image/') || file.type.startsWith('video/')
        )

        const newFiles = validFiles.map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            preview: URL.createObjectURL(file),
            type: file.type.startsWith('image/') ? 'image' : 'video',
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) // Size in MB
        }))

        setSelectedFiles(prev => [...prev, ...newFiles])
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        const files = Array.from(e.dataTransfer.files)
        processFiles(files)
    }

    const removeFile = (id) => {
        setSelectedFiles(prev => {
            const fileToRemove = prev.find(f => f.id === id)
            if (fileToRemove) {
                URL.revokeObjectURL(fileToRemove.preview)
            }
            return prev.filter(f => f.id !== id)
        })
    }

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            showNotification('Please select files to upload', 'error')
            return
        }

        setUploading(true)
        let successCount = 0
        let failCount = 0

        // Upload files one by one
        for (const fileObj of selectedFiles) {
            try {
                setUploadProgress(prev => ({ ...prev, [fileObj.id]: 'uploading' }))

                const formData = new FormData()
                formData.append('file', fileObj.file)

                const response = await fetch('/admin/api/journey', {
                    method: 'POST',
                    body: formData
                })

                if (response.ok) {
                    setUploadProgress(prev => ({ ...prev, [fileObj.id]: 'success' }))
                    successCount++
                    // Clean up preview URL
                    URL.revokeObjectURL(fileObj.preview)
                } else {
                    const error = await response.json()
                    console.error('Upload failed:', error)
                    console.error('Error details:', error.details || error.error)
                    setUploadProgress(prev => ({ ...prev, [fileObj.id]: 'error' }))
                    failCount++
                }
            } catch (error) {
                console.error('Upload error:', error)
                setUploadProgress(prev => ({ ...prev, [fileObj.id]: 'error' }))
                failCount++
            }
        }

        // Show result
        if (successCount > 0) {
            showNotification(`Successfully uploaded ${successCount} file(s)${failCount > 0 ? `, ${failCount} failed` : ''}`, 'success')
            // Refresh the uploaded items list
            await fetchUploadedItems()
            // Clear selected files
            setSelectedFiles([])
            setUploadProgress({})
        } else {
            showNotification('All uploads failed. Please check the console for error details.', 'error')
        }

        setUploading(false)
    }

    const handleDelete = (item) => {
        setDeleteConfirmation({ id: item.id, fileName: item.fileName })
    }

    const confirmDelete = async () => {
        if (!deleteConfirmation) return

        try {
            const response = await fetch('/admin/api/journey', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: deleteConfirmation.id })
            })

            if (response.ok) {
                showNotification('Item deleted successfully', 'success')
                await fetchUploadedItems()
            } else {
                const error = await response.json()
                showNotification(`Failed to delete: ${error.error || 'Unknown error'}`, 'error')
            }
        } catch (error) {
            console.error('Delete error:', error)
            showNotification('Failed to delete item', 'error')
        } finally {
            setDeleteConfirmation(null)
        }
    }

    const cancelDelete = () => {
        setDeleteConfirmation(null)
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Journey Media</h1>
                <p className="text-gray-600 mt-2">Upload photos and videos from your journey</p>
            </div>

            {/* Upload Area */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${isDragging
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <HiCloudUpload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Drop your files here, or browse
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Supports: Images (JPG, PNG, GIF, WebP) and Videos (MP4, WebM, OGG, MOV)
                    </p>

                    <label className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer transition-colors">
                        <HiPhotograph className="mr-2 h-5 w-5" />
                        Select Files
                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                </div>
            </div>

            {/* Preview Section */}
            {selectedFiles.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Selected Files ({selectedFiles.length})
                        </h2>
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className={`px-6 py-2 rounded-lg transition-colors font-medium ${uploading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                }`}
                        >
                            {uploading ? 'Uploading...' : 'Upload All'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedFiles.map((file) => (
                            <div
                                key={file.id}
                                className="relative group bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                            >
                                {/* Upload Status Badge */}
                                {uploadProgress[file.id] && (
                                    <div className={`absolute top-2 left-2 z-10 px-2 py-1 rounded text-xs font-medium ${uploadProgress[file.id] === 'uploading' ? 'bg-blue-500 text-white' :
                                        uploadProgress[file.id] === 'success' ? 'bg-green-500 text-white' :
                                            'bg-red-500 text-white'
                                        }`}>
                                        {uploadProgress[file.id] === 'uploading' ? 'Uploading...' :
                                            uploadProgress[file.id] === 'success' ? 'Success' : 'Failed'}
                                    </div>
                                )}

                                {/* Remove Button */}
                                {!uploading && (
                                    <button
                                        onClick={() => removeFile(file.id)}
                                        className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                        aria-label="Remove file"
                                    >
                                        <HiX className="h-4 w-4" />
                                    </button>
                                )}

                                {/* Media Preview */}
                                <div className="bg-gray-200 relative">
                                    {file.type === 'image' ? (
                                        <img
                                            src={file.preview}
                                            alt={file.name}
                                            className="w-full h-auto object-contain"
                                        />
                                    ) : (
                                        <div className="relative w-full">
                                            <video
                                                src={file.preview}
                                                className="w-full h-auto object-contain"
                                                controls
                                            />
                                            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                                <HiVideoCamera className="h-3 w-3" />
                                                Video
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* File Info */}
                                <div className="p-3">
                                    <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {file.size} MB
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Uploaded Items Gallery */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Uploaded Journey Media ({uploadedItems.length})
                    </h2>
                    <button
                        onClick={fetchUploadedItems}
                        className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-sm font-medium"
                    >
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                        <p className="text-gray-500 mt-4">Loading...</p>
                    </div>
                ) : uploadedItems.length === 0 ? (
                    <div className="text-center py-12">
                        <HiPhotograph className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No media uploaded yet</h3>
                        <p className="text-gray-500">Upload some photos or videos to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {uploadedItems.map((item) => (
                            <div
                                key={item.id}
                                className="relative group bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                            >
                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDelete(item)}
                                    className="absolute top-2 right-2 z-10 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                    aria-label="Delete item"
                                >
                                    <HiTrash className="h-4 w-4" />
                                </button>

                                {/* Media Type Badge */}
                                <div className="absolute top-2 left-2 z-10 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                    {item.mediaType === 'image' ? (
                                        <>
                                            <HiPhotograph className="h-3 w-3" />
                                            Image
                                        </>
                                    ) : (
                                        <>
                                            <HiVideoCamera className="h-3 w-3" />
                                            Video
                                        </>
                                    )}
                                </div>

                                {/* Media Display */}
                                <div className="bg-gray-200 relative">
                                    {item.mediaType === 'image' ? (
                                        <img
                                            src={item.mediaUrl}
                                            alt={item.fileName || 'Journey media'}
                                            className="w-full h-auto object-contain"
                                        />
                                    ) : (
                                        <video
                                            src={item.mediaUrl}
                                            className="w-full h-auto object-contain"
                                            controls
                                        />
                                    )}
                                </div>

                                {/* File Info */}
                                <div className="p-3">
                                    <p className="text-sm font-medium text-gray-900 truncate" title={item.fileName}>
                                        {item.fileName || 'Untitled'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                            <HiTrash className="h-6 w-6 text-red-600" />
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                            Delete Media?
                        </h3>

                        <p className="text-gray-600 text-center mb-6">
                            Are you sure you want to delete.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                No, Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl min-w-[300px] max-w-md ${notification.type === 'success'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-600 text-white'
                        }`}>
                        {notification.type === 'success' ? (
                            <HiCheckCircle className="h-6 w-6 flex-shrink-0" />
                        ) : (
                            <HiExclamationCircle className="h-6 w-6 flex-shrink-0" />
                        )}
                        <p className="flex-1 font-medium">{notification.message}</p>
                        <button
                            onClick={() => setNotification(null)}
                            className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
                        >
                            <HiX className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
