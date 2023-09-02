import { fetchAllAssets } from "@/lib/apiClient"
import { useQuery } from "@tanstack/react-query"
import { useSolana } from "./useSolana"
import { useEffect, useState } from "react"
import { formatBalance } from "@/lib/utils"
import { SERVER_KEY } from "@/constants"
import { useConnection } from "@solana/wallet-adapter-react"

export const useAllWalletAssets = () => {
	const { walletAddress } = useSolana()

	return useQuery(
		["wallet-assets", walletAddress],
		() => fetchAllAssets({ walletAddress: walletAddress }),
		{ enabled: walletAddress !== undefined },
	)
}

export const usePrizePool = () => {
	const { connection } = useConnection()
	const { getBonkBalance } = useSolana()

	const [prizePool, setPrizePool] = useState<string>()
	const [isLoading, setIsLoading] = useState<boolean>(false)

	useEffect(() => {
		;(async () => {
			if (connection) {
				setIsLoading(true)
				let balance = await getBonkBalance({
					walletAddress: SERVER_KEY,
					connection,
				})
				const wholeBalance = Math.floor(balance)

				setPrizePool(formatBalance(wholeBalance))
				setIsLoading(false)
			}
		})()
	}, [connection])

	return {
		setIsLoading,
		isLoading,
		data: prizePool,
	}
}
