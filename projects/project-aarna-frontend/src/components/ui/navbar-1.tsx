"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X, Wallet, LogOut, ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"
import { useWallet } from "@txnlab/use-wallet-react"

const Navbar1 = () => {
    const { activeAddress, wallets } = useWallet()
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [walletMenuOpen, setWalletMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Close wallet dropdown on outside click
    useEffect(() => {
        if (!walletMenuOpen) return
        const close = () => setWalletMenuOpen(false)
        window.addEventListener("click", close)
        return () => window.removeEventListener("click", close)
    }, [walletMenuOpen])

    const toggleMenu = () => setIsOpen(!isOpen)

    const navItems = [
        { label: "Home", to: "/" },
        { label: "Developer", to: "/developer" },
        { label: "Validator", to: "/validator" },
        { label: "Marketplace", to: "/marketplace" },
        { label: "Registry", to: "/registry" },
    ]

    const handleConnect = async (walletId: string) => {
        const wallet = wallets?.find(w => w.id === walletId)
        if (wallet) {
            try {
                await wallet.connect()
                setWalletMenuOpen(false)
            } catch (err) {
                console.error("Wallet connect error:", err)
            }
        }
    }

    const handleDisconnect = async () => {
        const connectedWallet = wallets?.find(w => w.isConnected)
        if (connectedWallet) {
            await connectedWallet.disconnect()
        }
    }

    const truncatedAddress = activeAddress
        ? `${activeAddress.slice(0, 4)}…${activeAddress.slice(-4)}`
        : null

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 flex justify-center w-full z-50 px-4"
            animate={{
                paddingTop: scrolled ? 8 : 24,
                paddingBottom: scrolled ? 8 : 24,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            <motion.div
                className="flex items-center justify-between px-6 rounded-full w-full relative"
                animate={{
                    maxWidth: scrolled ? 600 : 800,
                    paddingTop: scrolled ? 8 : 12,
                    paddingBottom: scrolled ? 8 : 12,
                    backgroundColor: scrolled
                        ? "rgba(10, 22, 40, 0.85)"
                        : "rgba(10, 22, 40, 0.45)",
                    backdropFilter: "blur(20px)",
                    boxShadow: scrolled
                        ? "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
                        : "0 4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                }}
            >
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <motion.div
                        className="mr-3 flex items-center gap-2"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        whileHover={{ rotate: 5 }}
                        transition={{ duration: 0.3 }}
                    >
                        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="16" fill="url(#navGrad)" />
                            <path
                                d="M10,20 C12,16 14,18 16,14 C18,10 20,16 22,12"
                                fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round"
                            />
                            <circle cx="16" cy="16" r="4" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
                            <defs>
                                <linearGradient id="navGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#006994" />
                                    <stop offset="1" stopColor="#00E5CC" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <motion.span
                            className="font-display text-sm font-bold text-white tracking-tight"
                            animate={{
                                opacity: scrolled ? 0 : 1,
                                width: scrolled ? 0 : "auto",
                                marginLeft: scrolled ? 0 : 4,
                            }}
                            transition={{ duration: 0.25 }}
                            style={{ overflow: "hidden", whiteSpace: "nowrap" }}
                        >
                            Aarna
                        </motion.span>
                    </motion.div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    {navItems.map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Link
                                to={item.to}
                                className="text-sm text-gray-300 hover:text-white transition-colors font-medium"
                            >
                                {item.label}
                            </Link>
                        </motion.div>
                    ))}
                </nav>

                {/* Desktop Wallet Button */}
                <motion.div
                    className="hidden md:block relative"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    {activeAddress ? (
                        /* Connected — show address + disconnect */
                        <div className="flex items-center gap-2">
                            <div
                                className="inline-flex items-center gap-2 text-sm text-white rounded-full"
                                style={{
                                    padding: scrolled ? "5px 14px" : "7px 18px",
                                    background: "rgba(0,229,204,0.12)",
                                    border: "1px solid rgba(0,229,204,0.25)",
                                    transition: "padding 0.35s ease",
                                }}
                            >
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                                    {truncatedAddress}
                                </span>
                            </div>
                            <motion.button
                                onClick={handleDisconnect}
                                className="p-1.5 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Disconnect wallet"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                            </motion.button>
                        </div>
                    ) : (
                        /* Not connected — show wallet selection dropdown */
                        <div className="relative">
                            <motion.button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setWalletMenuOpen(!walletMenuOpen)
                                }}
                                className="inline-flex items-center justify-center gap-2 text-sm text-white rounded-full hover:opacity-90 transition-all cursor-pointer"
                                style={{
                                    padding: scrolled ? "6px 16px" : "8px 20px",
                                    background: "linear-gradient(135deg, #006994 0%, #0E9B6F 100%)",
                                    boxShadow: "0 2px 12px rgba(0,105,148,0.3)",
                                    transition: "padding 0.35s ease",
                                    border: "none",
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Wallet className="w-3.5 h-3.5" />
                                <span>Connect</span>
                                <ChevronDown className="w-3 h-3" style={{ opacity: 0.7 }} />
                            </motion.button>

                            {/* Wallet dropdown */}
                            <AnimatePresence>
                                {walletMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 py-2 rounded-xl overflow-hidden"
                                        style={{
                                            minWidth: 200,
                                            background: "rgba(10, 22, 40, 0.95)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            backdropFilter: "blur(20px)",
                                            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div style={{ padding: "4px 12px 8px", fontSize: "0.7rem", color: "#8b9cb6", textTransform: "uppercase", letterSpacing: 1 }}>
                                            Select Wallet
                                        </div>
                                        {wallets?.map(wallet => (
                                            <button
                                                key={wallet.id}
                                                onClick={() => handleConnect(wallet.id)}
                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5 transition-colors flex items-center gap-3"
                                                style={{ border: "none", background: "none", cursor: "pointer" }}
                                            >
                                                {wallet.metadata.icon && (
                                                    <img
                                                        src={wallet.metadata.icon}
                                                        alt={wallet.metadata.name}
                                                        style={{ width: 20, height: 20, borderRadius: 4 }}
                                                    />
                                                )}
                                                <span>{wallet.metadata.name}</span>
                                            </button>
                                        ))}
                                        {(!wallets || wallets.length === 0) && (
                                            <div className="px-4 py-3 text-sm text-gray-500">
                                                No wallets available
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>

                {/* Mobile Menu Button */}
                <motion.button className="md:hidden flex items-center" onClick={toggleMenu} whileTap={{ scale: 0.9 }}>
                    <Menu className="h-5 w-5 text-gray-300" />
                </motion.button>
            </motion.div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 pt-24 px-6 md:hidden"
                        style={{ background: "rgba(10, 22, 40, 0.98)", backdropFilter: "blur(20px)" }}
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <motion.button
                            className="absolute top-6 right-6 p-2"
                            onClick={toggleMenu}
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <X className="h-6 w-6 text-gray-300" />
                        </motion.button>
                        <div className="flex flex-col space-y-6">
                            {navItems.map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 + 0.1 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <Link
                                        to={item.to}
                                        className="text-lg text-gray-200 font-medium hover:text-accent transition-colors"
                                        onClick={toggleMenu}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}

                            {/* Mobile wallet section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="pt-6 border-t border-white/10"
                            >
                                {activeAddress ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 px-2">
                                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-white text-sm" style={{ fontFamily: "monospace" }}>
                                                {truncatedAddress}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => { handleDisconnect(); toggleMenu() }}
                                            className="w-full flex items-center justify-center gap-2 px-5 py-3 text-base text-red-400 rounded-full transition-colors"
                                            style={{
                                                background: "rgba(239, 68, 68, 0.1)",
                                                border: "1px solid rgba(239, 68, 68, 0.2)",
                                            }}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Disconnect
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div style={{ fontSize: "0.75rem", color: "#8b9cb6", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                                            Connect Wallet
                                        </div>
                                        {wallets?.map(wallet => (
                                            <button
                                                key={wallet.id}
                                                onClick={() => { handleConnect(wallet.id); toggleMenu() }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-base text-white rounded-xl transition-colors"
                                                style={{
                                                    background: "rgba(255,255,255,0.05)",
                                                    border: "1px solid rgba(255,255,255,0.08)",
                                                }}
                                            >
                                                {wallet.metadata.icon && (
                                                    <img
                                                        src={wallet.metadata.icon}
                                                        alt={wallet.metadata.name}
                                                        style={{ width: 24, height: 24, borderRadius: 6 }}
                                                    />
                                                )}
                                                <span>{wallet.metadata.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export { Navbar1 }
