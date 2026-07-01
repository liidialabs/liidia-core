"use client";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "abcf2958-f7d4-4d94-9a35-5913800e7b19",
        walletConnectors: [SolanaWalletConnectors],
        initialAuthenticationMode: 'connect-only'
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}