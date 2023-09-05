import { createContext, useContext } from "react"
import { Character } from "@/types/server"
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter"

type CharacterContextType = {
	selectedCharacter: Character | null
	setSelectedCharacter: (char?: Character | null) => void
}

const CharacterContext = createContext<CharacterContextType | undefined>(
	undefined,
)

export const useCharacterContext = () => {
	const context = useContext(CharacterContext)
	if (!context) {
		throw new Error("useCharacterContext must be used within a CharacterProvider")
	}
	return context
}

interface CharacterProviderProps {
	children: React.ReactNode
}

export const CharacterProvider: React.FC<CharacterProviderProps> = ({
	children,
}) => {
	const [selectedCharacter, setSelectedCharacter] = useSelectedCharacter()

	return (
		<CharacterContext.Provider
			value={{ selectedCharacter, setSelectedCharacter }}
		>
			{children}
		</CharacterContext.Provider>
	)
}
