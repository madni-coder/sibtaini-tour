import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Sibtaini Tours & Travels - Hajj & Umrah Packages',
    description: 'Premium Hajj and Umrah tour packages from Raipur to Mumbai',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    )
}
