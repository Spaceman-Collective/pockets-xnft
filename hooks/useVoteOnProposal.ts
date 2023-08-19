import { useMutation } from "@tanstack/react-query";
import { voteOnProposal } from '@/lib/apiClient';

interface VoteResponse {
    vote: string;
}

export const useVoteOnProposal = () => {
    const mutation = useMutation<VoteResponse, Error, { mint: string, proposalId: string }>(
        ({ mint, proposalId }) => voteOnProposal(mint, proposalId)
    );
    return mutation;
};