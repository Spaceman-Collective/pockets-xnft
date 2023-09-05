import { Tip } from "@/components/tooltip"
import { RESOURCES, RESOURCE_XP_GAIN, UNIT_TEMPLATES } from "@/types/server"
import { useResourceConsume } from "@/hooks/useResource"
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter"
import { useSolana } from "@/hooks/useSolana"
import { getLocalImage } from "@/lib/utils"
import { Flex, Image, Spinner, Text, VStack } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { FC } from "react"
import { toast } from "react-hot-toast"
import { ConsumeButton } from "./consume-button.component"

export const ConsumeItemContainer: FC<{
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
			mutate(encodedTx, {
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
			})
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
