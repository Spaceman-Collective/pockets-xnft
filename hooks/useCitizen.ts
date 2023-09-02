import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { getCitizenPDA, getCitizenAccount } from "@/lib/solanaClient"
import { Connection, PublicKey } from "@solana/web3.js"
import toast from "react-hot-toast"

export type CitizenAccountInfo = {
	delegatedVotingPower: string
	faction: string
	grantedVotingPower: string
	maxPledgedVotingPower: string
	mint: string
	totalVotingPower: string
}

export const useCitizen = (
	mint: string,
	connection: Connection,
): { data: CitizenAccountInfo; isLoading: boolean } => {
	const defaultQueryResult: CitizenAccountInfo = {
		delegatedVotingPower: "0",
		faction: "",
		grantedVotingPower: "0",
		maxPledgedVotingPower: "0",
		mint: "",
		totalVotingPower: "0",
	}

	const queryResult = useQuery<CitizenAccountInfo, unknown>(
		["citizen", mint],
		async (): Promise<CitizenAccountInfo> => {
			if (!mint) {
				return defaultQueryResult
			}

			const characterMint = new PublicKey(mint)
			const citizenPDA = getCitizenPDA(characterMint)
			const citizenAccount = await getCitizenAccount(connection, citizenPDA)

			if (!citizenAccount) {
				console.error("Failed to fetch citizen")
				return defaultQueryResult
			}

			if (!citizenAccount.faction) {
				console.error("No citizen faction found")
				return defaultQueryResult
			}

			return {
				delegatedVotingPower: citizenAccount.delegatedVotingPower.toString(),
				faction: citizenAccount.faction?.toString(),
				grantedVotingPower: citizenAccount.grantedVotingPower.toString(),
				maxPledgedVotingPower: citizenAccount.maxPledgedVotingPower.toString(),
				mint: citizenAccount.mint.toString(),
				totalVotingPower: citizenAccount.totalVotingPower.toString(),
			}
		},
	)

	return {
		data: queryResult.data || defaultQueryResult,
		isLoading: queryResult.isLoading,
	}
}
