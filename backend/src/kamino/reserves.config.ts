export const KAMINO_MARKET = '7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF';

export interface Reserves {
  reserve: string;
  symbol: string;
  liquidityTokenMint: string;
  decimals: number;
}

export const BORROW_ASSETS: Record<string, Reserves> = {
  "USDC" : {
    reserve: "D6q6wuQSrifJKZYpR1M8R4YawnLDtDsMmWM1NbBmgJ59",
    symbol: "USDC",
    liquidityTokenMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6
  },
  "USDT" : {
    reserve: "H3t6qZ1JkguCNTi9uzVKqQ7dvt2cum4XiXWom6Gn5e5S",
    symbol: "USDT",
    liquidityTokenMint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    decimals: 6
  },
  "USDS" : {
    reserve: "BHUi32TrEsfN2U821G4FprKrR4hTeK4LCWtA3BFetuqA",
    symbol: "USDS",
    liquidityTokenMint: "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA",
    decimals: 6
  },
  "USDG" : {
    reserve: "ESCkPWKHmgNE7Msf77n9yzqJd5kQVWWGy3o5Mgxhvavp",
    symbol: "USDG",
    liquidityTokenMint: "2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH",
    decimals: 6
  },
}