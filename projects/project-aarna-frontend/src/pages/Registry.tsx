import { useAarnaContext } from '../context/AarnaContext'

/* ── Inline SVG icons (replacing emojis) ── */
function IconGlobe({ size = 20, color = '#00E5CC' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    )
}
function IconShieldCheck({ size = 20, color = '#10B981' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
        </svg>
    )
}
function IconCoin({ size = 20, color = '#00E5CC' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8" /><path d="M12 6v12M9 9h6M9 15h6" />
        </svg>
    )
}
function IconMapPin({ size = 16, color = '#7A8FA0' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
    )
}
function IconLeaf({ size = 16, color = '#10B981' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66L12 14" /><path d="M21 3c-4 0-8.5 2-12 5 2 4 6.5 7.3 12 5 1-4 0-7.5-0-10z" />
        </svg>
    )
}
function IconUser({ size = 16, color = '#7A8FA0' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
    )
}
function IconHash({ size = 16, color = '#7A8FA0' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
        </svg>
    )
}
function IconExternalLink({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
        </svg>
    )
}
function IconWaves({ size = 40, color = '#006994' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        </svg>
    )
}

export default function Registry() {
    const aarna = useAarnaContext()
    const all = aarna.projects
    const verified = all.filter((p) => p.status === 'verified' || p.status === 'issued')
    const totalCredits = all.reduce((sum, p) => sum + p.credits, 0)

    return (
        <div className="page-enter pt-24 min-h-screen px-4 sm:px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                        <IconGlobe size={28} color="#006994" />
                        Public <span className="text-accent">Registry</span>
                    </h1>
                    <p className="mt-2 text-muted">
                        Browse all blue carbon projects and their impact on the Indian coast.
                    </p>
                </div>

                {/* ── Impact Summary ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="g-card stat-glow p-5 text-center">
                        <div className="flex justify-center mb-2"><IconShieldCheck size={24} color="#10B981" /></div>
                        <div className="text-2xl font-bold text-white font-display">{verified.length}</div>
                        <div className="text-xs text-muted mt-1">Verified Projects</div>
                    </div>
                    <div className="g-card stat-glow p-5 text-center">
                        <div className="flex justify-center mb-2"><IconCoin size={24} color="#00E5CC" /></div>
                        <div className="text-2xl font-bold text-white font-display">{totalCredits.toLocaleString()}</div>
                        <div className="text-xs text-muted mt-1">AARNA Credits</div>
                    </div>
                    <div className="g-card stat-glow p-5 text-center">
                        <div className="flex justify-center mb-2"><IconGlobe size={24} color="#006994" /></div>
                        <div className="text-2xl font-bold text-white font-display">{all.length}</div>
                        <div className="text-xs text-muted mt-1">Total Projects</div>
                    </div>
                    <div className="g-card stat-glow p-5 text-center">
                        <div className="flex justify-center mb-2"><IconLeaf size={24} color="#10B981" /></div>
                        <div className="text-2xl font-bold text-white font-display">
                            {new Set(all.map(p => p.ecosystem)).size}
                        </div>
                        <div className="text-xs text-muted mt-1">Ecosystems Tracked</div>
                    </div>
                </div>

                {/* ── All Projects ── */}
                <h2 className="text-xl font-bold text-white mb-4">All Projects ({all.length})</h2>
                {all.length === 0 ? (
                    <div className="g-card p-12 text-center">
                        <div className="flex justify-center mb-4"><IconWaves size={48} color="#006994" /></div>
                        <p className="text-muted">No projects have been submitted yet.</p>
                        <p className="text-sm text-muted mt-2" style={{ opacity: 0.7 }}>
                            Deploy the contract and submit a project from the <span className="text-accent">Developer</span> page.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-5">
                        {all.map((project) => (
                            <div key={project.id} className="g-card overflow-hidden group">
                                {/* Color band top */}
                                <div
                                    className="h-1.5 w-full"
                                    style={{
                                        background: project.status === 'verified' || project.status === 'issued'
                                            ? 'linear-gradient(to right, #10B981, #006994)'
                                            : project.status === 'rejected'
                                                ? 'linear-gradient(to right, #EF4444, #F97316)'
                                                : 'linear-gradient(to right, #F59E0B, #F97316)'
                                    }}
                                />

                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="font-bold text-white text-lg group-hover:text-accent transition-colors">
                                            {project.name}
                                        </h3>
                                        <span
                                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${project.status === 'verified'
                                                ? 'badge-verified'
                                                : project.status === 'issued'
                                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                                    : project.status === 'rejected'
                                                        ? 'badge-rejected'
                                                        : 'badge-pending'
                                                }`}
                                        >
                                            {project.status === 'issued' ? 'Credited' : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                        </span>
                                    </div>

                                    {/* Details grid */}
                                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                        <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 flex items-center gap-2">
                                            <IconMapPin size={14} />
                                            <span className="text-white/80">{project.location}</span>
                                        </div>
                                        <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 flex items-center gap-2">
                                            <IconLeaf size={14} />
                                            <span className="text-white/80">{project.ecosystem}</span>
                                        </div>
                                        <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 flex items-center gap-2">
                                            <IconUser size={14} />
                                            <span className="text-white/80 font-mono text-xs">
                                                {project.submitter.slice(0, 8)}...{project.submitter.slice(-4)}
                                            </span>
                                        </div>
                                        <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 flex items-center gap-2">
                                            <IconHash size={14} />
                                            <span className="text-white/80">Project #{project.id}</span>
                                        </div>
                                    </div>

                                    {/* Carbon stats for verified/issued */}
                                    {(project.status === 'verified' || project.status === 'issued') && project.credits > 0 && (
                                        <div className="mt-4 flex gap-4">
                                            <div className="flex-1 rounded-xl p-3 text-center" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                                                <div className="text-xl font-bold text-seagrass font-display">
                                                    {project.credits.toLocaleString()}
                                                </div>
                                                <div className="text-xs text-muted">AARNA Credits</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* IPFS CID */}
                                    <div className="mt-4 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs font-mono text-accent truncate" style={{ opacity: 0.8 }}>
                                        CID: {project.cid}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Explorer link ── */}
                <div className="mt-12 mb-12 text-center">
                    <a
                        href="https://testnet.explorer.perawallet.app/"
                        target="_blank"
                        rel="noopener"
                        className="btn-ghost inline-flex items-center gap-2"
                    >
                        <IconExternalLink size={16} />
                        View on Algorand Testnet Explorer
                    </a>
                </div>
            </div>
        </div>
    )
}
