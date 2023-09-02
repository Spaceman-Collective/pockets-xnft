import {
	RESOURCES,
	UNIT_TEMPLATES,
	XP_PER_RANK,
	buildUnitFromNFT,
} from "@/types/server"
import { useAllWalletAssets } from "@/hooks/useWalletAssets"
import {
	Box,
	Flex,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	Text,
} from "@chakra-ui/react"
import { FC } from "react"
import { combatSkillKeys } from "../constants"
import { ConsumeItemContainer } from "./consume-resource.component"
import { ConsumeUnitContainer } from "./consume-unit.component"

export const ConsumeSkillModal: FC<{
	isOpen: boolean
	onClose: () => void
	skill: string
}> = ({ isOpen, onClose, skill }) => {
	const isCombat = combatSkillKeys.includes(skill.toLowerCase())
	const relevantResources = getRelevantResources(skill)
	const relevantUnit = getRelevantUnit(skill)

	const {
		data: walletAssets,
		isLoading: walletAssetsIsLoading,
		isFetching,
	} = useAllWalletAssets()

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				mt="20rem"
				bg="brand.primary"
				color="brand.secondary"
				p="1rem"
				minW="500px"
			>
				<ModalBody>
					<Text fontSize="4rem" textTransform="uppercase" fontWeight={700}>
						{skill}
					</Text>
					<Box fontFamily="header" mb="2rem">
						{isCombat ? (
							<Text>
								Upgrade your <strong>{skill}</strong> by consuming{" "}
								<strong>{relevantUnit?.name + "s"}</strong>.<br /> Each unit gives{" "}
								<span>{XP_PER_RANK}xp * level</span> of the unit. Consuming a unit burns
								it.
							</Text>
						) : (
							<Text>
								Upgrade your <strong>{skill}</strong> by consuming resources. The more
								rare the resource, the more XP it will yield. Consuming the resource
								burns it.
							</Text>
						)}
					</Box>
					<Flex direction="column" gap="1rem" p="1rem" w="100%">
						{relevantUnit && (
							<ConsumeUnitContainer
								unit={relevantUnit}
								unitsInWallet={walletAssets?.units
									.filter((asset) => asset.name === relevantUnit.name)
									.sort((a, b) => +b.attributes.Rank - +a.attributes.Rank)
									.map((unit) => {
										const parsedUnit = buildUnitFromNFT(unit)
										return {
											...parsedUnit,
											rank: unit.attributes.Rank ?? "0",
											mint: unit.mint,
										}
									})}
							/>
						)}
						{relevantResources.map((resource) => (
							<ConsumeItemContainer
								key={resource.mint}
								skill={skill}
								isLoading={walletAssetsIsLoading || isFetching}
								resource={resource}
								resourceInWallet={walletAssets?.resources.find(
									(asset) => asset.name === resource.name,
								)}
							/>
						))}
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}
const getRelevantResources = (skill: string) => {
	const isCombat = combatSkillKeys.includes(skill.toLowerCase())
	if (isCombat) return []
	return RESOURCES.filter((resource) => {
		const resourceSkills = resource.skills.map((sk) => sk.toLowerCase())
		return resourceSkills.includes(skill)
	})
}

const getRelevantUnit = (skill: string) => {
	const isCombat = combatSkillKeys.includes(skill.toLowerCase())
	if (!isCombat) return undefined
	return UNIT_TEMPLATES.find((unit) => {
		return unit.skill.toLowerCase() === skill.toLowerCase()
	})
}
