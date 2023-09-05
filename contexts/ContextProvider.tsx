import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base"
import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react"
import { FC, ReactNode, useCallback, useMemo, useEffect } from "react"
import dynamic from "next/dynamic"
import { useSolana } from "@/hooks/useSolana"
import { CharacterProvider } from "./CharacterProvider"

const ReactUIWalletModalProviderDynamic = dynamic(
	async () =>
		(await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
	{ ssr: false },
)

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
	// const network = WalletAdapterNetwork.Mainnet;
	// const endpoint = useMemo(() => clusterApiUrl(network), [network]);
	const endpoint = process.env.NEXT_PUBLIC_RPC

	const wallets = useMemo(() => [], [])

	const onError = useCallback((error: WalletError) => {
		console.error("Wallet error: " + error)
	}, [])

	return (
		<ConnectionProvider endpoint={endpoint as string}>
			<WalletProvider wallets={wallets} onError={onError} autoConnect>
				<ReactUIWalletModalProviderDynamic>
					<CharacterProvider>{children}</CharacterProvider>
				</ReactUIWalletModalProviderDynamic>
			</WalletProvider>
		</ConnectionProvider>
	)
}
