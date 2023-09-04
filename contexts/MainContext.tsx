import { useWallet } from "@solana/wallet-adapter-react"
import { FC, ReactNode, createContext, useEffect } from "react"
import { useRouter } from "next/router"

import { WalletAssets, WalletCharacters } from "@/types/client"
import { useSolana } from "@/hooks/useSolana"
import { useAllWalletAssets } from "@/hooks/useWalletAssets"
import { useAssets } from "@/hooks/useCharacters"
import { Character } from "@/types/server"
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter"

export interface DefaultContext {
	address: string
	assets: WalletAssets | undefined
	characters: WalletCharacters | undefined
	selectedCharacter: Character | undefined | null
	setSelectedCharacter: (char: Character | undefined | null) => void
	isLoading?: boolean
}

const DefaultContext: Partial<DefaultContext> = {
	address: "",
	assets: undefined,
	characters: undefined,
	selectedCharacter: undefined,
	setSelectedCharacter: () => {},
	isLoading: true,
}

export const MainContext = createContext<DefaultContext>(
	DefaultContext as DefaultContext,
)

export const MainContextProvider: FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { connected, connecting, disconnecting } = useWallet()
	const { push, pathname } = useRouter()

	if (connected && pathname === "/") {
		push("/character")
	} else if (!connected && pathname !== "/") {
		push("/")
	}

	const { walletAddress: address } = useSolana()
	const { data: assets, isLoading: assetsIsLoading } = useAllWalletAssets()
	const { data: characters, isLoading: charactersIsLoading } = useAssets()
	const [selectedCharacter, setSelectedCharacter] = useSelectedCharacter()

	useEffect(() => {
		if (!connected && !connecting && !disconnecting && pathname !== "/") {
			push("/")
		}
	}, [connected, connecting, disconnecting, pathname, push])

	return (
		<MainContext.Provider
			value={{
				address: address || "",
				assets,
				characters,
				selectedCharacter,
				setSelectedCharacter,
				isLoading: assetsIsLoading || charactersIsLoading,
			}}
		>
			{children}
		</MainContext.Provider>
	)
}
