/**
 * AgriStoreSmart — SensorChart
 * Shows temp + humidity history for a single chamber using Recharts AreaChart.
 * Navomesh 2026 | Problem 26010
 */

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { useEffect, useState } from 'react'
import { getSensorHistory } from '../api/client'

/* ────────── Custom Tooltip ────────── */
function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-slate-900/90 border border-slate-700 rounded-lg p-3 text-xs shadow-xl backdrop-blur-md">
            <p className="text-slate-400 mb-1 font-mono">{label}</p>
            {payload.map(p => (
                <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
                    {p.name}: {p.value}{p.unit}
                </p>
            ))}
        </div>
    )
}

/* ────────── Main Component ────────── */
export default function SensorChart({ chamberId, chamberName, status }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!chamberId) return
        let alive = true

        const fetch = async () => {
            try {
                const res = await getSensorHistory(chamberId)
                if (!alive) return
                const readings = res.data.readings.map((r, i) => ({
                    time: r.recorded_at
                        ? new Date(r.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                        : `T-${res.data.readings.length - i}`,
                    temp: Number(r.temperature.toFixed(1)),
                    humidity: Number(r.humidity.toFixed(1)),
                }))
                setData(readings)
            } catch {
                // backend not connected — leave empty
            } finally {
                if (alive) setLoading(false)
            }
        }

        fetch()
        const timer = setInterval(fetch, 10000)
        return () => { alive = false; clearInterval(timer) }
    }, [chamberId])

    const statusColors = {
        SAFE: '#10b981',
        WARNING: '#f59e0b',
        CRITICAL: '#f43f5e',
    }
    const statusColor = statusColors[status] ?? '#10b981'
    const glowClass = {
        SAFE: 'shadow-emerald-500/20',
        WARNING: 'shadow-amber-500/20',
        CRITICAL: 'shadow-rose-500/20',
    }[status] ?? 'shadow-emerald-500/20'

    return (
        <div className={`bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-lg ${glowClass}`}
            style={{ borderColor: `${statusColor}22` }}>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-white">{chamberName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Temperature & Humidity — last 20 readings</p>
                </div>
                <span
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                    style={{ background: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}40` }}
                >
                    {status ?? 'SAFE'}
                </span>
            </div>

            {/* Chart */}
            {loading ? (
                <div className="h-44 flex items-center justify-center text-slate-500 text-sm animate-pulse">
                    Loading history…
                </div>
            ) : data.length === 0 ? (
                <div className="h-44 flex items-center justify-center text-slate-500 text-sm">
                    No history yet — start backend or simulate
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={176}>
                    <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`tempGrad-${chamberId}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id={`humGrad-${chamberId}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />

                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 9, fill: '#64748b' }}
                            interval="preserveStartEnd"
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 9, fill: '#64748b' }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            iconType="circle"
                            iconSize={7}
                            wrapperStyle={{ fontSize: '10px', paddingTop: '8px', color: '#94a3b8' }}
                        />

                        <Area
                            type="monotone"
                            dataKey="temp"
                            name="Temp"
                            unit="°C"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            fill={`url(#tempGrad-${chamberId})`}
                            dot={false}
                            activeDot={{ r: 4, fill: '#f59e0b' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="humidity"
                            name="Humidity"
                            unit="%"
                            stroke="#38bdf8"
                            strokeWidth={2}
                            fill={`url(#humGrad-${chamberId})`}
                            dot={false}
                            activeDot={{ r: 4, fill: '#38bdf8' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}
