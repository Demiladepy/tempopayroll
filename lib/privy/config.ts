import type { PrivyClientConfig } from '@privy-io/react-auth'
import { tempoTestnet } from '../tempo/config'

export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    ethereum: {
      createOnLogin: 'users-without-wallets',
    },
  },
  supportedChains: [tempoTestnet],
  defaultChain: tempoTestnet,
  appearance: {
    theme: 'light',
    accentColor: '#6366F1',
  },
}
