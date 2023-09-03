import { Character } from "@/types/server"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { useAssets } from "./useCharacters"

export const useSelectedCharacter = (): [
	Character | null | undefined,
	(char?: Character | null) => void,
] => {
	const { data: assets } = useAssets()
	const router = useRouter()

	const [selectedCharacter, setSelectedCharacter] = useState<
		Character | null | undefined
	>(null)

	const setSelectedChar = useCallback(
		(character?: Character | null) => {
			if (character) {
				router.push({
					query: {
						char: character.mint,
					},
				})
			} else {
				const charMint = router.query?.char
				if (!charMint || charMint === undefined) return
				const existingQuery = router.query
				const { char, ...rest } = existingQuery
				router.push({
					query: { ...rest },
				})
			}

			setSelectedCharacter(character)
		},
		[router],
	)

	useEffect(() => {
		const charMint = router.query?.char
		if (!assets || assets === undefined) return
		if (!charMint || charMint === undefined) return
		if (!assets?.characters || assets?.characters === undefined) return
		const char = assets.characters.find((e) => e.mint === charMint)

		if (char) {
			setSelectedCharacter(char)
		}
	}, [assets, router.query?.char])

	return [selectedCharacter, setSelectedChar]
}
