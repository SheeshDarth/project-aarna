import { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useAarnaContext } from '../context/AarnaContext'

/* ── Inline SVG icons ── */
function IconShieldCheck({ size = 20, color = '#10B981' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
        </svg>
    )
}
function IconSettings({ size = 16, color = '#7A8FA0' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    )
}
function IconClipboard({ size = 16, color = '#006994' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
    )
}
function IconMapPin({ size = 14, color = '#7A8FA0' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
    )
}
function IconLeaf({ size = 14, color = '#10B981' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66L12 14" /><path d="M21 3c-4 0-8.5 2-12 5 2 4 6.5 7.3 12 5 1-4 0-7.5-0-10z" />
        </svg>
    )
}
function IconUser({ size = 14, color = '#7A8FA0' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
    )
}
function IconCheck({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
function IconX({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    )
}
function IconCoin({ size = 16, color = '#9F7AEA' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8" /><path d="M12 6v12M9 9h6M9 15h6" />
        </svg>
    )
}
function IconPackage({ size = 20, color = '#006994' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16.5 9.4l-9-5.19" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    )
}
function IconInbox({ size = 40, color = '#006994' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
    )
}

export default function Validator() {
    const { activeAddress } = useWallet()
    const aarna = useAarnaContext()

    const [creditAmounts, setCreditAmounts] = useState<Record<number, string>>({})

    const pendingProjects = aarna.projects.filter((p) => p.status === 'pending')
    const processedProjects = aarna.projects.filter((p) => p.status !== 'pending')

    const handleApprove = async (id: number) => {
        const credits = parseInt(creditAmounts[id] || '0')
        if (credits <= 0) return
        await aarna.approveProject(id, credits)
    }

    const handleReject = async (id: number) => {
        await aarna.rejectProject(id)
    }

    const handleIssue = async (id: number) => {
        await aarna.issueCredits(id)
    }

    /* ── Wallet gate ── */
    if (!activeAddress) {
        return (
            <div className="page-enter pt-24 min-h-screen px-4 sm:px-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="g-card" style={{ maxWidth: 420, textAlign: 'center', padding: '3rem 2rem' }}>
                    <IconInbox size={48} color="#006994" />
                    <h2 style={{ color: 'white', fontSize: '1.5rem', marginTop: '1rem' }}>Validator Access Only</h2>
                    <p className="text-muted" style={{ marginTop: '0.5rem' }}>
                        Connect the authorized validator wallet to review and approve carbon credit projects.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="page-enter pt-24 min-h-screen px-4 sm:px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                        <IconShieldCheck size={28} color="#10B981" />
                        Validator <span className="text-seagrass">Dashboard</span>
                    </h1>
                    <p className="mt-2 text-muted">
                        Review submitted projects, approve or reject, and issue AARNA carbon credits.
                    </p>
                </div>

                {/* Status bar */}
                <div className="g-card p-6 mb-8">
                    <div className="flex gap-3 flex-wrap">
                        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm">
                            <span className="text-muted">App ID:</span>{' '}
                            <span className="text-accent font-mono">{aarna.appId?.toString() || '—'}</span>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm">
                            <span className="text-muted">AARNA ASA:</span>{' '}
                            <span className="text-seagrass font-mono">{aarna.assetId?.toString() || '—'}</span>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm">
                            <span className="text-muted">Projects:</span>{' '}
                            <span className="text-accent font-mono">{aarna.projects.length}</span>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm">
                            <span className="text-muted">Connected as:</span>{' '}
                            <span className="text-seagrass font-mono text-xs">{activeAddress.slice(0, 6)}…{activeAddress.slice(-4)}</span>
                        </div>
                    </div>
                </div>

                {/* Pending Projects */}
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <IconClipboard size={20} color="#006994" /> Pending Projects ({pendingProjects.length})
                </h2>
                {pendingProjects.length === 0 ? (
                    <div className="g-card p-12 text-center">
                        <div className="flex justify-center mb-4"><IconInbox size={48} color="#006994" /></div>
                        <p className="text-muted">No pending projects to review.</p>
                        <p className="text-sm text-muted mt-2" style={{ opacity: 0.7 }}>
                            Submit a project from the <span className="text-accent">Developer</span> page first.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingProjects.map((project) => (
                            <div key={project.id} className="g-card p-6">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-white text-lg">{project.name}</h3>
                                            <span className="badge-pending rounded-full px-3 py-1 text-xs font-semibold">Pending</span>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mt-3">
                                            <div className="flex items-center gap-2">
                                                <IconMapPin size={14} />
                                                <span className="text-white/80">{project.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <IconLeaf size={14} />
                                                <span className="text-white/80">{project.ecosystem}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <IconUser size={14} />
                                                <span className="text-white/80 font-mono text-xs">
                                                    {project.submitter.slice(0, 6)}...{project.submitter.slice(-4)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-accent break-all" style={{ opacity: 0.8 }}>
                                            IPFS: {project.cid}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 min-w-[200px]">
                                        <div>
                                            <label className="text-xs text-muted mb-1 block">Carbon Credits</label>
                                            <input
                                                type="number"
                                                value={creditAmounts[project.id] || ''}
                                                onChange={(e) => setCreditAmounts({ ...creditAmounts, [project.id]: e.target.value })}
                                                placeholder="e.g. 1200"
                                                className="w-full rounded-lg border border-white/10 bg-[#0b1222] px-3 py-2 text-sm text-white focus:border-[#10B981] focus:outline-none"
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleApprove(project.id)}
                                            disabled={aarna.busy}
                                            className="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                            style={{ background: 'linear-gradient(135deg, #10B981, #0D6B4A)', boxShadow: '0 4px 20px rgba(16,185,129,0.2)' }}
                                        >
                                            <IconCheck size={16} /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(project.id)}
                                            disabled={aarna.busy}
                                            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <IconX size={16} /> Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Processed Projects */}
                {processedProjects.length > 0 && (
                    <>
                        <h2 className="text-xl font-bold text-white mb-4 mt-10 flex items-center gap-2">
                            <IconPackage size={20} color="#006994" /> Processed Projects
                        </h2>
                        <div className="space-y-4 mb-12">
                            {processedProjects.map((project) => (
                                <div key={project.id} className="g-card p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-bold text-white text-lg">{project.name}</h3>
                                                {project.status === 'verified' && (
                                                    <span className="badge-verified rounded-full px-3 py-1 text-xs font-semibold">Verified</span>
                                                )}
                                                {project.status === 'rejected' && (
                                                    <span className="badge-rejected rounded-full px-3 py-1 text-xs font-semibold">Rejected</span>
                                                )}
                                                {project.status === 'issued' && (
                                                    <span className="rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 text-xs font-semibold">Credited</span>
                                                )}
                                            </div>
                                            <div className="text-sm text-muted">
                                                {project.location} · {project.ecosystem}
                                                {project.credits > 0 && <> · <span className="text-seagrass font-semibold">{project.credits} credits</span></>}
                                            </div>
                                        </div>
                                        {project.status === 'verified' && (
                                            <button
                                                onClick={() => handleIssue(project.id)}
                                                disabled={aarna.busy}
                                                className="rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-purple-600/40 transition-all disabled:opacity-50 flex items-center gap-2"
                                            >
                                                <IconCoin size={16} color="#fff" /> Issue Credits
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
