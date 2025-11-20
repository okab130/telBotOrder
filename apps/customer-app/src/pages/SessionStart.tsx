import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import WebApp from '@twa-dev/sdk'
import { useMutation } from '@tanstack/react-query'
import { sessionApi } from '../lib/api'
import { useSessionStore } from '../store/sessionStore'

export default function SessionStart() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setSession } = useSessionStore()
  const [partySize, setPartySize] = useState(1)

  const tableId = searchParams.get('table')
  const telegramUserId = WebApp.initDataUnsafe?.user?.id?.toString() || 'demo-user'

  const startSessionMutation = useMutation({
    mutationFn: () => sessionApi.start({ tableId: tableId!, partySize, telegramUserId }),
    onSuccess: (response) => {
      const session = response.data
      setSession(session.id, tableId!, partySize)
      navigate('/menu')
    },
  })

  const handleStart = () => {
    if (!tableId) {
      WebApp.showAlert('テーブルIDが見つかりません')
      return
    }
    startSessionMutation.mutate()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🍽️</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            モバイルオーダー
          </h1>
          <p className="text-gray-600">
            テーブル: {tableId || '未指定'}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ご来店人数
          </label>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setPartySize(Math.max(1, partySize - 1))}
              className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-2xl font-bold"
            >
              -
            </button>
            <div className="text-4xl font-bold text-indigo-600 w-20 text-center">
              {partySize}
            </div>
            <button
              onClick={() => setPartySize(Math.min(20, partySize + 1))}
              className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-2xl font-bold"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={startSessionMutation.isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl text-lg disabled:opacity-50"
        >
          {startSessionMutation.isPending ? '準備中...' : '注文を始める'}
        </button>
      </div>
    </div>
  )
}
