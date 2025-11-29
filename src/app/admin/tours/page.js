import Link from 'next/link'
import { FiEdit2 } from 'react-icons/fi'

async function fetchPackages() {
    try {
        const res = await fetch('/api/admin/packages', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        return data
    } catch (e) {
        // Fallback sample data — replace with real API if needed
        return [
            {
                id: '1',
                name: 'Premium Hajj Package',
                startDate: '2026-06-15',
                endDate: '2026-06-30',
                price: 725000,
            },
            {
                id: '2',
                name: 'Deluxe Umrah Package',
                startDate: '2026-01-10',
                endDate: '2026-01-25',
                price: 85000,
            },
            {
                id: '3',
                name: 'Economy Umrah Package',
                startDate: '2026-03-05',
                endDate: '2026-03-20',
                price: 65000,
            },
        ]
    }
}

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

export default async function AdminToursPage() {
    const packages = await fetchPackages()

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
            <div className="w-full max-w-lg">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Packages</h1>
                <p className="mb-8 text-base text-gray-500">List of tour packages — tap a row action to open details.</p>
                <div className="flex flex-col gap-6">
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
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
                                <Link href={`/tours/${pkg.id}`} aria-label={`Edit ${pkg.name}`} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition flex items-center justify-center">
                                    <FiEdit2 className="h-5 w-5 text-gray-500" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
