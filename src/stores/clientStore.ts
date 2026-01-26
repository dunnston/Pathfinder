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
  ProfileStatus,
} from '@/types';

interface ClientState {
  // All clients for the current advisor
  clients: Client[];
  // Currently selected client ID
  selectedClientId: string | null;
  // Current filters
  filters: ClientFilters;
  // Current sort options
  sortOptions: ClientSortOptions;
}

interface ClientActions {
  // Add a new client
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => string;
  // Update an existing client
  updateClient: (clientId: string, updates: Partial<Client>) => void;
  // Remove a client (archives, doesn't delete)
  archiveClient: (clientId: string) => void;
  // Permanently delete a client
  deleteClient: (clientId: string) => void;
  // Select a client
  selectClient: (clientId: string | null) => void;
  // Update filters
  setFilters: (filters: ClientFilters) => void;
  // Update sort options
  setSortOptions: (options: ClientSortOptions) => void;
  // Update client's profile status
  updateClientProfileStatus: (clientId: string, status: ProfileStatus) => void;
  // Get filtered and sorted clients
  getFilteredClients: () => Client[];
  // Clear all data
  reset: () => void;
}

type ClientStore = ClientState & ClientActions;

// Generate a simple unique ID
function generateId(): string {
  return `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

const initialState: ClientState = {
  clients: [],
  selectedClientId: null,
  filters: {},
  sortOptions: {
    field: 'lastUpdated',
    direction: 'desc',
  },
};

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addClient: (clientData) => {
        const id = generateId();
        const now = new Date();
        const newClient: Client = {
          ...clientData,
          id,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          clients: [...state.clients, newClient],
        }));

        return id;
      },

      updateClient: (clientId, updates) =>
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? { ...client, ...updates, updatedAt: new Date() }
              : client
          ),
        })),

      archiveClient: (clientId) =>
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? { ...client, clientStatus: 'archived' as ClientStatus, updatedAt: new Date() }
              : client
          ),
          selectedClientId:
            state.selectedClientId === clientId ? null : state.selectedClientId,
        })),

      deleteClient: (clientId) =>
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== clientId),
          selectedClientId:
            state.selectedClientId === clientId ? null : state.selectedClientId,
        })),

      selectClient: (clientId) => set({ selectedClientId: clientId }),

      setFilters: (filters) => set({ filters }),

      setSortOptions: (sortOptions) => set({ sortOptions }),

      updateClientProfileStatus: (clientId, status) =>
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? { ...client, profileStatus: status, updatedAt: new Date() }
              : client
          ),
        })),

      getFilteredClients: () => {
        const { clients, filters, sortOptions } = get();

        let filtered = [...clients];

        // Apply filters
        if (filters.status?.length) {
          filtered = filtered.filter((c) => filters.status!.includes(c.clientStatus));
        }
        if (filters.profileStatus?.length) {
          filtered = filtered.filter((c) => filters.profileStatus!.includes(c.profileStatus));
        }
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (c) =>
              c.firstName.toLowerCase().includes(query) ||
              c.lastName.toLowerCase().includes(query) ||
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
              comparison = `${a.lastName} ${a.firstName}`.localeCompare(
                `${b.lastName} ${b.firstName}`
              );
              break;
            case 'lastUpdated':
              comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
              break;
            case 'status':
              comparison = a.clientStatus.localeCompare(b.clientStatus);
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
      // Custom serialization for Date objects
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          // Restore Date objects in clients
          if (data.state?.clients) {
            data.state.clients = data.state.clients.map((client: Client) => ({
              ...client,
              createdAt: new Date(client.createdAt),
              updatedAt: new Date(client.updatedAt),
              lastContactDate: client.lastContactDate
                ? new Date(client.lastContactDate)
                : undefined,
              nextActionDate: client.nextActionDate
                ? new Date(client.nextActionDate)
                : undefined,
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
