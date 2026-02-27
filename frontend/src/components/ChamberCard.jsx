const STATUS = {
    SAFE: { colorClass: 'border-l-status-safe', tagBg: 'bg-emerald-500/10', tagText: 'text-emerald-500', tagBorder: 'border-emerald-500/20', gradient: '#10b77f', label: 'OPTIMAL' },
    WARNING: { colorClass: 'border-l-status-warning', tagBg: 'bg-amber-500/10', tagText: 'text-amber-500', tagBorder: 'border-amber-500/20', gradient: '#f59e0b', label: 'WARNING' },
    CRITICAL: { colorClass: 'border-l-status-critical', tagBg: 'bg-rose-500/10', tagText: 'text-rose-500', tagBorder: 'border-rose-500/20', gradient: '#f43f5e', label: 'CRITICAL', extraClass: 'shadow-[0_0_20px_rgba(244,63,94,0.1)]' },
}

export default function ChamberCard({ chamber }) {
    const s = STATUS[chamber.status] || STATUS.SAFE
    const isCritical = chamber.status === 'CRITICAL'
    const isWarning = chamber.status === 'WARNING'

    return (
        <div className={`bg-white/50 dark:bg-surface-glass backdrop-blur-[20px] rounded-xl overflow-hidden group hover:bg-white/[0.04] transition-all border-l-4 ${s.colorClass} relative border border-slate-200 dark:border-surface-border ${s.extraClass || ''}`}>
            {isCritical && <div className="absolute inset-0 bg-status-critical/5 animate-pulse pointer-events-none"></div>}

            <div className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3 items-center">
                        <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                            <span className="material-symbols-outlined text-2xl">eco</span>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-none">{chamber.name}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{chamber.location} • {chamber.crop_stored}</p>
                        </div>
                    </div>
                    <span className={`px-2 py-1 ${s.tagBg} ${s.tagText} text-xs font-bold rounded border ${s.tagBorder} flex items-center gap-1 uppercase`}>
                        {isCritical && <span className="material-symbols-outlined text-[12px]">error</span>}
                        {s.label}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className={`bg-slate-100 dark:bg-black/20 rounded-lg p-3 ${isCritical || isWarning && chamber.latest_temp > 25 ? `border border-${isCritical ? 'rose' : 'amber'}-500/30` : 'border border-transparent'}`}>
                        <p className={`text-xs ${isCritical && chamber.latest_temp > 25 ? 'text-rose-500' : 'text-slate-500'} mb-1`}>Temp</p>
                        <p className={`text-lg font-mono font-medium ${isCritical && chamber.latest_temp > 25 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                            {chamber.latest_temp ?? '--'}°C
                        </p>
                    </div>
                    <div className={`bg-slate-100 dark:bg-black/20 rounded-lg p-3 ${isCritical || isWarning && chamber.latest_humidity < 40 ? `border border-${isCritical ? 'rose' : 'amber'}-500/30` : 'border border-transparent'}`}>
                        <p className={`text-xs ${isCritical && chamber.latest_humidity < 40 ? 'text-rose-500' : 'text-slate-500'} mb-1`}>Humidity</p>
                        <p className={`text-lg font-mono font-medium ${isCritical && chamber.latest_humidity < 40 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                            {chamber.latest_humidity ?? '--'}%
                        </p>
                    </div>
                </div>

                <div className="relative h-16 w-full mt-2">
                    <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id={`gradient-${chamber.id}`} x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor={s.gradient} stopOpacity="0.2"></stop>
                                <stop offset="100%" stopColor={s.gradient} stopOpacity="0"></stop>
                            </linearGradient>
                        </defs>
                        <path d="M0 40 Q 30 35, 60 20 T 120 25 T 180 10 T 240 15 T 300 5 L 300 64 L 0 64 Z" fill={`url(#gradient-${chamber.id})`}></path>
                        <path d="M0 40 Q 30 35, 60 20 T 120 25 T 180 10 T 240 15 T 300 5" fill="none" stroke={s.gradient} strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                    </svg>
                </div>
            </div>
        </div>
    )
}
