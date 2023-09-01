import { Tip } from "@/components/tooltip"

import { RESOURCES, RESOURCE_XP_GAIN, UNIT_TEMPLATES } from "@/types/server"
import { useResourceConsume } from "@/hooks/useResource"
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter"
import { useSolana } from "@/hooks/useSolana"
import { useAllWalletAssets } from "@/hooks/useWalletAssets"
import { getLocalImage } from "@/lib/utils"
import {
	Flex,
	Image,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	Spinner,
	Text,
	VStack,
} from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { FC } from "react"
import { toast } from "react-hot-toast"
import { combatSkillKeys } from "../constants"
import { ConsumeButton } from "./consume-button.component"

export const ConsumeSkillModal: FC<{
	isOpen: boolean
	onClose: () => void
	skill: string
}> = ({ isOpen, onClose, skill }) => {
	const relevantResources = getRelevantResources(skill)
	const relevantUnit = getRelevantUnit(skill)
	console.log({ relevantResources, relevantUnit })

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
					<Text fontFamily="header" mb="2rem">
						Upgrade your {skill} by consuming resources. The more rare the resource,
						the more XP it will yield. Consuming the resource burns it.
					</Text>
					<Flex direction="column" gap="1rem" p="1rem" w="100%">
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

const ConsumeItemContainer: FC<{
	isLoading?: boolean
	resourceInWallet?: any // items in the wallet
	skill: string // selected modal
	resource: {
		mint: string
		name: string
		tier: string
		skills: string[]
	}
}> = ({ resource, resourceInWallet, isLoading, skill }) => {
	const extraSkillUp = resource.skills.filter(
		(e) => e.toLowerCase() !== skill.toLowerCase(),
	)

	const queryClient = useQueryClient()

	const {
		buildMemoIx,
		buildBurnIx,
		walletAddress,
		connection,
		encodeTransaction,
		signTransaction,
	} = useSolana()
	const [selectedCharacter] = useSelectedCharacter()

	const { mutate } = useResourceConsume()
	const postConsume = async (amountToConsume: number) => {
		const memoIx = buildMemoIx({
			walletAddress: walletAddress as string,
			payload: {
				mint: selectedCharacter?.mint,
				timestamp: Date.now().toString(),
				resource: resource.name,
				amount: amountToConsume,
			},
		})

		const burnIx = buildBurnIx({
			walletAddress: walletAddress as string,
			mint: RESOURCES.find((r) => r.name == resource.name)?.mint as string,
			amount: BigInt(amountToConsume),
			decimals: 0,
		})

		if (!burnIx) {
			toast.error("failed to build burn ix")
			return
		}
		try {
			const encodedTx = await encodeTransaction({
				walletAddress: walletAddress as string,
				connection,
				signTransaction,
				txInstructions: [memoIx, burnIx],
			})

			if (!encodedTx || encodedTx instanceof Error)
				return toast.error("Oops! Failed to consume resource")
			mutate(
				{ signedTx: encodedTx },
				{
					onSuccess: (_) => {
						queryClient.refetchQueries({
							queryKey: ["wallet-assets", walletAddress],
						})
						queryClient.refetchQueries({
							queryKey: ["assets"],
						})
						const xpGained =
							//@ts-ignore
							RESOURCE_XP_GAIN?.[resource.tier] * amountToConsume
						toast.success(
							`Successfully consumed\n${amountToConsume}x ${resource.name}\nGained ${xpGained}xp`,
							{
								duration: 5000,
							},
						)
					},
					onError: (e) =>
						toast.error("Oops! Failed to consume: " + JSON.stringify(e)),
				},
			)
		} catch (err) {
			toast.error("Oops! Failed to consume resource: " + err)
		}
	}

	return (
		<Flex
			key={resource.mint}
			gap="1rem"
			justifyContent="space-between"
			alignItems="center"
		>
			<Image
				w="10rem"
				borderRadius="1rem"
				alt={resource.name}
				src={getLocalImage({
					type: "resources",
					name: resource.name,
				})}
			/>
			<VStack alignItems="start" justifyContent="start" flexGrow={1}>
				<Text
					textTransform="uppercase"
					fontWeight={700}
					fontSize="2rem"
					letterSpacing="1px"
				>
					{resource.name}
				</Text>
				<Text fontSize="1.25rem" letterSpacing="0.5px">
					{
						//@ts-ignore
						RESOURCE_XP_GAIN?.[resource.tier]
					}
					xp ({resource.tier})
				</Text>
				{extraSkillUp.length > 0 && (
					<Tip
						label={
							"Comsuming will simulatneously gain xp in " + extraSkillUp.join(" ")
						}
					>
						<Text
							textTransform="uppercase"
							letterSpacing="1px"
							fontSize="1.25rem"
							bg="blacks.700"
							p="0.5rem 1rem"
							borderRadius="1rem"
						>
							+{extraSkillUp}
						</Text>
					</Tip>
				)}
			</VStack>
			<VStack
				flexGrow={1}
				alignItems="end"
				opacity={resourceInWallet?.value !== "0" ? 1 : 0.25}
			>
				<Flex
					fontSize="1.25rem"
					bg="blacks.700"
					borderRadius="1rem"
					gap="0.5rem"
					alignItems="center"
				>
					<Text
						fontSize="1.5rem"
						fontWeight={700}
						letterSpacing="1px"
						borderRadius="1rem 0 0 1rem"
						bg="blacks.600"
						py="0.5rem"
						px="0.75rem"
					>
						{isLoading && <Spinner mb="-2px" />}
						{!isLoading && resourceInWallet?.value + "x"}
					</Text>
					<Text textTransform="uppercase" letterSpacing="1px" pr="0.5rem">
						Balance
					</Text>
				</Flex>
				<ConsumeButton
					onClick={postConsume}
					isDisabled={resourceInWallet?.value === "0"}
					maxValue={+resourceInWallet?.value}
				/>
			</VStack>
		</Flex>
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
	if (!isCombat) return []
	UNIT_TEMPLATES.filter((unit) => {
		console.table({ unitSkill: unit.skill, skill })
		return unit.skill.toLowerCase() === skill.toLowerCase()
	})
}
