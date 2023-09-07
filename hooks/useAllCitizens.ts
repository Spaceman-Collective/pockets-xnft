import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { getCitizenPDA, getCitizenAccount } from "@/lib/solanaClient"
import { Connection, PublicKey } from "@solana/web3.js"

export type CitizenAccountInfo = {
	delegatedVotingPower: string
	faction: string
	grantedVotingPower: string
	maxPledgedVotingPower: string
	mint: string
	totalVotingPower: string
}

export const useAllCitizens = (
	mints: string[],
	connection: Connection,
): { data: CitizenAccountInfo[]; isLoading: boolean } => {
	const defaultQueryResult: CitizenAccountInfo = {
		delegatedVotingPower: "0",
		faction: "",
		grantedVotingPower: "0",
		maxPledgedVotingPower: "0",
		mint: "",
		totalVotingPower: "0",
	}

	const fetchCitizenInfo = async (mint: string): Promise<CitizenAccountInfo> => {
		const characterMint = new PublicKey(mint)
		const citizenPDA = getCitizenPDA(characterMint)
		const citizenAccount = await getCitizenAccount(connection, citizenPDA)

		if (!citizenAccount || !citizenAccount.faction) {
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
	}

	const queryResult = useQuery<CitizenAccountInfo[], unknown>(
		["citizens", mints],
		() => Promise.all(mints.map(fetchCitizenInfo)),
		{
			enabled: !!mints && mints.length > 0 && !!connection,
		},
	)

	return {
		data: queryResult.data || Array(mints.length).fill(defaultQueryResult),
		isLoading: queryResult.isLoading,
	}
}
