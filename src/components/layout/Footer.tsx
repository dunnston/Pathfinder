interface FooterProps {
  className?: string
}

export function Footer({ className = '' }: FooterProps): JSX.Element {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={`bg-white border-t border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Pathfinder. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

interface SimpleFooterProps {
  className?: string
}

export function SimpleFooter({ className = '' }: SimpleFooterProps): JSX.Element {
  return (
    <footer className={`py-4 text-center ${className}`}>
      <p className="text-xs text-gray-400">
        Your data is stored locally and never leaves your device.
      </p>
    </footer>
  )
}
