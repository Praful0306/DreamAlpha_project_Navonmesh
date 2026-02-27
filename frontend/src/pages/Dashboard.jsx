import { useState, useEffect, useCallback } from 'react'
import ChamberCard from '../components/ChamberCard'
import SensorChart from '../components/SensorChart'
import { ErrorBanner, LoadingSkeleton } from '../components/UXStates'
import { getChambers, simulateSensor, getAlertStats, getInventory, addChamber } from '../api/client'

export default function Dashboard() {
    const [chambers, setChambers] = useState([])
    const [alertStats, setAlertStats] = useState({ total_unresolved: 0, critical_count: 0 })
    const [inventoryQty, setInventoryQty] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [simulating, setSimulating] = useState(false)
    const [lastUpdate, setLastUpdate] = useState(null)

    // Add Chamber Modal State
    const [showAddModal, setShowAddModal] = useState(false)
    const [chamberForm, setChamberForm] = useState({ name: '', location: '', crop_stored: 'Tomatoes', capacity_tonnes: '' })
    const [submitting, setSubmitting] = useState(false)

    const fetchData = useCallback(async () => {
        try {
            const [chRes, alRes, invRes] = await Promise.all([
                getChambers(),
                getAlertStats(),
                getInventory()
            ])
            setChambers(chRes.data)
            setAlertStats(alRes.data)
            const totalKg = invRes.data.reduce((sum, b) => sum + (b.quantity_kg || 0), 0)
            setInventoryQty(totalKg)
            setError(null)
            setLastUpdate(new Date().toLocaleTimeString())
        } catch {
            setError('Cannot connect to backend — start uvicorn on port 8000')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
        const timer = setInterval(fetchData, 10000)
        return () => clearInterval(timer)
    }, [fetchData])

    const handleSimulate = async () => {
        setSimulating(true)
        try {
            await simulateSensor()
            setTimeout(fetchData, 800)
        } catch { setError('Backend not connected') }
        setSimulating(false)
    }

    const handleCreateChamber = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            await addChamber({
                name: chamberForm.name,
                location: chamberForm.location,
                crop_stored: chamberForm.crop_stored,
                capacity_tonnes: parseFloat(chamberForm.capacity_tonnes)
            })
            setShowAddModal(false)
            setChamberForm({ name: '', location: '', crop_stored: 'Tomatoes', capacity_tonnes: '' })
            fetchData()
        } catch (err) {
            setError('Failed to create chamber')
        } finally {
            setSubmitting(false)
        }
    }

    const activeCount = chambers.length
    const avgTemp = (chambers.reduce((acc, c) => acc + (c.latest_temp || 0), 0) / (activeCount || 1)).toFixed(1)
    const avgHum = (chambers.reduce((acc, c) => acc + (c.latest_humidity || 0), 0) / (activeCount || 1)).toFixed(0)
    const powerUsage = (activeCount * 1.8).toFixed(1)


    return (
        <div className="flex-1 overflow-y-auto relative z-10">
            <main className="flex-1 pt-6 md:pt-10 pb-32 px-4 md:px-6 lg:px-12 max-w-[1600px] mx-auto w-full relative z-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                System Operational
                            </span>
                            <span className="text-slate-500 text-xs font-mono">ID: AGR-8829-X</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Facility Overview</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">Real-time environmental telemetry across active growth chambers. Automated adjustments are currently <span className="text-primary font-medium">Active</span>.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 dark:bg-surface-glass border border-slate-200 dark:border-surface-border text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-sm font-medium shadow-sm">
                            <span className="material-symbols-outlined text-[20px]">download</span>
                            Export Log
                        </button>
                        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 transition-all text-sm font-medium">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            New Chamber
                        </button>
                    </div>
                </div>

                {error && (
                    <ErrorBanner message={error} onRetry={fetchData} />
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-10">
                    {/* Stat Card 1 */}
                    <div className="bg-white/50 dark:bg-surface-glass backdrop-blur-[20px] rounded-xl p-5 border border-slate-200 dark:border-surface-border shadow-sm relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 bg-primary/20 w-24 h-24 rounded-full blur-2xl group-hover:bg-primary/30 transition-all"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Chambers</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{activeCount || 0}<span className="text-slate-400 dark:text-slate-500 text-lg font-normal">/15</span></h3>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-primary">
                                <span className="material-symbols-outlined">grid_view</span>
                            </div>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-4/5 rounded-full"></div>
                        </div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-3 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            80% Capacity Utilization
                        </p>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white/50 dark:bg-surface-glass backdrop-blur-[20px] rounded-xl p-5 border border-slate-200 dark:border-surface-border shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Avg. Temperature</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{loading ? '--' : avgTemp}°C</h3>
                            </div>
                            <div className="p-2 rounded-lg bg-orange-100 dark:bg-white/5 text-amber-500 dark:text-amber-400">
                                <span className="material-symbols-outlined">thermostat</span>
                            </div>
                        </div>
                        <svg className="w-full h-8 stroke-amber-500/50 dark:stroke-amber-400/50 fill-none" preserveAspectRatio="none" viewBox="0 0 100 20">
                            <path d="M0 10 Q 10 5, 20 10 T 40 10 T 60 15 T 80 5 T 100 12" strokeWidth="2"></path>
                        </svg>
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">warning</span>
                            +0.8°C above target
                        </p>
                    </div>

                    {/* Stat Card 3: Storage */}
                    <div className="bg-white/50 dark:bg-surface-glass backdrop-blur-[20px] rounded-xl p-5 border border-slate-200 dark:border-surface-border shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Inventory</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{loading ? '--' : (inventoryQty / 1000).toFixed(1)} <span className="text-slate-500 text-sm font-normal">Tons</span></h3>
                            </div>
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-white/5 text-blue-500 dark:text-blue-400">
                                <span className="material-symbols-outlined">inventory_2</span>
                            </div>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full w-3/4 rounded-full"></div>
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-3 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">info</span>
                            75% Warehouse full
                        </p>
                    </div>

                    {/* Stat Card 4: Alerts */}
                    <div className="bg-white/50 dark:bg-surface-glass backdrop-blur-[20px] rounded-xl p-5 border border-rose-200 dark:border-rose-900/30 shadow-sm relative overflow-hidden group">
                        <div className="absolute -right-6 -bottom-6 bg-rose-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Alerts</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{loading ? '--' : alertStats.total_unresolved}</h3>
                            </div>
                            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400">
                                <span className="material-symbols-outlined">notification_important</span>
                            </div>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-rose-500 h-full w-full rounded-full"></div>
                        </div>
                        <p className="text-xs text-rose-600 dark:text-rose-400 mt-3 flex items-center gap-1 font-semibold tracking-wide">
                            <span className="material-symbols-outlined text-[14px]">warning</span>
                            {alertStats.critical_count} CRITICAL ISSUES
                        </p>
                    </div>
                </div>

                {/* Live Chambers Grid */}
                <div className="mb-6 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Live Chambers</h3>
                    <div className="flex gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-safe"></span> Safe</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-warning"></span> Warning</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-critical"></span> Critical</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full py-20 text-center text-slate-500">Loading chambers...</div>
                    ) : (
                        chambers.map(ch => (
                            <ChamberCard key={ch.id} chamber={ch} />
                        ))
                    )}

                    {/* Add New Placeholder */}
                    <button onClick={() => setShowAddModal(true)} className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-transparent flex flex-col items-center justify-center p-8 text-slate-500 hover:text-primary hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all group h-full min-h-[240px]">
                        <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                            <span className="material-symbols-outlined text-[24px]">add</span>
                        </div>
                        <span className="font-medium">Connect Chamber</span>
                        <span className="text-xs mt-1">Configure new sensor array</span>
                    </button>
                </div>

                {/* Historical Sensor Trends — always visible, charts show placeholder when offline */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-white">Historical Sensor Trends</h3>
                            <p className="text-sm text-slate-400 mt-1">Last 20 readings per chamber — auto-refreshes every 10s</p>
                        </div>
                        <span className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Live Polling
                        </span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {(chambers.length > 0 ? chambers : [
                            { id: 1, name: 'Chamber A', status: 'SAFE' },
                            { id: 2, name: 'Chamber B', status: 'WARNING' },
                            { id: 3, name: 'Chamber C', status: 'SAFE' },
                            { id: 4, name: 'Chamber D', status: 'CRITICAL' },
                        ]).map(ch => (
                            <SensorChart
                                key={ch.id}
                                chamberId={ch.id}
                                chamberName={ch.name}
                                status={ch.status}
                            />
                        ))}
                    </div>
                </div>
            </main>

            {/* Bottom Demo Controls */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-surface-glass backdrop-blur-md border-t border-slate-200 dark:border-white/10 z-40">
                <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Simulation Controls</span>
                        <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10"></div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors">
                                Normal Load
                            </button>
                            <button className="px-3 py-1.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors">
                                Peak Hours
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <button onClick={handleSimulate} disabled={simulating} className="flex items-center justify-center size-8 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm" title="Trigger Emergency">
                            <span className="material-symbols-outlined text-[18px]">emergency_home</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* Add Chamber Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-slide-up">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">sensors</span>
                                Connect Chamber
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleCreateChamber} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Chamber Target Name</label>
                                    <input required type="text" placeholder="e.g. Chamber D" value={chamberForm.name} onChange={e => setChamberForm({ ...chamberForm, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Location/Wing</label>
                                        <input required type="text" placeholder="e.g. West Wing" value={chamberForm.location} onChange={e => setChamberForm({ ...chamberForm, location: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Capacity (Tons)</label>
                                        <input required type="number" step="0.1" placeholder="e.g. 50" value={chamberForm.capacity_tonnes} onChange={e => setChamberForm({ ...chamberForm, capacity_tonnes: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Crop Preset Configuration</label>
                                    <select value={chamberForm.crop_stored} onChange={e => setChamberForm({ ...chamberForm, crop_stored: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white appearance-none">
                                        <option>Tomatoes</option><option>Potatoes</option><option>Mangoes</option><option>Onions</option><option>Apples</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                                    {submitting ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : <span className="material-symbols-outlined text-[18px]">add</span>}
                                    {submitting ? 'Connecting...' : 'Connect'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
