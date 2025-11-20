import { create } from 'zustand'

interface SessionState {
  sessionId: string | null
  tableId: string | null
  partySize: number
  setSession: (sessionId: string, tableId: string, partySize: number) => void
  clearSession: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: null,
  tableId: null,
  partySize: 1,
  setSession: (sessionId, tableId, partySize) => 
    set({ sessionId, tableId, partySize }),
  clearSession: () => 
    set({ sessionId: null, tableId: null, partySize: 1 }),
}))
