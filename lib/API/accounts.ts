import { Proposal, ProposalStatus } from "@/types/server"
import { apiRequest } from "."

// TODO: Add the correct return type in the generic
export const getAccountsFaction = async (proposalId: string) => {
	return apiRequest("get", "/accounts/faction", { id: proposalId })
}

// TODO: Add the correct return type in the generic
export const getAccountsCitizen = async (mint: string) => {
	return apiRequest("get", "/accounts/citizen", { mint })
}

export const getAccountsProposal = async (proposalId: string) => {
	return apiRequest<{
		id: string
		faction: string
		voteAmt: string
		status: ProposalStatus
	}>("get", "/accounts/proposal", { id: proposalId })
}

// TODO: Add the correct return type in the generic
export const getAccountsVote = async (mint: string, proposalId: string) => {
	return apiRequest("get", "/accounts/vote", { mint, proposalId })
}

export const getAccountsDelegation = async (
	mint: string,
	recipientMint: string,
) => {
	return apiRequest<{
		proposals: Proposal[]
		skip: string
		take: string
		total: number
	}>("get", "/accounts/delegation", { mint, recipientMint })
}

export const getAccountsResourceFields = async (id: string) => {
	return apiRequest<{
		proposals: Proposal[]
		skip: string
		take: string
		total: number
	}>("get", "/accounts/rf", { id })
}
