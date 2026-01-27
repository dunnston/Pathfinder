import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary, LoadingPage } from './components/common/ErrorBoundary'
import { SessionTimeoutWrapper } from './components/common/SessionTimeoutWrapper'

// Landing - eagerly loaded for fast initial render
import { LandingPage } from './pages/LandingPage'

// Consumer pages - lazy loaded (SEC-9: code splitting)
const ConsumerHome = lazy(() => import('./pages/consumer/ConsumerHome').then(m => ({ default: m.ConsumerHome })))
const DiscoveryStart = lazy(() => import('./pages/consumer/DiscoveryStart').then(m => ({ default: m.DiscoveryStart })))
const DiscoverySection = lazy(() => import('./pages/consumer/DiscoverySection').then(m => ({ default: m.DiscoverySection })))
const ProfileSummary = lazy(() => import('./pages/consumer/ProfileSummary').then(m => ({ default: m.ProfileSummary })))

// Advisor pages - lazy loaded (SEC-9: code splitting)
const AdvisorDashboard = lazy(() => import('./pages/advisor/AdvisorDashboard').then(m => ({ default: m.AdvisorDashboard })))
const ClientList = lazy(() => import('./pages/advisor/ClientList').then(m => ({ default: m.ClientList })))
const AddClient = lazy(() => import('./pages/advisor/AddClient').then(m => ({ default: m.AddClient })))
const ClientDetail = lazy(() => import('./pages/advisor/ClientDetail').then(m => ({ default: m.ClientDetail })))
const ClientDiscovery = lazy(() => import('./pages/advisor/ClientDiscovery').then(m => ({ default: m.ClientDiscovery })))
const ClientProfile = lazy(() => import('./pages/advisor/ClientProfile').then(m => ({ default: m.ClientProfile })))

// UX-24: 404 Not Found page - lazy loaded
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })))

// Route-level error boundary wrapper (SEC-11)
function RouteErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingPage message="Loading..." />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        {/* SEC-8: Session timeout wrapper for security */}
        <SessionTimeoutWrapper>
          <Routes>
          {/* Landing / Mode Selection */}
          <Route path="/" element={<LandingPage />} />

          {/* Consumer Routes - wrapped with error boundary */}
          <Route path="/consumer" element={
            <RouteErrorBoundary><ConsumerHome /></RouteErrorBoundary>
          } />
          <Route path="/consumer/discovery" element={
            <RouteErrorBoundary><DiscoveryStart /></RouteErrorBoundary>
          } />
          <Route path="/consumer/discovery/:section" element={
            <RouteErrorBoundary><DiscoverySection /></RouteErrorBoundary>
          } />
          <Route path="/consumer/profile" element={
            <RouteErrorBoundary><ProfileSummary /></RouteErrorBoundary>
          } />

          {/* Advisor Routes - wrapped with error boundary */}
          <Route path="/advisor" element={
            <RouteErrorBoundary><AdvisorDashboard /></RouteErrorBoundary>
          } />
          <Route path="/advisor/clients" element={
            <RouteErrorBoundary><ClientList /></RouteErrorBoundary>
          } />
          <Route path="/advisor/clients/new" element={
            <RouteErrorBoundary><AddClient /></RouteErrorBoundary>
          } />
          <Route path="/advisor/clients/:id" element={
            <RouteErrorBoundary><ClientDetail /></RouteErrorBoundary>
          } />
          <Route path="/advisor/clients/:id/discovery/:section" element={
            <RouteErrorBoundary><ClientDiscovery /></RouteErrorBoundary>
          } />
          <Route path="/advisor/clients/:id/profile" element={
            <RouteErrorBoundary><ClientProfile /></RouteErrorBoundary>
          } />

          {/* UX-24: Catch-all 404 route */}
          <Route path="*" element={
            <RouteErrorBoundary><NotFound /></RouteErrorBoundary>
          } />
        </Routes>
        </SessionTimeoutWrapper>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
