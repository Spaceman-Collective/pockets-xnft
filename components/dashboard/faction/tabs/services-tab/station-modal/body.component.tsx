import { Tip } from "@/components/tooltip"
import { getLocalImage, timeAgo } from "@/lib/utils"
import { getBlueprint } from "@/types/server"
import {
	Grid,
	Text,
	Flex,
	Box,
	Image,
	Progress,
	VStack,
	Button,
	Spinner,
} from "@chakra-ui/react"
import { FC, useState } from "react"
import { GiStopwatch } from "react-icons/gi"
import { SpeedUpPopover } from "../../../speed-up.component"

export const StationModalBody: FC<{
	blueprint: string
	progress: number
	resourcesInWallet?: { value: string; name: string }[]
	isFuture: boolean
	isClaimable: boolean
	claimIsLoading: boolean
	timer?: any
	startBuild: () => Promise<void>
	claimReward: () => Promise<string | undefined>
	speedUp: () => Promise<void>
	speedUpIsLoading: boolean
	count: number
	input: number
	setInput: (e: number) => void
}> = ({
	blueprint,
	progress,
	resourcesInWallet,
	isClaimable,
	claimIsLoading,
	speedUpIsLoading,
	timer,
	startBuild,
	claimReward,
	speedUp,
	count,
	input,
	setInput,
}) => {
	const station = getBlueprint(blueprint)
	const output = !!station?.unitOutput
		? station.unitOutput[0]
		: station?.resourceOutput?.[0]
	const outputImg = getLocalImage({
		type: !!station?.unitOutput ? "units" : "resources",
		name: output ?? "",
	})

	return (
		<Flex minH="400px" alignItems="center" justifyContent="center" my="3rem">
			<Flex
				w="35rem"
				minH="30rem"
				bg="blacks.700"
				borderRadius="0.5rem"
				justifyContent="space-between"
				direction="column"
				gap="1rem"
			>
				<VStack gap="1rem">
					<Box bg="brand.quaternary" w="23rem" p="1rem" borderRadius="0 0 1rem 1rem">
						<Text
							fontSize="1.25rem"
							fontWeight={700}
							letterSpacing="1px"
							textTransform="uppercase"
							textAlign="center"
							pb="1rem"
						>
							Resources Required
						</Text>
						<Flex gap="1rem" alignItems="start">
							{station?.inputs.map((e) => (
								<ItemImg
									key={e.amount + e.resource + "input"}
									name={e.resource}
									amount={e.amount}
									inWallet={
										resourcesInWallet?.find((item) => item.name === e.resource)?.value
									}
								/>
							))}
						</Flex>
					</Box>
					{!timer && (
						<Button onClick={startBuild} minW="23rem" bg="brand.primary">
							Build {output}
						</Button>
					)}
					<Image
						src={outputImg}
						alt={"output" + output}
						boxSize="23rem"
						borderRadius="1rem"
					/>
					{isClaimable && (
						<Button onClick={claimReward} minW="23rem" bg="brand.primary">
							{claimIsLoading && <Spinner />}
							Claim {output}
						</Button>
					)}
				</VStack>
				{!!timer && !isClaimable && (
					<Flex justifyContent="end" pr="1rem" alignItems="center" gap="1rem">
						<Text>{timeAgo(count)}</Text>
						<SpeedUpPopover
							input={input}
							setInput={setInput}
							count={count}
							speedUpWithBonk={speedUp}
						>
							<Button bg="brand.primary">
								{speedUpIsLoading && <Spinner />}
								{!speedUpIsLoading && <GiStopwatch style={{ fontSize: "2rem" }} />}
							</Button>
						</SpeedUpPopover>
					</Flex>
				)}
				<Progress
					opacity={progress === 0 ? 0.25 : 1}
					colorScheme={progress !== 100 ? "blue" : "green"}
					value={progress}
					w="100%"
					minH="2rem"
					borderRadius="0 0 1rem 1rem"
				/>
			</Flex>
		</Flex>
	)
}

const ItemImg: FC<{
	isUnit?: boolean
	name: string
	amount: number
	inWallet?: string
}> = ({ isUnit, name, amount, inWallet }) => {
	const img = getLocalImage({ type: isUnit ? "units" : "resources", name: name })
	const hasEnough = inWallet ? +amount <= +inWallet : false
	return (
		<Tip label={`Requires ${amount}x ${name}`}>
			<Box position="relative" opacity={hasEnough ? 1 : 0.25}>
				<Text
					fontSize="1rem"
					fontWeight={700}
					color="brand.primary"
					letterSpacing="1px"
				>
					{inWallet}x
				</Text>
				<Image src={img} alt={"item" + name} boxSize="5rem" borderRadius="0.5rem" />
				<Box
					position="absolute"
					bottom="-2px"
					right="-2px"
					bg="brand.primary"
					px="0.5rem"
					borderRadius="0.25rem"
				>
					<Text fontSize="1.25rem" fontWeight={700}>
						{amount}
					</Text>
				</Box>
			</Box>
		</Tip>
	)
}
