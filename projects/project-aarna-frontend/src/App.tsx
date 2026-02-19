import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SupportedWallet, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react'
import { SnackbarProvider } from 'notistack'
import { getAlgodConfigFromViteEnvironment, getKmdConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'
import { useAarna } from './hooks/useAarna'
import { AarnaProvider } from './context/AarnaContext'
import { Navbar1 } from './components/ui/navbar-1'
import Landing from './pages/Landing'
import Developer from './pages/Developer'
import Validator from './pages/Validator'
import Registry from './pages/Registry'
import Marketplace from './pages/Marketplace'

let supportedWallets: SupportedWallet[]
if (import.meta.env.VITE_ALGOD_NETWORK === 'localnet') {
  const kmdConfig = getKmdConfigFromViteEnvironment()
  supportedWallets = [
    {
      id: WalletId.KMD,
      options: {
        baseServer: kmdConfig.server,
        token: String(kmdConfig.token),
        port: String(kmdConfig.port),
      },
    },
  ]
} else {
  supportedWallets = [
    { id: WalletId.DEFLY },
    { id: WalletId.PERA },
    { id: WalletId.EXODUS },
  ]
}

export default function App() {
  const algodConfig = getAlgodConfigFromViteEnvironment()

  const walletManager = new WalletManager({
    wallets: supportedWallets,
    defaultNetwork: algodConfig.network,
    networks: {
      [algodConfig.network]: {
        algod: {
          baseServer: algodConfig.server,
          port: algodConfig.port,
          token: String(algodConfig.token),
        },
      },
    },
    options: {
      resetNetwork: true,
    },
  })

  return (
    <BrowserRouter>
      <SnackbarProvider maxSnack={3}>
        <WalletProvider manager={walletManager}>
          <AppInner />
        </WalletProvider>
      </SnackbarProvider>
    </BrowserRouter>
  )
}

/**
 * Inner component rendered inside WalletProvider so useAarna
 * can access the wallet context. Single hook instance shared via AarnaProvider.
 */
function AppInner() {
  const aarna = useAarna()

  return (
    <AarnaProvider value={aarna}>
      <div className="min-h-screen bg-[#0b1222]" data-theme="aarna">
        <Navbar1 />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/validator" element={<Validator />} />
          <Route path="/registry" element={<Registry />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>
      </div>
    </AarnaProvider>
  )
}
