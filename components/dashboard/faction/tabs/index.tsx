import { PageTabs } from "@/components/nav"
import { useFaction } from "@/hooks/useFaction"
import { Character } from "@/types/server"
import { useDisclosure } from "@chakra-ui/react"
import { FactionTabPolitics } from "./politics-tab"
import { CitizenModal } from "./politics-tab/citizens-modal.component"
import { FactionTabResources } from "./resources-tab"
import { FactionTabServices } from "./services-tab"
import { useContext, useEffect } from "react"
import { MainContext } from "@/contexts/MainContext"

export const FactionTabs: React.FC<{
	setFactionStatus: (value: boolean) => void
}> = ({ setFactionStatus }) => {
	const citizenDisclosure = useDisclosure()
	const { selectedCharacter } = useContext(MainContext)
	const factionId = selectedCharacter?.faction?.id ?? ""
	const { data: factionData } = useFaction({ factionId })

	useEffect(() => {
		setFactionStatus(!!selectedCharacter?.faction)
	}, [selectedCharacter?.faction, setFactionStatus])

	return (
		<>
			{factionData?.citizens && (
				<CitizenModal
					{...citizenDisclosure}
					selectedCharacter={selectedCharacter!}
					citizens={factionData.citizens}
					setFactionStatus={setFactionStatus}
				/>
			)}
			<PageTabs
				tabItems={[
					{
						tabName: "Resources",
						Component: FactionTabResources,
						componentProps: {
							currentCharacter: selectedCharacter,
							setFactionStatus: setFactionStatus,
						},
					},
					{
						tabName: "Services",
						Component: FactionTabServices,
						componentProps: {
							currentCharacter: selectedCharacter,
							openCitizenModal: citizenDisclosure.onOpen,
						},
					},
					{
						tabName: "Politics",
						Component: FactionTabPolitics,
						componentProps: {
							currentCharacter: selectedCharacter,
							setFactionStatus: setFactionStatus,
							openCitizenModal: citizenDisclosure.onOpen,
						},
					},
				]}
			/>
		</>
	)
}
