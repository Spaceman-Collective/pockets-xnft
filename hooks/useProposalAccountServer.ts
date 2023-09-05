import { useQuery, QueryFunctionContext } from "@tanstack/react-query"
import { getAccountsProposal } from "@/lib/API"
import { Connection } from "@solana/web3.js"

export const useProposalAccountServer = (id: string) => {
	return useQuery(["proposalAccount", id], () => getAccountsProposal(id))
}
