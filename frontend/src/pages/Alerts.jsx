import { useState, useEffect, useCallback } from 'react'
import { getAlerts, resolveAlert } from '../api/client'
import { LoadingSkeleton, EmptyState } from '../components/UXStates'

function Icon({ name, className = '' }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

const SEV = {
    CRITICAL: {
        color: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-600',
        barColor: 'bg-rose-500', dot: 'bg-rose-600', shadow: 'shadow-[0_0_20px_rgba(225,29,72,0.4)]',
        iconName: 'dangerous', iconBg: 'bg-rose-600',
    },
    WARNING: {
        color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/50',
        barColor: 'bg-amber-500', dot: 'bg-amber-500', shadow: '',
        iconName: 'warning', iconBg: 'bg-amber-500',
    },
}

export default function Alerts() {
    const [alerts, setAlerts] = useState([])
    const [loading, setLoading] = useState(true)
    const [resolving, setResolving] = useState(null)
    const [filter, setFilter] = useState('All')

    const fetch = useCallback(async () => {
        try { const r = await getAlerts(); setAlerts(r.data) }
        catch { } finally { setLoading(false) }
    }, [])

    useEffect(() => {
        fetch()
        const t = setInterval(fetch, 12000)
        return () => clearInterval(t)
    }, [fetch])

    const handleResolve = async (id) => {
        setAlerts(prev => prev.filter(a => a.id !== id))
        setResolving(id)
        try { await resolveAlert(id) } catch { await fetch() }
        setResolving(null)
    }

    const critical = alerts.filter(a => a.severity === 'CRITICAL')
    const warnings = alerts.filter(a => a.severity === 'WARNING')
    const filtered = filter === 'All' ? alerts : alerts.filter(a => a.severity === filter)

    return (
        <div className="flex-1 overflow-y-auto relative z-10 text-white">
            <div className="max-w-4xl mx-auto px-6 py-10 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-white">System Alerts</h1>
                        <p className="text-slate-400 mt-2 text-sm">Real-time diagnostic timeline of unresolved issues across your sectors.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex h-9 items-center gap-2 rounded-lg bg-emerald-500 text-slate-900 px-4 font-bold hover:bg-emerald-400 transition-colors">
                            <Icon name="add_alert" className="text-lg" /><span className="text-sm">New Rule</span>
                        </button>
                        <button className="flex h-9 items-center gap-2 rounded-lg px-4 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm">
                            <Icon name="history" className="text-lg" /><span>History</span>
                        </button>
                    </div>
                </div>

                {/* Filter pills */}
                <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                    <button onClick={() => setFilter('All')} className={`flex h-9 shrink-0 items-center gap-2 rounded-full px-4 font-semibold text-sm shadow transition-colors ${filter === 'All' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                        <Icon name="filter_list" className="text-xl" /><span>All Alerts</span>
                        <span className={`text-xs rounded-full px-2 py-0.5 ml-1 ${filter === 'All' ? 'bg-slate-900 text-white' : 'bg-slate-700 text-slate-300'}`}>{alerts.length}</span>
                    </button>
                    <button onClick={() => setFilter('CRITICAL')} className={`flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm border transition-colors ${filter === 'CRITICAL' ? 'bg-rose-900/40 border-rose-500 text-rose-300' : 'bg-slate-800 border-rose-900/30 text-rose-400 hover:bg-rose-950/20'}`}>
                        <Icon name="error" className="text-xl" /><span className="font-medium">Critical</span>
                        <span className="bg-rose-900/50 text-rose-200 text-xs rounded-full px-2 py-0.5 ml-1">{critical.length}</span>
                    </button>
                    <button onClick={() => setFilter('WARNING')} className={`flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm border transition-colors ${filter === 'WARNING' ? 'bg-amber-900/40 border-amber-500 text-amber-300' : 'bg-slate-800 border-amber-900/30 text-amber-400 hover:bg-amber-950/20'}`}>
                        <Icon name="warning" className="text-xl" /><span className="font-medium">Warning</span>
                        <span className="bg-amber-900/50 text-amber-200 text-xs rounded-full px-2 py-0.5 ml-1">{warnings.length}</span>
                    </button>
                </div>

                {loading && <LoadingSkeleton count={3} variant="row" />}

                {!loading && filtered.length === 0 && (
                    <EmptyState
                        icon="check_circle"
                        title="All Clear"
                        subtitle="No active alerts — all chambers are within safe environmental limits."
                    />
                )}

                {/* Timeline */}
                {!loading && filtered.length > 0 && (
                    <div className="grid grid-cols-[60px_1fr] gap-x-6 relative">
                        {/* Vertical line */}
                        <div className="absolute left-[29px] top-4 bottom-0 w-0.5 bg-gradient-to-b from-rose-500 via-amber-500 to-slate-700" />

                        {filtered.map((alert, i) => {
                            const s = SEV[alert.severity] || SEV.WARNING
                            const isCrit = alert.severity === 'CRITICAL'
                            return (
                                <div key={alert.id} className="contents">
                                    {/* Icon */}
                                    <div className="flex flex-col items-center pt-2 relative z-10">
                                        {isCrit ? (
                                            <div className={`size-14 rounded-full bg-slate-950 border-4 border-rose-500/20 flex items-center justify-center ${s.shadow}`}>
                                                <div className="size-8 rounded-full bg-rose-600 flex items-center justify-center animate-pulse">
                                                    <Icon name={s.iconName} className="text-white text-xl" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="size-10 rounded-full bg-slate-950 border-2 border-amber-500/20 flex items-center justify-center">
                                                <div className="size-4 rounded-full bg-amber-500" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Card */}
                                    <div className="pb-8 pl-0">
                                        <div style={{ background: 'rgba(24,44,37,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}
                                            className={`rounded-xl overflow-hidden group hover:border-${isCrit ? 'rose' : 'amber'}-500/30 transition-all duration-300 ${isCrit ? 'pulse-border-subtle' : ''}`}>
                                            <div className={`border-l-4 ${s.border} flex flex-col`}>
                                                <div className="p-5 flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`${s.bg} ${s.color} text-xs font-bold px-2 py-1 rounded uppercase tracking-wider`}>{alert.severity}</span>
                                                            <span className="text-slate-400 text-xs flex items-center gap-1">
                                                                <Icon name="schedule" className="text-sm" />
                                                                {new Date(alert.created_at).toLocaleTimeString()}
                                                            </span>
                                                        </div>
                                                        <button className="text-slate-500 hover:text-white transition-colors">
                                                            <Icon name="more_horiz" />
                                                        </button>
                                                    </div>
                                                    <h3 className="text-white font-bold mb-2 text-base">{alert.message}</h3>
                                                    <p className="text-slate-300 text-sm mb-4 leading-relaxed">{alert.recommended_action}</p>
                                                    <div className="flex flex-wrap gap-3 items-center">
                                                        <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/10">{alert.chamber_name}</span>
                                                        <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/10">{alert.crop_affected}</span>
                                                        <button
                                                            onClick={() => handleResolve(alert.id)}
                                                            disabled={resolving === alert.id}
                                                            className={`ml-auto flex items-center gap-2 font-semibold py-2 px-4 rounded-lg transition-colors text-sm ${isCrit
                                                                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/50'
                                                                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                                                                }`}
                                                        >
                                                            <Icon name="build_circle" className="text-lg" />
                                                            {resolving === alert.id ? 'Resolving...' : 'Resolve Issue'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <style>{`
        .pulse-border-subtle { animation: subtlePulse 2s infinite; }
        @keyframes subtlePulse { 0%,100%{box-shadow:0 0 0 rgba(225,29,72,0.2)} 50%{box-shadow:0 0 16px rgba(225,29,72,0.4)} }
      `}</style>
        </div>
    )
}
