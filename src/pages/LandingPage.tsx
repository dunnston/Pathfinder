import { useNavigate } from 'react-router-dom'

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Pathfinder</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your guided financial decision and execution platform
        </p>
        <p className="text-gray-500 mb-12">
          Choose how you'd like to use Pathfinder today
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Consumer Mode Card */}
          <button
            onClick={() => navigate('/consumer')}
            className="bg-white rounded-xl shadow-md p-8 text-left hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">I'm planning for myself</h2>
            <p className="text-gray-500">
              Create your personal financial profile and get guided through important decisions
            </p>
          </button>

          {/* Advisor Mode Card */}
          <button
            onClick={() => navigate('/advisor')}
            className="bg-white rounded-xl shadow-md p-8 text-left hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">I'm a financial advisor</h2>
            <p className="text-gray-500">
              Manage multiple clients and guide them through the financial planning process
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}
