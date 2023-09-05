import { PageTabs } from "@/components/nav"
import { useFaction } from "@/hooks/useFaction"
import { Character } from "@/types/server"
import { useDisclosure } from "@chakra-ui/react"
import { FactionTabPolitics } from "./politics-tab"
import { CitizenModal } from "./politics-tab/citizens-modal.component"
import { FactionTabResources } from "./resources-tab"
import { FactionTabServices } from "./services-tab"
import { useEffect } from "react"
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter"
import { useRouter } from "next/router"

export const FactionTabs: React.FC<{
	setFactionStatus: (value: boolean) => void
}> = ({ setFactionStatus }) => {
	const router = useRouter()
	const mintFromURL = router.query.mint as string | undefined
	const [currentCharacter] = useSelectedCharacter(mintFromURL!)

	useEffect(() => {
		console.log("sc: ", mintFromURL)
	}, [mintFromURL])

	const citizenDisclosure = useDisclosure()
	const factionId = currentCharacter?.faction?.id ?? ""
	const { data: factionData } = useFaction({ factionId })

	useEffect(() => {
		setFactionStatus(!!currentCharacter?.faction)
	}, [currentCharacter?.faction, setFactionStatus])

	return (
		<>
			{factionData?.citizens && (
				<CitizenModal
					{...citizenDisclosure}
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
							currentCharacter: currentCharacter,
							setFactionStatus: setFactionStatus,
						},
					},
					{
						tabName: "Services",
						Component: FactionTabServices,
						componentProps: {
							currentCharacter: currentCharacter,
							openCitizenModal: citizenDisclosure.onOpen,
						},
					},
					{
						tabName: "Politics",
						Component: FactionTabPolitics,
						componentProps: {
							currentCharacter: currentCharacter,
							setFactionStatus: setFactionStatus,
							openCitizenModal: citizenDisclosure.onOpen,
						},
					},
				]}
			/>
		</>
	)
}
