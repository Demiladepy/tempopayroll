import { createConfig, http } from 'wagmi'
import { tempoTestnet } from '@/lib/tempo/config'

export const wagmiConfig = createConfig({
  chains: [tempoTestnet],
  transports: {
    [tempoTestnet.id]: http(process.env.NEXT_PUBLIC_TEMPO_RPC || 'https://rpc.moderato.tempo.xyz'),
  },
})
