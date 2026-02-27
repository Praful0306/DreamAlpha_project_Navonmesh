/**
 * AgriStoreSmart — NavigationBar
 * Responsive: hamburger menu on mobile, full nav on md+
 * Navomesh 2026 | Problem 26010
 */

import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { getAlertStats } from '../api/client'
import { useTheme } from '../context/ThemeContext'

const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/inventory', label: 'Inventory', icon: 'inventory_2' },
    { to: '/alerts', label: 'Alerts', icon: 'notifications_active' },
    { to: '/dispatch', label: 'Logistics', icon: 'local_shipping' },
]

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
            } catch { /* backend may not be running */ }
        }
        fetchStats()
        const timer = setInterval(fetchStats, 10000)
        return () => clearInterval(timer)
    }, [])

    // Close mobile menu on route change
    const handleNavClick = () => setMobileOpen(false)

    return (
        <>
            {/* ── Main Header ───────────────────────────────────────── */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-border-dark bg-surface-darker px-4 md:px-6 sticky top-0 z-50">

                {/* Left — Logo + Search */}
                <div className="flex items-center gap-3 md:gap-8">
                    {/* Hamburger (mobile only) */}
                    <button
                        className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setMobileOpen(o => !o)}
                        aria-label="Toggle menu"
                    >
                        <span className="material-symbols-outlined text-[22px]">
                            {mobileOpen ? 'close' : 'menu'}
                        </span>
                    </button>

                    {/* Logo */}
                    <div className="flex items-center gap-2.5 text-white">
                        <div className="flex items-center justify-center rounded bg-primary/20 p-1.5 text-primary">
                            <span className="material-symbols-outlined text-xl">agriculture</span>
                        </div>
                        <h2 className="text-base font-bold tracking-tight hidden sm:block">Elite AgriStoreSmart</h2>
                    </div>

                    {/* Search bar (desktop) */}
                    <div className="relative hidden w-56 lg:block">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input
                            className="w-full rounded-lg border border-transparent bg-surface-dark py-2 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                            placeholder="Search dispatch, driver..."
                            type="text"
                        />
                    </div>
                </div>

                {/* Centre — Desktop Nav */}
                <nav className="hidden md:flex items-center gap-5 h-full">
                    {navLinks.map(link => (
                        <NavLink key={link.to} to={link.to} className={({ isActive }) =>
                            `relative text-sm font-medium transition-colors h-16 flex items-center border-b-2 
                            ${isActive
                                ? 'text-primary border-primary'
                                : 'text-slate-400 hover:text-primary border-transparent hover:border-primary/40'
                            }`
                        }>
                            {link.label}
                            {link.to === '/alerts' && alertCount > 0 && (
                                <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${critical > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                    {alertCount}
                                </span>
                            )}
                        </NavLink>
                    ))}
                    <a className="text-sm font-medium text-slate-400 hover:text-primary transition-colors flex items-center h-16 border-b-2 border-transparent" href="#">Market</a>
                    <a className="text-sm font-medium text-slate-400 hover:text-primary transition-colors flex items-center h-16 border-b-2 border-transparent" href="#">Weather</a>
                </nav>

                {/* Right — Actions */}
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-white hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(16,183,127,0.3)]">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        <span className="hidden sm:inline">New Dispatch</span>
                    </button>

                    {/* Notification Bell */}
                    <button className="rounded-lg bg-surface-dark p-2 text-slate-400 hover:text-white hover:bg-border-dark transition-colors relative">
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                        {alertCount > 0 && (
                            <span className={`absolute top-1.5 right-1.5 h-2 w-2 rounded-full ring-2 ring-surface-darker ${critical > 0 ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'}`} />
                        )}
                    </button>

                    {/* Theme Toggle (hidden on xs) */}
                    <button onClick={toggle} className="hidden sm:flex rounded-lg bg-surface-dark p-2 text-slate-400 hover:text-white hover:bg-border-dark transition-colors">
                        <span className="material-symbols-outlined text-[20px]">{dark ? 'light_mode' : 'dark_mode'}</span>
                    </button>

                    {/* User Avatar */}
                    <button className="rounded-lg bg-surface-dark p-2 text-slate-400 hover:text-white hover:bg-border-dark transition-colors">
                        <span className="material-symbols-outlined text-[20px]">account_circle</span>
                    </button>
                </div>
            </header>

            {/* ── Mobile Slide-down Menu ─────────────────────────── */}
            {mobileOpen && (
                <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-surface-darker border-b border-border-dark shadow-2xl">
                    {/* Search (mobile) */}
                    <div className="px-4 pt-4 pb-2 relative">
                        <span className="material-symbols-outlined absolute left-7 top-1/2 translate-y-1 text-slate-400 text-lg">search</span>
                        <input
                            className="w-full rounded-lg border border-border-dark bg-surface-dark py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:border-primary focus:outline-none transition-colors"
                            placeholder="Search dispatch, driver..."
                            type="text"
                        />
                    </div>

                    <nav className="px-4 pb-4 flex flex-col gap-1">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                                    ${isActive
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`
                                }
                            >
                                <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                                {link.label}
                                {link.to === '/alerts' && alertCount > 0 && (
                                    <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${critical > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                        {alertCount}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                        <a
                            href="#"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                            onClick={handleNavClick}
                        >
                            <span className="material-symbols-outlined text-[20px]">show_chart</span>
                            Market
                        </a>
                        <a
                            href="#"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                            onClick={handleNavClick}
                        >
                            <span className="material-symbols-outlined text-[20px]">cloud</span>
                            Weather
                        </a>

                        {/* Theme toggle inside mobile menu */}
                        <button
                            onClick={() => { toggle(); setMobileOpen(false) }}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all w-full text-left mt-1 border-t border-border-dark pt-4"
                        >
                            <span className="material-symbols-outlined text-[20px]">{dark ? 'light_mode' : 'dark_mode'}</span>
                            {dark ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </nav>
                </div>
            )}

            {/* Overlay to close menu */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 top-16 z-30 bg-black/40 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}
        </>
    )
}
