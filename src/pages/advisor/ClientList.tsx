import { useClientStore } from '@/stores'
import { AdvisorLayout, AdvisorPage, ClientListView } from '@/components/layout'

export function ClientList(): JSX.Element {
  const { clients } = useClientStore()

  return (
    <AdvisorLayout
      title="Clients"
      subtitle={`${clients.length} total client${clients.length !== 1 ? 's' : ''}`}
    >
      <AdvisorPage>
        <ClientListView clients={clients} />
      </AdvisorPage>
    </AdvisorLayout>
  )
}
