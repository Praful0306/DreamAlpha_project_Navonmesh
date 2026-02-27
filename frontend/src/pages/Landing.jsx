import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
    const navigate = useNavigate()
    const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' }) // mode: 'login' | 'signup'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const openModal = (mode) => setAuthModal({ isOpen: true, mode })
    const closeModal = () => {
        setAuthModal({ isOpen: false, mode: 'login' })
        setEmail('')
        setPassword('')
        setEmailError('')
    }

    const handleAuthSubmit = (e) => {
        e.preventDefault()
        setEmailError('')

        // strict @gmail.com validation
        if (!email.toLowerCase().endsWith('@gmail.com')) {
            setEmailError('Only @gmail.com addresses are supported for this demo.')
            return
        }

        setIsLoading(true)
        // Simulate network request for auth
        setTimeout(() => {
            setIsLoading(false)
            closeModal()
            navigate('/dashboard')
        }, 1200)
    }

    const handleSocialAuth = (provider) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            closeModal()
            navigate('/dashboard')
        }, 1000)
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col relative overflow-hidden scroll-smooth">
            {/* Background Orbs */}
            <div className="absolute inset-0 pointer-events-none z-0 fixed">
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[140px]" />
                <div className="absolute top-[40%] left-[-5%] w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 z-50 w-full px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-900/40 backdrop-blur-md">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
                <div className="flex items-center gap-3">
                    <button onClick={() => openModal('login')} className="hidden sm:block px-5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Log in</button>
                    <button onClick={() => openModal('signup')} className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-all text-sm backdrop-blur-sm">Sign Up</button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-40 pb-20 min-h-screen">
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
                        <button onClick={() => openModal('signup')} className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-lg shadow-xl shadow-emerald-500/25 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                            Get Started
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </button>
                        <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-white font-bold text-lg backdrop-blur-sm transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">explore</span>
                            Explore Features
                        </a>
                    </div>
                </div>
            </main>

            {/* Feature Highlights */}
            <section id="features" className="relative z-10 py-24 px-6 border-t border-white/5 bg-slate-900/20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Capabilities</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Next-generation supply chain protection designed specifically for agricultural endurance.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/80 transition-all hover:-translate-y-1 group">
                            <div className="w-14 h-14 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[28px]">thermostat</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Live Telemetry</h3>
                            <p className="text-slate-400 leading-relaxed">Continuous hardware monitoring of temperature and humidity across all active chambers. Instantly triggers critical alerts upon threshold breach to prevent crop loss.</p>
                        </div>
                        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/80 transition-all hover:-translate-y-1 group">
                            <div className="w-14 h-14 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[28px]">inventory_2</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Predictive Inventory</h3>
                            <p className="text-slate-400 leading-relaxed">Our AI calculates the exact crop expiry dates based on environmental exposure history. Identify at-risk batches weeks before visible spoilage occurs.</p>
                        </div>
                        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/80 transition-all hover:-translate-y-1 group">
                            <div className="w-14 h-14 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[28px]">local_shipping</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Market Dispatch</h3>
                            <p className="text-slate-400 leading-relaxed">Intelligent dispatch scoring algorithms match decaying produce with urgent market demands, calculating transport viability against live weather data.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technology Stack */}
            <section id="technology" className="relative z-10 py-24 px-6 border-t border-white/5 bg-slate-900/40">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="w-full md:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Built on Modern Architecture</h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-6">
                            AgriStoreSmart relies on a zero-latency stack designed to scale with massive facility throughput. By leveraging modern WebSockets and optimized edge runtimes, we guarantee millisecond responsiveness.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-slate-300">
                                <span className="material-symbols-outlined text-emerald-400 bg-emerald-400/10 p-1.5 rounded-lg text-[20px]">check</span>
                                <b>FastAPI</b> backend for async high-performance I/O
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <span className="material-symbols-outlined text-teal-400 bg-teal-400/10 p-1.5 rounded-lg text-[20px]">check</span>
                                <b>React 18 & Vite</b> for instant client rendering
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <span className="material-symbols-outlined text-sky-400 bg-sky-400/10 p-1.5 rounded-lg text-[20px]">check</span>
                                <b>Tailwind CSS V3</b> enforcing strict glassmorphic design systems
                            </li>
                        </ul>
                    </div>
                    <div className="w-full md:w-1/2 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl relative">
                        {/* Fake Code Block UI */}
                        <div className="bg-slate-900 p-4 border-b border-slate-800 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        </div>
                        <div className="bg-[#0d1117] p-6 font-mono text-sm overflow-x-auto text-slate-300">
                            <span className="text-pink-400">async</span> <span className="text-blue-400">def</span> <span className="text-emerald-300">process_telemetry</span>(sensor_data):<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500"># Run predictive model on live stream</span><br />
                            &nbsp;&nbsp;&nbsp;&nbsp;risk_score = <span className="text-pink-400">await</span> ai_engine.<span className="text-emerald-300">evaluate_spoilage</span>(<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;temp=sensor_data.temp,<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;humidity=sensor_data.humidity<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;)<br /><br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-400">if</span> risk_score &gt; <span className="text-orange-400">0.85</span>:<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-400">await</span> alerts.<span className="text-emerald-300">dispatch_critical_warning</span>(<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;target=sensor_data.chamber_id<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)<br />
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact / CTA */}
            <section id="contact" className="relative z-10 py-24 px-6 border-t border-white/5">
                <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-10 md:p-16 text-center shadow-2xl shadow-emerald-900/20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to secure your harvest?</h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                        Don't let inadequate environmental controls spoil your inventory. Join the platform that protects thousands of tons of crops nationwide.
                    </p>
                    <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3" onSubmit={(e) => { e.preventDefault(); openModal('signup'); }}>
                        <input type="email" placeholder="Enter your email address" required className="flex-1 bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-500" />
                        <button type="submit" className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors whitespace-nowrap hidden sm:block">
                            Start Trial
                        </button>
                    </form>
                    <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                        By signing up, you agree to our Terms of Service. No credit card required.
                    </p>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/50 py-10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-500">smart_toy</span>
                        <span className="font-bold text-slate-300">Elite AgriStoreSmart</span>
                    </div>
                    <div className="text-sm text-slate-500 text-center md:text-left">
                        &copy; 2026 Hackathon Final Submission. Crafted with precision.
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-emerald-500 transition-colors"><span className="material-symbols-outlined text-[20px]">code</span></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-emerald-500 transition-colors"><span className="material-symbols-outlined text-[20px]">share</span></a>
                    </div>
                </div>
            </footer>

            {/* AUTH MODAL (Login & Signup) */}
            {authModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-[420px] bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden animate-slide-up relative">

                        {/* Modal Header */}
                        <div className="absolute top-4 right-4 z-10">
                            <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <div className="p-8 pb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6 mx-auto">
                                <span className="material-symbols-outlined text-white text-[24px]">smart_toy</span>
                            </div>
                            <h2 className="text-2xl font-bold text-center text-white mb-2">
                                {authModal.mode === 'login' ? 'Welcome back' : 'Create your account'}
                            </h2>
                            <p className="text-sm text-slate-400 text-center mb-8">
                                {authModal.mode === 'login'
                                    ? 'Log in to monitor your facilities.'
                                    : 'Start optimizing your logistics today.'}
                            </p>

                            {/* SSO Buttons */}
                            <div className="space-y-3 mb-6">
                                <button onClick={() => handleSocialAuth('google')} className="w-full relative flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl transition-colors">
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 absolute left-4" />
                                    Continue with Google
                                </button>
                                <button onClick={() => handleSocialAuth('microsoft')} className="w-full relative flex items-center justify-center gap-3 px-4 py-3 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white font-semibold flex border border-slate-700/50 rounded-xl transition-colors">
                                    <svg className="w-5 h-5 absolute left-4" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 0H0V10H10V0Z" fill="#F25022" />
                                        <path d="M21 0H11V10H21V0Z" fill="#7FBA00" />
                                        <path d="M10 11H0V21H10V11Z" fill="#00A4EF" />
                                        <path d="M21 11H11V21H21V11Z" fill="#FFB900" />
                                    </svg>
                                    Continue with Microsoft
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-[1px] flex-1 bg-slate-800"></div>
                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Or email</span>
                                <div className="h-[1px] flex-1 bg-slate-800"></div>
                            </div>

                            <form onSubmit={handleAuthSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@gmail.com"
                                        className={`w-full bg-slate-950/50 border ${emailError ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20'} rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all text-white placeholder:text-slate-600`}
                                    />
                                    {emailError && <p className="text-rose-400 text-xs mt-1.5 animate-fade-in">{emailError}</p>}
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                                        {authModal.mode === 'login' && <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300">Forgot?</a>}
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-white placeholder:text-slate-600 font-mono"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 mt-2"
                                >
                                    {isLoading ? (
                                        <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        authModal.mode === 'login' ? 'Log In' : 'Sign Up'
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-950/40 p-4 border-t border-slate-800 text-center">
                            <p className="text-sm text-slate-400">
                                {authModal.mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={() => {
                                        setAuthModal(prev => ({ ...prev, mode: prev.mode === 'login' ? 'signup' : 'login' }))
                                        setEmailError('')
                                    }}
                                    className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
                                >
                                    {authModal.mode === 'login' ? "Sign up" : "Log in"}
                                </button>
                            </p>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}
