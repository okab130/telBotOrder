import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import WebApp from '@twa-dev/sdk'
import { useCartStore } from '../store/cartStore'
import { useSessionStore } from '../store/sessionStore'
import { orderApi } from '../lib/api'

export default function Cart() {
  const navigate = useNavigate()
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore()
  const { sessionId } = useSessionStore()

  const createOrderMutation = useMutation({
    mutationFn: () => orderApi.create({
      sessionId: sessionId!,
      items: items.map(item => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      })),
    }),
    onSuccess: () => {
      clearCart()
      WebApp.showAlert('注文を送信しました！')
      navigate('/menu')
    },
  })

  const handleCheckout = () => {
    if (items.length === 0) return
    createOrderMutation.mutate()
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">カート</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-gray-600 mb-4">カートが空です</p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            メニューを見る
          </button>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {items.map((item) => (
            <div key={item.menuItemId} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start space-x-4">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-indigo-600 font-bold">
                    ¥{item.price.toLocaleString()}
                  </p>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.menuItemId, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.menuItemId)}
                      className="ml-auto text-red-600 hover:text-red-700"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-medium text-gray-700">合計</span>
            <span className="text-2xl font-bold text-indigo-600">
              ¥{getTotal().toLocaleString()}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={createOrderMutation.isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl disabled:opacity-50"
          >
            {createOrderMutation.isPending ? '送信中...' : '注文を確定'}
          </button>
        </div>
      )}
    </div>
  )
}
