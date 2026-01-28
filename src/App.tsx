import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary, LoadingPage } from './components/common/ErrorBoundary'
import { SessionTimeoutWrapper } from './components/common/SessionTimeoutWrapper'
import { NotificationToast } from './components/common/NotificationToast'

// Landing - eagerly loaded for fast initial render
import { LandingPage } from './pages/LandingPage'

// Consumer pages - lazy loaded (SEC-9: code splitting)
const ConsumerHome = lazy(() => import('./pages/consumer/ConsumerHome').then(m => ({ default: m.ConsumerHome })))
const DiscoveryStart = lazy(() => import('./pages/consumer/DiscoveryStart').then(m => ({ default: m.DiscoveryStart })))
const DiscoverySection = lazy(() => import('./pages/consumer/DiscoverySection').then(m => ({ default: m.DiscoverySection })))
const ProfileSummary = lazy(() => import('./pages/consumer/ProfileSummary').then(m => ({ default: m.ProfileSummary })))
const InsightsPage = lazy(() => import('./pages/consumer/InsightsPage').then(m => ({ default: m.InsightsPage })))

// Dashboard pages - lazy loaded (SEC-9: code splitting)
const DashboardOverview = lazy(() => import('./pages/consumer/dashboard/DashboardOverview').then(m => ({ default: m.DashboardOverview })))
const RecommendationsPage = lazy(() => import('./pages/consumer/dashboard/RecommendationsPage').then(m => ({ default: m.RecommendationsPage })))
const FocusAreasPage = lazy(() => import('./pages/consumer/dashboard/FocusAreasPage').then(m => ({ default: m.FocusAreasPage })))
const IPSPage = lazy(() => import('./pages/consumer/dashboard/IPSPage').then(m => ({ default: m.IPSPage })))
const IPSAccountsPage = lazy(() => import('./pages/consumer/dashboard/IPSAccountsPage').then(m => ({ default: m.IPSAccountsPage })))
const RebalancePage = lazy(() => import('./pages/consumer/dashboard/RebalancePage').then(m => ({ default: m.RebalancePage })))
const SettingsPage = lazy(() => import('./pages/consumer/dashboard/SettingsPage').then(m => ({ default: m.SettingsPage })))
const IPSAllocationsPage = lazy(() => import('./pages/consumer/dashboard/IPSAllocationsPage').then(m => ({ default: m.IPSAllocationsPage })))

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
          <Route path="/consumer/insights" element={
            <RouteErrorBoundary><InsightsPage /></RouteErrorBoundary>
          } />

          {/* Dashboard Routes - wrapped with error boundary */}
          <Route path="/consumer/dashboard" element={
            <RouteErrorBoundary><DashboardOverview /></RouteErrorBoundary>
          } />
          <Route path="/consumer/dashboard/recommendations" element={
            <RouteErrorBoundary><RecommendationsPage /></RouteErrorBoundary>
          } />
          <Route path="/consumer/dashboard/focus-areas" element={
            <RouteErrorBoundary><FocusAreasPage /></RouteErrorBoundary>
          } />
          <Route path="/consumer/dashboard/ips" element={
            <RouteErrorBoundary><IPSPage /></RouteErrorBoundary>
          } />
          <Route path="/consumer/dashboard/ips/accounts" element={
            <RouteErrorBoundary><IPSAccountsPage /></RouteErrorBoundary>
          } />
          <Route path="/consumer/dashboard/ips/allocations" element={
            <RouteErrorBoundary><IPSAllocationsPage /></RouteErrorBoundary>
          } />
          <Route path="/consumer/dashboard/ips/rebalance" element={
            <RouteErrorBoundary><RebalancePage /></RouteErrorBoundary>
          } />
          <Route path="/consumer/dashboard/settings" element={
            <RouteErrorBoundary><SettingsPage /></RouteErrorBoundary>
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
        {/* Global toast notifications */}
        <NotificationToast />
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
