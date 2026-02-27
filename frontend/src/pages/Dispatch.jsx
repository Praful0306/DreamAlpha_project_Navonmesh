/**
 * AgriStoreSmart — Dispatch Command Center
 * Fully interactive: Dispatch Modal, Three-Dot Options Menu, Live Weather
 * Navomesh 2026 | Problem 26010
 */
import { useState, useEffect, useRef } from 'react'
import { getWeather, getDispatch } from '../api/client'
import { LoadingSkeleton, EmptyState } from '../components/UXStates'

function Icon({ name, className = '' }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

/* ────────────────────────── Dispatch Config Modal ────────────────────────── */
function DispatchModal({ rec, onClose, onConfirm }) {
    const [form, setForm] = useState({
        mandi: rec?.recommended_market || '',
        vehicle: '',
        driver: '',
        delivery: '',
    })
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

    const handleConfirm = async () => {
        if (!form.vehicle || !form.driver || !form.delivery) return
        setLoading(true)
        await new Promise(r => setTimeout(r, 1200)) // simulate API
        setDone(true)
        setTimeout(() => { setLoading(false); onConfirm(rec); onClose() }, 1000)
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-slideUp">
                {/* Accent top bar */}
                <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />

                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-black text-white">Dispatch Configuration</h2>
                            <p className="text-sm text-slate-400 mt-0.5">
                                {rec?.crop_name} Batch · {rec?.quantity_kg?.toLocaleString()} kg · {rec?.farmer_name}
                            </p>
                        </div>
                        <button onClick={onClose} className="rounded-lg bg-white/5 p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                            <Icon name="close" className="text-[18px]" />
                        </button>
                    </div>

                    {done ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                                <Icon name="check_circle" className="text-3xl text-emerald-400" />
                            </div>
                            <h3 className="text-white font-bold text-lg">Dispatch Confirmed!</h3>
                            <p className="text-slate-400 text-sm mt-1">Vehicle {form.vehicle} assigned to {form.mandi}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Buyer / Mandi */}
                            <div className="relative">
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                                    <Icon name="storefront" className="text-[14px] mr-1" />Select Buyer / Mandi
                                </label>
                                <input value={form.mandi} onChange={set('mandi')}
                                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white text-sm placeholder-slate-500 focus:border-emerald-500/60 focus:outline-none transition-colors"
                                    placeholder="e.g. APMC Pune, Vashi Market..." />
                            </div>

                            {/* Vehicle ID */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                                    <Icon name="local_shipping" className="text-[14px] mr-1" />Transport Vehicle ID
                                </label>
                                <input value={form.vehicle} onChange={set('vehicle')}
                                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white text-sm placeholder-slate-500 focus:border-emerald-500/60 focus:outline-none transition-colors"
                                    placeholder="e.g. MH-12-AB-4567" />
                            </div>

                            {/* Driver Contact */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                                    <Icon name="person" className="text-[14px] mr-1" />Driver Contact
                                </label>
                                <input value={form.driver} onChange={set('driver')}
                                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white text-sm placeholder-slate-500 focus:border-emerald-500/60 focus:outline-none transition-colors"
                                    placeholder="e.g. Ramesh Kumar · +91 98765 43210" />
                            </div>

                            {/* Expected Delivery Time */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                                    <Icon name="schedule" className="text-[14px] mr-1" />Expected Delivery Time
                                </label>
                                <input type="datetime-local" value={form.delivery} onChange={set('delivery')}
                                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:border-emerald-500/60 focus:outline-none transition-colors [color-scheme:dark]" />
                            </div>

                            {/* Info strip */}
                            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/8 border border-emerald-500/20 p-3 text-sm text-emerald-400">
                                <Icon name="info" className="text-[16px] shrink-0" />
                                <span>Optimal route: {rec?.market_distance_km} km · Est value ₹{rec?.estimated_total_value?.toLocaleString()}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-1">
                                <button onClick={onClose}
                                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleConfirm} disabled={loading || !form.vehicle || !form.driver || !form.delivery}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                                    {loading ? (
                                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    ) : (
                                        <Icon name="send" className="text-[18px]" />
                                    )}
                                    Confirm Dispatch
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

/* ────────────────────────── Options Dropdown ───────────────────────────── */
function OptionsMenu({ rec, onDispatch }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const items = [
        { icon: 'bar_chart', label: 'View Batch Analytics', cls: 'text-white', action: () => alert(`Analytics for Batch #${rec.batch_id}`) },
        { icon: 'picture_as_pdf', label: 'Generate Manifest', cls: 'text-white', action: () => alert(`Generating manifest for ${rec.crop_name}...`) },
        { icon: 'reevaluate', label: 'Re-evaluate Risk', cls: 'text-amber-400', action: () => alert(`Re-evaluating risk for Batch #${rec.batch_id}`) },
        { icon: 'report', label: 'Flag as Compromised', cls: 'text-rose-400', action: () => alert(`Flagged Batch #${rec.batch_id} as compromised`) },
    ]

    return (
        <div ref={ref} className="relative">
            <button onClick={() => setOpen(o => !o)}
                className="p-2 rounded-lg border border-slate-700 hover:bg-slate-700 text-slate-300 transition-colors">
                <Icon name="more_horiz" className="text-[18px]" />
            </button>

            {open && (
                <div className="absolute right-0 top-10 z-50 w-52 rounded-xl border border-slate-700 bg-slate-800/95 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden animate-fade-in">
                    {items.map((item, i) => (
                        <button key={i}
                            onClick={() => { item.action(); setOpen(false) }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${item.cls}`}>
                            <Icon name={item.icon} className="text-[18px]" />
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

/* ────────────────────────── Dispatch Card ──────────────────────────────── */
function DispatchCard({ rec, idx, onDispatchClick }) {
    const u = URGENCY[rec.urgency] || URGENCY['CAN WAIT']
    const isSellNow = rec.urgency === 'SELL NOW'
    const isSellSoon = rec.urgency === 'SELL SOON'

    return (
        <div className={`group rounded-xl border p-0 transition-all duration-300 hover:shadow-[0_0_24px_rgba(16,185,129,0.15)] flex flex-col ${u.border}`}
            style={{ background: '#162e26' }}>
            <div className="p-5 flex-1">
                {/* Card top */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full border border-slate-700 flex items-center justify-center text-white font-bold text-sm" style={{ background: '#11241e' }}>
                            #{idx + 1}
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-base">{rec.crop_name} Batch</h4>
                            <p className="text-xs text-slate-400">{rec.farmer_name} · <span className="text-emerald-400">{rec.status || 'Stored'}</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {idx === 0 && (
                            <span className={`${u.bg} ${u.color} px-2 py-1 rounded text-xs font-bold uppercase tracking-wider`}>{u.label}</span>
                        )}
                        <OptionsMenu rec={rec} onDispatch={() => onDispatchClick(rec)} />
                    </div>
                </div>

                {/* Metrics */}
                <div className="space-y-2.5 mb-5">
                    {[
                        { icon: 'storefront', label: 'Nearest Market', value: rec.recommended_market },
                        { icon: 'distance', label: 'Distance', value: `${rec.market_distance_km} km` },
                        {
                            icon: 'schedule', label: 'Days Remaining',
                            value: <span className={rec.days_remaining < 5 ? 'text-rose-400' : 'text-emerald-400'}>{rec.days_remaining} days</span>
                        },
                        {
                            icon: 'payments', label: 'Est. Value',
                            value: <span className="font-bold">₹ {rec.estimated_total_value?.toLocaleString()}</span>
                        },
                    ].map(f => (
                        <div key={f.label} className="flex items-center justify-between text-sm">
                            <span className="text-slate-400 flex items-center gap-2">
                                <Icon name={f.icon} className="text-base" />{f.label}
                            </span>
                            <span className="text-white text-xs font-medium">{f.value}</span>
                        </div>
                    ))}
                </div>

                {/* Risk progress bar */}
                <div className="mb-1">
                    <div className="flex justify-between items-center mb-1 text-xs text-slate-500">
                        <span>Days Used</span>
                        <span>{rec.days_remaining < 5 ? '⚠ Urgent' : 'On track'}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-700 overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${rec.days_remaining < 5 ? 'bg-rose-500' : rec.days_remaining < 10 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.max(10, 100 - (rec.days_remaining / 30) * 100)}%` }} />
                    </div>
                </div>
            </div>

            {/* Action row */}
            <div className="p-4 border-t border-slate-700/60 rounded-b-xl flex gap-3" style={{ background: 'rgba(17,36,30,0.5)' }}>
                <button
                    onClick={() => onDispatchClick(rec)}
                    className={`flex-1 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm
                        ${isSellNow
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_22px_rgba(16,185,129,0.45)] hover:scale-[1.02]'
                            : isSellSoon
                                ? 'border border-emerald-500/50 text-white hover:bg-emerald-500/10'
                                : 'border border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-white'
                        }`}>
                    <Icon name="local_shipping" className="text-[18px]" />
                    {isSellNow ? 'Dispatch Now' : isSellSoon ? 'Review Route' : 'Schedule'}
                </button>
                <OptionsMenu rec={rec} onDispatch={() => onDispatchClick(rec)} />
            </div>
        </div>
    )
}

/* ────────────────────────── URGENCY config ─────────────────────────────── */
const URGENCY = {
    'SELL NOW': { label: 'High Priority', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/60', btnClass: '' },
    'SELL SOON': { label: 'Med Priority', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/40', btnClass: '' },
    'CAN WAIT': { label: 'Low Priority', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-700', btnClass: '' },
}

const CITIES = ['pune', 'mumbai', 'nashik', 'kolhapur', 'solapur', 'nagpur', 'aurangabad']

/* ────────────────────────── Main Page ─────────────────────────────────── */
export default function Dispatch() {
    const [weather, setWeather] = useState(null)
    const [recs, setRecs] = useState([])
    const [city, setCity] = useState('pune')
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(null)      // rec to dispatch
    const [dispatched, setDispatched] = useState(new Set())

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [wRes, dRes] = await Promise.all([getWeather(city), getDispatch()])
                setWeather(wRes.data)
                setRecs(dRes.data)
            } catch { } finally { setLoading(false) }
        }
        fetchAll()
        const t = setInterval(fetchAll, 15000)
        return () => clearInterval(t)
    }, [city])

    const onConfirm = (rec) => setDispatched(s => new Set(s).add(rec.batch_id))

    const sellNow = recs.filter(r => r.urgency === 'SELL NOW').length
    const pending = recs.filter(r => r.urgency !== 'CAN WAIT').length
    const efficiency = recs.length > 0 ? Math.round(((recs.length - sellNow) / recs.length) * 100) : 94

    return (
        <div className="flex-1 overflow-y-auto relative z-10 text-white p-6 md:p-8 lg:px-12">
            <div className="mx-auto max-w-7xl space-y-8 relative z-10">

                {/* Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight md:text-4xl">Dispatch Command Center</h1>
                        <p className="text-slate-400 mt-1 text-sm">Real-time logistics optimization based on live weather & inventory data.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Live weather polling every 15s</span>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { icon: 'local_shipping', iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/10', label: 'Total Batches', value: `${recs.length} Loads` },
                        { icon: 'pending_actions', iconColor: 'text-amber-400', iconBg: 'bg-amber-500/10', label: 'Pending Dispatch', value: `${pending} Loads` },
                        { icon: 'thunderstorm', iconColor: 'text-blue-400', iconBg: 'bg-blue-500/10', label: 'Weather Alerts', value: weather?.heatwave_warning ? '⚠ Heatwave' : 'All Clear', badge: weather?.heatwave_warning },
                        { icon: 'ssid_chart', iconColor: 'text-purple-400', iconBg: 'bg-purple-500/10', label: 'Market Efficiency', value: `${efficiency}%` },
                    ].map(c => (
                        <div key={c.label} className="relative overflow-hidden rounded-xl border border-slate-700 p-5 hover:border-emerald-500/40 transition-colors" style={{ background: '#162e26' }}>
                            <div className="flex justify-between items-start mb-3">
                                <div className={`rounded-lg ${c.iconBg} p-2 ${c.iconColor}`}><Icon name={c.icon} /></div>
                                {c.badge && <span className="text-xs font-medium text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-full flex items-center gap-1"><Icon name="warning" className="text-sm" />Alert</span>}
                            </div>
                            <p className="text-slate-400 text-xs font-medium">{c.label}</p>
                            <p className="text-2xl font-bold text-white mt-0.5">{loading ? '—' : c.value}</p>
                        </div>
                    ))}
                </div>

                {/* Weather Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="col-span-1 lg:col-span-2 rounded-xl border border-slate-700 overflow-hidden" style={{ background: '#162e26' }}>
                        <div className="p-5 border-b border-slate-700 flex justify-between items-center" style={{ background: 'rgba(17,36,30,0.5)' }}>
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Icon name="cloud" className="text-emerald-400" />Current Weather
                            </h3>
                            <div className="flex items-center gap-3">
                                {weather && <p className={`text-sm font-bold ${weather.heatwave_warning ? 'text-rose-400' : 'text-emerald-400'}`}>{weather.temperature}°C</p>}
                                <select value={city} onChange={e => setCity(e.target.value)}
                                    className="text-sm bg-slate-800 border border-slate-600 rounded-lg px-2 py-1 text-slate-300 cursor-pointer outline-none">
                                    {CITIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                                </select>
                            </div>
                        </div>
                        {weather ? (
                            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                                {[
                                    { icon: 'thermostat', color: 'text-orange-400', bg: 'bg-orange-400', label: 'Temperature', value: `${weather.temperature}°C`, pct: Math.min((weather.temperature / 50) * 100, 100) },
                                    { icon: 'air', color: 'text-blue-400', bg: 'bg-blue-400', label: 'Wind Speed', value: `${weather.wind_speed} km/h`, pct: Math.min((weather.wind_speed / 100) * 100, 100) },
                                    { icon: 'water_drop', color: 'text-indigo-400', bg: 'bg-indigo-400', label: 'Humidity', value: `${weather.humidity}%`, pct: weather.humidity },
                                ].map(f => (
                                    <div key={f.label} className="rounded-xl p-4 border border-slate-700" style={{ background: 'rgba(17,36,30,0.7)' }}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon name={f.icon} className={f.color} />
                                            <span className="text-slate-300 text-xs font-medium">{f.label}</span>
                                        </div>
                                        <div className="text-xl font-bold text-white">{f.value}</div>
                                        <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
                                            <div className={`${f.bg} h-1.5 rounded-full`} style={{ width: `${f.pct}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : !loading ? (
                            <div className="p-6 text-slate-500 text-sm text-center">Start backend to load live weather</div>
                        ) : null}
                    </div>

                    {/* Dispatch Summary */}
                    <div className="rounded-xl border border-slate-700 overflow-hidden" style={{ background: '#162e26' }}>
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-white text-sm">Dispatch Summary</h3>
                            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />LIVE
                            </span>
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                            {[
                                { label: 'Sell Now (Urgent)', val: recs.filter(r => r.urgency === 'SELL NOW').length, color: 'text-rose-400', bg: 'bg-rose-500' },
                                { label: 'Sell Soon', val: recs.filter(r => r.urgency === 'SELL SOON').length, color: 'text-amber-400', bg: 'bg-amber-500' },
                                { label: 'Can Wait', val: recs.filter(r => r.urgency === 'CAN WAIT').length, color: 'text-emerald-400', bg: 'bg-emerald-500' },
                                { label: 'Dispatched ✓', val: dispatched.size, color: 'text-sky-400', bg: 'bg-sky-500' },
                            ].map(s => (
                                <div key={s.label} className="rounded-lg p-3 border border-slate-700/60" style={{ background: 'rgba(17,36,30,0.5)' }}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-slate-400">{s.label}</span>
                                        <span className={`text-lg font-bold ${s.color}`}>{loading ? '—' : s.val}</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                                        <div className={`${s.bg} h-1 rounded-full`} style={{ width: recs.length > 0 ? `${(s.val / recs.length) * 100}%` : '0%', transition: 'width 0.6s ease' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Priority Dispatch Cards */}
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-black text-white">Priority Dispatch Recommendations</h2>
                        <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                            {recs.length} batches · {dispatched.size} dispatched
                        </span>
                    </div>

                    {loading && <LoadingSkeleton count={3} variant="card" />}

                    {!loading && recs.length === 0 && (
                        <EmptyState icon="local_shipping" title="No Dispatch Recommendations"
                            subtitle="Start the backend server to load live dispatch recommendations." />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recs.map((rec, idx) => (
                            <div key={rec.batch_id} className={dispatched.has(rec.batch_id) ? 'opacity-50 pointer-events-none' : ''}>
                                {dispatched.has(rec.batch_id) && (
                                    <div className="text-center text-xs text-emerald-400 mb-1 font-semibold">✓ DISPATCHED</div>
                                )}
                                <DispatchCard rec={rec} idx={idx} onDispatchClick={setModal} />
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Dispatch Modal */}
            {modal && (
                <DispatchModal rec={modal} onClose={() => setModal(null)} onConfirm={onConfirm} />
            )}

            <style>{`
                @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
                .animate-slideUp { animation: slideUp 0.25s ease-out; }
            `}</style>
        </div>
    )
}
