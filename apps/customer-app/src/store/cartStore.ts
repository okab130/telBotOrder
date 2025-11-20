import { create } from 'zustand'

interface CartItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (menuItemId: string) => void
  updateQuantity: (menuItemId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addItem: (item) => set((state) => {
    const existingItem = state.items.find(i => i.menuItemId === item.menuItemId)
    if (existingItem) {
      return {
        items: state.items.map(i =>
          i.menuItemId === item.menuItemId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      }
    }
    return { items: [...state.items, item] }
  }),
  
  removeItem: (menuItemId) => set((state) => ({
    items: state.items.filter(i => i.menuItemId !== menuItemId),
  })),
  
  updateQuantity: (menuItemId, quantity) => set((state) => ({
    items: state.items.map(i =>
      i.menuItemId === menuItemId ? { ...i, quantity } : i
    ),
  })),
  
  clearCart: () => set({ items: [] }),
  
  getTotal: () => {
    const state = get()
    return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  },
}))
