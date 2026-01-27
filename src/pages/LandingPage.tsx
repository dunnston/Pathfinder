/**
 * Landing Page
 * Mode selection page with header and footer
 * UX-25: Added header/footer to landing page
 */

import { Link, useNavigate } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer'

export function LandingPage(): JSX.Element {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* SEC-26: Header landmark region */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Brand */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                Pathfinder
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* SEC-26: Main landmark region */}
      <main
        className="flex-1 flex flex-col items-center justify-center p-4"
        role="main"
        aria-labelledby="landing-title"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h1 id="landing-title" className="text-4xl font-bold text-gray-900 mb-4">
            Pathfinder
          </h1>
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
              aria-label="Start planning for yourself as a consumer"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
              aria-label="Enter advisor mode to manage clients"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
      </main>

      {/* SEC-26: Footer landmark region */}
      <Footer />
    </div>
  )
}
