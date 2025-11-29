export default function AdminPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Dashboard</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded shadow">Total Tours: <strong>12</strong></div>
                <div className="p-4 bg-white rounded shadow">Gallery Items: <strong>24</strong></div>
                <div className="p-4 bg-white rounded shadow">Pending Requests: <strong>3</strong></div>
            </div>
        </div>
    )
}
