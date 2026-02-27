/**
 * AgriStoreSmart — NavigationBar
 * Responsive: hamburger menu on mobile, full nav on md+
 * All routes wired: Dashboard, Inventory, Alerts, Logistics, Market, Weather,
 *                   Notifications, Profile, Settings
 * Navomesh 2026 | Problem 26010
 */

import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { getAlertStats } from '../api/client'
import { useTheme } from '../context/ThemeContext'

const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/inventory', label: 'Inventory', icon: 'inventory_2' },
    { to: '/alerts', label: 'Alerts', icon: 'notifications_active' },
    { to: '/dispatch', label: 'Logistics', icon: 'local_shipping' },
    { to: '/market', label: 'Market', icon: 'show_chart' },
    { to: '/weather', label: 'Weather', icon: 'cloud' },
]

const moreLinks = [
    { to: '/notifications', label: 'Notifications', icon: 'inbox' },
    { to: '/profile', label: 'Profile', icon: 'person' },
    { to: '/settings', label: 'Settings', icon: 'settings' },
]

function NavItem({ link, alertCount, critical, onClick }) {
    return (
        <NavLink key={link.to} to={link.to} onClick={onClick}
            className={({ isActive }) =>
                `relative text-sm font-medium transition-colors h-16 flex items-center border-b-2
                ${isActive
                    ? 'text-emerald-400 border-emerald-400'
                    : 'text-slate-400 hover:text-emerald-400 border-transparent hover:border-emerald-400/40'
                }`
            }>
            {link.label}
            {link.to === '/alerts' && alertCount > 0 && (
                <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${critical > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {alertCount}
                </span>
            )}
            {link.to === '/notifications' && alertCount > 0 && (
                <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400">{alertCount}</span>
            )}
        </NavLink>
    )
}

export default function NavigationBar() {
    const { dark, toggle } = useTheme()
    const [alertCount, setAlertCount] = useState(0)
    const [critical, setCritical] = useState(0)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getAlertStats()
                setAlertCount(res.data.unresolved)
                setCritical(res.data.critical)
            } catch { }
        }
        fetchStats()
        const timer = setInterval(fetchStats, 10000)
        return () => clearInterval(timer)
    }, [])

    const close = () => setMobileOpen(false)

    return (
        <>
            {/* ── Main Header ───────────────────────────────────────── */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/8 bg-[#0b1426]/90 backdrop-blur-xl px-4 md:px-6 sticky top-0 z-50 shadow-lg shadow-black/20">

                {/* Left — Hamburger + Logo */}
                <div className="flex items-center gap-3 md:gap-6">
                    <button className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
                        <span className="material-symbols-outlined text-[22px]">{mobileOpen ? 'close' : 'menu'}</span>
                    </button>

                    <Link to="/dashboard" className="flex items-center gap-2.5 text-white">
                        <div className="flex items-center justify-center rounded-lg bg-emerald-500/20 p-1.5 text-emerald-400">
                            <span className="material-symbols-outlined text-xl">agriculture</span>
                        </div>
                        <h2 className="text-base font-bold tracking-tight hidden sm:block">Elite AgriStoreSmart</h2>
                    </Link>

                    {/* Search bar (desktop lg+) */}
                    <div className="relative hidden w-52 xl:block">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
                        <input className="w-full rounded-xl border border-white/8 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none transition-colors"
                            placeholder="Search dispatch, driver..." type="text" />
                    </div>
                </div>

                {/* Centre — Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-4 h-full">
                    {navLinks.map(link => (
                        <NavItem key={link.to} link={link} alertCount={alertCount} critical={critical} />
                    ))}
                </nav>

                {/* Right — Actions */}
                <div className="flex items-center gap-2">
                    {/* New Dispatch Button */}
                    <Link to="/dispatch"
                        className="hidden sm:flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        New Dispatch
                    </Link>

                    {/* Notification Bell */}
                    <Link to="/notifications" className="rounded-xl bg-white/5 p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors relative">
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                        {alertCount > 0 && (
                            <span className={`absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black text-white ring-2 ring-[#0b1426] ${critical > 0 ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'}`}>
                                {alertCount > 9 ? '9+' : alertCount}
                            </span>
                        )}
                    </Link>

                    {/* Theme Toggle */}
                    <button onClick={toggle} className="rounded-xl bg-white/5 p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors hidden sm:flex">
                        <span className="material-symbols-outlined text-[20px]">{dark ? 'light_mode' : 'dark_mode'}</span>
                    </button>

                    {/* Profile / Avatar */}
                    <Link to="/profile" className="rounded-xl bg-white/5 p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">account_circle</span>
                    </Link>
                </div>
            </header>

            {/* ── Mobile Slide-down Menu ─────────────────────────── */}
            {mobileOpen && (
                <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-[#0b1426]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
                    {/* Search */}
                    <div className="px-4 pt-4 pb-2 relative">
                        <span className="material-symbols-outlined absolute left-7 top-1/2 translate-y-1 text-slate-500 text-lg">search</span>
                        <input className="w-full rounded-xl border border-white/8 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none"
                            placeholder="Search dispatch, driver..." type="text" />
                    </div>

                    {/* Primary links */}
                    <nav className="px-4 pt-1 pb-2">
                        {[...navLinks, ...moreLinks].map(link => (
                            <NavLink key={link.to} to={link.to} onClick={close}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-0.5
                                    ${isActive
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`
                                }>
                                <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                                {link.label}
                                {link.to === '/alerts' && alertCount > 0 && (
                                    <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${critical > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>{alertCount}</span>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Bottom row: theme + sign out */}
                    <div className="px-4 pb-4 border-t border-white/8 pt-3 flex gap-2">
                        <button onClick={() => { toggle(); close() }}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 border border-white/8 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">{dark ? 'light_mode' : 'dark_mode'}</span>
                            {dark ? 'Light Mode' : 'Dark Mode'}
                        </button>
                        <Link to="/settings" onClick={close}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 border border-white/8 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">settings</span>
                        </Link>
                    </div>
                </div>
            )}

            {/* Backdrop overlay */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 top-16 z-30 bg-black/50 backdrop-blur-sm" onClick={close} />
            )}
        </>
    )
}
