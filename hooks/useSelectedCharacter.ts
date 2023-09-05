import { Character } from "@/types/server"
import { useCallback, useEffect, useState } from "react"

const storedCharKey = "SELECTEDCHARACTER"

export const useSelectedCharacter = (): [
	Character | null | undefined,
	(char?: Character | null) => void,
] => {
	const [selectedCharacter, setSelectedCharacter] = useState<
		Character | null | undefined
	>(null)

	const setSelectedChar = useCallback((character?: Character | null) => {
		if (character) {
			localStorage.setItem(storedCharKey, JSON.stringify(character))
		} else {
			localStorage.removeItem(storedCharKey)
		}

		setSelectedCharacter(character)
	}, [])

	useEffect(() => {
		const char = localStorage.getItem(storedCharKey)
		if (char) {
			setSelectedCharacter(JSON.parse(char))
		}
	}, [])

	return [selectedCharacter, setSelectedChar]
}
