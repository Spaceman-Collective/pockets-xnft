import { getWalletCharacters } from "@/lib/API"
import { useQuery } from "@tanstack/react-query"
import { useSolana } from "./useSolana"

export const useAssets = () => {
	const { walletAddress } = useSolana()

	return useQuery(["assets"], () => getWalletCharacters(walletAddress ?? ""), {
		enabled: walletAddress !== undefined,
	})
}
