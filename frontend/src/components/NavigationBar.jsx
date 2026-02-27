import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { getAlertStats } from '../api/client'
import { useTheme } from '../context/ThemeContext'

const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/inventory', label: 'Inventory' },
    { to: '/alerts', label: 'Alerts' },
    { to: '/dispatch', label: 'Logistics' },
]

export default function NavigationBar() {
    const { dark, toggle } = useTheme()
    const [alertCount, setAlertCount] = useState(0)
    const [critical, setCritical] = useState(0)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getAlertStats()
                setAlertCount(res.data.unresolved)
                setCritical(res.data.critical)
            } catch { /* backend might not be started yet */ }
        }
        fetchStats()
        const timer = setInterval(fetchStats, 10000)
        return () => clearInterval(timer)
    }, [])

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border-dark bg-surface-darker px-6 py-3 sticky top-0 z-50">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                    <div className="flex items-center justify-center rounded bg-primary/20 p-1.5 text-primary">
                        <span className="material-symbols-outlined text-xl">agriculture</span>
                    </div>
                    <h2 className="text-lg font-bold tracking-tight hidden sm:block">Elite AgriStoreSmart</h2>
                </div>
                <div className="relative hidden w-64 lg:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                    <input className="w-full rounded-lg border border-transparent bg-slate-100 dark:bg-surface-dark py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors" placeholder="Search dispatch, driver..." type="text" />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <nav className="hidden md:flex items-center gap-6 h-full">
                    {navLinks.map(link => (
                        <NavLink key={link.to} to={link.to} className={({ isActive }) =>
                            `relative text-sm font-medium transition-colors h-16 flex items-center border-b-2 ${isActive ? 'text-primary border-primary' : 'text-slate-500 dark:text-slate-300 hover:text-primary dark:hover:text-primary border-transparent hover:border-primary/50'}`
                        }>
                            {link.label}
                        </NavLink>
                    ))}
                    <a className="text-sm font-medium text-slate-500 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center h-16 border-b-2 border-transparent" href="#">Market</a>
                    <a className="text-sm font-medium text-slate-500 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center h-16 border-b-2 border-transparent" href="#">Weather</a>
                </nav>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white dark:text-background-dark hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(16,183,127,0.3)]">
                        <span className="material-symbols-outlined text-lg">add</span>
                        <span className="hidden sm:inline">New Dispatch</span>
                    </button>
                    <button className="rounded-lg bg-slate-100 dark:bg-surface-dark p-2 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-border-dark dark:hover:text-white transition-colors relative">
                        <span className="material-symbols-outlined">notifications</span>
                        {alertCount > 0 && <span className={`absolute top-2 right-2 h-2 w-2 rounded-full ring-2 dark:ring-surface-dark bg-rose-alert ${critical > 0 ? 'animate-pulse' : ''}`}></span>}
                    </button>
                    <button onClick={toggle} className="rounded-lg bg-slate-100 dark:bg-surface-dark p-2 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-border-dark dark:hover:text-white transition-colors relative hidden sm:flex">
                        <span className="material-symbols-outlined">{dark ? 'light_mode' : 'dark_mode'}</span>
                    </button>
                    <button className="rounded-lg bg-slate-100 dark:bg-surface-dark p-2 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-border-dark dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined">account_circle</span>
                    </button>
                </div>
            </div>
        </header>
    )
}
