import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { menuApi } from '../lib/api'
import { useCartStore } from '../store/cartStore'

export default function MenuList() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const cartItems = useCartStore((state) => state.items)

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => menuApi.getCategories().then(res => res.data),
  })

  const { data: menuItems } = useQuery({
    queryKey: ['menuItems', selectedCategory],
    queryFn: () => menuApi.getMenuItems({ 
      categoryId: selectedCategory || undefined,
      available: true 
    }).then(res => res.data),
  })

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-2xl font-bold text-gray-800">メニュー</h1>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto px-4 pb-2 space-x-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              !selectedCategory
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            すべて
          </button>
          {categories?.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {menuItems?.map((item: any) => (
          <div
            key={item.id}
            onClick={() => navigate(`/product/${item.id}`)}
            className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition"
          >
            <div className="aspect-square bg-gray-200">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-3">
              <h3 className="font-medium text-gray-800 mb-1">{item.name}</h3>
              <p className="text-indigo-600 font-bold">¥{item.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={() => navigate('/cart')}
          className="fixed bottom-4 right-4 bg-indigo-600 text-white rounded-full shadow-lg px-6 py-3 flex items-center space-x-2"
        >
          <span>🛒</span>
          <span className="font-bold">{cartCount}</span>
        </button>
      )}
    </div>
  )
}
