import { Character } from "@/types/server"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export const useSelectedCharacter = (): [
	Character | null,
	(char?: Character | null) => void,
] => {
	const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
		null,
	)
	const router = useRouter()

	const setSelectedChar = (character?: Character | null) => {
		if (character) {
			router.push({
				pathname: router.pathname,
				query: { ...router.query, mint: character.mint },
			})
		} else {
			const { mint, ...rest } = router.query
			router.push({
				pathname: router.pathname,
				query: rest,
			})
		}
	}

	useEffect(() => {
		const { mint } = router.query
		if (mint && typeof mint === "string") {
			// setSelectedCharacter({ char }) // Minimal data
		} else {
			setSelectedCharacter(null)
		}
	}, [router.query])

	return [selectedCharacter, setSelectedChar]
}
