// Import other components where needed, for example:
import React from "react"
import toast from "react-hot-toast"

import { PanelContainer } from "@/components/layout"
import { useSolana } from "@/hooks/useSolana"
import { useUnitDequip } from "@/hooks/useUnit"
import { useAllWalletAssets } from "@/hooks/useWalletAssets"
import { COMBAT_SKILLS, Character } from "@/types/server"
import { Text } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"

import { CharacterEquipment } from "./CharacterEquipment"
import { Header } from "./Header"
import { UnitsList } from "./UnitsList"

export const EquipmentTab: React.FC<{ currentCharacter: Character }> = ({
	currentCharacter,
}) => {
	const queryClient = useQueryClient()

	const [loadingUnitDequip, setLoadingUnitDequip] =
		React.useState<boolean>(false)
	const [selectedSkill, setSelectedSkill] = React.useState<string>("")

	const { mutate: dequipUnit } = useUnitDequip()

	const { data: walletAssets, isLoading: walletAssetsIsLoading } =
		useAllWalletAssets()

	const {
		signTransaction,
		walletAddress,
		buildMemoIx,
		encodeTransaction,
		connection,
	} = useSolana()

	const handleDequipUnit = async (assetId: string) => {
		const payload = { mint: currentCharacter.mint, assetId }

		const txInstructions = [
			buildMemoIx({ walletAddress: walletAddress || "", payload }),
		]

		let encodedTx
		try {
			encodedTx = await encodeTransaction({
				walletAddress,
				connection,
				signTransaction,
				txInstructions,
			})
		} catch (e) {
			encodedTx = ""
			toast.error(JSON.stringify(e))
		}

		if (!encodedTx || typeof encodedTx !== "string") {
			return toast.error("no encoded tx")
		}

		dequipUnit(encodedTx, {
			onSuccess: async () => {
				queryClient.refetchQueries({
					queryKey: ["wallet-assets", walletAddress],
				})
				toast.success("Unit dequipped")
			},
			onError: (e) => toast.error(JSON.stringify(e)),
		})
	}

	const combatSkillLevels = COMBAT_SKILLS.map((skill) => ({
		skill,
		level:
			currentCharacter.skills[skill.charAt(0).toUpperCase() + skill.slice(1)],
	}))

	return (
		<PanelContainer display="flex" flexDirection="column" gap="2rem" width="100%">
			<Header title="Current Loadout" />
			<Text>
				For each level in a given skill you can equip that many linked units.
			</Text>
			<CharacterEquipment
				character={currentCharacter}
				handleDequipUnit={handleDequipUnit}
				combatSkillLevels={combatSkillLevels}
				selectedSkill={selectedSkill}
				loadingUnitDequip={loadingUnitDequip}
				setLoadingUnitDequip={setLoadingUnitDequip}
			/>
			<Header title="Available Units" />
			<UnitsList
				character={currentCharacter}
				units={walletAssets?.units || []}
				combatSkillLevels={combatSkillLevels}
				selectedSkill={selectedSkill}
				setSelectedSkill={setSelectedSkill}
			/>
		</PanelContainer>
	)
}
