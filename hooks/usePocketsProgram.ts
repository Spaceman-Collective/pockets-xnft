import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor"
import { PocketsProgram } from "@/lib/program/pockets_program"
import pocketsIDL from "@/lib/program/pockets_program.json"
import { useSolana } from "./useSolana"
import { useMemo } from "react"
import { useAnchorWallet } from "@solana/wallet-adapter-react"

const POCKETS_PROGRAM_PROGRAMID = "GEUwNbnu9jkRMY8GX5Ar4R11mX9vXR8UDFnKZMn5uWLJ"

/**
 * !!! Currently not being used but did not feel like deleting it
 */
export const usePocketsProgram = (useFetchIDL?: boolean) => {
	const { connection } = useSolana()
	const wallet = useAnchorWallet()

	return useMemo(async () => {
		if (!connection || !wallet) return null

		try {
			const provider = new AnchorProvider(connection, wallet, {
				commitment: "confirmed",
			})
			// TODO: Enable this once we figure out what the issue is with the hardcoded IDL
			// const idl = useFetchIDL
			//   ? await Program.fetchIdl(POCKETS_PROGRAM_PROGRAMID, provider)
			//   : pocketsIDL;
			const idl = await Program.fetchIdl(POCKETS_PROGRAM_PROGRAMID, provider)

			return new Program(idl!, POCKETS_PROGRAM_PROGRAMID, provider)
		} catch (err) {
			return null
		}
	}, [connection, wallet])
}
