'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { TourProvider } from '../context/tourContext'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <TourProvider>
                    {children}
                </TourProvider>
            </body>
        </html>
    )
}
