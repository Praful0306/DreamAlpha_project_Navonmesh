import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import NavigationBar from './components/NavigationBar'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Alerts from './pages/Alerts'
import Dispatch from './pages/Dispatch'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <NavigationBar />

        {/* Global Background Effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-mesh-gradient"></div>
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-30 shadow-[0_0_100px_rgba(16,183,127,0.2)]"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] opacity-20"></div>
        </div>

        <main className="flex-1 overflow-hidden relative w-full flex flex-col z-10">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/dispatch" element={<Dispatch />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ThemeProvider>
  )
}
