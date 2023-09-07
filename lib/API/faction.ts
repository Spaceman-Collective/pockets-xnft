import { Blueprint, Character, Faction, Proposal } from "@/types/server"
import { apiRequest } from "."

export interface PostFactionCreateData {
	signedTx: string
	factionData: {
		name: string
		image: string
		external_link: string
		description: string
	}
}

export const postFactionCreate = async (
	signedTx: PostFactionCreateData["signedTx"],
	factionData: PostFactionCreateData["factionData"],
) => {
	return apiRequest<Faction>("post", "/faction/create", {
		signedTx,
		factionData,
	})
}

export const postFactionConstructionComplete = async (factionId: string) => {
	return apiRequest<{
		faction: Faction
		station: Blueprint
	}>("post", "/faction/construction/complete", { factionId })
}

export const postFactionStationStart = async (signedTx: string) => {
	return apiRequest<Faction>("post", "/faction/station/start", { signedTx })
}

export const postFactionStationClaim = async (
	mint: string,
	stationId: string,
) => {
	return apiRequest<Faction>("post", "/faction/station/claim", {
		mint,
		stationId,
	})
}

export const getFactions = async () => {
	return apiRequest<{
		factions: Faction[]
		total: number
		skip: number
		take: number
	}>("get", "/factions", { skip: 0, take: 100 })
}

export const getFaction = async (factionId: string) => {
	return apiRequest<{
		citizens: Character[]
		faction: Faction
		resources: {
			name: string
			value: string
		}[]
		stations: {
			blueprint: string
			faction: string
			id: string
			level: number
		}[]
	}>("get", "/faction", {
		id: factionId,
	})
}

export const postFactionJoin = async (signedTx: string) => {
	return apiRequest<{
		success: boolean
		signedTx: string[]
	}>("post", "/faction/join", { signedTx })
}

// TODO: Add the correct return type in the generic
export const postFactionLeave = async (signedTx: string) => {
	return apiRequest("post", "/faction/leave", { signedTx })
}

export const getFactionResourceFields = async (factionId: string) => {
	return apiRequest<{
		rfs: {
			id: string
			faction: string
			resource: string
			amount: string
			timer: string
		}[]
	}>("get", "/faction/rfs", { factionId })
}

export const postFactionProposalCreate = async (signedTx: string) => {
	return apiRequest<{ sig: string }>("post", "/faction/proposal/create", {
		signedTx,
	})
}

export const getFactionProposal = async (proposalId: string) => {
	return apiRequest<Proposal>("get", "/faction/proposal", { id: proposalId })
}

export const getFactionProposals = async (
	faction: string,
	skip: number,
	take: number,
) => {
	return apiRequest<{
		proposals: Proposal[]
		skip: string
		take: string
		total: number
	}>("get", "/faction/proposals", {
		faction,
		skip,
		take,
	})
}

export const getAllFactionProposals = async (faction: string) => {
	return apiRequest<{
		proposals: Proposal[]
		total: number
	}>("get", "/faction/proposals/all", {
		faction,
	})
}

// TODO: Add the correct return type in the generic
export const postFactionProposalProcess = async (proposalId: string) => {
	return apiRequest("post", "/faction/proposal/process", { id: proposalId })
}
