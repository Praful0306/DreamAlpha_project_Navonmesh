/**
 * AgriStoreSmart — Notifications Page
 * Premium inbox for all system alerts with severity-coded timeline
 * Navomesh 2026 | Problem 26010
 */
import { useState, useEffect } from 'react'
import { getAlerts, resolveAlert } from '../api/client'

const SEV = {
    CRITICAL: { glow: 'border-l-rose-500', bg: 'bg-rose-500/10', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300', dot: 'bg-rose-500', icon: 'dangerous' },
    WARNING: { glow: 'border-l-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300', dot: 'bg-amber-500', icon: 'warning' },
    INFO: { glow: 'border-l-sky-500', bg: 'bg-sky-500/10', text: 'text-sky-400', badge: 'bg-sky-500/20 text-sky-300', dot: 'bg-sky-500', icon: 'info' },
}

export default function Notifications() {
    const [alerts, setAlerts] = useState([])
    const [loading, setLoading] = useState(true)
    const [read, setRead] = useState(new Set())
    const [filter, setFilter] = useState('All')

    useEffect(() => {
        const fetch = async () => {
            try { const r = await getAlerts(); setAlerts(r.data) }
            catch { } finally { setLoading(false) }
        }
        fetch()
        const t = setInterval(fetch, 15000)
        return () => clearInterval(t)
    }, [])

    const markRead = (id) => setRead(s => new Set(s).add(id))
    const markAll = () => setRead(new Set(alerts.map(a => a.id)))

    const handleResolve = async (id) => {
        markRead(id)
        setAlerts(prev => prev.filter(a => a.id !== id))
        try { await resolveAlert(id) } catch { }
    }

    const filtered = filter === 'All' ? alerts
        : filter === 'Unread' ? alerts.filter(a => !read.has(a.id))
            : alerts.filter(a => a.severity === filter)

    const unreadCount = alerts.filter(a => !read.has(a.id)).length

    return (
        <div className="flex-1 overflow-y-auto text-white">
            <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black tracking-tight">Notifications</h1>
                            {unreadCount > 0 && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white animate-pulse">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <p className="text-slate-400 text-sm">Centralized inbox for all system alerts and events.</p>
                    </div>
                    <button onClick={markAll}
                        className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 text-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">done_all</span>
                        Mark All Read
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                    {['All', 'Unread', 'CRITICAL', 'WARNING'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === f
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
                                }`}>
                            {f}
                            {f === 'Unread' && unreadCount > 0 && (
                                <span className="ml-1.5 bg-rose-500/30 text-rose-300 text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse border border-white/5" />
                        ))}
                    </div>
                )}

                {/* Empty */}
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl text-emerald-400">check_circle</span>
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-1">All Clear!</h3>
                        <p className="text-slate-400 text-sm">
                            {filter === 'Unread' ? 'No unread notifications.' : 'No alerts in this category.'}
                        </p>
                    </div>
                )}

                {/* Notification List */}
                {!loading && filtered.length > 0 && (
                    <div className="space-y-3">
                        {filtered.map(alert => {
                            const s = SEV[alert.severity] || SEV.WARNING
                            const isUnread = !read.has(alert.id)
                            return (
                                <div key={alert.id}
                                    onClick={() => markRead(alert.id)}
                                    className={`relative rounded-xl border border-white/8 border-l-4 ${s.glow} p-4 cursor-pointer transition-all hover:border-white/20 hover:scale-[1.01]
                                        ${isUnread ? 'bg-white/5' : 'bg-white/[0.02] opacity-70'}`}>

                                    {/* Unread dot */}
                                    {isUnread && (
                                        <span className={`absolute top-4 right-4 h-2 w-2 rounded-full ${s.dot}`} />
                                    )}

                                    <div className="flex items-start gap-3">
                                        <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                                            <span className={`material-symbols-outlined text-[18px] ${s.text}`}>{s.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.badge}`}>{alert.severity}</span>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(alert.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {alert.chamber_name && (
                                                    <span className="text-xs text-slate-500 border border-white/10 px-2 py-0.5 rounded-full bg-white/5">{alert.chamber_name}</span>
                                                )}
                                            </div>
                                            <p className={`font-semibold text-sm mb-0.5 ${isUnread ? 'text-white' : 'text-slate-400'}`}>{alert.message}</p>
                                            <p className="text-xs text-slate-500 line-clamp-1">{alert.recommended_action}</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex justify-end">
                                        <button onClick={e => { e.stopPropagation(); handleResolve(alert.id) }}
                                            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors">
                                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                            Resolve
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
