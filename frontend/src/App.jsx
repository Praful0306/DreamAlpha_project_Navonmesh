import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import NavigationBar from './components/NavigationBar'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Alerts from './pages/Alerts'
import Dispatch from './pages/Dispatch'
import Notifications from './pages/Notifications'
import Weather from './pages/Weather'
import Market from './pages/Market'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <NavigationBar />

        {/* Global Background Orbs */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[#0f172a] dark:bg-[#0f172a]" />
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-sky-500/6 rounded-full blur-[140px]" />
          <div className="absolute top-[40%] left-[-5%] w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]" />
        </div>

        <main className="flex-1 overflow-hidden relative w-full flex flex-col z-10">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
      </BrowserRouter>
    </ThemeProvider>
  )
}
