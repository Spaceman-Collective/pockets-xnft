import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import {
	getProposalPDA,
	getCitizenPDA,
	getVotePDA,
	getVoteAccount,
	getMultipleVoteAccounts,
} from "@/lib/solanaClient"
import { Connection, PublicKey } from "@solana/web3.js"
import { useSelectedCharacter } from "./useSelectedCharacter"

type ProposalVoteInfo = {
	voteAccountExists: boolean
	voteAmounts: string[]
}

export const useAllProposalVoteInfo = (
	proposalIds: string[] | undefined,
	connection: Connection,
): { data: ProposalVoteInfo; refetch: () => void; isLoading: boolean } => {
	const [selectedCharacter] = useSelectedCharacter()
	const queryClient = useQueryClient()

	const defaultQueryResult: ProposalVoteInfo = {
		voteAccountExists: false,
		voteAmounts: ["0"],
	}

	const queryResult = useQuery<ProposalVoteInfo, unknown>(
		["proposalInfo", proposalIds, selectedCharacter?.mint],
		async (): Promise<ProposalVoteInfo> => {
			if (!proposalIds || !selectedCharacter) {
				return defaultQueryResult
			}

			let votePDAAddresses: PublicKey[] = []

			for (let proposalId of proposalIds) {
				const propPDA = getProposalPDA(proposalId)
				const citiPDA = getCitizenPDA(new PublicKey(selectedCharacter?.mint))
				const votePDA = getVotePDA(citiPDA, propPDA)
				votePDAAddresses.push(votePDA)
			}

			let voteAmounts = ["0"]
			const vAList = await getMultipleVoteAccounts(connection, votePDAAddresses)
			if (!vAList) {
				voteAmounts = ["NA"]
			} else {
				voteAmounts = vAList.map((vA) => vA!.voteAmt.toString())
			}

			await new Promise((resolve) => setTimeout(resolve, 1000))

			queryClient.invalidateQueries([
				"proposalInfo",
				proposalIds,
				selectedCharacter?.mint,
			])

			return {
				voteAccountExists: !!vAList.length,
				voteAmounts: voteAmounts,
			}
		},
	)
	return {
		data: queryResult.data || defaultQueryResult,
		refetch: queryResult.refetch,
		isLoading: queryResult.isLoading,
	}
}
