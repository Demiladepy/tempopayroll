import { defineChain } from 'viem'

export const tempoTestnet = defineChain({
  id: 42431,
  name: 'Tempo Testnet (Moderato)',
  network: 'tempo-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Tempo',
    symbol: 'TEMPO',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_TEMPO_RPC || 'https://rpc.moderato.tempo.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Tempo Explorer',
      url: 'https://explorer.testnet.tempo.org',
    },
  },
  testnet: true,
})

export const USDC_ADDRESS = (process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`
