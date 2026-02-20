import { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useAarnaContext } from '../context/AarnaContext'


function IconStore({ size = 20, color = '#006994' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l1-4h16l1 4" /><path d="M3 9v11a1 1 0 001 1h16a1 1 0 001-1V9" />
            <path d="M9 21V9" /><path d="M3 9h18" />
        </svg>
    )
}
function IconTag({ size = 16, color = '#00E5CC' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
    )
}
function IconCoin({ size = 16, color = '#00E5CC' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8" /><path d="M12 6v12M9 9h6M9 15h6" />
        </svg>
    )
}
function IconShoppingCart({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
        </svg>
    )
}
function IconX({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    )
}
function IconUser({ size = 14, color = '#8b9cb6' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
    )
}
function IconWallet({ size = 20, color = '#006994' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12V7H5a2 2 0 010-4h14v4" /><path d="M3 5v14a2 2 0 002 2h16v-5" />
            <path d="M18 12a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
    )
}

export default function Marketplace() {
    const { activeAddress } = useWallet()
    const {
        listings, listingCount, busy, tokenBalance, fetchTokenBalance,
        listForSale, buyListing, cancelListing,
    } = useAarnaContext()

    const [sellAmount, setSellAmount] = useState('')
    const [sellPrice, setSellPrice] = useState('')

    const walletConnected = !!activeAddress
    const activeListings = listings.filter(l => l.active)

    useEffect(() => {
        if (walletConnected) fetchTokenBalance()
    }, [walletConnected, fetchTokenBalance])

    const handleList = async () => {
        const amt = parseInt(sellAmount)
        const price = parseInt(sellPrice)
        if (!amt || amt <= 0 || !price || price <= 0) return
        await listForSale(amt, price)
        setSellAmount('')
        setSellPrice('')
    }


    if (!walletConnected) {
        return (
            <div className="page-enter" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="g-card" style={{ maxWidth: 420, textAlign: 'center', padding: '3rem 2rem' }}>
                    <IconWallet size={48} color="#006994" />
                    <h2 style={{ color: 'white', fontSize: '1.5rem', marginTop: '1rem' }}>Connect Wallet</h2>
                    <p className="text-muted" style={{ marginTop: '0.5rem' }}>
                        Connect your Algorand wallet to access the Carbon Credit Marketplace.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="page-enter pt-24 min-h-screen px-4 sm:px-6" style={{ paddingBottom: '3rem' }}>
            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <IconStore size={28} color="#006994" />
                        <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
                            Carbon Credit Marketplace
                        </h1>
                    </div>
                    <p className="text-muted" style={{ fontSize: '0.95rem' }}>
                        Buy and sell AARNA carbon credits. Fully on-chain with escrow protection.
                    </p>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="g-card stat-glow" style={{ padding: '1.25rem', textAlign: 'center' }}>
                        <div className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Active Listings</div>
                        <div className="text-accent" style={{ fontSize: '1.75rem', fontWeight: 700 }}>{activeListings.length}</div>
                    </div>
                    <div className="g-card stat-glow" style={{ padding: '1.25rem', textAlign: 'center' }}>
                        <div className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Total Listings</div>
                        <div className="text-accent" style={{ fontSize: '1.75rem', fontWeight: 700 }}>{listingCount}</div>
                    </div>
                    <div className="g-card stat-glow" style={{ padding: '1.25rem', textAlign: 'center' }}>
                        <div className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Tokens Listed</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#00E5CC' }}>
                            {activeListings.reduce((sum, l) => sum + l.amount, 0)}
                        </div>
                    </div>
                    <div className="g-card stat-glow" style={{ padding: '1.25rem', textAlign: 'center' }}>
                        <div className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Your AARNA Balance</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10B981' }}>
                            {tokenBalance}
                        </div>
                    </div>
                </div>

                {/* Sell Form */}
                <div className="g-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <IconTag size={18} color="#00E5CC" />
                        Sell Your Carbon Credits
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
                        <div>
                            <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: 4 }}>
                                Amount (AARNA tokens)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 100"
                                value={sellAmount}
                                onChange={e => setSellAmount(e.target.value)}
                                min="1"
                                style={{
                                    width: '100%', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'white',
                                    fontSize: '0.9rem', outline: 'none',
                                }}
                            />
                        </div>
                        <div>
                            <label className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: 4 }}>
                                Price per token (μALGO)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 1000"
                                value={sellPrice}
                                onChange={e => setSellPrice(e.target.value)}
                                min="1"
                                style={{
                                    width: '100%', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'white',
                                    fontSize: '0.9rem', outline: 'none',
                                }}
                            />
                        </div>
                        <button
                            className="btn-primary"
                            onClick={handleList}
                            disabled={busy || !sellAmount || !sellPrice}
                            style={{ padding: '0.6rem 1.5rem', whiteSpace: 'nowrap' }}
                        >
                            {busy ? 'Listing…' : 'List for Sale'}
                        </button>
                    </div>
                    {sellAmount && sellPrice && parseInt(sellAmount) > 0 && parseInt(sellPrice) > 0 && (
                        <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                            Total: {parseInt(sellAmount) * parseInt(sellPrice)} μALGO ({((parseInt(sellAmount) * parseInt(sellPrice)) / 1_000_000).toFixed(4)} ALGO)
                        </p>
                    )}
                </div>

                {/* Active Listings */}
                <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <IconShoppingCart size={18} color="#006994" />
                    Active Listings
                </h3>

                {activeListings.length === 0 ? (
                    <div className="g-card" style={{ padding: '2rem', textAlign: 'center' }}>
                        <p className="text-muted">No active listings yet. Be the first to list your carbon credits!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {activeListings.map(listing => {
                            const totalCost = listing.amount * listing.pricePerToken
                            const isSeller = activeAddress === listing.seller
                            return (
                                <div key={listing.id} className="g-card" style={{
                                    padding: '1.25rem',
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr 1fr auto',
                                    alignItems: 'center',
                                    gap: '1rem',
                                }}>
                                    <div>
                                        <div className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>Amount</div>
                                        <div style={{ color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <IconCoin size={14} color="#00E5CC" />
                                            {listing.amount} AARNA
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>Price / Token</div>
                                        <div style={{ color: 'white', fontWeight: 600 }}>{listing.pricePerToken} μALGO</div>
                                    </div>
                                    <div>
                                        <div className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>Total Cost</div>
                                        <div style={{ color: '#F59E0B', fontWeight: 600 }}>{(totalCost / 1_000_000).toFixed(4)} ALGO</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {isSeller ? (
                                            <button
                                                className="btn-ghost"
                                                onClick={() => cancelListing(listing.id)}
                                                disabled={busy}
                                                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0.5rem 1rem' }}
                                            >
                                                <IconX size={14} color="#EF4444" />
                                                Cancel
                                            </button>
                                        ) : (
                                            <button
                                                className="btn-primary"
                                                onClick={() => buyListing(listing.id)}
                                                disabled={busy}
                                                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0.5rem 1rem' }}
                                            >
                                                <IconShoppingCart size={14} color="white" />
                                                Buy
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Completed Sales */}
                {listings.filter(l => !l.active).length > 0 && (
                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', opacity: 0.7 }}>
                            Completed Sales
                        </h3>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            {listings.filter(l => !l.active).map(listing => (
                                <div key={listing.id} className="g-card" style={{
                                    padding: '1rem',
                                    opacity: 0.5,
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr 1fr auto',
                                    alignItems: 'center',
                                    gap: '1rem',
                                }}>
                                    <div>
                                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>Amount</div>
                                        <div style={{ color: 'white' }}>{listing.amount} AARNA</div>
                                    </div>
                                    <div>
                                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>Price</div>
                                        <div style={{ color: 'white' }}>{listing.pricePerToken} μALGO</div>
                                    </div>
                                    <div>
                                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>Seller</div>
                                        <div style={{ color: 'white', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <IconUser size={12} />
                                            {listing.seller.slice(0, 6)}…{listing.seller.slice(-4)}
                                        </div>
                                    </div>
                                    <span style={{ color: '#8b9cb6', fontSize: '0.8rem', fontStyle: 'italic' }}>Sold</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
