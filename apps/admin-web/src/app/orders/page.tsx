'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const statusConfig = {
  PENDING: { label: '未調理', color: 'bg-yellow-100 text-yellow-800', next: 'PREPARING' },
  PREPARING: { label: '調理中', color: 'bg-blue-100 text-blue-800', next: 'READY' },
  READY: { label: '完成', color: 'bg-green-100 text-green-800', next: 'SERVED' },
  SERVED: { label: '提供済み', color: 'bg-gray-100 text-gray-800', next: null },
}

export default function OrdersPage() {
  const queryClient = useQueryClient()
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const { data: orders } = useQuery({
    queryKey: ['orders', selectedStatus],
    queryFn: async () => {
      const params = selectedStatus ? { status: selectedStatus } : {}
      const res = await axios.get(`${API_URL}/api/orders`, { params })
      return res.data
    },
    refetchInterval: 10000,
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      axios.patch(`${API_URL}/api/orders/${orderId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">注文管理</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex space-x-2 overflow-x-auto">
          <button
            onClick={() => setSelectedStatus(null)}
            className={`px-4 py-2 rounded-lg ${!selectedStatus ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            すべて
          </button>
          {Object.entries(statusConfig).map(([status, config]) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg ${selectedStatus === status ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border'}`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {orders?.map((order: any) => {
            const config = statusConfig[order.status as keyof typeof statusConfig]
            return (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-2xl font-bold">#{order.orderNumber}</h3>
                <div className="mt-4">
                  {order.items?.map((item: any) => (
                    <div key={item.id}>{item.menuItem?.name} × {item.quantity}</div>
                  ))}
                </div>
                {config?.next && (
                  <button
                    onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: config.next })}
                    className="mt-4 w-full bg-indigo-600 text-white py-2 rounded"
                  >
                    次へ
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
