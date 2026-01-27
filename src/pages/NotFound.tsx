/**
 * NotFound (404) Page
 * Displayed when users navigate to a non-existent route
 * UX-24: Add catch-all route
 */

import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';

export function NotFound(): JSX.Element {
  const navigate = useNavigate();

  return (
    <main
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
      role="main"
      aria-labelledby="not-found-title"
    >
      <div className="max-w-md mx-auto text-center">
        {/* 404 Icon */}
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Text */}
        <h1
          id="not-found-title"
          className="text-6xl font-bold text-gray-900 mb-2"
        >
          404
        </h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            aria-label="Go back to previous page"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </Button>
          <Button asChild>
            <Link to="/">
              Return Home
            </Link>
          </Button>
        </div>

        {/* Quick Links */}
        <nav
          className="mt-12 pt-8 border-t border-gray-200"
          aria-label="Quick links"
        >
          <p className="text-sm text-gray-400 mb-4">Quick Links</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/consumer"
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              Consumer Dashboard
            </Link>
            <Link
              to="/advisor"
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              Advisor Dashboard
            </Link>
            <Link
              to="/consumer/discovery"
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              Start Discovery
            </Link>
          </div>
        </nav>
      </div>
    </main>
  );
}

export default NotFound;
