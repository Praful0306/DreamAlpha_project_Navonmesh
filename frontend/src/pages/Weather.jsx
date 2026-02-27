/**
 * AgriStoreSmart — Weather Full Page
 * Hero current conditions + 5-day forecast + agricultural impact cards
 * Navomesh 2026 | Problem 26010
 */
import { useState, useEffect } from 'react'
import { getWeather } from '../api/client'

const CITIES = ['pune', 'mumbai', 'nashik', 'kolhapur', 'solapur', 'nagpur', 'aurangabad']

// Simulated 5-day forecast based on current temp
function buildForecast(temp, humidity) {
    const days = ['Today', 'Mon', 'Tue', 'Wed', 'Thu']
    const icons = ['sunny', 'partly_cloudy_day', 'cloud', 'thunderstorm', 'partly_cloudy_day']
    return days.map((d, i) => ({
        day: d,
        icon: icons[i],
        high: Math.round(temp + (Math.random() * 4 - 2)),
        low: Math.round(temp - 5 + (Math.random() * 2 - 1)),
        hum: Math.round(humidity + (Math.random() * 10 - 5)),
    }))
}

function Icon({ name, className = '' }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default function Weather() {
    const [weather, setWeather] = useState(null)
    const [city, setCity] = useState('pune')
    const [loading, setLoading] = useState(true)
    const [forecast, setForecast] = useState([])

    useEffect(() => {
        const fetch = async () => {
            try {
                const r = await getWeather(city)
                setWeather(r.data)
                setForecast(buildForecast(r.data.temperature, r.data.humidity))
            } catch { } finally { setLoading(false) }
        }
        fetch()
        const t = setInterval(fetch, 30000)
        return () => clearInterval(t)
    }, [city])

    const isHot = weather?.temperature > 35
    const isHumid = weather?.humidity > 80

    // Agricultural impact
    const impacts = [
        {
            icon: 'local_shipping',
            title: 'Transit Conditions',
            value: isHot ? 'Caution' : 'Safe for Transit',
            sub: isHot ? 'Pre-cool cargo before dispatch' : 'Optimal for all produce types',
            color: isHot ? 'text-amber-400' : 'text-emerald-400',
            bg: isHot ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20',
        },
        {
            icon: 'warehouse',
            title: 'Cold Chain Risk',
            value: isHumid ? 'High Humidity Alert' : 'Low Risk',
            sub: isHumid ? 'Seal chamber doors tightly' : 'Storage conditions nominal',
            color: isHumid ? 'text-rose-400' : 'text-emerald-400',
            bg: isHumid ? 'bg-rose-500/10 border-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/20',
        },
        {
            icon: 'eco',
            title: 'Crop Sensitivity',
            value: weather?.heatwave_warning ? 'Heat Advisory' : 'Normal',
            sub: weather?.heatwave_warning ? 'Reduce transit time for leafy greens' : 'All crops in safe transport window',
            color: weather?.heatwave_warning ? 'text-rose-400' : 'text-sky-400',
            bg: weather?.heatwave_warning ? 'bg-rose-500/10 border-rose-500/20' : 'bg-sky-500/10 border-sky-500/20',
        },
        {
            icon: 'air',
            title: 'Wind Conditions',
            value: (weather?.wind_speed || 0) > 40 ? 'Strong Winds' : 'Calm',
            sub: (weather?.wind_speed || 0) > 40 ? 'Secure tarpaulins on open trucks' : 'Ideal for open-vehicle transport',
            color: (weather?.wind_speed || 0) > 40 ? 'text-amber-400' : 'text-emerald-400',
            bg: (weather?.wind_speed || 0) > 40 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20',
        },
    ]

    return (
        <div className="flex-1 overflow-y-auto text-white">
            <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-8">

                {/* Hero */}
                <div className={`relative overflow-hidden rounded-2xl p-8 ${weather?.heatwave_warning ? 'bg-gradient-to-br from-rose-900/60 to-amber-900/40' : 'bg-gradient-to-br from-sky-900/60 to-emerald-900/40'} border border-white/10`}>
                    <div className="absolute top-0 right-0 text-[180px] opacity-5 leading-none font-bold select-none pointer-events-none">
                        {weather?.heatwave_warning ? '🌡' : '☁'}
                    </div>

                    {/* City selector */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <p className="text-slate-400 text-sm mb-1">Live Weather Intelligence</p>
                            <h1 className="text-3xl font-black tracking-tight">Weather Station</h1>
                        </div>
                        <select value={city} onChange={e => setCity(e.target.value)}
                            className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm font-medium outline-none backdrop-blur-sm cursor-pointer">
                            {CITIES.map(c => <option key={c} value={c} className="bg-slate-900">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                        </select>
                    </div>

                    {loading ? (
                        <div className="h-28 flex items-center gap-3 text-slate-400 animate-pulse">
                            <div className="h-16 w-16 rounded-full bg-white/10" />
                            <div className="space-y-2">
                                <div className="h-8 w-40 bg-white/10 rounded-lg" />
                                <div className="h-4 w-28 bg-white/10 rounded-lg" />
                            </div>
                        </div>
                    ) : weather ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                            <div>
                                <div className="text-7xl font-black tracking-tighter">{weather.temperature}°C</div>
                                <div className={`text-lg font-semibold mt-1 ${weather.heatwave_warning ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {weather.heatwave_warning ? '🔥 Heatwave Warning' : '✅ Optimal Conditions'}
                                </div>
                                <p className="text-slate-400 text-sm mt-0.5 capitalize">{city} · Live</p>
                            </div>
                            <div className="flex gap-6 text-sm text-slate-300">
                                <div className="flex items-center gap-2">
                                    <Icon name="water_drop" className="text-sky-400" />
                                    <span>{weather.humidity}% Humidity</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Icon name="air" className="text-slate-300" />
                                    <span>{weather.wind_speed} km/h Wind</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-500">Backend not connected — start uvicorn on port 8000</p>
                    )}
                </div>

                {/* 5-Day Forecast */}
                {forecast.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Icon name="calendar_month" className="text-emerald-400 text-[20px]" />
                            5-Day Forecast
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {forecast.map((f, i) => (
                                <div key={i} className={`rounded-xl border border-white/10 p-4 text-center ${i === 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5'}`}>
                                    <p className="text-xs text-slate-400 font-medium mb-2">{f.day}</p>
                                    <Icon name={f.icon} className={`text-3xl ${i === 0 ? 'text-amber-400' : 'text-slate-300'}`} />
                                    <div className="mt-2">
                                        <span className="text-white font-bold text-sm">{f.high}°</span>
                                        <span className="text-slate-500 text-xs ml-1">{f.low}°</span>
                                    </div>
                                    <p className="text-slate-500 text-[10px] mt-1">{f.hum}% hum</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Agricultural Impact */}
                <div>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Icon name="agriculture" className="text-emerald-400 text-[20px]" />
                        Agricultural Impact Analysis
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {impacts.map(c => (
                            <div key={c.title} className={`rounded-xl border p-5 ${c.bg} backdrop-blur-sm`}>
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0`}>
                                        <Icon name={c.icon} className={`text-[20px] ${c.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs font-medium">{c.title}</p>
                                        <p className={`font-bold text-sm ${c.color}`}>{c.value}</p>
                                        <p className="text-slate-400 text-xs mt-0.5">{c.sub}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
