/**
 * AgriStoreSmart — Profile Page
 * User-centric farmer/manager layout with stats and contact info
 * Navomesh 2026 | Problem 26010
 */
import { useNavigate } from 'react-router-dom'

function Icon({ name, className = '' }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

const STATS = [
    { icon: 'inventory_2', label: 'Batches Managed', value: '247', sub: '+12 this month', color: 'text-emerald-400' },
    { icon: 'local_shipping', label: 'Dispatches', value: '89', sub: '₹4.2L total value', color: 'text-sky-400' },
    { icon: 'check_circle', label: 'Alerts Resolved', value: '134', sub: '97% resolve rate', color: 'text-amber-400' },
    { icon: 'warehouse', label: 'Chambers', value: '4', sub: '80% capacity', color: 'text-purple-400' },
]

const ACTIVITIES = [
    { icon: 'inventory_2', text: 'Added Tomatoes batch (2,500 kg)', time: '2 hours ago', color: 'text-emerald-400' },
    { icon: 'local_shipping', text: 'Dispatched Potatoes to Pune APMC', time: '5 hours ago', color: 'text-sky-400' },
    { icon: 'check_circle', text: 'Resolved WARNING in Chamber A', time: 'Yesterday', color: 'text-amber-400' },
    { icon: 'person_add', text: 'Added driver Ramesh Kumar', time: '2 days ago', color: 'text-purple-400' },
]

export default function Profile() {
    const navigate = useNavigate()

    const handleSignOut = () => {
        // Clear any session data here if needed
        navigate('/')
    }

    return (
        <div className="flex-1 overflow-y-auto text-white">
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-8">

                {/* Profile Hero */}
                <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-emerald-500/30">
                                P
                            </div>
                            <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-2xl font-black text-white">Praful Navghare</h1>
                            <p className="text-emerald-400 font-medium text-sm">Senior Farm Manager · AgriStoreSmart</p>
                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <Icon name="location_on" className="text-[16px]" />
                                    Pune, Maharashtra
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Icon name="phone" className="text-[16px]" />
                                    +91 98765 43210
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Icon name="email" className="text-[16px]" />
                                    praful@agristoresmart.in
                                </div>
                            </div>
                        </div>

                        {/* Edit btn */}
                        <button className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 text-sm transition-colors">
                            <Icon name="edit" className="text-[16px]" />
                            Edit Profile
                        </button>
                    </div>

                    {/* Badge row */}
                    <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-white/10">
                        {['AgriTech Expert', 'Level 4 Manager', '5+ Years', 'Navonmesh 2026'].map(b => (
                            <span key={b} className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">{b}</span>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {STATS.map(s => (
                        <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
                            <Icon name={s.icon} className={`text-[22px] mb-3 ${s.color}`} />
                            <p className="text-2xl font-black text-white">{s.value}</p>
                            <p className="text-slate-400 text-xs font-medium mt-0.5">{s.label}</p>
                            <p className="text-slate-500 text-[10px] mt-0.5">{s.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Activity */}
                <div>
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Icon name="history" className="text-emerald-400 text-[20px]" />
                        Recent Activity
                    </h2>
                    <div className="space-y-2">
                        {ACTIVITIES.map((a, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors">
                                <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0`}>
                                    <Icon name={a.icon} className={`text-[18px] ${a.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-200 font-medium truncate">{a.text}</p>
                                    <p className="text-xs text-slate-500">{a.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sign Out */}
                <div className="flex justify-end">
                    <button onClick={handleSignOut}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 font-semibold text-sm transition-all hover:scale-105">
                        <Icon name="logout" className="text-[18px]" />
                        Sign Out
                    </button>
                </div>

            </div>
        </div>
    )
}
