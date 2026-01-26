import { useNavigate } from 'react-router-dom'

export function ConsumerHome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Pathfinder</h1>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Switch Mode
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Financial Journey</h2>
          <p className="text-gray-600 mb-6">
            Let's start by building your Financial Decision Profile. This helps us understand your
            situation, goals, and preferences so we can guide you through important decisions.
          </p>
          <button
            onClick={() => navigate('/consumer/discovery/basic-context')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Start Discovery
          </button>
        </div>
      </main>
    </div>
  )
}
