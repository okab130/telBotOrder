import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import WebApp from '@twa-dev/sdk'
import { menuApi } from '../lib/api'
import { useCartStore } from '../store/cartStore'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  const { data: product } = useQuery({
    queryKey: ['menuItem', id],
    queryFn: () => menuApi.getMenuItem(id!).then(res => res.data),
    enabled: !!id,
  })

  const handleAddToCart = () => {
    if (product) {
      addItem({
        menuItemId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.imageUrl,
      })
      WebApp.showAlert('カートに追加しました')
      navigate('/menu')
    }
  }

  if (!product) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-white">
      <div className="aspect-square bg-gray-200">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {product.name}
        </h1>
        
        {product.description && (
          <p className="text-gray-600 mb-4">{product.description}</p>
        )}

        <div className="text-3xl font-bold text-indigo-600 mb-6">
          ¥{product.price.toLocaleString()}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            数量
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 font-bold"
            >
              -
            </button>
            <div className="text-2xl font-bold w-12 text-center">
              {quantity}
            </div>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleAddToCart}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl"
          >
            カートに追加 - ¥{(product.price * quantity).toLocaleString()}
          </button>
          
          <button
            onClick={() => navigate('/menu')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-xl"
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  )
}
