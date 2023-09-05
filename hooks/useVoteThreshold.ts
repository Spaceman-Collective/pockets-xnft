import { getFactionPDA, getFactionAccount } from "@/lib/solanaClient"
import { Connection } from "@solana/web3.js"
import { Character } from "@/types/server"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useVoteThreshold = (
	currentCharacter: Character | undefined,
	connection: Connection | undefined,
) => {
	return useQuery(
		["voteThreshold", currentCharacter?.faction?.id],
		async () => {
			if (!currentCharacter?.faction?.id) {
				console.warn("Character undefined on vote threshold retrieval")
				return "UND"
			}

			const factPDA = getFactionPDA(currentCharacter?.faction?.id!)
			const fA = await getFactionAccount(connection!, factPDA)

			if (fA) {
				return fA?.thresholdToPass.toString()
			} else {
				toast.error("Failed to get vote threshold")
				return "NA"
			}
		},
		{
			enabled: !!currentCharacter && !!connection,
		},
	)
}
