import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import WebApp from '@twa-dev/sdk'
import SessionStart from './pages/SessionStart'
import MenuList from './pages/MenuList'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import OrderHistory from './pages/OrderHistory'
import { useSessionStore } from './store/sessionStore'

function App() {
  const { sessionId } = useSessionStore()

  useEffect(() => {
    WebApp.ready()
    WebApp.expand()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SessionStart />} />
        <Route 
          path="/menu" 
          element={sessionId ? <MenuList /> : <Navigate to="/" />} 
        />
        <Route 
          path="/product/:id" 
          element={sessionId ? <ProductDetail /> : <Navigate to="/" />} 
        />
        <Route 
          path="/cart" 
          element={sessionId ? <Cart /> : <Navigate to="/" />} 
        />
        <Route 
          path="/orders" 
          element={sessionId ? <OrderHistory /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
