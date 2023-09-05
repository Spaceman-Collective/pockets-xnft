import { ResourceType } from "@/types/server"
import { apiRequest } from "."

export const postResourceFieldHarvest = async ({
	signedTx,
}: {
	signedTx: string
}) => {
	return apiRequest<{
		newTimerObjects: {
			mint: string
			rf: string
			newTimer: string
			resource: string
			amount: number
		}[]
		sigs: string[]
		resourceTotalReturns: {
			[resource in ResourceType]: {
				taxes: string
				harvest: string
			}
		}
	}>("post", "/rf/harvest", {
		signedTx,
	})
}

export const getResourceFieldAllocation = async () => {
	return apiRequest<{ id: string; isDisoverable: boolean; rfCount: number }>(
		"get",
		"/rf/allocation",
		null,
	)
}

export const postResourceFieldAllocate = async (
	params:
		| { signedTx: string; charMint?: never }
		| { signedTx?: never; charMint: string },
): Promise<string> => {
	let body =
		"signedTx" in params
			? { signedTx: params.signedTx }
			: { mint: params.charMint }
	return apiRequest("post", "/rf/allocate", body)
}
