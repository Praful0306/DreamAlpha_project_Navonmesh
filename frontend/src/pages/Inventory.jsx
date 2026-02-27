/**
 * AgriStoreSmart — Inventory Risk Management
 * Upgraded: Storage Start + Expiry Dates, dynamic risk bars, live chamber API,
 *           premium right slide-over drawer with auto-expiry calculation
 * Navomesh 2026 | Problem 26010
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { getInventory, addBatch, getChambers } from '../api/client'
import { LoadingSkeleton, EmptyState } from '../components/UXStates'

/* ── Crop shelf-life data (days) ──────────────────────────────────────────── */
const CROP_SHELF = {
    Tomatoes: 14, Potatoes: 90, Onions: 120,
    Rice: 365, Wheat: 365, Mangoes: 21, Bananas: 10,
}
const CROPS = Object.keys(CROP_SHELF)

function Icon({ name, className = '' }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

/* ── Utility: format a date string as "Feb 27, 2026" ─────────────────────── */
function fmtDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
}

/* ── Compute expiry from stored_date + crop shelf life ───────────────────── */
function calcExpiry(storedDate, cropName) {
    if (!storedDate || !cropName) return null
    const shelf = CROP_SHELF[cropName] || 30
    const d = new Date(storedDate)
    d.setDate(d.getDate() + shelf)
    return d
}

/* ── Dynamic risk info based on days remaining to expiry ─────────────────── */
function riskFromDays(expiryDate) {
    if (!expiryDate) return { pct: 50, color: 'bg-amber-500', text: 'text-amber-400', label: 'Unknown' }
    const today = new Date()
    const msDiff = expiryDate - today
    const daysLeft = Math.ceil(msDiff / 86400000)
    if (daysLeft <= 0) return { pct: 100, color: 'bg-rose-500', text: 'text-rose-400', label: 'Expired', daysLeft: 0 }
    if (daysLeft <= 5) return { pct: 90, color: 'bg-rose-500', text: 'text-rose-400', label: 'Critical', daysLeft }
    if (daysLeft <= 14) return { pct: 65, color: 'bg-amber-500', text: 'text-amber-400', label: 'Warning', daysLeft }
    return { pct: 20, color: 'bg-emerald-500', text: 'text-emerald-400', label: 'Safe', daysLeft }
}

/* ── Slide-Over Drawer ───────────────────────────────────────────────────── */
function AddBatchDrawer({ open, onClose, chambers, onSaved }) {
    const today = new Date().toISOString().split('T')[0]
    const [form, setForm] = useState({
        farmer_name: '', crop_name: 'Tomatoes', quantity_kg: '',
        chamber_id: chambers[0]?.id || '1',
    })
    const [submitting, setSubmitting] = useState(false)
    const [msg, setMsg] = useState('')
    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

    // reset when opened
    useEffect(() => {
        if (open) { setForm(f => ({ ...f, chamber_id: chambers[0]?.id || '1' })); setMsg('') }
    }, [open, chambers])

    // auto-calculate expiry
    const expiryDate = calcExpiry(today, form.crop_name)
    const shelfDays = CROP_SHELF[form.crop_name] || 30

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.farmer_name || !form.quantity_kg) { setMsg('⚠ All fields are required'); return }
        if (parseFloat(form.quantity_kg) <= 0) { setMsg('⚠ Quantity must be greater than 0'); return }
        setSubmitting(true); setMsg('')
        try {
            await addBatch({ ...form, quantity_kg: parseFloat(form.quantity_kg), chamber_id: parseInt(form.chamber_id) })
            setMsg('✅ Batch saved successfully!')
            setForm({ farmer_name: '', crop_name: 'Tomatoes', quantity_kg: '', chamber_id: chambers[0]?.id || '1' })
            await onSaved()
            setTimeout(onClose, 1400)
        } catch (err) {
            const detail = err?.response?.data?.detail
            if (err?.code === 'ERR_NETWORK') setMsg('❌ Cannot reach backend — start uvicorn on port 8000')
            else if (detail) setMsg(`❌ ${detail}`)
            else setMsg('❌ Failed to save batch')
        }
        setSubmitting(false)
    }

    return (
        <>
            {/* Backdrop */}
            {open && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />}

            {/* Slide-over panel */}
            <div className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col
                transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500 shrink-0" />

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 shrink-0">
                    <div>
                        <h2 className="text-lg font-black text-white">Add New Batch</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Fill details to register produce for storage.</p>
                    </div>
                    <button onClick={onClose} className="rounded-xl bg-white/5 p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                        <Icon name="close" className="text-[20px]" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                    {/* Farmer Name */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                            <Icon name="person" className="text-[13px] mr-1" />Farmer Name
                        </label>
                        <input type="text" value={form.farmer_name} onChange={set('farmer_name')}
                            placeholder="e.g. Ram Singh"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500/60 focus:outline-none transition-colors" />
                    </div>

                    {/* Crop Type */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                            <Icon name="grass" className="text-[13px] mr-1" />Crop Type
                        </label>
                        <select value={form.crop_name} onChange={set('crop_name')}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white appearance-none focus:border-emerald-500/60 focus:outline-none transition-colors">
                            {CROPS.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                        </select>

                        {/* Shelf life chip */}
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                            <Icon name="schedule" className="text-[14px]" />
                            <span>Shelf life: <span className="text-emerald-400 font-semibold">{shelfDays} days</span></span>
                            <span className="text-slate-600">·</span>
                            <span>Expires: <span className="text-amber-400 font-semibold">{fmtDate(expiryDate)}</span></span>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                            <Icon name="scale" className="text-[13px] mr-1" />Quantity (kg)
                        </label>
                        <input type="number" value={form.quantity_kg} onChange={set('quantity_kg')}
                            placeholder="0"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500/60 focus:outline-none transition-colors" />
                    </div>

                    {/* Chamber — from live API */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                            <Icon name="warehouse" className="text-[13px] mr-1" />Chamber Assignment
                        </label>
                        <select value={form.chamber_id} onChange={set('chamber_id')}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white appearance-none focus:border-emerald-500/60 focus:outline-none transition-colors">
                            {chambers.length > 0
                                ? chambers.map(ch => (
                                    <option key={ch.id} value={ch.id} className="bg-slate-900">
                                        {ch.name} — {ch.location} ({ch.status})
                                    </option>
                                ))
                                : [1, 2, 3, 4].map(i => (
                                    <option key={i} value={i} className="bg-slate-900">
                                        Chamber {['A', 'B', 'C', 'D'][i - 1]}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Expiry Preview card */}
                    <div className="rounded-xl bg-white/5 border border-white/8 p-4 space-y-2">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Storage Preview</p>
                        {[
                            { label: 'Storage Start', value: fmtDate(today), icon: 'event', cls: 'text-sky-400' },
                            { label: 'Expiry Date', value: fmtDate(expiryDate), icon: 'event_busy', cls: 'text-amber-400' },
                            { label: 'Storage Window', value: `${shelfDays} days`, icon: 'hourglass', cls: 'text-emerald-400' },
                        ].map(r => (
                            <div key={r.label} className="flex items-center justify-between text-sm">
                                <span className="text-slate-500 flex items-center gap-1.5">
                                    <Icon name={r.icon} className={`text-[14px] ${r.cls}`} />
                                    {r.label}
                                </span>
                                <span className={`font-semibold ${r.cls}`}>{r.value}</span>
                            </div>
                        ))}
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-slate-800 shrink-0 space-y-3">
                    {msg && (
                        <p className={`text-sm text-center font-medium ${msg.includes('✅') ? 'text-emerald-400' : 'text-rose-400'}`}>{msg}</p>
                    )}
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={submitting}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_22px_rgba(16,185,129,0.4)] hover:scale-[1.02] transition-all disabled:opacity-50">
                            {submitting
                                ? <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                : <Icon name="add" className="text-[18px]" />
                            }
                            {submitting ? 'Saving…' : 'Save Batch'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

/* ── Row options menu ─────────────────────────────────────────────────────── */
function RowMenu({ batch }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    useEffect(() => {
        const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [])

    const items = [
        { icon: 'bar_chart', label: 'View Analytics', cls: 'text-white', fn: () => alert(`Analytics for Batch #${String(batch.id).padStart(4, '0')}`) },
        { icon: 'local_shipping', label: 'Send to Dispatch', cls: 'text-emerald-400', fn: () => alert(`Batch #${String(batch.id).padStart(4, '0')} queued for dispatch.`) },
        { icon: 'report', label: 'Flag as Compromised', cls: 'text-rose-400', fn: () => alert(`Batch #${String(batch.id).padStart(4, '0')} flagged.`) },
    ]
    return (
        <div ref={ref} className="relative">
            <button onClick={() => setOpen(o => !o)} className="text-slate-500 hover:text-emerald-400 transition-colors p-1.5 rounded-lg hover:bg-white/5">
                <Icon name="more_vert" className="text-xl" />
            </button>
            {open && (
                <div className="absolute right-0 bottom-full mb-1 z-50 w-48 rounded-xl border border-slate-700 bg-slate-800/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-fade-in">
                    {items.map((item, i) => (
                        <button key={i} onClick={() => { item.fn(); setOpen(false) }}
                            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${item.cls}`}>
                            <Icon name={item.icon} className="text-[16px]" />
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

/* ── Main Page ────────────────────────────────────────────────────────────── */
export default function Inventory() {
    const [batches, setBatches] = useState([])
    const [chambers, setChambers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [filter, setFilter] = useState('All')

    const fetchData = useCallback(async () => {
        try {
            const [invRes, chRes] = await Promise.all([getInventory(), getChambers()])
            setBatches(invRes.data)
            setChambers(chRes.data)
        } catch { /* backend offline */ } finally { setLoading(false) }
    }, [])

    useEffect(() => { fetchData() }, [fetchData])

    /* Derived stats */
    const totalKg = batches.reduce((s, b) => s + b.quantity_kg, 0)
    const high = batches.filter(b => b.risk_score === 'HIGH').length
    const medium = batches.filter(b => b.risk_score === 'MEDIUM').length
    const capacity = batches.length > 0 ? Math.min(Math.round((totalKg / 53000) * 100), 100) : 0

    const filtered = filter === 'All' ? batches
        : filter === 'High Risk' ? batches.filter(b => b.risk_score === 'HIGH')
            : filter === 'Warning' ? batches.filter(b => b.risk_score === 'MEDIUM')
                : batches.filter(b => b.risk_score === 'LOW')

    return (
        <div className="flex-1 overflow-y-auto relative z-10 text-white p-6 lg:p-10">
            <div className="mx-auto max-w-7xl flex flex-col gap-8 pb-20">

                {/* ── Header ───────────────────────────────────────────── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-1">
                            <Icon name="inventory_2" className="text-lg" />
                            <span>Warehouse — All Chambers</span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">Inventory Risk Management</h1>
                        <p className="text-slate-400 text-sm mt-1">Real-time tracking of batch quality, expiry dates, and storage risks.</p>
                    </div>
                    <button onClick={() => setShowForm(true)}
                        className="shrink-0 flex items-center gap-2 px-5 h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.03] transition-all">
                        <Icon name="add" className="text-[20px]" />
                        Add Batch
                    </button>
                </div>

                {/* ── KPI Cards ────────────────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-xl border border-slate-800 bg-slate-800/50 backdrop-blur-sm">
                        <div className="p-2 rounded-lg bg-slate-700 text-slate-400 w-fit mb-3"><Icon name="layers" /></div>
                        <p className="text-slate-400 text-xs font-medium">Total Batches</p>
                        <h3 className="text-2xl font-bold text-white mt-0.5">{batches.length}</h3>
                    </div>
                    <div className="p-5 rounded-xl border border-rose-900/30 bg-rose-900/10 backdrop-blur-sm">
                        <div className="flex justify-between items-start mb-3">
                            <div className="p-2 rounded-lg bg-rose-900/40 text-rose-400 w-fit"><Icon name="warning" /></div>
                            {high > 0 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-900/30 text-rose-400">{high} alert{high > 1 ? 's' : ''}</span>}
                        </div>
                        <p className="text-rose-300 text-xs font-medium">Critical Risk</p>
                        <h3 className="text-2xl font-bold text-rose-200 mt-0.5">{high}</h3>
                    </div>
                    <div className="p-5 rounded-xl border border-amber-900/30 bg-amber-900/10 backdrop-blur-sm">
                        <div className="p-2 rounded-lg bg-amber-900/40 text-amber-400 w-fit mb-3"><Icon name="error" /></div>
                        <p className="text-amber-300 text-xs font-medium">Warning Level</p>
                        <h3 className="text-2xl font-bold text-amber-200 mt-0.5">{medium}</h3>
                    </div>
                    <div className="p-5 rounded-xl border border-slate-800 bg-slate-800/50 backdrop-blur-sm">
                        <div className="p-2 rounded-lg bg-slate-700 text-slate-400 w-fit mb-3"><Icon name="warehouse" /></div>
                        <p className="text-slate-400 text-xs font-medium">Capacity Utilized</p>
                        <div className="flex items-end justify-between mt-0.5">
                            <h3 className="text-2xl font-bold text-white">{capacity}%</h3>
                            <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden mb-1">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${capacity}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Table ────────────────────────────────────────────── */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-lg overflow-hidden">
                    {/* Table header bar */}
                    <div className="p-5 border-b border-slate-700/50 flex flex-wrap gap-3 justify-between items-center">
                        <h3 className="text-base font-bold text-white">Stored Batches</h3>
                        <div className="flex gap-2">
                            {['All', 'High Risk', 'Warning', 'Safe'].map(f => (
                                <button key={f} onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading && <div className="p-6"><LoadingSkeleton count={4} variant="row" /></div>}

                    {!loading && filtered.length === 0 && (
                        <EmptyState icon="inventory_2"
                            title={filter === 'All' ? 'No Batches Yet' : `No ${filter} Batches`}
                            subtitle={filter === 'All' ? 'Add your first produce batch to start tracking inventory.' : `No batches with ${filter.toLowerCase()} status.`}
                            action={filter === 'All' ? { label: 'Add First Batch', onClick: () => setShowForm(true) } : undefined}
                        />
                    )}

                    {!loading && filtered.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead>
                                    <tr className="bg-slate-900/50 border-b border-slate-700/50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                                        {['Batch', 'Farmer', 'Crop', 'Quantity', 'Storage Start', 'Expiry Date', 'Risk Factor', ''].map(h => (
                                            <th key={h} className="px-5 py-3.5">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/30 text-sm">
                                    {filtered.map(b => {
                                        const expiry = calcExpiry(b.stored_date || b.created_at, b.crop_name)
                                        const risk = riskFromDays(expiry)
                                        return (
                                            <tr key={b.id} className="hover:bg-slate-800/40 transition-colors group">
                                                {/* Batch ID */}
                                                <td className="px-5 py-4 font-bold text-white">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`h-2 w-2 rounded-full shrink-0 ${risk.label === 'Critical' || risk.label === 'Expired' ? 'bg-rose-500' :
                                                                risk.label === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500'
                                                            }`} />
                                                        #{String(b.id).padStart(4, '0')}
                                                    </div>
                                                </td>
                                                {/* Farmer */}
                                                <td className="px-5 py-4 text-slate-300">{b.farmer_name}</td>
                                                {/* Crop */}
                                                <td className="px-5 py-4 text-slate-300">
                                                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-xs font-medium">{b.crop_name}</span>
                                                </td>
                                                {/* Quantity */}
                                                <td className="px-5 py-4 text-slate-300 font-mono text-xs">{b.quantity_kg.toLocaleString()} kg</td>
                                                {/* Storage Start */}
                                                <td className="px-5 py-4 text-slate-400 text-xs">{fmtDate(b.stored_date || b.created_at)}</td>
                                                {/* Expiry Date */}
                                                <td className="px-5 py-4 text-xs">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className={`font-semibold ${risk.text}`}>{fmtDate(expiry)}</span>
                                                        {risk.daysLeft !== undefined && (
                                                            <span className="text-slate-500 text-[10px]">
                                                                {risk.daysLeft > 0 ? `${risk.daysLeft}d left` : 'Expired'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                {/* Risk Factor — dynamic progress bar */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2.5 min-w-[120px]">
                                                        <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                                                            <div className={`h-full rounded-full transition-all ${risk.color}`}
                                                                style={{ width: `${risk.pct}%` }} />
                                                        </div>
                                                        <span className={`text-xs font-bold shrink-0 ${risk.text}`}>{risk.label}</span>
                                                    </div>
                                                </td>
                                                {/* Actions */}
                                                <td className="px-5 py-4 text-right"><RowMenu batch={b} /></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                            <div className="p-4 border-t border-slate-700/50 flex items-center justify-between text-sm">
                                <p className="text-slate-500">Showing <span className="text-white font-semibold">{filtered.length}</span> of <span className="text-white font-semibold">{batches.length}</span> batches</p>
                                <p className="text-slate-500 text-xs">Total: <span className="text-emerald-400 font-semibold">{totalKg.toLocaleString()} kg</span> stored</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Slide-over Drawer */}
            <AddBatchDrawer open={showForm} onClose={() => setShowForm(false)} chambers={chambers} onSaved={fetchData} />
        </div>
    )
}
