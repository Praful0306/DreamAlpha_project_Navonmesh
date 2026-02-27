/**
 * AgriStoreSmart — Market Opportunities Page
 * Premium grid with distance badges, price trends, and Dispatch Here buttons
 * Navomesh 2026 | Problem 26010
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'

function Icon({ name, className = '' }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

// Static curated market data (in production, from backend MarketAPI)
const MARKETS = [
    { id: 1, name: 'APMC Pune', city: 'Pune', distance: 12, price: 42, trend: +8, crops: ['Tomatoes', 'Onions'], demand: 'High', rating: 4.8 },
    { id: 2, name: 'Vashi Market', city: 'Mumbai', distance: 148, price: 58, trend: +14, crops: ['Mangoes', 'Bananas'], demand: 'High', rating: 4.7 },
    { id: 3, name: 'Nashik Mandi', city: 'Nashik', distance: 87, price: 35, trend: -3, crops: ['Potatoes', 'Grapes'], demand: 'Medium', rating: 4.2 },
    { id: 4, name: 'Kolhapur Market', city: 'Kolhapur', distance: 231, price: 31, trend: +2, crops: ['Rice', 'Wheat'], demand: 'Low', rating: 3.9 },
    { id: 5, name: 'Solapur APMC', city: 'Solapur', distance: 164, price: 38, trend: +6, crops: ['Onions', 'Tomatoes'], demand: 'Medium', rating: 4.3 },
    { id: 6, name: 'Nagpur Market', city: 'Nagpur', distance: 312, price: 29, trend: -7, crops: ['Oranges', 'Cotton'], demand: 'Low', rating: 3.8 },
]

const DEMAND_STYLE = {
    High: { bg: 'bg-emerald-500/15 text-emerald-400', dot: 'bg-emerald-500' },
    Medium: { bg: 'bg-amber-500/15 text-amber-400', dot: 'bg-amber-500' },
    Low: { bg: 'bg-slate-500/15 text-slate-400', dot: 'bg-slate-500' },
}

export default function Market() {
    const [sortBy, setSortBy] = useState('demand')
    const [search, setSearch] = useState('')

    const sorted = [...MARKETS]
        .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.city.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'distance') return a.distance - b.distance
            if (sortBy === 'price') return b.price - a.price
            if (sortBy === 'trend') return b.trend - a.trend
            // demand
            const order = { High: 0, Medium: 1, Low: 2 }
            return order[a.demand] - order[b.demand]
        })

    return (
        <div className="flex-1 overflow-y-auto text-white">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-1">
                            <Icon name="storefront" className="text-[18px]" />
                            <span>Live Market Intelligence</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Market Opportunities</h1>
                        <p className="text-slate-400 text-sm mt-1">Premium market connection with real-time price trends.</p>
                    </div>

                    {/* Search + Sort */}
                    <div className="flex gap-3 flex-wrap">
                        <div className="relative">
                            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]" />
                            <input value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search market..."
                                className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 transition-colors w-48" />
                        </div>
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 outline-none cursor-pointer">
                            <option value="demand">Sort: Demand</option>
                            <option value="distance">Sort: Nearest</option>
                            <option value="price">Sort: Price ↑</option>
                            <option value="trend">Sort: Trend ↑</option>
                        </select>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'High Demand Markets', value: MARKETS.filter(m => m.demand === 'High').length, color: 'text-emerald-400' },
                        { label: 'Avg Price / Quintal', value: `₹${Math.round(MARKETS.reduce((s, m) => s + m.price, 0) / MARKETS.length)}`, color: 'text-amber-400' },
                        { label: 'Best Trend Today', value: `+${Math.max(...MARKETS.map(m => m.trend))}%`, color: 'text-sky-400' },
                    ].map(s => (
                        <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                            <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Market Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {sorted.map(m => {
                        const d = DEMAND_STYLE[m.demand]
                        const isUp = m.trend > 0
                        return (
                            <div key={m.id}
                                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/40 hover:shadow-[0_0_28px_rgba(16,183,127,0.12)] transition-all duration-300">

                                {/* Card Header */}
                                <div className="p-5 border-b border-white/5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-white text-base">{m.name}</h3>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Icon name="location_on" className="text-slate-400 text-[14px]" />
                                                <span className="text-slate-400 text-xs">{m.city}</span>
                                            </div>
                                        </div>
                                        {/* Distance badge */}
                                        <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/20 shrink-0">
                                            <Icon name="directions_car" className="text-[13px]" />
                                            {m.distance} km
                                        </span>
                                    </div>

                                    {/* Demand badge */}
                                    <div className="flex items-center gap-2">
                                        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${d.bg}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${d.dot}`} />
                                            {m.demand} Demand
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-slate-400">
                                            {'★'.repeat(Math.round(m.rating))} {m.rating}
                                        </span>
                                    </div>
                                </div>

                                {/* Price + Trend */}
                                <div className="px-5 py-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-xs">Avg Price / Quintal</p>
                                        <p className="text-3xl font-black text-white mt-0.5">₹{m.price}<span className="text-lg">/Q</span></p>
                                    </div>
                                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-bold ${isUp ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
                                        <Icon name={isUp ? 'trending_up' : 'trending_down'} className="text-[18px]" />
                                        {isUp ? '+' : ''}{m.trend}%
                                    </div>
                                </div>

                                {/* Crops */}
                                <div className="px-5 pb-4">
                                    <p className="text-xs text-slate-500 mb-2">Best for:</p>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {m.crops.map(c => (
                                            <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{c}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="px-5 pb-5">
                                    <Link to="/dispatch"
                                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.03] hover:shadow-emerald-500/50">
                                        <Icon name="local_shipping" className="text-[18px]" />
                                        Dispatch Here
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    )
}
