import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import NavigationBar from './components/NavigationBar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Alerts from './pages/Alerts'
import Dispatch from './pages/Dispatch'
import Notifications from './pages/Notifications'
import Weather from './pages/Weather'
import Market from './pages/Market'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Chatbot from './components/Chatbot'

// Wrapper to hide NavigationBar on the Landing Page
function AppLayout() {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  // Manage #root and body scrolling based on route
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      if (isLanding) {
        root.classList.remove('h-screen', 'overflow-hidden')
        root.classList.add('min-h-screen')
      } else {
        root.classList.add('h-screen', 'overflow-hidden')
        root.classList.remove('min-h-screen')
      }
    }
  }, [isLanding])

  return (
    <>
      <Chatbot />
      {!isLanding && <NavigationBar />}

      {/* Global Background Orbs - applied always but Landing page has its own solid bg to cover */}
      {!isLanding && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[#0f172a] dark:bg-[#0f172a]" />
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-sky-500/6 rounded-full blur-[140px]" />
          <div className="absolute top-[40%] left-[-5%] w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]" />
        </div>
      )}

      <main className={`flex-1 relative w-full flex flex-col z-10 ${isLanding ? 'overflow-x-hidden' : 'overflow-hidden'}`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/dispatch" element={<Dispatch />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/market" element={<Market />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ThemeProvider>
  )
}
