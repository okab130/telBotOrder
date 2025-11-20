import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            モバイルオーダー管理
          </h1>
          <p className="text-xl text-gray-600">
            レストラン向け注文管理システム
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl text-center transition"
            >
              ダッシュボードへ
            </Link>
            
            <Link
              href="/orders"
              className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl text-center transition"
            >
              注文管理
            </Link>
            
            <Link
              href="/menu"
              className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-xl text-center transition"
            >
              メニュー管理
            </Link>
            
            <Link
              href="/tables"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl text-center transition"
            >
              テーブル管理
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
