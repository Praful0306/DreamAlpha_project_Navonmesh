import { useState, useEffect } from 'react'
import { getWeather, getDispatch } from '../api/client'

function Icon({ name, className = '' }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

const URGENCY = {
    'SELL NOW': { label: 'High Priority', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500', btnClass: 'bg-emerald-500 text-slate-900 hover:bg-emerald-400' },
    'SELL SOON': { label: 'Med Priority', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500', btnClass: 'border border-emerald-500/50 text-white hover:bg-emerald-500/10' },
    'CAN WAIT': { label: 'Low Priority', color: 'text-slate-400', bg: 'bg-slate-700/30', border: 'border-slate-700', btnClass: 'border border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-white' },
}

const CITIES = ['pune', 'mumbai', 'nashik', 'kolhapur', 'solapur', 'nagpur', 'aurangabad']

export default function Dispatch() {
    const [weather, setWeather] = useState(null)
    const [recs, setRecs] = useState([])
    const [city, setCity] = useState('pune')
    const [loading, setLoading] = useState(true)

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

    const sellNow = recs.filter(r => r.urgency === 'SELL NOW').length
    const pending = recs.filter(r => r.urgency !== 'CAN WAIT').length
    const efficiency = recs.length > 0 ? Math.round(((recs.length - sellNow) / recs.length) * 100) : 94

    return (
        <div className="flex-1 overflow-y-auto relative z-10 text-white p-6 md:p-8 lg:px-12">
            <div className="mx-auto max-w-7xl space-y-8 relative z-10">

                {/* Page Title */}
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight md:text-4xl">Dispatch Command Center</h1>
                        <p className="text-slate-400 mt-1 text-sm md:text-base">Real-time logistics optimization based on live weather data.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700">
                        <Icon name="update" className="text-emerald-400 text-base" />
                        <span>Live weather polling every 15s</span>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { icon: 'local_shipping', iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/10', label: 'Total Batches', value: `${recs.length} Loads`, badge: null },
                        { icon: 'pending_actions', iconColor: 'text-orange-400', iconBg: 'bg-orange-500/10', label: 'Pending Dispatch', value: `${pending} Loads`, badge: null },
                        { icon: 'thunderstorm', iconColor: 'text-blue-400', iconBg: 'bg-blue-500/10', label: 'Weather Alerts', value: weather?.heatwave_warning ? '1 Heatwave' : 'All Clear', badge: weather?.heatwave_warning ? 'alert' : null },
                        { icon: 'ssid_chart', iconColor: 'text-purple-400', iconBg: 'bg-purple-500/10', label: 'Market Efficiency', value: `${efficiency}%`, badge: null },
                    ].map(c => (
                        <div key={c.label} className="relative overflow-hidden rounded-xl border border-slate-700 p-6 group hover:border-emerald-500/50 transition-colors" style={{ background: '#162e26' }}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`rounded-lg ${c.iconBg} p-2 ${c.iconColor}`}><Icon name={c.icon} /></div>
                                {c.badge === 'alert' && (
                                    <span className="flex items-center gap-1 text-xs font-medium text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
                                        <Icon name="warning" className="text-sm" /> Alert
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-400 text-sm font-medium">{c.label}</p>
                            <p className="text-2xl font-bold text-white mt-1">{loading ? '—' : c.value}</p>
                        </div>
                    ))}
                </div>

                {/* Weather + Map Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Weather Panel */}
                    <div className="col-span-1 lg:col-span-2 rounded-xl border border-slate-700 overflow-hidden flex flex-col" style={{ background: '#162e26' }}>
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center" style={{ background: 'rgba(17,36,30,0.5)' }}>
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Icon name="cloud" className="text-emerald-400" />
                                    Current Weather Conditions
                                </h3>
                                <p className="text-slate-400 text-sm">Outside environment affecting storage and transport routes.</p>
                            </div>
                            <div className="text-right flex flex-col items-end gap-1">
                                <select value={city} onChange={e => setCity(e.target.value)}
                                    className="text-sm bg-slate-800 border border-slate-600 rounded-lg px-2 py-1 text-slate-300 cursor-pointer mb-2 outline-none">
                                    {CITIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                                </select>
                                {weather && <>
                                    <p className="text-3xl font-black text-white">{weather.temperature}°C</p>
                                    <p className={`text-sm font-medium ${weather.heatwave_warning ? 'text-rose-400' : 'text-emerald-400'}`}>
                                        {weather.heatwave_warning ? 'HEATWAVE WARNING' : 'Optimal Conditions'}
                                    </p>
                                </>}
                            </div>
                        </div>
                        {weather && (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { icon: 'thermostat', color: 'text-orange-400', bg: 'bg-orange-400', label: 'Temperature', value: `${weather.temperature}°C`, pct: Math.min(((weather.temperature) / 50) * 100, 100) },
                                    { icon: 'air', color: 'text-blue-400', bg: 'bg-blue-400', label: 'Wind Speed', value: `${weather.wind_speed} km/h`, pct: Math.min((weather.wind_speed / 100) * 100, 100) },
                                    { icon: 'water_drop', color: 'text-indigo-400', bg: 'bg-indigo-400', label: 'Humidity', value: `${weather.humidity}%`, pct: weather.humidity },
                                ].map(f => (
                                    <div key={f.label} className="rounded-lg p-4 border border-slate-700" style={{ background: 'rgba(17,36,30,0.7)' }}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <Icon name={f.icon} className={f.color} />
                                            <span className="text-slate-300 text-sm font-medium">{f.label}</span>
                                        </div>
                                        <div className="text-2xl font-bold text-white">{f.value}</div>
                                        <div className="w-full bg-slate-700 rounded-full h-1.5 mt-3 overflow-hidden">
                                            <div className={`${f.bg} h-1.5 rounded-full transition-all`} style={{ width: `${f.pct}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {!weather && !loading && (
                            <div className="p-6 text-slate-500 text-sm text-center">Start backend to load live weather</div>
                        )}
                    </div>

                    {/* Summary panel */}
                    <div className="col-span-1 rounded-xl border border-slate-700 overflow-hidden flex flex-col min-h-[300px]" style={{ background: '#162e26' }}>
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-white">Dispatch Summary</h3>
                            <span className="text-xs text-emerald-400">LIVE</span>
                        </div>
                        <div className="flex-1 p-4 flex flex-col gap-3">
                            {[
                                { label: 'Sell Now (Urgent)', val: recs.filter(r => r.urgency === 'SELL NOW').length, color: 'text-rose-400', bg: 'bg-rose-500' },
                                { label: 'Sell Soon', val: recs.filter(r => r.urgency === 'SELL SOON').length, color: 'text-amber-400', bg: 'bg-amber-500' },
                                { label: 'Can Wait', val: recs.filter(r => r.urgency === 'CAN WAIT').length, color: 'text-emerald-400', bg: 'bg-emerald-500' },
                            ].map(s => (
                                <div key={s.label} className="rounded-lg p-3 border border-slate-700/60" style={{ background: 'rgba(17,36,30,0.5)' }}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-slate-400">{s.label}</span>
                                        <span className={`text-xl font-bold ${s.color}`}>{loading ? '—' : s.val}</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                        <div className={`${s.bg} h-1.5 rounded-full transition-all`} style={{ width: recs.length > 0 ? `${(s.val / recs.length) * 100}%` : '0%' }} />
                                    </div>
                                </div>
                            ))}
                            {recs.length === 0 && !loading && (
                                <div className="flex-1 flex items-center justify-center text-slate-600 text-sm">No dispatch data</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Priority Dispatches */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Priority Dispatch Recommendations</h3>
                        <div className="flex gap-2">
                            <button className="p-1.5 rounded border border-slate-700 bg-slate-800 text-slate-400 hover:text-white"><Icon name="filter_list" className="text-sm" /></button>
                            <button className="p-1.5 rounded border border-slate-700 bg-slate-800 text-slate-400 hover:text-white"><Icon name="sort" className="text-sm" /></button>
                        </div>
                    </div>

                    {recs.length === 0 && !loading && (
                        <div className="text-center p-12 rounded-xl border border-slate-700 text-slate-500" style={{ background: '#162e26' }}>
                            Start backend to load dispatch recommendations
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recs.map((rec, idx) => {
                            const u = URGENCY[rec.urgency] || URGENCY['CAN WAIT']
                            return (
                                <div key={rec.batch_id} className={`group rounded-xl border p-0 hover:border-emerald-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,183,127,0.15)] flex flex-col ${u.border}`} style={{ background: '#162e26' }}>
                                    <div className="p-5 flex-1">
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
                                            {idx === 0 && (
                                                <div className={`${u.bg} ${u.color} px-2 py-1 rounded text-xs font-bold uppercase tracking-wider`}>{u.label}</div>
                                            )}
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-400 flex items-center gap-2"><Icon name="storefront" className="text-base" />Nearest Market</span>
                                                <span className="text-white font-medium text-xs">{rec.recommended_market}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-400 flex items-center gap-2"><Icon name="distance" className="text-base" />Distance</span>
                                                <span className="text-white font-medium">{rec.market_distance_km} km</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-400 flex items-center gap-2"><Icon name="schedule" className="text-base" />Days Remaining</span>
                                                <span className={`font-medium ${rec.days_remaining < 5 ? 'text-rose-400' : 'text-emerald-400'}`}>{rec.days_remaining} days</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-400 flex items-center gap-2"><Icon name="payments" className="text-base" />Est. Value</span>
                                                <span className="text-white font-bold">Rs. {rec.estimated_total_value.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 border-t border-slate-700/60 rounded-b-xl flex gap-3" style={{ background: 'rgba(17,36,30,0.5)' }}>
                                        <button className={`flex-1 font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm ${u.btnClass}`}>
                                            <span>{rec.urgency === 'SELL NOW' ? 'Dispatch Now' : rec.urgency === 'SELL SOON' ? 'Review Route' : 'Details'}</span>
                                            {rec.urgency === 'SELL NOW' && <Icon name="arrow_forward" className="text-lg" />}
                                        </button>
                                        <button className="px-3 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-700 text-slate-300 transition-colors">
                                            <Icon name="more_horiz" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
