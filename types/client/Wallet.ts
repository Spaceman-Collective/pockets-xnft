import { Character, NFT } from "../server"

export interface WalletAssets {
	units: NFT[] // Units are returned as NFTs for this endpoint
	resources: {
		name: string
		mint: string
		value: string
	}
}

export interface WalletCharacters {
	nfts?: NFT[]
	characters?: Character[]
}
