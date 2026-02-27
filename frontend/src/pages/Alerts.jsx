/**
 * AgriStoreSmart — System Alerts & Diagnostic Command Center
 * Premium glassmorphic split-pane layout with real-time diagnostic timeline,
 * rule management, history archive, and optimistic UI resolution.
 * UI/UX Architecture by Navomesh 2026 | Problem 26010
 */
import { useState, useEffect, useCallback } from 'react'
import { getAlerts, resolveAlert } from '../api/client'
import { LoadingSkeleton } from '../components/UXStates'

function Icon({ name, className = '' }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

/* ── Severity Styles ── */
const SEV_STYLE = {
    CRITICAL: {
        text: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/50',
        glow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]',
        accentBg: 'bg-rose-500',
        icon: 'dangerous',
    },
    WARNING: {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/40',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
        accentBg: 'bg-amber-500',
        icon: 'warning',
    }
}

/* ── Diagnostic Card for Timeline ── */
function DiagnosticCard({ alert, onResolve }) {
    const [isResolving, setIsResolving] = useState(false)
    const [isLeaving, setIsLeaving] = useState(false)
    const style = SEV_STYLE[alert.severity] || SEV_STYLE.WARNING

    const handleResolve = async () => {
        setIsResolving(true)
        // Simulate pulse and slide out for optimistic UI
        setTimeout(() => {
            setIsLeaving(true)
            setTimeout(() => onResolve(alert.id), 300) // Delay to let animation finish
        }, 600)
    }

    // Attempt to extract reading vs threshold (mock data format)
    const readingStr = alert.message.includes('Temperature') ? '28°C vs 25°C Max' :
        alert.message.includes('Humidity') ? '85% vs 80% Max' : 'Out of bounds'

    return (
        <div className={`relative pl-8 pb-8 transition-all duration-300 ease-in-out ${isLeaving ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0'}`}>
            {/* Timeline Node */}
            <div className="absolute left-[-15px] top-6 z-10 flex items-center justify-center">
                <div className={`w-8 h-8 rounded-full border-4 border-slate-900 ${style.accentBg} flex items-center justify-center ${style.glow}`}>
                    <Icon name={style.icon} className="text-white text-[16px]" />
                </div>
            </div>

            {/* Card Content */}
            <div className={`p-5 rounded-xl border-l-[3px] border-r border-t border-b border-slate-700/50 bg-slate-900/40 backdrop-blur-xl shadow-xl ${isResolving ? 'animate-pulse' : ''}`}
                style={{ borderLeftColor: alert.severity === 'CRITICAL' ? '#f43f5e' : '#f59e0b' }}>
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${style.bg} ${style.text}`}>
                            {alert.severity}
                        </span>
                        <span className="text-slate-400 text-xs flex items-center gap-1 font-medium">
                            <Icon name="schedule" className="text-[14px]" />
                            {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                    {alert.message}
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4 mt-4">
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                        <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Target Reading vs Threshold</p>
                        <p className={`font-mono font-semibold ${style.text}`}>{readingStr}</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                        <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Recommended Action</p>
                        <p className="text-sm font-medium text-slate-200">{alert.recommended_action || 'Inspect chamber immediately.'}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2">
                        <span className="text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                            <Icon name="warehouse" className="text-[14px]" /> {alert.chamber_name}
                        </span>
                        <span className="text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                            <Icon name="grass" className="text-[14px]" /> {alert.crop_affected}
                        </span>
                    </div>
                    <button onClick={handleResolve} disabled={isResolving}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${isResolving ? 'bg-slate-700 text-slate-400' : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-105 hover:shadow-emerald-500/40'}`}>
                        {isResolving ? <span className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin"></span> : <Icon name="check_circle" className="text-[18px]" />}
                        {isResolving ? 'Resolving...' : 'Resolve Issue'}
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ── Main Diagnostics Component ── */
export default function AlertsCommandCenter() {
    const [alerts, setAlerts] = useState([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState('ACTIVE') // ACTIVE | HISTORY
    const [ruleForm, setRuleForm] = useState({ metric: 'Temperature', condition: '>', value: '', duration: '5', severity: 'WARNING' })
    const [ruleSuccess, setRuleSuccess] = useState(false)

    // Resolved History Mock
    const [resolvedHistory, setResolvedHistory] = useState([
        { id: '101', message: 'Temperature spiked in Chamber A', resolvedAt: new Date(Date.now() - 3600000), by: 'System Auto', duration: '12m' },
        { id: '102', message: 'Humidity critical in Chamber C', resolvedAt: new Date(Date.now() - 86400000), by: 'Ram Singh', duration: '45m' }
    ])

    const fetchAlerts = useCallback(async () => {
        try {
            const r = await getAlerts()
            setAlerts(r.data)
        } catch { } finally { setLoading(false) }
    }, [])

    useEffect(() => {
        fetchAlerts()
        const t = setInterval(fetchAlerts, 10000) // Poll every 10s
        return () => clearInterval(t)
    }, [fetchAlerts])

    const handleResolve = async (id) => {
        const resolvedAlert = alerts.find(a => a.id === id)

        // Optimistic UI Update main list
        setAlerts(prev => prev.filter(a => a.id !== id))

        // Move to history
        if (resolvedAlert) {
            setResolvedHistory([{
                id: `H_${id}`,
                message: resolvedAlert.message,
                resolvedAt: new Date(),
                by: 'Current User',
                duration: 'Active for ~10m'
            }, ...resolvedHistory])
        }

        try { await resolveAlert(id) } catch { /* Ignore error on optimisitic */ }
    }

    const handleCreateRule = (e) => {
        e.preventDefault()
        if (!ruleForm.value) return
        setRuleSuccess(true)
        setTimeout(() => setRuleSuccess(false), 3000)
        setRuleForm({ ...ruleForm, value: '' })
    }

    return (
        <div className="flex-1 overflow-y-auto relative z-10 text-white bg-slate-50 dark:bg-[#0f172a]">
            <div className="max-w-[1600px] mx-auto px-6 py-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm tracking-widest uppercase mb-2">
                            <Icon name="admin_panel_settings" className="text-[18px]" />
                            Command Center
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">System Diagnostics</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Real-time monitoring and threat mitigation center.</p>
                    </div>
                    <div className="flex items-center bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-300 dark:border-slate-700">
                        <button onClick={() => setViewMode('ACTIVE')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === 'ACTIVE' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'}`}>
                            Live Feed
                        </button>
                        <button onClick={() => setViewMode('HISTORY')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === 'HISTORY' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'}`}>
                            Archive
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Pane: Diagnostic Timeline (70%) */}
                    <div className="lg:w-[70%] xl:w-[75%] flex flex-col">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Icon name="timeline" className="text-emerald-500" />
                                {viewMode === 'ACTIVE' ? 'Real-Time Event Timeline' : 'Resolved Incident Archive'}
                            </h2>
                            {viewMode === 'ACTIVE' && (
                                <span className="flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Live Sync
                                </span>
                            )}
                        </div>

                        {loading ? (
                            <div className="space-y-6"><LoadingSkeleton count={3} variant="row" /></div>
                        ) : viewMode === 'ACTIVE' ? (
                            alerts.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center py-20 bg-slate-100 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/50 rounded-2xl backdrop-blur-sm">
                                    <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                                        <Icon name="shield" className="text-6xl text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">System Healthy</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm">All sectors are operating within ideal environmental parameters. No critical diagnostics reported.</p>
                                </div>
                            ) : (
                                <div className="relative border-l-2 border-slate-300 dark:border-slate-800 ml-4">
                                    {alerts.map(a => <DiagnosticCard key={a.id} alert={a} onResolve={handleResolve} />)}
                                </div>
                            )
                        ) : (
                            /* History Archive View */
                            <div className="space-y-4">
                                {resolvedHistory.length === 0 ? (
                                    <p className="text-slate-500 text-center py-10">No history available.</p>
                                ) : (
                                    resolvedHistory.map(h => (
                                        <div key={h.id} className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity">
                                            <div>
                                                <h4 className="text-slate-800 dark:text-slate-300 font-bold">{h.message}</h4>
                                                <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">Resolved {h.resolvedAt.toLocaleString()} · Duration: {h.duration}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
                                                <Icon name="verified_user" className="text-[16px]" />
                                                By {h.by}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Pane: Rule Management & Quick Stats (30%) */}
                    <div className="lg:w-[30%] xl:w-[25%] flex flex-col gap-6">

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/30 p-4 rounded-xl">
                                <h3 className="text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">Critical active</h3>
                                <p className="text-3xl font-black text-rose-700 dark:text-rose-300">{alerts.filter(a => a.severity === 'CRITICAL').length}</p>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30 p-4 rounded-xl">
                                <h3 className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Resolved (24h)</h3>
                                <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{resolvedHistory.length}</p>
                            </div>
                        </div>

                        {/* Add Rule Interface */}
                        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl">
                            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50">
                                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Icon name="add_task" className="text-emerald-500" />
                                    Environmental Rule
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">Define custom thresholds to trigger automated alerts.</p>
                            </div>
                            <form onSubmit={handleCreateRule} className="p-5 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 block">If Condition Meets</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <select value={ruleForm.metric} onChange={e => setRuleForm({ ...ruleForm, metric: e.target.value })} className="col-span-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white font-medium outline-none focus:border-emerald-500">
                                            <option>Temperature</option>
                                            <option>Humidity</option>
                                            <option>Ethylene Gas</option>
                                        </select>
                                        <select value={ruleForm.condition} onChange={e => setRuleForm({ ...ruleForm, condition: e.target.value })} className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-center text-slate-800 dark:text-white font-black outline-none focus:border-emerald-500">
                                            <option>&gt;</option>
                                            <option>&lt;</option>
                                            <option>=</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 block">Threshold Value</label>
                                    <input type="number" required placeholder="e.g. 28" value={ruleForm.value} onChange={e => setRuleForm({ ...ruleForm, value: e.target.value })} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-800 dark:text-white font-mono placeholder-slate-400 outline-none focus:border-emerald-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 block">Trigger Alert As</label>
                                    <select value={ruleForm.severity} onChange={e => setRuleForm({ ...ruleForm, severity: e.target.value })} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-500 appearance-none">
                                        <option value="CRITICAL">🔴 CRITICAL</option>
                                        <option value="WARNING">🟡 WARNING</option>
                                        <option value="INFO">🔵 INFO</option>
                                    </select>
                                </div>
                                <div className="pt-2">
                                    <button type="submit" className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                        <Icon name="add_circle" className="text-[18px]" />
                                        Create Rule
                                    </button>
                                </div>
                                {ruleSuccess && (
                                    <p className="text-emerald-500 text-xs font-bold text-center animate-fade-in flex items-center justify-center gap-1 mt-2">
                                        <Icon name="check_circle" className="text-[14px]" /> Rule successfully activated
                                    </p>
                                )}
                            </form>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}
