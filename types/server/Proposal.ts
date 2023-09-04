interface ProposalBase {
	created: string | number | Date
	id?: string
	faction: string
	status: ProposalStatus
	type: ProposalType
}

export enum ProposalStatus {
	VOTING = "VOTING",
	PASSED = "PASSED",
	CLOSED = "CLOSED",
}

export type ProposalType =
	| "BUILD"
	| "UPGRADE"
	| "WITHDRAW"
	| "MINT"
	| "ALLOCATE"
	| "THRESHOLD"
	| "TAX"
	| "BURN"

export const ProposalTypes = [
	"BUILD",
	"UPGRADE",
	"WITHDRAW",
	"MINT",
	"ALLOCATE",
	"THRESHOLD",
	"TAX",
	"BURN",
]
interface BuildProposal extends ProposalBase {
	type: "BUILD"
	proposal: {
		type: "BUILD"
		blueprintName: string
	}
}

interface UpgradeProposal extends ProposalBase {
	type: "UPGRADE"
	proposal: {
		type: "UPGRADE"
		stationId: string
	}
}

interface WithdrawProposal extends ProposalBase {
	type: "WITHDRAW"
	proposal: {
		type: "WITHDRAW"
		citizen: string
		resources: { resourceName: string; amount: number }[]
		bonk: string
	}
}

interface MintProposal extends ProposalBase {
	type: "MINT"
	proposal: {
		type: "MINT"
		newSharesToMint: string
	}
}

interface AllocateProposal extends ProposalBase {
	type: "ALLOCATE"
	proposal: {
		type: "ALLOCATE"
		citizen: string
		amount: string
	}
}

interface ThresholdProposal extends ProposalBase {
	type: "THRESHOLD"
	proposal: {
		type: "THRESHOLD"
		newThreshold: string
	}
}

interface TaxProposal extends ProposalBase {
	type: "TAX"
	proposal: {
		type: "TAX"
		newTaxRate: number
	}
}

interface BurnProposal extends ProposalBase {
	type: "BURN"
	proposal: {
		type: "BURN"
		resources: { resourceName: string; amount: number }[]
	}
}

export type Proposal =
	| BuildProposal
	| UpgradeProposal
	| WithdrawProposal
	| MintProposal
	| AllocateProposal
	| ThresholdProposal
	| TaxProposal
	| BurnProposal
