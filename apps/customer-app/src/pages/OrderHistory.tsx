import { useQuery } from '@tanstack/react-query'
import { useSessionStore } from '../store/sessionStore'
import { orderApi } from '../lib/api'

const statusConfig = {
  PENDING: { label: '受付済み', emoji: '⏳', color: 'bg-yellow-100 text-yellow-800' },
  PREPARING: { label: '調理中', emoji: '👨‍🍳', color: 'bg-blue-100 text-blue-800' },
  READY: { label: '完成', emoji: '✅', color: 'bg-green-100 text-green-800' },
  SERVED: { label: '提供済み', emoji: '🍽️', color: 'bg-gray-100 text-gray-800' },
}

export default function OrderHistory() {
  const { sessionId } = useSessionStore()

  const { data: orders } = useQuery({
    queryKey: ['orders', sessionId],
    queryFn: () => orderApi.getSessionOrders(sessionId!).then(res => res.data),
    enabled: !!sessionId,
    refetchInterval: 5000,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">注文履歴</h1>
      </div>

      <div className="p-4 space-y-4">
        {!orders || orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-600">まだ注文がありません</p>
          </div>
        ) : (
          orders.map((order: any) => {
            const status = statusConfig[order.status as keyof typeof statusConfig]
            return (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800">
                      注文 #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString('ja-JP')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                    {status.emoji} {status.label}
                  </span>
                </div>

                <div className="space-y-2">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.menuItem.name} × {item.quantity}
                      </span>
                      <span className="text-gray-900 font-medium">
                        ¥{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t flex justify-between items-center">
                  <span className="font-medium text-gray-700">小計</span>
                  <span className="text-lg font-bold text-indigo-600">
                    ¥{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
