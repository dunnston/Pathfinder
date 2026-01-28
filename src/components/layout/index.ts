// Headers
export { Header, ConsumerHeader, AdvisorHeader } from './Header'

// Footers
export { Footer, SimpleFooter } from './Footer'

// Mode Selection
export { ModeSelector } from './ModeSelector'

// Consumer Layout
export { ConsumerLayout, ConsumerPage } from './ConsumerLayout'

// Wizard Layout
export { WizardLayout, WizardStep } from './WizardLayout'

// Advisor Layout
export { AdvisorLayout, AdvisorPage } from './AdvisorLayout'
export { AdvisorSidebar } from './AdvisorSidebar'

// Dashboard Layout
export { DashboardLayout, DashboardPage } from './DashboardLayout'

// Client Components
export { ClientCard, ClientCardCompact } from './ClientCard'
export { ClientListView } from './ClientListView'

// Onboarding
export { WelcomeModal } from './WelcomeModal'
// SEC-27: Hooks extracted to separate file - re-export from hooks
export { useHasSeenWelcome, useWelcomeModal, resetWelcomeState } from '@/hooks/useWelcome'
