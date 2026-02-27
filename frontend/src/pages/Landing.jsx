import { Link } from 'react-router-dom'

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[140px]" />
                <div className="absolute top-[40%] left-[-5%] w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Simple Navbar for Landing Page */}
            <nav className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-900/40 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <span className="material-symbols-outlined text-white text-[22px]">smart_toy</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Elite <span className="text-emerald-400">AgriStoreSmart</span></span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#technology" className="hover:text-white transition-colors">Technology</a>
                    <a href="#contact" className="hover:text-white transition-colors">Contact</a>
                </div>
                <div>
                    <Link to="/dashboard" className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-all text-sm backdrop-blur-sm">Login</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 flex items-center justify-center p-6 mt-12 md:mt-0">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-8 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        AgriTech Innovation 2026
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        Smart Warehouse <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                            Intelligence Platform
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        The ultimate AI-driven facility management system. Monitor environmental telemetry, predict inventory spoilage, and optimize dispatch logistics in real-time.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-lg shadow-xl shadow-emerald-500/25 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                            Get Started
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </Link>
                        <a href="#demo" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-white font-bold text-lg backdrop-blur-sm transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">play_circle</span>
                            Watch Demo
                        </a>
                    </div>
                </div>
            </main>

            {/* Feature Highlights */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto w-full p-6 pb-20 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined">thermostat</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Live Telemetry</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">Continuous monitoring of temperature and humidity across all chambers with instant critical alerts.</p>
                </div>
                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined">inventory_2</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Predictive Inventory</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">Calculate exact crop expiry dates based on environmental exposure and manage storage risks dynamically.</p>
                </div>
                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined">local_shipping</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Market Logistics</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">AI algorithms match decaying produce with urgent market demands and live weather forecasting.</p>
                </div>
            </div>

            {/* Simple Footer */}
            <footer className="relative z-10 border-t border-slate-800/50 py-6 text-center text-sm text-slate-500">
                &copy; 2026 Elite AgriStoreSmart. Hackathon Project. All rights reserved.
            </footer>
        </div>
    )
}
