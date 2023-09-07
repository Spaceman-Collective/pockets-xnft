import { Character, NFT } from "@/types/server"
import { apiRequest } from "."
import { WalletAssets, WalletCharacters } from "@/types/client/Wallet"

export const getWalletCharacters = async (walletAddress: string) => {
	return apiRequest<WalletCharacters>("get", "/wallet/characters", {
		wallet: walletAddress,
	})
}

export const getWalletAssets = async (walletAddress: string) => {
	return apiRequest<WalletAssets>("get", "/wallet/assets", {
		wallet: walletAddress,
	})
}
