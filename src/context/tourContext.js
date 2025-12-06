'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// Create the Tour Context
const TourContext = createContext()

// Custom hook to use the Tour Context
export const useTourContext = () => {
    const context = useContext(TourContext)
    if (!context) {
        throw new Error('useTourContext must be used within a TourProvider')
    }
    return context
}

// Tour Provider Component
export const TourProvider = ({ children }) => {
    const [tours, setTours] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch tours function
    const fetchTours = async () => {
        try {
            setLoading(true)
            setError(null)

            // Use absolute URL or relative path for API calls
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

            const res = await fetch(`${baseUrl}/admin/api/tour`, {
                cache: 'no-store' // Ensures fresh data on each request
            })

            if (!res.ok) {
                throw new Error('Failed to fetch tours')
            }

            const data = await res.json()
            setTours(data)
        } catch (error) {
            console.error('Error fetching tours:', error)
            setError(error.message)
            setTours([])
        } finally {
            setLoading(false)
        }
    }

    // Fetch tours on mount
    useEffect(() => {
        fetchTours()
    }, [])

    const value = {
        tours,
        loading,
        error,
        fetchTours, // Expose this in case you need to refetch
        setTours // Expose this for manual updates if needed
    }

    return (
        <TourContext.Provider value={value}>
            {children}
        </TourContext.Provider>
    )
}
