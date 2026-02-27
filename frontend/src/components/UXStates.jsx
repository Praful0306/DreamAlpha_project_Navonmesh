/**
 * AgriStoreSmart — Shared UX State Components
 * LoadingSkeleton, ErrorBanner, EmptyState, Spinner
 * Navomesh 2026 | Problem 26010
 */

/* ── Spinner ──────────────────────────────────── */
export function Spinner({ size = 'md', color = 'emerald' }) {
    const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-[3px]' }
    const colors = { emerald: 'border-emerald-500', rose: 'border-rose-500', amber: 'border-amber-500', slate: 'border-slate-400' }
    return (
        <div
            className={`rounded-full border-transparent animate-spin ${sizes[size]} ${colors[color]}`}
            style={{ borderTopColor: 'currentcolor' }}
            role="status" aria-label="Loading"
        />
    )
}

/* ── Skeleton blocks ─────────────────────────── */
function SkeletonBlock({ className = '' }) {
    return <div className={`bg-white/5 rounded-lg animate-pulse ${className}`} />
}

/**
 * Renders N placeholder cards matching the given layout style.
 * variant: 'card' | 'row' | 'chart'
 */
export function LoadingSkeleton({ count = 4, variant = 'card' }) {
    const items = Array.from({ length: count })

    if (variant === 'row') return (
        <div className="flex flex-col gap-3">
            {items.map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4 animate-pulse">
                    <SkeletonBlock className="w-10 h-10 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                        <SkeletonBlock className="h-4 w-1/3" />
                        <SkeletonBlock className="h-3 w-2/3" />
                    </div>
                    <SkeletonBlock className="h-8 w-24 rounded-lg" />
                </div>
            ))}
        </div>
    )

    if (variant === 'chart') return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {items.map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse">
                    <div className="flex justify-between mb-4">
                        <div className="space-y-1.5">
                            <SkeletonBlock className="h-4 w-28" />
                            <SkeletonBlock className="h-3 w-40" />
                        </div>
                        <SkeletonBlock className="h-6 w-16 rounded-full" />
                    </div>
                    <SkeletonBlock className="h-44 w-full rounded-lg" />
                </div>
            ))}
        </div>
    )

    // default: 'card'
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {items.map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse space-y-4">
                    <div className="flex justify-between">
                        <div className="space-y-2 flex-1">
                            <SkeletonBlock className="h-5 w-1/2" />
                            <SkeletonBlock className="h-3 w-1/3" />
                        </div>
                        <SkeletonBlock className="h-7 w-20 rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <SkeletonBlock className="h-16 rounded-lg" />
                        <SkeletonBlock className="h-16 rounded-lg" />
                    </div>
                    <SkeletonBlock className="h-10 w-full rounded-lg" />
                </div>
            ))}
        </div>
    )
}

/* ── Error Banner ────────────────────────────── */
export function ErrorBanner({ message, onRetry }) {
    return (
        <div className="flex items-start gap-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm backdrop-blur-sm">
            <span className="material-symbols-outlined text-rose-400 text-xl shrink-0 mt-0.5">error</span>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-rose-300">Connection Error</p>
                <p className="text-rose-400/80 mt-0.5 text-xs break-words">{message}</p>
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="shrink-0 flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition-colors"
                >
                    <span className="material-symbols-outlined text-[14px]">refresh</span>
                    Retry
                </button>
            )}
        </div>
    )
}

/* ── Empty State ─────────────────────────────── */
export function EmptyState({ icon = 'inbox', title, subtitle, action }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-5">
                <span className="material-symbols-outlined text-3xl text-slate-500">{icon}</span>
            </div>
            <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
            <p className="text-sm text-slate-400 max-w-xs">{subtitle}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-5 flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors shadow-lg shadow-emerald-500/20"
                >
                    <span className="material-symbols-outlined text-[18px]">{action.icon || 'add'}</span>
                    {action.label}
                </button>
            )}
        </div>
    )
}
