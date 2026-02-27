import { useState, useEffect } from 'react'
import { getInventory, addBatch } from '../api/client'

const CROPS = ['Tomatoes', 'Potatoes', 'Onions', 'Rice', 'Wheat', 'Mangoes', 'Bananas']

function Icon({ name, className = '' }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

const RISK_BAR = {
    LOW: { color: 'bg-emerald-500', width: 'w-[12%]', text: 'text-emerald-400', label: 'Safe' },
    MEDIUM: { color: 'bg-amber-500', width: 'w-[50%]', text: 'text-amber-400', label: 'Warning' },
    HIGH: { color: 'bg-rose-500', width: 'w-[88%]', text: 'text-rose-400', label: 'Critical' },
}
const DOT = { LOW: 'bg-emerald-500', MEDIUM: 'bg-amber-500', HIGH: 'bg-rose-500' }

export default function Inventory() {
    const [batches, setBatches] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [formMsg, setFormMsg] = useState('')
    const [filter, setFilter] = useState('All')
    const [form, setForm] = useState({
        crop_name: 'Tomatoes', quantity_kg: '', farmer_name: '', chamber_id: '1',
    })

    const fetchData = async () => {
        try { const r = await getInventory(); setBatches(r.data) }
        catch { /* offline */ } finally { setLoading(false) }
    }

    useEffect(() => { fetchData() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.quantity_kg || !form.farmer_name) { setFormMsg('All fields required'); return }
        setSubmitting(true)
        try {
            await addBatch({ ...form, quantity_kg: parseFloat(form.quantity_kg), chamber_id: parseInt(form.chamber_id) })
            setFormMsg('Batch saved!')
            setForm({ crop_name: 'Tomatoes', quantity_kg: '', farmer_name: '', chamber_id: '1' })
            await fetchData()
            setTimeout(() => { setShowForm(false); setFormMsg('') }, 1200)
        } catch { setFormMsg('Failed to save batch') }
        setSubmitting(false)
    }

    const totalKg = batches.reduce((s, b) => s + b.quantity_kg, 0)
    const high = batches.filter(b => b.risk_score === 'HIGH').length
    const medium = batches.filter(b => b.risk_score === 'MEDIUM').length
    const capacity = batches.length > 0 ? Math.min(Math.round((totalKg / 53000) * 100), 100) : 0

    const filtered = filter === 'All' ? batches
        : filter === 'High Risk' ? batches.filter(b => b.risk_score === 'HIGH')
            : filter === 'Warning' ? batches.filter(b => b.risk_score === 'MEDIUM')
                : batches.filter(b => b.risk_score === 'LOW')

    return (
        <div className="flex-1 overflow-y-auto relative z-10 w-full text-slate-100 flex">
            {/* Main Content */}
            <div className={`flex-1 p-6 lg:p-10 transition-all ${showForm ? 'lg:pr-[384px]' : ''}`}>
                <div className={`mx-auto flex flex-col gap-8 pb-20 ${showForm ? 'max-w-4xl' : 'max-w-7xl'}`}>

                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-1">
                                <Icon name="inventory_2" className="text-lg" />
                                <span>Warehouse — All Chambers</span>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">Inventory Risk Management</h1>
                            <p className="text-slate-400 max-w-xl text-sm">Real-time monitoring of batch quality, environmental conditions, and storage risks.</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowForm(s => !s)}
                                className="flex items-center gap-2 px-4 h-10 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors font-medium text-sm shadow-lg shadow-emerald-500/20 group"
                            >
                                <Icon name={showForm ? 'close' : 'add'} className="text-xl group-hover:rotate-90 transition-transform" />
                                {showForm ? 'Cancel' : 'Add Batch'}
                            </button>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-6 rounded-xl border border-slate-800 bg-slate-800/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 rounded-lg bg-slate-700 text-slate-400"><Icon name="layers" /></div>
                            </div>
                            <p className="text-slate-400 text-sm font-medium">Total Batches</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{batches.length}</h3>
                        </div>
                        <div className="p-6 rounded-xl border border-rose-900/30 bg-rose-900/10 backdrop-blur-sm shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 rounded-lg bg-rose-900/40 text-rose-400"><Icon name="warning" /></div>
                                {high > 0 && <span className="text-xs font-semibold px-2 py-1 rounded-full bg-rose-900/30 text-rose-400 flex items-center gap-1"><Icon name="error" className="text-sm" />{high} alert{high !== 1 ? 's' : ''}</span>}
                            </div>
                            <p className="text-rose-300 text-sm font-medium">Critical Risk</p>
                            <h3 className="text-2xl font-bold text-rose-200 mt-1">{high}</h3>
                        </div>
                        <div className="p-6 rounded-xl border border-amber-900/30 bg-amber-900/10 backdrop-blur-sm shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 rounded-lg bg-amber-900/40 text-amber-400"><Icon name="error" /></div>
                            </div>
                            <p className="text-amber-300 text-sm font-medium">Warning Level</p>
                            <h3 className="text-2xl font-bold text-amber-200 mt-1">{medium}</h3>
                        </div>
                        <div className="p-6 rounded-xl border border-slate-800 bg-slate-800/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 rounded-lg bg-slate-700 text-slate-400"><Icon name="warehouse" /></div>
                            </div>
                            <p className="text-slate-400 text-sm font-medium">Capacity Utilized</p>
                            <div className="flex items-end justify-between mt-1">
                                <h3 className="text-2xl font-bold text-white">{capacity}%</h3>
                                <div className="w-24 h-2 bg-slate-700 rounded-full mb-2 overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${capacity}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-lg overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-slate-700/50 flex flex-wrap gap-4 justify-between items-center">
                            <h3 className="text-lg font-bold text-white">Stored Batches</h3>
                            <div className="flex gap-2">
                                {['All', 'High Risk', 'Warning', 'Safe'].map(f => (
                                    <button key={f} onClick={() => setFilter(f)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {loading ? (
                            <div className="flex justify-center items-center p-12 gap-3 text-slate-500">
                                <div className="spinner" /><span>Loading inventory...</span>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center p-16 text-slate-600">No batches found</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-900/50 border-b border-slate-700/50 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                            {['Batch', 'Farmer', 'Crop', 'Quantity', 'Stored', 'Days', 'Risk Level', ''].map(h => (
                                                <th key={h} className="px-6 py-4">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50 text-sm">
                                        {filtered.map(b => {
                                            const rs = RISK_BAR[b.risk_score] || RISK_BAR.LOW
                                            return (
                                                <tr key={b.id} className="group hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-white">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`size-2 rounded-full ${DOT[b.risk_score] || 'bg-emerald-500'}`} />
                                                            #{String(b.id).padStart(4, '0')}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-300">{b.farmer_name}</td>
                                                    <td className="px-6 py-4 text-slate-300">{b.crop_name}</td>
                                                    <td className="px-6 py-4 text-slate-300 font-mono">{b.quantity_kg.toLocaleString()} kg</td>
                                                    <td className="px-6 py-4 text-slate-500 text-xs">{b.stored_date}</td>
                                                    <td className="px-6 py-4 text-slate-300 font-bold">{b.days_stored}d</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                                <div className={`h-full ${rs.color} ${rs.width} rounded-full`} />
                                                            </div>
                                                            <span className={`${rs.text} font-semibold text-xs`}>{rs.label}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-slate-500 hover:text-emerald-400 transition-colors">
                                                            <Icon name="more_vert" className="text-xl" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                <div className="p-4 border-t border-slate-700/50 flex items-center justify-between">
                                    <p className="text-sm text-slate-500">Showing {filtered.length} of {batches.length} batches</p>
                                    <div className="flex gap-2">
                                        <button className="p-2 rounded-lg border border-slate-700 text-slate-500 hover:bg-slate-800"><Icon name="chevron_left" className="text-base" /></button>
                                        <button className="p-2 rounded-lg border border-slate-700 text-slate-500 hover:bg-slate-800"><Icon name="chevron_right" className="text-base" /></button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Slide-over Panel */}
            {showForm && (
                <div className="hidden lg:flex w-96 border-l border-slate-800 bg-slate-900 flex-col shadow-2xl relative z-10">
                    <div className="p-6 border-b border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold text-white">Add New Batch</h2>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-200"><Icon name="close" /></button>
                        </div>
                        <p className="text-sm text-slate-400">Enter inventory details for tracking.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 flex flex-col">
                        <div className="flex-1 space-y-5">
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">Farmer Name</label>
                                <div className="relative">
                                    <Icon name="person" className="absolute left-3 top-2.5 text-slate-400 text-xl" />
                                    <input type="text" placeholder="e.g. Ram Singh" value={form.farmer_name}
                                        onChange={e => setForm(p => ({ ...p, farmer_name: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 outline-none transition-colors" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">Crop Type</label>
                                <div className="relative">
                                    <Icon name="grass" className="absolute left-3 top-2.5 text-slate-400 text-xl" />
                                    <select value={form.crop_name} onChange={e => setForm(p => ({ ...p, crop_name: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white appearance-none focus:border-emerald-500 outline-none">
                                        {CROPS.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">Quantity (kg)</label>
                                <div className="relative">
                                    <Icon name="scale" className="absolute left-3 top-2.5 text-slate-400 text-xl" />
                                    <input type="number" placeholder="0" value={form.quantity_kg}
                                        onChange={e => setForm(p => ({ ...p, quantity_kg: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 outline-none transition-colors" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">Chamber</label>
                                <div className="relative">
                                    <Icon name="warehouse" className="absolute left-3 top-2.5 text-slate-400 text-xl" />
                                    <select value={form.chamber_id} onChange={e => setForm(p => ({ ...p, chamber_id: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white appearance-none focus:border-emerald-500 outline-none">
                                        {[1, 2, 3, 4].map(i => <option key={i} value={i}>Chamber {['A', 'B', 'C', 'D'][i - 1]}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-700 flex gap-3 items-center">
                            <button type="button" onClick={() => setShowForm(false)}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-600 text-slate-300 font-medium text-sm hover:bg-slate-800 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={submitting}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm shadow-lg shadow-emerald-500/25 transition-colors">
                                {submitting ? 'Saving...' : 'Save Batch'}
                            </button>
                        </div>
                        {formMsg && <p className={`text-sm text-center ${formMsg.includes('saved') ? 'text-emerald-400' : 'text-rose-400'}`}>{formMsg}</p>}
                    </form>
                </div>
            )}
        </div>
    )
}
