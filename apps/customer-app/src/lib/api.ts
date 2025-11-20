import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const sessionApi = {
  start: (data: { tableId: string; partySize: number; telegramUserId: string }) =>
    api.post('/sessions/start', data),
  
  getActive: (telegramUserId: string) =>
    api.get(`/sessions/user/${telegramUserId}/active`),
}

export const menuApi = {
  getCategories: () => api.get('/categories'),
  
  getMenuItems: (params?: { categoryId?: string; available?: boolean }) =>
    api.get('/menu-items', { params }),
  
  getMenuItem: (id: string) => api.get(`/menu-items/${id}`),
}

export const orderApi = {
  create: (data: { sessionId: string; items: Array<{ menuItemId: string; quantity: number }> }) =>
    api.post('/orders', data),
  
  getSessionOrders: (sessionId: string) => api.get(`/orders/session/${sessionId}`),
}

export const cartStore = {
  items: [] as Array<{ menuItemId: string; name: string; price: number; quantity: number }>,
  
  add(item: { menuItemId: string; name: string; price: number; quantity: number }) {
    const existing = this.items.find(i => i.menuItemId === item.menuItemId)
    if (existing) {
      existing.quantity += item.quantity
    } else {
      this.items.push(item)
    }
  },
  
  remove(menuItemId: string) {
    this.items = this.items.filter(i => i.menuItemId !== menuItemId)
  },
  
  clear() {
    this.items = []
  },
  
  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  },
}
