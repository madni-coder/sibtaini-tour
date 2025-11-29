
export default function CreateTourPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-6">
                <h1 className="text-2xl font-bold mb-4">Create Tour Package</h1>
                <p className="text-sm text-gray-500 mb-6">This page is server-rendered for build-time prerendering. Use the admin UI to add packages.</p>

                <form className="space-y-4" method="post">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Package name</label>
                        <input name="name" className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start date</label>
                            <input type="date" name="startDate" className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End date</label>
                            <input type="date" name="endDate" className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input name="price" type="number" className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Create</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
