import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import {
	getProposalPDA,
	getCitizenPDA,
	getVotePDA,
	getVoteAccount,
	getProposalAccount,
} from "@/lib/solanaClient"
import { Connection, PublicKey } from "@solana/web3.js"
import { useContext } from "react"
import { MainContext } from "@/contexts/MainContext"

type ProposalVoteInfo = {
	voteAccountExists: boolean
	totalVoteAmount: string
	personalVoteAmount: string
}

export const useProposalVoteInfo = (
	proposalId: string | undefined,
	connection: Connection,
): { data: ProposalVoteInfo; isLoading: boolean } => {
	const { selectedCharacter } = useContext(MainContext)

	const defaultQueryResult: ProposalVoteInfo = {
		voteAccountExists: false,
		totalVoteAmount: "0",
		personalVoteAmount: "0",
	}

	const queryClient = useQueryClient()

	const queryResult = useQuery<ProposalVoteInfo, unknown>(
		["proposalInfo", proposalId, selectedCharacter?.mint],
		async (): Promise<ProposalVoteInfo> => {
			if (!proposalId || !selectedCharacter) {
				return defaultQueryResult
			}

			const propPDA = getProposalPDA(proposalId)
			const citiPDA = getCitizenPDA(new PublicKey(selectedCharacter?.mint))
			const votePDA = getVotePDA(citiPDA, propPDA)

			const vA = await getVoteAccount(connection, votePDA)

			if (!vA) {
				console.warn("vote account is null:", vA)
				return {
					voteAccountExists: false,
					totalVoteAmount: "0",
					personalVoteAmount: "NA",
				}
			}

			const pA = await getProposalAccount(connection, proposalId)
			if (!pA) {
				console.warn("proposal account is null!", pA)
				return {
					voteAccountExists: false,
					totalVoteAmount: "NA",
					personalVoteAmount: "0",
				}
			}

			return {
				voteAccountExists: !!vA,
				totalVoteAmount: pA ? pA!.voteAmt.toString() : "0",
				personalVoteAmount: vA ? vA!.voteAmt.toString() : "0",
			}
		},
	)
	return {
		data: queryResult.data || defaultQueryResult,
		isLoading: queryResult.isLoading,
	}
}
