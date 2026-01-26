/**
 * Client Store
 * Manages advisor's client list for multi-client mode
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Client,
  ClientStatus,
  ClientFilters,
  ClientSortOptions,
  CreateClientInput,
  SectionProgress,
} from '@/types';

interface ClientState {
  clients: Client[];
  selectedClientId: string | null;
  filters: ClientFilters;
  sortOptions: ClientSortOptions;
}

interface ClientActions {
  addClient: (input: CreateClientInput) => Client;
  updateClient: (clientId: string, updates: Partial<Client>) => void;
  deleteClient: (clientId: string) => void;
  archiveClient: (clientId: string) => void;
  getClient: (clientId: string) => Client | undefined;
  setSelectedClient: (clientId: string | null) => void;
  setFilters: (filters: ClientFilters) => void;
  setSortOptions: (options: ClientSortOptions) => void;
  updateSectionProgress: (clientId: string, section: string, progress: number) => void;
  getFilteredClients: () => Client[];
  reset: () => void;
}

type ClientStore = ClientState & ClientActions;

function generateId(): string {
  return `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function calculateProfileCompletion(sectionProgress: SectionProgress): number {
  const sections = Object.values(sectionProgress);
  if (sections.length === 0) return 0;
  const total = sections.reduce((sum, progress) => sum + (progress || 0), 0);
  return total / 5; // 5 discovery sections
}

const initialState: ClientState = {
  clients: [],
  selectedClientId: null,
  filters: {},
  sortOptions: {
    field: 'updatedAt',
    direction: 'desc',
  },
};

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addClient: (input) => {
        const now = new Date();
        const newClient: Client = {
          id: generateId(),
          name: input.name,
          email: input.email,
          phone: input.phone,
          advisorNotes: input.advisorNotes,
          status: 'pending',
          profileCompletion: 0,
          sectionProgress: {},
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          clients: [...state.clients, newClient],
          selectedClientId: newClient.id,
        }));

        return newClient;
      },

      updateClient: (clientId, updates) =>
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? { ...client, ...updates, updatedAt: new Date() }
              : client
          ),
        })),

      deleteClient: (clientId) =>
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== clientId),
          selectedClientId:
            state.selectedClientId === clientId ? null : state.selectedClientId,
        })),

      archiveClient: (clientId) =>
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? { ...client, status: 'archived' as ClientStatus, updatedAt: new Date() }
              : client
          ),
          selectedClientId:
            state.selectedClientId === clientId ? null : state.selectedClientId,
        })),

      getClient: (clientId) => {
        return get().clients.find((c) => c.id === clientId);
      },

      setSelectedClient: (clientId) => set({ selectedClientId: clientId }),

      setFilters: (filters) => set({ filters }),

      setSortOptions: (sortOptions) => set({ sortOptions }),

      updateSectionProgress: (clientId, section, progress) =>
        set((state) => ({
          clients: state.clients.map((client) => {
            if (client.id !== clientId) return client;

            const newSectionProgress = {
              ...client.sectionProgress,
              [section]: progress,
            };
            const newProfileCompletion = calculateProfileCompletion(newSectionProgress);
            const newStatus: ClientStatus =
              newProfileCompletion === 1 ? 'completed' :
              newProfileCompletion > 0 ? 'active' :
              client.status;

            return {
              ...client,
              sectionProgress: newSectionProgress,
              profileCompletion: newProfileCompletion,
              status: newStatus,
              updatedAt: new Date(),
            };
          }),
        })),

      getFilteredClients: () => {
        const { clients, filters, sortOptions } = get();

        let filtered = [...clients];

        // Apply filters
        if (filters.status?.length) {
          filtered = filtered.filter((c) => filters.status!.includes(c.status));
        }
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (c) =>
              c.name.toLowerCase().includes(query) ||
              c.email?.toLowerCase().includes(query)
          );
        }
        if (filters.tags?.length) {
          filtered = filtered.filter((c) =>
            filters.tags!.some((tag) => c.tags?.includes(tag))
          );
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let comparison = 0;

          switch (sortOptions.field) {
            case 'name':
              comparison = a.name.localeCompare(b.name);
              break;
            case 'updatedAt':
              comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
              break;
            case 'profileCompletion':
              comparison = b.profileCompletion - a.profileCompletion;
              break;
            case 'status':
              comparison = a.status.localeCompare(b.status);
              break;
            default:
              comparison = 0;
          }

          return sortOptions.direction === 'asc' ? comparison : -comparison;
        });

        return filtered;
      },

      reset: () => set(initialState),
    }),
    {
      name: 'pathfinder-clients',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          if (data.state?.clients) {
            data.state.clients = data.state.clients.map((client: Client) => ({
              ...client,
              createdAt: new Date(client.createdAt),
              updatedAt: new Date(client.updatedAt),
            }));
          }
          return data;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
