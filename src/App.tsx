import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { ConsumerHome } from './pages/consumer/ConsumerHome'
import { AdvisorDashboard } from './pages/advisor/AdvisorDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing / Mode Selection */}
        <Route path="/" element={<LandingPage />} />

        {/* Consumer Routes */}
        <Route path="/consumer" element={<ConsumerHome />} />
        {/* TODO: Add discovery routes in Phase 5+ */}
        {/* <Route path="/consumer/discovery/:section" element={<DiscoverySection />} /> */}
        {/* <Route path="/consumer/profile" element={<ProfileSummary />} /> */}

        {/* Advisor Routes */}
        <Route path="/advisor" element={<AdvisorDashboard />} />
        {/* TODO: Add client management routes in Phase 4 */}
        {/* <Route path="/advisor/clients" element={<ClientList />} /> */}
        {/* <Route path="/advisor/clients/new" element={<AddClient />} /> */}
        {/* <Route path="/advisor/clients/:id" element={<ClientDetail />} /> */}
        {/* <Route path="/advisor/clients/:id/discovery/:section" element={<ClientDiscovery />} /> */}
        {/* <Route path="/advisor/clients/:id/profile" element={<ClientProfile />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
