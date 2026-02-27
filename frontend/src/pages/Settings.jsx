/**
 * AgriStoreSmart — Settings Page
 * Sleek toggle switches and preferences panel
 * Navomesh 2026 | Problem 26010
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

function Icon({ name, className = '' }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

function Toggle({ value, onChange }) {
    return (
        <button
            onClick={() => onChange(!value)}
            className={`relative inline-flex w-11 h-6 rounded-full transition-all duration-300 focus:outline-none ${value ? 'bg-emerald-500' : 'bg-slate-700'}`}
        >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
    )
}

function SettingRow({ icon, label, sub, value, onChange, color = 'text-emerald-400' }) {
    return (
        <div className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0">
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0`}>
                <Icon name={icon} className={`text-[20px] ${color}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{label}</p>
                {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
            </div>
            <Toggle value={value} onChange={onChange} />
        </div>
    )
}

export default function Settings() {
    const navigate = useNavigate()
    const { dark, toggle } = useTheme()

    const [settings, setSettings] = useState({
        pushNotifications: true,
        autoResolveMinor: false,
        emailAlerts: true,
        criticalSMS: true,
        autoRefreshCharts: true,
        soundAlerts: false,
        weeklyReport: true,
        dataBackup: true,
    })

    const set = key => val => setSettings(s => ({ ...s, [key]: val }))

    const handleSignOut = () => navigate('/')

    return (
        <div className="flex-1 overflow-y-auto text-white">
            <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 space-y-6">

                {/* Header */}
                <div className="mb-2">
                    <h1 className="text-3xl font-black tracking-tight">Settings</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage your preferences and system configuration.</p>
                </div>

                {/* Section: Notifications */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Icon name="notifications" className="text-[16px]" />
                        Notification Preferences
                    </h2>
                    <SettingRow icon="notifications_active" label="Push Notifications" sub="Receive browser notifications for new alerts" value={settings.pushNotifications} onChange={set('pushNotifications')} />
                    <SettingRow icon="sms" label="Critical SMS Alerts" sub="Text message for CRITICAL severity only" value={settings.criticalSMS} onChange={set('criticalSMS')} color="text-rose-400" />
                    <SettingRow icon="email" label="Email Alerts" sub="Daily digest of unresolved alerts" value={settings.emailAlerts} onChange={set('emailAlerts')} color="text-sky-400" />
                    <SettingRow icon="volume_up" label="Sound Alerts" sub="Play sound on new critical alert" value={settings.soundAlerts} onChange={set('soundAlerts')} color="text-amber-400" />
                </div>

                {/* Section: Automation */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h2 className="text-sm font-bold text-sky-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Icon name="smart_toy" className="text-[16px]" />
                        Automation
                    </h2>
                    <SettingRow icon="auto_fix_high" label="Auto-Resolve Minor Alerts" sub="Automatically dismiss WARNING alerts after 4 hours" value={settings.autoResolveMinor} onChange={set('autoResolveMinor')} color="text-amber-400" />
                    <SettingRow icon="refresh" label="Auto-Refresh Charts" sub="Sensor charts update every 10 seconds" value={settings.autoRefreshCharts} onChange={set('autoRefreshCharts')} color="text-sky-400" />
                    <SettingRow icon="backup" label="Auto Data Backup" sub="Sync warehouse data to cloud daily" value={settings.dataBackup} onChange={set('dataBackup')} />
                </div>

                {/* Section: Reports */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h2 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Icon name="bar_chart" className="text-[16px]" />
                        Reports
                    </h2>
                    <SettingRow icon="calendar_month" label="Weekly Performance Report" sub="Receive a PDF summary every Monday" value={settings.weeklyReport} onChange={set('weeklyReport')} color="text-purple-400" />
                </div>

                {/* Section: Appearance */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Icon name="palette" className="text-[16px]" />
                        Appearance
                    </h2>
                    <SettingRow icon={dark ? 'light_mode' : 'dark_mode'} label="Dark Mode" sub="Switch between dark and light interface" value={dark} onChange={toggle} color="text-slate-300" />
                </div>

                {/* Sign Out */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors">
                        <Icon name="save" className="text-[18px]" />
                        Save Changes
                    </button>
                    <button onClick={handleSignOut}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 font-semibold text-sm transition-all hover:scale-[1.02]">
                        <Icon name="logout" className="text-[18px]" />
                        Sign Out
                    </button>
                </div>

            </div>
        </div>
    )
}
