import { useNavigate } from 'react-router-dom'

export function AdvisorDashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm min-h-screen">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold text-gray-900">Pathfinder</h1>
          <p className="text-sm text-gray-500">Advisor Portal</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="block px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium"
              >
                Dashboard
              </a>
            </li>
            <li>
              <button
                onClick={() => navigate('/advisor/clients')}
                className="block w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Clients
              </button>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-4 left-4">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Switch Mode
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500">Welcome back! Here's an overview of your clients.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1">Total Clients</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1">Profiles In Progress</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1">Completed Profiles</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <button
            onClick={() => navigate('/advisor/clients/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add New Client
          </button>
        </div>
      </main>
    </div>
  )
}
