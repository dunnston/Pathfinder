import type { ReactNode } from 'react'
import { Header, ConsumerHeader } from './Header'
import { SimpleFooter } from './Footer'

interface ConsumerLayoutProps {
  children: ReactNode
  title?: string
  showBack?: boolean
  onBack?: () => void
  showFooter?: boolean
  className?: string
}

export function ConsumerLayout({
  children,
  title,
  showBack = false,
  onBack,
  showFooter = true,
  className = '',
}: ConsumerLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {title || showBack ? (
        <ConsumerHeader title={title} showBack={showBack} onBack={onBack} />
      ) : (
        <Header showModeSwitch />
      )}

      <main className={`flex-1 ${className}`}>
        {children}
      </main>

      {showFooter && <SimpleFooter />}
    </div>
  )
}

interface ConsumerPageProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

const maxWidthStyles = {
  sm: 'max-w-xl',
  md: 'max-w-2xl',
  lg: 'max-w-3xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl',
}

export function ConsumerPage({
  children,
  maxWidth = 'lg',
  className = '',
}: ConsumerPageProps): JSX.Element {
  return (
    <div className={`${maxWidthStyles[maxWidth]} mx-auto px-4 sm:px-6 py-8 ${className}`}>
      {children}
    </div>
  )
}
