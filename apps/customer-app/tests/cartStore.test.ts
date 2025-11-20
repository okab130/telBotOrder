import { describe, it, expect } from 'vitest'
import { useCartStore } from '../src/store/cartStore'

describe('CartStore', () => {
  it('should add item to cart', () => {
    const store = useCartStore.getState()
    store.clearCart()
    
    store.addItem({
      menuItemId: '1',
      name: 'Test Item',
      price: 1000,
      quantity: 2,
    })

    expect(store.items).toHaveLength(1)
    expect(store.items[0].quantity).toBe(2)
  })

  it('should calculate total correctly', () => {
    const store = useCartStore.getState()
    store.clearCart()
    
    store.addItem({ menuItemId: '1', name: 'Item 1', price: 1000, quantity: 2 })
    store.addItem({ menuItemId: '2', name: 'Item 2', price: 500, quantity: 3 })

    const total = store.getTotal()
    expect(total).toBe(3500)
  })
})
