import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Landing
import { LandingPage } from './pages/LandingPage'

// Consumer pages
import { ConsumerHome } from './pages/consumer/ConsumerHome'
import { DiscoveryStart } from './pages/consumer/DiscoveryStart'
import { DiscoverySection } from './pages/consumer/DiscoverySection'
import { ProfileSummary } from './pages/consumer/ProfileSummary'

// Advisor pages
import { AdvisorDashboard } from './pages/advisor/AdvisorDashboard'
import { ClientList } from './pages/advisor/ClientList'
import { AddClient } from './pages/advisor/AddClient'
import { ClientDetail } from './pages/advisor/ClientDetail'
import { ClientDiscovery } from './pages/advisor/ClientDiscovery'
import { ClientProfile } from './pages/advisor/ClientProfile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing / Mode Selection */}
        <Route path="/" element={<LandingPage />} />

        {/* Consumer Routes */}
        <Route path="/consumer" element={<ConsumerHome />} />
        <Route path="/consumer/discovery" element={<DiscoveryStart />} />
        <Route path="/consumer/discovery/:section" element={<DiscoverySection />} />
        <Route path="/consumer/profile" element={<ProfileSummary />} />

        {/* Advisor Routes */}
        <Route path="/advisor" element={<AdvisorDashboard />} />
        <Route path="/advisor/clients" element={<ClientList />} />
        <Route path="/advisor/clients/new" element={<AddClient />} />
        <Route path="/advisor/clients/:id" element={<ClientDetail />} />
        <Route path="/advisor/clients/:id/discovery/:section" element={<ClientDiscovery />} />
        <Route path="/advisor/clients/:id/profile" element={<ClientProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
